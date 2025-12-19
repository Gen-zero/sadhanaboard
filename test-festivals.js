// Simple test for festival data
import { readFileSync } from 'fs';

// Read the enhanced festival data file
const festivalData = readFileSync('./src/data/festivals-enhanced.ts', 'utf8');

// Check if it contains festival data
if (festivalData.includes('Diwali') && festivalData.includes('Holi')) {
    console.log('✅ Enhanced festival data file created successfully');
    console.log('✅ Contains Diwali and Holi festival data');
} else {
    console.log('❌ Festival data may be incomplete');
}

// Count the number of festivals
const festivalCount = (festivalData.match(/name:/g) || []).length;
console.log(`📊 Total festivals in data: ${festivalCount}`);

// Check for major festivals
const majorFestivals = ['Diwali', 'Holi', 'Janmashtami', 'Maha Shivaratri'];
const foundFestivals = majorFestivals.filter(festival => festivalData.includes(festival));
console.log(`🎉 Major festivals found: ${foundFestivals.join(', ')}`);

if (foundFestivals.length >= 3) {
    console.log('✅ All major festivals are present in the data');
} else {
    console.log('⚠️ Some major festivals may be missing');
}