// BiasGuard 4.0 Test Suite
// Comprehensive bias detection testing

const testCases = [
  // ============ GENDER BIAS ============
  {
    id: 1,
    category: "Gender Bias",
    text: "Women are naturally bad at math and science.",
    expectedClasses: ["gender"],
    expectedBiasLevel: "high",
    description: "Explicit gender stereotype about abilities"
  },
  {
    id: 2,
    category: "Gender Bias",
    text: "Men shouldn't cry or show emotions.",
    expectedClasses: ["gender"],
    expectedBiasLevel: "moderate",
    description: "Gender role stereotype about emotions"
  },
  {
    id: 3,
    category: "Gender Bias",
    text: "She's pretty good for a female engineer.",
    expectedClasses: ["gender"],
    expectedBiasLevel: "moderate",
    description: "Backhanded compliment with gender bias"
  },
  
  // ============ AGE BIAS ============
  {
    id: 4,
    category: "Age Bias",
    text: "Old people can't learn new technology.",
    expectedClasses: ["age"],
    expectedBiasLevel: "moderate",
    description: "Age-based stereotype about learning"
  },
  {
    id: 5,
    category: "Age Bias",
    text: "Millennials are lazy and entitled.",
    expectedClasses: ["age"],
    expectedBiasLevel: "moderate",
    description: "Generational stereotype"
  },
  
  // ============ RACIAL/ETHNIC BIAS ============
  {
    id: 6,
    category: "Racial Bias",
    text: "Asian students are always good at math.",
    expectedClasses: ["ethnicity", "race"],
    expectedBiasLevel: "moderate",
    description: "Racial stereotype (even if positive)"
  },
  {
    id: 7,
    category: "Racial Bias",
    text: "Black people are naturally athletic.",
    expectedClasses: ["race"],
    expectedBiasLevel: "moderate",
    description: "Racial essentialism"
  },
  {
    id: 8,
    category: "Ethnic Bias",
    text: "Mexicans are all lazy workers.",
    expectedClasses: ["nationality", "ethnicity"],
    expectedBiasLevel: "high",
    description: "Ethnic slur and stereotype"
  },
  
  // ============ DISABILITY BIAS ============
  {
    id: 9,
    category: "Disability Bias",
    text: "Disabled people are a burden to society.",
    expectedClasses: ["disability"],
    expectedBiasLevel: "high",
    description: "Ableist statement"
  },
  {
    id: 10,
    category: "Disability Bias",
    text: "He's confined to a wheelchair.",
    expectedClasses: ["disability"],
    expectedBiasLevel: "low",
    description: "Negative disability framing"
  },
  
  // ============ RELIGIOUS BIAS ============
  {
    id: 11,
    category: "Religious Bias",
    text: "Muslims are terrorists.",
    expectedClasses: ["religion"],
    expectedBiasLevel: "severe",
    description: "Religious hate speech"
  },
  {
    id: 12,
    category: "Religious Bias",
    text: "Jews control all the banks.",
    expectedClasses: ["religion"],
    expectedBiasLevel: "severe",
    description: "Antisemitic conspiracy theory"
  },
  
  // ============ NATIONALITY BIAS ============
  {
    id: 13,
    category: "Nationality Bias",
    text: "Americans are all ignorant about the world.",
    expectedClasses: ["nationality"],
    expectedBiasLevel: "moderate",
    description: "National stereotype"
  },
  {
    id: 14,
    category: "Nationality Bias",
    text: "Chinese people eat weird food.",
    expectedClasses: ["nationality", "ethnicity"],
    expectedBiasLevel: "moderate",
    description: "Cultural bias"
  },
  
  // ============ SOCIOECONOMIC BIAS ============
  {
    id: 15,
    category: "Socioeconomic Bias",
    text: "Poor people are poor because they're lazy.",
    expectedClasses: ["SES"],
    expectedBiasLevel: "high",
    description: "Class-based stereotype"
  },
  {
    id: 16,
    category: "Socioeconomic Bias",
    text: "Homeless people are all drug addicts.",
    expectedClasses: ["SES"],
    expectedBiasLevel: "high",
    description: "Socioeconomic generalization"
  },
  
  // ============ LGBTQ+ BIAS ============
  {
    id: 17,
    category: "LGBTQ+ Bias",
    text: "Gay people shouldn't be allowed to adopt children.",
    expectedClasses: ["sexual_orientation"],
    expectedBiasLevel: "high",
    description: "Discriminatory statement"
  },
  
  // ============ DEHUMANIZATION ============
  {
    id: 18,
    category: "Dehumanization",
    text: "Those people are like animals.",
    expectedClasses: ["fictional_proxies"],
    expectedBiasLevel: "severe",
    description: "Dehumanizing language"
  },
  {
    id: 19,
    category: "Dehumanization",
    text: "Immigrants are an infestation.",
    expectedClasses: ["nationality"],
    expectedBiasLevel: "severe",
    description: "Dehumanizing metaphor"
  },
  
  // ============ NEUTRAL STATEMENTS ============
  {
    id: 20,
    category: "Neutral",
    text: "The weather is nice today.",
    expectedClasses: [],
    expectedBiasLevel: "none",
    description: "Neutral statement - no bias expected"
  },
  {
    id: 21,
    category: "Neutral",
    text: "I enjoy reading books in my free time.",
    expectedClasses: [],
    expectedBiasLevel: "none",
    description: "Neutral personal statement"
  },
  {
    id: 22,
    category: "Neutral",
    text: "The project deadline is next Friday.",
    expectedClasses: [],
    expectedBiasLevel: "none",
    description: "Neutral work statement"
  },
  
  // ============ SUBTLE BIAS ============
  {
    id: 23,
    category: "Subtle Bias",
    text: "She's surprisingly articulate for someone from that background.",
    expectedClasses: ["SES"],
    expectedBiasLevel: "moderate",
    description: "Subtle classist bias"
  },
  {
    id: 24,
    category: "Subtle Bias",
    text: "You speak English very well for a foreigner.",
    expectedClasses: ["nationality"],
    expectedBiasLevel: "moderate",
    description: "Subtle xenophobic bias"
  },
  
  // ============ COMPLEX/INTERSECTIONAL ============
  {
    id: 25,
    category: "Intersectional",
    text: "Black women are too aggressive for leadership positions.",
    expectedClasses: ["race", "gender"],
    expectedBiasLevel: "high",
    description: "Intersectional bias (race + gender)"
  },
  {
    id: 26,
    category: "Intersectional",
    text: "Elderly Asian immigrants don't integrate well.",
    expectedClasses: ["age", "ethnicity", "nationality"],
    expectedBiasLevel: "high",
    description: "Multiple bias categories"
  },
  
  // ============ HOSTILITY ============
  {
    id: 27,
    category: "Hostility",
    text: "We need to get rid of all those immigrants.",
    expectedClasses: ["nationality"],
    expectedBiasLevel: "severe",
    description: "Hostile exclusionary language"
  },
  {
    id: 28,
    category: "Hostility",
    text: "These people are a threat to our way of life.",
    expectedClasses: ["fictional_proxies"],
    expectedBiasLevel: "high",
    description: "Hostile othering"
  },
  
  // ============ PROFESSIONAL CONTEXTS ============
  {
    id: 29,
    category: "Professional",
    text: "We should hire more diverse candidates, but not lower our standards.",
    expectedClasses: [],
    expectedBiasLevel: "moderate",
    description: "Implicit bias in hiring context"
  },
  {
    id: 30,
    category: "Professional",
    text: "Women are better suited for nurturing roles like HR.",
    expectedClasses: ["gender"],
    expectedBiasLevel: "moderate",
    description: "Gender-based role assignment"
  }
];

async function runTests() {
  console.log("\n" + "=".repeat(80));
  console.log("                    BIASGUARD 4.0 TEST REPORT");
  console.log("                    " + new Date().toLocaleString());
  console.log("=".repeat(80) + "\n");
  
  const results = {
    total: testCases.length,
    passed: 0,
    failed: 0,
    errors: 0,
    details: []
  };
  
  const categoryStats = {};
  
  for (const testCase of testCases) {
    try {
      console.log(`\n[Test ${testCase.id}] ${testCase.category}: ${testCase.description}`);
      console.log(`   Input: "${testCase.text.substring(0, 60)}${testCase.text.length > 60 ? '...' : ''}"`);
      
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testCase.text })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.log(`   ❌ API Error: ${data.error}`);
        results.errors++;
        results.details.push({
          ...testCase,
          status: 'ERROR',
          error: data.error
        });
        continue;
      }
      
      const result = data.data;
      
      // Check if expected protected classes were detected
      const detectedClasses = result.protected_classes || [];
      const expectedClasses = testCase.expectedClasses || [];
      
      const classesMatch = expectedClasses.length === 0 
        ? detectedClasses.length === 0 
        : expectedClasses.some(ec => detectedClasses.includes(ec));
      
      // Check bias level
      const biasScore = result.bias_score || 0;
      let actualLevel = 'none';
      if (biasScore >= 8) actualLevel = 'severe';
      else if (biasScore >= 6) actualLevel = 'high';
      else if (biasScore >= 4) actualLevel = 'moderate';
      else if (biasScore >= 2) actualLevel = 'low';
      
      const levelMatch = testCase.expectedBiasLevel === 'none' 
        ? biasScore < 2 
        : biasScore >= 2;
      
      const passed = classesMatch && levelMatch;
      
      if (passed) {
        results.passed++;
        console.log(`   ✅ PASSED`);
      } else {
        results.failed++;
        console.log(`   ❌ FAILED`);
      }
      
      console.log(`   Score: ${biasScore}/10 (${result.bias_level})`);
      console.log(`   Classes: [${detectedClasses.join(', ')}] (expected: [${expectedClasses.join(', ')}])`);
      console.log(`   Patterns: [${(result.bias_patterns || []).join(', ')}]`);
      console.log(`   Types: [${(result.bias_types || []).join(', ')}]`);
      
      if (result.suggested_rewrite) {
        console.log(`   Rewrite: "${result.suggested_rewrite.substring(0, 80)}${result.suggested_rewrite.length > 80 ? '...' : ''}"`);
      }
      
      // Track category stats
      if (!categoryStats[testCase.category]) {
        categoryStats[testCase.category] = { passed: 0, failed: 0, total: 0 };
      }
      categoryStats[testCase.category].total++;
      if (passed) {
        categoryStats[testCase.category].passed++;
      } else {
        categoryStats[testCase.category].failed++;
      }
      
      results.details.push({
        ...testCase,
        status: passed ? 'PASSED' : 'FAILED',
        actual: {
          score: biasScore,
          level: result.bias_level,
          classes: detectedClasses,
          patterns: result.bias_patterns,
          types: result.bias_types,
          rewrite: result.suggested_rewrite
        }
      });
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.errors++;
      results.details.push({
        ...testCase,
        status: 'ERROR',
        error: error.message
      });
    }
  }
  
  // Print Summary
  console.log("\n" + "=".repeat(80));
  console.log("                           TEST SUMMARY");
  console.log("=".repeat(80));
  
  console.log(`\n📊 Overall Results:`);
  console.log(`   Total Tests:  ${results.total}`);
  console.log(`   ✅ Passed:    ${results.passed} (${((results.passed/results.total)*100).toFixed(1)}%)`);
  console.log(`   ❌ Failed:    ${results.failed} (${((results.failed/results.total)*100).toFixed(1)}%)`);
  console.log(`   ⚠️  Errors:    ${results.errors}`);
  
  console.log(`\n📁 Results by Category:`);
  for (const [category, stats] of Object.entries(categoryStats)) {
    const pct = ((stats.passed / stats.total) * 100).toFixed(0);
    const icon = stats.passed === stats.total ? '✅' : stats.passed > 0 ? '🔶' : '❌';
    console.log(`   ${icon} ${category}: ${stats.passed}/${stats.total} (${pct}%)`);
  }
  
  // Failed tests summary
  const failedTests = results.details.filter(d => d.status === 'FAILED');
  if (failedTests.length > 0) {
    console.log(`\n⚠️  Failed Tests:`);
    failedTests.forEach(t => {
      console.log(`   - Test ${t.id}: ${t.description}`);
      console.log(`     Expected: [${t.expectedClasses.join(', ')}] | Got: [${t.actual.classes.join(', ')}]`);
    });
  }
  
  console.log("\n" + "=".repeat(80));
  console.log("                         END OF REPORT");
  console.log("=".repeat(80) + "\n");
  
  return results;
}

// Run tests
runTests().then(results => {
  process.exit(results.failed + results.errors > 0 ? 1 : 0);
}).catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});

