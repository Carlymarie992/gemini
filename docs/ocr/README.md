# 🔍 OCR Tools Documentation

> Documentation for the OCR (Optical Character Recognition) tools in this repository

## 📚 Documentation Index

| Document | Description | Best For |
|----------|-------------|----------|
| **[START-HERE.md](START-HERE.md)** | Complete onboarding guide | New users |
| **[OCR-README.md](OCR-README.md)** | Overview of all OCR features | Getting the big picture |
| **[OCR-EXAMPLES.md](OCR-EXAMPLES.md)** | Copy-paste command examples | Quick start with real commands |
| **[OCR-QUICKSTART.md](OCR-QUICKSTART.md)** | Quick reference card | Experienced users |
| **[OCR-SETUP.md](OCR-SETUP.md)** | Detailed setup instructions | Troubleshooting setup |
| **[OCR-TROUBLESHOOTING.md](OCR-TROUBLESHOOTING.md)** | Common issues and solutions | When things go wrong |

## 🚀 Quick Start

1. **New to OCR?** Start with [START-HERE.md](START-HERE.md)
2. **Want examples?** Check [OCR-EXAMPLES.md](OCR-EXAMPLES.md)
3. **Having problems?** See [OCR-TROUBLESHOOTING.md](OCR-TROUBLESHOOTING.md)

## 📂 Script Locations

All OCR scripts are located in the `scripts/` directory at the repository root:

```
gemini/
├── scripts/
│   ├── ocr-test.js      # Test your OCR setup
│   ├── ocr-extract.js   # Extract text from single files
│   ├── ocr-batch.js     # Process multiple files
│   ├── ocr-cli.js       # Interactive menu interface
│   └── setup-ocr.sh     # Installation helper
└── docs/ocr/            # You are here! (Documentation)
```

## 💻 Common Commands

```bash
# Test your setup
node scripts/ocr-test.js

# Extract text from an image
node scripts/ocr-extract.js image.png

# Save output to a file
node scripts/ocr-extract.js image.png --output text.txt

# Batch process a directory
node scripts/ocr-batch.js ./images ./output

# Interactive menu
node scripts/ocr-cli.js
```

## 🔗 Back to Main

[← Back to Main README](../../README.md)
