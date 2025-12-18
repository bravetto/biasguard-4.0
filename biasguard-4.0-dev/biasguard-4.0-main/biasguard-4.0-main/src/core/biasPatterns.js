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
  
  coded_xenophobia: /\b(people\s+from\s+that\s+country|those\s+foreigners|immigrants\s+always|refugees\s+never|they\s+don'?t\s+understand)\b/gi,
  
  // NEW: Hate speech patterns - direct associations with negative/threatening terms
  hate_speech: /\b(muslims?|jews?|blacks?|whites?|asians?|gays?|lesbians?|immigrants?|mexicans?|christians?)\s+(are|is)\s+(terrorists?|criminals?|threat|dangerous|evil|rapists?|murderers?|thieves?|liars?|pedophiles?)\b/gi,
  
  // NEW: Dehumanizing metaphors - comparing groups to animals/pests
  dehumanizing_metaphor: /\b(infestation|plague|vermin|swarm|horde|invasion|cockroaches?|rats?|parasites?|animals?|beasts?|savages?|barbarians?)\b/gi,
  
  // NEW: Disability-specific bias patterns
  disability_negative_framing: /\b(confined\s+to|bound\s+to|wheelchair[\s-]?bound|suffering\s+from|afflicted\s+with|victim\s+of|crippled|lame|handicapped|invalid|defective|retarded)\b/gi,
  
  disability_burden: /\b(burden\s+(to|on)|drain\s+on|costly|dependent|helpless|pitiful|unfortunate|tragic)\b/gi,
  
  // NEW: Microaggression patterns - backhanded compliments and conditional praise
  conditional_compliment: /\b(surprisingly|unexpectedly|remarkably)\s+(articulate|intelligent|capable|well[\s-]?spoken|eloquent|smart|competent|bright|educated)\b/gi,
  
  backhanded_praise: /\b(pretty|quite|very|so|really)\s+(good|well|smart|capable|articulate|competent|impressive)\s+for\s+(a|an)\s+(woman|female|girl|black|asian|old|elderly|young|immigrant|foreigner|disabled)\b/gi,
  
  // NEW: Cultural food/customs bias
  cultural_othering: /\b(weird|strange|bizarre|disgusting|gross|nasty)\s+(food|customs?|traditions?|practices?|habits?|rituals?|beliefs?)\b/gi,
  
  // NEW: Gender role stereotyping
  gender_role_bias: /\b(women|females?|girls?)\s+(are|is)\s+(better\s+suited|more\s+suited|naturally\s+suited|meant)\s+(for|to)\s+(nurturing|caring|domestic|support|administrative|HR|nursing)\b/gi,
  
  // NEW: Integration/assimilation bias
  integration_bias: /\b(don'?t|doesn'?t|won'?t|can'?t|refuse\s+to|fail\s+to)\s+(integrate|assimilate|adapt|fit\s+in|belong)\b/gi
};

