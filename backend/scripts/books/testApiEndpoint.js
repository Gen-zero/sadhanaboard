const fs = require('fs').promises;
const path = require('path');

async function testApiEndpoint() {
  try {
    console.log('Testing API endpoint file access...');
    
    // Simulate the file path construction used in the serveBookFile function
    const filename = 'yantras-heavenly-geometries.pdf';
    const filePath = path.join(__dirname, '../uploads', filename);
    
    console.log('Testing file path:', filePath);
    console.log('File exists:', await fs.access(filePath).then(() => true).catch(() => false));
    
    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      const stats = await fs.stat(filePath);
      console.log('File size:', stats.size, 'bytes');
      console.log('File is readable');
    } else {
      console.log('File does not exist or is not accessible');
      
      // List files in the uploads directory to see what's actually there
      try {
        const uploadsDir = path.join(__dirname, '../uploads');
        const files = await fs.readdir(uploadsDir);
        console.log('Files in uploads directory:', files);
      } catch (err) {
        console.log('Could not list uploads directory:', err.message);
      }
    }
    
  } catch (error) {
    console.error('Error testing API endpoint:', error);
  } finally {
    process.exit(0);
  }
}

testApiEndpoint();