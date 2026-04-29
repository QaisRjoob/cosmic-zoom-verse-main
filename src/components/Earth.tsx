import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const lightsRef = useRef<THREE.Mesh>(null);

  // Create high-quality procedural Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;
    
    // Deep ocean base with realistic gradient
    const oceanGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.height
    );
    oceanGradient.addColorStop(0, '#0a2f4f');
    oceanGradient.addColorStop(0.3, '#1a4d7a');
    oceanGradient.addColorStop(0.6, '#2563ab');
    oceanGradient.addColorStop(0.8, '#1e4976');
    oceanGradient.addColorStop(1, '#0f2942');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add ocean depth variation
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 150 + 50;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, 'rgba(42, 92, 170, 0.3)');
      gradient.addColorStop(1, 'rgba(26, 58, 92, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Create realistic continents with better shapes
    const continents = [
      // North America
      { x: 300, y: 400, shapes: [[0,0], [200,50], [300,100], [350,200], [300,350], [200,400], [100,350], [50,200], [100,100]] },
      // South America
      { x: 500, y: 900, shapes: [[0,0], [120,80], [150,200], [130,350], [80,400], [30,350], [10,200], [50,50]] },
      // Africa
      { x: 1800, y: 600, shapes: [[0,0], [250,100], [300,250], [320,400], [280,550], [200,600], [100,550], [50,400], [30,250], [80,100]] },
      // Europe
      { x: 1900, y: 300, shapes: [[0,0], [200,30], [250,100], [200,150], [100,130], [50,80]] },
      // Asia
      { x: 2400, y: 300, shapes: [[0,0], [400,50], [600,150], [700,300], [650,450], [500,500], [350,450], [200,350], [100,200], [50,100]] },
      // Australia
      { x: 3200, y: 1100, shapes: [[0,0], [250,50], [300,150], [280,250], [200,280], [100,250], [50,150]] }
    ];
    
    continents.forEach(continent => {
      // Base continent color
      ctx.fillStyle = '#2d5a2d';
      ctx.beginPath();
      ctx.moveTo(continent.x + continent.shapes[0][0], continent.y + continent.shapes[0][1]);
      continent.shapes.forEach(point => {
        ctx.lineTo(continent.x + point[0], continent.y + point[1]);
      });
      ctx.closePath();
      ctx.fill();
      
      // Add green vegetation variations
      ctx.fillStyle = '#3a7a3a';
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 20; i++) {
        const randomPoint = continent.shapes[Math.floor(Math.random() * continent.shapes.length)];
        const x = continent.x + randomPoint[0] + (Math.random() - 0.5) * 100;
        const y = continent.y + randomPoint[1] + (Math.random() - 0.5) * 100;
        const size = Math.random() * 80 + 40;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add brown/desert areas
      ctx.fillStyle = '#8b7355';
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 10; i++) {
        const randomPoint = continent.shapes[Math.floor(Math.random() * continent.shapes.length)];
        const x = continent.x + randomPoint[0] + (Math.random() - 0.5) * 80;
        const y = continent.y + randomPoint[1] + (Math.random() - 0.5) * 80;
        const size = Math.random() * 60 + 30;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    });
    
    // Add smaller islands
    ctx.fillStyle = '#2d5a2d';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 40 + 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add polar ice caps with gradient
    const northIceGradient = ctx.createLinearGradient(0, 0, 0, 120);
    northIceGradient.addColorStop(0, '#ffffff');
    northIceGradient.addColorStop(0.7, '#e6f2ff');
    northIceGradient.addColorStop(1, 'rgba(230, 242, 255, 0)');
    ctx.fillStyle = northIceGradient;
    ctx.fillRect(0, 0, canvas.width, 120);
    
    const southIceGradient = ctx.createLinearGradient(0, canvas.height - 120, 0, canvas.height);
    southIceGradient.addColorStop(0, 'rgba(230, 242, 255, 0)');
    southIceGradient.addColorStop(0.3, '#e6f2ff');
    southIceGradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = southIceGradient;
    ctx.fillRect(0, canvas.height - 120, canvas.width, 120);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create high-quality bump map for terrain
  const bumpTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Base gray
    ctx.fillStyle = '#606060';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add mountain ranges (brighter areas)
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const width = Math.random() * 200 + 100;
      const height = Math.random() * 100 + 50;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, width);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.5, '#c0c0c0');
      gradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - width/2, y - height/2, width, height);
    }
    
    // Add noise for texture detail
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create realistic cloud texture
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;
    
    // Transparent base
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add realistic cloud formations
    const cloudFormations = [
      // Large cloud systems
      ...Array(30).fill(0).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 300 + 200,
        opacity: Math.random() * 0.6 + 0.4
      })),
      // Medium clouds
      ...Array(80).fill(0).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 150 + 80,
        opacity: Math.random() * 0.5 + 0.3
      })),
      // Small clouds
      ...Array(150).fill(0).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 80 + 30,
        opacity: Math.random() * 0.4 + 0.2
      }))
    ];
    
    cloudFormations.forEach(cloud => {
      const gradient = ctx.createRadialGradient(
        cloud.x, cloud.y, 0,
        cloud.x, cloud.y, cloud.size
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity})`);
      gradient.addColorStop(0.4, `rgba(255, 255, 255, ${cloud.opacity * 0.6})`);
      gradient.addColorStop(0.7, `rgba(250, 250, 255, ${cloud.opacity * 0.3})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Add cloud swirls for realism
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 100 + 50;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
      ctx.lineWidth = Math.random() * 20 + 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 1.5);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create specular map for water reflections
  const specularTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;
    
    // Black base (no reflection on land)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // White/gray for oceans (creates water reflections)
    const oceanGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.height
    );
    oceanGradient.addColorStop(0, '#666666');
    oceanGradient.addColorStop(0.5, '#888888');
    oceanGradient.addColorStop(1, '#555555');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Cut out continents (make them dark/non-reflective)
    const continents = [
      { x: 300, y: 400, shapes: [[0,0], [200,50], [300,100], [350,200], [300,350], [200,400], [100,350], [50,200], [100,100]] },
      { x: 500, y: 900, shapes: [[0,0], [120,80], [150,200], [130,350], [80,400], [30,350], [10,200], [50,50]] },
      { x: 1800, y: 600, shapes: [[0,0], [250,100], [300,250], [320,400], [280,550], [200,600], [100,550], [50,400], [30,250], [80,100]] },
      { x: 1900, y: 300, shapes: [[0,0], [200,30], [250,100], [200,150], [100,130], [50,80]] },
      { x: 2400, y: 300, shapes: [[0,0], [400,50], [600,150], [700,300], [650,450], [500,500], [350,450], [200,350], [100,200], [50,100]] },
      { x: 3200, y: 1100, shapes: [[0,0], [250,50], [300,150], [280,250], [200,280], [100,250], [50,150]] }
    ];
    
    ctx.fillStyle = '#000000';
    continents.forEach(continent => {
      ctx.beginPath();
      ctx.moveTo(continent.x + continent.shapes[0][0], continent.y + continent.shapes[0][1]);
      continent.shapes.forEach(point => {
        ctx.lineTo(continent.x + point[0], continent.y + point[1]);
      });
      ctx.closePath();
      ctx.fill();
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create night lights texture (city lights on dark side)
  const nightLightsTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;
    
    // Black base
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Major city locations with lights
    const cities = [
      // North America
      { x: 200, y: 400, size: 30, brightness: 255 }, // West Coast
      { x: 350, y: 420, size: 40, brightness: 255 }, // East Coast
      { x: 280, y: 480, size: 25, brightness: 220 }, // Texas
      // Europe
      { x: 1850, y: 350, size: 35, brightness: 255 }, // Western Europe
      { x: 1950, y: 320, size: 30, brightness: 240 }, // UK
      { x: 2000, y: 360, size: 25, brightness: 230 }, // Central Europe
      // Asia
      { x: 2500, y: 380, size: 40, brightness: 255 }, // China East
      { x: 2600, y: 400, size: 35, brightness: 255 }, // Japan
      { x: 2450, y: 450, size: 30, brightness: 240 }, // India
      { x: 2700, y: 420, size: 25, brightness: 230 }, // Korea
      // Middle East
      { x: 2100, y: 500, size: 20, brightness: 220 },
      // Africa
      { x: 1900, y: 700, size: 15, brightness: 200 }, // North Africa
      { x: 1950, y: 850, size: 18, brightness: 210 }, // South Africa
      // South America
      { x: 450, y: 950, size: 25, brightness: 230 }, // Brazil
      { x: 420, y: 1050, size: 20, brightness: 220 }, // Argentina
      // Australia
      { x: 3250, y: 1150, size: 25, brightness: 230 }
    ];
    
    cities.forEach(city => {
      const gradient = ctx.createRadialGradient(city.x, city.y, 0, city.x, city.y, city.size);
      gradient.addColorStop(0, `rgba(255, 220, 150, ${city.brightness / 255})`);
      gradient.addColorStop(0.3, `rgba(255, 200, 100, ${city.brightness / 400})`);
      gradient.addColorStop(0.6, `rgba(255, 180, 80, ${city.brightness / 800})`);
      gradient.addColorStop(1, 'rgba(255, 160, 60, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(city.x, city.y, city.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Add smaller city clusters
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 10 + 3;
      const brightness = Math.random() * 150 + 100;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(255, 220, 120, ${brightness / 255})`);
      gradient.addColorStop(1, 'rgba(255, 180, 60, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0025;
    }
    if (lightsRef.current) {
      lightsRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Earth with ultra-realistic textures */}
      <Sphere ref={earthRef} args={[2, 256, 256]} position={[0, 0, 0]}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.015}
          roughness={0.95}
          metalness={0.02}
          emissiveMap={nightLightsTexture}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Water specular layer for ocean reflections */}
      <Sphere args={[2.001, 256, 256]} position={[0, 0, 0]}>
        <meshStandardMaterial
          map={specularTexture}
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.8}
          depthWrite={false}
        />
      </Sphere>

      {/* Realistic clouds layer */}
      <Sphere ref={cloudsRef} args={[2.015, 128, 128]} position={[0, 0, 0]}>
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.6}
          depthWrite={false}
          roughness={1.0}
        />
      </Sphere>

      {/* Inner atmosphere glow */}
      <Sphere ref={atmosphereRef} args={[2.08, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#5ab3ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer atmospheric scattering effect */}
      <Sphere args={[2.18, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#88d4ff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Far atmosphere fade */}
      <Sphere args={[2.3, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#a0e0ff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Satellites and space debris sparkle effect */}
      <Sparkles
        count={50}
        scale={[6, 6, 6]}
        size={2}
        speed={0.2}
        opacity={0.8}
        color="#ffffff"
      />
    </group>
  );
};
