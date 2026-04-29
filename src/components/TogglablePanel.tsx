import { useState, ReactNode } from "react";
import { X, Eye } from "lucide-react";

interface TogglablePanelProps {
  children: ReactNode;
  panelName: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right";
}

export const TogglablePanel = ({ children, panelName, position = "top-right" }: TogglablePanelProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Determine button position based on panel position
  const getButtonPosition = () => {
    switch (position) {
      case "top-left":
        return "top-2 left-2";
      case "top-right":
        return "top-2 right-2";
      case "bottom-left":
        return "bottom-2 left-2";
      case "bottom-right":
        return "bottom-2 right-2";
      case "left":
        return "top-1/2 -translate-y-1/2 left-2";
      case "right":
        return "top-1/2 -translate-y-1/2 right-2";
      default:
        return "top-2 right-2";
    }
  };

  const getShowButtonPosition = () => {
    switch (position) {
      case "top-left":
        return "absolute top-4 left-4 z-20";
      case "top-right":
        return "absolute top-4 right-4 z-20";
      case "bottom-left":
        return "absolute bottom-4 left-4 z-20";
      case "bottom-right":
        return "absolute bottom-4 right-4 z-20";
      case "left":
        return "absolute top-1/2 -translate-y-1/2 left-4 z-20";
      case "right":
        return "absolute top-1/2 -translate-y-1/2 right-4 z-20";
      default:
        return "absolute top-4 right-4 z-20";
    }
  };

  return (
    <>
      {isVisible ? (
        <div className="relative transition-all duration-500">
          {children}
          <button
            onClick={() => setIsVisible(false)}
            className={`absolute ${getButtonPosition()} p-1.5 bg-background/40 backdrop-blur-sm border border-primary/40 rounded-lg hover:bg-background/60 hover:border-primary/70 transition-all duration-300 hover:scale-110 z-30`}
            title={`Hide ${panelName}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsVisible(true)}
          className={`${getShowButtonPosition()} group`}
          title={`Show ${panelName}`}
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-background/20 backdrop-blur-sm border border-primary/30 rounded-lg hover:bg-background/40 hover:border-primary/60 transition-all duration-300 hover:scale-105">
            <Eye className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap">
              {panelName}
            </span>
          </div>
        </button>
      )}
    </>
  );
};
