/**
 * Format minutes into a human-readable string (e.g., "42 min" or "1h 15m")
 * @param minutes - Number of minutes to format
 * @returns Formatted time string
 */
export function formatMinutes(minutes: number | null | undefined): string {
  // Handle null/undefined/invalid cases
  if (!minutes || minutes <= 0 || !isFinite(minutes)) return '';
  
  const totalMinutes = Math.round(minutes);
  
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}