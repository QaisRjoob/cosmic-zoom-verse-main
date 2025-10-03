import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sphere, Float } from "@react-three/drei";
import * as THREE from "three";

// Main Exoplanet (Large Centerpiece)
const MainExoplanet = () => {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group position={[3, -1, -15]}>
      {/* Main Planet Body */}
      <Sphere ref={planetRef} args={[4, 64, 64]}>
        <meshStandardMaterial
          color="#8b6f47"
          roughness={0.9}
          metalness={0.2}
          emissive="#3d2817"
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {/* Atmospheric Glow */}
      <Sphere ref={atmosphereRef} args={[4.3, 32, 32]}>
        <meshBasicMaterial
          color="#4a90e2"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Edge Glow */}
      <Sphere args={[4.15, 32, 32]}>
        <meshBasicMaterial
          color="#6bb6ff"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

// Planetary Rings
const PlanetaryRings = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.0001;
    if (ring2Ref.current) ring2Ref.current.rotation.z += 0.00008;
    if (ring3Ref.current) ring3Ref.current.rotation.z += 0.00012;
  });

  const ringGeometry = new THREE.TorusGeometry(5.5, 0.15, 2, 100);
  const ringGeometry2 = new THREE.TorusGeometry(6.2, 0.25, 2, 100);
  const ringGeometry3 = new THREE.TorusGeometry(7.0, 0.12, 2, 100);

  return (
    <group position={[3, -1, -15]} rotation={[Math.PI / 2.5, 0, Math.PI / 8]}>
      {/* Inner Ring */}
      <mesh ref={ring1Ref} geometry={ringGeometry}>
        <meshStandardMaterial
          color="#d4a574"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          emissive="#d4a574"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Middle Ring */}
      <mesh ref={ring2Ref} geometry={ringGeometry2}>
        <meshStandardMaterial
          color="#c9965c"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          emissive="#c9965c"
          emissiveIntensity={0.15}
        />
      </mesh>
      
      {/* Outer Ring */}
      <mesh ref={ring3Ref} geometry={ringGeometry3}>
        <meshStandardMaterial
          color="#b88850"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          emissive="#b88850"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

// Secondary Moon
const SecondaryMoon = () => {
  const moonRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.002;
      // Orbital motion
      const time = state.clock.elapsedTime * 0.2;
      moonRef.current.position.x = -6 + Math.cos(time) * 3;
      moonRef.current.position.z = -18 + Math.sin(time) * 3;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere ref={moonRef} args={[1.2, 32, 32]} position={[-6, 2, -18]}>
        <meshStandardMaterial
          color="#7a7a7a"
          roughness={0.95}
          metalness={0.1}
        />
      </Sphere>
    </Float>
  );
};

// Dramatic Nebula Clouds
const NebulaField = () => {
  const cloud1Ref = useRef<THREE.Mesh>(null);
  const cloud2Ref = useRef<THREE.Mesh>(null);
  const cloud3Ref = useRef<THREE.Mesh>(null);
  const cloud4Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + 0.85;
    
    if (cloud1Ref.current) {
      cloud1Ref.current.rotation.z += 0.0001;
      if (cloud1Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud1Ref.current.material.opacity = pulse * 0.08;
      }
    }
    if (cloud2Ref.current) {
      cloud2Ref.current.rotation.z -= 0.00015;
      if (cloud2Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud2Ref.current.material.opacity = pulse * 0.12;
      }
    }
    if (cloud3Ref.current) {
      cloud3Ref.current.rotation.z += 0.0002;
      if (cloud3Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud3Ref.current.material.opacity = pulse * 0.1;
      }
    }
    if (cloud4Ref.current) {
      cloud4Ref.current.rotation.z -= 0.00012;
      if (cloud4Ref.current.material instanceof THREE.MeshBasicMaterial) {
        cloud4Ref.current.material.opacity = pulse * 0.15;
      }
    }
  });

  return (
    <>
      {/* Deep Purple Nebula */}
      <Sphere ref={cloud1Ref} args={[20, 32, 32]} position={[-10, 8, -35]}>
        <meshBasicMaterial color="#4a0e4e" transparent opacity={0.08} />
      </Sphere>
      
      {/* Magenta Nebula */}
      <Sphere ref={cloud2Ref} args={[25, 32, 32]} position={[15, -5, -40]}>
        <meshBasicMaterial color="#8b008b" transparent opacity={0.12} />
      </Sphere>
      
      {/* Violet Nebula */}
      <Sphere ref={cloud3Ref} args={[18, 32, 32]} position={[-8, -10, -30]}>
        <meshBasicMaterial color="#5d3fd3" transparent opacity={0.1} />
      </Sphere>
      
      {/* Deep Blue Nebula */}
      <Sphere ref={cloud4Ref} args={[22, 32, 32]} position={[8, 12, -38]}>
        <meshBasicMaterial color="#1e0a3c" transparent opacity={0.15} />
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
      // Cluster them together
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 3;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      // White to blue stars
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
      <points ref={cluster1Ref} position={[-15, 10, -25]}>
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
      
      <points ref={cluster2Ref} position={[18, -8, -30]}>
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
      {/* Bottom Blue Glow */}
      <mesh position={[0, -15, -20]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshBasicMaterial
          color="#4a90e2"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Bright Center Glow */}
      <pointLight position={[0, -12, -15]} intensity={2} color="#4a90e2" distance={30} />
      <pointLight position={[5, -10, -12]} intensity={1.5} color="#6bb6ff" distance={25} />
    </>
  );
};

// Cinematic Lighting Setup
const CinematicLighting = () => {
  return (
    <>
      {/* Deep space fog */}
      <fog attach="fog" args={["#0a0515", 20, 70]} />
      
      {/* Ambient light for base visibility */}
      <ambientLight intensity={0.15} />
      
      {/* Key light from top right (simulating distant star) */}
      <directionalLight
        position={[20, 15, 10]}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      
      {/* Fill light from left (subtle purple) */}
      <pointLight position={[-15, 5, 5]} intensity={0.6} color="#8b008b" />
      
      {/* Back light for planet edge lighting */}
      <pointLight position={[5, 0, -8]} intensity={1.2} color="#4a90e2" />
      
      {/* Rim light from bottom */}
      <pointLight position={[0, -10, -10]} intensity={0.8} color="#6bb6ff" />
      
      {/* Accent nebula lights */}
      <pointLight position={[-10, 8, -30]} intensity={0.4} color="#ff00ff" />
      <pointLight position={[15, -5, -35]} intensity={0.5} color="#8b008b" />
    </>
  );
};

// Main 3D Scene
const SpaceScene = () => {
  return (
    <>
      <CinematicLighting />
      
      {/* Star field with depth */}
      <Stars 
        radius={100} 
        depth={60} 
        count={6000} 
        factor={4} 
        saturation={0.2} 
        fade 
        speed={0.3} 
      />
      
      {/* Scene elements in order */}
      <NebulaField />
      <StarClusters />
      <HorizonGlow />
      <MainExoplanet />
      <PlanetaryRings />
      <SecondaryMoon />
    </>
  );
};

export const SpaceBackground3D = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
      >
        <SpaceScene />
      </Canvas>
      
      {/* Dark overlay for text readability with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      
      {/* Additional vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)'
        }}
      />
    </div>
  );
};
