import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Ensure public/icons directory exists
const publicIconsDir = path.join(repoRoot, 'public', 'icons');
if (!fs.existsSync(publicIconsDir)) {
  fs.mkdirSync(publicIconsDir, { recursive: true });
  // Only log on first creation
  // console.log('Created public/icons directory');
}

// Check if mahakali-yantra.png exists and is valid
const mahakaliYantraPath = path.join(publicIconsDir, 'mahakali-yantra.png');
let needsPlaceholder = true;

if (fs.existsSync(mahakaliYantraPath)) {
  const stats = fs.statSync(mahakaliYantraPath);
  // If file is larger than 100 bytes, assume it's a real image
  if (stats.size > 100) {
    needsPlaceholder = false;
    // Suppress success message to reduce console noise
    // console.log('Mahakali yantra file exists and appears valid');
  } else {
    // Only warn if file is suspiciously small
    // console.log('Mahakali yantra file exists but is likely a placeholder (size: ' + stats.size + ' bytes)');
  }
}

// Create a placeholder if needed
if (needsPlaceholder) {
  // Create a 1x1 transparent PNG as placeholder
  const placeholder = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 
    0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  fs.writeFileSync(mahakaliYantraPath, placeholder);
  console.log('Created placeholder mahakali-yantra.png to prevent 404 errors');
}

// Check theme assets directories
const themesDir = path.join(repoRoot, 'src', 'themes');
if (fs.existsSync(themesDir)) {
  const themes = fs.readdirSync(themesDir).filter(item => 
    fs.statSync(path.join(themesDir, item)).isDirectory()
  );
  
  themes.forEach(theme => {
    const assetsDir = path.join(themesDir, theme, 'assets');
    if (fs.existsSync(assetsDir)) {
      const assets = fs.readdirSync(assetsDir);
      if (assets.length === 0) {
        // Create README if assets directory is empty
        const readmePath = path.join(assetsDir, 'README.md');
        if (!fs.existsSync(readmePath)) {
          fs.writeFileSync(readmePath, `# Assets for ${theme} theme\n\nPlace theme-specific assets here.\n`);
          // Suppress README creation messages
          // console.log(`Created README for ${theme} theme assets`);
        }
      }
    }
  });
}

// Only log completion if there were actual changes
// console.log('Theme asset validation completed');