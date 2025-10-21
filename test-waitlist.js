import axios from 'axios';

async function testWaitlist() {
  try {
    console.log('Testing waitlist API...');
    
    const response = await axios.post('http://localhost:3005/api/auth/waitlist', {
      name: 'Another Test User',
      email: 'test2@example.com',
      reason: 'Testing the waitlist again'
    });
    
    console.log('Response:', response.data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testWaitlist();