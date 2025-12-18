'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">BiasGuard</span>
            </Link>
            <p className="text-sm text-gray-600">
              Real-time bias detection and mitigation for inclusive writing.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/editor" className="hover:text-gray-900">Editor</Link></li>
              <li><Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link></li>
              <li><Link href="/features" className="hover:text-gray-900">Features</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/docs" className="hover:text-gray-900">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-gray-900">API</Link></li>
              <li><Link href="/examples" className="hover:text-gray-900">Examples</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; 2024 BiasGuard 4.0. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

