import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TransparentGlassMorphismContainer } from '@/components/design/SadhanaDesignComponents';

interface AnimatedParchmentProps {
  content: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

const AnimatedParchment: React.FC<AnimatedParchmentProps> = ({
  content,
  onComplete,
  isCompleted = false
}) => {
  const [isBurning, setIsBurning] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0);
  const [showParchment, setShowParchment] = useState(true);
  const [showSpark, setShowSpark] = useState(false);
  const [isUnrolled, setIsUnrolled] = useState(false); // Track unroll state
  const [isInitializing, setIsInitializing] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const burnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const unrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentLines = content.trim().split('\n').filter(line => line.trim() !== '');
  const { colors } = useThemeColors();

  // Handle completion state change
  const startBurningAnimation = useCallback(() => {
    if (burnIntervalRef.current) {
      clearInterval(burnIntervalRef.current);
    }

    setIsBurning(true);
    burnIntervalRef.current = setInterval(() => {
      setBurnProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          if (burnIntervalRef.current) {
            clearInterval(burnIntervalRef.current);
          }
          // Hide parchment and show spark
          setTimeout(() => {
            setShowParchment(false);
            setShowSpark(true);
            // Hide spark after delay
            setTimeout(() => {
              setShowSpark(false);
              if (onComplete) onComplete();
            }, 2000);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);
  }, [onComplete]);

  useEffect(() => {
    if (isCompleted && !isBurning) {
      startBurningAnimation();
    }
  }, [isCompleted, isBurning, startBurningAnimation]);

  // Auto unroll when component mounts
  useEffect(() => {
    unrollTimeoutRef.current = setTimeout(() => {
      setIsUnrolled(true);
    }, 100);

    return () => {
      if (unrollTimeoutRef.current) {
        clearTimeout(unrollTimeoutRef.current);
      }
    };
  }, []);

  // Tech initialization sequence
  useEffect(() => {
    let scanInterval: NodeJS.Timeout;

    // Scanning animation starts after 1.5s
    const startScan = setTimeout(() => {
      scanInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(scanInterval);
            setIsInitializing(false);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    }, 1500);

    // Random glitch effects during initialization
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    }, 800);

    const stopGlitch = setTimeout(() => {
      clearInterval(glitchInterval);
    }, 3000);

    return () => {
      clearTimeout(startScan);
      clearTimeout(stopGlitch);
      if (scanInterval) clearInterval(scanInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (burnIntervalRef.current) {
        clearInterval(burnIntervalRef.current);
      }
      if (unrollTimeoutRef.current) {
        clearTimeout(unrollTimeoutRef.current);
      }
    };
  }, []);

  if (!showParchment && !showSpark) {
    return null;
  }

  if (showSpark) {
    return (
      <div className="flex justify-center items-center h-64 md:h-96">
        <div className="relative">
          {/* Spark effect */}
          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-300 rounded-full animate-ping absolute opacity-75"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <TransparentGlassMorphismContainer className="w-full max-w-2xl mx-auto min-h-[20rem] sm:min-h-[24rem] md:min-h-[26rem] p-4 md:p-6">
      {/* Scanning beam effect */}
      {isInitializing && (
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background: `linear-gradient(to bottom, 
              transparent ${scanProgress - 5}%, 
              rgba(255, 215, 0, 0.3) ${scanProgress}%, 
              transparent ${scanProgress + 5}%)`,
            transition: 'all 0.1s linear'
          }}
        />
      )}

      {/* Burning effect overlay */}
      {isBurning && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none z-20"
          style={{
            background: `linear-gradient(to top, 
              rgba(255, 69, 0, 1) ${burnProgress}%, 
              rgba(255, 140, 0, 0.9) ${Math.min(burnProgress + 10, 100)}%, 
              transparent ${Math.min(burnProgress + 30, 100)}%)`,
            mask: `linear-gradient(to top, black ${burnProgress}%, transparent ${Math.min(burnProgress + 20, 100)}%)`,
            WebkitMask: `linear-gradient(to top, black ${burnProgress}%, transparent ${Math.min(burnProgress + 20, 100)}%)`
          }}
        >
          {/* Ember particles */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-orange-400 ember-rise"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animationDuration: `${Math.random() * 2 + 1}s`,
                filter: 'blur(1px)'
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Smoke effect */}
      {isBurning && (
        <div className="absolute inset-0 rounded-lg pointer-events-none z-10 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gray-300 smoke-rise"
              style={{
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                filter: 'blur(6px)'
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Paper Container - Optimized for mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative rounded-2xl border-2 backdrop-blur-md transition-all duration-1000 min-h-[20rem] sm:min-h-[24rem] md:min-h-[26rem] flex flex-col ${isUnrolled ? 'parchment-unroll' : ''
          }`}
        style={{
          background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.08) 30%, rgba(220, 38, 38, 0.04) 70%, rgba(220, 38, 38, 0.06) 100%)',
          borderColor: isInitializing ? 'rgba(220, 38, 38, 0.6)' : 'rgba(220, 38, 38, 0.3)',
          fontFamily: '"Chakra Petch", Georgia, serif',
          boxShadow: `
            0 4px 16px rgba(255, 215, 0, 0.12),
            0 0 0 1px rgba(255, 215, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(255, 215, 0, 0.08),
            ${isInitializing ? '0 0 30px rgba(255, 215, 0, 0.4)' : 'none'}
          `,
          backdropFilter: 'blur(10px) saturate(140%)',
          WebkitBackdropFilter: 'blur(10px) saturate(140%)',
          transform: isBurning ? `scale(${1 - burnProgress / 200})` : 'scale(1)',
          filter: glitchActive ? 'hue-rotate(20deg) contrast(1.2)' : (isBurning ? `blur(${burnProgress / 50}px)` : 'none'),
          transition: 'filter 0.1s, box-shadow 0.3s, border-color 0.3s'
        }}
      >
        {/* Tech grid overlay */}
        {isInitializing && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
        )}

        {/* Metallic overlay gradient */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 200, 0.08) 0%, 
                transparent 25%, 
                rgba(255, 223, 0, 0.05) 50%, 
                transparent 75%, 
                rgba(255, 255, 180, 0.03) 100%
              )
            `,
            opacity: 0.5
          }}
        />

        {/* Enhanced ornate corners with initialization glow */}
        <div
          className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.8)',
            filter: `drop-shadow(0 0 ${isInitializing ? '8' : '4'}px rgba(255, 215, 0, 0.4))`,
            transition: 'filter 0.3s'
          }}
        />
        <div
          className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.8)',
            filter: `drop-shadow(0 0 ${isInitializing ? '8' : '4'}px rgba(255, 215, 0, 0.4))`,
            transition: 'filter 0.3s'
          }}
        />
        <div
          className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.8)',
            filter: `drop-shadow(0 0 ${isInitializing ? '8' : '4'}px rgba(255, 215, 0, 0.4))`,
            transition: 'filter 0.3s'
          }}
        />
        <div
          className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.8)',
            filter: `drop-shadow(0 0 ${isInitializing ? '8' : '4'}px rgba(255, 215, 0, 0.4))`,
            transition: 'filter 0.3s'
          }}
        />

        {/* Header */}
        <div className="text-center mb-4 relative z-10">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-2xl font-bold mb-2"
            style={{
              fontFamily: '"Chakra Petch", Georgia, serif',
              color: 'rgba(255, 223, 0, 0.95)',
              textShadow: `0 0 ${isInitializing ? '12' : '8'}px rgba(255, 215, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)`
            }}
          >
            🕉️ Sacred Sadhana
          </motion.h3>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-16 md:w-20 h-0.5 mx-auto"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.8), transparent)',
              filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.4))'
            }}
          />
        </div>

        {/* Content with staggered fade-in */}
        <div className="space-y-2 md:space-y-3 relative z-10" style={{ fontFamily: '"Chakra Petch", Georgia, serif' }}>
          {contentLines.map((section, index) => {
            if (section.trim().endsWith(':')) {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                >
                  <div
                    className="font-semibold mb-1 text-sm md:text-base"
                    style={{
                      color: 'rgba(255, 223, 0, 0.95)',
                      textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                    }}
                  >
                    {section}
                  </div>
                </motion.div>
              );
            }
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                className="text-xs md:text-sm leading-relaxed pl-2"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              >
                {section}
              </motion.div>
            );
          })}
        </div>

        {/* Metallic texture overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 223, 0, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.04) 0%, transparent 40%),
              radial-gradient(circle at 40% 80%, rgba(255, 207, 0, 0.03) 0%, transparent 30%)
            `,
            opacity: 0.4
          }}
        />

        {/* Progress indicator dots during initialization */}
        {isInitializing && (
          <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-yellow-400"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))'
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Floating spiritual elements */}

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="absolute -bottom-2 md:-bottom-3 -left-2 md:-left-3 text-lg md:text-xl animate-pulse"
        style={{
          filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))'
        }}
      >
        🪔
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="absolute top-1/2 -left-4 md:-left-6 text-base md:text-lg animate-bounce"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))'
        }}
      >
        ✨
      </motion.div>
    </TransparentGlassMorphismContainer>
  );
};

export default AnimatedParchment;