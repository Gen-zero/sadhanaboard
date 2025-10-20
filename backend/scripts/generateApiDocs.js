/**
 * Script to generate API documentation for remaining routes
 * This script adds JSDoc comments to controller files that don't have them yet
 */

const fs = require('fs');
const path = require('path');

// Function to add JSDoc to a controller file
function addJSDocToController(filePath, tagName, tagDescription) {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if JSDoc already exists
  if (content.includes('@swagger')) {
    console.log(`JSDoc already exists in ${filePath}`);
    return;
  }
  
  // Add tag definition at the top
  const tagDefinition = `/**
 * @swagger
 * tags:
 *   name: ${tagName}
 *   description: ${tagDescription}
 */

`;
  
  // Insert tag definition at the beginning of the file
  content = tagDefinition + content;
  
  // Write back to file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Added JSDoc to ${filePath}`);
}

// Process controller files
const controllersDir = path.join(__dirname, '..', 'controllers');

// List of controllers that need documentation
const controllersToDocument = [
  { file: 'adminController.js', tag: 'Admin', description: 'Admin panel functionality' },
  { file: 'bookController.js', tag: 'Books', description: 'Book management and reading progress' },
  { file: 'sadhanaController.js', tag: 'Sadhanas', description: 'Sadhana practices and tracking' },
  { file: 'settingsController.js', tag: 'Settings', description: 'User settings management' },
  { file: 'groupsController.js', tag: 'Groups', description: 'Group management and participation' }
];

// Process each controller
controllersToDocument.forEach(controller => {
  const filePath = path.join(controllersDir, controller.file);
  if (fs.existsSync(filePath)) {
    addJSDocToController(filePath, controller.tag, controller.description);
  } else {
    console.log(`Controller file not found: ${filePath}`);
  }
});

console.log('API documentation generation completed.');