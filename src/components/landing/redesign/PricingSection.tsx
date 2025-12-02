import React from 'react';
import { Check } from "lucide-react";

const PricingSection = () => {
    return (
        <section className="py-24 px-4 relative overflow-hidden bg-cosmic">
            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gold-glow mb-4">
                        Invest in Your Evolution
                    </h2>
                    <p className="text-xl text-white/60 font-sans">
                        Simple pricing. No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Tier */}
                    <div className="relative p-8 rounded-2xl card-glass border-white/5 hover:border-white/10 transition-all">
                        <h3 className="text-xl font-bold text-white mb-2">Seeker</h3>
                        <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-white/40 font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-8">
                            {["Basic Sadhana Tracker", "3 Active Vows", "Community Access"].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                                    <Check className="w-4 h-4 text-white/40" /> {feat}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">
                            Start Free
                        </button>
                    </div>

                    {/* Pro Tier - Highlighted */}
                    <div className="relative p-8 rounded-2xl card-glass border-[#FFD54A]/30 shadow-[0_0_40px_-10px_rgba(253,186,59,0.15)] transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-[#FFD54A] text-[#0F0F0F] text-xs font-bold uppercase tracking-wide">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Disciple</h3>
                        <div className="text-4xl font-bold text-[#FFD54A] mb-6">$12<span className="text-lg text-white/40 font-normal">/mo</span></div>
                        <ul className="space-y-4 mb-8">
                            {["Unlimited Sadhanas", "Advanced Metrics & Insights", "Full Library Access", "Priority Support"].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/90 text-sm">
                                    <Check className="w-4 h-4 text-[#FFD54A]" /> {feat}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-full bg-[#F59E0B] text-white font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform">
                            Get Started
                        </button>
                    </div>

                    {/* Lifetime Tier */}
                    <div className="relative p-8 rounded-2xl card-glass border-white/5 hover:border-white/10 transition-all">
                        <h3 className="text-xl font-bold text-white mb-2">Lifetime</h3>
                        <div className="text-4xl font-bold text-white mb-6">$299<span className="text-lg text-white/40 font-normal">/once</span></div>
                        <ul className="space-y-4 mb-8">
                            {["Everything in Disciple", "Lifetime Access", "Founder's Badge", "Early Access to Features"].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                                    <Check className="w-4 h-4 text-white/40" /> {feat}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors font-medium">
                            Become a Founder
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
