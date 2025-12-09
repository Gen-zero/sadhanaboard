const axios = require('axios');

async function testOnboardingFlow() {
  try {
    console.log('Testing onboarding flow for new users...');
    
    // Test data with unique email
    const timestamp = Date.now();
    const userData = {
      email: `onboardingtest${timestamp}@example.com`,
      password: 'TestPass123!',
      displayName: 'Onboarding Test User'
    };
    
    // 1. Register a new user
    console.log('\n1. Registering new user...');
    const registerResponse = await axios.post('http://localhost:3004/api/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
    const token = registerResponse.data.token;
    const userId = registerResponse.data.user._id;
    console.log('User ID:', userId);
    
    // 2. Check initial profile status (should show onboarding not complete)
    console.log('\n2. Checking initial profile status...');
    const profileResponse = await axios.get('http://localhost:3004/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Initial profile status:');
    console.log('- Onboarding completed:', profileResponse.data.profile.onboarding_completed);
    
    // 3. Simulate completing onboarding
    console.log('\n3. Completing onboarding...');
    const onboardingData = {
      display_name: 'Onboarding Test User',
      bio: 'This is a test user for onboarding flow',
      experience_level: 'beginner',
      traditions: ['Hindu'],
      location: 'Test City',
      onboarding_completed: true
    };
    
    const updateResponse = await axios.put('http://localhost:3004/api/profile', onboardingData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Onboarding completion successful!');
    console.log('- Onboarding completed:', updateResponse.data.profile.onboarding_completed);
    
    // 4. Verify onboarding status is now complete
    console.log('\n4. Verifying onboarding completion...');
    const finalProfileResponse = await axios.get('http://localhost:3004/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Final profile status:');
    console.log('- Onboarding completed:', finalProfileResponse.data.profile.onboarding_completed);
    
    if (finalProfileResponse.data.profile.onboarding_completed) {
      console.log('\n✅ Onboarding flow test PASSED!');
      console.log('New users are properly directed through onboarding.');
    } else {
      console.log('\n❌ Onboarding flow test FAILED!');
      console.log('Onboarding completion was not properly recorded.');
    }
    
  } catch (error) {
    console.error('Onboarding flow test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testOnboardingFlow();