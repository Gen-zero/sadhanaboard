import React from 'react';
import { Sparkles, LayoutDashboard, CheckSquare } from 'lucide-react';
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
    <div className="relative z-40">
      <nav
        className="relative overflow-visible rounded-xl sm:rounded-2xl transition-all duration-500 shadow-2xl group flex flex-col md:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4"
        style={{
          background: 'linear-gradient(135deg, rgba(40, 40, 45, 0.85), rgba(30, 30, 35, 0.9), rgba(40, 40, 45, 0.85))',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 rounded-xl sm:rounded-2xl"
          style={{
            background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.03), transparent, rgba(255, 255, 255, 0.03))'
          }}
        />

        {/* Floating spiritual particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl sm:rounded-2xl">
          <div className="absolute top-1 sm:top-2 left-8 sm:left-16 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-yellow-400/70 rounded-full animate-pulse" />
          <div className="absolute top-2 sm:top-4 right-8 sm:right-20 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-purple-400/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1 sm:bottom-3 left-16 sm:left-32 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-fuchsia-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none border-2 border-transparent animate-border-pulse" style={{
          background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(150, 150, 150, 0.1), rgba(255, 255, 255, 0.15)) border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude'
        }} />

        <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src="/lovable-uploads/sadhanaboard_logo.png"
                alt="SadhanaBoard Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain relative z-10 shadow-lg shadow-purple-500/5 transition-transform duration-300 hover:scale-110"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.1))' }}
              />
              {/* Logo Glow */}
              <div className="absolute inset-0 rounded-full animate-pulse z-0"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, rgba(255, 165, 0, 0.02) 60%, transparent 70%)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                <span className="font-heading">Sadhana Board</span>
              </h1>
              <p className="text-xs text-yellow-400/80 font-medium tracking-wider hidden xs:block">
                ✨ Your Sacred Space
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 relative z-10 w-full md:w-auto justify-end">
          <Button
            className="flex-1 md:flex-none relative bg-gradient-to-r from-[#DC143C] via-[#B01030] to-[#8B0000] hover:from-[#FF1744] hover:via-[#DC143C] hover:to-[#B01030] backdrop-blur-sm border border-[#DC143C]/60 hover:border-[#FF1744]/80 shadow-lg hover:shadow-xl transition-all duration-300 group/btn overflow-hidden px-4 md:px-6 py-2 text-sm transform hover:scale-105 rounded-full text-white font-bold"
            onClick={() => setShowManifestationForm(true)}
            title="Manifest Intention"
            style={{
              boxShadow: '0 0 20px rgba(220, 20, 60, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <Sparkles className="h-4 w-4 mr-2 group-hover/btn:animate-spin" style={{ animationDuration: '2s' }} />
            <span className="whitespace-nowrap">Manifest Intention</span>
          </Button>

          <Button
            variant="ghost"
            className="flex-1 md:flex-none relative border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group/btn2 overflow-hidden px-4 md:px-6 py-2 text-sm transform hover:scale-105 rounded-full border"
            onClick={handleDashboardToggle}
            title="View Progress"
          >
            <div className="absolute inset-0 -translate-x-full group-hover/btn2:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="whitespace-nowrap">View Progress</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default SadhanaHeader;