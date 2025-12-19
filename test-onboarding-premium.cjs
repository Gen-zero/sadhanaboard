const puppeteer = require('puppeteer');
const fs = require('fs');

async function testPremiumOnboarding() {
  console.log('🧪 Starting Premium Onboarding Test...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    slowMo: 50,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Navigate to the onboarding page
    console.log('➡️ Navigating to onboarding page...');
    await page.goto('http://localhost:5173/onboarding');
    
    // Wait for the page to load
    await page.waitForSelector('.glass-morphism-container', { timeout: 10000 });
    
    // Test Step 1: Name input
    console.log('📝 Testing Step 1 - Name input...');
    await page.type('#name', 'Test User');
    await page.click('button:has-text("Next")');
    
    // Test Step 2: Birth details (optional)
    console.log('🎂 Testing Step 2 - Birth details...');
    await page.type('#dateOfBirth', '1990-01-01');
    await page.type('#timeOfBirth', '12:00');
    await page.type('#birthPlace', 'Test City');
    await page.click('button:has-text("Next")');
    
    // Test Step 3: Favorite deity
    console.log('🕉️ Testing Step 3 - Favorite deity...');
    await page.click('div:has-text("Lord Krishna")');
    await page.click('button:has-text("Next")');
    
    // Test Step 4: Profile information
    console.log('📜 Testing Step 4 - Profile information...');
    await page.type('#gotra', 'Test Gotra');
    
    // Select varna
    await page.click('[aria-haspopup="menu"]');
    await page.click('div:has-text("Brahmana")');
    
    // Check dikshit checkbox
    await page.click('#isDikshit');
    
    // Select sampradaya
    await page.click('div[aria-haspopup="menu"]:nth-of-type(2)');
    await page.click('div:has-text("Vaishnava")');
    
    await page.type('#location', 'Test Location');
    await page.click('button:has-text("Next")');
    
    // Test Step 5: About you
    console.log('📖 Testing Step 5 - About you...');
    await page.type('#bio', 'This is a test bio for the premium onboarding experience.');
    
    // Select experience level
    await page.click('div[aria-haspopup="menu"]:nth-of-type(1)');
    await page.click('div:has-text("Beginner")');
    
    await page.click('button:has-text("Next")');
    
    // Test Step 6: Deity preferences
    console.log('🌟 Testing Step 6 - Deity preferences...');
    // Set priorities for first 3 deities
    await page.click('div:has-text("Lord Vishnu") select');
    await page.select('div:has-text("Lord Vishnu") select', '1');
    
    await page.click('div:has-text("Lord Krishna") select');
    await page.select('div:has-text("Lord Krishna") select', '2');
    
    await page.click('div:has-text("Lord Rama") select');
    await page.select('div:has-text("Lord Rama") select', '3');
    
    await page.click('button:has-text("Next")');
    
    // Test Step 7: Energy level assessment
    console.log('⚡ Testing Step 7 - Energy level assessment...');
    // Expand and answer first question
    await page.click('div:has-text("When you wake up in the morning")');
    await page.click('div:has-text("I feel energized and ready to start the day")');
    
    // Expand and answer second question
    await page.click('div:has-text("During challenging situations")');
    await page.click('div:has-text("I remain calm and composed")');
    
    await page.click('button:has-text("Complete Setup")');
    
    // Test Step 8: Final step with premium styling
    console.log('🎉 Testing Step 8 - Final step with premium styling...');
    await page.waitForSelector('button:has-text("Show Me Around")', { timeout: 5000 });
    
    // Take screenshot of the final premium step
    await page.screenshot({ path: 'premium-onboarding-final-step.png' });
    
    console.log('✅ Premium Onboarding Test Completed Successfully!');
    console.log('📸 Screenshot saved as premium-onboarding-final-step.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    // Take screenshot of error
    await page.screenshot({ path: 'premium-onboarding-error.png' });
    console.log('📸 Error screenshot saved as premium-onboarding-error.png');
  } finally {
    await browser.close();
  }
}

// Run the test
testPremiumOnboarding().catch(console.error);