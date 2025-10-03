import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Target, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export const Dashboard = () => {
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
          <div className="text-2xl font-bold cosmic-glow">5,537</div>
          <p className="text-[10px] text-muted-foreground mt-1">Total discovered</p>
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
          <div className="text-2xl font-bold text-green-400">8,924</div>
          <p className="text-[10px] text-muted-foreground mt-1">Under investigation</p>
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
          <div className="text-2xl font-bold text-red-400">2,341</div>
          <p className="text-[10px] text-muted-foreground mt-1">Ruled out</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
