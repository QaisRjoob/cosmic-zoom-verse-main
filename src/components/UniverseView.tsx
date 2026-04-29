import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export const UniverseView = () => {
  const galaxiesRef = useRef<THREE.Points>(null);

  // Generate galaxy cluster positions
  const galaxyPositions = new Float32Array(500 * 3);
  for (let i = 0; i < 500; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const radius = 100 + Math.random() * 200;
    
    galaxyPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    galaxyPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    galaxyPositions[i * 3 + 2] = radius * Math.cos(phi);
  }

  useFrame((state) => {
    if (galaxiesRef.current) {
      galaxiesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group>
      {/* Galaxy clusters */}
      <Points ref={galaxiesRef} positions={galaxyPositions}>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={3}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>

      {/* Nebula effect */}
      <mesh>
        <sphereGeometry args={[150, 32, 32]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Add some large galaxies */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 120;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              (Math.random() - 0.5) * 50,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[8, 16, 16]} />
            <meshStandardMaterial
              color={["#8b5cf6", "#3b82f6", "#06b6d4"][i % 3]}
              emissive={["#8b5cf6", "#3b82f6", "#06b6d4"][i % 3]}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};
