import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Trophy, Calendar, Users, Sparkles, MoonStar, Flame, Target, Heart, Mountain, Star, TrendingUp, Play, Volume2, ChevronRight, Zap, Compass, Crown, InfinityIcon, Skull, Bone, Wind } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Make sure Link is imported
import { motion, useInView, useAnimation, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Mahakali animated background component — mount for experimentation
import MahakaliAnimatedBackground from "@/components/MahakaliAnimatedBackground";
import ThemeToggle from '@/components/ThemeToggle';
import CosmicLibraryShowcase from '@/components/library/CosmicLibraryShowcase';
import MobileNav from '@/components/mobile/MobileNav';

// Dynamic yantra that responds to user interaction - cremation ground theme
const InteractiveYantra = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.05;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer circle - cremation ground theme */}
      <Line
        points={(() => {
          const points = [];
          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
          }
          return points;
        })()}
        color={hovered ? "#fbbf24" : "#dc2626"}
        lineWidth={hovered ? 3 : 1.5}
      />
      
      {/* Inner circles */}
      <Line
        points={(() => {
          const points = [];
          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
          }
          return points;
        })()}
        color={hovered ? "#fbbf24" : "#b91c1c"}
        lineWidth={hovered ? 2 : 1}
      />
      
      <Line
        points={(() => {
          const points = [];
          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(Math.cos(angle) * 1, Math.sin(angle) * 1, 0);
          }
          return points;
        })()}
        color={hovered ? "#fbbf24" : "#991b1b"}
        lineWidth={hovered ? 1.5 : 0.8}
      />
      
      {/* Central triangle - representing the trident (upside down) */}
      <Line
        points={[
          0, -0.8, 0,
          -0.7, 0.4, 0,
          0.7, 0.4, 0,
          0, -0.8, 0
        ]}
        color={hovered ? "#fbbf24" : "#f87171"}
        lineWidth={hovered ? 3 : 1.5}
      />
      

    </group>
  );
};



const ExperimentPage = () => {
  const [sankalpa, setSankalpa] = useState("");
  const [isEntering, setIsEntering] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeElement, setActiveElement] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Apply Mahakali theme when component mounts
  useEffect(() => {
    // Add Mahakali theme class to body
    document.body.classList.add('theme-mahakali');
    
    // Set theme variables
    document.documentElement.style.setProperty('--theme-primary', '348 83% 47%');
    document.documentElement.style.setProperty('--theme-secondary', '0 0% 0%');
    document.documentElement.style.setProperty('--theme-accent', '0 100% 50%');
    
    // Also apply the color scheme classes for consistency
    document.body.classList.add('color-scheme-fire');
    
    // Cleanup function to remove theme when component unmounts
    return () => {
      document.body.classList.remove('theme-mahakali', 'color-scheme-fire');
      // Reset to default theme values
      document.documentElement.style.setProperty('--theme-primary', '348 83% 47%');
      document.documentElement.style.setProperty('--theme-secondary', '348 22% 25%');
      document.documentElement.style.setProperty('--theme-accent', '348 73% 38%');
    };
  }, []);

  // Smooth parallax effects for different sections
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const featuresY = useTransform(scrollYProgress, [0.1, 0.5], [50, 0]);
  const testimonialsY = useTransform(scrollYProgress, [0.3, 0.7], [50, 0]);
  const inspirationY = useTransform(scrollYProgress, [0.4, 0.8], [50, 0]);
  const ctaY = useTransform(scrollYProgress, [0.6, 1], [50, 0]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Rotate through elements
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveElement((prev) => (prev + 1) % 6);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "The Destroyer's Path 🗡️",
      description: "Shatter illusions and ego attachments through mindful practice. Transform your weaknesses into strengths through the power of destruction and renewal.",
      icon: Skull,
      color: "from-red-800 to-red-900"
    },
    {
      title: "The Sacred Fire 🔥",
      description: "Ignite your inner fire through disciplined practice. Burn away negative patterns and emerge transformed like gold purified in flame.",
      icon: Flame,
      color: "from-orange-700 to-red-800"
    },
    {
      title: "The Bone Garden 🦴",
      description: "Gather the remnants of your past selves. Rebuild your spiritual skeleton with the wisdom of experience and the strength of discipline.",
      icon: Bone,
      color: "from-amber-800 to-orange-900"
    },
    {
      title: "The Wind of Change 💨",
      description: "Let the winds of transformation carry away what no longer serves you. Embrace impermanence and find freedom in letting go.",
      icon: Wind,
      color: "from-gray-700 to-gray-900"
    },
    {
      title: "The Yantra of Power ⚡",
      description: "Channel divine feminine energy through sacred geometry. Create powerful yantras for protection, transformation, and spiritual awakening.",
      icon: Compass,
      color: "from-purple-800 to-indigo-900"
    },
    {
      title: "Pratyangira's Protection 🦁",
      description: "Harness the fierce protective energy of the Lion-Faced Goddess for courage, strength, and spiritual transformation.",
      icon: Crown,
      color: "from-amber-700 to-orange-800",
      link: "/pratyangira"
    }
  ];

  const testimonials = [
    {
      name: "Kali Devotee",
      role: "Tantric Practitioner",
      content: "This platform helped me destroy my ego attachments. The cremation ground theme reminds me daily of the impermanence of all things.",
      avatar: "KD",
      practice: "Dakshina Marga"
    },
    {
      name: "Shakti Seeker",
      role: "Daily Practitioner",
      content: "The dark, powerful energy of this space transforms my practice. It feels like communing with the Divine Mother herself.",
      avatar: "SS",
      practice: "Kali Mantra"
    },
    {
      name: "Destroyer of Illusions",
      role: "Meditation Master",
      content: "The yantra studio helped me visualize destruction of negative patterns. This is the real power of transformation.",
      avatar: "DI",
      practice: "Chidakasha Meditation"
    },
    {
      name: "Ash Gatherer",
      role: "Spiritual Warrior",
      content: "Every session feels like a funeral for my old self. I emerge renewed, stronger, and more aligned with my true nature.",
      avatar: "AG",
      practice: "Fire Rituals"
    }
  ];

  const elements = [
    { name: "Destruction", icon: <Flame className="h-6 w-6" />, color: "from-red-700 to-red-900" },
    { name: "Transformation", icon: <Flame className="h-6 w-6" />, color: "from-orange-600 to-red-800" },
    { name: "Protection", icon: <Skull className="h-6 w-6" />, color: "from-amber-700 to-orange-900" },
    { name: "Power", icon: <Zap className="h-6 w-6" />, color: "from-purple-700 to-red-900" },
    { name: "Liberation", icon: <Wind className="h-6 w-6" />, color: "from-gray-600 to-black" },
    { name: "Wisdom", icon: <Crown className="h-6 w-6" />, color: "from-red-900 to-black" }
  ];

  const handleEnterSpace = () => {
    setIsEntering(true);
    // Simulate transition
    setTimeout(() => {
      // In a real app, this would navigate to the dashboard
      console.log("Entering with sankalpa:", sankalpa);
      setIsEntering(false);
    }, 1000);
  };

  // Refs for scroll-triggered animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const inspirationRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const isInspirationInView = useInView(inspirationRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  // Animation controls
  const heroControls = useAnimation();
  const featuresControls = useAnimation();

  useEffect(() => {
    if (isHeroInView) {
      heroControls.start({ opacity: 1, y: 0 });
    }
  }, [isHeroInView, heroControls]);

  useEffect(() => {
    if (isFeaturesInView) {
      featuresControls.start({ opacity: 1, y: 0 });
    }
  }, [isFeaturesInView, featuresControls]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black text-white overflow-hidden relative">
      {/* Wrapper for background layers - prepared for MahakaliAnimatedBackground integration */}
      <div className="fixed inset-0 z-0">
        {/* Mount MahakaliAnimatedBackground with error boundary */}
        <ErrorBoundary fallback={
          <div className="fixed inset-0 z-0 bg-gradient-to-br from-red-900 via-black to-red-950">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.2)_0%,rgba(0,0,0,0)_70%)]"></div>
          </div>
        }>
          <Suspense fallback={
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-red-900 via-black to-red-950 flex items-center justify-center">
              <div className="text-red-200">Loading sacred background...</div>
            </div>
          }>
            <MahakaliAnimatedBackground className="fixed inset-0 z-0" enableBloom={true} enableParticles={true} intensity={1} />
          </Suspense>
        </ErrorBoundary>
        {/* Removed legacy CSS gradient and emoji-based background layers — Three.js now provides the background visuals */}
        {/* FloatingElements retained only if desired for extra 2D overlays; currently suppressed to avoid visual duplication */}
      </div>

      {/* Sticky Navigation Bar - Glassy Spiritual Theme with Mahakali colors */}
      <div 
        className="sticky top-0 left-0 right-0 z-[999999] px-2 sm:px-4 pt-2 sm:pt-4"
        style={{
          pointerEvents: 'auto'
        }}
      >
        <nav 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group hidden md:flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4"
          style={
            {
              background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.08), rgba(139, 0, 0, 0.12), rgba(139, 0, 0, 0.08))',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 0, 0, 0.25)',
              boxShadow: '0 8px 32px rgba(139, 0, 0, 0.1), 0 0 0 1px rgba(255, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }
          }
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            style={
              {
                background: 'linear-gradient(45deg, rgba(255, 0, 0, 0.05), transparent, rgba(139, 0, 0, 0.05))'
              }
            }
          />
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <img
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-8 w-8 sm:h-12 sm:w-12 rounded-full cursor-pointer scale-110 shadow-lg shadow-red-500/30"
                  style={
                    {
                      filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.3))'
                    }
                  }
                />
                {/* Constant glowing ring around logo */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={
                    {
                      background: 'conic-gradient(from 0deg, rgba(255, 0, 0, 0.3), rgba(139, 0, 0, 0.3), rgba(255, 0, 0, 0.3))',
                      padding: '2px'
                    }
                  }
                >
                  <div className="w-full h-full rounded-full bg-background/20" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-red-400 to-red-300">
                  SadhanaBoard
                </span>
                <span className="text-[10px] sm:text-xs text-red-400/70 font-medium tracking-wider hidden xs:block">
                  🔥 Destroyer of Illusions
                </span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="relative text-foreground/80 hover:text-foreground hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-red-400/40 transition-all duration-300 group/btn overflow-hidden px-3 sm:px-4 py-2 text-sm"
            >
              <Link to="/login">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">Enter</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="sm"
              className="relative bg-gradient-to-r from-red-500/80 via-red-600/80 to-red-500/80 hover:from-red-400 hover:via-red-500 hover:to-red-400 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 group/cta overflow-hidden px-3 sm:px-4 py-2 text-sm"
            >
              <Link to="/careers">
                {/* Animated gradient background */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-red-500/20 to-red-400/20 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                />
                {/* Floating sparkles - Smaller on mobile */}
                <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-red-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
                <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-0 group-hover/cta:opacity-100" style={{ animationDelay: '0.5s' }} />
                
                <span className="relative z-10 flex items-center">
                  <span className="hidden xs:inline">Join Us</span>
                  <span className="xs:hidden">Join</span>
                  <Flame className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover/cta:animate-spin" style={{ animationDuration: '2s' }} />
                </span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="sm"
              className="relative bg-gradient-to-r from-red-500/80 via-red-600/80 to-red-500/80 hover:from-red-400 hover:via-red-500 hover:to-red-400 backdrop-blur-sm border border-red-400/30 hover:border-red-400/50 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 group/cta overflow-hidden px-3 sm:px-4 py-2 text-sm"
            >
              <Link to="/waitlist">
                {/* Animated gradient background */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-red-500/20 to-red-400/20 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                />
                {/* Floating sparkles - Smaller on mobile */}
                <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-red-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
                <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-0 group-hover/cta:opacity-100" style={{ animationDelay: '0.5s' }} />
                
                <span className="relative z-10 flex items-center">
                  <span className="hidden xs:inline">Join Waitlist</span>
                  <span className="xs:hidden">Waitlist</span>
                  <Flame className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover/cta:animate-spin" style={{ animationDuration: '2s' }} />
                </span>
              </Link>
            </Button>
          </div>
        </nav>
        
        {/* Enhanced Mobile Navigation - only login button shown */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md rounded-xl border border-red-500/30 shadow-lg relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1 right-4 w-1 h-1 bg-red-500 rounded-full animate-ping opacity-70"></div>
              <div className="absolute bottom-2 left-6 w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <Link to="/" className="flex items-center space-x-2 relative z-10">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-red-500 opacity-30 blur"></div>
                <img
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-10 w-10 rounded-full cursor-pointer relative z-10"
                  style={
                    {
                      filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.3))'
                    }
                  }
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-red-400 to-red-300">
                  SadhanaBoard
                </span>
                <span className="text-xs text-red-400/80 font-medium tracking-wider flex items-center">
                  <Flame className="mr-1 h-3 w-3" />
                  Destroyer of Illusions
                </span>
              </div>
            </Link>
            <MobileNav isMahakaliTheme={true} showHamburger={false} showLoginButton={true} />
          </div>
        </div>
      </div>

      {/* Beta banner - Moved below navigation bar */}
      <div className="px-2 sm:px-4 pt-2">
        <div className="mx-auto max-w-5xl rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-200 text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center justify-center gap-2">
          <span className="inline-block rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold">BETA</span>
          We're in private beta. New registrations are closed — join the waitlist to get early access.
        </div>
      </div>

      <div className="space-y-0 relative z-20">
        <ThemeToggle />
        
        {/* Hero Section - cremation ground theme */}
        <motion.section 
          ref={heroRef} 
          className="text-center py-20 md:py-40 relative overflow-hidden"
          style={{ y: heroY }}
        >
          {/* Visual background is provided by the MahakaliAnimatedBackground Three.js scene */}
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
                {/* Left Side - Spiritual Content */}
                <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/30 text-red-300 mb-6 border border-red-700/40">
                      <Flame className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium">Destroyer of Illusions</span>
                    </div>
                    
                    <motion.h1 
                      className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-6"
                      animate={{
                        textShadow: [
                          '0 0 10px rgba(251, 191, 36, 0.5)',
                          '0 0 20px rgba(251, 191, 36, 0.8)',
                          '0 0 10px rgba(251, 191, 36, 0.5)'
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-yellow-300 to-red-300">
                        SACRED CREMATION GROUND
                      </span>
                    </motion.h1>
                    
                    <p className="text-xl sm:text-2xl text-red-100 mb-4 sm:mb-6 leading-relaxed">
                      The ultimate spiritual battlefield where ego dies and the Divine awakens.
                    </p>
                    
                    <p className="text-lg sm:text-xl text-red-50 mb-6 sm:mb-8 leading-relaxed">
                      Transform through destruction. Liberate through power.
                    </p>
                    
                    {/* CTA Buttons similar to main landing page */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12"
                    >
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-black text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 backdrop-blur-sm touch-target-large"
                        asChild
                      >
                        <Link to="/waitlist">
                          Join the Waitlist
                        </Link>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-red-700/50 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:bg-red-900/30 backdrop-blur-sm touch-target-large"
                        asChild
                      >
                        <Link to="/about">
                          Explore Features
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
                
                {/* Right Side - Sadhana Paper (Transparent Red Metallic) */}
                <div className="lg:col-span-4 relative">
                  <div className="relative max-w-xl mx-auto lg:mx-0">
                    {/* Paper Container - Transparent Red Metallic styling, similar to main landing page */}
                    <div 
                      className="relative p-6 rounded-2xl border-2 backdrop-blur-md"
                      style={{
                        background: 'linear-gradient(145deg, rgba(255, 0, 0, 0.05) 0%, rgba(220, 38, 38, 0.08) 30%, rgba(185, 28, 28, 0.04) 70%, rgba(153, 27, 27, 0.06) 100%)',
                        borderColor: 'rgba(220, 38, 38, 0.3)',
                        fontFamily: 'Georgia, serif',
                        boxShadow: `
                          0 8px 32px rgba(220, 38, 38, 0.12),
                          0 0 0 1px rgba(220, 38, 38, 0.15),
                          inset 0 1px 0 rgba(255, 255, 255, 0.15),
                          inset 0 -1px 0 rgba(220, 38, 38, 0.08)
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
                              rgba(255, 200, 200, 0.08) 0%, 
                              transparent 25%, 
                              rgba(220, 38, 38, 0.05) 50%, 
                              transparent 75%, 
                              rgba(255, 180, 180, 0.03) 100%
                            )
                          `,
                          opacity: 0.5
                        }}
                      />
                      
                      {/* Enhanced ornate corners with red metallic effect */}
                      <div 
                        className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
                        style={{
                          borderColor: 'rgba(220, 38, 38, 0.8)',
                          filter: 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.4))'
                        }}
                      />
                      <div 
                        className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
                        style={{
                          borderColor: 'rgba(220, 38, 38, 0.8)',
                          filter: 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.4))'
                        }}
                      />
                      <div 
                        className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg"
                        style={{
                          borderColor: 'rgba(220, 38, 38, 0.8)',
                          filter: 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.4))'
                        }}
                      />
                      <div 
                        className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg"
                        style={{
                          borderColor: 'rgba(220, 38, 38, 0.8)',
                          filter: 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.4))'
                        }}
                      />
                      
                      {/* Header with enhanced red styling */}
                      <div className="text-center mb-4 relative z-10">
                        <h3 
                          className="text-2xl font-bold mb-2" 
                          style={{ 
                            fontFamily: 'Georgia, serif',
                            color: 'rgba(255, 223, 0, 0.95)',
                            textShadow: '0 0 8px rgba(220, 38, 38, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          🕉️ Sadhana of Kali Sahasranama
                        </h3>
                        <div 
                          className="w-20 h-0.5 mx-auto"
                          style={{
                            background: 'linear-gradient(to right, transparent, rgba(220, 38, 38, 0.8), transparent)',
                            filter: 'drop-shadow(0 0 2px rgba(220, 38, 38, 0.4))'
                          }}
                        />
                      </div>

                      {/* Content with enhanced red metallic text */}
                      <div className="space-y-2 relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(220, 38, 38, 0.4)'
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
                            To invoke the divine power of Maa Kali through the recitation of her thousand names, seeking her blessings for spiritual transformation, protection, and liberation from ignorance.
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(220, 38, 38, 0.4)'
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
                            To attain spiritual awakening through the fierce grace of Maa Kali, destroy ego attachments, and realize the ultimate truth of one's divine nature.
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(220, 38, 38, 0.4)'
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
                            Maa Kali in her thousand forms, the Divine Mother of Time, Change, and Power
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(220, 38, 38, 0.4)'
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
                            108 days (traditional completion cycle) or 9 days (Navaratri)
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(220, 38, 38, 0.4)'
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
                            "May the fierce grace of Maa Kali destroy my ignorance and reveal my true divine nature. May her blessings protect me from all fears and lead me to liberation."
                          </div>
                        </div>
                        
                        <div>
                          <div 
                            className="font-semibold mb-1 text-base"
                            style={{
                              color: 'rgba(255, 223, 0, 0.95)',
                              textShadow: '0 0 4px rgba(220, 38, 38, 0.4)'
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
                            <div>1. Daily recitation of Kali Sahasranama (108 times or as guided)</div>
                            <div>2. Morning and evening meditation on Maa Kali's form</div>
                            <div>3. Offering of red flowers and sweets</div>
                            <div>4. Lighting of camphor and incense</div>
                            <div>5. Chanting of Kali Mantras (Om Kreem Kalikayai Namaha)</div>
                            <div>6. Reading of Devi Mahatmya and Kali-focused scriptures</div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced metallic texture overlay */}
                      <div 
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          background: `
                            radial-gradient(circle at 20% 30%, rgba(255, 0, 0, 0.05) 0%, transparent 40%),
                            radial-gradient(circle at 80% 70%, rgba(220, 38, 38, 0.04) 0%, transparent 40%),
                            radial-gradient(circle at 40% 80%, rgba(185, 28, 28, 0.03) 0%, transparent 30%)
                          `,
                          opacity: 0.4
                        }}
                      />
                    </div>
                    
                    {/* Enhanced floating spiritual elements with red glow */}
                    <div 
                      className="absolute -top-3 -right-3 text-2xl animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.6))',
                        opacity: 0.8
                      }}
                    >
                      🔥
                    </div>
                    <div 
                      className="absolute -bottom-3 -left-3 text-xl animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.6))',
                        opacity: 0.8
                      }}
                    >
                      🦴
                    </div>
                    <div 
                      className="absolute top-1/2 -left-6 text-lg animate-bounce"
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.5))',
                        opacity: 0.7
                      }}
                    >
                      ⚡
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        {/* Removed as per user request */}

        {/* Features Section - cremation ground theme */}
        <motion.section 
          ref={featuresRef} 
          className="py-20 container mx-auto px-4 relative"
          style={{ y: featuresY }}
        >
          <div className="text-center mb-20">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-yellow-300 to-red-300">
                Tools of Transformation
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-red-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Powerful instruments for spiritual destruction and rebirth
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  whileHover={{ y: -10 }}
                  className="h-full"
                >
                  {feature.link ? (
                    <Link to={feature.link} className="block h-full">
                      <Card className="backdrop-blur-md bg-black/50 border border-red-800/40 hover:border-yellow-500/40 hover:bg-black/60 transition-all duration-500 h-full group overflow-hidden relative cursor-pointer">
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                        <CardHeader>
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto`}>
                            <Icon className="h-10 w-10 text-yellow-300" />
                          </div>
                          <CardTitle className="text-2xl text-center text-red-100 group-hover:text-yellow-300 transition-colors">
                            {feature.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-red-200/90 text-center">{feature.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card className="backdrop-blur-md bg-black/50 border border-red-800/40 hover:border-yellow-500/40 hover:bg-black/60 transition-all duration-500 h-full group overflow-hidden relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                      <CardHeader>
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto`}>
                          <Icon className="h-10 w-10 text-yellow-300" />
                        </div>
                        <CardTitle className="text-2xl text-center text-red-100 group-hover:text-yellow-300 transition-colors">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-red-200/90 text-center">{feature.description}</p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Theme Changing Section removed as per requirements */}

        {/* Cosmic Library Showcase Section */}
        <section className="py-16 container mx-auto px-4">
          <CosmicLibraryShowcase />
        </section>

        {/* Inspiration / "Why" Section - cremation ground theme */}
        <motion.section 
          ref={inspirationRef} 
          className="py-20 container mx-auto px-4"
          style={{ y: inspirationY }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInspirationInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/30 text-red-300 mb-6 border border-red-700/40">
                  <Flame className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">Sacred Origins</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-yellow-300 to-red-300">
                  The Divine Destroyer
                </h2>
                
                <div className="space-y-6 text-red-100/90 text-lg">
                  <p>
                    In the sacred cremation ground where all illusions burn, we found our truest path to liberation. 
                    Inspired by Mahakali's fierce compassion, we created this space for those ready to destroy their limitations.
                  </p>
                  <p>
                    Our platform combines ancient Tantric wisdom with modern technology to create a truly transformative experience. 
                    Every feature is designed to help you cut through ego and embrace your divine power.
                  </p>
                  <p className="text-yellow-300 font-medium">
                    "Destruction is not an end, but a beginning. Burn what binds you, and rise as your true self."
                  </p>
                </div>
                
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-black px-8 py-6 text-lg rounded-xl border border-red-700">
                    <Flame className="mr-2 h-5 w-5 text-yellow-300" />
                    Embrace Destruction
                  </Button>
                  <Button variant="outline" className="border-red-700/50 text-red-200 hover:bg-red-900/30 px-8 py-6 text-lg rounded-xl">
                    <BookOpen className="mr-2 h-5 w-5 text-yellow-300" />
                    Ancient Wisdom
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInspirationInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Enhanced Yantra Visualization */}
                <div className="relative bg-gradient-to-br from-red-900/50 to-black/50 rounded-3xl p-12 border border-red-800/50 backdrop-blur-xl overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/30 via-transparent to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                      <Flame className="h-12 w-12 text-yellow-400" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-center text-red-200 mb-2">Sacred Geometry of Power</h3>
                    <p className="text-red-100/80 text-center mb-12">The Divine Blueprint of Transformation</p>
                    
                    {/* Interactive 3D Yantra */}
                    <div className="flex justify-center">
                      <div className="w-80 h-80">
                        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                          <ambientLight intensity={0.7} />
                          <pointLight position={[10, 10, 10]} intensity={1.5} color="#fbbf24" />
                          <InteractiveYantra />
                          <OrbitControls 
                            enableZoom={true}
                            enablePan={false}
                            maxDistance={7}
                            minDistance={3}
                          />
                        </Canvas>
                      </div>
                    </div>
                    
                    {/* Element selector */}
                    <div className="flex justify-center mt-8 space-x-4">
                      {elements.map((element, index) => (
                        <motion.div
                          key={index}
                          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
                            activeElement === index 
                              ? `bg-gradient-to-r ${element.color} shadow-lg border border-yellow-500/50` 
                              : 'bg-black/50 border border-red-700/50'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActiveElement(index)}
                        >
                          {element.icon}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Final CTA Section - with added Join Us button */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/30 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <Flame className="h-12 w-12 sm:h-16 sm:w-16 text-red-400 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-red-100">Private Beta Is Live</h2>
            <p className="text-red-50 mb-6 sm:mb-10 text-base sm:text-xl">
              We're onboarding in waves. Join the waitlist to secure early access and explore our features.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-black text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 backdrop-blur-sm touch-target-large"
                asChild
              >
                <Link to="/waitlist">
                  Join the Waitlist
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-red-700/50 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:bg-red-900/30 backdrop-blur-sm touch-target-large"
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
                className="border-red-700/50 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:bg-red-900/30 backdrop-blur-sm touch-target-large text-red-300"
                asChild
              >
                <Link to="/careers">
                  <Flame className="mr-2 h-5 w-5" />
                  Join Us
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer - cremation ground theme */}
        <div className="px-4 sm:px-4 pb-4 sm:pb-4">
          <footer 
            className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group"
            style={
              {
                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.08), rgba(139, 0, 0, 0.12), rgba(139, 0, 0, 0.08))',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 0, 0, 0.25)',
                boxShadow: `
                  0 8px 32px rgba(139, 0, 0, 0.1),
                  0 0 0 1px rgba(255, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
              }
            }
          >
            {/* Subtle gradient overlay */}
            <div 
              className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-500"
              style={
                {
                  background: 'linear-gradient(45deg, rgba(255, 0, 0, 0.05), transparent, rgba(139, 0, 0, 0.05))'
                }
              }
            />
            
            {/* Floating spiritual particles in footer - Hidden on mobile to avoid interference */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
              <div className="absolute top-2 left-8 w-1 h-1 bg-red-400/60 rounded-full animate-pulse" />
              <div className="absolute top-4 right-20 w-1.5 h-1.5 bg-red-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-3 left-32 w-1 h-1 bg-red-400/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              <div className="absolute bottom-2 right-8 w-0.5 h-0.5 bg-red-400/60 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <div className="relative z-20 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-3 sm:space-x-3">
                  <div className="relative">
                    <img
                      src="/lovable-uploads/sadhanaboard_logo.png"
                      alt="SadhanaBoard Logo"
                      className="h-10 w-10 sm:h-10 sm:w-10 rounded-full cursor-pointer scale-110 shadow-lg shadow-red-500/30 relative z-10"
                      style={
                        {
                          filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.3))'
                        }
                      }
                    />
                    {/* Constant glowing ring around logo */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={
                        {
                          background: 'conic-gradient(from 0deg, rgba(255, 0, 0, 0.3), rgba(139, 0, 0, 0.3), rgba(255, 0, 0, 0.3))',
                          padding: '2px'
                        }
                      }
                    >
                      <div className="w-full h-full rounded-full bg-background/20" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-red-400 to-red-300">
                      Mahakali's Cremation Ground
                    </span>
                    <span className="text-xs sm:text-xs text-red-400/70 font-medium tracking-wider">
                      🔥 Destroyer of Illusions
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-6 sm:space-x-6 text-sm">
                  <Link 
                    to="/about" 
                    className="relative text-foreground hover:text-red-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative z-10">About</span>
                  </Link>
                  <Link 
                    to="/careers" 
                    className="relative text-foreground hover:text-red-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative z-10">Join Us</span>
                  </Link>
                  <Link 
                    to="/manifesto" 
                    className="relative text-foreground hover:text-red-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative z-10">Manifesto</span>
                  </Link>
                  <a 
                    href="#" 
                    className="relative text-foreground hover:text-red-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative z-10">Privacy</span>
                  </a>
                  <a 
                    href="#" 
                    className="relative text-foreground hover:text-red-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative z-10">Terms</span>
                  </a>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <div 
                  className="inline-block px-4 py-2 rounded-full text-xs text-muted-foreground/80"
                  style={
                    {
                      background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.05), rgba(139, 0, 0, 0.08))',
                      border: '1px solid rgba(255, 0, 0, 0.15)'
                    }
                  }
                >
                  © {new Date().getFullYear()} Mahakali's Cremation Ground. All rights reserved. A sacred space for spiritual warriors seeking liberation.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ExperimentPage;