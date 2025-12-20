import React from 'react';
import { Link } from "react-router-dom";
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

const Footer = () => {
    const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
    return (
        <footer
            ref={sectionRef as React.RefObject<HTMLElement>}
            className="py-12 px-4 border-t border-white/5 relative overflow-hidden"
            style={{
                background: 'radial-gradient(circle at center -60px, rgba(92, 0, 0, 0.85) 0%, rgba(58, 0, 0, 0.9) 35%, rgba(10, 10, 10, 0.95) 100%)'
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
                <div className={`flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12 animate-rise-in ${isVisible ? 'visible' : ''}`}>
                    {/* Logo Group with OS Line */}
                    <div className="flex flex-col items-center md:items-start">
                        <Link to="/" className="flex items-center space-x-3 group/logo mb-4">
                            <div className="relative">
                                <ResponsiveImage
                                    src="/lovable-uploads/sadhanaboard_logo.png"
                                    alt="SadhanaBoard Logo"
                                    className="h-10 w-10 md:h-12 md:w-12 rounded-full cursor-pointer scale-110 shadow-lg shadow-purple-500/20 transition-transform duration-300 group-hover/logo:scale-125 relative z-10"
                                    quality="high"
                                    lazy={false}
                                    style={{
                                        filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.2))'
                                    }}
                                />
                                {/* Enhanced glowing aura around the logo */}
                                <div className="absolute inset-0 rounded-full animate-pulse z-0"
                                    style={{
                                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 60%, transparent 70%)',
                                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                    }}
                                />
                                {/* Constant glowing ring around logo with animation */}
                                <div
                                    className="absolute inset-0 rounded-full animate-spin-slow"
                                    style={{
                                        background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.2), rgba(138, 43, 226, 0.2), rgba(255, 215, 0, 0.2))',
                                        padding: '2px'
                                    }}
                                >
                                    <div className="w-full h-full rounded-full bg-background/30" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl font-bold text-yellow-300 transition-all duration-300 group-hover/logo:text-yellow-200 font-chakra">
                                    SadhanaBoard
                                </span>
                                <span className="text-xs text-yellow-400/80 font-chakra font-medium tracking-wider uppercase transition-all duration-300 group-hover/logo:text-yellow-300">
                                    ✨ Your Digital Yantra
                                </span>
                            </div>
                        </Link>

                        {/* Spiritual OS Tagline - Below Logo */}
                        <p className="text-sm text-white/50 font-chakra font-medium tracking-wide uppercase">The Spiritual Operating System</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-white/60 font-inter">
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

                    <div className="flex items-center gap-4 font-chakra font-medium tracking-wide uppercase">
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
