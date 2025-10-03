import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Float } from "@react-three/drei";
import * as THREE from "three";

// Saturn-like Planet (Large Centerpiece)
const SaturnPlanet = () => {
  const planetRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <group position={[2, -0.5, -12]}>
      {/* Main Planet Body - Saturn colors */}
      <Sphere ref={planetRef} args={[4.5, 128, 128]}>
        <meshStandardMaterial
          color="#e8d4a0"
          roughness={0.7}
          metalness={0.3}
          emissive="#c4a870"
          emissiveIntensity={0.15}
        />
      </Sphere>
      
      {/* Subtle atmospheric bands (horizontal stripes effect) */}
      <Sphere args={[4.52, 64, 64]}>
        <meshBasicMaterial
          color="#d4b583"
          transparent
          opacity={0.3}
          side={THREE.FrontSide}
        />
      </Sphere>
      
      {/* Atmospheric Glow - Golden tint */}
      <Sphere args={[4.8, 32, 32]}>
        <meshBasicMaterial
          color="#f5daa8"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Edge Glow - Warm light */}
      <Sphere args={[4.65, 32, 32]}>
        <meshBasicMaterial
          color="#ffedc2"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

// Saturn-like Ring System (More Detailed)
const SaturnRings = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const ring4Ref = useRef<THREE.Mesh>(null);
  const ring5Ref = useRef<THREE.Mesh>(null);
  const ring6Ref = useRef<THREE.Mesh>(null);
  const ring7Ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.00008;
    if (ring2Ref.current) ring2Ref.current.rotation.z += 0.00010;
    if (ring3Ref.current) ring3Ref.current.rotation.z += 0.00007;
    if (ring4Ref.current) ring4Ref.current.rotation.z += 0.00012;
    if (ring5Ref.current) ring5Ref.current.rotation.z += 0.00009;
    if (ring6Ref.current) ring6Ref.current.rotation.z += 0.00011;
    if (ring7Ref.current) ring7Ref.current.rotation.z += 0.00006;
  });

  // Create ring geometries - Saturn-like proportions
  const ring1Geo = new THREE.TorusGeometry(6.2, 0.12, 2, 120);
  const ring2Geo = new THREE.TorusGeometry(6.8, 0.18, 2, 120);
  const ring3Geo = new THREE.TorusGeometry(7.5, 0.15, 2, 120);
  const ring4Geo = new THREE.TorusGeometry(8.2, 0.25, 2, 120);
  const ring5Geo = new THREE.TorusGeometry(9.0, 0.20, 2, 120);
  const ring6Geo = new THREE.TorusGeometry(9.8, 0.14, 2, 120);
  const ring7Geo = new THREE.TorusGeometry(10.5, 0.10, 2, 120);

  return (
    <group position={[2, -0.5, -12]} rotation={[Math.PI / 2.3, 0, Math.PI / 9]}>
      {/* Ring 1 - Innermost (lightest) */}
      <mesh ref={ring1Ref} geometry={ring1Geo}>
        <meshStandardMaterial
          color="#f5e8d0"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          emissive="#f5e8d0"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Ring 2 - Light tan */}
      <mesh ref={ring2Ref} geometry={ring2Geo}>
        <meshStandardMaterial
          color="#e8d4a8"
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          emissive="#e8d4a8"
          emissiveIntensity={0.25}
        />
      </mesh>
      
      {/* Ring 3 - Mid tone */}
      <mesh ref={ring3Ref} geometry={ring3Geo}>
        <meshStandardMaterial
          color="#d4bc8e"
          transparent
          opacity={0.80}
          side={THREE.DoubleSide}
          emissive="#d4bc8e"
          emissiveIntensity={0.22}
        />
      </mesh>
      
      {/* Ring 4 - Main visible ring (brightest) */}
      <mesh ref={ring4Ref} geometry={ring4Geo}>
        <meshStandardMaterial
          color="#c9a870"
          transparent
          opacity={0.90}
          side={THREE.DoubleSide}
          emissive="#c9a870"
          emissiveIntensity={0.28}
        />
      </mesh>
      
      {/* Ring 5 - Darker band */}
      <mesh ref={ring5Ref} geometry={ring5Geo}>
        <meshStandardMaterial
          color="#b89860"
          transparent
          opacity={0.70}
          side={THREE.DoubleSide}
          emissive="#b89860"
          emissiveIntensity={0.20}
        />
      </mesh>
      
      {/* Ring 6 - Outer ring */}
      <mesh ref={ring6Ref} geometry={ring6Geo}>
        <meshStandardMaterial
          color="#a88555"
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          emissive="#a88555"
          emissiveIntensity={0.18}
        />
      </mesh>
      
      {/* Ring 7 - Outermost (faintest) */}
      <mesh ref={ring7Ref} geometry={ring7Geo}>
        <meshStandardMaterial
          color="#987245"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          emissive="#987245"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
};

// Realistic Moon with Craters
const RealisticMoon = () => {
  const moonRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.001;
      // Orbital motion around Saturn
      const time = state.clock.elapsedTime * 0.15;
      moonRef.current.position.x = -3 + Math.cos(time) * 4;
      moonRef.current.position.z = -15 + Math.sin(time) * 4;
      moonRef.current.position.y = 1 + Math.sin(time * 0.5) * 0.5;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <Sphere ref={moonRef} args={[1.1, 64, 64]} position={[-3, 1, -15]}>
        <meshStandardMaterial
          color="#9a9a9a"
          roughness={1}
          metalness={0}
          emissive="#2a2a2a"
          emissiveIntensity={0.05}
        />
      </Sphere>
    </Float>
  );
};

// Enhanced Realistic Nebula Field
const EnhancedNebula = () => {
  const cloud1Ref = useRef<THREE.Mesh>(null);
  const cloud2Ref = useRef<THREE.Mesh>(null);
  const cloud3Ref = useRef<THREE.Mesh>(null);
  const cloud4Ref = useRef<THREE.Mesh>(null);
  const cloud5Ref = useRef<THREE.Mesh>(null);
  const cloud6Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const pulse1 = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 + 0.9;
    const pulse2 = Math.cos(state.clock.elapsedTime * 0.25) * 0.12 + 0.88;
    const pulse3 = Math.sin(state.clock.elapsedTime * 0.18) * 0.08 + 0.92;
    
    if (cloud1Ref.current) {
      cloud1Ref.current.rotation.z += 0.00008;
      if (cloud1Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud1Ref.current.material.opacity = pulse1 * 0.06;
      }
    }
    if (cloud2Ref.current) {
      cloud2Ref.current.rotation.z -= 0.00012;
      if (cloud2Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud2Ref.current.material.opacity = pulse2 * 0.10;
      }
    }
    if (cloud3Ref.current) {
      cloud3Ref.current.rotation.z += 0.00015;
      if (cloud3Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud3Ref.current.material.opacity = pulse3 * 0.08;
      }
    }
    if (cloud4Ref.current) {
      cloud4Ref.current.rotation.z -= 0.0001;
      if (cloud4Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud4Ref.current.material.opacity = pulse1 * 0.12;
      }
    }
    if (cloud5Ref.current) {
      cloud5Ref.current.rotation.z += 0.0002;
      if (cloud5Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud5Ref.current.material.opacity = pulse2 * 0.07;
      }
    }
    if (cloud6Ref.current) {
      cloud6Ref.current.rotation.z -= 0.00009;
      if (cloud6Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud6Ref.current.material.opacity = pulse3 * 0.11;
      }
    }
  });

  return (
    <>
      {/* Deep Purple Nebula - Far background */}
      <Sphere ref={cloud1Ref} args={[25, 32, 32]} position={[-12, 10, -40]}>
        <meshBasicMaterial color="#3d1a52" transparent opacity={0.06} />
      </Sphere>
      
      {/* Magenta Nebula - Diagonal sweep */}
      <Sphere ref={cloud2Ref} args={[30, 32, 32]} position={[18, -8, -45]}>
        <meshBasicMaterial color="#6b1f6b" transparent opacity={0.10} />
      </Sphere>
      
      {/* Violet Nebula - Mid layer */}
      <Sphere ref={cloud3Ref} args={[22, 32, 32]} position={[-10, -12, -35]}>
        <meshBasicMaterial color="#4a2a6b" transparent opacity={0.08} />
      </Sphere>
      
      {/* Deep Blue Nebula - Top layer */}
      <Sphere ref={cloud4Ref} args={[28, 32, 32]} position={[10, 15, -42]}>
        <meshBasicMaterial color="#1a1a3d" transparent opacity={0.12} />
      </Sphere>
      
      {/* Pink/Purple blend */}
      <Sphere ref={cloud5Ref} args={[20, 32, 32]} position={[-18, 5, -38]}>
        <meshBasicMaterial color="#8b3a8b" transparent opacity={0.07} />
      </Sphere>
      
      {/* Dark purple accent */}
      <Sphere ref={cloud6Ref} args={[24, 32, 32]} position={[5, -15, -43]}>
        <meshBasicMaterial color="#2d1545" transparent opacity={0.11} />
      </Sphere>
    </>
  );
};

// Star Clusters with Glow
const StarClusters = () => {
  const cluster1Ref = useRef<THREE.Points>(null);
  const cluster2Ref = useRef<THREE.Points>(null);
  
  const createCluster = (count: number) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 3;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      colors[i * 3] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 2] = 1.0;
    }
    
    return { positions, colors };
  };

  const cluster1 = createCluster(200);
  const cluster2 = createCluster(150);
  
  useFrame((state) => {
    if (cluster1Ref.current) {
      cluster1Ref.current.rotation.z += 0.0002;
    }
    if (cluster2Ref.current) {
      cluster2Ref.current.rotation.z -= 0.00015;
    }
  });

  return (
    <>
      <points ref={cluster1Ref} position={[-15, 10, -20]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={cluster1.positions.length / 3}
            array={cluster1.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={cluster1.colors.length / 3}
            array={cluster1.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.15} vertexColors transparent opacity={0.9} />
      </points>
      
      <points ref={cluster2Ref} position={[18, -8, -25]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={cluster2.positions.length / 3}
            array={cluster2.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={cluster2.colors.length / 3}
            array={cluster2.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.12} vertexColors transparent opacity={0.8} />
      </points>
    </>
  );
};

// Atmospheric Horizon Glow
const HorizonGlow = () => {
  return (
    <>
      {/* Bottom Blue Glow Plane */}
      <mesh position={[0, -15, -15]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshBasicMaterial
          color="#4a90e2"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Bright Center Glow Lights */}
      <pointLight position={[0, -12, -10]} intensity={2} color="#4a90e2" distance={30} />
      <pointLight position={[5, -10, -8]} intensity={1.5} color="#6bb6ff" distance={25} />
    </>
  );
};

export const ExoplanetSystem = () => {
  return (
    <group>
      {/* Realistic Deep Space Fog */}
      <fog attach="fog" args={["#050510", 18, 70]} />
      
      {/* Enhanced Cinematic Lighting */}
      <ambientLight intensity={0.18} />
      
      {/* Main sun light (warm golden) */}
      <directionalLight
        position={[25, 18, 15]}
        intensity={2.2}
        color="#fff5e6"
        castShadow
      />
      
      {/* Secondary rim light for Saturn */}
      <directionalLight
        position={[-12, 8, 10]}
        intensity={0.8}
        color="#ffd4a3"
      />
      
      {/* Fill lights with subtle purple/blue tones */}
      <pointLight position={[-18, 8, 8]} intensity={0.5} color="#6b4a8b" />
      <pointLight position={[8, 2, -8]} intensity={1.0} color="#3a5f8b" />
      <pointLight position={[0, -12, -10]} intensity={0.7} color="#4a6b9b" />
      
      {/* Nebula accent lights (very subtle) */}
      <pointLight position={[-12, 10, -35]} intensity={0.3} color="#8b4a8b" />
      <pointLight position={[18, -8, -40]} intensity={0.35} color="#6b3a6b" />
      <pointLight position={[10, 15, -38]} intensity={0.25} color="#4a4a7b" />
      
      {/* Scene Elements in proper rendering order */}
      <EnhancedNebula />
      <StarClusters />
      <HorizonGlow />
      <SaturnPlanet />
      <SaturnRings />
      <RealisticMoon />
    </group>
  );
};
