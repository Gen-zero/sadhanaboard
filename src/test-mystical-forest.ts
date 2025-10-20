// Simple test to verify mystical forest theme is registered
import { THEME_REGISTRY } from './themes';

const mysticalForestTheme = THEME_REGISTRY.find(t => t.metadata.id === 'mystical-forest');

if (mysticalForestTheme) {
  console.log('SUCCESS: Mystical Forest theme is registered');
  console.log('Theme details:', {
    id: mysticalForestTheme.metadata.id,
    name: mysticalForestTheme.metadata.name,
    category: mysticalForestTheme.metadata.category,
    available: mysticalForestTheme.available
  });
} else {
  console.log('ERROR: Mystical Forest theme is not registered');
  console.log('Available themes:', THEME_REGISTRY.map(t => t.metadata.id));
}