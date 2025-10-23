import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { LoadingProvider } from "@/components/loading";
import { ErrorBoundary } from "@/components/error";
import {
  AboutPage,
  AdminAssetsPage,
  AdminBIDashboardPage,
  AdminCommunityPage,
  AdminContentPage,
  AdminDashboardPage,
  AdminLayout,
  AdminLibraryPage,
  AdminLoginPage,
  AdminLogsPage,
  AdminSettingsReportsPage,
  AdminSystemPage,
  AdminTemplatesPage,
  AdminThemesPage,
  AdminUsersPage,
  AnalyticsPage,
  CommunityFeedPage,
  DashboardPage,
  ExperimentPage,
  HomePage,
  LanguageTestPage,
  LibraryPage,
  LoginPage,
  NotFound,
  OnboardingPage,
  PratyangiraPage,
  ProfilePage,
  SadhanaPage,
  SaadhanasPage,
  SettingsPage,
  SharedSadhanaDetailPage,
  SignupPage,
  SpiritualDemoPage,
  StorePage,
  ThemePreviewPage,
  WaitlistPage,
  WalkthroughPage,
  AdminNotFound,
  CosmicAdminPage,
  HelpDemoPage,
  EnergyLevelPage, // Add this import
  CosmosThemePage
} from "./pages"; // Imports fixed
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useDailySadhanaRefresh } from "./hooks/useDailySadhanaRefresh";
import { useEffect, useState, useRef, useMemo } from "react";
import ThemeProvider from "./components/ThemeProvider";
import { useSettings } from "./hooks/useSettings";
import ThemedBackground from "./components/ThemedBackground";
import FocusVisible from "./components/FocusVisible";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { adminRoutes } from "./routes/adminRoutes";
import { HelpProvider } from "./contexts/HelpContext"; // Add this import
import TestDurgaPage from './pages/TestDurgaPage';
import { AnimatePresence, motion } from 'framer-motion';
// Add new page imports
import CareersPage from './pages/landing/CareersPage';
import ManifestoPage from './pages/landing/ManifestoPage';

// Configure React Query for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

// Hindu mantras for ambient display - Admin Panel Ready
const hinduMantras = [
  "ॐ गं गणपतये नमः",
  "ॐ नमः शिवाय",
  "ॐ नमो भगवते वासुदेवाय",
  "ॐ श्रीं महालक्ष्म्यै नमः",
  "ॐ ह्रीं क्लीं चामुण्डायै विच्चे",
  "ॐ तारे तुत्तारे तुरे स्वाहा",
  "ॐ सर्वे भवन्तु सुखिनः",
  "ॐ भूर्भुवः स्वः",
  "ॐ तत्सत्वितुर्वरेण्यं",
  "ॐ शांतिः शांतिः शांतिः",
  "ॐ नमो नारायणाय",
  "ॐ नमः शिवाय शंभवे च विष्णवे देवाय च ध्रुवाय च",
  "ॐ ह्रीं दुर्गायै नमः",
  "ॐ ऐं सरस्वत्यै नमः",
  "ॐ ह्रीं श्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मि",
  "ॐ गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः",
  "ॐ सह नाववतु सह नौ भुनक्तु",
  "ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते",
  "ॐ असतो मा सद्गमय तमसो मा ज्योतिर्गमय",
  "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
  "ॐ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ",
  "ॐ मणिपद्मे हूं",
  "ॐ अहं ब्रह्मास्मि",
  "ॐ तत्त्वमसि",
  "ॐ सर्वं खल्विदं ब्रह्म",
  "ॐ ईशावास्यमिदं सर्वम्",
  "ॐ यतो वा इमानि भूतानि जायन्ते",
  "ॐ हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे",
  "ॐ राम राम राम राम राम राम रामेति",
  "ॐ जय गणेश जय गणेश जय गणेश देवा",
  "ॐ भद्रं कर्णेभिः शृणुयाम देवाः"
];

// Protected route component that checks for authentication
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Onboarding route component that checks for onboarding completion
const OnboardingRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading, isOnboardingComplete, checkOnboardingStatus } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Set a timeout to prevent indefinite loading
  useEffect(() => {
    if (isLoading || isOnboardingComplete === null) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isOnboardingComplete]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Handle timeout case
  if (loadingTimeout && isOnboardingComplete === null) {
    // Assume onboarding is complete to prevent blocking the app
    return children;
  }
  
  // Handle the case when onboarding status is still loading/unknown
  if (isOnboardingComplete === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (isOnboardingComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
};

// Page transition component for smooth transitions between pages
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  
  // Get the current theme from settings or default to 'default'
  const { settings } = useSettings();
  const currentTheme = settings?.appearance?.colorScheme || 'default';
  const isTaraTheme = currentTheme === 'tara';
  
  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  // For Tara theme, disable transitions completely to maintain consistent scale and position
  if (isTaraTheme) {
    return <div className="transition-none">{children}</div>;
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 1.05 }}
        transition={{ 
          duration: 0.5, 
          ease: "easeInOut",
          opacity: { duration: 0.3 },
          y: { duration: 0.5 },
          scale: { duration: 0.4 }
        }}
        className={`transition-all duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  // Initialize daily sadhana refresh globally
  useDailySadhanaRefresh();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/waitlist" element={<WaitlistPage />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/walkthrough" element={<ProtectedRoute><WalkthroughPage /></ProtectedRoute>} />
      <Route path="/your-atma-yantra" element={<ProtectedRoute><SpiritualDemoPage /></ProtectedRoute>} />
      <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
      <Route path="/language-test" element={<ProtectedRoute><LanguageTestPage /></ProtectedRoute>} />
      <Route path="/pratyangira" element={<ProtectedRoute><PratyangiraPage /></ProtectedRoute>} />

      <Route path="/" element={<HomePage />} />
      <Route path="/landingpage" element={<HomePage />} />
      <Route path="/pages" element={<HomePage />} />
      <Route path="/MahakaliLandingpage" element={<ExperimentPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/manifesto" element={<ManifestoPage />} />
      
      {/* Admin Panel - Using cosmic admin routes */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<CosmicAdminPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="community" element={<AdminCommunityPage />} />
        <Route path="library" element={<AdminLibraryPage />} />
        <Route path="system" element={<AdminSystemPage />} />
        <Route path="logs" element={<AdminLogsPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="assets" element={<AdminAssetsPage />} />
        <Route path="templates" element={<AdminTemplatesPage />} />
        <Route path="themes" element={<AdminThemesPage />} />
        <Route path="settings" element={<AdminSettingsReportsPage />} />
        <Route path="bi-dashboard" element={<AdminBIDashboardPage />} />
        <Route path="*" element={<AdminNotFound />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      
      <Route path="/dashboard" element={<OnboardingRoute><DashboardPage /></OnboardingRoute>} />
      <Route path="/analytics" element={<OnboardingRoute><AnalyticsPage /></OnboardingRoute>} />
      <Route path="/sadhana" element={<OnboardingRoute><SadhanaPage /></OnboardingRoute>} />
      <Route path="/saadhanas" element={<OnboardingRoute><SaadhanasPage /></OnboardingRoute>} />
      <Route path="/community" element={<OnboardingRoute><CommunityFeedPage /></OnboardingRoute>} />
      <Route path="/community/:id" element={<OnboardingRoute><SharedSadhanaDetailPage /></OnboardingRoute>} />
      <Route path="/library" element={<OnboardingRoute><LibraryPage /></OnboardingRoute>} />
      <Route path="/settings" element={<OnboardingRoute><SettingsPage /></OnboardingRoute>} />
      <Route path="/profile" element={<OnboardingRoute><ProfilePage /></OnboardingRoute>} />
      <Route path="/energy-level" element={<OnboardingRoute><EnergyLevelPage /></OnboardingRoute>} />
      <Route path="/test-durga" element={<OnboardingRoute><TestDurgaPage /></OnboardingRoute>} />
      <Route path="/help" element={<OnboardingRoute><HelpDemoPage /></OnboardingRoute>} />
      <Route path="/psychological-levers" element={<OnboardingRoute><EnergyLevelPage /></OnboardingRoute>} />
      <Route path="/cosmos-theme" element={<OnboardingRoute><CosmosThemePage /></OnboardingRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};



const App = () => {
  const { settings, isLoading } = useSettings();
  
  // Show a loading spinner while settings are loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Determine the theme for background animation
  // Force default theme on all landing pages
  const landingPagePaths = ['/landingpage', '/', '/pages', '/MahakaliLandingpage', '/about'];
  const isLandingPage = landingPagePaths.includes(window.location.pathname);
  type BackgroundTheme = 'default' | 'earth' | 'water' | 'fire' | 'shiva' | 'bhairava' | 'serenity' | 'ganesha' | 'mahakali' | 'mystery' | 'neon' | 'lakshmi' | 'tara' | 'swamiji' | 'cosmos' | 'durga';
  const backgroundTheme = isLandingPage 
    ? 'default' 
    : settings?.appearance?.colorScheme && 
      ['default', 'earth', 'water', 'fire', 'shiva', 'bhairava', 'serenity', 'ganesha', 'mahakali', 'mystery', 'neon', 'lakshmi', 'tara', 'swamiji', 'cosmos', 'durga'].includes(settings.appearance.colorScheme) 
      ? settings.appearance.colorScheme as BackgroundTheme
      : 'default';
  
  return (
    <ErrorBoundary 
      context="main-app" 
      retryable={true}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <TooltipProvider>
            <AuthProvider>
              <HelpProvider> {/* Add HelpProvider here */}
                <div className="relative">
                  <ThemedBackground theme={backgroundTheme} />
                  
                  <div className="relative z-10">
                    <FocusVisible />
                    <SmoothScroll />
                    <Toaster />
                    <Sonner />
                    <CustomCursor />
                    <BrowserRouter>
                      {/* Only render ThemeProvider when settings are loaded */}
                      <PageTransition>
                        {settings ? (
                          <ThemeProvider settings={settings}>
                            <ErrorBoundary context="app-routes" isolate={true}>
                              <AppRoutes />
                            </ErrorBoundary>
                          </ThemeProvider>
                        ) : (
                          <ErrorBoundary context="app-routes" isolate={true}>
                            <AppRoutes />
                          </ErrorBoundary>
                        )}
                      </PageTransition>
                    </BrowserRouter>
                  </div>
                </div>
              </HelpProvider> {/* Close HelpProvider here */}
            </AuthProvider>
          </TooltipProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;