import React from 'react';
import { motion } from 'framer-motion';

interface CosmicButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const CosmicButton: React.FC<CosmicButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = "relative overflow-hidden rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-background";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg hover:shadow-purple-500/30",
    secondary: "bg-background/60 backdrop-blur-sm border border-purple-500/30 text-foreground hover:bg-purple-500/10",
    ghost: "bg-transparent text-foreground hover:bg-purple-500/10"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed" 
    : "cursor-pointer";
  
  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -2, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0"
        whileTap={{ 
          background: "radial-gradient(circle at center, rgba(138, 43, 226, 0.3) 0%, transparent 60%)",
          transition: { duration: 0.3 }
        }}
      />
      
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </motion.button>
  );
};

export default CosmicButton;