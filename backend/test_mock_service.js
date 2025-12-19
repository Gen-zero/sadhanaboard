// Test the mock custom sadhana service
const MockCustomSadhanaService = require('./services/mockCustomSadhanaService');

async function testMockService() {
  try {
    console.log('Testing MockCustomSadhanaService...');
    
    // Test creating a custom sadhana
    console.log('\n1. Creating a custom sadhana...');
    const testData = {
      name: 'Test Custom Sadhana',
      description: 'A test custom sadhana for development',
      purpose: 'Testing the custom sadhana functionality',
      goal: 'Verify that the mock service works correctly',
      deity: 'Divine Universal Consciousness',
      message: 'This is a test message for the custom sadhana',
      offerings: ['Meditation', 'Pranayama', 'Mantra Chanting'],
      duration_days: 40
    };
    
    const userId = 'test-user-id';
    const createdSadhana = await MockCustomSadhanaService.createCustomSadhana(testData, userId);
    console.log('Created sadhana:', createdSadhana);
    
    // Test getting custom sadhanas for user
    console.log('\n2. Getting custom sadhanas for user...');
    const userSadhanas = await MockCustomSadhanaService.getUserCustomSadhanas(userId);
    console.log('User sadhanas:', userSadhanas);
    
    // Test updating a custom sadhana
    console.log('\n3. Updating a custom sadhana...');
    const updateData = {
      name: 'Updated Test Custom Sadhana',
      description: 'An updated test custom sadhana for development'
    };
    
    const updatedSadhana = await MockCustomSadhanaService.updateCustomSadhana(createdSadhana.id, updateData, userId);
    console.log('Updated sadhana:', updatedSadhana);
    
    // Test getting a specific custom sadhana by ID
    console.log('\n4. Getting a specific custom sadhana by ID...');
    const specificSadhana = await MockCustomSadhanaService.getCustomSadhanaById(createdSadhana.id, userId);
    console.log('Specific sadhana:', specificSadhana);
    
    // Test deleting a custom sadhana
    console.log('\n5. Deleting a custom sadhana...');
    const deletedResult = await MockCustomSadhanaService.deleteCustomSadhana(createdSadhana.id, userId);
    console.log('Deleted result:', deletedResult);
    
    // Verify deletion
    console.log('\n6. Verifying deletion...');
    try {
      await MockCustomSadhanaService.getCustomSadhanaById(createdSadhana.id, userId);
      console.log('ERROR: Sadhana still exists after deletion');
    } catch (error) {
      console.log('Success: Sadhana properly deleted');
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testMockService();