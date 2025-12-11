# Debug Guide for Bias Detection

## If bias is not being detected:

### 1. Check Server Logs
When you type text in the editor, check the **server terminal** (where `npm run dev` is running) for:
- `=== ANALYZER CALL START ===`
- `Bias Score: X`
- `Bias Level: X`
- Any error messages

### 2. Check Browser Console
Open browser DevTools (F12) and check Console tab for:
- `Calling /api/analyze with text: ...`
- `Response status: 200`
- `Analysis result received: ...`
- Any error messages

### 3. Test API Directly
Run the test script:
```powershell
cd biasguard-app
node test-api.js
```

This will test the API endpoint directly and show you the exact response.

### 4. Verify Analyzer Works
Test the analyzer directly:
```powershell
cd ..
node -e "const path = require('path'); const analyzerPath = path.resolve(__dirname, 'src', 'core', 'analyzer.js'); const BiasGuard4Analyzer = require(analyzerPath); const analyzer = new BiasGuard4Analyzer(); analyzer.analyze('Black people are inherently more violent.').then(r => console.log('Score:', r.bias_score, 'Level:', r.bias_level)).catch(e => console.error('Error:', e));"
```

Expected: Score: 10, Level: high

### 5. Common Issues

**Issue: Analyzer not found**
- Check server logs for "Looking for analyzer at: ..."
- Verify path exists: `..\src\core\analyzer.js` from biasguard-app directory

**Issue: API returns 503**
- Check server logs for error details
- Verify analyzer loads successfully (look for "✓ Analyzer loaded successfully")

**Issue: API returns 200 but score is 0**
- Check browser console for actual response data
- Verify `result.data.bias_score` is not undefined
- Check if `result.success` is true

**Issue: No API call being made**
- Check browser console for network errors
- Verify React Query is enabled (check `enabled` property in useRealTimeBiasAnalysis)

### 6. Restart Server
After making changes, always:
1. Stop server (Ctrl+C)
2. Clear cache: `Remove-Item -Recurse -Force .next`
3. Restart: `npm run dev`

