import React from 'react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

const TargetAudienceSection = () => {
    const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
    const audiences = [
        {
            label: 'For Seekers',
            color: 'text-amber-200',
            copy: 'A quiet, structured system that helps you show up every day.'
        },
        {
            label: 'For Teachers',
            color: 'text-indigo-200',
            copy: 'Assign sadhanas, track progress, and guide disciples with clarity.'
        },
        {
            label: 'For Organizations',
            color: 'text-emerald-200',
            copy: 'Run disciplined programs and cohorts with transparent metrics.'
        }
    ];

    return (
        <section ref={sectionRef as React.RefObject<HTMLElement>} className="py-24 px-6 border-y border-white/5 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
                <div className={`space-y-6 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
                    <h2 className={`font-source-serif font-medium text-3xl animate-fade-in-up ${isVisible ? 'visible' : ''}`}>
                        Built for individual depth.<br />Designed for collective guidance.
                    </h2>
                    <p className={`text-white/60 font-inter animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.15s' }}>
                        Spirituality is personal. Structure is universal.
                    </p>
                </div>

                <div className="space-y-12">
                    {audiences.map((audience, index) => (
                        <div
                            key={audience.label}
                            className={`animate-fade-in-up ${isVisible ? 'visible' : ''}`}
                            style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
                        >
                            <h3 className={`${audience.color} text-sm font-chakra font-medium uppercase tracking-widest mb-2`}>
                                {audience.label}
                            </h3>
                            <p className="text-white/60 font-inter">{audience.copy}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TargetAudienceSection;
