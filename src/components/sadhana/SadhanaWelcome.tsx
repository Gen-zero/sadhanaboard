import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hexagon, ArrowRight, Zap } from 'lucide-react';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SadhanaWelcomeProps {
  onStartSadhana: () => void;
}

// --- Local Tech Components ---

const SacredCircuitPattern = ({ color }: { color: string }) => (
  <svg width="100%" height="100%">
    <defs>
      <pattern id="sacred-circuit-welcome" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
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
    <rect width="100%" height="100%" fill="url(#sacred-circuit-welcome)" />
  </svg>
);

const CornerBracket = ({ position, color }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', color: string }) => {
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

const BackgroundEffects = ({ colors }: { colors: any }) => (
  <>
    {/* Grid Overlay */}
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.primary} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        // Avoid mask-image to keep compositor from dropping backdrop-filter
      }}
    />
  </>
);

const SadhanaWelcome = ({ onStartSadhana }: SadhanaWelcomeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Hardcoded crimson/gold theme colors to match landing page aesthetic consistently
  const theme = {
    primary: '#DC143C',   // Crimson
    secondary: '#8B0000', // Dark Crimson
    accent: '#FFD700',    // Gold
    bg: '#1a0a0a',        // Very Dark Red/Black
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.7)',
    border: 'rgba(220, 20, 60, 0.3)'
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 md:p-8">

      {/* --- Main Glassy Container --- */}
      <div
        className="relative overflow-hidden rounded-2xl hover:shadow-2xl group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          isolation: 'isolate',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: `0 20px 50px -10px rgba(0,0,0,0.5), 0 0 30px -10px ${theme.secondary}40`,
          fontFamily: '"Chakra Petch", sans-serif'
        }}
      >
        {/* Stable blur layer (kept separate so animations don’t drop it) */}
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

        {/* Background Effects */}
        <BackgroundEffects colors={theme} />

        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <SacredCircuitPattern color={theme.primary} />
        </div>

        {/* Tech Border Frame */}
        <div
          className="absolute inset-3 border-[1px] border-dashed pointer-events-none rounded-xl z-20 transition-all duration-500"
          style={{
            borderColor: isHovered ? theme.accent : theme.border,
            opacity: isHovered ? 0.4 : 0.2
          }}
        />

        {/* Corner Brackets */}
        <CornerBracket position="top-left" color={theme.accent} />
        <CornerBracket position="top-right" color={theme.accent} />
        <CornerBracket position="bottom-left" color={theme.accent} />
        <CornerBracket position="bottom-right" color={theme.accent} />

        <div className="relative z-30 flex flex-col items-center text-center px-6 py-12 md:py-16">

          {/* Top Identifier Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full border mb-8"
            style={{
              borderColor: `${theme.accent}40`,
              backgroundColor: `${theme.secondary}40`
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: theme.accent }}>
              Interface::Sadhana_Gateway
            </span>
          </div>

          {/* Main Content */}
          <div className="space-y-6 max-w-2xl">
            {/* Animated Icon */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: theme.primary }} />
              <div className="relative z-10 p-5 rounded-full border border-white/10" style={{ backgroundColor: `${theme.bg}80` }}>
                <span className="text-4xl leading-none" style={{ color: theme.accent }}>ॐ</span>
              </div>
              {/* Orbital Rings */}
              <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow-reverse" style={{ width: '140%', height: '140%', left: '-20%', top: '-20%' }} />
            </div>

            {/* Typography */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                Begin Your Sacred
              </span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                Journey
              </span>
            </h1>

            <p className="text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto" style={{ color: theme.muted }}>
              A Sadhana is a spiritual practice that connects you with the divine.
              Create your personal sacred commitment and let the universe guide your path.
            </p>

            {/* Quote Box - Tech Style */}
            <div className="relative mt-8 group/quote">
              <div
                className="relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02]"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: `${theme.accent}30`
                }}
              >
                <Hexagon className="absolute -top-3 -left-3 w-6 h-6 fill-black" style={{ color: theme.accent }} />
                <Hexagon className="absolute -bottom-3 -right-3 w-6 h-6 fill-black" style={{ color: theme.accent }} />

                <p className="text-lg italic font-medium mb-3" style={{ color: theme.accent }}>
                  "The mind is everything. What you think you become."
                </p>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-8" style={{ backgroundColor: theme.primary }} />
                  <span className="text-xs uppercase tracking-widest text-white/60">— Buddha</span>
                  <div className="h-px w-8" style={{ backgroundColor: theme.primary }} />
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="pt-10 space-y-4">
              <p className="text-sm uppercase tracking-widest animate-pulse" style={{ color: theme.accent }}>
                Ready to manifest your spiritual intentions?
              </p>

              <Button
                onClick={onStartSadhana}
                size="lg"
                className="relative overflow-hidden group/btn px-10 py-6 rounded-none clip-path-polygon"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                  border: `1px solid ${theme.accent}50`
                }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center gap-3 relative z-10">
                  <Zap className="w-5 h-5 fill-current" />
                  <span className="text-lg font-bold tracking-wider">INITIATE_SADHANA</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </Button>
            </div>

          </div>

          {/* Footer Status Line */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 text-[10px] uppercase tracking-wider opacity-40" style={{ color: theme.text }}>
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
              System_Online
            </span>
            <span>::</span>
            <span>v2.0.4_Stable</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SadhanaWelcome;
