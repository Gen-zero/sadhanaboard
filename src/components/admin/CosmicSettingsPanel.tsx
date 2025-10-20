import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Sparkles, Moon, Sun } from 'lucide-react';
import soundManager from '@/utils/soundManager';

const CosmicSettingsPanel: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationIntensity, setAnimationIntensity] = useState(50);
  const [darkMode, setDarkMode] = useState(true);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    soundManager.toggleSound();
    
    // Play a sound to confirm the change
    if (!soundEnabled) {
      soundManager.playSuccessSound();
    }
  };

  const handleAnimationIntensityChange = (value: number[]) => {
    setAnimationIntensity(value[0]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would toggle the theme
  };

  return (
    <motion.div
      className="cosmic-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="cosmic-card-glow"></div>
      
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
        Cosmic Settings
      </h3>
      
      <div className="space-y-6">
        {/* Sound Settings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {soundEnabled ? (
              <Volume2 className="mr-2 h-5 w-5 text-cyan-400" />
            ) : (
              <VolumeX className="mr-2 h-5 w-5 text-red-400" />
            )}
            <Label htmlFor="sound-toggle" className="text-foreground">
              Sound Effects
            </Label>
          </div>
          <Switch
            id="sound-toggle"
            checked={soundEnabled}
            onCheckedChange={toggleSound}
          />
        </div>
        
        {/* Animation Intensity */}
        <div>
          <Label className="flex items-center mb-2">
            <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
            Animation Intensity
          </Label>
          <Slider
            value={[animationIntensity]}
            onValueChange={handleAnimationIntensityChange}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Subtle</span>
            <span>{animationIntensity}%</span>
            <span>Cosmic</span>
          </div>
        </div>
        
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {darkMode ? (
              <Moon className="mr-2 h-5 w-5 text-indigo-400" />
            ) : (
              <Sun className="mr-2 h-5 w-5 text-yellow-400" />
            )}
            <Label htmlFor="dark-mode-toggle" className="text-foreground">
              Dark Mode
            </Label>
          </div>
          <Switch
            id="dark-mode-toggle"
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
          />
        </div>
        
        {/* Test Sounds */}
        <div className="pt-4">
          <Label className="block mb-2">Test Sounds</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundManager.playSuccessSound()}
              className="cosmic-button"
            >
              Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundManager.playInfoSound()}
              className="cosmic-button"
            >
              Info
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundManager.playErrorSound()}
              className="cosmic-button"
            >
              Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundManager.playNavigationSound()}
              className="cosmic-button"
            >
              Navigation
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CosmicSettingsPanel;