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
      {/* Minimalist Glowing Outline Robot SVG */}
      <motion.svg
        width="400"
        height="500"
        viewBox="0 0 400 500"
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <defs>
          {/* Dark blue gradient background */}
          <radialGradient id="bgGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0f1e3a" />
          </radialGradient>
          {/* Glowing teal-blue outline effect */}
          <filter id="outlineGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strongOutlineGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Shadow for feet */}
          <filter id="footShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background gradient */}
        <rect width="400" height="500" fill="url(#bgGradient)" />

        {/* Robot - Glowing teal-blue outline with dark interior */}
        <g filter="url(#outlineGlow)">
          {/* Head - Large vertically elongated oval */}
          <motion.ellipse
            cx="200"
            cy="120"
            rx="45"
            ry="65"
            fill="#0a1628"
            stroke="#2dd4bf"
            strokeWidth="4"
            animate={{
              y: state === 'analyzing' ? [0, -3, 0] : 0,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Eyes - Two small solid teal-blue circles */}
          <motion.circle
            cx="190"
            cy="115"
            r="6"
            fill="#2dd4bf"
            filter="url(#strongOutlineGlow)"
            animate={{
              scale: state === 'alert' ? [1, 1.3, 1] : state === 'analyzing' ? [1, 1.2, 1] : 1,
              opacity: state === 'analyzing' ? [0.8, 1, 0.8] : 1,
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.circle
            cx="210"
            cy="115"
            r="6"
            fill="#2dd4bf"
            filter="url(#strongOutlineGlow)"
            animate={{
              scale: state === 'alert' ? [1, 1.3, 1] : state === 'analyzing' ? [1, 1.2, 1] : 1,
              opacity: state === 'analyzing' ? [0.8, 1, 0.8] : 1,
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />

          {/* Body - Rectangular with rounded corners, slightly narrower than head */}
          <motion.rect
            x="170"
            y="190"
            width="60"
            height="90"
            rx="8"
            fill="#0a1628"
            stroke="#2dd4bf"
            strokeWidth="4"
            animate={{
              scale: state === 'alert' ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 1, repeat: state === 'alert' ? Infinity : 0 }}
          />

          {/* Arms - Two vertical rounded rectangular shapes */}
          <motion.rect
            x="140"
            y="200"
            width="25"
            height="70"
            rx="12"
            fill="#0a1628"
            stroke="#2dd4bf"
            strokeWidth="4"
            animate={{
              rotate: state === 'analyzing' ? [0, 8, -8, 0] : 0,
              transformOrigin: "152.5px 200px"
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.rect
            x="235"
            y="200"
            width="25"
            height="70"
            rx="12"
            fill="#0a1628"
            stroke="#2dd4bf"
            strokeWidth="4"
            animate={{
              rotate: state === 'analyzing' ? [0, -8, 8, 0] : 0,
              transformOrigin: "247.5px 200px"
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Legs - Two vertical rounded rectangular shapes */}
          <rect
            x="175"
            y="285"
            width="20"
            height="80"
            rx="10"
            fill="#0a1628"
            stroke="#2dd4bf"
            strokeWidth="4"
          />
          <rect
            x="205"
            y="285"
            width="20"
            height="80"
            rx="10"
            fill="#0a1628"
            stroke="#2dd4bf"
            strokeWidth="4"
          />

          {/* Feet - Two horizontal rounded rectangular shapes, slightly overlapping legs */}
          <ellipse
            cx="185"
            cy="370"
            rx="18"
            ry="12"
            fill="#0a1628"
            stroke="#2dd4bf"
            strokeWidth="4"
            filter="url(#footShadow)"
          />
          <ellipse
            cx="215"
            cy="370"
            rx="18"
            ry="12"
            fill="#0a1628"
            stroke="#2dd4bf"
            strokeWidth="4"
            filter="url(#footShadow)"
          />
        </g>

        {/* Red speech bubble with "Gender bias detected" */}
        <AnimatePresence>
          {(state === 'alert' || state === 'analyzing') && (
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Speech bubble */}
              <rect
                x="260"
                y="80"
                width="120"
                height="40"
                rx="8"
                fill="#ef4444"
                stroke="#dc2626"
                strokeWidth="2"
              />
              {/* Speech bubble pointer */}
              <path
                d="M 260 100 L 250 95 L 250 105 Z"
                fill="#ef4444"
              />
              {/* Text */}
              <text
                x="320"
                y="105"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                Gender bias detected
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Scanning beam (when analyzing) */}
        <AnimatePresence>
          {state === 'analyzing' && (
            <motion.rect
              x="100"
              y="180"
              width="200"
              height="2"
              fill="#2dd4bf"
              rx="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              filter="url(#outlineGlow)"
            />
          )}
        </AnimatePresence>

        {/* Success indicator */}
        <AnimatePresence>
          {state === 'success' && (
            <motion.circle
              cx="200"
              cy="235"
              r="50"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.3, opacity: [1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              filter="url(#outlineGlow)"
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

