import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ChevronRight, ChevronLeft, Sparkles, Globe, Orbit, Thermometer, Upload, Check, AlertCircle } from "lucide-react";
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
  orbitalPeriod: string;
  transitDuration: string;
  planetaryRadius: string;
  stellarRadius: string;
  equilibriumTemperature: string;
  insolationFlux: string;
  distanceFromStar: string;
  planetMass: string;
  detectionStatus: "confirmed" | "candidate" | "false-positive" | "";
  discoveryYear: string;
  discoveryMethod: string;
  notes: string;
}

const initialFormData: ExoplanetFormData = {
  name: "",
  orbitalPeriod: "",
  transitDuration: "",
  planetaryRadius: "",
  stellarRadius: "",
  equilibriumTemperature: "",
  insolationFlux: "",
  distanceFromStar: "",
  planetMass: "",
  detectionStatus: "",
  discoveryYear: "",
  discoveryMethod: "",
  notes: "",
};

export const ExoplanetDataEntry = ({ onSuccess }: ExoplanetDataEntryProps = {}) => {
  const [formData, setFormData] = useState<ExoplanetFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ExoplanetFormData, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);
  const { toast } = useToast();

  const steps = [
    { 
      id: 0, 
      title: "Planet Identity", 
      icon: Globe,
      description: "Basic information about the exoplanet",
      gradient: "from-blue-500/20 to-cyan-500/20",
      fields: ["name", "detectionStatus", "discoveryYear", "discoveryMethod"]
    },
    { 
      id: 1, 
      title: "Orbital Data", 
      icon: Orbit,
      description: "Orbital characteristics and period",
      gradient: "from-purple-500/20 to-pink-500/20",
      fields: ["orbitalPeriod", "transitDuration", "distanceFromStar"]
    },
    { 
      id: 2, 
      title: "Physical Properties", 
      icon: Sparkles,
      description: "Size, mass, and composition",
      gradient: "from-orange-500/20 to-yellow-500/20",
      fields: ["planetaryRadius", "planetMass", "stellarRadius"]
    },
    { 
      id: 3, 
      title: "Environmental", 
      icon: Thermometer,
      description: "Temperature and atmospheric data",
      gradient: "from-green-500/20 to-emerald-500/20",
      fields: ["equilibriumTemperature", "insolationFlux", "notes"]
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

    if (!formData.orbitalPeriod || parseFloat(formData.orbitalPeriod) <= 0) {
      newErrors.orbitalPeriod = "Valid orbital period is required (days)";
    }

    if (!formData.planetaryRadius || parseFloat(formData.planetaryRadius) <= 0) {
      newErrors.planetaryRadius = "Valid planetary radius is required";
    }

    if (!formData.detectionStatus) {
      newErrors.detectionStatus = "Detection status is required";
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

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const existingData = JSON.parse(localStorage.getItem("exoplanetData") || "[]");
      const newEntry = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      existingData.push(newEntry);
      localStorage.setItem("exoplanetData", JSON.stringify(existingData));

      setSavedData(newEntry);
      setShowConfirmation(true);

      toast({
        title: "Success!",
        description: `Exoplanet "${formData.name}" has been saved successfully.`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save exoplanet data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmAndContinue = () => {
    setShowConfirmation(false);
    setFormData(initialFormData);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const handleConfirmAndView = () => {
    setShowConfirmation(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleEditData = () => {
    setShowConfirmation(false);
    // Keep the form data so user can edit
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "candidate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "false-positive": return "bg-red-500/20 text-red-400 border-red-500/50";
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
                <Upload className="w-16 h-16 text-purple-400" />
              </motion.div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Exoplanet Discovery Portal
                </h2>
                <p className="text-gray-400 text-sm mt-1">Multi-step data entry wizard</p>
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
                          <p className="text-gray-400 text-sm">Basic information about the exoplanet</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Planet Name */}
                        <div className="space-y-2 col-span-2">
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

                        {/* Detection Status */}
                        <div className="space-y-2">
                          <Label htmlFor="detectionStatus" className="text-gray-300">
                            Detection Status *
                          </Label>
                          <Select
                            value={formData.detectionStatus}
                            onValueChange={(value) => handleInputChange("detectionStatus", value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">
                                <Badge className={getStatusColor("confirmed")}>Confirmed</Badge>
                              </SelectItem>
                              <SelectItem value="candidate">
                                <Badge className={getStatusColor("candidate")}>Candidate</Badge>
                              </SelectItem>
                              <SelectItem value="false-positive">
                                <Badge className={getStatusColor("false-positive")}>False Positive</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.detectionStatus && (
                            <p className="text-red-400 text-sm">{errors.detectionStatus}</p>
                          )}
                        </div>

                        {/* Discovery Year */}
                        <div className="space-y-2">
                          <Label htmlFor="discoveryYear" className="text-gray-300">
                            Discovery Year
                          </Label>
                          <Input
                            id="discoveryYear"
                            type="number"
                            placeholder="e.g., 2015"
                            value={formData.discoveryYear}
                            onChange={(e) => handleInputChange("discoveryYear", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>

                        {/* Discovery Method */}
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="discoveryMethod" className="text-gray-300">
                            Discovery Method
                          </Label>
                          <Select
                            value={formData.discoveryMethod}
                            onValueChange={(value) => handleInputChange("discoveryMethod", value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="transit">Transit</SelectItem>
                              <SelectItem value="radial-velocity">Radial Velocity</SelectItem>
                              <SelectItem value="direct-imaging">Direct Imaging</SelectItem>
                              <SelectItem value="microlensing">Microlensing</SelectItem>
                              <SelectItem value="astrometry">Astrometry</SelectItem>
                              <SelectItem value="ttv">Transit Timing Variation (TTV)</SelectItem>
                            </SelectContent>
                          </Select>
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
                        {/* Orbital Period */}
                        <div className="space-y-2">
                          <Label htmlFor="orbitalPeriod" className="text-gray-300 flex items-center gap-2">
                            Orbital Period (days) *
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Time taken for one complete orbit around the host star</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="orbitalPeriod"
                            type="number"
                            step="any"
                            placeholder="e.g., 365.25"
                            value={formData.orbitalPeriod}
                            onChange={(e) => handleInputChange("orbitalPeriod", e.target.value)}
                            className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                              errors.orbitalPeriod ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.orbitalPeriod && (
                            <p className="text-red-400 text-sm">{errors.orbitalPeriod}</p>
                          )}
                        </div>

                        {/* Transit Duration */}
                        <div className="space-y-2">
                          <Label htmlFor="transitDuration" className="text-gray-300 flex items-center gap-2">
                            Transit Duration (hours)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Duration of the planet's transit across the star's disk</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="transitDuration"
                            type="number"
                            step="any"
                            placeholder="e.g., 6.5"
                            value={formData.transitDuration}
                            onChange={(e) => handleInputChange("transitDuration", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>

                        {/* Distance from Star */}
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="distanceFromStar" className="text-gray-300 flex items-center gap-2">
                            Distance from Star (AU)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Semi-major axis of the orbit in Astronomical Units (1 AU = Earth-Sun distance)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="distanceFromStar"
                            type="number"
                            step="any"
                            placeholder="e.g., 1.0"
                            value={formData.distanceFromStar}
                            onChange={(e) => handleInputChange("distanceFromStar", e.target.value)}
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
                          <p className="text-gray-400 text-sm">Size, mass, and composition</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Planetary Radius */}
                        <div className="space-y-2">
                          <Label htmlFor="planetaryRadius" className="text-gray-300 flex items-center gap-2">
                            Planetary Radius (Earth radii) *
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Radius relative to Earth (1.0 = Earth-sized)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="planetaryRadius"
                            type="number"
                            step="any"
                            placeholder="e.g., 1.06"
                            value={formData.planetaryRadius}
                            onChange={(e) => handleInputChange("planetaryRadius", e.target.value)}
                            className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${
                              errors.planetaryRadius ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.planetaryRadius && (
                            <p className="text-red-400 text-sm">{errors.planetaryRadius}</p>
                          )}
                        </div>

                        {/* Planet Mass */}
                        <div className="space-y-2">
                          <Label htmlFor="planetMass" className="text-gray-300 flex items-center gap-2">
                            Planet Mass (Earth masses)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mass relative to Earth (1.0 = Earth mass)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="planetMass"
                            type="number"
                            step="any"
                            placeholder="e.g., 1.17"
                            value={formData.planetMass}
                            onChange={(e) => handleInputChange("planetMass", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>

                        {/* Stellar Radius */}
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="stellarRadius" className="text-gray-300 flex items-center gap-2">
                            Stellar Radius (Solar radii)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Radius of the host star relative to the Sun (1.0 = Sun-sized)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="stellarRadius"
                            type="number"
                            step="any"
                            placeholder="e.g., 1.0"
                            value={formData.stellarRadius}
                            onChange={(e) => handleInputChange("stellarRadius", e.target.value)}
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
                          <p className="text-gray-400 text-sm">Temperature and atmospheric conditions</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Equilibrium Temperature */}
                        <div className="space-y-2">
                          <Label htmlFor="equilibriumTemperature" className="text-gray-300 flex items-center gap-2">
                            Equilibrium Temperature (K)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Theoretical temperature assuming perfect heat distribution (Kelvin)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="equilibriumTemperature"
                            type="number"
                            step="any"
                            placeholder="e.g., 288"
                            value={formData.equilibriumTemperature}
                            onChange={(e) => handleInputChange("equilibriumTemperature", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>

                        {/* Insolation Flux */}
                        <div className="space-y-2">
                          <Label htmlFor="insolationFlux" className="text-gray-300 flex items-center gap-2">
                            Insolation Flux (Earth flux)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Stellar flux received relative to Earth (1.0 = Earth's insolation)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="insolationFlux"
                            type="number"
                            step="any"
                            placeholder="e.g., 1.0"
                            value={formData.insolationFlux}
                            onChange={(e) => handleInputChange("insolationFlux", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="notes" className="text-gray-300">
                            Additional Notes
                          </Label>
                          <Textarea
                            id="notes"
                            placeholder="Any additional observations or remarks..."
                            value={formData.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[120px]"
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
                    disabled={isSaving}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isSaving ? "Saving..." : "Submit Discovery"}
                    <Save className="w-4 h-4 ml-2" />
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
                Data Saved Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-4">
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    Exoplanet <span className="text-white font-semibold">"{savedData?.name}"</span> has been saved to your collection.
                  </p>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-purple-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      What would you like to do next?
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• <strong>View Details:</strong> See your planet on "My Planet" page</li>
                      <li>• <strong>Add Another:</strong> Continue adding more exoplanets</li>
                      <li>• <strong>Edit Data:</strong> Make changes to this entry</li>
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
                Edit Data
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmAndContinue}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Another Exoplanet
              </AlertDialogAction>
              <AlertDialogAction 
                onClick={handleConfirmAndView}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                View My Planet
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </TooltipProvider>
  );
};
