import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHelp } from '@/contexts/HelpContext';

interface OnboardingTooltipProps {
  title: string;
  content: string;
  targetElementId: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  highlightElement?: boolean;
  onDismiss?: () => void;
}

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  title,
  content,
  targetElementId,
  position = 'bottom',
  highlightElement = true,
  onDismiss
}) => {
  const { 
    isOnboardingActive, 
    stopOnboarding, 
    nextOnboardingStep, 
    prevOnboardingStep,
    currentOnboardingStep,
    totalOnboardingSteps
  } = useHelp();
  
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetElementRef = useRef<HTMLElement | null>(null);

  // Find the target element
  useEffect(() => {
    targetElementRef.current = document.getElementById(targetElementId);
    
    // Scroll to the target element if it exists
    if (targetElementRef.current && isOnboardingActive) {
      targetElementRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [targetElementId, isOnboardingActive]);

  // Handle escape key to dismiss
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOnboardingActive) {
        stopOnboarding();
        onDismiss?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOnboardingActive, stopOnboarding, onDismiss]);

  if (!isOnboardingActive) return null;

  // Calculate position relative to target element
  const getPositionStyles = () => {
    if (!targetElementRef.current) return {};
    
    const targetRect = targetElementRef.current.getBoundingClientRect();
    const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
    const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
    
    switch (position) {
      case 'top':
        return {
          top: targetRect.top - tooltipHeight - 10,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.right + 10
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - 10
        };
      case 'bottom':
      default:
        return {
          top: targetRect.bottom + 10,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2
        };
    }
  };

  const positionStyles = getPositionStyles();

  return (
    <AnimatePresence>
      {isOnboardingActive && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
            onClick={stopOnboarding}
          />
          
          {/* Highlight target element */}
          {highlightElement && targetElementRef.current && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[9998] border-2 border-yellow-400 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] pointer-events-none"
              style={{
                top: targetElementRef.current.offsetTop,
                left: targetElementRef.current.offsetLeft,
                width: targetElementRef.current.offsetWidth,
                height: targetElementRef.current.offsetHeight
              }}
            />
          )}
          
          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-[9999] w-80 p-5 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-2xl"
            style={positionStyles}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-full">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-white/80">
                  Step {currentOnboardingStep + 1} of {totalOnboardingSteps}
                </span>
              </div>
              <button
                onClick={() => {
                  stopOnboarding();
                  onDismiss?.();
                }}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Content */}
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-white/90">{content}</p>
            </div>
            
            {/* Progress bar */}
            <div className="mb-4">
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((currentOnboardingStep + 1) / totalOnboardingSteps) * 100}%` 
                  }}
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {currentOnboardingStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevOnboardingStep}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    stopOnboarding();
                    onDismiss?.();
                  }}
                  className="text-white hover:bg-white/20"
                >
                  Skip
                </Button>
                
                <Button
                  size="sm"
                  onClick={currentOnboardingStep === totalOnboardingSteps - 1 ? stopOnboarding : nextOnboardingStep}
                  className="bg-white text-purple-600 hover:bg-white/90"
                >
                  {currentOnboardingStep === totalOnboardingSteps - 1 ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Arrow */}
            <div 
              className={`
                absolute w-4 h-4 bg-gradient-to-br from-purple-600 to-fuchsia-600 
                rotate-45 border border-white/20
                ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-2' : ''}
                ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-2' : ''}
                ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-2' : ''}
                ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-2' : ''}
              `}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTooltip;