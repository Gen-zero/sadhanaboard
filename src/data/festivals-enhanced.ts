// Enhanced festival data with improved structure and performance
export interface Festival {
  name: string;
  date: string; // Format: "Month Day, Year, Weekday"
  month: string;
  day: number;
  year: number;
  type?: 'major' | 'minor' | 'regional' | 'astronomical'; // Festival importance level
  description?: string; // Brief description of the festival
}

// More efficient data structure indexed by ISO date strings (YYYY-MM-DD)
export interface FestivalsByDate {
  [date: string]: Festival[];
}

// Precomputed festival data for 2025 and 2026, indexed by date for O(1) lookup
export const festivalsByDate: FestivalsByDate = {
  "2025-01-03": [
    { name: "Pausha Purnima", date: "January 3, 2025, Friday", month: "January", day: 3, year: 2025, type: "major" }
  ],
  "2025-01-06": [
    { name: "Sakat Chauth", date: "January 6, 2025, Monday", month: "January", day: 6, year: 2025, type: "regional" }
  ],
  "2025-01-10": [
    { name: "Pausha Putrada Ekadashi", date: "January 10, 2025, Friday", month: "January", day: 10, year: 2025, type: "major" }
  ],
  "2025-01-13": [
    { name: "Pausha Purnima", date: "January 13, 2025, Monday", month: "January", day: 13, year: 2025, type: "major" }
  ],
  "2025-01-14": [
    { name: "Makara Sankranti", date: "January 14, 2025, Tuesday", month: "January", day: 14, year: 2025, type: "major", description: "Harvest festival celebrated across India" },
    { name: "Pongal", date: "January 14, 2025, Tuesday", month: "January", day: 14, year: 2025, type: "regional", description: "Tamil harvest festival" },
    { name: "Purna Kumbha @Prayagraj", date: "January 14, 2025, Tuesday", month: "January", day: 14, year: 2025, type: "major", description: "Kumbh Mela at Prayagraj" }
  ],
  "2025-01-17": [
    { name: "Sakat Chauth", date: "January 17, 2025, Friday", month: "January", day: 17, year: 2025, type: "regional" }
  ],
  "2025-01-25": [
    { name: "Shattila Ekadashi", date: "January 25, 2025, Saturday", month: "January", day: 25, year: 2025, type: "major" }
  ],
  "2025-01-29": [
    { name: "Mauni Amavas", date: "January 29, 2025, Wednesday", month: "January", day: 29, year: 2025, type: "major" },
    { name: "Jaya Ekadashi", date: "January 29, 2025, Wednesday", month: "January", day: 29, year: 2025, type: "major" }
  ],
  "2025-02-02": [
    { name: "Vasant Panchami", date: "February 2, 2025, Sunday", month: "February", day: 2, year: 2025, type: "major", description: "Festival of learning and Saraswati Puja" }
  ],
  "2025-02-04": [
    { name: "Ratha Saptami", date: "February 4, 2025, Tuesday", month: "February", day: 4, year: 2025, type: "regional" }
  ],
  "2025-02-05": [
    { name: "Bhishma Ashtami", date: "February 5, 2025, Wednesday", month: "February", day: 5, year: 2025, type: "regional" }
  ],
  "2025-02-08": [
    { name: "Jaya Ekadashi", date: "February 8, 2025, Saturday", month: "February", day: 8, year: 2025, type: "major" }
  ],
  "2025-02-12": [
    { name: "Kumbha Sankranti", date: "February 12, 2025, Wednesday", month: "February", day: 12, year: 2025, type: "major" },
    { name: "Purna Kumbha ends @Prayagraj", date: "February 12, 2025, Wednesday", month: "February", day: 12, year: 2025, type: "major" },
    { name: "Magha Purnima", date: "February 12, 2025, Wednesday", month: "February", day: 12, year: 2025, type: "major" }
  ],
  "2025-02-24": [
    { name: "Vijaya Ekadashi", date: "February 24, 2025, Monday", month: "February", day: 24, year: 2025, type: "major" }
  ],
  "2025-02-26": [
    { name: "Maha Shivaratri", date: "February 26, 2025, Wednesday", month: "February", day: 26, year: 2025, type: "major", description: "Night devoted to Lord Shiva" }
  ],
  "2025-03-10": [
    { name: "Amalaki Ekadashi", date: "March 10, 2025, Monday", month: "March", day: 10, year: 2025, type: "major" }
  ],
  "2025-03-13": [
    { name: "Chhoti Holi", date: "March 13, 2025, Thursday", month: "March", day: 13, year: 2025, type: "major" },
    { name: "Holika Dahan", date: "March 13, 2025, Thursday", month: "March", day: 13, year: 2025, type: "major", description: "Festival of colors eve" }
  ],
  "2025-03-14": [
    { name: "Holi", date: "March 14, 2025, Friday", month: "March", day: 14, year: 2025, type: "major", description: "Festival of colors" },
    { name: "Meena Sankranti", date: "March 14, 2025, Friday", month: "March", day: 14, year: 2025, type: "major" },
    { name: "Chandra Grahan (Purna)", date: "March 14, 2025, Friday", month: "March", day: 14, year: 2025, type: "astronomical" },
    { name: "Phalguna Purnima", date: "March 14, 2025, Friday", month: "March", day: 14, year: 2025, type: "major" }
  ],
  "2025-03-22": [
    { name: "Sheetala Ashtami", date: "March 22, 2025, Saturday", month: "March", day: 22, year: 2025, type: "regional" },
    { name: "Basoda", date: "March 22, 2025, Saturday", month: "March", day: 22, year: 2025, type: "regional" }
  ],
  "2025-03-25": [
    { name: "Papamochani Ekadashi", date: "March 25, 2025, Tuesday", month: "March", day: 25, year: 2025, type: "major" }
  ],
  "2025-03-29": [
    { name: "Surya Grahan (Anshika)", date: "March 29, 2025, Saturday", month: "March", day: 29, year: 2025, type: "astronomical" }
  ],
  "2025-03-30": [
    { name: "Ugadi", date: "March 30, 2025, Sunday", month: "March", day: 30, year: 2025, type: "regional", description: "Telugu New Year" },
    { name: "Gudi Padwa", date: "March 30, 2025, Sunday", month: "March", day: 30, year: 2025, type: "regional", description: "Marathi New Year" },
    { name: "Chaitra Navratri", date: "March 30, 2025, Sunday", month: "March", day: 30, year: 2025, type: "major", description: "Nine nights of Durga worship" }
  ],
  "2025-03-31": [
    { name: "Gauri Puja", date: "March 31, 2025, Monday", month: "March", day: 31, year: 2025, type: "regional" },
    { name: "Gangaur", date: "March 31, 2025, Monday", month: "March", day: 31, year: 2025, type: "regional" }
  ],
  "2025-04-03": [
    { name: "Yamuna Chhath", date: "April 3, 2025, Thursday", month: "April", day: 3, year: 2025, type: "regional" }
  ],
  "2025-04-06": [
    { name: "Rama Navami", date: "April 6, 2025, Sunday", month: "April", day: 6, year: 2025, type: "major", description: "Birthday of Lord Rama" },
    { name: "Swaminarayan Jayanti", date: "April 6, 2025, Sunday", month: "April", day: 6, year: 2025, type: "regional" }
  ],
  "2025-04-08": [
    { name: "Kamada Ekadashi", date: "April 8, 2025, Tuesday", month: "April", day: 8, year: 2025, type: "major" }
  ],
  "2025-04-12": [
    { name: "Hanuman Jayanti", date: "April 12, 2025, Saturday", month: "April", day: 12, year: 2025, type: "major", description: "Birthday of Lord Hanuman" },
    { name: "Hanuman Janmotsava", date: "April 12, 2025, Saturday", month: "April", day: 12, year: 2025, type: "regional" },
    { name: "Chaitra Purnima", date: "April 12, 2025, Saturday", month: "April", day: 12, year: 2025, type: "major" }
  ],
  "2025-04-14": [
    { name: "Mesha Sankranti", date: "April 14, 2025, Monday", month: "April", day: 14, year: 2025, type: "major" },
    { name: "Solar New Year", date: "April 14, 2025, Monday", month: "April", day: 14, year: 2025, type: "regional" }
  ],
  "2025-04-24": [
    { name: "Varuthini Ekadashi", date: "April 24, 2025, Thursday", month: "April", day: 24, year: 2025, type: "major" }
  ],
  "2025-04-29": [
    { name: "Parashurama Jayanti", date: "April 29, 2025, Tuesday", month: "April", day: 29, year: 2025, type: "regional" }
  ],
  "2025-04-30": [
    { name: "Akshaya Tritiya", date: "April 30, 2025, Wednesday", month: "April", day: 30, year: 2025, type: "major", description: "Auspicious day for new beginnings" }
  ],
  "2025-05-03": [
    { name: "Ganga Saptami", date: "May 3, 2025, Saturday", month: "May", day: 3, year: 2025, type: "regional" }
  ],
  "2025-05-05": [
    { name: "Sita Navami", date: "May 5, 2025, Monday", month: "May", day: 5, year: 2025, type: "regional" }
  ],
  "2025-05-08": [
    { name: "Mohini Ekadashi", date: "May 8, 2025, Thursday", month: "May", day: 8, year: 2025, type: "major" }
  ],
  "2025-05-11": [
    { name: "Narasimha Jayanti", date: "May 11, 2025, Sunday", month: "May", day: 11, year: 2025, type: "regional" }
  ],
  "2025-05-12": [
    { name: "Buddha Purnima", date: "May 12, 2025, Monday", month: "May", day: 12, year: 2025, type: "major", description: "Birthday of Buddha" },
    { name: "Vaishakha Purnima", date: "May 12, 2025, Monday", month: "May", day: 12, year: 2025, type: "major" }
  ],
  "2025-05-13": [
    { name: "Narada Jayanti", date: "May 13, 2025, Tuesday", month: "May", day: 13, year: 2025, type: "regional" }
  ],
  "2025-05-15": [
    { name: "Vrishabha Sankranti", date: "May 15, 2025, Thursday", month: "May", day: 15, year: 2025, type: "major" }
  ],
  "2025-05-23": [
    { name: "Apara Ekadashi", date: "May 23, 2025, Friday", month: "May", day: 23, year: 2025, type: "major" }
  ],
  "2025-05-26": [
    { name: "Vat Savitri Vrat", date: "May 26, 2025, Monday", month: "May", day: 26, year: 2025, type: "regional" }
  ],
  "2025-05-27": [
    { name: "Shani Jayanti", date: "May 27, 2025, Tuesday", month: "May", day: 27, year: 2025, type: "regional" }
  ],
  "2025-06-05": [
    { name: "Ganga Dussehra", date: "June 5, 2025, Thursday", month: "June", day: 5, year: 2025, type: "regional", description: "Celebrates the descent of River Ganga" }
  ],
  "2025-06-06": [
    { name: "Nirjala Ekadashi", date: "June 6, 2025, Friday", month: "June", day: 6, year: 2025, type: "major" }
  ],
  "2025-06-10": [
    { name: "Vat Purnima Vrat", date: "June 10, 2025, Tuesday", month: "June", day: 10, year: 2025, type: "regional" }
  ],
  "2025-06-11": [
    { name: "Jyeshtha Purnima", date: "June 11, 2025, Wednesday", month: "June", day: 11, year: 2025, type: "major" }
  ],
  "2025-06-15": [
    { name: "Mithuna Sankranti", date: "June 15, 2025, Sunday", month: "June", day: 15, year: 2025, type: "major" }
  ],
  "2025-06-21": [
    { name: "Yogini Ekadashi", date: "June 21, 2025, Saturday", month: "June", day: 21, year: 2025, type: "major" }
  ],
  "2025-06-22": [
    { name: "Gauna Yogini Ekadashi", date: "June 22, 2025, Sunday", month: "June", day: 22, year: 2025, type: "major" }
  ],
  "2025-06-27": [
    { name: "Jagannath Rathyatra", date: "June 27, 2025, Friday", month: "June", day: 27, year: 2025, type: "major", description: "Chariot festival of Lord Jagannath" }
  ],
  "2025-07-06": [
    { name: "Devshayani Ekadashi", date: "July 6, 2025, Sunday", month: "July", day: 6, year: 2025, type: "major" }
  ],
  "2025-07-10": [
    { name: "Guru Purnima", date: "July 10, 2025, Thursday", month: "July", day: 10, year: 2025, type: "major", description: "Honoring spiritual gurus" },
    { name: "Ashadha Purnima", date: "July 10, 2025, Thursday", month: "July", day: 10, year: 2025, type: "major" }
  ],
  "2025-07-16": [
    { name: "Karka Sankranti", date: "July 16, 2025, Wednesday", month: "July", day: 16, year: 2025, type: "major" }
  ],
  "2025-07-21": [
    { name: "Kamika Ekadashi", date: "July 21, 2025, Monday", month: "July", day: 21, year: 2025, type: "major" }
  ],
  "2025-07-27": [
    { name: "Hariyali Teej", date: "July 27, 2025, Sunday", month: "July", day: 27, year: 2025, type: "regional" }
  ],
  "2025-07-29": [
    { name: "Nag Panchami", date: "July 29, 2025, Tuesday", month: "July", day: 29, year: 2025, type: "regional", description: "Worship of snakes" }
  ],
  "2025-08-05": [
    { name: "Shravana Putrada Ekadashi", date: "August 5, 2025, Tuesday", month: "August", day: 5, year: 2025, type: "major" }
  ],
  "2025-08-08": [
    { name: "Varalakshmi Vrat", date: "August 8, 2025, Friday", month: "August", day: 8, year: 2025, type: "regional" }
  ],
  "2025-08-09": [
    { name: "Raksha Bandhan", date: "August 9, 2025, Saturday", month: "August", day: 9, year: 2025, type: "major", description: "Bond of protection between siblings" },
    { name: "Rakhi", date: "August 9, 2025, Saturday", month: "August", day: 9, year: 2025, type: "regional" },
    { name: "Gayatri Jayanti", date: "August 9, 2025, Saturday", month: "August", day: 9, year: 2025, type: "regional" },
    { name: "Shravana Purnima", date: "August 9, 2025, Saturday", month: "August", day: 9, year: 2025, type: "major" }
  ],
  "2025-08-12": [
    { name: "Kajari Teej", date: "August 12, 2025, Tuesday", month: "August", day: 12, year: 2025, type: "regional" }
  ],
  "2025-08-15": [
    { name: "Janmashtami (Smarta)", date: "August 15, 2025, Friday", month: "August", day: 15, year: 2025, type: "major", description: "Birthday of Lord Krishna" }
  ],
  "2025-08-16": [
    { name: "Janmashtami (ISKCON)", date: "August 16, 2025, Saturday", month: "August", day: 16, year: 2025, type: "major", description: "Birthday of Lord Krishna" }
  ],
  "2025-08-17": [
    { name: "Simha Sankranti", date: "August 17, 2025, Sunday", month: "August", day: 17, year: 2025, type: "major" }
  ],
  "2025-08-19": [
    { name: "Aja Ekadashi", date: "August 19, 2025, Tuesday", month: "August", day: 19, year: 2025, type: "major" }
  ],
  "2025-08-26": [
    { name: "Hartalika Teej", date: "August 26, 2025, Tuesday", month: "August", day: 26, year: 2025, type: "regional" }
  ],
  "2025-08-27": [
    { name: "Ganesh Chaturthi", date: "August 27, 2025, Wednesday", month: "August", day: 27, year: 2025, type: "major", description: "Birthday of Lord Ganesha" }
  ],
  "2025-08-28": [
    { name: "Rishi Panchami", date: "August 28, 2025, Thursday", month: "August", day: 28, year: 2025, type: "regional" },
    { name: "Balarama Jayanti", date: "August 29, 2025, Friday", month: "August", day: 29, year: 2025, type: "regional" }
  ],
  "2025-08-29": [
    { name: "Balarama Jayanti", date: "August 29, 2025, Friday", month: "August", day: 29, year: 2025, type: "regional" }
  ],
  "2025-08-31": [
    { name: "Radha Ashtami", date: "August 31, 2025, Sunday", month: "August", day: 31, year: 2025, type: "regional" }
  ],
  "2025-09-03": [
    { name: "Parsva Ekadashi", date: "September 3, 2025, Wednesday", month: "September", day: 3, year: 2025, type: "major" }
  ],
  "2025-09-04": [
    { name: "Agastya Arghya", date: "September 4, 2025, Thursday", month: "September", day: 4, year: 2025, type: "regional" }
  ],
  "2025-09-05": [
    { name: "Onam", date: "September 5, 2025, Friday", month: "September", day: 5, year: 2025, type: "regional", description: "Kerala harvest festival" }
  ],
  "2025-09-06": [
    { name: "Ganesh Visarjan", date: "September 6, 2025, Saturday", month: "September", day: 6, year: 2025, type: "major", description: "Immersion of Ganesha idols" },
    { name: "Anant Chaturdashi", date: "September 6, 2025, Saturday", month: "September", day: 6, year: 2025, type: "major" }
  ],
  "2025-09-07": [
    { name: "Chandra Grahan (Purna)", date: "September 7, 2025, Sunday", month: "September", day: 7, year: 2025, type: "astronomical" },
    { name: "Bhadrapada Purnima", date: "September 7, 2025, Sunday", month: "September", day: 7, year: 2025, type: "major" }
  ],
  "2025-09-08": [
    { name: "Pitrupaksha Begins", date: "September 8, 2025, Monday", month: "September", day: 8, year: 2025, type: "major", description: "Fortnight for honoring ancestors" }
  ],
  "2025-09-17": [
    { name: "Vishwakarma Puja", date: "September 17, 2025, Wednesday", month: "September", day: 17, year: 2025, type: "regional" },
    { name: "Kanya Sankranti", date: "September 17, 2025, Wednesday", month: "September", day: 17, year: 2025, type: "major" },
    { name: "Indira Ekadashi", date: "September 17, 2025, Wednesday", month: "September", day: 17, year: 2025, type: "major" }
  ],
  "2025-09-21": [
    { name: "Sarva Pitru Amavasya", date: "September 21, 2025, Sunday", month: "September", day: 21, year: 2025, type: "major" }
  ],
  "2025-09-22": [
    { name: "Navratri Begins", date: "September 22, 2025, Monday", month: "September", day: 22, year: 2025, type: "major", description: "Nine nights of Durga worship begins" },
    { name: "Surya Grahan (Anshika)", date: "September 22, 2025, Monday", month: "September", day: 22, year: 2025, type: "astronomical" }
  ],
  "2025-09-29": [
    { name: "Saraswati Avahan", date: "September 29, 2025, Monday", month: "September", day: 29, year: 2025, type: "regional" }
  ],
  "2025-09-30": [
    { name: "Saraswati Puja", date: "September 30, 2025, Tuesday", month: "September", day: 30, year: 2025, type: "regional" },
    { name: "Durga Ashtami", date: "September 30, 2025, Tuesday", month: "September", day: 30, year: 2025, type: "major" }
  ],
  "2025-10-01": [
    { name: "Maha Navami", date: "October 1, 2025, Wednesday", month: "October", day: 1, year: 2025, type: "major" }
  ],
  "2025-10-02": [
    { name: "Vijayadashami", date: "October 2, 2025, Thursday", month: "October", day: 2, year: 2025, type: "major", description: "Victory of good over evil" },
    { name: "Dussehra", date: "October 2, 2025, Thursday", month: "October", day: 2, year: 2025, type: "major", description: "Victory of good over evil" }
  ],
  "2025-10-03": [
    { name: "Papankusha Ekadashi", date: "October 3, 2025, Friday", month: "October", day: 3, year: 2025, type: "major" }
  ],
  "2025-10-06": [
    { name: "Kojagara Puja", date: "October 6, 2025, Monday", month: "October", day: 6, year: 2025, type: "regional" },
    { name: "Sharad Purnima", date: "October 6, 2025, Monday", month: "October", day: 6, year: 2025, type: "major" }
  ],
  "2025-10-07": [
    { name: "Ashwina Purnima", date: "October 7, 2025, Tuesday", month: "October", day: 7, year: 2025, type: "major" }
  ],
  "2025-10-10": [
    { name: "Karwa Chauth", date: "October 10, 2025, Friday", month: "October", day: 10, year: 2025, type: "regional", description: "Wives fast for husbands' longevity" }
  ],
  "2025-10-13": [
    { name: "Ahoi Ashtami", date: "October 13, 2025, Monday", month: "October", day: 13, year: 2025, type: "regional" }
  ],
  "2025-10-17": [
    { name: "Govatsa Dwadashi", date: "October 17, 2025, Friday", month: "October", day: 17, year: 2025, type: "regional" },
    { name: "Tula Sankranti", date: "October 17, 2025, Friday", month: "October", day: 17, year: 2025, type: "major" },
    { name: "Rama Ekadashi", date: "October 17, 2025, Friday", month: "October", day: 17, year: 2025, type: "major" }
  ],
  "2025-10-18": [
    { name: "Dhanteras", date: "October 18, 2025, Saturday", month: "October", day: 18, year: 2025, type: "major", description: "Beginning of Diwali celebrations" }
  ],
  "2025-10-19": [
    { name: "Kali Chaudas", date: "October 19, 2025, Sunday", month: "October", day: 19, year: 2025, type: "regional" },
    { name: "Maha Navami", date: "October 19, 2025, Sunday", month: "October", day: 19, year: 2025, type: "major" }
  ],
  "2025-10-20": [
    { name: "Lakshmi Puja", date: "October 20, 2025, Monday", month: "October", day: 20, year: 2025, type: "major", description: "Worship of Goddess Lakshmi" },
    { name: "Narak Chaturdashi", date: "October 20, 2025, Monday", month: "October", day: 20, year: 2025, type: "major" },
    { name: "Diwali", date: "October 20, 2025, Monday", month: "October", day: 20, year: 2025, type: "major", description: "Festival of lights" }
  ],
  "2025-10-22": [
    { name: "Govardhan Puja", date: "October 22, 2025, Wednesday", month: "October", day: 22, year: 2025, type: "regional" }
  ],
  "2025-10-23": [
    { name: "Bhaiya Dooj", date: "October 23, 2025, Thursday", month: "October", day: 23, year: 2025, type: "regional", description: "Bond between brothers and sisters" }
  ],
  "2025-10-27": [
    { name: "Chhath Puja", date: "October 27, 2025, Monday", month: "October", day: 27, year: 2025, type: "regional", description: "Worship of Sun God" }
  ],
  "2025-11-01": [
    { name: "Kansa Vadh", date: "November 1, 2025, Saturday", month: "November", day: 1, year: 2025, type: "regional" },
    { name: "Devutthana Ekadashi", date: "November 1, 2025, Saturday", month: "November", day: 1, year: 2025, type: "major" }
  ],
  "2025-11-02": [
    { name: "Tulasi Vivah", date: "November 2, 2025, Sunday", month: "November", day: 2, year: 2025, type: "regional" },
    { name: "Gauna Devutthana Ekadashi", date: "November 2, 2025, Sunday", month: "November", day: 2, year: 2025, type: "major" }
  ],
  "2025-11-05": [
    { name: "Kartika Purnima", date: "November 5, 2025, Wednesday", month: "November", day: 5, year: 2025, type: "major" }
  ],
  "2025-11-12": [
    { name: "Kalabhairav Jayanti", date: "November 12, 2025, Wednesday", month: "November", day: 12, year: 2025, type: "regional" }
  ],
  "2025-11-15": [
    { name: "Utpanna Ekadashi", date: "November 15, 2025, Saturday", month: "November", day: 15, year: 2025, type: "major" }
  ],
  "2025-11-16": [
    { name: "Vrishchika Sankranti", date: "November 16, 2025, Sunday", month: "November", day: 16, year: 2025, type: "major" }
  ],
  "2025-11-25": [
    { name: "Vivah Panchami", date: "November 25, 2025, Tuesday", month: "November", day: 25, year: 2025, type: "regional" }
  ],
  "2025-12-01": [
    { name: "Gita Jayanti", date: "December 1, 2025, Monday", month: "December", day: 1, year: 2025, type: "regional", description: "Birthday of Bhagavad Gita" },
    { name: "Mokshada Ekadashi", date: "December 1, 2025, Monday", month: "December", day: 1, year: 2025, type: "major" }
  ],
  "2025-12-04": [
    { name: "Dattatreya Jayanti", date: "December 4, 2025, Thursday", month: "December", day: 4, year: 2025, type: "regional" },
    { name: "Margashirsha Purnima", date: "December 4, 2025, Thursday", month: "December", day: 4, year: 2025, type: "major" }
  ],
  "2025-12-15": [
    { name: "Saphala Ekadashi", date: "December 15, 2025, Monday", month: "December", day: 15, year: 2025, type: "major" }
  ],
  "2025-12-16": [
    { name: "Dhanu Sankranti", date: "December 16, 2025, Tuesday", month: "December", day: 16, year: 2025, type: "major" }
  ],
  "2025-12-30": [
    { name: "Pausha Putrada Ekadashi", date: "December 30, 2025, Tuesday", month: "December", day: 30, year: 2025, type: "major" }
  ],
  "2025-12-31": [
    { name: "Gauna Pausha Putrada Ekadashi", date: "December 31, 2025, Wednesday", month: "December", day: 31, year: 2025, type: "major" }
  ]
};

// Helper function to get festivals for a specific date (O(1) lookup)
export const getFestivalsForDate = (dateString: string): Festival[] => {
  return festivalsByDate[dateString] || [];
};

// Helper function to get festivals for a specific year and month
export const getFestivalsForMonth = (year: number, month: string): Record<number, Festival[]> => {
  const festivals: Record<number, Festival[]> = {};
  
  // Iterate through all festival dates to find those matching the month
  Object.entries(festivalsByDate).forEach(([dateStr, festivalList]) => {
    const date = new Date(dateStr);
    if (date.getFullYear() === year && date.toLocaleString('en-US', { month: 'long' }) === month) {
      const day = date.getDate();
      if (!festivals[day]) {
        festivals[day] = [];
      }
      festivals[day].push(...festivalList);
    }
  });
  
  return festivals;
};

// Helper function to check if a date has major festivals
export const hasMajorFestivals = (dateString: string): boolean => {
  const festivals = getFestivalsForDate(dateString);
  return festivals.some(festival => festival.type === 'major');
};

// Helper function to get all festivals in a date range
export const getFestivalsInRange = (startDate: string, endDate: string): Record<string, Festival[]> => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result: Record<string, Festival[]> = {};
  
  Object.entries(festivalsByDate).forEach(([dateStr, festivalList]) => {
    const date = new Date(dateStr);
    if (date >= start && date <= end) {
      result[dateStr] = festivalList;
    }
  });
  
  return result;
};