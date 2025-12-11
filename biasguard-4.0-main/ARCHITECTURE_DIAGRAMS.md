# BiasGuard 4.0: Architecture Diagrams & Flowcharts

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BiasGuard 4.0 System                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │   BiasGuard4Analyzer (Orchestrator) │
        └───────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Core       │   │  Implicit    │   │  Severity   │
│  Modules     │   │  Detection   │   │  Engine     │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Rewrite     │   │  Coherence   │   │  Templates  │
│  Engine      │   │  Check       │   │             │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## 🔄 7-Layer Pipeline Flow

```
Input Text: "All women are bad at math."
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Protected-Class Entity Profiler (PCEP)              │
│ ─────────────────────────────────────────────────────────── │
│ Input: "All women are bad at math."                         │
│ Process:                                                    │
│   1. Check explicit patterns: "women" → MATCH               │
│   2. Check implicit patterns: (none)                        │
│   3. Add to classes: ["gender"]                             │
│ Output: {protected_classes: ["gender"],                     │
│          entities_detected: ["women"]}                      │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 1.5: Implicit Resolution                              │
│ ─────────────────────────────────────────────────────────── │
│ Input: Text + ["gender"]                                    │
│ Process:                                                    │
│   1. Check group references: (none)                         │
│   2. Check coded language: (none)                           │
│ Output: {protected_classes: ["gender"],                     │
│          entities_detected: ["women"]}                      │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Stereotype Pattern Extractor (SPE)                 │
│ ─────────────────────────────────────────────────────────── │
│ Input: Text + {protected_classes: ["gender"], ...}        │
│ Process:                                                    │
│   1. Check universal_claims: "All women are" → MATCH       │
│   2. Check essentialism: (none)                             │
│   3. Check other patterns: (none)                            │
│ Output: {bias_patterns: ["Universal Claims"],               │
│          examples: ["All women are bad at math."]}          │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2.5: Group Generalization Detection                   │
│ ─────────────────────────────────────────────────────────── │
│ Input: Text                                                  │
│ Process:                                                    │
│   1. Check universal patterns: "All women are" → MATCH     │
│ Output: {detected: true, patterns: ["Universal Claims"], ...}│
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Bias Type Classifier (HTC)                         │
│ ─────────────────────────────────────────────────────────── │
│ Input: {bias_patterns: ["Universal Claims"], ...}          │
│ Process:                                                    │
│   1. Map "Universal Claims" → ["stereotyping"]             │
│   2. Check hostility: (none)                                │
│   3. Check coded language: (none)                           │
│ Output: {bias_types: ["stereotyping"]}                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Causal Inference Bias Mapper (CIBM)               │
│ ─────────────────────────────────────────────────────────── │
│ Input: Text + ["gender"]                                    │
│ Process:                                                    │
│   1. Check identity → trait: (none)                         │
│   2. Check identity → competence: (none)                     │
│ Output: {detected: false, explanations: []}                 │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: Contextual Severity Engine (CSE)                   │
│ ─────────────────────────────────────────────────────────── │
│ Input: ["stereotyping"], ["gender"], ["Universal Claims"]  │
│ Process:                                                    │
│   1. Base = max(5.0) = 5.0                                  │
│   2. Multiplier = 1.0 (1 class)                             │
│   3. Harm = 0, Domain = 0.5                                 │
│   4. Raw = 5.0 × 1.0 + 0 + 0.5 = 5.5                        │
│   5. Calibration = 1.0                                      │
│   6. Final = 5.5                                            │
│   7. Level = "moderate" (5.5 <= 8)                          │
│ Output: {score: 5.5, bias_level: "moderate", reasoning: ...}│
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 6: Mitigation Strategy Generator (MSG)                │
│ ─────────────────────────────────────────────────────────── │
│ Input: Text + ["Universal Claims"] + ["gender"]            │
│ Process:                                                    │
│   1. Transform "All women are" → "Some women may"           │
│   2. Transform "bad at math" → "face challenges with math"  │
│   3. Check coherence: ✓                                      │
│ Output: {suggested_rewrite: "Some women may face...",      │
│          explanation: "...", rewrite_quality: "coherent"} │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 7: Output Assembly                                   │
│ ─────────────────────────────────────────────────────────── │
│ Process: Combines all layer results                         │
│ Output: Complete analysis result                            │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
Final Result: {
  bias_score: 5.5,
  bias_level: "moderate",
  protected_classes: ["gender"],
  entities_detected: ["women"],
  bias_patterns: ["Universal Claims"],
  bias_types: ["stereotyping"],
  causal_bias: {detected: false, explanations: []},
  severity: {score: 5.5, reasoning: "..."},
  suggested_rewrite: "Some women may face challenges with math.",
  explanation: "...",
  rewrite_quality: "coherent"
}
```

---

## 🧮 Severity Calculation Flowchart

```
Start: Calculate Severity
    │
    ▼
┌─────────────────────────┐
│ Get Bias Types          │
│ ["stereotyping", ...]   │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Calculate Base Score    │
│ base = max(weight(type))│
│ base = max(5.0) = 5.0   │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Calculate Multiplier    │
│ M = 1.0 + (n-1) × 0.1  │
│ M = 1.0 + (1-1) × 0.1  │
│ M = 1.0                 │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Calculate Harm          │
│ H = Σ(weight(harm))     │
│ H = 0                    │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Calculate Domain        │
│ D = 0.5 (default)       │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Calculate Raw Score     │
│ raw = (B × M) + H + D   │
│ raw = (5.0 × 1.0) + 0 + 0.5│
│ raw = 5.5                │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Apply Qualifier         │
│ Dampening               │
│ (if qualifiers exist)   │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Apply Calibration       │
│ final = raw × C         │
│ final = 5.5 × 1.0       │
│ final = 5.5             │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Clamp to [0, 10]        │
│ final = clamp(5.5)      │
│ final = 5.5             │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Determine Bias Level    │
│ if final == 0: "none"   │
│ if final <= 3: "mild"   │
│ if final <= 8: "moderate"│
│ else: "high"            │
│ level = "moderate"       │
└─────────────────────────┘
    │
    ▼
End: Return {score: 5.5, bias_level: "moderate"}
```

---

## 🔍 Pattern Matching Flowchart

```
Start: Detect Patterns
    │
    ▼
┌─────────────────────────┐
│ Split Text into         │
│ Sentences               │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ For Each Pattern Type: │
│ - Universal Claims      │
│ - Essentialism          │
│ - Superiority           │
│ - Exclusionary          │
│ - Prescriptive          │
│ - Competence            │
│ - Group References     │
│ - Cultural Essentialism │
│ - Coded Xenophobia      │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Apply Regex Pattern     │
│ to Text                 │
└─────────────────────────┘
    │
    ├─── Match Found? ────┐
    │                     │
    ▼ YES                 ▼ NO
┌──────────────┐    ┌──────────────┐
│ Add Pattern │    │ Skip Pattern │
│ to List     │    │               │
└──────────────┘    └──────────────┘
    │                     │
    ▼                     ▼
┌─────────────────────────┐
│ Extract Example          │
│ Sentence                 │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Check for Demeaning     │
│ Attributions            │
│ (negative trait +        │
│  protected class)       │
└─────────────────────────┘
    │
    ▼
End: Return {patterns: [...], examples: [...]}
```

---

## 🎯 Protected Class Detection Flowchart

```
Start: Detect Protected Classes
    │
    ▼
┌─────────────────────────┐
│ Initialize:             │
│ classes = []            │
│ entities = []          │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ For Each Category:      │
│ - gender                │
│ - race                  │
│ - ethnicity             │
│ - religion              │
│ - nationality           │
│ - disability            │
│ - age                   │
│ - sexuality             │
│ - SES                   │
│ - appearance            │
│ - weight                │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Check Explicit          │
│ Patterns                │
│ (e.g., "women", "men")  │
└─────────────────────────┘
    │
    ├─── Match? ───────────┐
    │                     │
    ▼ YES                 ▼ NO
┌──────────────┐    ┌──────────────┐
│ Add Category │    │ Check        │
│ to classes   │    │ Implicit     │
│ Add Entity   │    │ Patterns     │
│ to entities  │    │               │
└──────────────┘    └──────────────┘
    │                     │
    ▼                     ▼
┌─────────────────────────┐
│ Handle Special Case:    │
│ fictional_proxies        │
│ (only if no other        │
│  classes detected)       │
└─────────────────────────┘
    │
    ▼
End: Return {protected_classes: [...], entities_detected: [...]}
```

---

## 🔄 Causal Inference Flowchart

```
Start: Detect Causal Bias
    │
    ▼
┌─────────────────────────┐
│ Split Text into         │
│ Sentences               │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ For Each Sentence:      │
│ Check if Contains       │
│ Protected Class         │
└─────────────────────────┘
    │
    ├─── Contains? ───────┐
    │                     │
    ▼ YES                 ▼ NO
┌──────────────┐    ┌──────────────┐
│ Check Causal │    │ Skip Sentence│
│ Patterns:    │    │               │
│ - Identity → │    │               │
│   Trait      │    │               │
│ - Identity → │    │               │
│   Competence  │    │               │
│ - Identity → │    │               │
│   Value       │    │               │
│ - Identity → │    │               │
│   Permissions│    │               │
└──────────────┘    └──────────────┘
    │
    ├─── Match? ───────────┐
    │                     │
    ▼ YES                 ▼ NO
┌──────────────┐    ┌──────────────┐
│ Add          │    │ Continue      │
│ Explanation  │    │ to Next       │
│ to List      │    │ Sentence      │
└──────────────┘    └──────────────┘
    │
    ▼
┌─────────────────────────┐
│ Check Full Text for     │
│ Cross-Sentence          │
│ Patterns                │
└─────────────────────────┘
    │
    ▼
End: Return {detected: bool, explanations: [...]}
```

---

## 🎨 Rewrite Generation Flowchart

```
Start: Generate Rewrite
    │
    ▼
┌─────────────────────────┐
│ Split Text into         │
│ Sentences               │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ For Each Sentence:      │
│ Check for Bias Patterns │
└─────────────────────────┘
    │
    ├─── Has Pattern? ─────┐
    │                     │
    ▼ YES                 ▼ NO
┌──────────────┐    ┌──────────────┐
│ Apply        │    │ Keep Original│
│ Transformation│    │ Sentence      │
│ Rules:       │    │               │
│ - Universal  │    │               │
│   → Qualified│    │               │
│ - Essential  │    │               │
│   → Contingent│    │               │
│ - Superior   │    │               │
│   → Neutral  │    │               │
│ - Exclusion  │    │               │
│   → Inclusive│    │               │
│ - Prescript  │    │               │
│   → Observe  │    │               │
│ - Competence │    │               │
│   → Open     │    │               │
└──────────────┘    └──────────────┘
    │
    ▼
┌─────────────────────────┐
│ Check if Heavily         │
│ Modified                │
└─────────────────────────┘
    │
    ├─── Too Modified? ────┐
    │                     │
    ▼ YES                 ▼ NO
┌──────────────┐    ┌──────────────┐
│ Use Template │    │ Use          │
│ (Fallback)   │    │ Rewritten    │
│               │    │ Sentence     │
└──────────────┘    └──────────────┘
    │
    ▼
┌─────────────────────────┐
│ Combine Sentences        │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Check Coherence         │
│ (subject-verb,          │
│  no fragments)          │
└─────────────────────────┘
    │
    ├─── Coherent? ────────┐
    │                     │
    ▼ YES                 ▼ NO
┌──────────────┐    ┌──────────────┐
│ Return       │    │ Use Template │
│ Rewrite      │    │ (Fallback)   │
└──────────────┘    └──────────────┘
    │
    ▼
End: Return {suggested_rewrite: "...", explanation: "...", quality: "..."}
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│  Input Text  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Layer 1: Protected Class Detection │
│  ─────────────────────────────────── │
│  Input: Text                         │
│  Output: {classes, entities}         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Layer 1.5: Implicit Resolution     │
│  ─────────────────────────────────── │
│  Input: Text + classes               │
│  Output: {classes, entities}        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Layer 2: Pattern Detection         │
│  ─────────────────────────────────── │
│  Input: Text + classes              │
│  Output: {patterns, examples}       │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Layer 2.5: Generalization          │
│  ─────────────────────────────────── │
│  Input: Text                         │
│  Output: {patterns, examples}        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Layer 3: Type Classification       │
│  ─────────────────────────────────── │
│  Input: patterns + classes           │
│  Output: {bias_types}                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Layer 4: Causal Inference          │
│  ─────────────────────────────────── │
│  Input: Text + classes               │
│  Output: {detected, explanations}    │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Layer 5: Severity Calculation      │
│  ─────────────────────────────────── │
│  Input: types + classes + patterns  │
│  Output: {score, level, reasoning}  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Layer 6: Rewrite Generation        │
│  ─────────────────────────────────── │
│  Input: text + patterns + classes    │
│  Output: {rewrite, explanation, q}  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Layer 7: Output Assembly           │
│  ─────────────────────────────────── │
│  Input: All layer outputs            │
│  Output: Complete result             │
└──────┬──────────────────────────────┘
       │
       ▼
┌──────────────┐
│ Final Result │
└──────────────┘
```

---

## 🧩 Module Dependency Graph

```
                    ┌─────────────────┐
                    │   analyzer.js   │
                    │  (Orchestrator) │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ protected     │   │ biasPatterns  │   │ biasTypes     │
│ Classes.js    │   │ .js           │   │ .js           │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                    │
        │                   │                    │
        ▼                   ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ implicit      │   │ groupGen      │   │ causalMap     │
│ Resolver.js   │   │ Detector.js   │   │ .js           │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                    │
        │                   │                    │
        ▼                   ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ severity      │   │ qualifier     │   │ rewrite       │
│ Engine.js     │   │ Dampening.js  │   │ Engine.js     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                    │
        │                   │                    │
        ▼                   ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ coherence     │   │ neutrality    │   │ (Output)       │
│ Check.js      │   │ Templates.js   │   │               │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## 📈 Score Calculation Example

```
Input: "All women are naturally bad at math."

Step 1: Base Score
  bias_types = ["stereotyping"]
  weights = {stereotyping: 5.0}
  base = max(5.0) = 5.0

Step 2: Multiplier
  protected_classes = ["gender"]
  num_classes = 1
  multiplier = 1.0 + (1-1) × 0.1 = 1.0

Step 3: Harm Adjustment
  harm_patterns = (none)
  harm = 0

Step 4: Domain Adjustment
  domain = 0.5 (default)

Step 5: Raw Score
  raw = (5.0 × 1.0) + 0 + 0.5 = 5.5

Step 6: Qualifier Dampening
  qualifiers = (none)
  dampened = 5.5

Step 7: Calibration
  classes = ["gender"]
  calibration = 1.0 (gender)
  final = 5.5 × 1.0 = 5.5

Step 8: Clamp
  final = clamp(5.5, 0, 10) = 5.5

Step 9: Bias Level
  if 5.5 <= 8: "moderate"
  level = "moderate"

Result: {score: 5.5, bias_level: "moderate"}
```

---

## 🔄 Pattern Matching Example

```
Text: "All women are naturally bad at math."

Pattern: /\b(all|every|each)\s+\w+\s+(are|is)\b/gi

Matching Process:
  1. Find "All" → Match
  2. Find "women" → Match
  3. Find "are" → Match
  4. Pattern matched: "All women are"
  
Result: Pattern "Universal Claims" detected
        Example: "All women are naturally bad at math."
```

---

**Version**: 1.0  
**Last Updated**: 2024

