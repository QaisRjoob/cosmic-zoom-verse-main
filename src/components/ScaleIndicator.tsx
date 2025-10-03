import { ViewState } from "./SpaceJourney";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface ScaleIndicatorProps {
  currentView: ViewState;
}

export const ScaleIndicator = ({ currentView }: ScaleIndicatorProps) => {
  const scales = [
    { view: "earth", label: "Earth", distance: "6,371 km radius" },
    { view: "solar", label: "Solar System", distance: "~9.5 billion km" },
    { view: "galaxy", label: "Milky Way", distance: "~100,000 light years" },
    { view: "universe", label: "Universe", distance: "~93 billion light years" },
    { view: "exoplanet", label: "Exoplanet System", distance: "Variable" },
  ];

  const currentIndex = scales.findIndex(s => s.view === currentView);

  return (
    <div className="absolute top-1/2 right-8 -translate-y-1/2 z-20">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-lg p-4 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold">Scale Navigator</span>
        </div>
        
        <div className="space-y-2 relative">
          {/* Vertical line */}
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border/30" />
          
          {scales.map((scale, index) => (
            <motion.div
              key={scale.view}
              className={`flex items-start gap-3 relative ${
                index === currentIndex ? "opacity-100" : "opacity-40"
              }`}
              whileHover={{ opacity: 1 }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 z-10 transition-all ${
                  index === currentIndex
                    ? "bg-purple-500 border-purple-400 shadow-lg shadow-purple-500/50"
                    : "bg-background border-border"
                }`}
              />
              <div className="flex-1 pb-2">
                <div className={`text-xs font-medium ${
                  index === currentIndex ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {scale.label}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {scale.distance}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
