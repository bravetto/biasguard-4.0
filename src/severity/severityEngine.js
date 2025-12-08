// Severity Engine
// Calculates bias severity scores (0-10) based on bias types, protected classes, and harm potential

const biasTypes = require('../core/biasTypes');
const causalMap = require('../core/causalMap');
const QualifierDampening = require('./qualifierDampening');

class SeverityEngine {
  constructor() {
    this.qualifierDampening = new QualifierDampening();
  }
  
  /**
   * Calculates severity score
   * @param {Array} biasTypesList - Detected bias types
   * @param {Array} protectedClasses - Detected protected classes
   * @param {Array} biasPatterns - Detected bias patterns
   * @param {string} text - Original text
   * @returns {Object} { score: 0-10, bias_level: string, reasoning: string }
   */
  calculate(biasTypesList, protectedClasses, biasPatterns, text) {
    // Base score from bias types
    let baseScore = 0;
    if (biasTypesList.length > 0) {
      baseScore = Math.max(...biasTypesList.map(type => 
        biasTypes.types[type] || 0
      ));
    }
    
    // Protected class multiplier
    const numClasses = protectedClasses.length;
    const protectedClassMultiplier = numClasses > 1 ? 1.0 + (numClasses - 1) * 0.1 : 1.0;
    
    // Harm potential
    let harmAdjustment = 0;
    const harmText = text.toLowerCase();
    
    for (const [harmType, pattern] of Object.entries(causalMap.harmPatterns)) {
      if (pattern.test(harmText)) {
        switch(harmType) {
          case 'physical': harmAdjustment += 2.0; break;
          case 'psychological': harmAdjustment += 1.0; break;
          case 'economic': harmAdjustment += 1.0; break;
          case 'social_exclusion': harmAdjustment += 0.5; break;
          case 'denial_of_rights': harmAdjustment += 1.5; break;
        }
      }
    }
    
    // Domain risk (default to media/public discourse)
    const domainAdjustment = 0.5;
    
    // Calculate raw score
    const rawScore = (baseScore * protectedClassMultiplier) + harmAdjustment + domainAdjustment;
    
    // Apply qualifier dampening
    const qualifierInfo = this.qualifierDampening.checkQualifiers(text);
    const finalScore = this.qualifierDampening.dampen(
      rawScore, 
      qualifierInfo, 
      protectedClasses, 
      biasPatterns
    );
    
    // Determine bias level
    let biasLevel = 'none';
    if (finalScore === 0) biasLevel = 'none';
    else if (finalScore <= 3) biasLevel = 'mild';
    else if (finalScore <= 6) biasLevel = 'moderate';
    else biasLevel = 'high';
    
    const reasoning = `Base score ${baseScore.toFixed(1)} (${biasTypesList.join(', ')}) × ${protectedClassMultiplier.toFixed(1)} (${numClasses} protected classes) + ${harmAdjustment.toFixed(1)} (harm) + ${domainAdjustment.toFixed(1)} (domain)${qualifierInfo.hasQualifiers ? ` - ${(rawScore - finalScore).toFixed(1)} (qualifiers)` : ''} = ${finalScore}`;
    
    return {
      score: finalScore,
      bias_level: biasLevel,
      reasoning: reasoning
    };
  }
}

module.exports = SeverityEngine;

