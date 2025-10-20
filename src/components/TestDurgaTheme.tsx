import React from 'react';
import { useSettings } from '@/hooks/useSettings';

const TestDurgaTheme: React.FC = () => {
  const { settings } = useSettings();
  
  return (
    <div className="min-h-screen p-8 theme-durga">
      <h1 className="text-3xl font-bold mb-4 heading-text">Durga Theme Test</h1>
      <p className="mb-4">Current theme: {settings?.appearance?.colorScheme || 'default'}</p>
      
      {/* Test the animated Sanskrit words */}
      <div className="mt-8 p-4 bg-black bg-opacity-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 heading-text">Animated Sanskrit Words:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-2xl font-bold durga-animated-text">शक्ति</div>
          <div className="text-2xl font-bold durga-animated-text">महिषासुरमर्दिनी</div>
          <div className="text-2xl font-bold durga-animated-text">अम्बा</div>
          <div className="text-2xl font-bold durga-animated-text">दुर्गा</div>
          <div className="text-2xl font-bold durga-animated-text">भवानी</div>
        </div>
      </div>
    </div>
  );
};

export default TestDurgaTheme;