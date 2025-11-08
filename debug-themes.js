const fs = require('fs');
const path = require('path');

// Read the theme registry file
const themeRegistryPath = path.join(__dirname, 'src', 'themes', 'index.ts');
const themeRegistryContent = fs.readFileSync(themeRegistryPath, 'utf8');

console.log('Theme Registry Content:');
console.log(themeRegistryContent);

// Check if all theme files exist
const themesDir = path.join(__dirname, 'src', 'themes');
const themeDirs = fs.readdirSync(themesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== 'shared')
  .map(dirent => dirent.name);

console.log('\nTheme Directories:');
themeDirs.forEach(dir => {
  console.log(`- ${dir}`);
  
  // Check if index.ts exists
  const indexPath = path.join(themesDir, dir, 'index.ts');
  if (fs.existsSync(indexPath)) {
    console.log(`  ✓ index.ts exists`);
  } else {
    console.log(`  ✗ index.ts missing`);
  }
  
  // Check if colors.ts exists
  const colorsPath = path.join(themesDir, dir, 'colors.ts');
  if (fs.existsSync(colorsPath)) {
    console.log(`  ✓ colors.ts exists`);
  } else {
    console.log(`  ✗ colors.ts missing`);
  }
});