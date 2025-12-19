import { CalendarMonthData, CalendarDay } from '@/types/calendar';
import { api } from './api';
import { getFestivalsForDate } from '@/data/festivals-enhanced';
import { customSadhanaService, CustomSadhana } from './customSadhanaService';

// Get sadhana completions for a specific month
export const getSadhanaCompletionsForMonth = async (
  userId: string,
  year: number,
  month: number
): Promise<any[]> => {
  try {
    // This would fetch actual completion data from the backend
    // For now, we'll return mock data for demonstration
    const mockCompletions = [];
    
    // Generate some mock completion data
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      // Randomly generate completions for some days
      if (Math.random() > 0.7) {
        const date = new Date(year, month, day);
        const isoDate = date.toISOString().split('T')[0];
        
        mockCompletions.push({
          id: `completion-${isoDate}`,
          userId,
          sadhanaId: `sadhana-${Math.floor(Math.random() * 3) + 1}`,
          date: isoDate,
          completedAt: date.toISOString()
        });
      }
    }
    
    return mockCompletions;
  } catch (error) {
    console.warn('Failed to fetch sadhana completions:', error);
    return [];
  }
};

// Generate a calendar month with empty days
export const generateCalendarMonth = async (
  month: number,
  year: number,
  userId: string
): Promise<CalendarMonthData> => {
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
  
  // Get the first day of the month and the number of days in the month
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Get the number of days from the previous month to show
  const prevMonthDays = new Date(year, month, 0).getDate();
  
  const days: CalendarDay[] = [];
  
  // Add days from the previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthDays - i;
    const date = new Date(year, month - 1, dayNumber);
    const isoDate = date.toISOString().split('T')[0];
    
    days.push({
      date: isoDate,
      dayNumber,
      isCurrentMonth: false
    });
  }
  
  // Add days from the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isoDate = date.toISOString().split('T')[0];
    const isToday = isCurrentMonth && day === today.getDate();
    
    days.push({
      date: isoDate,
      dayNumber: day,
      isCurrentMonth: true,
      isToday
    });
  }
  
  // Add days from the next month to fill the grid (6 rows × 7 days = 42)
  const totalCells = 42;
  const remainingCells = totalCells - days.length;
  
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    const isoDate = date.toISOString().split('T')[0];
    
    days.push({
      date: isoDate,
      dayNumber: day,
      isCurrentMonth: false
    });
  }
  
  // Fetch sadhana completion data for this month
  try {
    const completions = await getSadhanaCompletionsForMonth(userId, year, month);
    
    // Group completions by date
    const completionsByDate: Record<string, string[]> = {};
    completions.forEach(completion => {
      if (!completionsByDate[completion.date]) {
        completionsByDate[completion.date] = [];
      }
      completionsByDate[completion.date].push(completion.sadhanaId);
    });
    
    // Add sadhana data to each day
    days.forEach(day => {
      if (completionsByDate[day.date]) {
        day.sadhanaData = {
          completed: true,
          streak: 0, // We'll calculate this separately if needed
          sadhanaIds: completionsByDate[day.date]
        };
      }
    });
  } catch (error) {
    console.warn('Failed to fetch sadhana completions for calendar:', error);
  }
  
  // Fetch custom sadhanas and mark their start/end dates
  try {
    const customSadhanas = await customSadhanaService.getAll();
    
    // Add sadhana start/end markers to each day
    days.forEach(day => {
      const dayDate = new Date(day.date);
      
      customSadhanas.forEach(sadhana => {
        const startDate = new Date(sadhana.created_at);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + sadhana.duration_days - 1);
        
        // Check if this day is a start date
        if (dayDate.toDateString() === startDate.toDateString()) {
          if (!day.sadhanaData) {
            day.sadhanaData = {
              completed: false,
              streak: 0,
              sadhanaIds: []
            };
          }
          // Mark as a start date
          if (!day.sadhanaData.sadhanaIds.includes(`start-${sadhana.id}`)) {
            day.sadhanaData.sadhanaIds.push(`start-${sadhana.id}`);
          }
        }
        
        // Check if this day is an end date
        if (dayDate.toDateString() === endDate.toDateString()) {
          if (!day.sadhanaData) {
            day.sadhanaData = {
              completed: false,
              streak: 0,
              sadhanaIds: []
            };
          }
          // Mark as an end date
          if (!day.sadhanaData.sadhanaIds.includes(`end-${sadhana.id}`)) {
            day.sadhanaData.sadhanaIds.push(`end-${sadhana.id}`);
          }
        }
      });
    });
  } catch (error) {
    console.warn('Failed to fetch custom sadhanas for calendar:', error);
  }
  
  // Add festival data to each day
  try {
    days.forEach(day => {
      // For current month days, check for festivals
      if (day.isCurrentMonth) {
        const festivals = getFestivalsForDate(day.date);
        if (festivals.length > 0) {
          // Extract just the festival names for the UI
          day.festivals = festivals.map(f => f.name);
        }
      }
    });
  } catch (error) {
    console.warn('Failed to fetch festival data for calendar:', error);
  }
  
  return {
    month,
    year,
    days
  };
};

// Get the localized month name
export const getMonthName = (month: number, locale: string = 'en-US'): string => {
  const date = new Date(2023, month, 1);
  return date.toLocaleDateString(locale, { month: 'long' });
};

// Get the localized weekday names
export const getWeekdayNames = (locale: string = 'en-US'): string[] => {
  const weekdays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(2023, 0, i + 1); // January 1-7, 2023 (starts on Sunday)
    weekdays.push(date.toLocaleDateString(locale, { weekday: 'short' }));
  }
  return weekdays;
};