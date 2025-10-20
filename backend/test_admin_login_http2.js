const http = require('http');

const data = JSON.stringify({
  usernameOrEmail: 'KaliVaibhav',
  password: 'Subham@98'
});

const options = {
  hostname: 'localhost',
  port: 3004,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`Status: ${res.statusCode}`);
  
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();