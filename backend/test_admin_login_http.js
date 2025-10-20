require('dotenv').config({ path: __dirname + '/.env' });
const axios = require('axios');

async function testHttpLogin() {
  try {
    console.log('Testing HTTP admin login...');
    
    const response = await axios.post('http://localhost:3004/api/admin/login', {
      usernameOrEmail: 'KaliVaibhav',
      password: 'Subham@98'
    });
    
    console.log('HTTP Login successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('HTTP Login failed:');
    console.error('Status:', error.response ? error.response.status : 'N/A');
    console.error('Data:', error.response ? error.response.data : error.message);
  }
}

testHttpLogin();