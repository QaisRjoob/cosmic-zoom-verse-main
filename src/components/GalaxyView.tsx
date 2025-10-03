import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const GalaxyView = () => {
  const galaxyRef = useRef<THREE.Points>(null);
  const galaxy2Ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(10000 * 3);
    const colors = new Float32Array(10000 * 3);

    for (let i = 0; i < 10000; i++) {
      // Spiral galaxy shape
      const radius = Math.random() * 15;
      const spinAngle = radius * 0.5;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;

      const angle = branchAngle + spinAngle;
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);

      positions[i * 3] = Math.cos(angle) * radius + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(angle) * radius + randomZ;

      // Colors - mix of blue, purple, and white
      const mixedColor = new THREE.Color();
      const innerColor = new THREE.Color('#4a9eff');
      const outerColor = new THREE.Color('#8b5cf6');
      
      mixedColor.lerpColors(innerColor, outerColor, radius / 15);

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += 0.0005;
    }
    if (galaxy2Ref.current) {
      galaxy2Ref.current.rotation.y -= 0.0003;
    }
  });

  return (
    <group>
      {/* Main Galaxy */}
      <points ref={galaxyRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Second Galaxy (distant) */}
      <points ref={galaxy2Ref} position={[25, 10, -20]} scale={0.6}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
