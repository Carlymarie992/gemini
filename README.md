<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Gemini - Legal AI Assistant & OCR Tools

> A comprehensive platform combining AI-powered legal assistance, domestic abuse education, OCR tools, and specialized Rule 60(b) motion generation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg)](https://nodejs.org/)
[![Security](https://img.shields.io/badge/security-enhanced-blue.svg)](docs/SECURITY_GUIDE.md)

## 🔒 Security Notice

**Security Status**: ✅ **All vulnerabilities resolved!**

This application has migrated from Angular CLI build system to **Vite** with the Analog.js plugin. The Angular compiler is now only used during development/build time (as a dev dependency), resolving the previous XSS vulnerability (GHSA-v4hv-rgfq-gp49).

**Current Security Measures**:
- ✅ Zero npm audit vulnerabilities
- ✅ Angular compiler (20.3.15+) isolated to dev dependencies
- ✅ Vite build system for production builds
- ✅ Comprehensive input sanitization
- ✅ XSS protection via SecurityService
- ✅ Prompt injection detection
- ✅ Sensitive data redaction

See [docs/SECURITY_GUIDE.md](docs/SECURITY_GUIDE.md) for detailed security documentation.

## 🚨 Project Antigravity: Advanced Legal Assistance

**NEW**: Specialized AI assistance for time-barred litigation in North Dakota's East Central Judicial District.

### Key Features

- **Rule 60(b)(6) Motions**: Extraordinary circumstances analysis (Kinsella v. Kinsella)
- **Rule 60(b)(4) Motions**: Void judgment arguments (Ghost Address defects)
- **Coercive Control Analysis**: N.D.C.C. § 14-07.1 compliance
- **Independent Actions**: Fraud on the court complaints
- **Constitutional Auditor AI**: Specialized legal analysis persona
- **Secure by Design**: Multiple layers of input validation and sanitization

### Complete Documentation Suite

📚 **Essential Reading**:
- 📖 **[Project Antigravity Guide](docs/PROJECT_ANTIGRAVITY.md)** - Complete usage and legal framework
- 🛡️ **[Security Implementation Guide](docs/SECURITY_GUIDE.md)** - Comprehensive security documentation
- ✅ **[Security Checklist](docs/SECURITY_CHECKLIST.md)** - Implementation status and best practices
- 💼 **[Usage Examples](docs/USAGE_EXAMPLES.md)** - Real-world scenarios and step-by-step guides

## 📋 Table of Contents

- [Repository Sections](#repository-sections)
- [Quick Start](#quick-start)
- [Section 1: OCR Tools](#section-1-ocr-tools)
- [Section 2: Knowledge Base](#section-2-knowledge-base)
- [Section 3: Angular Web Application](#section-3-angular-web-application)
- [Section 4: AI System Instructions](#section-4-ai-system-instructions)
- [Contributing](#contributing)
- [License](#license)

---

## 📂 Repository Sections

This repository is organized into **five main sections**, all under the same branch:

| Section | Directory | Description |
|---------|-----------|-------------|
| 🔍 **OCR Tools** | `scripts/`, `docs/ocr/` | Command-line OCR utilities for text extraction |
| 📚 **Knowledge Base** | `knowledge_base/` | Educational resources on domestic abuse dynamics |
| 🌐 **Web Application** | `src/` | Angular-based legal assistance web app |
| 🤖 **AI Instructions** | `system_instructions.md` | AI system configuration and training |
| ⚖️ **Project Antigravity** | `src/services/antigravity.service.ts`, `docs/PROJECT_ANTIGRAVITY.md` | Specialized Rule 60(b) motion generation |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/Carlymarie992/gemini.git
cd gemini
npm install
```

---

# Section 1: OCR Tools

> 🔍 Powerful Optical Character Recognition tools powered by Tesseract.js

### Overview

Command-line tools for extracting text from images and PDFs. Supports multiple languages and batch processing.

### Quick Usage

```bash
# Test OCR setup
node scripts/ocr-test.js

# Extract text from an image
node scripts/ocr-extract.js document.png

# Batch process multiple files
node scripts/ocr-batch.js ./images ./output

# Interactive CLI menu
node scripts/ocr-cli.js
```

### NPM Script Shortcuts

```bash
npm run ocr:test           # Test OCR setup
npm run ocr:extract        # Extract text from a file
npm run ocr:batch          # Batch process multiple files
```

### Features

- **Multi-format Support**: PNG, JPG, JPEG, BMP, TIFF, PDF
- **Multi-language**: 13+ languages including English, Spanish, French, German
- **Batch Processing**: Process entire directories at once
- **JSON Output**: Structured data output for programmatic use
- **Confidence Scoring**: Accuracy metrics for extracted text

### Supported Languages

| Language | Code | Language | Code |
|----------|------|----------|------|
| English | eng | Portuguese | por |
| Spanish | spa | Russian | rus |
| French | fra | Arabic | ara |
| German | deu | Chinese | chi_sim |
| Italian | ita | Japanese | jpn |

### OCR Documentation

📖 Detailed documentation available in `docs/ocr/`:

- **[START-HERE.md](docs/ocr/START-HERE.md)** - New user onboarding guide
- **[OCR-EXAMPLES.md](docs/ocr/OCR-EXAMPLES.md)** - Real-world command examples
- **[OCR-SETUP.md](docs/ocr/OCR-SETUP.md)** - Detailed setup instructions
- **[OCR-QUICKSTART.md](docs/ocr/OCR-QUICKSTART.md)** - Quick reference card
- **[OCR-TROUBLESHOOTING.md](docs/ocr/OCR-TROUBLESHOOTING.md)** - Common issues and solutions

---

# Section 2: Knowledge Base

> 📚 Educational resources on domestic abuse dynamics for legal contexts

### Overview

Comprehensive documentation designed to help understand and articulate complex patterns of domestic abuse, coercive control, and legal abuse, particularly in family court and child custody proceedings.

### Topics Covered

| Document | Description |
|----------|-------------|
| **[coercive_control.md](knowledge_base/coercive_control.md)** | Understanding patterns of domination and control |
| **[darvo.md](knowledge_base/darvo.md)** | Deny, Attack, Reverse Victim and Offender tactics |
| **[economic_abuse.md](knowledge_base/economic_abuse.md)** | Financial control as a tool of abuse |
| **[stalking_harassment.md](knowledge_base/stalking_harassment.md)** | Surveillance, monitoring, and unwanted contact |
| **[legal_abuse_concealment.md](knowledge_base/legal_abuse_concealment.md)** | How courts can be weaponized |
| **[communicating_to_judges.md](knowledge_base/communicating_to_judges.md)** | Frameworks for legal communication |
| **[example_scenarios.md](knowledge_base/example_scenarios.md)** | Real-world pattern examples |
| **[quick_reference.md](knowledge_base/quick_reference.md)** | Quick lookup guide |

### Key Principles

- Pattern recognition over isolated incidents
- Power and control, not conflict
- Trauma-informed understanding
- Center children's safety
- Believe patterns, not performances

---

# Section 3: Angular Web Application

> 🌐 Web-based legal assistance interface built with Angular and Vite

### Overview

An Angular-based web application providing tools for legal document management, case organization, and AI-assisted research. Built using **Vite** for fast development and optimized production builds.

### Technology Stack

- **Framework**: Angular 20.3.x
- **Build Tool**: Vite 6.x with @analogjs/vite-plugin-angular
- **Language**: TypeScript 5.9.x
- **Styling**: Tailwind CSS

### Directory Structure

```
src/
├── app.component.ts          # Main application component
├── components/
│   ├── chat-interface/       # AI chat functionality
│   ├── exhibit-manager/      # Evidence organization
│   ├── file-upload/          # Document upload handling
│   ├── legal-document-generator/  # Document creation
│   └── legal-research/       # Research tools
├── models/
│   └── case.model.ts         # Data models
└── services/
    ├── case.service.ts       # Case management
    └── gemini.service.ts     # AI integration
```

### Running the Web App

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

# Section 4: AI System Instructions

> 🤖 Configuration for AI-powered assistance

### Overview

The `system_instructions.md` file contains comprehensive instructions for training an AI assistant to understand and articulate domestic abuse dynamics.

### Core Knowledge Areas

1. **Economic Abuse** - Financial control patterns
2. **Stalking and Harassment** - Surveillance and monitoring
3. **DARVO** - Victim-offender role reversal tactics
4. **Coercive Control** - Systematic domination patterns
5. **Legal Abuse** - Court system weaponization
6. **Judicial Communication** - Effective framing for court

### AI Training Approach

- Pattern recognition over incidents
- Trauma-informed understanding
- Safety-first principles
- Child-centered focus

---

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

- OCR powered by [Tesseract.js](https://tesseract.projectnaptha.com/)
- AI integration with [Google Generative AI](https://ai.google.dev/)
- Built with [Angular](https://angular.io/) and [Vite](https://vite.dev/)
- Angular integration via [Analog.js](https://analogjs.org/)

## 📞 Support

- 📖 Check the relevant section documentation
- 🐛 [Report bugs](https://github.com/Carlymarie992/gemini/issues)
- 💡 [Request features](https://github.com/Carlymarie992/gemini/issues)
- ❓ [Ask questions](https://github.com/Carlymarie992/gemini/issues)

---

<div align="center">
Made with ❤️ for the open source community
</div>
