// Test script for custom sadhanas API
const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3004';
const TEST_USER_ID = 'test-user-123';
const TEST_TOKEN = 'test-token'; // This would normally be a real JWT token

// Test data
const testSadhana = {
  name: 'Test Custom Sadhana',
  description: 'A test custom sadhana for development',
  purpose: 'Testing the custom sadhana functionality',
  goal: 'Verify that the backend service works correctly',
  deity: 'Divine Universal Consciousness',
  message: 'This is a test message for the custom sadhana',
  offerings: ['Meditation', 'Pranayama', 'Mantra Chanting'],
  duration_days: 40
};

async function testCustomSadhanasAPI() {
  console.log('Testing Custom Sadhanas API...\n');
  
  try {
    // Test 1: Create a custom sadhana
    console.log('1. Creating a custom sadhana...');
    const createResponse = await axios.post(`${BASE_URL}/api/custom-sadhanas`, testSadhana, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Created sadhana:', createResponse.data.customSadhana);
    const createdSadhanaId = createResponse.data.customSadhana.id;
    
    // Test 2: Get all custom sadhanas for user
    console.log('\n2. Getting all custom sadhanas for user...');
    const getAllResponse = await axios.get(`${BASE_URL}/api/custom-sadhanas`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    console.log('   Found sadhanas:', getAllResponse.data.customSadhanas.length);
    
    // Test 3: Get specific custom sadhana by ID
    console.log('\n3. Getting specific custom sadhana by ID...');
    const getByIdResponse = await axios.get(`${BASE_URL}/api/custom-sadhanas/${createdSadhanaId}`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    console.log('   Retrieved sadhana:', getByIdResponse.data.customSadhana.name);
    
    // Test 4: Update the custom sadhana
    console.log('\n4. Updating the custom sadhana...');
    const updateData = {
      name: 'Updated Test Custom Sadhana',
      description: 'An updated test custom sadhana for development',
      purpose: 'Testing the custom sadhana update functionality',
      goal: 'Verify that the backend update service works correctly',
      deity: 'Lord Shiva',
      message: 'This is an updated test message for the custom sadhana',
      offerings: ['Meditation', 'Pranayama', 'Mantra Chanting', 'Yoga Asanas'],
      duration_days: 90,
      is_draft: false
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/api/custom-sadhanas/${createdSadhanaId}`, updateData, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Updated sadhana:', updateResponse.data.customSadhana.name);
    
    // Test 5: Delete the custom sadhana
    console.log('\n5. Deleting the custom sadhana...');
    const deleteResponse = await axios.delete(`${BASE_URL}/api/custom-sadhanas/${createdSadhanaId}`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    console.log('   Deleted sadhana:', deleteResponse.data.message);
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
}

// Run the test
testCustomSadhanasAPI();