import React, { useState, useEffect, useRef, memo, lazy, Suspense } from 'react';
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

// Lazy loading component wrapper
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  onLoad?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = memo(({ 
  src, 
  alt, 
  placeholderSrc, 
  className, 
  onLoad,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div ref={targetRef as React.RefObject<HTMLDivElement>} className={className}>
      {hasIntersected && !error && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      {!hasIntersected && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt={alt}
          className="blur-sm opacity-50"
          {...props}
        />
      )}
      {error && (
        <div className="bg-muted flex items-center justify-center text-muted-foreground">
          Failed to load image
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// Mobile skeleton loader
interface MobileSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
  animated?: boolean;
}

export const MobileSkeleton: React.FC<MobileSkeletonProps> = ({
  className = '',
  lines = 1,
  height = '1rem',
  width = '100%',
  animated = true
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-muted rounded ${
            animated ? 'mobile-skeleton' : ''
          }`}
          style={{
            height,
            width: index === lines - 1 ? `${Math.random() * 30 + 60}%` : width
          }}
        />
      ))}
    </div>
  );
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

// Mobile-optimized virtual list
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-auto mobile-scroll ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

// Mobile-optimized image loading with WebP support
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  webpSrc?: string;
  alt: string;
  placeholder?: string;
  quality?: 'low' | 'medium' | 'high';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  webpSrc,
  alt,
  placeholder,
  quality = 'medium',
  className,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver();
  const { isSlowConnection } = useNetworkStatus();

  // Check WebP support
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  };

  useEffect(() => {
    if (!hasIntersected) return;

    const img = new Image();
    
    // Use WebP if supported and available
    const sourceUrl = supportsWebP() && webpSrc ? webpSrc : src;
    
    // Adjust quality based on connection
    let finalUrl = sourceUrl;
    if (isSlowConnection && quality === 'high') {
      // Could implement URL parameter manipulation for lower quality
      finalUrl = sourceUrl;
    }

    img.onload = () => {
      setImageSrc(finalUrl);
      setIsLoaded(true);
    };

    img.src = finalUrl;
  }, [hasIntersected, src, webpSrc, isSlowConnection, quality]);

  return (
    <div ref={targetRef as React.RefObject<HTMLDivElement>} className={className}>
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
};

// Lazy loading wrapper for components
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <MobileSkeleton lines={3} />,
  threshold = 0.1
}) => {
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin: '100px'
  });

  return (
    <div ref={targetRef as React.RefObject<HTMLDivElement>}>
      {hasIntersected ? children : fallback}
    </div>
  );
};

// Mobile battery optimization
export const useBatteryOptimization = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [shouldOptimize, setShouldOptimize] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
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