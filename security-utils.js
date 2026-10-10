/**
 * Security Utilities for Noteous
 * Provides sanitization and validation functions to prevent XSS and injection attacks
 */

/**
 * Sanitizes HTML by removing potentially dangerous scripts
 * @param {string} dirty - Untrusted HTML string
 * @returns {string} Sanitized HTML string
 */
function sanitizeHTML(dirty) {
  const div = document.createElement('div');
  div.textContent = dirty;
  return div.innerHTML;
}

/**
 * Escapes HTML special characters to prevent injection
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
function escapeHTML(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Safely sets text content to prevent XSS
 * Replaces .innerHTML for text-only content
 * @param {HTMLElement} element - Target DOM element
 * @param {string} text - Text to set
 */
function setTextContent(element, text) {
  if (element) {
    element.textContent = text;
  }
}

/**
 * Safely clears element content
 * Replaces .innerHTML = '' for better performance and security
 * @param {HTMLElement} element - Target DOM element
 */
function clearElement(element) {
  if (element) {
    element.replaceChildren();
  }
}

/**
 * Validates localStorage data structure
 * @param {string} key - localStorage key
 * @param {object} schema - Expected schema
 * @returns {object|null} Parsed and validated data, or null if invalid
 */
function getValidatedStorage(key, schema = null) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // If no schema provided, return parsed data
    if (!schema) return parsed;
    
    // Basic schema validation
    if (schema.type === 'array' && !Array.isArray(parsed)) {
      console.warn(`Storage key '${key}' should be an array`);
      return null;
    }
    
    if (schema.type === 'object' && typeof parsed !== 'object') {
      console.warn(`Storage key '${key}' should be an object`);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error parsing localStorage key '${key}':`, error);
    return null;
  }
}

/**
 * Safely sets localStorage with JSON validation
 * @param {string} key - localStorage key
 * @param {object} value - Value to store
 * @returns {boolean} True if successful
 */
function setSafeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error storing to localStorage key '${key}':`, error);
    return false;
  }
}
