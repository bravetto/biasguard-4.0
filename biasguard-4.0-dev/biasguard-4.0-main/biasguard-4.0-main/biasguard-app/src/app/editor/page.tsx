'use client'

import { useState, useEffect } from 'react'
import { BiasEditor } from '@/components/BiasEditor/BiasEditor'
import { AnalysisSidebar } from '@/components/Analysis/AnalysisSidebar'
import { Header } from '@/components/Layout/Header'

export default function EditorPage() {
  const [text, setText] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Listen for apply suggestion events
  useEffect(() => {
    const handleApplySuggestion = (e: CustomEvent) => {
      if (e.detail?.suggestion) {
        console.log('📝 Applying suggestion from sidebar:', e.detail.suggestion)
        setText(e.detail.suggestion)
      }
    }
    
    window.addEventListener('biasguard-apply-suggestion', handleApplySuggestion as EventListener)
    return () => {
      window.removeEventListener('biasguard-apply-suggestion', handleApplySuggestion as EventListener)
    }
  }, [])

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
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

