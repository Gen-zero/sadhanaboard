import React from 'react';
import { Palette, Sparkles, Flame, Moon, Sun } from "lucide-react";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

const WorkspaceSection = () => {
    const { ref: contentRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
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

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                {/* Left Column: Text Content */}
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

                {/* Right Column: Theme Visualization */}
                <div className="relative h-[450px] w-full flex items-center justify-center">
                    {/* Container with overflow hidden */}
                    <div className="absolute inset-0 border border-white/[0.08] bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        {/* Sacred Geometry Background */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <div className="w-[300px] h-[300px] border border-white rounded-full animate-spin-slow border-dashed"></div>
                            <div className="absolute w-[200px] h-[200px] border border-white/50 rounded-full animate-spin-slow-reverse"></div>
                        </div>

                        {/* Floating Theme Orbs */}
                        <style>
                            {`
                                @keyframes orbit-1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -60px) scale(1.1); } }
                                @keyframes orbit-2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-50px, 30px) scale(1.15); } }
                                @keyframes orbit-3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, 50px) scale(1.05); } }
                                @keyframes orbit-4 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-40px, -40px) scale(1.12); } }
                                @keyframes orbit-5 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(50px, 20px) scale(1.08); } }
                                @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px currentColor; } 50% { box-shadow: 0 0 40px currentColor; } }
                            `}
                        </style>

                        {/* Theme Orbs with Icons */}
                        {themes.map((theme, index) => {
                            const positions = [
                                { top: '20%', left: '25%', animation: 'orbit-1' },
                                { bottom: '30%', right: '20%', animation: 'orbit-2' },
                                { top: '35%', right: '25%', animation: 'orbit-3' },
                                { bottom: '25%', left: '30%', animation: 'orbit-4' },
                                { top: '15%', right: '15%', animation: 'orbit-5' }
                            ];
                            const pos = positions[index];
                            return (
                                <div
                                    key={index}
                                    className="absolute flex flex-col items-center gap-2 group cursor-default"
                                    style={{
                                        ...pos,
                                        animation: `${pos.animation} ${16 + index * 2}s ease-in-out infinite`
                                    }}
                                >
                                    {/* Orb */}
                                    <div
                                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme.color} flex items-center justify-center transition-all duration-500 group-hover:scale-125`}
                                        style={{
                                            animation: 'pulse-glow 3s ease-in-out infinite',
                                            animationDelay: `${index * 0.6}s`
                                        }}
                                    >
                                        <theme.icon className="w-7 h-7 text-white/90" strokeWidth={1.5} />
                                    </div>
                                    {/* Label */}
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-light group-hover:text-white/70 transition-colors">
                                        {theme.name}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Center Label */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-10">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">Theme Selection</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkspaceSection;
