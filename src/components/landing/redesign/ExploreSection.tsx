import React from 'react';
import { Compass, ArrowRight } from "lucide-react";

const ExploreSection = () => {
    const categories = [
        {
            title: "Vedic Rituals",
            count: "12+ Sadhanas",
            image: "https://images.unsplash.com/photo-1605218427368-35b0f996d916?auto=format&fit=crop&q=80"
        },
        {
            title: "Tantric Practices",
            count: "8+ Sadhanas",
            image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&q=80"
        },
        {
            title: "Mantra Japa",
            count: "108+ Mantras",
            image: "https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?auto=format&fit=crop&q=80"
        },
        {
            title: "Kundalini Yoga",
            count: "5+ Kriyas",
            image: "https://images.unsplash.com/photo-1599447421405-0c325d26d77e?auto=format&fit=crop&q=80"
        }
    ];

    return (
        <section className="py-24 px-4 relative overflow-hidden bg-cosmic">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4A0A57] opacity-20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold-glow mb-4">
                            Explore the Library
                        </h2>
                        <p className="text-xl text-white/60 font-sans max-w-xl">
                            Ancient wisdom, structured for modern life.
                        </p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-[#FFD54A] hover:text-white transition-colors font-medium group">
                        View Full Catalog
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="group relative h-[400px] rounded-[14px] overflow-hidden card-glass hover:border-[#FFD54A]/40 transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={category.image}
                                    alt={category.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="inline-block px-3 py-1 rounded-full bg-[#FFD54A]/10 border border-[#FFD54A]/20 text-[#FFD54A] text-xs font-medium mb-3 backdrop-blur-md">
                                    {category.count}
                                </span>
                                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                                    {category.title}
                                </h3>
                                <div className="w-full h-[1px] bg-white/20 group-hover:bg-[#FFD54A]/50 transition-colors duration-500 mb-4" />
                                <div className="flex items-center gap-2 text-white/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <Compass className="w-4 h-4" />
                                    <span>Start Exploring</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="md:hidden w-full mt-8 flex items-center justify-center gap-2 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium">
                    View Full Catalog
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
};

export default ExploreSection;
