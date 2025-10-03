"""
CONTROLLER LAYER - API Endpoints
Handles HTTP requests and connects Views to Models
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import pandas as pd
import io
from pathlib import Path

from models.exoplanet_model import ExoplanetModel

router = APIRouter(prefix="/api", tags=["exoplanet"])

# Global model instance
model = ExoplanetModel()
model_trained = False


# Pydantic schemas for request/response validation
class PredictionInput(BaseModel):
    koi_period: float
    koi_duration: float
    koi_depth: float
    koi_prad: float
    koi_teq: Optional[float] = 0
    koi_insol: Optional[float] = 0
    koi_steff: Optional[float] = 0
    koi_slogg: Optional[float] = 0
    koi_srad: Optional[float] = 0
    koi_smass: Optional[float] = 0
    koi_impact: Optional[float] = 0
    koi_model_snr: Optional[float] = 0


class TrainingConfig(BaseModel):
    model_type: str = "random_forest"
    test_size: float = 0.2
    n_estimators: Optional[int] = 100
    max_depth: Optional[int] = 20
    learning_rate: Optional[float] = 0.1


class PredictionResponse(BaseModel):
    prediction: int
    prediction_label: str
    confidence: float
    probabilities: Dict[str, float]


class MetricsResponse(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]
    model_type: str


@router.post("/train", response_model=MetricsResponse)
async def train_model(config: TrainingConfig):
    """
    Train the exoplanet classification model
    
    Args:
        config: Training configuration including model type and hyperparameters
        
    Returns:
        Training metrics
    """
    global model, model_trained
    
    try:
        # Load dataset
        dataset_path = Path("./data/nasa_exoplanets.csv")
        if not dataset_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Dataset not found. Please upload a dataset first."
            )
        
        df = pd.read_csv(dataset_path)
        
        # Initialize model with specified type
        model = ExoplanetModel(model_type=config.model_type)
        
        # Update hyperparameters if provided
        params = {}
        if config.n_estimators:
            params['n_estimators'] = config.n_estimators
        if config.max_depth:
            params['max_depth'] = config.max_depth
        if config.learning_rate and config.model_type in ['xgboost', 'gradient_boost']:
            params['learning_rate'] = config.learning_rate
        
        if params:
            model.update_hyperparameters(params)
        
        # Preprocess data
        X, y = model.preprocess_data(df)
        
        # Train model
        metrics = model.train(X, y, test_size=config.test_size)
        
        # Save model
        model.save_model()
        
        model_trained = True
        
        return MetricsResponse(
            accuracy=metrics['accuracy'],
            precision=metrics['precision'],
            recall=metrics['recall'],
            f1_score=metrics['f1_score'],
            confusion_matrix=metrics['confusion_matrix'],
            model_type=metrics['model_type']
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict", response_model=PredictionResponse)
async def predict_single(input_data: PredictionInput):
    """
    Make prediction for a single exoplanet
    
    Args:
        input_data: Exoplanet features
        
    Returns:
        Prediction result with probabilities
    """
    global model, model_trained
    
    try:
        # Load model if not trained
        if not model_trained:
            model.load_model()
            model_trained = True
        
        # Convert input to dictionary
        features = input_data.model_dump()
        
        # Make prediction
        result = model.predict(features)
        
        return PredictionResponse(
            prediction=result['prediction'],
            prediction_label=result['prediction_label'],
            confidence=result['confidence'],
            probabilities=result['probabilities']
        )
    
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Model not found. Please train the model first."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict-batch")
async def predict_batch(file: UploadFile = File(...)):
    """
    Make predictions for multiple exoplanets from CSV file
    
    Args:
        file: CSV file with exoplanet features
        
    Returns:
        List of predictions
    """
    global model, model_trained
    
    try:
        # Load model if not trained
        if not model_trained:
            model.load_model()
            model_trained = True
        
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Make predictions
        results = model.predict_batch(df)
        
        return {
            "predictions": results,
            "total_count": len(results)
        }
    
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Model not found. Please train the model first."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload NASA exoplanet dataset (CSV)
    
    Args:
        file: CSV file containing NASA exoplanet data
        
    Returns:
        Dataset statistics
    """
    try:
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported"
            )
        
        # Read and validate CSV
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Check for required columns
        required_cols = ['koi_period', 'koi_duration', 'koi_depth', 'koi_prad']
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_cols)}"
            )
        
        # Save dataset
        save_path = Path("./data/nasa_exoplanets.csv")
        save_path.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(save_path, index=False)
        
        # Return statistics
        stats = {
            "filename": file.filename,
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": df.columns.tolist(),
            "sample_data": df.head(5).to_dict(orient='records'),
            "missing_values": df.isnull().sum().to_dict()
        }
        
        return stats
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/metrics")
async def get_metrics():
    """
    Get current model metrics
    
    Returns:
        Model performance metrics
    """
    global model, model_trained
    
    try:
        if not model_trained:
            model.load_model()
            model_trained = True
        
        # Return stored metrics
        metrics_path = Path("./models/metrics.json")
        if metrics_path.exists():
            import json
            with open(metrics_path, 'r') as f:
                metrics = json.load(f)
            return metrics
        else:
            raise HTTPException(
                status_code=404,
                detail="No metrics available. Train the model first."
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dataset-info")
async def get_dataset_info():
    """
    Get information about the current dataset
    
    Returns:
        Dataset statistics and sample data
    """
    try:
        dataset_path = Path("./data/nasa_exoplanets.csv")
        if not dataset_path.exists():
            raise HTTPException(
                status_code=404,
                detail="No dataset found. Please upload a dataset first."
            )
        
        df = pd.read_csv(dataset_path)
        
        # Calculate statistics
        stats = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": df.columns.tolist(),
            "missing_values": df.isnull().sum().to_dict(),
            "data_types": df.dtypes.astype(str).to_dict(),
            "sample_data": df.head(10).to_dict(orient='records')
        }
        
        # Add distribution info if disposition column exists
        for col in ['koi_disposition', 'disposition', 'exoplanet_status']:
            if col in df.columns:
                stats['class_distribution'] = df[col].value_counts().to_dict()
                break
        
        return stats
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/model-info")
async def get_model_info():
    """
    Get information about the current model
    
    Returns:
        Model configuration and metadata
    """
    global model, model_trained
    
    try:
        if not model_trained:
            model.load_model()
            model_trained = True
        
        return {
            "model_type": model.model_type,
            "feature_names": model.feature_names,
            "label_mapping": model.label_mapping,
            "n_features": len(model.feature_names),
            "is_trained": model_trained
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_trained": model_trained,
        "version": "1.0.0"
    }
