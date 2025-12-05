import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import MobileNav from '@/components/mobile/MobileNav';

// Import Redesigned Components
import HeroSection from '@/components/landing/redesign/HeroSection';
import ProblemSection from '@/components/landing/redesign/ProblemSection';
import SolutionSection from '@/components/landing/redesign/SolutionSection';
import SadhanaCardSection from '@/components/landing/redesign/SadhanaCardSection';
import FeaturesSection from '@/components/landing/redesign/FeaturesSection';
import WorkspaceSection from '@/components/landing/redesign/WorkspaceSection';
import ExploreSection from '@/components/landing/redesign/ExploreSection';

import TargetAudienceSection from '@/components/landing/redesign/TargetAudienceSection';
import OriginStorySection from '@/components/landing/redesign/OriginStorySection';
import PricingSection from '@/components/landing/redesign/PricingSection';
import FinalCTA from '@/components/landing/redesign/FinalCTA';
import Footer from '@/components/landing/redesign/Footer';

const HomePage = () => {
  const { settings } = useSettings();

  // Ambient audio toggle
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25;
    if (audioOn) {
      audioRef.current.play().catch(() => { });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioOn]);

  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-amber-500/30">
      {/* Ambient Audio */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src="/audio/ambient-temple.mp3" />

      {/* Mobile Navigation - Rendered outside navbar to avoid overflow constraints */}
      <div className="md:hidden">
        <MobileNav showHamburger={true} showLoginButton={false} />
      </div>

      {/* Sticky Navigation Bar - Glassy Spiritual Theme */}
      <div
        className="sticky top-0 left-0 right-0 z-[999999] px-2 sm:px-4 pt-2 sm:pt-3"
        style={{
          pointerEvents: 'auto'
        }}
      >
        <nav
          className="relative overflow-visible rounded-xl sm:rounded-2xl transition-all duration-500 shadow-2xl group flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4"
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

          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" className="flex items-center space-x-2 group/logo">
              <div className="relative">
                <ResponsiveImage
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full cursor-pointer scale-110 shadow-lg shadow-purple-500/5 transition-transform duration-300 group-hover/logo:scale-125 relative z-10"
                  quality="high"
                  lazy={false}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.1))'
                  }}
                />
                {/* Enhanced glowing aura around the logo */}
                <div className="absolute inset-0 rounded-full animate-pulse z-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, rgba(255, 165, 0, 0.02) 60%, transparent 70%)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                />
                {/* Constant glowing ring around logo with animation */}
                <div
                  className="absolute inset-0 rounded-full animate-spin-slow"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.1), rgba(138, 43, 226, 0.1), rgba(255, 215, 0, 0.1))',
                    padding: '2px'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-background/30" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300 transition-all duration-300 group-hover/logo:from-yellow-200 group-hover/logo:via-purple-200 group-hover/logo:to-fuchsia-200">
                  SadhanaBoard
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-yellow-400/80 font-medium tracking-wider hidden xs:block transition-all duration-300 group-hover/logo:text-yellow-300">
                  ✨ Your Digital Yantra
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAudioOn(!audioOn)}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
            >
              {audioOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              asChild
              className="relative border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group/btn overflow-hidden px-4 py-2 text-sm transform hover:scale-105 rounded-full border"
            >
              <Link to="/login">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10">Login</span>
              </Link>
            </Button>

            <Button
              asChild
              className="relative bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-500/90 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 backdrop-blur-sm border border-amber-400/40 hover:border-yellow-400/60 shadow-lg hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 group/cta overflow-hidden px-6 py-2 text-sm transform hover:scale-105 rounded-full text-black font-medium"
            >
              <Link to="/waitlist">
                {/* Animated gradient background */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-purple-400/30 to-fuchsia-400/30 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                />
                {/* Floating sparkles */}
                <div className="absolute top-1 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
                <div className="absolute bottom-1 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-0 group-hover/cta:opacity-100" style={{ animationDelay: '0.5s' }} />

                <span className="relative z-10 flex items-center">
                  Join Waitlist
                  <Sparkles className="ml-2 h-4 w-4 group-hover/cta:animate-spin" style={{ animationDuration: '1.5s' }} />
                </span>
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content Sections */}
      <main className="relative z-10 space-y-0">
        <HeroSection />
        {/* Continuous wave gradient wrapper for sections 2-8 */}
        <div
          className="relative z-20"
          style={{
            background: `
              linear-gradient(
                to bottom,
                #4b0753 0%,
                #2a0a3e 8%,
                #1a0b2e 16%,
                #2a0a3e 24%,
                #4b0753 32%,
                #2a0a3e 40%,
                #1a0b2e 48%,
                #2a0a3e 56%,
                #4b0753 64%,
                #2a0a3e 72%,
                #1a0b2e 80%,
                #2a0a3e 88%,
                #0a0a0a 100%
              )
            `
          }}
        >
          <ProblemSection />
          <div className="text-white/80 text-base">
            <SolutionSection />
            <SadhanaCardSection />
            <FeaturesSection />
            <WorkspaceSection />
            <ExploreSection />
            <TargetAudienceSection />
            <OriginStorySection />
          </div>
        </div>
        {/* Sections after the gradient */}
        <div className="relative z-20 bg-background">
          <PricingSection />
          <FinalCTA />
          <div className="text-white/80 text-base">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
