import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
}

export const ParticleField = ({ 
  count = 2000, 
  color = "#ffffff", 
  size = 0.5,
  speed = 0.5 
}: ParticleFieldProps) => {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] += particles.velocities[i * 3] * speed;
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1] * speed;
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2] * speed;
      
      // Wrap around
      if (Math.abs(positions[i * 3]) > 50) positions[i * 3] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 50) positions[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 50) positions[i * 3 + 2] *= -1;
    }
    
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <Points ref={ref} positions={particles.positions}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};
