/**
 * Date utilities for Turkey timezone handling
 */

/**
 * Formats date to Turkish timezone display
 * @param date - Date string or Date object (assuming it's already in Turkey timezone from backend)
 * @returns Formatted date string in Turkish format
 */
export const toTurkishTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Formats date to Turkish date only
 * @param date - Date string or Date object
 * @returns Formatted date string (DD.MM.YYYY)
 */
export const toTurkishDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Formats date to Turkish time only
 * @param date - Date string or Date object
 * @returns Formatted time string (HH:MM)
 */
export const toTurkishTimeOnly = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Gets current Turkish time
 * @returns Current date in Turkish timezone
 */
export const getCurrentTurkishTime = (): string => {
  return toTurkishTime(new Date());
};