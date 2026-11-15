/**
 * Text and numerical formatters
 */

/**
 * Format numbers with comma separation (e.g. 1025 -> 1,025)
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Clean and humanize an uppercase slug or enum key
 * e.g. "DEEP_SPACE_PROBE" -> "Deep Space Probe"
 * @param {string} str - Raw identifier
 * @returns {string} Human-readable title
 */
export function humanizeEnum(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
