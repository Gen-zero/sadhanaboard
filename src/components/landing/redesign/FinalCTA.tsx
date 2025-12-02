import React from 'react';
import { Sparkles } from "lucide-react";

const FinalCTA = () => {
    return (
        <section className="py-32 px-4 relative overflow-hidden bg-cosmic">
            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-[#FFD54A] opacity-[0.03] blur-[150px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD54A]/10 border border-[#FFD54A]/20 text-[#FFD54A] text-sm font-medium mb-8 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Begin Your Transformation</span>
                </div>

                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
                    Ready to Master <br />
                    <span className="text-gold-glow">Your Spiritual Discipline?</span>
                </h2>

                <p className="text-xl text-white/60 font-sans mb-12 max-w-2xl mx-auto">
                    Join the operating system designed for serious seekers. Structure your practice, track your progress, and ascend.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#F59E0B] text-white font-bold text-lg shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform duration-300">
                        Start Your Free Trial
                    </button>
                    <button className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
                        View Demo
                    </button>
                </div>

                <p className="mt-8 text-white/40 text-sm">
                    No credit card required for 14-day trial.
                </p>
            </div>
        </section>
    );
};

export default FinalCTA;
