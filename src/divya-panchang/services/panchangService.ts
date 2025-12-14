import { MonthData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004';
const CACHE_PREFIX = 'kali_panchang_data_v1_';

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

  // 2. Fetch from backend API if not cached
  try {
    const response = await fetch(`${API_BASE_URL}/api/panchang/${year}/${monthIndex + 1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as MonthData;
    
    // 3. Save to Local Storage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {
      console.error("LocalStorage full or disabled", e);
    }

    return data;

  } catch (error) {
    console.error("Failed to fetch Panchang data", error);
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

      onProgress(`Downloading ${monthName} ${y}...`, percent);
      
      try {
        await generatePanchangData(y, m);
        // Artificial delay to respect rate limits
        await new Promise(r => setTimeout(r, 800)); 
      } catch (err) {
        console.error(`Error prefetching ${monthName} ${y}`, err);
        // Continue to next month even if one fails
      }
    }
  }
};