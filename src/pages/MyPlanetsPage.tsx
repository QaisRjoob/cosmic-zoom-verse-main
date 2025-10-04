import { SpaceBackground3D } from "@/components/SpaceBackground3D";
import { MyPlanets } from "@/components/MyPlanets";

export const MyPlanetsPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* 3D Space Background */}
      <SpaceBackground3D />
      
      {/* Main Content */}
      <div className="relative z-10">
        <MyPlanets />
      </div>
    </div>
  );
};

export default MyPlanetsPage;
