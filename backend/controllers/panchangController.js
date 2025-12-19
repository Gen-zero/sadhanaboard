const express = require('express');

// Mock data generator for panchang data
const generatePanchangData = (year, month, region) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];
  
  // Festival names for different regions
  const festivalsByRegion = {
    'Malayalam': [
      'Vishu', 'Onam', 'Thiruvathira', 'Mahashivratri', 'Navaratri',
      'Diwali', 'Christmas', 'Eid', 'Guru Purnima', 'Karva Chauth'
    ],
    'Tamil': [
      'Pongal', 'Deepavali', 'Thai Poosam', 'Maha Shivratri', 'Navratri',
      'Vinayaka Chaturthi', 'Christmas', 'Eid', 'Guru Purnima', 'Karadaiyan Nombu'
    ],
    'Kannada': [
      'Ugadi', 'Dasara', 'Maha Shivratri', 'Navratri', 'Deepavali',
      'Ganesh Chaturthi', 'Christmas', 'Eid', 'Guru Purnima', 'Akshaya Tritiya'
    ],
    'Telugu': [
      'Ugadi', 'Bonalu', 'Maha Shivratri', 'Navratri', 'Deepavali',
      'Vinayaka Chaturthi', 'Christmas', 'Eid', 'Guru Purnima', 'Sankranti'
    ],
    'North Indian (Hindi)': [
      'Holi', 'Diwali', 'Maha Shivratri', 'Navratri', 'Dussehra',
      'Ganesh Chaturthi', 'Christmas', 'Eid', 'Guru Purnima', 'Makar Sankranti'
    ],
    'Bengali': [
      'Poila Boishakh', 'Durga Puja', 'Kali Puja', 'Rath Yatra', 'Saraswati Puja',
      'Ganesh Chaturthi', 'Christmas', 'Eid', 'Guru Purnima', 'Ras Yatra'
    ],
    'Marathi': [
      'Gudi Padwa', 'Ganesh Chaturthi', 'Maha Shivratri', 'Navratri', 'Diwali',
      'Dasara', 'Christmas', 'Eid', 'Guru Purnima', 'Akshaya Tritiya'
    ]
  };
  
  const tithiNames = [
    'Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
  ];
  
  const nakshatraNames = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];
  
  const regionalMonths = [
    'Chaitra', 'Vaisakha', 'Jyaistha', 'Asadha', 'Sravana', 'Bhadra',
    'Asvina', 'Kartika', 'Agrahayana', 'Pausa', 'Magha', 'Phalguna'
  ];
  
  // Rahu Kaalam times for each day of the week
  const rahuKaalamTimes = [
    '07:30 - 09:00', '15:00 - 16:30', '12:00 - 13:30', 
    '13:30 - 15:00', '10:30 - 12:00', '09:00 - 10:30', 
    '16:30 - 18:00'
  ];
  
  // Gulika Kaalam times for each day of the week
  const gulikaKaalamTimes = [
    '10:30 - 12:00', '18:00 - 19:30', '15:00 - 16:30',
    '16:30 - 18:00', '13:30 - 15:00', '12:00 - 13:30',
    '19:30 - 21:00'
  ];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    
    // Randomly assign special days
    const isEkadashi = day % 11 === 0;
    const isPournami = day % 15 === 0;
    const isAmavasya = day % 30 === 0;
    const isAshtami = day % 8 === 0;
    
    // Select random festivals for this day (0-2 festivals)
    const numFestivals = Math.floor(Math.random() * 3);
    const festivals = [];
    const regionFestivals = festivalsByRegion[region] || festivalsByRegion['North Indian (Hindi)'];
    
    for (let i = 0; i < numFestivals; i++) {
      const randomIndex = Math.floor(Math.random() * regionFestivals.length);
      festivals.push(regionFestivals[randomIndex]);
    }
    
    // Generate random sunrise/sunset times
    const sunriseHour = 5 + Math.floor(Math.random() * 2);
    const sunriseMinute = Math.floor(Math.random() * 60);
    const sunsetHour = 17 + Math.floor(Math.random() * 2);
    const sunsetMinute = Math.floor(Math.random() * 60);
    
    const sunrise = `${sunriseHour.toString().padStart(2, '0')}:${sunriseMinute.toString().padStart(2, '0')}`;
    const sunset = `${sunsetHour.toString().padStart(2, '0')}:${sunsetMinute.toString().padStart(2, '0')}`;
    
    days.push({
      date: dateStr,
      dayNumber: day,
      tithi: tithiNames[(day - 1) % 30],
      paksha: day <= 15 ? 'Shukla' : 'Krishna',
      nakshatra: nakshatraNames[(day - 1) % 27],
      sunrise,
      sunset,
      festivals,
      isEkadashi,
      isPournami,
      isAmavasya,
      isAshtami,
      regionalMonthName: regionalMonths[(month - 1) % 12],
      rahuKaalam: rahuKaalamTimes[dayOfWeek],
      gulikaKaalam: gulikaKaalamTimes[dayOfWeek],
      auspiciousTime: '12:00 - 13:00'
    });
  }
  
  return {
    month,
    year,
    region,
    days
  };
};

exports.getPanchangData = async (req, res) => {
  try {
    const { year, month, region } = req.query;
    
    // Validate inputs
    if (!year || !month || !region) {
      return res.status(400).json({
        error: 'Missing required parameters: year, month, region'
      });
    }
    
    // Validate year and month
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        error: 'Invalid year or month. Month should be between 1-12.'
      });
    }
    
    // Generate mock data (in a real implementation, this would fetch from a database or external API)
    const data = generatePanchangData(yearNum, monthNum, region);
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching panchang data:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};