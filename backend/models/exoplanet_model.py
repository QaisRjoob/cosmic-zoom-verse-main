"""
MODEL LAYER - Exoplanet Classification Model
Handles data preprocessing, feature engineering, and ML model training
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import xgboost as xgb
import joblib
import json
from typing import Dict, Tuple, List, Any
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')


class ExoplanetModel:
    """
    Main Model class for Exoplanet Detection
    Follows MVC pattern - this is the MODEL layer
    """
    
    def __init__(self, model_type: str = "random_forest"):
        """
        Initialize the exoplanet detection model
        
        Args:
            model_type: Type of ML model (random_forest, xgboost, svm, gradient_boost)
        """
        self.model_type = model_type
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = []
        self.label_mapping = {
            0: "False Positive",
            1: "Candidate", 
            2: "Confirmed"
        }
        
        # Initialize model based on type
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize the ML model based on type"""
        models = {
            "random_forest": RandomForestClassifier(
                n_estimators=100,
                max_depth=20,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ),
            "xgboost": xgb.XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42,
                n_jobs=-1
            ),
            "svm": SVC(
                kernel='rbf',
                C=1.0,
                gamma='scale',
                probability=True,
                random_state=42
            ),
            "gradient_boost": GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=5,
                random_state=42
            )
        }
        
        self.model = models.get(self.model_type, models["random_forest"])
    
    def preprocess_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Preprocess the NASA exoplanet dataset
        
        Args:
            df: Raw dataset DataFrame
            
        Returns:
            Tuple of (features, labels)
        """
        # Create a copy to avoid modifying original
        data = df.copy()
        
        # Map dispositions to numeric labels
        disposition_map = {
            'FALSE POSITIVE': 0,
            'CANDIDATE': 1,
            'CONFIRMED': 2
        }
        
        # Handle different column names from different datasets
        label_col = None
        for col in ['koi_disposition', 'disposition', 'exoplanet_status']:
            if col in data.columns:
                label_col = col
                break
        
        if label_col is None:
            raise ValueError("No disposition/status column found in dataset")
        
        # Create labels
        data['label'] = data[label_col].str.upper().map(disposition_map)
        
        # Remove rows with missing labels
        data = data[data['label'].notna()].copy()
        
        # Select relevant features based on available columns
        potential_features = [
            'koi_period',           # Orbital period (days)
            'koi_duration',         # Transit duration (hours)
            'koi_depth',           # Transit depth (ppm)
            'koi_prad',            # Planetary radius (Earth radii)
            'koi_teq',             # Equilibrium temperature (K)
            'koi_insol',           # Insolation flux (Earth flux)
            'koi_steff',           # Stellar effective temperature (K)
            'koi_slogg',           # Stellar surface gravity (log10(cm/s²))
            'koi_srad',            # Stellar radius (Solar radii)
            'koi_smass',           # Stellar mass (Solar masses)
            'koi_impact',          # Impact parameter
            'koi_model_snr',       # Transit signal-to-noise ratio
        ]
        
        # Use only features that exist in the dataset
        available_features = [f for f in potential_features if f in data.columns]
        
        if len(available_features) == 0:
            raise ValueError("No valid features found in dataset")
        
        # Extract features
        X = data[available_features].copy()
        y = data['label'].copy()
        
        # Handle missing values
        X = X.fillna(X.median())
        
        # Store feature names
        self.feature_names = available_features
        
        return X, y
    
    def train(self, X: pd.DataFrame, y: pd.Series, test_size: float = 0.2) -> Dict[str, Any]:
        """
        Train the exoplanet classification model
        
        Args:
            X: Feature matrix
            y: Labels
            test_size: Proportion of data to use for testing
            
        Returns:
            Dictionary containing training metrics
        """
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        print(f"Training {self.model_type} model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Make predictions
        y_pred = self.model.predict(X_test_scaled)
        y_pred_proba = self.model.predict_proba(X_test_scaled)
        
        # Calculate metrics
        metrics = {
            "accuracy": float(accuracy_score(y_test, y_pred)),
            "precision": float(precision_score(y_test, y_pred, average='weighted', zero_division=0)),
            "recall": float(recall_score(y_test, y_pred, average='weighted', zero_division=0)),
            "f1_score": float(f1_score(y_test, y_pred, average='weighted', zero_division=0)),
            "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
            "classification_report": classification_report(y_test, y_pred, 
                                                          target_names=list(self.label_mapping.values()),
                                                          zero_division=0,
                                                          output_dict=True),
            "model_type": self.model_type,
            "n_samples": len(X),
            "n_features": len(self.feature_names),
            "feature_names": self.feature_names,
            "test_size": test_size
        }
        
        print(f"✅ Training complete! Accuracy: {metrics['accuracy']:.4f}")
        
        return metrics
    
    def predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Make prediction for a single exoplanet
        
        Args:
            features: Dictionary of feature values
            
        Returns:
            Dictionary containing prediction and probabilities
        """
        if self.model is None:
            raise ValueError("Model not trained. Please train the model first.")
        
        # Create DataFrame with proper feature order
        X = pd.DataFrame([features])[self.feature_names]
        
        # Fill any missing values with 0
        X = X.fillna(0)
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Make prediction
        prediction = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]
        
        result = {
            "prediction": int(prediction),
            "prediction_label": self.label_mapping[int(prediction)],
            "confidence": float(max(probabilities)),
            "probabilities": {
                self.label_mapping[i]: float(prob) 
                for i, prob in enumerate(probabilities)
            },
            "features_used": features
        }
        
        return result
    
    def predict_batch(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Make predictions for multiple exoplanets
        
        Args:
            df: DataFrame with features
            
        Returns:
            List of prediction dictionaries
        """
        if self.model is None:
            raise ValueError("Model not trained. Please train the model first.")
        
        # Ensure all features are present
        X = df[self.feature_names].copy()
        X = X.fillna(0)
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Make predictions
        predictions = self.model.predict(X_scaled)
        probabilities = self.model.predict_proba(X_scaled)
        
        results = []
        for i, (pred, probs) in enumerate(zip(predictions, probabilities)):
            results.append({
                "index": i,
                "prediction": int(pred),
                "prediction_label": self.label_mapping[int(pred)],
                "confidence": float(max(probs)),
                "probabilities": {
                    self.label_mapping[j]: float(prob) 
                    for j, prob in enumerate(probs)
                }
            })
        
        return results
    
    def save_model(self, model_path: str = "./models/trained_model.joblib", 
                   scaler_path: str = "./models/scaler.joblib"):
        """Save trained model and scaler"""
        if self.model is None:
            raise ValueError("No model to save. Train the model first.")
        
        # Create directory if it doesn't exist
        Path(model_path).parent.mkdir(parents=True, exist_ok=True)
        
        # Save model and scaler
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, scaler_path)
        
        # Save metadata
        metadata = {
            "model_type": self.model_type,
            "feature_names": self.feature_names,
            "label_mapping": self.label_mapping
        }
        
        metadata_path = str(Path(model_path).parent / "metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"✅ Model saved to {model_path}")
    
    def load_model(self, model_path: str = "./models/trained_model.joblib",
                   scaler_path: str = "./models/scaler.joblib"):
        """Load trained model and scaler"""
        if not Path(model_path).exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        # Load model and scaler
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        
        # Load metadata
        metadata_path = str(Path(model_path).parent / "metadata.json")
        if Path(metadata_path).exists():
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            self.model_type = metadata["model_type"]
            self.feature_names = metadata["feature_names"]
            self.label_mapping = {int(k): v for k, v in metadata["label_mapping"].items()}
        
        print(f"✅ Model loaded from {model_path}")
    
    def update_hyperparameters(self, params: Dict[str, Any]):
        """Update model hyperparameters"""
        if self.model_type == "random_forest":
            self.model.set_params(**params)
        elif self.model_type == "xgboost":
            self.model.set_params(**params)
        elif self.model_type == "svm":
            self.model.set_params(**params)
        elif self.model_type == "gradient_boost":
            self.model.set_params(**params)
        
        print(f"✅ Hyperparameters updated: {params}")
