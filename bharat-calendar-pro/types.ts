
export enum Region {
  MALAYALAM = 'Malayalam',
  TAMIL = 'Tamil',
  KANNADA = 'Kannada',
  TELUGU = 'Telugu',
  NORTH_INDIAN = 'North Indian (Hindi)',
  BENGALI = 'Bengali',
  MARATHI = 'Marathi'
}

export interface PanchangDay {
  date: string; // ISO format
  dayNumber: number;
  tithi: string;
  paksha: 'Shukla' | 'Krishna';
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  moonPhase: string;
  festivals: string[];
  isEkadashi: boolean;
  isPournami: boolean;
  isAmavasya: boolean;
  isAshtami: boolean;
  sankranthi?: string;
  publicHoliday?: string;
  regionalMonthName: string;
  auspiciousTime?: string;
  rahuKaalam: string;
  gulikaKaalam: string;
}

export interface CalendarMonthData {
  month: number;
  year: number;
  region: Region;
  days: PanchangDay[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
}
