import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelMetrics } from "@/components/ModelMetrics";
import { SpaceBackground3D } from "@/components/SpaceBackground3D";

interface ModelMetricsPageProps {
  onBack: () => void;
}

export const ModelMetricsPage = ({ onBack }: ModelMetricsPageProps) => {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* 3D Space Background */}
      <SpaceBackground3D />
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 pb-4"
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="gap-2 border-purple-500/50 hover:bg-purple-500/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Universe
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Model Performance Analytics
                </h1>
                <p className="text-gray-400 mt-1">
                  Comprehensive AI model metrics and statistics
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Metrics Display - Centered */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl"
          >
            <ModelMetrics isFullPage={true} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
