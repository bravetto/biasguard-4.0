export interface BiasAnalysisResult {
  bias_score: number
  bias_level: 'none' | 'mild' | 'moderate' | 'high'
  protected_classes: string[]
  entities_detected: string[]
  bias_patterns: string[]
  bias_types: string[]
  examples: string[]
  suggested_rewrite: string
  explanation: string
  rewrite_quality: 'coherent' | 'fragment' | 'incoherent'
  causal_bias: {
    detected: boolean
    explanations: string[]
  }
  severity: {
    score: number
    reasoning: string
  }
}

export interface BiasIssue {
  type: string
  example: string
  severity: number
  suggestion: string
  explanation: string
}

export interface BiasInfo {
  type: string
  severity: number
  suggestion: string
  explanation: string
}

