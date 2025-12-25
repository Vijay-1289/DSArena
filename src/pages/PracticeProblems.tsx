// Practice Problems Page with Problem-Solving Interface
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { TestCasePanel } from '@/components/problems/TestCasePanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useAuth } from '@/lib/auth';
import { 
  practiceProblemsData, 
  getPracticeProblemBySlug,
  PracticeProblemData 
} from '@/lib/practiceProblemsData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Trophy,
  Clock,
  Target,
  Star,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Home,
  Zap,
  BookOpen,
  Play,
  Send,
  Save,
  ChevronLeft,
  ChevronRight,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { LanguageSelector } from '@/components/editor/LanguageSelector';

export default function PracticeProblemsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<PracticeProblemData | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [showDescription, setShowDescription] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');

  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper functions for UI elements
  const getDifficultyColor = (difficulty: string) => {
    // All practice problems are "easy" level
    return 'bg-green-500/20 text-green-700 border-green-500/30';
  };

  const getDifficultyIcon = (difficulty: string) => {
    return <Target className="h-4 w-4" />;
  };

  // Language-specific starter code templates
  const getStarterCodeForLanguage = useCallback((lang: string): string => {
    if (!problem) return '';
    
    const templates: Record<string, string> = {
      python: problem.starterCode,
      javascript: `// JavaScript version of ${problem.title}
// Write your solution here
function solution() {
    // Your code here
}

// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
});

rl.on('close', () => {
    // Parse input and call solution
    console.log(solution());
});
`,
      java: `// Java version of ${problem.title}
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read input
        
        // Your solution here
        
        // Print output
    }
}
`,
      cpp: `// C++ version of ${problem.title}
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Read input
    
    // Your solution here
    
    // Print output
    
    return 0;
}
`,
    };
    return templates[lang] || templates.python;
  }, [problem]);

  useEffect(() => {
    loadProblem();
  }, [slug]);

  useEffect(() => {
    // Initialize code when problem and language are loaded
    if (problem && selectedLanguage) {
      const draftKey = `practice-problem-draft-${user?.id || 'anonymous'}-${problem.id}-${selectedLanguage}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setCode(savedDraft);
      } else {
        setCode(getStarterCodeForLanguage(selectedLanguage));
      }
    }
  }, [problem, selectedLanguage, user?.id, getStarterCodeForLanguage]);

  const loadProblem = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (slug) {
        // Load specific problem by slug
        const foundProblem = getPracticeProblemBySlug(slug);
        if (foundProblem) {
          setProblem(foundProblem);
          setCurrentProblemIndex(practiceProblemsData.findIndex(p => p.id === foundProblem.id));
        } else {
          setError('Problem not found');
        }
      } else {
        // Load first problem by default
        setProblem(practiceProblemsData[0]);
        setCurrentProblemIndex(0);
      }
    } catch (err) {
      console.error('Failed to load problem:', err);
      setError('Failed to load problem. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#00D9FF', '#10B981', '#8B5CF6'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#00D9FF', '#10B981', '#8B5CF6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const saveDraft = useCallback(() => {
    if (!problem) return;
    
    const draftKey = `practice-problem-draft-${user?.id || 'anonymous'}-${problem.id}-${selectedLanguage}`;
    localStorage.setItem(draftKey, code);
    toast.success('Draft saved');
  }, [user, code, problem, selectedLanguage]);

  const runCode = async (submitAll = false) => {
    if (!problem) return;

    if (submitAll) {
      setSubmitting(true);
    } else {
      setRunning(true);
    }
    setResults(null);
    setConsoleOutput('');
    setLastError(null);

    try {
      // Prepare test cases based on submission type
      const testCasesToRun = submitAll 
        ? [...problem.visibleTestCases, ...problem.hiddenTestCases]
        : problem.visibleTestCases;

      const formattedTestCases = testCasesToRun.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      }));

      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { code, testCases: formattedTestCases, language: selectedLanguage }
      });

      if (error) {
        throw new Error(error.message || 'Failed to execute code');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.results);
      setConsoleOutput(data.consoleOutput || '');
      
      // Check for any errors in results
      const errorResult = data.results.find((r: any) => r.error);
      if (errorResult) {
        setLastError(errorResult.error);
      }

      const passedCount = data.results.filter((r: any) => r.passed).length;
      const totalCount = data.results.length;

      if (submitAll) {
        if (passedCount === totalCount) {
          setSolved(true);
          triggerConfetti();
          toast.success(`🎉 Congratulations! All ${totalCount} test cases passed!`);
        } else {
          toast.error(`${passedCount}/${totalCount} test cases passed`);
        }
      } else {
        if (passedCount === totalCount) {
          toast.success(`All visible test cases passed!`);
        } else {
          toast.info(`${passedCount}/${totalCount} visible test cases passed`);
        }
      }
    } catch (error: unknown) {
      console.error('Execution error:', error);
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
      setConsoleOutput(message);
      setLastError(message);
    } finally {
      setRunning(false);
      setSubmitting(false);
    }
  };

  // Convert test cases to format expected by TestCasePanel
  const testCases = problem?.visibleTestCases.map((tc, index) => ({
    id: `tc-${index}`,
    input: tc.input,
    expected_output: tc.expectedOutput,
    is_visible: true,
    display_order: index,
  })) || [];

  // Navigation functions
  const navigateToProblem = (index: number) => {
    if (index >= 0 && index < practiceProblemsData.length) {
      const problemSlug = practiceProblemsData[index].slug;
      navigate(`/practice-problems/${problemSlug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-4">Failed to Load Problem</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'Unable to load the practice problem. Please try again.'}
            </p>
            <Button onClick={loadProblem} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Practice Problems</h1>
            </div>
            <span className="text-sm text-muted-foreground">
              Problem {currentProblemIndex + 1} of {practiceProblemsData.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToProblem(currentProblemIndex - 1)}
              disabled={currentProblemIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateToProblem(currentProblemIndex + 1)}
              disabled={currentProblemIndex === practiceProblemsData.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/practice-problems')}
            >
              All Problems
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Problem Description Panel */}
          <ResizablePanel
            defaultSize={40}
            minSize={showDescription ? 25 : 0}
            maxSize={showDescription ? 60 : 0}
            className={cn(!showDescription && 'hidden')}
          >
            <div className="flex h-full flex-col">
              {/* Problem Header */}
              <div className="border-b border-border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-xl font-bold">{problem.title}</h1>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className={getDifficultyColor('easy')}>
                        <Target className="h-4 w-4" />
                        <span className="ml-1">Practice</span>
                      </Badge>
                      {solved && (
                        <Badge className="bg-success text-success-foreground">Completed ✓</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/')}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </div>
              </div>

              {/* Problem Content */}
              <ScrollArea className="flex-1">
                <div className="space-y-6 p-4">
                  {/* Problem Description */}
                  <div>
                    <h3 className="mb-2 font-semibold">Problem Description</h3>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm">{problem.description}</pre>
                    </div>
                  </div>

                  <Separator />

                  {/* Input/Output Formats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Input Format</h4>
                      <pre className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
                        {problem.inputFormat}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Output Format</h4>
                      <pre className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
                        {problem.outputFormat}
                      </pre>
                    </div>
                  </div>

                  <Separator />

                  {/* Constraints */}
                  <div>
                    <h4 className="font-semibold mb-2">Constraints</h4>
                    <pre className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
                      {problem.constraints}
                    </pre>
                  </div>

                  {/* Examples */}
                  <div>
                    <h4 className="font-semibold mb-3">Examples</h4>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((testCase, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-border bg-card p-4"
                        >
                          <div className="mb-2 text-sm font-medium text-muted-foreground">
                            Example {index + 1}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="mb-1 text-xs font-medium text-muted-foreground">
                                Input
                              </div>
                              <pre className="rounded bg-muted p-2 font-mono text-sm">
                                {testCase.input}
                              </pre>
                            </div>
                            <div>
                              <div className="mb-1 text-xs font-medium text-muted-foreground">
                                Output
                              </div>
                              <pre className="rounded bg-muted p-2 font-mono text-sm">
                                {testCase.expectedOutput}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Code Editor Panel */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              {/* Editor */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <div className="flex h-full flex-col">
                  {/* Editor Header */}
                  <div className="flex items-center justify-between border-b border-border px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDescription(!showDescription)}
                        className="rounded p-1 hover:bg-secondary"
                      >
                        {showDescription ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <LanguageSelector
                        value={selectedLanguage}
                        onChange={setSelectedLanguage}
                        disabled={false}
                      />
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="flex-1 relative">
                    {solved && (
                      <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
                          <p className="text-lg font-semibold text-success">Problem Solved!</p>
                          <p className="text-sm text-muted-foreground mt-1">Great job! Try the next problem.</p>
                        </div>
                      </div>
                    )}
                    <CodeEditor
                      value={code}
                      onChange={setCode}
                      language={selectedLanguage}
                    />
                  </div>

                  {/* Editor Footer */}
                  <div className="flex items-center justify-between border-t border-border px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {solved ? "Problem completed" : "Paste disabled — type your solution"}
                    </span>
                    <div className="flex gap-2">
                      {solved ? (
                        <div className="flex items-center gap-2 text-sm text-success">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={saveDraft}
                            size="sm"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => runCode(false)}
                            disabled={running || submitting}
                          >
                            {running ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Play className="mr-2 h-4 w-4" />
                            )}
                            Run
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => runCode(true)}
                            disabled={running || submitting}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {submitting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="mr-2 h-4 w-4" />
                            )}
                            Submit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Test Results Panel */}
              <ResizablePanel defaultSize={40} minSize={20}>
                <TestCasePanel
                  testCases={testCases}
                  results={results || undefined}
                  isRunning={running || submitting}
                  consoleOutput={consoleOutput}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
