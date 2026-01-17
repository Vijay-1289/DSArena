import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface CodeAnalysisPanelProps {
  code: string;
  language: string;
  problemSlug: string;
  problemTitle: string;
  problemDifficulty: string;
  problemCategory: string;
  attemptCount: number;
}

interface AnalysisResult {
  patterns: Array<{
    pattern: string;
    description: string;
    severity: 'info' | 'warning' | 'optimization';
    suggestion: string;
  }>;
  complexity: { time: string; space: string };
  isSuboptimal: boolean;
  hint: string | null;
}

// Count meaningful lines of code (excluding comments and empty lines)
const countMeaningfulLines = (code: string): number => {
  return code.split('\n').filter(l => {
    const trimmed = l.trim();
    return trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/*') &&
      !trimmed.startsWith('*') &&
      !trimmed.startsWith('"""') &&
      !trimmed.startsWith("'''");
  }).length;
};

export function CodeAnalysisPanel({
  code,
  language,
  problemSlug,
  problemTitle,
  problemDifficulty,
  problemCategory,
  attemptCount,
}: CodeAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastAnalyzedCodeRef = useRef<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Analyze code function
  const analyzeCode = useCallback(async (codeToAnalyze: string) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const meaningfulLines = countMeaningfulLines(codeToAnalyze);

    // Need at least 5 meaningful lines
    if (meaningfulLines < 5) {
      setAnalysis(null);
      setLoading(false);
      return;
    }

    // Skip if same code was already analyzed
    if (codeToAnalyze === lastAnalyzedCodeRef.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-code', {
        body: {
          code: codeToAnalyze,
          language,
          problemSlug,
          problemTitle,
          problemDifficulty,
          userHistory: {
            attemptCount,
            previousFailures: Math.max(0, attemptCount - 1),
            avgSolveTime: 600,
            topic: problemCategory,
          },
        },
      });

      if (controller.signal.aborted) {
        return;
      }

      if (fnError) {
        console.error('CodeAnalysisPanel: Function error:', fnError);
        setError('Analysis failed');
        setAnalysis(null);
      } else if (data) {
        setAnalysis(data);
        lastAnalyzedCodeRef.current = codeToAnalyze;
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error('CodeAnalysisPanel: Unexpected error:', err);
        setError('Analysis failed');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [language, problemSlug, problemTitle, problemDifficulty, problemCategory, attemptCount]);

  // Debounced effect to trigger analysis
  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const meaningfulLines = countMeaningfulLines(code);

    // Not enough code yet
    if (meaningfulLines < 5) {
      setAnalysis(null);
      setLoading(false);
      return;
    }

    // Already analyzed this exact code
    if (code === lastAnalyzedCodeRef.current) {
      return;
    }

    // Show loading immediately for feedback
    setLoading(true);

    // Debounce actual analysis by 2 seconds for stable typing
    debounceRef.current = setTimeout(() => {
      analyzeCode(code);
    }, 2000);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [code, analyzeCode]);

  // Reset when problem changes
  useEffect(() => {
    setAnalysis(null);
    lastAnalyzedCodeRef.current = '';
    setError(null);
    setLoading(false);
  }, [problemSlug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const meaningfulLines = countMeaningfulLines(code);

  // Show prompt when not enough code
  if (meaningfulLines < 5 && !loading) {
    return (
      <Card className="border border-border/50 bg-card/50">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            Code Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <p className="text-xs text-muted-foreground">
            Start writing your solution to see real-time analysis and tips.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Card className="border border-primary/30 bg-card/50">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Analyzing your code...
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <p className="text-xs text-muted-foreground">
            Checking for potential improvements...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border border-border/50 bg-card/50">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            Analysis Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <p className="text-xs text-muted-foreground">
            Couldn't analyze your code right now. Keep coding!
          </p>
        </CardContent>
      </Card>
    );
  }

  // No issues found
  if (analysis && !analysis.isSuboptimal) {
    return (
      <Card className="border border-green-500/30 bg-green-500/5">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            Looking Good!
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs border-green-500/30 text-green-600">
              <Zap className="h-3 w-3 mr-1" />
              {analysis.complexity.time}
            </Badge>
            <Badge variant="outline" className="text-xs border-green-500/30 text-green-600">
              Space: {analysis.complexity.space}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            No major issues detected. Ready to submit!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show analysis with suggestions
  if (analysis && analysis.isSuboptimal) {
    return (
      <Card className="border border-yellow-500/30 bg-yellow-500/5">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm flex items-center gap-2 text-yellow-600">
            <Lightbulb className="h-4 w-4" />
            Tip from Glitchy
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-3">
          {analysis.hint && (
            <p className="text-xs text-foreground leading-relaxed">{analysis.hint}</p>
          )}

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {analysis.complexity.time}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Space: {analysis.complexity.space}
            </Badge>
          </div>

          {analysis.patterns.length > 0 && (
            <div className="space-y-1">
              {analysis.patterns.slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className={cn(
                    "text-xs p-2 rounded-md",
                    p.severity === 'warning' && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                    p.severity === 'optimization' && "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                    p.severity === 'info' && "bg-muted text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-1 font-medium">
                    {p.severity === 'warning' && <AlertTriangle className="h-3 w-3" />}
                    {p.description}
                  </div>
                  {p.suggestion && (
                    <p className="mt-1 opacity-80">{p.suggestion}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
