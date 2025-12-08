// Group Generalization Detector
// Detects universal claims (always, never, everyone, etc.) that indicate stereotyping
// TODO: Phani - Implement universal claim detection

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
    
    // TODO: Phani - Implement detection logic
    // 1. Check for universal claim patterns (always, never, all, every, everyone)
    // 2. Extract example sentences containing these patterns
    // 3. Return detected patterns and examples
    
    // PLACEHOLDER - Replace with actual implementation
    const sentences = this.splitIntoSentences(text);
    
    for (const pattern of this.universalPatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        patterns.push('Universal Claims');
        
        // Extract example sentences
        for (const sentence of sentences) {
          if (pattern.test(sentence)) {
            const example = sentence.trim().substring(0, 150);
            if (example && !examples.includes(example)) {
              examples.push(example);
            }
          }
        }
        break; // Found universal claim, no need to check others
      }
    }
    
    return {
      detected: patterns.length > 0,
      patterns: [...new Set(patterns)],
      examples: examples
    };
  }
  
  splitIntoSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }
}

module.exports = GroupGeneralizationDetector;

