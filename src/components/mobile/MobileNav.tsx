import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, Flame, User, Scroll, Users, Zap } from 'lucide-react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

interface MobileNavProps {
  isMahakaliTheme?: boolean;
  showHamburger?: boolean;
  showLoginButton?: boolean; // New prop to control login button visibility
}

const MobileNav = ({ isMahakaliTheme = false, showHamburger = true, showLoginButton = false }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Handle animation end
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  return (
    <>
      {/* Mobile menu button with glow effect - Fixed position in top-right of navbar */}
      {showHamburger && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="fixed top-4 right-4 z-[9999999] p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? (
            <X className={`h-6 w-6 ${isMahakaliTheme ? 'text-red-400' : 'text-amber-400'}`} />
          ) : (
            <Menu className={`h-6 w-6 ${isMahakaliTheme ? 'text-red-400' : 'text-amber-400'}`} />
          )}
        </Button>
      )}

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

      {/* Mobile menu overlay with fade and blur effect */}
      {(isOpen || isAnimating) && showHamburger && (
        <div 
          className={`fixed inset-0 z-[9999998] bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
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

      {/* Mobile menu with enhanced animations and effects - only shown if showHamburger is true */}
      {showHamburger && (
        <div 
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm z-[9999999] transform transition-all duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${bgColor} ${borderColor} border-l backdrop-blur-2xl shadow-2xl`}
          style={{
            boxShadow: isMahakaliTheme 
              ? '0 0 30px rgba(220, 38, 38, 0.3), -5px 0 15px rgba(0, 0, 0, 0.5)' 
              : '0 0 30px rgba(251, 191, 36, 0.3), -5px 0 15px rgba(0, 0, 0, 0.5)'
          }}
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMenu}
                  className={`rounded-full ${glowColor} hover:scale-110 transition-transform`}
                  aria-label="Close menu"
                >
                  <X className={`h-7 w-7 ${isMahakaliTheme ? 'text-red-400' : 'text-amber-400'} hover:animate-spin`} style={{ animationDuration: '0.3s' }} />
                </Button>
              </div>
            </div>

            {/* Navigation links with enhanced styling and icons */}
            <nav className="flex-1 flex flex-col py-6 px-4 space-y-2">
              <Link 
                to="/about" 
                className={`px-5 py-4 rounded-2xl ${textColor} hover:bg-white/10 transition-all duration-300 flex items-center group relative overflow-hidden`}
                onClick={closeMenu}
              >
                <div className={`absolute inset-0 rounded-2xl ${isMahakaliTheme ? 'bg-red-900/20' : 'bg-amber-900/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <Scroll className="mr-4 h-5 w-5 group-hover:scale-125 transition-transform" />
                <span className="text-lg font-medium relative z-10">About</span>
                <div className={`absolute right-4 ${isMahakaliTheme ? 'text-red-400' : 'text-amber-400'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <Zap className="h-4 w-4" />
                </div>
              </Link>
              
              <Link 
                to="/careers" 
                className={`px-5 py-4 rounded-2xl ${textColor} hover:bg-white/10 transition-all duration-300 flex items-center group relative overflow-hidden`}
                onClick={closeMenu}
              >
                <div className={`absolute inset-0 rounded-2xl ${isMahakaliTheme ? 'bg-red-900/20' : 'bg-amber-900/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                {isMahakaliTheme ? (
                  <>
                    <Flame className="mr-4 h-5 w-5 group-hover:scale-125 transition-transform text-red-400" />
                    <span className="text-lg font-medium relative z-10">Join Us</span>
                    <div className="absolute right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap className="h-4 w-4" />
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-4 h-5 w-5 group-hover:scale-125 transition-transform text-amber-400" />
                    <span className="text-lg font-medium relative z-10">Join Us</span>
                    <div className="absolute right-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap className="h-4 w-4" />
                    </div>
                  </>
                )}
              </Link>
              
              <Link 
                to="/manifesto" 
                className={`px-5 py-4 rounded-2xl ${textColor} hover:bg-white/10 transition-all duration-300 flex items-center group relative overflow-hidden`}
                onClick={closeMenu}
              >
                <div className={`absolute inset-0 rounded-2xl ${isMahakaliTheme ? 'bg-red-900/20' : 'bg-amber-900/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <Scroll className="mr-4 h-5 w-5 group-hover:scale-125 transition-transform" />
                <span className="text-lg font-medium relative z-10">Manifesto</span>
                <div className={`absolute right-4 ${isMahakaliTheme ? 'text-red-400' : 'text-amber-400'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <Zap className="h-4 w-4" />
                </div>
              </Link>
            </nav>

            {/* Action buttons with enhanced styling */}
            <div className={`p-5 border-t ${isMahakaliTheme ? 'border-red-800/50' : 'border-amber-800/50'} backdrop-blur-sm bg-black/20 space-y-4`}>
              <Button 
                asChild 
                variant="outline" 
                className={`w-full border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] py-6 text-lg relative overflow-hidden group ${
                  isMahakaliTheme 
                    ? 'hover:border-red-400/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                    : 'hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                }`}
                onClick={closeMenu}
              >
                <Link to="/login" className="flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <User className="mr-2 h-5 w-5" />
                  Enter Sacred Space
                </Link>
              </Button>
              
              <Button 
                asChild 
                className={`w-full text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] py-6 text-lg relative overflow-hidden group ${
                  isMahakaliTheme 
                    ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]' 
                    : 'bg-gradient-to-r from-amber-600 to-yellow-700 hover:from-amber-700 hover:to-yellow-800 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]'
                }`}
                onClick={closeMenu}
              >
                <Link to="/waitlist" className="flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isMahakaliTheme ? (
                    <>
                      <Flame className="mr-2 h-5 w-5 animate-pulse" />
                      Join the Sacred Fire
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                      Join the Divine Journey
                    </>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;