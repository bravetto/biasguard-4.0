// BiasGuard Analyzer Wrapper for Production
// Uses local copy of analyzer for Vercel deployment

const path = require('path')

let analyzerInstance = null

function getAnalyzer() {
  if (analyzerInstance) {
    return analyzerInstance
  }
  
  try {
    // Import from local analyzer directory (copied for production)
    const BiasGuard4Analyzer = require('../analyzer/core/analyzer')
    analyzerInstance = new BiasGuard4Analyzer()
    console.log('✅ BiasGuard analyzer loaded successfully!')
    return analyzerInstance
  } catch (error) {
    console.error('❌ Failed to load BiasGuard analyzer:', error.message)
    throw error
  }
}

module.exports = {
  BiasGuard4Analyzer: class {
    constructor(options = {}) {
      this.options = options
    }
    
    async analyze(text) {
      const analyzer = getAnalyzer()
      return await analyzer.analyze(text)
    }
  }
}
