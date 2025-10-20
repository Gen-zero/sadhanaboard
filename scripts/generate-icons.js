const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes we need
const sizes = [192, 256, 384, 512];

// Source image path
const sourceImagePath = path.join(__dirname, '..', 'public', 'sadhanaboard_logo.png');

async function generateIcons() {
  try {
    // Check if source image exists
    if (!fs.existsSync(sourceImagePath)) {
      console.error('Source image not found:', sourceImagePath);
      console.log('Please ensure sadhanaboard_logo.png exists in the public directory');
      return;
    }

    // Load the source image
    const image = await loadImage(sourceImagePath);
    
    // Generate icons for each size
    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Draw the image centered and scaled to fit
      const scale = Math.min(size / image.width, size / image.height);
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      const x = (size - scaledWidth) / 2;
      const y = (size - scaledHeight) / 2;
      
      ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
      
      // Save the icon
      const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(iconPath, buffer);
      
      console.log(`Generated icon: ${iconPath}`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();