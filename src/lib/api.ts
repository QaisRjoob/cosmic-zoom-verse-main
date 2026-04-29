// API Service for Backend Communication
// Centralized API calls following MVC pattern

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// KOI Feature Input Interface (from API documentation)
export interface KOIFeatures {
  koi_fpflag_nt: number;
  koi_fpflag_ss: number;
  koi_fpflag_co: number;
  koi_fpflag_ec: number;
  koi_period: number;
  koi_period_err1: number;
  koi_period_err2: number;
  koi_time0bk: number;
  koi_time0bk_err1: number;
  koi_time0bk_err2: number;
  koi_impact: number;
  koi_impact_err1: number;
  koi_impact_err2: number;
  koi_duration: number;
  koi_duration_err1: number;
  koi_duration_err2: number;
  koi_depth: number;
  koi_depth_err1: number;
  koi_depth_err2: number;
  koi_prad: number;
  koi_prad_err1: number;
  koi_prad_err2: number;
  koi_teq: number;
  koi_insol: number;
  koi_insol_err1: number;
  koi_insol_err2: number;
  koi_model_snr: number;
  koi_steff: number;
  koi_steff_err1: number;
  koi_steff_err2: number;
  koi_slogg: number;
  koi_slogg_err1: number;
  koi_slogg_err2: number;
  koi_srad: number;
  koi_srad_err1: number;
  koi_srad_err2: number;
  ra: number;
  dec: number;
  koi_kepmag: number;
}

export interface PredictionInput {
  koi_period: number;
  koi_duration: number;
  koi_depth: number;
  koi_prad: number;
  koi_teq?: number;
  koi_insol?: number;
  koi_steff?: number;
  koi_slogg?: number;
  koi_srad?: number;
  koi_smass?: number;
  koi_impact?: number;
  koi_model_snr?: number;
}

export interface PredictionResponse {
  prediction: string;
  prediction_label: string;
  confidence: number;
  probabilities: {
    [key: string]: number;
  };
  model_version: string;
  timestamp: string;
}

export interface BatchPredictionResponse {
  predictions: PredictionResponse[];
  total_count: number;
  success_count: number;
  failed_count: number;
  processing_time: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_version: string;
  model_type: string;
  timestamp: string;
}

export interface ModelInfoResponse {
  model_type: string;
  model_version: string;
  feature_count: number;
  gpu_accelerated: boolean;
  training_date: string;
  accuracy: number;
}

export interface PlanetData {
  planet_name: string;
  koi_fpflag_nt?: number;
  koi_fpflag_ss?: number;
  koi_period?: number;
  koi_prad?: number;
  koi_teq?: number;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

export interface TrainingConfig {
  model_type: 'random_forest' | 'xgboost' | 'svm' | 'gradient_boost';
  test_size: number;
  n_estimators?: number;
  max_depth?: number;
  learning_rate?: number;
}

export interface MetricsResponse {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
  model_type: string;
}

export interface DatasetInfo {
  total_rows: number;
  total_columns: number;
  columns: string[];
  missing_values: { [key: string]: number };
  class_distribution?: { [key: string]: number };
  sample_data: any[];
}

class ExoplanetAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Health check (NEW - from API docs)
  async healthCheck(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) throw new Error('API health check failed');
    return response.json();
  }

  // Single prediction (UPDATED - from API docs)
  async predict(input: Partial<KOIFeatures>): Promise<PredictionResponse> {
    const response = await fetch(`${this.baseUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Prediction failed');
    }
    
    return response.json();
  }

  // Batch prediction (UPDATED - from API docs)
  async predictBatch(features: Partial<KOIFeatures>[]): Promise<BatchPredictionResponse> {
    const response = await fetch(`${this.baseUrl}/predict/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ features }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Batch prediction failed');
    }
    
    return response.json();
  }

  // CSV file upload & prediction (NEW - from API docs)
  async predictCSV(file: File, maxRows: number = 10000): Promise<BatchPredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/predict/csv?max_rows=${maxRows}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'CSV prediction failed');
    }
    
    return response.json();
  }

  // Get model info (NEW - from API docs)
  async getModelInfo(): Promise<ModelInfoResponse> {
    const response = await fetch(`${this.baseUrl}/model/info`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch model info');
    }
    
    return response.json();
  }

  // Get model statistics (NEW - from API docs)
  async getModelStatistics(): Promise<MetricsResponse> {
    const response = await fetch(`${this.baseUrl}/model/statistics`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch model statistics');
    }
    
    return response.json();
  }

  // Store planet data (NEW - from API docs)
  async storePlanet(planetData: PlanetData): Promise<{ message: string; planet_name: string; file_path: string }> {
    const response = await fetch(`${this.baseUrl}/planets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planetData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to store planet data');
    }
    
    return response.json();
  }

  // Get all planets (NEW - from API docs)
  async getAllPlanets(): Promise<{ planets: PlanetData[]; total_count: number }> {
    const response = await fetch(`${this.baseUrl}/planets`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch planets');
    }
    
    return response.json();
  }

  // Get single planet (NEW - from API docs)
  async getPlanet(planetName: string): Promise<PlanetData> {
    const response = await fetch(`${this.baseUrl}/planets/${encodeURIComponent(planetName)}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch planet');
    }
    
    return response.json();
  }

  // Delete planet (NEW - from API docs)
  async deletePlanet(planetName: string): Promise<{ message: string; planet_name: string }> {
    const response = await fetch(`${this.baseUrl}/planets/${encodeURIComponent(planetName)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete planet');
    }
    
    return response.json();
  }

  // OLD ENDPOINTS (keeping for backward compatibility)
  // Train model
  async trainModel(config: TrainingConfig): Promise<MetricsResponse> {
    const response = await fetch(`${this.baseUrl}/api/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Training failed');
    }
    
    return response.json();
  }

  // Upload dataset
  async uploadDataset(file: File): Promise<DatasetInfo> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/upload-dataset`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    
    return response.json();
  }

  // Get metrics
  async getMetrics(): Promise<MetricsResponse> {
    const response = await fetch(`${this.baseUrl}/api/metrics`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch metrics');
    }
    
    return response.json();
  }

  // Get dataset info
  async getDatasetInfo(): Promise<DatasetInfo> {
    const response = await fetch(`${this.baseUrl}/api/dataset-info`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch dataset info');
    }
    
    return response.json();
  }
}

// Export singleton instance
export const exoplanetAPI = new ExoplanetAPI();

// Export class for testing
export default ExoplanetAPI;
