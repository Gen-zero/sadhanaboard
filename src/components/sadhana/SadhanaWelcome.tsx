import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, MoonStar } from 'lucide-react';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SadhanaWelcomeProps {
  onStartSadhana: () => void;
}

const SadhanaWelcome = ({
  onStartSadhana
}: SadhanaWelcomeProps) => {
  const { colors } = useThemeColors();

  return <div className="bg-transparent rounded-lg p-8 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Cosmic header - removed animations */}
        

        {/* Welcome text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold" style={{ color: 'hsl(45 100% 50%)' }}>
            Begin Your Sacred Journey
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'hsl(45 100% 50%)' }}>
            A Sadhana is a spiritual practice that connects you with the divine. 
            Create your personal sacred commitment and let the universe guide your path.
          </p>
        </div>

        {/* Spiritual quotes/inspiration */}
        <div className="bg-transparent backdrop-blur-sm rounded-lg p-6 border border-white">
          <blockquote className="italic" style={{ color: 'white' }}>
            "The mind is everything. What you think you become."
          </blockquote>
          <p className="text-sm mt-2" style={{ color: 'white' }}>
— Buddha</p>
        </div>

        {/* Call to action */}
        <div className="space-y-4">
          <p style={{ color: 'white' }}>
            Ready to manifest your spiritual intentions and create your divine practice?
          </p>
          <Button onClick={onStartSadhana} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
            <Heart className="mr-2 h-5 w-5" />
            Start Your Sadhana
          </Button>
        </div>

        {/* Additional info */}
        <div className="text-sm space-y-2" style={{ color: 'white' }}>
          <p>✨ Set your spiritual purpose and goals</p>
          <p>🙏 Choose your divine focus and offerings</p>
          <p>📜 Create your personalized sacred paper</p>
          <p>⏰ Set your practice duration and commitment</p>
        </div>
      </div>
    </div>;
};

export default SadhanaWelcome;