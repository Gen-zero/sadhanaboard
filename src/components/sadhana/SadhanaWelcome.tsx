import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart } from 'lucide-react';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SadhanaWelcomeProps {
  onStartSadhana: () => void;
}

const SadhanaWelcome = ({
  onStartSadhana
}: SadhanaWelcomeProps) => {
  const { colors } = useThemeColors();

  return (
    <div className="bg-transparent rounded-lg p-8 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Cosmic icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full border border-amber-500/30 bg-amber-500/10">
            <Sparkles className="h-8 w-8" style={{ color: 'hsl(45 100% 50%)', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))' }} />
          </div>
        </div>

        {/* Main heading - large and bold */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}>
            Begin Your Sacred
            <br />
            Journey
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'hsl(210 40% 80%)', fontFamily: '"Chakra Petch", sans-serif' }}>
            A Sadhana is a spiritual practice that connects you with the divine. Create
            <br />
            your personal sacred commitment and let the universe guide your path.
          </p>
        </div>

        {/* Spiritual quote section */}
        <div className="bg-transparent backdrop-blur-sm rounded-lg p-6 md:p-8 border border-primary/30" style={{ borderColor: 'hsl(210 50% 40%)' }}>
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-full border border-amber-500/30">
              <Heart className="h-5 w-5" style={{ color: 'hsl(45 100% 50%)', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))' }} />
            </div>
          </div>
          <blockquote className="text-lg md:text-xl italic font-light" style={{ color: 'white', fontFamily: '"Chakra Petch", sans-serif' }}>
            "The mind is everything. What you think you become."
          </blockquote>
          <div className="mt-4">
            <div className="h-0.5 w-12 mx-auto mb-3" style={{ backgroundColor: 'hsl(45 100% 50%)', filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))' }}></div>
            <p className="text-sm" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 4px rgba(255, 215, 0, 0.6)' }}>— Buddha</p>
          </div>
        </div>

        {/* Call to action */}
        <div className="space-y-4 pt-2">
          <p style={{ color: 'hsl(210 40% 80%)', fontFamily: '"Chakra Petch", sans-serif' }}>
            Ready to manifest your spiritual intentions?
          </p>
          <Button 
            onClick={onStartSadhana} 
            size="lg" 
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
          >
            <Heart className="mr-2 h-5 w-5" />
            Start Your Sadhana
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SadhanaWelcome;