const fs = require('fs');
const path = require('path');

// Enhanced script: copies specific icons from repo root `icons/` into theme assets folders.
// Adds CLI flags: --force (overwrite regardless of timestamps), --dry-run (report only).
// Prints detailed per-file logs, warns for missing sources, and prints a final summary.

const repoRoot = path.resolve(__dirname, '..');
const iconsDir = path.join(repoRoot, 'icons');
const themesDir = path.join(repoRoot, 'src', 'themes');

// Mapping: themeId -> array of filenames to copy from iconsDir
const mapping = {
  mahakali: [
    'Skull and Bone Turnaround.gif',
    'Skull.mp4'
  ],
  shiva: ['Bhagwan_Shiva_icon.png'],
  water: ['Bhagwan_Krishna.png'],
  earth: ['Bhagwan_Vishnu.png'],
  fire: ['Maa_Durga_icon.png'],
  bhairava: [], // intentionally empty: folder created for future assets
  ganesha: ['Ganesha.png'],
  // Adding new mappings for icons
  default: ['default icon.png'],
  serenity: ['default icon.png'],
  neon: ['default icon.png'],
  swamiji: ['swamiji.png']
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function fileSizeReadable(size) {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  return (size / (1024 * 1024)).toFixed(2) + ' MB';
}

function copyFile({ src, dest, force = false, dryRun = false }) {
  if (!fs.existsSync(src)) return { status: 'missing' };
  const sStat = fs.statSync(src);
  const destExists = fs.existsSync(dest);
  if (destExists) {
    const dStat = fs.statSync(dest);
    if (!force && dStat.mtimeMs >= sStat.mtimeMs) {
      return { status: 'skipped', reason: 'up-to-date' };
    }
  }
  if (dryRun) return { status: 'would-copy', size: sStat.size };
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  const newStat = fs.statSync(dest);
  return { status: 'copied', size: newStat.size };
}

function parseArgs(argv) {
  return {
    force: argv.includes('--force'),
    dryRun: argv.includes('--dry-run') || argv.includes('--dryrun')
  };
}

function main(argv = process.argv.slice(2)) {
  const { force, dryRun } = parseArgs(argv);
  // Reduce verbosity in normal operation
  // console.log('Theme icons copy — starting');
  // console.log('Options:', { force, dryRun });

  if (!fs.existsSync(iconsDir)) {
    // Only warn if icons directory is missing
    // console.warn('Source icons directory not found:', iconsDir);
    process.exit(0);
  }

  const summary = {
    totalFiles: 0,
    copied: 0,
    skipped: 0,
    missing: 0,
    wouldCopy: 0,
    details: []
  };

  Object.keys(mapping).forEach((themeId) => {
    const files = mapping[themeId];
    const themeAssetsDir = path.join(themesDir, themeId, 'assets');
    ensureDir(themeAssetsDir);

    files.forEach((file) => {
      summary.totalFiles += 1;
      const src = path.join(iconsDir, file);
      const dest = path.join(themeAssetsDir, file);
      const result = copyFile({ src, dest, force, dryRun });
      if (result.status === 'missing') {
        // Only warn for missing files
        console.warn(`Missing: ${file} (expected at ${path.relative(repoRoot, src)})`);
        summary.missing += 1;
      } else if (result.status === 'skipped') {
        // Suppress skipped file messages
        // console.log(`Skipped: ${file} — up-to-date at ${path.relative(repoRoot, dest)}`);
        summary.skipped += 1;
      } else if (result.status === 'would-copy') {
        // Only show in dry-run mode
        // console.log(`Would copy: ${file} -> ${path.relative(repoRoot, dest)} (${fileSizeReadable(result.size)})`);
        summary.wouldCopy += 1;
        summary.details.push({ themeId, file, op: 'would-copy', size: result.size });
      } else if (result.status === 'copied') {
        // Only show when actually copying
        // console.log(`Copied: ${file} -> ${path.relative(repoRoot, dest)} (${fileSizeReadable(result.size)})`);
        summary.copied += 1;
        summary.details.push({ themeId, file, op: 'copied', size: result.size });
      }
    });

    // add a small README if not present
    const readmePath = path.join(themeAssetsDir, 'README.md');
    if (!fs.existsSync(readmePath) && !dryRun) {
      fs.writeFileSync(readmePath, `# Assets for theme ${themeId}\n\nStore local icon/background assets here. Run \`npm run themes:copy-icons\` to sync from repository icons folder.\n`);
      // Suppress README creation messages
      // console.log('Wrote', path.relative(repoRoot, readmePath));
    }
  });

  // Verify destinations (non-dry-run) — simple verification that files exist and size > 0
  if (!dryRun) {
    summary.details.forEach((d) => {
      const dest = path.join(themesDir, d.themeId, 'assets', d.file);
      if (fs.existsSync(dest)) {
        const st = fs.statSync(dest);
        if (st.size === 0) {
          console.warn(`Warning: ${d.file} copied but size is 0: ${path.relative(repoRoot, dest)}`);
        }
      } else {
        console.warn(`Warning: expected destination missing: ${path.relative(repoRoot, dest)}`);
      }
    });
  }

  // Only show summary if there were changes or issues
  if (summary.copied > 0 || summary.missing > 0) {
    console.log('\nTheme icons summary:');
    console.log(`  Copied: ${summary.copied}`);
    console.log(`  Missing: ${summary.missing}`);
    if (dryRun) console.log(`  Would copy (dry-run): ${summary.wouldCopy}`);
    console.log('Done.');
  }
  return summary;
}

if (require.main === module) main();

module.exports = { main };