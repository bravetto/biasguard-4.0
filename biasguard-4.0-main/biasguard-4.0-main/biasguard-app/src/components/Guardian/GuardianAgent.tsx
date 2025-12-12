'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AlertBubble {
  id: string
  text: string
  type: 'warning' | 'success' | 'info'
  x: number
  y: number
}

export function GuardianAgent() {
  const [state, setState] = useState<'idle' | 'analyzing' | 'alert' | 'success'>('idle')
  const [alerts, setAlerts] = useState<AlertBubble[]>([])

  useEffect(() => {
    // Cycle through states for demo
    const interval = setInterval(() => {
      setState((prev) => {
        if (prev === 'idle') return 'analyzing'
        if (prev === 'analyzing') return 'alert'
        if (prev === 'alert') return 'success'
        return 'idle'
      })
    }, 3000)

    // Generate alert bubbles
    const alertInterval = setInterval(() => {
      if (state === 'analyzing' || state === 'alert') {
        const newAlert: AlertBubble = {
          id: Math.random().toString(36),
          text: ['Gender bias detected', 'Cultural stereotype found', 'Age bias alert'][Math.floor(Math.random() * 3)],
          type: state === 'alert' ? 'warning' : 'info',
          x: Math.random() * 200 - 100,
          y: Math.random() * 150 - 75,
        }
        setAlerts((prev) => [...prev, newAlert])
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a.id !== newAlert.id))
        }, 2000)
      }
    }, 1500)

    return () => {
      clearInterval(interval)
      clearInterval(alertInterval)
    }
  }, [state])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Guardian Robot SVG */}
      <motion.svg
        width="400"
        height="500"
        viewBox="0 0 400 500"
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Glow effect behind robot */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a365d" />
            <stop offset="100%" stopColor="#0f1e3a" />
          </linearGradient>
          <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        {/* Neural network pattern in head */}
        <g opacity={state === 'analyzing' ? 0.8 : 0.3}>
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12
            const x1 = 200 + Math.cos((angle * Math.PI) / 180) * 30
            const y1 = 120 + Math.sin((angle * Math.PI) / 180) * 30
            const x2 = 200 + Math.cos((angle * Math.PI) / 180) * 50
            const y2 = 120 + Math.sin((angle * Math.PI) / 180) * 50
            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#tealGradient)"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: state === 'analyzing' ? [0.3, 0.8, 0.3] : 0.2,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            )
          })}
        </g>

        {/* Head */}
        <motion.ellipse
          cx="200"
          cy="120"
          rx="60"
          ry="70"
          fill="url(#bodyGradient)"
          stroke="#2dd4bf"
          strokeWidth="3"
          filter="url(#glow)"
          animate={{
            y: state === 'analyzing' ? [0, -5, 0] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Eyes */}
        <motion.circle
          cx="185"
          cy="110"
          r="8"
          fill="#2dd4bf"
          animate={{
            scale: state === 'alert' ? [1, 1.3, 1] : state === 'analyzing' ? [1, 1.2, 1] : 1,
            opacity: state === 'analyzing' ? [0.7, 1, 0.7] : 1,
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle
          cx="215"
          cy="110"
          r="8"
          fill="#2dd4bf"
          animate={{
            scale: state === 'alert' ? [1, 1.3, 1] : state === 'analyzing' ? [1, 1.2, 1] : 1,
            opacity: state === 'analyzing' ? [0.7, 1, 0.7] : 1,
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Scanning beam (when analyzing) */}
        <AnimatePresence>
          {state === 'analyzing' && (
            <motion.rect
              x="140"
              y="180"
              width="120"
              height="4"
              fill="url(#tealGradient)"
              initial={{ opacity: 0, x: 140 }}
              animate={{ opacity: [0.5, 1, 0.5], x: [140, 140, 140] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        {/* Shield on chest */}
        <motion.path
          d="M 180 200 L 220 200 L 230 240 L 200 260 L 170 240 Z"
          fill="url(#tealGradient)"
          stroke="#1a365d"
          strokeWidth="2"
          filter="url(#glow)"
          animate={{
            scale: state === 'alert' ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 1, repeat: state === 'alert' ? Infinity : 0 }}
        />
        <text
          x="200"
          y="225"
          textAnchor="middle"
          fill="#1a365d"
          fontSize="20"
          fontWeight="bold"
        >
          🛡️
        </text>

        {/* Body */}
        <motion.rect
          x="150"
          y="200"
          width="100"
          height="180"
          rx="20"
          fill="url(#bodyGradient)"
          stroke="#2dd4bf"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Arms */}
        <motion.rect
          x="100"
          y="220"
          width="40"
          height="100"
          rx="20"
          fill="url(#bodyGradient)"
          stroke="#2dd4bf"
          strokeWidth="2"
          animate={{
            rotate: state === 'analyzing' ? [0, 5, -5, 0] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.rect
          x="260"
          y="220"
          width="40"
          height="100"
          rx="20"
          fill="url(#bodyGradient)"
          stroke="#2dd4bf"
          strokeWidth="2"
          animate={{
            rotate: state === 'analyzing' ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Legs */}
        <rect x="160" y="380" width="35" height="100" rx="15" fill="url(#bodyGradient)" stroke="#2dd4bf" strokeWidth="2" />
        <rect x="205" y="380" width="35" height="100" rx="15" fill="url(#bodyGradient)" stroke="#2dd4bf" strokeWidth="2" />

        {/* Success indicator */}
        <AnimatePresence>
          {state === 'success' && (
            <motion.circle
              cx="200"
              cy="250"
              r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
      </motion.svg>

      {/* Floating alert bubbles */}
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            className={`absolute z-20 px-3 py-2 rounded-lg text-xs font-medium shadow-lg ${
              alert.type === 'warning'
                ? 'bg-red-500 text-white'
                : alert.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -50,
              x: alert.x,
              scale: [0.8, 1, 1, 0.8],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2 }}
            style={{
              left: '50%',
              top: '30%',
            }}
          >
            {alert.text}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-inherit" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Status indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-gray-900/80 text-white text-sm font-medium backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="flex items-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor:
                state === 'idle'
                  ? '#6b7280'
                  : state === 'analyzing'
                  ? '#3b82f6'
                  : state === 'alert'
                  ? '#ef4444'
                  : '#10b981',
            }}
          />
          {state === 'idle' && 'Standing by'}
          {state === 'analyzing' && 'Analyzing text...'}
          {state === 'alert' && 'Bias detected!'}
          {state === 'success' && 'All clear'}
        </span>
      </motion.div>
    </div>
  )
}

