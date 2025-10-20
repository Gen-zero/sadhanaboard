const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes we need
const sizes = [192, 256, 384, 512];

// Source image path
const sourceImagePath = path.join(__dirname, '..', 'public', 'sadhanaboard_logo.png');

function copyIcons() {
  try {
    // Check if source image exists
    if (!fs.existsSync(sourceImagePath)) {
      console.error('Source image not found:', sourceImagePath);
      console.log('Please ensure sadhanaboard_logo.png exists in the public directory');
      return;
    }

    // Copy the logo to each required size (we'll just copy the same file with different names)
    for (const size of sizes) {
      const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      fs.copyFileSync(sourceImagePath, iconPath);
      console.log(`Copied icon: ${iconPath}`);
    }
    
    console.log('All icons copied successfully!');
  } catch (error) {
    console.error('Error copying icons:', error);
  }
}

copyIcons();