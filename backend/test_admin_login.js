require('dotenv').config({ path: __dirname + '/.env' });
const adminAuthService = require('./services/adminAuthService');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    // Test login with the credentials from .env
    const result = await adminAuthService.login({ 
      usernameOrEmail: 'KaliVaibhav', 
      password: 'Subham@98' 
    });
    
    console.log('Login successful!');
    console.log('User:', result.admin.username);
    console.log('Token:', result.token ? 'Generated' : 'Not generated');
    
    // Test verification
    if (result.token) {
      const verified = adminAuthService.verifyToken(result.token);
      console.log('Token verified:', verified.userId, verified.username);
    }
  } catch (error) {
    console.error('Login failed:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testAdminLogin();