import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle, Globe2 } from "lucide-react";

interface Exoplanet {
  id: number;
  name: string;
  radius: number;
  orbitalPeriod: number;
  type: string;
  status: "confirmed" | "candidate" | "false-positive";
  distance: number;
  mass?: number;
  temperature?: number;
}

const allExoplanets: Exoplanet[] = [
  // Confirmed
  { id: 1, name: "Kepler-442b", radius: 1.34, orbitalPeriod: 112.3, type: "Super Earth", status: "confirmed", distance: 1206, mass: 2.36, temperature: 233 },
  { id: 2, name: "Proxima Centauri b", radius: 1.17, orbitalPeriod: 11.2, type: "Terrestrial", status: "confirmed", distance: 4.24, mass: 1.27, temperature: 234 },
  { id: 3, name: "TRAPPIST-1e", radius: 0.92, orbitalPeriod: 6.1, type: "Terrestrial", status: "confirmed", distance: 39.5, mass: 0.62, temperature: 251 },
  { id: 4, name: "TOI-700 d", radius: 1.19, orbitalPeriod: 37.4, type: "Super Earth", status: "confirmed", distance: 101.4, mass: 1.72, temperature: 268 },
  { id: 5, name: "Kepler-186f", radius: 1.11, orbitalPeriod: 129.9, type: "Terrestrial", status: "confirmed", distance: 580, mass: 1.44, temperature: 188 },
  { id: 6, name: "HD 40307 g", radius: 2.40, orbitalPeriod: 197.8, type: "Super Earth", status: "confirmed", distance: 42, mass: 7.1, temperature: 227 },
  
  // Candidates
  { id: 7, name: "K2-18b", radius: 2.61, orbitalPeriod: 33.0, type: "Mini Neptune", status: "candidate", distance: 124, mass: 8.63, temperature: 265 },
  { id: 8, name: "KOI-4878.01", radius: 1.89, orbitalPeriod: 449.3, type: "Super Earth", status: "candidate", distance: 1075, mass: 5.2, temperature: 203 },
  { id: 9, name: "KOI-3284.01", radius: 1.52, orbitalPeriod: 290.5, type: "Super Earth", status: "candidate", distance: 892, mass: 3.1, temperature: 215 },
  { id: 10, name: "KOI-5715.01", radius: 1.76, orbitalPeriod: 562.1, type: "Super Earth", status: "candidate", distance: 1450, mass: 4.4, temperature: 198 },
  { id: 11, name: "KOI-2650.01", radius: 2.10, orbitalPeriod: 187.3, type: "Mini Neptune", status: "candidate", distance: 765, mass: 6.8, temperature: 231 },
  
  // False Positives
  { id: 12, name: "KOI-314.02", radius: 1.61, orbitalPeriod: 23.1, type: "Unknown", status: "false-positive", distance: 200, temperature: 410 },
  { id: 13, name: "KOI-1686.01", radius: 2.98, orbitalPeriod: 16.5, type: "Unknown", status: "false-positive", distance: 520, temperature: 680 },
  { id: 14, name: "KOI-4427.01", radius: 1.23, orbitalPeriod: 3.2, type: "Unknown", status: "false-positive", distance: 340, temperature: 1200 },
  { id: 15, name: "KOI-2474.01", radius: 3.45, orbitalPeriod: 8.7, type: "Unknown", status: "false-positive", distance: 890, temperature: 920 },
];

export const UniverseClassification = () => {
  const [selectedTab, setSelectedTab] = useState<"confirmed" | "candidate" | "false-positive">("confirmed");
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);

  const confirmedPlanets = allExoplanets.filter(p => p.status === "confirmed");
  const candidatePlanets = allExoplanets.filter(p => p.status === "candidate");
  const falsePositives = allExoplanets.filter(p => p.status === "false-positive");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "candidate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "false-positive": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const renderPlanetCard = (planet: Exoplanet) => (
    <motion.div
      key={planet.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`p-3 bg-background/50 rounded-lg border cursor-pointer transition-all ${
        selectedPlanet?.id === planet.id
          ? "border-primary shadow-lg shadow-primary/20"
          : "border-border/50 hover:border-primary/50"
      }`}
      onClick={() => setSelectedPlanet(planet)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm">{planet.name}</h4>
        <Badge variant="outline" className={`text-xs ${getStatusColor(planet.status)}`}>
          {planet.status}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>
          <span className="font-medium">Radius:</span> {planet.radius} R⊕
        </div>
        <div>
          <span className="font-medium">Period:</span> {planet.orbitalPeriod}d
        </div>
        <div>
          <span className="font-medium">Type:</span> {planet.type}
        </div>
        <div>
          <span className="font-medium">Distance:</span> {planet.distance} ly
        </div>
        {planet.mass && (
          <div>
            <span className="font-medium">Mass:</span> {planet.mass} M⊕
          </div>
        )}
        {planet.temperature && (
          <div>
            <span className="font-medium">Temp:</span> {planet.temperature}K
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Tabs at the top center */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
      >
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
          <TabsList className="bg-card/90 backdrop-blur-lg border border-border/50 shadow-xl">
            <TabsTrigger value="confirmed" className="text-xs gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Confirmed ({confirmedPlanets.length})
            </TabsTrigger>
            <TabsTrigger value="candidate" className="text-xs gap-1">
              <AlertCircle className="w-4 h-4" />
              Candidates ({candidatePlanets.length})
            </TabsTrigger>
            <TabsTrigger value="false-positive" className="text-xs gap-1">
              <XCircle className="w-4 h-4" />
              False ({falsePositives.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Planet cards in the center */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute top-28 left-1/2 -translate-x-1/2 z-20 w-[450px]"
      >
        <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-purple-400" />
              Exoplanet Classification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
              <TabsContent value="confirmed" className="mt-0">
                <ScrollArea className="h-80">
                  <div className="space-y-2 pr-4">
                    {confirmedPlanets.map(renderPlanetCard)}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="candidate" className="mt-0">
                <ScrollArea className="h-80">
                  <div className="space-y-2 pr-4">
                    {candidatePlanets.map(renderPlanetCard)}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="false-positive" className="mt-0">
                <ScrollArea className="h-80">
                  <div className="space-y-2 pr-4">
                    {falsePositives.map(renderPlanetCard)}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>

            {selectedPlanet && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30"
              >
                <h5 className="font-semibold text-sm mb-2">Selected: {selectedPlanet.name}</h5>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Classification: <span className={`font-semibold ${
                    selectedPlanet.status === "confirmed" ? "text-green-400" :
                    selectedPlanet.status === "candidate" ? "text-yellow-400" : "text-red-400"
                  }`}>{selectedPlanet.status.toUpperCase()}</span></p>
                  <p>AI Confidence: <span className="text-blue-400 font-semibold">
                    {selectedPlanet.status === "confirmed" ? "96.8%" : 
                     selectedPlanet.status === "candidate" ? "74.2%" : "12.5%"}%
                  </span></p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};
