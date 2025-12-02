import React from 'react';
import { FileText, CalendarOff, UserX } from "lucide-react";

const ProblemSection = () => {
    const problems = [
        {
            icon: FileText,
            title: "Fragmented Tools",
            description: "PDFs here. Journals there. YouTube somewhere else. Nothing in one place."
        },
        {
            icon: CalendarOff,
            title: "Meaningless Streaks",
            description: "Habit apps track \"days shown up.\" They don't track vow integrity."
        },
        {
            icon: UserX,
            title: "No Real Accountability",
            description: "You practice alone — without guidance, feedback, or structure."
        }
    ];

    return (
        <section className="py-24 px-4 relative overflow-hidden bg-cosmic">
            {/* Hero Wallpaper Overlay - Faint */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-[0.03] mix-blend-overlay pointer-events-none" />

            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold-glow mb-4 tracking-wide">
                        Why Most Seekers Break Discipline
                    </h2>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#FFD54A]/50 to-transparent mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {problems.map((item, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-[14px] card-glass hover:border-[#FFD54A]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(253,186,59,0.15)] relative overflow-hidden"
                            style={{ animationDelay: `${index * 0.12}s` }}
                        >
                            {/* Floating Particle Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(253,186,59,0.08),transparent_70%)]" />

                            <div className="w-8 h-8 mb-6 relative">
                                <div className="absolute inset-0 bg-[#FFD54A]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <item.icon className="w-full h-full text-[#FFD54A] relative z-10" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-xl font-semibold text-white/95 mb-3 font-sans tracking-tight">
                                {item.title}
                            </h4>
                            <p className="text-white/70 text-[15px] leading-relaxed font-sans">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
