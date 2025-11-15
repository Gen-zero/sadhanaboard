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
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getThemeById, themeUtils } from '@/themes';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Navigation items with enhanced icons and features
  const navItems = [
    { name: t('saadhana_board'), icon: BookHeart, path: '/sadhana', badge: true },
    { name: t('library'), icon: BookHeart, path: '/library', badge: false },
    { name: t('sadhanas'), icon: CheckSquare, path: '/saadhanas', badge: true },
    { name: t('your_yantras'), icon: Sparkles, path: '/your-atma-yantra', badge: false },
    { name: t('store'), icon: ShoppingCart, path: '/store', badge: false },
    { name: t('settings'), icon: Settings, path: '/settings', badge: false }
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
  // Map themes to deity icons and names
  const themeData: Record<string, { icon: React.ReactNode; name: string; element: string }> = {
    default: {
      icon: themeUtils.renderThemeIcon(getThemeById('default')!, 'h-16 w-16 rounded-full theme-icon-contain'),
      name: 'Cosmic Energy',
      element: 'Ether'
    },
    earth: {
      icon: themeUtils.renderThemeIcon(getThemeById('earth')!, 'h-20 w-20 rounded-full'),
      name: 'Lord Krishna',
      element: 'Earth'
    },
    water: {
      icon: themeUtils.renderThemeIcon(getThemeById('water')!, 'h-20 w-20 rounded-full'),
      name: 'Lord Vishnu',
      element: 'Water'
    },
    fire: {
      icon: themeUtils.renderThemeIcon(getThemeById('fire')!, 'h-20 w-20 rounded-full'),
      name: 'Maa Durga',
      element: 'Fire'
    },
    shiva: {
      icon: themeUtils.renderThemeIcon(getThemeById('shiva')!, 'h-20 w-20 rounded-full'),
      name: 'Lord Shiva',
      element: 'Air'
    },
    bhairava: {
      icon: themeUtils.renderThemeIcon(getThemeById('bhairava')!, 'h-16 w-16 rounded-full'),
      name: 'Lord Bhairava',
      element: 'Fire'
    },
    mahakali: {
      icon: themeUtils.renderThemeIcon(getThemeById('mahakali')!, 'h-20 w-20 rounded-full'),
      name: 'Maa Mahakali',
      element: 'Fire'
    },
    ganesha: {
      icon: themeUtils.renderThemeIcon(getThemeById('ganesha')!, 'h-24 w-24 rounded-full'),
      name: 'Lord Ganesha',
      element: 'Earth'
    },
    serenity: {
      icon: themeUtils.renderThemeIcon(getThemeById('serenity')!, 'h-16 w-16 rounded-full theme-icon-contain'),
      name: 'Serenity',
      element: 'Water'
    },
    neon: {
      icon: themeUtils.renderThemeIcon(getThemeById('neon')!, 'h-16 w-16 rounded-full theme-icon-contain'),
      name: 'Neon Cyber',
      element: 'Ether'
    },
    swamiji: {
      icon: themeUtils.renderThemeIcon(getThemeById('swamiji')!, 'h-20 w-20 rounded-full theme-icon-contain'),
      name: 'Swamiji',
      element: 'Fire'
    },
    lakshmi: {
      icon: themeUtils.renderThemeIcon(getThemeById('lakshmi')!, 'h-32 w-32 rounded-full'),
      name: 'Lakshmi',
      element: 'Earth'
    }
  };

  const currentThemeData = themeData[currentTheme as keyof typeof themeData] || themeData.default;

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
        className="w-80 p-0 mobile-sheet-content bg-gradient-to-b from-background/90 to-purple-900/20 backdrop-blur-xl border-r border-purple-500/20"
        data-sidebar="true"
      >
        <div className="flex flex-col h-full">
          {/* Menu Header with enhanced styling */}
          <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative group">
                  <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-transparent logo-wrapper">
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
                  <motion.div 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
                <div>
                  <motion.h2 
                    className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    SadhanaBoard
                  </motion.h2>
                  <motion.p 
                    className="text-xs text-primary/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentThemeData.name}
                  </motion.p>
                </div>
              </motion.div>
              <motion.div
                whileTap={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 touch-target-large mobile-focus-visible hover:bg-purple-500/10"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Theme deity display with enhanced animations */}
          <div className="flex flex-col items-center justify-center p-4 space-y-3 border-b border-purple-500/20 flex-shrink-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent">
            <motion.div 
              className="flex items-center justify-center transition-transform duration-500 hover:scale-105 cursor-pointer"
              onClick={() => {
                navigate('/settings');
                onOpenChange(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/settings');
                  onOpenChange(false);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {currentThemeData.icon}
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-medium text-sidebar-foreground bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-cyan-300">
                {currentThemeData.name}
              </h3>
              <p className="text-xs text-sidebar-foreground/70">{currentThemeData.element} Element</p>
            </motion.div>
            <motion.div 
              className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </div>

          {/* Navigation Items with enhanced styling and animations */}
          <nav className="flex-1 p-4 overflow-y-auto sidebar-scrollbar" role="navigation" aria-label="Main navigation">
            <div className="space-y-1">
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
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 touch-target-large mobile-nav-item ${
                          active 
                            ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-foreground shadow-lg transform scale-[1.02]' 
                            : 'text-muted-foreground hover:bg-purple-500/10 hover:text-foreground'
                        }`}
                        onClick={() => onOpenChange(false)}
                        aria-current={active ? 'page' : undefined}
                      >
                        <motion.span 
                          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                            active 
                              ? 'bg-gradient-to-br from-purple-600 to-cyan-600 text-white shadow-lg' 
                              : 'bg-purple-500/10 text-muted-foreground'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon size={20} />
                        </motion.span>
                        <span className="truncate flex-1 font-medium">{item.name}</span>
                        {item.badge && (
                          <motion.span 
                            className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-500 text-white text-xs"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.2 }}
                          >
                            3
                          </motion.span>
                        )}
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.2 }}
                          >
                            <ChevronRight size={16} className="text-purple-400" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </nav>

          {/* User Actions with enhanced styling */}
          <div className="p-4 border-t border-purple-500/20 flex-shrink-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent">
            <div className="flex flex-col space-y-2">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-sidebar-foreground/90 px-3 py-2 rounded-lg bg-purple-500/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <User size={16} className="text-purple-400 flex-shrink-0" />
                    <span className="truncate font-medium">{user.display_name || user.email}</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/profile"
                      className={`flex items-center rounded-xl transition-all duration-300 px-3 py-3 touch-target-large mobile-focus-visible ${
                        isActive('/profile')
                          ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-foreground shadow-lg transform scale-[1.02]'
                          : 'text-muted-foreground hover:bg-purple-500/10 hover:text-foreground'
                      }`}
                      onClick={() => onOpenChange(false)}
                      aria-current={isActive('/profile') ? 'page' : undefined}
                    >
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <User 
                          size={20} 
                          className={`transition-transform duration-300 ${
                            isActive('/profile') ? 'text-purple-400' : 'text-muted-foreground'
                          } flex-shrink-0`} 
                        />
                      )}
                      <span className="ml-3 font-medium">Profile</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 px-3 py-3 touch-target-large mobile-focus-visible rounded-xl"
                      onClick={handleLogout}
                    >
                      <LogOut size={20} className="mr-2 text-red-500 flex-shrink-0" />
                      <span className="text-red-500/90 font-medium">Sign Out</span>
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 px-3 py-3 touch-target-large mobile-focus-visible rounded-xl"
                    onClick={handleLoginNavigation}
                  >
                    <LogIn size={20} className="mr-2 text-purple-400 flex-shrink-0" />
                    <span className="text-purple-400/90 font-medium">Sign In</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;