#!/bin/bash

# OCR Environment Setup Script
# This script installs Tesseract OCR and required dependencies

echo "🔧 Setting up OCR Environment..."
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "📦 Detected Linux - Installing Tesseract OCR..."
    
    # Check if running on Debian/Ubuntu
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y tesseract-ocr
        sudo apt-get install -y libtesseract-dev
        
        # Install additional language packs
        echo "📚 Installing language packs..."
        sudo apt-get install -y tesseract-ocr-eng  # English
        
        # Optional: Install more languages
        # sudo apt-get install -y tesseract-ocr-spa  # Spanish
        # sudo apt-get install -y tesseract-ocr-fra  # French
        
    # Check if running on Fedora/RHEL/CentOS
    elif command -v yum &> /dev/null; then
        sudo yum install -y tesseract
        sudo yum install -y tesseract-devel
    fi
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS - Installing Tesseract OCR..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    brew install tesseract
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo "🪟 Detected Windows"
    echo "Please download and install Tesseract from:"
    echo "   https://github.com/UB-Mannheim/tesseract/wiki"
    echo ""
    echo "After installation, add Tesseract to your PATH"
    exit 1
fi

# Verify installation
echo ""
echo "✅ Verifying Tesseract installation..."
if command -v tesseract &> /dev/null; then
    tesseract --version
    echo ""
    echo "✨ Tesseract OCR installed successfully!"
    
    # Check available languages
    echo ""
    echo "📋 Available OCR languages:"
    tesseract --list-langs
else
    echo "❌ Tesseract installation failed. Please install manually."
    exit 1
fi

# Install Node.js dependencies
echo ""
echo "📦 Installing Node.js OCR packages..."
cd "$(dirname "$0")/.." || exit

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

# Install tesseract.js for Node.js
npm install --save tesseract.js

# Install pdf-parse for PDF support
npm install --save pdf-parse

# Install sharp for image processing
npm install --save sharp

echo ""
echo "✅ OCR environment setup complete!"
echo ""
echo "🚀 Quick Start Commands:"
echo "   node scripts/ocr-test.js              # Test OCR with sample image"
echo "   node scripts/ocr-extract.js <file>    # Extract text from image/PDF"
echo ""
echo "📖 See OCR-SETUP.md for detailed usage instructions"
