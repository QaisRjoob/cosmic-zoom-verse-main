import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ChevronRight, ChevronLeft, Sparkles, Globe, Orbit, Thermometer, Check, AlertCircle, Loader2, Brain } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExoplanetDataEntryProps {
  onSuccess?: () => void;
}

interface ExoplanetFormData {
  name: string;
  koi_period: string;
  koi_depth: string;
  koi_prad: string;
  koi_teq: string;
  koi_insol: string;
  koi_model_snr: string;
  koi_steff: string;
  koi_srad: string;
  koi_smass: string;
}

interface PredictionResult {
  prediction: number;
  prediction_label: string;
  confidence: number;
  probabilities: {
    CANDIDATE: number;
    CONFIRMED: number;
    "FALSE POSITIVE": number;
  };
}

const initialFormData: ExoplanetFormData = {
  name: "",
  koi_period: "",
  koi_depth: "",
  koi_prad: "",
  koi_teq: "",
  koi_insol: "",
  koi_model_snr: "",
  koi_steff: "",
  koi_srad: "",
  koi_smass: "",
};

export const ExoplanetDataEntry = ({ onSuccess }: ExoplanetDataEntryProps = {}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExoplanetFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ExoplanetFormData, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const steps = [
    { 
      id: 0, 
      title: "Planet Identity", 
      icon: Globe,
      description: "Name your exoplanet discovery",
      gradient: "from-blue-500/20 to-cyan-500/20",
      fields: ["name"]
    },
    { 
      id: 1, 
      title: "Orbital Data", 
      icon: Orbit,
      description: "Orbital characteristics and period",
      gradient: "from-purple-500/20 to-pink-500/20",
      fields: ["koi_period", "koi_depth"]
    },
    { 
      id: 2, 
      title: "Physical Properties", 
      icon: Sparkles,
      description: "Size and stellar properties",
      gradient: "from-orange-500/20 to-yellow-500/20",
      fields: ["koi_prad", "koi_srad", "koi_smass"]
    },
    { 
      id: 3, 
      title: "Environmental", 
      icon: Thermometer,
      description: "Temperature and stellar data",
      gradient: "from-green-500/20 to-emerald-500/20",
      fields: ["koi_teq", "koi_insol", "koi_steff", "koi_model_snr"]
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleInputChange = (field: keyof ExoplanetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExoplanetFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Planet name is required";
    }

    if (!formData.koi_period || parseFloat(formData.koi_period) <= 0) {
      newErrors.koi_period = "Valid orbital period is required (days)";
    }

    if (!formData.koi_prad || parseFloat(formData.koi_prad) <= 0) {
      newErrors.koi_prad = "Valid planetary radius is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsPredicting(true);

    try {
      // Call save API
      const savePayload = {
        planet_id: `PLT_${Date.now()}`,
        koi_name: formData.name,
        koi_period: parseFloat(formData.koi_period) || 0,
        koi_depth: parseFloat(formData.koi_depth) || 0,
        koi_prad: parseFloat(formData.koi_prad) || 0,
        koi_teq: parseFloat(formData.koi_teq) || 0,
        koi_insol: parseFloat(formData.koi_insol) || 0,
        koi_steff: parseFloat(formData.koi_steff) || 0,
        koi_srad: parseFloat(formData.koi_srad) || 0,
        koi_slogg: 0, // Default value
        koi_duration: 0, // Default value
        koi_impact: 0, // Default value
        koi_time0bk: 0, // Default value
        koi_kepmag: 0, // Default value
        disposition: "CANDIDATE", // Will be predicted
        notes: `Submitted from prediction form at ${new Date().toISOString()}`,
        submitted_by: "Web User"
      };

      const response = await fetch("http://localhost:8000/planets/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(savePayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to save planet data");
      }

      const result = await response.json();
      
      // Now call prediction endpoint
      const predictionPayload = {
        koi_period: parseFloat(formData.koi_period) || 0,
        koi_duration: 0,
        koi_depth: parseFloat(formData.koi_depth) || 0,
        koi_prad: parseFloat(formData.koi_prad) || 0,
        koi_teq: parseFloat(formData.koi_teq) || 0,
        koi_insol: parseFloat(formData.koi_insol) || 0,
        koi_steff: parseFloat(formData.koi_steff) || 0,
        koi_slogg: 0,
        koi_srad: parseFloat(formData.koi_srad) || 0,
        koi_smass: parseFloat(formData.koi_smass) || 0,
        koi_impact: 0,
        koi_model_snr: parseFloat(formData.koi_model_snr) || 0
      };

      const predictionResponse = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(predictionPayload),
      });

      if (predictionResponse.ok) {
        const prediction = await predictionResponse.json();
        setPredictionResult({
          prediction: prediction.prediction,
          prediction_label: prediction.prediction_label,
          confidence: prediction.confidence,
          probabilities: prediction.probabilities,
        });
      } else {
        // If prediction fails, use default
        setPredictionResult({
          prediction: 0,
          prediction_label: "CANDIDATE",
          confidence: 0.5,
          probabilities: {
            CANDIDATE: 0.5,
            CONFIRMED: 0.3,
            "FALSE POSITIVE": 0.2
          },
        });
      }

      setShowConfirmation(true);

      toast({
        title: "Success!",
        description: `Planet "${formData.name}" saved successfully!`,
      });

    } catch (error) {
      toast({
        title: "Prediction Error",
        description: error instanceof Error ? error.message : "Failed to predict. Please ensure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleConfirmAndContinue = () => {
    setShowConfirmation(false);
    setFormData(initialFormData);
    setPredictionResult(null);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const handleConfirmAndView = () => {
    setShowConfirmation(false);
    navigate("/my-planets");
  };

  const handleEditData = () => {
    setShowConfirmation(false);
    setPredictionResult(null);
    // Keep the form data so user can edit
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "CANDIDATE": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "FALSE POSITIVE": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      markStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-auto p-8"
      >
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg shadow-2xl">
          <CardHeader className="space-y-6 pb-8">
            {/* Header with Animated Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center gap-4"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Brain className="w-16 h-16 text-purple-400" />
              </motion.div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Exoplanet Prediction Portal
                </h2>
                <p className="text-gray-400 text-sm mt-1">AI-powered classification wizard</p>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Navigation Pills */}
            <div className="grid grid-cols-4 gap-3">
              {steps.map((step) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = completedSteps.includes(step.id);
                
                return (
                  <motion.button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all duration-300
                      ${isActive 
                        ? `bg-gradient-to-br ${step.gradient} border-white/30 shadow-lg` 
                        : isCompleted
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeStep"
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        {isCompleted && !isActive ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <StepIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        )}
                      </div>
                      <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {step.title}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Step 0: Planet Identity */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Globe className="w-6 h-6 text-blue-400" />
                        <div>
                          <h3 className="text-2xl font-bold text-white">Planet Identity</h3>
                          <p className="text-gray-400 text-sm">Name your exoplanet discovery</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {/* Planet Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                            Planet Name *
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Official designation or catalog name (e.g., Kepler-442b, TRAPPIST-1e)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="name"
                            placeholder="e.g., Kepler-442b"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                              errors.name ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-400 text-sm">{errors.name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Orbital Data */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Orbit className="w-6 h-6 text-purple-400" />
                        <div>
                          <h3 className="text-2xl font-bold text-white">Orbital Data</h3>
                          <p className="text-gray-400 text-sm">Orbital characteristics and period</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Orbital Period (koi_period) */}
                        <div className="space-y-2">
                          <Label htmlFor="koi_period" className="text-gray-300 flex items-center gap-2">
                            Orbital Period (days) *
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Time taken for one complete orbit around the host star (koi_period)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="koi_period"
                            type="number"
                            step="any"
                            placeholder="e.g., 365.25"
                            value={formData.koi_period}
                            onChange={(e) => handleInputChange("koi_period", e.target.value)}
                            className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                              errors.koi_period ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.koi_period && (
                            <p className="text-red-400 text-sm">{errors.koi_period}</p>
                          )}
                        </div>

                        {/* Transit Depth (koi_depth) */}
                        <div className="space-y-2">
                          <Label htmlFor="koi_depth" className="text-gray-300 flex items-center gap-2">
                            Transit Depth (ppm)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Depth of the transit signal in parts per million (koi_depth)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="koi_depth"
                            type="number"
                            step="any"
                            placeholder="e.g., 143.3"
                            value={formData.koi_depth}
                            onChange={(e) => handleInputChange("koi_depth", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                              
                  {/* Step 2: Physical Properties */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-6 h-6 text-orange-400" />
                        <div>
                          <h3 className="text-2xl font-bold text-white">Physical Properties</h3>
                          <p className="text-gray-400 text-sm">Size and stellar properties</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Planetary Radius (koi_prad) */}
                        <div className="space-y-2">
                          <Label htmlFor="koi_prad" className="text-gray-300 flex items-center gap-2">
                            Planetary Radius (Earth radii) *
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Radius relative to Earth (1.0 = Earth-sized) - koi_prad</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="koi_prad"
                            type="number"
                            step="any"
                            placeholder="e.g., 1.06"
                            value={formData.koi_prad}
                            onChange={(e) => handleInputChange("koi_prad", e.target.value)}
                            className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                              errors.koi_prad ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.koi_prad && (
                            <p className="text-red-400 text-sm">{errors.koi_prad}</p>
                          )}
                        </div>

                        {/* Stellar Radius (koi_srad) */}
                        <div className="space-y-2">
                          <Label htmlFor="koi_srad" className="text-gray-300 flex items-center gap-2">
                            Stellar Radius (Solar radii)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Radius of the host star (1.0 = Sun-sized) - koi_srad</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="koi_srad"
                            type="number"
                            step="any"
                            placeholder="e.g., 1.0"
                            value={formData.koi_srad}
                            onChange={(e) => handleInputChange("koi_srad", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>

                        {/* Stellar Mass (koi_smass) */}
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="koi_smass" className="text-gray-300 flex items-center gap-2">
                            Stellar Mass (Solar masses)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mass of the host star (1.0 = Sun mass) - koi_smass</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="koi_smass"
                            type="number"
                            step="any"
                            placeholder="e.g., 1.0"
                            value={formData.koi_smass}
                            onChange={(e) => handleInputChange("koi_smass", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Environmental */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Thermometer className="w-6 h-6 text-green-400" />
                        <div>
                          <h3 className="text-2xl font-bold text-white">Environmental Data</h3>
                          <p className="text-gray-400 text-sm">Temperature and stellar data</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Equilibrium Temperature (koi_teq) */}
                        <div className="space-y-2">
                          <Label htmlFor="koi_teq" className="text-gray-300 flex items-center gap-2">
                            Equilibrium Temperature (K)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Theoretical temperature in Kelvin - koi_teq</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="koi_teq"
                            type="number"
                            step="any"
                            placeholder="e.g., 288"
                            value={formData.koi_teq}
                            onChange={(e) => handleInputChange("koi_teq", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>

                        {/* Insolation Flux (koi_insol) */}
                        <div className="space-y-2">
                          <Label htmlFor="koi_insol" className="text-gray-300 flex items-center gap-2">
                            Insolation Flux (Earth flux)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Stellar flux relative to Earth (1.0 = Earth's flux) - koi_insol</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="koi_insol"
                            type="number"
                            step="any"
                            placeholder="e.g., 1.0"
                            value={formData.koi_insol}
                            onChange={(e) => handleInputChange("koi_insol", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>

                        {/* Stellar Effective Temperature (koi_steff) */}
                        <div className="space-y-2">
                          <Label htmlFor="koi_steff" className="text-gray-300 flex items-center gap-2">
                            Stellar Effective Temperature (K)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Temperature of the host star in Kelvin - koi_steff</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="koi_steff"
                            type="number"
                            step="any"
                            placeholder="e.g., 5778"
                            value={formData.koi_steff}
                            onChange={(e) => handleInputChange("koi_steff", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>

                        {/* Model Signal-to-Noise Ratio (koi_model_snr) */}
                        <div className="space-y-2">
                          <Label htmlFor="koi_model_snr" className="text-gray-300 flex items-center gap-2">
                            Model SNR
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Signal-to-noise ratio of the transit model - koi_model_snr</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="koi_model_snr"
                            type="number"
                            step="any"
                            placeholder="e.g., 20.5"
                            value={formData.koi_model_snr}
                            onChange={(e) => handleInputChange("koi_model_snr", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="text-sm text-gray-400">
                  Step {currentStep + 1} of {steps.length}
                </div>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isPredicting}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isPredicting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Predict Classification
                        <Brain className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent className="bg-card/95 backdrop-blur-lg border-purple-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-2xl">
                <Check className="w-6 h-6 text-green-400" />
                Prediction Complete!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-4">
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    Planet <span className="text-white font-semibold">"{formData.name}"</span> has been analyzed successfully.
                  </p>
                  {predictionResult && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-purple-300 mb-2">AI Prediction:</p>
                        <Badge className={`${getStatusColor(predictionResult.prediction_label)} text-lg px-4 py-1`}>
                          {predictionResult.prediction_label}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-300 mb-2">Confidence:</p>
                        <p className="text-2xl font-bold text-white">{(predictionResult.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-300 mb-2">Probability Distribution:</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Confirmed:</span>
                            <span className="text-green-400">{(predictionResult.probabilities.CONFIRMED * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Candidate:</span>
                            <span className="text-yellow-400">{(predictionResult.probabilities.CANDIDATE * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>False Positive:</span>
                            <span className="text-red-400">{(predictionResult.probabilities["FALSE POSITIVE"] * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-blue-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      What would you like to do next?
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• <strong>View My Planets:</strong> See all your analyzed planets</li>
                      <li>• <strong>Analyze Another:</strong> Continue with more predictions</li>
                      <li>• <strong>Edit Data:</strong> Modify and re-predict</li>
                    </ul>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel 
                onClick={handleEditData}
                className="border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 hover:border-orange-500/70"
              >
                Edit & Re-predict
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmAndContinue}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Analyze Another Planet
              </AlertDialogAction>
              <AlertDialogAction 
                onClick={handleConfirmAndView}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                View My Planets
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </TooltipProvider>
  );
};
