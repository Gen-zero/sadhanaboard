const axios = require('axios');

async function testCustomSadhanaAPI() {
  try {
    console.log('Testing custom sadhanas API with valid token...\n');
    
    // Use the token we generated
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTM2YTBjYTZlMWE2YzNkODk3MDRjMWUiLCJpYXQiOjE3NjYwNjMxMjIsImV4cCI6MTc2NjY2NzkyMn0.1HCOq0nA8u1DDhP9iSPuQWH_DyNhjNX9Ti2IU25lT1U';
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    // Test GET /api/custom-sadhanas
    console.log('1. Testing GET /api/custom-sadhanas');
    try {
      const response = await axios.get('http://localhost:3004/api/custom-sadhanas', config);
      console.log('   ✅ GET Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('   ❌ GET Error:', error.response?.data || error.message);
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
      
      const response = await axios.post('http://localhost:3004/api/custom-sadhanas', postData, config);
      console.log('   ✅ POST Response:', JSON.stringify(response.data, null, 2));
      
      // Test GET again to see if the new sadhana is there
      console.log('\n3. Testing GET /api/custom-sadhanas again to verify creation');
      try {
        const response2 = await axios.get('http://localhost:3004/api/custom-sadhanas', config);
        console.log('   ✅ GET Response after creation:', JSON.stringify(response2.data, null, 2));
      } catch (error) {
        console.log('   ❌ GET Error after creation:', error.response?.data || error.message);
      }
    } catch (error) {
      console.log('   ❌ POST Error:', error.response?.data || error.message);
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testCustomSadhanaAPI();