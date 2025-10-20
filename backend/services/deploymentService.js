const db = require('../config/db');
const { execSync } = require('child_process');

function getCurrentVersion() {
  try {
    const commit = execSync('git rev-parse --short HEAD').toString().trim();
    return { git_commit: commit, version: process.env.npm_package_version || 'unknown', build_date: process.env.BUILD_DATE || null };
  } catch (e) { return { git_commit: 'unknown', version: process.env.npm_package_version || 'unknown' }; }
}

async function createDeploymentRecord(version, gitCommit, buildDate) {
  const r = await db.query('INSERT INTO deployment_info (version,git_commit,build_date,deployed_at,deployment_status,metadata) VALUES ($1,$2,$3,NOW(),$4,$5) RETURNING *', [version, gitCommit, buildDate, 'deployed', JSON.stringify({})]);
  return r.rows && r.rows[0];
}

async function getDeploymentHistory(limit = 50) {
  const r = await db.query('SELECT * FROM deployment_info ORDER BY created_at DESC LIMIT $1', [limit]);
  return r.rows || [];
}

async function getHealthCheckStatus() {
  try {
    // Check database connectivity
    const dbResult = await db.query('SELECT NOW() as db_time');
    const dbStatus = dbResult.rows && dbResult.rows.length > 0 ? 'ok' : 'error';
    
    // Get system metrics
    const metrics = await require('./systemMetricsService').collectSystemMetrics();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      metrics: metrics,
      environment: {
        node_version: process.version,
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
        node_version: process.version,
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