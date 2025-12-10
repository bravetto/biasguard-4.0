# BiasGuard 4.0 - GitHub Repository Structure

## Recommended Directory Structure

```
biasguard-4.0/
├── .gitignore                    # Git ignore file
├── LICENSE                       # MIT License (create if missing)
├── README.md                     # Main project documentation
├── package.json                  # Node.js package configuration
│
├── src/                          # Source code
│   ├── core/                     # Core detection modules
│   │   ├── analyzer.js           # Main analyzer orchestrator
│   │   ├── biasPatterns.js       # Bias pattern definitions
│   │   ├── biasTypes.js          # Bias type taxonomy
│   │   ├── causalMap.js          # Causal bias detection
│   │   └── protectedClasses.js   # Protected class definitions
│   │
│   ├── implicit/                 # Implicit bias detection
│   │   ├── groupGeneralizationDetector.js
│   │   └── implicitResolver.js
│   │
│   ├── rewrite/                  # Rewrite engine
│   │   ├── coherenceCheck.js
│   │   ├── neutralityTemplates.js
│   │   └── rewriteEngine.js
│   │
│   └── severity/                 # Severity calculation
│       ├── qualifierDampening.js
│       └── severityEngine.js
│
└── tests/                        # Test suite
    ├── cases/                    # Test case files
    │   ├── 01-explicit-gender.json
    │   ├── 02-explicit-race.json
    │   ├── 03-implicit-nationality.json
    │   ├── 04-coded-xenophobia.json
    │   ├── 05-cultural-essentialism.json
    │   ├── 06-ses-bias.json
    │   ├── 07-health-bias.json
    │   ├── 08-nonprotected-neutral.json
    │   ├── 09-false-positive-qualified.json
    │   ├── 10-rewrite-coherence.json
    │   ├── 11-severity-boundary.json
    │   ├── 12-stereotype-mapping.json
    │   ├── 13-causal-path.json
    │   ├── 14-universal-claim.json
    │   ├── 15-null-entity.json
    │   ├── 16-multi-entity.json
    │   ├── 17-mixed-signal.json
    │   ├── 18-age-bias.json
    │   ├── 19-religion-bias.json
    │   ├── 20-sexuality-bias.json
    │   ├── 21-academic-language.json
    │   ├── 22-qualifier-dampening.json
    │   ├── 23-exclusionary-language.json
    │   ├── 24-performance-bias.json
    │   ├── 25-hostility-detection.json
    │   ├── 26-structural-discrimination.json
    │   ├── 27-dehumanization.json
    │   ├── 28-group-reference-implicit.json
    │   ├── 29-prescriptive-harm.json
    │   ├── 30-appearance-bias.json
    │   ├── 31-weight-bias.json
    │   └── 32-complex-multi-pattern.json
    │
    └── test-runner.js            # Test execution script
```

---

## Files to Include (Essential)

### ✅ Core Files
- **`.gitignore`** - Excludes node_modules, .DS_Store, etc.
- **`LICENSE`** - MIT License file (create if missing)
- **`README.md`** - Project documentation
- **`package.json`** - Package configuration

### ✅ Source Code (src/)
All files in `src/` directory:
- **core/** - 5 files (analyzer, patterns, types, causalMap, protectedClasses)
- **implicit/** - 2 files (groupGeneralizationDetector, implicitResolver)
- **rewrite/** - 3 files (coherenceCheck, neutralityTemplates, rewriteEngine)
- **severity/** - 2 files (qualifierDampening, severityEngine)

**Total: 12 source files**

### ✅ Tests (tests/)
- **test-runner.js** - Test execution script
- **cases/** - All 32 test case JSON files

**Total: 33 test files**

---

## Files to Exclude (Not Required)

### ❌ Internal Documentation (Optional)
- `GIT_STATUS.md` - Internal git status tracking
- `PHANI_HANDOFF.md` - Internal handoff documentation
- `PRE_WORK_COMPLETE.md` - Internal pre-work notes
- `PRE_WORK_FIXES_COMPLETE.md` - Internal fix documentation

### ❌ Generated Reports (Can be Regenerated)
- `TEST_REPORT.md` - Generated test report (can be regenerated)
- `TEST_REPORT.json` - Generated JSON report (can be regenerated)
- `TEST_SUMMARY.md` - Generated summary (can be regenerated)
- `generate-test-report.js` - Report generator utility (optional)

**Note:** These can be added to `.gitignore` or included if you want to provide pre-generated reports.

---

## Recommended .gitignore Contents

```
# Dependencies
node_modules/

# OS Files
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# IDE Files
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Logs
*.log
npm-debug.log*

# Optional: Generated Reports (uncomment if excluding)
# TEST_REPORT.md
# TEST_REPORT.json
# TEST_SUMMARY.md
```

---

## File Count Summary

| Category | Count | Status |
|----------|-------|--------|
| Core Configuration | 4 | ✅ Required |
| Source Files | 12 | ✅ Required |
| Test Files | 33 | ✅ Required |
| **Total Essential** | **49** | ✅ |
| Internal Docs | 4 | ❌ Optional |
| Generated Reports | 4 | ❌ Optional |

---

## Quick Setup for GitHub

1. **Create repository** on GitHub
2. **Copy essential files** (49 files listed above)
3. **Add .gitignore** (use recommended contents)
4. **Create LICENSE** file (MIT License)
5. **Verify README.md** is up to date
6. **Initialize and push:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: BiasGuard 4.0 - Open Source Anti-Bias Detection System"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

---

## Verification Checklist

Before pushing to GitHub, verify:

- ✅ All source files present (12 files in src/)
- ✅ All test files present (33 files in tests/)
- ✅ package.json configured correctly
- ✅ README.md is complete and accurate
- ✅ .gitignore excludes node_modules and OS files
- ✅ LICENSE file included (MIT)
- ✅ No sensitive data in files
- ✅ Test suite runs successfully (`npm test`)

---

## Minimal Structure (Absolute Minimum)

If you want the absolute minimum to run the project:

```
biasguard-4.0/
├── package.json
├── README.md
├── src/          (all 12 files)
└── tests/        (all 33 files)
```

**Total: 47 files** (minimum required to run)

---

## Recommended Structure (Best Practice)

Include configuration files for better developer experience:

```
biasguard-4.0/
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── src/          (all 12 files)
└── tests/        (all 33 files)
```

**Total: 49 files** (recommended)

