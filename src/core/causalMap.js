// Causal Inference Bias Mapper
// Links identity → trait → harm patterns

module.exports = {
  // Identity → Traits patterns (expanded to catch more cases)
  identityToTrait: /\b(because|since|as)\s+(they|women|men|people|individuals)\s+(are|is)\s+\w+.*(are|is|have|has|lack|lack\s+the)\s+\w+/gi,
  
  // Identity → Competence patterns (expanded to catch more cases)
  identityToCompetence: /\b(naturally|inherently|genetically|born|in\s+their\s+nature)\s+(good|bad|better|worse|at|with|lack|have|has)\s+\w+/gi,
  
  // Identity → Value patterns
  identityToValue: /\b(more|less)\s+(valuable|important|worthy|significant|meaningful)/gi,
  
  // Identity → Permissions patterns
  identityToPermissions: /\b(should|shouldn't|must|mustn't|ought|allowed|permitted|forbidden)\s+.*(because|since|as)\s+they\s+(are|is)/gi,
  
  // Harm patterns
  harmPatterns: {
    physical: /\b(kill|murder|violence|attack|harm|hurt|injure|destroy|eliminate)\b/gi,
    psychological: /\b(hate|despise|disgust|shame|humiliate|degrade|insult)\b/gi,
    economic: /\b(fire|unemployed|poor|poverty|wage|salary|income)\b/gi,
    social_exclusion: /\b(exclude|ban|reject|outcast|isolate|shun)\b/gi,
    denial_of_rights: /\b(deny|forbid|prohibit|restrict|limit|ban)\b/gi
  },
  
  // Extract causal explanations from text
  extractCausalBias(text, protectedClasses) {
    const explanations = [];
    const sentences = this.splitIntoSentences(text);
    
    // Also check full text for patterns that span sentences
    const fullTextLower = text.toLowerCase();
    const hasProtectedClassInText = protectedClasses.length > 0 || 
      /\b(women|men|female|male|black|white|asian|african|hispanic|latino|latina)\b/i.test(text);
    
    for (const sentence of sentences) {
      const sentenceLower = sentence.toLowerCase();
      const hasProtectedClassInSentence = this.hasProtectedClass(sentence, protectedClasses) || 
        /\b(women|men|female|male|black|white|asian|african|hispanic|latino|latina)\b/i.test(sentence);
      
      if (hasProtectedClassInSentence || hasProtectedClassInText) {
        // Reset regex lastIndex to avoid state issues
        this.identityToTrait.lastIndex = 0;
        this.identityToCompetence.lastIndex = 0;
        this.identityToValue.lastIndex = 0;
        this.identityToPermissions.lastIndex = 0;
        
        if (this.identityToTrait.test(sentence)) {
          explanations.push(`Identity → Traits: "${sentence.trim().substring(0, 100)}..."`);
        }
        if (this.identityToCompetence.test(sentence)) {
          explanations.push(`Identity → Competence: "${sentence.trim().substring(0, 100)}..."`);
        }
        if (this.identityToValue.test(sentence)) {
          explanations.push(`Identity → Value: "${sentence.trim().substring(0, 100)}..."`);
        }
        if (this.identityToPermissions.test(sentence)) {
          explanations.push(`Identity → Permissions: "${sentence.trim().substring(0, 100)}..."`);
        }
      }
    }
    
    // Also check for "because they" patterns in full text
    if (hasProtectedClassInText && /\bbecause\s+(they|women|men|people)\s+(are|is|have|has|lack)\s+\w+/i.test(text)) {
      explanations.push(`Identity → Traits: Causal link detected in text`);
    }
    
    return {
      detected: explanations.length > 0,
      explanations
    };
  },
  
  hasProtectedClass(sentence, protectedClasses) {
    const lowerSentence = sentence.toLowerCase();
    // Check if sentence contains protected class terms or entities
    // Also check for common protected class indicators
    const hasClassTerm = protectedClasses.some(pc => {
      const pcLower = pc.toLowerCase();
      // Direct match
      if (lowerSentence.includes(pcLower)) return true;
      // Common indicators
      if (pcLower === 'gender' && /\b(women|men|female|male|woman|man)\b/i.test(sentence)) return true;
      if (pcLower === 'race' && /\b(black|white|asian|african|hispanic|latino|latina)\b/i.test(sentence)) return true;
      return false;
    });
    return hasClassTerm;
  },
  
  splitIntoSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }
};

