import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { dailyChallengeService, DailyChallenge, DailyChallengeProgress } from '@/lib/dailyChallenges';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Calendar,
  Trophy,
  Clock,
  Target,
  Flame,
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
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { getLocalLivesData, loseLife, hasLives, formatTimeRemaining, getTimeUntilNextRestore } from '@/lib/livesSystem';
import { LivesDisplay } from '@/components/lives/LivesDisplay';
import { GlitchyAssistant } from '@/components/editor/GlitchyAssistant';
import { LanguageSelector } from '@/components/editor/LanguageSelector';
import { StoryGenerator } from '@/components/problems/StoryGenerator';

export default function DailyChallengePage() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [userProgress, setUserProgress] = useState<DailyChallengeProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todaySolved, setTodaySolved] = useState(false);
  const [userStreak, setUserStreak] = useState(0);

  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [showDescription, setShowDescription] = useState(true);
  const [solved, setSolved] = useState(false);
  const [noLives, setNoLives] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');

  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const currentDate = new Date();
  const dateFormatted = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Target className="h-4 w-4" />;
      case 'medium': return <Zap className="h-4 w-4" />;
      case 'hard': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getStarterCodeForLanguage = useCallback((lang: string): string => {
    const templates: Record<string, string> = {
      python: `# Write your solution here\ndef solution():\n    # Your code here\n    pass\n`,
      javascript: `// Write your solution here\nfunction solution() {\n    // Your code here\n}\n`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n    }\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n`,
    };
    return templates[lang] || templates.python;
  }, []);

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  useEffect(() => {
    if (challenge && selectedLanguage) {
      const draftKey = `daily-challenge-draft-${user?.id || 'anonymous'}-${selectedLanguage}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setCode(savedDraft);
      } else {
        setCode(getStarterCodeForLanguage(selectedLanguage));
      }
    }
  }, [challenge, selectedLanguage, user?.id, getStarterCodeForLanguage]);

  const loadDailyChallenge = async () => {
    try {
      setIsLoading(true);
      const todayChallenge = await dailyChallengeService.getTodayChallenge();
      setChallenge(todayChallenge);
      const progress = await dailyChallengeService.getTodayChallengeProgress();
      const solved = await dailyChallengeService.hasUserSolvedToday();
      const streak = await dailyChallengeService.getUserDailyStreak();
      setUserProgress(progress);
      setTodaySolved(solved);
      setUserStreak(streak);
    } catch (err) {
      setError('Failed to load daily challenge.');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsSolved = async () => {
    if (!challenge) return;
    try {
      await dailyChallengeService.updateChallengeProgress(today, { isCompleted: true, solvedAt: new Date().toISOString() });
      setTodaySolved(true);
      toast.success('Congratulations! Daily challenge completed!');
    } catch (err) {
      toast.error('Failed to save progress.');
    }
  };

  const runCode = async (submitAll = false) => {
    if (!challenge || !user) return;
    submitAll ? setSubmitting(true) : setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { code, testCases: challenge.testCases, language: selectedLanguage }
      });
      if (error) throw error;
      setResults(data.results);
      if (submitAll && data.results.every((r: any) => r.passed)) {
        await markAsSolved();
        confetti();
      }
    } catch (err) {
      toast.error('Execution failed');
    } finally {
      setRunning(false);
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />

      {todaySolved && (
        <div className="bg-success/10 border-b border-success/30 px-4 py-3 text-center text-success font-medium flex items-center justify-center gap-2">
          <CheckCircle2 className="h-5 w-5" /> Daily Challenge Completed! 🎉
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40} className={cn(!showDescription && 'hidden')}>
            <div className="flex h-full flex-col">
              <div className="border-b p-4">
                <h1 className="text-xl font-bold">{challenge?.title}</h1>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline" className={getDifficultyColor(challenge?.difficulty || '')}>
                    {getDifficultyIcon(challenge?.difficulty || '')} {challenge?.difficulty}
                  </Badge>
                  <Badge variant="secondary">{challenge?.category}</Badge>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-6 p-4">
                  {/* REFACTORED PROBLEM DESCRIPTION SECTION */}
                  <section>
                    <h3 className="mb-4 font-semibold text-lg">Problem Description</h3>
                    
                    {challenge?.story && (
                      <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground mb-4 leading-relaxed border-l-4 border-primary/20">
                        {challenge.story}
                      </div>
                    )}

                    <StoryGenerator
                      problem={{
                        id: challenge?.id || '',
                        title: challenge?.title || '',
                        description: challenge?.description || '',
                        difficulty: challenge?.difficulty || 'easy',
                        category: challenge?.category || '',
                        language: selectedLanguage
                      }}
                      onStoryGenerated={(story) => setChallenge(prev => prev ? { ...prev, story } : null)}
                      className="mt-2"
                    />
                  </section>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Input Format</h4>
                      <pre className="rounded bg-muted p-3 text-xs">{challenge?.inputFormat}</pre>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Output Format</h4>
                      <pre className="rounded bg-muted p-3 text-xs">{challenge?.outputFormat}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Constraints</h4>
                    <pre className="rounded bg-muted p-3 text-xs">{challenge?.constraints}</pre>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60}>
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b px-4 py-2">
                    <LanguageSelector value={selectedLanguage} onChange={setSelectedLanguage} />
                    {!todaySolved && <GlitchyAssistant code={code} language={selectedLanguage} problemDescription={challenge?.description || ''} lastError={lastError} />}
                  </div>
                  <div className="flex-1 relative">
                    {todaySolved && (
                      <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center text-center">
                        <div>
                          <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
                          <p className="text-lg font-semibold text-success">Completed!</p>
                        </div>
                      </div>
                    )}
                    <CodeEditor value={code} onChange={setCode} language={selectedLanguage} />
                  </div>
                  <div className="flex items-center justify-between border-t px-4 py-3">
                    <span className="text-xs text-muted-foreground">Type your solution manually</span>
                    <div className="flex gap-2">
                      {!todaySolved && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => runCode(false)} disabled={running}>
                            {running ? <Loader2 className="animate-spin h-4 w-4" /> : <Play className="h-4 w-4 mr-2" />} Run
                          </Button>
                          <Button size="sm" onClick={() => runCode(true)} disabled={submitting}>
                             {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4 mr-2" />} Submit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40}>
                <TestCasePanel 
                    testCases={challenge?.testCases.map((tc, i) => ({ ...tc, id: i.toString(), expected_output: tc.expectedOutput })) || []} 
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