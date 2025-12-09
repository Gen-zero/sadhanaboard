import React, { useState } from 'react';
import { Hexagon, ArrowRight } from 'lucide-react';

interface TechnoSpiritualFeatureCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    isComingSoon?: boolean;
    forcedHover?: boolean;
    theme?: {
        bg: string;
        panel: string;
        accent: string;
        highlight: string;
        text: string;
        glow: string;
    };
}

// Join Waitlist Button Gradient Theme for hover (amber-600 via yellow-500 to amber-500)
const saffronHoverTheme = {
    bg: '#d97706',      // amber-600
    panel: '#eab308',   // yellow-500
    accent: '#5C2218',
    highlight: '#4A1C12',
    text: '#5C2218',
    glow: 'rgba(217, 119, 6, 0.4)',  // amber-600 glow
};

const TechnoSpiritualFeatureCard: React.FC<TechnoSpiritualFeatureCardProps> = ({
    title,
    description,
    icon: Icon,
    isComingSoon = false,
    forcedHover,
    theme = {
        bg: '#1a1a1a',       // Dark Base
        panel: '#2a2a2a',    // Dark Panel
        accent: '#FFD54A',   // Amber Accent
        highlight: '#ffffff', // White Highlight
        text: '#e0e0e0',     // Light Text
        glow: 'rgba(255, 213, 74, 0.15)', // Amber Glow
    }
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Use saffron theme on hover
    const computedHover = forcedHover ?? isHovered;
    const activeTheme = computedHover ? saffronHoverTheme : theme;

    const handleMouseEnter = () => {
        if (forcedHover !== undefined) return;
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (forcedHover !== undefined) return;
        setIsHovered(false);
    };

    return (
        <div
            className="relative w-full h-full rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 group shadow-xl hover:shadow-2xl flex flex-col"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                backgroundColor: activeTheme.bg,
                boxShadow: computedHover ? `0 0 40px -10px ${saffronHoverTheme.glow}` : undefined
            }}
        >
            {/* --- Overlay Pattern: Circuit Mandala --- */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-500"
                style={{ opacity: computedHover ? 0.2 : 0.1 }}
            >
                <SacredCircuitPattern color={activeTheme.accent} />
            </div>

            {/* --- Tech-Border Frame --- */}
            <div
                className="absolute inset-2 border-[1px] border-dashed pointer-events-none rounded-lg z-20 transition-all duration-500"
                style={{
                    borderColor: activeTheme.accent,
                    opacity: computedHover ? 0 : 0.3
                }}
            />

            {/* Corner Accents */}
            <CornerBracket position="top-left" color={activeTheme.accent} isHovered={computedHover} />
            <CornerBracket position="top-right" color={activeTheme.accent} isHovered={computedHover} />
            <CornerBracket position="bottom-left" color={activeTheme.accent} isHovered={computedHover} />
            <CornerBracket position="bottom-right" color={activeTheme.accent} isHovered={computedHover} />

            {/* --- Content Container --- */}
            <div className="relative z-10 flex flex-col h-full p-8">

                {/* Header: Icon & Title */}
                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded border transition-all duration-500 group-hover:rotate-45 backdrop-blur-sm"
                        style={{
                            borderColor: activeTheme.accent,
                            backgroundColor: computedHover ? activeTheme.accent : 'rgba(0,0,0,0.2)'
                        }}
                    >
                        <div
                            className="group-hover:-rotate-45 transition-all duration-500"
                            style={{ color: computedHover ? activeTheme.bg : activeTheme.accent }}
                        >
                            <Icon size={24} strokeWidth={1.5} />
                        </div>
                    </div>

                    <h3
                        className="text-lg font-serif font-bold tracking-wide leading-tight transition-colors duration-500"
                        style={{ color: activeTheme.highlight }}
                    >
                        {title}
                    </h3>
                </div>

                {/* Ornamented Tech Divider */}
                <div
                    className="w-full h-px relative mb-6 transition-opacity duration-500"
                    style={{ backgroundColor: activeTheme.accent, opacity: computedHover ? 0.6 : 0.4 }}
                >
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors duration-500"
                        style={{ backgroundColor: activeTheme.accent }}
                    />
                    <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors duration-500"
                        style={{ backgroundColor: activeTheme.accent }}
                    />
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 transition-colors duration-500"
                        style={{ backgroundColor: activeTheme.bg }}
                    >
                        <Hexagon
                            size={10}
                            fill={activeTheme.accent}
                            stroke="none"
                            className="animate-spin-slow"
                        />
                    </div>
                </div>

                {/* Description */}
                <p
                    className="text-sm leading-relaxed font-light flex-grow transition-colors duration-500"
                    style={{ color: activeTheme.text, opacity: computedHover ? 1 : 0.8 }}
                >
                    {description}
                </p>

                {/* Footer Status Line */}
                <div
                    className="flex justify-between items-center mt-6 text-[9px] font-mono uppercase tracking-wider transition-all duration-500"
                    style={{ color: activeTheme.accent, opacity: computedHover ? 0.8 : 0.5 }}
                >
                    <span className="group-hover:opacity-100 transition-opacity">
                        {isComingSoon ? 'Coming_Soon' : 'Sys_Active'}
                    </span>
                    <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                    background: computedHover
                        ? `radial-gradient(circle at 50% 0%, ${saffronHoverTheme.glow}, transparent 70%)`
                        : `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 70%)`,
                    opacity: computedHover ? 1 : 0
                }}
            />

            {/* White shine overlay on hover */}
            {computedHover && (
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                        opacity: 0.5
                    }}
                />
            )}
        </div>
    );
};

const CornerBracket = ({ position, color, isHovered }: {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color: string;
    isHovered: boolean;
}) => {
    const style: React.CSSProperties = {
        borderColor: color,
        width: isHovered ? '24px' : '16px',
        height: isHovered ? '24px' : '16px',
        position: 'absolute',
        zIndex: 20,
        transition: 'all 0.5s ease',
        opacity: isHovered ? 1 : 0.5,
    };

    const props = {
        'top-left': { top: '8px', left: '8px', borderTopWidth: '2px', borderLeftWidth: '2px' },
        'top-right': { top: '8px', right: '8px', borderTopWidth: '2px', borderRightWidth: '2px' },
        'bottom-left': { bottom: '8px', left: '8px', borderBottomWidth: '2px', borderLeftWidth: '2px' },
        'bottom-right': { bottom: '8px', right: '8px', borderBottomWidth: '2px', borderRightWidth: '2px' },
    };

    return <div style={{ ...style, ...props[position] }} className="group-hover:opacity-100" />;
};

const SacredCircuitPattern = ({ color }: { color: string }) => (
    <svg width="100%" height="100%">
        <defs>
            <pattern id="sacred-circuit-feature" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 0 L20 40 M0 20 L40 20" stroke={color} strokeWidth="0.5" opacity="0.3" />
                <circle cx="20" cy="20" r="1" fill={color} opacity="0.5" />
                <rect x="18" y="18" width="4" height="4" fill="none" stroke={color} strokeWidth="0.5" transform="rotate(45 20 20)" opacity="0.3" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sacred-circuit-feature)" />
    </svg>
);

export default TechnoSpiritualFeatureCard;
