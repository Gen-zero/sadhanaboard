import React from 'react';
import { MoonStar, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const { colors } = useThemeColors();

  const handleDashboardToggle = () => {
    // Redirect to the dashboard page instead of toggling the local dashboard view
    navigate('/dashboard');
  };

  return (
    <div className="backdrop-blur-sm bg-transparent p-4 rounded-xl border border-white relative overflow-hidden">
      {/* Cosmic glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 bg-gradient-to-l from-white to-yellow-300 bg-clip-text text-transparent">
              <MoonStar className="h-7 w-7 text-primary animate-pulse" />
              <span>Saadhana Board</span>
            </h1>
            <p className="font-light tracking-wide mt-1" style={{ color: 'white' }}>
              Your celestial yantra for divine manifestation and spiritual growth
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 bg-transparent border border-white hover:from-primary/30 hover:to-secondary/30 text-primary-foreground"
              onClick={() => setShowManifestationForm(!showManifestationForm)}
            >
              <Sparkles className="h-4 w-4" />
              <span>Manifest Intention</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-transparent border border-white hover:from-secondary/30 hover:to-accent/30 text-secondary-foreground"
              onClick={handleDashboardToggle}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>View Progress</span>
            </Button>
          </div>
        </div>
        
        {/* Enhanced description with cosmic styling */}
        <div className="mt-4 p-3 rounded-lg bg-transparent border border-white">
          <p className="font-light tracking-wide text-sm" style={{ color: 'white' }}>
            <span className="font-medium text-primary">Tip:</span> Your spiritual intentions transcend dimensions through this cosmic yantra. 
            Connect with your divine guide to manifest your desires into reality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SadhanaHeader;