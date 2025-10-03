import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle, Sparkles } from "lucide-react";

interface Exoplanet {
  id: number;
  name: string;
  type: string;
  discovered: string;
  status: "confirmed" | "candidate" | "false-positive";
  color: string;
}

const allExoplanets: Exoplanet[] = [
  // Confirmed - 25 planets
  { id: 1, name: "Kepler-442b", type: "Super Earth", discovered: "2015", status: "confirmed", color: "#22c55e" },
  { id: 2, name: "Proxima Centauri b", type: "Terrestrial", discovered: "2016", status: "confirmed", color: "#16a34a" },
  { id: 3, name: "TRAPPIST-1e", type: "Terrestrial", discovered: "2017", status: "confirmed", color: "#15803d" },
  { id: 4, name: "TOI-700 d", type: "Super Earth", discovered: "2020", status: "confirmed", color: "#14532d" },
  { id: 5, name: "Kepler-186f", type: "Terrestrial", discovered: "2014", status: "confirmed", color: "#22c55e" },
  { id: 6, name: "HD 40307 g", type: "Super Earth", discovered: "2012", status: "confirmed", color: "#16a34a" },
  { id: 7, name: "Kepler-452b", type: "Super Earth", discovered: "2015", status: "confirmed", color: "#15803d" },
  { id: 8, name: "Kepler-62f", type: "Super Earth", discovered: "2013", status: "confirmed", color: "#14532d" },
  { id: 9, name: "Kepler-296e", type: "Super Earth", discovered: "2014", status: "confirmed", color: "#22c55e" },
  { id: 10, name: "Kepler-438b", type: "Terrestrial", discovered: "2015", status: "confirmed", color: "#16a34a" },
  { id: 11, name: "Kepler-1649c", type: "Terrestrial", discovered: "2020", status: "confirmed", color: "#15803d" },
  { id: 12, name: "LHS 1140 b", type: "Super Earth", discovered: "2017", status: "confirmed", color: "#14532d" },
  { id: 13, name: "GJ 667 Cc", type: "Super Earth", discovered: "2011", status: "confirmed", color: "#22c55e" },
  { id: 14, name: "K2-3d", type: "Super Earth", discovered: "2015", status: "confirmed", color: "#16a34a" },
  { id: 15, name: "Wolf 1061c", type: "Super Earth", discovered: "2015", status: "confirmed", color: "#15803d" },
  { id: 16, name: "Kepler-283c", type: "Super Earth", discovered: "2014", status: "confirmed", color: "#14532d" },
  { id: 17, name: "Kepler-440b", type: "Super Earth", discovered: "2015", status: "confirmed", color: "#22c55e" },
  { id: 18, name: "Kepler-443b", type: "Mini Neptune", discovered: "2015", status: "confirmed", color: "#16a34a" },
  { id: 19, name: "Kepler-1229b", type: "Super Earth", discovered: "2016", status: "confirmed", color: "#15803d" },
  { id: 20, name: "Kepler-62e", type: "Super Earth", discovered: "2013", status: "confirmed", color: "#14532d" },
  { id: 21, name: "Ross 128 b", type: "Terrestrial", discovered: "2017", status: "confirmed", color: "#22c55e" },
  { id: 22, name: "Teegarden b", type: "Terrestrial", discovered: "2019", status: "confirmed", color: "#16a34a" },
  { id: 23, name: "GJ 357 d", type: "Super Earth", discovered: "2019", status: "confirmed", color: "#15803d" },
  { id: 24, name: "TOI-715 b", type: "Super Earth", discovered: "2023", status: "confirmed", color: "#14532d" },
  { id: 25, name: "LTT 1445 A b", type: "Super Earth", discovered: "2019", status: "confirmed", color: "#22c55e" },
  
  // Candidates - 25 planets
  { id: 26, name: "K2-18b", type: "Mini Neptune", discovered: "2015", status: "candidate", color: "#eab308" },
  { id: 27, name: "KOI-4878.01", type: "Super Earth", discovered: "2018", status: "candidate", color: "#ca8a04" },
  { id: 28, name: "KOI-3284.01", type: "Super Earth", discovered: "2017", status: "candidate", color: "#a16207" },
  { id: 29, name: "KOI-5715.01", type: "Super Earth", discovered: "2019", status: "candidate", color: "#854d0e" },
  { id: 30, name: "KOI-2650.01", type: "Mini Neptune", discovered: "2016", status: "candidate", color: "#eab308" },
  { id: 31, name: "KOI-4742.01", type: "Super Earth", discovered: "2018", status: "candidate", color: "#ca8a04" },
  { id: 32, name: "KOI-3010.01", type: "Super Earth", discovered: "2017", status: "candidate", color: "#a16207" },
  { id: 33, name: "KOI-5236.01", type: "Mini Neptune", discovered: "2019", status: "candidate", color: "#854d0e" },
  { id: 34, name: "KOI-1422.02", type: "Super Earth", discovered: "2015", status: "candidate", color: "#eab308" },
  { id: 35, name: "KOI-2418.01", type: "Super Earth", discovered: "2016", status: "candidate", color: "#ca8a04" },
  { id: 36, name: "KOI-4054.01", type: "Mini Neptune", discovered: "2018", status: "candidate", color: "#a16207" },
  { id: 37, name: "KOI-1596.01", type: "Super Earth", discovered: "2015", status: "candidate", color: "#854d0e" },
  { id: 38, name: "KOI-2770.01", type: "Super Earth", discovered: "2017", status: "candidate", color: "#eab308" },
  { id: 39, name: "KOI-3255.01", type: "Mini Neptune", discovered: "2017", status: "candidate", color: "#ca8a04" },
  { id: 40, name: "KOI-4356.01", type: "Super Earth", discovered: "2018", status: "candidate", color: "#a16207" },
  { id: 41, name: "KOI-3680.01", type: "Super Earth", discovered: "2017", status: "candidate", color: "#854d0e" },
  { id: 42, name: "KOI-5094.01", type: "Mini Neptune", discovered: "2019", status: "candidate", color: "#eab308" },
  { id: 43, name: "KOI-2992.01", type: "Super Earth", discovered: "2017", status: "candidate", color: "#ca8a04" },
  { id: 44, name: "KOI-4201.01", type: "Super Earth", discovered: "2018", status: "candidate", color: "#a16207" },
  { id: 45, name: "KOI-3456.01", type: "Mini Neptune", discovered: "2017", status: "candidate", color: "#854d0e" },
  { id: 46, name: "KOI-5567.01", type: "Super Earth", discovered: "2019", status: "candidate", color: "#eab308" },
  { id: 47, name: "KOI-3889.01", type: "Super Earth", discovered: "2017", status: "candidate", color: "#ca8a04" },
  { id: 48, name: "KOI-4523.01", type: "Mini Neptune", discovered: "2018", status: "candidate", color: "#a16207" },
  { id: 49, name: "KOI-3112.01", type: "Super Earth", discovered: "2017", status: "candidate", color: "#854d0e" },
  { id: 50, name: "KOI-4790.01", type: "Super Earth", discovered: "2018", status: "candidate", color: "#eab308" },
  
  // False Positives - 25 planets
  { id: 51, name: "KOI-314.02", type: "Unknown", discovered: "2014", status: "false-positive", color: "#ef4444" },
  { id: 52, name: "KOI-1686.01", type: "Unknown", discovered: "2015", status: "false-positive", color: "#dc2626" },
  { id: 53, name: "KOI-4427.01", type: "Unknown", discovered: "2018", status: "false-positive", color: "#b91c1c" },
  { id: 54, name: "KOI-2474.01", type: "Unknown", discovered: "2016", status: "false-positive", color: "#991b1b" },
  { id: 55, name: "KOI-1876.01", type: "Unknown", discovered: "2015", status: "false-positive", color: "#ef4444" },
  { id: 56, name: "KOI-3567.01", type: "Unknown", discovered: "2017", status: "false-positive", color: "#dc2626" },
  { id: 57, name: "KOI-4123.01", type: "Unknown", discovered: "2018", status: "false-positive", color: "#b91c1c" },
  { id: 58, name: "KOI-2890.01", type: "Unknown", discovered: "2016", status: "false-positive", color: "#991b1b" },
  { id: 59, name: "KOI-5234.01", type: "Unknown", discovered: "2019", status: "false-positive", color: "#ef4444" },
  { id: 60, name: "KOI-3901.01", type: "Unknown", discovered: "2017", status: "false-positive", color: "#dc2626" },
  { id: 61, name: "KOI-4567.01", type: "Unknown", discovered: "2018", status: "false-positive", color: "#b91c1c" },
  { id: 62, name: "KOI-2345.01", type: "Unknown", discovered: "2016", status: "false-positive", color: "#991b1b" },
  { id: 63, name: "KOI-5678.01", type: "Unknown", discovered: "2019", status: "false-positive", color: "#ef4444" },
  { id: 64, name: "KOI-3234.01", type: "Unknown", discovered: "2017", status: "false-positive", color: "#dc2626" },
  { id: 65, name: "KOI-4890.01", type: "Unknown", discovered: "2018", status: "false-positive", color: "#b91c1c" },
  { id: 66, name: "KOI-2567.01", type: "Unknown", discovered: "2016", status: "false-positive", color: "#991b1b" },
  { id: 67, name: "KOI-5901.01", type: "Unknown", discovered: "2019", status: "false-positive", color: "#ef4444" },
  { id: 68, name: "KOI-3456.02", type: "Unknown", discovered: "2017", status: "false-positive", color: "#dc2626" },
  { id: 69, name: "KOI-4234.01", type: "Unknown", discovered: "2018", status: "false-positive", color: "#b91c1c" },
  { id: 70, name: "KOI-2901.01", type: "Unknown", discovered: "2016", status: "false-positive", color: "#991b1b" },
  { id: 71, name: "KOI-5123.01", type: "Unknown", discovered: "2019", status: "false-positive", color: "#ef4444" },
  { id: 72, name: "KOI-3789.01", type: "Unknown", discovered: "2017", status: "false-positive", color: "#dc2626" },
  { id: 73, name: "KOI-4678.01", type: "Unknown", discovered: "2018", status: "false-positive", color: "#b91c1c" },
  { id: 74, name: "KOI-2678.01", type: "Unknown", discovered: "2016", status: "false-positive", color: "#991b1b" },
  { id: 75, name: "KOI-5890.01", type: "Unknown", discovered: "2019", status: "false-positive", color: "#ef4444" },
];

export const UniverseExoplanets = () => {
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

  const getIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle2 className="w-4 h-4" />;
      case "candidate": return <AlertCircle className="w-4 h-4" />;
      case "false-positive": return <XCircle className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const renderPlanetCard = (planet: Exoplanet) => (
    <motion.div
      key={planet.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden hover:border-primary/50 transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {getIcon(planet.status)}
            {planet.status === "confirmed" ? "Confirmed" : planet.status === "candidate" ? "Candidate" : "False Positive"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-4">
          {/* Glowing planet sphere */}
          <div 
            className="relative w-24 h-24 rounded-full mb-3"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}dd 50%, ${planet.color}66)`,
              boxShadow: `0 0 30px ${planet.color}88, 0 0 60px ${planet.color}44, inset 0 0 20px ${planet.color}33`
            }}
          >
            {/* Inner glow effect */}
            <div 
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                background: `radial-gradient(circle at 60% 60%, transparent 40%, ${planet.color}44)`
              }}
            />
          </div>
          
          {/* Planet name */}
          <h3 className="font-bold text-lg text-white mb-1 text-center">
            {planet.name}
          </h3>
          
          {/* Subtitle */}
          <p className="text-sm text-muted-foreground text-center">
            {planet.type} • Discovered {planet.discovered}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const currentPlanets = 
    selectedTab === "confirmed" ? confirmedPlanets :
    selectedTab === "candidate" ? candidatePlanets : 
    falsePositives;

  return (
    <>
      {/* Tabs at the top center - below Dashboard cards */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute top-28 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
      >
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
          <TabsList className="inline-flex h-auto bg-card/95 backdrop-blur-xl border-2 border-primary/40 shadow-2xl p-1 gap-1 rounded-lg">
            <TabsTrigger value="confirmed" className="text-sm gap-2 px-4 py-2 rounded-md data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border data-[state=active]:border-green-500/50 data-[state=active]:shadow-lg">
              <CheckCircle2 className="w-4 h-4" />
              Confirmed ({confirmedPlanets.length})
            </TabsTrigger>
            <TabsTrigger value="candidate" className="text-sm gap-2 px-4 py-2 rounded-md data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 data-[state=active]:border data-[state=active]:border-yellow-500/50 data-[state=active]:shadow-lg">
              <AlertCircle className="w-4 h-4" />
              Candidates ({candidatePlanets.length})
            </TabsTrigger>
            <TabsTrigger value="false-positive" className="text-sm gap-2 px-4 py-2 rounded-md data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=active]:border data-[state=active]:border-red-500/50 data-[state=active]:shadow-lg">
              <XCircle className="w-4 h-4" />
              False Positives ({falsePositives.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Planet cards grid - centered below tabs */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none pt-44 pb-28"
      >
        <div className="max-w-[1200px] max-h-[50vh] overflow-y-auto px-8 pointer-events-auto">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {getVisiblePlanets(currentPlanets, selectedTab).map(renderPlanetCard)}
          </div>
          
          {/* See More button */}
          {currentPlanets.length > 20 && (
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-card/90 backdrop-blur-lg border-border/50"
                onClick={() => setShowAll(prev => ({ ...prev, [selectedTab]: !prev[selectedTab] }))}
              >
                {showAll[selectedTab] ? "Show Less" : `See More (${currentPlanets.length - 20} more)`}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
