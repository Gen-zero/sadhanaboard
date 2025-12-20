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
  const toGlowColor = (value: string, alpha: number) => {
    if (value.startsWith('#')) {
      const hex = value.slice(1);
      const normalized = hex.length === 3
        ? hex.split('').map((char) => char + char).join('')
        : hex;
      const r = parseInt(normalized.slice(0, 2), 16);
      const g = parseInt(normalized.slice(2, 4), 16);
      const b = parseInt(normalized.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (value.startsWith('rgb(')) {
      return value.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
    }
    if (value.startsWith('rgba(')) {
      return value;
    }
    return value;
  };

  const base: React.CSSProperties = {
    width: '20px',
    height: '20px',
    position: 'absolute',
    zIndex: 20,
    transition: 'all 0.3s ease',
    borderColor: color,
    borderStyle: 'solid',
    borderWidth: 0,
    filter: `drop-shadow(0 0 4px ${toGlowColor(color, 0.4)})`,
    opacity: 0.8
  };

  const positions: Record<typeof position, React.CSSProperties> = {
    'top-left': {
      top: '6px',
      left: '6px',
      borderTopWidth: '2px',
      borderLeftWidth: '2px',
      borderTopLeftRadius: '0.5rem'
    },
    'top-right': {
      top: '6px',
      right: '6px',
      borderTopWidth: '2px',
      borderRightWidth: '2px',
      borderTopRightRadius: '0.5rem'
    },
    'bottom-left': {
      bottom: '6px',
      left: '6px',
      borderBottomWidth: '2px',
      borderLeftWidth: '2px',
      borderBottomLeftRadius: '0.5rem'
    },
    'bottom-right': {
      bottom: '6px',
      right: '6px',
      borderBottomWidth: '2px',
      borderRightWidth: '2px',
      borderBottomRightRadius: '0.5rem'
    }
  };

  return (
    <div style={{ ...base, ...positions[position] }} />
  );
};

// Glass Morphism Container Component
export const GlassMorphismContainer = ({
  children,
  className = '',
  transparent = false,
  simple = false
}: {
  children: React.ReactNode;
  className?: string;
  transparent?: boolean;
  simple?: boolean;
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
          className="absolute inset-0 pointer-events-none backdrop-blur-2xl"
          style={{
            background: 'rgba(10, 10, 12, 0.55)',
            transform: 'translateZ(0)'
          }}
        />
      )}

      {/* Background Effects - only shown when not transparent AND not simple */}
      {!transparent && !simple && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${theme.primary} 1px, transparent 1px), linear-gradient(90deg, ${theme.primary} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Circuit Pattern Overlay - only shown when not transparent AND not simple */}
      {!transparent && !simple && (
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
export const PulsingOMSymbol = ({ size = 'text-4xl', className = '' }: { size?: string; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative mx-auto w-fit flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ backgroundColor: theme.primary }}
      />
      <div
        className="relative z-10 p-4 rounded-full border border-white/10 flex items-center justify-center"
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
          width: '130%',
          height: '130%',
          left: '-15%',
          top: '-15%',
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
