import React from 'react';
import { BarChart3, ListTodo, Library, TrendingUp, Users } from "lucide-react";

const FeaturesSection = () => {
    const features = [
        {
            icon: BarChart3,
            title: "Progress Dashboard",
            description: "Your streaks, mantra counts, reading minutes, vow integrity — all visible at a glance."
        },
        {
            icon: ListTodo,
            title: "Sadhana To-Do",
            description: "Your daily ritual automatically generated and checked off as you complete it."
        },
        {
            icon: Library,
            title: "Sacred Library",
            description: "Curated sadhanas, authentic scriptures, guided rituals — verified and structured."
        },
        {
            icon: TrendingUp,
            title: "Sankalpa Metrics",
            description: "Earn XP, Karma Points, and Depth Index™ for true vow completion."
        },
        {
            icon: Users,
            title: "Guru Tools",
            description: "Assign cards, monitor cohorts, track disciples — all from a single dashboard."
        },
        {
            icon: Users,
            title: "Cohort Experience",
            description: "Join a group of serious practitioners and keep each other accountable."
        }
    ];

    return (
        <section className="py-24 px-4 relative overflow-hidden bg-cosmic">
            {/* Tiled Yantra Pattern Background - Faint */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23FFD54A' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='10' fill='none' stroke='%23FFD54A' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif leading-tight text-white/90 mb-4">
                        Everything You Need for Serious Practice
                    </h2>
                    <p className="text-xl text-white/60 font-light">
                        All in one clean, powerful interface.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="relative p-8 rounded-[14px] card-glass hover:border-[#FFD54A]/30 transition-all duration-500 group hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(245,158,11,0.1)] overflow-hidden"
                        >
                            {/* Hover Micro Animation Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD54A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="w-14 h-14 rounded-full border border-[#FFD54A]/20 flex items-center justify-center mb-6 group-hover:border-[#FFD54A]/40 transition-colors relative z-10 bg-[#0F0F0F]/50 backdrop-blur-sm">
                                <feature.icon className="w-6 h-6 text-[#FFD54A]/80 group-hover:text-[#FFD54A] transition-colors" strokeWidth={1.5} />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-lg text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-white/70 text-[13px] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
