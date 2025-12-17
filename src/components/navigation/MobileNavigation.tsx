import React, { useState } from 'react';
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
  X,
  ChevronRight,
  Calendar,
  Beaker
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useUserProfile } from '@/hooks/useUserProfile';
import { themeUtils, getThemeById, listThemes } from '@/themes';
import type { ThemeDefinition } from '@/themes/types';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { motion, AnimatePresence } from 'framer-motion';
import { TransparentGlassMorphismContainer, SacredCircuitPattern, CornerBracket } from '@/components/design/SadhanaDesignComponents';

interface MobileNavigationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onOpenChange }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { settings } = useSettings();
  const { profile } = useUserProfile();

  // Navigation items matching desktop version
  const navItems = [
    { name: t('saadhana_board'), icon: BookHeart, path: '/sadhana' },
    { name: t('library'), icon: BookHeart, path: '/library' },
    { name: t('sadhanas'), icon: CheckSquare, path: '/saadhanas' },
    // Hidden: { name: t('your_yantras'), icon: Sparkles, path: '/your-atma-yantra' },
    // Hidden: { name: t('store'), icon: ShoppingCart, path: '/store' },
    { name: 'Your Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Your Beads', icon: Beaker, path: '/beads' },
    { name: t('settings'), icon: Settings, path: '/settings' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Simplified handlers
  const handleLogout = () => {
    signOut();
    navigate('/login');
    onOpenChange(false);
  };

  const handleLoginNavigation = () => {
    navigate('/login');
    onOpenChange(false);
  };

  const handleBuySP = () => {
    navigate('/store');
    onOpenChange(false);
  };

  // Get the current theme
  const currentTheme = settings?.appearance?.colorScheme || 'default';
  
  // Get actual theme data instead of hardcoded values
  const getCurrentThemeData = () => {
    const theme = getThemeById(currentTheme) || getThemeById('default');
    if (!theme) {
      // Fallback data
      return {
        icon: null,
        name: 'Default Theme',
        element: 'Ether'
      };
    }
    
    // Get theme icon - either from assets or metadata
    let icon = null;
    const iconPath = theme.assets?.icon || theme.metadata?.icon;
    if (iconPath) {
      icon = themeUtils.renderThemeIcon(theme, 'h-20 w-20 rounded-full');
    } else {
      // Fallback to a simple div if no icon is available
      icon = (
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <span className="text-2xl">🎨</span>
        </div>
      );
    }
    
    return {
      icon,
      name: theme.metadata?.name || theme.metadata?.id || 'Unknown Theme',
      element: 'Spiritual'
    };
  };
  
  const currentThemeData = getCurrentThemeData();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 touch-target-large mobile-focus-visible flex items-center justify-center"
          aria-label="Open navigation menu"
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </motion.svg>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-80 p-0 mobile-sheet-content"
        data-sidebar="true"
      >
        <TransparentGlassMorphismContainer className="flex flex-col h-full relative">
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

          {/* Menu Header with enhanced styling */}
          <div className="p-6 border-b border-primary/10 pt-12 sidebar-header-wide relative z-10">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative group">
                  <div className="h-20 w-20 rounded-full overflow-hidden flex items-center justify-center bg-transparent logo-wrapper">
                    <ResponsiveImage
                      src="/lovable-uploads/sadhanaboard_logo.png"
                      alt="Saadhana Board Logo"
                      className="h-full w-full object-contain cursor-pointer transition-all duration-500 hover:scale-110 logo-enhanced"
                      quality="high"
                      lazy={false}
                      onClick={() => {
                        navigate('/');
                        onOpenChange(false);
                      }}
                    />
                  </div>
                  {/* Enhanced glow effect on hover with gentle pulsing animation */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-2xl scale-125 opacity-0 group-hover:opacity-70 transition-all duration-500 -z-10 logo-glow-effect deity-glow-pulse"></div>
                  {/* Sacred geometry overlay in header */}
                  <div className="absolute inset-0 pointer-events-none sacred-geometry-overlay -z-20"></div>
                </div>
                <div
                  className="text-2xl sm:text-3xl font-bold cursor-pointer transition-all duration-300 hover:text-primary text-primary bg-clip-text text-primary bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600"
                  onClick={() => {
                    navigate('/');
                    onOpenChange(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/');
                      onOpenChange(false);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="SadhanaBoard - Navigate to home"
                >
                  SadhanaBoard
                </div>
              </motion.div>
              <motion.div
                whileTap={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 mobile-focus-visible bg-red-900/30 hover:bg-red-800/50 border border-red-900/50 rounded-lg"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4 text-yellow-400" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Theme deity display */}
          <div className="flex flex-col items-center justify-center p-6 space-y-3 border-b border-red-900/30 flex-shrink-0 relative z-10 bg-black/20 backdrop-blur-sm rounded-lg m-2">
            <button className="flex items-center justify-center transition-transform duration-500 hover:scale-105 cursor-pointer deity-icon-wrapper"
              onClick={() => {
                navigate('/settings');
                onOpenChange(false);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/settings');
                  onOpenChange(false);
                }
              }}
            >
              <div className="deity-glow-container hover:animate-float-gentle overflow-visible relative">
                {currentThemeData.icon}
                <div className="absolute -bottom-2 text-xs text-yellow-500/70 om-symbol-divider font-bold">ॐ</div>
                {/* Glow effect for the deity icon */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 blur-md scale-125 opacity-30 -z-10"></div>
              </div>
            </button>
            <>
              <div className="text-center">
                <h3 className="text-lg font-medium text-white">{currentThemeData.name}</h3>
                <p className="text-xs text-yellow-500/80 mantra-gradient-text font-semibold">{currentThemeData.element} Element</p>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
            </>
          </div>

          {/* Navigation Items with enhanced styling and animations */}
          <nav className="flex-1 p-4 overflow-y-auto sidebar-scrollbar" role="navigation" aria-label="Main navigation">
            <div className="space-y-2">
              <AnimatePresence>
                {navItems.map((item, index) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 nav-item touch-target-large mobile-focus-visible relative overflow-hidden ${
                          active 
                            ? 'bg-red-900/40 text-white shadow-lg transform scale-105 border border-red-800/50' 
                            : 'text-gray-300 hover:bg-red-900/30 hover:text-white hover:scale-105 border border-red-900/20'
                        }`}
                        onClick={() => onOpenChange(false)}
                        aria-current={active ? 'page' : undefined}
                      >
                        {/* Background glow effect for active items */}
                        {active && (
                          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-yellow-900/10 blur-xl -z-10"></div>
                        )}
                        
                        <span className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                          active ? 'bg-red-800/50 text-yellow-400 scale-110 shadow-lg' : 'text-gray-400 bg-black/20'
                        }`}>
                          <Icon size={20} />
                        </span>
                        <span className="truncate flex-1 font-medium">{item.name}</span>
                        {active && <ChevronRight size={16} className="text-yellow-400 flex-shrink-0 animate-pulse" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </nav>

          {/* Profile and Sign Out Section - Positioned at the bottom */}
          <div className="mt-auto p-4 border-t border-red-900/30 flex-shrink-0 sidebar-footer relative z-10 bg-black/20 backdrop-blur-sm rounded-lg mx-2 mb-2">
            <div className="flex flex-col space-y-3">
              {user ? (
                <div className="flex flex-col space-y-3">
                  {/* User Info Display */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-900/30 to-black/40 border border-red-800/40 backdrop-blur-sm">
                    <div className="relative">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500/50 shadow-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center border-2 border-yellow-500/50 shadow-lg">
                          <User size={20} className="text-yellow-300" />
                        </div>
                      )}
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate text-sm">{user.display_name || user.email}</p>
                      <p className="text-yellow-500/80 text-xs truncate">Connected to SadhanaBoard</p>
                    </div>
                  </div>
                  
                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className={`flex items-center rounded-xl transition-all duration-300 px-4 py-3 touch-target-large mobile-focus-visible relative overflow-hidden border ${
                      isActive('/profile')
                        ? 'bg-gradient-to-r from-red-900/50 to-yellow-900/20 text-white shadow-lg transform scale-105 border-yellow-500/50' 
                        : 'text-gray-300 hover:bg-red-900/30 hover:text-white hover:scale-[1.02] border-red-900/30'
                    }`}
                    aria-current={isActive('/profile') ? 'page' : undefined}
                    onClick={() => onOpenChange(false)}
                  >
                    {/* Background glow effect for active items */}
                    {isActive('/profile') && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-yellow-900/10 blur-xl -z-10"></div>
                    )}
                    
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/30 mr-3">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-yellow-400" />
                      )}
                    </div>
                    <span className="font-medium flex-1">My Profile</span>
                    <ChevronRight size={16} className={`${isActive('/profile') ? 'text-yellow-400' : 'text-gray-500'} flex-shrink-0`} />
                  </Link>
                  
                  {/* Sign Out Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start hover:bg-gradient-to-r hover:from-red-900/50 hover:to-red-950/50 px-4 py-3 touch-target-large mobile-focus-visible rounded-xl border border-red-900/40 hover:border-red-700/60 transition-all duration-300 group"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} className="mr-3 text-red-400 group-hover:text-red-300 flex-shrink-0" />
                    <span className="text-red-300 font-medium group-hover:text-red-200">Disconnect</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-gradient-to-r hover:from-red-900/50 hover:to-red-950/50 px-4 py-3 touch-target-large mobile-focus-visible rounded-xl border border-red-900/40 hover:border-red-700/60 transition-all duration-300 group"
                  onClick={handleLoginNavigation}
                >
                  <LogIn size={18} className="mr-3 text-yellow-500 group-hover:text-yellow-400 flex-shrink-0" />
                  <span className="text-yellow-300 font-medium group-hover:text-yellow-200">Connect Account</span>
                </Button>
              )}
            </div>
          </div>
        </TransparentGlassMorphismContainer>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;