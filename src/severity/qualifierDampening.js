// Qualifier Dampening
// Reduces severity when qualifiers are present (may, might, sometimes, often, however)
// Ensures severity cannot exceed 3 if no identity class, no stereotype, no essentialism
// TODO: Phani - Implement qualifier detection and severity reduction

class QualifierDampening {
  constructor() {
    // Qualifiers that reduce severity
    this.qualifiers = [
      /\b(may|might|could|possibly|perhaps|maybe|sometimes|often|occasionally|rarely|seldom)\b/gi,
      /\b(however|although|though|but|yet|nevertheless|nonetheless|on\s+the\s+other\s+hand)\b/gi,
      /\b(some|certain|many|few|several|various|different|individual|particular)\b/gi,
      /\b(tend\s+to|appear\s+to|seem\s+to|likely|unlikely|probably|possibly)\b/gi,
      /\b(not\s+all|not\s+every|not\s+always|not\s+necessarily)\b/gi
    ];
    
    // Academic/research qualifiers
    this.academicQualifiers = [
      /\b(studies\s+suggest|research\s+indicates|data\s+shows|evidence\s+suggests)\b/gi,
      /\b(according\s+to|based\s+on|findings\s+indicate|results\s+suggest)\b/gi,
      /\b(correlation|association|relationship|may\s+be\s+related)\b/gi
    ];
  }
  
  /**
   * Checks if text contains qualifiers
   * @param {string} text - Text to analyze
   * @returns {Object} { hasQualifiers: boolean, qualifierCount: number, isAcademic: boolean }
   */
  checkQualifiers(text) {
    let qualifierCount = 0;
    let isAcademic = false;
    
    // TODO: Phani - Implement qualifier detection
    // 1. Count qualifiers in text
    // 2. Check for academic qualifiers
    // 3. Return qualifier count and academic flag
    
    // PLACEHOLDER - Replace with actual implementation
    for (const qualifier of this.qualifiers) {
      const matches = text.match(qualifier);
      if (matches) {
        qualifierCount += matches.length;
      }
    }
    
    for (const academic of this.academicQualifiers) {
      if (academic.test(text)) {
        isAcademic = true;
        qualifierCount += 2; // Academic qualifiers count more
      }
    }
    
    return {
      hasQualifiers: qualifierCount > 0,
      qualifierCount,
      isAcademic
    };
  }
  
  /**
   * Applies dampening to severity score
   * @param {number} baseScore - Base severity score (0-10)
   * @param {Object} qualifierInfo - Result from checkQualifiers
   * @param {Array} protectedClasses - Detected protected classes
   * @param {Array} biasPatterns - Detected bias patterns
   * @returns {number} Dampened score (0-10)
   */
  dampen(baseScore, qualifierInfo, protectedClasses = [], biasPatterns = []) {
    // TODO: Phani - Implement dampening logic
    // 1. If no protected classes AND no stereotypes AND no essentialism → max 3
    // 2. Apply qualifier reduction (each qualifier reduces by 0.5-1.0)
    // 3. Academic qualifiers reduce more (1.0-2.0)
    // 4. Return clamped score (0-10)
    
    // PLACEHOLDER - Replace with actual implementation
    let dampenedScore = baseScore;
    
    // Rule: If no identity class, no stereotype, no essentialism → max 3
    const hasEssentialism = biasPatterns.some(p => 
      p.toLowerCase().includes('essentialism') || 
      p.toLowerCase().includes('inherently') ||
      p.toLowerCase().includes('naturally')
    );
    
    const hasStereotype = biasPatterns.some(p => 
      p.toLowerCase().includes('stereotype') ||
      p.toLowerCase().includes('universal')
    );
    
    if (protectedClasses.length === 0 && !hasStereotype && !hasEssentialism) {
      dampenedScore = Math.min(dampenedScore, 3);
    }
    
    // Apply qualifier dampening
    if (qualifierInfo.hasQualifiers) {
      const reduction = qualifierInfo.isAcademic 
        ? Math.min(qualifierInfo.qualifierCount * 1.5, 4.0)
        : Math.min(qualifierInfo.qualifierCount * 0.75, 3.0);
      dampenedScore = Math.max(0, dampenedScore - reduction);
    }
    
    return Math.min(10, Math.max(0, Math.round(dampenedScore * 10) / 10));
  }
}

module.exports = QualifierDampening;

