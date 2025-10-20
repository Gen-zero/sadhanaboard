import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';

interface AnimatedParchmentProps {
  content: string;
  onComplete?: () => void;
  isCompleted?: boolean;
  showControls?: boolean; // New prop to show/hide controls
}

const AnimatedParchment: React.FC<AnimatedParchmentProps> = ({ 
  content, 
  onComplete,
  isCompleted = false,
  showControls = false // Default to false for backward compatibility
}) => {
  const [isBurning, setIsBurning] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0);
  const [showParchment, setShowParchment] = useState(true);
  const [showSpark, setShowSpark] = useState(false);
  const [isUnrolled, setIsUnrolled] = useState(false); // Track unroll state
  const burnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const unrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentLines = content.trim().split('\n').filter(line => line.trim() !== '');

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

  // Manual control functions
  const triggerUnroll = () => {
    setIsUnrolled(true);
  };

  const triggerBurn = () => {
    if (!isBurning) {
      startBurningAnimation();
    }
  };

  const resetAnimation = () => {
    // Clear any existing intervals/timeouts
    if (burnIntervalRef.current) {
      clearInterval(burnIntervalRef.current);
      burnIntervalRef.current = null;
    }
    
    if (unrollTimeoutRef.current) {
      clearTimeout(unrollTimeoutRef.current);
    }
    
    // Reset all states
    setIsBurning(false);
    setBurnProgress(0);
    setShowParchment(true);
    setShowSpark(false);
    setIsUnrolled(false);
    
    // Re-trigger unroll after a short delay
    unrollTimeoutRef.current = setTimeout(() => {
      setIsUnrolled(true);
    }, 100);
  };

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
      {/* Control buttons - only shown when showControls is true */}
      {showControls && (
        <div className="flex justify-center gap-2 mb-4">
          <Button 
            onClick={triggerUnroll}
            disabled={isUnrolled}
            className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30"
          >
            <Play className="h-4 w-4 mr-2" />
            Unroll
          </Button>
          <Button 
            onClick={triggerBurn}
            disabled={isBurning}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
          >
            <Flame className="h-4 w-4 mr-2" />
            Burn
          </Button>
          <Button 
            onClick={resetAnimation}
            className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
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

      {/* Parchment content */}
      <div 
        className={`relative overflow-hidden rounded-lg shadow-xl transition-all duration-1000 ${
          isUnrolled ? 'parchment-unroll' : ''
        } ${
          isBurning ? 'opacity-100' : 'opacity-100'
        }`}
        style={{
          transform: isBurning ? `scale(${1 - burnProgress / 200})` : 'scale(1)',
          filter: isBurning ? `blur(${burnProgress / 50}px)` : 'none'
        }}
      >
        {/* Parchment background with texture */}
        <div 
          className="bg-[url('/textures/parchment.jpg')] bg-cover bg-center p-8 sm:p-10 relative"
          style={{ 
            minHeight: '400px',
            boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.4)' // Changed shadow color to white
          }}
        >
          {/* Gold ornamental border */}
          <div className="absolute inset-0 border-[12px] border-[rgba(255,215,0,0.4)] rounded-lg pointer-events-none"></div>
          
          {/* Glowing mandala patterns in background */}
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            {/* Center mandala */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="gold" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="gold" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="gold" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="gold" strokeWidth="0.5" />
                <polygon points="50,5 65,35 95,35 72,55 80,90 50,70 20,90 28,55 5,35 35,35" fill="none" stroke="gold" strokeWidth="0.5" />
              </svg>
            </div>
            
            {/* Corner mandalas */}
            <div className="absolute top-4 left-4 w-16 h-16">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="gold" strokeWidth="1" />
                <path d="M50 10 L50 90 M10 50 L90 50" stroke="gold" strokeWidth="1" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="gold" strokeWidth="1" />
              </svg>
            </div>
            
            <div className="absolute bottom-4 right-4 w-16 h-16">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="gold" strokeWidth="1" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="gold" strokeWidth="1" />
                <path d="M25,25 L75,75 M25,75 L75,25" stroke="gold" strokeWidth="1" />
              </svg>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 font-serif space-y-4 text-white"> {/* Changed text color to white */}
            {contentLines.map((section, index) => {
              // Check if this is a section header (ends with a colon)
              if (section.trim().endsWith(':')) {
                return (
                  <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-white opacity-100 first:mt-0 animate-ink-appear"> {/* Changed text color to white */}
                    {section}
                  </h3>
                );
              }
              // Otherwise it's regular content
              return (
                <p key={index} className="leading-relaxed animate-ink-appear opacity-100" style={{ animationDelay: `${index * 0.2}s`, color: 'white' }}> {/* Changed text color to white */}
                  {section}
                </p>
              );
            })}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-16 h-16 opacity-30 pointer-events-none">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#36454F" strokeWidth="2" />
              <path d="M50 10 L50 90 M10 50 L90 50" stroke="#36454F" strokeWidth="2" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#36454F" strokeWidth="2" />
            </svg>
          </div>
          
          <div className="absolute bottom-4 right-4 w-16 h-16 opacity-30 pointer-events-none">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#36454F" strokeWidth="2" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="#36454F" strokeWidth="2" />
              <path d="M25,25 L75,75 M25,75 L75,25" stroke="#36454F" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Shadow effect */}
      <div className="absolute -bottom-4 left-4 right-4 h-8 bg-white/40 blur-xl rounded-full z-0"></div> {/* Changed shadow color to white */}
      
      {/* Soft glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/50 via-orange-500/50 to-red-500/50 rounded-lg blur-xl opacity-100 -z-10 transition-opacity duration-1000 parchment-glow"></div>
    </div>
  );
};

export default AnimatedParchment;