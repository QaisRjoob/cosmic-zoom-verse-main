import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Globe2, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Exoplanet {
  id: number;
  name: string;
  radius: number;
  orbitalPeriod: number;
  type: string;
  status: "confirmed" | "candidate" | "false-positive";
  distance: number;
}

const mockExoplanets: Exoplanet[] = [
  { id: 1, name: "Kepler-442b", radius: 1.34, orbitalPeriod: 112.3, type: "Super Earth", status: "confirmed", distance: 1206 },
  { id: 2, name: "Proxima Centauri b", radius: 1.17, orbitalPeriod: 11.2, type: "Terrestrial", status: "confirmed", distance: 4.24 },
  { id: 3, name: "TRAPPIST-1e", radius: 0.92, orbitalPeriod: 6.1, type: "Terrestrial", status: "confirmed", distance: 39.5 },
  { id: 4, name: "TOI-700 d", radius: 1.19, orbitalPeriod: 37.4, type: "Super Earth", status: "confirmed", distance: 101.4 },
  { id: 5, name: "K2-18b", radius: 2.61, orbitalPeriod: 33.0, type: "Mini Neptune", status: "candidate", distance: 124 },
];

export const ExoplanetExplorer = () => {
  const [search, setSearch] = useState("");
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);

  const filteredPlanets = mockExoplanets.filter(planet =>
    planet.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "candidate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "false-positive": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-orange-400" />
            Exoplanet Explorer
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search exoplanets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {filteredPlanets.map((planet) => (
                <motion.div
                  key={planet.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-background/50 rounded-lg border border-border/50 cursor-pointer hover:border-purple-500/50 transition-all"
                  onClick={() => setSelectedPlanet(planet)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        {planet.name}
                        <Badge variant="outline" className={`text-xs ${getStatusColor(planet.status)}`}>
                          {planet.status}
                        </Badge>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
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
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {selectedPlanet && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30"
            >
              <h5 className="font-semibold text-sm mb-2">Selected: {selectedPlanet.name}</h5>
              <p className="text-xs text-muted-foreground">
                AI Confidence: <span className="text-green-400 font-semibold">94.7%</span>
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
