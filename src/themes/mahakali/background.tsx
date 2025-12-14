import React from 'react';
import MahakaliAnimatedBackground from '@/components/MahakaliAnimatedBackground';

const MahakaliBackground: React.FC = (props) => {
  return (
    <MahakaliAnimatedBackground 
      {...props} 
      intensity={2.0}           // Increased intensity for even fiercer effect
      enableParticles={true}    // Restore particles for original effect
      enableBloom={true}        // Enable bloom by default
      enablePostFX={true}       // Enable post-processing effects
    />
  );
};

export default MahakaliBackground;
