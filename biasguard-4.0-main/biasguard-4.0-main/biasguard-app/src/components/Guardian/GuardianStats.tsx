'use client'

import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, Zap, Shield } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '98.5%', label: 'Accuracy Rate' },
  { icon: CheckCircle, value: '2.4M+', label: 'Suggestions Made' },
  { icon: Zap, value: '800ms', label: 'Response Time' },
  { icon: Shield, value: '7', label: 'Bias Types Detected' },
]

export function GuardianStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm"
        >
          <stat.icon className="w-6 h-6 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

