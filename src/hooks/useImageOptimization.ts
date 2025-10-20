import { useState, useEffect } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  width?: number;
  height?: number;
  resize?: boolean;
}

interface OptimizedImageResult {
  src: string;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for optimizing images based on device capabilities and preferences
 */
export const useImageOptimization = (
  originalSrc: string,
  options: ImageOptimizationOptions = {}
): OptimizedImageResult => {
  const [result, setResult] = useState<OptimizedImageResult>({
    src: originalSrc,
    loading: true,
    error: null
  });

  useEffect(() => {
    const optimizeImage = async () => {
      try {
        // For now, we'll return the original src but with optimization parameters
        // In a production environment, this would connect to an image optimization service
        
        // Check if browser supports WebP
        const supportsWebP = await checkWebPSupport();
        const supportsAVIF = await checkAVIFSupport();
        
        // Determine best format
        let format = options.format || 'auto';
        if (format === 'auto') {
          if (supportsAVIF) {
            format = 'avif';
          } else if (supportsWebP) {
            format = 'webp';
          } else {
            // Extract original format
            const ext = originalSrc.split('.').pop()?.toLowerCase();
            format = ext as 'png' | 'jpg' || 'png';
          }
        }
        
        // Build optimized URL
        const optimizedSrc = buildOptimizedUrl(originalSrc, {
          ...options,
          format
        });
        
        setResult({
          src: optimizedSrc,
          loading: false,
          error: null
        });
      } catch (err) {
        console.warn('Image optimization failed, using original:', err);
        setResult({
          src: originalSrc,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    };
    
    optimizeImage();
  }, [originalSrc, options]);
  
  return result;
};

/**
 * Check if browser supports WebP format
 */
const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Check if browser supports AVIF format
 */
const checkAVIFSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAAAESAAAAAEAAAEWAAAAAQAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACJtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
  });
};

/**
 * Build optimized image URL with parameters
 */
const buildOptimizedUrl = (
  src: string,
  options: ImageOptimizationOptions & { format: string }
): string => {
  // For local development, we'll just return the src with potential format conversion
  if (typeof window === 'undefined') {
    return src;
  }
  
  // If we're using a format that's different from the original, try to convert
  const ext = src.split('.').pop()?.toLowerCase() || '';
  const { format, quality = 80, width, height, resize = false } = options;
  
  // If format is different, try to change extension
  let optimizedSrc = src;
  if (format !== ext && format !== 'auto') {
    optimizedSrc = src.replace(/\.[^/.]+$/, `.${format}`);
  }
  
  // In a real implementation, we would add query parameters for optimization
  // For now, we'll just return the potentially format-converted URL
  return optimizedSrc;
};

/**
 * Preload images for better performance
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Generate multiple sizes for responsive images
 */
export const generateResponsiveSizes = (
  baseSrc: string,
  sizes: { width: number; height?: number }[]
): string => {
  return sizes.map(({ width, height }) => {
    const sizeSrc = baseSrc.replace(/\.(png|jpg|jpeg|webp|svg)$/i, (match) => 
      `-w${width}h${height || ''}${match}`
    );
    return `${sizeSrc} ${width}w`;
  }).join(', ');
};