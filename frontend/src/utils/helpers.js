/**
 * Currency formatting utility
 * Formats a number to INR currency format
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value);
};

/**
 * Date formatting utility
 * Formats a date string to readable format
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Validates if a value is a valid expense amount
 * @param {any} value - The value to validate
 * @returns {boolean} True if valid amount
 */
export const isValidAmount = (value) => {
  const amount = parseFloat(value);
  return !isNaN(amount) && amount > 0;
};

/**
 * Validates if a date string is valid
 * @param {string} dateString - The date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Get the color for a category
 * @param {string} category - The category name
 * @returns {string} Hex color code
 */
export const getCategoryColor = (category) => {
  const colorMap = {
    'Food': '#FF6B6B',
    'Transport': '#4ECDC4',
    'Entertainment': '#45B7D1',
    'Utilities': '#FFA07A',
    'Healthcare': '#98D8C8',
    'Shopping': '#F7DC6F',
    'Other': '#95A5A6'
  };
  return colorMap[category] || '#95A5A6';
};
