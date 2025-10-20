import React from 'react';
import { motion } from 'framer-motion';

interface CosmicIconProps {
  icon: React.ComponentType<any>;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  glow?: boolean;
  orbit?: boolean;
  className?: string;
}

const CosmicIcon: React.FC<CosmicIconProps> = ({
  icon: Icon,
  size = 'md',
  color = 'text-foreground',
  glow = false,
  orbit = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 0.3, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className={`w-full h-full rounded-full bg-current ${color} blur-md opacity-50`} />
        </motion.div>
      )}
      
      {orbit && (
        <motion.div
          className="absolute inset-0 rounded-full border border-current opacity-30"
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
      
      <Icon className={`${sizeClasses[size]} ${color} relative z-10`} />
    </div>
  );
};

export default CosmicIcon;