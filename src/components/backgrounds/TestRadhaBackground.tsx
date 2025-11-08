import React from 'react';

const TestRadhaBackground: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div className="fixed inset-0 pointer-events-none z-[-1]" style={{ backgroundColor: '#FFB6C1' }} />
      <div style={{ position: 'relative', zIndex: 10, padding: '20px', color: 'white' }}>
        <h1>Test Page</h1>
        <p>If you can see the pink background, it's working!</p>
      </div>
    </div>
  );
};

export default TestRadhaBackground;