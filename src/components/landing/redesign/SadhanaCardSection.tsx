import React from 'react';
import { ArrowRight, CheckSquare, BookOpen, Flame, ScrollText } from "lucide-react";

const SadhanaCardSection = () => {
    const steps = [
        {
            step: "Step 1",
            title: "Set Your Intention",
            description: "Choose your deity, define your vow (21, 40, or 108 days), set rules.",
            icon: Flame
        },
        {
            step: "Step 2",
            title: "Auto-Generated Daily Plan",
            description: "Your card creates your checklist: Mantra count, Study quota, Ritual sequence.",
            icon: ScrollText
        },
        {
            step: "Step 3",
            title: "Practice & Track",
            description: "Complete your daily card and watch your progress metrics grow.",
            icon: CheckSquare
        }
    ];

    return (
        <section className="py-24 px-4 relative overflow-hidden bg-cosmic">
            {/* Hero Wallpaper Overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-[0.03] mix-blend-overlay pointer-events-none" />

            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-[42px] font-serif leading-tight text-white/90 mb-4">
                        The Sadhana Card
                    </h2>
                    <p className="text-xl text-white/60 font-light">
                        Your entire practice, intelligently organized.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-[#FFD54A]/30 to-transparent" />

                    {steps.map((item, index) => (
                        <div key={index} className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                            {/* Step Number Badge */}
                            <div className="w-24 h-24 mx-auto bg-[#0F0F0F] border border-[#FFD54A]/30 rounded-full flex items-center justify-center mb-8 relative z-10 group-hover:border-[#FFD54A] group-hover:shadow-[0_0_20px_rgba(253,186,59,0.3)] transition-all duration-500">
                                <span className="text-3xl font-serif font-bold text-[#FFD54A]">{index + 1}</span>
                                {/* Micro Yantra Node */}
                                <div className="absolute -inset-2 border border-[#FFD54A]/10 rounded-full scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
                            </div>

                            <div className="flex flex-col md:flex-row overflow-hidden rounded-[14px] card-glass hover:border-[#FFD54A]/20 transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                                {/* Mini UI Preview (Left Half) */}
                                <div className="w-full md:w-1/2 h-48 md:h-auto bg-black/40 border-r border-white/5 relative overflow-hidden group-hover:bg-black/50 transition-colors">
                                    <div className="absolute inset-4 bg-white/5 rounded-lg border border-white/5 flex flex-col gap-2 p-2">
                                        <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                                        <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                                        <div className="mt-auto flex gap-2">
                                            <div className="w-4 h-4 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/40" />
                                            <div className="h-4 flex-1 bg-white/5 rounded" />
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content (Right Half) */}
                                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center text-left">
                                    <h3 className="text-lg text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-white/75 text-sm leading-relaxed mb-4">
                                        {item.description}
                                    </p>
                                    {/* Progress Bar Visual Cue */}
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#F59E0B] w-[0%] group-hover:w-[75%] transition-all duration-1000 ease-out" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-lg text-white/80 font-medium">
                        This is discipline turned into a system — not a guessing game.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SadhanaCardSection;
