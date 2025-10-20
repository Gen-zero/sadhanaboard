const path = require('path');

function testCorrectedFilePath() {
  try {
    console.log('Testing corrected file path construction...');
    
    const filename = 'yantras-heavenly-geometries.pdf';
    const filePath = path.join(__dirname, '../uploads', filename);
    
    console.log('Current directory:', __dirname);
    console.log('Constructed file path:', filePath);
    console.log('This should point to:', path.resolve(filePath));
    
    // Check if this matches our actual file location
    const expectedPath = path.join(__dirname, '..', 'uploads', filename);
    console.log('Expected path:', expectedPath);
    console.log('Paths match:', path.resolve(filePath) === path.resolve(expectedPath));
    
  } catch (error) {
    console.error('Error testing file path:', error);
  } finally {
    process.exit(0);
  }
}

testCorrectedFilePath();