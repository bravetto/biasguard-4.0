// Implicit Resolver
// Detects group references and maps them to protected classes
// TODO: Phani - Implement group → class mapping logic

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
    
    // TODO: Phani - Implement detection logic
    // 1. Check for group reference patterns ("people from that country", "those people", "they always")
    // 2. Map to protected classes using implicitMappings
    // 3. Handle nationality → ethnicity mapping
    // 4. Return detected classes and entities
    
    // PLACEHOLDER - Replace with actual implementation
    const lowerText = text.toLowerCase();
    
    // Track if we've added any non-fictional classes from implicit mappings
    let addedNonFictionalClasses = false;
    
    // Check for group reference patterns
    for (const [pattern, classes] of Object.entries(this.implicitMappings)) {
      const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      if (regex.test(lowerText)) {
        classes.forEach(cls => {
          // NEVER add fictional_proxies if explicit classes exist
          // This prevents false positives when explicit classes are already detected
          if (cls === 'fictional_proxies') {
            if (explicitClasses.length > 0) {
              return; // Skip adding fictional_proxies if explicit classes exist
            }
            // Only add fictional_proxies if we haven't added any other classes
            if (addedNonFictionalClasses) {
              return; // Skip if we've already detected real classes
            }
          } else {
            addedNonFictionalClasses = true;
          }
          if (!detectedClasses.includes(cls)) {
            detectedClasses.push(cls);
          }
        });
        entitiesDetected.push(pattern);
      }
    }
    
    // Check for "people from that country" → nationality/ethnicity
    if (/\bpeople\s+from\s+(that|those|the)\s+(country|countries|nation|nations)\b/gi.test(text)) {
      if (!detectedClasses.includes('nationality')) detectedClasses.push('nationality');
      if (!detectedClasses.includes('ethnicity')) detectedClasses.push('ethnicity');
      addedNonFictionalClasses = true;
      entitiesDetected.push('people from that country');
    }
    
    // Check for "they always/never" with group context
    // ONLY add fictional_proxies if NO explicit classes AND no other implicit classes detected
    if (/\bthey\s+(always|never|all|everyone)\b/gi.test(text)) {
      if (explicitClasses.length === 0 && !addedNonFictionalClasses && detectedClasses.length === 0) {
        if (!detectedClasses.includes('fictional_proxies')) {
          detectedClasses.push('fictional_proxies');
        }
      }
    }
    
    // Final cleanup: Remove fictional_proxies if we have explicit classes
    if (explicitClasses.length > 0 && detectedClasses.includes('fictional_proxies')) {
      const index = detectedClasses.indexOf('fictional_proxies');
      detectedClasses.splice(index, 1);
    }
    
    return {
      protected_classes: [...new Set(detectedClasses)],
      entities_detected: [...new Set(entitiesDetected)]
    };
  }
}

module.exports = ImplicitResolver;

