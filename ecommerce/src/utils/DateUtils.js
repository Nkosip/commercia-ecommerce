/**
 * Date utility functions for formatting dates from backend
 * Handles multiple date formats: ISO strings, arrays, timestamps, etc.
 */

/**
 * Parse various date formats from backend into a Date object
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export const parseDate = (dateInput) => {
  if (!dateInput) return null;

  // Already a Date object
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }

  // Handle array format: [year, month, day, hour, minute, second, nanosecond]
  // Common in Java LocalDateTime serialization
  if (Array.isArray(dateInput)) {
    if (dateInput.length < 3) return null;
    
    // JavaScript months are 0-indexed, Java months are 1-indexed
    const [year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0] = dateInput;
    const date = new Date(year, month - 1, day, hour, minute, second, millisecond / 1000000);
    
    return isNaN(date.getTime()) ? null : date;
  }

  // Handle ISO string or timestamp
  if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
};

/**
 * Get timestamp from various date formats
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {number} - Unix timestamp in milliseconds
 */
export const getTimestamp = (dateInput) => {
  const date = parseDate(dateInput);
  return date ? date.getTime() : 0;
};

/**
 * Format date as: "January 15, 2024"
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {string} - Formatted date string
 */
export const formatLongDate = (dateInput) => {
  const date = parseDate(dateInput);
  
  if (!date) {
    console.warn('Invalid date input:', dateInput);
    return 'N/A';
  }

  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format date as: "Jan 15, 2024"
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {string} - Formatted date string
 */
export const formatShortDate = (dateInput) => {
  const date = parseDate(dateInput);
  
  if (!date) {
    console.warn('Invalid date input:', dateInput);
    return 'N/A';
  }

  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format date as: "2024-01-15"
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {string} - Formatted date string
 */
export const formatISODate = (dateInput) => {
  const date = parseDate(dateInput);
  
  if (!date) {
    console.warn('Invalid date input:', dateInput);
    return 'N/A';
  }

  return date.toISOString().split('T')[0];
};

/**
 * Format date and time as: "January 15, 2024 at 3:30 PM"
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {string} - Formatted date and time string
 */
export const formatLongDateTime = (dateInput) => {
  const date = parseDate(dateInput);
  
  if (!date) {
    console.warn('Invalid date input:', dateInput);
    return 'N/A';
  }

  const dateOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  const dateStr = date.toLocaleDateString('en-US', dateOptions);
  const timeStr = date.toLocaleTimeString('en-US', timeOptions);
  
  return `${dateStr} at ${timeStr}`;
};

/**
 * Format date and time as: "Jan 15, 2024 3:30 PM"
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {string} - Formatted date and time string
 */
export const formatShortDateTime = (dateInput) => {
  const date = parseDate(dateInput);
  
  if (!date) {
    console.warn('Invalid date input:', dateInput);
    return 'N/A';
  }

  const dateOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  const dateStr = date.toLocaleDateString('en-US', dateOptions);
  const timeStr = date.toLocaleTimeString('en-US', timeOptions);
  
  return `${dateStr} ${timeStr}`;
};

/**
 * Format relative time: "2 hours ago", "3 days ago", etc.
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (dateInput) => {
  const date = parseDate(dateInput);
  
  if (!date) {
    console.warn('Invalid date input:', dateInput);
    return 'N/A';
  }

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek !== 1 ? 's' : ''} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago`;
  return `${diffYear} year${diffYear !== 1 ? 's' : ''} ago`;
};

/**
 * Check if a date is today
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {boolean} - True if date is today
 */
export const isToday = (dateInput) => {
  const date = parseDate(dateInput);
  if (!date) return false;

  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is within the last N days
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @param {number} days - Number of days to check
 * @returns {boolean} - True if date is within last N days
 */
export const isWithinDays = (dateInput, days) => {
  const date = parseDate(dateInput);
  if (!date) return false;

  const now = new Date();
  const diffMs = now - date;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  return diffDays >= 0 && diffDays <= days;
};

/**
 * Format date for display with automatic format selection
 * Uses relative time for recent dates, otherwise uses short format
 * @param {string|array|number|Date} dateInput - Date in various formats
 * @returns {string} - Formatted date string
 */
export const formatSmartDate = (dateInput) => {
  const date = parseDate(dateInput);
  
  if (!date) {
    console.warn('Invalid date input:', dateInput);
    return 'N/A';
  }

  // If within last 7 days, use relative time
  if (isWithinDays(dateInput, 7)) {
    return formatRelativeTime(dateInput);
  }
  
  // Otherwise use short date format
  return formatShortDate(dateInput);
};

// Export all functions
export default {
  parseDate,
  getTimestamp,
  formatLongDate,
  formatShortDate,
  formatISODate,
  formatLongDateTime,
  formatShortDateTime,
  formatRelativeTime,
  formatSmartDate,
  isToday,
  isWithinDays,
};