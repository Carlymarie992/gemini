#!/usr/bin/env node

/**
 * OCR Text Extraction Script
 * Extracts text from images and PDFs using Tesseract.js
 * 
 * Usage:
 *   node scripts/ocr-extract.js <file-path> [options]
 * 
 * Options:
 *   --lang <lang>     OCR language (default: eng)
 *   --output <file>   Save output to file
 *   --json           Output as JSON
 */

import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
📄 OCR Text Extraction Tool

Usage:
  node scripts/ocr-extract.js <file-path> [options]

Options:
  --lang <lang>      OCR language (default: eng)
                     Available: eng, spa, fra, deu, etc.
  --output <file>    Save output to file
  --json            Output as JSON format
  --help, -h        Show this help message

Examples:
  node scripts/ocr-extract.js image.png
  node scripts/ocr-extract.js document.jpg --lang eng
  node scripts/ocr-extract.js scan.png --output extracted.txt
  node scripts/ocr-extract.js photo.jpg --json --output data.json
  `);
  process.exit(0);
}

const filePath = args[0];
const options = {
  lang: 'eng',
  outputFile: null,
  json: false
};

// Parse options
for (let i = 1; i < args.length; i++) {
  switch (args[i]) {
    case '--lang':
      options.lang = args[++i];
      break;
    case '--output':
      options.outputFile = args[++i];
      break;
    case '--json':
      options.json = true;
      break;
  }
}

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`❌ Error: File not found: ${filePath}`);
  process.exit(1);
}

// Main OCR function
async function extractText() {
  console.log(`🔍 Processing: ${path.basename(filePath)}`);
  console.log(`   Language: ${options.lang}`);
  console.log('');
  
  const worker = await createWorker(options.lang, 1, {
    logger: m => {
      if (m.status === 'recognizing text') {
        process.stdout.write(`\r⏳ Progress: ${Math.round(m.progress * 100)}%`);
      }
    }
  });
  
  try {
    const { data } = await worker.recognize(filePath);
    process.stdout.write('\r'); // Clear progress line
    console.log('✅ OCR Complete!\n');
    
    if (options.json) {
      const result = {
        text: data.text,
        confidence: data.confidence,
        words: data.words.length,
        lines: data.lines.length,
        paragraphs: data.paragraphs.length
      };
      
      const output = JSON.stringify(result, null, 2);
      
      if (options.outputFile) {
        fs.writeFileSync(options.outputFile, output);
        console.log(`💾 Saved to: ${options.outputFile}`);
      } else {
        console.log(output);
      }
    } else {
      if (options.outputFile) {
        fs.writeFileSync(options.outputFile, data.text);
        console.log(`💾 Saved to: ${options.outputFile}`);
      } else {
        console.log('📝 Extracted Text:');
        console.log('─'.repeat(50));
        console.log(data.text);
        console.log('─'.repeat(50));
      }
      
      console.log(`\n📊 Statistics:`);
      console.log(`   Confidence: ${data.confidence.toFixed(2)}%`);
      console.log(`   Words: ${data.words.length}`);
      console.log(`   Lines: ${data.lines.length}`);
    }
    
  } catch (error) {
    console.error('❌ OCR Error:', error.message);
    process.exit(1);
  } finally {
    await worker.terminate();
  }
}

// Run the extraction
extractText().catch(error => {
  console.error('❌ Fatal Error:', error.message);
  process.exit(1);
});
