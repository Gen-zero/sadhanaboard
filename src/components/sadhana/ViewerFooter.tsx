
import React from 'react';

const ViewerFooter = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-purple-900/50 to-transparent text-white text-center">
      <div className="max-w-md mx-auto space-y-2">
        <p className="text-sm font-light tracking-wider opacity-90">
          Your Saadhana details inscribed upon the cosmic scroll, empowered by the sacred yantra to manifest your intentions across dimensions
        </p>
        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div 
              key={dot} 
              className="w-1.5 h-1.5 bg-white rounded-full opacity-70"
              style={{ 
                animation: `pulse 2s infinite`,
                animationDelay: `${dot * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewerFooter;
