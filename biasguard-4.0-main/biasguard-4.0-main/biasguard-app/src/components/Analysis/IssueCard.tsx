'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { BiasIssue } from '@/lib/types'
import { getBiasTextColor } from '@/lib/utils'

interface IssueCardProps {
  issue: BiasIssue
}

export function IssueCard({ issue }: IssueCardProps) {
  const level = issue.severity <= 3 ? 'mild' : 
                issue.severity <= 6 ? 'moderate' : 'high'
  
  const Icon = level === 'high' ? AlertTriangle : 
               level === 'moderate' ? AlertTriangle : 
               Info

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${getBiasTextColor(level)}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{issue.type}</h4>
            <span className={`text-xs px-2 py-0.5 rounded ${getBiasTextColor(level)} bg-opacity-10`}>
              {level}
            </span>
          </div>
          {issue.example && (
            <p className="text-sm text-gray-600 mb-2 italic">
              "{issue.example}"
            </p>
          )}
          <p className="text-sm text-gray-700 mb-3">
            {issue.explanation}
          </p>
          {issue.suggestion && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-green-800 mb-1">Suggestion:</div>
                  <div className="text-sm text-green-700">{issue.suggestion}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

