import React from 'react';
import RadhaRaniBackground from './RadhaRaniBackground';

const TestRadhaBackground: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <RadhaRaniBackground className="fixed inset-0 pointer-events-none z-[-1]" />
      <div style={{ position: 'relative', zIndex: 10, padding: '20px', color: 'white' }}>
        <h1>Test Page</h1>
        <p>If you can see the Radha background, it's working!</p>
      </div>
    </div>
  );
};

export default TestRadhaBackground;