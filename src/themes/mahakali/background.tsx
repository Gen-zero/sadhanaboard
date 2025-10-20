import React from 'react';
import MahakaliAnimatedBackground from '@/components/MahakaliAnimatedBackground';

const MahakaliBackground: React.FC = (props) => {
  return (
    <MahakaliAnimatedBackground 
      {...props} 
      intensity={2.0}           // Increased intensity for even fiercer effect
      enableBloom={true}        // Enable bloom by default
      enableParticles={true}    // Enable particles by default
      enablePostFX={true}       // Enable post-processing effects
    />
  );
};

export default MahakaliBackground;