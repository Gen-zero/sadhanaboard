import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

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
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();

  // Navigation items
  const navItems = [
    { name: t('saadhana_board'), icon: BookHeart, path: '/sadhana' },
    { name: t('library'), icon: BookHeart, path: '/library' },
    { name: t('sadhanas'), icon: CheckSquare, path: '/saadhanas' },
    { name: t('your_yantras'), icon: Sparkles, path: '/your-atma-yantra' },
    { name: t('store'), icon: ShoppingCart, path: '/store' },
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
    <div
      data-sidebar="true"
      className={`fixed left-0 top-0 h-screen z-40 sidebar-seamless border-r border-primary/10 flex flex-col overflow-hidden ${
        !isSidebarOpen ? 'pointer-events-none' : ''
      }`}
      style={{ width: isSidebarOpen ? 360 : 0, willChange: 'width' }}
    >
      <div className="flex flex-col h-full">
        {/* Ambient mantra display */}
        <div className="absolute inset-x-0 top-0 h-8 overflow-hidden z-10">
          <div className="text-center text-xs text-primary/60 font-sans animate-pulse-slow whitespace-nowrap">
            {/* This would be connected to a mantra cycling system in a full implementation */}
            &nbsp;
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-b border-primary/10 pt-12 sidebar-header-wide relative">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full overflow-hidden flex items-center justify-center bg-transparent logo-wrapper">
                <ResponsiveImage
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="Saadhana Board Logo"
                  className="h-full w-full object-contain cursor-pointer transition-all duration-500 hover:scale-110 logo-enhanced"
                  quality="high"
                  lazy={false}
                  onClick={handleNavigation}
                />
              </div>
              {/* Enhanced glow effect on hover with gentle pulsing animation */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-2xl scale-125 opacity-0 group-hover:opacity-70 transition-all duration-500 -z-10 logo-glow-effect deity-glow-pulse"></div>
              {/* Sacred geometry overlay in header */}
              <div className="absolute inset-0 pointer-events-none sacred-geometry-overlay -z-20"></div>
            </div>
            <div
              className="text-2xl sm:text-3xl font-bold cursor-pointer transition-all duration-300 hover:text-primary text-primary bg-clip-text text-primary bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
              onClick={handleNavigation}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigation();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="SadhanaBoard - Navigate to home"
            >
              SadhanaBoard
            </div>
          </div>
          
          {/* Collapse button for desktop */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 mobile-focus-visible"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Theme deity display */}
        <div className="flex flex-col items-center justify-center p-6 space-y-3 border-b border-primary/10 flex-shrink-0">
          <button className="flex items-center justify-center transition-transform duration-500 hover:scale-105 cursor-pointer deity-icon-wrapper"
            onClick={handleNavigation}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavigation();
              }
            }}
          >
            <div className="deity-glow-container hover:animate-float-gentle overflow-visible">
              {currentThemeData.icon}
              <div className="absolute -bottom-2 text-xs text-sidebar-foreground/40 om-symbol-divider">ॐ</div>
            </div>
          </button>
          <>
            <div className="text-center">
              <h3 className="text-lg font-medium text-sidebar-foreground">{currentThemeData.name}</h3>
              <p className="text-xs text-sidebar-foreground/70 mantra-gradient-text">{currentThemeData.element} Element</p>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          </>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto sidebar-scrollbar nav-scrollable-area" role="navigation" aria-label="Main navigation">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 nav-item touch-target-large mobile-focus-visible ${
                    active 
                      ? 'bg-primary/20 text-foreground shadow-lg transform scale-105' 
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground hover:scale-105'
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
                  <span className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 ${
                    active ? 'bg-primary/20 text-primary scale-110' : 'text-muted-foreground'
                  }`}>
                    <item.icon size={18} />
                  </span>
                  <span className="truncate flex-1">{item.name}</span>
                  {active && <ChevronRight size={14} className="text-primary flex-shrink-0 animate-pulse" />}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="p-4 border-t border-primary/10 flex-shrink-0 sidebar-footer lotus-pattern-footer">
          <div className="flex flex-col space-y-2">
            {user ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2 text-sm text-sidebar-foreground/90 px-3 py-2">
                  <User size={16} className="text-primary flex-shrink-0" />
                  <span className="truncate">{user.display_name || user.email}</span>
                </div>
                <Link
                  to="/profile"
                  className={`flex items-center rounded-lg transition-all duration-300 px-3 py-2.5 touch-target-large mobile-focus-visible ${
                    isActive('/profile')
                      ? 'bg-primary/20 text-foreground shadow-lg transform scale-105'
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground hover:scale-105'
                  }`}
                  aria-current={isActive('/profile') ? 'page' : undefined}
                  onClick={handleNavigation}
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <User 
                      size={16} 
                      className={`transition-transform duration-300 ${
                        isActive('/profile') ? 'text-primary scale-110' : ''
                      } flex-shrink-0`} 
                    />
                  )}
                  <span className="ml-3">Profile</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-primary/10 px-3 py-2.5 touch-target-large mobile-focus-visible"
                  onClick={() => {
                    signOut();
                    handleNavigation();
                  }}
                >
                  <LogOut size={16} className="mr-2 text-destructive flex-shrink-0" />
                  <span className="text-destructive/90">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start hover:bg-primary/10 px-3 py-2.5 touch-target-large mobile-focus-visible"
                onClick={handleNavigation}
              >
                <LogIn size={16} className="mr-2 text-primary flex-shrink-0" />
                <span className="text-primary/90">Sign In</span>
              </Button>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavigation;