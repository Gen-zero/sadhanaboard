import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, ListTodo, Library, TrendingUp, UserCog, Users, Sparkles, Activity } from "lucide-react";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

const FeaturesSection = () => {
    const { ref: contentRef, isVisible } = useScrollTrigger({ threshold: 0.15 });
    const [activeStage, setActiveStage] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [cardHoverStates, setCardHoverStates] = useState<{[key: number]: boolean}>({});

    const features = [
        {
            stage: 1,
            icon: BarChart3,
            title: "Progress Dashboard",
            description: "Your streaks, mantra counts, reading minutes, vow integrity — all visible at a glance via the astral plane interface."
        },
        {
            stage: 1,
            icon: ListTodo,
            title: "Sadhana To-Do",
            description: "Your daily ritual automatically generated and checked off. Synchronize your digital actions with karmic intent."
        },
        {
            stage: 2,
            icon: Library,
            title: "Sacred Library",
            description: "Curated sadhanas, authentic scriptures, guided rituals — verified wisdom digitized for the modern seeker."
        },
        {
            stage: 2,
            icon: TrendingUp,
            title: "Sankalpa Metrics",
            description: "Earn XP, Karma Points, and Depth Index™ for true vow completion. Gamify your ascent to enlightenment."
        },
        {
            stage: 3,
            icon: UserCog,
            title: "Guru Tools",
            description: "Assign cards, monitor cohorts, track disciples — omniscient oversight from a single dharma dashboard."
        },
        {
            stage: 3,
            icon: Users,
            title: "Cohort Experience",
            description: "Join a sangha of serious practitioners. Keep each other accountable in the holographic web of consciousness."
        }
    ];

    // Auto-slider effect (changes stage every 4 seconds)
    useEffect(() => {
        if (isTransitioning) return;
        
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setActiveStage((prev) => (prev === 3 ? 1 : prev + 1));
            
            setTimeout(() => {
                setIsTransitioning(false);
            }, 500);
        }, 4000);

        return () => clearInterval(interval);
    }, [isTransitioning]);

    // Handle manual stage click
    const handleStageClick = (stage: number) => {
        if (stage === activeStage || isTransitioning) return;
        
        setIsTransitioning(true);
        setActiveStage(stage);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    const currentFeatures = features.filter(f => f.stage === activeStage);

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Tiled Yantra Pattern Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23FFD54A' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='10' fill='none' stroke='%23FFD54A' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-[1300px] mx-auto relative z-10">
                {/* Header Block */}
                <div ref={contentRef as React.RefObject<HTMLDivElement>} className="text-center mb-16">
                    {/* Top Ornament */}
                    <div className="mb-6 flex justify-center">
                        <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                    </div>

                    {/* Main Title */}
                    <h2 
                        className={`text-4xl md:text-6xl font-serif leading-tight mb-6 tracking-tight animate-fade-in-up ${isVisible ? 'visible' : ''}`}
                        style={{ 
                            transitionDelay: '0.1s',
                            background: 'linear-gradient(to right, rgb(254 243 199), rgb(233 213 255), rgb(254 243 199))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.1))',
                            fontWeight: 200
                        }}
                    >
                        Everything You Need for <span className="font-semibold">Serious Practice</span>
                    </h2>

                    {/* Subtitle with Divider */}
                    <div className={`flex items-center justify-center gap-4 mb-8 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-600"></div>
                        <p className="text-lg font-light text-slate-400 tracking-wide">
                            All in one <span className="text-sm font-bold uppercase text-cyan-400/80 tracking-wider">clean</span>, <span className="text-sm font-bold uppercase text-amber-400/80 tracking-wider">powerful</span> interface
                        </p>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-600"></div>
                    </div>

                    {/* Stage Indicators - Clickable */}
                    <div className="flex items-center justify-center gap-4">
                        {[1, 2, 3].map((stage) => (
                            <button
                                key={stage}
                                onClick={() => handleStageClick(stage)}
                                disabled={isTransitioning}
                                className={`flex items-center justify-center rounded-full border transition-all duration-300 cursor-pointer hover:scale-110 disabled:cursor-not-allowed ${
                                    activeStage === stage
                                        ? 'w-12 h-12 border-2 border-amber-400 bg-amber-400/20 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                                        : 'w-10 h-10 border border-slate-600 bg-transparent opacity-60 hover:opacity-100 hover:border-amber-400/50'
                                }`}
                            >
                                <span className={`${
                                    activeStage === stage ? 'text-base text-amber-100' : 'text-sm text-slate-500'
                                }`}>
                                    {stage}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feature Cards Grid with Stage Transitions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {currentFeatures.map((feature, index) => {
                        const isHovered = cardHoverStates[index] || false;
                        const IconComponent = feature.icon;

                        return (
                            <div
                                key={`${activeStage}-${index}`}
                                className={`relative p-8 rounded-2xl border transition-all duration-500 group animate-scale-in ${isVisible ? 'visible' : ''}`}
                                style={{
                                    transitionDelay: `${0.3 + index * 0.1}s`,
                                    backdropFilter: 'blur(14px)',
                                    backgroundColor: isHovered ? 'rgba(15, 23, 42, 0.8)' : 'rgba(15, 23, 42, 0.4)',
                                    borderColor: isHovered ? 'rgba(251, 191, 36, 0.5)' : 'rgb(30, 41, 59)',
                                    boxShadow: isHovered ? '0 0 30px rgba(251, 191, 36, 0.15)' : 'none',
                                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                    willChange: 'transform, background-color, border-color, box-shadow'
                                }}
                                onMouseEnter={() => setCardHoverStates(prev => ({ ...prev, [index]: true }))}
                                onMouseLeave={() => setCardHoverStates(prev => ({ ...prev, [index]: false }))}
                            >
                                {/* Tech Grid Pattern Background */}
                                <div 
                                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{
                                        backgroundImage: 'linear-gradient(rgba(128,128,128,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.12) 1px, transparent 1px)',
                                        backgroundSize: '14px 14px'
                                    }}
                                />

                                {/* Sacred Circuit Pattern Overlay */}
                                <svg className="absolute inset-0 w-full h-full opacity-15 mix-blend-multiply pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#FDBA3B" strokeWidth="0.5" opacity="0.3"/>
                                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#FDBA3B" strokeWidth="0.5" opacity="0.3"/>
                                    <rect x="25%" y="25%" width="50%" height="50%" fill="none" stroke="#FDBA3B" strokeWidth="0.5" opacity="0.3" transform="rotate(45 50 50)" transform-origin="50% 50%"/>
                                    <circle cx="50%" cy="50%" r="15%" fill="none" stroke="#FDBA3B" strokeWidth="0.5" opacity="0.4"/>
                                    <circle cx="50%" cy="20%" r="2" fill="#FDBA3B" opacity="0.4"/>
                                    <circle cx="50%" cy="80%" r="2" fill="#FDBA3B" opacity="0.4"/>
                                    <circle cx="20%" cy="50%" r="2" fill="#FDBA3B" opacity="0.4"/>
                                    <circle cx="80%" cy="50%" r="2" fill="#FDBA3B" opacity="0.4"/>
                                </svg>

                                {/* Corner Brackets */}
                                <div className={`absolute top-2 left-2 w-2 h-2 border-t border-l transition-colors duration-300 ${isHovered ? 'border-amber-400' : 'border-slate-600'}`} />
                                <div className={`absolute top-2 right-2 w-2 h-2 border-t border-r transition-colors duration-300 ${isHovered ? 'border-amber-400' : 'border-slate-600'}`} />
                                <div className={`absolute bottom-2 left-2 w-2 h-2 border-b border-l transition-colors duration-300 ${isHovered ? 'border-amber-400' : 'border-slate-600'}`} />
                                <div className={`absolute bottom-2 right-2 w-2 h-2 border-b border-r transition-colors duration-300 ${isHovered ? 'border-amber-400' : 'border-slate-600'}`} />

                                {/* Decorative Bottom Line */}
                                <div 
                                    className="absolute bottom-0 left-0 right-0 h-px transition-all duration-700"
                                    style={{
                                        background: 'linear-gradient(to right, transparent, rgba(245, 158, 11, 0.5), transparent)',
                                        transform: isHovered ? 'translateX(0)' : 'translateX(-100%)',
                                        opacity: isHovered ? 1 : 0
                                    }}
                                />

                                {/* Icon Container */}
                                <div className="mb-6 relative">
                                    {/* Glow Layer */}
                                    <div 
                                        className="absolute inset-0 rounded-full transition-opacity duration-500"
                                        style={{
                                            opacity: isHovered ? 0.4 : 0,
                                            filter: 'blur(12px)',
                                            background: 'rgb(251, 191, 36)'
                                        }}
                                    />
                                    
                                    {/* Icon Circle */}
                                    <div 
                                        className={`relative w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${
                                            isHovered ? 'border-amber-400/80 bg-slate-900' : 'border-slate-700 bg-slate-800/50'
                                        }`}
                                    >
                                        <IconComponent 
                                            className={`w-6 h-6 transition-colors duration-500 ${
                                                isHovered ? 'text-amber-300 animate-pulse' : 'text-slate-400'
                                            }`}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="relative">
                                    <h3 className={`text-xl font-medium tracking-wide mb-3 transition-colors duration-300 ${
                                        isHovered ? 'text-amber-100' : 'text-slate-200'
                                    }`}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm font-light leading-relaxed text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Footer */}
                <div className="text-center mt-20">
                    <button 
                        className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-base relative overflow-hidden group/btn transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{
                            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {/* Stardust Pattern Overlay */}
                        <div 
                            className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2720%27 height=%2720%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Ccircle cx=%272%27 cy=%272%27 r=%271%27 fill=%27white%27 opacity=%270.5%27/%3E%3C/svg%3E')"
                            }}
                        />
                        
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Begin Your Journey
                            <Activity className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
