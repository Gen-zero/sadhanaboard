import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hexagon, ArrowRight, Zap } from 'lucide-react';
import { useThemeColors } from '@/hooks/useThemeColors';
import { PulsingOMSymbol, StatusIndicator } from '@/components/design/SadhanaDesignComponents';

interface SadhanaWelcomeProps {
  onStartSadhana: () => void;
}

const SadhanaWelcome = ({ onStartSadhana }: SadhanaWelcomeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-amber-500/20 rounded-2xl shadow-xl p-4 md:p-8">
      <div className="flex flex-col items-center text-center px-6 py-12 md:py-16">
        {/* Top Identifier Badge */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full border mb-8"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.25)',
            backgroundColor: 'rgba(139, 0, 0, 0.25)'
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#FFD700' }} />
          <span className="text-[10px] uppercase tracking-widest" style={{ color: '#FFD700' }}>
            Interface::Sadhana_Gateway
          </span>
        </div>

        {/* Main Content */}
        <div className="space-y-6 max-w-2xl">
          {/* Animated Icon - Using our new component */}
          <PulsingOMSymbol size="text-4xl" />

          {/* Typography with localized blur */}
          <div className="backdrop-blur-md bg-black/20 rounded-xl p-6 border border-white/5 relative overflow-hidden transition-all hover:bg-black/30">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                Begin Your Sacred
              </span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                Journey
              </span>
            </h1>

            <p className="text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
              A Sadhana is a spiritual practice that connects you with the divine.
              Create your personal sacred commitment and let the universe guide your path.
            </p>
          </div>

          {/* Quote Box - Tech Style */}
          <div className="relative mt-8 group/quote">
            <div
              className="relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02]"
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderColor: 'rgba(255, 215, 0, 0.19)'
              }}
            >
              <Hexagon className="absolute -top-3 -left-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />
              <Hexagon className="absolute -bottom-3 -right-3 w-6 h-6 fill-black" style={{ color: '#FFD700' }} />

              <p className="text-lg italic font-medium mb-3" style={{ color: '#FFD700' }}>
                "The mind is everything. What you think you become."
              </p>

              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8" style={{ backgroundColor: '#DC143C' }} />
                <span className="text-xs uppercase tracking-widest text-white/60">— Buddha</span>
                <div className="h-px w-8" style={{ backgroundColor: '#DC143C' }} />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="pt-10 space-y-4">
            <p className="text-sm uppercase tracking-widest animate-pulse" style={{ color: '#FFD700' }}>
              Ready to manifest your spiritual intentions?
            </p>

            <Button
              onClick={onStartSadhana}
              size="lg"
              className="relative overflow-hidden group/btn px-10 py-6 rounded-none clip-path-polygon"
              style={{
                background: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
                border: '1px solid rgba(255, 215, 0, 0.31)'
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

        {/* Footer Status Line - Using our new component */}
        <StatusIndicator />
      </div>
    </div>
  );
};

export default SadhanaWelcome;