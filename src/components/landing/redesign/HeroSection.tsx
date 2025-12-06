import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, ShieldCheck } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import ThemedBackground from "@/components/ThemedBackground";

const HeroSection = () => {
  const { settings } = useSettings();
  const validThemes = ['default', 'earth', 'water', 'fire', 'shiva', 'bhairava', 'serenity', 'ganesha', 'mystery', 'neon', 'tara', 'durga', 'mahakali', 'swamiji', 'cosmos', 'lakshmi', 'vishnu', 'krishna'] as const;
  const backgroundTheme = settings?.appearance?.colorScheme &&
    validThemes.includes(settings.appearance.colorScheme as typeof validThemes[number])
    ? settings.appearance.colorScheme as typeof validThemes[number]
    : 'default';
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10 overflow-hidden">
      <ThemedBackground theme={backgroundTheme} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
          <span className="block text-white drop-shadow-lg">
            Your Daily Sadhana.
          </span>
          <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-sm">
            Structured. Trackable. Unbreakable.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-amber-50/90 leading-relaxed font-light">
          Build disciplined spiritual practice with a personalized Sadhana Card, real progress metrics, and a workspace designed around your chosen deity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-600 via-yellow-500 via-60% to-amber-500 hover:from-amber-500 hover:via-yellow-400 hover:to-amber-400 text-black border border-yellow-300/60 hover:border-yellow-200/80 shadow-2xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 h-auto rounded-full transform hover:scale-110 font-bold group/cta overflow-hidden relative"
            style={{
              boxShadow: '0 0 30px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 146, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            asChild
          >
            <Link to="/waitlist">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
              <span className="relative z-10">Join the Waitlist</span>
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-sm sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 h-auto rounded-full group"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current opacity-80 group-hover:scale-110 transition-transform" />
            Watch Demo (45s)
          </Button>
        </div>

        {/* Micro-Trust Strip */}
        <div className="flex items-center justify-center gap-2 text-sm text-amber-200/60 pt-8 font-medium tracking-wide">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Private Beta
          </span>
          <span className="w-1 h-1 rounded-full bg-amber-200/30" />
          <span>12,000+ Seekers Waiting</span>
          <span className="w-1 h-1 rounded-full bg-amber-200/30" />
          <span>Built by Practitioners</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
