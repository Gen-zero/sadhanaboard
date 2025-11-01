import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onPinch?: (scale: number) => void;
  threshold?: number;
  longPressDelay?: number;
}

export const useTouchGestures = (options: TouchGestureOptions) => {
  const ref = useRef<HTMLElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [initialDistance, setInitialDistance] = useState<number>(0);
  const [currentScale, setCurrentScale] = useState<number>(1);

  const {
    threshold = 50,
    longPressDelay = 500,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onLongPress,
    onPinch
  } = options;

  // Calculate distance between two touch points
  const getDistance = (touch1: Touch, touch2: Touch) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Clear long press timer
  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const now = Date.now();
      
      // Clear any existing long press timer
      clearLongPressTimer();

      if (e.touches.length === 1) {
        // Single touch - potential swipe, tap, or long press
        setTouchStart({
          x: touch.clientX,
          y: touch.clientY,
          time: now
        });

        // Start long press timer
        if (onLongPress) {
          const timer = setTimeout(() => {
            onLongPress();
          }, longPressDelay);
          setLongPressTimer(timer);
        }
      } else if (e.touches.length === 2 && onPinch) {
        // Two touches - potential pinch
        const distance = getDistance(e.touches[0], e.touches[1]);
        setInitialDistance(distance);
        setCurrentScale(1);
        clearLongPressTimer();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Clear long press timer on move
      clearLongPressTimer();

      if (e.touches.length === 2 && onPinch && initialDistance > 0) {
        e.preventDefault();
        const distance = getDistance(e.touches[0], e.touches[1]);
        const scale = distance / initialDistance;
        setCurrentScale(scale);
        onPinch(scale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      clearLongPressTimer();

      if (!touchStart || e.touches.length > 0) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const deltaTime = Date.now() - touchStart.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Reset touch start
      setTouchStart(null);

      // Check if it's a tap (small movement and quick)
      if (distance < 10 && deltaTime < 200) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTap;

        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
          // Double tap
          if (onDoubleTap) {
            onDoubleTap();
          }
          setLastTap(0);
        } else {
          // Single tap
          if (onTap) {
            onTap();
          }
          setLastTap(now);
        }
        return;
      }

      // Check for swipe gestures
      if (distance > threshold) {
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        if (Math.abs(angle) < 45) {
          // Right swipe
          if (onSwipeRight) onSwipeRight();
        } else if (Math.abs(angle) > 135) {
          // Left swipe
          if (onSwipeLeft) onSwipeLeft();
        } else if (angle > 45 && angle < 135) {
          // Down swipe
          if (onSwipeDown) onSwipeDown();
        } else if (angle < -45 && angle > -135) {
          // Up swipe
          if (onSwipeUp) onSwipeUp();
        }
      }
    };

    // Add touch event listeners with passive: false for pinch gestures
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      clearLongPressTimer();
    };
  }, [touchStart, lastTap, longPressTimer, initialDistance, threshold, longPressDelay, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, onDoubleTap, onLongPress, onPinch, clearLongPressTimer]);

  return ref;
};

// Utility component for touch gesture areas
export const TouchGestureArea: React.FC<{
  children: React.ReactNode;
  className?: string;
  gestureOptions: TouchGestureOptions;
}> = ({ children, className, gestureOptions }) => {
  const ref = useTouchGestures(gestureOptions);
  
  return React.createElement(
    'div',
    {
      ref: ref as React.RefObject<HTMLDivElement>,
      className: `touch-manipulation ${className || ''}`,
    },
    children
  );
};