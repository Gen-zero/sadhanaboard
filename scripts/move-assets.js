import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// This helper script moves and renames the Mahakali yantra image
// from the repository root icons/ to public/icons/ with kebab-case name.
// It will also attempt to create an optimized WebP alongside the PNG if
// the `sharp` library is available.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const srcPath = path.join(repoRoot, 'icons', 'Mahakali yantra.png');
const destDir = path.join(repoRoot, 'public', 'icons');
const destPath = path.join(destDir, 'mahakali-yantra.png');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function moveAndOptimize() {
  // If destination already exists and looks like a real file, skip move
  try {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100) {
      // Suppress message when asset already exists
      // console.log('Asset already exists at', destPath, '- skipping move.');
      return;
    }
  } catch (e) {
    // proceed to check source if stat fails
  }

  if (!fs.existsSync(srcPath)) {
    // Source is missing; silently skip the move. This is expected when assets
    // have already been processed or moved earlier in the pipeline.
    return;
  }

  ensureDir(destDir);

  try {
    // Move (rename) the file into public/icons
    fs.renameSync(srcPath, destPath);
    // Only log when actually moving
    // console.log('Moved', srcPath, '->', destPath);
  } catch (err) {
    // If rename fails (cross-device), fallback to copy + unlink
    fs.copyFileSync(srcPath, destPath);
    fs.unlinkSync(srcPath);
    // Only log when actually copying
    // console.log('Copied then removed', srcPath, '->', destPath);
  }

  // Optionally create a WebP using sharp if installed
  try {
    const { default: sharp } = await import('sharp').catch(() => ({ default: null }));
    if (sharp) {
      const webpPath = path.join(destDir, 'mahakali-yantra.webp');
      await sharp(destPath).webp({ quality: 85 }).toFile(webpPath);
      // Only log when WebP is actually generated
      // console.log('Generated WebP:', webpPath);
    } else {
      // Suppress message about sharp not being installed
      // console.log('sharp not installed; skipping WebP generation');
    }
  } catch (e) {
    // Only warn on actual errors
    // console.warn('WebP generation failed:', e && e.message ? e.message : e);
  }

  // If a duplicate JPEG exists at repo root, move it to an archive folder
  const jpegSrc = path.join(repoRoot, 'Mahakali_yantra.jpeg');
  if (fs.existsSync(jpegSrc)) {
    const archiveDir = path.join(repoRoot, 'public', 'icons', 'archive');
    ensureDir(archiveDir);
    const archived = path.join(archiveDir, 'Mahakali_yantra.jpeg');
    try {
      fs.renameSync(jpegSrc, archived);
      // Only log when actually archiving
      // console.log('Archived JPEG:', archived);
    } catch (e) {
      // Only warn on actual errors
      // console.warn('Failed to archive JPEG:', e && e.message ? e.message : e);
    }
  }
  // Suppress completion message
  // console.log('Asset move operation completed successfully');
}

moveAndOptimize().catch((err) => {
  // Only set a non-zero exit code for unexpected errors. Missing source files are
  // handled gracefully inside moveAndOptimize() and should not cause the whole
  // npm run dev process to report failure.
  console.error('move-assets failed:', err && err.message ? err.message : err);
  // set non-zero exit only if error is not the common missing-source case
  if (err) process.exitCode = 1;
});