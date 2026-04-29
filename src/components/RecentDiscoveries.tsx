import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Discovery {
  id: number;
  name: string;
  year: number;
  type: string;
  color: string;
}

const discoveries: Discovery[] = [
  { id: 1, name: "Kepler-442b", year: 2015, type: "Super Earth", color: "#4ade80" },
  { id: 2, name: "TOI-700 d", year: 2020, type: "Terrestrial", color: "#60a5fa" },
  { id: 3, name: "K2-18b", year: 2015, type: "Mini Neptune", color: "#a78bfa" },
  { id: 4, name: "TRAPPIST-1e", year: 2017, type: "Rocky", color: "#f97316" },
];

export const RecentDiscoveries = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % discoveries.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + discoveries.length) % discoveries.length);
  };

  const current = discoveries[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="absolute top-24 right-8 z-20 w-80"
    >
      <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Recent Discoveries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-48 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${current.color}, ${current.color}99 40%, ${current.color}33)`,
                    boxShadow: `0 0 30px ${current.color}80`,
                  }}
                />
                <h3 className="text-xl font-bold mb-1">{current.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {current.type} • Discovered {current.year}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="hover:bg-purple-500/20 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-1">
              {discoveries.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-purple-500 w-6"
                      : "bg-border"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="hover:bg-purple-500/20 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
