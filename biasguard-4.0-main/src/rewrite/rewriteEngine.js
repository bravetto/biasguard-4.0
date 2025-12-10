// Rewrite Engine
// Removes stereotype clauses and replaces with neutral comparative structures
// Template-based rewrite system for coherent, neutral output

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
    // Template-based rewrite system for coherent, neutral output
    
    // Split into sentences for better processing
    const sentences = this.splitIntoSentences(text);
    const rewrittenSentences = [];
    
    // Process each sentence
    for (const sentence of sentences) {
      let rewrittenSentence = sentence.trim();
      let needsReplacement = false;
      
      // 1. Universal Claims → Qualified Statements
      if (/\b(all|every|each|everyone|everybody|nobody|no\s+one)\s+\w+\s+(are|is|do|does|have|has|can|cannot|can'?t)\b/gi.test(rewrittenSentence)) {
        rewrittenSentence = rewrittenSentence.replace(
          /\b(all|every|each)\s+(\w+)\s+(are|is)\s+(\w+)/gi,
          (match, quantifier, subject, verb, predicate) => {
            needsReplacement = true;
            const verbForm = verb === 'are' ? 'are' : 'is';
            return `Some ${subject} ${verbForm} ${predicate}`;
          }
        );
        rewrittenSentence = rewrittenSentence.replace(
          /\b(everyone|everybody|nobody|no\s+one)\s+(are|is|do|does|have|has|can|cannot|can'?t)\s+(\w+)/gi,
          (match, subject, verb, predicate) => {
            needsReplacement = true;
            return `Some individuals ${verb} ${predicate}`;
          }
        );
        rewrittenSentence = rewrittenSentence.replace(
          /\b(\w+)\s+(always|never|all)\s+(do|does|are|is|have|has|can|cannot|can'?t)\s+(\w+)/gi,
          (match, subject, adverb, verb, predicate) => {
            needsReplacement = true;
            return `${subject} sometimes ${verb} ${predicate}`;
          }
        );
      }
      
      // 2. Essentialism → Contingency
      if (/\b(inherently|naturally|born|genetic|biological|innate|in\s+their\s+nature|by\s+nature)\b/gi.test(rewrittenSentence)) {
        rewrittenSentence = rewrittenSentence.replace(
          /\b(\w+)\s+(are|is)\s+inherently\s+(\w+)/gi,
          (match, subject, verb, trait) => {
            needsReplacement = true;
            const verbForm = verb === 'are' ? 'are' : 'is';
            return `Some ${subject} ${verbForm} ${trait}`;
          }
        );
        rewrittenSentence = rewrittenSentence.replace(
          /\b(it'?s|it\s+is)\s+(just|simply|merely)\s+(part\s+of|in)\s+(their|the)\s+(culture|nature|way|tradition)/gi,
          () => {
            needsReplacement = true;
            return 'This may be observed in some cases';
          }
        );
        rewrittenSentence = rewrittenSentence.replace(
          /\b(\w+)\s+(are|is)\s+naturally\s+(\w+)/gi,
          (match, subject, verb, trait) => {
            needsReplacement = true;
            const verbForm = verb === 'are' ? 'are' : 'is';
            return `Some ${subject} ${verbForm} ${trait}`;
          }
        );
      }
      
      // 3. Cultural Essentialism → Variation
      if (/\b(it'?s|it\s+is)\s+(just|simply|merely)\s+(part\s+of|in)\s+(their|the)\s+(culture|nature|way|tradition|heritage)\b/gi.test(rewrittenSentence)) {
        rewrittenSentence = rewrittenSentence.replace(
          /\b(it'?s|it\s+is)\s+(just|simply|merely)\s+(part\s+of|in)\s+(their|the)\s+(culture|nature|way|tradition|heritage)\b/gi,
          () => {
            needsReplacement = true;
            return 'Cultural practices vary among individuals';
          }
        );
      }
      
      // 4. Superiority/Inferiority → Neutral Comparison
      if (/\b(better|worse|superior|inferior)\s+(than|to)\b/gi.test(rewrittenSentence)) {
        rewrittenSentence = rewrittenSentence.replace(
          /\b(\w+)\s+(are|is)\s+(better|worse|superior|inferior)\s+(than|to)\s+(\w+)/gi,
          (match, subject1, verb, comparison, prep, subject2) => {
            needsReplacement = true;
            return `${subject1} and ${subject2} differ in their characteristics`;
          }
        );
      }
      
      // 5. Exclusionary Language → Inclusive Language
      if (/\b(real|true|actual|genuine|authentic)\s+\w+\s+(don'?t|doesn'?t|aren'?t|isn'?t|can'?t|cannot)\b/gi.test(rewrittenSentence)) {
        rewrittenSentence = rewrittenSentence.replace(
          /\b(real|true|actual|genuine|authentic)\s+(\w+)\s+(don'?t|doesn'?t|aren'?t|isn'?t|can'?t|cannot)\s+(\w+)/gi,
          (match, qualifier, subject, verb, predicate) => {
            needsReplacement = true;
            return `Some ${subject} ${verb} ${predicate}, while others do`;
          }
        );
      }
      
      // 6. Prescriptive Judgments → Observations
      if (/\b(should|ought|must|shouldn'?t|mustn'?t|ought\s+not)\s+\w+/gi.test(rewrittenSentence)) {
        rewrittenSentence = rewrittenSentence.replace(
          /\b(\w+)\s+(should|ought|must)\s+(\w+)/gi,
          (match, subject, modal, action) => {
            needsReplacement = true;
            return `Some ${subject} choose to ${action}`;
          }
        );
      }
      
      // 7. Competence Assumptions → Open Possibility
      if (/\b(can'?t|cannot|lack|unable|incapable|incompetent|inadequate|fail\s+to|struggle\s+with)\b/gi.test(rewrittenSentence)) {
        rewrittenSentence = rewrittenSentence.replace(
          /\b(\w+)\s+(can'?t|cannot|lack|unable|incapable)\s+(\w+)/gi,
          (match, subject, negation, ability) => {
            needsReplacement = true;
            return `${subject} may face challenges with ${ability}`;
          }
        );
      }
      
      // 8. Remove demeaning attributions (replace with neutral language)
      const demeaningWords = /\b(lazy|stupid|dumb|ignorant|incompetent|unreliable|untrustworthy|violent|aggressive|passive|weak|inferior|backwards|primitive|savage|uncivilized|dishonest|deceptive)\b/gi;
      if (demeaningWords.test(rewrittenSentence)) {
        rewrittenSentence = rewrittenSentence.replace(demeaningWords, (match) => {
          needsReplacement = true;
          // Replace with neutral descriptor or remove
          return 'certain characteristics';
        });
      }
      
      // 9. Neutralize causal links
      // Pattern: "Because they are X, they cannot Y"
      if (/\b(because|since|as)\s+(they|those|these|immigrants?|people)\s+(are|is)\s+(\w+)/gi.test(rewrittenSentence)) {
        // Match full causal statements: "Because they are X, they cannot Y"
        rewrittenSentence = rewrittenSentence.replace(
          /\b(because|since|as)\s+(they|those|these|immigrants?|people)\s+(are|is)\s+(\w+),?\s+(they|those|these|immigrants?|people)\s+(are|is|have|has|do|does|cannot|can'?t|unable)\s+(\w+)/gi,
          () => {
            needsReplacement = true;
            return 'Trustworthiness varies among individuals and cannot be determined by group membership';
          }
        );
        // Match partial causal statements: "Because they are X, they cannot be Y"
        rewrittenSentence = rewrittenSentence.replace(
          /\b(because|since|as)\s+(they|those|these|immigrants?|people)\s+(are|is)\s+(\w+),?\s+(they|those|these|immigrants?|people)\s+(cannot|can'?t|unable)\s+be\s+(\w+)/gi,
          () => {
            needsReplacement = true;
            return 'Trustworthiness varies among individuals and cannot be determined by group membership';
          }
        );
        // Match simpler: "Because they are X"
        rewrittenSentence = rewrittenSentence.replace(
          /\b(because|since|as)\s+(they|those|these|immigrants?|people)\s+(are|is)\s+(\w+)/gi,
          () => {
            needsReplacement = true;
            return 'Individual characteristics vary among people';
          }
        );
      }
      
      // Pattern: "Since they come from X, they are Y"
      if (/\b(since|because|as)\s+(they|people|immigrants?)\s+come\s+from/i.test(rewrittenSentence)) {
        rewrittenSentence = rewrittenSentence.replace(
          /\b(since|because|as)\s+(they|people|immigrants?)\s+come\s+from\s+(\w+),?\s+(they|people)\s+(are|is)\s+(\w+)/gi,
          () => {
            needsReplacement = true;
            return 'Individual characteristics vary among people regardless of origin';
          }
        );
      }
      
      // If sentence was heavily modified or needs complete replacement, use template
      if (needsReplacement && rewrittenSentence.trim().length < sentence.trim().length * 0.4) {
        // Sentence was too heavily modified, use template
        const template = neutralityTemplates.selectTemplate(biasPatterns, protectedClasses);
        rewrittenSentences.push(template);
      } else if (needsReplacement) {
        // Ensure the rewritten sentence is coherent
        const trimmedSentence = rewrittenSentence.trim();
        // If it's too short or looks like a fragment, use template
        if (trimmedSentence.length < 20 || !/\b(is|are|was|were|have|has|do|does|can|could|will|would|should|may|might|must|vary|differ|exist|contribute|influence|affect)\b/i.test(trimmedSentence)) {
          const template = neutralityTemplates.selectTemplate(biasPatterns, protectedClasses);
          rewrittenSentences.push(template);
        } else {
          rewrittenSentences.push(trimmedSentence);
        }
      } else if (biasPatterns.length > 0) {
        // Has bias patterns but sentence wasn't modified - add neutral template
        const template = neutralityTemplates.selectTemplate(biasPatterns, protectedClasses);
        rewrittenSentences.push(template);
      } else {
        // No bias detected, keep original
        rewrittenSentences.push(rewrittenSentence);
      }
    }
    
    // Combine sentences
    let rewritten = rewrittenSentences.join('. ').trim();
    
    // If no sentences were rewritten or result is too short, use template
    if (rewritten.trim().length < text.trim().length * 0.3 && biasPatterns.length > 0) {
      const template = neutralityTemplates.selectTemplate(biasPatterns, protectedClasses);
      rewritten = template;
    }
    
    // Clean up
    rewritten = rewritten.replace(/\s+/g, ' ').trim();
    rewritten = rewritten.replace(/\s*,\s*,/g, ',');
    rewritten = rewritten.replace(/\s*\.\s*\./g, '.');
    rewritten = rewritten.replace(/^\.+\s*/, ''); // Remove leading periods
    rewritten = rewritten.replace(/\s*\.+$/, '.'); // Ensure single trailing period
    
    // Ensure it ends with proper punctuation
    if (rewritten.length > 0 && !/[.!?]$/.test(rewritten)) {
      rewritten += '.';
    }
    
    // Check coherence
    const coherence = this.coherenceCheck.check(rewritten);
    
    // If incoherent, use template
    if (!coherence.coherent && coherence.quality === 'incoherent') {
      rewritten = neutralityTemplates.selectTemplate(biasPatterns, protectedClasses);
      // Re-check coherence after using template
      const newCoherence = this.coherenceCheck.check(rewritten);
      return {
        suggested_rewrite: rewritten.trim(),
        explanation: biasPatterns.length > 0
          ? `Removed bias patterns: ${biasPatterns.join(', ')}. Replaced with neutral language that acknowledges individual variation.`
          : 'Text reviewed for bias. No significant bias patterns detected.',
        rewrite_quality: newCoherence.quality
      };
    }
    
    const explanation = biasPatterns.length > 0
      ? `Removed bias patterns: ${biasPatterns.join(', ')}. Replaced with neutral language that acknowledges individual variation.`
      : 'Text reviewed for bias. No significant bias patterns detected.';
    
    return {
      suggested_rewrite: rewritten.trim(),
      explanation: explanation,
      rewrite_quality: coherence.quality
    };
  }
  
  splitIntoSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }
}

module.exports = RewriteEngine;

