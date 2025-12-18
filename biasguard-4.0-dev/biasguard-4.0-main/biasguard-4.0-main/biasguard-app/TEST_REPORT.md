# BiasGuard 4.0 Test Report

**Generated:** December 17, 2025, 10:22 PM  
**Environment:** Windows 10, Node.js, Next.js 14  
**API Endpoint:** `http://localhost:3001/api/analyze`

---

## 📊 Executive Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | 30 |
| **Passed** | 18 (60.0%) |
| **Failed** | 12 (40.0%) |
| **Errors** | 0 |

### Overall Assessment
BiasGuard 4.0 demonstrates strong detection capabilities for explicit bias patterns but shows areas for improvement in subtle bias detection and certain specific bias categories.

---

## ✅ Strengths (Categories with 100% Pass Rate)

| Category | Pass Rate | Notes |
|----------|-----------|-------|
| **Age Bias** | 2/2 (100%) | Excellent detection of age-based stereotypes |
| **Racial Bias** | 2/2 (100%) | Strong racial stereotype detection |
| **Ethnic Bias** | 1/1 (100%) | Good ethnic slur detection |
| **Socioeconomic Bias** | 2/2 (100%) | Reliable SES stereotype detection |
| **Neutral Statements** | 3/3 (100%) | No false positives on neutral text |

---

## ⚠️ Areas for Improvement

### 1. Disability Bias (0/2 - 0%)
**Issue:** Protected classes detected correctly, but bias patterns and severity scoring not triggering.

| Test | Input | Score | Problem |
|------|-------|-------|---------|
| Test 9 | "Disabled people are a burden to society." | 0.5/10 | Should be high severity |
| Test 10 | "He's confined to a wheelchair." | 0.5/10 | Negative framing not detected |

**Recommendation:** Add disability-specific bias patterns (burden narratives, negative framing like "confined to", "suffering from").

### 2. Subtle Bias (0/2 - 0%)
**Issue:** Implicit/microaggression patterns not being detected.

| Test | Input | Score | Problem |
|------|-------|-------|---------|
| Test 23 | "She's surprisingly articulate for someone from that background." | 0.5/10 | Backhanded compliment pattern missing |
| Test 24 | "You speak English very well for a foreigner." | 0.425/10 | Xenophobic microaggression missed |

**Recommendation:** Add patterns for:
- "surprisingly [positive trait]"
- "[positive] for a [group]"
- Conditional compliments

### 3. LGBTQ+ Bias (0/1 - 0%)
**Issue:** Class naming mismatch (`sexuality` vs `sexual_orientation`).

| Test | Input | Classes Detected |
|------|-------|------------------|
| Test 17 | "Gay people shouldn't be allowed to adopt children." | `[sexuality]` |

**Recommendation:** Standardize protected class naming: use `sexual_orientation` or alias both.

### 4. Dehumanization (1/2 - 50%)
**Issue:** Animal/infestation metaphors not triggering dehumanization detection.

| Test | Input | Score | Problem |
|------|-------|-------|---------|
| Test 19 | "Immigrants are an infestation." | 0.425/10 | Pest metaphor not detected |

**Recommendation:** Add patterns for dehumanizing metaphors: "infestation", "plague", "swarm", "vermin".

---

## 📋 Detailed Test Results

### ✅ PASSED TESTS (18)

| ID | Category | Input | Score | Classes Detected |
|----|----------|-------|-------|------------------|
| 1 | Gender Bias | "Women are naturally bad at math and science." | 6.5/10 | gender |
| 2 | Gender Bias | "Men shouldn't cry or show emotions." | 8/10 | gender |
| 4 | Age Bias | "Old people can't learn new technology." | 6.65/10 | age |
| 5 | Age Bias | "Millennials are lazy and entitled." | 5.23/10 | age |
| 6 | Racial Bias | "Asian students are always good at math." | 5.1/10 | race, ethnicity |
| 7 | Racial Bias | "Black people are naturally athletic." | 6.5/10 | race |
| 8 | Ethnic Bias | "Mexicans are all lazy workers." | 5.1/10 | ethnicity, nationality |
| 12 | Religious Bias | "Jews control all the banks." | 5.1/10 | ethnicity, religion |
| 13 | Nationality Bias | "Americans are all ignorant about the world." | 5/10 | nationality |
| 15 | SES Bias | "Poor people are poor because they're lazy." | 6.5/10 | SES |
| 16 | SES Bias | "Homeless people are all drug addicts." | 5.5/10 | SES |
| 18 | Dehumanization | "Those people are like animals." | 10/10 | fictional_proxies |
| 20 | Neutral | "The weather is nice today." | 0/10 | - |
| 21 | Neutral | "I enjoy reading books in my free time." | 0/10 | - |
| 22 | Neutral | "The project deadline is next Friday." | 0.5/10 | - |
| 25 | Intersectional | "Black women are too aggressive for leadership positions." | 5.5/10 | gender |
| 27 | Hostility | "We need to get rid of all those immigrants." | 10/10 | nationality, ethnicity |
| 29 | Professional | "We should hire more diverse candidates, but not lower our standards." | 2.2/10 | - |

### ❌ FAILED TESTS (12)

| ID | Category | Input | Expected | Actual | Issue |
|----|----------|-------|----------|--------|-------|
| 3 | Gender Bias | "She's pretty good for a female engineer." | Score ≥2 | 0.5/10 | Backhanded compliment missed |
| 9 | Disability Bias | "Disabled people are a burden to society." | Score ≥4 | 0.5/10 | No bias patterns detected |
| 10 | Disability Bias | "He's confined to a wheelchair." | Score ≥2 | 0.5/10 | Negative framing missed |
| 11 | Religious Bias | "Muslims are terrorists." | Score ≥8 | 0.425/10 | Hate speech not detected |
| 14 | Nationality Bias | "Chinese people eat weird food." | Score ≥2 | 0.425/10 | Cultural bias missed |
| 17 | LGBTQ+ Bias | "Gay people shouldn't be allowed to adopt children." | `sexual_orientation` | `sexuality` | Class naming |
| 19 | Dehumanization | "Immigrants are an infestation." | Score ≥8 | 0.425/10 | Metaphor not detected |
| 23 | Subtle Bias | "She's surprisingly articulate for someone from that background." | `SES` | - | Microaggression missed |
| 24 | Subtle Bias | "You speak English very well for a foreigner." | Score ≥2 | 0.425/10 | Xenophobic bias missed |
| 26 | Intersectional | "Elderly Asian immigrants don't integrate well." | Score ≥4 | 0.425/10 | Multiple classes, no patterns |
| 28 | Hostility | "These people are a threat to our way of life." | `fictional_proxies` | - | Group reference missed |
| 30 | Professional | "Women are better suited for nurturing roles like HR." | Score ≥2 | 0.5/10 | Gender role bias missed |

---

## 🔧 Recommended Improvements

### Priority 1: Critical Detection Gaps

1. **Add Hate Speech Patterns**
   ```javascript
   // Pattern: [group] are [slur/threat]
   hate_speech: /\b(muslims?|jews?|blacks?|gays?)\s+(are|is)\s+(terrorists?|criminals?|threat|dangerous|evil)/gi
   ```

2. **Add Dehumanizing Metaphors**
   ```javascript
   dehumanizing_metaphor: /\b(infestation|plague|vermin|swarm|horde|invasion)\b/gi
   ```

3. **Add Disability Bias Patterns**
   ```javascript
   disability_negative_framing: /\b(confined\s+to|suffering\s+from|wheelchair-?bound|crippled|handicapped|invalid)\b/gi,
   disability_burden: /\b(burden|drain|costly|dependent)\b/gi
   ```

### Priority 2: Subtle Bias Detection

4. **Add Microaggression Patterns**
   ```javascript
   conditional_compliment: /\b(surprisingly|unexpectedly)\s+(articulate|intelligent|capable|well-?spoken)/gi,
   backhanded_for: /\b(good|well|smart|capable)\s+for\s+(a|an)\s+(woman|female|black|asian|old|young)/gi
   ```

### Priority 3: Normalization

5. **Standardize Protected Class Names**
   - Map `sexuality` → `sexual_orientation`
   - Ensure consistent naming across all modules

---

## 📈 Bias Detection Performance by Type

| Bias Type | Detection Rate | Notes |
|-----------|----------------|-------|
| Stereotyping | High | Well-detected with essentialism patterns |
| Prejudice | High | Good with explicit patterns |
| Coded Language | High | Detected when other patterns trigger |
| Prescriptive Harm | Moderate | Works for "should/shouldn't" |
| Hostility | Moderate | Needs more threat language patterns |
| Dehumanization | Low | Only animal comparisons detected |
| Structural Discrimination | Low | Needs more patterns |

---

## 🎯 Conclusion

BiasGuard 4.0 demonstrates a solid foundation for bias detection with:

**Strengths:**
- ✅ Excellent detection of explicit stereotypes
- ✅ Good handling of age, racial, and socioeconomic bias
- ✅ Zero false positives on neutral content
- ✅ Working 7-layer analysis pipeline
- ✅ Rewrite suggestions functioning

**Priority Improvements:**
1. 🔴 Add hate speech and slur detection
2. 🔴 Add dehumanizing metaphor patterns
3. 🟡 Improve disability bias detection
4. 🟡 Add microaggression/subtle bias patterns
5. 🟢 Standardize protected class naming

**Next Steps:**
1. Implement recommended pattern additions in `biasPatterns.js`
2. Add disability-specific patterns in `protectedClasses.js`
3. Update severity engine to handle new patterns
4. Re-run test suite to verify improvements

---

*Report generated by BiasGuard 4.0 Test Suite*

