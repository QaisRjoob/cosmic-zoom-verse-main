import { SpaceBackground3D } from "@/components/SpaceBackground3D";
import { ExoplanetDataEntry } from "@/components/ExoplanetDataEntry";

export const ExoplanetPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* 3D Space Background */}
      <SpaceBackground3D />
      
      {/* Main Content */}
      <div className="relative z-10">
        <ExoplanetDataEntry />
      </div>
    </div>
  );
};
