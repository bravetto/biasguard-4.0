// Bias Pattern Definitions
// Patterns used for stereotype detection across all layers

module.exports = {
  universal_claims: /\b(all|every|each|everyone|everybody|nobody|no\s+one)\s+\w+\s+(are|is|do|does|have|has|can|cannot|can't)\b/gi,
  
  essentialism: /\b(inherently|naturally|born|genetic|biological|innate|instinctive|in\s+their\s+nature|by\s+nature|genetically)\s+\w+\b/gi,
  
  superiority_inferiority: /\b(better|worse|superior|inferior|more|less)\s+(than|to)\b/gi,
  
  exclusionary_language: /\b(real|true|actual|genuine|authentic)\s+\w+\s+(don't|doesn't|aren't|isn't|can't|cannot)\b/gi,
  
  prescriptive_judgments: /\b(should|ought|must|shouldn't|mustn't|ought\s+not|have\s+to|need\s+to)\s+\w+\b/gi,
  
  competence_assumptions: /\b(can't|cannot|lack|unable|incapable|incompetent|inadequate|fail\s+to|struggle\s+with)\s+\w+\b/gi,
  
  group_references: /\b(those\s+people|that\s+group|such\s+people|their\s+kind|people\s+from\s+that|they\s+always|they\s+never|they\s+all)\b/gi,
  
  cultural_essentialism: /\b(it'?s|it\s+is)\s+(just|simply|merely)\s+(part\s+of|in)\s+(their|the)\s+(culture|nature|way|tradition|heritage)\b/gi,
  
  coded_xenophobia: /\b(people\s+from\s+that\s+country|those\s+foreigners|immigrants\s+always|refugees\s+never|they\s+don'?t\s+understand)\b/gi
};

