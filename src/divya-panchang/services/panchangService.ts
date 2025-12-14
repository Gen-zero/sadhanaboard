import { MonthData, PanchangDay } from "../types";

const CACHE_PREFIX = 'kali_panchang_data_v2_';

// Helper to determine day of week for the 1st of the month to pad the grid
export const getStartPadding = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex, 1).getDay();
};

export const getDaysInMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const getCacheKey = (year: number, monthIndex: number): string => {
  return `${CACHE_PREFIX}${year}_${monthIndex}`;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Tithi names for Shukla Paksha (waxing moon)
const SHUKLA_TITHIS = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", 
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dvadashi", "Trayodashi", "Chaturdashi", "Purnima"
];

// Tithi names for Krishna Paksha (waning moon)
const KRISHNA_TITHIS = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", 
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dvadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

// Nakshatra names
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", 
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

// Moon signs
const MOON_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Major Hindu festivals (simplified)
const MAJOR_FESTIVALS: Record<string, string[]> = {
  "01-01": ["New Year"],
  "01-14": ["Makar Sankranti"],
  "01-15": ["Pongal"],
  "02-01": ["Vasant Panchami"],
  "03-08": ["Maha Shivratri"],
  "03-22": ["Holi"],
  "04-09": ["Ram Navami"],
  "04-14": ["Vaisakhi", "Tamil New Year"],
  "05-01": ["May Day"],
  "05-18": ["Buddha Purnima"],
  "07-21": ["Raksha Bandhan"],
  "08-15": ["Krishna Janmashtami"],
  "09-05": ["Ganesh Chaturthi"],
  "09-21": ["Navratri Begins"],
  "09-30": ["Dussehra"],
  "10-02": ["Gandhi Jayanti"],
  "10-15": ["Sharad Purnima"],
  "10-24": ["Diwali", "Lakshmi Puja"],
  "10-25": ["Govardhan Puja"],
  "10-26": ["Bhai Dooj"],
  "12-25": ["Christmas"]
};

// Approximate sunrise/sunset times for New Delhi (hours:minutes)
const getSunTimes = (month: number, day: number): { sunrise: string; sunset: string } => {
  // Approximate values based on seasonal variations
  const sunTimes = [
    { rise: "07:10", set: "17:45" }, // January
    { rise: "06:55", set: "18:15" }, // February
    { rise: "06:25", set: "18:35" }, // March
    { rise: "05:55", set: "18:50" }, // April
    { rise: "05:25", set: "19:05" }, // May
    { rise: "05:10", set: "19:20" }, // June
    { rise: "05:20", set: "19:15" }, // July
    { rise: "05:40", set: "18:55" }, // August
    { rise: "06:00", set: "18:25" }, // September
    { rise: "06:20", set: "17:50" }, // October
    { rise: "06:45", set: "17:30" }, // November
    { rise: "07:05", set: "17:35" }  // December
  ];
  
  return {
    sunrise: sunTimes[month].rise,
    sunset: sunTimes[month].set
  };
};

// Calculate approximate Tithi for a given date
const calculateTithi = (year: number, month: number, day: number): { name: string; paksha: 'Shukla' | 'Krishna' } => {
  // Simplified calculation based on lunar cycle
  // In reality, this would require complex astronomical calculations
  const daysSinceEpoch = Math.floor((new Date(year, month, day).getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const lunarPhase = (daysSinceEpoch % 29.5 + 29.5) % 29.5; // 0-29.5 day cycle
  
  const tithiIndex = Math.floor(lunarPhase / (29.5 / 30)); // Scale to 0-29
  
  if (tithiIndex < 15) {
    return {
      name: SHUKLA_TITHIS[tithiIndex],
      paksha: 'Shukla'
    };
  } else {
    return {
      name: KRISHNA_TITHIS[tithiIndex - 15],
      paksha: 'Krishna'
    };
  }
};

// Calculate approximate Nakshatra for a given date
const calculateNakshatra = (year: number, month: number, day: number): string => {
  const daysSinceEpoch = Math.floor((new Date(year, month, day).getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const nakshatraIndex = daysSinceEpoch % 27;
  return NAKSHATRAS[nakshatraIndex];
};

// Calculate approximate Moon Sign for a given date
const calculateMoonSign = (year: number, month: number, day: number): string => {
  const daysSinceEpoch = Math.floor((new Date(year, month, day).getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const moonSignIndex = daysSinceEpoch % 12;
  return MOON_SIGNS[moonSignIndex];
};

// Get festivals for a given date
const getFestivals = (month: number, day: number): string[] => {
  const monthStr = (month + 1).toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const key = `${monthStr}-${dayStr}`;
  
  return MAJOR_FESTIVALS[key] || [];
};

// Generate a single day's panchang data
const generateDayData = (year: number, month: number, day: number): PanchangDay => {
  const dateObj = new Date(year, month, day);
  const dayOfWeek = dayNames[dateObj.getDay()];
  
  const tithi = calculateTithi(year, month, day);
  const nakshatra = calculateNakshatra(year, month, day);
  const moonSign = calculateMoonSign(year, month, day);
  const festivals = getFestivals(month, day);
  const { sunrise, sunset } = getSunTimes(month, day);
  
  // Holiday if it's Sunday or a major festival
  const isHoliday = dayOfWeek === "Sunday" || festivals.length > 0;
  
  return {
    date: day,
    dayOfWeek,
    tithi,
    nakshatra: {
      name: nakshatra
    },
    sunrise,
    sunset,
    moonSign,
    festivals,
    isHoliday,
    details: {
      rahuKalam: "12:00-13:30",
      description: `Auspicious day for spiritual practices`
    }
  };
};

// Convert Gregorian year to Vikram Samvat
const toVikramSamvat = (year: number): number => {
  // Vikram Samvat is approximately 57 years ahead of Gregorian calendar
  return year + 57;
};

export const generatePanchangData = async (year: number, monthIndex: number): Promise<MonthData> => {
  // 1. Check Local Storage Cache
  const cacheKey = getCacheKey(year, monthIndex);
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData) as MonthData;
      // Simple validation to ensure it's not a corrupt empty object
      if (parsed.year === year && parsed.days && parsed.days.length > 0) {
        // Return a promise that resolves immediately to mimic async behavior
        return Promise.resolve(parsed);
      }
    }
  } catch (e) {
    console.warn("Failed to read from cache", e);
    localStorage.removeItem(cacheKey); // Clear corrupt data
  }

  // 2. Generate data locally without external API calls
  try {
    const monthName = monthNames[monthIndex];
    const samvat = toVikramSamvat(year).toString();
    const daysInMonth = getDaysInMonth(year, monthIndex);
    
    const days: PanchangDay[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(generateDayData(year, monthIndex, day));
    }
    
    const data: MonthData = {
      monthName,
      year,
      samvat,
      days
    };
    
    // 3. Save to Local Storage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {
      console.error("LocalStorage full or disabled", e);
    }

    return data;

  } catch (error) {
    console.error("Failed to generate Panchang data", error);
    throw new Error("Unable to generate Panchang data.");
  }
};

/**
 * Downloads data for the specified range of years relative to the center year.
 * Checks cache first, skips if exists.
 * @param centerYear The year to pivot around (usually current year)
 * @param range The number of years before and after (e.g. 2 means [center-2, center+2])
 * @param onProgress Callback for UI updates
 */
export const prefetchRange = async (
  centerYear: number, 
  range: number, 
  onProgress: (status: string, progress: number) => void
): Promise<void> => {
  const startYear = centerYear - range;
  const endYear = centerYear + range;
  const totalMonths = (endYear - startYear + 1) * 12;
  let processed = 0;

  for (let y = startYear; y <= endYear; y++) {
    for (let m = 0; m < 12; m++) {
      const monthName = monthNames[m];
      const cacheKey = getCacheKey(y, m);
      
      // Update Progress
      processed++;
      const percent = Math.round((processed / totalMonths) * 100);
      
      if (localStorage.getItem(cacheKey)) {
        onProgress(`Verified ${monthName} ${y}`, percent);
        // Small delay to allow UI to update even if cached
        await new Promise(r => setTimeout(r, 10));
        continue;
      }

      onProgress(`Generating ${monthName} ${y}...`, percent);
      
      try {
        await generatePanchangData(y, m);
        // Small delay to allow UI to update
        await new Promise(r => setTimeout(r, 50)); 
      } catch (err) {
        console.error(`Error generating ${monthName} ${y}`, err);
        // Continue to next month even if one fails
      }
    }
  }
};