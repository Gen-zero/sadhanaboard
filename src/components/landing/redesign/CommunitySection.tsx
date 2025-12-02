import React from 'react';
import { Users, MessageCircle, Heart } from "lucide-react";

const CommunitySection = () => {
    return (
        <section className="py-24 px-4 relative overflow-hidden bg-cosmic">
            {/* Background Elements */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2A0630] opacity-30 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-gold-glow mb-6 leading-tight">
                            Sangha: The Power of <br /> Collective Discipline
                        </h2>
                        <p className="text-lg text-white/70 font-sans mb-8 leading-relaxed">
                            You are not walking this path alone. Join thousands of serious practitioners holding each other to the highest standard.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: Users, title: "Accountability Cohorts", desc: "Small groups dedicated to specific sadhanas." },
                                { icon: MessageCircle, title: "Guided Discussions", desc: "Deep dives into scripture and practice challenges." },
                                { icon: Heart, title: "Shared Energy", desc: "Feel the collective momentum of the community." }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 rounded-full bg-[#FFD54A]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FFD54A]/20 transition-colors border border-[#FFD54A]/20">
                                        <item.icon className="w-5 h-5 text-[#FFD54A]" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                                        <p className="text-white/60 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Glass Card Stack */}
                        <div className="relative z-10 card-glass rounded-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F0F0F] bg-white/10" />
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-[#0F0F0F] bg-[#FFD54A] flex items-center justify-center text-[#0F0F0F] font-bold text-xs">
                                        +42
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white font-bold">Shiva Sadhana Cohort</p>
                                    <p className="text-[#FFD54A] text-xs">Active Now • 84% Completion Rate</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <p className="text-white/80 text-sm">"The energy of this group kept me going on day 18 when I wanted to quit."</p>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <p className="text-white/80 text-sm">"Finally, a place where people take discipline seriously."</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Backdrop */}
                        <div className="absolute inset-0 bg-[#FFD54A]/5 rounded-2xl transform -rotate-2 scale-105 z-0 blur-sm" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;
