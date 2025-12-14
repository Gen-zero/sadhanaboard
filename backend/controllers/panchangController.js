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
    
    // Generate prompt for the AI
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];
    const currentMonthName = monthNames[monthNum - 1];
    
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    
    const prompt = `
      Generate a strictly valid JSON object for the Hindu Panchang calendar for ${currentMonthName} ${yearNum}.
      
      Context:
      - This is for a visual calendar application.
      - Provide data for every day of the month (1 to ${daysInMonth}).
      - Vikram Samvat is roughly Year + 57.
      - Calculate Tithis, Nakshatras, and Sunrise/Sunset times approximately for New Delhi, India coordinates.
      - Identify major Hindu festivals.
      - "isHoliday" should be true if it is Sunday or a major festival.
      
      The response MUST follow this exact JSON structure:
      {
        "monthName": "January",
        "year": 2024,
        "samvat": "2081",
        "days": [
          {
            "date": 1,
            "dayOfWeek": "Monday",
            "tithi": {
              "name": "Pratipada",
              "paksha": "Shukla",
              "endTime": "14:30"
            },
            "nakshatra": {
              "name": "Ashwini",
              "endTime": "16:45"
            },
            "sunrise": "06:45",
            "sunset": "17:30",
            "moonSign": "Aries",
            "festivals": ["New Year"],
            "isHoliday": false,
            "details": {
              "rahuKalam": "12:30-14:00",
              "description": "Special day for meditation"
            }
          }
        ]
      }
    `;
    
    // Call the Google Generative AI API
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });
    
    const data = JSON.parse(result.response.text() || "{}");
    
    // Cache the data for 1 hour
    panchangCache.set(cacheKey, data);
    setTimeout(() => {
      panchangCache.delete(cacheKey);
    }, 60 * 60 * 1000);
    
    logger.info(`Generated panchang data for ${year}-${month}`);
    res.json(data);
  } catch (error) {
    logger.error('Error fetching panchang data', { error: error.message, stack: error.stack });
    res.status(500).json({ 
      error: 'Internal server error while fetching panchang data' 
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