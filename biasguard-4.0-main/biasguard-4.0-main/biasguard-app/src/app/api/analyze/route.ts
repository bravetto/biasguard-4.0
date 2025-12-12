import { NextRequest, NextResponse } from 'next/server'

// Import the BiasGuard analyzer wrapper
const { BiasGuard4Analyzer } = require('@/lib/biasguard-analyzer')

let analyzer: any = null

// Initialize analyzer once
function getAnalyzer() {
  if (!analyzer) {
    try {
      analyzer = new BiasGuard4Analyzer({
        enableLogging: true,
        enableCaching: false,
        maxTextLength: 50000
      })
      console.log('✓ Analyzer instance created')
    } catch (error: any) {
      console.error('Failed to create analyzer:', error)
      throw error
    }
  }
  return analyzer
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    console.log('🔍 API Route - Analyzing text:', text?.substring(0, 50))
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          bias_score: 0,
          bias_level: 'none',
          protected_classes: [],
          entities_detected: [],
          bias_patterns: [],
          bias_types: [],
          examples: [],
          suggested_rewrite: '',
          explanation: '',
          rewrite_quality: 'coherent',
          causal_bias: {
            detected: false,
            explanations: []
          },
          severity: {
            score: 0,
            reasoning: 'No text provided'
          }
        }
      })
    }

    // Use the BiasGuard analyzer
    try {
      const biasAnalyzer = getAnalyzer()
      console.log('✓ Analyzer obtained, calling analyze()...')
      
      const result = await biasAnalyzer.analyze(text)
      
      console.log('✅ Analysis result:', {
        score: result.bias_score,
        level: result.bias_level,
        classes: result.protected_classes,
        patterns: result.bias_patterns?.length || 0
      })
      
      // Ensure we return the correct format with all required fields
      const formattedResult = {
        bias_score: result.bias_score || 0,
        bias_level: result.bias_level || 'none',
        protected_classes: result.protected_classes || [],
        entities_detected: result.entities_detected || [],
        bias_patterns: result.bias_patterns || [],
        bias_types: result.bias_types || [],
        examples: result.examples || [],
        suggested_rewrite: result.suggested_rewrite || '',
        explanation: result.explanation || '',
        rewrite_quality: result.rewrite_quality || 'coherent',
        causal_bias: result.causal_bias || {
          detected: false,
          explanations: []
        },
        severity: result.severity || {
          score: result.bias_score || 0,
          reasoning: result.explanation || ''
        }
      }
      
      return NextResponse.json({
        success: true,
        data: formattedResult
      })
      
    } catch (analyzerError: any) {
      console.error('❌ Analyzer error:', analyzerError.message)
      console.error('Stack:', analyzerError.stack)
      
      // Return error response
      return NextResponse.json({
        success: false,
        error: `Analyzer error: ${analyzerError.message}`,
        details: process.env.NODE_ENV === 'development' ? analyzerError.stack : undefined
      }, { status: 503 })
    }
    
  } catch (error: any) {
    console.error('❌ Analysis error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
