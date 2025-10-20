import React from 'react';
import { getThemeById } from './themes';

const TestTaraImport: React.FC = () => {
  const [themeInfo, setThemeInfo] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const taraTheme = getThemeById('tara');
      if (taraTheme) {
        setThemeInfo({
          id: taraTheme.metadata.id,
          name: taraTheme.metadata.name,
          deity: taraTheme.metadata.deity,
          description: taraTheme.metadata.description
        });
      } else {
        setError('Tara theme not found');
      }
    } catch (err) {
      setError(`Error loading Tara theme: ${err.message}`);
    }
  }, []);

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  if (!themeInfo) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a2e', color: 'white' }}>
      <h2>Tara Theme Test</h2>
      <p>ID: {themeInfo.id}</p>
      <p>Name: {themeInfo.name}</p>
      <p>Deity: {themeInfo.deity}</p>
      <p>Description: {themeInfo.description}</p>
    </div>
  );
};

export default TestTaraImport;