/**
 * OCR Utilities Module
 * Provides helper functions for OCR operations
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Check if a file exists
 * @param {string} filePath - Path to file
 * @returns {Promise<boolean>} True if file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate image file
 * @param {string} imagePath - Path to image
 * @returns {Promise<Object>} Validation result
 */
async function validateImageFile(imagePath) {
  const errors = [];

  // Check if file exists
  if (!(await fileExists(imagePath))) {
    errors.push(`File not found: ${imagePath}`);
    return { valid: false, errors };
  }

  // Check file extension
  const ext = path.extname(imagePath).toLowerCase();
  const supportedFormats = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.tif', '.webp'];
  
  if (!supportedFormats.includes(ext)) {
    errors.push(`Unsupported image format: ${ext}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    extension: ext
  };
}

/**
 * Format OCR result for display
 * @param {Object} result - OCR result
 * @param {string} format - Output format (text, json, detailed)
 * @returns {string} Formatted result
 */
function formatResult(result, format = 'text') {
  switch (format.toLowerCase()) {
    case 'text':
      return result.text;
    
    case 'json':
      return JSON.stringify(result, null, 2);
    
    case 'detailed':
      return `
OCR Results:
============
Text: ${result.text}
Confidence: ${result.confidence.toFixed(2)}%
Total Words: ${result.words ? result.words.length : 'N/A'}
Total Lines: ${result.lines ? result.lines.length : 'N/A'}
`;
    
    default:
      return result.text;
  }
}

/**
 * Calculate average confidence from words
 * @param {Array<Object>} words - Array of word objects
 * @returns {number} Average confidence
 */
function calculateAverageConfidence(words) {
  if (!words || words.length === 0) {
    return 0;
  }

  const totalConfidence = words.reduce((sum, word) => sum + word.confidence, 0);
  return totalConfidence / words.length;
}

/**
 * Filter words by confidence threshold
 * @param {Array<Object>} words - Array of word objects
 * @param {number} threshold - Confidence threshold (0-100)
 * @returns {Array<Object>} Filtered words
 */
function filterByConfidence(words, threshold = 60) {
  return words.filter(word => word.confidence >= threshold);
}

/**
 * Extract text from specific region (bounding box)
 * @param {Object} result - OCR result
 * @param {Object} bbox - Bounding box {x0, y0, x1, y1}
 * @returns {string} Extracted text from region
 */
function extractTextFromRegion(result, bbox) {
  if (!result.words) {
    return '';
  }

  const wordsInRegion = result.words.filter(word => {
    const wordBbox = word.bbox;
    return wordBbox.x0 >= bbox.x0 &&
           wordBbox.y0 >= bbox.y0 &&
           wordBbox.x1 <= bbox.x1 &&
           wordBbox.y1 <= bbox.y1;
  });

  return wordsInRegion.map(word => word.text).join(' ');
}

/**
 * Group words into lines based on Y-coordinate proximity
 * @param {Array<Object>} words - Array of word objects
 * @param {number} threshold - Y-coordinate threshold for grouping
 * @returns {Array<Array<Object>>} Array of line arrays
 */
function groupWordsIntoLines(words, threshold = 10) {
  if (!words || words.length === 0) {
    return [];
  }

  // Sort words by Y-coordinate
  const sortedWords = [...words].sort((a, b) => a.bbox.y0 - b.bbox.y0);

  const lines = [];
  let currentLine = [sortedWords[0]];

  for (let i = 1; i < sortedWords.length; i++) {
    const prevWord = sortedWords[i - 1];
    const currentWord = sortedWords[i];

    // Check if words are on the same line
    if (Math.abs(currentWord.bbox.y0 - prevWord.bbox.y0) <= threshold) {
      currentLine.push(currentWord);
    } else {
      // Sort words in current line by X-coordinate
      currentLine.sort((a, b) => a.bbox.x0 - b.bbox.x0);
      lines.push(currentLine);
      currentLine = [currentWord];
    }
  }

  // Add the last line
  if (currentLine.length > 0) {
    currentLine.sort((a, b) => a.bbox.x0 - b.bbox.x0);
    lines.push(currentLine);
  }

  return lines;
}

// Constants for validation
const CASE_CONVERSION_OPTIONS = ['toLowerCase', 'toUpperCase'];

/**
 * Clean extracted text
 * @param {string} text - Raw text
 * @param {Object} options - Cleaning options
 * @returns {string} Cleaned text
 */
function cleanText(text, options = {}) {
  let cleaned = text;

  // Validate conflicting case conversion options
  const enabledCaseOptions = CASE_CONVERSION_OPTIONS.filter(opt => options[opt]);
  if (enabledCaseOptions.length > 1) {
    throw new Error(
      `Cannot use multiple case conversion options simultaneously: ${enabledCaseOptions.join(', ')}`
    );
  }

  // Remove extra whitespace
  if (options.removeExtraWhitespace !== false) {
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
  }

  // Remove special characters (Unicode-aware for multi-language support)
  if (options.removeSpecialChars) {
    // Use Unicode property escapes to handle all scripts properly
    cleaned = cleaned.replace(/[^\p{L}\p{N}\s.,!?-]/gu, '');
  }

  // Convert to lowercase
  if (options.toLowerCase) {
    cleaned = cleaned.toLowerCase();
  }

  // Convert to uppercase
  if (options.toUpperCase) {
    cleaned = cleaned.toUpperCase();
  }

  return cleaned;
}

/**
 * Save OCR result to file
 * @param {Object} result - OCR result
 * @param {string} outputPath - Output file path
 * @param {string} format - Output format
 * @returns {Promise<void>}
 */
async function saveResultToFile(result, outputPath, format = 'text') {
  const formattedResult = formatResult(result, format);
  await fs.writeFile(outputPath, formattedResult, 'utf8');
}

module.exports = {
  fileExists,
  validateImageFile,
  formatResult,
  calculateAverageConfidence,
  filterByConfidence,
  extractTextFromRegion,
  groupWordsIntoLines,
  cleanText,
  saveResultToFile
};
