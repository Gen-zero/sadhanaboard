import { useState, useEffect, useRef } from 'react';

interface EnhancedDeityIconProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  hasAura?: boolean;
  glowColor?: string;
}

const EnhancedDeityIcon = ({ 
  src, 
  alt, 
  className = '',
  size = 'md',
  hasAura = true,
  glowColor = 'from-purple-500/30 to-pink-500/30'
}: EnhancedDeityIconProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Size mapping
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
    xxl: 'h-24 w-24'
  };

  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setError(false);
    
    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setLoaded(true);
            if (imgRef.current) {
              imgRef.current.src = src;
            }
          };
          img.onerror = () => setError(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  // Fallback icon component
  const FallbackIcon = () => (
    <div className={`${sizeClasses[size]} ${className} bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center relative`}>
      {hasAura && (
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${glowColor} animate-pulse`}></div>
      )}
      <span className="text-xs text-gray-500 font-medium relative z-10">Deity</span>
    </div>
  );

  if (error) {
    return <FallbackIcon />;
  }

  return (
    <div className={`relative ${hasAura ? 'divine-aura' : ''}`}>
      {hasAura && (
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${glowColor} animate-pulse blur-md`}></div>
      )}
      <img
        ref={imgRef}
        alt={alt}
        className={`${sizeClasses[size]} ${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 relative z-10 rounded-full`}
        style={{ background: 'transparent' }}
        loading="lazy"
      />
      {/* Additional spiritual elements */}
      {hasAura && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-pulse"></div>
          <div className="absolute -inset-2 rounded-full border border-purple-500/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}
    </div>
  );
};

export default EnhancedDeityIcon;