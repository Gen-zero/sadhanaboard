import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    navigationTiming: null as PerformanceNavigationTiming | null
  });

  const startTime = useRef<number>(performance.now());
  const isMobile = useIsMobile();

  useEffect(() => {
    // Measure render time
    const renderTime = performance.now() - startTime.current;
    
    // Get memory usage if available
    const memoryUsage = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
    
    // Get navigation timing
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    setMetrics({
      renderTime,
      memoryUsage,
      navigationTiming
    });

    // Log performance issues on mobile
    if (isMobile && renderTime > 100) {
      console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);
    }
  }, [isMobile]);

  return metrics;
};

// Mobile-optimized debounced input
export const useDebouncedValue = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Network status hook for mobile
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState(
    (navigator as Navigator & { connection?: { effectiveType: string } }).connection?.effectiveType || 'unknown'
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleConnectionChange = () => {
      setConnectionType(
        (navigator as Navigator & { connection?: { effectiveType: string } }).connection?.effectiveType || 'unknown'
      );
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if ((navigator as Navigator & { connection?: EventTarget }).connection) {
      (navigator as Navigator & { connection?: EventTarget }).connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ((navigator as Navigator & { connection?: EventTarget }).connection) {
        (navigator as Navigator & { connection?: EventTarget }).connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  const isSlowConnection = ['slow-2g', '2g'].includes(connectionType);
  const isFastConnection = ['4g'].includes(connectionType);

  return {
    isOnline,
    connectionType,
    isSlowConnection,
    isFastConnection
  };
};

// Mobile battery optimization
export const useBatteryOptimization = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [shouldOptimize, setShouldOptimize] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      // Define proper type for Battery API
      type BatteryManager = {
        level: number;
        charging: boolean;
        addEventListener: (event: string, handler: () => void) => void;
        removeEventListener: (event: string, handler: () => void) => void;
      };
      
      type NavigatorWithBattery = Navigator & { getBattery?: () => Promise<BatteryManager> };
      
      const nav = navigator as NavigatorWithBattery;
      nav.getBattery?.().then((battery: BatteryManager) => {
        const updateBatteryInfo = () => {
          setBatteryLevel(battery.level);
          setIsCharging(battery.charging);
          setShouldOptimize(battery.level < 0.2 && !battery.charging);
        };

        updateBatteryInfo();
        battery.addEventListener('chargingchange', updateBatteryInfo);
        battery.addEventListener('levelchange', updateBatteryInfo);

        return () => {
          battery.removeEventListener('chargingchange', updateBatteryInfo);
          battery.removeEventListener('levelchange', updateBatteryInfo);
        };
      });
    }
  }, []);

  return {
    batteryLevel,
    isCharging,
    shouldOptimize // Reduce animations, lower refresh rates, etc.
  };
};