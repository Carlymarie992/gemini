# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-26

### Security
- **CRITICAL**: Fixed Angular Stored XSS vulnerability (GHSA-v4hv-rgfq-gp49)
  - Updated Angular compiler and core packages to 20.3.15
  - Patched incomplete security schema that allowed XSS attacks via SVG, MathML, and animation attributes
  - See [docs/XSS_VULNERABILITY_FIX.md](docs/XSS_VULNERABILITY_FIX.md) for details
- Added comprehensive security tests in `security.service.spec.ts`
- Enhanced SECURITY.md with vulnerability fix documentation
- npm audit reports 0 vulnerabilities after fix

### Added

#### OCR Core Features
- OCR text extraction from images (PNG, JPG, JPEG, BMP, TIFF)
- PDF text extraction support
- Multi-language support (13+ languages)
- Batch processing capabilities for multiple files
- JSON output format with statistics
- Confidence scoring for extracted text
- Progress indicators for long-running operations

#### Command-Line Tools
- `scripts/ocr-test.js` - Environment validation tool
- `scripts/ocr-extract.js` - Single file text extraction
- `scripts/ocr-batch.js` - Batch processing for directories
- `scripts/ocr-cli.js` - Interactive menu interface
- `scripts/setup-ocr.sh` - System installation helper

#### Documentation
- Comprehensive README.md for public use
- START-HERE.md - User onboarding guide
- OCR-EXAMPLES.md - Real-world command examples
- OCR-SETUP.md - Detailed setup instructions
- OCR-QUICKSTART.md - Quick reference card
- OCR-TROUBLESHOOTING.md - Common issues and solutions
- OCR-README.md - Complete OCR documentation

#### Project Infrastructure
- CONTRIBUTING.md - Contribution guidelines
- CODE_OF_CONDUCT.md - Community standards
- SECURITY.md - Security policy and reporting
- .env.example - Environment configuration template
- Pull request template
- Enhanced .gitignore for security

#### Dependencies
- tesseract.js v5.1.1 - OCR engine
- pdf-parse v1.1.4 - PDF processing
- sharp v0.33.5 - Image optimization

### Changed
- Converted all OCR scripts to ES6 module syntax
- Updated package.json with proper metadata for public distribution
- Enhanced README for professional public repository presentation
- Improved error handling across all scripts

### Security
- **CRITICAL**: Fixed Angular Stored XSS vulnerability (GHSA-v4hv-rgfq-gp49)
  - Updated Angular compiler and core packages to 20.3.15
  - Patched incomplete security schema that allowed XSS attacks via SVG, MathML, and animation attributes
  - See [docs/XSS_VULNERABILITY_FIX.md](docs/XSS_VULNERABILITY_FIX.md) for details
- Added comprehensive security tests in `security.service.spec.ts`
- Enhanced SECURITY.md with vulnerability fix documentation
- npm audit reports 0 vulnerabilities after fix
- Added .env.example to guide secure configuration
- Enhanced .gitignore to exclude sensitive files
- Added SECURITY.md with vulnerability reporting guidelines
- Removed placeholder files and build artifacts

## [Unreleased]

### Planned
- Additional language support
- Image preprocessing options
- API server mode
- Docker containerization
- Web interface

---

[1.0.0]: https://github.com/Carlymarie992/gemini/releases/tag/v1.0.0
