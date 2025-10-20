
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollTexture } from '@/hooks/useScrollTexture';

interface PaperMeshProps {
  hovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

const PaperMesh = ({ hovered, onPointerOver, onPointerOut }: PaperMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { finalTexture, displacement } = useScrollTexture();
  
  // Create animated glowing effect
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating
      meshRef.current.rotation.y += 0.001;
      
      // Breathing effect when hovered
      if (hovered) {
        meshRef.current.scale.x = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
        meshRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
      }
      
      // Gentle glow effect
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.1 + Math.sin(state.clock.getElapsedTime()) * 0.05;
      }
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      castShadow
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <planeGeometry args={[4.5, 6, 32, 32]} />
      <meshStandardMaterial 
        map={finalTexture}
        displacementMap={displacement}
        displacementScale={0.03}
        roughness={0.7} 
        metalness={0.1}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={0.95}
        emissive="#FFD700" // Gold emissive glow
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

export default PaperMesh;
