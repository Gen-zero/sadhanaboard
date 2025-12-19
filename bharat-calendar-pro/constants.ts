
import { Region } from './types';

export const REGIONS_LIST = Object.values(Region);

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const TITHI_NAMES = [
  "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", 
  "Shashti", "Saptami", "Ashtami", "Navami", "Dashami", 
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Pournami",
  "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", 
  "Shashti", "Saptami", "Ashtami", "Navami", "Dashami", 
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

export const NAKSHATRA_NAMES: Record<Region, string[]> = {
  [Region.MALAYALAM]: ["Ashwati", "Bharani", "Karthika", "Rohini", "Makayiram", "Thiruvathira", "Punartham", "Pooyam", "Ayilyam", "Makam", "Pooram", "Uthram", "Atham", "Chithira", "Chothi", "Visakham", "Anizham", "Thrikketa", "Moolam", "Pooradam", "Uthradam", "Thiruvonam", "Avittam", "Chathayam", "Pooruruttathi", "Uthruttathi", "Revathi"],
  [Region.TAMIL]: ["Aswini", "Bharani", "Krithigai", "Rohini", "Mrigashirsham", "Thiruvathirai", "Punarpusam", "Poosam", "Ayilyam", "Magam", "Pooram", "Uthiram", "Hastham", "Chithirai", "Swathi", "Visakam", "Anusham", "Kettai", "Moolam", "Pooradam", "Uthradam", "Thiruvonam", "Avittam", "Sathayam", "Purattathi", "Uthirattathi", "Revathi"],
  [Region.NORTH_INDIAN]: ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
  [Region.KANNADA]: ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Pubba", "Uttara", "Hasta", "Chitta", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purvashadha", "Uttarashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purvabhadra", "Uttarabhadra", "Revati"],
  [Region.TELUGU]: ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purvashadha", "Uttarashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purvabhadra", "Uttarabhadra", "Revati"],
  [Region.BENGALI]: ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"],
  [Region.MARATHI]: ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"]
};
