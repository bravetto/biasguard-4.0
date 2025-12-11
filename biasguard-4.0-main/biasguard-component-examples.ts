// BiasGuard UI - Key Component Implementation Examples
// Use these as reference implementations for the main interface

// 1. Main Editor Component
import React, { useState, useCallback, useRef } from 'react';
import { useRealTimeBiasAnalysis } from '@/hooks/useRealTimeBiasAnalysis';
import { BiasHighlight } from './BiasHighlight';
import { SuggestionPopover } from './SuggestionPopover';

interface BiasEditorProps {
  initialText?: string;
  onTextChange: (text: string) => void;
  className?: string;
}

export const BiasEditor: React.FC<BiasEditorProps> = ({
  initialText = '',
  onTextChange,
  className = ''
}) => {
  const [text, setText] = useState(initialText);
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Real-time bias analysis with debouncing
  const { 
    analysis, 
    isAnalyzing, 
    error 
  } = useRealTimeBiasAnalysis(text, {
    debounceMs: 500,
    enabled: text.length > 10
  });

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
    onTextChange(newText);
  }, [onTextChange]);

  const renderTextWithHighlights = () => {
    if (!analysis?.bias_patterns || analysis.bias_patterns.length === 0) {
      return text;
    }

    // Split text into segments based on bias patterns
    let segments = [{ text, isBias: false, biasInfo: null }];
    
    analysis.examples?.forEach((example, index) => {
      const biasInfo = {
        type: analysis.bias_patterns[index],
        severity: analysis.bias_score,
        suggestion: analysis.suggested_rewrite,
        explanation: `This text contains ${analysis.bias_patterns[index].toLowerCase()} bias.`
      };
      
      segments = insertBiasSegment(segments, example, biasInfo);
    });

    return segments.map((segment, index) => 
      segment.isBias ? (
        <BiasHighlight
          key={index}
          text={segment.text}
          biasInfo={segment.biasInfo}
          onSelect={() => setSelectedRange({ start: 0, end: segment.text.length })}
        />
      ) : (
        <span key={index}>{segment.text}</span>
      )
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isAnalyzing ? 'bg-yellow-400 animate-pulse' : 
              analysis?.bias_level === 'none' ? 'bg-green-400' :
              analysis?.bias_level === 'mild' ? 'bg-yellow-400' :
              analysis?.bias_level === 'moderate' ? 'bg-orange-400' : 'bg-red-400'
            }`} />
            <span className="text-sm text-gray-600">
              {isAnalyzing ? 'Analyzing...' : `Bias Level: ${analysis?.bias_level || 'Unknown'}`}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {text.length} characters
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
            Export
          </button>
          <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200">
            Share
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div 
        ref={editorRef}
        className="min-h-[500px] p-6 bg-white focus:outline-none"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => handleTextChange(e.currentTarget.textContent || '')}
        style={{ 
          lineHeight: '1.6',
          fontSize: '16px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        {text.length === 0 ? (
          <div className="text-gray-400 pointer-events-none">
            Start writing to detect bias in your text...
          </div>
        ) : (
          renderTextWithHighlights()
        )}
      </div>

      {/* Analysis Status Bar */}
      <div className="flex items-center justify-between p-3 border-t bg-gray-50">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Words: {text.split(' ').length}</span>
          <span>Reading time: ~{Math.ceil(text.split(' ').length / 200)} min</span>
        </div>
        
        {analysis && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Bias Score:</span>
            <div className="flex items-center gap-1">
              <div className="w-20 h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    analysis.bias_score <= 3 ? 'bg-green-400' :
                    analysis.bias_score <= 6 ? 'bg-yellow-400' :
                    analysis.bias_score <= 8 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${(analysis.bias_score / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{analysis.bias_score}/10</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Bias Highlight Component
interface BiasHighlightProps {
  text: string;
  biasInfo: {
    type: string;
    severity: number;
    suggestion: string;
    explanation: string;
  };
  onSelect: () => void;
}

export const BiasHighlight: React.FC<BiasHighlightProps> = ({
  text,
  biasInfo,
  onSelect
}) => {
  const [showPopover, setShowPopover] = useState(false);
  
  const getSeverityClass = (severity: number) => {
    if (severity <= 3) return 'bg-yellow-100 border-b-2 border-yellow-400 hover:bg-yellow-200';
    if (severity <= 6) return 'bg-orange-100 border-b-2 border-orange-500 hover:bg-orange-200';
    return 'bg-red-100 border-b-2 border-red-600 hover:bg-red-200';
  };

  return (
    <span 
      className={`relative cursor-pointer transition-colors ${getSeverityClass(biasInfo.severity)}`}
      onClick={onSelect}
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      {text}
      
      {showPopover && (
        <SuggestionPopover
          originalText={text}
          suggestion={biasInfo.suggestion}
          explanation={biasInfo.explanation}
          biasType={biasInfo.type}
          severity={biasInfo.severity}
          onAccept={() => {/* Handle accept */}}
          onDismiss={() => setShowPopover(false)}
        />
      )}
    </span>
  );
};

// 3. Analysis Sidebar Component
interface AnalysisSidebarProps {
  analysis: BiasAnalysisResult | null;
  isLoading: boolean;
  onIssueClick: (issue: BiasIssue) => void;
}

export const AnalysisSidebar: React.FC<AnalysisSidebarProps> = ({
  analysis,
  isLoading,
  onIssueClick
}) => {
  if (isLoading) {
    return (
      <div className="w-80 bg-white border-l p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="w-80 bg-white border-l p-6">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            📝
          </div>
          <p>Start writing to see bias analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Bias Analysis</h2>
        
        {/* Bias Score Gauge */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Bias Score</span>
            <span className="font-bold text-lg">{analysis.bias_score}/10</span>
          </div>
          
          <div className="relative">
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  analysis.bias_score <= 3 ? 'bg-green-400' :
                  analysis.bias_score <= 6 ? 'bg-yellow-400' :
                  analysis.bias_score <= 8 ? 'bg-orange-400' : 'bg-red-400'
                }`}
                style={{ width: `${(analysis.bias_score / 10) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Inclusive</span>
            <span>Biased</span>
          </div>
        </div>

        {/* Bias Level Badge */}
        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
          analysis.bias_level === 'none' ? 'bg-green-100 text-green-800' :
          analysis.bias_level === 'mild' ? 'bg-yellow-100 text-yellow-800' :
          analysis.bias_level === 'moderate' ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {analysis.bias_level.toUpperCase()} BIAS
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto">
        {analysis.bias_patterns && analysis.bias_patterns.length > 0 ? (
          <div className="p-6">
            <h3 className="font-medium mb-4">Issues Found ({analysis.bias_patterns.length})</h3>
            
            <div className="space-y-3">
              {analysis.bias_patterns.map((pattern, index) => (
                <IssueCard
                  key={index}
                  issue={{
                    type: pattern,
                    example: analysis.examples?.[index] || '',
                    severity: analysis.bias_score,
                    suggestion: analysis.suggested_rewrite || '',
                    explanation: `Detected ${pattern.toLowerCase()} bias in your text.`
                  }}
                  onClick={() => onIssueClick({ type: pattern, index })}
                />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t">
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-2">
                Apply All Suggestions
              </button>
              <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Learn More About Bias
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              ✓
            </div>
            <p className="font-medium">No bias detected!</p>
            <p className="text-sm">Your text appears to be inclusive and neutral.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Powered by BiasGuard 4.0
        </div>
      </div>
    </div>
  );
};

// 4. Issue Card Component
interface IssueCardProps {
  issue: {
    type: string;
    example: string;
    severity: number;
    suggestion: string;
    explanation: string;
  };
  onClick: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const getSeverityIcon = (severity: number) => {
    if (severity <= 3) return '⚠️';
    if (severity <= 6) return '🔶';
    return '🔴';
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'border-l-yellow-400';
    if (severity <= 6) return 'border-l-orange-400';
    return 'border-l-red-400';
  };

  return (
    <div 
      className={`p-3 border border-l-4 ${getSeverityColor(issue.severity)} rounded-r-md cursor-pointer hover:bg-gray-50 transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{getSeverityIcon(issue.severity)}</span>
          <span className="text-sm font-medium text-gray-900">
            {issue.type.replace(/_/g, ' ')}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {issue.severity}/10
        </span>
      </div>
      
      <p className="text-xs text-gray-600 mb-2">
        "{issue.example.substring(0, 60)}..."
      </p>
      
      <p className="text-xs text-gray-500">
        {issue.explanation}
      </p>
    </div>
  );
};

// 5. Suggestion Popover Component
interface SuggestionPopoverProps {
  originalText: string;
  suggestion: string;
  explanation: string;
  biasType: string;
  severity: number;
  onAccept: () => void;
  onDismiss: () => void;
}

export const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({
  originalText,
  suggestion,
  explanation,
  biasType,
  severity,
  onAccept,
  onDismiss
}) => {
  return (
    <div className="absolute z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg top-full left-0 mt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            severity <= 3 ? 'bg-yellow-400' :
            severity <= 6 ? 'bg-orange-400' : 'bg-red-400'
          }`} />
          <span className="text-sm font-medium">{biasType.replace(/_/g, ' ')}</span>
        </div>
        <button 
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {/* Explanation */}
      <p className="text-sm text-gray-600 mb-4">
        {explanation}
      </p>

      {/* Before/After */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="text-xs text-red-600 mb-1">Original:</div>
          <div className="text-sm p-2 bg-red-50 border border-red-200 rounded">
            {originalText}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-green-600 mb-1">Suggested:</div>
          <div className="text-sm p-2 bg-green-50 border border-green-200 rounded">
            {suggestion}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={onAccept}
          className="flex-1 py-2 px-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <button 
          onClick={onDismiss}
          className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

// 6. Real-Time Analysis Hook
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface BiasAnalysisResult {
  bias_score: number;
  bias_level: 'none' | 'mild' | 'moderate' | 'high';
  protected_classes: string[];
  bias_patterns: string[];
  bias_types: string[];
  examples: string[];
  suggested_rewrite: string;
  analysis_metadata: {
    processing_time_ms: number;
    version: string;
  };
}

export const useRealTimeBiasAnalysis = (
  text: string, 
  options: {
    debounceMs?: number;
    enabled?: boolean;
    onAnalysisComplete?: (result: BiasAnalysisResult) => void;
  } = {}
) => {
  const { debounceMs = 500, enabled = true, onAnalysisComplete } = options;
  const debouncedText = useDebouncedValue(text, debounceMs);

  const query = useQuery({
    queryKey: ['bias-analysis', debouncedText],
    queryFn: async (): Promise<BiasAnalysisResult> => {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('apiKey')}`
        },
        body: JSON.stringify({ 
          text: debouncedText,
          options: { realTime: true }
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result.data);
      }
      
      return result.data;
    },
    enabled: enabled && debouncedText.length > 10,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  });

  return {
    analysis: query.data,
    isAnalyzing: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
};

// Helper function for text segmentation
function insertBiasSegment(segments: any[], biasText: string, biasInfo: any) {
  const newSegments = [];
  
  for (const segment of segments) {
    if (segment.isBias) {
      newSegments.push(segment);
      continue;
    }
    
    const index = segment.text.indexOf(biasText);
    if (index === -1) {
      newSegments.push(segment);
      continue;
    }
    
    // Split the segment
    if (index > 0) {
      newSegments.push({
        text: segment.text.substring(0, index),
        isBias: false,
        biasInfo: null
      });
    }
    
    newSegments.push({
      text: biasText,
      isBias: true,
      biasInfo
    });
    
    if (index + biasText.length < segment.text.length) {
      newSegments.push({
        text: segment.text.substring(index + biasText.length),
        isBias: false,
        biasInfo: null
      });
    }
  }
  
  return newSegments;
}

// Types
interface BiasIssue {
  type: string;
  index: number;
}

// Export all components
export {
  BiasEditor,
  AnalysisSidebar,
  BiasHighlight,
  SuggestionPopover,
  IssueCard,
  useRealTimeBiasAnalysis
};