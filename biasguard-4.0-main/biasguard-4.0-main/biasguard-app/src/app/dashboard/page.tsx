'use client'

import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { BarChart3, TrendingUp, FileText, Shield } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    { label: 'Total Analyses', value: '1,234', icon: FileText },
    { label: 'Bias Detected', value: '456', icon: Shield },
    { label: 'Avg Score', value: '3.2', icon: BarChart3 },
    { label: 'Improvement', value: '+12%', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Your bias detection analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Placeholder for charts */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Usage Over Time</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart visualization coming soon
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

