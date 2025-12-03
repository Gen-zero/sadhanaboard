import React from 'react';
import { Check } from "lucide-react";
import TechnoSpiritualPricingCard from './TechnoSpiritualPricingCard';

const PricingSection = () => {
    return (
        <section className="py-24 px-4 relative overflow-hidden bg-cosmic">
            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif leading-tight text-white/90 mb-4">
                        Invest in Your Evolution
                    </h2>
                    <p className="text-xl text-white/60 font-light">
                        Simple pricing. No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Tier */}
                    <TechnoSpiritualPricingCard
                        title="Seeker"
                        price="0"
                        period="Monthly Karma"
                        features={["Basic Sadhana Tracker", "3 Active Vows", "Community Access"]}
                        buttonText="START_FREE"
                        buttonTextColor="#000000"
                        chipColor="#000000"
                        theme={{
                            bg: '#1a1a1a',
                            panel: '#2a2a2a',
                            accent: '#a0a0a0',
                            highlight: '#ffffff',
                            text: '#e0e0e0',
                            glow: 'rgba(255, 255, 255, 0.1)'
                        }}
                    />

                    {/* Pro Tier - Highlighted */}
                    <TechnoSpiritualPricingCard
                        title="Disciple"
                        price="5"
                        period="Monthly Karma"
                        features={["Unlimited Sadhanas", "Advanced Metrics", "Full Library Access", "Priority Support"]}
                        buttonText="INITIATE_PRO"
                        isPopular={true}
                        theme={{
                            bg: '#FFB344',       // Saffron Base
                            panel: '#FFCC80',    // Light Orange Panel
                            accent: '#5C2218',   // Deep Maroon
                            highlight: '#B45309', // Bronze/Gold
                            text: '#4A1C12',     // Dark Brown
                            glow: 'rgba(92, 34, 24, 0.15)'
                        }}
                    />

                    {/* Lifetime Tier */}
                    <TechnoSpiritualPricingCard
                        title="Lifetime"
                        price="10"
                        period="One-Time Karma"
                        features={["Everything in Disciple", "Lifetime Access", "Founder's Badge", "Early Access"]}
                        buttonText="BECOME_FOUNDER"
                        buttonTextColor="#2D1B4E"
                        chipColor="#2D1B4E"
                        theme={{
                            bg: '#2D1B4E',       // Deep Purple Base
                            panel: '#432C7A',    // Lighter Purple Panel
                            accent: '#FFD700',   // Gold Accent
                            highlight: '#FFA500', // Orange Highlight
                            text: '#E6E6FA',     // Lavender Text
                            glow: 'rgba(255, 215, 0, 0.15)'
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
