const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');

/**
 * OCR Scanner - Optical Character Recognition for documents
 * Exceptional OCR capabilities for extracting text from images and scanned documents
 */
class OCRScanner {
  constructor() {
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif', '.pdf'];
  }

  /**
   * Perform OCR on an image file
   */
  async scanImage(imagePath, options = {}) {
    const {
      language = 'eng',
      outputFormat = 'text',
      includeConfidence = false
    } = options;

    try {
      // Verify file exists
      await fs.access(imagePath);
      
      const ext = path.extname(imagePath).toLowerCase();
      if (!this.supportedFormats.includes(ext) && ext !== '.pdf') {
        throw new Error(`Unsupported file format: ${ext}`);
      }

      console.log(`Starting OCR scan of: ${path.basename(imagePath)}`);
      
      const result = await Tesseract.recognize(
        imagePath,
        language,
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              process.stdout.write(`\rProgress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      console.log('\n✓ OCR scan completed');

      return this.formatResult(result, outputFormat, includeConfidence);
    } catch (error) {
      throw new Error(`OCR scan failed: ${error.message}`);
    }
  }

  /**
   * Batch OCR processing for multiple files
   */
  async scanBatch(imagePaths, options = {}) {
    const results = [];
    const errors = [];

    console.log(`Starting batch OCR scan of ${imagePaths.length} files...`);

    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      console.log(`\n[${i + 1}/${imagePaths.length}] Processing: ${path.basename(imagePath)}`);
      
      try {
        const result = await this.scanImage(imagePath, options);
        results.push({
          file: imagePath,
          success: true,
          data: result
        });
      } catch (error) {
        errors.push({
          file: imagePath,
          error: error.message
        });
        results.push({
          file: imagePath,
          success: false,
          error: error.message
        });
      }
    }

    console.log(`\n✓ Batch scan completed: ${results.filter(r => r.success).length} successful, ${errors.length} failed`);

    return {
      results,
      errors,
      summary: this.generateBatchSummary(results)
    };
  }

  /**
   * Format OCR result based on requested output format
   */
  formatResult(result, outputFormat, includeConfidence) {
    const { data } = result;

    if (outputFormat === 'text') {
      return {
        text: data.text,
        confidence: includeConfidence ? data.confidence : undefined,
        wordCount: data.text.split(/\s+/).filter(w => w.length > 0).length
      };
    }

    if (outputFormat === 'detailed') {
      return {
        text: data.text,
        confidence: data.confidence,
        words: data.words.map(w => ({
          text: w.text,
          confidence: w.confidence,
          bbox: w.bbox
        })),
        lines: data.lines.map(l => ({
          text: l.text,
          confidence: l.confidence
        })),
        wordCount: data.words.length,
        lineCount: data.lines.length
      };
    }

    if (outputFormat === 'structured') {
      return {
        text: data.text,
        confidence: data.confidence,
        paragraphs: this.extractParagraphs(data.text),
        structure: this.analyzeStructure(data)
      };
    }

    return { text: data.text };
  }

  /**
   * Extract paragraphs from text
   */
  extractParagraphs(text) {
    return text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }

  /**
   * Analyze document structure
   */
  analyzeStructure(data) {
    const lines = data.lines || [];
    const structure = {
      hasHeadings: false,
      hasBulletPoints: false,
      hasNumbers: false,
      columnLayout: false,
      estimatedSections: 0
    };

    lines.forEach(line => {
      const text = line.text.trim();
      
      // Check for headings (short lines with high confidence)
      if (text.length < 50 && text.length > 5 && line.confidence > 90) {
        structure.hasHeadings = true;
      }

      // Check for bullet points
      if (/^[•\-\*·]/.test(text)) {
        structure.hasBulletPoints = true;
      }

      // Check for numbered lists
      if (/^\d+[\.):]/.test(text)) {
        structure.hasNumbers = true;
      }
    });

    // Estimate sections based on blank lines
    const blankLineCount = data.text.split(/\n\s*\n/).length;
    structure.estimatedSections = Math.max(1, blankLineCount);

    return structure;
  }

  /**
   * Generate summary for batch processing
   */
  generateBatchSummary(results) {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    const totalWords = successful.reduce((sum, r) => 
      sum + (r.data.wordCount || 0), 0
    );

    const avgConfidence = successful.length > 0
      ? successful.reduce((sum, r) => sum + (r.data.confidence || 0), 0) / successful.length
      : 0;

    return {
      totalFiles: results.length,
      successful: successful.length,
      failed: failed.length,
      totalWords,
      averageConfidence: Math.round(avgConfidence)
    };
  }

  /**
   * Extract text and save to file
   */
  async scanAndSave(imagePath, outputPath, options = {}) {
    const result = await this.scanImage(imagePath, options);
    
    let content = result.text;
    
    if (options.includeMetadata) {
      content = `OCR Scan Results
Source: ${imagePath}
Date: ${new Date().toISOString()}
Confidence: ${result.confidence || 'N/A'}
Word Count: ${result.wordCount || 0}
${'='.repeat(50)}

${result.text}
`;
    }

    await fs.writeFile(outputPath, content, 'utf8');
    console.log(`✓ Text saved to: ${outputPath}`);
    
    return { result, outputPath };
  }

  /**
   * Quick scan with summary
   */
  async quickScan(imagePath) {
    const result = await this.scanImage(imagePath, { outputFormat: 'text' });
    
    const preview = result.text.substring(0, 200);
    const summary = {
      file: path.basename(imagePath),
      wordCount: result.wordCount,
      confidence: result.confidence ? Math.round(result.confidence) : 'N/A',
      preview: preview + (result.text.length > 200 ? '...' : ''),
      fullText: result.text
    };

    return summary;
  }

  /**
   * Search for text in scanned document
   */
  async searchInDocument(imagePath, searchTerm, options = {}) {
    const result = await this.scanImage(imagePath, { outputFormat: 'detailed' });
    const text = result.text.toLowerCase();
    const term = searchTerm.toLowerCase();
    
    const matches = [];
    let index = 0;
    
    while ((index = text.indexOf(term, index)) !== -1) {
      const start = Math.max(0, index - 50);
      const end = Math.min(text.length, index + term.length + 50);
      const context = text.substring(start, end);
      
      matches.push({
        position: index,
        context: '...' + context + '...',
        line: this.findLineNumber(result.text, index)
      });
      
      index += term.length;
    }

    return {
      searchTerm,
      found: matches.length > 0,
      matchCount: matches.length,
      matches: matches.slice(0, 10), // Limit to 10 matches
      text: result.text
    };
  }

  /**
   * Find line number for a character position
   */
  findLineNumber(text, position) {
    const textUpToPosition = text.substring(0, position);
    return textUpToPosition.split('\n').length;
  }

  /**
   * Explain OCR result in plain English
   */
  explainResult(result) {
    let explanation = '📄 OCR Scan Results\n\n';
    
    if (result.confidence) {
      explanation += `Confidence Level: ${Math.round(result.confidence)}%\n`;
      
      if (result.confidence > 90) {
        explanation += '✓ Excellent quality - text recognition is highly accurate\n';
      } else if (result.confidence > 75) {
        explanation += '✓ Good quality - text recognition is reliable\n';
      } else if (result.confidence > 50) {
        explanation += '⚠️  Fair quality - some text may be inaccurate\n';
      } else {
        explanation += '⚠️  Poor quality - manual verification recommended\n';
      }
      explanation += '\n';
    }

    if (result.wordCount) {
      explanation += `Words Extracted: ${result.wordCount}\n`;
    }

    if (result.lineCount) {
      explanation += `Lines: ${result.lineCount}\n`;
    }

    if (result.structure) {
      explanation += '\nDocument Structure:\n';
      if (result.structure.hasHeadings) {
        explanation += '• Contains headings or titles\n';
      }
      if (result.structure.hasBulletPoints) {
        explanation += '• Contains bullet points\n';
      }
      if (result.structure.hasNumbers) {
        explanation += '• Contains numbered lists\n';
      }
      explanation += `• Estimated sections: ${result.structure.estimatedSections}\n`;
    }

    explanation += '\n💡 Tip: Use the extracted text for evidence analysis or case documentation.';
    
    return explanation;
  }

  /**
   * Get supported formats
   */
  getSupportedFormats() {
    return {
      formats: this.supportedFormats,
      description: 'Supported image formats for OCR scanning',
      recommendation: 'For best results, use high-resolution PNG or TIFF images'
    };
  }
}

module.exports = OCRScanner;
