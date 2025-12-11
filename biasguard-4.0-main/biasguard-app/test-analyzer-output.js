const path = require("path");
const analyzerPath = path.resolve(__dirname, "..", "src", "core", "analyzer.js");
const BiasGuard4Analyzer = require(analyzerPath);
const analyzer = new BiasGuard4Analyzer();

async function test() {
  const testCases = [
    "All women are bad at math.",
    "Black people are inherently more violent.",
    "Research indicates that individual performance varies."
  ];
  
  for (const text of testCases) {
    console.log(`\nTesting: "${text}"`);
    const result = await analyzer.analyze(text);
    console.log(`  Score: ${result.bias_score}, Level: ${result.bias_level}`);
    console.log(`  Protected Classes: ${JSON.stringify(result.protected_classes)}`);
    console.log(`  Patterns: ${JSON.stringify(result.bias_patterns)}`);
    console.log(`  Examples: ${JSON.stringify(result.examples || [])}`);
  }
}

test().catch(console.error);
