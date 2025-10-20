
import { useRef, useEffect } from 'react';
import { Sparkles, useHelper } from '@react-three/drei';
import * as THREE from 'three';

interface EnvironmentEffectsProps {
  showVolumetricLights?: boolean;
  showCosmicParticles?: boolean;
  intensity?: number;
}

const EnvironmentEffects = ({ 
  showVolumetricLights = true, 
  showCosmicParticles = true,
  intensity = 1.0
}: EnvironmentEffectsProps) => {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  
  // Uncomment for debugging spotlight in development
  // useHelper(spotLightRef, THREE.SpotLightHelper, 'cyan');
  
  return (
    <>
      {/* Cosmic fog effect */}
      <fog attach="fog" args={['#070423', 8, 20]} />
      
      {showVolumetricLights && (
        <>
          {/* Volumetric light rays */}
          <spotLight
            ref={spotLightRef}
            position={[5, 5, 0]} 
            angle={0.2} 
            penumbra={0.8}
            intensity={intensity * 4} 
            color="#9d4edd"
            castShadow
          />
          <spotLight 
            position={[-5, 3, 0]} 
            angle={0.3} 
            penumbra={0.6}
            intensity={intensity * 3} 
            color="#4361ee"
            castShadow
          />
        </>
      )}
      
      {showCosmicParticles && (
        <>
          {/* Cosmic particles - larger layer */}
          <Sparkles 
            count={300} 
            scale={10} 
            size={0.6 * intensity} 
            speed={0.3} 
            color="#ffffff" 
          />
          {/* Medium golden particles */}
          <Sparkles 
            count={100} 
            scale={10} 
            size={0.3 * intensity} 
            speed={0.2} 
            color="#f5b042" 
          />
          {/* Small purple particles */}
          <Sparkles 
            count={200} 
            scale={8} 
            size={0.15 * intensity} 
            speed={0.4} 
            color="#9d4edd" 
          />
        </>
      )}
    </>
  );
};

export default EnvironmentEffects;
