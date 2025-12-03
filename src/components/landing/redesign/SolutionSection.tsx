import React from 'react';
import { CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from '@/context/ScrollAnimationContext';

const SolutionSection = () => {
    const { solutionSectionRef, mockupRef, animationStage } = useScrollAnimation();
    const [borderProgress, setBorderProgress] = React.useState(0);
    const requestRef = React.useRef<number>();
    const startTimeRef = React.useRef<number>();
    const progressRef = React.useRef(0);

    // Trigger Border Animation when dot finishes
    React.useEffect(() => {
        const targetProgress = animationStage === 'complete' ? 1 : 0;
        const startProgress = progressRef.current;

        // If we are already at the target, do nothing
        if (startProgress === targetProgress) return;

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const timeElapsed = time - startTimeRef.current;
            const duration = 1000; // 1 second to fill/unfill

            const progressDelta = Math.min(timeElapsed / duration, 1);

            // Interpolate between start and target
            const currentProgress = startProgress + (targetProgress - startProgress) * progressDelta;

            setBorderProgress(currentProgress);
            progressRef.current = currentProgress;

            if (progressDelta < 1) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                startTimeRef.current = undefined;
            }
        };

        // Reset start time for new animation
        startTimeRef.current = undefined;
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [animationStage]);

    return (
        <section
            ref={solutionSectionRef}
            className="py-32 px-4 relative overflow-hidden bg-cosmic"
        >
            {/* Hero Wallpaper Peek-through */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-[0.04] mix-blend-overlay pointer-events-none" />

            <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Column: UI Mockup */}
                <div className="relative group perspective-1000">
                    {/* Orbiting Glyphs */}
                    <div className="absolute inset-0 -m-20 animate-[spin_10s_linear_infinite] pointer-events-none opacity-20">
                        <div className="absolute top-0 left-1/2 w-4 h-4 bg-[#FFD54A] rounded-full blur-[2px]" />
                        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-[#FFD54A] rounded-full blur-[2px]" />
                    </div>

                    <div
                        ref={mockupRef}
                        className="relative z-60 rounded-xl card-glass overflow-hidden transform transition-all duration-1000 hover:scale-[1.02] hover:rotate-y-2 bilateral-border-box"
                        style={{
                            '--scroll-progress': borderProgress,
                            '--border-active': '#FFD700', // Shiny Gold
                            '--border-inactive': 'rgba(255, 255, 255, 0.1)',
                            '--card-bg': 'transparent' // Let card-glass handle bg
                        } as React.CSSProperties}
                    >
                        {/* Mockup Header */}
                        <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            </div>
                        </div>

                        {/* Mockup Content Area */}
                        <div className="w-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                            <img
                                src="/lovable-uploads/dashboard-mockup.png"
                                alt="Sadhana Dashboard Interface"
                                className="w-[96%] h-auto block mx-auto opacity-90 hover:opacity-100 transition-opacity duration-500"
                            />
                            {/* Overlay Gradient for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Copy */}
                <div className="text-left space-y-8">
                    <h3 className="text-3xl md:text-[34px] font-serif leading-tight text-white/90">
                        A Unified System for <br /> Your Spiritual Path
                    </h3>

                    <p className="text-lg text-white/60 leading-relaxed font-light">
                        SadhanaBoard brings clarity, structure, and continuity into one sacred workspace.
                    </p>

                    <div className="flex flex-wrap gap-4 md:gap-6 py-4 text-sm uppercase tracking-widest text-amber-100/70">
                        <span>Intention</span>
                        <span className="text-white/20">•</span>
                        <span>Rituals</span>
                        <span className="text-white/20">•</span>
                        <span>Learning</span>
                        <span className="text-white/20">•</span>
                        <span>Progress</span>
                    </div>

                    <p className="font-serif italic text-xl text-white/80 border-l-2 border-white/10 pl-6">
                        All aligned inside a single, integrated system—<br />
                        quiet, elegant, and built for real discipline.
                    </p>
                </div>
            </div>
            <style>{`
                .bilateral-border-box {
                    position: relative;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .bilateral-border-box::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 10;
                    border-radius: inherit;
                    
                    /* --- CSS VARIABLE LOGIC --- */
                    --prog: calc(var(--scroll-progress, 0) * 300%);
                    --border-width: 3px;

                    /* Stage 1: Top Width (0% to 100%) */
                    --top-w: min(100%, max(0%, var(--prog)));

                    /* Stage 2: Side Height (0% to 100%) - Starts after 100% of prog */
                    --side-h: min(100%, max(0%, var(--prog) - 100%));

                    /* Stage 3: Bottom Width (0% to 51%) - Starts after 200% of prog */
                    --btm-w: min(51%, max(0%, var(--prog) - 200%));

                    /* --- GRADIENTS --- */
                    background-image: 
                        /* 1. Top (Unified) */
                        linear-gradient(to right, var(--border-active), var(--border-active)),
                        /* 2. Right Side */
                        linear-gradient(to bottom, var(--border-active), var(--border-active)),
                        /* 3. Left Side */
                        linear-gradient(to bottom, var(--border-active), var(--border-active)),
                        /* 4. Bottom Right */
                        linear-gradient(to left, var(--border-active), var(--border-active)),
                        /* 5. Bottom Left */
                        linear-gradient(to right, var(--border-active), var(--border-active));

                    background-repeat: no-repeat;
                    
                    /* Positions */
                    background-position: 
                        top center,      /* 1 */
                        top right,       /* 2 */
                        top left,        /* 3 */
                        bottom right,    /* 4 */
                        bottom left;     /* 5 */

                    /* --- SIZES MAPPED TO CALCULATED VARIABLES --- */
                    background-size: 
                        var(--top-w) var(--border-width),    /* 1 */
                        var(--border-width) var(--side-h),   /* 2 */
                        var(--border-width) var(--side-h),   /* 3 */
                        var(--btm-w) var(--border-width),    /* 4 */
                        var(--btm-w) var(--border-width);    /* 5 */
                        
                    transition: background-size 0.1s linear;
                }
            `}</style>
        </section>
    );
};

export default SolutionSection;
