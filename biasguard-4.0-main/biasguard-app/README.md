# BiasGuard 4.0 Web Application

A modern, Grammarly-style web interface for real-time bias detection in text. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run dev:3000` - Start on port 3000
- `npm run dev:5000` - Start on port 5000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
biasguard-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts          # API endpoint for bias analysis
│   │   ├── editor/
│   │   │   └── page.tsx              # Main editor page
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── Analysis/
│   │   │   ├── AnalysisSidebar.tsx   # Bias analysis results sidebar
│   │   │   ├── BiasScoreGauge.tsx    # Circular score gauge
│   │   │   └── IssueCard.tsx         # Individual bias issue card
│   │   ├── BiasEditor/
│   │   │   ├── BiasEditor.tsx        # Main text editor component
│   │   │   └── BiasHighlight.tsx     # Text highlighting component
│   │   └── Layout/
│   │       ├── Header.tsx            # App header
│   │       └── Footer.tsx             # App footer
│   ├── hooks/
│   │   ├── useRealTimeBiasAnalysis.ts # Real-time analysis hook
│   │   ├── useDebouncedValue.ts     # Debounce hook
│   │   └── useLocalStorage.ts        # Local storage hook
│   ├── lib/
│   │   ├── api.ts                    # API client
│   │   ├── types.ts                  # TypeScript types
│   │   ├── utils.ts                  # Utility functions
│   │   └── biasguard-analyzer.js    # Analyzer wrapper (CommonJS bridge)
│   └── store/
│       └── appStore.ts               # Zustand state management
└── public/                           # Static assets
```

## 🔧 Architecture

### How It Works

1. **User Input**: Text is entered in the `BiasEditor` component
2. **Debouncing**: Input is debounced (800ms) to avoid excessive API calls
3. **API Request**: `useRealTimeBiasAnalysis` hook calls `/api/analyze`
4. **Analyzer Loading**: API route uses `biasguard-analyzer.js` wrapper to load the CommonJS analyzer
5. **Analysis**: BiasGuard 4.0's 7-layer pipeline analyzes the text
6. **Results**: Analysis results are displayed in the sidebar with highlights in the editor

### Key Components

#### API Route (`src/app/api/analyze/route.ts`)
- Handles POST requests for text analysis
- Uses the `biasguard-analyzer.js` wrapper to load the analyzer
- Returns formatted analysis results

#### Analyzer Wrapper (`src/lib/biasguard-analyzer.js`)
- **Critical Component**: Bridges Next.js (ES modules) with BiasGuard (CommonJS)
- Uses `createRequire()` for proper module loading
- Automatically finds the analyzer at `../src/core/analyzer.js`
- Works on any machine (portable path resolution)

#### Real-Time Analysis Hook (`src/hooks/useRealTimeBiasAnalysis.ts`)
- Uses React Query for caching and state management
- Debounces input to reduce API calls
- Handles errors gracefully

## 🎯 Features

- ✅ **Real-time Bias Detection**: Analyzes text as you type
- ✅ **Visual Highlights**: Highlights biased phrases in the editor
- ✅ **Detailed Analysis**: Shows bias score, level, patterns, and protected classes
- ✅ **Suggestions**: Provides rewrite suggestions for biased text
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Accessible**: WCAG compliant with keyboard navigation
- ✅ **Portable**: Works on any machine without hardcoded paths

## 🧪 Testing

### Test Cases

See `TEST_CASES.md` for comprehensive test cases. Quick examples:

**High Bias:**
- "Black people are inherently more violent." → Score: 10, Level: high
- "All women are bad at math." → Score: 5.5, Level: moderate

**No Bias:**
- "Research indicates that individual performance varies." → Score: 0, Level: none

### Manual Testing

1. Open `http://localhost:3001/editor`
2. Type test cases from `TEST_CASES.md`
3. Verify bias scores match expected results
4. Check that highlights appear for biased text
5. Verify sidebar shows correct analysis

## 🐛 Troubleshooting

### Analyzer Not Found

If you see "Analyzer not found" errors:

1. **Check Path**: Ensure `../src/core/analyzer.js` exists relative to `biasguard-app`
2. **Check Server Logs**: Look for "🔍 Finding analyzer" messages
3. **Verify Structure**: 
   ```
   biasguard-4.0-main/
   ├── src/
   │   └── core/
   │       └── analyzer.js  ← Must exist here
   └── biasguard-app/
   ```

### Port Already in Use

```bash
# Use a different port
npm run dev:5000

# Or kill the process using port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Server Not Responding

1. **Clear Cache**: `Remove-Item -Recurse -Force .next`
2. **Restart Server**: Stop (Ctrl+C) and restart `npm run dev`
3. **Check Logs**: Look for compilation errors in terminal

### Bias Not Detected

1. **Check Browser Console**: Look for API errors (F12)
2. **Check Server Terminal**: Look for "✅ Analysis result" logs
3. **Verify Analyzer**: Test directly:
   ```bash
   node -e "const { BiasGuard4Analyzer } = require('./src/lib/biasguard-analyzer.js'); const a = new BiasGuard4Analyzer(); a.analyze('All women are bad at math.').then(r => console.log('Score:', r.bias_score));"
   ```

## 🔍 Debugging

### Enable Debug Logs

The application includes comprehensive logging:

- **Browser Console**: API calls, responses, errors
- **Server Terminal**: Analyzer loading, analysis results
- **Look for**: 🔍, 📦, ✅, ❌ emoji prefixes in logs

### Common Log Messages

- `🔍 Finding analyzer` - Searching for analyzer file
- `📦 Loading BiasGuard analyzer` - Loading the analyzer module
- `✅ BiasGuard analyzer loaded successfully!` - Analyzer ready
- `✅ Analysis result` - Analysis complete
- `❌ Failed to load` - Error loading analyzer

## 📚 API Reference

### POST `/api/analyze`

Analyzes text for bias.

**Request:**
```json
{
  "text": "Your text here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bias_score": 5.5,
    "bias_level": "moderate",
    "protected_classes": ["gender"],
    "bias_patterns": ["Universal Claims"],
    "bias_types": ["stereotyping"],
    "examples": ["All women are bad at math"],
    "suggested_rewrite": "...",
    "explanation": "...",
    "causal_bias": {
      "detected": true,
      "explanations": [...]
    },
    "severity": {
      "score": 5.5,
      "reasoning": "..."
    }
  }
}
```

## 🛠️ Development

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **New Hooks**: Add to `src/hooks/`
3. **API Changes**: Update `src/app/api/analyze/route.ts`
4. **Types**: Update `src/lib/types.ts`

### Code Style

- TypeScript strict mode enabled
- ESLint configured
- Prettier recommended
- Follow existing component patterns

## 📝 Notes

### Portability

The analyzer wrapper (`biasguard-analyzer.js`) uses dynamic path resolution to find the analyzer. This means:

- ✅ Works on any machine
- ✅ No hardcoded paths
- ✅ Works in different directory structures
- ✅ Automatically searches for analyzer

### Performance

- Analysis is debounced (800ms) to reduce API calls
- React Query caches results (30s stale time)
- Analyzer instance is cached after first load
- Large texts are truncated (50,000 char limit)

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Ensure all test cases pass

## 📄 License

See main project LICENSE file.

## 🆘 Support

For issues:
1. Check `DEBUG_GUIDE.md` for troubleshooting
2. Check server terminal logs
3. Check browser console (F12)
4. Verify analyzer path exists

---

**Built with ❤️ using BiasGuard 4.0**
