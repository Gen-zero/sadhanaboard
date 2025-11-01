#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script optimizes images in the public directory by:
 * 1. Converting PNG/JPG images to WebP format for better compression
 * 2. Creating multiple sizes for responsive loading
 * 3. Optimizing SVG files by removing unnecessary metadata
 * 
 * Usage: node scripts/optimize-images.cjs
 */

import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { optimize } from 'svgo';

// Directories to process
const IMAGE_DIRECTORIES = [
  'public/lovable-uploads',
  'public/icons',
  'public/textures',
  'public/themes'
];

// Image formats to optimize
const IMAGE_FORMATS = ['.png', '.jpg', '.jpeg'];

// SVG formats to optimize
const SVG_FORMATS = ['.svg'];

// Quality settings for different formats
const QUALITY_SETTINGS = {
  webp: 80,
  avif: 80
};

// Size variants to generate
const SIZE_VARIANTS = [
  { name: 'small', width: 480 },
  { name: 'medium', width: 768 },
  { name: 'large', width: 1024 },
  { name: 'xlarge', width: 1920 }
];

/**
 * Optimize a single image file
 */
async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath, ext);
    const dirname = path.dirname(filePath);
    
    // Skip if already optimized
    if (basename.endsWith('-optimized')) {
      console.log(`Skipping already optimized image: ${filePath}`);
      return;
    }
    
    console.log(`Optimizing image: ${filePath}`);
    
    // Convert to WebP
    if (IMAGE_FORMATS.includes(ext)) {
      const webpPath = path.join(dirname, `${basename}.webp`);
      await sharp(filePath)
        .webp({ quality: QUALITY_SETTINGS.webp })
        .toFile(webpPath);
      console.log(`  ✓ Created WebP version: ${webpPath}`);
      
      // Create size variants
      for (const variant of SIZE_VARIANTS) {
        const variantPath = path.join(dirname, `${basename}-${variant.name}${ext}`);
        const webpVariantPath = path.join(dirname, `${basename}-${variant.name}.webp`);
        
        await sharp(filePath)
          .resize(variant.width)
          .toFile(variantPath);
        console.log(`  ✓ Created ${variant.name} variant: ${variantPath}`);
        
        // Also create WebP variant
        await sharp(filePath)
          .resize(variant.width)
          .webp({ quality: QUALITY_SETTINGS.webp })
          .toFile(webpVariantPath);
        console.log(`  ✓ Created ${variant.name} WebP variant: ${webpVariantPath}`);
      }
    }
    
    // Optimize SVG
    if (SVG_FORMATS.includes(ext)) {
      const svgContent = await fs.readFile(filePath, 'utf8');
      const result = optimize(svgContent, {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false,
              },
              cleanupIDs: {
                minify: false,
                remove: false,
              },
              convertPathData: false,
            },
          },
          'sortAttrs',
          {
            name: 'removeDimensions',
            active: true
          }
        ]
      });
      
      const optimizedPath = path.join(dirname, `${basename}-optimized${ext}`);
      await fs.writeFile(optimizedPath, result.data);
      console.log(`  ✓ Optimized SVG: ${optimizedPath}`);
    }
  } catch (error) {
    console.error(`  ✗ Error optimizing ${filePath}:`, error.message);
  }
}

/**
 * Process a directory recursively
 */
async function processDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively process subdirectories
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        // Process image files
        if (IMAGE_FORMATS.includes(ext) || SVG_FORMATS.includes(ext)) {
          await optimizeImage(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting image optimization process...\n');
  
  // Process each directory
  for (const dir of IMAGE_DIRECTORIES) {
    const fullPath = path.join(process.cwd(), dir);
    console.log(`Processing directory: ${fullPath}`);
    await processDirectory(fullPath);
  }
  
  console.log('\n✅ Image optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Update image references in your components to use WebP versions');
  console.log('2. Implement responsive image loading with srcset attributes');
  console.log('3. Add lazy loading for better performance');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}