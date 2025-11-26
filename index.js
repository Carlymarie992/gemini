#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Data storage directory
const DATA_DIR = path.join(process.cwd(), '.case-data');
const CASE_FILE = path.join(DATA_DIR, 'case.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load case data
function loadCaseData() {
  if (fs.existsSync(CASE_FILE)) {
    try {
      const data = fs.readFileSync(CASE_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading case data:', error.message);
      console.error('Case data may be corrupted. Starting with empty data.');
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

// Save case data
function saveCaseData(data) {
  fs.writeFileSync(CASE_FILE, JSON.stringify(data, null, 2));
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify question
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Clear screen
function clearScreen() {
  console.clear();
}

// Generate timestamp for filenames
function generateTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').replace('T', '-').split('Z')[0];
}

// Display main menu
function displayMenu() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║     DISTRICT COURT CASE MANAGEMENT ASSISTANT              ║');
  console.log('║     Helping You Navigate Your Case                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  console.log('1. View Case Information');
  console.log('2. Update Case Information');
  console.log('3. Add Timeline Event');
  console.log('4. Add Evidence');
  console.log('5. Document DARVO Incident');
  console.log('6. View DARVO Tactics Guide');
  console.log('7. Add Note');
  console.log('8. View All Records');
  console.log('9. Court Preparation Checklist');
  console.log('10. Export Case Summary');
  console.log('0. Exit');
  console.log('\n');
}

// View case information
function viewCaseInfo(caseData) {
  console.log('\n═══ CASE INFORMATION ═══\n');
  console.log(`Case Number: ${caseData.caseNumber || 'Not set'}`);
  console.log(`Plaintiff: ${caseData.plaintiff || 'Not set'}`);
  console.log(`Defendant: ${caseData.defendant || 'Not set'}`);
  console.log(`Court: ${caseData.court || 'Not set'}`);
  console.log(`Judge: ${caseData.judge || 'Not set'}`);
  console.log(`Filing Date: ${caseData.filingDate || 'Not set'}`);
  console.log('\n');
}

// Update case information
async function updateCaseInfo(caseData) {
  console.log('\n═══ UPDATE CASE INFORMATION ═══\n');
  console.log('Press Enter to keep current value\n');
  
  const caseNumber = await question(`Case Number [${caseData.caseNumber}]: `);
  if (caseNumber) caseData.caseNumber = caseNumber;
  
  const plaintiff = await question(`Plaintiff Name [${caseData.plaintiff}]: `);
  if (plaintiff) caseData.plaintiff = plaintiff;
  
  const defendant = await question(`Defendant Name [${caseData.defendant}]: `);
  if (defendant) caseData.defendant = defendant;
  
  const court = await question(`Court Name [${caseData.court}]: `);
  if (court) caseData.court = court;
  
  const judge = await question(`Judge Name [${caseData.judge}]: `);
  if (judge) caseData.judge = judge;
  
  const filingDate = await question(`Filing Date (YYYY-MM-DD) [${caseData.filingDate}]: `);
  if (filingDate) caseData.filingDate = filingDate;
  
  saveCaseData(caseData);
  console.log('\n✓ Case information updated successfully!\n');
}

// Add timeline event
async function addTimelineEvent(caseData) {
  console.log('\n═══ ADD TIMELINE EVENT ═══\n');
  
  const date = await question('Event Date (YYYY-MM-DD): ');
  const title = await question('Event Title: ');
  const description = await question('Event Description: ');
  const location = await question('Location (optional): ');
  const witnesses = await question('Witnesses (comma-separated, optional): ');
  
  const event = {
    id: Date.now(),
    date,
    title,
    description,
    location,
    witnesses: witnesses ? witnesses.split(',').map(w => w.trim()) : [],
    addedOn: new Date().toISOString()
  };
  
  caseData.events.push(event);
  saveCaseData(caseData);
  console.log('\n✓ Timeline event added successfully!\n');
}

// Add evidence
async function addEvidence(caseData) {
  console.log('\n═══ ADD EVIDENCE ═══\n');
  
  const type = await question('Evidence Type (document/photo/video/audio/witness/other): ');
  const description = await question('Description: ');
  const date = await question('Date Obtained/Created (YYYY-MM-DD): ');
  const location = await question('File Location or Physical Location: ');
  const notes = await question('Additional Notes: ');
  
  const evidence = {
    id: Date.now(),
    type,
    description,
    date,
    location,
    notes,
    addedOn: new Date().toISOString()
  };
  
  caseData.evidence.push(evidence);
  saveCaseData(caseData);
  console.log('\n✓ Evidence added successfully!\n');
}

// Document DARVO incident
async function documentDarvoIncident(caseData) {
  console.log('\n═══ DOCUMENT DARVO INCIDENT ═══\n');
  console.log('DARVO: Deny, Attack, and Reverse Victim and Offender\n');
  
  const date = await question('Date of Incident (YYYY-MM-DD): ');
  const context = await question('Context/Setting: ');
  
  console.log('\nDid they DENY the abuse/wrongdoing?');
  const deny = await question('Details of denial: ');
  
  console.log('\nDid they ATTACK you or your credibility?');
  const attack = await question('Details of attack: ');
  
  console.log('\nDid they REVERSE victim/offender roles?');
  const reverse = await question('Details of role reversal: ');
  
  const witnesses = await question('Witnesses (comma-separated, optional): ');
  const evidence = await question('Related Evidence (optional): ');
  
  const incident = {
    id: Date.now(),
    date,
    context,
    tactics: {
      deny,
      attack,
      reverse
    },
    witnesses: witnesses ? witnesses.split(',').map(w => w.trim()) : [],
    evidence,
    addedOn: new Date().toISOString()
  };
  
  caseData.darvoIncidents.push(incident);
  saveCaseData(caseData);
  console.log('\n✓ DARVO incident documented successfully!\n');
}

// View DARVO tactics guide
function viewDarvoGuide() {
  console.log('\n═══ UNDERSTANDING DARVO TACTICS ═══\n');
  console.log('DARVO stands for: Deny, Attack, and Reverse Victim and Offender\n');
  console.log('This is a common manipulation tactic used by abusers when confronted.\n');
  
  console.log('D - DENY:');
  console.log('  • Outright denial of the abuse or harmful behavior');
  console.log('  • "That never happened"');
  console.log('  • "You\'re remembering it wrong"');
  console.log('  • Minimizing: "It wasn\'t that bad"\n');
  
  console.log('A - ATTACK:');
  console.log('  • Attacking your character or credibility');
  console.log('  • "You\'re crazy/too sensitive/dramatic"');
  console.log('  • "You\'re a liar"');
  console.log('  • Bringing up your past mistakes');
  console.log('  • Questioning your mental health\n');
  
  console.log('R - REVERSE Victim and Offender:');
  console.log('  • Claiming they are the real victim');
  console.log('  • "You\'re the one abusing me"');
  console.log('  • "I\'m the one suffering here"');
  console.log('  • Turning your defense into an attack on them\n');
  
  console.log('WHY DOCUMENT DARVO:');
  console.log('  • Shows a pattern of manipulation');
  console.log('  • Demonstrates consciousness of wrongdoing');
  console.log('  • Helps courts recognize abuse tactics');
  console.log('  • Supports your credibility');
  console.log('  • Protects against false counter-allegations\n');
  
  console.log('TIPS FOR COURT:');
  console.log('  • Keep detailed records of each instance');
  console.log('  • Note dates, times, and witnesses');
  console.log('  • Save all communications (texts, emails)');
  console.log('  • Stay calm and factual when describing incidents');
  console.log('  • Let the pattern speak for itself\n');
}

// Add note
async function addNote(caseData) {
  console.log('\n═══ ADD NOTE ═══\n');
  
  const title = await question('Note Title: ');
  const content = await question('Note Content: ');
  const category = await question('Category (general/legal/evidence/strategy): ');
  
  const note = {
    id: Date.now(),
    title,
    content,
    category,
    createdOn: new Date().toISOString()
  };
  
  caseData.notes.push(note);
  saveCaseData(caseData);
  console.log('\n✓ Note added successfully!\n');
}

// View all records
function viewAllRecords(caseData) {
  console.log('\n═══ ALL CASE RECORDS ═══\n');
  
  // Timeline Events
  if (caseData.events.length > 0) {
    console.log('TIMELINE EVENTS:');
    caseData.events.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((event, idx) => {
      console.log(`\n${idx + 1}. ${event.date} - ${event.title}`);
      console.log(`   ${event.description}`);
      if (event.location) console.log(`   Location: ${event.location}`);
      if (event.witnesses.length > 0) console.log(`   Witnesses: ${event.witnesses.join(', ')}`);
    });
    console.log('\n');
  }
  
  // Evidence
  if (caseData.evidence.length > 0) {
    console.log('EVIDENCE:');
    caseData.evidence.forEach((ev, idx) => {
      console.log(`\n${idx + 1}. [${ev.type}] ${ev.description}`);
      console.log(`   Date: ${ev.date}`);
      console.log(`   Location: ${ev.location}`);
      if (ev.notes) console.log(`   Notes: ${ev.notes}`);
    });
    console.log('\n');
  }
  
  // DARVO Incidents
  if (caseData.darvoIncidents.length > 0) {
    console.log('DARVO INCIDENTS:');
    caseData.darvoIncidents.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((incident, idx) => {
      console.log(`\n${idx + 1}. ${incident.date} - ${incident.context}`);
      console.log(`   Denial: ${incident.tactics.deny}`);
      console.log(`   Attack: ${incident.tactics.attack}`);
      console.log(`   Reversal: ${incident.tactics.reverse}`);
      if (incident.witnesses.length > 0) console.log(`   Witnesses: ${incident.witnesses.join(', ')}`);
    });
    console.log('\n');
  }
  
  // Notes
  if (caseData.notes.length > 0) {
    console.log('NOTES:');
    caseData.notes.forEach((note, idx) => {
      console.log(`\n${idx + 1}. [${note.category}] ${note.title}`);
      console.log(`   ${note.content}`);
      console.log(`   Created: ${new Date(note.createdOn).toLocaleDateString()}`);
    });
    console.log('\n');
  }
  
  if (caseData.events.length === 0 && caseData.evidence.length === 0 && 
      caseData.darvoIncidents.length === 0 && caseData.notes.length === 0) {
    console.log('No records added yet.\n');
  }
}

// Court preparation checklist
async function courtPreparationChecklist() {
  console.log('\n═══ COURT PREPARATION CHECKLIST ═══\n');
  
  console.log('BEFORE COURT:');
  console.log('☐ Review all case documents and evidence');
  console.log('☐ Organize evidence chronologically');
  console.log('☐ Prepare timeline of events');
  console.log('☐ List all witnesses and their contact information');
  console.log('☐ Practice your testimony (stick to facts)');
  console.log('☐ Prepare questions for defendant (if applicable)');
  console.log('☐ Bring copies of all documents (3 sets minimum)');
  console.log('☐ Dress professionally and appropriately');
  console.log('☐ Arrive early (at least 30 minutes)');
  console.log('☐ Bring notebook and pen for notes\n');
  
  console.log('DURING TESTIMONY:');
  console.log('☐ Speak clearly and calmly');
  console.log('☐ Answer only what is asked');
  console.log('☐ Say "I don\'t recall" if you truly don\'t remember');
  console.log('☐ Don\'t guess or speculate');
  console.log('☐ Take your time before answering');
  console.log('☐ Stay factual, not emotional');
  console.log('☐ Address the judge, not the defendant');
  console.log('☐ Be respectful to everyone in the courtroom\n');
  
  console.log('RECOGNIZING DARVO IN COURT:');
  console.log('☐ Listen for denial of documented facts');
  console.log('☐ Note attacks on your character');
  console.log('☐ Identify when they claim to be the victim');
  console.log('☐ Have evidence ready to counter false claims');
  console.log('☐ Stay calm when facing accusations');
  console.log('☐ Let your documentation speak for you\n');
  
  console.log('AFTER COURT:');
  console.log('☐ Document what happened immediately');
  console.log('☐ Note any DARVO tactics used');
  console.log('☐ Save copies of all filed documents');
  console.log('☐ Follow up on any court orders');
  console.log('☐ Prepare for next hearing if applicable\n');
}

// Export case summary
function exportCaseSummary(caseData) {
  const timestamp = generateTimestamp();
  const filename = path.join(DATA_DIR, `case-summary-${timestamp}.txt`);
  
  let summary = '═══════════════════════════════════════════════════════\n';
  summary += '           CASE SUMMARY REPORT\n';
  summary += '═══════════════════════════════════════════════════════\n\n';
  
  summary += 'CASE INFORMATION:\n';
  summary += `Case Number: ${caseData.caseNumber || 'N/A'}\n`;
  summary += `Plaintiff: ${caseData.plaintiff || 'N/A'}\n`;
  summary += `Defendant: ${caseData.defendant || 'N/A'}\n`;
  summary += `Court: ${caseData.court || 'N/A'}\n`;
  summary += `Judge: ${caseData.judge || 'N/A'}\n`;
  summary += `Filing Date: ${caseData.filingDate || 'N/A'}\n\n`;
  
  summary += '═══════════════════════════════════════════════════════\n\n';
  
  if (caseData.events.length > 0) {
    summary += 'TIMELINE OF EVENTS:\n\n';
    caseData.events.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((event, idx) => {
      summary += `${idx + 1}. ${event.date} - ${event.title}\n`;
      summary += `   ${event.description}\n`;
      if (event.location) summary += `   Location: ${event.location}\n`;
      if (event.witnesses.length > 0) summary += `   Witnesses: ${event.witnesses.join(', ')}\n`;
      summary += '\n';
    });
    summary += '\n';
  }
  
  if (caseData.evidence.length > 0) {
    summary += 'EVIDENCE:\n\n';
    caseData.evidence.forEach((ev, idx) => {
      summary += `${idx + 1}. [${ev.type}] ${ev.description}\n`;
      summary += `   Date: ${ev.date}\n`;
      summary += `   Location: ${ev.location}\n`;
      if (ev.notes) summary += `   Notes: ${ev.notes}\n`;
      summary += '\n';
    });
    summary += '\n';
  }
  
  if (caseData.darvoIncidents.length > 0) {
    summary += 'DOCUMENTED DARVO TACTICS:\n\n';
    caseData.darvoIncidents.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach((incident, idx) => {
      summary += `${idx + 1}. ${incident.date}\n`;
      summary += `   Context: ${incident.context}\n`;
      summary += `   Denial: ${incident.tactics.deny}\n`;
      summary += `   Attack: ${incident.tactics.attack}\n`;
      summary += `   Reversal: ${incident.tactics.reverse}\n`;
      if (incident.witnesses.length > 0) summary += `   Witnesses: ${incident.witnesses.join(', ')}\n`;
      summary += '\n';
    });
    summary += '\n';
  }
  
  if (caseData.notes.length > 0) {
    summary += 'NOTES:\n\n';
    caseData.notes.forEach((note, idx) => {
      summary += `${idx + 1}. [${note.category}] ${note.title}\n`;
      summary += `   ${note.content}\n`;
      summary += `   Created: ${new Date(note.createdOn).toLocaleDateString()}\n\n`;
    });
  }
  
  summary += '═══════════════════════════════════════════════════════\n';
  summary += `Generated: ${new Date().toLocaleString()}\n`;
  summary += '═══════════════════════════════════════════════════════\n';
  
  fs.writeFileSync(filename, summary);
  console.log(`\n✓ Case summary exported to: ${filename}\n`);
}

// Main application loop
async function main() {
  let caseData = loadCaseData();
  let running = true;
  
  while (running) {
    displayMenu();
    const choice = await question('Select an option: ');
    
    switch (choice) {
      case '1':
        viewCaseInfo(caseData);
        await question('Press Enter to continue...');
        break;
      case '2':
        await updateCaseInfo(caseData);
        await question('Press Enter to continue...');
        break;
      case '3':
        await addTimelineEvent(caseData);
        await question('Press Enter to continue...');
        break;
      case '4':
        await addEvidence(caseData);
        await question('Press Enter to continue...');
        break;
      case '5':
        await documentDarvoIncident(caseData);
        await question('Press Enter to continue...');
        break;
      case '6':
        viewDarvoGuide();
        await question('Press Enter to continue...');
        break;
      case '7':
        await addNote(caseData);
        await question('Press Enter to continue...');
        break;
      case '8':
        viewAllRecords(caseData);
        await question('Press Enter to continue...');
        break;
      case '9':
        await courtPreparationChecklist();
        await question('Press Enter to continue...');
        break;
      case '10':
        exportCaseSummary(caseData);
        await question('Press Enter to continue...');
        break;
      case '0':
        console.log('\nThank you for using the District Court Case Management Assistant.');
        console.log('Stay strong and stay organized. Your voice matters.\n');
        running = false;
        break;
      default:
        console.log('\nInvalid option. Please try again.\n');
        await question('Press Enter to continue...');
    }
    
    if (running) {
      clearScreen();
    }
  }
  
  rl.close();
}

// Run the application
if (require.main === module) {
  main().catch(error => {
    console.error('An error occurred:', error);
    process.exit(1);
  });
}

module.exports = { loadCaseData, saveCaseData };
