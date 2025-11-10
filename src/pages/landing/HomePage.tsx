import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Calendar, Users, Sparkles, MoonStar, Flame, Target, Heart, Mountain, Star, TrendingUp, Play, Volume2, Eye, Zap, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import CosmicLibraryShowcase from '@/components/library/CosmicLibraryShowcase';
import { useSettings } from '@/hooks/useSettings';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import MobileNav from '@/components/mobile/MobileNav';

// Simple count-up hook for animated stats
const useCountUp = (targetValue: number, durationMs: number = 1500) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let rafId: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * targetValue));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [targetValue, durationMs]);
  return value;
};

// replaced inline SpiritualLibraryShowcase with CosmicLibraryShowcase component

const HomePage = () => {
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();
  
  // Ensure default theme is applied to landing page
  useEffect(() => {
    // If no theme is set or it's not the default theme, set it to default
    if (!settings?.appearance?.colorScheme || settings.appearance.colorScheme !== 'default') {
      updateSettings(['appearance', 'colorScheme'], 'default');
    }
  }, [settings, updateSettings]);

  // Ambient audio toggle
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25;
    if (audioOn) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioOn]);

  // Subtle parallax sparkles in hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };
  const features = [
    {
      title: "Sadhana Tracker",
      description: "Track your daily spiritual practices with our intuitive tracker",
      icon: BookOpen,
      details: "Monitor your progress, set reminders, and maintain consistency in your spiritual journey with our comprehensive tracking system."
    },
    {
      title: "Progress Dashboard",
      description: "Visualize your spiritual growth with detailed analytics",
      icon: Trophy,
      details: "Gain insights into your practice patterns, streaks, and achievements through beautiful visualizations and progress reports."
    },
    {
      title: "Sadhana To-Do List",
      description: "Organize and track your daily spiritual practices",
      icon: Target,
      details: "Create personalized to-do lists for your spiritual practices, set reminders, and track your completion to maintain consistency."
    },
    {
      title: "Yantras",
      description: "Sacred geometric tools for meditation and manifestation",
      icon: Calendar,
      details: "Explore powerful yantras for focus, healing, and spiritual awakening. Use them in meditation, visualization, and ritual practices."
    },
    {
      title: "Sacred Library",
      description: "Access a vast collection of spiritual texts and resources",
      icon: BookOpen,
      details: "Explore our curated library of sacred texts, teachings, and resources to deepen your understanding and practice."
    },
    {
      title: "Divine Themes",
      description: "Personalize your experience with spiritual themes",
      icon: Sparkles,
      details: "Transform your practice with beautiful divine themes inspired by Hindu deities, each with unique visual elements and ambiance."
    }
  ];

  const practices = [
    {
      title: "Meditation & Mindfulness",
      description: "Begin your meditation journey with gentle daily practices",
      level: "Beginner",
      duration: "21 days",
      deity: "Buddha",
      tradition: "Buddhist"
    },
    {
      title: "Om Namah Shivaya",
      description: "Sacred mantra practice for spiritual transformation",
      level: "Beginner",
      duration: "108 days",
      deity: "Shiva",
      tradition: "Hindu"
    },
    {
      title: "Krishna Bhakti",
      description: "Immerse in divine love through Krishna consciousness",
      level: "Beginner",
      duration: "49 days",
      deity: "Krishna",
      tradition: "Vaishnava"
    },
    {
      title: "Divine Mother Worship",
      description: "Connect with the nurturing aspect of the Divine",
      level: "Beginner",
      duration: "21 days",
      deity: "Devi",
      tradition: "Shakta"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Yoga Teacher",
      content: "SadhanaBoard has transformed my daily practice. The tracking features keep me accountable and the progress insights are truly inspiring.",
      avatar: "PS"
    },
    {
      name: "Rahul Mehta",
      role: "Software Engineer",
      content: "The divine calendar helps me stay on top of important spiritual observances. It's a great tool for maintaining consistency in my practice.",
      avatar: "RM"
    },
    {
      name: "Anjali Devi",
      role: "Spiritual Seeker",
      content: "The community features have connected me with like-minded practitioners worldwide. My spiritual journey has deepened through these connections.",
      avatar: "AD"
    },
    {
      name: "Vikram Singh",
      role: "Retired Teacher",
      content: "The sacred library has opened up new dimensions of understanding for me. I've discovered texts I never knew existed that have enriched my practice.",
      avatar: "VS"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Practitioners", icon: Users },
    { value: "500+", label: "Sadhana Practices", icon: BookOpen },
    { value: "50+", label: "Sacred Texts", icon: BookOpen },
    { value: "98%", label: "User Satisfaction", icon: Star }
  ];

  return (
    <>
      {/* Sticky Navigation Bar - Glassy Spiritual Theme */}
      <div 
        className="sticky top-0 left-0 right-0 z-[999999] px-2 sm:px-4 pt-2 sm:pt-4"
        style={{
          pointerEvents: 'auto'
        }}
      >
        <nav 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group hidden md:flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 transform hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.15), rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.15))',
            backdropFilter: 'blur(24px) saturate(200%)',
            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
            border: '1px solid rgba(255, 215, 0, 0.35)',
            boxShadow: '0 12px 40px rgba(139, 69, 19, 0.15), 0 0 0 1px rgba(255, 215, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), transparent, rgba(255, 165, 0, 0.1))'
            }}
          />
          
          {/* Floating spiritual particles in navbar - Responsive positioning */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1 sm:top-2 left-8 sm:left-16 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-yellow-400/70 rounded-full animate-pulse" />
            <div className="absolute top-2 sm:top-4 right-8 sm:right-20 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-purple-400/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1 sm:bottom-3 left-16 sm:left-32 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-fuchsia-400/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            {/* Additional particles for more visual effect */}
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-amber-300/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-yellow-200/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
          
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none border-2 border-transparent animate-border-pulse" style={{
            background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.4), rgba(138, 43, 226, 0.4), rgba(255, 215, 0, 0.4)) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            maskComposite: 'exclude'
          }} />
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group/logo">
              <div className="relative">
                <ResponsiveImage
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-8 w-8 sm:h-12 sm:w-12 rounded-full cursor-pointer scale-110 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover/logo:scale-125"
                  quality="high"
                  lazy={false}
                  style={{
                    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.5))'
                  }}
                />
                {/* Constant glowing ring around logo with animation */}
                <div 
                  className="absolute inset-0 rounded-full animate-spin-slow"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.5), rgba(138, 43, 226, 0.5), rgba(255, 215, 0, 0.5))',
                    padding: '2px'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-background/30" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300 transition-all duration-300 group-hover/logo:from-yellow-200 group-hover/logo:via-purple-200 group-hover/logo:to-fuchsia-200">
                  SadhanaBoard
                </span>
                <span className="text-[10px] sm:text-xs text-yellow-400/80 font-medium tracking-wider hidden xs:block transition-all duration-300 group-hover/logo:text-yellow-300">
                  ✨ Your Digital Yantra
                </span>
              </div>
            </Link>
          </div>
          
          {/* All buttons positioned on the right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="relative text-foreground/90 hover:text-foreground hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-amber-400/50 transition-all duration-300 group/btn overflow-hidden px-3 sm:px-4 py-2 text-sm transform hover:scale-105"
            >
              <Link to="/login">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="relative z-10 flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  Login
                </span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="sm"
              className="relative bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-500/90 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 backdrop-blur-sm border border-amber-400/40 hover:border-yellow-400/60 shadow-lg hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 group/cta overflow-hidden px-3 sm:px-4 py-2 text-sm transform hover:scale-105"
            >
              <Link to="/careers">
                {/* Animated gradient background */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-purple-400/30 to-fuchsia-400/30 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                />
                {/* Floating sparkles - Smaller on mobile */}
                <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-yellow-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
                <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-0 group-hover/cta:opacity-100" style={{ animationDelay: '0.5s' }} />
                
                <span className="relative z-10 flex items-center">
                  <span className="hidden xs:inline">Join Us</span>
                  <span className="xs:hidden">Join</span>
                  <Sparkles className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover/cta:animate-spin" style={{ animationDuration: '1.5s' }} />
                </span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="sm"
              className="relative bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-500/90 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 backdrop-blur-sm border border-amber-400/40 hover:border-yellow-400/60 shadow-lg hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 group/cta overflow-hidden px-3 sm:px-4 py-2 text-sm transform hover:scale-105"
            >
              <Link to="/waitlist">
                {/* Animated gradient background */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-purple-400/30 to-fuchsia-400/30 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                />
                {/* Floating sparkles - Smaller on mobile */}
                <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-yellow-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
                <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-0 group-hover/cta:opacity-100" style={{ animationDelay: '0.5s' }} />
                
                <span className="relative z-10 flex items-center">
                  <span className="hidden xs:inline">Join Waitlist</span>
                  <span className="xs:hidden">Waitlist</span>
                  <Sparkles className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover/cta:animate-spin" style={{ animationDuration: '1.5s' }} />
                </span>
              </Link>
            </Button>
          </div>
        </nav>
        
        {/* Enhanced Mobile Navigation - only login button shown with golden effect */}
        <div className="md:hidden">
          <div 
            className="flex items-center justify-between px-4 py-3 rounded-xl border relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.15), rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.15))',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              border: '1px solid rgba(255, 215, 0, 0.35)',
              boxShadow: '0 12px 40px rgba(139, 69, 19, 0.15), 0 0 0 1px rgba(255, 215, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Subtle gradient overlay */}
            <div 
              className="absolute inset-0 opacity-40 hover:opacity-60 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), transparent, rgba(255, 165, 0, 0.1))'
              }}
            />
            
            {/* Floating spiritual particles in mobile navbar */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1 right-4 w-1 h-1 bg-yellow-400/70 rounded-full animate-pulse" />
              <div className="absolute bottom-2 left-6 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-fuchsia-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-amber-300/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-yellow-200/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
            
            {/* Animated border effect */}
            <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent animate-border-pulse" style={{
              background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.4), rgba(138, 43, 226, 0.4), rgba(255, 215, 0, 0.4)) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              maskComposite: 'exclude'
            }} />
            
            <Link to="/" className="flex items-center space-x-2 relative z-10 group/logo">
              <div className="relative">
                <ResponsiveImage
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-10 w-10 rounded-full cursor-pointer scale-110 shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover/logo:scale-125"
                  quality="high"
                  lazy={false}
                  style={{
                    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.5))'
                  }}
                />
                {/* Constant glowing ring around logo with animation */}
                <div 
                  className="absolute inset-0 rounded-full animate-spin-slow"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.5), rgba(138, 43, 226, 0.5), rgba(255, 215, 0, 0.5))',
                    padding: '2px'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-background/30" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300 transition-all duration-300 group-hover/logo:from-yellow-200 group-hover/logo:via-purple-200 group-hover/logo:to-fuchsia-200">
                  SadhanaBoard
                </span>
                <span className="text-xs text-yellow-400/80 font-medium tracking-wider flex items-center transition-all duration-300 group-hover/logo:text-yellow-300">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Your Digital Yantra
                </span>
              </div>
            </Link>
            <MobileNav showHamburger={false} showLoginButton={true} />
          </div>
        </div>
      </div>
      
      {/* Theme Toggle - Vertically centered with Sadhana Paper */}
      <div className="hidden md:block fixed right-8 z-[999998] top-1/2 transform -translate-y-1/2">
        {/* <ThemeToggle /> */}
      </div>

      <div className="min-h-screen bg-transparent">
        {/* Beta banner */}
        <div className="px-2 sm:px-4 pt-2">
          <div className="mx-auto max-w-5xl rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-100 text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center justify-center gap-2">
            <span className="inline-block rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold">BETA</span>
            We’re in private beta. New registrations are closed — join the waitlist to get early access.
          </div>
        </div>
        <div className="space-y-16 animate-fade-in min-h-screen flex flex-col">
          
          {/* Hero Section with Sadhana Paper */}
          <section className="flex-1 flex items-center justify-center px-2 sm:px-4 mt-6 sm:mt-10 relative overflow-hidden">
            {/* Yantra watermark behind hero */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] -z-10 flex items-center justify-center">
              <svg width="800" height="800" viewBox="0 0 200 200" className="drop-shadow-[0_0_12px_rgba(255,215,0,0.15)]">
                <g fill="none" stroke="url(#grad)" strokeWidth="0.4">
                  <circle cx="100" cy="100" r="20" />
                  <circle cx="100" cy="100" r="40" />
                  <circle cx="100" cy="100" r="60" />
                  <circle cx="100" cy="100" r="80" />
                  <polygon points="100,20 140,100 100,180 60,100" />
                  <polygon points="100,30 135,100 100,170 65,100" />
                  <line x1="20" y1="100" x2="180" y2="100" />
                  <line x1="100" y1="20" x2="100" y2="180" />
                </g>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#C084FC" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {/* Parallax sparkles */}
            <div className="pointer-events-none absolute inset-0 -z-10" style={{ transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)` }}>
              <div className="absolute top-16 left-12 text-xl">✨</div>
              <div className="absolute bottom-24 right-16 text-2xl">🪔</div>
              <div className="absolute top-1/3 right-1/4 text-lg">🌸</div>
            </div>
            <div className="max-w-7xl mx-0 sm:mx-2 lg:mx-4" onMouseMove={handleMouseMove}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
                {/* Left Side - Spiritual Content */}
                <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                  <div className="text-center lg:text-left">
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-6">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400">
                        ✨ The First Digital Platform
                      </span>
                      <br />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                        for Your Daily Saadhana
                      </span>
                    </h1>
                    
                    <p className="text-xl sm:text-2xl text-amber-100 mb-4 sm:mb-6 leading-relaxed">
                      Design, track, and deepen your spiritual practice in one sacred space.
                    </p>
                    
                    <p className="text-lg sm:text-xl text-amber-50 mb-6 sm:mb-8 leading-relaxed">
                      Join the private waitlist and be among the first to experience discipline, guidance, and growth through SaadhanaBoard.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-4 sm:mb-6">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-7 shadow-lg hover:shadow-2xl transition-all duration-300 touch-target-large"
                        style={{ boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
                        asChild
                      >
                        <Link to="/waitlist">
                          🌟 Join the Waitlist
                        </Link>
                      </Button>
                      
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-amber-500/40 text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-7 hover:bg-amber-500/10 backdrop-blur-sm transition-all duration-300 touch-target-large"
                        style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.1)' }}
                        asChild
                      >
                        <Link to="/about">
                          🌙 Explore Features
                        </Link>
                      </Button>
                      <Button 
                        size="lg"
                        variant="ghost"
                        className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-7 hover:bg-purple-500/10 backdrop-blur-sm transition-all duration-300 touch-target-large"
                        onClick={() => setAudioOn((v) => !v)}
                      >
                        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> <span className="hidden xs:inline">{audioOn ? 'Sound: On' : 'Sound: Off'}</span>
                      </Button>
                    </div>
                    
                    {/* Urgency + Exclusivity Line */}
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base">
                      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 backdrop-blur-sm">
                        <span className="text-amber-400">🔒</span>
                        <span className="text-amber-100 text-center sm:text-left">
                          Limited seats available. Early seekers get priority access and exclusive features.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Sadhana Paper (Transparent Golden Metallic) */}
                <div className="lg:col-span-4 relative">
                  <div className="relative max-w-xl mx-auto lg:mx-0">
                    {/* Paper Container - Transparent Golden Metallic styling */}
                    <div 
                      className="relative p-6 rounded-2xl border-2 backdrop-blur-md"
                      style={{
                        background: 'linear-gradient(145deg, rgba(255, 223, 0, 0.05) 0%, rgba(255, 215, 0, 0.08) 30%, rgba(255, 207, 0, 0.04) 70%, rgba(255, 199, 0, 0.06) 100%)',
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                        fontFamily: 'Georgia, serif',
                        boxShadow: `
                          0 8px 32px rgba(255, 215, 0, 0.12),
                          0 0 0 1px rgba(255, 215, 0, 0.15),
                          inset 0 1px 0 rgba(255, 255, 255, 0.15),
                          inset 0 -1px 0 rgba(255, 215, 0, 0.08)
                        `,
                        backdropFilter: 'blur(14px) saturate(140%)',
                        WebkitBackdropFilter: 'blur(14px) saturate(140%)'
                      }}
                    >
                      {/* Metallic overlay gradient */}
                      <div 
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          background: `
                            linear-gradient(135deg, 
                              rgba(255, 255, 200, 0.08) 0%, 
                              transparent 25%, 
                              rgba(255, 223, 0, 0.05) 50%, 
                              transparent 75%, 
                              rgba(255, 255, 180, 0.03) 100%
                            )
                          `,
                          opacity: 0.5
                        }}
                      />
                      
                      {/* Enhanced ornate corners with golden metallic effect */}
                      <div 
                        className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
                        style={{
                          borderColor: 'rgba(255, 215, 0, 0.8)',
                          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
                        }}
                      />
                      <div 
                        className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
                        style={{
                          borderColor: 'rgba(255, 215, 0, 0.8)',
                          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
                        }}
                      />
                      <div 
                        className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg"
                        style={{
                          borderColor: 'rgba(255, 215, 0, 0.8)',
                          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
                        }}
                      />
                      <div 
                        className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg"
                        style={{
                          borderColor: 'rgba(255, 215, 0, 0.8)',
                          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
                        }}
                      />
                      
                      {/* Header with enhanced golden styling */}
                      <div className="text-center mb-4 relative z-10">
                        <h3 
                          className="text-2xl font-bold mb-2" 
                          style={{ 
                            fontFamily: 'Georgia, serif',
                            color: 'rgba(255, 223, 0, 0.95)',
                            textShadow: '0 0 8px rgba(255, 215, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          🕉️ Sadhana Paper
                        </h3>
                        <div 
                          className="w-20 h-0.5 mx-auto"
                          style={{
                            background: 'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.8), transparent)',
                            filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.4))'
                          }}
                        />
                      </div>

                      {/* Content with enhanced golden metallic text */}
                      <div className="space-y-2 relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                            }}
                          >
                            Purpose:
                          </div>
                          <div 
                            className="text-sm leading-relaxed pl-2"
                            style={{
                              color: 'rgba(255, 255, 255, 0.85)',
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                            }}
                          >
                            To honor Divine Mother Durga during the sacred nine nights of Navratri and invoke her blessings for strength, wisdom, and spiritual growth.
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                            }}
                          >
                            Goal:
                          </div>
                          <div 
                            className="text-sm leading-relaxed pl-2"
                            style={{
                              color: 'rgba(255, 255, 255, 0.85)',
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                            }}
                          >
                            Complete daily worship, fasting, and meditation practices for spiritual purification and divine connection.
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                            }}
                          >
                            Divine Focus:
                          </div>
                          <div 
                            className="text-sm leading-relaxed pl-2"
                            style={{
                              color: 'rgba(255, 255, 255, 0.85)',
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                            }}
                          >
                            Maa Durga and her nine divine forms (Navadurga)
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                            }}
                          >
                            Duration:
                          </div>
                          <div 
                            className="text-sm leading-relaxed pl-2"
                            style={{
                              color: 'rgba(255, 255, 255, 0.85)',
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                            }}
                          >
                            9 days
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                            }}
                          >
                            Message:
                          </div>
                          <div 
                            className="text-sm italic leading-relaxed pl-2"
                            style={{
                              color: 'rgba(255, 255, 255, 0.85)',
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                            }}
                          >
                            "May the Divine Mother's grace illuminate my path and transform my being with her infinite love and protection."
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                            }}
                          >
                            My Offerings:
                          </div>
                          <div 
                            className="text-sm space-y-0.5 pl-2"
                            style={{
                              color: 'rgba(255, 255, 255, 0.85)',
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                            }}
                          >
                            <div>1. Daily Durga Chalisa recitation</div>
                            <div>2. Morning meditation (30 minutes)</div>
                            <div>3. Evening aarti and prayers</div>
                            <div>4. Sattvic fasting during day</div>
                            <div>5. Reading Devi Mahatmya</div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced metallic texture overlay */}
                      <div 
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          background: `
                            radial-gradient(circle at 20% 30%, rgba(255, 223, 0, 0.05) 0%, transparent 40%),
                            radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.04) 0%, transparent 40%),
                            radial-gradient(circle at 40% 80%, rgba(255, 207, 0, 0.03) 0%, transparent 30%)
                          `,
                          opacity: 0.4
                        }}
                      />
                    </div>
                    
                    {/* Enhanced floating spiritual elements with golden glow */}
                    <div 
                      className="absolute -top-3 -right-3 text-2xl animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))',
                        opacity: 0.8
                      }}
                    >
                      🌸
                    </div>
                    <div 
                      className="absolute -bottom-3 -left-3 text-xl animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))',
                        opacity: 0.8
                      }}
                    >
                      🪔
                    </div>
                    <div 
                      className="absolute top-1/2 -left-6 text-lg animate-bounce"
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
                        opacity: 0.7
                      }}
                    >
                      ✨
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Animated stats strip removed for beta landing */}

          {/* Features Section - Marketing focused */}
          <section className="py-20 container mx-auto px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-fuchsia-900/5 rounded-3xl"></div>
            <div className="relative z-10 text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">Powerful Features for Your Spiritual Growth</h2>
              <p className="text-2xl text-amber-100 max-w-3xl mx-auto">
                Everything you need to maintain and deepen your spiritual practice in one comprehensive platform
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="backdrop-blur-lg bg-transparent border border-white hover:border-amber-400/50 hover:bg-background/40 transition-all duration-500 h-full transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl overflow-hidden group touch-target-large"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:from-amber-500/30 group-hover:to-yellow-500/30 transition-all duration-300">
                        <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
                      </div>
                      <CardTitle className="text-2xl sm:text-3xl text-center group-hover:text-amber-300 transition-colors duration-300">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-amber-100 mb-3 sm:mb-4 text-base sm:text-lg text-center">{feature.description}</p>
                      <p className="text-sm sm:text-base text-amber-50 text-center group-hover:text-amber-200 transition-colors duration-300">{feature.details}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Theme Icons Showcase Section */}
          <section className="py-20 container mx-auto px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-fuchsia-900/5 rounded-3xl"></div>
            <div className="relative z-10 text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">Divine Themes</h2>
              <p className="text-2xl text-amber-100 max-w-3xl mx-auto">
                Experience the divine through our sacred themes inspired by Hindu deities
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12">
              {[
                { name: "Shiva", icon: "/themes/shiva/assets/Bhagwan_Shiva_icon.png" },
                { name: "Krishna", icon: "/themes/krishna/assets/Bhagwan_Krishna.png" },
                { name: "Vishnu", icon: "/themes/vishnu/assets/Bhagwan_Vishnu.png" },
                { name: "Maa Durga", icon: "/themes/durga/assets/Maa_Durga_icon.png" },
                { name: "Bhairava", icon: "/themes/bhairava/assets/Bhairava.png" }
              ].map((theme, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center mb-4 overflow-hidden border-2 border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 group">
                    <img 
                      src={theme.icon} 
                      alt={theme.name} 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-amber-100">{theme.name}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Cosmic Library Showcase Section */}
          <section className="py-16 container mx-auto px-4">
            <CosmicLibraryShowcase />
          </section>



          {/* Our Sacred Values */}
          <section className="py-24 container mx-auto px-4 relative overflow-hidden">
          {/* Enhanced background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.03)_0%,rgba(0,0,0,0)_70%)]"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center mx-auto">
                    <span className="text-2xl text-white">✨</span>
                  </div>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400">
                Our Sacred Values
              </h2>
              <p className="text-xl text-amber-100 max-w-3xl mx-auto">
                The guiding principles that shape our sacred space and spiritual community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {[
                {
                  title: "Spiritual Growth",
                  description: "Fostering genuine spiritual development through consistent practice",
                  detailedDescription: "True spiritual growth emerges from dedicated daily practice and mindful reflection. Our platform supports your journey with personalized tracking and guided practices.",
                  icon: "⛰️",
                  knowledge: "Ancient wisdom traditions teach that spiritual development requires patience and discipline. Modern neuroscience confirms regular practices rewire the brain for greater compassion."
                },
                {
                  title: "Community Connection",
                  description: "Building bridges between practitioners to share wisdom and support",
                  detailedDescription: "Spiritual growth flourishes in community. Connect with like-minded practitioners worldwide, share experiences, and celebrate milestones together.",
                  icon: "👥",
                  knowledge: "The Sanskrit concept of 'Satsang' emphasizes the transformative power of spiritual community. Research shows group practice amplifies individual benefits."
                },
                {
                  title: "Divine Inspiration",
                  description: "Drawing strength and guidance from the divine energies that surround us",
                  detailedDescription: "We honor the sacred connection between the human and divine. Through curated practices and sacred texts, create space for divine inspiration in your daily life.",
                  icon: "✨",
                  knowledge: "Bhakti traditions recognize that divine grace flows through devotion. Quantum physics suggests consciousness and energy are fundamentally interconnected."
                },
                {
                  title: "Authentic Practice",
                  description: "Encouraging sincere and dedicated spiritual practices rooted in tradition",
                  detailedDescription: "Authenticity means honoring both ancient wisdom and modern understanding. Our practices are rooted in traditions while embracing contemporary insights.",
                  icon: "❤️",
                  knowledge: "The Yoga Sutras define authentic practice as sustained effort over time. Modern research confirms practices combining tradition with evidence produce profound transformation."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="backdrop-blur-lg bg-transparent border border-white hover:border-amber-400/50 transition-all duration-500 h-full transform hover:-translate-y-3 hover:shadow-2xl rounded-3xl overflow-hidden group relative shadow-xl hover:shadow-amber-500/20 transition-shadow duration-300">
                    {/* Enhanced hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400/20 rounded-full animate-ping"></div>
                      <div className="absolute bottom-6 left-6 w-1 h-1 bg-yellow-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </div>
                    
                    <CardHeader>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-500/30 flex items-center justify-center mx-auto mb-5 group-hover:from-amber-500/40 group-hover:to-yellow-500/40 transition-all duration-300 text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {value.icon}
                      </div>
                      <CardTitle className="text-2xl text-center group-hover:text-amber-300 transition-colors duration-300 font-bold">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <p className="text-amber-100 text-base text-center leading-relaxed group-hover:text-amber-200 transition-colors duration-300 mb-4">
                        {value.description}
                      </p>
                      <div className="border-t border-amber-500/20 pt-4 mt-4 group-hover:border-amber-400/30 transition-colors duration-300">
                        <p className="text-amber-200 text-sm leading-relaxed mb-3">
                          {value.detailedDescription}
                        </p>
                        <div className="bg-amber-500/5 rounded-xl p-3 border border-amber-500/10 group-hover:bg-amber-500/10 transition-colors duration-300">
                          <p className="text-xs text-amber-300 italic leading-relaxed">
                            <span className="font-semibold text-amber-200">Wisdom Insight:</span> {value.knowledge}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    {/* Enhanced hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-3 h-3 bg-amber-400/30 rounded-full animate-ping"></div>
                      <div className="absolute bottom-8 left-8 w-2 h-2 bg-yellow-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute top-1/2 left-4 w-1 h-1 bg-amber-400/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          </section>

          {/* Call to Action - with added Join Us button */}
          <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/30 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <MoonStar className="h-12 w-12 sm:h-16 sm:w-16 text-amber-400 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-amber-100">Private Beta Is Live</h2>
            <p className="text-amber-50 mb-6 sm:mb-10 text-base sm:text-xl">
              We're onboarding in waves. Join the waitlist to secure early access and explore our features.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500/90 to-yellow-500/90 hover:from-amber-500 hover:to-yellow-500 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 backdrop-blur-sm touch-target-large"
                asChild
              >
                <Link to="/waitlist">
                  Join the Waitlist
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-amber-500/40 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:bg-amber-500/10 backdrop-blur-sm touch-target-large"
                asChild
              >
                <Link to="/about">
                  Explore Features
                </Link>
              </Button>
              {/* Added Join Us button */}
              <Button 
                size="lg" 
                variant="ghost" 
                className="border-amber-500/40 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:bg-amber-500/10 backdrop-blur-sm touch-target-large text-amber-300"
                asChild
              >
                <Link to="/careers">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Join Us
                </Link>
              </Button>
            </div>
          </div>
          </section>

          {/* Footer */}
          <div className="px-4 sm:px-4 pb-4 sm:pb-4">
            <footer 
              className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(255, 215, 0, 0.12), rgba(255, 165, 0, 0.08))',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 215, 0, 0.25)',
                boxShadow: `
                  0 8px 32px rgba(139, 69, 19, 0.1),
                  0 0 0 1px rgba(255, 215, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              {/* Subtle gradient overlay */}
              <div 
                className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.05), transparent, rgba(255, 165, 0, 0.05))'
                }}
              />
              
              {/* Floating spiritual particles in footer - Hidden on mobile to avoid interference */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
                <div className="absolute top-2 left-8 w-1 h-1 bg-yellow-400/60 rounded-full animate-pulse" />
                <div className="absolute top-4 right-20 w-1.5 h-1.5 bg-amber-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-3 left-32 w-1 h-1 bg-yellow-400/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-2 right-8 w-0.5 h-0.5 bg-amber-400/60 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
              </div>

              <div className="relative z-20 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-3">
                    <div className="relative">
                      <img
                        src="/lovable-uploads/sadhanaboard_logo.png"
                        alt="SadhanaBoard Logo"
                        className="h-10 w-10 sm:h-10 sm:w-10 rounded-full cursor-pointer scale-110 shadow-lg shadow-amber-500/30 relative z-10"
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
                        }}
                      />
                      {/* Constant glowing ring around logo */}
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.3), rgba(138, 43, 226, 0.3), rgba(255, 215, 0, 0.3))',
                          padding: '2px'
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-background/20" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xl sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300">
                        SadhanaBoard
                      </span>
                      <span className="text-xs sm:text-xs text-yellow-400/70 font-medium tracking-wider">
                        ✨ Your Digital Yantra
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 text-sm">
                    <Link 
                      to="/about" 
                      className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10">About</span>
                    </Link>
                    <Link 
                      to="/careers" 
                      className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10">Join Us</span>
                    </Link>
                    <Link 
                      to="/manifesto" 
                      className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10">Manifesto</span>
                    </Link>
                    <button 
                      className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10">Privacy</span>
                    </button>
                    <button 
                      className="relative text-foreground hover:text-amber-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10">Terms</span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div 
                    className="inline-block px-4 py-2 rounded-full text-xs text-muted-foreground/80 max-w-full overflow-hidden whitespace-normal"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(138, 43, 226, 0.08))',
                      border: '1px solid rgba(255, 215, 0, 0.15)'
                    }}
                  >
                    © {new Date().getFullYear()} SadhanaBoard. All rights reserved. A sacred space for spiritual practitioners.
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
