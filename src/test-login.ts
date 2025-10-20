// Simple test to verify frontend can reach backend
async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usernameOrEmail: 'KaliVaibhav',
        password: 'Subham@98'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    return { status: response.status, data };
  } catch (error) {
    console.error('Test failed:', error);
    return { error };
  }
}

// Run the test
testLogin().then(result => {
  console.log('Test result:', result);
}).catch(error => {
  console.error('Test error:', error);
});