const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing user login...');
    
    // Test data
    const loginData = {
      email: 'testuser@example.com',
      password: 'TestPass123!'
    };
    
    // Make login request
    const response = await axios.post('http://localhost:3004/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    
    // If we get a token, try to use it to get user info
    if (response.data.token) {
      console.log('\nTesting authentication with received token...');
      const authResponse = await axios.get('http://localhost:3004/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${response.data.token}`
        }
      });
      
      console.log('Authentication successful!');
      console.log('User info:', authResponse.data);
    }
    
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();