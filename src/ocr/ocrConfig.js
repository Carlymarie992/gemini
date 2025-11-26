/**
 * OCR Configuration Module
 * Manages OCR settings and language configurations
 */

const OCR_CONFIG = {
  // Supported languages
  languages: {
    eng: 'English',
    spa: 'Spanish',
    fra: 'French',
    deu: 'German',
    ita: 'Italian',
    por: 'Portuguese',
    rus: 'Russian',
    chi_sim: 'Chinese (Simplified)',
    chi_tra: 'Chinese (Traditional)',
    jpn: 'Japanese',
    kor: 'Korean',
    ara: 'Arabic',
    hin: 'Hindi'
  },

  // Page segmentation modes
  pageSegmentationModes: {
    OSD_ONLY: 0, // Orientation and script detection only
    AUTO_OSD: 1, // Automatic page segmentation with OSD
    AUTO_ONLY: 2, // Automatic page segmentation, no OSD
    AUTO: 3, // Fully automatic page segmentation (default)
    SINGLE_COLUMN: 4, // Assume a single column of text
    SINGLE_BLOCK_VERT_TEXT: 5, // Assume a single uniform block of vertically aligned text
    SINGLE_BLOCK: 6, // Assume a single uniform block of text
    SINGLE_LINE: 7, // Treat the image as a single text line
    SINGLE_WORD: 8, // Treat the image as a single word
    CIRCLE_WORD: 9, // Treat the image as a single word in a circle
    SINGLE_CHAR: 10, // Treat the image as a single character
    SPARSE_TEXT: 11, // Find as much text as possible in no particular order
    SPARSE_TEXT_OSD: 12, // Sparse text with orientation and script detection
    RAW_LINE: 13 // Treat the image as a single text line, bypassing hacks
  },

  // Default settings
  defaults: {
    language: 'eng',
    pageSegmentationMode: 3, // AUTO
    minimumConfidence: 0.0,
    outputFormat: 'text'
  },

  // Advanced preprocessing options
  preprocessing: {
    enableGrayscale: true,
    enableThresholding: false,
    enableNoiseReduction: false,
    enableDeskewing: false
  },

  // OCR Engine Options
  engineOptions: {
    cachePath: './.tesseract-cache',
    workerPoolSize: 1,
    cacheMethod: 'write'
  }
};

/**
 * Get language code from language name
 * @param {string} languageName - Language name
 * @returns {string|null} Language code
 */
function getLanguageCode(languageName) {
  const entries = Object.entries(OCR_CONFIG.languages);
  const found = entries.find(([code, name]) => 
    name.toLowerCase() === languageName.toLowerCase()
  );
  return found ? found[0] : null;
}

/**
 * Validate OCR configuration
 * @param {Object} config - Configuration object
 * @returns {Object} Validation result
 */
function validateConfig(config) {
  const errors = [];

  if (config.language && !OCR_CONFIG.languages[config.language]) {
    errors.push(`Unsupported language: ${config.language}`);
  }

  if (config.tessedit_pageseg_mode !== undefined) {
    const mode = parseInt(config.tessedit_pageseg_mode);
    if (mode < 0 || mode > 13) {
      errors.push(`Invalid page segmentation mode: ${mode}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get default configuration
 * @returns {Object} Default configuration
 */
function getDefaultConfig() {
  return { ...OCR_CONFIG.defaults };
}

/**
 * Merge user configuration with defaults
 * @param {Object} userConfig - User configuration
 * @returns {Object} Merged configuration
 */
function mergeConfig(userConfig = {}) {
  return {
    ...OCR_CONFIG.defaults,
    ...userConfig
  };
}

module.exports = {
  OCR_CONFIG,
  getLanguageCode,
  validateConfig,
  getDefaultConfig,
  mergeConfig
};
