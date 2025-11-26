const fs = require('fs');
const path = require('path');

// Test data directory
const TEST_DATA_DIR = path.join(__dirname, '.case-data-test');
const TEST_CASE_FILE = path.join(TEST_DATA_DIR, 'case.json');

// Mock functions for testing
function loadCaseData() {
  if (fs.existsSync(TEST_CASE_FILE)) {
    const data = fs.readFileSync(TEST_CASE_FILE, 'utf8');
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing case data:', error.message);
      return getEmptyCaseData();
    }
  }
  return getEmptyCaseData();
}

function getEmptyCaseData() {
  return {
    caseNumber: '',
    plaintiff: '',
    defendant: '',
    court: '',
    judge: '',
    filingDate: '',
    events: [],
    evidence: [],
    darvoIncidents: [],
    notes: []
  };
}

function saveCaseData(data) {
  if (!fs.existsSync(TEST_DATA_DIR)) {
    fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(TEST_CASE_FILE, JSON.stringify(data, null, 2));
}

// Ensure clean test environment
function cleanupTestData() {
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmSync(TEST_DATA_DIR, { recursive: true, force: true });
  }
}

// Run tests
function runTests() {
  console.log('Running tests for District Court Case Management Assistant...\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Load empty case data
  try {
    cleanupTestData();
    const caseData = loadCaseData();
    
    if (caseData.caseNumber === '' && 
        caseData.events.length === 0 && 
        caseData.evidence.length === 0 &&
        caseData.darvoIncidents.length === 0) {
      console.log('✓ Test 1 PASSED: Load empty case data');
      passed++;
    } else {
      console.log('✗ Test 1 FAILED: Empty case data structure incorrect');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 1 FAILED:', error.message);
    failed++;
  }
  
  // Test 2: Save and load case data
  try {
    const testData = {
      caseNumber: 'TEST-2024-001',
      plaintiff: 'Test Plaintiff',
      defendant: 'Test Defendant',
      court: 'Test District Court',
      judge: 'Test Judge',
      filingDate: '2024-01-01',
      events: [],
      evidence: [],
      darvoIncidents: [],
      notes: []
    };
    
    saveCaseData(testData);
    const loadedData = loadCaseData();
    
    if (loadedData.caseNumber === 'TEST-2024-001' &&
        loadedData.plaintiff === 'Test Plaintiff' &&
        loadedData.court === 'Test District Court') {
      console.log('✓ Test 2 PASSED: Save and load case data');
      passed++;
    } else {
      console.log('✗ Test 2 FAILED: Data mismatch after save/load');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 2 FAILED:', error.message);
    failed++;
  }
  
  // Test 3: Add timeline event
  try {
    const caseData = loadCaseData();
    const event = {
      id: Date.now(),
      date: '2024-01-15',
      title: 'Test Event',
      description: 'Test event description',
      location: 'Test Location',
      witnesses: ['Witness 1', 'Witness 2'],
      addedOn: new Date().toISOString()
    };
    
    caseData.events.push(event);
    saveCaseData(caseData);
    
    const loadedData = loadCaseData();
    if (loadedData.events.length === 1 && 
        loadedData.events[0].title === 'Test Event') {
      console.log('✓ Test 3 PASSED: Add timeline event');
      passed++;
    } else {
      console.log('✗ Test 3 FAILED: Timeline event not added correctly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 3 FAILED:', error.message);
    failed++;
  }
  
  // Test 4: Add evidence
  try {
    const caseData = loadCaseData();
    const evidence = {
      id: Date.now(),
      type: 'document',
      description: 'Test Evidence',
      date: '2024-01-20',
      location: '/path/to/evidence',
      notes: 'Test notes',
      addedOn: new Date().toISOString()
    };
    
    caseData.evidence.push(evidence);
    saveCaseData(caseData);
    
    const loadedData = loadCaseData();
    if (loadedData.evidence.length === 1 && 
        loadedData.evidence[0].type === 'document') {
      console.log('✓ Test 4 PASSED: Add evidence');
      passed++;
    } else {
      console.log('✗ Test 4 FAILED: Evidence not added correctly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 4 FAILED:', error.message);
    failed++;
  }
  
  // Test 5: Add DARVO incident
  try {
    const caseData = loadCaseData();
    const incident = {
      id: Date.now(),
      date: '2024-01-25',
      context: 'Test context',
      tactics: {
        deny: 'Test denial',
        attack: 'Test attack',
        reverse: 'Test reversal'
      },
      witnesses: ['Witness 3'],
      evidence: 'Test evidence reference',
      addedOn: new Date().toISOString()
    };
    
    caseData.darvoIncidents.push(incident);
    saveCaseData(caseData);
    
    const loadedData = loadCaseData();
    if (loadedData.darvoIncidents.length === 1 && 
        loadedData.darvoIncidents[0].tactics.deny === 'Test denial') {
      console.log('✓ Test 5 PASSED: Add DARVO incident');
      passed++;
    } else {
      console.log('✗ Test 5 FAILED: DARVO incident not added correctly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 5 FAILED:', error.message);
    failed++;
  }
  
  // Test 6: Add note
  try {
    const caseData = loadCaseData();
    const note = {
      id: Date.now(),
      title: 'Test Note',
      content: 'Test note content',
      category: 'general',
      createdOn: new Date().toISOString()
    };
    
    caseData.notes.push(note);
    saveCaseData(caseData);
    
    const loadedData = loadCaseData();
    if (loadedData.notes.length === 1 && 
        loadedData.notes[0].title === 'Test Note') {
      console.log('✓ Test 6 PASSED: Add note');
      passed++;
    } else {
      console.log('✗ Test 6 FAILED: Note not added correctly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 6 FAILED:', error.message);
    failed++;
  }
  
  // Test 7: Verify data persistence
  try {
    const loadedData = loadCaseData();
    if (loadedData.events.length === 1 &&
        loadedData.evidence.length === 1 &&
        loadedData.darvoIncidents.length === 1 &&
        loadedData.notes.length === 1) {
      console.log('✓ Test 7 PASSED: Data persistence verified');
      passed++;
    } else {
      console.log('✗ Test 7 FAILED: Data not persisted correctly');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 7 FAILED:', error.message);
    failed++;
  }
  
  // Cleanup
  cleanupTestData();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Tests Passed: ${passed}`);
  console.log(`Tests Failed: ${failed}`);
  console.log('='.repeat(50));
  
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('\nAll tests passed! ✓');
    process.exit(0);
  }
}

// Run tests
runTests();
