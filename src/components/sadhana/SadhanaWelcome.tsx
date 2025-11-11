import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, MoonStar } from 'lucide-react';
import { useDefaultThemeStyles } from '@/hooks/useDefaultThemeStyles';

interface SadhanaWelcomeProps {
  onStartSadhana: () => void;
}

const SadhanaWelcome = ({
  onStartSadhana
}: SadhanaWelcomeProps) => {
  const { isDefaultTheme, defaultThemeClasses } = useDefaultThemeStyles();

  return <div className={`rounded-lg p-8 text-center ${isDefaultTheme ? defaultThemeClasses.borderedContainer : 'cosmic-nebula-bg'}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Cosmic header - removed animations */}
        

        {/* Welcome text */}
        <div className="space-y-4">
          <h2 className={`text-3xl font-bold ${isDefaultTheme ? defaultThemeClasses.primaryText : 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary'}`}>
            Begin Your Sacred Journey
          </h2>
          <p className={`text-lg leading-relaxed ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}`}>
            A Sadhana is a spiritual practice that connects you with the divine. 
            Create your personal sacred commitment and let the universe guide your path.
          </p>
        </div>

        {/* Spiritual quotes/inspiration */}
        <div className={`rounded-lg p-6 ${isDefaultTheme ? defaultThemeClasses.borderedContainer : 'bg-background/50 border border-primary/20'}`}>
          <blockquote className={isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground italic'}>
            "The mind is everything. What you think you become."
          </blockquote>
          <p className={`text-sm mt-2 ${isDefaultTheme ? defaultThemeClasses.accentText : 'text-primary'}`}>— Buddha</p>
        </div>

        {/* Call to action */}
        <div className="space-y-4">
          <p className={isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}>
            Ready to manifest your spiritual intentions and create your divine practice?
          </p>
          <Button 
            onClick={onStartSadhana} 
            size="lg" 
            className={`px-8 py-3 text-lg ${isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
          >
            <Heart className="mr-2 h-5 w-5" />
            Start Your Sadhana
          </Button>
        </div>

        {/* Additional info */}
        <div className={`text-sm space-y-2 ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground/80'}`}>
          <p>✨ Set your spiritual purpose and goals</p>
          <p>🙏 Choose your divine focus and offerings</p>
          <p>📜 Create your personalized sacred paper</p>
          <p>⏰ Set your practice duration and commitment</p>
        </div>
      </div>
    </div>;
};

export default SadhanaWelcome;