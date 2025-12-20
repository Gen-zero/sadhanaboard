// Festival data parsed from festivals.txt
export interface Festival {
  name: string;
  date: string; // Format: "Month Day, Year, Weekday"
  month: string;
  day: number;
  year: number;
}

// Festival data for 2025 and 2026
export const festivalData: any = {
  "2025": {
    "January": {
      "Pausha Putrada Ekadashi": "January 10, 2025, Friday",
      "Pausha Purnima": "January 13, 2025, Monday",
      "Makara Sankranti": "January 14, 2025, Tuesday",
      "Pongal": "January 14, 2025, Tuesday",
      "Purna Kumbha @Prayagraj": "January 14, 2025, Tuesday",
      "Sakat Chauth": "January 17, 2025, Friday",
      "Shattila Ekadashi": "January 25, 2025, Saturday",
      "Mauni Amavas": "January 29, 2025, Wednesday"
    },
    "February": {
      "Vasant Panchami": "February 2, 2025, Sunday",
      "Ratha Saptami": "February 4, 2025, Tuesday",
      "Bhishma Ashtami": "February 5, 2025, Wednesday",
      "Jaya Ekadashi": "February 8, 2025, Saturday",
      "Kumbha Sankranti": "February 12, 2025, Wednesday",
      "Purna Kumbha ends @Prayagraj": "February 12, 2025, Wednesday",
      "Magha Purnima": "February 12, 2025, Wednesday",
      "Vijaya Ekadashi": "February 24, 2025, Monday",
      "Maha Shivaratri": "February 26, 2025, Wednesday"
    },
    "March": {
      "Amalaki Ekadashi": "March 10, 2025, Monday",
      "Chhoti Holi": "March 13, 2025, Thursday",
      "Holika Dahan": "March 13, 2025, Thursday",
      "Holi": "March 14, 2025, Friday",
      "Meena Sankranti": "March 14, 2025, Friday",
      "Chandra Grahan (Purna)": "March 14, 2025, Friday",
      "Phalguna Purnima": "March 14, 2025, Friday",
      "Sheetala Ashtami": "March 22, 2025, Saturday",
      "Basoda": "March 22, 2025, Saturday",
      "Papamochani Ekadashi": "March 25, 2025, Tuesday",
      "Surya Grahan (Anshika)": "March 29, 2025, Saturday",
      "Ugadi": "March 30, 2025, Sunday",
      "Gudi Padwa": "March 30, 2025, Sunday",
      "Chaitra Navratri": "March 30, 2025, Sunday",
      "Gauri Puja": "March 31, 2025, Monday",
      "Gangaur": "March 31, 2025, Monday"
    },
    "April": {
      "Yamuna Chhath": "April 3, 2025, Thursday",
      "Rama Navami": "April 6, 2025, Sunday",
      "Swaminarayan Jayanti": "April 6, 2025, Sunday",
      "Kamada Ekadashi": "April 8, 2025, Tuesday",
      "Hanuman Jayanti": "April 12, 2025, Saturday",
      "Hanuman Janmotsava": "April 12, 2025, Saturday",
      "Chaitra Purnima": "April 12, 2025, Saturday",
      "Mesha Sankranti": "April 14, 2025, Monday",
      "Solar New Year": "April 14, 2025, Monday",
      "Varuthini Ekadashi": "April 24, 2025, Thursday",
      "Parashurama Jayanti": "April 29, 2025, Tuesday",
      "Akshaya Tritiya": "April 30, 2025, Wednesday"
    },
    "May": {
      "Ganga Saptami": "May 3, 2025, Saturday",
      "Sita Navami": "May 5, 2025, Monday",
      "Mohini Ekadashi": "May 8, 2025, Thursday",
      "Narasimha Jayanti": "May 11, 2025, Sunday",
      "Buddha Purnima": "May 12, 2025, Monday",
      "Vaishakha Purnima": "May 12, 2025, Monday",
      "Narada Jayanti": "May 13, 2025, Tuesday",
      "Vrishabha Sankranti": "May 15, 2025, Thursday",
      "Apara Ekadashi": "May 23, 2025, Friday",
      "Vat Savitri Vrat": "May 26, 2025, Monday",
      "Shani Jayanti": "May 27, 2025, Tuesday"
    },
    "June": {
      "Ganga Dussehra": "June 5, 2025, Thursday",
      "Nirjala Ekadashi": "June 6, 2025, Friday",
      "Vat Purnima Vrat": "June 10, 2025, Tuesday",
      "Jyeshtha Purnima": "June 11, 2025, Wednesday",
      "Mithuna Sankranti": "June 15, 2025, Sunday",
      "Yogini Ekadashi": "June 21, 2025, Saturday",
      "Gauna Yogini Ekadashi": "June 22, 2025, Sunday",
      "Jagannath Rathyatra": "June 27, 2025, Friday"
    },
    "July": {
      "Devshayani Ekadashi": "July 6, 2025, Sunday",
      "Guru Purnima": "July 10, 2025, Thursday",
      "Ashadha Purnima": "July 10, 2025, Thursday",
      "Karka Sankranti": "July 16, 2025, Wednesday",
      "Kamika Ekadashi": "July 21, 2025, Monday",
      "Hariyali Teej": "July 27, 2025, Sunday",
      "Nag Panchami": "July 29, 2025, Tuesday"
    },
    "August": {
      "Shravana Putrada Ekadashi": "August 5, 2025, Tuesday",
      "Varalakshmi Vrat": "August 8, 2025, Friday",
      "Raksha Bandhan": "August 9, 2025, Saturday",
      "Rakhi": "August 9, 2025, Saturday",
      "Gayatri Jayanti": "August 9, 2025, Saturday",
      "Shravana Purnima": "August 9, 2025, Saturday",
      "Kajari Teej": "August 12, 2025, Tuesday",
      "Janmashtami (Smarta)": "August 15, 2025, Friday",
      "Janmashtami (ISKCON)": "August 16, 2025, Saturday",
      "Simha Sankranti": "August 17, 2025, Sunday",
      "Aja Ekadashi": "August 19, 2025, Tuesday",
      "Hartalika Teej": "August 26, 2025, Tuesday",
      "Ganesh Chaturthi": "August 27, 2025, Wednesday",
      "Rishi Panchami": "August 28, 2025, Thursday",
      "Balarama Jayanti": "August 29, 2025, Friday",
      "Radha Ashtami": "August 31, 2025, Sunday"
    },
    "September": {
      "Parsva Ekadashi": "September 3, 2025, Wednesday",
      "Agastya Arghya": "September 4, 2025, Thursday",
      "Onam": "September 5, 2025, Friday",
      "Ganesh Visarjan": "September 6, 2025, Saturday",
      "Anant Chaturdashi": "September 6, 2025, Saturday",
      "Chandra Grahan (Purna)": "September 7, 2025, Sunday",
      "Bhadrapada Purnima": "September 7, 2025, Sunday",
      "Pitrupaksha Begins": "September 8, 2025, Monday",
      "Vishwakarma Puja": "September 17, 2025, Wednesday",
      "Kanya Sankranti": "September 17, 2025, Wednesday",
      "Indira Ekadashi": "September 17, 2025, Wednesday",
      "Sarva Pitru Amavasya": "September 21, 2025, Sunday",
      "Navratri Begins": "September 22, 2025, Monday",
      "Surya Grahan (Anshika)": "September 22, 2025, Monday",
      "Saraswati Avahan": "September 29, 2025, Monday",
      "Saraswati Puja": "September 30, 2025, Tuesday",
      "Durga Ashtami": "September 30, 2025, Tuesday"
    },
    "October": {
      "Maha Navami": "October 1, 2025, Wednesday",
      "Vijayadashami": "October 2, 2025, Thursday",
      "Dussehra": "October 2, 2025, Thursday",
      "Papankusha Ekadashi": "October 3, 2025, Friday",
      "Kojagara Puja": "October 6, 2025, Monday",
      "Sharad Purnima": "October 6, 2025, Monday",
      "Ashwina Purnima": "October 7, 2025, Tuesday",
      "Karwa Chauth": "October 10, 2025, Friday",
      "Ahoi Ashtami": "October 13, 2025, Monday",
      "Govatsa Dwadashi": "October 17, 2025, Friday",
      "Tula Sankranti": "October 17, 2025, Friday",
      "Rama Ekadashi": "October 17, 2025, Friday",
      "Dhanteras": "October 18, 2025, Saturday",
      "Kali Chaudas": "October 19, 2025, Sunday",
      "Lakshmi Puja": "October 20, 2025, Monday",
      "Narak Chaturdashi": "October 20, 2025, Monday",
      "Diwali": "October 20, 2025, Monday",
      "Govardhan Puja": "October 22, 2025, Wednesday",
      "Bhaiya Dooj": "October 23, 2025, Thursday",
      "Chhath Puja": "October 27, 2025, Monday"
    },
    "November": {
      "Kansa Vadh": "November 1, 2025, Saturday",
      "Devutthana Ekadashi": "November 1, 2025, Saturday",
      "Tulasi Vivah": "November 2, 2025, Sunday",
      "Gauna Devutthana Ekadashi": "November 2, 2025, Sunday",
      "Kartika Purnima": "November 5, 2025, Wednesday",
      "Kalabhairav Jayanti": "November 12, 2025, Wednesday",
      "Utpanna Ekadashi": "November 15, 2025, Saturday",
      "Vrishchika Sankranti": "November 16, 2025, Sunday",
      "Vivah Panchami": "November 25, 2025, Tuesday"
    },
    "December": {
      "Gita Jayanti": "December 1, 2025, Monday",
      "Mokshada Ekadashi": "December 1, 2025, Monday",
      "Dattatreya Jayanti": "December 4, 2025, Thursday",
      "Margashirsha Purnima": "December 4, 2025, Thursday",
      "Saphala Ekadashi": "December 15, 2025, Monday",
      "Dhanu Sankranti": "December 16, 2025, Tuesday",
      "Pausha Putrada Ekadashi": "December 30, 2025, Tuesday",
      "Gauna Pausha Putrada Ekadashi": "December 31, 2025, Wednesday"
    }
  },
  "2026": {
    "January": {
      "Pausha Purnima": "January 3, 2026, Saturday",
      "Sakat Chauth": "January 6, 2026, Tuesday",
      "Makara Sankranti": "January 14, 2026, Wednesday",
      "Pongal": "January 14, 2026, Wednesday",
      "Shattila Ekadashi": "January 14, 2026, Wednesday",
      "Mauni Amavas": "January 18, 2026, Sunday",
      "Vasant Panchami": "January 23, 2026, Friday",
      "Ratha Saptami": "January 25, 2026, Sunday",
      "Bhishma Ashtami": "January 26, 2026, Monday",
      "Jaya Ekadashi": "January 29, 2026, Thursday"
    },
    "February": {
      "Magha Purnima": "February 1, 2026, Sunday",
      "Kumbha Sankranti": "February 13, 2026, Friday",
      "Vijaya Ekadashi": "February 13, 2026, Friday",
      "Maha Shivaratri": "February 15, 2026, Sunday",
      "Surya Grahan (Valayakara)": "February 17, 2026, Tuesday",
      "Amalaki Ekadashi": "February 27, 2026, Friday"
    },
    "March": {
      "Chhoti Holi": "March 3, 2026, Tuesday",
      "Holika Dahan": "March 3, 2026, Tuesday",
      "Chandra Grahan (Purna)": "March 3, 2026, Tuesday",
      "Phalguna Purnima": "March 3, 2026, Tuesday",
      "Holi": "March 4, 2026, Wednesday",
      "Sheetala Ashtami": "March 11, 2026, Wednesday",
      "Basoda": "March 11, 2026, Wednesday",
      "Meena Sankranti": "March 15, 2026, Sunday",
      "Papamochani Ekadashi": "March 15, 2026, Sunday",
      "Ugadi": "March 19, 2026, Thursday",
      "Gudi Padwa": "March 19, 2026, Thursday",
      "Chaitra Navratri": "March 19, 2026, Thursday",
      "Gauri Puja": "March 21, 2026, Saturday",
      "Gangaur": "March 21, 2026, Saturday",
      "Yamuna Chhath": "March 24, 2026, Tuesday",
      "Rama Navami (Smarta)": "March 26, 2026, Thursday",
      "Rama Navami (ISKCON)": "March 27, 2026, Friday",
      "Swaminarayan Jayanti": "March 27, 2026, Friday",
      "Kamada Ekadashi": "March 29, 2026, Sunday"
    },
    "April": {
      "Hanuman Jayanti": "April 2, 2026, Thursday",
      "Hanuman Janmotsava": "April 2, 2026, Thursday",
      "Chaitra Purnima": "April 2, 2026, Thursday",
      "Varuthini Ekadashi": "April 13, 2026, Monday",
      "Mesha Sankranti": "April 14, 2026, Tuesday",
      "Solar New Year": "April 14, 2026, Tuesday",
      "Parashurama Jayanti": "April 19, 2026, Sunday",
      "Akshaya Tritiya": "April 19, 2026, Sunday",
      "Ganga Saptami": "April 23, 2026, Thursday",
      "Sita Navami": "April 25, 2026, Saturday",
      "Mohini Ekadashi": "April 27, 2026, Monday",
      "Narasimha Jayanti": "April 30, 2026, Thursday"
    },
    "May": {
      "Buddha Purnima": "May 1, 2026, Friday",
      "Vaishakha Purnima": "May 1, 2026, Friday",
      "Narada Jayanti": "May 2, 2026, Saturday",
      "Apara Ekadashi": "May 13, 2026, Wednesday",
      "Vrishabha Sankranti": "May 15, 2026, Friday",
      "Vat Savitri Vrat": "May 16, 2026, Saturday",
      "Shani Jayanti": "May 16, 2026, Saturday",
      "Ganga Dussehra": "May 25, 2026, Monday",
      "Padmini Ekadashi": "May 27, 2026, Wednesday",
      "Jyeshtha Adhika Purnima": "May 31, 2026, Sunday"
    },
    "June": {
      "Parama Ekadashi": "June 11, 2026, Thursday",
      "Mithuna Sankranti": "June 15, 2026, Monday",
      "Nirjala Ekadashi": "June 25, 2026, Thursday",
      "Vat Purnima Vrat": "June 29, 2026, Monday",
      "Jyeshtha Purnima": "June 29, 2026, Monday"
    },
    "July": {
      "Yogini Ekadashi": "July 10, 2026, Friday",
      "Gauna Yogini Ekadashi": "July 11, 2026, Saturday",
      "Jagannath Rathyatra": "July 16, 2026, Thursday",
      "Karka Sankranti": "July 16, 2026, Thursday",
      "Devshayani Ekadashi": "July 25, 2026, Saturday",
      "Guru Purnima": "July 29, 2026, Wednesday",
      "Ashadha Purnima": "July 29, 2026, Wednesday"
    },
    "August": {
      "Kamika Ekadashi": "August 9, 2026, Sunday",
      "Surya Grahan (Purna)": "August 12, 2026, Wednesday",
      "Hariyali Teej": "August 15, 2026, Saturday",
      "Nag Panchami": "August 17, 2026, Monday",
      "Simha Sankranti": "August 17, 2026, Monday",
      "Shravana Putrada Ekadashi": "August 23, 2026, Sunday",
      "Onam": "August 26, 2026, Wednesday",
      "Varalakshmi Vrat": "August 28, 2026, Friday",
      "Raksha Bandhan": "August 28, 2026, Friday",
      "Rakhi": "August 28, 2026, Friday",
      "Gayatri Jayanti": "August 28, 2026, Friday",
      "Chandra Grahan (Anshika)": "August 28, 2026, Friday",
      "Shravana Purnima": "August 28, 2026, Friday",
      "Kajari Teej": "August 31, 2026, Monday"
    },
    "September": {
      "Krishna Janmashtami": "September 4, 2026, Friday",
      "Agastya Arghya": "September 4, 2026, Friday",
      "Aja Ekadashi": "September 7, 2026, Monday",
      "Hartalika Teej": "September 14, 2026, Monday",
      "Ganesh Chaturthi": "September 14, 2026, Monday",
      "Rishi Panchami": "September 15, 2026, Tuesday",
      "Balarama Jayanti": "September 16, 2026, Wednesday",
      "Vishwakarma Puja": "September 17, 2026, Thursday",
      "Kanya Sankranti": "September 17, 2026, Thursday",
      "Radha Ashtami": "September 19, 2026, Saturday",
      "Parsva Ekadashi": "September 22, 2026, Tuesday",
      "Ganesh Visarjan": "September 25, 2026, Friday",
      "Anant Chaturdashi": "September 25, 2026, Friday",
      "Bhadrapada Purnima": "September 26, 2026, Saturday",
      "Pitrupaksha Begins": "September 27, 2026, Sunday"
    },
    "October": {
      "Indira Ekadashi": "October 6, 2026, Tuesday",
      "Sarva Pitru Amavasya": "October 10, 2026, Saturday",
      "Navratri Begins": "October 11, 2026, Sunday",
      "Saraswati Avahan": "October 16, 2026, Friday",
      "Saraswati Puja": "October 17, 2026, Saturday",
      "Tula Sankranti": "October 17, 2026, Saturday",
      "Durga Ashtami": "October 19, 2026, Monday",
      "Maha Navami": "October 19, 2026, Monday",
      "Vijayadashami": "October 20, 2026, Tuesday",
      "Dussehra": "October 20, 2026, Tuesday",
      "Papankusha Ekadashi": "October 22, 2026, Thursday",
      "Kojagara Puja": "October 25, 2026, Sunday",
      "Sharad Purnima": "October 25, 2026, Sunday",
      "Ashwina Purnima": "October 26, 2026, Monday",
      "Karwa Chauth": "October 29, 2026, Thursday"
    },
    "November": {
      "Ahoi Ashtami": "November 1, 2026, Sunday",
      "Govatsa Dwadashi": "November 5, 2026, Thursday",
      "Rama Ekadashi": "November 5, 2026, Thursday",
      "Dhanteras": "November 6, 2026, Friday",
      "Kali Chaudas": "November 7, 2026, Saturday",
      "Lakshmi Puja": "November 8, 2026, Sunday",
      "Narak Chaturdashi": "November 8, 2026, Sunday",
      "Diwali": "November 8, 2026, Sunday",
      "Govardhan Puja": "November 10, 2026, Tuesday",
      "Bhaiya Dooj": "November 11, 2026, Wednesday",
      "Chhath Puja": "November 15, 2026, Sunday",
      "Vrishchika Sankranti": "November 16, 2026, Monday",
      "Kansa Vadh": "November 20, 2026, Friday",
      "Devutthana Ekadashi": "November 20, 2026, Friday",
      "Tulasi Vivah": "November 21, 2026, Saturday",
      "Gauna Devutthana Ekadashi": "November 21, 2026, Saturday",
      "Kartika Purnima": "November 24, 2026, Tuesday"
    },
    "December": {
      "Kalabhairav Jayanti": "December 1, 2026, Tuesday",
      "Utpanna Ekadashi": "December 4, 2026, Friday",
      "Vivah Panchami": "December 14, 2026, Monday",
      "Dhanu Sankranti": "December 16, 2026, Wednesday",
      "Gita Jayanti": "December 20, 2026, Sunday",
      "Mokshada Ekadashi": "December 20, 2026, Sunday",
      "Dattatreya Jayanti": "December 23, 2026, Wednesday",
      "Margashirsha Purnima": "December 23, 2026, Wednesday"
    }
  }
};

// Helper function to get festivals for a specific date
export const getFestivalsForDate = (year: number, month: string, day: number): string[] => {
  const yearStr = year.toString();
  if (festivalData[yearStr] && festivalData[yearStr][month]) {
    const festivals = festivalData[yearStr][month];
    const festivalNames: string[] = [];
    
    Object.entries(festivals).forEach(([name, dateStr]) => {
      // Parse the date string to extract the day
      if (typeof dateStr === 'string') {
        const parts = dateStr.split(', ')[0].split(' ');
        const dayStr = parts[1]; // Get the day part
        
        if (parseInt(dayStr) === day) {
          festivalNames.push(name);
        }
      }
    });
    
    return festivalNames;
  }
  
  return [];
};

// Helper function to get all festivals for a specific month
export const getFestivalsForMonth = (year: number, month: string): Record<number, string[]> => {
  const yearStr = year.toString();
  const festivals: Record<number, string[]> = {};
  
  if (festivalData[yearStr] && festivalData[yearStr][month]) {
    const monthFestivals = festivalData[yearStr][month];
    
    Object.entries(monthFestivals).forEach(([name, dateStr]) => {
      // Parse the date string to extract the day
      if (typeof dateStr === 'string') {
        const parts = dateStr.split(', ')[0].split(' ');
        const day = parseInt(parts[1]); // Get the day part
        
        if (!festivals[day]) {
          festivals[day] = [];
        }
        
        festivals[day].push(name);
      }
    });
  }
  
  return festivals;
};