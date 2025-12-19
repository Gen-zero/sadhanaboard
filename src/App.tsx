import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { LoadingProvider } from "@/components/loading";
import { ErrorBoundary } from "@/components/error";
import {
  AboutPage,
  AnalyticsPage,
  DashboardPage,
  ExperimentPage,
  HomePage,
  LibraryPage,
  LoginPage,
  NotFound,
  OnboardingPage,
  PratyangiraPage,
  ProfilePage,
  SadhanaPage,
  SaadhanasPage,
  SettingsPage,
  SignupPage,
  SpiritualDemoPage,
  StorePage,
  WaitlistPage,
  WalkthroughPage,
  HelpDemoPage,
  EnergyLevelPage,
  CosmosThemePage,
  BeadCounterPage,
  CalendarPage
} from "./pages";
import { ThemesShowcasePage } from "./pages";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useDailySadhanaRefresh } from "./hooks/useDailySadhanaRefresh";
import { useEffect, useState, lazy, Suspense, useMemo, useCallback } from "react";
import ThemeProvider from "./components/ThemeProvider";
import { useSettings } from "./hooks/useSettings";
import ThemedBackground from "./components/ThemedBackground";
import FocusVisible from "./components/FocusVisible";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import { SadhanaProgressProvider } from "./contexts/SadhanaProgressContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { HelpProvider } from "./contexts/HelpContext";
import { SocketProvider } from "./contexts/SocketContext";
import { ScrollAnimationProvider } from "@/context/ScrollAnimationContext";
import DemoBanner from "./components/DemoBanner";

// Add new page imports with lazy loading for code splitting
const CareersPage = lazy(() => import('./pages/landing/CareersPage'));
const ManifestoPage = lazy(() => import('./pages/landing/ManifestoPage'));

// Configure React Query for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes (increased for better caching)
      gcTime: 1000 * 60 * 15, // 15 minutes (increased)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
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
  "ॐ नमः शिवाय शंभवे च विष्णुवे देवाय च ध्रुवाय च",
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
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" style={{ animationDuration: '1s' }} />
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
  const { user, isLoading, isOnboardingComplete } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Set a timeout to prevent indefinite loading
  useEffect(() => {
    if (isLoading || isOnboardingComplete === null) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 3000); // 3 second timeout (reduced from 5)

      return () => clearTimeout(timer);
    }
  }, [isLoading, isOnboardingComplete]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" style={{ animationDuration: '1s' }} />
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
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" style={{ animationDuration: '1s' }} />
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
  const currentTheme = useMemo(() => settings?.appearance?.colorScheme || 'default', [settings?.appearance?.colorScheme]);

  useEffect(() => {
    setLoaded(false);
    // Instant transition for faster perceived performance
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [location]);

  // For Tara theme and others, disable transitions for better performance
  if (currentTheme === 'tara' || currentTheme === 'cosmos') {
    return <div className="transition-none">{children}</div>;
  }

  // Show minimal loading indicator while transitioning
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* Minimal loading spinner - less CPU intense */}
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
      </div>
    );
  }

  // Render children directly without animations
  return <div>{children}</div>;
};

// Loading fallback component for lazy-loaded routes
const RouteLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" style={{ animationDuration: '1s' }} />
  </div>
);

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
      <Route path="/pratyangira" element={<ProtectedRoute><PratyangiraPage /></ProtectedRoute>} />

      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/careers" element={
        <Suspense fallback={<RouteLoadingFallback />}>
          <CareersPage />
        </Suspense>
      } />
      <Route path="/manifesto" element={
        <Suspense fallback={<RouteLoadingFallback />}>
          <ManifestoPage />
        </Suspense>
      } />
      <Route path="/experiment" element={<ExperimentPage />} />
      <Route path="/dashboard" element={<OnboardingRoute><DashboardPage /></OnboardingRoute>} />
      <Route path="/analytics" element={<OnboardingRoute><AnalyticsPage /></OnboardingRoute>} />
      <Route path="/sadhana" element={<OnboardingRoute><SadhanaPage /></OnboardingRoute>} />
      <Route path="/saadhanas" element={<OnboardingRoute><SaadhanasPage /></OnboardingRoute>} />

      <Route path="/library" element={<OnboardingRoute><LibraryPage /></OnboardingRoute>} />
      <Route path="/settings" element={<OnboardingRoute><SettingsPage /></OnboardingRoute>} />
      <Route path="/profile" element={<OnboardingRoute><ProfilePage /></OnboardingRoute>} />
      <Route path="/energy-level" element={<OnboardingRoute><EnergyLevelPage /></OnboardingRoute>} />
      <Route path="/help" element={<OnboardingRoute><HelpDemoPage /></OnboardingRoute>} />
      <Route path="/psychological-levers" element={<OnboardingRoute><EnergyLevelPage /></OnboardingRoute>} />
      <Route path="/cosmos-theme" element={<OnboardingRoute><CosmosThemePage /></OnboardingRoute>} />
      <Route path="/themes" element={<ThemesShowcasePage />} />
      <Route path="/beads" element={<OnboardingRoute><BeadCounterPage /></OnboardingRoute>} />
      <Route path="/calendar" element={<OnboardingRoute><CalendarPage /></OnboardingRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const { settings, isLoading } = useSettings();

  // Memoize theme determination - MUST be called before any conditional returns
  const backgroundTheme = useMemo(() => {
    const validThemes = ['default', 'earth', 'water', 'fire', 'shiva', 'bhairava', 'serenity', 'ganesha', 'mystery', 'neon', 'tara', 'durga', 'mahakali', 'swamiji', 'cosmos', 'lakshmi', 'vishnu', 'krishna'] as const;
    return (settings?.appearance?.colorScheme &&
      validThemes.includes(settings.appearance.colorScheme as typeof validThemes[number])
      ? settings.appearance.colorScheme as typeof validThemes[number]
      : 'default');
  }, [settings?.appearance?.colorScheme]);

  // Show a minimal loading spinner while settings are loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" style={{ animationDuration: '1s' }} />
      </div>
    );
  }

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
              <SocketProvider>
                <HelpProvider>
                  <ScrollAnimationProvider>
                    <SadhanaProgressProvider>
                      <div className="relative">
                        <ThemedBackground theme={backgroundTheme} />
                        <div className="relative z-10">
                          <DemoBanner />
                          <FocusVisible />
                          <SmoothScroll />
                          <Toaster />
                          <Sonner />
                          <CustomCursor />
                          <BrowserRouter future={{
                            v7_startTransition: true,
                            v7_relativeSplatPath: true
                          }}>
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
                    </SadhanaProgressProvider>
                  </ScrollAnimationProvider>
                </HelpProvider>
              </SocketProvider>
            </AuthProvider>
          </TooltipProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;