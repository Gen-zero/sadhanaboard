import React, { useState, useEffect, useRef } from 'react';
import { Scroll, Video, Book, Hourglass, Flower } from 'lucide-react';


const ProblemSection = () => {
    // Refs for optimized animation (bypassing state re-renders)
    const frictionSectionRef = useRef<HTMLElement>(null);
    const soulNodeRef = useRef<HTMLDivElement>(null);

    // Optimized Physics-based Animation Loop for Section 2
    useEffect(() => {
        let targetY = 0;
        let currentY = 0;
        let animationFrameId: number;

        const handleScroll = () => {
            if (!frictionSectionRef.current) return;

            const rect = frictionSectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate the center point of the section relative to the viewport
            const sectionCenter = rect.top + (rect.height / 2);
            const screenCenter = windowHeight / 2;

            // Calculate distance from center (positive means section has moved up)
            const distFromCenter = screenCenter - sectionCenter;

            // If the user has scrolled past the center, set the target
            if (distFromCenter > 0) {
                const maxDrop = 800;
                // Target is where we WANT the dot to be
                targetY = Math.min(distFromCenter * 1.2, maxDrop);
            } else {
                targetY = 0;
            }
        };

        const animate = () => {
            // Linear Interpolation (Lerp) for smoothness
            // Formula: current = current + (target - current) * easeFactor
            // 0.08 is the "heaviness" factor. Lower = smoother/slower, Higher = snappier.
            currentY = currentY + (targetY - currentY) * 0.08;

            // Only apply transform if the value is significant (performance optimization)
            if (Math.abs(targetY - currentY) > 0.1 || currentY > 0.1) {
                if (soulNodeRef.current) {
                    soulNodeRef.current.style.transform = `translateY(${currentY}px)`;
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('scroll', handleScroll);
        animate(); // Start the loop

        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section
            ref={frictionSectionRef}
            className="py-24 px-6 border-y border-white/5 relative"
            style={{
                background: 'radial-gradient(circle at 50% -50%, #4b0753, #0e0e18)'
            }}
        >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <h2 className="text-sm uppercase tracking-[0.2em] text-amber-200/60">Why Discipline Breaks</h2>
                    <h3 className="font-serif text-3xl md:text-4xl leading-tight text-white/90">
                        When your spiritual tools are scattered, your practice becomes fragile.
                    </h3>
                    <p className="text-white/60 leading-relaxed font-light">
                        Most seekers rely on disconnected PDFs, journals, YouTube videos, and basic habit apps.
                    </p>
                    <ul className="space-y-4 pt-4">
                        {['Nothing speaks to each other.', 'Nothing guides your depth.', 'Nothing helps you build consistency.'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/80">
                                <div className="w-1.5 h-1.5 bg-red-400/80 rounded-full shadow-[0_0_8px_rgba(248,113,113,0.6)]"></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="text-lg italic font-serif text-white/40 pt-4 border-l-2 border-white/10 pl-6">
                        "A fragmented environment makes a fragmented practice."
                    </p>
                </div>

                {/* Ethereal Scattered Orbit Visualization Container */}
                <div className="relative h-[450px] w-full flex items-center justify-center">

                    {/* The Container for the Orbiting Icons (Overflow Hidden to clip them) */}
                    <div className="absolute inset-0 border border-white/5 bg-white/[0.01] backdrop-blur-[2px] rounded-sm overflow-hidden">
                        {/* Sacred Geometry Background Rings (Broken Mandala) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <div className="w-[300px] h-[300px] border border-white rounded-full animate-spin-slow-reverse border-dashed"></div>
                            <div className="absolute w-[200px] h-[200px] border border-white/50 rounded-full animate-spin-slow"></div>
                            <div className="absolute w-[400px] h-[400px] border border-white/30 rounded-full opacity-20"></div>
                        </div>

                        {/* Animation Styles */}
                        <style>
                            {`
                    @keyframes float-1 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(30px, -50px) rotate(10deg); } 66% { transform: translate(-20px, 20px) rotate(-5deg); } }
                    @keyframes float-2 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(-30px, 40px) rotate(-10deg); } 66% { transform: translate(20px, -30px) rotate(5deg); } }
                    @keyframes float-3 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(40px, 20px) rotate(5deg); } 66% { transform: translate(-30px, -40px) rotate(-5deg); } }
                    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.1); } 50% { box-shadow: 0 0 40px rgba(255,255,255,0.3); } }
                  `}
                        </style>

                        {/* Orbiting Icons - Styled as Glowing Runes/Glyphs */}

                        {/* PDF -> Scroll */}
                        <div className="absolute top-1/4 left-1/4 flex flex-col items-center gap-2 group cursor-default" style={{ animation: 'float-1 14s ease-in-out infinite' }}>
                            <div className="text-white/70 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                                <Scroll strokeWidth={1} className="w-8 h-8" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-light group-hover:text-white/60 transition-colors">Scriptures</span>
                        </div>

                        {/* Video -> Play/Vision */}
                        <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center gap-2 group cursor-default" style={{ animation: 'float-2 16s ease-in-out infinite' }}>
                            <div className="text-red-300/70 drop-shadow-[0_0_10px_rgba(248,113,113,0.3)] transition-all duration-500 group-hover:text-red-200 group-hover:drop-shadow-[0_0_15px_rgba(248,113,113,0.6)]">
                                <Video strokeWidth={1} className="w-8 h-8" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-light group-hover:text-white/60 transition-colors">Content</span>
                        </div>

                        {/* Notes -> Book/Journal */}
                        <div className="absolute top-1/3 right-1/4 flex flex-col items-center gap-2 group cursor-default" style={{ animation: 'float-3 18s ease-in-out infinite' }}>
                            <div className="text-amber-200/70 drop-shadow-[0_0_10px_rgba(253,230,138,0.3)] transition-all duration-500 group-hover:text-amber-100 group-hover:drop-shadow-[0_0_15px_rgba(253,230,138,0.6)]">
                                <Book strokeWidth={1} className="w-7 h-7" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-light group-hover:text-white/60 transition-colors">Journal</span>
                        </div>

                        {/* Clock -> Hourglass */}
                        <div className="absolute bottom-1/4 left-1/3 flex flex-col items-center gap-2 group cursor-default" style={{ animation: 'float-1 20s ease-in-out infinite reverse' }}>
                            <div className="text-indigo-300/70 drop-shadow-[0_0_10px_rgba(165,180,252,0.3)] transition-all duration-500 group-hover:text-indigo-200 group-hover:drop-shadow-[0_0_15px_rgba(165,180,252,0.6)]">
                                <Hourglass strokeWidth={1} className="w-7 h-7" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-light group-hover:text-white/60 transition-colors">Time</span>
                        </div>

                        {/* Ritual/Feather -> Flower/Offering */}
                        <div className="absolute top-20 right-[15%] flex flex-col items-center gap-2 group cursor-default" style={{ animation: 'float-2 15s ease-in-out infinite reverse' }}>
                            <div className="text-emerald-300/70 drop-shadow-[0_0_10px_rgba(110,231,183,0.3)] transition-all duration-500 group-hover:text-emerald-200 group-hover:drop-shadow-[0_0_15px_rgba(110,231,183,0.6)]">
                                <Flower strokeWidth={1} className="w-7 h-7" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-light group-hover:text-white/60 transition-colors">Ritual</span>
                        </div>

                        {/* Subtle label */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-10">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">The Fragmented Self</span>
                        </div>
                    </div>

                    {/* Center Soul Node - OUTSIDE the hidden overflow container so it can move */}
                    <div
                        ref={soulNodeRef}
                        className="relative z-50 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.6)] animate-[pulse-glow_4s_ease-in-out_infinite] will-change-transform"
                    >
                        <div className="w-12 h-12 absolute bg-white/20 rounded-full animate-ping opacity-20"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
