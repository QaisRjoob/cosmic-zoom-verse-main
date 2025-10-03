import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useState, useRef } from "react";
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
import * as THREE from "three";

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
import { Navigation, X, Eye, Database, FileText } from "lucide-react";
import { Button } from "./ui/button";

export type ViewState = "earth" | "solar" | "galaxy" | "universe" | "exoplanet" | "planet-details";

export const SpaceJourney = () => {
  const [view, setView] = useState<ViewState>("galaxy");
  const [showUIElements, setShowUIElements] = useState(true);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showExoplanetExplorer, setShowExoplanetExplorer] = useState(true);

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
      {/* Show Planet Details View if selected */}
      {view === "planet-details" ? (
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
              
              {/* Exoplanet Explorer with toggle - only on galaxy view */}
              {showExoplanetExplorer ? (
                <div className="absolute bottom-24 left-8 z-20 w-96">
                  <ExoplanetExplorer />
                  <button
                    onClick={() => setShowExoplanetExplorer(false)}
                    className="absolute -top-3 -right-3 p-1.5 bg-background/80 backdrop-blur-sm border border-primary/50 rounded-lg hover:bg-background hover:border-primary/70 transition-all duration-300 hover:scale-110 z-40 shadow-lg"
                    title="Hide Exoplanet Explorer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowExoplanetExplorer(true)}
                  className="absolute bottom-24 left-8 z-20 group"
                  title="Show Exoplanet Explorer"
                >
                  <div className="flex items-center gap-2 px-3 py-2 bg-background/20 backdrop-blur-sm border border-primary/30 rounded-lg hover:bg-background/40 hover:border-primary/60 transition-all duration-300 hover:scale-105">
                    <Eye className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap">
                      Exoplanet Explorer
                    </span>
                  </div>
                </button>
              )}
            </>
          )}
          
          {view === "exoplanet" && (
            <>
              <Dashboard />
              <ModelTraining />
              {/* Exoplanet Data Entry Form - Bottom of Page */}
              <div className="absolute bottom-32 left-0 right-0 z-20 h-[50vh]">
                <div className="h-full overflow-y-auto">
                  <ExoplanetDataEntry onSuccess={() => setView("planet-details")} />
                </div>
              </div>
            </>
          )}
          
          {view === "universe" && <Dashboard />}
          
          {view === "earth" && (
            <>
              <DataUploadSection onNavigateToTemplate={() => setView("exoplanet")} />
              <ModelTraining />
            </>
          )}

          {view === "solar" && (
            <DataUploadSection onNavigateToTemplate={() => setView("exoplanet")} compact />
          )}

          {view === "galaxy" && <RecentDiscoveries />}
          
          {view === "universe" && <UniverseExoplanets />}
        </>
      )}
    </div>
  );
};
