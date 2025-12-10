# BiasGuard 4.0 - Complete File List for GitHub Repository

## ✅ Essential Files (49 files)

### Root Directory (4 files)
```
.gitignore
LICENSE
README.md
package.json
```

### Source Code (12 files)
```
src/
├── core/
│   ├── analyzer.js
│   ├── biasPatterns.js
│   ├── biasTypes.js
│   ├── causalMap.js
│   └── protectedClasses.js
├── implicit/
│   ├── groupGeneralizationDetector.js
│   └── implicitResolver.js
├── rewrite/
│   ├── coherenceCheck.js
│   ├── neutralityTemplates.js
│   └── rewriteEngine.js
└── severity/
    ├── qualifierDampening.js
    └── severityEngine.js
```

### Test Suite (33 files)
```
tests/
├── test-runner.js
└── cases/
    ├── 01-explicit-gender.json
    ├── 02-explicit-race.json
    ├── 03-implicit-nationality.json
    ├── 04-coded-xenophobia.json
    ├── 05-cultural-essentialism.json
    ├── 06-ses-bias.json
    ├── 07-health-bias.json
    ├── 08-nonprotected-neutral.json
    ├── 09-false-positive-qualified.json
    ├── 10-rewrite-coherence.json
    ├── 11-severity-boundary.json
    ├── 12-stereotype-mapping.json
    ├── 13-causal-path.json
    ├── 14-universal-claim.json
    ├── 15-null-entity.json
    ├── 16-multi-entity.json
    ├── 17-mixed-signal.json
    ├── 18-age-bias.json
    ├── 19-religion-bias.json
    ├── 20-sexuality-bias.json
    ├── 21-academic-language.json
    ├── 22-qualifier-dampening.json
    ├── 23-exclusionary-language.json
    ├── 24-performance-bias.json
    ├── 25-hostility-detection.json
    ├── 26-structural-discrimination.json
    ├── 27-dehumanization.json
    ├── 28-group-reference-implicit.json
    ├── 29-prescriptive-harm.json
    ├── 30-appearance-bias.json
    ├── 31-weight-bias.json
    └── 32-complex-multi-pattern.json
```

---

## ❌ Files to Exclude (Optional/Internal)

### Internal Documentation (4 files)
```
GIT_STATUS.md
PHANI_HANDOFF.md
PRE_WORK_COMPLETE.md
PRE_WORK_FIXES_COMPLETE.md
```

### Generated Reports (4 files - can be regenerated)
```
TEST_REPORT.md
TEST_REPORT.json
TEST_SUMMARY.md
generate-test-report.js
```

---

## Quick Copy Commands

### To copy only essential files:

**Windows PowerShell:**
```powershell
# Create new directory structure
mkdir biasguard-4.0-clean
cd biasguard-4.0-clean

# Copy essential files
Copy-Item ..\biasguard-4.0-main\.gitignore .
Copy-Item ..\biasguard-4.0-main\package.json .
Copy-Item ..\biasguard-4.0-main\README.md .
Copy-Item -Recurse ..\biasguard-4.0-main\src .
Copy-Item -Recurse ..\biasguard-4.0-main\tests .
```

**Linux/Mac:**
```bash
# Create new directory structure
mkdir biasguard-4.0-clean
cd biasguard-4.0-clean

# Copy essential files
cp ../biasguard-4.0-main/.gitignore .
cp ../biasguard-4.0-main/package.json .
cp ../biasguard-4.0-main/README.md .
cp -r ../biasguard-4.0-main/src .
cp -r ../biasguard-4.0-main/tests .
```

---

## File Verification

After copying, verify with:

```bash
# Count files
find . -type f | wc -l

# Expected: 49 files (or 47 if excluding .gitignore and LICENSE)
```

---

## Summary

| Category | Files | Include? |
|----------|-------|----------|
| Configuration | 4 | ✅ Yes |
| Source Code | 12 | ✅ Yes |
| Tests | 33 | ✅ Yes |
| **Total Essential** | **49** | ✅ |
| Internal Docs | 4 | ❌ No |
| Generated Reports | 4 | ❌ No (optional) |

**Total files to include in GitHub: 49**

