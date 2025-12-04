import React, { useState, useEffect, useRef } from 'react';
import { Scroll, Video, Book, Hourglass, Flower } from 'lucide-react';
import { useScrollAnimation } from '@/context/ScrollAnimationContext';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';


const ProblemSection = () => {
    const {
        problemSectionRef,
        solutionSectionRef,
        mockupRef,
        dotRef,
        animationStage,
        setAnimationStage
    } = useScrollAnimation();

    const { ref: contentRef, isVisible } = useScrollTrigger({ threshold: 0.2 });

    // Animation State Refs - Moved to top level
    const stateRef = useRef({
        isTriggered: false,
        startTime: 0,
        startPos: { x: 0, y: 0 },
        targetPos: { x: 0, y: 0 },
        duration: 1500, // 1.5 seconds for the transition
        currentX: 0,
        currentY: 0
    });

    // Optimized Physics-based Animation Loop for Section 2 & 3
    useEffect(() => {
        let animationFrameId: number;

        // Easing function: easeInOutCubic
        const easeInOutCubic = (t: number): number => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const handleScroll = () => {
            if (!problemSectionRef.current || !solutionSectionRef.current || !mockupRef.current) return;

            const problemRect = problemSectionRef.current.getBoundingClientRect();
            const mockupRect = mockupRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
            const problemBottom = problemRect.bottom;

            // Trigger Condition: Scrolled past the problem section
            if (problemBottom <= windowHeight * 0.8) {
                if (!stateRef.current.isTriggered) {
                    // TRIGGER FORWARD ANIMATION
                    stateRef.current.isTriggered = true;
                    stateRef.current.startTime = performance.now();
                    stateRef.current.duration = 2500; // Increased duration for 3 steps

                    // Capture Start Position (current position relative to initial center)
                    stateRef.current.startPos = {
                        x: stateRef.current.currentX,
                        y: stateRef.current.currentY
                    };

                    // Calculate Waypoints
                    const problemCenterY = problemRect.top + (problemRect.height / 2);
                    const currentDotViewportY = problemCenterY + stateRef.current.currentY;
                    const currentDotViewportX = (windowWidth / 2) + stateRef.current.currentX;
                    const borderOffsetY = (problemRect.height / 2) - 40; // 40px padding from bottom

                    const mockupCenterX = mockupRect.left + (mockupRect.width / 2);
                    const mockupCenterY = mockupRect.top + (mockupRect.height / 2);

                    // Mobile Check (< 1024px)
                    const isMobile = windowWidth < 1024;

                    // Calculate Deltas
                    // Ensure the dot always tucks behind the mockup by targeting an inner point within the card
                    const insetRatio = isMobile ? 0.45 : 0.2;
                    const minInset = Math.min(mockupRect.width * 0.25, 96);
                    const maxInset = Math.max(minInset, mockupRect.width - 32);
                    const responsiveInset = Math.min(
                        Math.max(mockupRect.width * insetRatio, minInset),
                        maxInset
                    );
                    const targetViewportX = mockupRect.right - responsiveInset;
                    const deltaX = targetViewportX - currentDotViewportX;

                    // Vertical targeting with clamped margins so the dot stays within the mockup
                    const verticalRatio = isMobile ? 0.35 : 0.5;
                    const verticalMargin = Math.min(Math.max(mockupRect.height * 0.15, 40), Math.min(mockupRect.height * 0.3, 140));
                    const clampedYOffset = Math.min(
                        Math.max(mockupRect.height * verticalRatio, verticalMargin),
                        Math.max(verticalMargin, mockupRect.height - verticalMargin)
                    );
                    const targetViewportY = mockupRect.top + clampedYOffset;
                    const deltaY = targetViewportY - currentDotViewportY;

                    // Waypoint 1: BorderPos (Drop vertically to bottom of section)
                    const borderPos = {
                        x: stateRef.current.currentX,
                        y: borderOffsetY
                    };

                    // Waypoint 2: CornerPos (Slide horizontally to Mockup X - 150 at Border Y)
                    const cornerPos = {
                        x: stateRef.current.currentX + deltaX,
                        y: borderOffsetY
                    };

                    // Waypoint 3: EndPos (Drop vertically to Mockup Y)
                    const endPos = {
                        x: stateRef.current.currentX + deltaX,
                        y: stateRef.current.currentY + deltaY
                    };

                    // Store waypoints
                    (stateRef.current as any).borderPos = borderPos;
                    (stateRef.current as any).cornerPos = cornerPos;
                    (stateRef.current as any).endPos = endPos;
                    (stateRef.current as any).reverse = false;

                    setAnimationStage('transition');

                    // Start Animation Loop if not running
                    if (!animationFrameId) animationFrameId = requestAnimationFrame(animate);

                }
            } else {
                // RETURN ANIMATION (Reverse)
                if (stateRef.current.isTriggered) {
                    stateRef.current.isTriggered = false;
                    stateRef.current.startTime = performance.now();
                    stateRef.current.duration = 1500; // Faster return

                    // Set reverse flag
                    (stateRef.current as any).reverse = true;

                    // Capture current position as start for reverse
                    stateRef.current.startPos = {
                        x: stateRef.current.currentX,
                        y: stateRef.current.currentY
                    };

                    // Target is 0,0 (relative to initial center)
                    (stateRef.current as any).endPos = { x: 0, y: 0 };

                    setAnimationStage('transition');
                }

                // Normal Scroll Physics for Stage 1 (when not triggered and fully returned)
                if (!stateRef.current.isTriggered && !(stateRef.current as any).reverse) {
                    const problemCenterY = problemRect.top + (problemRect.height / 2);
                    const screenCenterY = windowHeight / 2;
                    const distFromProblemCenter = screenCenterY - problemCenterY;

                    setAnimationStage('problem');
                    if (distFromProblemCenter > 0) {
                        const maxDrop = 800;
                        stateRef.current.targetPos.y = Math.min(distFromProblemCenter * 1.2, maxDrop);
                    } else {
                        stateRef.current.targetPos.y = 0;
                    }
                    stateRef.current.targetPos.x = 0;
                }
            }
        };

        const animate = (timestamp: number) => {
            const isReverse = (stateRef.current as any).reverse;

            if (stateRef.current.isTriggered || isReverse) {
                // Time-based Animation (Stage 2 & 3)
                const elapsed = timestamp - stateRef.current.startTime;
                const totalDuration = stateRef.current.duration;
                const progress = Math.min(elapsed / totalDuration, 1);

                if (isReverse) {
                    // Reverse Animation: Simple ease back to 0,0
                    const ease = easeInOutCubic(progress);
                    const start = stateRef.current.startPos;
                    const end = (stateRef.current as any).endPos; // 0,0

                    stateRef.current.currentX = start.x + (end.x - start.x) * ease;
                    stateRef.current.currentY = start.y + (end.y - start.y) * ease;

                    if (progress >= 1) {
                        (stateRef.current as any).reverse = false;
                        setAnimationStage('problem');
                    }
                } else {
                    // Forward Animation (3 Phases)
                    // Split animation into 3 phases: 
                    // 1. Drop to Border (0% - 20%)
                    // 2. Slide Horizontal (20% - 60%)
                    // 3. Drop to Target (60% - 100%)

                    const borderPos = (stateRef.current as any).borderPos;
                    const cornerPos = (stateRef.current as any).cornerPos;
                    const endPos = (stateRef.current as any).endPos;
                    const startPos = stateRef.current.startPos;

                    if (progress < 0.2) {
                        // Phase 1: Drop to Border
                        const phaseProgress = easeInOutCubic(progress / 0.2);
                        stateRef.current.currentX = startPos.x + (borderPos.x - startPos.x) * phaseProgress;
                        stateRef.current.currentY = startPos.y + (borderPos.y - startPos.y) * phaseProgress;

                    } else if (progress < 0.6) {
                        // Phase 2: Slide Horizontal
                        const phaseProgress = easeInOutCubic((progress - 0.2) / 0.4);
                        stateRef.current.currentX = borderPos.x + (cornerPos.x - borderPos.x) * phaseProgress;
                        stateRef.current.currentY = borderPos.y + (cornerPos.y - borderPos.y) * phaseProgress;

                    } else {
                        // Phase 3: Drop to Target
                        const phaseProgress = easeInOutCubic((progress - 0.6) / 0.4);
                        stateRef.current.currentX = cornerPos.x + (endPos.x - cornerPos.x) * phaseProgress;
                        stateRef.current.currentY = cornerPos.y + (endPos.y - cornerPos.y) * phaseProgress;
                    }

                    // Update Stage based on progress
                    if (progress > 0.95 && animationStage !== 'complete') {
                        setAnimationStage('complete');
                    } else if (progress > 0.6 && animationStage !== 'solution' && animationStage !== 'complete') {
                        setAnimationStage('solution');
                    }
                }

            } else {
                // Scroll-based Physics (Stage 1)
                stateRef.current.currentX += (stateRef.current.targetPos.x - stateRef.current.currentX) * 0.1;
                stateRef.current.currentY += (stateRef.current.targetPos.y - stateRef.current.currentY) * 0.1;
            }

            // Apply Transform
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${stateRef.current.currentX}px, ${stateRef.current.currentY}px)`;

                // Color Styles
                if (animationStage === 'problem') {
                    dotRef.current.style.backgroundColor = 'rgba(245, 158, 11, 0.6)';
                    dotRef.current.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.4)';
                    dotRef.current.style.zIndex = '50';
                } else if (animationStage === 'transition') {
                    dotRef.current.style.backgroundColor = 'rgba(6, 182, 212, 0.8)';
                    dotRef.current.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.6)';
                    dotRef.current.style.zIndex = '50';
                } else if (animationStage === 'solution') {
                    // Transition to Gold
                    dotRef.current.style.backgroundColor = '#FFD700'; // Shiny Gold
                    dotRef.current.style.boxShadow = '0 0 50px rgba(255, 215, 0, 0.8)';
                    dotRef.current.style.zIndex = '5';
                } else if (animationStage === 'complete') {
                    dotRef.current.style.backgroundColor = '#FFD700';
                    dotRef.current.style.boxShadow = '0 0 60px rgba(255, 215, 0, 1)';
                    dotRef.current.style.zIndex = '5';
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [animationStage, setAnimationStage, problemSectionRef, solutionSectionRef, mockupRef, dotRef]);

    return (
        <section
            ref={problemSectionRef}
            className="py-24 px-6 relative"
        >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div ref={contentRef as React.RefObject<HTMLDivElement>} className="space-y-8">
                    <h2 className={`text-sm uppercase tracking-[0.2em] text-amber-200/60 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>Why Discipline Breaks</h2>
                    <h3 className={`font-serif text-3xl md:text-4xl leading-tight text-white/90 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                        When your spiritual tools are scattered, your practice becomes fragile.
                    </h3>
                    <p className={`text-white/60 leading-relaxed font-light animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
                        Most seekers rely on disconnected PDFs, journals, YouTube videos, and basic habit apps.
                    </p>
                    <ul className="space-y-4 pt-4">
                        {['Nothing speaks to each other.', 'Nothing guides your depth.', 'Nothing helps you build consistency.'].map((item, i) => (
                            <li key={i} className={`flex items-center gap-3 text-white/80 animate-slide-in-left ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: `${0.4 + i * 0.1}s` }}>
                                <div className="w-1.5 h-1.5 bg-red-400/80 rounded-full shadow-[0_0_8px_rgba(248,113,113,0.6)]"></div>
                                <div className="font-light">{item}</div>
                            </li>
                        ))}
                    </ul>
                    <p className={`text-lg italic font-serif text-white/40 pt-4 border-l-2 border-white/10 pl-6 animate-fade-in ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.7s' }}>
                        "A fragmented environment makes a fragmented practice."
                    </p>
                </div>

                {/* Ethereal Scattered Orbit Visualization Container */}
                <div className="relative h-[450px] w-full flex items-center justify-center">

                    {/* The Container for the Orbiting Icons (Overflow Hidden to clip them) */}
                    <div className="absolute inset-0 border border-white/[0.08] bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
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
                        ref={dotRef}
                        className="relative z-50 w-12 h-12 rounded-full bg-amber-500/60 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-[pulse-glow_4s_ease-in-out_infinite] will-change-transform transition-colors duration-1000"
                    >
                        <div className="w-12 h-12 absolute bg-white/20 rounded-full animate-ping opacity-20"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
