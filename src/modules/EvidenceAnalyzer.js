const natural = require('natural');

/**
 * Evidence Analyzer - AI-powered analysis of legal evidence
 * Provides plain English summaries and insights
 */
class EvidenceAnalyzer {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    this.sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  }

  /**
   * Analyze evidence and provide insights in plain English
   */
  analyzeEvidence(evidence) {
    if (!evidence || !evidence.description) {
      return {
        summary: 'No evidence description available for analysis.',
        insights: [],
        importance: 'unknown'
      };
    }

    const text = evidence.description;
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    
    // Extract key terms
    const keyTerms = this.extractKeyTerms(text);
    
    // Analyze sentiment
    const sentimentScore = this.sentiment.getSentiment(tokens);
    
    // Determine importance
    const importance = this.determineImportance(evidence, tokens);
    
    // Generate insights
    const insights = this.generateInsights(evidence, tokens, keyTerms, sentimentScore);
    
    return {
      summary: this.generateSummary(evidence, keyTerms),
      insights,
      importance,
      keyTerms: keyTerms.slice(0, 10),
      sentimentScore
    };
  }

  /**
   * Analyze multiple pieces of evidence together
   */
  analyzeEvidenceCollection(evidenceList) {
    if (!evidenceList || evidenceList.length === 0) {
      return {
        summary: 'No evidence to analyze.',
        patterns: [],
        connections: [],
        timeline: []
      };
    }

    const allDescriptions = evidenceList
      .map(e => e.description || '')
      .join(' ');
    
    const keyTerms = this.extractKeyTerms(allDescriptions);
    const patterns = this.findPatterns(evidenceList);
    const connections = this.findConnections(evidenceList);
    
    return {
      summary: this.generateCollectionSummary(evidenceList, keyTerms),
      patterns,
      connections,
      keyTerms: keyTerms.slice(0, 15),
      totalItems: evidenceList.length
    };
  }

  /**
   * Extract key terms from text
   */
  extractKeyTerms(text) {
    if (!text) return [];
    
    // Add to TF-IDF
    this.tfidf.addDocument(text);
    
    const terms = new Map();
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    
    // Filter out common legal words and short words
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    
    tokens.forEach(token => {
      if (token.length > 3 && !stopWords.has(token)) {
        terms.set(token, (terms.get(token) || 0) + 1);
      }
    });
    
    // Sort by frequency
    return Array.from(terms.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([term]) => term);
  }

  /**
   * Determine importance of evidence
   */
  determineImportance(evidence, tokens) {
    let score = 0;
    
    // High importance keywords
    const highImportanceWords = ['critical', 'key', 'essential', 'crucial', 'primary', 'smoking gun', 'proof', 'witness', 'testimony'];
    const mediumImportanceWords = ['relevant', 'related', 'supporting', 'corroborating', 'additional'];
    
    highImportanceWords.forEach(word => {
      if (tokens.includes(word)) score += 3;
    });
    
    mediumImportanceWords.forEach(word => {
      if (tokens.includes(word)) score += 1;
    });
    
    // Consider explicit importance if set
    if (evidence.importance === 'high' || evidence.importance === 'critical') {
      score += 5;
    } else if (evidence.importance === 'medium') {
      score += 2;
    }
    
    if (score >= 5) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  /**
   * Generate insights about evidence
   */
  generateInsights(evidence, tokens, keyTerms, sentimentScore) {
    const insights = [];
    
    // Type-specific insights
    if (evidence.type === 'document') {
      insights.push('This is documentary evidence that should be preserved and authenticated.');
    } else if (evidence.type === 'testimony') {
      insights.push('This testimony should be cross-referenced with other witness statements.');
    } else if (evidence.type === 'physical') {
      insights.push('Physical evidence requires proper chain of custody documentation.');
    }
    
    // Sentiment insights
    if (sentimentScore > 1) {
      insights.push('The language suggests a positive or favorable context.');
    } else if (sentimentScore < -1) {
      insights.push('The language indicates potential conflict or negative circumstances.');
    }
    
    // Date relevance
    if (evidence.date) {
      insights.push(`This evidence is dated ${new Date(evidence.date).toLocaleDateString()}, which may be significant for timeline analysis.`);
    }
    
    // Tag insights
    if (evidence.tags && evidence.tags.length > 0) {
      insights.push(`Tagged as: ${evidence.tags.join(', ')}. These categories may help organize related evidence.`);
    }
    
    return insights;
  }

  /**
   * Generate summary in plain English
   */
  generateSummary(evidence, keyTerms) {
    const type = evidence.type || 'item';
    const topTerms = keyTerms.slice(0, 3).join(', ');
    
    let summary = `This ${type} evidence `;
    
    if (topTerms) {
      summary += `primarily concerns: ${topTerms}. `;
    }
    
    if (evidence.source) {
      summary += `Source: ${evidence.source}. `;
    }
    
    if (evidence.description) {
      const shortDesc = evidence.description.substring(0, 100);
      summary += `Description: ${shortDesc}${evidence.description.length > 100 ? '...' : ''}`;
    }
    
    return summary;
  }

  /**
   * Generate summary for collection of evidence
   */
  generateCollectionSummary(evidenceList, keyTerms) {
    const types = {};
    evidenceList.forEach(e => {
      types[e.type || 'unknown'] = (types[e.type || 'unknown'] || 0) + 1;
    });
    
    const typesSummary = Object.entries(types)
      .map(([type, count]) => `${count} ${type}`)
      .join(', ');
    
    const topTerms = keyTerms.slice(0, 5).join(', ');
    
    return `Found ${evidenceList.length} pieces of evidence including: ${typesSummary}. Key themes: ${topTerms}.`;
  }

  /**
   * Find patterns in evidence collection
   */
  findPatterns(evidenceList) {
    const patterns = [];
    
    // Group by type
    const byType = {};
    evidenceList.forEach(e => {
      const type = e.type || 'unknown';
      byType[type] = (byType[type] || 0) + 1;
    });
    
    Object.entries(byType).forEach(([type, count]) => {
      if (count > 1) {
        patterns.push(`Multiple ${type} evidence items (${count} total) - may indicate a pattern.`);
      }
    });
    
    // Check for temporal patterns
    const datedEvidence = evidenceList.filter(e => e.date);
    if (datedEvidence.length > 2) {
      patterns.push(`${datedEvidence.length} pieces of evidence have dates - timeline analysis recommended.`);
    }
    
    // Check for tagged patterns
    const allTags = evidenceList.flatMap(e => e.tags || []);
    const tagCounts = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    Object.entries(tagCounts).forEach(([tag, count]) => {
      if (count > 2) {
        patterns.push(`Tag "${tag}" appears ${count} times - may represent a key aspect of the case.`);
      }
    });
    
    return patterns;
  }

  /**
   * Find connections between evidence
   */
  findConnections(evidenceList) {
    const connections = [];
    
    // Find evidence with overlapping tags
    for (let i = 0; i < evidenceList.length; i++) {
      for (let j = i + 1; j < evidenceList.length; j++) {
        const tags1 = new Set(evidenceList[i].tags || []);
        const tags2 = new Set(evidenceList[j].tags || []);
        const overlap = [...tags1].filter(tag => tags2.has(tag));
        
        if (overlap.length > 0) {
          connections.push({
            evidence1: evidenceList[i].id,
            evidence2: evidenceList[j].id,
            connection: `Share tags: ${overlap.join(', ')}`,
            strength: overlap.length
          });
        }
      }
    }
    
    return connections.slice(0, 10); // Limit to top 10 connections
  }

  /**
   * Generate plain English explanation of analysis
   */
  explainAnalysis(analysis) {
    let explanation = '📊 Evidence Analysis Report\n\n';
    
    explanation += `Summary: ${analysis.summary}\n\n`;
    
    if (analysis.importance) {
      explanation += `Importance Level: ${analysis.importance.toUpperCase()}\n`;
      explanation += this.explainImportance(analysis.importance) + '\n\n';
    }
    
    if (analysis.insights && analysis.insights.length > 0) {
      explanation += '💡 Key Insights:\n';
      analysis.insights.forEach((insight, i) => {
        explanation += `${i + 1}. ${insight}\n`;
      });
      explanation += '\n';
    }
    
    if (analysis.keyTerms && analysis.keyTerms.length > 0) {
      explanation += `🔑 Key Terms: ${analysis.keyTerms.slice(0, 5).join(', ')}\n\n`;
    }
    
    if (analysis.patterns && analysis.patterns.length > 0) {
      explanation += '🔍 Patterns Detected:\n';
      analysis.patterns.forEach((pattern, i) => {
        explanation += `${i + 1}. ${pattern}\n`;
      });
      explanation += '\n';
    }
    
    if (analysis.connections && analysis.connections.length > 0) {
      explanation += `🔗 Found ${analysis.connections.length} connections between evidence items\n\n`;
    }
    
    explanation += '💼 Recommendation: Review this analysis carefully and cross-reference with other case materials.';
    
    return explanation;
  }

  /**
   * Explain importance level
   */
  explainImportance(level) {
    const explanations = {
      high: '⚠️  This evidence is highly important and should be given priority attention.',
      medium: '📌 This evidence has moderate importance and should be reviewed thoroughly.',
      low: '📝 This evidence provides supporting context but may not be critical.',
      unknown: 'ℹ️  The importance of this evidence needs further evaluation.'
    };
    
    return explanations[level] || explanations.unknown;
  }
}

module.exports = EvidenceAnalyzer;
