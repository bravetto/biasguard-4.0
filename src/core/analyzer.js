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
    const allProtectedClasses = [...new Set([...pcepResult.protected_classes, ...implicitResult.protected_classes])];
    const allEntities = [...new Set([...pcepResult.entities_detected, ...implicitResult.entities_detected])];
    
    // Layer 2: Stereotype Pattern Extractor (SPE)
    const speResult = this.layer2_SPE(normalizedText, { protected_classes: allProtectedClasses, entities_detected: allEntities });
    
    // Layer 2.5: Group Generalization Detection (NEW)
    const generalizationResult = this.generalizationDetector.detect(normalizedText);
    if (generalizationResult.detected) {
      speResult.bias_patterns = [...new Set([...speResult.bias_patterns, ...generalizationResult.patterns])];
      speResult.examples = [...new Set([...speResult.examples, ...generalizationResult.examples])];
    }
    
    // Layer 3: Bias Type Classifier (HTC)
    const htcResult = this.layer3_HTC(speResult, { protected_classes: allProtectedClasses });
    
    // Layer 4: Causal Inference Bias Mapper (CIBM)
    const cibmResult = causalMap.extractCausalBias(normalizedText, allEntities);
    
    // Layer 5: Contextual Severity Engine (CSE)
    const cseResult = this.severityEngine.calculate(
      htcResult.bias_types,
      allProtectedClasses,
      speResult.bias_patterns,
      normalizedText
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
    
    // First pass: detect all classes except fictional_proxies
    const nonFictionalClasses = [];
    
    for (const [category, patterns] of Object.entries(protectedClassesModule.patterns)) {
      // Skip fictional_proxies in first pass - handle separately
      if (category === 'fictional_proxies') {
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
        protectedClasses.push(category);
        nonFictionalClasses.push(category);
        entitiesDetected.push(...categoryEntities);
      }
    }
    
    // Second pass: Only add fictional_proxies if NO other classes detected
    // This prevents false positives when explicit classes exist
    if (nonFictionalClasses.length === 0) {
      const fictionalPatterns = protectedClassesModule.patterns.fictional_proxies;
      if (fictionalPatterns && fictionalPatterns.implicit) {
        const fictionalMatches = text.match(fictionalPatterns.implicit);
        if (fictionalMatches) {
          // Only add if we have strong indicators (not just "they" as a pronoun)
          const strongIndicators = /\b(those\s+people|their\s+kind|that\s+group|such\s+people|they\s+(always|never|all|everyone))\b/gi;
          if (strongIndicators.test(text)) {
            protectedClasses.push('fictional_proxies');
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
  layer3_HTC(speResult, pcepResult) {
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
    
    // Detect hostility
    const hostilityPattern = /\b(hate|kill|destroy|eliminate|remove|get\s+rid\s+of|exterminate|annihilate)\b/gi;
    if (hostilityPattern.test(speResult.examples.join(' '))) {
      if (!biasTypesList.includes('hostility')) {
        biasTypesList.push('hostility');
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
      bias_patterns: speResult.bias_patterns,
      bias_types: htcResult.bias_types,
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

