# Gemini Legal AI Assistant 🔮⚖️

An AI-powered legal case management assistant that helps you quickly analyze evidence, create timelines, organize documents, and utilize exceptional OCR capabilities - all in clear, concise plain English.

## ✨ Features

### 🎯 Core Capabilities

- **Case Management** - Create, organize, and track legal cases with ease
- **Evidence Analysis** - AI-powered analysis with plain English insights
- **Timeline Generation** - Automatic timeline creation with visual representation
- **Document Organization** - Smart categorization and organization system
- **OCR Scanning** - Exceptional optical character recognition for document digitization
- **Plain English Interface** - Clear, simple, and powerful user experience

### 🔍 Key Benefits

- **Quick Analysis** - Rapidly analyze evidence and identify patterns
- **Smart Organization** - Automatically categorize and organize case materials
- **Visual Timelines** - See case progression at a glance
- **Text Extraction** - Extract text from images and scanned documents
- **Personalized Tools** - Customizable workflows for your specific needs
- **Simple & Powerful** - Easy to use without sacrificing functionality

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Carlymarie992/gemini.git
cd gemini

# Install dependencies
npm install

# Make CLI executable (if needed)
chmod +x cli.js
```

### Quick Start

```bash
# Create a new case
node cli.js case:create

# Add evidence to a case
node cli.js evidence:add <caseId>

# Add timeline events
node cli.js timeline:add <caseId>

# Scan a document with OCR
node cli.js ocr:scan <imagePath>

# View case details
node cli.js case:view <caseId>

# List all cases
node cli.js case:list
```

## 📖 Usage Guide

### Case Management

Create and manage legal cases efficiently:

```bash
# Create a new case (interactive)
node cli.js case:create

# Create a case with command line options
node cli.js case:create --title "Smith v. Jones" --type civil

# List all cases
node cli.js case:list

# Filter cases by status
node cli.js case:list --status active

# View detailed case information
node cli.js case:view CASE-1234567890-abc123
```

### Evidence Analysis

Add and analyze evidence with AI-powered insights:

```bash
# Add evidence (interactive)
node cli.js evidence:add <caseId>

# Add evidence with options
node cli.js evidence:add <caseId> \
  --type document \
  --description "Signed contract dated 2024-01-15" \
  --source "Client files"

# Analyze all evidence in a case
node cli.js evidence:analyze <caseId>
```

The evidence analyzer provides:
- Key term extraction
- Importance assessment
- Pattern detection
- Connection identification
- Plain English insights

### Timeline Management

Create visual timelines of case events:

```bash
# Add timeline event (interactive)
node cli.js timeline:add <caseId>

# Add event with options
node cli.js timeline:add <caseId> \
  --title "Initial Filing" \
  --date 2024-01-15 \
  --type filing

# View timeline
node cli.js timeline:view <caseId>

# View timeline grouped by month
node cli.js timeline:view <caseId> --group-by month

# View timeline grouped by type
node cli.js timeline:view <caseId> --group-by type
```

Timeline features:
- Chronological event ordering
- Milestone identification
- Gap analysis
- Visual grouping options
- Duration calculation

### OCR Document Scanning

Extract text from images and scanned documents:

```bash
# Scan a document
node cli.js ocr:scan path/to/document.jpg

# Scan and save to file
node cli.js ocr:scan path/to/document.jpg --output extracted-text.txt

# Scan and add to case
node cli.js ocr:scan path/to/document.jpg --case <caseId>
```

OCR capabilities:
- Supports multiple image formats (JPG, PNG, TIFF, BMP, GIF)
- High accuracy text extraction
- Confidence scoring
- Structure analysis
- Batch processing support

### Document Organization

Automatically organize and categorize documents:

```bash
# View organization system
node cli.js docs:organize

# Add document to case
node cli.js docs:add <caseId> path/to/document.pdf

# Add with custom name
node cli.js docs:add <caseId> path/to/document.pdf --name "Evidence A"

# Specify category
node cli.js docs:add <caseId> path/to/document.pdf --category pleadings
```

Document categories:
- **Pleadings** - Legal pleadings and filings
- **Evidence** - Evidence documents
- **Correspondence** - Letters and communications
- **Discovery** - Discovery materials
- **Motions** - Legal motions
- **Orders** - Court orders and decisions
- **Contracts** - Contracts and agreements
- **Reports** - Expert reports and analyses
- **Research** - Legal research and memoranda
- **Misc** - Miscellaneous documents

### Interactive Mode

Launch the interactive menu system:

```bash
node cli.js interactive
# or
node cli.js i
```

## 🛠️ Advanced Usage

### Programmatic API

Use the assistant in your own Node.js applications:

```javascript
const {
  CaseManager,
  EvidenceAnalyzer,
  TimelineGenerator,
  OCRScanner,
  DocumentOrganizer
} = require('./index');

// Initialize
const caseManager = new CaseManager();
await caseManager.initialize();

// Create a case
const newCase = await caseManager.createCase({
  title: 'My Case',
  description: 'Case description',
  type: 'civil'
});

// Add evidence
const evidence = await caseManager.addEvidence(newCase.id, {
  type: 'document',
  description: 'Key evidence description',
  source: 'Client provided'
});

// Analyze evidence
const analyzer = new EvidenceAnalyzer();
const analysis = analyzer.analyzeEvidence(evidence);
console.log(analyzer.explainAnalysis(analysis));
```

### Data Storage

All data is stored locally in JSON format:
- Cases: `./data/cases/*.json`
- Documents: `./data/documents/`

This provides:
- Complete data ownership
- Easy backup and portability
- Version control compatibility
- No external database required

## 📋 Examples

### Complete Workflow Example

```bash
# 1. Create a new case
node cli.js case:create \
  --title "Property Dispute - 123 Main St" \
  --type civil

# (Note the returned case ID)

# 2. Add evidence
node cli.js evidence:add CASE-xxx \
  --type document \
  --description "Property deed showing ownership since 2020"

node cli.js evidence:add CASE-xxx \
  --type photograph \
  --description "Photos of property boundary markers"

# 3. Build timeline
node cli.js timeline:add CASE-xxx \
  --title "Property purchased" \
  --date 2020-06-15 \
  --type incident

node cli.js timeline:add CASE-xxx \
  --title "Dispute notice received" \
  --date 2024-01-20 \
  --type filing

# 4. Scan documents
node cli.js ocr:scan deed.jpg --case CASE-xxx --output deed-text.txt
node cli.js ocr:scan contract.png --case CASE-xxx

# 5. Analyze and review
node cli.js evidence:analyze CASE-xxx
node cli.js timeline:view CASE-xxx
node cli.js case:view CASE-xxx
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
# Data directories
CASES_DIR=./data/cases
DOCS_DIR=./data/documents

# OCR settings
OCR_LANGUAGE=eng
OCR_CONFIDENCE_THRESHOLD=70

# Display options
COLOR_OUTPUT=true
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

ISC License - See LICENSE file for details

## 💡 Tips & Best Practices

1. **Regular Backups** - Backup the `./data` directory regularly
2. **Descriptive Names** - Use clear, descriptive titles for cases and evidence
3. **Tag Everything** - Use tags to create connections between evidence
4. **Timeline First** - Build your timeline early to visualize case flow
5. **High Quality Scans** - Use high-resolution images for best OCR results
6. **Analyze Often** - Run evidence analysis after adding multiple items
7. **Organize Documents** - Let the system categorize documents automatically

## 🆘 Support

For help and examples:
```bash
node cli.js help
node cli.js --help
```

## 🎯 Use Cases

Perfect for:
- **Solo Practitioners** - Manage cases without expensive software
- **Legal Research** - Organize research materials and case law
- **Paralegals** - Efficient document and evidence management
- **Case Preparation** - Quickly analyze and organize case materials
- **Document Review** - OCR and organize large document sets
- **Timeline Creation** - Visualize case chronology

---

Built with ❤️ for legal professionals who need simple, powerful tools.
