const http = require('http');

// Test the BI endpoints
const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/api/admin/bi-reports/kpis/snapshot',
  method: 'GET',
  headers: {
    // Add a mock admin token for testing
    'Authorization': 'Bearer mock-token'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Response:', JSON.stringify(jsonData, null, 2));
    } catch (error) {
      console.log('Response (raw):', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.end();