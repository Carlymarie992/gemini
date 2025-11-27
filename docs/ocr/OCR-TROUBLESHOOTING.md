# 🔧 OCR Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "require is not defined" Error

**Error Message:**
```
ReferenceError: require is not defined in ES module scope
```

**Cause:** The project uses ES modules (type: "module" in package.json)

**Solution:**
✅ All scripts have been updated to use ES6 imports. Make sure you're using the latest version:
```bash
git pull origin main
```

---

### Issue 2: "Module not found: tesseract.js"

**Error Message:**
```
Error: Cannot find module 'tesseract.js'
```

**Solution:**
```bash
# Install OCR dependencies
npm install tesseract.js pdf-parse sharp

# Or install all dependencies
npm install
```

---

### Issue 3: "Permission denied" when running scripts

**Error Message:**
```
bash: scripts/ocr-extract.js: Permission denied
```

**Solution (Mac/Linux):**
```bash
chmod +x scripts/*.sh scripts/*.js
```

**Alternative:** Always use `node` command:
```bash
node scripts/ocr-extract.js image.png
```

---

### Issue 4: OCR Results Are Inaccurate

**Problem:** Extracted text has many errors or is gibberish

**Solutions:**

1. **Use higher quality images:**
   - Minimum 300 DPI for scanned documents
   - Clear, high-contrast images
   - Dark text on light background

2. **Try preprocessing the image:**
   - Straighten crooked images
   - Increase contrast
   - Remove noise/artifacts

3. **Use the correct language:**
   ```bash
   # Wrong language
   node scripts/ocr-extract.js spanish.jpg --lang eng  # ❌
   
   # Correct language
   node scripts/ocr-extract.js spanish.jpg --lang spa  # ✅
   ```

4. **Check the confidence score:**
   - Below 50%: Image quality is poor
   - 50-70%: Acceptable, but verify results
   - 70-90%: Good accuracy
   - Above 90%: Excellent accuracy

---

### Issue 5: "File not found" Error

**Error Message:**
```
❌ Error: File not found: /path/to/image.png
```

**Solutions:**

1. **Check the file path:**
   ```bash
   # Use absolute path
   node scripts/ocr-extract.js /full/path/to/image.png
   
   # Or relative path from current directory
   node scripts/ocr-extract.js ./images/image.png
   ```

2. **Verify file exists:**
   ```bash
   ls -la image.png
   ```

3. **Check file permissions:**
   ```bash
   # Make file readable
   chmod 644 image.png
   ```

---

### Issue 6: Tesseract Not Installing

**Problem:** Setup script fails to install Tesseract

**Solutions:**

**For Mac:**
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Tesseract
brew install tesseract
```

**For Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y tesseract-ocr
```

**For Windows:**
1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install Tesseract
3. Add Tesseract to your PATH

**Note:** Tesseract.js (Node.js package) works without system Tesseract, but having both gives better performance.

---

### Issue 7: Slow Processing Speed

**Problem:** OCR takes too long to process images

**Solutions:**

1. **Reduce image size:**
   ```bash
   # Resize large images before OCR (using ImageMagick)
   convert large-image.jpg -resize 2000x2000 smaller-image.jpg
   node scripts/ocr-extract.js smaller-image.jpg
   ```

2. **Use batch processing wisely:**
   - Don't process hundreds of files at once
   - Process in smaller batches (10-20 files)

3. **Check system resources:**
   - Close other applications
   - Ensure sufficient RAM available

---

### Issue 8: "Cannot read property 'text' of undefined"

**Problem:** Script crashes when processing certain files

**Possible Causes:**
1. Corrupted image file
2. Unsupported file format
3. Empty/blank image

**Solutions:**

1. **Verify image format:**
   ```bash
   file image.png
   ```
   Should show: PNG image data, JPEG image data, etc.

2. **Try a different image:**
   Test with a known good image first

3. **Check file size:**
   ```bash
   ls -lh image.png
   ```
   Very small files (< 1KB) might be corrupted

---

### Issue 9: Different Languages Not Working

**Problem:** Non-English text not recognized

**Solution:**

The language data is downloaded automatically by Tesseract.js on first use. Make sure you:

1. Have internet connection during first run
2. Use correct language code:
   ```bash
   node scripts/ocr-extract.js doc.jpg --lang spa  # Spanish
   node scripts/ocr-extract.js doc.jpg --lang fra  # French
   node scripts/ocr-extract.js doc.jpg --lang deu  # German
   ```

3. Check available languages:
   ```bash
   # If system Tesseract is installed
   tesseract --list-langs
   ```

---

### Issue 10: Batch Processing Stops Midway

**Problem:** Batch processing stops before completing all files

**Solutions:**

1. **Check for problematic files:**
   - Look at the last file processed before it stopped
   - Try processing that file individually

2. **Increase Node.js memory (for large batches):**
   ```bash
   node --max-old-space-size=4096 scripts/ocr-batch.js ./images
   ```

3. **Process in smaller batches:**
   ```bash
   # Instead of processing 100 files at once
   node scripts/ocr-batch.js ./images1 ./output
   node scripts/ocr-batch.js ./images2 ./output
   ```

---

### Issue 11: npm Scripts Not Working

**Problem:** `npm run ocr:test` doesn't work

**Error Message:**
```
npm ERR! missing script: ocr:test
```

**Solution:**

Make sure package.json has the scripts section:
```bash
# Check if scripts exist
grep "ocr:test" package.json

# If not, reinstall
npm install
```

Or use direct node commands:
```bash
node scripts/ocr-test.js
```

---

## 🆘 Getting More Help

If none of these solutions work:

1. **Run the test script:**
   ```bash
   node scripts/ocr-test.js
   ```
   This will tell you what's wrong with your setup

2. **Check the error message carefully:**
   - Read the full error message
   - Look for file paths, line numbers
   - Google specific error messages

3. **Verify your environment:**
   ```bash
   # Check Node.js version (should be 14+)
   node --version
   
   # Check npm version
   npm --version
   
   # List installed packages
   npm list tesseract.js pdf-parse sharp
   ```

4. **Try with a simple test:**
   ```bash
   # Create a test with a known-good image
   # Try the test script first
   node scripts/ocr-test.js
   ```

5. **Check documentation:**
   - Read `OCR-SETUP.md` for detailed setup
   - Check `OCR-EXAMPLES.md` for usage examples
   - Review `OCR-QUICKSTART.md` for command reference

---

## 💡 Best Practices

To avoid issues:

1. ✅ Always test with `node scripts/ocr-test.js` first
2. ✅ Use high-quality, clear images
3. ✅ Specify the correct language with `--lang`
4. ✅ Start with small batches before processing many files
5. ✅ Keep your packages updated: `npm update`
6. ✅ Use absolute paths when in doubt
7. ✅ Check error messages and confidence scores
8. ✅ Test with known-good images first

---

## 📞 Still Need Help?

If you're still having issues:

1. Check if your issue is listed above
2. Make sure you've followed the setup instructions in `OCR-SETUP.md`
3. Try the examples in `OCR-EXAMPLES.md`
4. Open an issue on GitHub with:
   - Error message (full text)
   - Command you ran
   - Node.js version (`node --version`)
   - Operating system
   - What you've tried already

---

**Remember:** Most OCR issues are related to image quality, not the code. Always start with a clear, high-resolution image for best results!
