import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2, Eye, Globe, Calendar, Sparkles, AlertCircle, Loader2, RefreshCw, Orbit } from "lucide-react";
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

interface SavedPlanet {
  planet_id: string;
  koi_name: string;
  koi_period: number;
  koi_time0bk?: number;
  koi_impact?: number;
  koi_duration?: number;
  koi_depth: number;
  koi_prad: number;
  koi_teq: number;
  koi_insol: number;
  koi_steff: number;
  koi_slogg?: number;
  koi_srad: number;
  koi_kepmag?: number;
  koi_model_snr?: number;
  disposition: string;
  notes?: string;
  submitted_by?: string;
  submitted_at: string;
  additional_features?: any;
}

export const MyPlanets = () => {
  const [planets, setPlanets] = useState<SavedPlanet[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<SavedPlanet | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlanets();
  }, []);

  const loadPlanets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/planets");
      if (!response.ok) {
        throw new Error("Failed to fetch planets");
      }
      const data = await response.json();
      // The API returns an array of planets directly or in a data property
      const planetsData = Array.isArray(data) ? data : (data.planets || data.data || []);
      setPlanets(planetsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load planets");
      console.error("Error loading planets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlanet = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/planets/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete planet");
      }
      
      // Refresh the list
      await loadPlanets();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting planet:", err);
      setError(err instanceof Error ? err.message : "Failed to delete planet");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "CANDIDATE":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "FALSE POSITIVE":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const viewDetails = (planet: SavedPlanet) => {
    setSelectedPlanet(planet);
    setShowDetails(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            My Planets Collection
          </h1>
          <p className="text-gray-400">
            All your saved exoplanet observations and data
          </p>
        </div>
        <Button
          onClick={loadPlanets}
          disabled={isLoading}
          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      {error && (
        <Card className="border-red-500/20 bg-black/40 backdrop-blur-lg mb-6">
          <CardContent className="py-6">
            <div className="flex items-center gap-2 text-red-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
            <Button
              onClick={loadPlanets}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
          <CardContent className="py-16 text-center">
            <Loader2 className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Loading planets...
            </h3>
            <p className="text-gray-400">
              Fetching your planet collection from the database
            </p>
          </CardContent>
        </Card>
      ) : planets.length === 0 ? (
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
          <CardContent className="py-16 text-center">
            <Globe className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No planets saved yet
            </h3>
            <p className="text-gray-400 mb-4">
              Start by saving your first exoplanet observation!
            </p>
            <Button
              onClick={() => window.location.href = '/exoplanet'}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Add Your First Planet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 text-gray-400 text-sm">
            Showing {planets.length} planet{planets.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planets.map((planet, index) => (
              <motion.div
                key={planet.planet_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg hover:border-purple-500/40 transition-all h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-white mb-2 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                          <span className="truncate">{planet.koi_name}</span>
                        </CardTitle>
                        <div className="flex flex-col gap-2">
                          <Badge className={getStatusColor(planet.disposition)}>
                            {planet.disposition}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            ID: {planet.planet_id}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(planet.planet_id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/5 p-2 rounded">
                        <p className="text-gray-400 text-xs">Orbital Period</p>
                        <p className="text-white font-medium">
                          {planet.koi_period ? `${planet.koi_period.toFixed(2)} days` : "N/A"}
                        </p>
                      </div>
                      <div className="bg-white/5 p-2 rounded">
                        <p className="text-gray-400 text-xs">Radius</p>
                        <p className="text-white font-medium">
                          {planet.koi_prad ? `${planet.koi_prad.toFixed(2)} R⊕` : "N/A"}
                        </p>
                      </div>
                      <div className="bg-white/5 p-2 rounded">
                        <p className="text-gray-400 text-xs">Temperature</p>
                        <p className="text-white font-medium">
                          {planet.koi_teq ? `${planet.koi_teq.toFixed(0)} K` : "N/A"}
                        </p>
                      </div>
                      <div className="bg-white/5 p-2 rounded">
                        <p className="text-gray-400 text-xs">Transit Depth</p>
                        <p className="text-white font-medium">
                          {planet.koi_depth ? `${planet.koi_depth.toFixed(0)} ppm` : "N/A"}
                        </p>
                      </div>
                    </div>

                    {planet.submitted_by && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>By: {planet.submitted_by}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(planet.submitted_at).toLocaleDateString()}
                      </div>
                      <span>{new Date(planet.submitted_at).toLocaleTimeString()}</span>
                    </div>

                    <Button
                      onClick={() => viewDetails(planet)}
                      className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Details Dialog */}
      <AlertDialog open={showDetails} onOpenChange={setShowDetails}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-lg border-purple-500/30 max-w-3xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <Globe className="w-6 h-6 text-purple-400" />
              {selectedPlanet?.koi_name}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-4">
              {selectedPlanet && (
                <div className="space-y-6">
                  {/* Header Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge
                        className={`${getStatusColor(
                          selectedPlanet.disposition
                        )} text-lg px-4 py-1`}
                      >
                        {selectedPlanet.disposition}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400">
                      <div>Planet ID: <span className="text-white">{selectedPlanet.planet_id}</span></div>
                      <div>KOI Name: <span className="text-white">{selectedPlanet.koi_name}</span></div>
                    </div>
                  </div>

                  {/* Orbital Parameters */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <Orbit className="w-5 h-5" />
                      Orbital Parameters
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Orbital Period</p>
                        <p className="text-white text-lg font-semibold">
                          {selectedPlanet.koi_period?.toFixed(6)} days
                        </p>
                      </div>
                      {selectedPlanet.koi_time0bk !== undefined && selectedPlanet.koi_time0bk !== 0 && (
                        <div>
                          <p className="text-gray-400">Time of First Transit</p>
                          <p className="text-white text-lg font-semibold">
                            {selectedPlanet.koi_time0bk.toFixed(4)} BKJD
                          </p>
                        </div>
                      )}
                      {selectedPlanet.koi_duration !== undefined && selectedPlanet.koi_duration !== 0 && (
                        <div>
                          <p className="text-gray-400">Transit Duration</p>
                          <p className="text-white text-lg font-semibold">
                            {selectedPlanet.koi_duration.toFixed(3)} hours
                          </p>
                        </div>
                      )}
                      {selectedPlanet.koi_impact !== undefined && selectedPlanet.koi_impact !== 0 && (
                        <div>
                          <p className="text-gray-400">Impact Parameter</p>
                          <p className="text-white text-lg font-semibold">
                            {selectedPlanet.koi_impact.toFixed(4)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Planet Physical Properties */}
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Planetary Properties
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Planet Radius</p>
                        <p className="text-white text-lg font-semibold">
                          {selectedPlanet.koi_prad?.toFixed(4)} R⊕
                        </p>
                        <p className="text-xs text-gray-500">Earth radii</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Transit Depth</p>
                        <p className="text-white text-lg font-semibold">
                          {selectedPlanet.koi_depth?.toFixed(2)} ppm
                        </p>
                        <p className="text-xs text-gray-500">Parts per million</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Equilibrium Temperature</p>
                        <p className="text-white text-lg font-semibold">
                          {selectedPlanet.koi_teq?.toFixed(1)} K
                        </p>
                        <p className="text-xs text-gray-500">Kelvin</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Insolation Flux</p>
                        <p className="text-white text-lg font-semibold">
                          {selectedPlanet.koi_insol?.toFixed(3)} F⊕
                        </p>
                        <p className="text-xs text-gray-500">Earth flux</p>
                      </div>
                      {selectedPlanet.koi_model_snr !== undefined && selectedPlanet.koi_model_snr !== 0 && (
                        <div>
                          <p className="text-gray-400">Model Signal-to-Noise</p>
                          <p className="text-white text-lg font-semibold">
                            {selectedPlanet.koi_model_snr.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stellar Properties */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Host Star Properties
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Effective Temperature</p>
                        <p className="text-white text-lg font-semibold">
                          {selectedPlanet.koi_steff?.toFixed(0)} K
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Stellar Radius</p>
                        <p className="text-white text-lg font-semibold">
                          {selectedPlanet.koi_srad?.toFixed(4)} R☉
                        </p>
                        <p className="text-xs text-gray-500">Solar radii</p>
                      </div>
                      {selectedPlanet.koi_slogg !== undefined && selectedPlanet.koi_slogg !== 0 && (
                        <div>
                          <p className="text-gray-400">Surface Gravity (log g)</p>
                          <p className="text-white text-lg font-semibold">
                            {selectedPlanet.koi_slogg.toFixed(3)}
                          </p>
                          <p className="text-xs text-gray-500">cgs units</p>
                        </div>
                      )}
                      {selectedPlanet.koi_kepmag !== undefined && selectedPlanet.koi_kepmag !== 0 && (
                        <div>
                          <p className="text-gray-400">Kepler Magnitude</p>
                          <p className="text-white text-lg font-semibold">
                            {selectedPlanet.koi_kepmag.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-300 mb-3">
                      Observation Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      {selectedPlanet.submitted_by && (
                        <div>
                          <p className="text-gray-400">Submitted By</p>
                          <p className="text-white font-medium">{selectedPlanet.submitted_by}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-400">Submission Date & Time</p>
                        <p className="text-white font-medium">
                          {new Date(selectedPlanet.submitted_at).toLocaleString('en-US', {
                            dateStyle: 'full',
                            timeStyle: 'long'
                          })}
                        </p>
                      </div>
                      {selectedPlanet.notes && (
                        <div>
                          <p className="text-gray-400">Notes</p>
                          <p className="text-white bg-black/20 p-3 rounded mt-1">
                            {selectedPlanet.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowDetails(false)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteConfirm !== null}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent className="bg-card/95 backdrop-blur-lg border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Delete Planet?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this planet observation? This action
              cannot be undone and all data will be permanently removed from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && deletePlanet(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
