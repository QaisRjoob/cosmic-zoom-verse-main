import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle, Sparkles } from "lucide-react";

interface Exoplanet {
  id: number;
  name: string;
  radius: number;
  orbitalPeriod: number;
  type: string;
  status: "confirmed" | "candidate" | "false-positive";
  distance: number;
}

const allExoplanets: Exoplanet[] = [
  // Confirmed - 25 planets
  { id: 1, name: "Kepler-442b", radius: 1.34, orbitalPeriod: 112.3, type: "Super Earth", status: "confirmed", distance: 1206 },
  { id: 2, name: "Proxima Centauri b", radius: 1.17, orbitalPeriod: 11.2, type: "Terrestrial", status: "confirmed", distance: 4.24 },
  { id: 3, name: "TRAPPIST-1e", radius: 0.92, orbitalPeriod: 6.1, type: "Terrestrial", status: "confirmed", distance: 39.5 },
  { id: 4, name: "TOI-700 d", radius: 1.19, orbitalPeriod: 37.4, type: "Super Earth", status: "confirmed", distance: 101.4 },
  { id: 5, name: "Kepler-186f", radius: 1.11, orbitalPeriod: 129.9, type: "Terrestrial", status: "confirmed", distance: 580 },
  { id: 6, name: "HD 40307 g", radius: 2.40, orbitalPeriod: 197.8, type: "Super Earth", status: "confirmed", distance: 42 },
  { id: 7, name: "Kepler-452b", radius: 1.63, orbitalPeriod: 384.8, type: "Super Earth", status: "confirmed", distance: 1402 },
  { id: 8, name: "Kepler-62f", radius: 1.41, orbitalPeriod: 267.3, type: "Super Earth", status: "confirmed", distance: 1200 },
  { id: 9, name: "Kepler-296e", radius: 1.75, orbitalPeriod: 34.1, type: "Super Earth", status: "confirmed", distance: 1726 },
  { id: 10, name: "Kepler-438b", radius: 1.12, orbitalPeriod: 35.2, type: "Terrestrial", status: "confirmed", distance: 473 },
  { id: 11, name: "Kepler-1649c", radius: 1.06, orbitalPeriod: 19.5, type: "Terrestrial", status: "confirmed", distance: 300 },
  { id: 12, name: "LHS 1140 b", radius: 1.43, orbitalPeriod: 24.7, type: "Super Earth", status: "confirmed", distance: 40.7 },
  { id: 13, name: "GJ 667 Cc", radius: 1.54, orbitalPeriod: 28.1, type: "Super Earth", status: "confirmed", distance: 23.6 },
  { id: 14, name: "K2-3d", radius: 1.51, orbitalPeriod: 44.6, type: "Super Earth", status: "confirmed", distance: 137 },
  { id: 15, name: "Wolf 1061c", radius: 1.64, orbitalPeriod: 17.9, type: "Super Earth", status: "confirmed", distance: 13.8 },
  { id: 16, name: "Kepler-283c", radius: 1.82, orbitalPeriod: 92.7, type: "Super Earth", status: "confirmed", distance: 1740 },
  { id: 17, name: "Kepler-440b", radius: 1.86, orbitalPeriod: 101.1, type: "Super Earth", status: "confirmed", distance: 851 },
  { id: 18, name: "Kepler-443b", radius: 2.34, orbitalPeriod: 177.7, type: "Mini Neptune", status: "confirmed", distance: 2540 },
  { id: 19, name: "Kepler-1229b", radius: 1.40, orbitalPeriod: 86.8, type: "Super Earth", status: "confirmed", distance: 870 },
  { id: 20, name: "Kepler-62e", radius: 1.61, orbitalPeriod: 122.4, type: "Super Earth", status: "confirmed", distance: 1200 },
  { id: 21, name: "Ross 128 b", radius: 1.10, orbitalPeriod: 9.9, type: "Terrestrial", status: "confirmed", distance: 11 },
  { id: 22, name: "Teegarden b", radius: 1.05, orbitalPeriod: 4.9, type: "Terrestrial", status: "confirmed", distance: 12.5 },
  { id: 23, name: "GJ 357 d", radius: 2.44, orbitalPeriod: 55.7, type: "Super Earth", status: "confirmed", distance: 31 },
  { id: 24, name: "TOI-715 b", radius: 1.55, orbitalPeriod: 19.3, type: "Super Earth", status: "confirmed", distance: 137 },
  { id: 25, name: "LTT 1445 A b", radius: 1.38, orbitalPeriod: 5.4, type: "Super Earth", status: "confirmed", distance: 22.5 },
  
  // Candidates - 25 planets
  { id: 26, name: "K2-18b", radius: 2.61, orbitalPeriod: 33.0, type: "Mini Neptune", status: "candidate", distance: 124 },
  { id: 27, name: "KOI-4878.01", radius: 1.89, orbitalPeriod: 449.3, type: "Super Earth", status: "candidate", distance: 1075 },
  { id: 28, name: "KOI-3284.01", radius: 1.52, orbitalPeriod: 290.5, type: "Super Earth", status: "candidate", distance: 892 },
  { id: 29, name: "KOI-5715.01", radius: 1.76, orbitalPeriod: 562.1, type: "Super Earth", status: "candidate", distance: 1450 },
  { id: 30, name: "KOI-2650.01", radius: 2.10, orbitalPeriod: 187.3, type: "Mini Neptune", status: "candidate", distance: 765 },
  { id: 31, name: "KOI-4742.01", radius: 1.67, orbitalPeriod: 325.8, type: "Super Earth", status: "candidate", distance: 1320 },
  { id: 32, name: "KOI-3010.01", radius: 1.44, orbitalPeriod: 229.4, type: "Super Earth", status: "candidate", distance: 940 },
  { id: 33, name: "KOI-5236.01", radius: 2.23, orbitalPeriod: 401.2, type: "Mini Neptune", status: "candidate", distance: 1580 },
  { id: 34, name: "KOI-1422.02", radius: 1.58, orbitalPeriod: 156.7, type: "Super Earth", status: "candidate", distance: 823 },
  { id: 35, name: "KOI-2418.01", radius: 1.93, orbitalPeriod: 267.9, type: "Super Earth", status: "candidate", distance: 1150 },
  { id: 36, name: "KOI-4054.01", radius: 2.05, orbitalPeriod: 198.3, type: "Mini Neptune", status: "candidate", distance: 995 },
  { id: 37, name: "KOI-1596.01", radius: 1.71, orbitalPeriod: 312.1, type: "Super Earth", status: "candidate", distance: 1425 },
  { id: 38, name: "KOI-2770.01", radius: 1.85, orbitalPeriod: 445.6, type: "Super Earth", status: "candidate", distance: 1670 },
  { id: 39, name: "KOI-3255.01", radius: 2.12, orbitalPeriod: 223.8, type: "Mini Neptune", status: "candidate", distance: 1045 },
  { id: 40, name: "KOI-4356.01", radius: 1.62, orbitalPeriod: 378.2, type: "Super Earth", status: "candidate", distance: 1389 },
  { id: 41, name: "KOI-3680.01", radius: 1.78, orbitalPeriod: 289.4, type: "Super Earth", status: "candidate", distance: 1202 },
  { id: 42, name: "KOI-5094.01", radius: 2.18, orbitalPeriod: 412.7, type: "Mini Neptune", status: "candidate", distance: 1534 },
  { id: 43, name: "KOI-2992.01", radius: 1.69, orbitalPeriod: 334.5, type: "Super Earth", status: "candidate", distance: 1278 },
  { id: 44, name: "KOI-4201.01", radius: 1.91, orbitalPeriod: 256.8, type: "Super Earth", status: "candidate", distance: 1098 },
  { id: 45, name: "KOI-3456.01", radius: 2.08, orbitalPeriod: 389.1, type: "Mini Neptune", status: "candidate", distance: 1456 },
  { id: 46, name: "KOI-5567.01", radius: 1.73, orbitalPeriod: 301.2, type: "Super Earth", status: "candidate", distance: 1311 },
  { id: 47, name: "KOI-3889.01", radius: 1.88, orbitalPeriod: 267.5, type: "Super Earth", status: "candidate", distance: 1187 },
  { id: 48, name: "KOI-4523.01", radius: 2.15, orbitalPeriod: 421.3, type: "Mini Neptune", status: "candidate", distance: 1598 },
  { id: 49, name: "KOI-3112.01", radius: 1.79, orbitalPeriod: 345.7, type: "Super Earth", status: "candidate", distance: 1345 },
  { id: 50, name: "KOI-4790.01", radius: 1.95, orbitalPeriod: 278.9, type: "Super Earth", status: "candidate", distance: 1223 },
  
  // False Positives - 25 planets
  { id: 51, name: "KOI-314.02", radius: 1.61, orbitalPeriod: 23.1, type: "Unknown", status: "false-positive", distance: 200 },
  { id: 52, name: "KOI-1686.01", radius: 2.98, orbitalPeriod: 16.5, type: "Unknown", status: "false-positive", distance: 520 },
  { id: 53, name: "KOI-4427.01", radius: 1.23, orbitalPeriod: 3.2, type: "Unknown", status: "false-positive", distance: 340 },
  { id: 54, name: "KOI-2474.01", radius: 3.45, orbitalPeriod: 8.7, type: "Unknown", status: "false-positive", distance: 890 },
  { id: 55, name: "KOI-1876.01", radius: 2.12, orbitalPeriod: 12.4, type: "Unknown", status: "false-positive", distance: 445 },
  { id: 56, name: "KOI-3567.01", radius: 1.89, orbitalPeriod: 7.8, type: "Unknown", status: "false-positive", distance: 678 },
  { id: 57, name: "KOI-4123.01", radius: 2.67, orbitalPeriod: 14.2, type: "Unknown", status: "false-positive", distance: 789 },
  { id: 58, name: "KOI-2890.01", radius: 1.54, orbitalPeriod: 5.6, type: "Unknown", status: "false-positive", distance: 567 },
  { id: 59, name: "KOI-5234.01", radius: 3.12, orbitalPeriod: 9.1, type: "Unknown", status: "false-positive", distance: 923 },
  { id: 60, name: "KOI-3901.01", radius: 1.76, orbitalPeriod: 6.3, type: "Unknown", status: "false-positive", distance: 412 },
  { id: 61, name: "KOI-4567.01", radius: 2.34, orbitalPeriod: 11.8, type: "Unknown", status: "false-positive", distance: 734 },
  { id: 62, name: "KOI-2345.01", radius: 1.92, orbitalPeriod: 8.2, type: "Unknown", status: "false-positive", distance: 598 },
  { id: 63, name: "KOI-5678.01", radius: 2.78, orbitalPeriod: 13.5, type: "Unknown", status: "false-positive", distance: 845 },
  { id: 64, name: "KOI-3234.01", radius: 1.67, orbitalPeriod: 4.9, type: "Unknown", status: "false-positive", distance: 478 },
  { id: 65, name: "KOI-4890.01", radius: 2.45, orbitalPeriod: 10.7, type: "Unknown", status: "false-positive", distance: 712 },
  { id: 66, name: "KOI-2567.01", radius: 1.83, orbitalPeriod: 7.1, type: "Unknown", status: "false-positive", distance: 534 },
  { id: 67, name: "KOI-5901.01", radius: 2.91, orbitalPeriod: 15.3, type: "Unknown", status: "false-positive", distance: 867 },
  { id: 68, name: "KOI-3456.02", radius: 1.58, orbitalPeriod: 5.2, type: "Unknown", status: "false-positive", distance: 389 },
  { id: 69, name: "KOI-4234.01", radius: 2.56, orbitalPeriod: 12.9, type: "Unknown", status: "false-positive", distance: 756 },
  { id: 70, name: "KOI-2901.01", radius: 1.74, orbitalPeriod: 6.8, type: "Unknown", status: "false-positive", distance: 623 },
  { id: 71, name: "KOI-5123.01", radius: 3.01, orbitalPeriod: 14.6, type: "Unknown", status: "false-positive", distance: 901 },
  { id: 72, name: "KOI-3789.01", radius: 1.95, orbitalPeriod: 8.9, type: "Unknown", status: "false-positive", distance: 645 },
  { id: 73, name: "KOI-4678.01", radius: 2.38, orbitalPeriod: 11.2, type: "Unknown", status: "false-positive", distance: 778 },
  { id: 74, name: "KOI-2678.01", radius: 1.69, orbitalPeriod: 5.7, type: "Unknown", status: "false-positive", distance: 501 },
  { id: 75, name: "KOI-5890.01", radius: 2.83, orbitalPeriod: 13.8, type: "Unknown", status: "false-positive", distance: 834 },
];

export const UniverseDiscoveries = () => {
  const [selectedTab, setSelectedTab] = useState<"confirmed" | "candidate" | "false-positive">("confirmed");
  const [showAll, setShowAll] = useState<Record<string, boolean>>({
    confirmed: false,
    candidate: false,
    "false-positive": false
  });

  const confirmedPlanets = allExoplanets.filter(p => p.status === "confirmed");
  const candidatePlanets = allExoplanets.filter(p => p.status === "candidate");
  const falsePositives = allExoplanets.filter(p => p.status === "false-positive");

  const getVisiblePlanets = (planets: Exoplanet[], category: string) => {
    return showAll[category] ? planets : planets.slice(0, 20);
  };

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-2 bg-background/30 rounded-lg border border-border/30 hover:border-primary/40 transition-all"
    >
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-xs">{planet.name}</h4>
        <Badge variant="outline" className={`text-[10px] px-1 py-0 ${getStatusColor(planet.status)}`}>
          {planet.status === "false-positive" ? "FP" : planet.status === "candidate" ? "CAN" : "CONF"}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
        <div><span className="font-medium">R:</span> {planet.radius} R⊕</div>
        <div><span className="font-medium">P:</span> {planet.orbitalPeriod}d</div>
        <div><span className="font-medium">Type:</span> {planet.type}</div>
        <div><span className="font-medium">Dist:</span> {planet.distance} ly</div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="absolute bottom-8 right-8 z-20 w-[420px]"
    >
      <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Exoplanet Classifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-3">
              <TabsTrigger value="confirmed" className="text-xs gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden sm:inline">Confirmed</span> ({confirmedPlanets.length})
              </TabsTrigger>
              <TabsTrigger value="candidate" className="text-xs gap-1">
                <AlertCircle className="w-3 h-3" />
                <span className="hidden sm:inline">Candidates</span> ({candidatePlanets.length})
              </TabsTrigger>
              <TabsTrigger value="false-positive" className="text-xs gap-1">
                <XCircle className="w-3 h-3" />
                <span className="hidden sm:inline">False</span> ({falsePositives.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="confirmed" className="mt-0">
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                {getVisiblePlanets(confirmedPlanets, "confirmed").map(renderPlanetCard)}
                {confirmedPlanets.length > 20 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setShowAll(prev => ({ ...prev, confirmed: !prev.confirmed }))}
                  >
                    {showAll.confirmed ? "Show Less" : `See More (${confirmedPlanets.length - 20} more)`}
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="candidate" className="mt-0">
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                {getVisiblePlanets(candidatePlanets, "candidate").map(renderPlanetCard)}
                {candidatePlanets.length > 20 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setShowAll(prev => ({ ...prev, candidate: !prev.candidate }))}
                  >
                    {showAll.candidate ? "Show Less" : `See More (${candidatePlanets.length - 20} more)`}
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="false-positive" className="mt-0">
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                {getVisiblePlanets(falsePositives, "false-positive").map(renderPlanetCard)}
                {falsePositives.length > 20 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setShowAll(prev => ({ ...prev, "false-positive": !prev["false-positive"] }))}
                  >
                    {showAll["false-positive"] ? "Show Less" : `See More (${falsePositives.length - 20} more)`}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
