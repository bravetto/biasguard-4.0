// Group Generalization Detector
// Detects universal claims (always, never, everyone, etc.) that indicate stereotyping
// Implements comprehensive universal claim detection

const biasPatterns = require('../core/biasPatterns');

class GroupGeneralizationDetector {
  constructor() {
    this.universalPatterns = [
      biasPatterns.universal_claims,
      /\b(always|never|all|every|each|everyone|everybody|nobody|no\s+one)\s+\w+\b/gi,
      /\b\w+\s+(always|never|all|every|each)\s+\w+\b/gi
    ];
  }
  
  /**
   * Detects universal claims indicating stereotyping
   * @param {string} text - Text to analyze
   * @returns {Object} { detected: boolean, patterns: [], examples: [] }
   */
  detect(text) {
    const patterns = [];
    const examples = [];
    const sentences = this.splitIntoSentences(text);
    
    // Enhanced universal claim patterns
    const enhancedPatterns = [
      // "All X are Y" / "Every X is Y" / "Each X does Y"
      /\b(all|every|each)\s+\w+\s+(are|is|do|does|have|has|can|cannot|can'?t)\s+\w+/gi,
      // "X always/never Y"
      /\b\w+\s+(always|never|all|every|each)\s+\w+/gi,
      // "Everyone/everybody/nobody does X"
      /\b(everyone|everybody|nobody|no\s+one|no\s+one)\s+\w+\s+(are|is|do|does|have|has|can|cannot|can'?t)\b/gi,
      // "X are all Y" / "X is always Y"
      /\b\w+\s+(are|is)\s+(all|always|never|every|each)\s+\w+/gi,
      // "All of them" / "Every one of them"
      /\b(all|every|each)\s+(of\s+)?(them|those|these|they)\s+(are|is|do|does|have|has|can|cannot|can'?t)\b/gi,
      // "They all/always/never"
      /\b(they|those|these)\s+(all|always|never|every|each)\s+\w+/gi,
      // "X never/always do Y"
      /\b\w+\s+(never|always)\s+(do|does|are|is|have|has|can|cannot|can'?t)\s+\w+/gi
    ];
    
    // Check each pattern
    for (const pattern of enhancedPatterns) {
      // Reset regex lastIndex to avoid state issues
      pattern.lastIndex = 0;
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        if (!patterns.includes('Universal Claims')) {
          patterns.push('Universal Claims');
        }
        
        // Extract example sentences containing these patterns
        for (const sentence of sentences) {
          pattern.lastIndex = 0; // Reset for each sentence
          if (pattern.test(sentence)) {
            const example = sentence.trim().substring(0, 150);
            if (example && example.length > 10 && !examples.includes(example)) {
              examples.push(example);
            }
          }
        }
      }
    }
    
    // Also check the original universalPatterns from biasPatterns
    for (const pattern of this.universalPatterns) {
      pattern.lastIndex = 0; // Reset regex state
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        if (!patterns.includes('Universal Claims')) {
          patterns.push('Universal Claims');
        }
        
        // Extract example sentences
        for (const sentence of sentences) {
          pattern.lastIndex = 0;
          if (pattern.test(sentence)) {
            const example = sentence.trim().substring(0, 150);
            if (example && example.length > 10 && !examples.includes(example)) {
              examples.push(example);
            }
          }
        }
      }
    }
    
    return {
      detected: patterns.length > 0,
      patterns: [...new Set(patterns)],
      examples: examples.slice(0, 5) // Limit to 5 examples
    };
  }
  
  splitIntoSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }
}

module.exports = GroupGeneralizationDetector;

