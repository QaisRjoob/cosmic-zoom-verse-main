// Model: Exoplanet Data Structure and Business Logic

export interface ExoplanetData {
  id: number;
  name: string;
  orbitalPeriod: number;
  transitDuration?: number;
  planetaryRadius: number;
  stellarRadius?: number;
  equilibriumTemperature?: number;
  insolationFlux?: number;
  distanceFromStar?: number;
  planetMass?: number;
  detectionStatus: "confirmed" | "candidate" | "false-positive";
  discoveryYear?: number;
  discoveryMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ExoplanetValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class ExoplanetModel {
  // Validate exoplanet data
  static validate(data: Partial<ExoplanetData>): ExoplanetValidationResult {
    const errors: Record<string, string> = {};

    // Required field validations
    if (!data.name || data.name.trim().length === 0) {
      errors.name = "Planet name is required";
    }

    if (!data.orbitalPeriod || data.orbitalPeriod <= 0) {
      errors.orbitalPeriod = "Orbital period must be greater than 0";
    }

    if (!data.planetaryRadius || data.planetaryRadius <= 0) {
      errors.planetaryRadius = "Planetary radius must be greater than 0";
    }

    if (!data.detectionStatus) {
      errors.detectionStatus = "Detection status is required";
    }

    // Range validations
    if (data.orbitalPeriod && data.orbitalPeriod > 100000) {
      errors.orbitalPeriod = "Orbital period seems unreasonably high";
    }

    if (data.planetaryRadius && data.planetaryRadius > 100) {
      errors.planetaryRadius = "Planetary radius seems unreasonably high";
    }

    if (data.equilibriumTemperature && (data.equilibriumTemperature < 0 || data.equilibriumTemperature > 10000)) {
      errors.equilibriumTemperature = "Temperature must be between 0 and 10000 K";
    }

    if (data.discoveryYear && (data.discoveryYear < 1992 || data.discoveryYear > new Date().getFullYear())) {
      errors.discoveryYear = "Discovery year must be between 1992 and current year";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Calculate derived properties
  static calculateHabitabilityScore(data: ExoplanetData): number {
    let score = 0;

    // Radius similar to Earth (0.8 - 1.5 R⊕)
    if (data.planetaryRadius >= 0.8 && data.planetaryRadius <= 1.5) {
      score += 30;
    } else if (data.planetaryRadius < 2.5) {
      score += 15;
    }

    // Temperature in habitable range (200-320 K)
    if (data.equilibriumTemperature) {
      if (data.equilibriumTemperature >= 200 && data.equilibriumTemperature <= 320) {
        score += 40;
      } else if (data.equilibriumTemperature >= 150 && data.equilibriumTemperature <= 400) {
        score += 20;
      }
    }

    // Insolation flux similar to Earth (0.5 - 1.5 S⊕)
    if (data.insolationFlux) {
      if (data.insolationFlux >= 0.5 && data.insolationFlux <= 1.5) {
        score += 30;
      } else if (data.insolationFlux >= 0.3 && data.insolationFlux <= 2.0) {
        score += 15;
      }
    }

    return Math.min(score, 100);
  }

  // Calculate planet type based on radius
  static determinePlanetType(radius: number): string {
    if (radius < 0.5) return "Sub-Earth";
    if (radius <= 1.5) return "Terrestrial";
    if (radius <= 2.0) return "Super Earth";
    if (radius <= 4.0) return "Mini Neptune";
    if (radius <= 10.0) return "Neptune-like";
    return "Jupiter-like";
  }

  // Format data for ML model
  static formatForMLModel(data: ExoplanetData): Record<string, number> {
    return {
      orbital_period: data.orbitalPeriod,
      transit_duration: data.transitDuration || 0,
      planetary_radius: data.planetaryRadius,
      stellar_radius: data.stellarRadius || 1.0,
      equilibrium_temperature: data.equilibriumTemperature || 0,
      insolation_flux: data.insolationFlux || 0,
      distance_from_star: data.distanceFromStar || 0,
      planet_mass: data.planetMass || 0,
    };
  }

  // Generate unique ID
  static generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
}

// Export type guards
export const isConfirmed = (data: ExoplanetData): boolean => data.detectionStatus === "confirmed";
export const isCandidate = (data: ExoplanetData): boolean => data.detectionStatus === "candidate";
export const isFalsePositive = (data: ExoplanetData): boolean => data.detectionStatus === "false-positive";
