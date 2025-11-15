import React, { useState, useEffect, useRef } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const burnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const unrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentLines = content.trim().split('\n').filter(line => line.trim() !== '');
  const { colors } = useThemeColors();

  // Handle completion state change
  useEffect(() => {
    if (isCompleted && !isBurning) {
      startBurningAnimation();
    }
  }, [isCompleted]);

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

  const startBurningAnimation = () => {
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
  };

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
      <div className="flex justify-center items-center h-96">
        <div className="relative">
          {/* Spark effect */}
          <div className="w-4 h-4 bg-yellow-300 rounded-full animate-ping absolute opacity-75"></div>
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
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
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-orange-400 ember-rise"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
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
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gray-300 smoke-rise"
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                filter: 'blur(8px)'
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Paper Container - Transparent Golden Metallic styling like landing page */}
      <div 
        className={`relative p-6 rounded-2xl border-2 backdrop-blur-md transition-all duration-1000 ${
          isUnrolled ? 'parchment-unroll' : ''
        }`}
        style={{
          background: 'linear-gradient(145deg, rgba(255, 223, 0, 0.05) 0%, rgba(255, 215, 0, 0.08) 30%, rgba(255, 207, 0, 0.04) 70%, rgba(255, 199, 0, 0.06) 100%)',
          borderColor: 'rgba(255, 215, 0, 0.3)',
          fontFamily: 'Georgia, serif',
          boxShadow: `
            0 8px 32px rgba(255, 215, 0, 0.12),
            0 0 0 1px rgba(255, 215, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(255, 215, 0, 0.08)
          `,
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          transform: isBurning ? `scale(${1 - burnProgress / 200})` : 'scale(1)',
          filter: isBurning ? `blur(${burnProgress / 50}px)` : 'none'
        }}
      >
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
        
        {/* Enhanced ornate corners with golden metallic effect */}
        <div 
          className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.8)',
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
          }}
        />
        <div 
          className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.8)',
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
          }}
        />
        <div 
          className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.8)',
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
          }}
        />
        <div 
          className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg"
          style={{
            borderColor: 'rgba(255, 215, 0, 0.8)',
            filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
          }}
        />
        
        {/* Header with enhanced golden styling */}
        <div className="text-center mb-4 relative z-10">
          <h3 
            className="text-2xl font-bold mb-2" 
            style={{ 
              fontFamily: 'Georgia, serif',
              color: 'rgba(255, 223, 0, 0.95)',
              textShadow: '0 0 8px rgba(255, 215, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            🕉️ Sacred Sadhana
          </h3>
          <div 
            className="w-20 h-0.5 mx-auto"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.8), transparent)',
              filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.4))'
            }}
          />
        </div>

        {/* Content with enhanced golden metallic text */}
        <div className="space-y-3 relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
          {contentLines.map((section, index) => {
            // Check if this is a section header (ends with a colon)
            if (section.trim().endsWith(':')) {
              return (
                <div key={index}>
                  <div 
                    className="font-semibold mb-1 text-base"
                    style={{
                      color: 'rgba(255, 223, 0, 0.95)',
                      textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                    }}
                  >
                    {section}
                  </div>
                </div>
              );
            }
            // Otherwise it's regular content
            return (
              <div key={index} className="text-sm leading-relaxed pl-2"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              >
                {section}
              </div>
            );
          })}
        </div>

        {/* Enhanced metallic texture overlay */}
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
      </div>
      
      {/* Enhanced floating spiritual elements with golden glow */}
      <div 
        className="absolute -top-3 -right-3 text-2xl animate-pulse"
        style={{
          filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))',
          opacity: 0.8
        }}
      >
        🌸
      </div>
      <div 
        className="absolute -bottom-3 -left-3 text-xl animate-pulse"
        style={{
          filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))',
          opacity: 0.8
        }}
      >
        🪔
      </div>
      <div 
        className="absolute top-1/2 -left-6 text-lg animate-bounce"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
          opacity: 0.7
        }}
      >
        ✨
      </div>
    </div>
  );
};

export default AnimatedParchment;