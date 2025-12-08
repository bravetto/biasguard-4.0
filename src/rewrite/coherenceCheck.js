// Coherence Check
// Validates that rewrites contain subject + verb and no fragments
// TODO: Phani - Implement coherence validation

class CoherenceCheck {
  constructor() {
    // Basic sentence structure patterns
    this.subjectVerbPattern = /\b(\w+)\s+(is|are|was|were|has|have|had|do|does|did|can|could|will|would|should|may|might|must)\s+/i;
    this.fragmentPatterns = [
      /^[^.!?]*[.!?]\s*$/, // Incomplete sentences
      /^\s*(and|but|or|so|because|since|although|though)\s+/i, // Starts with conjunction
      /^[^.!?]*,\s*$/, // Ends with comma only
    ];
  }
  
  /**
   * Checks if rewrite is coherent
   * @param {string} rewrite - Rewritten text
   * @returns {Object} { coherent: boolean, quality: string, issues: [] }
   */
  check(rewrite) {
    const issues = [];
    let quality = 'coherent';
    
    // TODO: Phani - Implement coherence validation
    // 1. Check for subject + verb in each sentence
    // 2. Detect fragments (incomplete sentences)
    // 3. Check for grammatical completeness
    // 4. Return quality: "coherent" | "fragment" | "incoherent"
    
    // PLACEHOLDER - Replace with actual implementation
    if (!rewrite || rewrite.trim().length === 0) {
      return {
        coherent: false,
        quality: 'incoherent',
        issues: ['Empty rewrite']
      };
    }
    
    const sentences = this.splitIntoSentences(rewrite);
    
    if (sentences.length === 0) {
      return {
        coherent: false,
        quality: 'incoherent',
        issues: ['No sentences detected']
      };
    }
    
    // Check each sentence for subject + verb
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      
      // Check for fragments
      for (const fragmentPattern of this.fragmentPatterns) {
        if (fragmentPattern.test(sentence)) {
          issues.push(`Sentence ${i + 1} appears to be a fragment: "${sentence.substring(0, 50)}..."`);
          quality = 'fragment';
        }
      }
      
      // Check for subject + verb
      if (!this.subjectVerbPattern.test(sentence)) {
        // Allow for very short sentences that might be valid
        if (sentence.split(/\s+/).length > 3) {
          issues.push(`Sentence ${i + 1} may lack subject-verb structure: "${sentence.substring(0, 50)}..."`);
          if (quality === 'coherent') quality = 'fragment';
        }
      }
    }
    
    // If multiple issues, mark as incoherent
    if (issues.length > sentences.length / 2) {
      quality = 'incoherent';
    }
    
    return {
      coherent: quality === 'coherent',
      quality: quality,
      issues: issues
    };
  }
  
  splitIntoSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }
}

module.exports = CoherenceCheck;

