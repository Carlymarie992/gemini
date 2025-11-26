/**
 * Gemini Legal AI Assistant
 * Main entry point for the application
 */

const CaseManager = require('./src/core/CaseManager');
const EvidenceAnalyzer = require('./src/modules/EvidenceAnalyzer');
const TimelineGenerator = require('./src/modules/TimelineGenerator');
const OCRScanner = require('./src/modules/OCRScanner');
const DocumentOrganizer = require('./src/modules/DocumentOrganizer');

module.exports = {
  CaseManager,
  EvidenceAnalyzer,
  TimelineGenerator,
  OCRScanner,
  DocumentOrganizer
};
