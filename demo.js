/**
 * Gemini OCR - Quick Demo
 * 
 * This script demonstrates the OCR capabilities without requiring actual images.
 * It shows the API usage patterns and module structure.
 */

const { 
  createOCREngine,
  OCR_CONFIG,
  getLanguageCode,
  validateConfig,
  utils
} = require('./index');

console.log('╔════════════════════════════════════════════════╗');
console.log('║   Gemini OCR - Advanced Capabilities Demo     ║');
console.log('╚════════════════════════════════════════════════╝\n');

// Demo 1: Show available languages
console.log('📚 SUPPORTED LANGUAGES:');
console.log('─'.repeat(50));
Object.entries(OCR_CONFIG.languages).forEach(([code, name]) => {
  console.log(`  ${code.padEnd(12)} - ${name}`);
});

// Demo 2: Show page segmentation modes
console.log('\n⚙️  PAGE SEGMENTATION MODES:');
console.log('─'.repeat(50));
Object.entries(OCR_CONFIG.pageSegmentationModes).slice(0, 5).forEach(([name, mode]) => {
  console.log(`  Mode ${mode}: ${name}`);
});
console.log('  ... and 9 more modes\n');

// Demo 3: Configuration validation
console.log('✅ CONFIGURATION VALIDATION:');
console.log('─'.repeat(50));

const validConfig = { language: 'eng', tessedit_pageseg_mode: 3 };
const validResult = validateConfig(validConfig);
console.log(`  Valid config: ${JSON.stringify(validConfig)}`);
console.log(`  Result: ${validResult.valid ? '✓ Valid' : '✗ Invalid'}\n`);

const invalidConfig = { language: 'invalid_lang' };
const invalidResult = validateConfig(invalidConfig);
console.log(`  Invalid config: ${JSON.stringify(invalidConfig)}`);
console.log(`  Result: ${invalidResult.valid ? '✓ Valid' : '✗ Invalid'}`);
if (!invalidResult.valid) {
  console.log(`  Errors: ${invalidResult.errors.join(', ')}\n`);
}

// Demo 4: Language code lookup
console.log('🔍 LANGUAGE CODE LOOKUP:');
console.log('─'.repeat(50));
const langCode = getLanguageCode('Spanish');
console.log(`  Language "Spanish" → Code: "${langCode}"\n`);

// Demo 5: Text cleaning demonstration
console.log('🧹 TEXT CLEANING UTILITIES:');
console.log('─'.repeat(50));
const sampleText = '  Hello   World!  ';
console.log(`  Original: "${sampleText}"`);
console.log(`  Cleaned:  "${utils.cleanText(sampleText)}"`);
console.log(`  Lowercase: "${utils.cleanText(sampleText, { toLowerCase: true })}"`);
console.log(`  Uppercase: "${utils.cleanText(sampleText, { toUpperCase: true })}"\n`);

// Demo 6: Engine creation
console.log('🚀 OCR ENGINE:');
console.log('─'.repeat(50));
const engine = createOCREngine({ language: 'eng' });
console.log(`  ✓ Engine created successfully`);
console.log(`  Default language: ${engine.defaultLanguage}`);
console.log(`  Initialized: ${engine.initialized}\n`);

// Demo 7: Module exports
console.log('📦 AVAILABLE EXPORTS:');
console.log('─'.repeat(50));
const gemini = require('./index');
const moduleExports = Object.keys(gemini);
moduleExports.forEach(exp => {
  console.log(`  • ${exp}`);
});

console.log('\n╔════════════════════════════════════════════════╗');
console.log('║  To use OCR on actual images:                  ║');
console.log('║                                                 ║');
console.log('║  const { quickOCR } = require("./index");      ║');
console.log('║  const result = await quickOCR("image.jpg");   ║');
console.log('║  console.log(result.text);                     ║');
console.log('╚════════════════════════════════════════════════╝\n');

console.log('✨ Demo completed successfully!\n');
