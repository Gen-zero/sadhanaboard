import React from 'react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

const OriginStorySection = () => {
    const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
    return (
        <section ref={sectionRef as React.RefObject<HTMLElement>} className="py-32 px-6 text-center bg-white/[0.02]">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className={`flex justify-center mb-4 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.05s' }}>
                    <img src="/lovable-uploads/OM.png" alt="OM" className="w-12 h-12 opacity-80" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))' }} />
                </div>
                <div className={`w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}></div>
                <h2 className={`text-sm uppercase tracking-[0.3em] text-white/40 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.15s' }}>
                    Authenticity & Trust
                </h2>

                <div className={`font-chakra text-2xl md:text-3xl leading-relaxed animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.25s' }}>
                    Created by practitioners. Designed with discipline.<br />
                    Built by two brothers from a Tantric lineage and a self-taught technical genius devoted to Maa Kali—<br />
                    <span className="text-white/40">not for entertainment, but for committed seekers who value depth.</span>
                </div>

                <p className={`text-white/60 font-light max-w-xl mx-auto animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.35s' }}>
                    Millions now pursue structured spiritual practice, but lack a system designed for discipline and guidance. SadhanaBoard fills that need—quietly, elegantly, and with integrity.
                </p>
            </div>
        </section>
    );
};

export default OriginStorySection;
