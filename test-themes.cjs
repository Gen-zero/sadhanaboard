// Simple test to verify themes are loaded correctly
const fs = require('fs');
const path = require('path');

// Check if theme CSS file exists and has content
const themeCssPath = path.join(__dirname, 'src', 'styles', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  const cssContent = fs.readFileSync(themeCssPath, 'utf8');
  console.log('Theme CSS file exists and has', cssContent.length, 'characters');
  
  // Check for specific theme classes
  const themes = ['default', 'ganesha', 'serenity', 'vishnu', 'cosmos', 'neon'];
  themes.forEach(theme => {
    const hasTheme = cssContent.includes(`.theme-${theme}`);
    console.log(`Theme ${theme}:`, hasTheme ? '✓ Found' : '✗ Missing');
  });
} else {
  console.log('Theme CSS file not found!');
}

// Check theme registry
const themeRegistryPath = path.join(__dirname, 'src', 'themes', 'index.ts');
if (fs.existsSync(themeRegistryPath)) {
  const registryContent = fs.readFileSync(themeRegistryPath, 'utf8');
  console.log('\nTheme Registry file exists');
  
  // Check for theme imports
  const themes = ['default', 'ganesha', 'serenity', 'vishnu', 'cosmos', 'neon'];
  themes.forEach(theme => {
    const hasImport = registryContent.includes(`import ${theme}Theme from './${theme}'`);
    console.log(`Import ${theme}:`, hasImport ? '✓ Found' : '✗ Missing');
  });
  
  // Check for theme in RAW_THEME_REGISTRY
  themes.forEach(theme => {
    const inRegistry = registryContent.includes(`${theme}Theme,`);
    console.log(`Registry ${theme}:`, inRegistry ? '✓ Registered' : '✗ Not registered');
  });
} else {
  console.log('Theme Registry file not found!');
}