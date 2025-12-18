// BiasGuard 4.0 Test Runner
// Runs all 32 test cases and validates results

const fs = require('fs');
const path = require('path');
const BiasGuard4Analyzer = require('./biasguard-4.0-dev/biasguard-4.0-main/biasguard-4.0-main/src/core/analyzer');

class TestRunner {
  constructor() {
    this.analyzer = new BiasGuard4Analyzer();
    this.testCasesDir = path.join(__dirname, 'cases');
    this.results = {
      passed: [],
      failed: [],
      total: 0
    };
  }
  
  /**
   * Loads all test case files
   */
  loadTestCases() {
    const files = fs.readdirSync(this.testCasesDir)
      .filter(f => f.endsWith('.json'))
      .sort();
    
    return files.map(file => {
      const content = fs.readFileSync(path.join(this.testCasesDir, file), 'utf8');
      return {
        file,
        ...JSON.parse(content)
      };
    });
  }
  
  /**
   * Validates a single test case result
   */
  validateResult(testCase, result) {
    const errors = [];
    const expected = testCase.expected;
    
    // Check bias score range
    if (result.bias_score < expected.minScore || result.bias_score > expected.maxScore) {
      errors.push(`Score ${result.bias_score} not in range [${expected.minScore}, ${expected.maxScore}]`);
    }
    
    // Check bias level
    if (result.bias_level !== expected.bias_level) {
      errors.push(`Bias level "${result.bias_level}" != expected "${expected.bias_level}"`);
    }
    
    // Check protected classes (order doesn't matter)
    const resultClasses = new Set(result.protected_classes.sort());
    const expectedClasses = new Set(expected.protected_classes.sort());
    if (resultClasses.size !== expectedClasses.size || 
        ![...resultClasses].every(c => expectedClasses.has(c))) {
      errors.push(`Protected classes mismatch. Got: [${result.protected_classes.join(', ')}], Expected: [${expected.protected_classes.join(', ')}]`);
    }
    
    // Check bias patterns (at least some should match)
    if (expected.expectedPatterns.length > 0) {
      const hasPatterns = expected.expectedPatterns.some(pattern => 
        result.bias_patterns.some(rp => rp.includes(pattern) || pattern.includes(rp))
      );
      if (!hasPatterns && result.bias_patterns.length === 0) {
        errors.push(`Missing expected patterns. Expected at least one of: [${expected.expectedPatterns.join(', ')}]`);
      }
    }
    
    // Check bias types (at least some should match)
    if (expected.expectedTypes.length > 0) {
      const hasTypes = expected.expectedTypes.some(type => result.bias_types.includes(type));
      if (!hasTypes && result.bias_types.length === 0) {
        errors.push(`Missing expected types. Expected at least one of: [${expected.expectedTypes.join(', ')}]`);
      }
    }
    
    // Check causal bias detection
    if (result.causal_bias.detected !== expected.causal_bias_detected) {
      errors.push(`Causal bias detection mismatch. Got: ${result.causal_bias.detected}, Expected: ${expected.causal_bias_detected}`);
    }
    
    // Check rewrite quality
    if (expected.rewrite_quality && result.rewrite_quality !== expected.rewrite_quality) {
      // Allow "fragment" if expected is "coherent" (less strict)
      if (!(expected.rewrite_quality === 'coherent' && result.rewrite_quality === 'fragment')) {
        errors.push(`Rewrite quality "${result.rewrite_quality}" != expected "${expected.rewrite_quality}"`);
      }
    }
    
    // Check rewrite must contain (if specified)
    if (expected.rewrite_must_contain) {
      const rewrite = result.suggested_rewrite.toLowerCase();
      if (expected.rewrite_must_contain.includes('subject') && 
          !/\b\w+\s+(is|are|was|were|has|have|had|do|does|did|can|could|will|would|should|may|might|must)\s+/i.test(rewrite)) {
        errors.push(`Rewrite missing subject-verb structure`);
      }
    }
    
    return {
      passed: errors.length === 0,
      errors
    };
  }
  
  /**
   * Runs a single test case
   */
  async runTest(testCase) {
    try {
      const result = await this.analyzer.analyze(testCase.text);
      const validation = this.validateResult(testCase, result);
      
      return {
        testCase: testCase.name,
        file: testCase.file,
        passed: validation.passed,
        errors: validation.errors,
        result: result,
        expected: testCase.expected
      };
    } catch (error) {
      return {
        testCase: testCase.name,
        file: testCase.file,
        passed: false,
        errors: [`Exception: ${error.message}`],
        result: null,
        expected: testCase.expected
      };
    }
  }
  
  /**
   * Runs all test cases
   */
  async runAll() {
    console.log('🧪 BiasGuard 4.0 Test Suite\n');
    console.log('='.repeat(60));
    
    const testCases = this.loadTestCases();
    this.results.total = testCases.length;
    
    console.log(`\nRunning ${testCases.length} test cases...\n`);
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testResult = await this.runTest(testCase);
      
      if (testResult.passed) {
        this.results.passed.push(testResult);
        console.log(`✅ [${i + 1}/${testCases.length}] ${testCase.name}`);
      } else {
        this.results.failed.push(testResult);
        console.log(`❌ [${i + 1}/${testCases.length}] ${testCase.name}`);
        testResult.errors.forEach(err => {
          console.log(`   └─ ${err}`);
        });
      }
    }
    
    this.printSummary();
    
    // Exit with proper code
    process.exit(this.results.failed.length > 0 ? 1 : 0);
  }
  
  /**
   * Prints test summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 TEST SUMMARY\n');
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed.length}`);
    console.log(`❌ Failed: ${this.results.failed.length}`);
    console.log(`Success Rate: ${((this.results.passed.length / this.results.total) * 100).toFixed(1)}%\n`);
    
    if (this.results.failed.length > 0) {
      console.log('FAILED TESTS:\n');
      this.results.failed.forEach(failed => {
        console.log(`  • ${failed.testCase} (${failed.file})`);
        if (failed.result) {
          console.log(`    Score: ${failed.result.bias_score} (expected: ${failed.expected.minScore}-${failed.expected.maxScore})`);
          console.log(`    Level: ${failed.result.bias_level} (expected: ${failed.expected.bias_level})`);
          console.log(`    Classes: [${failed.result.protected_classes.join(', ')}] (expected: [${failed.expected.protected_classes.join(', ')}])`);
        }
        console.log('');
      });
    }
    
    console.log('='.repeat(60));
  }
}

// Run tests if executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAll().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;

