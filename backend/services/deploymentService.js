const { execSync } = require('child_process');
const mongoose = require('mongoose');

function getCurrentVersion() {
  try {
    const commit = execSync('git rev-parse --short HEAD').toString().trim();
    return { gitCommit: commit, version: process.env.npm_package_version || 'unknown', buildDate: process.env.BUILD_DATE || null };
  } catch (e) {
    return { gitCommit: 'unknown', version: process.env.npm_package_version || 'unknown' };
  }
}

async function createDeploymentRecord(version, gitCommit, buildDate) {
  try {
    // Use a simple in-memory model or skip MongoDB if not available
    // For now, just log deployment info
    console.log(`Deployment recorded: ${version} (${gitCommit}) at ${buildDate || new Date().toISOString()}`);
    return { version, gitCommit, buildDate, deployedAt: new Date(), deploymentStatus: 'deployed' };
  } catch (e) {
    console.error('Failed to create deployment record:', e.message);
    return null;
  }
}

async function getDeploymentHistory(limit = 50) {
  try {
    // Return mock history for now
    return [
      {
        version: process.env.npm_package_version || 'unknown',
        gitCommit: 'current',
        deployedAt: new Date(),
        deploymentStatus: 'deployed'
      }
    ];
  } catch (e) {
    console.error('Failed to get deployment history:', e.message);
    return [];
  }
}

async function getHealthCheckStatus() {
  try {
    // Check MongoDB connectivity
    const mongoStatus = mongoose.connection.readyState === 1 ? 'ok' : 'error';
    
    // Get system metrics
    const metrics = await require('./systemMetricsService').collectSystemMetrics?.() || {};
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: mongoStatus,
      metrics: metrics,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
  }
}

module.exports = { 
  getCurrentVersion, 
  createDeploymentRecord, 
  getDeploymentHistory,
  getHealthCheckStatus
};