import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Sparkles, Flame, ScrollText, CheckSquare, User, Target, Gift, Heart, Calendar, ChevronDown, Scroll, Leaf, Droplet, Flower, Hexagon, Check, FileText, Activity, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

interface Step {
    id: string;
    number: number;
    title: string;
    description: string;
    tasks: Task[];
    icon: React.ElementType;
}

interface Task {
    id: string;
    label: string;
    completed: boolean;
}

interface SadhanaCardProps {
    steps?: Step[];
    className?: string;
}

// Theme colors
const darkTheme = {
    fieldBg: 'bg-amber-800/10',
    fieldBorder: 'border-amber-600/20',
    fieldBorderActive: 'border-amber-500/50',
    iconBg: 'bg-amber-800/30',
    iconBgFilled: 'bg-gradient-to-br from-amber-400 to-yellow-500',
    iconColor: 'text-amber-400/60',
    iconColorFilled: 'text-[#5C2218]',
    labelColor: 'text-amber-400/50',
    textColor: 'text-white',
    textColorMuted: 'text-white/30',
    textColorTyping: 'text-amber-200',
    checkColor: 'text-amber-400',
    cursorColor: 'bg-amber-400',
};

const saffronTheme = {
    fieldBg: 'bg-[#5C2218]/10',
    fieldBorder: 'border-[#5C2218]/30',
    fieldBorderActive: 'border-[#5C2218]/50',
    iconBg: 'bg-[#5C2218]/20',
    iconBgFilled: 'bg-[#5C2218]',
    iconColor: 'text-[#5C2218]/60',
    iconColorFilled: 'text-[#FFCC80]',
    labelColor: 'text-[#5C2218]/60',
    textColor: 'text-[#4A1C12]',
    textColorMuted: 'text-[#5C2218]/40',
    textColorTyping: 'text-[#5C2218]',
    checkColor: 'text-[#5C2218]',
    cursorColor: 'bg-[#5C2218]',
};

// Corner Bracket Component
const CornerBracket = ({ position, color, isVisible }: {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color: string;
    isVisible: boolean;
}) => {
    const style: React.CSSProperties = {
        borderColor: color,
        width: '20px',
        height: '20px',
        position: 'absolute',
        zIndex: 20,
        transition: 'all 0.5s ease',
        opacity: isVisible ? 0.8 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.5)',
    };

    const props = {
        'top-left': { top: '12px', left: '12px', borderTopWidth: '2px', borderLeftWidth: '2px' },
        'top-right': { top: '12px', right: '12px', borderTopWidth: '2px', borderRightWidth: '2px' },
        'bottom-left': { bottom: '12px', left: '12px', borderBottomWidth: '2px', borderLeftWidth: '2px' },
        'bottom-right': { bottom: '12px', right: '12px', borderBottomWidth: '2px', borderRightWidth: '2px' },
    };

    return <div style={{ ...style, ...props[position] }} />;
};

// Sacred Circuit Pattern Component
const SacredCircuitPattern = ({ color, isVisible }: { color: string; isVisible: boolean }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 0.15 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
    >
        <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
                <pattern id="sacred-circuit-sadhana" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                    {/* Circuit Lines forming a geometric flower */}
                    <path d="M25 0 L25 8 M25 42 L25 50 M0 25 L8 25 M42 25 L50 25" stroke={color} strokeWidth="1" />
                    <rect x="20" y="20" width="10" height="10" transform="rotate(45 25 25)" fill="none" stroke={color} strokeWidth="1" />
                    <circle cx="25" cy="25" r="2" fill={color} />

                    {/* Connecting dots */}
                    <circle cx="25" cy="8" r="1.5" fill={color} opacity="0.6" />
                    <circle cx="25" cy="42" r="1.5" fill={color} opacity="0.6" />
                    <circle cx="8" cy="25" r="1.5" fill={color} opacity="0.6" />
                    <circle cx="42" cy="25" r="1.5" fill={color} opacity="0.6" />

                    {/* Diagonal Lines */}
                    <path d="M8 8 L16 16" stroke={color} strokeWidth="0.5" opacity="0.5" />
                    <path d="M42 8 L34 16" stroke={color} strokeWidth="0.5" opacity="0.5" />
                    <path d="M8 42 L16 34" stroke={color} strokeWidth="0.5" opacity="0.5" />
                    <path d="M42 42 L34 34" stroke={color} strokeWidth="0.5" opacity="0.5" />

                    {/* Extra decorative elements */}
                    <circle cx="25" cy="25" r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sacred-circuit-sadhana)" />
        </svg>
    </motion.div>
);

const defaultSteps: Step[] = [
    {
        id: 'intention',
        number: 1,
        title: 'Set Intention',
        description: 'Define your spiritual goals and sacred vows',
        icon: Flame,
        tasks: [
            { id: 't1', label: 'Choose your deity path', completed: false },
            { id: 't2', label: 'Define vow duration', completed: false },
            { id: 't3', label: 'Set sacred rules', completed: false },
        ],
    },
    {
        id: 'plan',
        number: 2,
        title: 'Auto-Generated Plan',
        description: 'Receive your personalized sadhana roadmap',
        icon: ScrollText,
        tasks: [
            { id: 't4', label: 'Review mantra counts & quotas', completed: false },
            { id: 't5', label: 'Customize ritual sequence', completed: false },
            { id: 't6', label: 'Set cosmic-aligned reminders', completed: false },
        ],
    },
    {
        id: 'initialize',
        number: 3,
        title: 'Initialize Card',
        description: 'Activate your sadhana tracker system',
        icon: Cpu,
        tasks: [],
    },
    {
        id: 'practice',
        number: 4,
        title: 'Begin Journey',
        description: 'Daily practice and continuous growth',
        icon: Activity,
        tasks: [],
    },
];

// Form field data
const formFields = [
    { id: 'deity', label: 'Deity Name', icon: User, value: 'Lord Ganesha', placeholder: 'Select deity...' },
    { id: 'intention', label: 'Intention', icon: Heart, value: 'Success & Clarity', placeholder: 'Your intention...' },
    { id: 'goal', label: 'Goal', icon: Target, value: 'Get 1000 subscribers on YouTube', placeholder: 'What do you want to achieve...' },
    { id: 'offerings', label: 'Offerings', icon: Gift, value: 'Modak, Red Flowers, Durva Grass', placeholder: 'Offerings...' },
];

// Animated Auto-Fill Form Component
function AutoFillForm({ isActive, onComplete, isComplete, hasStarted }: { isActive: boolean; onComplete: () => void; isComplete: boolean; hasStarted: boolean }) {
    const [filledFields, setFilledFields] = useState<string[]>([]);
    const [typingField, setTypingField] = useState<string | null>(null);
    const [typedText, setTypedText] = useState<Record<string, string>>({});
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [durationFilled, setDurationFilled] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const theme = isComplete ? saffronTheme : darkTheme;
    const isFormComplete = filledFields.length === formFields.length && durationFilled;

    useEffect(() => {
        if (isFormComplete && !isComplete) {
            // Wait 2.5 seconds before marking complete
            const timer = setTimeout(() => {
                onComplete();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isFormComplete, isComplete, onComplete]);

    useEffect(() => {
        if (!isActive || isComplete || !hasStarted) {
            if (isComplete) {
                setFilledFields(formFields.map(f => f.id));
                setTypedText(formFields.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {}));
                setSelectedDuration(21);
                setDurationFilled(true);
            }
            return;
        }

        let fieldIndex = 0;
        const timers: NodeJS.Timeout[] = [];
        const intervals: NodeJS.Timeout[] = [];
        let isCancelled = false;
        
        const fillNextField = () => {
            if (isCancelled) return;
            
            if (fieldIndex >= formFields.length) {
                const timer = setTimeout(() => {
                    if (!isCancelled) {
                        setSelectedDuration(21);
                        setDurationFilled(true);
                    }
                }, shouldReduceMotion ? 0 : 300);
                timers.push(timer);
                return;
            }

            const field = formFields[fieldIndex];
            if (!isCancelled) setTypingField(field.id);

            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (isCancelled) {
                    clearInterval(typeInterval);
                    return;
                }
                
                if (charIndex <= field.value.length) {
                    setTypedText(prev => ({
                        ...prev,
                        [field.id]: field.value.substring(0, charIndex)
                    }));
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    if (!isCancelled) {
                        setFilledFields(prev => [...prev, field.id]);
                        setTypingField(null);
                        fieldIndex++;
                        const timer = setTimeout(fillNextField, shouldReduceMotion ? 0 : 250);
                        timers.push(timer);
                    }
                }
            }, shouldReduceMotion ? 0 : 35);
            intervals.push(typeInterval);
        };

        const startTimeout = setTimeout(fillNextField, shouldReduceMotion ? 0 : 400);
        timers.push(startTimeout);
        
        return () => {
            isCancelled = true;
            timers.forEach(timer => clearTimeout(timer));
            intervals.forEach(interval => clearInterval(interval));
        };
    }, [isActive, isComplete, hasStarted, shouldReduceMotion]);

    return (
        <div className="space-y-3">
            {formFields.map((field, index) => {
                const isFilled = filledFields.includes(field.id);
                const isTyping = typingField === field.id;
                const displayValue = typedText[field.id] || '';
                const Icon = field.icon;

                return (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.2 }}
                    >
                        <div
                            className={cn(
                                'relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-500',
                                theme.fieldBg,
                                isFilled ? theme.fieldBorderActive : theme.fieldBorder,
                                isFilled && !isComplete && 'shadow-md shadow-amber-500/10'
                            )}
                        >
                            <div
                                className={cn(
                                    'w-8 h-8 rounded flex items-center justify-center transition-all duration-500',
                                    isFilled ? theme.iconBgFilled : theme.iconBg,
                                    isFilled ? theme.iconColorFilled : theme.iconColor
                                )}
                            >
                                <Icon size={14} />
                            </div>

                            <div className="flex-1">
                                <div className={cn(
                                    'text-[10px] font-mono uppercase tracking-wider mb-0.5 transition-colors duration-500',
                                    theme.labelColor
                                )}>
                                    {field.label}
                                </div>
                                <div
                                    className={cn(
                                        'text-sm font-medium transition-colors duration-500 min-h-[18px]',
                                        isFilled ? theme.textColor : isTyping ? theme.textColorTyping : theme.textColorMuted
                                    )}
                                >
                                    {displayValue || (!isTyping && !isFilled && field.placeholder)}
                                    {isTyping && (
                                        <motion.span
                                            className={cn('inline-block w-0.5 h-4 ml-0.5', theme.cursorColor)}
                                            animate={{ opacity: [1, 0, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                        />
                                    )}
                                </div>
                            </div>

                            {isFilled && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                >
                                    <CheckCircle2 className={cn('w-4 h-4 transition-colors duration-500', theme.checkColor)} />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            })}

            {/* Duration Dropdown */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: formFields.length * 0.06, duration: 0.2 }}
            >
                <div
                    className={cn(
                        'relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-500',
                        theme.fieldBg,
                        durationFilled ? theme.fieldBorderActive : theme.fieldBorder,
                        durationFilled && !isComplete && 'shadow-md shadow-amber-500/10'
                    )}
                >
                    <div
                        className={cn(
                            'w-8 h-8 rounded flex items-center justify-center transition-all duration-500',
                            durationFilled ? theme.iconBgFilled : theme.iconBg,
                            durationFilled ? theme.iconColorFilled : theme.iconColor
                        )}
                    >
                        <Calendar size={14} />
                    </div>

                    <div className="flex-1">
                        <div className={cn(
                            'text-[10px] font-mono uppercase tracking-wider mb-0.5 transition-colors duration-500',
                            theme.labelColor
                        )}>
                            Duration
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                'text-sm font-medium transition-colors duration-500',
                                durationFilled ? theme.textColor : theme.textColorMuted
                            )}>
                                {selectedDuration ? `${selectedDuration} Days` : 'Select duration...'}
                            </span>
                            <ChevronDown size={14} className={cn(
                                'transition-colors duration-500',
                                durationFilled ? theme.checkColor : theme.textColorMuted
                            )} />
                        </div>
                    </div>

                    {durationFilled && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                        >
                            <CheckCircle2 className={cn('w-4 h-4 transition-colors duration-500', theme.checkColor)} />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// Static data for Sadhana Tracker Card
const trackerSadhanaData = {
    deity: 'Lord Ganesha',
    mantra: 'Om Gam Ganapataye Namaha',
    intent: 'Success & Clarity',
    goalName: 'Get 1000 subscribers on YouTube',
    durationDays: 21,
    offerings: [
        { id: 1, name: 'Chant Mantra 108 Times', icon: Sparkles },
        { id: 2, name: 'Offer Modak', icon: Gift },
        { id: 3, name: 'Red Flowers', icon: Flower },
        { id: 4, name: 'Durva Grass', icon: Leaf }
    ]
};

// Initialize Sadhana Card Component - Stage 3 (matching sadhanacard-init.txt)
function InitializeSadhanaCard({ isActive, onComplete, isComplete, hasStarted }: {
    isActive: boolean;
    onComplete: () => void;
    isComplete: boolean;
    hasStarted: boolean;
}) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [completedOfferings, setCompletedOfferings] = useState<number[]>([]);
    const shouldReduceMotion = useReducedMotion();

    const sadhanaData = {
        deity: 'Lord Ganesha',
        mantra: 'Om Gam Ganapataye Namaha',
        intent: 'Success & Clarity',
        goalName: 'Get 1000 subscribers on YouTube',
        durationDays: 21,
        streak: 1,
        level: 1,
        offerings: [
            { id: 1, name: 'Chant Mantra 108 Times', icon: Sparkles },
            { id: 2, name: 'Offer Modak', icon: Gift },
            { id: 3, name: 'Red Flowers', icon: Flower },
            { id: 4, name: 'Durva Grass', icon: Leaf }
        ]
    };

    const allCompleted = completedOfferings.length === sadhanaData.offerings.length;
    const progressPercentage = (completedOfferings.length / sadhanaData.offerings.length) * 100;

    // Auto-initialize after delay
    useEffect(() => {
        if (!isActive || !hasStarted || isComplete) return;

        const initTimer = setTimeout(() => {
            if (isActive && hasStarted && !isComplete) {
                setIsInitialized(true);
            }
        }, shouldReduceMotion ? 0 : 1000);

        return () => clearTimeout(initTimer);
    }, [isActive, hasStarted, isComplete, shouldReduceMotion]);

    // Auto-complete offerings
    useEffect(() => {
        if (!isInitialized || isComplete || !hasStarted) return;

        let offeringIndex = 0;
        const timers: NodeJS.Timeout[] = [];
        let isCancelled = false;

        const checkNextOffering = () => {
            if (isCancelled || offeringIndex >= sadhanaData.offerings.length) return;

            const currentOffering = sadhanaData.offerings[offeringIndex];
            setCompletedOfferings(prev => {
                if (prev.includes(currentOffering.id)) return prev;
                return [...prev, currentOffering.id];
            });
            offeringIndex++;

            if (offeringIndex < sadhanaData.offerings.length && !isCancelled) {
                const timer = setTimeout(checkNextOffering, shouldReduceMotion ? 0 : 600);
                timers.push(timer);
            }
        };

        const startTimer = setTimeout(checkNextOffering, shouldReduceMotion ? 0 : 1200);
        timers.push(startTimer);

        return () => {
            isCancelled = true;
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [isInitialized, isComplete, hasStarted, shouldReduceMotion]);

    // Complete when all offerings checked
    useEffect(() => {
        if (allCompleted && !isComplete) {
            const timer = setTimeout(onComplete, 2500);
            return () => clearTimeout(timer);
        }
    }, [allCompleted, isComplete, onComplete]);

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={cn(
                    'relative overflow-hidden transition-all duration-500 rounded-xl',
                    isComplete
                        ? 'bg-gradient-to-br from-[#FFB344] to-[#FFCC80]'
                        : 'bg-gradient-to-br from-[#FFB74D] to-[#FFCC80]'
                )}
                style={{
                    backgroundImage: 'radial-gradient(circle, #FFCC80 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    filter: isInitialized ? 'none' : 'grayscale(0.8) brightness(0.9)'
                }}
            >
                {/* Decorative Border Frame */}
                <div className="absolute inset-2 border-2 border-dashed border-[#5D4037]/30 pointer-events-none z-10" />
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#3E2723] z-20" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#3E2723] z-20" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#3E2723] z-20" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#3E2723] z-20" />

                <div className="p-6 md:p-8 relative z-20">
                    {/* Header Section */}
                    <div className="text-center mb-4">
                        <div className={cn(
                            'w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#3E2723] flex items-center justify-center bg-[#FFB74D] relative transition-all duration-1000',
                            isInitialized && 'shadow-[0_0_30px_rgba(255,183,77,0.6)]'
                        )}>
                            <div className={cn(
                                'absolute inset-1 border border-[#3E2723] rounded-full',
                                isInitialized ? 'animate-spin-slow' : 'opacity-50'
                            )} />
                            <span className="text-3xl">🕉️</span>
                        </div>

                        <div className="uppercase tracking-[0.2em] text-xs font-bold mb-2 opacity-80 text-[#3E2723]">
                            {sadhanaData.deity}
                        </div>

                        <div className="font-serif text-[#3E2723] leading-none mb-2 flex items-baseline justify-center gap-1">
                            <span className="text-7xl">{sadhanaData.streak}</span>
                            <span className="text-3xl opacity-50">/{sadhanaData.durationDays}</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest opacity-70 text-[#3E2723]">
                            <Sparkles size={12} />
                            <span>Day Streak</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center justify-center opacity-40 my-4">
                        <div className="h-[1px] bg-[#3E2723] w-1/3" />
                        <Hexagon size={16} className="mx-2 text-[#3E2723] fill-[#3E2723]" />
                        <div className="h-[1px] bg-[#3E2723] w-1/3" />
                    </div>

                    {/* Mission Info */}
                    <div className="text-center space-y-4 mb-6 pb-4 border-b border-[#3E2723]/10">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 flex items-center justify-center gap-1 text-[#3E2723]">
                                <Target size={10} /> Mission
                            </div>
                            <div className="font-serif text-lg text-[#3E2723] leading-tight">{sadhanaData.goalName}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 flex items-center justify-center gap-1 text-[#3E2723]">
                                <Scroll size={10} /> Intention
                            </div>
                            <div className="font-serif text-base text-[#3E2723] italic opacity-90 leading-tight">"{sadhanaData.intent}"</div>
                        </div>
                    </div>

                    {/* Offerings Checklist */}
                    <div className="space-y-3 mb-6">
                        {sadhanaData.offerings.map((offering) => {
                            const isChecked = completedOfferings.includes(offering.id);
                            const Icon = offering.icon;

                            return (
                                <div
                                    key={offering.id}
                                    className={cn(
                                        'flex items-center gap-4 transition-opacity',
                                        !isInitialized && 'opacity-30'
                                    )}
                                >
                                    <div className={cn(
                                        'w-6 h-6 border-2 border-[#3E2723] rounded flex items-center justify-center transition-all flex-shrink-0',
                                        isChecked ? 'bg-[#3E2723]' : 'bg-transparent'
                                    )}>
                                        {isChecked && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                            >
                                                <Check size={14} className="text-[#FFB74D]" strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className={cn(
                                        'font-serif text-lg leading-none pt-1 text-[#3E2723]',
                                        isChecked && 'line-through opacity-50'
                                    )}>
                                        {offering.name}
                                    </div>
                                    <div className="ml-auto opacity-40 text-[#3E2723]">
                                        <Icon size={16} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Action Button */}
                    <div className="mt-6">
                        <button
                            className={cn(
                                'w-full py-4 px-6 font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-between relative overflow-hidden',
                                isInitialized
                                    ? 'bg-transparent border-2 border-[#3E2723] text-[#3E2723]'
                                    : 'bg-[#3E2723] text-[#FFB74D] shadow-lg'
                            )}
                            disabled
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isInitialized ? (
                                    <><Activity size={16} className="animate-pulse" /> SYSTEM_ACTIVE</>
                                ) : (
                                    <><Cpu size={16} /> INITIALIZE_SADHANA</>
                                )}
                            </span>

                            {isInitialized && (
                                <span className="text-xs opacity-60 relative z-10 flex items-center gap-1">
                                    <FileText size={12} /> VIEW PROTOCOL
                                </span>
                            )}

                            {isInitialized && (
                                <div
                                    className="absolute left-0 top-0 bottom-0 bg-[#3E2723]/10 transition-all duration-500 z-0"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            )}
                        </button>

                        {!isInitialized && (
                            <div className="text-center mt-2 text-[10px] uppercase tracking-widest opacity-40 text-[#3E2723]">
                                Awaiting Initiation Sequence...
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-between items-end text-[10px] font-bold tracking-widest opacity-60 uppercase text-[#3E2723]">
                        <div className="flex flex-col gap-1">
                            <span>SYS_READY</span>
                            <span className="flex items-center gap-1"><Cpu size={10} /> LVL.{sadhanaData.level} ACCESS</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={cn(
                                'w-2 h-2 rounded-full bg-[#3E2723]',
                                isInitialized ? 'animate-pulse' : 'opacity-20'
                            )} />
                            {sadhanaData.mantra.split(' ').slice(0, 2).join('_').toUpperCase()}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Auto-checking Tasks Component
function AutoCheckTasks({ tasks, isActive, onComplete, isComplete, hasStarted }: {
    tasks: Task[];
    isActive: boolean;
    onComplete: () => void;
    isComplete: boolean;
    hasStarted: boolean;
}) {
    const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
    const shouldReduceMotion = useReducedMotion();

    const theme = isComplete ? saffronTheme : darkTheme;
    const allChecked = checkedTasks.length === tasks.length;

    useEffect(() => {
        if (allChecked && !isComplete) {
            // Wait 2.5 seconds before marking complete
            const timer = setTimeout(onComplete, 2500);
            return () => clearTimeout(timer);
        }
    }, [allChecked, isComplete, onComplete]);

    useEffect(() => {
        if (isComplete) {
            setCheckedTasks(tasks.map(t => t.id));
            return;
        }

        if (!isActive || !hasStarted) {
            setCheckedTasks([]);
            return;
        }

        let taskIndex = 0;
        const timers: NodeJS.Timeout[] = [];
        let isCancelled = false;
        
        const checkNextTask = () => {
            if (isCancelled || taskIndex >= tasks.length) return;

            const currentTask = tasks[taskIndex];
            setCheckedTasks(prev => [...prev, currentTask.id]);
            taskIndex++;

            if (taskIndex < tasks.length && !isCancelled) {
                const timer = setTimeout(checkNextTask, shouldReduceMotion ? 0 : 400);
                timers.push(timer);
            }
        };

        const startTimeout = setTimeout(checkNextTask, shouldReduceMotion ? 0 : 500);
        timers.push(startTimeout);
        
        return () => {
            isCancelled = true;
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [isActive, isComplete, tasks, hasStarted, shouldReduceMotion]);

    return (
        <div className="space-y-2">
            {tasks.map((task, taskIndex) => {
                const isChecked = checkedTasks.includes(task.id);

                return (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: taskIndex * 0.08, duration: 0.2 }}
                    >
                        <div
                            className={cn(
                                'flex items-center gap-3 p-3 rounded-lg transition-all duration-500',
                                'border',
                                theme.fieldBg,
                                isChecked ? theme.fieldBorderActive : theme.fieldBorder,
                                isChecked && !isComplete && 'shadow-md shadow-amber-500/10'
                            )}
                        >
                            <Checkbox
                                checked={isChecked}
                                className={cn(
                                    'transition-all duration-500',
                                    isComplete
                                        ? 'border-[#5C2218]/50 data-[state=checked]:bg-[#5C2218] data-[state=checked]:border-[#5C2218]'
                                        : 'border-amber-400/50 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-amber-400 data-[state=checked]:to-yellow-500 data-[state=checked]:border-amber-500'
                                )}
                            />
                            <span
                                className={cn(
                                    'flex-1 text-sm transition-all duration-500',
                                    isChecked
                                        ? isComplete
                                            ? 'text-[#5C2218]/60 line-through'
                                            : 'text-amber-300/60 line-through'
                                        : theme.textColor
                                )}
                            >
                                {task.label}
                            </span>
                            {isChecked && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                >
                                    <CheckCircle2 className={cn('w-4 h-4 transition-colors duration-500', theme.checkColor)} />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// Stage 4: Daily Practice View - Sadhana Paper + Task Manager Side by Side
function DailyPracticeView({ isActive, onComplete, isComplete, hasStarted }: {
    isActive: boolean;
    onComplete: () => void;
    isComplete: boolean;
    hasStarted: boolean;
}) {
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (!isActive || !hasStarted || isComplete) return;

        const timer = setTimeout(() => {
            onComplete();
        }, shouldReduceMotion ? 0 : 4000);

        return () => clearTimeout(timer);
    }, [isActive, hasStarted, isComplete, onComplete, shouldReduceMotion]);

    return (
        <div className="w-full">
            {/* Header Message */}
            <div className="text-center mb-6">
                <p className="text-lg font-serif text-white/80 italic">
                    "Now keep doing the sadhana continuously for the duration you chose"
                </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* LEFT: Sadhana Paper (Promise to Self) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#FDF5E6] text-[#4E342E] rounded-lg p-6 relative overflow-hidden shadow-lg"
                >
                    {/* Parchment texture */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, #3E2723 0px, #3E2723 1px, transparent 1px, transparent 2px)'
                    }} />

                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#3E2723]/30" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#3E2723]/30" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#3E2723]/30" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#3E2723]/30" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-4 pb-3 border-b border-[#3E2723]/10">
                            <Scroll size={24} className="mx-auto mb-2 text-[#3E2723]" />
                            <h3 className="font-serif text-xl font-bold text-[#3E2723] uppercase tracking-wide">Sacred Promise</h3>
                            <p className="text-[10px] opacity-60 mt-1 font-mono">To The Self</p>
                        </div>

                        {/* Promise Body */}
                        <div className="space-y-4 text-sm font-serif leading-relaxed">
                            <p className="text-center italic">
                                "In the presence of <span className="font-bold text-[#8D6E63]">Lord Ganesha</span>,<br />
                                I commit to my path of growth."
                            </p>

                            <div className="bg-[#fffcf5] p-3 border border-[#3E2723]/10 rounded">
                                <p className="text-center">
                                    For <span className="font-bold">21 Days</span>,<br />
                                    seeking <span className="italic border-b border-[#3E2723]/30">Success & Clarity</span>
                                </p>
                            </div>

                            <div>
                                <div className="text-xs uppercase tracking-wide opacity-60 mb-2 text-center">My Sacred Mission</div>
                                <p className="text-center font-medium">Get 1000 subscribers on YouTube</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#3E2723]/10">
                                <p className="text-xs text-center italic opacity-80">
                                    "I solemnly promise to complete this Sadhana without obstacle."
                                </p>
                            </div>
                        </div>

                        {/* Tech Elements */}
                        <div className="mt-4 flex justify-between text-[9px] font-mono uppercase opacity-40">
                            <span>PROTOCOL_ACTIVE</span>
                            <span>DAY_001</span>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT: Task Manager */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-amber-500/20 relative overflow-hidden"
                >
                    {/* Tech grid background */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'linear-gradient(#amber-400 1px, transparent 1px), linear-gradient(90deg, #amber-400 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }} />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-500/20">
                            <div>
                                <h3 className="font-mono text-sm uppercase tracking-wider text-amber-400">Daily Tasks</h3>
                                <p className="text-xs text-white/50 mt-1">Sadhana Tracker</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">1<span className="text-sm text-white/40">/21</span></div>
                                <div className="text-[9px] uppercase text-amber-400/60 flex items-center gap-1 justify-end">
                                    <Sparkles size={10} /> Day Streak
                                </div>
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="space-y-3">
                            {[
                                { name: 'Chant Mantra 108 Times', icon: Sparkles, done: false },
                                { name: 'Offer Modak', icon: Gift, done: false },
                                { name: 'Red Flowers', icon: Flower, done: false },
                                { name: 'Durva Grass', icon: Leaf, done: false }
                            ].map((task, idx) => {
                                const Icon = task.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        className="flex items-center gap-3 p-3 rounded bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all"
                                    >
                                        <div className="w-5 h-5 rounded border-2 border-amber-400/50 flex items-center justify-center flex-shrink-0" />
                                        <span className="flex-1 text-sm text-white/90">{task.name}</span>
                                        <Icon size={14} className="text-amber-400/40" />
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Progress Footer */}
                        <div className="mt-4 pt-4 border-t border-amber-500/10">
                            <div className="flex justify-between text-[10px] font-mono uppercase text-amber-400/60">
                                <span className="flex items-center gap-1">
                                    <Activity size={10} className="animate-pulse" /> READY
                                </span>
                                <span>0/4 COMPLETE</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export function SadhanaCard({ steps = defaultSteps, className }: SadhanaCardProps) {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [stepData] = useState<Step[]>(steps);
    const [stepCompleted, setStepCompleted] = useState<boolean[]>([false, false, false, false]);
    const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.1 });

    const handleStepComplete = useCallback((stepIndex: number) => {
        setStepCompleted(prev => {
            const newState = [...prev];
            newState[stepIndex] = true;
            return newState;
        });

        if (stepIndex < stepData.length - 1) {
            // Delay before moving to next step (happens after complete state shows for 2.5s)
            setTimeout(() => {
                setActiveStep(stepIndex + 1);
            }, 300);
        }
    }, [stepData.length]);

    const ActiveIcon = stepData[activeStep].icon;
    const isCurrentStepComplete = stepCompleted[activeStep];

    return (
        <section
            ref={sectionRef as React.RefObject<HTMLElement>}
            className={cn(
                'relative h-screen min-h-[700px] max-h-[950px] flex items-center px-4 overflow-hidden',
                className
            )}
        >
            {/* Floating Orbs */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-64 h-64 bg-amber-600/20 rounded-full blur-3xl top-10 left-10 pointer-events-none"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.15, 1] }}
                transition={{ duration: 5, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-48 h-48 bg-amber-500/15 rounded-full blur-3xl bottom-10 right-10 pointer-events-none"
            />

            <div className="relative z-10 max-w-6xl mx-auto w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 mb-4">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span className="text-xs text-amber-200 font-medium tracking-wide font-mono uppercase">Sacred Technology</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                        The <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400">Sadhana Card</span>
                    </h2>
                    <p className="text-white/50 text-sm max-w-md mx-auto">
                        Transform discipline into a smooth, motivating spiritual journey
                    </p>
                </motion.div>

                {/* Main Content: Steps Left, Card Right */}
                <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-10 items-stretch">

                    {/* Left: Vertical Step Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex md:flex-col items-center justify-center gap-4 md:gap-0 md:py-6"
                    >
                        {stepData.map((step, index) => {
                            const isStepComplete = stepCompleted[index];

                            return (
                                <div key={step.id} className="flex md:flex-col items-center">
                                    <motion.button
                                        onClick={() => setActiveStep(index)}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            'relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500',
                                            activeStep === index
                                                ? isStepComplete
                                                    ? 'bg-gradient-to-br from-[#FFB344] to-[#FFCC80] text-[#5C2218] shadow-[0_0_30px_-5px_rgba(255,179,68,0.6)]'
                                                    : 'bg-gradient-to-br from-amber-400 to-yellow-500 text-[#5C2218] shadow-lg shadow-amber-500/50'
                                                : isStepComplete
                                                    ? 'bg-gradient-to-br from-[#FFB344]/80 to-[#FFCC80]/80 text-[#5C2218] shadow-md shadow-amber-500/30'
                                                    : activeStep > index
                                                        ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50'
                                                        : 'bg-[#1a1a1a] text-amber-400/50 border-2 border-amber-600/30'
                                        )}
                                    >
                                        {isStepComplete ? (
                                            <CheckCircle2 className="w-6 h-6" />
                                        ) : (
                                            <span className="font-serif">{step.number}</span>
                                        )}

                                        {activeStep === index && !isStepComplete && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-2 border-amber-400"
                                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                            />
                                        )}
                                    </motion.button>

                                    <div className="hidden md:block mt-3 mb-2 text-center w-20">
                                        <p className={cn(
                                            'text-xs font-medium transition-colors duration-500',
                                            activeStep === index
                                                ? 'text-amber-300'
                                                : isStepComplete
                                                    ? 'text-amber-400/70'
                                                    : 'text-amber-400/40'
                                        )}>
                                            {step.title}
                                        </p>
                                    </div>

                                    {index < stepData.length - 1 && (
                                        <>
                                            <div className="md:hidden relative w-8 h-0.5 mx-2">
                                                <div className="absolute inset-0 bg-amber-800/30 rounded-full" />
                                                <motion.div
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: stepCompleted[index] ? 1 : 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full origin-left"
                                                />
                                            </div>

                                            <div className="hidden md:block relative w-0.5 h-10">
                                                <div className="absolute inset-0 bg-amber-800/30 rounded-full" />
                                                <motion.div
                                                    initial={{ scaleY: 0 }}
                                                    animate={{ scaleY: stepCompleted[index] ? 1 : 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="absolute inset-0 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full origin-top"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Right: Active Step Card */}
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1"
                    >
                        <Card
                            className={cn(
                                'relative overflow-hidden backdrop-blur-xl rounded-2xl p-6 md:p-8 h-full transition-all duration-500',
                                isCurrentStepComplete
                                    ? 'bg-gradient-to-br from-[#FFB344] to-[#FFCC80] border-2 border-[#5C2218]/40 shadow-[0_0_60px_-15px_rgba(255,179,68,0.6)]'
                                    : 'bg-gradient-to-br from-[#0a0a0a]/90 to-[#1a1a1a]/90 border-2 border-amber-500/30 shadow-2xl shadow-amber-900/20'
                            )}
                        >
                            {/* Corner Brackets - Appear on completion */}
                            <CornerBracket position="top-left" color="#5C2218" isVisible={isCurrentStepComplete} />
                            <CornerBracket position="top-right" color="#5C2218" isVisible={isCurrentStepComplete} />
                            <CornerBracket position="bottom-left" color="#5C2218" isVisible={isCurrentStepComplete} />
                            <CornerBracket position="bottom-right" color="#5C2218" isVisible={isCurrentStepComplete} />

                            {/* Sacred Circuit Pattern - Appears on completion */}
                            <SacredCircuitPattern color="#5C2218" isVisible={isCurrentStepComplete} />

                            {/* Tech border frame - changes on completion */}
                            <div className={cn(
                                'absolute inset-2 md:inset-3 border border-dashed rounded-xl pointer-events-none transition-all duration-500',
                                isCurrentStepComplete ? 'border-[#5C2218]/30 opacity-0' : 'border-amber-400/20'
                            )} />

                            {isCurrentStepComplete && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                                />
                            )}

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={cn(
                                        'p-3 rounded-xl border transition-all duration-500',
                                        isCurrentStepComplete
                                            ? 'bg-[#5C2218] border-[#5C2218]/40'
                                            : 'bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border-amber-500/30'
                                    )}>
                                        <ActiveIcon className={cn(
                                            'w-6 h-6 transition-colors duration-500',
                                            isCurrentStepComplete ? 'text-[#FFCC80]' : 'text-amber-300'
                                        )} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn(
                                            'text-2xl font-serif font-bold mb-1 transition-colors duration-500',
                                            isCurrentStepComplete ? 'text-[#4A1C12]' : 'text-white'
                                        )}>
                                            {stepData[activeStep].title}
                                        </h3>
                                        <p className={cn(
                                            'text-sm transition-colors duration-500',
                                            isCurrentStepComplete ? 'text-[#5C2218]/70' : 'text-white/60'
                                        )}>
                                            {stepData[activeStep].description}
                                        </p>
                                    </div>
                                </div>

                                {/* Content based on step */}
                                {activeStep === 0 && (
                                    <AutoFillForm
                                        isActive={activeStep === 0 && !stepCompleted[0]}
                                        onComplete={() => handleStepComplete(0)}
                                        isComplete={stepCompleted[0]}
                                        hasStarted={isVisible}
                                    />
                                )}

                                {activeStep === 1 && (
                                    <AutoCheckTasks
                                        tasks={stepData[1].tasks}
                                        isActive={activeStep === 1 && !stepCompleted[1]}
                                        onComplete={() => handleStepComplete(1)}
                                        isComplete={stepCompleted[1]}
                                        hasStarted={isVisible}
                                    />
                                )}

                                {activeStep === 2 && (
                                    <InitializeSadhanaCard
                                        isActive={activeStep === 2 && !stepCompleted[2]}
                                        onComplete={() => handleStepComplete(2)}
                                        isComplete={stepCompleted[2]}
                                        hasStarted={isVisible}
                                    />
                                )}

                                {activeStep === 3 && (
                                    <DailyPracticeView
                                        isActive={activeStep === 3 && !stepCompleted[3]}
                                        onComplete={() => handleStepComplete(3)}
                                        isComplete={stepCompleted[3]}
                                        hasStarted={isVisible}
                                    />
                                )}

                                {/* Footer Status */}
                                <div className={cn(
                                    'mt-6 flex justify-between items-center text-[9px] font-mono uppercase tracking-wider transition-colors duration-500',
                                    isCurrentStepComplete ? 'text-[#5C2218]/60' : 'text-amber-400/40'
                                )}>
                                    <span>Step_{(activeStep + 1).toString().padStart(2, '0')}</span>
                                    <span className="flex items-center gap-1">
                                        <span className={cn(
                                            'w-1.5 h-1.5 rounded-full transition-colors duration-500',
                                            isCurrentStepComplete ? 'bg-[#5C2218] animate-pulse' : 'bg-amber-400 animate-pulse'
                                        )} />
                                        {isCurrentStepComplete ? 'Complete' : 'Processing'}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Footer Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-white/40 font-serif italic">
                        "Discipline turned into a system — not a guessing game."
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

const SadhanaCardSection = () => {
    return <SadhanaCard />;
};

export default SadhanaCardSection;
