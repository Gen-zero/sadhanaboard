import React, { useState } from 'react';
import { Cpu, Zap, ArrowRight, Hexagon, Wifi, Activity, Check } from 'lucide-react';

interface PricingFeature {
    text: string;
    icon?: React.ReactNode;
}

interface TechnoSpiritualPricingCardProps {
    title: string;
    price: string;
    currency?: string;
    period: string;
    features: string[];
    buttonText?: string;
    isPopular?: boolean;
    buttonTextColor?: string;
    chipColor?: string;
    theme?: {
        bg: string;
        panel: string;
        accent: string;
        highlight: string;
        text: string;
        glow: string;
    };
}

const TechnoSpiritualPricingCard: React.FC<TechnoSpiritualPricingCardProps> = ({
    title,
    price,
    currency = "$",
    period,
    features,
    buttonText = "INITIATE_SADHANA",
    isPopular = false,
    buttonTextColor = '#FFB344',
    chipColor,
    theme = {
        bg: '#FFB344',       // Saffron Base
        panel: '#FFCC80',    // Light Orange Panel
        accent: '#5C2218',   // Deep Maroon (Data lines)
        highlight: '#B45309', // Bronze/Gold (Active elements)
        text: '#4A1C12',     // Dark Brown text
        glow: 'rgba(92, 34, 24, 0.15)', // Maroon glow
    }
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative w-full max-w-[320px] md:max-w-sm mx-auto rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 group shadow-2xl ${isPopular ? 'lg:scale-105 lg:z-10' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ backgroundColor: theme.bg }}
        >
            {/* --- Overlay Pattern: Circuit Mandala --- */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply">
                <SacredCircuitPattern color={theme.accent} />
            </div>

            {/* --- Tech-Border Frame --- */}
            <div className="absolute inset-2 border-[1px] border-dashed opacity-40 pointer-events-none rounded-lg z-20" style={{ borderColor: theme.accent }}></div>

            {/* Corner Accents (Tech style but Maroon) */}
            <CornerBracket position="top-left" color={theme.accent} />
            <CornerBracket position="top-right" color={theme.accent} />
            <CornerBracket position="bottom-left" color={theme.accent} />
            <CornerBracket position="bottom-right" color={theme.accent} />

            {/* --- Content Container --- */}
            <div className="relative z-10 flex flex-col h-full">

                {/* Header HUD */}
                <div className="relative pt-10 pb-6 px-6 text-center overflow-hidden">
                    {/* Background Gradient for Header */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none"></div>

                    {/* Top Digital Motif */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-60">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }}></div>
                        <div className="w-16 h-[1px]" style={{ backgroundColor: theme.accent }}></div>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }}></div>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full border-2 shadow-inner bg-[#FFCC80]" style={{ borderColor: theme.accent }}>
                            <Cpu size={24} color={chipColor ?? theme.accent} strokeWidth={2} />
                        </div>

                        <h2 className="text-xs font-mono font-bold tracking-[0.3em] uppercase mb-1" style={{ color: theme.accent }}>
                            {title}
                        </h2>

                        <div className="flex items-baseline justify-center gap-1 mb-2">
                            <span className="text-xl font-serif font-bold opacity-70" style={{ color: theme.accent }}>{currency}</span>
                            <h1 className="text-6xl font-serif font-bold tracking-tight drop-shadow-sm" style={{ color: theme.accent }}>
                                {price}
                            </h1>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-80" style={{ color: theme.text }}>
                            <Activity size={12} />
                            <span>{period}</span>
                        </div>
                    </div>
                </div>

                {/* Ornamented Tech Divider */}
                <div className="w-full h-8 flex items-center justify-center opacity-90 my-2 px-8">
                    <div className="h-[1px] w-full relative" style={{ backgroundColor: theme.accent, opacity: 0.3 }}>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFB344] px-2">
                            <Hexagon size={16} fill={theme.accent} stroke="none" className="animate-spin-slow" />
                        </div>
                    </div>
                </div>

                {/* Features List */}
                <div className="px-8 py-4 flex-grow">
                    <ul className="space-y-4">
                        {features.map((feature, index) => (
                            <FeatureItem key={index} text={feature} theme={theme} icon={<Check size={14} />} />
                        ))}
                    </ul>
                </div>

                {/* Bottom Action Section */}
                <div className="p-8 mt-2 relative">

                    {/* Action Button */}
                    <button
                        className="w-full relative group overflow-hidden rounded-sm py-4 px-6 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(92,34,24,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(92,34,24,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-3 border-2"
                        style={{
                            backgroundColor: theme.accent,
                            borderColor: theme.accent,
                            color: buttonTextColor
                        }}
                    >
                        <span className="relative z-10 tracking-widest">{buttonText}</span>
                        <ArrowRight className="relative z-10 transition-transform group-hover:translate-x-1" size={16} />

                        {/* Decorative scanline on button */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    </button>

                    {/* Footer Status Line */}
                    <div className="flex justify-between items-center mt-4 text-[9px] font-mono uppercase tracking-wider opacity-70" style={{ color: theme.accent }}>
                        <span>Sys_Ready</span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#5C2218]"></span>
                            Secure Link
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ text, theme, icon }: { text: string, theme: any, icon: React.ReactNode }) => (
    <li className="flex items-center gap-4 group cursor-default">
        <div className="relative shrink-0 flex items-center justify-center w-8 h-8 rounded border transition-all duration-300 group-hover:rotate-45"
            style={{ borderColor: theme.accent, backgroundColor: 'rgba(92, 34, 24, 0.05)' }}>
            <div className="group-hover:-rotate-45 transition-transform duration-300" style={{ color: theme.accent }}>
                {icon}
            </div>
        </div>
        <span className="text-sm font-serif font-medium tracking-wide transition-colors" style={{ color: theme.text }}>
            {text}
        </span>
    </li>
);

const CornerBracket = ({ position, color }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', color: string }) => {
    const style: React.CSSProperties = {
        borderColor: color,
        width: '24px',
        height: '24px',
        position: 'absolute',
        zIndex: 20,
        transition: 'all 0.3s ease',
    };

    const props = {
        'top-left': { top: '8px', left: '8px', borderTopWidth: '2px', borderLeftWidth: '2px' },
        'top-right': { top: '8px', right: '8px', borderTopWidth: '2px', borderRightWidth: '2px' },
        'bottom-left': { bottom: '8px', left: '8px', borderBottomWidth: '2px', borderLeftWidth: '2px' },
        'bottom-right': { bottom: '8px', right: '8px', borderBottomWidth: '2px', borderRightWidth: '2px' },
    };

    return <div style={{ ...style, ...props[position] }} className="opacity-60" />;
};

// --- Custom Techno-Spiritual SVGs ---

const SacredCircuitPattern = ({ color }: { color: string }) => (
    <svg width="100%" height="100%">
        <defs>
            <pattern id="sacred-circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                {/* Circuit Lines forming a geometric flower */}
                <path d="M30 0 L30 10 M30 50 L30 60 M0 30 L10 30 M50 30 L60 30" stroke={color} strokeWidth="1" />
                <rect x="25" y="25" width="10" height="10" transform="rotate(45 30 30)" fill="none" stroke={color} strokeWidth="1" />
                <circle cx="30" cy="30" r="2" fill={color} />

                {/* Connecting dots */}
                <circle cx="30" cy="10" r="1.5" fill={color} opacity="0.5" />
                <circle cx="30" cy="50" r="1.5" fill={color} opacity="0.5" />
                <circle cx="10" cy="30" r="1.5" fill={color} opacity="0.5" />
                <circle cx="50" cy="30" r="1.5" fill={color} opacity="0.5" />

                {/* Diagonal Lines */}
                <path d="M10 10 L20 20" stroke={color} strokeWidth="0.5" opacity="0.4" />
                <path d="M50 10 L40 20" stroke={color} strokeWidth="0.5" opacity="0.4" />
                <path d="M10 50 L20 40" stroke={color} strokeWidth="0.5" opacity="0.4" />
                <path d="M50 50 L40 40" stroke={color} strokeWidth="0.5" opacity="0.4" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sacred-circuit)" />
    </svg>
);

const ShieldLotus = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0v-2a3 3 0 0 0-3-3" opacity="0.5" />
    </svg>
);

export default TechnoSpiritualPricingCard;
