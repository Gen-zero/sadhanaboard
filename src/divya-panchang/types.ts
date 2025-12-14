export interface Tithi {
  name: string;
  paksha: 'Shukla' | 'Krishna';
  endTime?: string;
}

export interface Nakshatra {
  name: string;
  endTime?: string;
}

export interface DayDetails {
  rahuKalam?: string;
  description?: string;
}

export interface PanchangDay {
  date: number;
  dayOfWeek: string;
  tithi: Tithi;
  nakshatra: Nakshatra;
  sunrise: string;
  sunset: string;
  moonSign: string;
  festivals: string[];
  isHoliday: boolean;
  details?: DayDetails;
}

export interface MonthData {
  monthName: string;
  year: number;
  samvat: string;
  days: PanchangDay[];
}