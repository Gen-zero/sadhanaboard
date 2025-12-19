const axios = require('axios');

async function testCustomSadhanaAPI() {
  try {
    console.log('Testing custom sadhanas API...');
    
    // Use a fake token for testing (this would normally be a real JWT)
    const fakeToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJpYXQiOjE3MDAwMDAwMDB9.8KJwJ7X5qHfPFnXK5g5s8J4X1y5X7X2X5X7X2X5X7X2';
    
    // Test GET /api/custom-sadhanas
    console.log('\n1. Testing GET /api/custom-sadhanas');
    try {
      const response = await axios.get('http://localhost:3004/api/custom-sadhanas', {
        headers: {
          'Authorization': fakeToken
        }
      });
      console.log('GET Response:', response.data);
    } catch (error) {
      console.log('GET Error:', error.response?.data || error.message);
    }
    
    // Test POST /api/custom-sadhanas
    console.log('\n2. Testing POST /api/custom-sadhanas');
    try {
      const postData = {
        name: 'Test Custom Sadhana',
        description: 'A test custom sadhana for development',
        purpose: 'Testing the custom sadhana functionality',
        goal: 'Verify that the backend service works correctly',
        deity: 'Divine Universal Consciousness',
        message: 'This is a test message for the custom sadhana',
        offerings: ['Meditation', 'Pranayama', 'Mantra Chanting'],
        duration_days: 40
      };
      
      const response = await axios.post('http://localhost:3004/api/custom-sadhanas', postData, {
        headers: {
          'Authorization': fakeToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('POST Response:', response.data);
    } catch (error) {
      console.log('POST Error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testCustomSadhanaAPI();