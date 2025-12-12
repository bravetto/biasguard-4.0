'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, CheckCircle2, Zap, BarChart3, ArrowRight } from 'lucide-react'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { GuardianAgent } from '@/components/Guardian/GuardianAgent'
import { GuardianStats } from '@/components/Guardian/GuardianStats'

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Detection',
      description: 'Get instant bias analysis as you type with 800ms debounce for optimal performance.'
    },
    {
      icon: Shield,
      title: '7-Layer Analysis',
      description: 'Comprehensive bias detection using advanced pattern matching and semantic analysis.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Insights',
      description: 'Understand bias severity, protected classes, and get actionable suggestions.'
    },
    {
      icon: CheckCircle2,
      title: 'Neutral Rewrites',
      description: 'Automatically generate inclusive alternatives while preserving your message.'
    },
  ]

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      features: [
        '10 analyses per day',
        'Basic bias detection',
        'Standard suggestions',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      price: '$9',
      period: '/month',
      features: [
        'Unlimited analyses',
        'Advanced detection',
        'Priority suggestions',
        'Email support',
        'Export capabilities'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Everything in Pro',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee'
      ]
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Guardian Agent */}
        <section className="bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-20 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
                >
                  🛡️ Your 24/7 Writing Guardian
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Fix Bias, Not Just Grammar
                </h1>
                
                <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                  Meet <strong className="text-teal-300">Guardian</strong>, your AI-powered bias detection agent. 
                  Real-time protection against gender, cultural, age, and disability bias in your writing.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href="/editor"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Start Writing
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    href="#demo"
                    className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
                  >
                    See Demo
                  </Link>
                </div>

                {/* Stats */}
                <GuardianStats />
              </motion.div>

              {/* Right: Guardian Agent */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 shadow-2xl">
                  <GuardianAgent />
                </div>
                
                {/* Floating badges */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✓ Live Detection
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-xl border border-gray-200 p-8"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Try it now:</h3>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="text-gray-700">
                    <span className="bg-yellow-100 border-b-2 border-yellow-400">All women are naturally bad at math.</span>
                  </p>
                </div>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    <strong>Suggestion:</strong> "Some individuals may face challenges with math, which can be addressed through education and support."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Guardian Features Section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Meet Guardian: Your AI Writing Protector
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Unlike Grammarly's basic grammar checks, Guardian provides real-time bias detection 
                  across multiple protected classes with professional-grade analysis.
                </p>
              </motion.div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Real-Time vs. Basic Corrections
                    </h3>
                    <p className="text-gray-600">
                      While Grammarly catches typos, Guardian detects subtle bias patterns in real-time 
                      as you type, protecting your professional reputation.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Multiple Bias Types
                    </h3>
                    <p className="text-gray-600">
                      Detects gender, cultural, age, disability, and more. Comprehensive protection 
                      beyond simple grammar fixes.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to write inclusively
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600">
                Choose the plan that works for you
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-8 bg-white rounded-lg border-2 ${
                    tier.popular ? 'border-blue-600 shadow-xl' : 'border-gray-200'
                  }`}
                >
                  {tier.popular && (
                    <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-gray-600">{tier.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/editor"
                    className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                      tier.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

