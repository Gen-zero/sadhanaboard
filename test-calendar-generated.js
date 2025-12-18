
const mockLocalStorage = {"data":{}};
const console = { log: (...args) => process.stdout.write(args.join(' ') + '\n'), warn: (...args) => process.stderr.write(args.join(' ') + '\n'), error: (...args) => process.stderr.write(args.join(' ') + '\n') };



const CACHE_PREFIX = 'kali_panchang_data_v2_';

// Helper to determine day of week for the 1st of the month to pad the grid
const getStartPadding = (year, monthIndex) => {
  return new Date(year, monthIndex, 1).getDay();
};

const getDaysInMonth = (year, monthIndex) => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const getCacheKey = (year, monthIndex) => {
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
const MAJOR_FESTIVALS<string, string[]> = {
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
const getSunTimes = (month, day): { sunrise; sunset } => {
  // Approximate values based on seasonal variations
  // Note is 0-indexed, so this mapping is correct
  const sunTimes = [
    { rise: "07:10", set: "17:45" }, // January (month 0)
    { rise: "06:55", set: "18:15" }, // February (month 1)
    { rise: "06:25", set: "18:35" }, // March (month 2)
    { rise: "05:55", set: "18:50" }, // April (month 3)
    { rise: "05:25", set: "19:05" }, // May (month 4)
    { rise: "05:10", set: "19:20" }, // June (month 5)
    { rise: "05:20", set: "19:15" }, // July (month 6)
    { rise: "05:40", set: "18:55" }, // August (month 7)
    { rise: "06:00", set: "18:25" }, // September (month 8)
    { rise: "06:20", set: "17:50" }, // October (month 9)
    { rise: "06:45", set: "17:30" }, // November (month 10)
    { rise: "07:05", set: "17:35" }  // December (month 11)
  ];
  
  // Ensure month is within bounds
  const normalizedMonth = Math.max(0, Math.min(11, month));
  
  return {
    sunrise[normalizedMonth].rise,
    sunset[normalizedMonth].set
  };
};

// Calculate approximate Tithi for a given date
const calculateTithi = (year, month, day): { name; paksha: 'Shukla' | 'Krishna' } => {
  // Improved calculation based on lunar cycle
  // In reality, this would require complex astronomical calculations
  const daysSinceEpoch = Math.floor((new Date(year, month, day).getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate lunar phase (0-359 degrees)
  const lunarPhase = ((daysSinceEpoch * 12.195) % 360 + 360) % 360; // ~12.195 degrees per day
  
  // Convert to tithi index (0-29)
  const tithiIndex = Math.floor(lunarPhase / 12); // Each tithi is ~12 degrees
  
  // Ensure tithiIndex is within bounds
  const normalizedTithiIndex = tithiIndex % 30;
  
  if (normalizedTithiIndex < 15) {
    return {
      name[normalizedTithiIndex],
      paksha: 'Shukla'
    };
  } else {
    return {
      name[normalizedTithiIndex - 15],
      paksha: 'Krishna'
    };
  }
};

// Calculate approximate Nakshatra for a given date
const calculateNakshatra = (year, month, day) => {
  const daysSinceEpoch = Math.floor((new Date(year, month, day).getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  // Each nakshatra is approximately 13.33 degrees, and the moon moves ~13.17 degrees per day
  const nakshatraProgress = (daysSinceEpoch * 13.17) % 360;
  const nakshatraIndex = Math.floor(nakshatraProgress / (360 / 27));
  return NAKSHATRAS[nakshatraIndex % 27];
};

// Calculate approximate Moon Sign for a given date
const calculateMoonSign = (year, month, day) => {
  const daysSinceEpoch = Math.floor((new Date(year, month, day).getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  // The moon spends approximately 2.5 days in each sign (30°/12.195° per day)
  const moonSignProgress = (daysSinceEpoch * 12.195) % 360;
  const moonSignIndex = Math.floor(moonSignProgress / 30);
  return MOON_SIGNS[moonSignIndex % 12];
};

// Get festivals for a given date
const getFestivals = (month, day)[] => {
  // Month is 0-indexed, so we need to add 1 for the lookup
  const monthStr = (month + 1).toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const key = `${monthStr}-${dayStr}`;
  
  return MAJOR_FESTIVALS[key] || [];
};

// Generate a single day's panchang data
const generateDayData = (year, month, day) => {
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
    date,
    month,
    year,
    dayOfWeek,
    tithi,
    nakshatra: {
      name
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
const toVikramSamvat = (year) => {
  // Vikram Samvat is approximately 57 years ahead of Gregorian calendar
  return year + 57;
};

const generatePanchangData = (year, monthIndex)<MonthData> => {
  // 1. Check Local Storage Cache
  const cacheKey = getCacheKey(year, monthIndex);
  try {
    const cachedData = mockLocalStorage.getItem(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData) ;
      // Robust validation to ensure it's properly structured data
      if (parsed.year === year && 
          parsed.monthName && 
          parsed.days && 
          Array.isArray(parsed.days) && 
          parsed.days.length > 0 &&
          parsed.days[0].date !== undefined) {
        // Return a promise that resolves immediately to mimic behavior
        return Promise.resolve(parsed);
      } else {
        // Invalid cache data, remove it
        mockLocalStorage.removeItem(cacheKey);
      }
    }
  } catch (e) {
    console.warn("Failed to read from cache", e);
    mockLocalStorage.removeItem(cacheKey); // Clear corrupt data
  }

  // 2. Generate data locally without external API calls
  try {
    const monthName = monthNames[monthIndex];
    const samvat = toVikramSamvat(year).toString();
    const daysInMonth = getDaysInMonth(year, monthIndex);
    
    const days[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(generateDayData(year, monthIndex, day));
    }
    
    const data = {
      monthName,
      year,
      samvat,
      days
    };
    
    // 3. Save to Local Storage
    try {
      mockLocalStorage.setItem(cacheKey, JSON.stringify(data));
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
const prefetchRange = (
  centerYear, 
  range, 
  onProgress: (status, progress) => void
)<void> => {
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
      
      if (mockLocalStorage.getItem(cacheKey)) {
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

// Test the function
generatePanchangData(2025, 11) // December 2025
  .then(data => {
    console.log('Generated data for December 2025:');
    console.log('Month:', data.monthName);
    console.log('Year:', data.year);
    console.log('Number of days:', data.days.length);
    console.log('First day:', JSON.stringify(data.days[0], null, 2));
    console.log('Last day:', JSON.stringify(data.days[data.days.length - 1], null, 2));
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
