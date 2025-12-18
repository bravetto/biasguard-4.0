// Wrapper to load the BiasGuard analyzer
// This file acts as a bridge between Next.js and the CommonJS analyzer

const path = require('path')
const fs = require('fs')
const { createRequire } = require('module')

let analyzerInstance = null

function findAnalyzerPath() {
  // Use __dirname to get the wrapper's location (more reliable than process.cwd())
  // Wrapper is at: biasguard-app/src/lib/biasguard-analyzer.js
  // Analyzer is at: biasguard-4.0-main/src/core/analyzer.js
  // So from wrapper: ../../src/core/analyzer.js
  
  const wrapperDir = __dirname
  console.log('🔍 Finding analyzer, wrapper location:', wrapperDir)
  
  // Strategy 1: From wrapper location (src/lib) go up to app root, then to parent/src/core
  const fromWrapper = path.resolve(wrapperDir, '..', '..', '..', 'src', 'core', 'analyzer.js')
  console.log('  Checking from wrapper:', fromWrapper)
  if (fs.existsSync(fromWrapper)) {
    console.log('  ✓ Found from wrapper path!')
    return fromWrapper
  }
  
  // Strategy 2: From process.cwd() (app root)
  const appRoot = process.cwd()
  const fromAppRoot = path.resolve(appRoot, '..', 'src', 'core', 'analyzer.js')
  console.log('  Checking from app root:', fromAppRoot)
  if (fs.existsSync(fromAppRoot)) {
    console.log('  ✓ Found from app root!')
    return fromAppRoot
  }
  
  throw new Error(`BiasGuard analyzer not found. Checked from wrapper: ${wrapperDir}, app root: ${appRoot}`)
}

function getAnalyzer() {
  if (analyzerInstance) {
    return analyzerInstance
  }
  
  try {
    const analyzerPath = findAnalyzerPath()
    console.log('📦 Loading BiasGuard analyzer from:', analyzerPath)
    console.log('📦 Path exists:', fs.existsSync(analyzerPath))
    
    // Normalize the path
    const normalizedPath = path.normalize(analyzerPath)
    
    // Clear require cache
    const cacheKeys = Object.keys(require.cache)
    cacheKeys.forEach(key => {
      if (key.includes('analyzer.js') || key.includes('core')) {
        delete require.cache[key]
      }
    })
    
    // Use createRequire for proper module resolution
    // This works better in Next.js environments
    const requireFunc = createRequire(__filename)
    console.log('📦 Using createRequire to load module...')
    
    // Load the analyzer using createRequire
    const BiasGuard4Analyzer = requireFunc(normalizedPath)
    analyzerInstance = new BiasGuard4Analyzer()
    
    console.log('✅ BiasGuard analyzer loaded successfully!')
    return analyzerInstance
  } catch (error) {
    console.error('❌ Failed to load BiasGuard analyzer:', error.message)
    console.error('❌ Error code:', error.code || 'N/A')
    if (error.stack) {
      console.error('❌ Stack (first 5 lines):', error.stack.split('\n').slice(0, 5).join('\n'))
    }
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
