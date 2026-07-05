/**
 * Formats a Date object or ISO string to a standardized date-only format (YYYY-MM-DD)
 */
export function formatDateString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    throw new Error('Invalid Date input');
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if a given date is expired relative to a compare date (default to now)
 */
export function isExpired(expiryDate: Date | string, compareDate: Date | string = new Date()): boolean {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const compare = typeof compareDate === 'string' ? new Date(compareDate) : compareDate;
  return expiry.getTime() < compare.getTime();
}
