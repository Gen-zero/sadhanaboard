import React from 'react';
import { Sparkles } from "lucide-react";
import ThemedBackground from "@/components/ThemedBackground";
import { useSettings } from "@/hooks/useSettings";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { Link } from "react-router-dom";

const FinalCTA = () => {
    const { settings } = useSettings();
    const validThemes = ['default', 'earth', 'water', 'fire', 'shiva', 'bhairava', 'serenity', 'ganesha', 'mystery', 'neon', 'tara', 'durga', 'mahakali', 'swamiji', 'cosmos', 'lakshmi', 'vishnu', 'krishna'] as const;
    const backgroundTheme = settings?.appearance?.colorScheme &&
        validThemes.includes(settings.appearance.colorScheme as typeof validThemes[number])
        ? settings.appearance.colorScheme as typeof validThemes[number]
        : 'default';
    const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.2 });

    return (
        <section ref={sectionRef as React.RefObject<HTMLElement>} className="min-h-screen px-4 relative overflow-hidden flex items-center justify-center">
            {/* Shared hero background */}
            <ThemedBackground
                theme={backgroundTheme}
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
            />

            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-[#FFD54A] opacity-[0.03] blur-[150px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD54A]/10 border border-[#FFD54A]/20 text-[#FFD54A] text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up ${isVisible ? 'visible' : ''}`}>
                    <Sparkles className="w-4 h-4" />
                    <span>Begin Your Transformation</span>
                </div>

                <h2 className={`text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                    Ready to Master <br />
                    <span className="text-gold-glow">Your Spiritual Discipline?</span>
                </h2>

                <p className={`text-xl text-white/60 font-sans mb-12 max-w-2xl mx-auto animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                    Join the operating system designed for serious seekers. Structure your practice, track your progress, and ascend.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/waitlist"
                        className={`w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#DC143C] via-[#B01030] to-[#8B0000] hover:from-[#FF1744] hover:via-[#DC143C] hover:to-[#B01030] text-white font-bold text-lg shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 border border-[#DC143C]/60 hover:border-[#FF1744]/80 animate-rise-in group/cta overflow-hidden relative ${isVisible ? 'visible' : ''}`}
                        style={{
                            transitionDelay: '0.3s',
                            boxShadow: '0 0 30px rgba(220, 20, 60, 0.4), 0 0 60px rgba(139, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
                        <span className="relative z-10">Join the Waitlist</span>
                    </Link>
                    <button className={`w-full sm:w-auto px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-sm animate-rise-in ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.35s' }}>
                        View Demo
                    </button>
                </div>

                <p className={`mt-8 text-white/40 text-sm animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                    Private beta access opens in cohorts—join the waitlist to be notified first.
                </p>
            </div>
        </section>
    );
};

export default FinalCTA;
