#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const CaseManager = require('./src/core/CaseManager');
const EvidenceAnalyzer = require('./src/modules/EvidenceAnalyzer');
const TimelineGenerator = require('./src/modules/TimelineGenerator');
const OCRScanner = require('./src/modules/OCRScanner');
const DocumentOrganizer = require('./src/modules/DocumentOrganizer');
const {
  printHeader,
  printSuccess,
  printError,
  printInfo,
  printWarning,
  createTable,
  formatOutput
} = require('./src/utils/helpers');

const program = new Command();
const caseManager = new CaseManager();
const evidenceAnalyzer = new EvidenceAnalyzer();
const timelineGenerator = new TimelineGenerator();
const ocrScanner = new OCRScanner();
const documentOrganizer = new DocumentOrganizer();

// Initialize
async function initialize() {
  await caseManager.initialize();
  await documentOrganizer.initialize();
}

program
  .name('legal-ai')
  .description('AI-powered legal case management assistant')
  .version('1.0.0');

// Case management commands
program
  .command('case:create')
  .description('Create a new legal case')
  .option('-t, --title <title>', 'Case title')
  .option('-d, --description <description>', 'Case description')
  .option('--type <type>', 'Case type')
  .action(async (options) => {
    await initialize();
    
    try {
      let caseData = {};
      
      if (options.title) {
        caseData.title = options.title;
        caseData.description = options.description || '';
        caseData.type = options.type || 'general';
      } else {
        // Interactive mode
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Case title:',
            validate: (input) => input.length > 0 || 'Title is required'
          },
          {
            type: 'input',
            name: 'description',
            message: 'Case description:'
          },
          {
            type: 'list',
            name: 'type',
            message: 'Case type:',
            choices: ['civil', 'criminal', 'family', 'corporate', 'general']
          },
          {
            type: 'input',
            name: 'parties',
            message: 'Parties involved (comma-separated):'
          }
        ]);
        
        caseData = {
          ...answers,
          parties: answers.parties ? answers.parties.split(',').map(p => p.trim()) : []
        };
      }
      
      const newCase = await caseManager.createCase(caseData);
      printSuccess(`Case created successfully!`);
      console.log(`\nCase ID: ${formatOutput(newCase.id, 'highlight')}`);
      console.log(`Title: ${newCase.title}`);
      console.log(`Status: ${newCase.status}`);
    } catch (error) {
      printError(`Failed to create case: ${error.message}`);
    }
  });

program
  .command('case:list')
  .description('List all cases')
  .option('--status <status>', 'Filter by status')
  .option('--type <type>', 'Filter by type')
  .action(async (options) => {
    await initialize();
    
    try {
      const cases = caseManager.listCases({
        status: options.status,
        type: options.type
      });
      
      if (cases.length === 0) {
        printInfo('No cases found. Create a new case with: legal-ai case:create');
        return;
      }
      
      printHeader('Cases');
      
      const rows = cases.map(c => [
        c.id.substring(0, 20) + '...',
        c.title.substring(0, 30),
        c.status,
        c.type,
        c.evidence.length,
        c.documents.length,
        new Date(c.updatedAt).toLocaleDateString()
      ]);
      
      const table = createTable(
        ['ID', 'Title', 'Status', 'Type', 'Evidence', 'Docs', 'Updated'],
        rows
      );
      
      console.log(table);
      printInfo(`Total cases: ${cases.length}`);
    } catch (error) {
      printError(`Failed to list cases: ${error.message}`);
    }
  });

program
  .command('case:view <caseId>')
  .description('View case details')
  .action(async (caseId) => {
    await initialize();
    
    try {
      const summary = caseManager.getCaseSummary(caseId);
      printHeader('Case Details');
      console.log(summary);
    } catch (error) {
      printError(`Failed to view case: ${error.message}`);
    }
  });

// Evidence commands
program
  .command('evidence:add <caseId>')
  .description('Add evidence to a case')
  .option('-t, --type <type>', 'Evidence type')
  .option('-d, --description <description>', 'Evidence description')
  .option('-s, --source <source>', 'Evidence source')
  .action(async (caseId, options) => {
    await initialize();
    
    try {
      let evidenceData = {};
      
      if (options.description) {
        evidenceData = {
          type: options.type || 'document',
          description: options.description,
          source: options.source || ''
        };
      } else {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'type',
            message: 'Evidence type:',
            choices: ['document', 'testimony', 'physical', 'digital', 'photograph']
          },
          {
            type: 'input',
            name: 'description',
            message: 'Description:',
            validate: (input) => input.length > 0 || 'Description is required'
          },
          {
            type: 'input',
            name: 'source',
            message: 'Source:'
          },
          {
            type: 'input',
            name: 'tags',
            message: 'Tags (comma-separated):'
          }
        ]);
        
        evidenceData = {
          ...answers,
          tags: answers.tags ? answers.tags.split(',').map(t => t.trim()) : []
        };
      }
      
      const evidence = await caseManager.addEvidence(caseId, evidenceData);
      printSuccess('Evidence added successfully!');
      
      // Analyze the evidence
      const analysis = evidenceAnalyzer.analyzeEvidence(evidence);
      console.log('\n' + evidenceAnalyzer.explainAnalysis(analysis));
    } catch (error) {
      printError(`Failed to add evidence: ${error.message}`);
    }
  });

program
  .command('evidence:analyze <caseId>')
  .description('Analyze all evidence in a case')
  .action(async (caseId) => {
    await initialize();
    
    try {
      const caseObj = caseManager.getCase(caseId);
      if (!caseObj) {
        printError('Case not found');
        return;
      }
      
      if (caseObj.evidence.length === 0) {
        printInfo('No evidence to analyze');
        return;
      }
      
      printHeader('Evidence Analysis');
      
      const analysis = evidenceAnalyzer.analyzeEvidenceCollection(caseObj.evidence);
      console.log(evidenceAnalyzer.explainAnalysis(analysis));
    } catch (error) {
      printError(`Failed to analyze evidence: ${error.message}`);
    }
  });

// Timeline commands
program
  .command('timeline:add <caseId>')
  .description('Add event to case timeline')
  .option('-t, --title <title>', 'Event title')
  .option('-d, --date <date>', 'Event date')
  .option('--type <type>', 'Event type')
  .action(async (caseId, options) => {
    await initialize();
    
    try {
      let eventData = {};
      
      if (options.title) {
        eventData = {
          title: options.title,
          date: options.date || new Date().toISOString(),
          type: options.type || 'general'
        };
      } else {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Event title:',
            validate: (input) => input.length > 0 || 'Title is required'
          },
          {
            type: 'input',
            name: 'date',
            message: 'Event date (YYYY-MM-DD):',
            default: new Date().toISOString().split('T')[0]
          },
          {
            type: 'list',
            name: 'type',
            message: 'Event type:',
            choices: ['incident', 'filing', 'hearing', 'discovery', 'motion', 'settlement', 'verdict', 'general']
          },
          {
            type: 'input',
            name: 'description',
            message: 'Description:'
          },
          {
            type: 'list',
            name: 'importance',
            message: 'Importance:',
            choices: ['low', 'medium', 'high']
          }
        ]);
        
        eventData = answers;
      }
      
      await caseManager.addTimelineEvent(caseId, eventData);
      printSuccess('Timeline event added successfully!');
    } catch (error) {
      printError(`Failed to add timeline event: ${error.message}`);
    }
  });

program
  .command('timeline:view <caseId>')
  .description('View case timeline')
  .option('--group-by <grouping>', 'Group by: month, type, or chronological')
  .action(async (caseId, options) => {
    await initialize();
    
    try {
      const caseObj = caseManager.getCase(caseId);
      if (!caseObj) {
        printError('Case not found');
        return;
      }
      
      if (caseObj.timeline.length === 0) {
        printInfo('No timeline events. Add events with: legal-ai timeline:add');
        return;
      }
      
      const timeline = timelineGenerator.generateTimeline(caseObj.timeline);
      const formatted = timelineGenerator.formatTimeline(timeline, {
        groupBy: options.groupBy
      });
      
      console.log(formatted);
      
      // Show insights
      const insights = timelineGenerator.generateInsights(timeline);
      if (insights.length > 0) {
        console.log('\n💡 Insights:\n');
        insights.forEach(insight => console.log(`• ${insight}`));
      }
    } catch (error) {
      printError(`Failed to view timeline: ${error.message}`);
    }
  });

// OCR commands
program
  .command('ocr:scan <imagePath>')
  .description('Scan document using OCR')
  .option('-o, --output <path>', 'Output file path')
  .option('--case <caseId>', 'Associate with case')
  .action(async (imagePath, options) => {
    await initialize();
    
    try {
      printInfo('Starting OCR scan...');
      
      const result = await ocrScanner.quickScan(imagePath);
      
      printSuccess('OCR scan completed!');
      console.log('\n' + ocrScanner.explainResult(result));
      
      if (options.output) {
        const fs = require('fs').promises;
        await fs.writeFile(options.output, result.fullText, 'utf8');
        printSuccess(`Text saved to: ${options.output}`);
      }
      
      if (options.case) {
        const document = {
          name: require('path').basename(imagePath),
          path: imagePath,
          type: 'scanned',
          description: result.preview
        };
        await caseManager.addDocument(options.case, document);
        printSuccess('Document added to case');
      }
      
      console.log('\n📄 Extracted Text Preview:');
      console.log('─'.repeat(50));
      console.log(result.preview);
    } catch (error) {
      printError(`OCR scan failed: ${error.message}`);
    }
  });

// Document commands
program
  .command('docs:organize')
  .description('View document organization system')
  .action(async () => {
    await initialize();
    
    try {
      console.log(documentOrganizer.explainOrganization());
      
      const stats = await documentOrganizer.getStatistics();
      
      if (stats.totalDocuments > 0) {
        console.log('\n' + await documentOrganizer.generateReport());
      }
    } catch (error) {
      printError(`Failed to show document organization: ${error.message}`);
    }
  });

program
  .command('docs:add <caseId> <docPath>')
  .description('Add document to case')
  .option('-n, --name <name>', 'Document name')
  .option('-c, --category <category>', 'Document category')
  .action(async (caseId, docPath, options) => {
    await initialize();
    
    try {
      const fs = require('fs');
      const path = require('path');
      
      if (!fs.existsSync(docPath)) {
        printError('Document file not found');
        return;
      }
      
      const stats = fs.statSync(docPath);
      const document = {
        name: options.name || path.basename(docPath),
        path: docPath,
        type: path.extname(docPath).substring(1),
        size: stats.size
      };
      
      // Organize document
      const organized = await documentOrganizer.organizeDocument(
        document,
        options.category
      );
      
      // Add to case
      document.path = organized.path;
      await caseManager.addDocument(caseId, document);
      
      printSuccess('Document added successfully!');
      console.log(`Category: ${organized.category}`);
      console.log(`Path: ${organized.path}`);
    } catch (error) {
      printError(`Failed to add document: ${error.message}`);
    }
  });

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Launch interactive mode')
  .action(async () => {
    await initialize();
    
    printHeader('Legal AI Assistant - Interactive Mode');
    console.log('Welcome! This AI assistant helps with legal case management.\n');
    
    const mainMenu = async () => {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '📁 Manage Cases', value: 'cases' },
            { name: '📄 Work with Evidence', value: 'evidence' },
            { name: '📅 View Timeline', value: 'timeline' },
            { name: '🔍 OCR Document Scan', value: 'ocr' },
            { name: '📚 Organize Documents', value: 'docs' },
            { name: '❌ Exit', value: 'exit' }
          ]
        }
      ]);
      
      if (action === 'exit') {
        printSuccess('Goodbye!');
        return;
      }
      
      // Handle different menu options
      console.log(`\n${action} feature - Use command line options for full functionality`);
      printInfo('Run "legal-ai --help" to see all available commands');
      
      const { continue: cont } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Return to main menu?',
          default: true
        }
      ]);
      
      if (cont) {
        await mainMenu();
      }
    };
    
    await mainMenu();
  });

// Help command
program
  .command('help')
  .description('Show detailed help and examples')
  .action(() => {
    printHeader('Legal AI Assistant - Help');
    
    console.log('📖 Quick Start Guide\n');
    
    console.log('1. Create a new case:');
    console.log('   legal-ai case:create\n');
    
    console.log('2. Add evidence:');
    console.log('   legal-ai evidence:add <caseId>\n');
    
    console.log('3. Create timeline:');
    console.log('   legal-ai timeline:add <caseId>\n');
    
    console.log('4. Scan documents with OCR:');
    console.log('   legal-ai ocr:scan <imagePath>\n');
    
    console.log('5. View case:');
    console.log('   legal-ai case:view <caseId>\n');
    
    console.log('\n💡 Features:\n');
    console.log('• Evidence Analysis - AI-powered insights');
    console.log('• Timeline Generation - Visual case progression');
    console.log('• Document Organization - Smart categorization');
    console.log('• OCR Scanning - Extract text from images');
    console.log('• Plain English - Clear, simple language\n');
    
    console.log('For more details, run: legal-ai --help');
  });

// Parse arguments
program.parse(process.argv);

// If no command specified, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
