import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Target, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Exoplanet {
  id: number;
  name: string;
  type: string;
  discovered: string;
  status: "confirmed" | "candidate" | "false-positive";
  color: string;
}

export const Dashboard = () => {
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);
  const [falsePositiveCount, setFalsePositiveCount] = useState(0);

  useEffect(() => {
    // Check for user uploaded data
    const uploadedData = localStorage.getItem("uploadedExoplanets");
    
    if (uploadedData) {
      try {
        const exoplanets: Exoplanet[] = JSON.parse(uploadedData);
        const confirmed = exoplanets.filter(p => p.status === "confirmed").length;
        const candidate = exoplanets.filter(p => p.status === "candidate").length;
        const falsePositive = exoplanets.filter(p => p.status === "false-positive").length;
        
        setConfirmedCount(confirmed);
        setCandidateCount(candidate);
        setFalsePositiveCount(falsePositive);
      } catch (error) {
        console.error("Error parsing exoplanet data:", error);
      }
    }

    // Listen for storage changes (when data is uploaded)
    const handleStorageChange = () => {
      const data = localStorage.getItem("uploadedExoplanets");
      if (data) {
        try {
          const exoplanets: Exoplanet[] = JSON.parse(data);
          setConfirmedCount(exoplanets.filter(p => p.status === "confirmed").length);
          setCandidateCount(exoplanets.filter(p => p.status === "candidate").length);
          setFalsePositiveCount(exoplanets.filter(p => p.status === "false-positive").length);
        } catch (error) {
          console.error("Error parsing exoplanet data:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-8 left-8 z-20 flex gap-4"
    >
      <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 w-[200px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            Confirmed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold cosmic-glow">
            {confirmedCount > 0 ? confirmedCount.toLocaleString() : "-"}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {confirmedCount > 0 ? "From your data" : "No data yet"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 w-[200px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            Candidates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            {candidateCount > 0 ? candidateCount.toLocaleString() : "-"}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {candidateCount > 0 ? "Under investigation" : "No data yet"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl hover:shadow-red-500/20 transition-all duration-300 w-[200px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            False Positives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">
            {falsePositiveCount > 0 ? falsePositiveCount.toLocaleString() : "-"}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {falsePositiveCount > 0 ? "Ruled out" : "No data yet"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
