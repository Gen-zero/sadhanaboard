const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    // Test data
    const userData = {
      email: 'testuser@example.com',
      password: 'TestPass123!',
      displayName: 'Test User'
    };
    
    // Make registration request
    const response = await axios.post('http://localhost:3004/api/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
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
    console.error('Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();