const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');

/**
 * Core Case Manager - Handles legal case data and operations
 */
class CaseManager {
  constructor(dataDir = './data/cases') {
    this.dataDir = dataDir;
    this.cases = new Map();
  }

  /**
   * Initialize the case manager
   */
  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await this.loadCases();
    } catch (error) {
      console.error('Error initializing CaseManager:', error.message);
    }
  }

  /**
   * Create a new case
   */
  async createCase(caseData) {
    const caseId = this.generateCaseId();
    const newCase = {
      id: caseId,
      title: caseData.title || 'Untitled Case',
      description: caseData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: caseData.status || 'active',
      evidence: [],
      timeline: [],
      documents: [],
      notes: caseData.notes || '',
      parties: caseData.parties || [],
      type: caseData.type || 'general'
    };

    this.cases.set(caseId, newCase);
    await this.saveCase(newCase);
    return newCase;
  }

  /**
   * Get a case by ID
   */
  getCase(caseId) {
    return this.cases.get(caseId);
  }

  /**
   * List all cases
   */
  listCases(filter = {}) {
    let cases = Array.from(this.cases.values());
    
    if (filter.status) {
      cases = cases.filter(c => c.status === filter.status);
    }
    
    if (filter.type) {
      cases = cases.filter(c => c.type === filter.type);
    }

    return cases.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }

  /**
   * Update case information
   */
  async updateCase(caseId, updates) {
    const existingCase = this.cases.get(caseId);
    if (!existingCase) {
      throw new Error(`Case ${caseId} not found`);
    }

    const updatedCase = {
      ...existingCase,
      ...updates,
      id: caseId, // Prevent ID changes
      updatedAt: new Date().toISOString()
    };

    this.cases.set(caseId, updatedCase);
    await this.saveCase(updatedCase);
    return updatedCase;
  }

  /**
   * Delete a case
   */
  async deleteCase(caseId) {
    const caseObj = this.cases.get(caseId);
    if (!caseObj) {
      throw new Error(`Case ${caseId} not found`);
    }

    this.cases.delete(caseId);
    const filePath = path.join(this.dataDir, `${caseId}.json`);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting case file: ${error.message}`);
    }

    return true;
  }

  /**
   * Add evidence to a case
   */
  async addEvidence(caseId, evidence) {
    const caseObj = this.getCase(caseId);
    if (!caseObj) {
      throw new Error(`Case ${caseId} not found`);
    }

    const evidenceItem = {
      id: this.generateId(),
      type: evidence.type || 'document',
      description: evidence.description || '',
      source: evidence.source || '',
      date: evidence.date || new Date().toISOString(),
      addedAt: new Date().toISOString(),
      tags: evidence.tags || [],
      metadata: evidence.metadata || {}
    };

    caseObj.evidence.push(evidenceItem);
    await this.updateCase(caseId, { evidence: caseObj.evidence });
    return evidenceItem;
  }

  /**
   * Add document to a case
   */
  async addDocument(caseId, document) {
    const caseObj = this.getCase(caseId);
    if (!caseObj) {
      throw new Error(`Case ${caseId} not found`);
    }

    const docItem = {
      id: this.generateId(),
      name: document.name || 'Untitled Document',
      path: document.path || '',
      type: document.type || 'pdf',
      uploadedAt: new Date().toISOString(),
      size: document.size || 0,
      description: document.description || '',
      tags: document.tags || []
    };

    caseObj.documents.push(docItem);
    await this.updateCase(caseId, { documents: caseObj.documents });
    return docItem;
  }

  /**
   * Add timeline event to a case
   */
  async addTimelineEvent(caseId, event) {
    const caseObj = this.getCase(caseId);
    if (!caseObj) {
      throw new Error(`Case ${caseId} not found`);
    }

    const timelineEvent = {
      id: this.generateId(),
      date: event.date || new Date().toISOString(),
      title: event.title || 'Untitled Event',
      description: event.description || '',
      type: event.type || 'general',
      importance: event.importance || 'medium',
      relatedEvidence: event.relatedEvidence || []
    };

    caseObj.timeline.push(timelineEvent);
    caseObj.timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    await this.updateCase(caseId, { timeline: caseObj.timeline });
    return timelineEvent;
  }

  /**
   * Generate a unique case ID
   */
  generateCaseId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `CASE-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Generate a unique ID for items
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Save a case to file
   */
  async saveCase(caseObj) {
    const filePath = path.join(this.dataDir, `${caseObj.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(caseObj, null, 2), 'utf8');
  }

  /**
   * Load all cases from disk
   */
  async loadCases() {
    try {
      const files = await fs.readdir(this.dataDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      for (const file of jsonFiles) {
        const filePath = path.join(this.dataDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const caseObj = JSON.parse(content);
        this.cases.set(caseObj.id, caseObj);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error loading cases:', error.message);
      }
    }
  }

  /**
   * Get case summary in plain English
   */
  getCaseSummary(caseId) {
    const caseObj = this.getCase(caseId);
    if (!caseObj) {
      return 'Case not found.';
    }

    const created = format(new Date(caseObj.createdAt), 'MMMM d, yyyy');
    const updated = format(new Date(caseObj.updatedAt), 'MMMM d, yyyy');
    
    return `
Case: ${caseObj.title}
Status: ${caseObj.status}
Type: ${caseObj.type}
Created: ${created}
Last Updated: ${updated}

${caseObj.description || 'No description available.'}

Evidence Items: ${caseObj.evidence.length}
Documents: ${caseObj.documents.length}
Timeline Events: ${caseObj.timeline.length}
${caseObj.parties.length > 0 ? `\nParties Involved: ${caseObj.parties.join(', ')}` : ''}
${caseObj.notes ? `\nNotes: ${caseObj.notes}` : ''}
    `.trim();
  }
}

module.exports = CaseManager;
