// Coherence Check
// Validates that rewrites contain subject + verb and no fragments
// Comprehensive coherence validation with enhanced pattern detection

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
    
    // 1. Basic validation
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
    
    // Enhanced subject-verb patterns (more comprehensive)
    const enhancedSubjectVerbPatterns = [
      /\b(\w+)\s+(is|are|was|were|has|have|had|do|does|did|can|could|will|would|should|may|might|must)\s+/i,
      /\b(\w+)\s+(vary|differs?|exhibits?|shows?|demonstrates?|indicates?|suggests?|appears?|seems?)\s+/i,
      /\b(individual|people|persons?|groups?|characteristics?|outcomes?|factors?|variation|differences?)\s+(exist|vary|differ|contribute|influence|affect)/i,
      /\b(this|that|these|those|it)\s+(may|might|can|could|should|will|would|is|are|was|were)\s+/i
    ];
    
    // Enhanced fragment patterns
    const enhancedFragmentPatterns = [
      /^\s*(and|but|or|so|because|since|although|though|however|therefore|thus|hence)\s+/i, // Starts with conjunction
      /^\s*[^.!?]*,\s*$/, // Ends with comma only (incomplete)
      /^\s*[^.!?]*\s+and\s*$/, // Ends with "and"
      /^\s*[^.!?]*\s+or\s*$/, // Ends with "or"
      /^\s*[^.!?]*\s+but\s*$/, // Ends with "but"
      /^\s*[^.!?]*\s+[.!?]\s*$/, // Just punctuation
      /^\s*\[removed\]\s*$/i, // Just [removed] placeholder
      /^\s*\.+\s*$/, // Just periods
    ];
    
    let fragmentCount = 0;
    let validSentenceCount = 0;
    
    // 2. Check each sentence
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      
      // Skip very short sentences (might be valid)
      if (sentence.split(/\s+/).length <= 2) {
        validSentenceCount++;
        continue;
      }
      
      let hasSubjectVerb = false;
      
      // Check for subject-verb structure
      for (const pattern of enhancedSubjectVerbPatterns) {
        pattern.lastIndex = 0; // Reset regex state
        if (pattern.test(sentence)) {
          hasSubjectVerb = true;
          break;
        }
      }
      
      // Check for fragments
      let isFragment = false;
      for (const fragmentPattern of enhancedFragmentPatterns) {
        fragmentPattern.lastIndex = 0;
        if (fragmentPattern.test(sentence)) {
          isFragment = true;
          fragmentCount++;
          issues.push(`Sentence ${i + 1} appears to be a fragment: "${sentence.substring(0, 60)}..."`);
          break;
        }
      }
      
      if (!isFragment) {
        if (hasSubjectVerb) {
          validSentenceCount++;
        } else {
          // No subject-verb found, but not a clear fragment
          // Check if it's a valid short sentence or needs fixing
          if (sentence.split(/\s+/).length > 5) {
            issues.push(`Sentence ${i + 1} may lack clear subject-verb structure: "${sentence.substring(0, 60)}..."`);
            if (quality === 'coherent') quality = 'fragment';
          } else {
            // Very short, might be valid
            validSentenceCount++;
          }
        }
      }
    }
    
    // 3. Determine overall quality
    const validRatio = validSentenceCount / sentences.length;
    
    if (validRatio === 1.0 && fragmentCount === 0) {
      quality = 'coherent';
    } else if (validRatio >= 0.5 && fragmentCount < sentences.length / 2) {
      quality = 'fragment';
    } else {
      quality = 'incoherent';
    }
    
    // 4. Additional checks
    // Check for too many [removed] placeholders
    const removedCount = (rewrite.match(/\[removed\]/gi) || []).length;
    if (removedCount > sentences.length / 2) {
      quality = 'incoherent';
      issues.push('Too many removed placeholders');
    }
    
    // Check for excessive punctuation issues
    if (/\s*\.\s*\.\s*\./.test(rewrite) || /\s*,\s*,\s*/.test(rewrite)) {
      if (quality === 'coherent') quality = 'fragment';
      issues.push('Punctuation issues detected');
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

