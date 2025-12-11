'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, CheckCircle2, Zap, BarChart3, ArrowRight } from 'lucide-react'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'

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
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Fix Bias, Not Just Grammar
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                BiasGuard 4.0 detects and mitigates bias in your writing in real-time. 
                Make your content inclusive, equitable, and professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/editor"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Start Writing
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="#demo"
                  className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  See Demo
                </Link>
              </div>
            </motion.div>

            {/* Interactive Demo */}
            <motion.div
              id="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
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
              </div>
            </motion.div>
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

