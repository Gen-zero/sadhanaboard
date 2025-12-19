// Test script for custom sadhanas functionality
console.log('Testing custom sadhanas functionality...');

// Test data
const testSadhana = {
  purpose: "Test Purpose",
  goal: "Test Goal",
  deity: "Test Deity",
  message: "Test Message",
  offerings: ["Offering 1", "Offering 2"],
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  durationDays: 40,
  name: "Test Custom Sadhana",
  description: "This is a test custom sadhana"
};

console.log('Test sadhana data:', testSadhana);

// Save to localStorage
const customSadhanasKey = 'custom-sadhanas';
let existingSadhanas = [];

try {
  const stored = localStorage.getItem(customSadhanasKey);
  if (stored) {
    existingSadhanas = JSON.parse(stored);
  }
} catch (error) {
  console.log('Could not load existing custom sadhanas');
}

const newSadhana = {
  ...testSadhana,
  id: Date.now().toString(),
  createdAt: new Date().toISOString()
};

const updatedSadhanas = [...existingSadhanas, newSadhana];

try {
  localStorage.setItem(customSadhanasKey, JSON.stringify(updatedSadhanas));
  console.log('Successfully saved custom sadhana to localStorage');
  console.log('Total custom sadhanas:', updatedSadhanas.length);
} catch (error) {
  console.log('Could not save custom sadhana to localStorage');
}

// Retrieve and display
try {
  const stored = localStorage.getItem(customSadhanasKey);
  if (stored) {
    const sadhanas = JSON.parse(stored);
    console.log('Retrieved custom sadhanas from localStorage:');
    sadhanas.forEach(sadhana => {
      console.log(`- ${sadhana.name}: ${sadhana.description}`);
    });
  }
} catch (error) {
  console.log('Could not retrieve custom sadhanas from localStorage');
}