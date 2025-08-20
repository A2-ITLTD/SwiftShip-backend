// Utils/sanitize.js
/**
 * Sanitize user input to prevent XSS and injection
 * @param {string} str
 * @returns {string}
 */
const sanitizeInput = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/<\/?[^>]+(>|$)/g, '') // remove HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control characters
    .trim();
};

module.exports = sanitizeInput;
