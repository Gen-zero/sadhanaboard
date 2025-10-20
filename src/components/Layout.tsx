import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import { getThemeById, themeUtils } from '@/themes';
import EnhancedDeityIcon from './EnhancedDeityIcon';
import { Leaf, Zap, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import DesktopNavigation from '@/components/navigation/DesktopNavigation';
import BottomNavigationBar from '@/components/navigation/BottomNavigationBar';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useResponsiveNavigation } from '@/hooks/useResponsiveNavigation';

interface LayoutProps {
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, headerActions }) => {
  const isMobile = useIsMobile();
  const [mantraIndex, setMantraIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { settings, isLoading } = useSettings();
  const { t } = useTranslation();
  const { 
    prefersReducedMotion, 
    prefersHighContrast, 
    isKeyboardUser, 
    useSkipToContent,
    useFocusTrap
  } = useAccessibility();
  
  const {
    isSidebarOpen,
    isMobileMenuOpen,
    setIsSidebarOpen,
    setIsMobileMenuOpen,
    closeMobileMenu
  } = useResponsiveNavigation();

  // Apply accessibility classes to body
  useEffect(() => {
    if (prefersReducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    
    if (prefersHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    if (isKeyboardUser) {
      document.body.classList.add('user-is-tabbing');
    } else {
      document.body.classList.remove('user-is-tabbing');
    }
    
    return () => {
      document.body.classList.remove('reduced-motion', 'high-contrast', 'user-is-tabbing');
    };
  }, [prefersReducedMotion, prefersHighContrast, isKeyboardUser]);

  // Set up skip to content
  useSkipToContent();

  // Set up focus trap for mobile menu
  useFocusTrap(isMobileMenuOpen);

  // Mantras to show in the small top marquee
  const hinduMantras = [
    'ॐ तारे तुत्तारे तुरे स्वाहा',
    'ॐ सर्वे भवन्तु सुखिनः',
    'ॐ भूर्भुवः स्वः',
    'ॐ तत्सत्वितुर्वरेण्यं',
    'ॐ शांतिः शांतिः शांतिः',
    'ॐ नमो नारायणाय',
    'ॐ नमः शिवाय शंभवे च विष्णवे देवाय च ध्रुवाय च',
    'ॐ ह्रीं दुर्गायै नमः',
    'ॐ ऐं सरस्वत्यै नमः',
    'ॐ ह्रीं श्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मि',
    'ॐ गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः',
    'ॐ सह नाववतु सह नौ भुनक्तु',
    'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते',
    'ॐ असतो मा सद्गमय तमसो मा ज्योतिर्गमय',
    'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
    'ॐ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ',
    'ॐ मणिपद्मे हूं',
    'ॐ अहं ब्रह्मास्मि',
    'ॐ तत्त्वमसि',
    'ॐ सर्वं खल्विदं ब्रह्म',
    'ॐ ईशावास्यमिदं सर्वम्',
    'ॐ यतो वा इमानि भूतानि जायन्ते',
    'ॐ हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे',
    'ॐ राम राम राम राम राम राम रामेति',
    'ॐ जय गणेश जय गणेश जय गणेश देवा',
    'ॐ भद्रं कर्णेभिः शृणुयाम देवाः'
  ];

  // Cycle through mantras
  useEffect(() => {
    const interval = setInterval(() => {
      setMantraIndex((prev) => (prev + 1) % hinduMantras.length);
    }, 10000); // Change mantra every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Don't render anything if settings are still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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

  // Get the current theme
  const currentTheme = settings?.appearance?.colorScheme || 'default';
  const currentThemeData = themeData[currentTheme as keyof typeof themeData] || themeData.default;

  return (
    <div className="min-h-screen flex bg-transparent relative overflow-hidden">
      {/* Skip to content link for keyboard users */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Cosmic particle background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-purple-500/20 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 4 + 2}s`,
              opacity: Math.random() * 0.4 + 0.2
            }}
          ></div>
        ))}
      </div>

      {/* Ambient floating lotus petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float-petal"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + Math.random() * 20}s`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          >
            <Leaf className="h-8 w-8 text-pink-300/50" />
          </div>
        ))}
      </div>

      {/* Mandala background pattern */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-primary/30 animate-spin" style={{ animationDuration: '60s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full border border-pink-500/30 animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full border border-blue-500/30 animate-spin" style={{ animationDuration: '30s' }}></div>
        
        {/* Additional mandala elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-pink-500/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-500/20 rounded-full"></div>
      </div>

      {/* Floating yantra patterns in the background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-3">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float-diagonal"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 5}s`,
              animationDuration: `${30 + Math.random() * 30}s`,
              opacity: 0.1 + Math.random() * 0.2,
              fontSize: `${2 + Math.random() * 2}rem`
            }}
          >
            ▲▼▲
          </div>
        ))}
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <motion.header 
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/10 pt-safe mobile-header"
        >
          <div className="flex items-center justify-between px-4 py-3 mobile-header-content">
            <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
              {/* Mobile Navigation */}
              <MobileNavigation 
                isOpen={isMobileMenuOpen} 
                onOpenChange={setIsMobileMenuOpen} 
              />
              
              {/* Logo and Title Container */}
              <div className="flex items-center space-x-2 min-w-0 flex-shrink-0 overflow-hidden mobile-header-logo-title">
                {/* Logo */}
                <div className="relative group flex-shrink-0">
                  <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-transparent logo-wrapper">
                    <img
                      src="/lovable-uploads/sadhanaboard_logo.png"
                      alt="Saadhana Board Logo"
                      className="h-full w-full object-contain cursor-pointer transition-all duration-500 hover:scale-110 logo-enhanced"
                      onClick={() => {
                        navigate('/');
                      }}
                    />
                  </div>
                </div>
                
                <h1 
                  className="text-xl font-bold cursor-pointer transition-all duration-300 hover:text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 whitespace-nowrap overflow-hidden text-ellipsis mobile-heading-scale flex-shrink-0"
                  onClick={() => {
                    navigate('/');
                  }}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate('/');
                    }
                  }}
                >
                  SadhanaBoard
                </h1>
              </div>
            </div>
            
            {/* Ambient mantra display for mobile */}
            <div className="overflow-hidden max-w-[100px] flex-shrink-0 ml-2">
              <div className="text-center text-xs text-primary/60 font-sans animate-pulse-slow whitespace-nowrap truncate mobile-text-scale" aria-live="polite">
                {hinduMantras[mantraIndex]}
              </div>
            </div>
          </div>
        </motion.header>
      )}

      {/* Desktop Sidebar - Only shown on desktop */}
      {!isMobile && (
        <DesktopNavigation 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          currentThemeData={currentThemeData}
          onNavigate={() => {}}
        />
      )}

      {/* Small fixed toggle when sidebar is collapsed (desktop only) */}
      {!isMobile && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
          className="fixed left-2 top-2 z-50 h-10 w-10 rounded-full bg-primary/10 backdrop-blur-md flex items-center justify-center hover:bg-primary/20 transition-all mobile-focus-visible"
        >
          <Menu className="h-5 w-5 text-primary" />
        </button>
      )}

      {/* Main content */}
      <main 
        id="main-content"
        tabIndex={-1}
        className={`flex-1 transition-all duration-300 ${
          isMobile ? 'pt-mobile-header px-4 pb-20' : 'p-4 sm:p-6'
        } ${!isMobile && isSidebarOpen ? 'ml-[360px]' : ''} ${isMobile ? 'px-responsive py-responsive' : ''}`}
      >
        <div className="max-w-screen-2xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      {isMobile && <BottomNavigationBar />}
    </div>
  );
};

export default Layout;