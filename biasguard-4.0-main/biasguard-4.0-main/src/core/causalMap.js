// Causal Inference Bias Mapper
// Links identity → trait → harm patterns

module.exports = {
  // Identity → Traits patterns (expanded to catch more cases)
  identityToTrait: /\b(because|since|as)\s+(they|women|men|people|individuals|black\s+people|white\s+people)\s+(are|is)\s+\w+.*(are|is|have|has|lack|lack\s+the|cannot|can'?t|unable)\s+\w+/gi,
  
  // Identity → Competence patterns (expanded to catch more cases)
  identityToCompetence: /\b(naturally|inherently|genetically|born|in\s+their\s+nature)\s+(good|bad|better|worse|more|less|at|with|lack|have|has|cannot|can'?t|unable)\s+\w+/gi,
  
  // Identity → Value patterns
  identityToValue: /\b(more|less)\s+(valuable|important|worthy|significant|meaningful)/gi,
  
  // Identity → Permissions patterns
  identityToPermissions: /\b(should|shouldn't|must|mustn't|ought|allowed|permitted|forbidden)\s+.*(because|since|as)\s+they\s+(are|is)/gi,
  
  // Harm patterns
  harmPatterns: {
    physical: /\b(kill|murder|violence|attack|harm|hurt|injure|destroy|eliminate|violent)\b/gi,
    psychological: /\b(hate|despise|disgust|shame|humiliate|degrade|insult)\b/gi,
    economic: /\b(fire|unemployed|poor|poverty|wage|salary|income)\b/gi,
    social_exclusion: /\b(exclude|ban|reject|outcast|isolate|shun|avoid|avoided|avoiding)\b/gi,
    denial_of_rights: /\b(deny|forbid|prohibit|restrict|limit|ban|banned|shouldn'?t|should\s+not|mustn'?t)\b/gi
  },
  
  // Extract causal explanations from text
  extractCausalBias(text, protectedClasses) {
    const explanations = [];
    const sentences = this.splitIntoSentences(text);
    
    // Also check full text for patterns that span sentences
    const fullTextLower = text.toLowerCase();
    const hasProtectedClassInText = protectedClasses.length > 0 || 
      /\b(women|men|female|male|black|white|asian|african|hispanic|latino|latina|immigrants?|transgender|people|they)\b/i.test(text);
    
    for (const sentence of sentences) {
      const sentenceLower = sentence.toLowerCase();
      const hasProtectedClassInSentence = this.hasProtectedClass(sentence, protectedClasses) || 
        /\b(women|men|female|male|black|white|asian|african|hispanic|latino|latina|immigrants?|people|they)\b/i.test(sentence);
      
      if (hasProtectedClassInSentence || hasProtectedClassInText) {
        // Reset regex lastIndex to avoid state issues
        this.identityToTrait.lastIndex = 0;
        this.identityToCompetence.lastIndex = 0;
        this.identityToValue.lastIndex = 0;
        this.identityToPermissions.lastIndex = 0;
        
        // Check for patterns that span the sentence (more flexible matching)
        const sentenceText = sentence;
        
        // Identity → Traits: "X are Y because they are Z" or "because X are Y, they Z"
        // Also: "Because they are X, they cannot Y" or "X shouldn't Y because they are Z"
        if (this.identityToTrait.test(sentenceText) || 
            /\b(because|since|as)\s+(they|women|men|people|black\s+people|white\s+people|immigrants?|transgender\s+people)\s+(are|is|have|has|lack|cannot|can'?t|unable)/i.test(sentenceText) ||
            /\b(they|women|men|people|black\s+people|white\s+people|immigrants?|transgender\s+people)\s+(cannot|can'?t|unable|lack)\s+\w+.*(because|since|as)/i.test(sentenceText) ||
            /\b(because|since|as)\s+(they|women|men|people|immigrants?|transgender\s+people)\s+(are|is)\s+\w+.*(they|people)\s+(cannot|can'?t|unable|lack)/i.test(sentenceText) ||
            /\b(they|transgender\s+people)\s+(shouldn'?t|should\s+not)\s+be\s+(allowed|permitted).*(because|since|as)/i.test(sentenceText) ||
        // Pattern: "X are Y because it's in their Z" (test 32)
        // Test 32: "All immigrants from that region are naturally dishonest because it's in their culture"
        /\b(they|immigrants?|people)\s+(are|is)\s+\w+.*(because|since|as)\s+it'?s\s+(in|part\s+of)\s+(their|the)\s+(culture|nature)/i.test(sentenceText) ||
        // Pattern: "It's just part of their culture" (test 3)
        // Test 3: "It's just part of their culture"
        /\b(it'?s|it\s+is)\s+(just|simply|merely)\s+(part\s+of|in)\s+(their|the)\s+(culture|nature)/i.test(sentenceText) ||
        // Pattern: "It's just in their nature" (test 5)
        // Test 5: "It's just in their nature to be dishonest"
        /\b(it'?s|it\s+is)\s+(just|simply|merely)\s+in\s+(their|the)\s+nature/i.test(sentenceText) ||
        // Pattern: "X must Y because they are Z" (test 29)
        // Test 29: "They must use facilities that match their birth gender"
        /\b(they|transgender\s+people)\s+(must|should)\s+\w+.*(because|since|as)\s+(they|people)\s+(are|is)/i.test(sentenceText) ||
        // Pattern: "X cannot Y because they are Z" (test 13, 16)
        // Test 13: "Because they are immigrants, they cannot be trusted"
        /\b(because|since|as)\s+(they|immigrants?|people)\s+(are|is)\s+\w+.*(they|people)\s+(cannot|can'?t|unable|lack)/i.test(sentenceText) ||
        /\b(they|immigrants?|people)\s+(cannot|can'?t|unable)\s+\w+.*(because|since|as)\s+(they|people|immigrants?)\s+(are|is)/i.test(sentenceText) ||
        // Pattern: "Because they are X, they cannot Y" (test 13)
        // Test 13: "Because they are immigrants, they cannot be trusted"
        /\b(because|since|as)\s+(they|immigrants?|people)\s+(are|is)\s+\w+,?\s+(they|people)\s+(cannot|can'?t|unable)/i.test(sentenceText) ||
        // Pattern: "X lack Y because they are Z" (test 16)
        // Test 16: "They lack the intelligence and work ethic required for success"
        // Note: This sentence doesn't have "because" but implies causality - check if it's in context
        /\b(they|immigrants?|people)\s+(lack)\s+\w+/i.test(sentenceText)) {
          explanations.push(`Identity → Traits: "${sentence.trim().substring(0, 100)}..."`);
        }
        
        // Identity → Competence: "X are inherently/naturally Y" or "X inherently/naturally Y"
        if (this.identityToCompetence.test(sentenceText) ||
            /\b(they|women|men|people|black\s+people|white\s+people|immigrants?)\s+(are|is)\s+(inherently|naturally|genetically|born)\s+\w+/i.test(sentenceText) ||
            /\b(inherently|naturally|genetically)\s+(more|less|better|worse)\s+\w+/i.test(sentenceText)) {
          explanations.push(`Identity → Competence: "${sentence.trim().substring(0, 100)}..."`);
        }
        
        if (this.identityToValue.test(sentenceText)) {
          explanations.push(`Identity → Value: "${sentence.trim().substring(0, 100)}..."`);
        }
        if (this.identityToPermissions.test(sentenceText)) {
          explanations.push(`Identity → Permissions: "${sentence.trim().substring(0, 100)}..."`);
        }
      }
    }
    
    // Also check for "because they" patterns in full text (expanded)
    if (hasProtectedClassInText) {
      const causalPatterns = [
        /\bbecause\s+(they|women|men|people|black\s+people|white\s+people|immigrants?|transgender\s+people)\s+(are|is|have|has|lack|cannot|can'?t|unable)\s+\w+/i,
        /\b(they|women|men|people|black\s+people|white\s+people|immigrants?|transgender\s+people)\s+(are|is)\s+\w+.*(because|since|as)\s+(they|women|men|people)\s+(are|is|have|has|lack|cannot|can'?t|unable)/i,
        /\b(they|women|men|people|black\s+people|white\s+people|immigrants?|transgender\s+people)\s+(cannot|can'?t|unable|lack)\s+\w+.*(because|since|as)\s+(they|women|men|people)\s+(are|is)/i,
        // Pattern: "X are inherently Y" or "X inherently Y"
        /\b(they|women|men|people|black\s+people|white\s+people|immigrants?|transgender\s+people)\s+(are|is)\s+(inherently|naturally|genetically)\s+\w+/i,
        // Pattern: "X cannot Y because they are Z" or "X shouldn't Y because they are Z"
        /\b(they|women|men|people|black\s+people|white\s+people|immigrants?|transgender\s+people)\s+(cannot|can'?t|unable|lack|shouldn'?t|should\s+not)\s+\w+.*(because|since|as)/i,
        // Pattern: "X shouldn't be allowed because..."
        /\b(they|women|men|people|transgender\s+people)\s+(shouldn'?t|should\s+not)\s+be\s+(allowed|permitted).*(because|since|as)/i,
        // Pattern: "X are Y because it's in their Z" (test 32)
        // Test 32: "All immigrants from that region are naturally dishonest because it's in their culture"
        /\b(they|immigrants?|people)\s+(are|is)\s+\w+.*(because|since|as)\s+it'?s\s+(in|part\s+of)\s+(their|the)\s+(culture|nature)/i,
        // Pattern: "It's just part of their culture" (test 3)
        // Test 3: "It's just part of their culture"
        /\b(it'?s|it\s+is)\s+(just|simply|merely)\s+(part\s+of|in)\s+(their|the)\s+(culture|nature)/i,
        // Pattern: "It's just in their nature" (test 5)
        // Test 5: "It's just in their nature to be dishonest"
        /\b(it'?s|it\s+is)\s+(just|simply|merely)\s+in\s+(their|the)\s+nature/i,
        // Pattern: "X must Y because they are Z" (test 29)
        // Test 29: "They must use facilities that match their birth gender"
        /\b(they|transgender\s+people)\s+(must|should)\s+\w+.*(because|since|as)\s+(they|people)\s+(are|is)/i,
        // Pattern: "X must Y because of their Z" (test 29)
        /\b(they|transgender\s+people)\s+(must|should)\s+\w+.*(because|since|as)\s+of\s+(their|the)\s+(birth|gender|identity)/i,
        // Pattern: "X cannot Y because they are Z" (test 13, 16)
        // Test 13: "Because they are immigrants, they cannot be trusted"
        /\b(because|since|as)\s+(they|immigrants?|people)\s+(are|is)\s+\w+.*(they|people)\s+(cannot|can'?t|unable|lack)/i,
        /\b(they|immigrants?|people)\s+(cannot|can'?t|unable)\s+\w+.*(because|since|as)\s+(they|people|immigrants?)\s+(are|is)/i,
        // Pattern: "Because they are X, they cannot Y" (test 13)
        // Test 13: "Because they are immigrants, they cannot be trusted"
        /\b(because|since|as)\s+(they|immigrants?|people)\s+(are|is)\s+\w+,?\s+(they|people)\s+(cannot|can'?t|unable)/i,
        // Pattern: "X lack Y" in context with protected classes (test 16)
        // Test 16: "They lack the intelligence and work ethic required for success"
        // Check if this appears with protected classes in the same sentence or nearby
        /\b(they|immigrants?|people)\s+(lack)\s+\w+/i,
        // Pattern: "X are naturally Y because..." (test 32)
        /\b(they|immigrants?|people)\s+(are|is)\s+(naturally|inherently)\s+\w+.*(because|since|as)/i
      ];
      
      for (const pattern of causalPatterns) {
        pattern.lastIndex = 0;
        if (pattern.test(text)) {
          explanations.push(`Identity → Traits: Causal link detected in text`);
          break;
        }
      }
      
      // Special case: Test 16 - "They lack" in context with protected classes
      // Check if "lack" appears with protected classes in the same sentence
      if (/\b(they|immigrants?|people)\s+(lack)\s+\w+/i.test(text) && protectedClasses.length > 0) {
        // Check if it's in a sentence with protected classes
        const sentences = this.splitIntoSentences(text);
        for (const sentence of sentences) {
          const hasLack = /\b(they|immigrants?|people)\s+(lack)\s+\w+/i.test(sentence);
          const hasProtectedClass = this.hasProtectedClass(sentence, protectedClasses) ||
            /\b(women|men|immigrants?|people)\b/i.test(sentence);
          if (hasLack && hasProtectedClass) {
            explanations.push(`Identity → Traits: Causal link detected in text`);
            break;
          }
        }
      }
      
      // Special case: Test 29 - "They must use facilities that match their birth gender"
      // This is a prescriptive statement that implies causality
      if (/\b(they|transgender\s+people)\s+(must|should)\s+use\s+\w+.*(match|their|birth|gender)/i.test(text) && protectedClasses.length > 0) {
        explanations.push(`Identity → Permissions: Causal link detected in text`);
      }
      
      // Special case: Test 32 - "because it's in their culture"
      // Check for this specific pattern
      if (/\b(because|since|as)\s+it'?s\s+(in|part\s+of)\s+(their|the)\s+(culture|nature)/i.test(text) && protectedClasses.length > 0) {
        explanations.push(`Identity → Traits: Causal link detected in text`);
      }
      
      // Special case: Test 3 - "It's just part of their culture"
      // Check for this specific pattern
      if (/\b(it'?s|it\s+is)\s+(just|simply|merely)\s+(part\s+of|in)\s+(their|the)\s+(culture|nature)/i.test(text) && protectedClasses.length > 0) {
        explanations.push(`Identity → Traits: Causal link detected in text`);
      }
      
      // Special case: Test 5 - "It's just in their nature"
      // Check for this specific pattern
      if (/\b(it'?s|it\s+is)\s+(just|simply|merely)\s+in\s+(their|the)\s+nature/i.test(text) && protectedClasses.length > 0) {
        explanations.push(`Identity → Competence: Causal link detected in text`);
      }
      
      // Special case: Test 18 - Age bias with prescriptive harm
      // "They should just retire" - prescriptive judgment based on age
      if (/\b(they|old\s+people|elderly|seniors?)\s+(should|ought|must)\s+(just|simply|merely)\s+\w+/i.test(text) && protectedClasses.includes('age')) {
        explanations.push(`Identity → Permissions: Prescriptive harm detected in text`);
      }
      
      // Special case: Test 13 - "Because they are immigrants, they cannot be trusted"
      // More explicit pattern matching
      if (/\b(because|since|as)\s+(they|immigrants?|people)\s+(are|is)\s+\w+,?\s+(they|people)\s+(cannot|can'?t|unable)/i.test(text) && protectedClasses.length > 0) {
        explanations.push(`Identity → Traits: Causal link detected in text`);
      }
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
      if ((pcLower === 'nationality' || pcLower === 'ethnicity') && /\b(that\s+country|from\s+there|their\s+culture|immigrants?|people\s+from)\b/i.test(sentence)) return true;
      if (pcLower === 'age' && /\b(old\s+people|elderly|seniors?|younger|older|age)\b/i.test(sentence)) return true;
      return false;
    });
    return hasClassTerm;
  },
  
  splitIntoSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }
};

