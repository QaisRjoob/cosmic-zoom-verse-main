import { useState, useEffect } from "react";
import { SpaceJourney } from "@/components/SpaceJourney";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Info, X } from "lucide-react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      // Auto-hide title after 5 seconds
      const timer = setTimeout(() => {
        setShowTitle(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      
      <main className="w-full h-screen overflow-hidden">
        {/* Title with auto-hide animation */}
        <div 
          className={`absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center transition-all duration-700 ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold cosmic-glow mb-2">
            AI Exoplanet Detection Platform
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore the universe with AI-powered exoplanet discovery
          </p>
          
          {/* Close button when title is visible */}
          {showTitle && isLoaded && (
            <button
              onClick={() => setShowTitle(false)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-background/30 backdrop-blur-sm border border-primary/40 rounded-full hover:bg-background/50 hover:border-primary/70 transition-all duration-300 hover:scale-105"
              title="Hide title"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Hide</span>
            </button>
          )}
        </div>

        {/* Floating button to show title again */}
        {!showTitle && isLoaded && (
          <button
            onClick={() => setShowTitle(true)}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-10 group"
            title="Show title"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-background/20 backdrop-blur-sm border border-primary/30 rounded-full hover:bg-background/40 hover:border-primary/60 transition-all duration-300 hover:scale-105">
              <Info className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-0 group-hover:max-w-xs overflow-hidden">
                Show Info
              </span>
            </div>
          </button>
        )}
        
        {isLoaded && <SpaceJourney />}
      </main>
    </>
  );
};

export default Index;
