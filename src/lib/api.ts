// API Service for Backend Communication
// Centralized API calls following MVC pattern

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  prediction: number;
  prediction_label: string;
  confidence: number;
  probabilities: {
    [key: string]: number;
  };
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

  // Health check
  async healthCheck(): Promise<{ status: string; model_trained: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/health`);
    if (!response.ok) throw new Error('API health check failed');
    return response.json();
  }

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

  // Single prediction
  async predict(input: PredictionInput): Promise<PredictionResponse> {
    const response = await fetch(`${this.baseUrl}/api/predict`, {
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

  // Batch prediction
  async predictBatch(file: File): Promise<{ predictions: any[]; total_count: number }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/predict-batch`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Batch prediction failed');
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

  // Get model info
  async getModelInfo(): Promise<{
    model_type: string;
    feature_names: string[];
    label_mapping: { [key: number]: string };
    n_features: number;
    is_trained: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/api/model-info`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch model info');
    }
    
    return response.json();
  }
}

// Export singleton instance
export const exoplanetAPI = new ExoplanetAPI();

// Export class for testing
export default ExoplanetAPI;
