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
    <div className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-amber-500/20 rounded-2xl shadow-xl p-6 md:p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}>
            Begin Your Sadhana Journey
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: '"Chakra Petch", sans-serif' }}>
            Start your personalized spiritual practice journey today. Create your own path or choose from our curated practices.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Custom Sadhana Creation Card */}
          <Card className="backdrop-blur-md bg-black/20 border border-white/5 rounded-xl transition-all hover:bg-black/30 hover:border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl" style={{ fontFamily: '"Chakra Petch", sans-serif' }}>
                <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                Create Your Sacred Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-lg" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: '"Chakra Petch", sans-serif' }}>
                Design a personalized spiritual practice tailored to your unique journey, goals, and preferences.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-white/5 hover:border-white/10">
                  <Sparkles className="h-8 w-8 text-primary opacity-80" />
                  <h4 className="font-semibold" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif' }}>Personalized Intentions</h4>
                  <p className="text-sm text-white/60" style={{ fontFamily: '"Chakra Petch", sans-serif' }}>
                    Customize purpose, deity, and offerings
                  </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-white/5 hover:border-white/10">
                  <Heart className="h-8 w-8 text-primary opacity-80" />
                  <h4 className="font-semibold" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif' }}>Devotional Connection</h4>
                  <p className="text-sm text-white/60" style={{ fontFamily: '"Chakra Petch", sans-serif' }}>
                    Strengthen your bond with the divine
                  </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-black/20 hover:bg-black/40 transition-colors border border-white/5 hover:border-white/10">
                  <Wand2 className="h-8 w-8 text-primary opacity-80" />
                  <h4 className="font-semibold" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif' }}>Creative Freedom</h4>
                  <p className="text-sm text-white/60" style={{ fontFamily: '"Chakra Petch", sans-serif' }}>
                    Add multiple practices and offerings
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-6">
                <Button
                  onClick={onCreateCustomSadhana}
                  className="w-full bg-gradient-to-r from-primary to-rose-700 hover:from-primary/90 hover:to-rose-800 text-white font-bold py-6 text-lg tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 border border-primary/50 relative overflow-hidden group"
                  style={{ fontFamily: '"Chakra Petch", sans-serif' }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <Wand2 className="mr-3 h-5 w-5 animate-pulse" />
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