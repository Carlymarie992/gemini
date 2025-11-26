# Gemini - AI Assistant with Advanced OCR Capabilities

An AI assistant with powerful Optical Character Recognition (OCR) capabilities powered by Tesseract.js.

## Features

- 🔍 **Advanced Text Extraction**: Extract text from images with high accuracy
- 🌍 **Multi-Language Support**: Support for 13+ languages including English, Spanish, French, German, Chinese, Japanese, and more
- 📊 **Structured Data Extraction**: Extract text with bounding boxes, confidence scores, and hierarchical structure
- 🎯 **Batch Processing**: Process multiple images efficiently
- ⚙️ **Customizable Options**: Fine-tune OCR with page segmentation modes, character whitelists, and more
- 📝 **Word & Line Level Details**: Access detailed information about each word and line detected

## Installation

```bash
npm install
```

## Quick Demo

Run the interactive demo to see OCR capabilities without needing images:

```bash
npm run demo
```

This will show:
- Supported languages
- Page segmentation modes
- Configuration validation
- Text cleaning utilities
- Available API exports

## Quick Start

```javascript
const { quickOCR } = require('./index');

async function extractText() {
  const result = await quickOCR('./path/to/image.jpg');
  console.log(result.text);
}

extractText();
```

## Usage Examples

### Basic Text Extraction

```javascript
const { quickOCR } = require('./index');

const result = await quickOCR('./image.jpg');
console.log('Text:', result.text);
console.log('Confidence:', result.confidence);
```

### Advanced OCR with Options

```javascript
const { advancedOCR } = require('./index');

const result = await advancedOCR('./image.jpg', {
  language: 'eng',
  tessedit_pageseg_mode: 3, // Fully automatic page segmentation
  tessedit_char_whitelist: null // Accept all characters
});

console.log('Text:', result.text);
console.log('Words:', result.words);
console.log('Confidence:', result.confidence);
```

### Multi-Language OCR

```javascript
const { advancedOCR } = require('./index');

// Process image with multiple languages
const result = await advancedOCR('./image.jpg', {
  language: 'eng+spa+fra' // English + Spanish + French
});
```

### Batch Processing

```javascript
const { batchOCR } = require('./index');

const images = ['./image1.jpg', './image2.jpg', './image3.jpg'];
const results = await batchOCR(images);

results.forEach((result, index) => {
  console.log(`Image ${index + 1}:`, result.text);
});
```

### Using OCR Engine Instance

```javascript
const { createOCREngine } = require('./index');

const engine = createOCREngine({ language: 'eng' });

await engine.initialize();

const result1 = await engine.extractText('./image1.jpg');
const result2 = await engine.extractText('./image2.jpg');

await engine.terminate();
```

### Extract Only Digits

```javascript
const { advancedOCR } = require('./index');

const result = await advancedOCR('./invoice.jpg', {
  tessedit_char_whitelist: '0123456789',
  tessedit_pageseg_mode: 6 // Assume a single uniform block of text
});

console.log('Numbers found:', result.text);
```

## Supported Languages

- English (eng)
- Spanish (spa)
- French (fra)
- German (deu)
- Italian (ita)
- Portuguese (por)
- Russian (rus)
- Chinese Simplified (chi_sim)
- Chinese Traditional (chi_tra)
- Japanese (jpn)
- Korean (kor)
- Arabic (ara)
- Hindi (hin)

## Page Segmentation Modes

- `0` - Orientation and script detection only
- `1` - Automatic page segmentation with OSD
- `2` - Automatic page segmentation, no OSD
- `3` - Fully automatic page segmentation (default)
- `4` - Assume a single column of text
- `5` - Assume a single uniform block of vertically aligned text
- `6` - Assume a single uniform block of text
- `7` - Treat the image as a single text line
- `8` - Treat the image as a single word
- `9` - Treat the image as a single word in a circle
- `10` - Treat the image as a single character
- `11` - Find as much text as possible in no particular order
- `12` - Sparse text with orientation and script detection
- `13` - Treat the image as a single text line, bypassing hacks

## API Reference

### `quickOCR(imagePath, options)`

Quick OCR with minimal setup.

**Parameters:**
- `imagePath` (string): Path to the image file
- `options` (object): Optional OCR options

**Returns:** Promise<Object> with text, confidence, words, and lines

### `advancedOCR(imagePath, options)`

Advanced OCR with detailed results.

**Parameters:**
- `imagePath` (string): Path to the image file
- `options` (object): Advanced OCR options
  - `language` (string): Language code (default: 'eng')
  - `tessedit_pageseg_mode` (number): Page segmentation mode (default: 3)
  - `tessedit_char_whitelist` (string): Characters to recognize
  - `tessedit_char_blacklist` (string): Characters to ignore

**Returns:** Promise<Object> with detailed OCR results including metadata

### `batchOCR(imagePaths, options)`

Process multiple images in batch.

**Parameters:**
- `imagePaths` (Array<string>): Array of image paths
- `options` (object): OCR options

**Returns:** Promise<Array<Object>> with results for each image

### `createOCREngine(options)`

Create a reusable OCR engine instance.

**Parameters:**
- `options` (object): Engine configuration

**Returns:** OCREngine instance

## Advanced Features

### Structured Data Extraction

```javascript
const engine = createOCREngine();
await engine.initialize();

const result = await engine.extractStructuredData('./form.jpg');
console.log(result.structure);

await engine.terminate();
```

### Language Detection

```javascript
const engine = createOCREngine();
await engine.initialize();

const detection = await engine.detectLanguage('./image.jpg');
console.log('Detected script:', detection.script);

await engine.terminate();
```

## Examples

Check the `examples/` folder for more detailed usage examples:

- `basicUsage.js` - Comprehensive examples of all features

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- BMP (.bmp)
- GIF (.gif)
- TIFF (.tiff, .tif)
- WebP (.webp)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
