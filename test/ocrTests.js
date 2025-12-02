/**
 * Basic OCR Tests
 * Tests for OCR functionality
 */

const { 
  OCREngine, 
  createOCREngine, 
  validateConfig,
  getDefaultConfig,
  mergeConfig,
  OCR_CONFIG
} = require('../index');

// Test 1: Engine Creation
function testEngineCreation() {
  console.log('\n=== Test 1: OCR Engine Creation ===');
  
  try {
    createOCREngine({ language: 'eng' });
    console.log('✓ OCR Engine created successfully');
    return true;
  } catch (error) {
    console.error('✗ Failed to create OCR Engine:', error.message);
    return false;
  }
}

// Test 2: Configuration Validation
function testConfigValidation() {
  console.log('\n=== Test 2: Configuration Validation ===');
  
  // Valid config
  const validConfig = { language: 'eng', tessedit_pageseg_mode: 3 };
  const validResult = validateConfig(validConfig);
  
  if (validResult.valid) {
    console.log('✓ Valid configuration accepted');
  } else {
    console.error('✗ Valid configuration rejected:', validResult.errors);
    return false;
  }
  
  // Invalid language
  const invalidConfig = { language: 'invalid_lang' };
  const invalidResult = validateConfig(invalidConfig);
  
  if (!invalidResult.valid && invalidResult.errors.length > 0) {
    console.log('✓ Invalid configuration rejected correctly');
  } else {
    console.error('✗ Invalid configuration was not rejected');
    return false;
  }
  
  return true;
}

// Test 3: Default Configuration
function testDefaultConfig() {
  console.log('\n=== Test 3: Default Configuration ===');
  
  const defaultConfig = getDefaultConfig();
  
  if (defaultConfig.language === 'eng' && 
      defaultConfig.pageSegmentationMode === 3) {
    console.log('✓ Default configuration is correct');
    console.log('  Language:', defaultConfig.language);
    console.log('  Page Segmentation Mode:', defaultConfig.pageSegmentationMode);
    return true;
  } else {
    console.error('✗ Default configuration is incorrect');
    return false;
  }
}

// Test 4: Configuration Merging
function testConfigMerging() {
  console.log('\n=== Test 4: Configuration Merging ===');
  
  const userConfig = { language: 'spa' };
  const mergedConfig = mergeConfig(userConfig);
  
  if (mergedConfig.language === 'spa' && 
      mergedConfig.pageSegmentationMode === 3) {
    console.log('✓ Configuration merged correctly');
    console.log('  User language applied:', mergedConfig.language);
    console.log('  Default segmentation mode preserved:', mergedConfig.pageSegmentationMode);
    return true;
  } else {
    console.error('✗ Configuration merge failed');
    return false;
  }
}

// Test 5: Language Support
function testLanguageSupport() {
  console.log('\n=== Test 5: Language Support ===');
  
  const supportedLanguages = Object.keys(OCR_CONFIG.languages);
  
  if (supportedLanguages.length >= 13) {
    console.log(`✓ ${supportedLanguages.length} languages supported`);
    console.log('  Sample languages:', supportedLanguages.slice(0, 5).join(', '));
    return true;
  } else {
    console.error('✗ Insufficient language support');
    return false;
  }
}

// Test 6: Page Segmentation Modes
function testPageSegmentationModes() {
  console.log('\n=== Test 6: Page Segmentation Modes ===');
  
  const modes = OCR_CONFIG.pageSegmentationModes;
  const modeCount = Object.keys(modes).length;
  
  if (modeCount >= 14) {
    console.log(`✓ ${modeCount} page segmentation modes available`);
    console.log('  Sample modes:', Object.keys(modes).slice(0, 3).join(', '));
    return true;
  } else {
    console.error('✗ Insufficient page segmentation modes');
    return false;
  }
}

// Test 7: OCR Engine Instance
async function testEngineInstance() {
  console.log('\n=== Test 7: OCR Engine Instance ===');
  
  const engine = new OCREngine({ language: 'eng' });
  
  if (!engine.initialized) {
    console.log('✓ Engine created in uninitialized state');
  } else {
    console.error('✗ Engine should not be initialized on creation');
    return false;
  }
  
  try {
    console.log('  Note: Skipping initialization test (requires network access)');
    console.log('✓ Engine instance structure validated');
    return true;
  } catch (error) {
    console.error('✗ Engine initialization error:', error.message);
    return false;
  }
}

// Test 8: Invalid Page Segmentation Mode
function testInvalidPageSegMode() {
  console.log('\n=== Test 8: Invalid Page Segmentation Mode ===');
  
  const invalidConfig = { tessedit_pageseg_mode: 99 };
  const result = validateConfig(invalidConfig);
  
  if (!result.valid) {
    console.log('✓ Invalid page segmentation mode rejected');
    return true;
  } else {
    console.error('✗ Invalid page segmentation mode was accepted');
    return false;
  }
}

// Test 9: Clean Text Validation
function testCleanTextValidation() {
  console.log('\n=== Test 9: Clean Text Validation ===');
  
  const { utils } = require('../index');
  
  try {
    // This should throw an error
    utils.cleanText('Test', { toLowerCase: true, toUpperCase: true });
    console.error('✗ Should have thrown error for conflicting options');
    return false;
  } catch (error) {
    if (error.message.includes('Cannot use multiple case conversion options')) {
      console.log('✓ Conflicting text case options correctly rejected');
      return true;
    } else {
      console.error('✗ Wrong error thrown:', error.message);
      return false;
    }
  }
}

// Run all tests
async function runTests() {
  console.log('==========================================');
  console.log('     Gemini OCR Module - Test Suite      ');
  console.log('==========================================');
  
  const results = [];
  
  results.push(testEngineCreation());
  results.push(testConfigValidation());
  results.push(testDefaultConfig());
  results.push(testConfigMerging());
  results.push(testLanguageSupport());
  results.push(testPageSegmentationModes());
  results.push(await testEngineInstance());
  results.push(testInvalidPageSegMode());
  results.push(testCleanTextValidation());
  
  const passed = results.filter(r => r === true).length;
  const total = results.length;
  
  console.log('\n==========================================');
  console.log(`Test Results: ${passed}/${total} passed`);
  console.log('==========================================\n');
  
  return passed === total;
}

// Run if executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite error:', error);
      process.exit(1);
    });
}

module.exports = { runTests };
