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
import { useThemeColors } from '@/hooks/useThemeColors';
import { StoreSadhana } from '@/types/store';
import { TransparentGlassMorphismContainer } from '@/components/design/SadhanaDesignComponents';

interface SadhanaSelectionProps {
  onSelectStoreSadhana: (sadhana: StoreSadhana) => void;
  onCreateCustomSadhana: () => void;
  onCancel: () => void;
}

const SadhanaSelection = ({ onSelectStoreSadhana, onCreateCustomSadhana, onCancel }: SadhanaSelectionProps) => {
  const { progression } = useUserProgression();
  const { settings } = useSettings();
  const { colors } = useThemeColors();
  const [activeTab, setActiveTab] = useState('create');
  
  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  // Get spiritual points from progression
  const spiritualPoints = progression.spiritualPoints;

  return (
    <TransparentGlassMorphismContainer className="rounded-lg p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}>
            Begin Your Sadhana Journey
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'white', fontFamily: '"Chakra Petch", sans-serif' }}>
            Start your personalized spiritual practice journey today. Create your own path or choose from our curated practices.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Custom Sadhana Creation Card */}
          <Card className="border border-white bg-transparent">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Heart className="h-6 w-6 text-primary" />
                Create Your Sacred Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-lg" style={{ color: 'white', fontFamily: '"Chakra Petch", sans-serif' }}>
                Design a personalized spiritual practice tailored to your unique journey, goals, and preferences.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Sparkles className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}>Personalized Intentions</h4>
                  <p className="text-sm" style={{ color: 'white', fontFamily: '"Chakra Petch", sans-serif' }}>
                    Customize purpose, deity, and offerings
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <Heart className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}>Devotional Connection</h4>
                  <p className="text-sm" style={{ color: 'white', fontFamily: '"Chakra Petch", sans-serif' }}>
                    Strengthen your bond with the divine
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <Wand2 className="h-8 w-8 text-primary" />
                  <h4 className="font-semibold" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}>Creative Freedom</h4>
                  <p className="text-sm" style={{ color: 'white', fontFamily: '"Chakra Petch", sans-serif' }}>
                    Add multiple practices and offerings
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-4">
                <Button 
                  onClick={onCreateCustomSadhana}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Start Your Sadhana Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TransparentGlassMorphismContainer>
  );
};

export default SadhanaSelection;