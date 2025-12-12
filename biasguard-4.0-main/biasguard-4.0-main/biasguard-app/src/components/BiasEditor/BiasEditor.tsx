'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRealTimeBiasAnalysis } from '@/hooks/useRealTimeBiasAnalysis'
import { motion } from 'framer-motion'

interface BiasEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function BiasEditor({ value, onChange, className }: BiasEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const { data: analysis, isLoading: isAnalyzing } = useRealTimeBiasAnalysis(value)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }, [onChange])

  // Sync scroll between textarea and overlay
  const handleScroll = useCallback(() => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  // Render highlights in overlay
  const renderHighlights = useCallback(() => {
    if (!value) {
      return <span className="text-gray-900">{value}</span>
    }

    // If no analysis or no examples, just show plain text
    if (!analysis?.examples || analysis.examples.length === 0) {
      return <span className="text-gray-900">{value}</span>
    }

    // Simple highlight rendering - find and highlight bias text
    const highlights: Array<{ start: number; end: number; level: string }> = []

    analysis.examples.forEach((example) => {
      const index = value.toLowerCase().indexOf(example.toLowerCase())
      if (index !== -1) {
        const level = analysis.bias_score <= 3 ? 'mild' : 
                     analysis.bias_score <= 6 ? 'moderate' : 'high'
        highlights.push({
          start: index,
          end: index + example.length,
          level
        })
      }
    })

    // If no highlights found, show plain text
    if (highlights.length === 0) {
      return <span className="text-gray-900">{value}</span>
    }

    // Sort highlights by position
    highlights.sort((a, b) => a.start - b.start)

    // Render highlights
    const elements: JSX.Element[] = []
    let lastIndex = 0

    highlights.forEach((highlight, idx) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        elements.push(
          <span key={`text-${idx}`} className="text-gray-900">
            {value.substring(lastIndex, highlight.start)}
          </span>
        )
      }

      // Add highlighted text
      const highlightClass = 
        highlight.level === 'mild' ? 'bg-yellow-100 border-b-2 border-yellow-400 text-gray-900' :
        highlight.level === 'moderate' ? 'bg-orange-100 border-b-2 border-orange-500 text-gray-900' :
        'bg-red-100 border-b-2 border-red-600 text-gray-900'

      elements.push(
        <span
          key={`highlight-${idx}`}
          className={`${highlightClass} cursor-pointer`}
          title={`Bias detected: ${analysis.bias_patterns?.[0] || 'Unknown'}. Click to apply suggestion.`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('🔴 Highlight clicked!')
            console.log('📊 Analysis:', analysis)
            console.log('💡 Has suggestion:', !!analysis.suggested_rewrite)
            if (analysis.suggested_rewrite) {
              console.log('✅ Applying suggestion:', analysis.suggested_rewrite)
              onChange(analysis.suggested_rewrite)
            } else {
              console.log('⚠️ No suggestion available')
            }
          }}
          style={{ userSelect: 'none' }}
        >
          {value.substring(highlight.start, highlight.end)}
        </span>
      )

      lastIndex = highlight.end
    })

    // Add remaining text
    if (lastIndex < value.length) {
      elements.push(
        <span key="text-end" className="text-gray-900">
          {value.substring(lastIndex)}
        </span>
      )
    }

    return elements.length > 0 ? elements : <span className="text-gray-900">{value}</span>
  }, [value, analysis])

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
            {value.length} chars • {Math.ceil(value.split(' ').filter(w => w.length > 0).length / 200)} min read
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
            Export
          </button>
          <button className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Editor Container - Simple textarea with visible text */}
      <div className="flex-1 relative overflow-hidden bg-white">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          className="w-full h-full p-6 resize-none border-0 outline-none bg-white text-gray-900 caret-blue-600"
          style={{ 
            lineHeight: '1.7',
            fontSize: '16px',
            fontFamily: 'Inter, system-ui, sans-serif',
            tabSize: 4,
          }}
          placeholder="Start writing to detect bias in your text..."
          spellCheck={false}
        />
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
              <span className="text-sm font-medium">{analysis.bias_score.toFixed(1)}/10</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

