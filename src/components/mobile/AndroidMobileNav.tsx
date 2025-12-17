import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  User, 
  Settings, 
  Plus, 
  Menu, 
  X, 
  Sparkles, 
  Flame, 
  Scroll, 
  Users, 
  Zap,
  ChevronRight,
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { 
  AndroidButton,
  AndroidCard,
  AndroidListItem,
  AndroidSwitch
} from './AndroidMobileComponents';

interface AndroidMobileNavProps {
  isMahakaliTheme?: boolean;
  showHamburger?: boolean;
  showLoginButton?: boolean;
}

const AndroidMobileNav = ({ 
  isMahakaliTheme = false, 
  showHamburger = true, 
  showLoginButton = false 
}: AndroidMobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    if (!isOpen) {
      setIsAnimating(true);
    }
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsAnimating(false);
    setIsOpen(false);
  };

  const bgColor = isMahakaliTheme 
    ? 'bg-gradient-to-br from-red-900/95 via-black/95 to-red-950/95' 
    : 'bg-gradient-to-br from-amber-900/95 via-purple-900/95 to-indigo-900/95';
    
  const borderColor = isMahakaliTheme 
    ? 'border-red-700/70' 
    : 'border-amber-700/70';
    
  const textColor = isMahakaliTheme 
    ? 'text-red-100' 
    : 'text-amber-100';
    
  const hoverColor = isMahakaliTheme 
    ? 'hover:text-red-300' 
    : 'hover:text-amber-300';
    
  const glowColor = isMahakaliTheme 
    ? 'shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
    : 'shadow-[0_0_15px_rgba(251,191,36,0.5)]';

  // Navigation items with Android-like styling
  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={24} />, path: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: <Calendar size={24} />, path: '/dashboard' },
    { id: 'sadhana', label: 'Sadhana', icon: <CheckSquare size={24} />, path: '/sadhana' },
    { id: 'saadhanas', label: 'Saadhanas', icon: <CheckSquare size={24} />, path: '/saadhanas' },
    { id: 'library', label: 'Library', icon: <BookOpen size={24} />, path: '/library' },
    { id: 'community', label: 'Community', icon: <Users size={24} />, path: '/community' },
    { id: 'profile', label: 'Profile', icon: <User size={24} />, path: '/profile' },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} />, path: '/settings' }
  ];

  return (
    <div className="md:hidden">
      {/* Android-like App Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className={`absolute -inset-1 rounded-full ${glowColor} opacity-30 blur`}></div>
                <ResponsiveImage
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-8 w-8 rounded-full cursor-pointer relative z-10"
                  quality="high"
                  lazy={false}
                />
              </div>
              <span className="text-lg font-bold text-foreground">SadhanaBoard</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {showHamburger && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="relative z-50 rounded-full"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? (
                  <X className={`h-6 w-6 ${isMahakaliTheme ? 'text-red-400' : 'text-amber-400'}`} />
                ) : (
                  <Menu className={`h-6 w-6 ${isMahakaliTheme ? 'text-red-400' : 'text-amber-400'}`} />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Login button - only shown if showLoginButton is true and showHamburger is false */}
      {!showHamburger && showLoginButton && (
        <Button 
          asChild 
          variant="outline" 
          className={`border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 py-2 text-sm relative overflow-hidden group ${
            isMahakaliTheme 
              ? 'hover:border-red-400/50 hover:shadow-[0_0_10px_rgba(220,38,38,0.3)]' 
              : 'hover:border-amber-400/50 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]'
          }`}
        >
          <Link to="/login" className="flex items-center">
            <User className="mr-1 h-4 w-4" />
            Login
          </Link>
        </Button>
      )}

      {/* Android-like Mobile menu overlay with fade and blur effect */}
      {(isOpen || isAnimating) && showHamburger && (
        <div 
          className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              closeMenu();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close mobile menu"
        />
      )}

      {/* Android-like Mobile menu with enhanced animations and effects - only shown if showHamburger is true */}
      {showHamburger && (
        <motion.div 
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm z-50 transform transition-all duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${bgColor} ${borderColor} border-l backdrop-blur-2xl shadow-2xl`}
          style={{
            boxShadow: isMahakaliTheme 
              ? '0 0 30px rgba(220, 38, 38, 0.3), -5px 0 15px rgba(0, 0, 0, 0.5)' 
              : '0 0 30px rgba(251, 191, 36, 0.3), -5px 0 15px rgba(0, 0, 0, 0.5)'
          }}
          initial={{ x: '100%' }}
          animate={{ x: isOpen ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {isMahakaliTheme ? (
              <>
                <div className="absolute top-10 right-10 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-70"></div>
                <div className="absolute top-32 left-8 w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-20 right-16 w-1.5 h-1.5 bg-red-600 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-12 w-1 h-1 bg-red-300 rounded-full animate-pulse opacity-70" style={{ animationDelay: '2s' }}></div>
              </>
            ) : (
              <>
                <div className="absolute top-10 right-10 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-70"></div>
                <div className="absolute top-32 left-8 w-1 h-1 bg-yellow-300 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-20 right-16 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-12 w-1 h-1 bg-yellow-200 rounded-full animate-pulse opacity-70" style={{ animationDelay: '2s' }}></div>
              </>
            )}
          </div>

          <div className="flex flex-col h-full relative">
            {/* Header with logo and enhanced styling */}
            <div className={`p-5 border-b ${isMahakaliTheme ? 'border-red-800/50' : 'border-amber-800/50'} backdrop-blur-sm bg-black/20`}>
              <div className="flex items-center justify-between">
                <Link 
                  to="/" 
                  className="flex items-center space-x-3"
                  onClick={closeMenu}
                >
                  <div className="relative">
                    <div className={`absolute -inset-1 rounded-full ${glowColor} opacity-30 blur`}></div>
                    <ResponsiveImage
                      src="/lovable-uploads/sadhanaboard_logo.png"
                      alt="SadhanaBoard Logo"
                      className="h-12 w-12 rounded-full cursor-pointer relative z-10"
                      quality="high"
                      lazy={false}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300">
                      SadhanaBoard
                    </span>
                    {isMahakaliTheme ? (
                      <span className="text-xs text-red-400/80 font-medium tracking-wider flex items-center">
                        <Flame className="mr-1 h-3 w-3" />
                        Destroyer of Illusions
                      </span>
                    ) : (
                      <span className="text-xs text-yellow-400/80 font-medium tracking-wider flex items-center">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Your Digital Yantra
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Android-like Navigation items */}
            <nav className="flex-1 flex flex-col py-4 px-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <AndroidListItem
                  key={item.id}
                  title={item.label}
                  icon={item.icon}
                  trailing={<ChevronRight size={20} />}
                  onClick={() => {
                    navigate(item.path);
                    closeMenu();
                  }}
                  className="px-4 py-3 rounded-lg"
                />
              ))}
              
              {/* Settings section with toggle */}
              <div className="px-4 py-3 border-t border-border mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Dark Mode</span>
                  </div>
                  <AndroidSwitch 
                    checked={darkMode}
                    onChange={setDarkMode}
                  />
                </div>
              </div>
            </nav>

            {/* Action buttons with enhanced styling */}
            <div className={`p-5 border-t ${isMahakaliTheme ? 'border-red-800/50' : 'border-amber-800/50'} backdrop-blur-sm bg-black/20 space-y-4`}>
              <AndroidButton
                variant="filled"
                color="primary"
                size="large"
                icon={<User size={20} />}
                onClick={() => {
                  navigate('/login');
                  closeMenu();
                }}
                className="w-full"
              >
                Enter Sacred Space
              </AndroidButton>
              
              <AndroidButton
                variant="outlined"
                color="primary"
                size="large"
                icon={isMahakaliTheme ? <Flame size={20} /> : <Sparkles size={20} />}
                onClick={() => {
                  navigate('/waitlist');
                  closeMenu();
                }}
                className="w-full"
              >
                {isMahakaliTheme ? 'Join the Sacred Fire' : 'Join the Divine Journey'}
              </AndroidButton>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AndroidMobileNav;