import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Flame, Moon, Sun } from "lucide-react";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

const WorkspaceSection = () => {
    const { ref: contentRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const themes = [
        {
            name: "Shiva",
            description: "Deep indigo & ash. For dissolution and focus.",
            color: "from-indigo-900 to-slate-900",
            icon: Moon,
            image: "/lovable-uploads/shiva.jpg"
        },
        {
            name: "Ganesh",
            description: "Golden wisdom & prosperity. For removing obstacles.",
            color: "from-orange-600 to-yellow-600",
            icon: Sun,
            image: "/lovable-uploads/ganesh.jpg",
            imagePosition: "center calc(50% + 60px)"
        },
        {
            name: "Sri Krishna",
            description: "Peacock blue & forest green. For devotion.",
            color: "from-blue-900 to-emerald-900",
            icon: Sparkles,
            image: "/lovable-uploads/sri-krishna.jpg",
            imagePosition: "center calc(50% + 60px)"
        },
        {
            name: "Bhairava",
            description: "Pitch black & fire. For intensity.",
            color: "from-gray-950 to-red-950",
            icon: Flame,
            image: "/lovable-uploads/bhairava.jpg",
            imagePosition: "center calc(50% + 40px)"
        },
        {
            name: "Devi",
            description: "Crimson & gold. For energy and power.",
            color: "from-red-900 to-orange-900",
            icon: Flame,
            image: "/lovable-uploads/devi.jpg",
            imagePosition: "center calc(50% + 50px)"
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
                <div className="relative h-[500px] w-full order-2 md:order-1">
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
                                        {/* Deity Image Background */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={theme.image}
                                                alt={theme.name}
                                                className={`w-full h-full object-cover ${imageErrors[theme.name] ? 'hidden' : 'block'}`}
                                                style={theme.imagePosition ? { objectPosition: theme.imagePosition } : undefined}
                                                onLoad={() => {
                                                    setImageErrors(prev => ({
                                                        ...prev,
                                                        [theme.name]: false
                                                    }));
                                                }}
                                                onError={() => {
                                                    setImageErrors(prev => ({
                                                        ...prev,
                                                        [theme.name]: true
                                                    }));
                                                }}
                                            />
                                            {/* Dark overlay for text readability */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                                        </div>

                                        {/* Fallback gradient background (if image fails) */}
                                        {imageErrors[theme.name] ? (
                                            <>
                                                <div className="absolute inset-0 bg-[#0a0a0a]" />
                                                <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-100`} />
                                            </>
                                        ) : (
                                            <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-30 mix-blend-overlay pointer-events-none`} />
                                        )}

                                        {/* Content */}
                                        <div className="relative h-full flex flex-col justify-end p-8">
                                            {/* Name, Description & Indicator */}
                                            <div className="text-center">
                                                <div className="flex justify-center mb-4">
                                                    <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                                        <h3 className="text-2xl font-serif font-bold text-white">
                                                            {theme.name}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <p className="text-white/90 text-lg font-light mb-6 drop-shadow-lg">
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
                <div className="relative overflow-hidden rounded-[32px] order-1 md:order-2" style={{ background: 'inherit' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/5 to-transparent opacity-70 mix-blend-multiply pointer-events-none" />
                    <div ref={contentRef as React.RefObject<HTMLDivElement>} className="relative space-y-8 p-10 bg-transparent backdrop-blur-sm">
                        <h2 className={`text-sm uppercase tracking-[0.2em] text-amber-200/60 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                            <Palette className="inline w-4 h-4 mr-2" />
                            Your Sacred Interface
                        </h2>
                        <h3 className={`font-chakra text-3xl md:text-4xl leading-tight text-white/90 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                            Every deity has its own energy. Your workspace should too.
                        </h3>
                        <p className={`text-white/60 leading-relaxed font-light animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
                            Choose from authentic deity-themed interfaces. Each theme carries the essence, colors, and symbolism of your chosen path.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {['Shiva for focus & dissolution', 'Ganesh for wisdom & prosperity', 'Krishna for devotion & joy'].map((item, i) => (
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
            </div>
        </section>
    );
};

export default WorkspaceSection;
