import React, { useState, useEffect, useRef } from 'react';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  quality?: 'low' | 'medium' | 'high';
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  quality = 'medium',
  lazy = true,
  onLoad,
  onError,
  ...props // Spread remaining props to pass through to img element
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Quality to compression mapping
  const qualityMap = {
    low: 60,
    medium: 80,
    high: 90
  };

  // Generate WebP version if available
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  // Generate different sizes for responsive loading
  const generateSrcSet = () => {
    const baseName = src.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
    const extension = src.match(/\.(png|jpg|jpeg|webp|svg)$/i)?.[0] || '';
    
    if (extension === '.svg') {
      return undefined; // SVGs don't need srcset
    }
    
    return `
      ${baseName}-small${extension} 480w,
      ${baseName}-medium${extension} 768w,
      ${baseName}-large${extension} 1024w,
      ${baseName}-xlarge${extension} 1920w
    `.trim();
  };

  useEffect(() => {
    if (imgRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setLoaded(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before entering viewport
        }
      );

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      setLoaded(true);
    }
  }, []);

  if (error) {
    return (
      <div className={`bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <picture>
      {/* WebP version if available */}
      <source 
        srcSet={webpSrc} 
        type="image/webp" 
      />
      
      {/* Original image format */}
      <img
        ref={imgRef}
        src={loaded ? src : undefined}
        alt={alt}
        className={`${className} ${!loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        sizes={sizes}
        srcSet={generateSrcSet()}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => {
          setError(true);
          onError?.();
        }}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '1px 1px'
        }}
        {...props} // Spread remaining props
      />
    </picture>
  );
};

export default ResponsiveImage;