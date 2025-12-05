#!/usr/bin/env node

/**
 * Script to retrieve data from MongoDB via the running backend API
 * The backend server must be running on port 3004
 * Usage: node query-via-api.js [endpoint]
 * Example: node query-via-api.js /api/users
 */

const http = require('http');

const baseUrl = 'http://localhost:3004';
const endpoint = process.argv[2] || '/health';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, { 
      headers: {
        'User-Agent': 'SaadhanaBoard-CLI'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function queryApi() {
  try {
    console.log(`🔍 Querying: ${baseUrl}${endpoint}\n`);
    
    const response = await makeRequest(`${baseUrl}${endpoint}`);
    
    console.log(`📊 Status: ${response.status}`);
    console.log('\n📋 Response:\n');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused!');
      console.error('Make sure the backend server is running on port 3004');
      console.error('\nTo start the backend, run:');
      console.error('  cd backend');
      console.error('  npm start');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

// Available endpoints
if (process.argv[2] === '--help' || process.argv[2] === '-h') {
  console.log('SaadhanaBoard Database Query Tool');
  console.log('Usage: node query-via-api.js [endpoint]\n');
  console.log('Available API Endpoints:');
  console.log('  /health                    - Server health check');
  console.log('  /api/users                 - Get all users');
  console.log('  /api/sadhanas              - Get all sadhanas');
  console.log('  /api/books                 - Get all books');
  console.log('  /api/admin-panel/stats     - Get system statistics');
  console.log('\nExample:');
  console.log('  node query-via-api.js /health');
  console.log('  node query-via-api.js /api/users');
  process.exit(0);
}

queryApi();
