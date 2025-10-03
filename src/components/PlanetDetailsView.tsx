import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Orbit, 
  Thermometer, 
  Ruler, 
  Calendar, 
  Globe, 
  Sparkles,
  TrendingUp,
  Database,
  ArrowRight,
  Eye,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { Controls } from "./Controls";
import { ViewState } from "./SpaceJourney";

interface PlanetDetailsViewProps {
  onNavigateToDataEntry: () => void;
  onViewChange?: (view: ViewState) => void;
}

export default function PlanetDetailsView({ onNavigateToDataEntry, onViewChange }: PlanetDetailsViewProps) {
  const [planetData, setPlanetData] = useState<any>(null);

  useEffect(() => {
    // Load planet data from localStorage
    const savedData = localStorage.getItem("exoplanetData");
    if (savedData) {
      setPlanetData(JSON.parse(savedData));
    } else {
      // Set default planet data
      setPlanetData({
        name: "Kepler-452b",
        detectionStatus: "confirmed",
        discoveryYear: "2015",
        discoveryMethod: "transit",
        orbitalPeriod: "384.8",
        transitDuration: "10.5",
        distanceFromStar: "1.05",
        planetaryRadius: "1.6",
        planetMass: "5.0",
        stellarRadius: "1.11",
        equilibriumTemperature: "265",
        insolationFlux: "1.1",
        notes: "Earth's older cousin - potentially habitable super-Earth orbiting a Sun-like star"
      });
    }
  }, []);

  if (!planetData) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "candidate": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "false-positive": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const StatCard = ({ icon: Icon, title, value, unit, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/60 backdrop-blur-lg border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">{title}</p>
              <p className="text-xl font-bold">{value || "N/A"}</p>
              {unit && <p className="text-xs text-muted-foreground mt-1">{unit}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="relative w-full min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 right-8 z-20"
      >
        <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Globe className="w-10 h-10 text-purple-400" />
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    {planetData.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(planetData.detectionStatus)}>
                      {planetData.detectionStatus?.toUpperCase() || "UNKNOWN"}
                    </Badge>
                    {planetData.discoveryYear && (
                      <span className="text-sm text-muted-foreground">
                        Discovered in {planetData.discoveryYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={onNavigateToDataEntry}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Database className="w-4 h-4" />
                  Add New Data
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Planet Visualization - Similar to Earth */}
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 backdrop-blur-sm border-2 border-purple-500/50 shadow-2xl shadow-purple-500/50">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-purple-400/30"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-inner"
            />
            {/* Glow effect */}
            <div className="absolute -inset-8 rounded-full bg-purple-500/20 blur-3xl" />
          </div>
        </motion.div>
      </div>

      {/* Left Sidebar - Physical Properties */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute left-8 top-40 bottom-32 w-80 overflow-y-auto"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Physical Properties
          </h3>

          <StatCard
            icon={Ruler}
            title="Planetary Radius"
            value={planetData.planetaryRadius}
            unit="Earth radii"
            color="bg-blue-500/10"
          />

          <StatCard
            icon={TrendingUp}
            title="Planet Mass"
            value={planetData.planetMass}
            unit="Earth masses"
            color="bg-purple-500/10"
          />

          <StatCard
            icon={Globe}
            title="Stellar Radius"
            value={planetData.stellarRadius}
            unit="Solar radii"
            color="bg-cyan-500/10"
          />

          <StatCard
            icon={Thermometer}
            title="Equilibrium Temperature"
            value={planetData.equilibriumTemperature}
            unit="Kelvin"
            color="bg-orange-500/10"
          />

          <StatCard
            icon={Sparkles}
            title="Insolation Flux"
            value={planetData.insolationFlux}
            unit="Earth flux"
            color="bg-yellow-500/10"
          />
        </div>
      </motion.div>

      {/* Right Sidebar - Orbital Data */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute right-8 top-40 bottom-32 w-80 overflow-y-auto"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Orbit className="w-5 h-5 text-blue-400" />
            Orbital Characteristics
          </h3>

          <StatCard
            icon={Orbit}
            title="Orbital Period"
            value={planetData.orbitalPeriod}
            unit="Earth days"
            color="bg-blue-500/10"
          />

          <StatCard
            icon={Calendar}
            title="Transit Duration"
            value={planetData.transitDuration}
            unit="hours"
            color="bg-green-500/10"
          />

          <StatCard
            icon={Ruler}
            title="Distance from Star"
            value={planetData.distanceFromStar}
            unit="AU"
            color="bg-pink-500/10"
          />

          <StatCard
            icon={Eye}
            title="Discovery Method"
            value={planetData.discoveryMethod?.replace("-", " ").toUpperCase() || "N/A"}
            unit=""
            color="bg-purple-500/10"
          />

          {/* Notes Section */}
          {planetData.notes && (
            <Card className="bg-card/60 backdrop-blur-lg border-border/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {planetData.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Call to Action for Data Entry */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-40 left-1/2 -translate-x-1/2"
      >
        <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Database className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm font-semibold text-white">Discover more exoplanets</p>
                <p className="text-xs text-muted-foreground">Add your own exoplanet data to explore</p>
              </div>
              <Button
                onClick={onNavigateToDataEntry}
                variant="outline"
                className="ml-4 border-purple-500/50 hover:bg-purple-500/20"
              >
                Enter Data
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Navigation Bar */}
      {onViewChange && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Controls currentView="planet-details" onViewChange={onViewChange} />
        </div>
      )}
    </div>
  );
}
