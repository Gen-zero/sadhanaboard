const http = require('http');

// Test the health endpoint
const healthReq = http.get('http://localhost:3004/health', (res) => {
  console.log('Health Check Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Health Check Response:', JSON.parse(data));
  });
});

healthReq.on('error', (err) => {
  console.log('Health Check Error:', err.message);
});

// Test waitlist endpoint
const postData = JSON.stringify({
  name: 'Test User',
  email: 'test4@example.com',
  reason: 'Final verification test'
});

const waitlistReq = http.request({
  hostname: 'localhost',
  port: 3004,
  path: '/api/auth/waitlist',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  console.log('Waitlist Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Waitlist Response:', JSON.parse(data));
  });
});

waitlistReq.on('error', (err) => {
  console.log('Waitlist Error:', err.message);
});

waitlistReq.write(postData);
waitlistReq.end();