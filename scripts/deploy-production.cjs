#!/usr/bin/env node

/**
 * Production Deployment Script for SadhanaBoard
 * 
 * This script helps with the production deployment process by:
 * 1. Checking environment variables
 * 2. Running build processes
 * 3. Providing deployment instructions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgRed: '\x1b[31m',
  fgCyan: '\x1b[36m'
};

// Helper function to log with colors
function log(message, color = colors.reset, bright = false) {
  const brightCode = bright ? colors.bright : '';
  console.log(`${brightCode}${color}%s${colors.reset}`, message);
}

// Helper function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Check environment files
function checkEnvironmentFiles() {
  log('\n🔍 Checking Environment Files...', colors.fgCyan, true);
  
  const envFiles = [
    { path: '.env.production', name: 'Frontend Production Environment' },
    { path: 'backend/.env.production', name: 'Backend Production Environment' }
  ];
  
  let allExist = true;
  
  envFiles.forEach(file => {
    const fullPath = path.join(__dirname, '..', file.path);
    if (fileExists(fullPath)) {
      log(`  ✅ ${file.name} found`, colors.fgGreen);
    } else {
      log(`  ❌ ${file.name} missing`, colors.fgRed);
      allExist = false;
    }
  });
  
  return allExist;
}

// Check configuration files
function checkConfigFiles() {
  log('\n📋 Checking Configuration Files...', colors.fgCyan, true);
  
  const configFiles = [
    { path: 'vite.config.ts', name: 'Vite Configuration' },
    { path: 'backend/server.js', name: 'Backend Server Configuration' },
    { path: 'vercel.json', name: 'Vercel Configuration' },
    { path: 'netlify.toml', name: 'Netlify Configuration' }
  ];
  
  configFiles.forEach(file => {
    const fullPath = path.join(__dirname, '..', file.path);
    if (fileExists(fullPath)) {
      log(`  ✅ ${file.name} found`, colors.fgGreen);
    } else {
      log(`  ❌ ${file.name} missing`, colors.fgRed);
    }
  });
}

// Check dependencies
function checkDependencies() {
  log('\n📦 Checking Dependencies...', colors.fgCyan, true);
  
  try {
    execSync('npm list', { stdio: 'pipe' });
    log('  ✅ Frontend dependencies installed', colors.fgGreen);
  } catch (error) {
    log('  ❌ Frontend dependencies not installed', colors.fgRed);
  }
  
  try {
    execSync('cd backend && npm list', { stdio: 'pipe' });
    log('  ✅ Backend dependencies installed', colors.fgGreen);
  } catch (error) {
    log('  ❌ Backend dependencies not installed', colors.fgRed);
  }
}

// Build instructions
function showBuildInstructions() {
  log('\n🏗️  Build Instructions', colors.fgCyan, true);
  log(`
  Frontend Build:
    npm run build

  Backend Start:
    cd backend
    npm start

  Or with Node directly:
    cd backend
    node server.js
  `, colors.fgYellow);
}

// Deployment instructions
function showDeploymentInstructions() {
  log('\n🚀 Deployment Instructions', colors.fgCyan, true);
  log(`
  Vercel Deployment:
    1. Install Vercel CLI: npm install -g vercel
    2. Deploy: vercel --prod

  Netlify Deployment:
    1. Install Netlify CLI: npm install -g netlify-cli
    2. Deploy: netlify deploy --prod

  Manual Deployment:
    1. Build frontend: npm run build
    2. Upload dist/ folder to your web server
    3. Deploy backend to your Node.js hosting service
    4. Configure environment variables on both frontend and backend
  `, colors.fgYellow);
}

// Domain configuration
function showDomainConfiguration() {
  log('\n🌐 Domain Configuration', colors.fgCyan, true);
  log(`
  Primary Domain: www.sadhanaboard.com
  API Domain: api.sadhanaboard.com

  DNS Records Needed:
    1. A record for www.sadhanaboard.com pointing to your frontend hosting
    2. A record for api.sadhanaboard.com pointing to your backend hosting
    3. SSL certificates for both domains (usually handled by hosting providers)
  `, colors.fgYellow);
}

// Security checklist
function showSecurityChecklist() {
  log('\n🔒 Security Checklist', colors.fgCyan, true);
  log(`
  ✅ Ensure all environment variables are set correctly
  ✅ Verify CORS is configured for production domain only
  ✅ Check that JWT secrets are strong and secure
  ✅ Confirm admin credentials are strong
  ✅ Validate Supabase database connection security
  ✅ Review Content Security Policy settings
  ✅ Test HTTPS/SSL configuration
  ✅ Verify API rate limiting if implemented
  `, colors.fgYellow);
}

// Main function
function main() {
  log('SadhanaBoard Production Deployment Checker', colors.fgGreen, true);
  log('==========================================\n', colors.fgGreen);
  
  const envFilesExist = checkEnvironmentFiles();
  checkConfigFiles();
  checkDependencies();
  
  if (envFilesExist) {
    log('\n✅ All required environment files are present!', colors.fgGreen, true);
  } else {
    log('\n❌ Missing environment files. Please create them before deployment.', colors.fgRed, true);
  }
  
  showBuildInstructions();
  showDeploymentInstructions();
  showDomainConfiguration();
  showSecurityChecklist();
  
  log('\n📝 Refer to PRODUCTION_DEPLOYMENT_GUIDE.md for detailed instructions', colors.fgCyan);
}

// Run the script
if (require.main === module) {
  main();
}