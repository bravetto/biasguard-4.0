class BiasAPI {
  static API_BASE = 'http://localhost:3001/api'
  static cache = new Map()
  static requestQueue = new Map()

  static async analyze(text) {
    console.log('🔍 BiasAPI.analyze called with text:', text?.substring(0, 50) + '...')
    
    // Skip very short text
    if (!text || text.length < 5) {
      return {
        bias_score: 0,
        bias_level: 'none',
        protected_classes: [],
        bias_patterns: [],
        bias_types: [],
        examples: [],
        suggested_rewrite: ''
      }
    }

    const cacheKey = this.getCacheKey(text)
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log('📦 Returning cached result')
      return this.cache.get(cacheKey)
    }

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      console.log('⏳ Request already in progress, waiting...')
      return this.requestQueue.get(cacheKey)
    }

    // Start new request
    const requestPromise = this.makeAnalysisRequest(text)
    this.requestQueue.set(cacheKey, requestPromise)

    try {
      const result = await requestPromise
      console.log('✅ Analysis completed:', result)
      
      // Cache result
      this.cache.set(cacheKey, result)
      
      // Clean up old cache entries
      if (this.cache.size > 100) {
        const firstKey = this.cache.keys().next().value
        this.cache.delete(firstKey)
      }
      
      return result
    } finally {
      this.requestQueue.delete(cacheKey)
    }
  }

  static async makeAnalysisRequest(text) {
    try {
      console.log('🌐 Making API request to:', `${this.API_BASE}/analyze`)
      
      const response = await fetch(`${this.API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ text: text.trim() })
      })

      console.log('📡 API Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ API Response data:', result)
        
        if (result.success && result.data) {
          return result.data
        } else {
          console.warn('⚠️ API returned unsuccessful result:', result)
        }
      } else {
        console.error('❌ API request failed with status:', response.status)
      }
    } catch (error) {
      console.error('❌ API request error:', error)
    }

    // Fallback to enhanced mock analysis
    console.log('🔧 Using enhanced mock analysis for:', text.substring(0, 100))
    return this.getMockAnalysis(text)
  }

  static getMockAnalysis(text) {
    const lowerText = text.toLowerCase()
    
    // Enhanced bias detection patterns
    const biasPatterns = [
      // Gender bias
      { pattern: /(all |every )?women (are|is).*(bad|terrible|awful|stupid|incapable|inferior|worse)/i, 
        score: 8.5, level: 'high', type: 'Universal Claims', classes: ['gender'] },
      { pattern: /(all |every )?men (are|is).*(better|superior|smarter|stronger)/i, 
        score: 8.0, level: 'high', type: 'Universal Claims', classes: ['gender'] },
      { pattern: /women (can't|cannot|are unable|lack|don't have)/i, 
        score: 7.5, level: 'high', type: 'Competence Assumptions', classes: ['gender'] },
      { pattern: /men (should|must|ought to|have to) (lead|control|dominate)/i, 
        score: 7.0, level: 'moderate', type: 'Prescriptive Statements', classes: ['gender'] },
      
      // Racial/ethnic bias
      { pattern: /(all |every )?(black|white|asian|hispanic|latino) (people|men|women) (are|is)/i, 
        score: 9.0, level: 'high', type: 'Universal Claims', classes: ['race', 'ethnicity'] },
      { pattern: /(those|these) people (are|can't|cannot|don't)/i, 
        score: 6.5, level: 'moderate', type: 'Group References', classes: ['fictional_proxies'] },
      
      // Religious bias
      { pattern: /(all |every )?(muslims|christians|jews|hindus) (are|believe)/i, 
        score: 8.0, level: 'high', type: 'Universal Claims', classes: ['religion'] },
      
      // Nationality bias
      { pattern: /(all |every )?(immigrants|foreigners) (are|bring|cause)/i, 
        score: 8.5, level: 'high', type: 'Universal Claims', classes: ['nationality'] },
      
      // General bias patterns
      { pattern: /naturally (bad|good|better|worse) at/i, 
        score: 6.0, level: 'moderate', type: 'Essentialism', classes: ['gender'] },
      { pattern: /inherently (violent|peaceful|aggressive|passive)/i, 
        score: 6.5, level: 'moderate', type: 'Essentialism', classes: ['race'] },
      { pattern: /(should|must|need to) stay (home|in kitchen|out of)/i, 
        score: 7.0, level: 'moderate', type: 'Prescriptive Statements', classes: ['gender'] }
    ]

    // Check each pattern
    for (const biasPattern of biasPatterns) {
      if (biasPattern.pattern.test(text)) {
        console.log('🎯 Bias pattern matched:', biasPattern.type, 'Score:', biasPattern.score)
        
        return {
          bias_score: biasPattern.score,
          bias_level: biasPattern.level,
          protected_classes: biasPattern.classes,
          bias_patterns: [biasPattern.type],
          bias_types: ['stereotyping', 'prejudice'],
          examples: [text],
          suggested_rewrite: this.generateSuggestion(text, biasPattern.type),
          analysis_metadata: {
            processing_time_ms: 50,
            version: '4.0.0',
            source: 'mock'
          }
        }
      }
    }

    // No bias detected
    console.log('✅ No bias patterns matched for text')
    return {
      bias_score: 0,
      bias_level: 'none',
      protected_classes: [],
      bias_patterns: [],
      bias_types: [],
      examples: [],
      suggested_rewrite: '',
      analysis_metadata: {
        processing_time_ms: 25,
        version: '4.0.0',
        source: 'mock'
      }
    }
  }

  static generateSuggestion(text, biasType) {
    const suggestions = {
      'Universal Claims': text.replace(/(all|every)/gi, 'some').replace(/(are|is) (bad|terrible|awful)/gi, 'may face challenges'),
      'Competence Assumptions': text.replace(/(can't|cannot|are unable)/gi, 'may face challenges with').replace(/(don't have|lack)/gi, 'may need support with'),
      'Essentialism': text.replace(/naturally/gi, 'sometimes').replace(/inherently/gi, 'may be'),
      'Prescriptive Statements': text.replace(/(should|must|ought to)/gi, 'could consider'),
      'Group References': text.replace(/those people/gi, 'some individuals').replace(/these people/gi, 'certain individuals')
    }
    
    return suggestions[biasType] || 'Consider using more inclusive and specific language.'
  }

  static getCacheKey(text) {
    return text.substring(0, 200).toLowerCase().trim()
  }

  static clearCache() {
    this.cache.clear()
    this.requestQueue.clear()
  }
}

// Test the API when loaded
console.log('🚀 BiasAPI loaded, testing with sample text...')
BiasAPI.analyze('Women are bad at math').then(result => {
  console.log('🧪 Test result:', result)
})

// Export for use in content script
if (typeof window !== 'undefined') {
  window.BiasAPI = BiasAPI
}
