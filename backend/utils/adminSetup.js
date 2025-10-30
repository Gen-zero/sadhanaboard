const db = require('../config/db');

// Create admin logs table and other necessary tables
async function setupAdminTables() {
  try {
    // Check if direct database connection is available
    let connectionTest;
    if (typeof db.getConnectionTestResult === 'function') {
      // Call the function to get the actual result
      connectionTest = await db.getConnectionTestResult();
    } else {
      connectionTest = { success: false };
    }
    
    if (!connectionTest.success) {
      console.warn('Direct database connection unavailable, skipping admin table setup');
      console.warn('Connection test result:', connectionTest);
      return;
    }

    console.log('✅ Database connection verified - skipping table initialization');
  } catch (error) {
    console.error('Error checking admin tables:', error);
  }
}

// Additional admin-specific tables/enhancements for logs/security
async function setupAdminLogsAndSecurity() {
  try {
    // Check if direct database connection is available
    let connectionTest;
    if (typeof db.getConnectionTestResult === 'function') {
      // Call the function to get the actual result
      connectionTest = await db.getConnectionTestResult();
    } else {
      connectionTest = { success: false };
    }
    
    if (!connectionTest.success) {
      console.warn('Direct database connection unavailable, skipping admin logs and security setup');
      console.warn('Connection test result:', connectionTest);
      return;
    }

    console.log('✅ Database connection verified - skipping security table initialization');
  } catch (e) {
    console.error('setupAdminLogsAndSecurity error', e);
  }
}

module.exports = { setupAdminTables, setupAdminLogsAndSecurity };