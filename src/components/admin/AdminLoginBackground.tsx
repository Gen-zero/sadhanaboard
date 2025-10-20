import React from 'react';
import '@/styles/cosmic.css';
import '@/styles/enhanced-effects.css';

const AdminLoginBackground: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none admin-bg-layer">
        {/* subtle nebula */}
        <div className="absolute inset-0 cosmic-nebula-bg" />

        {/* sacred geometry */}
        <svg className="absolute left-8 top-10 sacred-geometry" width="320" height="320" viewBox="0 0 200 200" fill="none" aria-hidden>
          <g stroke="rgba(255,215,0,0.06)" strokeWidth="0.6">
            <circle cx="100" cy="100" r="40" />
            <circle cx="100" cy="100" r="70" />
            <polygon points="100,30 150,100 100,170 50,100" />
          </g>
        </svg>


      </div>
    </>
  );
};

export default AdminLoginBackground;
