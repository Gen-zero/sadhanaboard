import { generateCalendarMonth } from '@/services/calendarService';

// Mock user object
const mockUser = {
  id: 'test-user-id',
  // Add other required properties as needed
};

// Test the calendar service with festival data
async function testCalendarWithFestivals() {
  console.log('Testing calendar service with festival data...');
  
  try {
    // Generate calendar for October 2025 (Diwali month)
    const calendarData = await generateCalendarMonth(9, 2025, mockUser.id); // 9 = October (0-based)
    
    console.log(`Generated calendar for October 2025:`);
    console.log(`Total days: ${calendarData.days.length}`);
    
    // Check for days with festivals
    const daysWithFestivals = calendarData.days.filter(day => day.festivals && day.festivals.length > 0);
    console.log(`Days with festivals: ${daysWithFestivals.length}`);
    
    // Log details of days with festivals
    daysWithFestivals.forEach(day => {
      if (day.isCurrentMonth) {
        console.log(`Day ${day.dayNumber}: ${day.festivals?.join(', ')}`);
      }
    });
    
    // Specifically check Diwali day
    const diwaliDay = calendarData.days.find(day => 
      day.isCurrentMonth && day.dayNumber === 20 && day.festivals && day.festivals.length > 0
    );
    
    if (diwaliDay) {
      console.log(`Diwali (Oct 20, 2025) festivals: ${diwaliDay.festivals?.join(', ')}`);
    } else {
      console.log('Diwali day not found or has no festivals');
    }
  } catch (error) {
    console.error('Error testing calendar service:', error);
  }
}

// Run the test
testCalendarWithFestivals();