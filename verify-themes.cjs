const fs = require('fs');
const path = require('path');

// Read the theme CSS file
const themeCssPath = path.join(__dirname, 'src', 'styles', 'theme.css');
const cssContent = fs.readFileSync(themeCssPath, 'utf8');

console.log('Verifying theme definitions in CSS file...\n');

// Check for specific theme classes
const themes = ['default', 'ganesha', 'serenity', 'vishnu', 'cosmos', 'neon'];
themes.forEach(theme => {
  const hasTheme = cssContent.includes(`.theme-${theme} {`);
  console.log(`Theme ${theme}:`, hasTheme ? '✓ Found' : '✗ Missing');
  
  if (hasTheme) {
    // Extract the theme definition
    const themeStart = cssContent.indexOf(`.theme-${theme} {`);
    const themeEnd = cssContent.indexOf('}', themeStart) + 1;
    const themeDefinition = cssContent.substring(themeStart, themeEnd);
    console.log(`  Definition length: ${themeDefinition.length} characters`);
  }
});

console.log('\nVerifying theme registry...\n');

// Check theme registry
const themeRegistryPath = path.join(__dirname, 'src', 'themes', 'index.ts');
const registryContent = fs.readFileSync(themeRegistryPath, 'utf8');

// Check for theme imports
themes.forEach(theme => {
  const hasImport = registryContent.includes(`import ${theme}Theme from './${theme}'`);
  console.log(`Import ${theme}:`, hasImport ? '✓ Found' : '✗ Missing');
});

// Check for theme in RAW_THEME_REGISTRY
themes.forEach(theme => {
  const inRegistry = registryContent.includes(`${theme}Theme,`);
  console.log(`Registry ${theme}:`, inRegistry ? '✓ Registered' : '✗ Not registered');
});

console.log('\nVerification complete!');