
import { GoogleGenAI, Type } from "@google/genai";
import { CalendarMonthData, Region, UserLocation } from "../types";
import { PanchangEngine } from "../utils/panchangEngine";
import { TITHI_NAMES, NAKSHATRA_NAMES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCalendarData = async (
  month: number,
  year: number,
  region: Region,
  location?: UserLocation
): Promise<CalendarMonthData> => {
  const model = "gemini-3-pro-preview";
  const lat = location?.latitude ?? 20.59;
  const lon = location?.longitude ?? 78.96;

  // STEP 1: Generate the Mathematically Locked Skeleton
  const daysInMonth = new Date(year, month, 0).getDate();
  const skeletonDays = [];

  for (let d = 1; d <= daysInMonth; d++) {
    // Calculate for 6 AM local time to represent the "Sunrise Day"
    const dateObj = new Date(year, month - 1, d, 6, 0);
    const calc = PanchangEngine.calculate(dateObj, lat, lon);
    
    // Get Names from hardcoded constants for zero hallucination
    const tithiName = TITHI_NAMES[calc.tithi - 1];
    const nakshatraName = NAKSHATRA_NAMES[region][calc.nakshatra - 1];

    skeletonDays.push({
      date: `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`,
      dayNumber: d,
      tithi: tithiName,
      paksha: calc.paksha,
      nakshatra: nakshatraName,
      sunrise: calc.sunrise,
      sunset: calc.sunset,
      isEkadashi: calc.isEkadashi,
      isPournami: calc.isPournami,
      isAmavasya: calc.isAmavasya,
      isAshtami: calc.isAshtami
    });
  }

  // STEP 2: Enrich with Festivals and regional month names only
  const systemInstruction = `You are a regional calendar expert for ${region}, India.
  I am providing a fixed Panchang skeleton with correct Tithis and Nakshatras.
  Your task is to populate:
  1. 'festivals': A list of regional rituals and events for each day.
  2. 'regionalMonthName': The active regional month (e.g. for Malayalam it might change on Sankranthi).
  3. 'rahuKaalam' and 'gulikaKaalam': Standard 1.5-hour slots based on the weekday.
  4. 'publicHoliday': Any official Indian government holidays.
  5. 'auspiciousTime': A 45-60 min window like Abhijit Muhurta.
  
  DO NOT CHANGE the date, tithi, or nakshatra provided. They are astronomically verified.`;

  const prompt = `Add regional festivals and details for ${region}, ${month}/${year}:
  ${JSON.stringify(skeletonDays)}`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.INTEGER },
          year: { type: Type.INTEGER },
          region: { type: Type.STRING },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                dayNumber: { type: Type.INTEGER },
                tithi: { type: Type.STRING },
                paksha: { type: Type.STRING },
                nakshatra: { type: Type.STRING },
                sunrise: { type: Type.STRING },
                sunset: { type: Type.STRING },
                festivals: { type: Type.ARRAY, items: { type: Type.STRING } },
                isEkadashi: { type: Type.BOOLEAN },
                isPournami: { type: Type.BOOLEAN },
                isAmavasya: { type: Type.BOOLEAN },
                publicHoliday: { type: Type.STRING },
                regionalMonthName: { type: Type.STRING },
                rahuKaalam: { type: Type.STRING },
                gulikaKaalam: { type: Type.STRING },
                auspiciousTime: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const enriched = JSON.parse(response.text);
  
  // Final safeguard: Merge enrichment back into skeleton to ensure skeleton is NEVER altered
  return {
    ...enriched,
    days: skeletonDays.map((skel, i) => ({
      ...skel,
      ...enriched.days[i],
      // Force skeleton values to remain dominant
      date: skel.date,
      tithi: skel.tithi,
      nakshatra: skel.nakshatra,
      sunrise: skel.sunrise,
      sunset: skel.sunset,
      isEkadashi: skel.isEkadashi,
      isPournami: skel.isPournami,
      isAmavasya: skel.isAmavasya
    }))
  };
};
