#!/usr/bin/env node

/**
 * Batch OCR Processing Script
 * Processes multiple images/PDFs in a directory
 * 
 * Usage:
 *   node scripts/ocr-batch.js <input-dir> [output-dir] [options]
 */

import fs from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
📚 Batch OCR Processing Tool

Usage:
  node scripts/ocr-batch.js <input-dir> [output-dir] [options]

Arguments:
  input-dir         Directory containing images to process
  output-dir        Directory to save extracted text (default: ./ocr-output)

Options:
  --lang <lang>     OCR language (default: eng)
  --pattern <ext>   File pattern to match (default: jpg,jpeg,png,bmp,tiff)
  --json           Save output as JSON
  --help, -h       Show this help message

Examples:
  node scripts/ocr-batch.js ./images
  node scripts/ocr-batch.js ./scans ./extracted --lang eng
  node scripts/ocr-batch.js ./docs ./output --json
  node scripts/ocr-batch.js ./photos ./text --pattern "png,jpg"
  `);
  process.exit(0);
}

const inputDir = args[0];
const outputDir = args[1] || './ocr-output';

const options = {
  lang: 'eng',
  pattern: ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'pdf'],
  json: false
};

// Parse options
for (let i = 2; i < args.length; i++) {
  switch (args[i]) {
    case '--lang':
      options.lang = args[++i];
      break;
    case '--pattern':
      options.pattern = args[++i].split(',');
      break;
    case '--json':
      options.json = true;
      break;
  }
}

// Check if input directory exists
if (!fs.existsSync(inputDir)) {
  console.error(`❌ Error: Input directory not found: ${inputDir}`);
  process.exit(1);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created output directory: ${outputDir}`);
}

// Get all files matching the pattern
function getFilesToProcess(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase().replace('.', '');
    return options.pattern.includes(ext);
  }).map(file => path.join(dir, file));
}

// Process a single file
async function processFile(worker, filePath, index, total) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const outputExt = options.json ? '.json' : '.txt';
  const outputPath = path.join(outputDir, fileName + outputExt);
  
  console.log(`\n[${index}/${total}] 🔍 Processing: ${path.basename(filePath)}`);
  
  try {
    const { data } = await worker.recognize(filePath);
    
    if (options.json) {
      const result = {
        source: path.basename(filePath),
        text: data.text,
        confidence: data.confidence,
        words: data.words.length,
        lines: data.lines.length,
        processedAt: new Date().toISOString()
      };
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    } else {
      fs.writeFileSync(outputPath, data.text);
    }
    
    console.log(`   ✓ Saved to: ${path.basename(outputPath)}`);
    console.log(`   📊 Confidence: ${data.confidence.toFixed(2)}% | Words: ${data.words.length}`);
    
    return { success: true, file: filePath, confidence: data.confidence };
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    return { success: false, file: filePath, error: error.message };
  }
}

// Main batch processing function
async function batchProcess() {
  const files = getFilesToProcess(inputDir);
  
  if (files.length === 0) {
    console.log(`⚠️  No files found matching pattern: ${options.pattern.join(', ')}`);
    console.log(`   in directory: ${inputDir}`);
    process.exit(0);
  }
  
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║         Batch OCR Processing Started            ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`📂 Input:  ${inputDir}`);
  console.log(`💾 Output: ${outputDir}`);
  console.log(`🌍 Language: ${options.lang}`);
  console.log(`📄 Files found: ${files.length}`);
  
  const startTime = Date.now();
  
  console.log('\n⏳ Creating OCR worker...');
  const worker = await createWorker(options.lang);
  
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await processFile(worker, files[i], i + 1, files.length);
    results.push(result);
  }
  
  await worker.terminate();
  
  // Summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgConfidence = results
    .filter(r => r.success)
    .reduce((sum, r) => sum + r.confidence, 0) / successful || 0;
  
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║              Processing Complete!                ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(`✅ Successful: ${successful}/${files.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}`);
  }
  if (successful > 0) {
    console.log(`📊 Avg Confidence: ${avgConfidence.toFixed(2)}%`);
  }
  console.log(`\n💾 Results saved to: ${outputDir}`);
  
  // List failed files
  if (failed > 0) {
    console.log('\n⚠️  Failed files:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${path.basename(r.file)}: ${r.error}`);
    });
  }
}

// Run the batch processing
batchProcess().catch(error => {
  console.error('❌ Fatal Error:', error.message);
  process.exit(1);
});
