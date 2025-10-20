import React from 'react';
import MysticalForestTest from '@/components/MysticalForestTest';

const MysticalForestTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-6">Mystical Forest Theme Test Page</h1>
      <MysticalForestTest />
    </div>
  );
};

export default MysticalForestTestPage;