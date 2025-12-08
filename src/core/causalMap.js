// Causal Inference Bias Mapper
// Links identity → trait → harm patterns

module.exports = {
  // Identity → Traits patterns
  identityToTrait: /\b(because|since|as)\s+they\s+(are|is)\s+\w+.*(are|is|have|has)\s+\w+/gi,
  
  // Identity → Competence patterns
  identityToCompetence: /\b(naturally|inherently|genetically|born)\s+(good|bad|better|worse|at|with)\s+\w+/gi,
  
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
    
    for (const sentence of sentences) {
      if (this.hasProtectedClass(sentence, protectedClasses)) {
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
    
    return {
      detected: explanations.length > 0,
      explanations
    };
  },
  
  hasProtectedClass(sentence, protectedClasses) {
    const lowerSentence = sentence.toLowerCase();
    return protectedClasses.some(pc => lowerSentence.includes(pc.toLowerCase()));
  },
  
  splitIntoSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }
};

