import { useRef } from 'react';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import YantraGroup, { YantraProps } from './YantraGroup';
import PaperScroll from './PaperScroll';
import EnvironmentEffects from './EnvironmentEffects';
import { useSettings } from '@/hooks/useSettings';

interface SceneContainerProps {
  paperContent: string;
}

const SceneContainer = ({ paperContent }: SceneContainerProps) => {
  const { settings } = useSettings();
  const { camera } = useThree();
  
  // Create multiple yantras for a more complex visual experience
  const yantras: YantraProps[] = [
    { position: [0, 0, -0.2], scale: 1.2, rotation: [0, 0, 0], color: "#f5b042" }, // Main yantra closer and larger
    { position: [2.5, 1.2, -1.5], scale: 0.4, rotation: [0.5, 0.2, 0], color: "#ff719A" },
    { position: [-2.5, -1.2, -1.5], scale: 0.5, rotation: [-0.3, -0.5, 0], color: "#9D4EDD" },
    { position: [0, 2.5, -2.5], scale: 0.6, rotation: [0.7, 0, 0.2], color: "#00B4D8" },
    { position: [0, -2.5, -2.5], scale: 0.7, rotation: [-0.7, 0, -0.2], color: "#FFD60A" },
  ];

  // Camera slight movement for more immersion
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.8]} fov={45} />
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <EnvironmentEffects showCosmicParticles={!isShivaTheme} />
      
      <YantraGroup yantras={yantras} />
      
      {/* Paper with intentions */}
      <PaperScroll 
        content={paperContent} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]} 
      />
      
      <Environment preset="night" />
    </>
  );
};

export default SceneContainer;