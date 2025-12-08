# BiasGuard 4.0 R&D Repository

BiasGuard 4.0 is a 7-layer semantic bias detection system that analyzes text for protected-class bias, stereotypes, causal harm patterns, and generates neutral rewrites.

## Current Status

**Test Pass Rate:** 1/32 (3%)  
**Last Updated:** Pre-work fixes completed  
**Status:** Ready for implementation work

### Recent Fixes Completed
- ✅ Fixed `fictional_proxies` false positive (now correctly excludes when explicit classes exist)
- ✅ Improved causal bias detection patterns (expanded regex patterns, better protected class detection)
- ✅ Improved rewrite engine placeholder (better grammar preservation)

## Setup

**Requirements:** Node.js >= 14.0.0

**Installation:** Zero external dependencies - all modules are self-contained.

```bash
cd biasguard-4.0
npm test  # Run all 32 test cases
```

## Architecture

### 7-Layer Pipeline

1. **Layer 1: Protected-Class Entity Profiler (PCEP)** - Detects explicit protected classes
2. **Layer 1.5: Implicit Resolution** - Maps group references to protected classes
3. **Layer 2: Stereotype Pattern Extractor (SPE)** - Detects bias patterns
4. **Layer 2.5: Group Generalization Detection** - Detects universal claims
5. **Layer 3: Bias Type Classifier (HTC)** - Classifies bias types
6. **Layer 4: Causal Inference Bias Mapper (CIBM)** - Links identity → trait → harm
7. **Layer 5: Contextual Severity Engine (CSE)** - Calculates severity scores (0-10)
8. **Layer 6: Mitigation Strategy Generator (MSG)** - Generates neutral rewrites
9. **Layer 7: Output Assembly** - Assembles final result

## File Structure

```
biasguard-4.0/
├── src/
│   ├── core/
│   │   ├── analyzer.js          ✅ Complete - Orchestrates 7 layers
│   │   ├── biasPatterns.js       ✅ Complete - Pattern definitions
│   │   ├── biasTypes.js          ✅ Complete - Type taxonomy
│   │   ├── protectedClasses.js   ✅ Complete - Class maps
│   │   └── causalMap.js          ✅ Complete - Causal patterns (recently improved)
│   ├── implicit/
│   │   ├── implicitResolver.js   ⚠️  Has placeholder - Needs enhancement
│   │   └── groupGeneralizationDetector.js  ⚠️  Has placeholder - Needs enhancement
│   ├── severity/
│   │   ├── severityEngine.js    ✅ Complete - Base calculation
│   │   └── qualifierDampening.js ⚠️  Has placeholder - Needs implementation
│   └── rewrite/
│       ├── rewriteEngine.js     ⚠️  Has placeholder - Needs template-based rebuild
│       ├── neutralityTemplates.js ✅ Complete - Templates available
│       └── coherenceCheck.js    ⚠️  Has placeholder - Needs enhancement
├── tests/
│   ├── test-runner.js            ✅ Complete
│   └── cases/                   ✅ 32 test cases
└── package.json                 ✅ Complete
```

## What Works

### ✅ Fully Functional
- **Core Analyzer:** 7-layer pipeline orchestration works correctly
- **Protected Class Detection:** Explicit class detection works (with `fictional_proxies` fix)
- **Pattern Detection:** Stereotype pattern extraction works
- **Bias Type Classification:** Type mapping works
- **Causal Bias Detection:** Patterns expanded, detection improved
- **Severity Calculation:** Base calculation works
- **Test Infrastructure:** All 32 test cases load and run

### ⚠️ Needs Enhancement
- **Implicit Resolver:** Placeholder works but needs group → class mapping enhancement
- **Group Generalization:** Placeholder exists but needs universal claim detection
- **Qualifier Dampening:** Placeholder exists but needs full implementation
- **Rewrite Engine:** Placeholder works but breaks grammar - needs template-based rebuild
- **Coherence Check:** Placeholder exists but needs enhancement

## Files That Need Work

Each file has TODO comments with implementation guidance. Placeholder implementations exist and work, but need enhancement to pass all tests.

**Priority 1 (Must Complete):**
1. `src/implicit/implicitResolver.js` - Enhance group → class mapping (TODO at line 3, 22)
2. `src/implicit/groupGeneralizationDetector.js` - Implement universal claim detection (TODO at line 3, 25)
3. `src/severity/qualifierDampening.js` - Implement qualifier detection and dampening (TODO at line 4, 34, 70)
4. `src/rewrite/rewriteEngine.js` - Rebuild template-based rewrite system (TODO at line 3, 24)
5. `src/rewrite/coherenceCheck.js` - Enhance coherence validation (TODO at line 3, 25)

**Priority 2 (Review/Verify):**
- `src/severity/severityEngine.js` - Verify calculation logic
- `src/core/analyzer.js` - Verify layer integration

## Testing

Run all 32 test cases:
```bash
npm test
```

**Current Results:** 1/32 passing (3%)

**Test Coverage:**
- Explicit bias (gender, race)
- Implicit bias (nationality, coded xenophobia, cultural essentialism)
- SES bias, health bias, appearance bias, weight bias
- False positives (non-protected neutral, qualified statements)
- Rewrite coherence
- Severity boundaries
- Edge cases (null entities, multi-entity, mixed signals)

**Debugging:** Each test case file in `tests/cases/` contains input text and expected output ranges. Test failures show which assertions failed and why.

## Output Schema

Each analysis returns:
```json
{
  "bias_score": 0-10,
  "bias_level": "none" | "mild" | "moderate" | "high",
  "protected_classes": ["gender", "race", ...],
  "entities_detected": ["women", "men", ...],
  "bias_patterns": ["Universal Claims", "Essentialism", ...],
  "bias_types": ["stereotyping", "prejudice", ...],
  "causal_bias": {
    "detected": true|false,
    "explanations": [...]
  },
  "severity": {
    "score": 7.1,
    "reasoning": "..."
  },
  "suggested_rewrite": "...",
  "explanation": "...",
  "rewrite_quality": "coherent" | "fragment" | "incoherent"
}
```

## Implementation Notes

### `fictional_proxies` Logic
- Only added when NO explicit protected classes detected
- Logic in `src/core/analyzer.js` Layer 1 (PCEP) - only adds if no other classes
- Cleanup in `src/implicit/implicitResolver.js` - removes if explicit classes exist
- Prevents false positives when explicit classes are present

### Causal Bias Detection
- Patterns expanded to catch more cases
- Improved protected class detection in sentences
- Full-text checking for causal links
- Regex state issues fixed (lastIndex reset)

### Rewrite Engine
- Placeholder uses regex replacements (breaks grammar)
- Needs template-based system using `neutralityTemplates.js`
- Coherence check exists but needs enhancement

## Success Criteria

✅ All 32 test cases pass  
✅ Implicit bias detected correctly  
✅ Severity dampened by qualifiers  
✅ Rewrites are coherent and neutral  
✅ No false positives on academic/qualified language

## Usage

```javascript
const BiasGuard4Analyzer = require('./src/core/analyzer');
const analyzer = new BiasGuard4Analyzer();

const result = await analyzer.analyze('All women are naturally bad at math.');
console.log(result.bias_score); // 0-10
console.log(result.protected_classes); // ['gender']
console.log(result.bias_types); // ['stereotyping', 'prejudice', ...]
```

## License

MIT
