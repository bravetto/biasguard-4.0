# BiasGuard 4.0: Quick Reference Guide

## 🎯 Core Concepts (30-Second Summary)

**What it does**: Detects bias in text using pattern matching and rule-based logic.

**How it works**: 7-layer pipeline that progressively analyzes text.

**Output**: Bias score (0-10), bias level, protected classes, patterns, and neutral rewrite.

---

## 📊 The 7 Layers (At a Glance)

| Layer | Name | What It Does | Key Algorithm |
|-------|------|--------------|---------------|
| 1 | PCEP | Finds protected classes | Set operations + Regex |
| 1.5 | Implicit Resolver | Finds indirect references | Pattern matching |
| 2 | SPE | Detects bias patterns | Regex pattern matching |
| 2.5 | Generalization | Finds universal claims | Regex + Sentence analysis |
| 3 | HTC | Classifies bias types | Pattern → Type mapping |
| 4 | CIBM | Detects causal links | Graph-based path finding |
| 5 | CSE | Calculates severity | Weighted scoring |
| 6 | MSG | Generates rewrite | Rule-based transformation |
| 7 | Output | Assembles result | Data aggregation |

---

## 🔢 Mathematical Formulas

### Severity Score Calculation

```
Base Score (B) = max(weight(bias_type))

Multiplier (M) = 1.0 + (num_classes - 1) × 0.1

Raw Score = (B × M) + Harm + Domain

Calibration (C) = {
  0.85 if nationality/ethnicity,
  0.95 if age,
  0.88 if cultural,
  1.0 otherwise
}

Final Score = Raw × C (clamped to [0, 10])
```

### Bias Level Classification

```
if score == 0: "none"
else if score <= 3: "mild"
else if score <= 8: "moderate"
else: "high"
```

---

## 🎨 Design Patterns Used

1. **Pipeline Pattern**: Sequential processing through layers
2. **Strategy Pattern**: Different algorithms for similar tasks
3. **Template Method**: Skeleton algorithm with customizable steps
4. **Factory Pattern**: Centralized object creation
5. **Set Operations**: Union, intersection for class detection

---

## 📝 Common Patterns Detected

| Pattern | Regex Example | Bias Type |
|---------|--------------|-----------|
| Universal Claims | `/\b(all|every)\s+\w+\s+(are|is)\b/` | stereotyping |
| Essentialism | `/\b(inherently|naturally|born)\s+\w+\b/` | prejudice |
| Superiority | `/\b(better|worse|superior)\s+(than|to)\b/` | prejudice |
| Exclusionary | `/\b(real|true)\s+\w+\s+(don't|can't)\b/` | exclusion |
| Prescriptive | `/\b(should|must|ought)\s+\w+\b/` | prescriptive_harm |
| Competence | `/\b(can't|cannot|lack|unable)\s+\w+\b/` | performance_bias |

---

## 🔍 Protected Classes

**Explicit Classes**:
- gender, race, ethnicity, religion, nationality
- disability, age, sexuality, SES
- appearance, weight

**Implicit Classes**:
- fictional_proxies (for "those people", "they", etc.)

---

## ⚙️ Key Algorithms

### Algorithm 1: Protected Class Detection
```
For each category in protected_classes:
  Check explicit patterns
  Check implicit patterns
  If match: add to detected_classes
Return detected_classes
```

### Algorithm 2: Pattern Matching
```
For each pattern in bias_patterns:
  Apply regex to text
  If match: add pattern name
  Extract example sentence
Return {patterns, examples}
```

### Algorithm 3: Severity Calculation
```
base = max(weight(bias_type))
multiplier = 1.0 + (num_classes - 1) × 0.1
raw = (base × multiplier) + harm + domain
final = raw × calibration_factor
Clamp to [0, 10]
```

---

## 🧮 Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Protected Class Detection | O(n × m) | O(k) |
| Pattern Matching | O(n × p) | O(e) |
| Severity Calculation | O(b + h) | O(1) |
| Causal Inference | O(s × p) | O(e) |
| Text Rewriting | O(n × r) | O(n) |

Where:
- n = text length
- m = number of patterns
- p = number of patterns
- k = unique matches
- e = examples
- b = bias types
- h = harm patterns
- s = sentences
- r = rewrite rules

---

## 📚 File Structure

```
src/
├── core/
│   ├── analyzer.js          # Main orchestrator (7-layer pipeline)
│   ├── biasPatterns.js      # Pattern definitions (regex)
│   ├── biasTypes.js         # Type taxonomy + weights
│   ├── protectedClasses.js  # Class definitions + patterns
│   └── causalMap.js         # Causal inference patterns
├── implicit/
│   ├── implicitResolver.js  # Group → class mapping
│   └── groupGeneralizationDetector.js  # Universal claims
├── severity/
│   ├── severityEngine.js    # Score calculation
│   └── qualifierDampening.js  # Qualifier reduction
└── rewrite/
    ├── rewriteEngine.js     # Text transformation
    ├── neutralityTemplates.js  # Neutral templates
    └── coherenceCheck.js    # Quality validation
```

---

## 🎯 Usage Example

```javascript
const BiasGuard4Analyzer = require('./src/core/analyzer');
const analyzer = new BiasGuard4Analyzer();

const result = await analyzer.analyze('All women are bad at math.');

console.log(result.bias_score);        // 5.5
console.log(result.bias_level);       // "moderate"
console.log(result.protected_classes); // ["gender"]
console.log(result.bias_patterns);    // ["Universal Claims"]
console.log(result.bias_types);       // ["stereotyping"]
console.log(result.suggested_rewrite); // "Some women may face..."
```

---

## 🔗 Similar Problems

1. **Spam Detection**: Pattern matching + scoring
2. **Sentiment Analysis**: Text classification + scoring
3. **Plagiarism Detection**: Pattern matching + similarity
4. **Grammar Checking**: Rule-based transformation
5. **Content Moderation**: Multi-layer analysis

---

## 💡 Key Insights

1. **No Machine Learning**: Uses classical algorithms (regex, set theory, weighted scoring)
2. **Transparent**: Every decision is explainable
3. **Mathematically Sound**: All calculations are provable
4. **Modular**: Each layer is independent
5. **Extensible**: Easy to add new patterns/rules

---

## 🚀 Quick Start

```bash
# Run tests
npm test

# Analyze text
node -e "
const Analyzer = require('./src/core/analyzer');
const a = new Analyzer();
a.analyze('All women are bad at math.').then(r => console.log(r));
"
```

---

**Version**: 1.0  
**Last Updated**: 2024

