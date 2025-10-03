import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

const Planet = ({ 
  radius, 
  color, 
  distance, 
  speed,
  hasRings = false,
  texture
}: { 
  radius: number; 
  color: string; 
  distance: number; 
  speed: number;
  hasRings?: boolean;
  texture?: THREE.Texture;
}) => {
  const planetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += speed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={planetRef}>
      <group position={[distance, 0, 0]}>
        <Sphere ref={meshRef} args={[radius, 32, 32]}>
          <meshStandardMaterial 
            map={texture}
            color={texture ? "#ffffff" : color}
            roughness={0.7}
            metalness={0.1}
          />
        </Sphere>
        
        {/* Saturn's rings */}
        {hasRings && (
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[radius * 1.5, radius * 2.2, 64]} />
            <meshBasicMaterial 
              color="#C4A574" 
              side={THREE.DoubleSide} 
              transparent 
              opacity={0.8}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

export const SolarSystem = () => {
  const sunRef = useRef<THREE.Mesh>(null);

  // Create procedural Sun texture
  const sunTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Create radial gradient for sun
    const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
    gradient.addColorStop(0, '#FFF4E6');
    gradient.addColorStop(0.3, '#FFE4B5');
    gradient.addColorStop(0.6, '#FDB813');
    gradient.addColorStop(0.8, '#FF8C00');
    gradient.addColorStop(1, '#FF6347');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add solar flares
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 400 + 100;
      const x = 512 + Math.cos(angle) * distance;
      const y = 512 + Math.sin(angle) * distance;
      const size = Math.random() * 50 + 20;
      
      const flareGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      flareGradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
      flareGradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
      ctx.fillStyle = flareGradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create planet textures
  const createPlanetTexture = (colors: string[], features: 'craters' | 'bands' | 'spots' | 'clouds') => {
    return useMemo(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Base color
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add features
      if (features === 'craters') {
        // Mercury-like craters
        ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 30 + 5;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (features === 'bands') {
        // Jupiter-like bands
        for (let i = 0; i < 20; i++) {
          const y = (i / 20) * canvas.height;
          ctx.fillStyle = i % 2 === 0 ? 'rgba(200, 150, 100, 0.3)' : 'rgba(150, 100, 50, 0.3)';
          ctx.fillRect(0, y, canvas.width, canvas.height / 20);
        }
      } else if (features === 'spots') {
        // Gas giant spots
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 40 + 10;
          ctx.fillStyle = `rgba(${Math.random() * 100 + 150}, ${Math.random() * 100 + 100}, ${Math.random() * 50}, 0.4)`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (features === 'clouds') {
        // Earth-like clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 40; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 50 + 20;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }, []);
  };

  const mercuryTexture = createPlanetTexture(['#8B7355', '#A0826D', '#8B7355'], 'craters');
  const venusTexture = createPlanetTexture(['#FFC649', '#FFD700', '#FFA500'], 'clouds');
  const earthTexture = createPlanetTexture(['#1a3a5c', '#2a5caa', '#3a8f3a'], 'clouds');
  const marsTexture = createPlanetTexture(['#CD5C5C', '#E47854', '#CD5C5C'], 'craters');
  const jupiterTexture = createPlanetTexture(['#C88B3A', '#E0AC69', '#C88B3A'], 'bands');
  const saturnTexture = createPlanetTexture(['#F4A460', '#FAD5A5', '#F4A460'], 'bands');
  const uranusTexture = createPlanetTexture(['#4FD0E7', '#7BE0ED', '#4FD0E7'], 'spots');
  const neptuneTexture = createPlanetTexture(['#4166F5', '#5B7FFF', '#4166F5'], 'spots');

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Sun with realistic texture */}
      <Sphere ref={sunRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          map={sunTexture}
        />
      </Sphere>
      
      {/* Sun corona/glow effect */}
      <Sphere args={[1.7, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#FDB813"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      <Sphere args={[1.9, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#FF8C00"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Sun light */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
      
      {/* Planets with realistic textures - Complete Solar System! */}
      <Planet radius={0.3} color="#8B7355" distance={3} speed={0.02} texture={mercuryTexture} /> {/* Mercury */}
      <Planet radius={0.5} color="#FFC649" distance={5} speed={0.015} texture={venusTexture} /> {/* Venus */}
      <Planet radius={0.5} color="#4a9eff" distance={7} speed={0.01} texture={earthTexture} /> {/* Earth */}
      <Planet radius={0.4} color="#CD5C5C" distance={9} speed={0.008} texture={marsTexture} /> {/* Mars */}
      <Planet radius={1.2} color="#DAA520" distance={13} speed={0.005} texture={jupiterTexture} /> {/* Jupiter */}
      <Planet radius={1} color="#F4A460" distance={17} speed={0.003} hasRings texture={saturnTexture} /> {/* Saturn */}
      <Planet radius={0.8} color="#4FD0E7" distance={21} speed={0.002} texture={uranusTexture} /> {/* Uranus */}
      <Planet radius={0.75} color="#4166F5" distance={25} speed={0.0015} texture={neptuneTexture} /> {/* Neptune */}
      
      {/* Orbital paths for all 8 planets */}
      {[3, 5, 7, 9, 13, 17, 21, 25].map((distance, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[distance - 0.05, distance + 0.05, 64]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.1} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};
