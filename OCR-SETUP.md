# 🔍 OCR Environment Setup Guide

## What is OCR?

**OCR (Optical Character Recognition)** is technology that converts images of text (like photos, scans, or PDFs) into actual text that you can edit, search, and use in your computer.

Think of it like this: If you take a photo of a document, your computer can "read" the text in that photo and turn it into real, editable text!

---

## 📋 Prerequisites

Before setting up OCR, make sure you have:

1. **Node.js and npm** installed
   - Check by running: `node --version` and `npm --version`
   - If not installed, download from: https://nodejs.org/

2. **A terminal/command prompt**
   - On **Mac**: Use Terminal (Applications > Utilities > Terminal)
   - On **Windows**: Use Command Prompt or PowerShell
   - On **Linux**: Use your favorite terminal

---

## 🚀 Quick Setup (3 Steps!)

### Step 1: Navigate to Your Project

Open your terminal and go to your project folder:

```bash
cd /path/to/your/gemini/project
```

### Step 2: Run the Setup Script

**For Mac/Linux:**
```bash
chmod +x scripts/setup-ocr.sh
bash scripts/setup-ocr.sh
```

**For Windows:**
1. Download Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install it (remember the installation path!)
3. Add Tesseract to your PATH
4. Then run:
```bash
npm install tesseract.js pdf-parse sharp
```

### Step 3: Test Your Setup

```bash
node scripts/ocr-test.js
```

If you see "✅ OCR Environment is working correctly!" - you're all set! 🎉

---

## 💡 How to Use OCR

### Basic Usage - Extract Text from an Image

```bash
node scripts/ocr-extract.js my-image.png
```

This will display the extracted text in your terminal!

### Save to a File

```bash
node scripts/ocr-extract.js my-image.png --output extracted.txt
```

### Process Different Languages

```bash
# Spanish
node scripts/ocr-extract.js documento.jpg --lang spa

# French  
node scripts/ocr-extract.js document.jpg --lang fra

# German
node scripts/ocr-extract.js dokument.jpg --lang deu
```

### Get JSON Output

```bash
node scripts/ocr-extract.js my-image.png --json --output data.json
```

---

## 📸 What File Types Can I Use?

The OCR tools support:
- **Images**: PNG, JPG, JPEG, BMP, TIFF
- **Documents**: PDF (with image-based text)

---

## 🔧 Common Issues & Solutions

### Issue 1: "tesseract: command not found"

**Solution:**
- **Mac**: Run `brew install tesseract`
- **Linux**: Run `sudo apt-get install tesseract-ocr`
- **Windows**: Download from the link in Step 2 above

### Issue 2: "Cannot find module 'tesseract.js'"

**Solution:**
```bash
npm install tesseract.js
```

### Issue 3: "Permission denied" when running scripts

**Solution (Mac/Linux):**
```bash
chmod +x scripts/setup-ocr.sh
chmod +x scripts/ocr-test.js
chmod +x scripts/ocr-extract.js
```

### Issue 4: OCR Not Accurate

**Tips for better results:**
- Use high-resolution images (300 DPI or higher)
- Make sure text is clear and not blurry
- Ensure good contrast (dark text on light background)
- Straighten crooked images before processing
- Use the correct language parameter (--lang)

---

## 🎯 Real-World Examples

### Example 1: Extract Text from a Legal Document

```bash
node scripts/ocr-extract.js court-filing.pdf --output case-text.txt
```

### Example 2: Process Multiple Images

```bash
# Create a simple script to process multiple files
for file in *.jpg; do
  node scripts/ocr-extract.js "$file" --output "${file%.jpg}.txt"
done
```

### Example 3: Extract and Search

```bash
# Extract text and search for specific words
node scripts/ocr-extract.js document.png --output temp.txt
grep "custody" temp.txt
```

---

## 📚 Available Languages

Common language codes you can use with `--lang`:

- `eng` - English (default)
- `spa` - Spanish
- `fra` - French
- `deu` - German
- `ita` - Italian
- `por` - Portuguese
- `rus` - Russian
- `ara` - Arabic
- `chi_sim` - Chinese (Simplified)
- `jpn` - Japanese

To see all available languages on your system:
```bash
tesseract --list-langs
```

---

## 🛠️ Advanced Usage

### Batch Processing Multiple Files

Create a file named `batch-ocr.sh`:

```bash
#!/bin/bash
for file in ./images/*.{jpg,png}; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    node scripts/ocr-extract.js "$file" --output "./output/$(basename "$file" .jpg).txt"
  fi
done
```

Make it executable and run:
```bash
chmod +x batch-ocr.sh
./batch-ocr.sh
```

### Combining with Other Tools

```bash
# Extract text and count words
node scripts/ocr-extract.js doc.png --output - | wc -w

# Extract and find specific patterns
node scripts/ocr-extract.js doc.png --output - | grep -i "exhibit"
```

---

## 🎓 Understanding the Output

When you run OCR, you'll see:

```
🔍 Processing: my-image.png
   Language: eng

⏳ Progress: 100%
✅ OCR Complete!

📝 Extracted Text:
──────────────────────────────────────────────────
[Your extracted text appears here]
──────────────────────────────────────────────────

📊 Statistics:
   Confidence: 87.45%
   Words: 256
   Lines: 34
```

- **Confidence**: How sure the OCR is about the accuracy (higher is better)
- **Words**: Total number of words detected
- **Lines**: Total number of text lines found

---

## 💻 Integrating OCR into Your Code

You can also use OCR in your JavaScript/TypeScript files:

```javascript
const { createWorker } = require('tesseract.js');

async function extractText(imagePath) {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(imagePath);
  await worker.terminate();
  return text;
}

// Use it
extractText('./my-image.png').then(text => {
  console.log('Extracted:', text);
});
```

---

## 🆘 Getting Help

If you're stuck:

1. **Check this guide** - Most common issues are covered above
2. **Run the test** - `node scripts/ocr-test.js` to verify setup
3. **Check file paths** - Make sure your image file exists and path is correct
4. **Try a different image** - Some images are harder to read than others

---

## 📞 Resources

- **Tesseract OCR**: https://github.com/tesseract-ocr/tesseract
- **Tesseract.js**: https://tesseract.projectnaptha.com/
- **Node.js**: https://nodejs.org/

---

## ✨ Tips for Success

1. **Start Simple**: Test with a clear, printed document first
2. **Use Good Images**: High resolution, good contrast, no blur
3. **Right Language**: Always specify the correct language
4. **Practice**: Try different images to see what works best
5. **Save Your Output**: Use `--output` to keep extracted text

---

**Remember**: OCR is a tool to help you, not replace you. Always review the extracted text for accuracy!

Need more help? Check out the examples in the `scripts/` folder or open an issue on GitHub.

Happy text extracting! 🎉
