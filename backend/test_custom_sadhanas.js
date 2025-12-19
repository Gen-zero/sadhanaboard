const CustomSadhanaService = require('./services/customSadhanaService');

// Test the custom sadhana service
async function testCustomSadhanaService() {
  try {
    console.log('Testing CustomSadhanaService...');
    
    // Test data
    const testUserId = '0f8b6fa9-1e7e-4f3f-8f8d-4a8c8d9e0f1a'; // Example user ID
    const testData = {
      name: 'Test Custom Sadhana',
      description: 'A test custom sadhana for development',
      purpose: 'Testing the custom sadhana functionality',
      goal: 'Verify that the backend service works correctly',
      deity: 'Divine Universal Consciousness',
      message: 'This is a test message for the custom sadhana',
      offerings: ['Meditation', 'Pranayama', 'Mantra Chanting'],
      duration_days: 40
    };
    
    // Test creating a custom sadhana
    console.log('\\n1. Creating a custom sadhana...');
    const createdSadhana = await CustomSadhanaService.createCustomSadhana(testData, testUserId);
    console.log('Created sadhana:', createdSadhana);
    
    // Test getting all custom sadhanas for the user
    console.log('\\n2. Getting all custom sadhanas for user...');
    const userSadhanas = await CustomSadhanaService.getUserCustomSadhanas(testUserId);
    console.log(`Found ${userSadhanas.length} custom sadhanas`);
    
    // Test getting a specific custom sadhana by ID
    console.log('\\n3. Getting specific custom sadhana by ID...');
    const fetchedSadhana = await CustomSadhanaService.getCustomSadhanaById(createdSadhana.id, testUserId);
    console.log('Fetched sadhana:', fetchedSadhana);
    
    // Test updating the custom sadhana
    console.log('\\n4. Updating the custom sadhana...');
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
    
    const updatedSadhana = await CustomSadhanaService.updateCustomSadhana(createdSadhana.id, updateData, testUserId);
    console.log('Updated sadhana:', updatedSadhana);
    
    // Test deleting the custom sadhana
    console.log('\\n5. Deleting the custom sadhana...');
    const deletedSadhana = await CustomSadhanaService.deleteCustomSadhana(createdSadhana.id, testUserId);
    console.log('Deleted sadhana:', deletedSadhana);
    
    console.log('\\nAll tests passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testCustomSadhanaService();