# BiasGuard 4.0 — Open Source Anti-Bias Scientific Coalition

**Mission:** Eradicate bias in mathematics, science, and STEM fields through open-source AI detection and mitigation.

**Vision:** True equity in STEM — where scientific advancement is free from bias, and all voices contribute equally to human knowledge.

**Status:** Open source project led by Phani — Bravetto's gift to the world.

---

## 🌍 Why This Exists

### The Problem
Bias in scientific and mathematical discourse perpetuates inequality, excludes voices, and limits human progress. When bias goes undetected in research, education, and AI systems, it becomes embedded in the foundation of knowledge itself.

### The Solution
BiasGuard 4.0 is a 7-layer semantic bias detection system that identifies, analyzes, and mitigates bias in text — enabling researchers, educators, and developers to create truly equitable scientific discourse.

### The Impact
- **Scientific Value:** Advances the field of computational bias detection with novel 7-layer architecture
- **Social Value:** Enables true equity in STEM by detecting and removing bias barriers
- **Open Source:** Free for all — Bravetto's contribution to global equity
- **Coalition Building:** Foundation for an open-source anti-bias scientific community

---

## 👩‍🔬 Project Leadership

**Project Owner & Lead:** Phani  
**Organization:** Bravetto  
**License:** MIT (Open Source)  
**Purpose:** Free gift to the world for bias eradication in STEM

Phani leads the open-source anti-bias scientific coalition, advancing the mission of true equity in mathematics, science, and STEM fields through this foundational work.

---

## 🎯 WHO / WHAT / WHEN / WHY / HOW

### WHO
**For:** Phani (Project Owner & Lead)  
**Community:** Open-source anti-bias scientific coalition  
**Beneficiaries:** Researchers, educators, developers, and all who seek equity in STEM

### WHAT
**Project:** BiasGuard 4.0 — Open-source 7-layer semantic bias detection system  
**Current State:** Core system works, 5 modules need implementation  
**Test Status:** 1/32 passing (3%) — Ready for implementation work  
**Scientific Contribution:** Novel multi-layer bias detection architecture

### WHEN
**Timeline:** Implementation sprint led by Phani  
**Priority:** Complete 5 TODO modules (4-6 hours estimated)  
**Long-term:** Foundation for ongoing open-source coalition development

### WHY
**Scientific Mission:** Advance computational bias detection research  
**Social Mission:** Enable true equity in STEM fields  
**Open Source Mission:** Free tool for global bias eradication  
**Coalition Mission:** Build community around anti-bias in science and math

### HOW
**Setup:** `npm test` (zero dependencies)  
**Implementation:** See "Files That Need Work" section below  
**Testing:** Run `npm test` after each change  
**Reference:** `PHANI_HANDOFF.md` for detailed implementation guide  
**Contribution:** Open source — contribute, fork, build upon

---

## 🔬 Scientific Value

### Research Contribution
BiasGuard 4.0 introduces a novel 7-layer semantic bias detection architecture:

1. **Protected-Class Entity Profiling** — Explicit class detection
2. **Implicit Resolution** — Group reference mapping
3. **Stereotype Pattern Extraction** — Pattern-based detection
4. **Group Generalization Detection** — Universal claim identification
5. **Bias Type Classification** — Multi-dimensional categorization
6. **Causal Inference Mapping** — Identity → trait → harm linking
7. **Contextual Severity Engine** — Harm-aware scoring

### Academic Applications
- **Research:** Detect bias in scientific papers, grant proposals, peer review
- **Education:** Identify bias in STEM curricula, textbooks, assessments
- **AI Development:** Prevent bias in training data, model outputs, documentation
- **Policy:** Analyze policy documents for equitable language

### Open Source Impact
This work is free and open source — enabling:
- Global researchers to build upon this foundation
- Educational institutions to integrate bias detection
- Developers to create bias-free applications
- The scientific community to advance equity together

---

## 🌟 Why Open Source

**Bravetto's Gift to the World**

Bias eradication is not a competitive advantage — it's a human right. By making BiasGuard 4.0 open source:

- **Accessibility:** Free for all researchers, educators, and developers globally
- **Transparency:** Open code enables trust and verification
- **Collaboration:** Global community can improve and extend
- **Impact:** Maximum reach for bias eradication in STEM
- **Equity:** No barriers to accessing bias detection tools

This is Bravetto's contribution to true equity in STEM — free, open, and available to all.

---

## 👥 Open Source Anti-Bias Scientific Coalition

**Vision:** A global coalition of researchers, educators, and developers working together to eradicate bias in mathematics, science, and STEM fields.

**Foundation:** BiasGuard 4.0 provides the technical foundation for this coalition.

**Leadership:** Phani leads this coalition, advancing the mission through:
- Technical development of bias detection systems
- Scientific research in computational bias detection
- Community building and knowledge sharing
- Advocacy for equity in STEM

**Join:** Contribute, fork, build upon — this is open source for the world.

---

## Current Status

**Test Pass Rate:** 1/32 (3%)  
**Last Updated:** Pre-work fixes completed  
**Status:** ✅ **Ready for implementation work**  
**Critical Bugs:** ✅ **FIXED** (fictional_proxies false positive)

### Recent Fixes Completed
- ✅ Fixed `fictional_proxies` false positive (now correctly excludes when explicit classes exist)
- ✅ Improved causal bias detection patterns (expanded regex patterns, better protected class detection)
- ✅ Improved rewrite engine placeholder (better grammar preservation)

---

## Setup

**Requirements:** Node.js >= 14.0.0

**Installation:** Zero external dependencies - all modules are self-contained.

```bash
cd biasguard-4.0
npm test  # Run all 32 test cases
```

---

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

---

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
├── README.md                     ✅ This file
├── PHANI_HANDOFF.md             ✅ Complete implementation guide
├── PRE_WORK_COMPLETE.md         ✅ Pre-work summary
└── package.json                 ✅ Complete
```

---

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

---

## Files That Need Work

**WHO:** Phani (Project Owner & Lead)  
**WHAT:** Implement 5 modules with TODO comments  
**HOW:** Each file has TODO comments with step-by-step instructions  
**WHEN:** Priority 1 (must complete), then Priority 2 (review/verify)  
**WHY:** Advance scientific research and enable true equity in STEM

### Priority 1 (Must Complete - 4-6 hours)

1. **`src/implicit/implicitResolver.js`**
   - **TODO Lines:** 3, 22
   - **What:** Enhance group → class mapping logic
   - **Why:** Affects protected class detection accuracy — critical for scientific validity
   - **How:** See TODO comments in file, reference `PHANI_HANDOFF.md`

2. **`src/implicit/groupGeneralizationDetector.js`**
   - **TODO Lines:** 3, 25
   - **What:** Implement universal claim detection
   - **Why:** Affects stereotype pattern detection — essential for bias identification
   - **How:** See TODO comments in file, reference `PHANI_HANDOFF.md`

3. **`src/severity/qualifierDampening.js`**
   - **TODO Lines:** 4, 34, 70
   - **What:** Implement qualifier detection and severity reduction
   - **Why:** Affects severity score accuracy (15/32 test failures) — ensures scientific rigor
   - **How:** See TODO comments in file, reference `PHANI_HANDOFF.md`

4. **`src/rewrite/rewriteEngine.js`**
   - **TODO Lines:** 3, 24
   - **What:** Rebuild template-based rewrite system
   - **Why:** Current placeholder breaks grammar (18/32 test failures) — critical for usability
   - **How:** Use `neutralityTemplates.js`, see TODO comments, reference `PHANI_HANDOFF.md`

5. **`src/rewrite/coherenceCheck.js`**
   - **TODO Lines:** 3, 25
   - **What:** Enhance coherence validation
   - **Why:** Affects rewrite quality validation — ensures scientific accuracy
   - **How:** See TODO comments in file, reference `PHANI_HANDOFF.md`

### Priority 2 (Review/Verify - 1-2 hours)

- **`src/severity/severityEngine.js`** - Verify calculation logic
- **`src/core/analyzer.js`** - Verify layer integration

---

## Testing

**HOW TO TEST:**
```bash
npm test
```

**CURRENT RESULTS:** 1/32 passing (3%)

**EXPECTED AFTER IMPLEMENTATION:** 60-70% pass rate → 90-95% → 100%

**Test Coverage:**
- Explicit bias (gender, race)
- Implicit bias (nationality, coded xenophobia, cultural essentialism)
- SES bias, health bias, appearance bias, weight bias
- False positives (non-protected neutral, qualified statements)
- Rewrite coherence
- Severity boundaries
- Edge cases (null entities, multi-entity, mixed signals)

**Debugging:** Each test case file in `tests/cases/` contains input text and expected output ranges. Test failures show which assertions failed and why.

---

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

---

## Implementation Notes

### `fictional_proxies` Logic
- **WHAT:** Only added when NO explicit protected classes detected
- **WHERE:** Logic in `src/core/analyzer.js` Layer 1 (PCEP) - only adds if no other classes
- **WHY:** Prevents false positives when explicit classes are present
- **HOW:** Cleanup in `src/implicit/implicitResolver.js` - removes if explicit classes exist

### Causal Bias Detection
- **WHAT:** Patterns expanded to catch more cases
- **HOW:** Improved protected class detection in sentences, full-text checking for causal links
- **WHY:** Better detection accuracy (was 0%, now improved)
- **FIXED:** Regex state issues (lastIndex reset)

### Rewrite Engine
- **WHAT:** Placeholder uses regex replacements (breaks grammar)
- **NEEDS:** Template-based system using `neutralityTemplates.js`
- **WHY:** Current approach breaks grammar (18/32 test failures)
- **HOW:** See TODO comments in `src/rewrite/rewriteEngine.js`

---

## Success Criteria

**WHEN COMPLETE:**
- ✅ All 32 test cases pass
- ✅ Implicit bias detected correctly
- ✅ Severity dampened by qualifiers
- ✅ Rewrites are coherent and neutral
- ✅ No false positives on academic/qualified language
- ✅ Scientific validity established
- ✅ Open source ready for global use

---

## Quick Start for Phani

1. **Read:** `PHANI_HANDOFF.md` for complete implementation guide
2. **Run:** `npm test` to see current test status (1/32 passing)
3. **Implement:** Work through Priority 1 files in order
4. **Test:** Run `npm test` after each file
5. **Verify:** Achieve 100% test pass rate
6. **Lead:** Build the open-source anti-bias scientific coalition

---

## Usage

```javascript
const BiasGuard4Analyzer = require('./src/core/analyzer');
const analyzer = new BiasGuard4Analyzer();

const result = await analyzer.analyze('All women are naturally bad at math.');
console.log(result.bias_score); // 0-10
console.log(result.protected_classes); // ['gender']
console.log(result.bias_types); // ['stereotyping', 'prejudice', ...]
```

---

## Contributing

**Open Source — Contribute, Fork, Build Upon**

This is Bravetto's gift to the world. Contributions welcome:
- Code improvements
- Test case additions
- Documentation enhancements
- Research applications
- Community building

**License:** MIT — Free for all uses

---

## Documentation

- **`README.md`** - This file (overview and mission)
- **`PHANI_HANDOFF.md`** - Complete implementation guide with detailed instructions
- **`PRE_WORK_COMPLETE.md`** - Pre-work summary
- **`PRE_WORK_FIXES_COMPLETE.md`** - Fixes documentation

---

## License

MIT — Open Source

**Bravetto's Gift to the World for True Equity in STEM**

---

**Project Owner:** Phani  
**Organization:** Bravetto  
**Mission:** Eradicate bias in mathematics, science, and STEM fields  
**Vision:** True equity in STEM — where all voices contribute equally to human knowledge
