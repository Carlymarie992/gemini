/**
 * Test runner for Legal AI Assistant
 * Basic tests to verify core functionality
 */

const CaseManager = require('../src/core/CaseManager');
const EvidenceAnalyzer = require('../src/modules/EvidenceAnalyzer');
const TimelineGenerator = require('../src/modules/TimelineGenerator');
const DocumentOrganizer = require('../src/modules/DocumentOrganizer');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`✗ ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('🧪 Running Legal AI Assistant Tests\n');
  console.log('═'.repeat(50));
  
  // Test Case Manager
  console.log('\n📁 Testing Case Manager...\n');
  
  const caseManager = new CaseManager('./data/test-cases');
  await caseManager.initialize();
  
  const testCase = await caseManager.createCase({
    title: 'Test Case',
    description: 'Test case description',
    type: 'civil'
  });
  
  assert(testCase.id, 'Case ID is generated');
  assert(testCase.title === 'Test Case', 'Case title is set correctly');
  assert(testCase.evidence.length === 0, 'New case has no evidence');
  assert(testCase.timeline.length === 0, 'New case has no timeline events');
  
  const cases = caseManager.listCases();
  assert(cases.length >= 1, 'Case list contains created case');
  
  const retrievedCase = caseManager.getCase(testCase.id);
  assert(retrievedCase !== null, 'Case can be retrieved by ID');
  
  // Test adding evidence
  const evidence = await caseManager.addEvidence(testCase.id, {
    type: 'document',
    description: 'Test evidence document',
    source: 'Test source'
  });
  
  assert(evidence.id, 'Evidence ID is generated');
  assert(evidence.type === 'document', 'Evidence type is set');
  
  // Test adding timeline event
  const event = await caseManager.addTimelineEvent(testCase.id, {
    title: 'Test Event',
    date: '2024-01-15',
    type: 'filing'
  });
  
  assert(event.id, 'Timeline event ID is generated');
  assert(event.title === 'Test Event', 'Event title is set');
  
  // Test Evidence Analyzer
  console.log('\n🔍 Testing Evidence Analyzer...\n');
  
  const analyzer = new EvidenceAnalyzer();
  const analysis = analyzer.analyzeEvidence({
    type: 'document',
    description: 'This is a critical document containing important evidence about the incident',
    source: 'Client files'
  });
  
  assert(analysis.summary, 'Evidence analysis generates summary');
  assert(analysis.insights.length > 0, 'Evidence analysis provides insights');
  assert(analysis.importance, 'Evidence importance is determined');
  assert(analysis.keyTerms.length > 0, 'Key terms are extracted');
  
  const collectionAnalysis = analyzer.analyzeEvidenceCollection([
    { type: 'document', description: 'Document 1 about the contract' },
    { type: 'testimony', description: 'Witness testimony about the incident' }
  ]);
  
  assert(collectionAnalysis.summary, 'Collection analysis generates summary');
  assert(collectionAnalysis.totalItems === 2, 'Collection analysis counts items');
  
  // Test Timeline Generator
  console.log('\n📅 Testing Timeline Generator...\n');
  
  const timelineGen = new TimelineGenerator();
  const timeline = timelineGen.generateTimeline([
    { title: 'Event 1', date: '2024-01-15', type: 'filing' },
    { title: 'Event 2', date: '2024-02-20', type: 'hearing' },
    { title: 'Event 3', date: '2024-03-10', type: 'verdict' }
  ]);
  
  assert(timeline.events.length === 3, 'Timeline contains all events');
  assert(timeline.duration !== null, 'Timeline duration is calculated');
  assert(timeline.summary, 'Timeline summary is generated');
  
  const formatted = timelineGen.formatTimeline(timeline);
  assert(formatted.length > 0, 'Timeline can be formatted');
  
  const insights = timelineGen.generateInsights(timeline);
  assert(insights.length > 0, 'Timeline insights are generated');
  
  // Test Document Organizer
  console.log('\n📚 Testing Document Organizer...\n');
  
  const docOrg = new DocumentOrganizer('./data/test-documents');
  await docOrg.initialize();
  
  const category = docOrg.suggestCategory({
    name: 'complaint.pdf',
    description: 'Initial complaint filing',
    tags: ['pleading']
  });
  
  assert(category === 'pleadings', 'Document category is suggested correctly');
  
  const categoryInfo = docOrg.getCategoryInfo();
  assert(categoryInfo.length > 0, 'Category information is available');
  
  const explanation = docOrg.explainOrganization();
  assert(explanation.length > 0, 'Organization explanation is generated');
  
  // Test plain English output
  console.log('\n💬 Testing Plain English Output...\n');
  
  const summary = caseManager.getCaseSummary(testCase.id);
  assert(summary.length > 0, 'Case summary is generated in plain English');
  assert(!summary.includes('undefined'), 'Summary has no undefined values');
  
  const explanation2 = analyzer.explainAnalysis(analysis);
  assert(explanation2.length > 0, 'Evidence analysis explanation is in plain English');
  assert(explanation2.includes('📊'), 'Analysis includes helpful icons');
  
  // Cleanup test data
  await caseManager.deleteCase(testCase.id);
  
  // Print results
  console.log('\n' + '═'.repeat(50));
  console.log('\n📊 Test Results:\n');
  console.log(`✓ Passed: ${testsPassed}`);
  console.log(`✗ Failed: ${testsFailed}`);
  console.log(`Total: ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
