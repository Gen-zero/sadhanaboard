import { getFestivalsForMonth, getFestivalsForDate } from '@/data/festivals';

// Test the festival data
console.log('Testing festival data...');
console.log('Festivals for January 2025:', getFestivalsForMonth(2025, 'January'));
console.log('Festivals for Diwali 2025:', getFestivalsForDate(2025, 'October', 20));
console.log('Festivals for Holi 2026:', getFestivalsForDate(2026, 'March', 4));