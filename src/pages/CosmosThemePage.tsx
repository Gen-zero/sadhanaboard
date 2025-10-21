import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { CosmosShowcase } from '@/components/themes';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CosmosThemePage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();

  const activateCosmosTheme = () => {
    updateSettings(['appearance', 'colorScheme'], 'cosmos');
    
    toast({
      title: "Theme Activated",
      description: "The COSMOS theme has been applied to your dashboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cosmic background effect */}
      <div className="cosmos-background"></div>
      
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">COSMOS Theme</h1>
            <p className="text-muted-foreground mt-2">
              Experience the cosmic admin panel design adapted for regular users
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="cosmos-button"
              onClick={activateCosmosTheme}
            >
              Activate COSMOS Theme
            </Button>
          </div>
        </div>
        
        <CosmosShowcase />
      </div>
    </div>
  );
};

export default CosmosThemePage;