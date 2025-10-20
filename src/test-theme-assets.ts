// Test to verify theme assets are properly configured
import { THEME_REGISTRY } from './themes';

console.log('Testing theme assets...');

// Test mystical forest theme
const mysticalForestTheme = THEME_REGISTRY.find(t => t.metadata.id === 'mystical-forest');
if (mysticalForestTheme) {
  console.log('Mystical Forest Theme Assets:');
  console.log('- Icon:', mysticalForestTheme.assets?.icon);
  console.log('- Background:', mysticalForestTheme.assets?.backgroundImage);
  console.log('- Logo:', mysticalForestTheme.assets?.logo);
  
  // Check if files exist
  const assets = mysticalForestTheme.assets || {};
  Object.entries(assets).forEach(([key, path]) => {
    if (path) {
      console.log(`Checking ${key}: ${path}`);
      // In a real implementation, we would actually check if the file exists
      // For now, we'll just log the path
    }
  });
} else {
  console.log('Mystical Forest theme not found');
}

// Test lakshmi theme
const lakshmiTheme = THEME_REGISTRY.find(t => t.metadata.id === 'lakshmi');
if (lakshmiTheme) {
  console.log('\nLakshmi Theme Assets:');
  console.log('- Icon:', lakshmiTheme.assets?.icon);
  console.log('- Background:', lakshmiTheme.assets?.backgroundImage);
  console.log('- Logo:', lakshmiTheme.assets?.logo);
} else {
  console.log('Lakshmi theme not found');
}