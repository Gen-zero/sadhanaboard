import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface YantraProps {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  color: string;
}

interface YantraGroupProps {
  yantras: YantraProps[];
}

// Simple 3D yantra representation using basic Three.js shapes
const SacredYantra3D = ({ position, scale, rotation, color }: YantraProps) => {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Central point (Bindu) */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Outer circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
      
      {/* Triangles */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.7, 0.7, 3]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const YantraGroup = ({ yantras }: YantraGroupProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Animation for the yantra group
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation of the scene
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
      
      // Gentle floating up and down
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {yantras.map((yantra, index) => (
        <SacredYantra3D 
          key={index}
          position={yantra.position} 
          scale={yantra.scale} 
          rotation={yantra.rotation}
          color={yantra.color}
        />
      ))}
    </group>
  );
};

export default YantraGroup;