import React from 'react';
import CosmicLibraryShowcase from '@/components/library/CosmicLibraryShowcase';

const ExploreSection = () => {
    return (
        <section className="py-24 px-4 relative overflow-hidden bg-cosmic">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4A0A57] opacity-20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif leading-tight text-white/90 mb-4">
                            Explore the Library
                        </h2>
                        <p className="text-xl text-white/60 font-light max-w-xl">
                            Ancient wisdom, structured for modern life.
                        </p>
                    </div>
                </div>

                <CosmicLibraryShowcase />
            </div>
        </section>
    );
};

export default ExploreSection;


