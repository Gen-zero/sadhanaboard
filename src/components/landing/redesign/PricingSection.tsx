import React, { useState, useEffect } from 'react';
import { Check } from "lucide-react";
import TechnoSpiritualPricingCard from './TechnoSpiritualPricingCard';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

const PricingSection = () => {
    const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const pricingPlans = [
        {
            title: "Seeker",
            price: "0",
            period: "Lifetime Karma",
            features: ["Basic Sadhana Tracker", "3 Active Vows", "Community Access"],
            buttonText: "START_FREE",
            buttonTextColor: "#000000",
            chipColor: "#000000",
            theme: {
                bg: '#1a1a1a',
                panel: '#2a2a2a',
                accent: '#a0a0a0',
                highlight: '#ffffff',
                text: '#e0e0e0',
                glow: 'rgba(255, 255, 255, 0.1)',
                patternColor: '#4a4a4a'
            }
        },
        {
            title: "Disciple",
            price: "5",
            period: "Monthly Karma",
            features: ["Unlimited Sadhanas", "Advanced Metrics", "Full Library Access", "Priority Support"],
            buttonText: "INITIATE_PRO",
            isPopular: true,
            buttonTextColor: "#ffffff",
            chipColor: "#5C0000",
            theme: {
                bg: '#DC143C',
                panel: '#8B0000',
                accent: '#FFD700',
                highlight: '#ffffff',
                text: '#ffffff',
                glow: 'rgba(220, 20, 60, 0.15)',
                patternColor: '#FFE4B3'
            }
        },
        {
            title: "Master",
            price: "10",
            period: "Monthly Karma",
            features: ["Everything in Disciple", "Lifetime Access", "Master's Badge", "Early Access"],
            buttonText: "BECOME_MASTER",
            buttonTextColor: "#2D1B4E",
            chipColor: "#2D1B4E",
            theme: {
                bg: '#2D1B4E',
                panel: '#432C7A',
                accent: '#FFD700',
                highlight: '#FFA500',
                text: '#E6E6FA',
                glow: 'rgba(255, 215, 0, 0.15)',
                patternColor: '#9370DB'
            }
        }
    ];

    // Auto-rotate carousel every 4 seconds
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % pricingPlans.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, pricingPlans.length]);

    const handleDotClick = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds of manual interaction
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <section ref={sectionRef as React.RefObject<HTMLElement>} className="py-24 px-4 relative overflow-hidden bg-cosmic">
            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className={`text-center mb-16`}>
                    <h2 className={`text-3xl md:text-5xl font-chakra font-medium leading-tight text-white/90 mb-4 animate-fade-in-up ${isVisible ? 'visible' : ''}`}>
                        Invest in Your Evolution
                    </h2>
                    <p className={`text-xl text-white/60 font-inter animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                        Simple pricing. No hidden fees. Cancel anytime.
                    </p>
                </div>

                {/* Desktop View: All 3 cards */}
                <div className={`hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-rise-in ${isVisible ? 'visible' : ''}`}>
                    <TechnoSpiritualPricingCard {...pricingPlans[0]} />
                    <TechnoSpiritualPricingCard {...pricingPlans[1]} />
                    <TechnoSpiritualPricingCard {...pricingPlans[2]} />
                </div>

                {/* Mobile/Tablet View: Carousel */}
                <div className="md:hidden relative max-w-md mx-auto">
                    {/* Carousel Container */}
                    <div className="relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="w-full flex justify-center"
                            >
                                <TechnoSpiritualPricingCard {...pricingPlans[currentSlide]} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dot Controls */}
                    <div className="flex justify-center gap-3 mt-8">
                        {pricingPlans.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`transition-all duration-300 rounded-full ${currentSlide === index
                                    ? 'w-10 h-3 bg-[#DC143C] shadow-[0_0_12px_rgba(220,20,60,0.6)]'
                                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to ${pricingPlans[index].title} plan`}
                            />
                        ))}
                    </div>

                    {/* Plan Indicator Text */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-white/60 font-chakra">
                            {currentSlide + 1} / {pricingPlans.length} - {pricingPlans[currentSlide].title}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
