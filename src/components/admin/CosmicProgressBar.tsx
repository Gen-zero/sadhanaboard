import React from 'react';
import { motion } from 'framer-motion';

interface CosmicProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
}

const CosmicProgressBar: React.FC<CosmicProgressBarProps> = ({
  value,
  max = 100,
  label,
  color = 'from-purple-500 to-cyan-400',
  showPercentage = true
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          {showPercentage && (
            <span className="font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className="relative h-3 bg-background/60 rounded-full overflow-hidden">
        {/* Background glow */}
        <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-20 blur-sm`} />
        
        {/* Progress bar with animation */}
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Animated particles */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 w-1 h-1 bg-white rounded-full"
                style={{ left: `${i * 20}%` }}
                animate={{
                  y: [0, -3, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CosmicProgressBar;