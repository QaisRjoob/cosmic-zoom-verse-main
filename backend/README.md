# NASA Exoplanet Detection - Backend API

## 🏛️ MVC Architecture

This backend follows the **Model-View-Controller** pattern:

### 📊 Model Layer (`models/`)
- `exoplanet_model.py`: Core ML model class
  - Data preprocessing and feature engineering
  - Model training (Random Forest, XGBoost, SVM, Gradient Boosting)
  - Prediction logic
  - Model persistence (save/load)

### 🎮 Controller Layer (`controllers/`)
- `exoplanet_controller.py`: API endpoints
  - `/api/train`: Train the model
  - `/api/predict`: Single prediction
  - `/api/predict-batch`: Batch predictions
  - `/api/upload-dataset`: Upload NASA dataset
  - `/api/metrics`: Get model performance
  - `/api/dataset-info`: Dataset statistics
  - `/api/model-info`: Model metadata

### 🖥️ View Layer (Frontend - React)
- Handled by the React application in `../src/`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Create Sample Dataset (Optional)

```bash
python utils/helpers.py
```

This creates a sample NASA exoplanet dataset for testing.

### 3. Start the API Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 📡 API Endpoints

### Training

**POST** `/api/train`
```json
{
  "model_type": "random_forest",
  "test_size": 0.2,
  "n_estimators": 100,
  "max_depth": 20,
  "learning_rate": 0.1
}
```

### Prediction

**POST** `/api/predict`
```json
{
  "koi_period": 10.5,
  "koi_duration": 3.2,
  "koi_depth": 500.0,
  "koi_prad": 1.5,
  "koi_teq": 300.0,
  "koi_insol": 1.0,
  "koi_steff": 5500.0,
  "koi_slogg": 4.5,
  "koi_srad": 1.0,
  "koi_smass": 1.0,
  "koi_impact": 0.5,
  "koi_model_snr": 20.0
}
```

### Dataset Upload

**POST** `/api/upload-dataset`
- Upload CSV file with NASA exoplanet data
- Accepts multipart/form-data

### Get Metrics

**GET** `/api/metrics`
- Returns model performance metrics
- Accuracy, precision, recall, F1-score, confusion matrix

### Dataset Info

**GET** `/api/dataset-info`
- Returns dataset statistics
- Column names, missing values, sample data

### Model Info

**GET** `/api/model-info`
- Returns model configuration
- Model type, features, label mapping

## 🧪 Supported ML Models

1. **Random Forest** (default)
2. **XGBoost**
3. **Support Vector Machine (SVM)**
4. **Gradient Boosting**

## 📊 NASA Dataset Requirements

The CSV dataset should include these columns:

### Required Features:
- `koi_period`: Orbital period (days)
- `koi_duration`: Transit duration (hours)
- `koi_depth`: Transit depth (ppm)
- `koi_prad`: Planetary radius (Earth radii)

### Optional Features:
- `koi_teq`: Equilibrium temperature (K)
- `koi_insol`: Insolation flux (Earth flux)
- `koi_steff`: Stellar effective temperature (K)
- `koi_slogg`: Stellar surface gravity
- `koi_srad`: Stellar radius (Solar radii)
- `koi_smass`: Stellar mass (Solar masses)
- `koi_impact`: Impact parameter
- `koi_model_snr`: Signal-to-noise ratio

### Target Column (one of):
- `koi_disposition`
- `disposition`
- `exoplanet_status`

Values: `CONFIRMED`, `CANDIDATE`, `FALSE POSITIVE`

## 🗂️ Project Structure

```
backend/
├── main.py                          # FastAPI application entry point
├── requirements.txt                 # Python dependencies
├── .env.example                     # Environment variables template
├── models/
│   ├── exoplanet_model.py          # Model layer - ML logic
│   ├── trained_model.joblib        # Saved model (after training)
│   ├── scaler.joblib               # Saved scaler
│   └── metadata.json               # Model metadata
├── controllers/
│   └── exoplanet_controller.py     # Controller layer - API routes
├── data/
│   └── nasa_exoplanets.csv         # NASA dataset (uploaded)
└── utils/
    └── helpers.py                   # Utility functions
```

## 🔧 Configuration

Copy `.env.example` to `.env` and configure:

```env
ENVIRONMENT=development
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:8080

MODEL_PATH=./models/trained_model.joblib
DATASET_PATH=./data/nasa_exoplanets.csv
DEFAULT_MODEL=random_forest
TEST_SIZE=0.2
```

## 📈 Model Performance

Expected performance on NASA Kepler dataset:
- **Accuracy**: 90-95%
- **Precision**: 88-93%
- **Recall**: 89-94%
- **F1-Score**: 89-93%

## 🧪 Testing

### Test with cURL:

```bash
# Health check
curl http://localhost:8000/api/health

# Upload dataset
curl -X POST http://localhost:8000/api/upload-dataset \
  -F "file=@path/to/nasa_data.csv"

# Train model
curl -X POST http://localhost:8000/api/train \
  -H "Content-Type: application/json" \
  -d '{"model_type": "random_forest", "test_size": 0.2}'

# Make prediction
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "koi_period": 10.5,
    "koi_duration": 3.2,
    "koi_depth": 500.0,
    "koi_prad": 1.5
  }'
```

## 📚 NASA Data Sources

- **Kepler Mission**: https://exoplanetarchive.ipac.caltech.edu/
- **K2 Mission**: https://exoplanetarchive.ipac.caltech.edu/
- **TESS Mission**: https://exoplanetarchive.ipac.caltech.edu/

## 🐛 Troubleshooting

### Model not found error
- Train the model first using `/api/train`
- Or upload a dataset using `/api/upload-dataset`

### Import errors
- Install all dependencies: `pip install -r requirements.txt`

### CORS errors
- Check `CORS_ORIGINS` in `.env`
- Ensure frontend URL is whitelisted

## 📄 License

MIT License - NASA Space Apps Challenge 2025
