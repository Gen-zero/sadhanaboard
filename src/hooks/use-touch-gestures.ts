import { useEffect, useRef } from 'react';
import { detectSwipe, detectLongPress, detectDoubleTap, addRippleEffect } from '@/utils/touch-utils';

// Hook for handling touch gestures
export const useTouchGestures = (
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', distance: number) => void,
  onLongPress?: () => void,
  onDoubleTap?: () => void,
  enableRipple?: boolean
) => {
  const elementRef = useRef<HTMLElement>(null);
  const cleanupFunctions = useRef<(() => void)[]>([]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Cleanup previous event listeners
    cleanupFunctions.current.forEach(cleanup => cleanup());
    cleanupFunctions.current = [];

    // Add swipe detection
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!onSwipe) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const swipe = detectSwipe(startX, startY, endX, endY);
      if (swipe) {
        onSwipe(swipe.direction, swipe.distance);
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    cleanupFunctions.current.push(() => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    });

    // Add long press detection
    if (onLongPress) {
      const cleanupLongPress = detectLongPress(element, onLongPress);
      cleanupFunctions.current.push(cleanupLongPress);
    }

    // Add double tap detection
    if (onDoubleTap) {
      const cleanupDoubleTap = detectDoubleTap(element, onDoubleTap);
      cleanupFunctions.current.push(cleanupDoubleTap);
    }

    // Add ripple effect
    if (enableRipple) {
      const cleanupRipple = addRippleEffect(element);
      cleanupFunctions.current.push(cleanupRipple);
    }

    // Cleanup on unmount
    return () => {
      cleanupFunctions.current.forEach(cleanup => cleanup());
      cleanupFunctions.current = [];
    };
  }, [onSwipe, onLongPress, onDoubleTap, enableRipple]);

  return elementRef;
};

// Hook for preventing input zoom on mobile
export const usePreventInputZoom = (shouldPrevent = true) => {
  useEffect(() => {
    if (!shouldPrevent) return;

    const viewport = document.querySelector('meta[name="viewport"]');
    const originalContent = viewport?.getAttribute('content') || '';

    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    return () => {
      if (viewport) {
        viewport.setAttribute('content', originalContent);
      }
    };
  }, [shouldPrevent]);
};