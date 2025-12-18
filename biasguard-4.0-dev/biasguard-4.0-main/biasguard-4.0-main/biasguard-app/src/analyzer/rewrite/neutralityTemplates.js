// Neutrality Templates
// Provides neutral rewrite templates for bias removal

module.exports = {
  templates: [
    "Individual outcomes vary based on experience and opportunity.",
    "No group is defined by a single trait.",
    "People differ in their characteristics and abilities regardless of background.",
    "Variation exists within all groups.",
    "Individual factors contribute to differences in outcomes.",
    "Multiple factors influence individual performance and behavior.",
    "Characteristics vary among individuals regardless of group membership.",
    "Outcomes depend on a combination of individual and environmental factors."
  ],
  
  /**
   * Selects appropriate template based on context
   * @param {Array} biasPatterns - Detected bias patterns
   * @param {Array} protectedClasses - Detected protected classes
   * @returns {string} Selected template
   */
  selectTemplate(biasPatterns = [], protectedClasses = []) {
    // Default template
    if (biasPatterns.length === 0) {
      return this.templates[0];
    }
    
    // Universal claims → variation template
    if (biasPatterns.some(p => p.toLowerCase().includes('universal'))) {
      return this.templates[3]; // "Variation exists within all groups."
    }
    
    // Essentialism → individual factors template
    if (biasPatterns.some(p => p.toLowerCase().includes('essentialism'))) {
      return this.templates[4]; // "Individual factors contribute to differences in outcomes."
    }
    
    // Competence assumptions → multiple factors template
    if (biasPatterns.some(p => p.toLowerCase().includes('competence'))) {
      return this.templates[5]; // "Multiple factors influence individual performance and behavior."
    }
    
    // Default
    return this.templates[0];
  }
};

