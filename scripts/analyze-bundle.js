#!/usr/bin/env node

// Bundle analysis script to identify large dependencies and optimization opportunities
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get directory size recursively
function getDirectorySize(dirPath) {
  let size = 0;
  
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        size += getDirectorySize(filePath);
      } else {
        size += stats.size;
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err.message);
  }
  
  return size;
}

// Function to format bytes to human readable format
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Analyze project directories
function analyzeProject() {
  const projectRoot = path.resolve(__dirname, '..');
  const analysis = {
    totalSize: 0,
    directories: [],
    largeFiles: []
  };
  
  // Key directories to analyze
  const directories = [
    'node_modules',
    'src',
    'public',
    'dist', // if exists
    'backend'
  ];
  
  console.log('=== Project Bundle Analysis ===\n');
  
  for (const dir of directories) {
    const dirPath = path.join(projectRoot, dir);
    
    if (fs.existsSync(dirPath)) {
      const size = getDirectorySize(dirPath);
      analysis.directories.push({ name: dir, size });
      analysis.totalSize += size;
      
      console.log(`${dir}: ${formatBytes(size)}`);
    }
  }
  
  console.log(`\nTotal Project Size: ${formatBytes(analysis.totalSize)}\n`);
  
  // Analyze node_modules for large packages
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('=== Large Node Modules ===');
    
    const packages = fs.readdirSync(nodeModulesPath)
      .filter(item => {
        const itemPath = path.join(nodeModulesPath, item);
        return fs.statSync(itemPath).isDirectory();
      });
    
    const packageSizes = packages.map(pkg => {
      const pkgPath = path.join(nodeModulesPath, pkg);
      return { name: pkg, size: getDirectorySize(pkgPath) };
    });
    
    // Sort by size descending
    packageSizes.sort((a, b) => b.size - a.size);
    
    // Show top 20 largest packages
    for (let i = 0; i < Math.min(20, packageSizes.length); i++) {
      const pkg = packageSizes[i];
      console.log(`${pkg.name}: ${formatBytes(pkg.size)}`);
    }
  }
  
  // Suggestions for optimization
  console.log('\n=== Optimization Suggestions ===');
  console.log('1. Use dynamic imports for heavy components (already implemented)');
  console.log('2. Code splitting for route-based components');
  console.log('3. Tree-shaking unused exports');
  console.log('4. Compress images and assets');
  console.log('5. Remove unused dependencies');
  console.log('6. Use production builds for deployment');
  console.log('7. Enable gzip compression on server');
}

// Run analysis
analyzeProject();