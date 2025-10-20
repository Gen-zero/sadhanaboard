
import React from 'react';

const CosmicBackground = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-20">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl animate-pulse-slow bg-primary/50"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full filter blur-3xl animate-pulse-slow bg-accent/50" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full filter blur-3xl animate-pulse-slow bg-secondary/60" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default CosmicBackground;
