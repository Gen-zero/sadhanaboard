import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="py-12 px-4 border-t border-white/5 bg-black/90 relative overflow-hidden">
            {/* Soft Yantra Background (Decorative) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none flex items-center justify-center">
                <svg width="800" height="800" viewBox="0 0 100 100" className="animate-spin-slow">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-purple-500" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-purple-500" />
                    <polygon points="50,10 90,80 10,80" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-purple-500" />
                    <polygon points="50,90 90,20 10,20" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-purple-500" />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
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

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5 text-xs text-white/30">
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
