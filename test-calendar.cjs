const fs = require('fs');
const path = require('path');

// Mock the necessary parts
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// Read the panchang service file
const servicePath = path.join(__dirname, 'src', 'divya-panchang', 'services', 'panchangService.ts');
let serviceCode = fs.readFileSync(servicePath, 'utf8');

// Replace localStorage with mock
serviceCode = serviceCode.replace(/localStorage/g, 'mockLocalStorage');

// Remove export statements and TypeScript types for Node.js compatibility
serviceCode = serviceCode
  .replace(/export /g, '')
  .replace(/import .* from .*;/g, '')
  .replace(/: \w+/g, '')
  .replace(/\? :/g, '?:')
  .replace(/async /g, '')
  .replace(/Promise<(\w+)>/g, '$1')
  .replace(/as MonthData/g, '');

// Add required variables
serviceCode = `
const mockLocalStorage = ${JSON.stringify(mockLocalStorage)};
const console = { log: (...args) => process.stdout.write(args.join(' ') + '\\n'), warn: (...args) => process.stderr.write(args.join(' ') + '\\n'), error: (...args) => process.stderr.write(args.join(' ') + '\\n') };

${serviceCode}

// Test the function
generatePanchangData(2025, 11) // December 2025
  .then(data => {
    console.log('Generated data for December 2025:');
    console.log('Month:', data.monthName);
    console.log('Year:', data.year);
    console.log('Number of days:', data.days.length);
    console.log('First day:', JSON.stringify(data.days[0], null, 2));
    console.log('Last day:', JSON.stringify(data.days[data.days.length - 1], null, 2));
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
`;

// Write the test file
fs.writeFileSync(path.join(__dirname, 'test-calendar-generated.js'), serviceCode);

console.log('Test file created. Run with: node test-calendar-generated.js');