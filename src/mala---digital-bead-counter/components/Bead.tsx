import React from 'react';
import { BeadConfig, BeadType } from '../types';

interface BeadProps {
  config: BeadConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isCenter?: boolean;
}

const Bead: React.FC<BeadProps> = ({ config, size = 'md', className = '', isCenter = false }) => {
  
  let sizeClasses = 'w-12 h-12';
  if (size === 'sm') sizeClasses = 'w-8 h-8';
  if (size === 'lg') sizeClasses = 'w-16 h-16';
  if (size === 'xl') sizeClasses = 'w-32 h-32 md:w-48 md:h-48'; // Main central bead

  // Rudraksha specific rough texture effect
  const isRudraksha = config.type === BeadType.RUDRAKSHA;
  const isSphatik = config.type === BeadType.SPHATIK;

  return (
    <div
      className={`
        rounded-full 
        flex items-center justify-center 
        relative
        transition-all duration-300
        ${sizeClasses}
        ${config.textureClass}
        ${config.shadowColor}
        ${className}
        ${isCenter ? 'shadow-2xl z-20 scale-100' : 'shadow-md scale-90 opacity-80'}
      `}
    >
      {/* Specular highlight for Sphatik/Glassy beads */}
      {isSphatik && (
        <div className="absolute top-[20%] right-[20%] w-[25%] h-[25%] rounded-full bg-white opacity-60 blur-[1px]"></div>
      )}

      {/* Hole in the bead */}
      <div className={`
        absolute 
        ${isCenter ? 'w-2 h-6 md:w-3 md:h-8' : 'w-1 h-3'} 
        rounded-full bg-black/20 blur-[1px]
      `}></div>
      
      {/* Thread line passing through */}
      <div className={`
        absolute -z-10 bg-orange-700/80
        ${isCenter ? 'h-full w-1' : 'h-full w-0.5'}
      `}></div>

      {/* Rudraksha Lines (simple simulation) */}
      {isRudraksha && (
        <div className="absolute inset-0 rounded-full border-[1px] border-black/10 opacity-30"></div>
      )}
    </div>
  );
};

export default Bead;