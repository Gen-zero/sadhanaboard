import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BookHeart, 
  CheckSquare, 
  ShoppingCart, 
  Settings, 
  Sparkles, 
  Home,
  User,
  LogOut,
  LogIn,
  ChevronRight,
  X,
  Beaker
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { TransparentGlassMorphismContainer, SacredCircuitPattern, CornerBracket } from '@/components/design/SadhanaDesignComponents';

interface DesktopNavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  currentThemeData: { icon: React.ReactNode; name: string; element: string };
  onNavigate?: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  currentThemeData,
  onNavigate
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();

  // Navigation items
  const navItems = [
    { name: t('saadhana_board'), icon: null, path: '/sadhana', showLogo: true },
    { name: t('library'), icon: BookHeart, path: '/library' },
    { name: t('sadhanas'), icon: CheckSquare, path: '/saadhanas' },
    // Hidden: { name: t('your_yantras'), icon: Sparkles, path: '/your-atma-yantra' },
    // Hidden: { name: t('store'), icon: ShoppingCart, path: '/store' },
    // Hidden: { name: 'Your Calendar', icon: Calendar, path: '/calendar' },
    // Hidden: { name: 'Your Beads', icon: Beaker, path: '/beads' },
    { name: t('settings'), icon: Settings, path: '/settings' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <TransparentGlassMorphismContainer
      className={`fixed left-0 top-0 h-screen z-40 sidebar-seamless flex flex-col overflow-hidden border-r border-red-900/30 ${
        !isSidebarOpen ? 'pointer-events-none' : ''
      }`}
    >
      <div 
        className="flex flex-col h-full relative transition-all duration-300 ease-in-out"
        style={{ 
          width: isSidebarOpen ? 380 : 0, 
          willChange: 'width'
        }}
      >
        {/* Sacred Circuit Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <SacredCircuitPattern color="#DC143C" />
        </div>
        
        {/* Corner Brackets */}
        <CornerBracket position="top-left" color="#FFD700" />
        <CornerBracket position="top-right" color="#FFD700" />
        <CornerBracket position="bottom-left" color="#FFD700" />
        <CornerBracket position="bottom-right" color="#FFD700" />
        
        {/* Ambient mantra display */}
        <div className="absolute inset-x-0 top-0 h-8 overflow-hidden z-10">
          <div className="text-center text-xs text-primary/60 font-sans animate-pulse-slow whitespace-nowrap">
            {/* This would be connected to a mantra cycling system in a full implementation */}
            &nbsp;
          </div>
        </div>

        {/* Theme deity display */}
        <div className="flex flex-col items-center justify-center p-10 space-y-5 border-b border-red-900/30 flex-shrink-0 relative z-10 bg-black/20 backdrop-blur-sm rounded-lg m-2">
          <button className="flex items-center justify-center transition-transform duration-500 hover:scale-110 cursor-pointer deity-icon-wrapper"
            onClick={handleNavigation}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavigation();
              }
            }}
          >
            <div className="deity-glow-container hover:animate-float-gentle overflow-visible relative w-32 h-32 flex items-center justify-center">
              <div className="w-28 h-28 flex items-center justify-center">
                {currentThemeData.icon}
              </div>
              <div className="absolute -bottom-2 text-sm text-yellow-500/70 om-symbol-divider font-bold">ॐ</div>
              {/* Glow effect for the deity icon */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 blur-xl scale-150 opacity-50 -z-10"></div>
            </div>
          </button>
          <>
            <div className="text-center">
              <h3 className="text-2xl font-medium text-white">{currentThemeData.name}</h3>
              <p className="text-base text-yellow-500/80 mantra-gradient-text font-semibold">{currentThemeData.element} Element</p>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
          </>
        </div>
        
        <nav className="flex-1 p-5 overflow-y-auto sidebar-scrollbar nav-scrollable-area relative z-10" role="navigation" aria-label="Main navigation">
          <div className="space-y-3">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 nav-item touch-target-large mobile-focus-visible relative overflow-hidden ${
                active 
                  ? 'bg-red-900/40 text-white shadow-lg transform scale-[1.02] border border-red-800/50' 
                  : 'text-gray-300 hover:bg-red-900/30 hover:text-white hover:scale-[1.02] border border-red-900/20'
              }`}
              onClick={(e) => {
                // small ripple effect handled by CSS
                const el = e.currentTarget as HTMLElement;
                if (el) {
                  el.classList.remove('ripple-animate');
                  void el.offsetWidth;
                  el.classList.add('ripple-animate');
                }
                handleNavigation();
              }}
              aria-current={active ? 'page' : undefined}
            >
                  {/* Background glow effect for active items */}
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-yellow-900/10 blur-xl -z-10"></div>
                  )}
                  
                  <span className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                    active ? 'bg-red-800/50 text-yellow-400 scale-110 shadow-lg' : 'text-gray-400 bg-black/20'
                  }`}>
                    {item.showLogo ? (
                      <img 
                        src="/lovable-uploads/sadhanaboard_logo.png" 
                        alt="SadhanaBoard Logo" 
                        className="h-10 w-10 object-contain"
                      />
                    ) : item.icon ? (
                      <item.icon size={24} />
                    ) : null}
                  </span>
                  <span className="truncate flex-1 font-medium text-lg">{item.name}</span>
                  {active && <ChevronRight size={18} className="text-yellow-400 flex-shrink-0 animate-pulse" />}
                </Link>
              );
            })}
          </div>
        </nav>        {/* Profile and Sign Out Section - Positioned at the bottom */}
        <div className="mt-auto p-5 border-t border-red-900/30 flex-shrink-0 sidebar-footer relative z-10 bg-black/20 backdrop-blur-sm rounded-xl mx-3 mb-3">
          <div className="flex flex-col space-y-4">
            {user ? (
              <div className="flex flex-col space-y-4">
                {/* User Info Display */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-900/30 to-black/40 border border-red-800/40 backdrop-blur-sm">
                  <div className="relative">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500/50 shadow-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center border-2 border-yellow-500/50 shadow-lg">
                        <User size={24} className="text-yellow-300" />
                      </div>
                    )}
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate text-base">{user.display_name || user.email}</p>
                    <p className="text-yellow-500/80 text-sm truncate">Connected to SadhanaBoard</p>
                  </div>
                </div>
                
                {/* Profile Link */}
                <Link
                  to="/profile"
                  className={`flex items-center rounded-2xl transition-all duration-300 px-5 py-4 touch-target-large mobile-focus-visible relative overflow-hidden border ${
                    isActive('/profile')
                      ? 'bg-gradient-to-r from-red-900/50 to-yellow-900/20 text-white shadow-lg transform scale-[1.02] border-yellow-500/50' 
                      : 'text-gray-300 hover:bg-red-900/30 hover:text-white hover:scale-[1.02] border-red-900/30'
                  }`}
                  aria-current={isActive('/profile') ? 'page' : undefined}
                  onClick={handleNavigation}
                >
                  {/* Background glow effect for active items */}
                  {isActive('/profile') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-yellow-900/10 blur-xl -z-10"></div>
                  )}
                  
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/30 mr-4">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-yellow-400" />
                    )}
                  </div>
                  <span className="font-medium flex-1 text-lg">My Profile</span>
                  <ChevronRight size={18} className={`${isActive('/profile') ? 'text-yellow-400' : 'text-gray-500'} flex-shrink-0`} />
                </Link>
                
                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-gradient-to-r hover:from-red-900/50 hover:to-red-950/50 px-5 py-4 touch-target-large mobile-focus-visible rounded-2xl border border-red-900/40 hover:border-red-700/60 transition-all duration-300 group"
                  onClick={async () => {
                    try {
                      await signOut();
                      navigate('/login');
                    } catch (error) {
                      console.error('Sign out error:', error);
                    }
                  }}
                >
                  <LogOut size={20} className="mr-4 text-red-400 group-hover:text-red-300 flex-shrink-0" />
                  <span className="text-red-300 font-medium group-hover:text-red-200 text-lg">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start hover:bg-gradient-to-r hover:from-red-900/50 hover:to-red-950/50 px-5 py-4 touch-target-large mobile-focus-visible rounded-2xl border border-red-900/40 hover:border-red-700/60 transition-all duration-300 group"
                onClick={handleNavigation}
              >
                <LogIn size={20} className="mr-4 text-yellow-500 group-hover:text-yellow-400 flex-shrink-0" />
                <span className="text-yellow-300 font-medium group-hover:text-yellow-200 text-lg">Connect Account</span>
              </Button>
            )}
          </div>
        </div>      </div>
    </TransparentGlassMorphismContainer>
  );
};

export default DesktopNavigation;