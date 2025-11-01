import React, { useEffect, useState } from 'react';
import { getThemeById } from '../themes';

interface ThemeInfo {
  id: string;
  name: string;
  available: boolean;
  hasBackground: boolean;
  assets?: {
    icon?: string;
    backgroundImage?: string;
  };
}

const ThemeDebugger: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('default');
  const [themeInfo, setThemeInfo] = useState<ThemeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check what theme is actually being used
      const bodyClasses = document.body.className;
      console.log('Body classes:', bodyClasses);
      
      // Check if tara theme can be loaded
      const taraTheme = getThemeById('tara');
      console.log('Tara theme loaded:', taraTheme);
      
      if (taraTheme) {
        setThemeInfo({
          id: taraTheme.metadata.id,
          name: taraTheme.metadata.name,
          available: taraTheme.available,
          hasBackground: !!taraTheme.BackgroundComponent,
          assets: taraTheme.assets
        });
        
        // Test if background component can be instantiated
        if (taraTheme.BackgroundComponent) {
          console.log('Background component exists:', taraTheme.BackgroundComponent);
        }
      } else {
        setError('Tara theme not found in registry');
      }
    } catch (err: unknown) {
      setError(`Error: ${(err as Error).message}`);
      console.error('Theme debug error:', err);
    }
  }, []);

  const testSetTaraTheme = () => {
    try {
      // Manually add theme class to test
      document.body.classList.add('theme-tara');
      setCurrentTheme('tara');
      console.log('Applied theme-tara class manually');
    } catch (err: unknown) {
      setError(`Error applying theme: ${(err as Error).message}`);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '15px', 
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999 
    }}>
      <h3>Theme Debugger</h3>
      <p><strong>Current:</strong> {currentTheme}</p>
      
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      
      {themeInfo && (
        <div>
          <p><strong>Tara Theme Info:</strong></p>
          <p>ID: {themeInfo.id}</p>
          <p>Name: {themeInfo.name}</p>
          <p>Available: {themeInfo.available ? 'Yes' : 'No'}</p>
          <p>Has Background: {themeInfo.hasBackground ? 'Yes' : 'No'}</p>
          <p>Icon: {themeInfo.assets?.icon}</p>
          <p>Background Image: {themeInfo.assets?.backgroundImage}</p>
        </div>
      )}
      
      <button 
        onClick={testSetTaraTheme}
        style={{ 
          marginTop: '10px', 
          padding: '5px 10px', 
          backgroundColor: '#0066ff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        Test Apply Tara Theme
      </button>
    </div>
  );
};

export default ThemeDebugger;