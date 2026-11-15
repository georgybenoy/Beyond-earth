/**
 * Date utilities for Beyond Earth
 */

/**
 * Format a Date object into a local YYYY-MM-DD string without UTC shift anomalies
 * @param {Date} [d=new Date()] - Date object
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a calendar date string (YYYY-MM-DD) into a human-readable display string
 * @param {string} dateStr - ISO date string
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @returns {string} Formatted human-readable date
 */
export function formatCalendarDate(dateStr, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!dateStr) return 'Date unknown';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day || 1);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Extract decade string from an ISO date string
 * @param {string} dateStr - Date string starting with YYYY
 * @returns {string} Decade identifier (e.g. '1960s', '1970s', '2020s')
 */
export function getDecadeFromDate(dateStr) {
  if (!dateStr) return '';
  const year = parseInt(dateStr.split('-')[0], 10);
  if (isNaN(year)) return '';
  const decadeFloor = Math.floor(year / 10) * 10;
  return `${decadeFloor}s`;
}
