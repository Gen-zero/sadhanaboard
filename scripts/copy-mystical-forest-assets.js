import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Copy mystical forest theme assets to public directory
function copyMysticalForestAssets() {
  const sourceDir = path.join(repoRoot, 'src', 'themes', 'mystical-forest', 'assets');
  const destDir = path.join(repoRoot, 'public', 'themes', 'mystical-forest', 'assets');
  
  // Ensure destination directory exists
  fs.mkdirSync(destDir, { recursive: true });
  
  // Copy all files from source to destination
  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
      const srcPath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      
      // Copy file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} to public/themes/mystical-forest/assets/`);
    });
  } else {
    console.warn('Source directory not found:', sourceDir);
  }
}

// Run the function
copyMysticalForestAssets();