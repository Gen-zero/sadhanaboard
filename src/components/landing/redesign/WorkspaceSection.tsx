import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Flame, Moon, Sun } from "lucide-react";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

const WorkspaceSection = () => {
    const { ref: contentRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
    const [currentSlide, setCurrentSlide] = useState(0);

    const themes = [
        {
            name: "Shiva",
            description: "Deep indigo & ash. For dissolution and focus.",
            color: "from-indigo-900 to-slate-900",
            icon: Moon
        },
        {
            name: "Devi",
            description: "Crimson & gold. For energy and power.",
            color: "from-red-900 to-orange-900",
            icon: Flame
        },
        {
            name: "Krishna",
            description: "Peacock blue & forest green. For devotion.",
            color: "from-blue-900 to-emerald-900",
            icon: Sparkles
        },
        {
            name: "Surya",
            description: "Radiant orange & yellow. For vitality.",
            color: "from-orange-600 to-yellow-600",
            icon: Sun
        },
        {
            name: "Bhairava",
            description: "Pitch black & fire. For intensity.",
            color: "from-gray-950 to-red-950",
            icon: Flame
        }
    ];

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % themes.length);
        }, 3500); // Change slide every 3.5 seconds

        return () => clearInterval(interval);
    }, [themes.length]);

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                {/* Left Column: Auto-sliding Deity Cards */}
                <div className="relative h-[500px] w-full">
                    {/* Card Container */}
                    <div className="relative h-full w-full perspective-1000">
                        {themes.map((theme, index) => {
                            // Calculate position relative to current slide
                            let position = index - currentSlide;
                            if (position < 0) position += themes.length;

                            // Determine z-index and styling based on position
                            const isActive = position === 0;
                            const isNext = position === 1;
                            const isPrev = position === themes.length - 1;

                            let transform = '';
                            let opacity = 0;
                            let zIndex = 0;

                            if (isActive) {
                                transform = 'translateX(0) scale(1) rotateY(0deg)';
                                opacity = 1;
                                zIndex = 30;
                            } else if (isNext) {
                                transform = 'translateX(85%) scale(0.85) rotateY(-25deg)';
                                opacity = 0.5;
                                zIndex = 20;
                            } else if (isPrev) {
                                transform = 'translateX(-85%) scale(0.85) rotateY(25deg)';
                                opacity = 0.5;
                                zIndex = 20;
                            } else {
                                transform = 'translateX(100%) scale(0.7)';
                                opacity = 0;
                                zIndex = 10;
                            }

                            return (
                                <div
                                    key={index}
                                    className="absolute inset-0 transition-all duration-700 ease-out"
                                    style={{
                                        transform,
                                        opacity,
                                        zIndex,
                                        transformStyle: 'preserve-3d'
                                    }}
                                >
                                    {/* Deity Card */}
                                    <div className="h-full w-full rounded-2xl overflow-hidden card-glass border-2 border-white/10 shadow-2xl">
                                        {/* Background Gradient - Made opaque to hide cards behind */}
                                        <div className="absolute inset-0 bg-[#0a0a0a]" />
                                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-100`} />

                                        {/* Pattern Overlay */}
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />

                                        {/* Content */}
                                        <div className="relative h-full flex flex-col justify-between p-8">
                                            {/* Top: Icon */}
                                            <div className="flex justify-center pt-8">
                                                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                                    <theme.icon className="w-12 h-12 text-white" strokeWidth={1.5} />
                                                </div>
                                            </div>

                                            {/* Bottom: Text */}
                                            <div className="text-center">
                                                <h3 className="text-4xl font-serif font-bold text-white mb-3">
                                                    {theme.name}
                                                </h3>
                                                <p className="text-white/80 text-lg font-light mb-6">
                                                    {theme.description}
                                                </p>

                                                {/* Active Indicator */}
                                                {isActive && (
                                                    <div className="flex justify-center gap-2">
                                                        {themes.map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide
                                                                        ? 'w-8 bg-white'
                                                                        : 'w-1.5 bg-white/30'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Text Content */}
                <div ref={contentRef as React.RefObject<HTMLDivElement>} className="space-y-8">
                    <h2 className={`text-sm uppercase tracking-[0.2em] text-amber-200/60 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                        <Palette className="inline w-4 h-4 mr-2" />
                        Your Sacred Interface
                    </h2>
                    <h3 className={`font-serif text-3xl md:text-4xl leading-tight text-white/90 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                        Every deity has its own energy. Your workspace should too.
                    </h3>
                    <p className={`text-white/60 leading-relaxed font-light animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
                        Choose from authentic deity-themed interfaces. Each theme carries the essence, colors, and symbolism of your chosen path.
                    </p>
                    <ul className="space-y-4 pt-4">
                        {['Shiva for focus & dissolution', 'Devi for power & transformation', 'Krishna for devotion & joy'].map((item, i) => (
                            <li key={i} className={`flex items-center gap-3 text-white/80 animate-slide-in-left ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${0.4 + i * 0.1}s` }}>
                                <div className="w-1.5 h-1.5 bg-amber-400/80 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
                                <div className="font-light">{item}</div>
                            </li>
                        ))}
                    </ul>
                    <p className={`text-lg italic font-serif text-white/40 pt-4 border-l-2 border-white/10 pl-6 animate-fade-in ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.7s' }}>
                        "Your environment shapes your practice. Make it sacred."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WorkspaceSection;
