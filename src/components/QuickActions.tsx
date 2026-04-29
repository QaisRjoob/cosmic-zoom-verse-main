import { Button } from "@/components/ui/button";
import { Upload, Brain, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="absolute top-1/2 left-8 -translate-y-1/2 z-20 flex flex-col gap-3"
    >
      <Button
        size="lg"
        className="bg-purple-600/80 hover:bg-purple-700 backdrop-blur-lg shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
      >
        <Upload className="w-5 h-5 mr-2" />
        Upload Data
      </Button>
      
      <Button
        size="lg"
        className="bg-cyan-600/80 hover:bg-cyan-700 backdrop-blur-lg shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
      >
        <Brain className="w-5 h-5 mr-2" />
        Train Model
      </Button>
      
      <Button
        size="lg"
        className="bg-blue-600/80 hover:bg-blue-700 backdrop-blur-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
      >
        <BarChart3 className="w-5 h-5 mr-2" />
        View Results
      </Button>
    </motion.div>
  );
};
