<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Gemini OCR Tools

> Powerful Optical Character Recognition (OCR) tools for extracting text from images and PDFs, powered by Tesseract.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen.svg)](https://nodejs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This repository provides a comprehensive set of command-line tools for Optical Character Recognition (OCR), making it easy to extract text from images and PDFs directly from your terminal. Built with Tesseract.js, these tools support multiple languages and offer both single-file and batch processing capabilities.

Perfect for:
- 📄 Digitizing scanned documents
- 🔍 Making images searchable
- 📚 Batch processing document archives
- 🌍 Multi-language document processing
- 🔧 Integration into automated workflows

## ✨ Features

- **Multi-format Support**: PNG, JPG, JPEG, BMP, TIFF, PDF
- **Multi-language**: 13+ languages including English, Spanish, French, German, and more
- **Batch Processing**: Process entire directories of images at once
- **JSON Output**: Structured data output for programmatic use
- **Confidence Scoring**: Get accuracy metrics for extracted text
- **Interactive CLI**: User-friendly menu interface
- **Customizable**: Language selection, output formats, and more

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Carlymarie992/gemini.git
   cd gemini
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Test your setup**
   ```bash
   node scripts/ocr-test.js
   ```

You should see:
```
✅ OCR Environment is working correctly!
```

## 💻 Usage

### Extract Text from a Single Image

```bash
node scripts/ocr-extract.js document.png
```

### Save to a File

```bash
node scripts/ocr-extract.js document.png --output text.txt
```

### Process Multiple Images (Batch)

```bash
node scripts/ocr-batch.js ./images ./output
```

### Use Different Languages

```bash
# Spanish
node scripts/ocr-extract.js documento.jpg --lang spa

# French
node scripts/ocr-extract.js document.jpg --lang fra

# German
node scripts/ocr-extract.js dokument.jpg --lang deu
```

### Interactive Menu

For an easy-to-use interface:

```bash
node scripts/ocr-cli.js
```

### NPM Script Shortcuts

```bash
npm run ocr:test           # Test OCR setup
npm run ocr:extract        # Extract text from a file
npm run ocr:batch          # Batch process multiple files
```

## 📖 Documentation

Comprehensive documentation is available:

- **[START-HERE.md](START-HERE.md)** - New user onboarding guide
- **[OCR-EXAMPLES.md](OCR-EXAMPLES.md)** - Real-world command examples
- **[OCR-SETUP.md](OCR-SETUP.md)** - Detailed setup instructions
- **[OCR-QUICKSTART.md](OCR-QUICKSTART.md)** - Quick reference card
- **[OCR-TROUBLESHOOTING.md](OCR-TROUBLESHOOTING.md)** - Common issues and solutions

## 🌍 Supported Languages

- English (eng) - Default
- Spanish (spa)
- French (fra)
- German (deu)
- Italian (ita)
- Portuguese (por)
- Russian (rus)
- Arabic (ara)
- Chinese Simplified (chi_sim)
- Japanese (jpn)
- Korean (kor)
- And more!

## 🛠️ Advanced Usage

### JSON Output

Get structured data with statistics:

```bash
node scripts/ocr-extract.js image.png --json --output data.json
```

Output includes:
- Extracted text
- Confidence score
- Word count
- Line count
- Processing timestamp

### Batch Processing with Options

```bash
# Process with specific language
node scripts/ocr-batch.js ./docs ./output --lang fra

# Process with JSON output
node scripts/ocr-batch.js ./images ./output --json

# Process specific file types
node scripts/ocr-batch.js ./photos ./output --pattern "png,jpg"
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:
- How to report bugs
- How to suggest features
- Code style guidelines
- Pull request process

Please also read our [Code of Conduct](CODE_OF_CONDUCT.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tesseract.js](https://tesseract.projectnaptha.com/)
- OCR engine powered by [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)

## 📞 Support

- 📖 Check the [documentation](START-HERE.md)
- 🐛 [Report bugs](https://github.com/Carlymarie992/gemini/issues)
- 💡 [Request features](https://github.com/Carlymarie992/gemini/issues)
- ❓ [Ask questions](https://github.com/Carlymarie992/gemini/issues)

---

<div align="center">
Made with ❤️ for the open source community
</div>
