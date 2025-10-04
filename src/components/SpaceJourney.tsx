import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Earth } from "./Earth";
import { SolarSystem } from "./SolarSystem";
import { GalaxyView } from "./GalaxyView";
import { UniverseView } from "./UniverseView";
import { ExoplanetSystem } from "./ExoplanetSystem";
import { ParticleField } from "./ParticleField";
import { Controls } from "./Controls";
import { Dashboard } from "./Dashboard";
import { DataUploadSection } from "./DataUploadSection";
import { ModelTraining } from "./ModelTraining";
import { ExoplanetExplorer } from "./ExoplanetExplorer";
import { QuickActions } from "./QuickActions";
import { RecentDiscoveries } from "./RecentDiscoveries";
import { UIToggle } from "./UIToggle";
import { UniverseExoplanets } from "./UniverseExoplanets";
import { ExoplanetDataEntry } from "./ExoplanetDataEntry";
import PlanetDetailsView from "./PlanetDetailsView";
import { ModelMetrics } from "./ModelMetrics";
import { ModelMetricsPage } from "@/pages/ModelMetricsPage";
import * as THREE from "three";
import { exoplanetAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Cinematic Camera Controller for Exoplanet View
const CinematicCamera = () => {
  const { camera } = useThree();
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Smooth cinematic drift
    camera.position.x = 3 + Math.sin(time * 0.08) * 0.3;
    camera.position.y = 2 + Math.cos(time * 0.1) * 0.2;
    
    // Slight rotation for cinematic feel
    targetRotation.current.x = -0.15 + Math.sin(time * 0.05) * 0.03;
    targetRotation.current.y = 0.3 + Math.cos(time * 0.07) * 0.05;
    
    // Smooth interpolation
    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.02;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.02;
    
    camera.updateProjectionMatrix();
  });
  
  return null;
};
import { Navigation, X, Eye, Database, FileText, Upload, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";

export type ViewState = "earth" | "solar" | "galaxy" | "universe" | "exoplanet" | "planet-details" | "model-metrics";

export const SpaceJourney = () => {
  const [view, setView] = useState<ViewState>("galaxy");
  const [showUIElements, setShowUIElements] = useState(true);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showExoplanetExplorer, setShowExoplanetExplorer] = useState(true);
  const [exoplanetUploadMethod, setExoplanetUploadMethod] = useState<"csv" | "manual">("manual");
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const { toast } = useToast();

  // Check API health on mount
  useEffect(() => {
    const checkAPIHealth = async () => {
      try {
        const health = await exoplanetAPI.healthCheck();
        if (health.status === "healthy" && health.model_loaded) {
          setApiStatus("connected");
          toast({
            title: "API Connected",
            description: `Model loaded successfully (v${health.model_version})`,
          });
        } else {
          setApiStatus("disconnected");
          toast({
            title: "API Warning",
            description: "API is reachable but model is not loaded",
            variant: "destructive",
          });
        }
      } catch (error) {
        setApiStatus("disconnected");
        toast({
          title: "API Connection Failed",
          description: "Unable to connect to the prediction API. Some features may be unavailable.",
          variant: "destructive",
        });
      }
    };
    
    checkAPIHealth();
  }, [toast]);

  // Dynamic camera position based on view
  const getCameraPosition = (): [number, number, number] => {
    switch (view) {
      case "earth":
        return [0, 0, 5]; // Closer zoom for Earth
      case "solar":
        return [0, 10, 20]; // Medium distance for solar system
      case "galaxy":
        return [0, 25, 35]; // Slightly tilted view for galaxy
      case "universe":
        return [0, 0, 40]; // Far view for universe
      case "exoplanet":
        return [3, 2, 8]; // Zoomed closer with cinematic angle for Saturn
      default:
        return [0, 0, 5];
    }
  };

  return (
    <div className="relative w-full h-screen bg-background">
      {/* Show Model Metrics Page if selected */}
      {view === "model-metrics" ? (
        <ModelMetricsPage onBack={() => setView("universe")} />
      ) : view === "planet-details" ? (
        /* Show Planet Details View if selected */
        <PlanetDetailsView 
          onNavigateToDataEntry={() => setView("exoplanet")} 
          onViewChange={setView}
        />
      ) : (
        <>
          <Canvas camera={{ position: getCameraPosition(), fov: 75 }} key={view}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1} />
            
            {/* Cinematic camera movement for exoplanet view */}
            {view === "exoplanet" && <CinematicCamera />}
            
            {/* Particle effects for immersion */}
            {view === "universe" && <ParticleField count={3000} color="#8b5cf6" size={0.3} speed={0.3} />}
            {view === "galaxy" && <ParticleField count={2000} color="#60a5fa" size={0.4} speed={0.5} />}
            {view === "exoplanet" && <ParticleField count={1000} color="#fbbf24" size={0.6} speed={0.4} />}
            
            {view === "earth" && <Earth />}
            {view === "solar" && <SolarSystem />}
            {view === "galaxy" && <GalaxyView />}
            {view === "universe" && <UniverseView />}
            {view === "exoplanet" && <ExoplanetSystem />}
            
            {/* Disable OrbitControls for exoplanet view to allow cinematic camera */}
            {view !== "exoplanet" && (
              <OrbitControls 
                enableZoom={true} 
                enablePan={false}
                minDistance={3}
                maxDistance={50}
              />
            )}
          </Canvas>
          
          {/* Dark overlay for text readability on exoplanet view */}
          {view === "exoplanet" && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)'
                }}
              />
            </>
          )}
        </>
      )}
      
      {/* Data Entry Button - Navigate to Exoplanet page */}
      {view !== "exoplanet" && view !== "planet-details" && (
        <Button
          onClick={() => setView("exoplanet")}
          className="absolute top-8 right-8 z-30 gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Database className="w-4 h-4" />
          Add Exoplanet Data
        </Button>
      )}
      
      {/* UI Toggle Button */}
      {view !== "planet-details" && <UIToggle showUI={showUIElements} onToggle={() => setShowUIElements(!showUIElements)} />}
      
      {/* Navigation Controls with toggle */}
      {view !== "planet-details" && (
        <div className={`transition-all duration-700 ${
          showNavigation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}>
          <Controls currentView={view} onViewChange={setView} />
        </div>
      )}

      {/* Toggle button for navigation - positioned to the right of the controls */}
      {view !== "planet-details" && (
        showNavigation ? (
          <button
            onClick={() => setShowNavigation(false)}
            className="absolute bottom-8 right-8 z-50 inline-flex items-center gap-2 px-4 py-2 bg-background/30 backdrop-blur-sm border border-primary/40 rounded-full hover:bg-background/50 hover:border-primary/70 transition-all duration-300 hover:scale-105"
            title="Hide navigation"
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">Hide Navigation</span>
          </button>
        ) : (
          <button
            onClick={() => setShowNavigation(true)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 group"
            title="Show navigation"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-background/20 backdrop-blur-sm border border-primary/30 rounded-full hover:bg-background/40 hover:border-primary/60 transition-all duration-300 hover:scale-105">
              <Navigation className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-0 group-hover:max-w-xs overflow-hidden">
                Show Navigation
              </span>
            </div>
          </button>
        )
      )}
      
      {/* Conditional UI Elements - Show on specific views */}
      {showUIElements && (
        <>
          {view === "galaxy" && (
            <>
              <Dashboard />
            </>
          )}
          
          {view === "exoplanet" && (
            <>
              <Dashboard />
              {/* Exoplanet Data Entry - With Tab Selector */}
              <div className="absolute bottom-32 left-0 right-0 z-20 h-[50vh]">
                <div className="h-full overflow-y-auto px-8">
                  {/* Tab Selector */}
                  <div className="flex justify-center mb-4 gap-4">
                    <Button
                      onClick={() => setExoplanetUploadMethod("csv")}
                      variant={exoplanetUploadMethod === "csv" ? "default" : "outline"}
                      className={`gap-2 transition-all ${
                        exoplanetUploadMethod === "csv" 
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                          : "border-purple-500/50 hover:bg-purple-500/10"
                      }`}
                      size="lg"
                    >
                      <Upload className="w-5 h-5" />
                      Upload CSV File
                    </Button>
                    
                    <Button
                      onClick={() => setExoplanetUploadMethod("manual")}
                      variant={exoplanetUploadMethod === "manual" ? "default" : "outline"}
                      className={`gap-2 transition-all ${
                        exoplanetUploadMethod === "manual" 
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                          : "border-green-500/50 hover:bg-green-500/10"
                      }`}
                      size="lg"
                    >
                      <FileText className="w-5 h-5" />
                      Upload One Planet Manual
                    </Button>
                  </div>

                  {/* Content based on selected method */}
                  {exoplanetUploadMethod === "csv" ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                      <div className="w-full max-w-xl">
                        <DataUploadSection 
                          onNavigateToTemplate={() => setExoplanetUploadMethod("manual")} 
                          onUploadSuccess={() => setView("universe")}
                          inline 
                        />
                      </div>
                    </div>
                  ) : (
                    <ExoplanetDataEntry onSuccess={() => setView("planet-details")} />
                  )}
                </div>
              </div>
            </>
          )}
          
          {view === "universe" && (
            <>
              {/* Model Metrics Button - Left Side, Smaller */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-24 left-8 z-20"
              >
                <Button
                  onClick={() => setView("model-metrics")}
                  className="gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 shadow-lg shadow-purple-500/50"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-semibold">Model Metrics</span>
                </Button>
              </motion.div>
            </>
          )}
          
          {view === "earth" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute right-8 top-24 w-72 z-20"
            >
              <div className="bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-400/20">
                  <div className="text-3xl">🌍</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Earth</h2>
                    <p className="text-blue-200 text-xs">Our Home Planet</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-blue-200">Type</span>
                    <span className="text-white font-medium">Terrestrial</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-blue-200">Diameter</span>
                    <span className="text-white font-medium">12,742 km</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-blue-200">Distance</span>
                    <span className="text-white font-medium">149.6M km</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-blue-200">Year</span>
                    <span className="text-white font-medium">365.25 days</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-blue-200">Day</span>
                    <span className="text-white font-medium">24 hours</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-blue-200">Moons</span>
                    <span className="text-white font-medium">1 (Luna)</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-blue-200">Atmosphere</span>
                    <span className="text-white font-medium text-xs">78% N₂, 21% O₂</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-blue-400/20">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🌱</span>
                    <p className="text-xs text-blue-100">The only known planet with life. Perfect conditions in the habitable zone.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === "solar" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute right-8 top-24 w-72 z-20"
            >
              <div className="bg-gradient-to-br from-orange-500/20 via-yellow-500/20 to-red-500/20 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-orange-400/20">
                  <div className="text-3xl">☀️</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Solar System</h2>
                    <p className="text-orange-200 text-xs">Our Cosmic Neighborhood</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-orange-200">Star</span>
                    <span className="text-white font-medium">Sun</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-orange-200">Planets</span>
                    <span className="text-white font-medium">8</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-orange-200">Age</span>
                    <span className="text-white font-medium">4.6 billion yrs</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-orange-200">Diameter</span>
                    <span className="text-white font-medium">287 billion km</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-orange-200">Dwarf Planets</span>
                    <span className="text-white font-medium">5</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-orange-200">Moons</span>
                    <span className="text-white font-medium">200+</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-orange-200">Location</span>
                    <span className="text-white font-medium text-xs">Milky Way Galaxy</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-orange-400/20">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🪐</span>
                    <p className="text-xs text-orange-100">Home to 8 planets, asteroids, comets, and countless wonders orbiting our Sun.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === "galaxy" && <RecentDiscoveries />}
          
          {view === "universe" && <UniverseExoplanets />}
        </>
      )}
    </div>
  );
};
