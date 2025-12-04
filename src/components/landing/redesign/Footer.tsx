import React from 'react';
import { Link } from "react-router-dom";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

const Footer = () => {
    const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
    return (
        <footer
            ref={sectionRef as React.RefObject<HTMLElement>}
            className="py-12 px-4 border-t border-white/5 relative overflow-hidden"
            style={{
                background: 'radial-gradient(circle at center -60px, rgba(75, 7, 83, 0.85) 0%, rgba(42, 10, 62, 0.9) 35%, rgba(10, 10, 10, 0.95) 100%)'
            }}
        >
            {/* Mandala background to mirror Solution section */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                    className="w-[800px] h-[800px] opacity-[0.08] animate-spin-slow"
                    style={{
                        backgroundImage: `url("/mandala-pattern.png")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className={`flex flex-col md:flex-row justify-between items-center gap-8 mb-12 animate-rise-in ${isVisible ? 'visible' : ''}`}>
                    {/* Logo / Brand */}
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-2">SadhanaBoard</h3>
                        <p className="text-white/40 text-sm">The Spiritual Operating System</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-white/60">
                        <Link to="/about" className="hover:text-white transition-colors">About</Link>
                        <Link to="/manifesto" className="hover:text-white transition-colors">Manifesto</Link>
                        <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>

                <div className={`flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5 text-xs text-white/30 animate-fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
                    <div className="flex gap-4">
                        <span>© 2024 SadhanaBoard</span>
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>

                    <div className="flex items-center gap-4 font-medium tracking-wide">
                        <span>Structure is devotion.</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Discipline is liberation.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
