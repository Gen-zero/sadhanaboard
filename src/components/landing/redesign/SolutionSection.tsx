import React from 'react';
import { CheckCircle2 } from "lucide-react";

const SolutionSection = () => {
    return (
        <section className="py-32 px-4 relative overflow-hidden bg-cosmic">
            {/* Hero Wallpaper Peek-through */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-[0.04] mix-blend-overlay pointer-events-none" />

            {/* Yantra Wireframe Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.08] pointer-events-none animate-[spin_120s_linear_infinite]"
                style={{
                    backgroundImage: `url("/mandala-pattern.png")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
            />

            <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Column: UI Mockup */}
                <div className="relative group perspective-1000">
                    {/* Orbiting Glyphs */}
                    <div className="absolute inset-0 -m-20 animate-[spin_10s_linear_infinite] pointer-events-none opacity-20">
                        <div className="absolute top-0 left-1/2 w-4 h-4 bg-[#FFD54A] rounded-full blur-[2px]" />
                        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-[#FFD54A] rounded-full blur-[2px]" />
                    </div>

                    <div className="relative rounded-xl card-glass overflow-hidden transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-y-2">
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
                                className="w-full h-auto block opacity-90 hover:opacity-100 transition-opacity duration-500"
                            />
                            {/* Overlay Gradient for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Copy */}
                <div className="text-left">
                    <h3 className="text-3xl md:text-[34px] font-serif font-bold text-gold-glow mb-6 leading-tight">
                        The OS Built for <br /> Spiritual Practice
                    </h3>

                    <p className="text-lg text-white/88 mb-8 leading-relaxed font-sans">
                        Structure is devotion. Discipline is liberation. <br />
                        SadhanaBoard brings your entire spiritual workflow into one clean, disciplined system.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-3 rounded-full bg-[#F59E0B] text-white font-semibold shadow-[0_10px_30px_rgba(245,158,11,0.25)] hover:scale-105 hover:shadow-[0_10px_40px_rgba(245,158,11,0.4)] transition-all duration-300">
                            Start Your Journey
                        </button>
                        <button className="px-8 py-3 rounded-full bg-[#6F5D80]/20 border border-white/10 text-white/90 backdrop-blur-sm hover:bg-[#6F5D80]/40 transition-colors duration-300">
                            Explore Features
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SolutionSection;
