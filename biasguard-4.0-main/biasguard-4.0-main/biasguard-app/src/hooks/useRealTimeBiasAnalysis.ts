import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from './useDebouncedValue'
import { BiasAnalysisResult } from '@/lib/types'
import { analyzeText } from '@/lib/api'

export function useRealTimeBiasAnalysis(text: string, debounceMs = 800) {
  const debouncedText = useDebouncedValue(text, debounceMs)

  return useQuery({
    queryKey: ['bias-analysis', debouncedText],
    queryFn: async (): Promise<BiasAnalysisResult> => {
      // Always analyze if there's text, even if short
      if (!debouncedText || debouncedText.trim().length === 0) {
        return {
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
            reasoning: 'No text provided for analysis'
          }
        }
      }

      // Call API
      console.log('Analyzing text:', debouncedText.substring(0, 50))
      try {
        const result = await analyzeText(debouncedText)
        console.log('Analysis complete:', {
          score: result.bias_score,
          level: result.bias_level,
          patterns: result.bias_patterns?.length || 0,
          protected_classes: result.protected_classes,
          examples: result.examples?.length || 0
        })
        return result
      } catch (error) {
        console.error('Analysis failed:', error)
        // Return empty result on error
        return {
          bias_score: 0,
          bias_level: 'none',
          protected_classes: [],
          entities_detected: [],
          bias_patterns: [],
          bias_types: [],
          examples: [],
          suggested_rewrite: '',
          explanation: error instanceof Error ? error.message : 'Analysis failed',
          rewrite_quality: 'coherent',
          causal_bias: {
            detected: false,
            explanations: []
          },
          severity: {
            score: 0,
            reasoning: 'Analysis error occurred'
          }
        }
      }
    },
    enabled: debouncedText.trim().length > 0,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
}

