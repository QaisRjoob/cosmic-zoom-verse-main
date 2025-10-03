"""
Main FastAPI Application
Connects all MVC components
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import uvicorn

from controllers.exoplanet_controller import router as exoplanet_router

# Initialize FastAPI app
app = FastAPI(
    title="NASA Exoplanet Detection API",
    description="AI/ML API for detecting and classifying exoplanets using NASA data",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:3000",
        "*"  # Allow all origins in development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(exoplanet_router)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "NASA Exoplanet Detection API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/api/health"
    }


@app.get("/api")
async def api_info():
    """API information endpoint"""
    return {
        "api_name": "NASA Exoplanet Detection API",
        "version": "1.0.0",
        "endpoints": {
            "train": "POST /api/train",
            "predict": "POST /api/predict",
            "predict_batch": "POST /api/predict-batch",
            "upload_dataset": "POST /api/upload-dataset",
            "metrics": "GET /api/metrics",
            "dataset_info": "GET /api/dataset-info",
            "model_info": "GET /api/model-info",
            "health": "GET /api/health"
        }
    }


if __name__ == "__main__":
    # Create necessary directories
    Path("./models").mkdir(exist_ok=True)
    Path("./data").mkdir(exist_ok=True)
    
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
