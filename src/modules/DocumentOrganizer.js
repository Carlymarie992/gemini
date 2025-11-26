const fs = require('fs').promises;
const path = require('path');

/**
 * Document Organizer - Smart document management and organization
 * Helps organize, categorize, and retrieve case documents efficiently
 */
class DocumentOrganizer {
  constructor(baseDir = './data/documents') {
    this.baseDir = baseDir;
    this.categories = {
      pleadings: 'Legal pleadings and filings',
      evidence: 'Evidence documents',
      correspondence: 'Letters and communications',
      discovery: 'Discovery materials',
      motions: 'Legal motions',
      orders: 'Court orders and decisions',
      contracts: 'Contracts and agreements',
      reports: 'Expert reports and analyses',
      research: 'Legal research and memoranda',
      misc: 'Miscellaneous documents'
    };
  }

  /**
   * Initialize the document organizer
   */
  async initialize() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
      
      // Create category folders
      for (const category of Object.keys(this.categories)) {
        await fs.mkdir(path.join(this.baseDir, category), { recursive: true });
      }
    } catch (error) {
      console.error('Error initializing DocumentOrganizer:', error.message);
    }
  }

  /**
   * Organize a document into appropriate category
   */
  async organizeDocument(document, suggestedCategory = null) {
    const category = suggestedCategory || this.suggestCategory(document);
    const targetDir = path.join(this.baseDir, category);
    
    await fs.mkdir(targetDir, { recursive: true });
    
    const fileName = this.sanitizeFileName(document.name);
    const targetPath = path.join(targetDir, fileName);
    
    // If document has a source path, copy it
    if (document.path && document.path !== targetPath) {
      try {
        await fs.copyFile(document.path, targetPath);
      } catch (error) {
        console.error(`Error copying file: ${error.message}`);
      }
    }
    
    return {
      category,
      path: targetPath,
      organized: true
    };
  }

  /**
   * Suggest category based on document properties
   */
  suggestCategory(document) {
    const name = (document.name || '').toLowerCase();
    const description = (document.description || '').toLowerCase();
    const tags = (document.tags || []).map(t => t.toLowerCase());
    const combined = `${name} ${description} ${tags.join(' ')}`;

    // Category keywords
    const keywords = {
      pleadings: ['complaint', 'answer', 'filing', 'petition', 'response', 'pleading'],
      evidence: ['exhibit', 'evidence', 'proof', 'photograph', 'recording'],
      correspondence: ['letter', 'email', 'correspondence', 'communication', 'memo'],
      discovery: ['discovery', 'interrogatory', 'deposition', 'request for production'],
      motions: ['motion', 'brief', 'memorandum'],
      orders: ['order', 'judgment', 'ruling', 'decision', 'decree'],
      contracts: ['contract', 'agreement', 'lease', 'deed'],
      reports: ['report', 'analysis', 'expert', 'evaluation', 'assessment'],
      research: ['research', 'case law', 'statute', 'legal memo']
    };

    // Score each category
    const scores = {};
    for (const [category, words] of Object.entries(keywords)) {
      scores[category] = words.filter(word => combined.includes(word)).length;
    }

    // Find highest scoring category
    const bestCategory = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );

    return scores[bestCategory] > 0 ? bestCategory : 'misc';
  }

  /**
   * List documents in a category
   */
  async listDocuments(category = null, options = {}) {
    const {
      includeSubdirs = false,
      sortBy = 'name',
      filterBy = null
    } = options;

    let documents = [];
    
    if (category) {
      const categoryPath = path.join(this.baseDir, category);
      try {
        const files = await this.getFilesInDirectory(categoryPath, includeSubdirs);
        documents = files.map(f => ({
          name: path.basename(f),
          path: f,
          category,
          relativePath: path.relative(this.baseDir, f)
        }));
      } catch (error) {
        console.error(`Error listing category ${category}:`, error.message);
      }
    } else {
      // List all categories
      for (const cat of Object.keys(this.categories)) {
        const catDocs = await this.listDocuments(cat, options);
        documents = documents.concat(catDocs);
      }
    }

    // Apply filtering
    if (filterBy) {
      documents = documents.filter(doc => 
        doc.name.toLowerCase().includes(filterBy.toLowerCase())
      );
    }

    // Apply sorting
    documents.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return documents;
  }

  /**
   * Get files in a directory recursively
   */
  async getFilesInDirectory(dir, recursive = false) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && recursive) {
          const subFiles = await this.getFilesInDirectory(fullPath, recursive);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist yet
    }
    
    return files;
  }

  /**
   * Search for documents
   */
  async searchDocuments(query, options = {}) {
    const { category = null, searchIn = 'name' } = options;
    
    const allDocs = await this.listDocuments(category);
    const queryLower = query.toLowerCase();
    
    const results = allDocs.filter(doc => {
      if (searchIn === 'name') {
        return doc.name.toLowerCase().includes(queryLower);
      } else if (searchIn === 'path') {
        return doc.path.toLowerCase().includes(queryLower);
      }
      return doc.name.toLowerCase().includes(queryLower) || 
             doc.path.toLowerCase().includes(queryLower);
    });

    return {
      query,
      resultCount: results.length,
      results
    };
  }

  /**
   * Get document statistics
   */
  async getStatistics() {
    const stats = {
      totalDocuments: 0,
      byCategory: {},
      byExtension: {}
    };

    for (const category of Object.keys(this.categories)) {
      const docs = await this.listDocuments(category);
      stats.byCategory[category] = docs.length;
      stats.totalDocuments += docs.length;

      // Count by extension
      docs.forEach(doc => {
        const ext = path.extname(doc.name).toLowerCase() || 'no-extension';
        stats.byExtension[ext] = (stats.byExtension[ext] || 0) + 1;
      });
    }

    return stats;
  }

  /**
   * Generate organization report in plain English
   */
  async generateReport() {
    const stats = await getStatistics();
    
    let report = '📂 Document Organization Report\n';
    report += '═══════════════════════════════════════════\n\n';
    
    report += `Total Documents: ${stats.totalDocuments}\n\n`;
    
    report += 'Documents by Category:\n';
    report += '───────────────────────────────────────────\n';
    
    for (const [category, count] of Object.entries(stats.byCategory)) {
      if (count > 0) {
        const description = this.categories[category] || '';
        report += `${category.padEnd(20)} ${count.toString().padStart(4)} - ${description}\n`;
      }
    }
    
    report += '\n';
    report += 'Documents by Type:\n';
    report += '───────────────────────────────────────────\n';
    
    const sortedExts = Object.entries(stats.byExtension)
      .sort((a, b) => b[1] - a[1]);
    
    for (const [ext, count] of sortedExts) {
      report += `${ext.padEnd(20)} ${count.toString().padStart(4)}\n`;
    }
    
    report += '\n';
    
    if (stats.totalDocuments === 0) {
      report += '💡 No documents organized yet. Add documents to start building your case library.\n';
    } else if (stats.totalDocuments < 10) {
      report += '💡 Getting started! Continue adding and organizing your case documents.\n';
    } else {
      report += '✓ Good organization! Your documents are categorized and ready for reference.\n';
    }

    return report;
  }

  /**
   * Bulk categorize documents
   */
  async bulkCategorize(documents) {
    const results = {
      successful: 0,
      failed: 0,
      categories: {}
    };

    for (const doc of documents) {
      try {
        const result = await this.organizeDocument(doc);
        results.successful++;
        results.categories[result.category] = 
          (results.categories[result.category] || 0) + 1;
      } catch (error) {
        results.failed++;
        console.error(`Failed to organize ${doc.name}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Sanitize file name for safe storage
   */
  sanitizeFileName(fileName) {
    // Remove or replace unsafe characters
    return fileName
      .replace(/[<>:"|?*]/g, '_')
      .replace(/\.\./g, '_')
      .replace(/\s+/g, '_')
      .substring(0, 255); // Limit length
  }

  /**
   * Get category information
   */
  getCategoryInfo(category = null) {
    if (category) {
      return {
        category,
        description: this.categories[category] || 'Unknown category',
        path: path.join(this.baseDir, category)
      };
    }

    return Object.entries(this.categories).map(([cat, desc]) => ({
      category: cat,
      description: desc,
      path: path.join(this.baseDir, cat)
    }));
  }

  /**
   * Explain organization in plain English
   */
  explainOrganization() {
    let explanation = '📚 Document Organization System\n\n';
    
    explanation += 'This system automatically organizes your legal documents into categories:\n\n';
    
    Object.entries(this.categories).forEach(([category, description]) => {
      explanation += `• ${category.toUpperCase()}: ${description}\n`;
    });
    
    explanation += '\n💡 How it works:\n';
    explanation += '1. Add documents with names and descriptions\n';
    explanation += '2. The system analyzes keywords to suggest categories\n';
    explanation += '3. Documents are organized into folders for easy access\n';
    explanation += '4. Search and retrieve documents quickly when needed\n\n';
    
    explanation += '✓ Simple, powerful, and keeps your case materials organized!';
    
    return explanation;
  }

  /**
   * Move document to different category
   */
  async moveDocument(documentPath, newCategory) {
    if (!this.categories[newCategory]) {
      throw new Error(`Invalid category: ${newCategory}`);
    }

    const fileName = path.basename(documentPath);
    const targetDir = path.join(this.baseDir, newCategory);
    const targetPath = path.join(targetDir, fileName);

    await fs.mkdir(targetDir, { recursive: true });
    await fs.rename(documentPath, targetPath);

    return {
      oldPath: documentPath,
      newPath: targetPath,
      category: newCategory
    };
  }
}

module.exports = DocumentOrganizer;
