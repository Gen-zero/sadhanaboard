export interface CalendarDay {
  date: string; // ISO format date (YYYY-MM-DD)
  dayNumber: number; // Day of the month (1-31)
  isCurrentMonth: boolean; // Whether this day belongs to the current month being displayed
  isToday?: boolean; // Whether this is today's date
  sadhanaData?: {
    completed: boolean;
    streak: number;
    sadhanaIds: string[]; // IDs of sadhanas completed on this day
    sadhanaDetails?: Array<{
      id: string;
      name: string;
      startDate: string;
      endDate: string;
      type: 'start' | 'end';
    }>;
  };
  festivals?: string[]; // Festival names for this day
}

export interface CalendarMonthData {
  month: number; // 0-11 (January-December)
  year: number;
  days: CalendarDay[];
}

export interface SadhanaCompletion {
  id: string;
  userId: string;
  sadhanaId: string;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO timestamp
}