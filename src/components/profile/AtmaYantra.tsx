import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';

// Yantra geometry components
const Bindu = ({ 
  streak, 
  onHover,
  onClick
}: { 
  streak: number; 
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Calculate glow intensity based on streak
  const glowIntensity = Math.min(streak / 50, 1); // Cap at 50 for normalization
  const brightness = 0.5 + glowIntensity * 0.5;
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Pulsing animation based on streak
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 1;
      meshRef.current.scale.setScalar(0.5 + glowIntensity * 0.3 * pulse);
      
      // Color change based on streak
      const color = new THREE.Color(
        1, // Red - constant
        0.8 - glowIntensity * 0.3, // Green - decreases with streak
        0.2 + glowIntensity * 0.8 // Blue - increases with streak
      );
      
      (meshRef.current.material as THREE.MeshBasicMaterial).color = color;
    }
  });
  
  const handlePointerOver = () => {
    setHovered(true);
    onHover(true);
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
  };
  
  return (
    <mesh 
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial 
        color={new THREE.Color(1, 0.8, 0.2)} 
        transparent 
        opacity={0.9}
      />
      {/* Glow effect */}
      <pointLight 
        intensity={brightness} 
        distance={2} 
        color={new THREE.Color(1, 0.8, 0.2)} 
      />
    </mesh>
  );
};

const Trikonas = ({ 
  level,
  onHover,
  onClick
}: { 
  level: number;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Increase complexity based on level
  const complexity = Math.min(level / 10, 1); // Normalize level to 0-1
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });
  
  const handlePointerOver = () => {
    setHovered(true);
    onHover(true);
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
  };
  
  return (
    <group 
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      {/* Main triangle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 3, 1]} />
        <meshBasicMaterial 
          color={new THREE.Color(0.7, 0.5, 0.9)} 
          transparent 
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner triangles based on complexity */}
      {complexity > 0.3 && (
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 3]}>
          <ringGeometry args={[0.5, 0.7, 3, 1]} />
          <meshBasicMaterial 
            color={new THREE.Color(0.8, 0.6, 1)} 
            transparent 
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {complexity > 0.6 && (
        <mesh rotation={[Math.PI / 2, 0, -Math.PI / 3]}>
          <ringGeometry args={[0.3, 0.5, 3, 1]} />
          <meshBasicMaterial 
            color={new THREE.Color(0.9, 0.7, 1)} 
            transparent 
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

const Padma = ({ 
  achievements, 
  onHover,
  onClick
}: { 
  achievements: number;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [petalCount, setPetalCount] = useState(Math.min(achievements, 24)); // Cap at 24 petals
  
  // Animate new petals when achievements increase
  useEffect(() => {
    const newPetalCount = Math.min(achievements, 24);
    if (newPetalCount > petalCount) {
      setPetalCount(newPetalCount);
    }
  }, [achievements, petalCount]);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });
  
  const handlePointerOver = () => {
    setHovered(true);
    onHover(true);
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
  };
  
  return (
    <group 
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i / petalCount) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <mesh 
            key={i}
            position={[x, y, 0]}
            rotation={[Math.PI / 2, 0, angle + Math.PI / 2]}
          >
            <planeGeometry args={[0.3, 0.8]} />
            <meshBasicMaterial 
              color={new THREE.Color(0.9, 0.6, 0.8)} 
              transparent 
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Bhupura = ({ 
  goals, 
  onHover,
  onClick
}: { 
  goals: { progress: number }[];
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.02;
    }
  });
  
  // Calculate average progress for overall gate illumination
  const avgProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length 
    : 0;
  
  // Gate illumination based on progress
  const gateIntensity = avgProgress / 100;
  
  const handlePointerOver = () => {
    setHovered(true);
    onHover(true);
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
  };
  
  return (
    <group 
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      {/* Outer square */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.2, 4, 1]} />
        <meshBasicMaterial 
          color={new THREE.Color(0.5 + gateIntensity * 0.5, 0.5, 0.3 + gateIntensity * 0.7)} 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Four gates */}
      {goals.map((goal, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 2.1;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const gateProgress = goal.progress / 100;
        
        return (
          <group key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
            {/* Gate base */}
            <mesh>
              <boxGeometry args={[0.3, 0.1, 0.1]} />
              <meshBasicMaterial 
                color={new THREE.Color(0.7 + gateProgress * 0.3, 0.5, 0.2 + gateProgress * 0.8)} 
                transparent 
                opacity={0.7 + gateProgress * 0.3}
              />
            </mesh>
            
            {/* Gate details based on progress */}
            {gateProgress > 0.3 && (
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[0.2, 0.05, 0.05]} />
                <meshBasicMaterial 
                  color={new THREE.Color(0.8 + gateProgress * 0.2, 0.6, 0.3 + gateProgress * 0.7)} 
                  transparent 
                  opacity={0.5 + gateProgress * 0.5}
                />
              </mesh>
            )}
            
            {gateProgress > 0.6 && (
              <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[0.2, 0.05, 0.05]} />
                <meshBasicMaterial 
                  color={new THREE.Color(0.9 + gateProgress * 0.1, 0.7, 0.4 + gateProgress * 0.6)} 
                  transparent 
                  opacity={0.4 + gateProgress * 0.6}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

const YantraScene = ({ 
  streak, 
  level, 
  achievements, 
  goals,
  onHoverPart,
  onClickPart
}: { 
  streak: number; 
  level: number; 
  achievements: number; 
  goals: { progress: number }[];
  onHoverPart: (part: string, hovered: boolean) => void;
  onClickPart: (part: string) => void;
}) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Enhanced cosmic background particles */}
      {Array.from({ length: 100 }).map((_, i) => {
        const angle = (i / 100) * Math.PI * 2;
        const radius = 2 + Math.random() * 1.5; // Reduced radius to prevent overflow
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const size = Math.random() * 0.03 + 0.01; // Reduced size for better performance
        
        return (
          <mesh key={i} position={[x, y, -2]}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial 
              color={new THREE.Color(0.7, 0.5, 0.9)} 
              transparent 
              opacity={0.15} // Reduced opacity
            />
          </mesh>
        );
      })}
      
      {/* Bindu (center point) - represents streak */}
      <Bindu 
        streak={streak} 
        onHover={(hovered) => onHoverPart('bindu', hovered)}
        onClick={() => onClickPart('bindu')}
      />
      
      {/* Trikonas (triangles) - represents level/complexity */}
      <Trikonas 
        level={level} 
        onHover={(hovered) => onHoverPart('trikonas', hovered)}
        onClick={() => onClickPart('trikonas')}
      />
      
      {/* Padma (lotus petals) - represents achievements */}
      <Padma 
        achievements={achievements} 
        onHover={(hovered) => onHoverPart('padma', hovered)}
        onClick={() => onClickPart('padma')}
      />
      
      {/* Bhupura (outer square with gates) - represents goals */}
      <Bhupura 
        goals={goals} 
        onHover={(hovered) => onHoverPart('bhupura', hovered)}
        onClick={() => onClickPart('bhupura')}
      />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        maxDistance={5}
        minDistance={2}
      />
    </>
  );
};

const AtmaYantra = ({ 
  streak = 0,
  level = 1,
  achievements = 0,
  goals = [],
  onPartHover,
  onPartClick
}: {
  streak?: number;
  level?: number;
  achievements?: number;
  goals?: { progress: number }[];
  onPartHover?: (part: string, hovered: boolean) => void;
  onPartClick?: (part: string) => void;
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<string | null>(null);
  
  const handlePartHover = (part: string, hovered: boolean) => {
    setHoveredPart(hovered ? part : null);
    if (onPartHover) {
      onPartHover(part, hovered);
    }
  };
  
  const handlePartClick = (part: string) => {
    setActivePart(part);
    if (onPartClick) {
      onPartClick(part);
    }
    
    // Reset active state after animation
    setTimeout(() => {
      setActivePart(null);
    }, 1000);
  };
  
  // Part descriptions for tooltips
  const partDescriptions: Record<string, string> = {
    bindu: `Your spiritual streak: ${streak} days - Represents your consistent practice`,
    trikonas: `Your spiritual level: ${level} - Reflects your practice complexity`,
    padma: `Your achievements: ${achievements} - Shows your spiritual accomplishments`,
    bhupura: `Your goals: ${goals.length} - Represents your spiritual objectives`
  };
  
  return (
    <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20 h-full relative overflow-hidden">
      {/* Enhanced cosmic background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-fuchsia-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 animate-pulse flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 text-2xl">
            Atma Yantra
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          className="relative w-full h-96 rounded-lg overflow-hidden"
          onMouseLeave={() => setHoveredPart(null)}
        >
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            onPointerMissed={() => setHoveredPart(null)}
            gl={{ antialias: true, alpha: true }}
            frameloop="always"
          >
            <YantraScene 
              streak={streak} 
              level={level} 
              achievements={achievements} 
              goals={goals} 
              onHoverPart={handlePartHover}
              onClickPart={handlePartClick}
            />
          </Canvas>
          
          {/* Enhanced interactive legend */}
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 text-white text-sm shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-purple-400" />
              <span className="font-medium">Yantra Elements</span>
            </div>
            <div className="space-y-2">
              <div 
                className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                  hoveredPart === 'bindu' ? 'text-yellow-300 scale-105' : 'text-white/80'
                }`}
                onMouseEnter={() => handlePartHover('bindu', true)}
                onMouseLeave={() => handlePartHover('bindu', false)}
              >
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span>Streak: {streak} days</span>
              </div>
              <div 
                className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                  hoveredPart === 'trikonas' ? 'text-purple-300 scale-105' : 'text-white/80'
                }`}
                onMouseEnter={() => handlePartHover('trikonas', true)}
                onMouseLeave={() => handlePartHover('trikonas', false)}
              >
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span>Level: {level}</span>
              </div>
              <div 
                className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                  hoveredPart === 'padma' ? 'text-pink-300 scale-105' : 'text-white/80'
                }`}
                onMouseEnter={() => handlePartHover('padma', true)}
                onMouseLeave={() => handlePartHover('padma', false)}
              >
                <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                <span>Achievements: {achievements}</span>
              </div>
              <div 
                className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                  hoveredPart === 'bhupura' ? 'text-green-300 scale-105' : 'text-white/80'
                }`}
                onMouseEnter={() => handlePartHover('bhupura', true)}
                onMouseLeave={() => handlePartHover('bhupura', false)}
              >
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span>Goals: {goals.length}</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced instructions */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-xl p-3 text-white text-xs shadow-lg">
            <p className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Drag to rotate • Scroll to zoom
            </p>
          </div>
          
          {/* Enhanced tooltip for hovered part */}
          {hoveredPart && (
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm rounded-xl p-4 text-white text-sm max-w-xs text-center shadow-xl border border-purple-500/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p>{partDescriptions[hoveredPart]}</p>
            </motion.div>
          )}
          
          {/* Enhanced active part animation */}
          {activePart && (
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
            >
              <div className={`absolute inset-0 bg-${
                activePart === 'bindu' ? 'yellow' : 
                activePart === 'trikonas' ? 'purple' : 
                activePart === 'padma' ? 'pink' : 'green'
              }-500/20 animate-ping`}></div>
            </motion.div>
          )}
        </div>
        
        {/* Yantra stats summary */}
        <div className="p-4 border-t border-purple-500/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <div className="text-2xl font-bold text-purple-400">{streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <div className="text-2xl font-bold text-purple-400">{level}</div>
              <div className="text-xs text-muted-foreground">Spiritual Level</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <div className="text-2xl font-bold text-purple-400">{achievements}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <div className="text-2xl font-bold text-purple-400">{goals.length}</div>
              <div className="text-xs text-muted-foreground">Active Goals</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AtmaYantra;