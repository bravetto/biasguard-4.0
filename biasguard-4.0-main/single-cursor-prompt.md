# BiasGuard 4.0: Complete Grammarly-Style Interface - Single Cursor Prompt

Build a production-ready, market-ready web application interface for BiasGuard 4.0 that exactly matches Grammarly's user experience and functionality, but for bias detection instead of grammar checking.

## Project Setup & Tech Stack

Create a Next.js 14 project with TypeScript using these exact dependencies:

```json
{
  "name": "biasguard-app",
  "version": "1.0.0",
  "dependencies": {
    "next": "^14.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.47.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "lucide-react": "^0.290.0",
    "recharts": "^2.8.0",
    "react-hotkeys-hook": "^4.4.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

## Complete File Structure

Create this exact folder structure with all files:

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx (landing page)
│   ├── editor/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── api/
│       └── analyze/
│           └── route.ts
├── components/
│   ├── ui/ (Radix components)
│   ├── BiasEditor/
│   │   ├── BiasEditor.tsx
│   │   ├── BiasHighlight.tsx
│   │   └── TextSegment.tsx
│   ├── Analysis/
│   │   ├── AnalysisSidebar.tsx
│   │   ├── IssueCard.tsx
│   │   ├── BiasScoreGauge.tsx
│   │   └── SuggestionPopover.tsx
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   └── Dashboard/
│       ├── StatsCards.tsx
│       └── UsageChart.tsx
├── hooks/
│   ├── useRealTimeBiasAnalysis.ts
│   ├── useDebouncedValue.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   └── types.ts
└── store/
    └── appStore.ts
```

## Core Implementation

### 1. Main App Layout (app/layout.tsx)
```tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })
const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

### 2. Landing Page (app/page.tsx)
Create a modern landing page with:
- Hero section with animated text demo
- Value proposition ("Fix bias, not just grammar")
- Interactive demo showing bias detection
- Pricing tiers (Free/Pro/Enterprise)
- Social proof and testimonials
- CTA buttons leading to /editor

### 3. Main Editor Interface (app/editor/page.tsx)
```tsx
'use client'
import { useState } from 'react'
import { BiasEditor } from '@/components/BiasEditor/BiasEditor'
import { AnalysisSidebar } from '@/components/Analysis/AnalysisSidebar'
import { Header } from '@/components/Layout/Header'

export default function EditorPage() {
  const [text, setText] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <div className="flex-1">
          <BiasEditor 
            value={text}
            onChange={setText}
            className="h-full"
          />
        </div>
        {sidebarOpen && (
          <AnalysisSidebar 
            text={text}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
```

### 4. Bias Editor Component (components/BiasEditor/BiasEditor.tsx)
```tsx
'use client'
import { useState, useCallback, useRef } from 'react'
import { useRealTimeBiasAnalysis } from '@/hooks/useRealTimeBiasAnalysis'
import { BiasHighlight } from './BiasHighlight'
import { motion } from 'framer-motion'

interface BiasEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function BiasEditor({ value, onChange, className }: BiasEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const { analysis, isAnalyzing } = useRealTimeBiasAnalysis(value)

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || ''
    onChange(newText)
  }, [onChange])

  const renderTextWithHighlights = () => {
    if (!analysis?.examples || analysis.examples.length === 0) {
      return value
    }

    // Split text into segments with bias highlights
    let segments = [{ text: value, hasBias: false, biasInfo: null }]
    
    analysis.examples.forEach((example, index) => {
      const biasInfo = {
        type: analysis.bias_patterns?.[index] || 'Unknown',
        severity: analysis.bias_score,
        suggestion: analysis.suggested_rewrite || '',
        explanation: `This text contains ${analysis.bias_patterns?.[index]?.toLowerCase()} bias.`
      }
      
      segments = insertBiasHighlight(segments, example, biasInfo)
    })

    return segments.map((segment, index) => 
      segment.hasBias ? (
        <BiasHighlight
          key={index}
          text={segment.text}
          biasInfo={segment.biasInfo}
        />
      ) : (
        <span key={index}>{segment.text}</span>
      )
    )
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <motion.div 
            className={`w-3 h-3 rounded-full ${
              isAnalyzing ? 'bg-yellow-400' : 
              analysis?.bias_level === 'none' ? 'bg-green-400' :
              analysis?.bias_level === 'mild' ? 'bg-yellow-400' :
              analysis?.bias_level === 'moderate' ? 'bg-orange-400' : 'bg-red-400'
            }`}
            animate={isAnalyzing ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ repeat: isAnalyzing ? Infinity : 0, duration: 1 }}
          />
          <span className="text-sm text-gray-600">
            {isAnalyzing ? 'Analyzing for bias...' : 
             analysis ? `Bias Level: ${analysis.bias_level}` : 'Ready to analyze'}
          </span>
          <span className="text-sm text-gray-400">
            {value.length} chars • {Math.ceil(value.split(' ').length / 200)} min read
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
            Export
          </button>
          <button className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100">
            Share
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div 
        ref={editorRef}
        className="flex-1 p-6 overflow-y-auto focus:outline-none bg-white"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{ 
          lineHeight: '1.7',
          fontSize: '16px',
          fontFamily: 'Inter, system-ui, sans-serif',
          minHeight: '500px'
        }}
        placeholder="Start writing to detect bias in your text..."
      >
        {value.length === 0 ? (
          <div className="text-gray-400 pointer-events-none">
            Start writing to detect bias in your text...
          </div>
        ) : (
          <div className="whitespace-pre-wrap">
            {renderTextWithHighlights()}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 border-t bg-gray-50">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{value.split(' ').filter(w => w.length > 0).length} words</span>
          <span>{value.length} characters</span>
        </div>
        
        {analysis && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Bias Score:</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${
                    analysis.bias_score <= 3 ? 'bg-green-400' :
                    analysis.bias_score <= 6 ? 'bg-yellow-400' :
                    analysis.bias_score <= 8 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(analysis.bias_score / 10) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm font-medium">{analysis.bias_score}/10</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to insert bias highlights
function insertBiasHighlight(segments: any[], biasText: string, biasInfo: any) {
  const newSegments = []
  
  for (const segment of segments) {
    if (segment.hasBias) {
      newSegments.push(segment)
      continue
    }
    
    const index = segment.text.indexOf(biasText)
    if (index === -1) {
      newSegments.push(segment)
      continue
    }
    
    if (index > 0) {
      newSegments.push({
        text: segment.text.substring(0, index),
        hasBias: false,
        biasInfo: null
      })
    }
    
    newSegments.push({
      text: biasText,
      hasBias: true,
      biasInfo
    })
    
    if (index + biasText.length < segment.text.length) {
      newSegments.push({
        text: segment.text.substring(index + biasText.length),
        hasBias: false,
        biasInfo: null
      })
    }
  }
  
  return newSegments
}
```

### 5. Analysis Sidebar (components/Analysis/AnalysisSidebar.tsx)
```tsx
'use client'
import { useRealTimeBiasAnalysis } from '@/hooks/useRealTimeBiasAnalysis'
import { BiasScoreGauge } from './BiasScoreGauge'
import { IssueCard } from './IssueCard'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnalysisSidebarProps {
  text: string
  onClose: () => void
}

export function AnalysisSidebar({ text, onClose }: AnalysisSidebarProps) {
  const { analysis, isAnalyzing } = useRealTimeBiasAnalysis(text)

  return (
    <motion.div 
      className="w-80 bg-white border-l border-gray-200 flex flex-col h-full"
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Bias Analysis</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        <BiasScoreGauge 
          score={analysis?.bias_score || 0}
          level={analysis?.bias_level || 'none'}
          isLoading={isAnalyzing}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div 
              key="loading"
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : analysis && analysis.bias_patterns?.length > 0 ? (
            <motion.div 
              key="results"
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="font-medium mb-4">
                Issues Found ({analysis.bias_patterns.length})
              </h3>
              
              <div className="space-y-3">
                {analysis.bias_patterns.map((pattern, index) => (
                  <IssueCard
                    key={index}
                    issue={{
                      type: pattern,
                      example: analysis.examples?.[index] || '',
                      severity: analysis.bias_score,
                      suggestion: analysis.suggested_rewrite || '',
                      explanation: `Detected ${pattern.toLowerCase().replace(/_/g, ' ')} bias.`
                    }}
                  />
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  Apply All Suggestions
                </button>
                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Learn About Bias Types
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              className="p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-medium mb-2">No bias detected!</h3>
              <p className="text-sm text-gray-600">
                Your text appears to be inclusive and neutral.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 text-center">
        <div className="text-xs text-gray-500">
          Powered by BiasGuard 4.0
        </div>
      </div>
    </motion.div>
  )
}
```

### 6. Real-Time Analysis Hook (hooks/useRealTimeBiasAnalysis.ts)
```tsx
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from './useDebouncedValue'

interface BiasAnalysisResult {
  bias_score: number
  bias_level: 'none' | 'mild' | 'moderate' | 'high'
  protected_classes: string[]
  bias_patterns: string[]
  bias_types: string[]
  examples: string[]
  suggested_rewrite: string
}

export function useRealTimeBiasAnalysis(text: string, debounceMs = 800) {
  const debouncedText = useDebouncedValue(text, debounceMs)

  return useQuery({
    queryKey: ['bias-analysis', debouncedText],
    queryFn: async (): Promise<BiasAnalysisResult> => {
      if (!debouncedText || debouncedText.length < 10) {
        return {
          bias_score: 0,
          bias_level: 'none',
          protected_classes: [],
          bias_patterns: [],
          bias_types: [],
          examples: [],
          suggested_rewrite: ''
        }
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: debouncedText })
      })

      if (!response.ok) throw new Error('Analysis failed')
      
      const result = await response.json()
      return result.data
    },
    enabled: debouncedText.length > 10,
    staleTime: 30000,
    refetchOnWindowFocus: false
  })
}
```

### 7. API Route (app/api/analyze/route.ts)
```tsx
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    // Call your BiasGuard API
    const response = await fetch(`${process.env.BIASGUARD_API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BIASGUARD_API_KEY}`
      },
      body: JSON.stringify({ text })
    })

    if (!response.ok) {
      throw new Error('BiasGuard API error')
    }

    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
```

### 8. Tailwind Config (tailwind.config.js)
```js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bias: {
          none: '#10b981',
          mild: '#f59e0b', 
          moderate: '#ef4444',
          high: '#dc2626'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    }
  },
  plugins: []
}
```

### 9. Global Styles (app/globals.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .bias-highlight {
    @apply relative cursor-pointer transition-all duration-200;
  }
  
  .bias-highlight-mild {
    @apply bg-yellow-100 border-b-2 border-yellow-400 hover:bg-yellow-200;
  }
  
  .bias-highlight-moderate {
    @apply bg-orange-100 border-b-2 border-orange-500 hover:bg-orange-200;
  }
  
  .bias-highlight-high {
    @apply bg-red-100 border-b-2 border-red-600 hover:bg-red-200;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### 10. Environment Variables (.env.local)
```
BIASGUARD_API_URL=http://localhost:3000
BIASGUARD_API_KEY=your-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Implementation Instructions

1. **Run these commands:**
```bash
npx create-next-app@latest biasguard-app --typescript --tailwind --app
cd biasguard-app
npm install @tanstack/react-query zustand framer-motion @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-tooltip lucide-react recharts react-hook-form clsx tailwind-merge
```

2. **Create all the files exactly as specified above**

3. **Key Features to Implement:**
   - Real-time bias detection with 800ms debounce
   - Interactive highlights with hover tooltips
   - Animated sidebar with detailed analysis
   - Responsive design for all screen sizes
   - Dark/light mode support
   - Export and sharing functionality
   - User authentication and subscription tiers

4. **Styling Guidelines:**
   - Use Grammarly's exact color scheme and spacing
   - Implement smooth animations for all interactions
   - Focus on accessibility with proper ARIA labels
   - Mobile-first responsive design

5. **Connect to BiasGuard API:**
   - Replace the API route with your actual BiasGuard endpoint
   - Handle authentication and rate limiting
   - Add error boundaries and loading states

This will create a production-ready Grammarly-style interface that can go to market immediately. The interface will be indistinguishable from Grammarly in terms of polish and user experience, but specialized for bias detection.