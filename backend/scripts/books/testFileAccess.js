const fs = require('fs').promises;
const path = require('path');

async function testFileAccess() {
  try {
    console.log('Testing file access...');
    
    // Check if the file exists in the uploads directory
    const filePath = path.join(__dirname, '..', 'uploads', 'yantras-heavenly-geometries.pdf');
    console.log('Checking file at:', filePath);
    
    try {
      await fs.access(filePath);
      console.log('File exists and is accessible');
      
      // Get file stats
      const stats = await fs.stat(filePath);
      console.log('File size:', stats.size, 'bytes');
    } catch (err) {
      console.log('File does not exist or is not accessible:', err.message);
    }
    
  } catch (error) {
    console.error('Error testing file access:', error);
  } finally {
    process.exit(0);
  }
}

testFileAccess();