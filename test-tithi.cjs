// Test the Tithi calculation
const { calculateTithi } = require('./test-calendar-generated.js');

// Test for today (Dec 17, 2025)
const todayTithi = calculateTithi(2025, 11, 17);
console.log('Today (Dec 17, 2025) Tithi:', todayTithi);

// Test for a few other dates to verify the calculation
const testDates = [
  { year: 2025, month: 11, day: 1, desc: 'Dec 1, 2025' },
  { year: 2025, month: 11, day: 15, desc: 'Dec 15, 2025' },
  { year: 2025, month: 11, day: 31, desc: 'Dec 31, 2025' },
];

testDates.forEach(({ year, month, day, desc }) => {
  const tithi = calculateTithi(year, month, day);
  console.log(`${desc} Tithi: ${tithi.name} (${tithi.paksha} Paksha)`);
});