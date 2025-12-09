const axios = require('axios');

async function testProfile() {
  try {
    console.log('Testing user registration and profile retrieval...');
    
    // Test data with unique email
    const timestamp = Date.now();
    const userData = {
      email: `profiletest${timestamp}@example.com`,
      password: 'TestPass123!',
      displayName: 'Profile Test User'
    };
    
    // Register a new user
    console.log('\n1. Registering new user...');
    const registerResponse = await axios.post('http://localhost:3004/api/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
    const token = registerResponse.data.token;
    
    // Get user's own profile (using the correct endpoint)
    console.log('\n2. Retrieving user profile...');
    const profileResponse = await axios.get('http://localhost:3004/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile retrieval successful!');
    console.log('Profile data:', profileResponse.data);
    
    // Try to update the profile
    console.log('\n3. Updating user profile...');
    const updateData = {
      bio: 'This is a test bio',
      traditions: ['Hindu', 'Buddhist'],
      practices: ['meditation', 'yoga']
    };
    
    const updateResponse = await axios.put('http://localhost:3004/api/profile', updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Profile update successful!');
    console.log('Updated profile data:', updateResponse.data);
    
  } catch (error) {
    console.error('Profile test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testProfile();