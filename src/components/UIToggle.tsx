import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

interface UIToggleProps {
  showUI: boolean;
  onToggle: () => void;
}

export const UIToggle = ({ showUI, onToggle }: UIToggleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute top-24 right-8 z-30"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="bg-card/80 backdrop-blur-lg hover:bg-card shadow-lg"
        title={showUI ? "Hide UI" : "Show UI"}
      >
        {showUI ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </Button>
    </motion.div>
  );
};
