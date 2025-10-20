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
  const [manifestationCount, setManifestationCount] = useState(1247);
  const [energyLevel, setEnergyLevel] = useState(78);
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
  const statsY = useTransform(scrollYProgress, [0.2, 0.6], [50, 0]);
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

  // Animated counters
  useEffect(() => {
    const interval = setInterval(() => {
      setManifestationCount((prev) => prev + Math.floor(Math.random() * 7));
      setEnergyLevel((prev) => Math.min(100, prev + Math.floor(Math.random() * 4)));
    }, 1500);
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

  const stats = [
    { value: manifestationCount, label: "Souls Transformed", icon: Skull },
    { value: energyLevel, label: "Destruction Power %", icon: Flame },
    { value: 500, label: "Sacred Yantras Created", icon: Compass },
    { value: 98, label: "Liberation Rate %", icon: Wind }
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
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const isInspirationInView = useInView(inspirationRef, { once: true, margin: "-100px" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
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

      {/* Beta banner */}
      <div className="px-2 sm:px-4 pt-2">
        <div className="mx-auto max-w-5xl rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-200 text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center justify-center gap-2">
          <span className="inline-block rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold">BETA</span>
          We're in private beta. New registrations are closed — join the waitlist to get early access.
        </div>
      </div>

      {/* Sticky Navigation Bar - Glassy Spiritual Theme with Mahakali colors */}
      <div 
        className="sticky top-0 left-0 right-0 z-[999999] px-2 sm:px-4 pt-2 sm:pt-4"
        style={{
          pointerEvents: 'auto'
        }}
      >
        <nav 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group"
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
          
  
          
          <div className="relative flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
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
                  Mahakali's Cremation Ground
                </span>
                <span className="text-[10px] sm:text-xs text-red-400/70 font-medium tracking-wider hidden xs:block">
                  🔥 Destroyer of Illusions
                </span>
              </div>
            </Link>
            
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
          </div>
        </nav>
      </div>

      <div className="space-y-0 relative z-20">
        {/* Hero Section - cremation ground theme */}
        <motion.section 
          ref={heroRef} 
          className="text-center py-20 md:py-40 relative overflow-hidden"
          style={{ y: heroY }}
        >
          {/* Visual background is provided by the MahakaliAnimatedBackground Three.js scene */}
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/30 text-red-300 mb-6 border border-red-700/40">
                <Flame className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">Destroyer of Illusions</span>
              </div>
              
              <motion.h1 
                className="text-5xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-yellow-300 to-red-300"
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
                SACRED
                <br />
                <span className="block mt-2">CREMATION GROUND</span>
              </motion.h1>
              
              <p className="text-xl md:text-3xl text-red-100 mb-16 max-w-4xl mx-auto leading-relaxed">
                The ultimate spiritual battlefield where ego dies and the Divine awakens. 
                <br />
                <span className="text-yellow-300">Transform through destruction. Liberate through power.</span>
              </p>
            </motion.div>

            {/* Interactive Sankalpa Input with Enhanced Design */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-10 border border-red-800/50 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-black/30"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Flame className="h-6 w-6 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-300">
                      Declare Your Sacred Destruction
                    </h2>
                  </div>
                  <p className="text-lg text-red-200 mb-6">
                    Join the waitlist to get early access to this transformative experience.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-black h-16 px-10 text-xl group shadow-2xl shadow-red-900/40 border border-red-700"
                      asChild
                    >
                      <Link to="/waitlist">
                        Join the Waitlist
                        <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          ref={statsRef} 
          className="py-16 container mx-auto px-4"
          style={{ y: statsY }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="backdrop-blur-md bg-black/50 p-6 rounded-2xl border border-red-800/40 text-center hover:border-yellow-500/40 transition-all duration-300"
                >
                  <Icon className="h-10 w-10 text-red-400 mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400 mb-2">
                    {stat.value}{index === 1 ? '%' : ''}
                  </div>
                  <div className="text-sm text-red-200">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

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

        {/* Testimonials with Auto-Rotation */}
        <motion.section 
          ref={testimonialsRef} 
          className="py-20 relative"
          style={{ y: testimonialsY }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-black/30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-yellow-300 to-red-300">
                  Voices from the Ashes
                </span>
              </motion.h2>
              <motion.p 
                className="text-xl text-red-200 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Hear from those who have walked the path of destruction
              </motion.p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative h-96">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className={`absolute inset-0 ${index === activeTestimonial ? 'z-10' : 'z-0'}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: index === activeTestimonial ? 1 : 0,
                      scale: index === activeTestimonial ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="backdrop-blur-md bg-black/60 border border-red-800/50 h-full flex flex-col">
                      <CardContent className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-700 to-red-900 mr-4 flex items-center justify-center text-lg font-bold">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-xl text-white">{testimonial.name}</p>
                            <p className="text-sm text-red-300">{testimonial.role}</p>
                            <p className="text-xs text-yellow-300 mt-1">{testimonial.practice}</p>
                          </div>
                        </div>
                        <div className="flex-grow flex items-center">
                          <p className="text-red-100/90 text-xl italic text-center">
                            "{testimonial.content}"
                          </p>
                        </div>
                        <div className="flex justify-center mt-6 space-x-2">
                          {testimonials.map((_, dotIndex) => (
                            <button
                              key={dotIndex}
                              className={`w-3 h-3 rounded-full transition-all ${
                                dotIndex === activeTestimonial
                                  ? "bg-yellow-500 scale-125"
                                  : "bg-red-700/50"
                              }`}
                              onClick={() => setActiveTestimonial(dotIndex)}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

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

        {/* Theme Changing Section - Mahakali Theme */}
        <section className="py-16 container mx-auto px-4 relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-yellow-600 flex items-center justify-center mx-auto">
                  <span className="text-2xl text-white">🎨</span>
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-500 to-red-400">
              Divine Themes for Your Practice
            </h2>
            <p className="text-xl text-red-200 max-w-2xl mx-auto mb-10">
              Personalize your spiritual journey with themes inspired by Hindu deities and traditions
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[{
                name: "Mahakali's Cremation Ground",
                description: "Embrace the fierce power of transformation through destruction and renewal",
                color: "from-red-800 to-red-900",
                icon: "🔥",
                link: "/MahakaliLandingpage"
              }, {
                name: "Cosmic Mystery",
                description: "Unlock hidden knowledge and universal wisdom through cosmic exploration",
                color: "from-indigo-800 to-indigo-900",
                icon: "🔮",
                link: "/MysteryLandingpage"
              }].map((theme, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group cursor-pointer h-full"
                >
                  <Link to={theme.link} className="h-full block">
                    <div className="relative bg-gradient-to-br from-background/80 to-background/60 rounded-2xl p-6 border border-red-200/50 hover:border-red-300/70 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 backdrop-blur-sm h-full flex flex-col">
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="text-4xl mb-4 flex justify-center">
                          {theme.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-red-300 transition-colors duration-300">
                          {theme.name}
                        </h3>
                        <p className="text-red-200 text-sm mb-4 leading-relaxed flex-grow">
                          {theme.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-300/50 text-red-300 hover:bg-red-500/10 text-sm w-full transition-all duration-300 group-hover:border-red-400/70 mt-auto"
                        >
                          Explore Theme
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-10 inline-flex items-center bg-gradient-to-r from-red-500/15 to-yellow-500/15 border border-red-500/40 rounded-full px-6 py-3">
              <Sparkles className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-base font-medium text-red-300">More themes coming soon with beta updates!</span>
            </div>
          </div>
        </section>

        {/* Final CTA Section - cremation ground theme */}
        <motion.section 
          ref={ctaRef} 
          className="py-32 text-center relative overflow-hidden"
          style={{ y: ctaY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 via-black/30 to-black/50 backdrop-blur-sm"></div>
          

          
          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/30 text-red-300 mb-8 border border-red-700/40 mx-auto">
                <Flame className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">Begin Your Transformation</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-300 via-yellow-300 to-red-300">
                Enter the Sacred Fire
              </h2>
              
              <p className="text-2xl md:text-3xl text-red-200 mb-16 max-w-3xl mx-auto leading-relaxed">
                Join the circle of spiritual warriors. 
                <br />
                <span className="text-yellow-300">Destroy your limitations. Embrace your divine power.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(220, 38, 38, 0.5)',
                      '0 0 30px rgba(251, 191, 36, 0.8)',
                      '0 0 20px rgba(220, 38, 38, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-red-700 via-red-800 to-black hover:from-red-800 hover:via-red-900 hover:to-black text-2xl px-16 py-10 backdrop-blur-sm shadow-2xl shadow-red-900/50 rounded-2xl border border-red-700"
                    asChild
                  >
                    <Link to="/waitlist">
                      Join the Waitlist
                      <ChevronRight className="ml-3 h-8 w-8" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    borderColor: [
                      'rgba(185, 28, 28, 0.5)',
                      'rgba(251, 191, 36, 0.8)',
                      'rgba(185, 28, 28, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-red-700/50 text-red-200 hover:bg-red-900/30 text-2xl px-16 py-10 backdrop-blur-sm rounded-2xl border-2"
                    asChild
                  >
                    <Link to="/your-atma-yantra" className="flex items-center">
                      <Flame className="mr-3 h-8 w-8 text-yellow-400" />
                      Explore Features
                    </Link>
                  </Button>
                </motion.div>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-red-300/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Free Forever</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-red-700/50"></div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span>Divine Power</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-red-700/50"></div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-red-400" />
                  <span>Sacred Community</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer - cremation ground theme */}
        <footer className="backdrop-blur-md bg-black/60 border-t border-red-800/30">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-700 to-red-900 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-yellow-300" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-yellow-300">
                  Mahakali's Cremation Ground
                </span>
              </div>
              <div className="flex space-x-8 text-lg text-red-300/80">
                <Link to="/about" className="hover:text-yellow-300 transition-colors">
                  About
                </Link>
                <a href="#" className="hover:text-yellow-300 transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-yellow-300 transition-colors">
                  Terms
                </a>
              </div>
            </div>
            <div className="mt-8 text-center text-base text-red-300/70">
              © {new Date().getFullYear()} Mahakali's Cremation Ground. All rights reserved. 
              <br />
              A sacred space for spiritual warriors seeking liberation.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ExperimentPage;