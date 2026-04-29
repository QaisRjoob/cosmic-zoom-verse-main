import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { exoplanetAPI, DatasetInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DataUploadSectionProps {
  onNavigateToTemplate?: () => void;
  compact?: boolean;
  inline?: boolean;
  onUploadSuccess?: () => void;
}

export const DataUploadSection = ({ onNavigateToTemplate, compact = false, inline = false, onUploadSuccess }: DataUploadSectionProps = {}) => {
  const [file, setFile] = useState<File | null>(null);
  const [cleanData, setCleanData] = useState(true);
  const [trainTestSplit, setTrainTestSplit] = useState([80]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      setUploaded(false);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  }, [toast]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Use the new CSV prediction endpoint
      const result = await exoplanetAPI.predictCSV(file, 10000);
      
      setDatasetInfo({
        total_rows: result.total_count,
        total_columns: 0,
        columns: [],
        missing_values: {},
        sample_data: []
      });
      setUploaded(true);
      
      // Mark that CSV was uploaded
      localStorage.setItem("csvUploaded", "true");
      
      // Transform API predictions to exoplanet format
      const userExoplanets = result.predictions.map((pred, index) => {
        const statusMap: { [key: string]: "confirmed" | "candidate" | "false-positive" } = {
          "CONFIRMED": "confirmed",
          "1": "confirmed",
          "CANDIDATE": "candidate",
          "2": "candidate",
          "FALSE POSITIVE": "false-positive",
          "0": "false-positive"
        };
        
        const status = statusMap[pred.prediction_label] || statusMap[pred.prediction] || "candidate";
        
        const colorMap = {
          "confirmed": "#22c55e",
          "candidate": "#eab308",
          "false-positive": "#ef4444"
        };
        
        return {
          id: index + 1000,
          name: `KOI-${1000 + index}`,
          type: status === "confirmed" ? "Super Earth" : status === "candidate" ? "Candidate" : "Unknown",
          discovered: "2024",
          status: status,
          color: colorMap[status],
          confidence: pred.confidence,
          probabilities: pred.probabilities
        };
      });
      
      localStorage.setItem("uploadedExoplanets", JSON.stringify(userExoplanets));
      
      toast({
        title: "Upload Successful!",
        description: `Processed ${result.total_count} rows. Success: ${result.success_count}, Failed: ${result.failed_count}`,
      });
      
      // Navigate to Universe page after upload
      if (onUploadSuccess) {
        setTimeout(() => onUploadSuccess(), 1500);
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={inline ? 'w-full' : `absolute top-24 right-8 z-20 ${compact ? 'w-80' : 'w-96'}`}
    >
      <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl">
        <CardHeader className={compact ? 'pb-3' : ''}>
          <CardTitle className={`flex items-center gap-2 ${compact ? 'text-base' : ''}`}>
            <Upload className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-purple-400`} />
            Upload Dataset
          </CardTitle>
        </CardHeader>
        <CardContent className={compact ? 'space-y-3' : 'space-y-4'}>
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={() => document.getElementById('file-upload')?.click()}
            className={`border-2 border-dashed border-border/50 rounded-lg ${compact ? 'p-6' : 'p-8'} text-center hover:border-purple-500/50 transition-all cursor-pointer bg-background/30`}
          >
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div className="space-y-2">
                {uploaded ? (
                  <CheckCircle className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} mx-auto text-green-400`} />
                ) : (
                  <FileText className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} mx-auto text-blue-400`} />
                )}
                <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium`}>{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                {uploaded && datasetInfo && (
                  <p className="text-xs text-green-400">
                    ✓ {datasetInfo.total_rows} rows loaded
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} mx-auto text-muted-foreground`} />
                <p className={compact ? 'text-xs' : 'text-sm'}>Drag & drop NASA CSV file</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
              </div>
            )}
          </div>

          {!compact && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="clean-data" className="text-sm">Auto-clean data</Label>
                <Switch
                  id="clean-data"
                  checked={cleanData}
                  onCheckedChange={setCleanData}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Train/Test Split: {trainTestSplit[0]}%</Label>
                <Slider
                  value={trainTestSplit}
                  onValueChange={setTrainTestSplit}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || uploading || uploaded}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50 disabled:opacity-50"
            size={compact ? 'default' : 'lg'}
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : uploaded ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Uploaded Successfully
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Upload & Process
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Add Data from Template Button */}
          <Button
            onClick={onNavigateToTemplate}
            variant="outline"
            className="w-full border-green-500/50 bg-green-500/10 hover:bg-green-500/20 hover:border-green-500/70 shadow-lg shadow-green-500/20"
            size={compact ? 'default' : 'lg'}
          >
            <Edit className="w-4 h-4 mr-2" />
            Add Data from Template
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
