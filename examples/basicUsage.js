/**
 * Example: Basic OCR Usage
 * Demonstrates how to use the Gemini OCR module
 */

const { quickOCR, advancedOCR, batchOCR, createOCREngine } = require('../index');

// Example 1: Quick OCR - Simple text extraction
async function example1_quickOCR() {
  console.log('\n=== Example 1: Quick OCR ===');
  
  try {
    // Replace with your image path
    const imagePath = './examples/sample-image.jpg';
    
    const result = await quickOCR(imagePath);
    
    console.log('Extracted Text:');
    console.log(result.text);
    console.log(`\nConfidence: ${result.confidence.toFixed(2)}%`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 2: Advanced OCR with options
async function example2_advancedOCR() {
  console.log('\n=== Example 2: Advanced OCR ===');
  
  try {
    const imagePath = './examples/sample-image.jpg';
    
    const result = await advancedOCR(imagePath, {
      language: 'eng',
      tessedit_pageseg_mode: 3, // Fully automatic
    });
    
    console.log('Extracted Text:');
    console.log(result.text);
    console.log(`\nConfidence: ${result.confidence.toFixed(2)}%`);
    console.log(`Total Words: ${result.metadata.totalWords}`);
    console.log(`Total Lines: ${result.metadata.totalLines}`);
    
    // Display word-level details
    console.log('\nHigh Confidence Words (>80%):');
    result.words
      .filter(word => word.confidence > 80)
      .slice(0, 10) // Show first 10
      .forEach(word => {
        console.log(`  - "${word.text}" (${word.confidence.toFixed(2)}%)`);
      });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 3: Multi-language OCR
async function example3_multiLanguage() {
  console.log('\n=== Example 3: Multi-Language OCR ===');
  
  try {
    const imagePath = './examples/sample-image.jpg';
    
    // Detect multiple languages (English + Spanish)
    const result = await advancedOCR(imagePath, {
      language: 'eng+spa'
    });
    
    console.log('Extracted Text (English + Spanish):');
    console.log(result.text);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 4: Batch Processing
async function example4_batchOCR() {
  console.log('\n=== Example 4: Batch OCR ===');
  
  try {
    const imagePaths = [
      './examples/sample-image1.jpg',
      './examples/sample-image2.jpg',
      './examples/sample-image3.jpg'
    ];
    
    const results = await batchOCR(imagePaths, {
      language: 'eng'
    });
    
    results.forEach((result, index) => {
      console.log(`\nImage ${index + 1}: ${result.imagePath}`);
      console.log(`Text: ${result.text.substring(0, 100)}...`);
      console.log(`Confidence: ${result.confidence.toFixed(2)}%`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 5: Using OCR Engine with custom settings
async function example5_customEngine() {
  console.log('\n=== Example 5: Custom OCR Engine ===');
  
  const engine = createOCREngine({
    language: 'eng'
  });
  
  try {
    await engine.initialize();
    
    // Process multiple images with the same engine instance
    const image1 = './examples/sample-image1.jpg';
    const image2 = './examples/sample-image2.jpg';
    
    const result1 = await engine.extractText(image1);
    console.log('Image 1 Text:', result1.text.substring(0, 100));
    
    const result2 = await engine.extractText(image2);
    console.log('Image 2 Text:', result2.text.substring(0, 100));
    
    await engine.terminate();
  } catch (error) {
    console.error('Error:', error.message);
    await engine.terminate();
  }
}

// Example 6: Character whitelist (digits only)
async function example6_digitsOnly() {
  console.log('\n=== Example 6: Extract Digits Only ===');
  
  try {
    const imagePath = './examples/sample-image.jpg';
    
    const result = await advancedOCR(imagePath, {
      language: 'eng',
      tessedit_char_whitelist: '0123456789',
      tessedit_pageseg_mode: 7 // Single line
    });
    
    console.log('Extracted Digits:');
    console.log(result.text);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 7: Structured Data Extraction
async function example7_structuredData() {
  console.log('\n=== Example 7: Structured Data Extraction ===');
  
  const engine = createOCREngine();
  
  try {
    await engine.initialize();
    
    const imagePath = './examples/sample-image.jpg';
    const result = await engine.extractStructuredData(imagePath);
    
    console.log('Structured Data:');
    console.log(JSON.stringify(result.structure, null, 2));
    
    await engine.terminate();
  } catch (error) {
    console.error('Error:', error.message);
    await engine.terminate();
  }
}

// Run examples
async function runExamples() {
  console.log('Gemini OCR Examples');
  console.log('===================');
  console.log('\nNote: Make sure to have sample images in the examples folder');
  console.log('Replace image paths with your actual image files\n');
  
  // Uncomment the examples you want to run:
  // await example1_quickOCR();
  // await example2_advancedOCR();
  // await example3_multiLanguage();
  // await example4_batchOCR();
  // await example5_customEngine();
  // await example6_digitsOnly();
  // await example7_structuredData();
}

// Run if executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  example1_quickOCR,
  example2_advancedOCR,
  example3_multiLanguage,
  example4_batchOCR,
  example5_customEngine,
  example6_digitsOnly,
  example7_structuredData
};
