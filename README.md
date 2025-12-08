# BiasGuard 4.0 R&D Repository

BiasGuard is a 7-layer semantic bias detection system that analyzes text for protected-class bias, stereotypes, causal harm patterns, and generates neutral rewrites. This repository contains the modular implementation with three critical modules that need completion: implicit bias detection, severity/dampening logic, and the rewrite engine.

## Setup

**Requirements:** Node.js >= 14.0.0

**Installation:** None required. This repository has zero external dependencies - all modules are self-contained.

```bash
git clone https://github.com/bravetto/biasguard-4.0.git
cd biasguard-4.0
npm test  # Run tests immediately
```

## What You're Building

### 1. Implicit Bias Detection (`src/implicit/`)
- **implicitResolver.js**: Detects group references ("people from that country", "those people", "they always") and maps them to protected classes when semantically implied (nationality → ethnicity).
- **groupGeneralizationDetector.js**: Detects universal claims (always, never, everyone, etc.) that indicate stereotyping even without explicit protected class mentions.

### 2. Severity Engine (`src/severity/`)
- **severityEngine.js**: Calculates bias severity scores (0-10) based on bias types, protected classes, and harm potential.
- **qualifierDampening.js**: Reduces severity when qualifiers are present (may, might, sometimes, often, however). Ensures severity cannot exceed 3 if no identity class, no stereotype, no essentialism.

### 3. Rewrite Engine (`src/rewrite/`)
- **rewriteEngine.js**: Removes stereotype clauses and replaces with neutral comparative structures while maintaining grammar & coherence.
- **neutralityTemplates.js**: Provides neutral rewrite templates (e.g., "Individual outcomes vary based on experience and opportunity").
- **coherenceCheck.js**: Validates that rewrites contain subject + verb and no fragments.

## Core System (`src/core/`)
- **biasPatterns.js**: Pattern definitions for stereotype detection
- **biasTypes.js**: Type taxonomy (stereotyping, prejudice, dehumanization, etc.)
- **protectedClasses.js**: Explicit + implicit class maps
- **causalMap.js**: Links identity → trait → harm
- **analyzer.js**: Orchestrates all 7 layers

## Testing

Run all 32 test cases:
```bash
npm test
```

The test suite covers:
- Explicit bias (gender, race)
- Implicit bias (nationality, coded xenophobia, cultural essentialism)
- SES bias, health bias
- False positives (non-protected neutral, qualified statements)
- Rewrite coherence
- Severity boundaries
- Edge cases (null entities, multi-entity, mixed signals)

## Files You Need to Modify

**Priority 1 (Must Fix):**
1. `src/implicit/implicitResolver.js` - Implement group → class mapping
2. `src/implicit/groupGeneralizationDetector.js` - Detect universal claims
3. `src/severity/qualifierDampening.js` - Add qualifier detection and severity reduction
4. `src/rewrite/rewriteEngine.js` - Rebuild template-based rewrite system
5. `src/rewrite/coherenceCheck.js` - Ensure grammatical coherence

**Priority 2 (Review/Enhance):**
- `src/severity/severityEngine.js` - Verify severity calculation logic
- `src/core/analyzer.js` - Ensure all layers integrate correctly

## Expected Output Schema

Each test case expects:
```json
{
  "bias_score": 0-10,
  "bias_level": "none" | "mild" | "moderate" | "high",
  "protected_classes": ["gender", "race", ...],
  "bias_patterns": ["Universal Claims", ...],
  "bias_types": ["stereotyping", ...],
  "suggested_rewrite": "...",
  "rewrite_quality": "coherent" | "fragment" | "incoherent"
}
```

## Success Criteria

✅ All 32 test cases pass  
✅ Implicit bias detected correctly  
✅ Severity dampened by qualifiers  
✅ Rewrites are coherent and neutral  
✅ No false positives on academic/qualified language

