
export interface CalculatedPanchang {
  tithi: number; // 1 to 30
  nakshatra: number; // 1 to 27
  paksha: 'Shukla' | 'Krishna';
  sunrise: string;
  sunset: string;
  isPournami: boolean;
  isAmavasya: boolean;
  isEkadashi: boolean;
  isAshtami: boolean;
}

export class PanchangEngine {
  // Epoch: Jan 1.5 2000 (J2000)
  private static J2000 = 2451545.0;

  private static getJulianDay(date: Date): number {
    // UTC based calculation to prevent local timezone shifts
    return (date.getTime() / 86400000.0) + 2440587.5;
  }

  private static getMeanSolarLongitude(jd: number): number {
    const t = (jd - this.J2000) / 36525.0;
    let l = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
    return (l % 360 + 360) % 360;
  }

  private static getMeanLunarLongitude(jd: number): number {
    const t = (jd - this.J2000) / 36525.0;
    let l = 218.3164477 + 481267.8812307 * t - 0.0015786 * t * t + (t * t * t / 538841.0);
    return (l % 360 + 360) % 360;
  }

  public static calculate(date: Date, lat: number, lon: number): CalculatedPanchang {
    const jd = this.getJulianDay(date);
    
    // Mean Longitudes
    const sol = this.getMeanSolarLongitude(jd);
    const lun = this.getMeanLunarLongitude(jd);
    
    // Tithi calculation (Moon - Sun)
    let diff = (lun - sol + 360) % 360;
    const tithiIndex = Math.floor(diff / 12) + 1;
    
    // Ayanamsha (Chitra Paksha approx)
    const year = date.getUTCFullYear();
    const ayanamsha = 24.2 + (year - 2000) * 0.013; 
    
    // Nakshatra (Sidereal)
    const siderealMoon = (lun - ayanamsha + 360) % 360;
    const nakshatraIndex = Math.floor(siderealMoon / (360 / 27)) + 1;

    const paksha = tithiIndex <= 15 ? 'Shukla' : 'Krishna';
    const relativeTithi = tithiIndex > 15 ? tithiIndex - 15 : tithiIndex;

    // Simple Solar Geometry for timings
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const declination = 23.45 * Math.sin((360 / 365 * (dayOfYear + 284)) * Math.PI / 180);
    const radLat = lat * Math.PI / 180;
    const radDec = declination * Math.PI / 180;
    
    let cosH = -Math.tan(radLat) * Math.tan(radDec);
    cosH = Math.max(-1, Math.min(1, cosH)); // Clamp for polar regions
    const hourAngle = Math.acos(cosH) * 180 / Math.PI;
    
    // Timezone & Equation of Time (simplified)
    const tzOffset = -date.getTimezoneOffset() / 60;
    const sunriseHours = 12 - (hourAngle / 15) - (lon / 15) + tzOffset;
    const sunsetHours = 12 + (hourAngle / 15) - (lon / 15) + tzOffset;

    const formatTime = (h: number) => {
      const hours = Math.floor((h + 24) % 24);
      const minutes = Math.floor(((h * 60) + 60) % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    return {
      tithi: tithiIndex,
      nakshatra: Math.min(27, Math.max(1, nakshatraIndex)),
      paksha,
      sunrise: formatTime(sunriseHours),
      sunset: formatTime(sunsetHours),
      isPournami: tithiIndex === 15,
      isAmavasya: tithiIndex === 30,
      isEkadashi: relativeTithi === 11,
      isAshtami: relativeTithi === 8
    };
  }
}
