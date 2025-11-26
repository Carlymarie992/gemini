/**
 * Gemini OCR Module
 * Advanced OCR capabilities for the Gemini AI Assistant
 */

const OCREngine = require('./src/ocr/ocrEngine');
const { OCR_CONFIG, getLanguageCode, validateConfig, getDefaultConfig, mergeConfig } = require('./src/ocr/ocrConfig');
const ocrUtils = require('./src/utils/ocrUtils');

/**
 * Create a new OCR Engine instance
 * @param {Object} options - OCR options
 * @returns {OCREngine} OCR Engine instance
 */
function createOCREngine(options = {}) {
  const config = mergeConfig(options);
  const validation = validateConfig(config);
  
  if (!validation.valid) {
    throw new Error(`Invalid OCR configuration: ${validation.errors.join(', ')}`);
  }
  
  return new OCREngine(config);
}

/**
 * Quick OCR function - Extract text from an image with minimal setup
 * @param {string} imagePath - Path to image
 * @param {Object} options - OCR options
 * @returns {Promise<Object>} OCR result
 */
async function quickOCR(imagePath, options = {}) {
  // Validate image
  const validation = await ocrUtils.validateImageFile(imagePath);
  if (!validation.valid) {
    throw new Error(`Image validation failed: ${validation.errors.join(', ')}`);
  }

  const engine = createOCREngine(options);
  
  try {
    await engine.initialize();
    const result = await engine.extractText(imagePath, options);
    await engine.terminate();
    return result;
  } catch (error) {
    await engine.terminate();
    throw error;
  }
}

/**
 * Advanced OCR function with preprocessing and advanced options
 * @param {string} imagePath - Path to image
 * @param {Object} options - Advanced OCR options
 * @returns {Promise<Object>} Detailed OCR result
 */
async function advancedOCR(imagePath, options = {}) {
  // Validate image
  const validation = await ocrUtils.validateImageFile(imagePath);
  if (!validation.valid) {
    throw new Error(`Image validation failed: ${validation.errors.join(', ')}`);
  }

  const engine = createOCREngine(options);
  
  try {
    await engine.initialize();
    const result = await engine.extractTextAdvanced(imagePath, options);
    await engine.terminate();
    return result;
  } catch (error) {
    await engine.terminate();
    throw error;
  }
}

/**
 * Batch OCR - Process multiple images
 * @param {Array<string>} imagePaths - Array of image paths
 * @param {Object} options - OCR options
 * @returns {Promise<Array<Object>>} Array of OCR results
 */
async function batchOCR(imagePaths, options = {}) {
  const engine = createOCREngine(options);
  
  try {
    await engine.initialize();
    const results = await engine.extractTextBatch(imagePaths, options);
    await engine.terminate();
    return results;
  } catch (error) {
    await engine.terminate();
    throw error;
  }
}

module.exports = {
  // Core classes
  OCREngine,
  
  // Quick functions
  createOCREngine,
  quickOCR,
  advancedOCR,
  batchOCR,
  
  // Configuration
  OCR_CONFIG,
  getLanguageCode,
  validateConfig,
  getDefaultConfig,
  mergeConfig,
  
  // Utilities
  utils: ocrUtils
};
