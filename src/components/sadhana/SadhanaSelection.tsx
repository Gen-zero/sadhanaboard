import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  Heart, 
  Wand2
} from 'lucide-react';
import { useUserProgression } from '@/hooks/useUserProgression';
import { useSettings } from '@/hooks/useSettings';
import { StoreSadhana } from '@/types/store';
import { useDefaultThemeStyles } from '@/hooks/useDefaultThemeStyles';

interface SadhanaSelectionProps {
  onSelectStoreSadhana: (sadhana: StoreSadhana) => void;
  onCreateCustomSadhana: () => void;
  onCancel: () => void;
}

const SadhanaSelection = ({ onSelectStoreSadhana, onCreateCustomSadhana, onCancel }: SadhanaSelectionProps) => {
  const { progression } = useUserProgression();
  const { settings } = useSettings();
  const { isDefaultTheme, defaultThemeClasses } = useDefaultThemeStyles();
  const [activeTab, setActiveTab] = useState('create');
  
  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  // Get spiritual points from progression
  const spiritualPoints = progression.spiritualPoints;

  return (
    <div className={`rounded-lg p-6 ${isShivaTheme ? 'bg-background/50' : isDefaultTheme ? defaultThemeClasses.borderedContainer : 'cosmic-nebula-bg'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className={`text-3xl font-bold ${isDefaultTheme ? defaultThemeClasses.primaryText : 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary'}`}>
            Begin Your Sadhana Journey
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}`}>
            Start your personalized spiritual practice journey today. Create your own path or choose from our curated practices.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Custom Sadhana Creation Card */}
          <Card className={`border ${isDefaultTheme ? `${defaultThemeClasses.border} ${defaultThemeClasses.borderedContainer}` : 'border-primary/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center justify-center gap-2 text-2xl ${isDefaultTheme ? defaultThemeClasses.primaryText : ''}`}>
                <Heart className={`h-6 w-6 ${isDefaultTheme ? defaultThemeClasses.accentText : 'text-primary'}`} />
                Create Your Sacred Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className={`text-center text-lg ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}`}>
                Design a personalized spiritual practice tailored to your unique journey, goals, and preferences.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Sparkles className={`h-8 w-8 ${isDefaultTheme ? defaultThemeClasses.accentText : 'text-primary'}`} />
                  <h4 className={`font-semibold ${isDefaultTheme ? defaultThemeClasses.primaryText : ''}`}>Personalization</h4>
                  <p className={`text-sm ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}`}>
                    Choose your spiritual purpose & goals
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <Heart className={`h-8 w-8 ${isDefaultTheme ? defaultThemeClasses.accentText : 'text-primary'}`} />
                  <h4 className={`font-semibold ${isDefaultTheme ? defaultThemeClasses.primaryText : ''}`}>Divine Focus</h4>
                  <p className={`text-sm ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}`}>
                    Select your spiritual focus or deity
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <Wand2 className={`h-8 w-8 ${isDefaultTheme ? defaultThemeClasses.accentText : 'text-primary'}`} />
                  <h4 className={`font-semibold ${isDefaultTheme ? defaultThemeClasses.primaryText : ''}`}>Creative Freedom</h4>
                  <p className={`text-sm ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}`}>
                    Add multiple practices and offerings
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-4">
                <Button 
                  onClick={onCreateCustomSadhana}
                  className={`w-full py-6 text-lg ${isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Start Your Sadhana Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SadhanaSelection;