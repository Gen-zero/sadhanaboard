import React, { useState } from 'react';

// Theme configuration matching the Sadhana welcome screen
const theme = {
  primary: '#DC143C',   // Crimson
  secondary: '#8B0000', // Dark Crimson
  accent: '#FFD700',    // Gold
  bg: '#1a0a0a',        // Very Dark Red/Black
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.7)',
  border: 'rgba(220, 20, 60, 0.3)'
};

// Sacred Circuit Pattern Component
export const SacredCircuitPattern = ({ color = theme.primary }: { color?: string }) => (
  <svg width="100%" height="100%">
    <defs>
      <pattern id="sacred-circuit-design" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        {/* Circuit Lines forming a geometric flower */}
        <path d="M30 0 L30 10 M30 50 L30 60 M0 30 L10 30 M50 30 L60 30" stroke={color} strokeWidth="1" />
        <rect x="25" y="25" width="10" height="10" transform="rotate(45 30 30)" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="30" cy="30" r="2" fill={color} />
        
        {/* Connecting dots */}
        <circle cx="30" cy="10" r="1.5" fill={color} opacity="0.5" />
        <circle cx="30" cy="50" r="1.5" fill={color} opacity="0.5" />
        <circle cx="10" cy="30" r="1.5" fill={color} opacity="0.5" />
        <circle cx="50" cy="30" r="1.5" fill={color} opacity="0.5" />
        
        {/* Diagonal Lines */}
        <path d="M10 10 L20 20" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <path d="M50 10 L40 20" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <path d="M10 50 L20 40" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <path d="M50 50 L40 40" stroke={color} strokeWidth="0.5" opacity="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#sacred-circuit-design)" />
  </svg>
);

// Corner Bracket Component
export const CornerBracket = ({ 
  position, 
  color = theme.accent 
}: { 
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
}) => {
  const style: React.CSSProperties = {
    borderColor: color,
    width: '24px',
    height: '24px',
    position: 'absolute',
    zIndex: 20,
    transition: 'all 0.3s ease',
  };

  const props = {
    'top-left': { top: '8px', left: '8px', borderTopWidth: '2px', borderLeftWidth: '2px' },
    'top-right': { top: '8px', right: '8px', borderTopWidth: '2px', borderRightWidth: '2px' },
    'bottom-left': { bottom: '8px', left: '8px', borderBottomWidth: '2px', borderLeftWidth: '2px' },
    'bottom-right': { bottom: '8px', right: '8px', borderBottomWidth: '2px', borderRightWidth: '2px' },
  };

  return <div style={{ ...style, ...props[position] }} className="opacity-80" />;
};

// Glass Morphism Container Component
export const GlassMorphismContainer = ({ 
  children,
  className = '',
  transparent = false
}: { 
  children: React.ReactNode;
  className?: string;
  transparent?: boolean;
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl hover:shadow-2xl group ${className}`}
      style={{
        isolation: 'isolate',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: `0 20px 50px -10px rgba(0,0,0,0.5), 0 0 30px -10px ${theme.secondary}40`,
        fontFamily: '"Chakra Petch", sans-serif'
      }}
    >
      {/* Stable blur layer - only shown when not transparent */}
      {!transparent && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(10, 10, 12, 0.55)',
            backdropFilter: 'blur(16px) saturate(140%)',
            WebkitBackdropFilter: 'blur(16px) saturate(140%)',
            willChange: 'backdrop-filter, transform',
            transform: 'translateZ(0)'
          }}
        />
      )}
      
      {/* Background Effects - only shown when not transparent */}
      {!transparent && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${theme.primary} 1px, transparent 1px), linear-gradient(90deg, ${theme.primary} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      )}
      
      {/* Circuit Pattern Overlay - only shown when not transparent */}
      {!transparent && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <SacredCircuitPattern color={theme.primary} />
        </div>
      )}
      
      {/* Tech Border Frame - only shown when not transparent */}
      {!transparent && (
        <div
          className="absolute inset-3 border-[1px] border-dashed pointer-events-none rounded-xl z-20 transition-all duration-500"
          style={{
            borderColor: theme.border,
            opacity: 0.2
          }}
        />
      )}
      
      {/* Corner Brackets */}
      <CornerBracket position="top-left" color={theme.accent} />
      <CornerBracket position="top-right" color={theme.accent} />
      <CornerBracket position="bottom-left" color={theme.accent} />
      <CornerBracket position="bottom-right" color={theme.accent} />
      
      <div className="relative z-30">
        {children}
      </div>
    </div>
  );
};
// Transparent Glass Morphism Container Component
export const TransparentGlassMorphismContainer = ({ 
  children,
  className = ''
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <GlassMorphismContainer className={className} transparent={true}>
      {children}
    </GlassMorphismContainer>
  );
};

// Pulsing OM Symbol Component
export const PulsingOMSymbol = ({ size = 'text-4xl' }: { size?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative mx-auto flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute inset-0 rounded-full animate-ping opacity-20" 
        style={{ backgroundColor: theme.primary }}
      />
      <div 
        className="relative z-10 p-5 rounded-full border border-white/10 flex items-center justify-center"
        style={{ backgroundColor: `${theme.bg}80` }}
      >
        <span 
          className={`${size} leading-none transition-all duration-300`}
          style={{ 
            color: theme.accent,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          ॐ
        </span>
      </div>
      
      {/* Orbital Rings */}
      <div 
        className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow-reverse transition-all duration-500"
        style={{ 
          width: '140%', 
          height: '140%', 
          left: '-20%', 
          top: '-20%',
          opacity: isHovered ? 0.7 : 0.4
        }} 
      />
    </div>
  );
};

// Status Indicator Component
export const StatusIndicator = ({ 
  status = 'System_Online',
  version = 'v2.0.4_Stable'
}: { 
  status?: string;
  version?: string;
}) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 text-[10px] uppercase tracking-wider opacity-40" style={{ color: theme.text }}>
      <span className="flex items-center gap-1">
        <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
        {status}
      </span>
      <span>::</span>
      <span>{version}</span>
    </div>
  );
};