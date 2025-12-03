import React from 'react';
import { Palette, Sparkles } from "lucide-react";

const WorkspaceSection = () => {
    const themes = [
        {
            name: "Shiva",
            description: "Deep indigo & ash. For dissolution and focus.",
            color: "from-indigo-900 to-slate-900"
        },
        {
            name: "Devi",
            description: "Crimson & gold. For energy and power.",
            color: "from-red-900 to-orange-900"
        },
        {
            name: "Krishna",
            description: "Peacock blue & forest green. For devotion.",
            color: "from-blue-900 to-emerald-900"
        },
        {
            name: "Surya",
            description: "Radiant orange & yellow. For vitality.",
            color: "from-orange-600 to-yellow-600"
        },
        {
            name: "Bhairava",
            description: "Pitch black & fire. For intensity.",
            color: "from-gray-950 to-red-950"
        }
    ];

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Hero Wallpaper Overlay */}
            <div className="absolute inset-0 bg-[#07050A]/80 pointer-events-none" />

            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-[42px] font-serif leading-tight text-white/90 mb-4">
                        Your Interface, Your Deity
                    </h2>
                    <p className="text-xl text-white/60 font-light">
                        Personalize your sacred space.
                    </p>
                </div>

                <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide">
                    {themes.map((theme, index) => (
                        <div
                            key={index}
                            className="flex-none w-[300px] md:w-[360px] aspect-[2/1] relative rounded-[14px] overflow-hidden group cursor-pointer snap-center card-glass hover:border-[#FFD54A]/50 transition-all duration-500 hover:scale-[1.08] hover:shadow-[0_0_40px_-10px_rgba(253,186,59,0.2)]"
                        >
                            {/* Theme Preview Background (Mock Live Wallpaper) */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />

                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="text-xl font-serif text-white mb-1">
                                    {theme.name}
                                </h3>
                                <p className="text-white/60 text-[13px] mb-4">
                                    {theme.description}
                                </p>

                                {/* Apply Theme CTA */}
                                <button className="w-full py-2 rounded-full bg-[#F59E0B] text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                    Apply Theme
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkspaceSection;
