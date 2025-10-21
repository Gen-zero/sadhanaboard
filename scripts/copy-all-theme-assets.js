import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Check if verbose mode is enabled
const VERBOSE = process.argv.includes('--verbose') || process.env.DEBUG === 'true';

// Calculate file hash for comparison
function getFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    return null;
  }
}

// Copy theme assets to public directory for all themes
function copyAllThemeAssets() {
  const themesDir = path.join(repoRoot, 'src', 'themes');
  const publicThemesDir = path.join(repoRoot, 'public', 'themes');
  
  // Ensure public/themes directory exists
  fs.mkdirSync(publicThemesDir, { recursive: true });
  
  let totalThemes = 0;
  let themesWithAssets = 0;
  let totalFilesCopied = 0;
  
  // Get all theme directories
  if (fs.existsSync(themesDir)) {
    const themes = fs.readdirSync(themesDir).filter(item => 
      fs.statSync(path.join(themesDir, item)).isDirectory()
    );
    
    totalThemes = themes.length;
    
    themes.forEach(theme => {
      const sourceAssetsDir = path.join(themesDir, theme, 'assets');
      const destAssetsDir = path.join(publicThemesDir, theme, 'assets');
      
      // Check if theme has assets directory
      if (fs.existsSync(sourceAssetsDir)) {
        themesWithAssets++;
        // Ensure destination directory exists
        fs.mkdirSync(destAssetsDir, { recursive: true });
        
        // Copy all files and directories from source to destination
        const { copiedFiles, checkedFiles } = copyRecursiveSync(sourceAssetsDir, destAssetsDir, theme);
        totalFilesCopied += copiedFiles;
        
        // Show summary
        if (VERBOSE) {
          console.log(`Processed ${theme} theme: ${copiedFiles} updated, ${checkedFiles} total files`);
        } else if (copiedFiles > 0) {
          console.log(`Updated ${copiedFiles} assets for ${theme} theme`);
        }
      } else {
        if (VERBOSE) {
          console.log(`No assets directory found for ${theme} theme`);
        }
      }
    });
  } else {
    console.warn('Themes directory not found:', themesDir);
  }
  
  if (VERBOSE) {
    console.log(`Theme asset processing completed: ${themesWithAssets}/${totalThemes} themes processed, ${totalFilesCopied} files updated`);
  } else if (totalFilesCopied > 0) {
    console.log(`Theme assets updated: ${totalFilesCopied} files copied`);
  } else {
    console.log('Theme assets up to date');
  }
}

// Recursive copy function to handle directories
function copyRecursiveSync(src, dest, themeName) {
  let copiedCount = 0;
  let checkedCount = 0;
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      const result = copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        themeName
      );
      copiedCount += result.copiedFiles;
      checkedCount += result.checkedFiles;
    });
  } else {
    try {
      checkedCount = 1;
      // Check if file needs to be copied by comparing hashes
      const sourceHash = getFileHash(src);
      const destHash = fs.existsSync(dest) ? getFileHash(dest) : null;
      
      // Only copy if file doesn't exist or has changed
      if (sourceHash && sourceHash !== destHash) {
        fs.copyFileSync(src, dest);
        copiedCount = 1;
        if (VERBOSE) {
          console.log(`Copied ${themeName}/${path.basename(src)}`);
        }
      }
    } catch (error) {
      console.warn(`Failed to process ${themeName}/${path.basename(src)}: ${error.message}`);
    }
  }
  
  return { copiedFiles: copiedCount, checkedFiles: checkedCount };
}

// Run the function
copyAllThemeAssets();