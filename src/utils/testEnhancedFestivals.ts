import { getFestivalsForDate, getFestivalsForMonth, hasMajorFestivals } from '@/data/festivals-enhanced';

// Test the enhanced festival data
console.log('Testing enhanced festival data...');

// Test Diwali 2025
const diwaliDate = "2025-10-20";
const diwaliFestivals = getFestivalsForDate(diwaliDate);
console.log(`Festivals on Diwali (Oct 20, 2025):`, diwaliFestivals);

// Test Holi 2025
const holiDate = "2025-03-14";
const holiFestivals = getFestivalsForDate(holiDate);
console.log(`Festivals on Holi (Mar 14, 2025):`, holiFestivals);

// Test Janmashtami 2025
const janmashtamiDate = "2025-08-15";
const janmashtamiFestivals = getFestivalsForDate(janmashtamiDate);
console.log(`Festivals on Janmashtami (Aug 15, 2025):`, janmashtamiFestivals);

// Test major festival check
console.log(`Does Diwali have major festivals?`, hasMajorFestivals(diwaliDate));
console.log(`Does Janmashtami have major festivals?`, hasMajorFestivals(janmashtamiDate));

// Test festival lookup for a month
const octoberFestivals = getFestivalsForMonth(2025, "October");
console.log(`Festivals in October 2025:`, octoberFestivals);

// Test a date with no festivals
const normalDate = "2025-01-15";
const normalFestivals = getFestivalsForDate(normalDate);
console.log(`Festivals on Jan 15, 2025 (normal day):`, normalFestivals);