import React from 'react';

const VishnuBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/themes/earth/assets/Bhagwan_Vishnu.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </div>
  );
};

export default VishnuBackground;