'use client'

import { motion } from 'framer-motion'
import { getBiasColor, getBiasTextColor, formatBiasLevel } from '@/lib/utils'

interface BiasScoreGaugeProps {
  score: number
  level: 'none' | 'mild' | 'moderate' | 'high'
  isLoading?: boolean
}

export function BiasScoreGauge({ score, level, isLoading }: BiasScoreGaugeProps) {
  const percentage = (score / 10) * 100
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (percentage / 100) * circumference

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={getBiasTextColor(level)}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getBiasTextColor(level)}`}>
              {score.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">/ 10</div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className={`text-lg font-semibold ${getBiasTextColor(level)}`}>
          {formatBiasLevel(level)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Bias Level
        </div>
      </div>
    </div>
  )
}

