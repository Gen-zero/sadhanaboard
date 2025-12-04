import React from 'react';
import CosmicLibraryShowcase from '@/components/library/CosmicLibraryShowcase';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

const ExploreSection = () => {
    const { ref: contentRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4A0A57] opacity-20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1300px] mx-auto relative z-10">
                <div ref={contentRef as React.RefObject<HTMLDivElement>} className="mb-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className={`text-3xl md:text-4xl font-serif leading-tight text-white/90 mb-4 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                            Explore the Library
                        </h2>
                        <p className={`text-xl text-white/60 font-light animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
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


