// Simple test for Tithi calculation
const SHUKLA_TITHIS = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", 
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dvadashi", "Trayodashi", "Chaturdashi", "Purnima"
];

const KRISHNA_TITHIS = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", 
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dvadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

// Calculate approximate Tithi for a given date
// Based on the principle that Tithi is determined by the longitudinal difference between Sun and Moon
function calculateTithi(year, month, day) {
  // Use a known reference point: Krishna Paksha Trayodashi on Dec 17, 2025
  // This is the date the user reported as having Krishna Paksha Trayodashi
  const referenceDate = new Date(2025, 11, 17); // December 17, 2025
  const referenceTithiIndex = 27; // Krishna Paksha Trayodashi (index 27: 15 + 12)
  
  const targetDate = new Date(year, month, day);
  
  // Calculate days since reference
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceReference = Math.floor((targetDate.getTime() - referenceDate.getTime()) / msPerDay);
  
  // Each Tithi is approximately 0.984353 days (synodic month of ~29.53 days / 30 tithis)
  const tithiCycleLength = 29.53059 / 30;
  
  // Calculate tithi position relative to reference
  const tithiOffset = daysSinceReference / tithiCycleLength;
  
  // Calculate target tithi index
  let targetTithiIndex = referenceTithiIndex + tithiOffset;
  
  // Normalize to 0-29 range
  targetTithiIndex = targetTithiIndex % 30;
  if (targetTithiIndex < 0) {
    targetTithiIndex += 30;
  }
  
  // Round to nearest integer tithi
  const tithiIndex = Math.round(targetTithiIndex) % 30;
  
  // Determine paksha and tithi name
  if (tithiIndex < 15) {
    // Shukla Paksha (Tithis 0-14)
    return {
      name: SHUKLA_TITHIS[tithiIndex],
      paksha: 'Shukla'
    };
  } else {
    // Krishna Paksha (Tithis 15-29)
    return {
      name: KRISHNA_TITHIS[tithiIndex - 15],
      paksha: 'Krishna'
    };
  }
}

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