/**
 * OCR Engine Module
 * Provides advanced OCR capabilities using Tesseract.js
 */

const Tesseract = require('tesseract.js');

class OCREngine {
  constructor(options = {}) {
    this.defaultLanguage = options.language || 'eng';
    this.worker = null;
    this.initialized = false;
  }

  /**
   * Initialize the OCR worker
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    this.worker = await Tesseract.createWorker(this.defaultLanguage);
    this.initialized = true;
    console.log('OCR Engine initialized successfully');
  }

  /**
   * Extract text from an image
   * @param {string|Buffer} imagePath - Path to image or image buffer
   * @param {Object} options - OCR options
   * @returns {Promise<Object>} Recognition result
   */
  async extractText(imagePath, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const language = options.language || this.defaultLanguage;
    
    // Set language if different from current
    if (language !== this.defaultLanguage) {
      await this.worker.loadLanguage(language);
      await this.worker.initialize(language);
    }

    const result = await this.worker.recognize(imagePath);
    
    return {
      text: result.data.text,
      confidence: result.data.confidence,
      words: result.data.words,
      lines: result.data.lines,
      paragraphs: result.data.paragraphs,
      blocks: result.data.blocks
    };
  }

  /**
   * Extract text with advanced preprocessing
   * @param {string|Buffer} imagePath - Path to image or image buffer
   * @param {Object} options - Advanced options
   * @returns {Promise<Object>} Recognition result with metadata
   */
  async extractTextAdvanced(imagePath, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const {
      language = this.defaultLanguage,
      tessedit_pageseg_mode = 3, // Fully automatic page segmentation
      tessedit_char_whitelist = null,
      tessedit_char_blacklist = null
    } = options;

    // Set language if different from current
    if (language !== this.defaultLanguage) {
      await this.worker.loadLanguage(language);
      await this.worker.initialize(language);
    }

    // Configure worker parameters
    const params = {
      tessedit_pageseg_mode: tessedit_pageseg_mode.toString()
    };

    if (tessedit_char_whitelist) {
      params.tessedit_char_whitelist = tessedit_char_whitelist;
    }

    if (tessedit_char_blacklist) {
      params.tessedit_char_blacklist = tessedit_char_blacklist;
    }

    await this.worker.setParameters(params);

    const result = await this.worker.recognize(imagePath);

    return {
      text: result.data.text,
      confidence: result.data.confidence,
      words: result.data.words.map(word => ({
        text: word.text,
        confidence: word.confidence,
        bbox: word.bbox
      })),
      lines: result.data.lines.map(line => ({
        text: line.text,
        confidence: line.confidence,
        bbox: line.bbox
      })),
      metadata: {
        language: language,
        pageSegmentationMode: tessedit_pageseg_mode,
        totalWords: result.data.words.length,
        totalLines: result.data.lines.length
      }
    };
  }

  /**
   * Extract text from multiple images in batch
   * @param {Array<string>} imagePaths - Array of image paths
   * @param {Object} options - OCR options
   * @returns {Promise<Array<Object>>} Array of recognition results
   */
  async extractTextBatch(imagePaths, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    const results = [];
    for (const imagePath of imagePaths) {
      const result = await this.extractText(imagePath, options);
      results.push({
        imagePath,
        ...result
      });
    }

    return results;
  }

  /**
   * Detect text language from an image
   * @param {string|Buffer} imagePath - Path to image or image buffer
   * @returns {Promise<Object>} Language detection result
   */
  async detectLanguage(imagePath) {
    if (!this.initialized) {
      await this.initialize();
    }

    // Use script detection mode
    await this.worker.setParameters({
      tessedit_pageseg_mode: '1' // Automatic page segmentation with OSD
    });

    const result = await this.worker.detect(imagePath);
    
    return {
      script: result.data.script,
      confidence: result.data.script_confidence
    };
  }

  /**
   * Extract structured data from an image (tables, forms, etc.)
   * @param {string|Buffer} imagePath - Path to image or image buffer
   * @param {Object} options - Extraction options
   * @returns {Promise<Object>} Structured data
   */
  async extractStructuredData(imagePath, options = {}) {
    const result = await this.extractTextAdvanced(imagePath, {
      ...options,
      tessedit_pageseg_mode: 6 // Assume a single uniform block of text
    });

    // Group words into structured format
    const structuredData = {
      text: result.text,
      confidence: result.confidence,
      structure: {
        lines: result.lines,
        wordCount: result.metadata.totalWords,
        lineCount: result.metadata.totalLines
      }
    };

    return structuredData;
  }

  /**
   * Terminate the OCR worker
   * @returns {Promise<void>}
   */
  async terminate() {
    if (this.worker && this.initialized) {
      await this.worker.terminate();
      this.initialized = false;
      console.log('OCR Engine terminated');
    }
  }
}

module.exports = OCREngine;
