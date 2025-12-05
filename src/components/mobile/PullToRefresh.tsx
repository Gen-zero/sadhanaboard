import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
  disabled = false,
  className = ''
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const isPullingRef = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    // Only start pull-to-refresh if we're at the top of the page
    if (window.scrollY > 0) return;
    
    startYRef.current = e.touches[0].clientY;
    isPullingRef.current = true;
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing || !isPullingRef.current) return;
    
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;
    
    // Only allow pulling down
    if (deltaY > 0 && window.scrollY === 0) {
      e.preventDefault();
      
      // Apply resistance to the pull
      const resistance = Math.min(deltaY * 0.5, threshold * 1.5);
      setPullDistance(resistance);
      setCanRefresh(resistance >= threshold);
    }
  }, [disabled, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || !isPullingRef.current) return;
    
    isPullingRef.current = false;
    
    if (canRefresh && pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    // Reset states
    setPullDistance(0);
    setCanRefresh(false);
  }, [disabled, isRefreshing, canRefresh, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
    container.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
    container.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart as EventListener);
      container.removeEventListener('touchmove', handleTouchMove as EventListener);
      container.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);


  // Calculate refresh indicator progress
  const progress = Math.min(pullDistance / threshold, 1);
  const opacity = Math.min(pullDistance / (threshold * 0.5), 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ 
              opacity: opacity,
              y: Math.min(pullDistance - 60, 0)
            }}
            exit={{ opacity: 0, y: -60 }}
            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center py-4"
          >
            <div className="flex flex-col items-center space-y-2">
              {/* Refresh icon */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  canRefresh
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted text-muted-foreground bg-background/80'
                } ${isRefreshing ? 'animate-spin' : ''}`}
              >
                {isRefreshing ? (
                  <RefreshCw className="w-5 h-5" />
                ) : canRefresh ? (
                  <RefreshCw className="w-5 h-5" />
                ) : (
                  <ArrowDown 
                    className="w-5 h-5 transition-transform duration-200"
                    style={{ transform: `rotate(${progress * 180}deg)` }}
                  />
                )}
              </div>
              
              {/* Status text */}
              <motion.p
                animate={{ opacity: opacity }}
                className="text-xs font-medium text-center px-4"
              >
                {isRefreshing
                  ? 'Refreshing...'
                  : canRefresh
                  ? 'Release to refresh'
                  : 'Pull to refresh'
                }
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with pull distance offset */}
      <motion.div
        animate={{
          y: isRefreshing ? 60 : Math.min(pullDistance * 0.3, 30)
        }}
        transition={{ 
          type: isRefreshing ? 'spring' : 'tween',
          duration: isRefreshing ? 0.3 : 0
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;