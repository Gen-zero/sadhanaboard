import { useState, useEffect } from 'react';

interface DeityIconProps {
  src: string;
  alt: string;
  className?: string;
}

const DeityIcon = ({ src, alt, className = '' }: DeityIconProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  if (error) {
    return (
      <div className={`bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center ${className}`}>
        <span className="text-xs text-gray-500">Icon</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      style={{ background: 'transparent' }}
    />
  );
};

export default DeityIcon;