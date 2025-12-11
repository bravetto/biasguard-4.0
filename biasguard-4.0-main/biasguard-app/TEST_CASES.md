# Test Cases for BiasGuard Editor

Use these test cases in the editor to verify bias detection is working:

## High Bias Cases (Should detect bias)

1. **Gender Bias:**
   ```
   All women are naturally bad at math because they lack logical reasoning skills. This is why they shouldn't be engineers. Men are inherently better at technical work.
   ```
   Expected: Score 7-10, Level: high, Protected Classes: [gender]

2. **Race Bias:**
   ```
   Black people are inherently more violent than white people. They cannot control their impulses and should be avoided in public spaces.
   ```
   Expected: Score 8-10, Level: high, Protected Classes: [race]

3. **Simple Gender Bias:**
   ```
   All women are bad at math.
   ```
   Expected: Score ~5.5, Level: moderate, Protected Classes: [gender]

## Neutral Cases (Should NOT detect bias)

4. **Neutral Text:**
   ```
   Research indicates that individual performance varies across different tasks. Multiple factors contribute to outcomes, including education, experience, and personal motivation.
   ```
   Expected: Score 0-2, Level: none, Protected Classes: []

## How to Test

1. Open the editor at `http://localhost:3001/editor` (or your configured port)
2. Type or paste each test case
3. Wait ~1 second for analysis
4. Check the sidebar for:
   - Bias Score (should match expected range)
   - Bias Level (should match expected level)
   - Protected Classes (should match expected classes)
   - Bias Patterns (should show detected patterns)

## Debugging

If bias is not detected:
1. Open browser console (F12)
2. Check for API errors
3. Check server terminal for analyzer logs
4. Verify analyzer path is correct in server logs

