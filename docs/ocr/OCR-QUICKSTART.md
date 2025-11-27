# 🚀 OCR Quick Start - Terminal Commands

## Install Dependencies

```bash
npm install
```

Or manually install OCR packages:
```bash
npm install tesseract.js pdf-parse sharp
```

---

## Basic Commands

### Test Your Setup
```bash
node scripts/ocr-test.js
```

### Extract Text from One File
```bash
node scripts/ocr-extract.js image.png
```

### Save to a File
```bash
node scripts/ocr-extract.js image.png --output extracted.txt
```

### Process with Different Language
```bash
node scripts/ocr-extract.js documento.jpg --lang spa
```

### Batch Process Multiple Files
```bash
node scripts/ocr-batch.js ./images ./output
```

### Interactive CLI Menu
```bash
node scripts/ocr-cli.js
```

---

## NPM Scripts (Shortcuts)

```bash
npm run ocr:test                    # Test OCR setup
npm run ocr:extract -- image.png    # Extract from single file
npm run ocr:batch -- ./images       # Batch process directory
```

---

## Common File Formats

✅ Supported:
- PNG, JPG, JPEG
- BMP, TIFF
- PDF (image-based)

---

## Language Codes

| Code | Language |
|------|----------|
| eng | English |
| spa | Spanish |
| fra | French |
| deu | German |
| ita | Italian |
| por | Portuguese |
| rus | Russian |
| ara | Arabic |
| chi_sim | Chinese (Simplified) |
| jpn | Japanese |

---

## Troubleshooting

### Command Not Found?
```bash
# Make scripts executable (Mac/Linux)
chmod +x scripts/*.sh scripts/*.js

# Or use node directly
node scripts/ocr-extract.js
```

### Module Not Found?
```bash
npm install tesseract.js pdf-parse sharp
```

### Tesseract Not Installed?
```bash
# Mac
brew install tesseract

# Linux (Ubuntu/Debian)
sudo apt-get install tesseract-ocr

# Windows
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
```

---

## Examples

### Extract Text and Search
```bash
node scripts/ocr-extract.js doc.png --output temp.txt
grep "keyword" temp.txt
```

### Process All JPGs in a Folder
```bash
node scripts/ocr-batch.js ./photos ./text --pattern "jpg,jpeg"
```

### Get JSON Output
```bash
node scripts/ocr-extract.js image.png --json --output data.json
```

---

## Need More Help?

📖 Read the full guide: `OCR-SETUP.md`

🔧 Check the scripts: `ls scripts/`

💬 Open an issue on GitHub for support

---

**Happy text extracting! 🎉**
