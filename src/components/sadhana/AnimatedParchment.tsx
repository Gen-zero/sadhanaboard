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

      {/* Paper Container - Optimized for mobile - Updated to Glass/Cosmic Aesthetic */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-1000 min-h-[20rem] sm:min-h-[24rem] md:min-h-[26rem] flex flex-col ${isUnrolled ? 'parchment-unroll' : ''
          } bg-gradient-to-br from-gray-900/70 to-black/70 border-purple-500/20 shadow-xl`}
        style={{
          fontFamily: '"Chakra Petch", sans-serif',
          boxShadow: `
            0 4px 20px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            ${isInitializing ? '0 0 30px rgba(124, 58, 237, 0.2)' : 'none'}
          `,
          transform: isBurning ? `scale(${1 - burnProgress / 200})` : 'scale(1)',
          filter: glitchActive ? 'hue-rotate(20deg) contrast(1.2)' : (isBurning ? `blur(${burnProgress / 50}px)` : 'none'),
          transition: 'filter 0.1s, box-shadow 0.3s'
        }}
      >
        {/* Tech grid overlay - Cosmic Purple */}
        {isInitializing && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
        )}

        {/* Space/Cosmic overlay gradient */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(139, 92, 246, 0.05) 0%, 
                transparent 25%, 
                rgba(236, 72, 153, 0.05) 50%, 
                transparent 75%, 
                rgba(59, 130, 246, 0.05) 100%
              )
            `,
            opacity: 0.5
          }}
        />

        {/* Enhanced ornate corners with initialization glow - Cosmic Gold */}
        <div
          className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.6)',
            filter: `drop-shadow(0 0 ${isInitializing ? '8' : '4'}px rgba(255, 215, 0, 0.3))`,
            transition: 'filter 0.3s'
          }}
        />
        <div
          className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.6)',
            filter: `drop-shadow(0 0 ${isInitializing ? '8' : '4'}px rgba(255, 215, 0, 0.3))`,
            transition: 'filter 0.3s'
          }}
        />
        <div
          className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.6)',
            filter: `drop-shadow(0 0 ${isInitializing ? '8' : '4'}px rgba(255, 215, 0, 0.3))`,
            transition: 'filter 0.3s'
          }}
        />
        <div
          className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.6)',
            filter: `drop-shadow(0 0 ${isInitializing ? '8' : '4'}px rgba(255, 215, 0, 0.3))`,
            transition: 'filter 0.3s'
          }}
        />

        {/* Header */}
        <div className="text-center mb-6 relative z-10 pt-4">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-2xl font-bold mb-3"
            style={{
              fontFamily: '"Chakra Petch", sans-serif',
              color: 'rgba(255, 223, 0, 1)',
              textShadow: `0 0 ${isInitializing ? '12' : '8'}px rgba(255, 215, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)`
            }}
          >
            🕉️ Sacred Sadhana
          </motion.h3>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          />
        </div>

        {/* Content with staggered fade-in and better spacing */}
        <div className="space-y-4 px-4 md:px-8 relative z-10 pb-6" style={{ fontFamily: '"Chakra Petch", sans-serif' }}>
          {contentLines.map((section, index) => {
            if (section.trim().endsWith(':')) {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  className="mt-4 first:mt-0"
                >
                  <div
                    className="font-bold mb-2 text-base md:text-lg tracking-wide border-b border-purple-500/20 pb-1 w-fit"
                    style={{
                      color: 'rgba(192, 132, 252, 1)', // Purple-300 like
                      textShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    {section.replace(':', '')}
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
                className="text-sm md:text-base leading-relaxed pl-2 font-light"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {section}
              </motion.div>
            );
          })}
        </div>

        {/* Subtle Cosmic Background Texture */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 60%)
            `,
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
