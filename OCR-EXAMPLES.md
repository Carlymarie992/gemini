# OCR Terminal Commands - Complete Example Guide

## 🎯 Purpose

This guide shows you **exactly** what commands to type in your terminal to use OCR (Optical Character Recognition) to extract text from images and PDFs.

---

## 📦 Step 1: Install Dependencies

First, make sure you're in your project directory:

```bash
cd /path/to/your/gemini/project
```

Then install the OCR packages:

```bash
npm install
```

This installs:
- `tesseract.js` - The OCR engine
- `pdf-parse` - For PDF support
- `sharp` - For image processing

---

## 🧪 Step 2: Test Your Setup

Run this command to verify everything is working:

```bash
node scripts/ocr-test.js
```

You should see:
```
🧪 Testing OCR Environment...

✓ Tesseract.js package found
⏳ Creating OCR worker...
✓ OCR worker created successfully

✅ OCR Environment is working correctly!

🚀 Ready to use:
   node scripts/ocr-extract.js <image-file>

📖 Supported formats: PNG, JPG, JPEG, BMP, TIFF, PDF
```

---

## 📄 Step 3: Extract Text from an Image

### Basic Usage

```bash
node scripts/ocr-extract.js your-image.png
```

This will:
1. Read the image
2. Extract all text
3. Display it in your terminal

### Save to a File

```bash
node scripts/ocr-extract.js your-image.png --output extracted-text.txt
```

### Use a Different Language

```bash
# Spanish document
node scripts/ocr-extract.js documento.jpg --lang spa

# French document
node scripts/ocr-extract.js document.jpg --lang fra

# German document
node scripts/ocr-extract.js dokument.jpg --lang deu
```

### Get JSON Output with Stats

```bash
node scripts/ocr-extract.js image.png --json --output data.json
```

This creates a JSON file with:
- Extracted text
- Confidence score
- Word count
- Line count

---

## 📚 Step 4: Process Multiple Files

If you have many images in a folder:

```bash
# Process all images in ./my-images/ folder
node scripts/ocr-batch.js ./my-images

# Save to a specific output folder
node scripts/ocr-batch.js ./my-images ./extracted-text

# Process with Spanish language
node scripts/ocr-batch.js ./documentos ./texto --lang spa
```

---

## 🎨 Interactive Menu

For a user-friendly menu interface:

```bash
node scripts/ocr-cli.js
```

This shows:
```
╔══════════════════════════════════════════════════╗
║            OCR Command Line Tool                 ║
╚══════════════════════════════════════════════════╝

What would you like to do?

  1. 📄 Extract text from a single file
  2. 📚 Process multiple files (batch)
  3. 🧪 Test OCR setup
  4. 🌍 Change language settings
  5. ℹ️  View help and documentation
  6. 🚪 Exit

Choose an option (1-6):
```

---

## 💡 Common Use Cases

### Use Case 1: Extract Text from a Legal Document

```bash
# Extract text from a court filing
node scripts/ocr-extract.js court-filing.pdf --output case-text.txt

# View the extracted text
cat case-text.txt
```

### Use Case 2: Process All Evidence Photos

```bash
# Create a folder for your evidence photos
mkdir evidence-photos

# Put your photos in that folder (copy them there)

# Extract text from all photos
node scripts/ocr-batch.js ./evidence-photos ./evidence-text

# Check the results
ls evidence-text/
```

### Use Case 3: Search for Keywords in an Image

```bash
# Extract text to a file
node scripts/ocr-extract.js document.jpg --output temp.txt

# Search for specific words
grep -i "custody" temp.txt
grep -i "exhibit" temp.txt
grep -i "visitation" temp.txt

# Clean up
rm temp.txt
```

### Use Case 4: Extract and Count Words

```bash
# Extract text and count words
node scripts/ocr-extract.js document.png --output text.txt
wc -w text.txt
```

---

## 🔧 Troubleshooting Commands

### Check if Node.js is installed
```bash
node --version
npm --version
```

### Reinstall OCR packages
```bash
npm install tesseract.js pdf-parse sharp
```

### Make scripts executable (Mac/Linux)
```bash
chmod +x scripts/*.sh scripts/*.js
```

### View help for any script
```bash
node scripts/ocr-extract.js --help
node scripts/ocr-batch.js --help
```

### List available languages
```bash
# If Tesseract is installed system-wide
tesseract --list-langs
```

---

## 📝 NPM Shortcuts

Instead of typing `node scripts/...`, you can use these shortcuts:

```bash
# Test OCR
npm run ocr:test

# Extract from a file
npm run ocr:extract -- image.png

# Batch process
npm run ocr:batch -- ./images
```

Note: The `--` is needed to pass arguments to npm scripts.

---

## 🌍 Language Codes Reference

| Code | Language |
|------|----------|
| `eng` | English (default) |
| `spa` | Spanish |
| `fra` | French |
| `deu` | German |
| `ita` | Italian |
| `por` | Portuguese |
| `rus` | Russian |
| `ara` | Arabic |
| `chi_sim` | Chinese (Simplified) |
| `chi_tra` | Chinese (Traditional) |
| `jpn` | Japanese |
| `kor` | Korean |

---

## 🎯 Quick Command Reference

```bash
# Test setup
node scripts/ocr-test.js

# Single file extraction
node scripts/ocr-extract.js <file>

# Save to file
node scripts/ocr-extract.js <file> --output <output.txt>

# Different language
node scripts/ocr-extract.js <file> --lang <code>

# JSON output
node scripts/ocr-extract.js <file> --json

# Batch processing
node scripts/ocr-batch.js <input-dir> [output-dir]

# Interactive menu
node scripts/ocr-cli.js

# Get help
node scripts/ocr-extract.js --help
```

---

## ✅ What You've Accomplished

After following this guide, you now have:

1. ✅ OCR libraries installed and working
2. ✅ Command-line tools to extract text from images
3. ✅ Batch processing for multiple files
4. ✅ Multi-language support
5. ✅ JSON output for programmatic use
6. ✅ Interactive menu for easy use

---

## 📚 Next Steps

- Read `OCR-SETUP.md` for more detailed information
- Check `OCR-QUICKSTART.md` for a quick reference card
- Try extracting text from your own images
- Use OCR with your legal document analysis workflow

---

## 🆘 Need Help?

If something isn't working:

1. Run `node scripts/ocr-test.js` to check your setup
2. Make sure your image files exist and are readable
3. Try with a different image to rule out image quality issues
4. Check that you're using the right language code
5. Read the error messages carefully - they often tell you what's wrong

**Happy text extracting! 🎉**
