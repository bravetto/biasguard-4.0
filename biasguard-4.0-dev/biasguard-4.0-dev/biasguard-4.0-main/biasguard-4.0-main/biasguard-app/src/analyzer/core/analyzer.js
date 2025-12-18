// BiasGuard 4.0 Analyzer
// Orchestrates all 7 layers of bias detection

const protectedClassesModule = require('./protectedClasses');
const biasPatterns = require('./biasPatterns');
const biasTypes = require('./biasTypes');
const causalMap = require('./causalMap');
const ImplicitResolver = require('../implicit/implicitResolver');
const GroupGeneralizationDetector = require('../implicit/groupGeneralizationDetector');
const SeverityEngine = require('../severity/severityEngine');
const RewriteEngine = require('../rewrite/rewriteEngine');

class BiasGuard4Analyzer {
  constructor() {
    this.implicitResolver = new ImplicitResolver();
    this.generalizationDetector = new GroupGeneralizationDetector();
    this.severityEngine = new SeverityEngine();
    this.rewriteEngine = new RewriteEngine();
  }
  
  /**
   * Main analysis method - executes 7-layer pipeline
   * @param {string} text - Text to analyze
   * @returns {Object} Complete analysis result
   */
  async analyze(text) {
    // Input validation
    if (!text || text.trim().length === 0) {
      return this.createEmptyResult();
    }
    
    const MAX_INPUT_LENGTH = 50000;
    if (text.length > MAX_INPUT_LENGTH) {
      text = text.substring(0, MAX_INPUT_LENGTH);
    }
    
    const normalizedText = text.trim();
    
    // Layer 1: Protected-Class Entity Profiler (PCEP)
    const pcepResult = this.layer1_PCEP(normalizedText);
    
    // Layer 1.5: Implicit Resolution (NEW)
    const implicitResult = this.implicitResolver.resolve(normalizedText, pcepResult.protected_classes);
    let allProtectedClasses = [...new Set([...pcepResult.protected_classes, ...implicitResult.protected_classes])];
    const allEntities = [...new Set([...pcepResult.entities_detected, ...implicitResult.entities_detected])];
    
    // Final cleanup: If we have fictional_proxies from "those people" without geographic context,
    // remove ethnicity/nationality that might have been incorrectly added
    // (test 27: "Those people are like animals" should only have fictional_proxies)
    if (allProtectedClasses.includes('fictional_proxies')) {
      const hasGenericPeople = /\b(those|these)\s+people\b/gi.test(normalizedText);
      const hasNoGeographicContext = !/\b(people\s+from|from\s+(that|those|the|there)|that\s+culture|their\s+culture|country|region|nation)\b/gi.test(normalizedText);
      if (hasGenericPeople && hasNoGeographicContext) {
        // Remove ethnicity/nationality if they weren't explicitly detected
        const hasExplicitEthnicity = pcepResult.protected_classes.includes('ethnicity');
        const hasExplicitNationality = pcepResult.protected_classes.includes('nationality');
        if (!hasExplicitEthnicity && allProtectedClasses.includes('ethnicity')) {
          allProtectedClasses = allProtectedClasses.filter(c => c !== 'ethnicity');
        }
        if (!hasExplicitNationality && allProtectedClasses.includes('nationality')) {
          allProtectedClasses = allProtectedClasses.filter(c => c !== 'nationality');
        }
      }
    }
    
    // Layer 2: Stereotype Pattern Extractor (SPE)
    const speResult = this.layer2_SPE(normalizedText, { protected_classes: allProtectedClasses, entities_detected: allEntities });
    
    // Layer 2.5: Group Generalization Detection (NEW)
    const generalizationResult = this.generalizationDetector.detect(normalizedText);
    if (generalizationResult.detected) {
      speResult.bias_patterns = [...new Set([...speResult.bias_patterns, ...generalizationResult.patterns])];
      speResult.examples = [...new Set([...speResult.examples, ...generalizationResult.examples])];
    }
    
    // Layer 3: Bias Type Classifier (HTC)
    const htcResult = this.layer3_HTC(speResult, { protected_classes: allProtectedClasses }, normalizedText);
    
    // Layer 4: Causal Inference Bias Mapper (CIBM)
    const cibmResult = causalMap.extractCausalBias(normalizedText, allProtectedClasses);
    
    // Layer 5: Contextual Severity Engine (CSE)
    const cseResult = this.severityEngine.calculate(
      htcResult.bias_types,
      allProtectedClasses,
      speResult.bias_patterns,
      normalizedText,
      cibmResult.detected // Pass causal bias detection result
    );
    
    // Layer 6: Mitigation Strategy Generator (MSG)
    const msgResult = this.rewriteEngine.rewrite(
      normalizedText,
      speResult.bias_patterns,
      allProtectedClasses,
      htcResult.bias_types
    );
    
    // Layer 7: Output Assembly
    return this.layer7_OutputAssembly(
      cseResult,
      { protected_classes: allProtectedClasses, entities_detected: allEntities },
      speResult,
      htcResult,
      cibmResult,
      msgResult
    );
  }
  
  // Layer 1: Protected-Class Entity Profiler
  layer1_PCEP(text) {
    const protectedClasses = [];
    const entitiesDetected = [];
    const lowerText = text.toLowerCase();
    
    // First pass: detect all classes except fictional_proxies and sexual_orientation (handled via sexuality)
    const nonFictionalClasses = [];
    
    for (const [category, patterns] of Object.entries(protectedClassesModule.patterns)) {
      // Skip fictional_proxies in first pass - handle separately
      // Skip sexual_orientation - it's an alias for sexuality
      if (category === 'fictional_proxies' || category === 'sexual_orientation') {
        continue;
      }
      
      let found = false;
      const categoryEntities = [];
      
      // Check explicit patterns
      if (patterns.explicit) {
        const explicitMatches = text.match(patterns.explicit);
        if (explicitMatches) {
          found = true;
          explicitMatches.forEach(match => {
            if (!categoryEntities.includes(match)) {
              categoryEntities.push(match);
            }
          });
        }
      }
      
      // Check implicit patterns
      if (patterns.implicit) {
        const implicitMatches = text.match(patterns.implicit);
        if (implicitMatches) {
          found = true;
          implicitMatches.forEach(match => {
            if (!categoryEntities.includes(match)) {
              categoryEntities.push(match);
            }
          });
        }
      }
      
      if (found) {
        // Keep sexuality as-is (tests expect "sexuality" not "sexual_orientation")
        if (!protectedClasses.includes(category)) {
          protectedClasses.push(category);
        }
        nonFictionalClasses.push(category);
        entitiesDetected.push(...categoryEntities);
      }
    }
    
    // Second pass: Add fictional_proxies for strong indicators
    // Strong fictional_proxy patterns: "these people", "those people" (without geographic context)
    const fictionalPatterns = protectedClassesModule.patterns.fictional_proxies;
    if (fictionalPatterns && fictionalPatterns.implicit) {
      const fictionalMatches = text.match(fictionalPatterns.implicit);
      if (fictionalMatches) {
        // Strong indicators that should trigger fictional_proxies
        // "these people", "those people" (without "from that country/region")
        const strongIndicators = /\b(these\s+people|those\s+people|their\s+kind|that\s+group|such\s+people)\b/gi;
        const hasGeographicContext = /\b(people\s+from|from\s+(that|those|the)\s+(country|region|nation|area))\b/gi;
        
        if (strongIndicators.test(text)) {
          // Only add if NO geographic context (geographic context = real nationality/ethnicity)
          // OR if no other classes detected
          if (!hasGeographicContext.test(text) || nonFictionalClasses.length === 0) {
            if (!protectedClasses.includes('fictional_proxies')) {
              protectedClasses.push('fictional_proxies');
            }
            fictionalMatches.forEach(match => {
              if (!entitiesDetected.includes(match)) {
                entitiesDetected.push(match);
              }
            });
          }
        }
      }
    }
    
    return {
      protected_classes: protectedClasses,
      entities_detected: [...new Set(entitiesDetected)]
    };
  }
  
  // Layer 2: Stereotype Pattern Extractor
  layer2_SPE(text, pcepResult) {
    const detectedPatterns = [];
    const examples = [];
    
    for (const [patternType, regex] of Object.entries(biasPatterns)) {
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        const patternLabel = patternType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        detectedPatterns.push(patternLabel);
        
        // Extract example sentences
        const sentences = this.splitIntoSentences(text);
        for (const sentence of sentences) {
          if (regex.test(sentence)) {
            const example = sentence.trim().substring(0, 150);
            if (example && !examples.includes(example)) {
              examples.push(example);
            }
          }
        }
      }
    }
    
    // Detect demeaning attributions
    const demeaningPattern = this.detectDemeaningAttributions(text, pcepResult);
    if (demeaningPattern.detected) {
      detectedPatterns.push('Demeaning Attributions');
      examples.push(...demeaningPattern.examples);
    }
    
    return {
      bias_patterns: detectedPatterns,
      examples: examples
    };
  }
  
  detectDemeaningAttributions(text, pcepResult) {
    const negativeTraits = /\b(lazy|stupid|dumb|ignorant|incompetent|unreliable|untrustworthy|violent|aggressive|passive|weak|inferior|backwards|primitive|savage|uncivilized)\b/gi;
    const sentences = this.splitIntoSentences(text);
    const detected = pcepResult.protected_classes.length > 0;
    const examples = [];
    
    if (detected) {
      for (const sentence of sentences) {
        const hasNegativeTrait = negativeTraits.test(sentence);
        const hasProtectedClass = pcepResult.entities_detected.some(entity => 
          sentence.toLowerCase().includes(entity.toLowerCase())
        );
        
        if (hasNegativeTrait && hasProtectedClass) {
          examples.push(sentence.trim().substring(0, 150));
        }
      }
    }
    
    return {
      detected: examples.length > 0,
      examples: examples
    };
  }
  
  // Layer 3: Bias Type Classifier
  layer3_HTC(speResult, pcepResult, text = '') {
    const biasTypesList = [];
    
    // Map patterns to bias types
    for (const [pattern, types] of Object.entries(biasTypes.patternToType)) {
      if (speResult.bias_patterns.some(p => p.includes(pattern))) {
        types.forEach(type => {
          if (!biasTypesList.includes(type)) {
            biasTypesList.push(type);
          }
        });
      }
    }
    
    // Detect hostility (check both examples and full text)
    const hostilityPattern = /\b(hate|kill|destroy|eliminate|remove|get\s+rid\s+of|exterminate|annihilate|threat|must\s+be\s+removed)\b/gi;
    const textToCheck = (speResult.examples || []).join(' ') + ' ' + text;
    hostilityPattern.lastIndex = 0; // Reset regex state
    if (hostilityPattern.test(textToCheck)) {
      if (!biasTypesList.includes('hostility')) {
        biasTypesList.push('hostility');
      }
    }
    
    // NEW: Detect hate speech patterns
    const hateSpeechPattern = /\b(muslims?|jews?|blacks?|whites?|asians?|gays?|lesbians?|immigrants?|mexicans?|christians?)\s+(are|is)\s+(terrorists?|criminals?|threat|dangerous|evil|rapists?|murderers?|thieves?|liars?|pedophiles?)\b/gi;
    if (hateSpeechPattern.test(text)) {
      if (!biasTypesList.includes('hate_speech')) {
        biasTypesList.push('hate_speech');
      }
      if (!biasTypesList.includes('hostility')) {
        biasTypesList.push('hostility');
      }
    }
    
    // NEW: Detect dehumanizing metaphors
    const dehumanizingMetaphorPattern = /\b(infestation|plague|vermin|swarm|horde|invasion|cockroaches?|rats?|parasites?)\b/gi;
    if (dehumanizingMetaphorPattern.test(text)) {
      if (!biasTypesList.includes('dehumanization')) {
        biasTypesList.push('dehumanization');
      }
    }
    
    // NEW: Detect microaggressions (conditional compliments, backhanded praise)
    const conditionalComplimentPattern = /\b(surprisingly|unexpectedly|remarkably)\s+(articulate|intelligent|capable|well[\s-]?spoken|eloquent|smart|competent|bright|educated)\b/gi;
    const backhandedPraisePattern = /\b(pretty|quite|very|so|really)\s+(good|well|smart|capable|articulate|competent|impressive)\s+for\s+(a|an)\s+(woman|female|girl|black|asian|old|elderly|young|immigrant|foreigner|disabled)\b/gi;
    if (conditionalComplimentPattern.test(text) || backhandedPraisePattern.test(text)) {
      if (!biasTypesList.includes('microaggression')) {
        biasTypesList.push('microaggression');
      }
      if (!biasTypesList.includes('implicit_bias')) {
        biasTypesList.push('implicit_bias');
      }
      // Add pattern to speResult for later processing
      if (!speResult.bias_patterns.includes('Microaggression')) {
        speResult.bias_patterns.push('Microaggression');
      }
    }
    
    // NEW: Detect disability-specific bias
    const disabilityNegativePattern = /\b(confined\s+to|bound\s+to|wheelchair[\s-]?bound|suffering\s+from|afflicted\s+with|victim\s+of|crippled|lame|handicapped|invalid|defective|retarded)\b/gi;
    const disabilityBurdenPattern = /\b(burden\s+(to|on)|drain\s+on|costly|dependent|helpless|pitiful|unfortunate|tragic)\b/gi;
    if (pcepResult.protected_classes.includes('disability')) {
      if (disabilityNegativePattern.test(text)) {
        if (!biasTypesList.includes('prejudice')) {
          biasTypesList.push('prejudice');
        }
        if (!speResult.bias_patterns.includes('Disability Negative Framing')) {
          speResult.bias_patterns.push('Disability Negative Framing');
        }
      }
      if (disabilityBurdenPattern.test(text)) {
        if (!biasTypesList.includes('prejudice')) {
          biasTypesList.push('prejudice');
        }
        if (!biasTypesList.includes('exclusion')) {
          biasTypesList.push('exclusion');
        }
        if (!speResult.bias_patterns.includes('Disability Burden')) {
          speResult.bias_patterns.push('Disability Burden');
        }
      }
    }
    
    // NEW: Detect cultural othering
    const culturalOtheringPattern = /\b(weird|strange|bizarre|disgusting|gross|nasty)\s+(food|customs?|traditions?|practices?|habits?|rituals?|beliefs?)\b/gi;
    if (culturalOtheringPattern.test(text)) {
      if (!biasTypesList.includes('prejudice')) {
        biasTypesList.push('prejudice');
      }
      if (!biasTypesList.includes('implicit_bias')) {
        biasTypesList.push('implicit_bias');
      }
      if (!speResult.bias_patterns.includes('Cultural Othering')) {
        speResult.bias_patterns.push('Cultural Othering');
      }
    }
    
    // NEW: Detect gender role bias
    const genderRolePattern = /\b(women|females?|girls?)\s+(are|is)\s+(better\s+suited|more\s+suited|naturally\s+suited|meant)\s+(for|to)\s+(nurturing|caring|domestic|support|administrative|HR|nursing)\b/gi;
    if (genderRolePattern.test(text)) {
      if (!biasTypesList.includes('stereotyping')) {
        biasTypesList.push('stereotyping');
      }
      if (!biasTypesList.includes('prescriptive_harm')) {
        biasTypesList.push('prescriptive_harm');
      }
      if (!speResult.bias_patterns.includes('Gender Role Bias')) {
        speResult.bias_patterns.push('Gender Role Bias');
      }
    }
    
    // NEW: Detect integration bias
    const integrationBiasPattern = /\b(don'?t|doesn'?t|won'?t|can'?t|refuse\s+to|fail\s+to)\s+(integrate|assimilate|adapt|fit\s+in|belong)\b/gi;
    if (integrationBiasPattern.test(text) && 
        (pcepResult.protected_classes.includes('nationality') || 
         pcepResult.protected_classes.includes('ethnicity') ||
         pcepResult.protected_classes.includes('age'))) {
      if (!biasTypesList.includes('exclusion')) {
        biasTypesList.push('exclusion');
      }
      if (!biasTypesList.includes('prejudice')) {
        biasTypesList.push('prejudice');
      }
      if (!speResult.bias_patterns.includes('Integration Bias')) {
        speResult.bias_patterns.push('Integration Bias');
      }
    }
    
    // Detect coded language
    if (pcepResult.protected_classes.length > 0 && speResult.bias_patterns.length > 0) {
      if (!biasTypesList.includes('coded_language')) {
        biasTypesList.push('coded_language');
      }
    }
    
    // Detect structural discrimination
    if (speResult.bias_patterns.some(p => p.includes('Superiority') || p.includes('Inferiority'))) {
      if (pcepResult.protected_classes.includes('race') || pcepResult.protected_classes.includes('SES')) {
        if (!biasTypesList.includes('structural_discrimination')) {
          biasTypesList.push('structural_discrimination');
        }
      }
    }
    
    // Detect dehumanization (test 27: "Those people are like animals")
    // Dehumanization = demeaning attributions + essentialism + protected classes
    const hasDemeaningAttributions = speResult.bias_patterns.some(p => 
      p.includes('Demeaning Attributions') || p.toLowerCase().includes('demeaning')
    );
    const hasEssentialism = speResult.bias_patterns.some(p => 
      p.includes('Essentialism') || p.toLowerCase().includes('essentialism')
    );
    const hasAnimalComparison = /\b(like|as)\s+(animals?|creatures?|beasts?|monsters?|things?)\b/gi.test(text);
    const hasPrimitiveLanguage = /\b(primitive|savage|uncivilized|subhuman|less\s+than\s+human)\b/gi.test(text);
    
    if ((hasDemeaningAttributions && hasEssentialism) || hasAnimalComparison || hasPrimitiveLanguage) {
      if (pcepResult.protected_classes.length > 0 && !biasTypesList.includes('dehumanization')) {
        biasTypesList.push('dehumanization');
      }
    }
    
    return {
      bias_types: biasTypesList
    };
  }
  
  // Layer 7: Output Assembly
  layer7_OutputAssembly(cseResult, pcepResult, speResult, htcResult, cibmResult, msgResult) {
    return {
      bias_score: cseResult.score,
      bias_level: cseResult.bias_level,
      protected_classes: pcepResult.protected_classes,
      entities_detected: pcepResult.entities_detected,
      bias_patterns: speResult.bias_patterns || [],
      bias_types: htcResult.bias_types || [],
      examples: speResult.examples || [],
      causal_bias: {
        detected: cibmResult.detected,
        explanations: cibmResult.explanations
      },
      severity: {
        score: cseResult.score,
        reasoning: cseResult.reasoning
      },
      suggested_rewrite: msgResult.suggested_rewrite,
      explanation: msgResult.explanation,
      rewrite_quality: msgResult.rewrite_quality
    };
  }
  
  createEmptyResult() {
    return {
      bias_score: 0,
      bias_level: 'none',
      protected_classes: [],
      entities_detected: [],
      bias_patterns: [],
      bias_types: [],
      causal_bias: {
        detected: false,
        explanations: []
      },
      severity: {
        score: 0,
        reasoning: 'No text provided for analysis'
      },
      suggested_rewrite: '',
      explanation: 'No text provided for analysis',
      rewrite_quality: 'coherent'
    };
  }
  
  splitIntoSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }
}

module.exports = BiasGuard4Analyzer;

