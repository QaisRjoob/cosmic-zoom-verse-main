// Controller: Handle API interactions and data flow

import { ExoplanetData, ExoplanetModel } from "@/models/ExoplanetModel";

const API_BASE_URL = "/api"; // Update with your actual API endpoint
const STORAGE_KEY = "exoplanet_data";

export class ExoplanetController {
  // Save exoplanet data
  static async saveExoplanet(data: Omit<ExoplanetData, "id" | "createdAt">): Promise<ExoplanetData> {
    try {
      // Validate data first
      const validation = ExoplanetModel.validate(data as ExoplanetData);
      if (!validation.isValid) {
        throw new Error("Validation failed: " + JSON.stringify(validation.errors));
      }

      const newExoplanet: ExoplanetData = {
        ...data,
        id: ExoplanetModel.generateId(),
        createdAt: new Date().toISOString(),
      } as ExoplanetData;

      // Try to send to backend API
      try {
        const response = await fetch(`${API_BASE_URL}/exoplanets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExoplanet),
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const savedData = await response.json();
        
        // Also save to local storage as backup
        this.saveToLocalStorage(savedData);
        
        return savedData;
      } catch (apiError) {
        // Fallback to local storage if API fails
        console.warn("API unavailable, saving to local storage:", apiError);
        this.saveToLocalStorage(newExoplanet);
        return newExoplanet;
      }
    } catch (error) {
      console.error("Error saving exoplanet:", error);
      throw error;
    }
  }

  // Get all exoplanets
  static async getAllExoplanets(): Promise<ExoplanetData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/exoplanets`);
      
      if (!response.ok) {
        throw new Error("API request failed");
      }

      return await response.json();
    } catch (error) {
      // Fallback to local storage
      console.warn("API unavailable, loading from local storage:", error);
      return this.getFromLocalStorage();
    }
  }

  // Get exoplanet by ID
  static async getExoplanetById(id: number): Promise<ExoplanetData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/exoplanets/${id}`);
      
      if (!response.ok) {
        throw new Error("API request failed");
      }

      return await response.json();
    } catch (error) {
      // Fallback to local storage
      const allData = this.getFromLocalStorage();
      return allData.find(item => item.id === id) || null;
    }
  }

  // Update exoplanet
  static async updateExoplanet(id: number, data: Partial<ExoplanetData>): Promise<ExoplanetData> {
    try {
      const response = await fetch(`${API_BASE_URL}/exoplanets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, updatedAt: new Date().toISOString() }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const updatedData = await response.json();
      
      // Update local storage
      this.updateInLocalStorage(id, updatedData);
      
      return updatedData;
    } catch (error) {
      // Fallback to local storage
      const updated = { ...data, id, updatedAt: new Date().toISOString() } as ExoplanetData;
      this.updateInLocalStorage(id, updated);
      return updated;
    }
  }

  // Delete exoplanet
  static async deleteExoplanet(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/exoplanets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      // Also delete from local storage
      this.deleteFromLocalStorage(id);
    } catch (error) {
      // Fallback to local storage
      this.deleteFromLocalStorage(id);
    }
  }

  // Submit data for ML training
  static async submitForTraining(data: ExoplanetData): Promise<{ success: boolean; message: string }> {
    try {
      const mlFormattedData = ExoplanetModel.formatForMLModel(data);
      
      const response = await fetch(`${API_BASE_URL}/ml/train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exoplanet_id: data.id,
          features: mlFormattedData,
          label: data.detectionStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Training submission failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error submitting for training:", error);
      throw error;
    }
  }

  // Get statistics
  static async getStatistics(): Promise<{
    total: number;
    confirmed: number;
    candidates: number;
    falsePositives: number;
  }> {
    try {
      const allData = await this.getAllExoplanets();
      
      return {
        total: allData.length,
        confirmed: allData.filter(d => d.detectionStatus === "confirmed").length,
        candidates: allData.filter(d => d.detectionStatus === "candidate").length,
        falsePositives: allData.filter(d => d.detectionStatus === "false-positive").length,
      };
    } catch (error) {
      console.error("Error getting statistics:", error);
      return { total: 0, confirmed: 0, candidates: 0, falsePositives: 0 };
    }
  }

  // Local storage helpers
  private static saveToLocalStorage(data: ExoplanetData): void {
    try {
      const existing = this.getFromLocalStorage();
      existing.push(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  }

  private static getFromLocalStorage(): ExoplanetData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading from local storage:", error);
      return [];
    }
  }

  private static updateInLocalStorage(id: number, data: ExoplanetData): void {
    try {
      const existing = this.getFromLocalStorage();
      const index = existing.findIndex(item => item.id === id);
      
      if (index !== -1) {
        existing[index] = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      }
    } catch (error) {
      console.error("Error updating local storage:", error);
    }
  }

  private static deleteFromLocalStorage(id: number): void {
    try {
      const existing = this.getFromLocalStorage();
      const filtered = existing.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting from local storage:", error);
    }
  }

  // Export data as CSV
  static exportToCSV(data: ExoplanetData[]): string {
    const headers = [
      "ID", "Name", "Orbital Period", "Transit Duration", "Planetary Radius",
      "Stellar Radius", "Equilibrium Temperature", "Insolation Flux",
      "Distance from Star", "Planet Mass", "Detection Status",
      "Discovery Year", "Discovery Method", "Created At"
    ];

    const rows = data.map(d => [
      d.id,
      d.name,
      d.orbitalPeriod,
      d.transitDuration || "",
      d.planetaryRadius,
      d.stellarRadius || "",
      d.equilibriumTemperature || "",
      d.insolationFlux || "",
      d.distanceFromStar || "",
      d.planetMass || "",
      d.detectionStatus,
      d.discoveryYear || "",
      d.discoveryMethod || "",
      d.createdAt,
    ]);

    return [headers, ...rows].map(row => row.join(",")).join("\n");
  }
}
