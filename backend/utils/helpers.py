"""
Utility functions for data processing and validation
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Any
from pathlib import Path


def validate_features(features: Dict[str, float], required_features: List[str]) -> bool:
    """
    Validate that all required features are present
    
    Args:
        features: Dictionary of feature values
        required_features: List of required feature names
        
    Returns:
        True if valid, False otherwise
    """
    return all(feature in features for feature in required_features)


def load_sample_dataset() -> pd.DataFrame:
    """
    Load a sample NASA exoplanet dataset
    This can be used for testing if no dataset is uploaded
    
    Returns:
        Sample DataFrame
    """
    # Create sample data based on Kepler dataset structure
    sample_data = {
        'koi_disposition': ['CONFIRMED', 'FALSE POSITIVE', 'CANDIDATE'] * 100,
        'koi_period': np.random.uniform(0.5, 500, 300),
        'koi_duration': np.random.uniform(1, 10, 300),
        'koi_depth': np.random.uniform(100, 10000, 300),
        'koi_prad': np.random.uniform(0.5, 20, 300),
        'koi_teq': np.random.uniform(200, 2000, 300),
        'koi_insol': np.random.uniform(0.1, 100, 300),
        'koi_steff': np.random.uniform(3000, 7000, 300),
        'koi_slogg': np.random.uniform(3.5, 5.0, 300),
        'koi_srad': np.random.uniform(0.5, 2.5, 300),
        'koi_smass': np.random.uniform(0.5, 2.0, 300),
        'koi_impact': np.random.uniform(0, 1, 300),
        'koi_model_snr': np.random.uniform(5, 100, 300),
    }
    
    return pd.DataFrame(sample_data)


def create_sample_dataset_file(output_path: str = "./data/nasa_exoplanets.csv"):
    """
    Create a sample dataset file for testing
    
    Args:
        output_path: Path where to save the CSV file
    """
    df = load_sample_dataset()
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"✅ Sample dataset created at {output_path}")


def format_prediction_response(prediction: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format prediction response for frontend
    
    Args:
        prediction: Raw prediction dictionary
        
    Returns:
        Formatted response
    """
    return {
        "status": "success",
        "data": {
            "prediction": prediction['prediction_label'],
            "confidence": round(prediction['confidence'] * 100, 2),
            "probabilities": {
                k: round(v * 100, 2) 
                for k, v in prediction['probabilities'].items()
            }
        }
    }


def calculate_feature_importance(model, feature_names: List[str]) -> Dict[str, float]:
    """
    Calculate feature importance for tree-based models
    
    Args:
        model: Trained model
        feature_names: List of feature names
        
    Returns:
        Dictionary mapping feature names to importance scores
    """
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        return dict(zip(feature_names, importances.tolist()))
    return {}


if __name__ == "__main__":
    # Create sample dataset for testing
    create_sample_dataset_file()
