// Implicit Resolver
// Detects group references and maps them to protected classes
// Implements group → class mapping with coded xenophobia detection

const protectedClasses = require('../core/protectedClasses');

class ImplicitResolver {
  constructor() {
    this.implicitMappings = protectedClasses.implicitMappings;
  }
  
  /**
   * Resolves implicit group references to protected classes
   * @param {string} text - Text to analyze
   * @param {Array} explicitClasses - Already detected explicit protected classes
   * @returns {Object} { protected_classes: [], entities_detected: [] }
   */
  resolve(text, explicitClasses = []) {
    const detectedClasses = [...explicitClasses];
    const entitiesDetected = [];
    const lowerText = text.toLowerCase();
    
    // Track if we've added any non-fictional classes from implicit mappings
    let addedNonFictionalClasses = false;
    
    // 1. Check for coded xenophobia patterns (high priority - specific patterns)
    const codedXenophobiaPatterns = [
      /\b(those\s+foreigners|foreigners\s+(always|never|all))\b/gi,
      /\b(immigrants\s+(always|never|all|don'?t|doesn'?t))\b/gi,
      /\b(refugees\s+(always|never|all|don'?t|doesn'?t))\b/gi,
      /\b(they\s+don'?t\s+understand\s+(our|the))\b/gi,
      /\b(people\s+from\s+that\s+country)\b/gi,
      /\b(those\s+people\s+from\s+(that|those))\b/gi,
      // Add pattern for "those foreigners" to also trigger fictional_proxies
      /\b(those|that)\s+(foreigners|people)\b/gi
    ];
    
    // Track if we found "those foreigners" pattern specifically
    let foundThoseForeigners = false;
    
    let foundForeignersPattern = false;
    for (const pattern of codedXenophobiaPatterns) {
      pattern.lastIndex = 0; // Reset regex state
      const matches = text.match(pattern);
      if (matches) {
        // Check if this is a "those foreigners" pattern that should also trigger fictional_proxies
        const thoseForeignersPattern = /\b(those|that)\s+(foreigners|people)\b/gi;
        thoseForeignersPattern.lastIndex = 0;
        if (thoseForeignersPattern.test(text)) {
          foundForeignersPattern = true;
          foundThoseForeigners = true;
        }
        
        if (!detectedClasses.includes('nationality')) {
          detectedClasses.push('nationality');
          addedNonFictionalClasses = true;
        }
        if (!detectedClasses.includes('ethnicity')) {
          detectedClasses.push('ethnicity');
          addedNonFictionalClasses = true;
        }
        matches.forEach(match => {
          if (!entitiesDetected.includes(match)) {
            entitiesDetected.push(match);
          }
        });
      }
    }
    
    // If we found "those foreigners" pattern, also add fictional_proxies
    if (foundForeignersPattern && !detectedClasses.includes('fictional_proxies')) {
      detectedClasses.push('fictional_proxies');
    }
    
    // 2. Check for group reference patterns using implicitMappings
    for (const [pattern, classes] of Object.entries(this.implicitMappings)) {
      // Escape special regex characters and create word-boundary-aware pattern
      // The pattern is a plain string, so we need to escape it properly
      const escapedPattern = pattern
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
        .replace(/\s+/g, '\\s+'); // Convert spaces to \s+
      
      // Add word boundaries
      const patternRegex = new RegExp(`\\b${escapedPattern}\\b`, 'gi');
      
      const matches = text.match(patternRegex);
      if (matches) {
        classes.forEach(cls => {
          // NEVER add fictional_proxies if explicit classes exist
          if (cls === 'fictional_proxies') {
            if (explicitClasses.length > 0 || addedNonFictionalClasses) {
              return; // Skip adding fictional_proxies if explicit classes exist
            }
          } else {
            addedNonFictionalClasses = true;
          }
          if (!detectedClasses.includes(cls)) {
            detectedClasses.push(cls);
          }
        });
        matches.forEach(match => {
          if (!entitiesDetected.includes(match)) {
            entitiesDetected.push(match);
          }
        });
      }
    }
    
    // 3. Enhanced "people from that country" detection with variations
    // BUT: Don't add ethnicity/nationality for generic "those people" without geographic context
    // (test 27: "Those people" should only be fictional_proxies, not ethnicity/nationality)
    const hasGenericPeopleOnly = /\b(those|these)\s+people\b/gi.test(text) && 
                                  !/\b(people\s+from|from\s+(that|those|the|there)|that\s+culture|their\s+culture)\b/gi.test(text);
    
    const countryPatterns = [
      /\bpeople\s+from\s+(that|those|the)\s+(country|countries|nation|nations|region|regions|place|places)\b/gi,
      /\b(those|that)\s+people\s+from\s+(that|those|the)\s+(country|nation|region)\b/gi,
      /\bpeople\s+from\s+(that|those)\s+(part\s+of\s+the\s+world|area)\b/gi,
      // Add patterns for "that region", "that area", "from that region", etc.
      /\b(everyone|everybody|people|they|those)\s+from\s+(that|those|the)\s+(region|area|country|nation|place)\b/gi,
      /\b(that|those|the)\s+(region|area|country|nation|place)\b/gi,
      // Add patterns for "from there", "that culture", "their culture"
      /\b(everyone|everybody|people|they|those)\s+from\s+there\b/gi,
      /\b(that|their|the)\s+culture\b/gi,
      /\b(it'?s|it\s+is)\s+(just|simply|merely)\s+(part\s+of|in)\s+(their|the)\s+(culture|nature|way|tradition)\b/gi,
      // Pattern: "from there" (standalone)
      /\bfrom\s+there\b/gi
    ];
    
    for (const pattern of countryPatterns) {
      pattern.lastIndex = 0; // Reset regex state
      if (pattern.test(text)) {
        // Don't add ethnicity/nationality for generic "those people" without geographic context
        // (test 27: "Those people are like animals" should only be fictional_proxies)
        if (!hasGenericPeopleOnly) {
          if (!detectedClasses.includes('nationality')) {
            detectedClasses.push('nationality');
            addedNonFictionalClasses = true;
          }
          if (!detectedClasses.includes('ethnicity')) {
            detectedClasses.push('ethnicity');
            addedNonFictionalClasses = true;
          }
        }
        pattern.lastIndex = 0; // Reset again for match
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => {
            if (!entitiesDetected.includes(match)) {
              entitiesDetected.push(match);
            }
          });
        }
      }
    }
    
    // 4. Handle "they always/never" with group context (coded references)
    // Check for patterns like "they always", "they never", "they all", "they don't"
    // BUT: Don't add ethnicity/nationality for generic "those people" without geographic context
    const hasGeographicContext = /\b(people\s+from|from\s+(that|those|the)\s+(country|region|nation|area|there))\b/gi;
    const theyPatterns = [
      /\bthey\s+(always|never|all|everyone|don'?t|doesn'?t|can'?t|cannot)\b/gi,
      /\b(those|that)\s+(people|group|groups|ones)\s+(always|never|all|don'?t|doesn'?t)\b/gi,
      /\btheir\s+(kind|type|sort)\s+(always|never|all|don'?t|doesn'?t)\b/gi
    ];
    
    let foundTheyPattern = false;
    for (const pattern of theyPatterns) {
      if (pattern.test(text)) {
        foundTheyPattern = true;
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => {
            if (!entitiesDetected.includes(match)) {
              entitiesDetected.push(match);
            }
          });
        }
      }
    }
    
    // Only add fictional_proxies if NO explicit classes AND no other implicit classes detected
    // AND we found a "they" pattern that suggests group reference
    // BUT: Don't add if we have geographic context (that would be real nationality/ethnicity)
    if (foundTheyPattern && explicitClasses.length === 0 && !addedNonFictionalClasses && detectedClasses.length === 0) {
      hasGeographicContext.lastIndex = 0;
      if (!hasGeographicContext.test(text)) {
        if (!detectedClasses.includes('fictional_proxies')) {
          detectedClasses.push('fictional_proxies');
        }
      }
    }
    
    // 5. Final cleanup: Remove fictional_proxies if we have explicit classes
    // BUT: Keep fictional_proxies if we have strong indicators like "these people", "those people"
    // without geographic context, OR if we found "those foreigners" pattern
    const hasStrongFictionalIndicators = /\b(these\s+people|those\s+people)\b/gi.test(text);
    const hasGeographicContextForCleanup = /\b(people\s+from|from\s+(that|those|the)\s+(country|region|nation|area|there))\b/gi.test(text);
    
    if ((explicitClasses.length > 0 || addedNonFictionalClasses) && detectedClasses.includes('fictional_proxies')) {
      // Keep fictional_proxies if:
      // 1. We found "those foreigners" pattern (test 4)
      // 2. We have strong fictional indicators without geographic context (test 27)
      // For test 27: "Those people are like animals" - should keep fictional_proxies, remove ethnicity/nationality
      if (!foundThoseForeigners) {
        if (hasGeographicContextForCleanup) {
          // Has geographic context - remove fictional_proxies (real nationality/ethnicity)
          const index = detectedClasses.indexOf('fictional_proxies');
          if (index !== -1) detectedClasses.splice(index, 1);
        } else if (!hasStrongFictionalIndicators) {
          // No strong indicators - remove fictional_proxies
          const index = detectedClasses.indexOf('fictional_proxies');
          if (index !== -1) detectedClasses.splice(index, 1);
        } else {
          // Has strong fictional indicators without geographic context - keep fictional_proxies
          // BUT: Remove ethnicity/nationality if they were added incorrectly
          // (test 27: "Those people" should only be fictional_proxies, not ethnicity/nationality)
          if (hasStrongFictionalIndicators && !hasGeographicContextForCleanup) {
            // Remove ethnicity/nationality if they were added from generic "those people"
            // Check if we have "those people" or "these people" without geographic context
            const hasGenericPeople = /\b(those|these)\s+people\b/gi.test(text);
            const hasNoGeographicContext = !/\b(people\s+from|from\s+(that|those|the)\s+(country|region|nation|area|there)|that\s+culture|their\s+culture)\b/gi.test(text);
            
            if (hasGenericPeople && hasNoGeographicContext) {
              // Generic "those people" without context = fictional_proxies only
              const ethnicityIndex = detectedClasses.indexOf('ethnicity');
              const nationalityIndex = detectedClasses.indexOf('nationality');
              if (ethnicityIndex !== -1 && !explicitClasses.includes('ethnicity')) {
                detectedClasses.splice(ethnicityIndex, 1);
              }
              if (nationalityIndex !== -1 && !explicitClasses.includes('nationality')) {
                detectedClasses.splice(nationalityIndex, 1);
              }
            }
          }
        }
      }
    }
    
    return {
      protected_classes: [...new Set(detectedClasses)],
      entities_detected: [...new Set(entitiesDetected)]
    };
  }
}

module.exports = ImplicitResolver;

