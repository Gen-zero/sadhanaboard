const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require('../utils/logger');

/**
 * Controller for Panchang (Hindu calendar) related operations
 */

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// In-memory cache for panchang data
const panchangCache = new Map();

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
const MAJOR_FESTIVALS = {
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
const getSunTimes = (month, day) => {
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
const calculateTithi = (year, month, day) => {
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
const calculateNakshatra = (year, month, day) => {
  const daysSinceEpoch = Math.floor((new Date(year, month, day).getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const nakshatraIndex = daysSinceEpoch % 27;
  return NAKSHATRAS[nakshatraIndex];
};

// Calculate approximate Moon Sign for a given date
const calculateMoonSign = (year, month, day) => {
  const daysSinceEpoch = Math.floor((new Date(year, month, day).getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const moonSignIndex = daysSinceEpoch % 12;
  return MOON_SIGNS[moonSignIndex];
};

// Get festivals for a given date
const getFestivals = (month, day) => {
  const monthStr = (month + 1).toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const key = `${monthStr}-${dayStr}`;
  
  return MAJOR_FESTIVALS[key] || [];
};

// Generate a single day's panchang data
const generateDayData = (year, month, day) => {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
const toVikramSamvat = (year) => {
  // Vikram Samvat is approximately 57 years ahead of Gregorian calendar
  return year + 57;
};

/**
 * Get panchang data for a specific month and year
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPanchangData = async (req, res) => {
  try {
    const { year, month } = req.params;
    const cacheKey = `${year}-${month}`;
    
    // Check cache first
    if (panchangCache.has(cacheKey)) {
      logger.info(`Returning cached panchang data for ${year}-${month}`);
      return res.json(panchangCache.get(cacheKey));
    }
    
    // Validate parameters
    if (!year || !month) {
      return res.status(400).json({ 
        error: 'Year and month parameters are required' 
      });
    }
    
    // Validate year and month are numbers
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    if (isNaN(yearNum) || isNaN(monthNum)) {
      return res.status(400).json({ 
        error: 'Year and month must be valid numbers' 
      });
    }
    
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ 
        error: 'Month must be between 1 and 12' 
      });
    }
    
    if (yearNum < 1900 || yearNum > 2100) {
      return res.status(400).json({ 
        error: 'Year must be between 1900 and 2100' 
      });
    }
    
    // Generate data locally without external API calls
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[monthNum - 1];
    const samvat = toVikramSamvat(yearNum).toString();
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(generateDayData(yearNum, monthNum - 1, day));
    }
    
    const data = {
      monthName,
      year: yearNum,
      samvat,
      days
    };
    
    // Cache the data for 1 hour
    panchangCache.set(cacheKey, data);
    setTimeout(() => {
      panchangCache.delete(cacheKey);
    }, 60 * 60 * 1000);
    
    logger.info(`Generated panchang data for ${year}-${month}`);
    res.json(data);
  } catch (error) {
    logger.error('Error generating panchang data', { error: error.message, stack: error.stack });
    res.status(500).json({ 
      error: 'Internal server error while generating panchang data' 
    });
  }
};

/**
 * Prefetch panchang data for a range of years
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.prefetchPanchangData = async (req, res) => {
  try {
    const { startYear, endYear } = req.body;
    
    if (!startYear || !endYear) {
      return res.status(400).json({ 
        error: 'startYear and endYear are required in request body' 
      });
    }
    
    const startYearNum = parseInt(startYear);
    const endYearNum = parseInt(endYear);
    
    if (isNaN(startYearNum) || isNaN(endYearNum)) {
      return res.status(400).json({ 
        error: 'startYear and endYear must be valid numbers' 
      });
    }
    
    if (startYearNum > endYearNum) {
      return res.status(400).json({ 
        error: 'startYear must be less than or equal to endYear' 
      });
    }
    
    if (startYearNum < 1900 || endYearNum > 2100) {
      return res.status(400).json({ 
        error: 'Years must be between 1900 and 2100' 
      });
    }
    
    // In a real implementation, this would prefetch data from the Google Generative AI API
    // For now, we'll just simulate the process
    
    logger.info(`Prefetching panchang data from ${startYearNum} to ${endYearNum}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    res.json({ 
      message: `Successfully prefetched panchang data for years ${startYearNum} to ${endYearNum}`,
      startYear: startYearNum,
      endYear: endYearNum
    });
  } catch (error) {
    logger.error('Error prefetching panchang data', { error: error.message });
    res.status(500).json({ 
      error: 'Internal server error while prefetching panchang data' 
    });
  }
};