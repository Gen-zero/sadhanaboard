#!/usr/bin/env node

// Script to analyze bundle size
// Usage: npm run analyze

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function analyzeBundle() {
  console.log('Building and analyzing bundle size...');
  
  try {
    // Run build with analysis
    const { stdout, stderr } = await execAsync('npm run build', {
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    console.log('Build completed successfully!');
    console.log(stdout);
    
    if (stderr) {
      console.error('Build stderr:', stderr);
    }
    
    console.log('\nBundle analysis report generated at dist/stats.html');
    console.log('Open this file in your browser to see the bundle breakdown.');
    
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

// Run the analysis
analyzeBundle();
