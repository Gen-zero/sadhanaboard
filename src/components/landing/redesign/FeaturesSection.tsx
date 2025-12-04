import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, ListTodo, Library, TrendingUp, Users, Sparkles } from "lucide-react";
import TechnoSpiritualFeatureCard from './TechnoSpiritualFeatureCard';

const FeaturesSection = () => {
    const features = [
        {
            icon: BarChart3,
            title: "Progress Dashboard",
            description: "Your streaks, mantra counts, reading minutes, vow integrity — all visible at a glance via the astral plane interface."
        },
        {
            icon: ListTodo,
            title: "Sadhana To-Do",
            description: "Your daily ritual automatically generated and checked off. Synchronize your digital actions with karmic intent."
        },
        {
            icon: Library,
            title: "Sacred Library",
            description: "Curated sadhanas, authentic scriptures, guided rituals — verified wisdom digitized for the modern seeker."
        },
        {
            icon: TrendingUp,
            title: "Sankalpa Metrics",
            description: "Earn XP, Karma Points, and Depth Index™ for true vow completion. Gamify your ascent to enlightenment."
        },
        {
            icon: Users,
            title: "Guru Tools",
            description: "Assign cards, monitor cohorts, track disciples — omniscient oversight from a single dharma dashboard."
        },
        {
            icon: Users,
            title: "Cohort Experience",
            description: "Join a sangha of serious practitioners. Keep each other accountable in the holographic web of consciousness."
        }
    ];

    // Theme configuration for the cards
    const cardTheme = {
        bg: 'rgba(20, 20, 25, 0.6)',   // Semi-transparent dark base
        panel: '#1e1e24',              // Slightly lighter panel
        accent: '#FFD54A',             // Amber Accent (matches existing)
        highlight: '#ffffff',          // White Highlight
        text: '#94a3b8',               // Slate-400 text
        glow: 'rgba(255, 213, 74, 0.1)', // Amber Glow
    };

    const [isScrollActivated, setIsScrollActivated] = useState(false);
    const [autoHoverStates, setAutoHoverStates] = useState<boolean[]>(() => features.map(() => false));
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const updateActivation = () => {
            const maxTouchPoints = typeof navigator !== 'undefined'
                ? navigator.maxTouchPoints || (navigator as any).msMaxTouchPoints || 0
                : 0;
            const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || maxTouchPoints > 0);
            const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 1024;
            setIsScrollActivated(isTouchDevice || isSmallScreen);
        };

        updateActivation();
        window.addEventListener('resize', updateActivation);
        window.addEventListener('orientationchange', updateActivation);
        return () => {
            window.removeEventListener('resize', updateActivation);
            window.removeEventListener('orientationchange', updateActivation);
        };
    }, []);

    useEffect(() => {
        if (!isScrollActivated) {
            setAutoHoverStates(features.map(() => false));
            return;
        }

        let frame: number | null = null;

        const updateHoverStates = () => {
            frame = null;
            const viewportCenter = window.innerHeight / 2;
            const nextStates = cardRefs.current.map((card) => {
                if (!card) return false;
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.top + rect.height / 2;
                return cardCenter <= viewportCenter;
            });

            setAutoHoverStates((prev) => {
                if (prev.length !== nextStates.length) {
                    return nextStates;
                }
                const changed = nextStates.some((val, idx) => val !== prev[idx]);
                return changed ? nextStates : prev;
            });
        };

        const onScrollOrResize = () => {
            if (frame !== null) return;
            frame = window.requestAnimationFrame(updateHoverStates);
        };

        updateHoverStates();
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);
        window.addEventListener('orientationchange', onScrollOrResize);

        return () => {
            if (frame !== null) {
                window.cancelAnimationFrame(frame);
            }
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
            window.removeEventListener('orientationchange', onScrollOrResize);
        };
    }, [isScrollActivated, features.length]);

    return (
        <section className="py-24 px-4 relative overflow-hidden">


            {/* Tiled Yantra Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23FFD54A' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='10' fill='none' stroke='%23FFD54A' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-amber-400/10 border border-amber-400/20">
                        <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
                        <span className="text-xs font-mono uppercase tracking-widest text-amber-300">System Capabilities</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif leading-tight text-white/90 mb-6">
                        Everything You Need for <span className="text-amber-400">Serious Practice</span>
                    </h2>
                    <p className="text-xl text-white/50 font-light max-w-2xl mx-auto">
                        All in one clean, powerful interface. Designed for the modern ascetic.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                cardRefs.current[index] = el;
                            }}
                            className="h-full"
                        >
                            <TechnoSpiritualFeatureCard
                                title={feature.title}
                                description={feature.description}
                                icon={feature.icon}
                                theme={cardTheme}
                                isComingSoon={index >= 4}
                                forcedHover={isScrollActivated ? (autoHoverStates[index] ?? false) : undefined}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
