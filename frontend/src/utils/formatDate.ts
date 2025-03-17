// utils/formatDate.ts
export function formatDate(dateStr: string): string {
    // Convert to a JS Date to parse the negative year
    const dt = new Date(dateStr);
  
    // JavaScript's proleptic Gregorian system:
    // year 0 = 1 BCE, year -1 = 2 BCE, etc.
    // So 241 BCE → internal year = -240 → getUTCFullYear() = 240
    const year = dt.getUTCFullYear(); // e.g. 240 for 241 BCE
  
    if (year <= 0) {
      // For a negative year, adjust by -1 and label BCE
      // e.g. 240 => "241 BCE"
      return `${Math.abs(year - 1)} BCE`;
    }
  
    // Otherwise, just return the positive year
    return String(year);
  }
  