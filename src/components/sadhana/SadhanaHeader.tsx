import React from 'react';
import { MoonStar, Sparkles, LayoutDashboard, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TransparentGlassMorphismContainer } from '@/components/design/SadhanaDesignComponents';

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

  const handleSadhanasNavigation = () => {
    navigate('/saadhanas');
  };

  return (
    <TransparentGlassMorphismContainer className="p-4 rounded-xl">
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 bg-gradient-to-l from-white to-yellow-300 bg-clip-text text-transparent">
              <MoonStar className="h-8 w-8 text-primary" />
              <span className="font-heading">Sadhana Board</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your sacred spiritual practice tracker
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-transparent border border-white hover:from-secondary/30 hover:to-accent/30 text-secondary-foreground"
              onClick={() => setShowManifestationForm(true)}
              title="Set Intention"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Set Intention</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-transparent border border-white hover:from-secondary/30 hover:to-accent/30 text-secondary-foreground"
              onClick={handleDashboardToggle}
              title="View Progress"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">View Progress</span>
            </Button>
            
            {/* Hidden: View All Sadhanas button */}
            {/* 
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-transparent border border-white hover:from-accent/30 hover:to-primary/30 text-accent-foreground"
              onClick={handleSadhanasNavigation}
              title="View All Sadhanas"
            >
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">View All Sadhanas</span>
            </Button>
            */}
          </div>
        </div>
      </div>
    </TransparentGlassMorphismContainer>
  );
};

export default SadhanaHeader;