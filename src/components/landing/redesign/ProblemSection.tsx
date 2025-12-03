import React from 'react';


const ProblemSection = () => {
    return (
        <section
            className="py-24 px-6 border-y border-white/5"
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

                {/* Abstract Visualization of Chaos vs Order */}
                <div className="relative h-[400px] border border-white/10 bg-[#0a0c10]/50 backdrop-blur-sm rounded-sm p-8 flex items-center justify-center overflow-hidden">
                    {/* Decorative chaotic elements */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-10 w-20 h-24 border border-white/30 rotate-12"></div>
                        <div className="absolute bottom-20 right-20 w-32 h-32 border border-white/20 -rotate-6 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white/40 rotate-45"></div>
                    </div>
                    <div className="z-10 text-center space-y-2">
                        <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto"></div>
                        <span className="block text-xs uppercase tracking-widest text-white/30">Fragmentation</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
