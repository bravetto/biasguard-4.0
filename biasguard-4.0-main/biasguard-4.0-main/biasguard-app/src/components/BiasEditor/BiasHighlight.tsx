'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiasInfo } from '@/lib/types'
import { getBiasColor } from '@/lib/utils'
import * as Tooltip from '@radix-ui/react-tooltip'

interface BiasHighlightProps {
  text: string
  biasInfo: BiasInfo | null
}

export function BiasHighlight({ text, biasInfo }: BiasHighlightProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  if (!biasInfo) {
    return <span>{text}</span>
  }

  const level = biasInfo.severity <= 3 ? 'mild' : 
                biasInfo.severity <= 6 ? 'moderate' : 'high'
  
  const highlightClass = `bias-highlight bias-highlight-${level}`

  return (
    <Tooltip.Provider>
      <Tooltip.Root open={isHovered}>
        <Tooltip.Trigger asChild>
          <motion.span
            className={highlightClass}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (biasInfo.suggestion) {
                console.log('🔴 Highlight clicked - Applying suggestion:', biasInfo.suggestion)
                // This will need to be connected to the parent component's onChange
                // For now, we'll dispatch a custom event
                window.dispatchEvent(new CustomEvent('biasguard-apply-suggestion', {
                  detail: { suggestion: biasInfo.suggestion }
                }))
              }
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            title={biasInfo.suggestion ? 'Click to apply suggestion' : 'Bias detected'}
          >
            {text}
          </motion.span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm max-w-xs z-50 shadow-lg"
            sideOffset={5}
          >
            <div className="font-semibold mb-1">{biasInfo.type}</div>
            <div className="text-xs text-gray-300 mb-2">{biasInfo.explanation}</div>
            {biasInfo.suggestion && (
              <div className="text-xs">
                <div className="text-gray-400 mb-1">Suggestion:</div>
                <div className="text-green-300">{biasInfo.suggestion}</div>
              </div>
            )}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

