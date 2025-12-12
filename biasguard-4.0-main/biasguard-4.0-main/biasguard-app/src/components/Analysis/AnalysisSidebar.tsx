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
  const { data: analysis, isLoading: isAnalyzing } = useRealTimeBiasAnalysis(text)

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
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <BiasScoreGauge 
            score={analysis?.bias_score || 0}
            level={analysis?.bias_level || 'none'}
            isLoading={false}
          />
        )}
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
          ) : analysis && analysis.bias_patterns && analysis.bias_patterns.length > 0 ? (
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

              {analysis.protected_classes && analysis.protected_classes.length > 0 && (
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-xs font-medium text-blue-800 mb-2">Protected Classes Detected:</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.protected_classes.map((cls, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-3">
                <button 
                  onClick={() => {
                    if (analysis.suggested_rewrite) {
                      console.log('📝 Apply All Suggestions clicked:', analysis.suggested_rewrite)
                      // Dispatch event to apply suggestion
                      window.dispatchEvent(new CustomEvent('biasguard-apply-suggestion', {
                        detail: { suggestion: analysis.suggested_rewrite }
                      }))
                    }
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Apply All Suggestions
                </button>
                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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

