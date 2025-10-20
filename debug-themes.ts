import { THEME_REGISTRY, debugThemes } from './src/themes';

console.log('Total themes in registry:', THEME_REGISTRY.length);

// List all theme IDs
console.log('Theme IDs:');
THEME_REGISTRY.forEach(theme => {
  console.log(`- ${theme.metadata.id} (${theme.metadata.name})`);
});

// Check specifically for mystical forest theme
const mysticalForestTheme = THEME_REGISTRY.find(t => t.metadata.id === 'mystical-forest');
console.log('\nMystical Forest Theme:', mysticalForestTheme ? 'FOUND' : 'NOT FOUND');

if (mysticalForestTheme) {
  console.log('\nMystical Forest Theme Details:');
  console.log('- ID:', mysticalForestTheme.metadata.id);
  console.log('- Name:', mysticalForestTheme.metadata.name);
  console.log('- Description:', mysticalForestTheme.metadata.description);
  console.log('- Category:', mysticalForestTheme.metadata.category);
  console.log('- Available:', mysticalForestTheme.available);
}

// Run the debug function
debugThemes();