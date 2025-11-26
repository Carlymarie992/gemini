<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1WT09Y0VA7LsXCpoV6T7x4nfVrQKdPjP6

## ✨ New: OCR (Text Extraction) Capabilities

This repository now includes powerful **Optical Character Recognition (OCR)** tools that allow you to extract text from images and PDFs directly from your terminal!

### 🚀 Quick Start with OCR

```bash
# Install dependencies (includes OCR packages)
npm install

# Test OCR setup
node scripts/ocr-test.js

# Extract text from an image
node scripts/ocr-extract.js your-image.png

# Process multiple images
node scripts/ocr-batch.js ./images ./output

# Interactive menu
node scripts/ocr-cli.js
```

### 📖 OCR Documentation

- **[OCR Examples & Commands](OCR-EXAMPLES.md)** - Complete terminal command examples
- **[OCR Quick Start](OCR-QUICKSTART.md)** - Fast reference for terminal commands
- **[OCR Setup Guide](OCR-SETUP.md)** - Detailed beginner-friendly setup instructions

### 🎯 What Can You Do with OCR?

- 📄 Extract text from court documents, evidence photos, and scanned papers
- 📝 Convert images of text into searchable, editable text files
- 📚 Process multiple documents in batch
- 🌍 Support for 13+ languages (English, Spanish, French, German, etc.)
- 🔧 JSON output for integration with other tools

---

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## OCR Terminal Commands

Once installed, you have access to these npm scripts:

```bash
npm run ocr:test           # Test OCR setup
npm run ocr:extract        # Extract text from a file
npm run ocr:batch          # Batch process multiple files
```

For detailed OCR usage instructions, see the [OCR documentation](OCR-EXAMPLES.md).
