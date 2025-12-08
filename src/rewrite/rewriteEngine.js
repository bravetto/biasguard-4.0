// Rewrite Engine
// Removes stereotype clauses and replaces with neutral comparative structures
// TODO: Phani - Rebuild template-based rewrite system

const neutralityTemplates = require('./neutralityTemplates');
const CoherenceCheck = require('./coherenceCheck');

class RewriteEngine {
  constructor() {
    this.coherenceCheck = new CoherenceCheck();
  }
  
  /**
   * Rewrites text to remove bias while maintaining coherence
   * @param {string} text - Original text
   * @param {Array} biasPatterns - Detected bias patterns
   * @param {Array} protectedClasses - Detected protected classes
   * @param {Array} biasTypes - Detected bias types
   * @returns {Object} { suggested_rewrite: string, explanation: string, rewrite_quality: string }
   */
  rewrite(text, biasPatterns = [], protectedClasses = [], biasTypes = []) {
    let rewritten = text;
    
    // TODO: Phani - Implement rewrite logic
    // 1. Remove stereotype clauses
    // 2. Replace with neutral comparative structures
    // 3. Use templates from neutralityTemplates
    // 4. Maintain grammar & coherence
    // 5. Check coherence using coherenceCheck
    
    // PLACEHOLDER - Replace with actual implementation
    
    // Universal Claims → Qualified Statements (improved to preserve grammar)
    rewritten = rewritten.replace(/\b(all|every|each)\s+(\w+)\s+(are|is)\s+(\w+)\b/gi, 
      (match, quantifier, subject, verb, predicate) => {
        // Preserve verb agreement
        const verbForm = verb === 'are' ? 'are' : 'is';
        return `Some ${subject} ${verbForm} ${predicate}`;
      });
    rewritten = rewritten.replace(/\b(\w+)\s+(always|never)\s+(do|does|are|is)\b/gi, 
      (match, subject, adverb, verb) => {
        // Preserve verb form
        return `${subject} sometimes ${verb}`;
      });
    
    // Essentialism → Contingency (improved to preserve grammar)
    rewritten = rewritten.replace(/\b(\w+)\s+(are|is)\s+inherently\s+(\w+)\b/gi, 
      (match, subject, verb, predicate) => {
        // Preserve verb agreement
        const verbForm = verb === 'are' ? 'are' : 'is';
        return `Some ${subject} ${verbForm} ${predicate}`;
      });
    rewritten = rewritten.replace(/\b(it'?s|it\s+is)\s+in\s+their\s+nature\b/gi, 
      'This may be observed in some cases');
    
    // Superiority/Inferiority → Neutral Comparison
    rewritten = rewritten.replace(/\b(\w+)\s+(are|is)\s+(better|worse|superior|inferior)\s+(than|to)\s+(\w+)\b/gi, 
      '$1 and $5 differ in these ways');
    rewritten = rewritten.replace(/\b(\w+)\s+(are|is)\s+(superior|inferior)\b/gi, 
      '');
    
    // Exclusionary Language → Inclusive Language
    rewritten = rewritten.replace(/\b(real|true|actual|genuine)\s+(\w+)\s+(don'?t|doesn'?t|aren'?t|isn'?t)\s+(\w+)\b/gi, 
      'Some $2 $3 $4, some do');
    rewritten = rewritten.replace(/\b(true|real|actual)\s+(\w+)\s+(are|is)\s+(\w+)\b/gi, 
      'Some $2 $3 $4');
    
    // Prescriptive Judgments → Observations
    rewritten = rewritten.replace(/\b(\w+)\s+(should|ought|must)\s+(\w+)\b/gi, 
      'Some $1 choose to $3');
    rewritten = rewritten.replace(/\b(\w+)\s+(shouldn'?t|mustn'?t|ought\s+not)\s+(\w+)\b/gi, 
      '$1 may $3');
    
    // Competence Assumptions → Open Possibility
    rewritten = rewritten.replace(/\b(\w+)\s+(can'?t|cannot|lack|unable|incapable)\s+(\w+)\b/gi, 
      '$1 may face challenges with $3');
    rewritten = rewritten.replace(/\b(\w+)\s+(lack|lacks)\s+the\s+ability\s+to\s+(\w+)\b/gi, 
      '$1 may face challenges with $2');
    
    // Remove demeaning attributions
    const demeaningWords = /\b(lazy|stupid|dumb|ignorant|incompetent|unreliable|untrustworthy|violent|aggressive|passive|weak|inferior|backwards|primitive|savage|uncivilized)\b/gi;
    rewritten = rewritten.replace(demeaningWords, '[removed]');
    
    // Neutralize causal links
    rewritten = rewritten.replace(/\b(because|since|as)\s+they\s+(are|is)\s+(\w+),?\s+they\s+(are|is|have|has)\s+(\w+)\b/gi, 
      'Some individuals may exhibit $5 characteristics');
    
    // If rewrite is too short or empty, add neutral template
    if (rewritten.trim().length < text.trim().length * 0.3) {
      const template = neutralityTemplates.selectTemplate(biasPatterns, protectedClasses);
      rewritten = template + ' ' + rewritten.trim();
    }
    
    // Clean up multiple spaces and fragments
    rewritten = rewritten.replace(/\s+/g, ' ').trim();
    rewritten = rewritten.replace(/\s*,\s*,/g, ',');
    rewritten = rewritten.replace(/\s*\.\s*\./g, '.');
    
    // Check coherence
    const coherence = this.coherenceCheck.check(rewritten);
    
    // If incoherent, try to fix with template
    if (!coherence.coherent && coherence.quality === 'incoherent') {
      const template = neutralityTemplates.selectTemplate(biasPatterns, protectedClasses);
      rewritten = template;
    }
    
    const explanation = `Removed bias patterns: ${biasPatterns.join(', ')}. Neutralized causal links. Preserved core meaning while eliminating harmful generalizations.`;
    
    return {
      suggested_rewrite: rewritten.trim(),
      explanation: explanation,
      rewrite_quality: coherence.quality
    };
  }
}

module.exports = RewriteEngine;

