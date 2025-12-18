import { BiasAnalysisResult } from './types'

export async function analyzeText(text: string): Promise<BiasAnalysisResult> {
  try {
    console.log('🔍 API - Calling /api/analyze with text:', text.substring(0, 50))
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    console.log('🌐 API - Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', errorText)
      throw new Error(`Analysis failed: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    console.log('✅ API - Analysis result received:', {
      success: result.success,
      bias_score: result.data?.bias_score,
      bias_level: result.data?.bias_level,
      patterns: result.data?.bias_patterns?.length || 0
    })
    
    if (!result.success) {
      throw new Error(result.error || 'Analysis failed')
    }
    
    return result.data
  } catch (error) {
    console.error('❌ API Error:', error)
    throw error
  }
}
