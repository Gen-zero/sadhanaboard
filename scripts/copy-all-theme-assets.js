import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Copy theme assets to public directory for all themes
function copyAllThemeAssets() {
  const themesDir = path.join(repoRoot, 'src', 'themes');
  const publicThemesDir = path.join(repoRoot, 'public', 'themes');
  
  // Ensure public/themes directory exists
  fs.mkdirSync(publicThemesDir, { recursive: true });
  
  // Get all theme directories
  if (fs.existsSync(themesDir)) {
    const themes = fs.readdirSync(themesDir).filter(item => 
      fs.statSync(path.join(themesDir, item)).isDirectory()
    );
    
    themes.forEach(theme => {
      const sourceAssetsDir = path.join(themesDir, theme, 'assets');
      const destAssetsDir = path.join(publicThemesDir, theme, 'assets');
      
      // Check if theme has assets directory
      if (fs.existsSync(sourceAssetsDir)) {
        // Ensure destination directory exists
        fs.mkdirSync(destAssetsDir, { recursive: true });
        
        // Copy all files and directories from source to destination
        copyRecursiveSync(sourceAssetsDir, destAssetsDir, theme);
        
        console.log(`Finished copying assets for ${theme} theme`);
      } else {
        console.log(`No assets directory found for ${theme} theme`);
      }
    });
  } else {
    console.warn('Themes directory not found:', themesDir);
  }
}

// Recursive copy function to handle directories
function copyRecursiveSync(src, dest, themeName) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        themeName
      );
    });
  } else {
    try {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${themeName}/${path.basename(src)} to public/themes/${themeName}/assets/`);
    } catch (error) {
      console.warn(`Failed to copy ${themeName}/${path.basename(src)}: ${error.message}`);
    }
  }
}

// Run the function
copyAllThemeAssets();