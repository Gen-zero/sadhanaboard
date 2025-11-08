import React from 'react';

const VishnuBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 opacity-30"
        style={{
          backgroundImage: `url('/themes/vishnu/assets/Bhagwan_Vishnu.png'), 
                            radial-gradient(circle at 20% 30%, rgba(64, 160, 255, 0.15) 0%, transparent 40%),
                            radial-gradient(circle at 80% 70%, rgba(0, 183, 255, 0.1) 0%, transparent 40%)`,
          backgroundSize: 'cover, cover, cover',
          backgroundPosition: 'center, center, center',
          backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
        }}
      />
      {/* Floating particles for divine effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400 opacity-20 animate-pulse"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VishnuBackground;