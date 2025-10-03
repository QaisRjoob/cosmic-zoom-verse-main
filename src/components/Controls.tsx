import { Button } from "@/components/ui/button";
import { ViewState } from "./SpaceJourney";
import { Globe, Orbit, Sparkles, Boxes, Telescope, Eye } from "lucide-react";

interface ControlsProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Controls = ({ currentView, onViewChange }: ControlsProps) => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex gap-3 p-4 bg-card/80 backdrop-blur-lg rounded-full border border-border shadow-lg">
        <Button
          variant={currentView === "earth" ? "default" : "outline"}
          size="lg"
          onClick={() => onViewChange("earth")}
          className="gap-2 transition-all hover:scale-105"
        >
          <Globe className="w-5 h-5" />
          Earth
        </Button>
        
        <Button
          variant={currentView === "solar" ? "default" : "outline"}
          size="lg"
          onClick={() => onViewChange("solar")}
          className="gap-2 transition-all hover:scale-105"
        >
          <Orbit className="w-5 h-5" />
          Solar System
        </Button>
        
        <Button
          variant={currentView === "galaxy" ? "default" : "outline"}
          size="lg"
          onClick={() => onViewChange("galaxy")}
          className="gap-2 transition-all hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          Galaxy
        </Button>

        <Button
          variant={currentView === "universe" ? "default" : "outline"}
          size="lg"
          onClick={() => onViewChange("universe")}
          className="gap-2 transition-all hover:scale-105"
        >
          <Boxes className="w-5 h-5" />
          Universe
        </Button>

        <Button
          variant={currentView === "exoplanet" ? "default" : "outline"}
          size="lg"
          onClick={() => onViewChange("exoplanet")}
          className="gap-2 transition-all hover:scale-105"
        >
          <Telescope className="w-5 h-5" />
          Exoplanet
        </Button>

        <Button
          variant={currentView === "planet-details" ? "default" : "outline"}
          size="lg"
          onClick={() => onViewChange("planet-details")}
          className="gap-2 transition-all hover:scale-105"
        >
          <Eye className="w-5 h-5" />
          My Planet
        </Button>
      </div>
    </div>
  );
};
