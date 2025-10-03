import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { exoplanetAPI, MetricsResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const ModelTraining = () => {
  const [model, setModel] = useState<"random_forest" | "xgboost" | "svm" | "gradient_boost">("random_forest");
  const [epochs, setEpochs] = useState([100]);
  const [learningRate, setLearningRate] = useState([0.1]);
  const [maxDepth, setMaxDepth] = useState([20]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Try to load existing metrics
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await exoplanetAPI.getMetrics();
      setMetrics(data);
    } catch (error) {
      // Metrics not available yet
      console.log("No metrics available yet");
    }
  };

  const handleTrain = async () => {
    setIsTraining(true);
    setProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      // Train model
      const result = await exoplanetAPI.trainModel({
        model_type: model,
        test_size: 0.2,
        n_estimators: epochs[0],
        max_depth: maxDepth[0],
        learning_rate: learningRate[0],
      });

      clearInterval(progressInterval);
      setProgress(100);
      setMetrics(result);

      toast({
        title: "Training Complete!",
        description: `Model accuracy: ${(result.accuracy * 100).toFixed(2)}%`,
      });
    } catch (error) {
      toast({
        title: "Training Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsTraining(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="absolute bottom-24 left-8 z-20 w-96"
    >
      <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            Model Training
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Select Model</Label>
            <Select value={model} onValueChange={(val: any) => setModel(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random_forest">Random Forest</SelectItem>
                <SelectItem value="xgboost">XGBoost</SelectItem>
                <SelectItem value="svm">Support Vector Machine</SelectItem>
                <SelectItem value="gradient_boost">Gradient Boosting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Estimators / Epochs: {epochs[0]}</Label>
            <Slider
              value={epochs}
              onValueChange={setEpochs}
              max={200}
              min={10}
              step={10}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Max Depth: {maxDepth[0]}</Label>
            <Slider
              value={maxDepth}
              onValueChange={setMaxDepth}
              max={50}
              min={5}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Learning Rate: {learningRate[0].toFixed(3)}</Label>
            <Slider
              value={learningRate}
              onValueChange={setLearningRate}
              max={0.5}
              min={0.01}
              step={0.01}
            />
          </div>

          {isTraining && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-xs">
                <span>Training Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>
          )}

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-background/50 rounded p-2">
              <div className="text-xs text-muted-foreground">Accuracy</div>
              <div className="text-lg font-bold text-green-400">
                {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '--'}
              </div>
            </div>
            <div className="bg-background/50 rounded p-2">
              <div className="text-xs text-muted-foreground">Precision</div>
              <div className="text-lg font-bold text-blue-400">
                {metrics ? `${(metrics.precision * 100).toFixed(1)}%` : '--'}
              </div>
            </div>
            <div className="bg-background/50 rounded p-2">
              <div className="text-xs text-muted-foreground">Recall</div>
              <div className="text-lg font-bold text-purple-400">
                {metrics ? `${(metrics.recall * 100).toFixed(1)}%` : '--'}
              </div>
            </div>
          </div>

          <Button
            onClick={handleTrain}
            disabled={isTraining}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/50"
            size="lg"
          >
            {isTraining ? (
              <>
                <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                Training...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Train Model
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
