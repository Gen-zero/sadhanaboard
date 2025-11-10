import React from 'react';
import { MoonStar, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';

interface SadhanaHeaderProps {
  showManifestationForm: boolean;
  view3D: boolean;
  showDashboard: boolean;
  setIsEditing: (value: boolean) => void;
  setShowManifestationForm: (value: boolean) => void;
  setView3D: (value: boolean) => void;
  setShowDashboard: (value: boolean) => void;
}

const SadhanaHeader = ({
  showManifestationForm,
  view3D,
  showDashboard,
  setIsEditing,
  setShowManifestationForm,
  setView3D,
  setShowDashboard
}: SadhanaHeaderProps) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  // Check if default theme is active
  const isDefaultTheme = settings?.appearance?.colorScheme === 'default';

  const handleDashboardToggle = () => {
    // Redirect to the dashboard page instead of toggling the local dashboard view
    navigate('/dashboard');
  };

  return (
    <div className={`p-4 rounded-xl relative overflow-hidden ${isDefaultTheme ? 'backdrop-blur-lg bg-transparent border border-white' : 'backdrop-blur-sm bg-background/70 border border-primary/20'}`}>
      {/* Cosmic glow effect */}
      <div className={`absolute inset-0 opacity-50 ${isDefaultTheme ? 'bg-gradient-to-r from-white/10 via-amber-200/10 to-white/10' : 'bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5'}`}></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={`text-3xl font-bold tracking-tight flex items-center gap-2 ${isDefaultTheme ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary'}`}>
              <MoonStar className={`h-7 w-7 animate-pulse ${isDefaultTheme ? 'text-amber-300' : 'text-primary'}`} />
              <span>Saadhana Board</span>
            </h1>
            <p className={`font-light tracking-wide mt-1 ${isDefaultTheme ? 'text-amber-100' : 'text-muted-foreground'}`}>
              Your celestial yantra for divine manifestation and spiritual growth
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`flex items-center gap-1 ${isDefaultTheme ? 'bg-white/10 border border-white hover:bg-white/20 text-amber-100' : 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:from-primary/30 hover:to-secondary/30 text-primary-foreground'}`}
              onClick={() => setShowManifestationForm(!showManifestationForm)}
            >
              <Sparkles className="h-4 w-4" />
              <span>Manifest Intention</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDefaultTheme ? 'bg-amber-300' : 'bg-primary'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isDefaultTheme ? 'bg-amber-300' : 'bg-primary'}`}></span>
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${isDefaultTheme ? 'bg-white/10 border border-white hover:bg-white/20 text-amber-100' : 'bg-gradient-to-r from-secondary/20 to-accent/20 border border-secondary/30 hover:from-secondary/30 hover:to-accent/30 text-secondary-foreground'}`}
              onClick={handleDashboardToggle}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>View Progress</span>
            </Button>
          </div>
        </div>
        
        {/* Enhanced description with cosmic styling */}
        <div className={`mt-4 p-3 rounded-lg ${isDefaultTheme ? 'bg-white/10 border border-white' : 'bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20'}`}>
          <p className={`font-light tracking-wide text-sm ${isDefaultTheme ? 'text-amber-100' : 'text-muted-foreground'}`}>
            <span className={`font-medium ${isDefaultTheme ? 'text-amber-300' : 'text-primary'}`}>Tip:</span> Your spiritual intentions transcend dimensions through this cosmic yantra. 
            Connect with your divine guide to manifest your desires into reality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SadhanaHeader;