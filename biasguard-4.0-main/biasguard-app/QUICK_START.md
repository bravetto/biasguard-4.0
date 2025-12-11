# 🚀 BiasGuard Web App - Quick Start Guide

## ✅ Setup Complete!

The development server is starting. Once it's ready, you can access the application at:

## 🌐 UI Links to Test

### Main Pages:

1. **Landing Page (Home)**
   - URL: http://localhost:3000
   - Features: Hero section, features showcase, pricing tiers
   - Test: Navigate through the landing page, click "Start Writing" or "Get Started"

2. **Editor Page** ⭐ (Main Feature)
   - URL: http://localhost:3000/editor
   - Features: 
     - Real-time bias detection as you type
     - Interactive bias highlighting
     - Analysis sidebar with detailed insights
     - Bias score gauge
   - Test: Type text like "All women are bad at math" to see bias detection

3. **Dashboard Page**
   - URL: http://localhost:3000/dashboard
   - Features: Analytics, statistics, usage charts
   - Test: View your analysis history and stats

## 🧪 Test Scenarios

### Test 1: Basic Bias Detection
1. Go to: http://localhost:3000/editor
2. Type: "All women are naturally bad at math."
3. Expected: 
   - Yellow/orange highlight on biased text
   - Bias score appears in sidebar
   - Analysis shows "Universal Claims" pattern
   - Protected class: "gender" detected

### Test 2: Implicit Bias
1. Type: "People from that country are always late. It's just part of their culture."
2. Expected:
   - Bias score: 4-7 (moderate)
   - Patterns: "Universal Claims", "Cultural Essentialism"
   - Protected classes: "nationality", "ethnicity"

### Test 3: High Severity Bias
1. Type: "Those people are like animals. They don't deserve rights."
2. Expected:
   - Red highlight (high severity)
   - Bias score: 9-10
   - Pattern: "Dehumanization"
   - Level: "high"

### Test 4: No Bias
1. Type: "Research indicates that individual performance varies based on multiple factors."
2. Expected:
   - No highlights
   - Bias score: 0-2
   - Level: "none" or "mild"
   - Green checkmark in sidebar

## 🎨 UI Features to Test

### Editor Interface:
- ✅ Real-time typing with contentEditable
- ✅ Bias highlights with hover tooltips
- ✅ Status bar with word/character count
- ✅ Bias score indicator
- ✅ Export and Share buttons

### Analysis Sidebar:
- ✅ Animated sidebar (slides in from right)
- ✅ Bias score gauge (circular progress)
- ✅ Issue cards with details
- ✅ Protected classes display
- ✅ Suggested rewrites
- ✅ "Apply All Suggestions" button

### Landing Page:
- ✅ Hero section with CTA buttons
- ✅ Interactive demo section
- ✅ Features grid
- ✅ Pricing tiers
- ✅ Responsive navigation

## 🔧 Troubleshooting

### If the server doesn't start:
```bash
cd biasguard-4.0-main/biasguard-app
npm run dev
```

### If API errors occur:
- Check that the BiasGuard analyzer is accessible
- The API route will try to import from `../../src/core/analyzer.js`
- Alternatively, set `BIASGUARD_API_URL` in `.env.local` for external API

### If styles don't load:
- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.js` includes all content paths

## 📝 Notes

- The app uses **800ms debounce** for analysis (type and wait ~1 second)
- Analysis happens automatically as you type
- Sidebar can be closed/opened
- All animations use Framer Motion
- Responsive design works on mobile/tablet/desktop

## 🎯 Next Steps

1. Test all three pages
2. Try different bias scenarios
3. Check the analysis sidebar details
4. Test hover tooltips on highlighted text
5. Try the "Apply All Suggestions" feature

---

**Happy Testing! 🚀**

The app should be running at: **http://localhost:3000**

