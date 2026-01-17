import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trophy,
  Clock,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Home,
  FileText,
  Loader2,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Cpu,
  Sparkles,
  ChevronRight,
  Star,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { formatExamTime, calculateWeightedScore, QUESTION_WEIGHTS } from '@/lib/examUtils';

interface ExamResultsScreenProps {
  examSessionId: string;
  language: string;
  timeSpent: number;
  hearts: number;
  wasDisqualified: boolean;
  wasAutoSubmitted: boolean;
}

interface ResultData {
  totalScore: number;
  maxScore: number;
  questionsCorrect: number;
  questionsTotal: number;
  compilationErrors: number;
  runtimeErrors: number;
  aiFeedback: string | null;
  weakConcepts: string[];
  suggestions: string[];
}

export function ExamResultsScreen({
  examSessionId,
  language,
  timeSpent,
  hearts,
  wasDisqualified,
  wasAutoSubmitted,
}: ExamResultsScreenProps) {
  const [results, setResults] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  useEffect(() => {
    loadResults();
  }, [examSessionId]);

  const loadResults = async () => {
    try {
      // Fetch exam results
      const { data: resultData, error: resultError } = await supabase
        .from('exam_results')
        .select('*')
        .eq('exam_session_id', examSessionId)
        .single();

      if (resultError) {
        console.error('Error loading results:', resultError);
        // Generate results if not found
        await generateResults();
        return;
      }

      setResults({
        totalScore: resultData.total_score || 0,
        maxScore: resultData.max_score || 0,
        questionsCorrect: resultData.questions_correct || 0,
        questionsTotal: resultData.questions_total || 0,
        compilationErrors: resultData.total_compilation_errors || 0,
        runtimeErrors: resultData.total_runtime_errors || 0,
        aiFeedback: resultData.ai_feedback,
        weakConcepts: resultData.weak_concepts || [],
        suggestions: resultData.improvement_suggestions || [],
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResults = async () => {
    setIsGeneratingAnalysis(true);
    try {
      // Fetch answers for this exam
      const { data: answers } = await supabase
        .from('exam_answers')
        .select('*')
        .eq('exam_session_id', examSessionId)
        .order('question_index', { ascending: true });

      if (!answers) return;

      // Calculate weighted score using the new formula
      const weightedResult = calculateWeightedScore(
        answers.map((a, index) => ({
          testsTotal: a.tests_total || 0,
          testsPassed: a.tests_passed || 0,
          questionIndex: a.question_index ?? index,
        }))
      );

      const questionsCorrect = answers.filter(a => a.is_correct).length;
      const compilationErrors = answers.reduce((sum, a) => sum + (a.compilation_errors || 0), 0);
      const runtimeErrors = answers.reduce((sum, a) => sum + (a.runtime_errors || 0), 0);

      // Generate AI analysis
      let aiFeedback: string | null = null;
      let weakConcepts: string[] = [];
      let suggestions: string[] = [];

      try {
        const { data: aiData } = await supabase.functions.invoke('analyze-exam', {
          body: {
            examSessionId,
            language,
            answers: answers.map(a => ({
              questionId: a.question_id,
              code: a.code,
              isCorrect: a.is_correct,
              testsPassed: a.tests_passed,
              testsTotal: a.tests_total,
              compilationErrors: a.compilation_errors,
              runtimeErrors: a.runtime_errors,
              errorMessages: a.error_messages,
              timeSpent: a.time_spent_seconds,
            })),
            totalTimeSpent: timeSpent,
            violations: 3 - hearts,
          },
        });

        aiFeedback = aiData?.analysis || null;
        weakConcepts = aiData?.weakConcepts || [];
        suggestions = aiData?.suggestions || [];
      } catch (aiErr) {
        console.warn('AI analysis failed:', aiErr);
      }

      // Save results with weighted score
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('exam_results').upsert({
          exam_session_id: examSessionId,
          user_id: user.id,
          total_score: Math.round(weightedResult.score), // Weighted percentage score
          max_score: 100, // Max is always 100%
          questions_correct: questionsCorrect,
          questions_total: answers.length,
          total_compilation_errors: compilationErrors,
          total_runtime_errors: runtimeErrors,
          avg_time_per_question_seconds: Math.round(timeSpent / answers.length),
          weak_concepts: weakConcepts,
          improvement_suggestions: suggestions,
          ai_feedback: aiFeedback,
        }, { onConflict: 'exam_session_id' });
      }

      setResults({
        totalScore: Math.round(weightedResult.score),
        maxScore: 100,
        questionsCorrect,
        questionsTotal: answers.length,
        compilationErrors,
        runtimeErrors,
        aiFeedback,
        weakConcepts,
        suggestions,
      });
    } catch (err) {
      console.error('Error generating results:', err);
    } finally {
      setIsGeneratingAnalysis(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  const percentage = results ? Math.round((results.totalScore / results.maxScore) * 100) || 0 : 0;
  const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Ambient Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 relative z-10 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400 fill-current animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300">Neural Assessment Complete</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase tracking-[0.1em]">
            Status: <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-500">Transmitted</span>
          </h1>

          <div className="flex items-center justify-center gap-4 text-slate-500 font-bold tracking-widest uppercase text-[10px]">
            <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3 text-cyan-500" /> {language} Matrix</span>
            <div className="w-1 h-1 rounded-full bg-slate-800" />
            <span>Session ID: {examSessionId.slice(0, 8)}...</span>
          </div>

          {wasDisqualified && (
            <div className="max-w-2xl mx-auto mt-8 p-1 rounded-[2.5rem] bg-gradient-to-br from-red-600/20 to-red-900/10 border border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.15)] animate-in zoom-in-95 duration-500">
              <div className="bg-[#030712]/60 backdrop-blur-xl rounded-[2.2rem] p-8 border border-white/5 space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-500">
                  <ShieldAlert className="w-5 h-5 animate-glitchy-alert" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Protocol Revoked</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Security Protocol Violation Detected</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
                  Neural focus lost due to viewport exit or context switching. Scoring locked at moment of divergence. Manual admin authorization required for reset.
                </p>
              </div>
            </div>
          )}

          {wasAutoSubmitted && !wasDisqualified && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Temporal Exhaustion Flush</span>
            </div>
          )}
        </div>

        {/* Central Dashboard View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Main Neural Score Display */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-80 h-80 flex items-center justify-center animate-in zoom-in duration-1000">
              {/* Animated Rings */}
              <div className="absolute inset-0 rounded-full border border-indigo-500/10 scale-125 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border border-cyan-500/5 -scale-150 animate-pulse-slow"></div>

              {/* The Score Disc */}
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-indigo-900/30 to-slate-950 border border-white/5 shadow-2xl flex flex-col items-center justify-center backdrop-blur-3xl group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>

                <div className="text-[140px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-indigo-500 group-hover:scale-110 transition-transform duration-700">
                  {grade}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400/70 mt-4 animate-in fade-in delay-500">
                  Efficiency Grade
                </div>

                <div className="absolute bottom-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs">
                  <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                  {percentage}% Match
                </div>
              </div>

              {/* Orbital Details */}
              <div className="absolute top-0 right-0 p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl animate-in slide-in-from-right-8 duration-1000">
                <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Matrix Score</div>
                <div className="text-xl font-bold text-white">{results?.totalScore} <span className="text-slate-600 text-xs">/ {results?.maxScore}</span></div>
              </div>

              <div className="absolute bottom-0 left-0 p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl animate-in slide-in-from-left-8 duration-1000">
                <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Sequence Sync</div>
                <div className="text-xl font-bold text-white">{results?.questionsCorrect} <span className="text-slate-600 text-xs">/ {results?.questionsTotal}</span></div>
              </div>
            </div>
          </div>

          {/* Performance Bento Grid */}
          <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-md hover:border-cyan-500/30 transition-all duration-500 group relative">
              <div className="absolute top-6 right-6">
                <Clock className="w-5 h-5 text-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-[0.25em] mb-4">Temporal Delta</div>
              <div className="text-4xl font-bold text-white tracking-tighter">
                {formatExamTime(timeSpent)}
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 italic">Total Runtime Accrued</p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-500 group relative">
              <div className="absolute top-6 right-6">
                <CheckCircle className="w-5 h-5 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-[0.25em] mb-4">Validation Units</div>
              <div className="text-4xl font-bold text-white tracking-tighter">
                {results?.totalScore}
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 italic">Assertions Successfully Processed</p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-md hover:border-red-500/30 transition-all duration-500 group relative">
              <div className="absolute top-6 right-6">
                <AlertCircle className="w-5 h-5 text-red-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-[0.25em] mb-4">Syntax Violations</div>
              <div className="text-4xl font-bold text-white tracking-tighter">
                {results?.compilationErrors}
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 italic">Compiler Barrier Rejections</p>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-md hover:border-orange-500/30 transition-all duration-500 group relative">
              <div className="absolute top-6 right-6">
                <XCircle className="w-5 h-5 text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-[0.25em] mb-4">Logic Departures</div>
              <div className="text-4xl font-bold text-white tracking-tighter">
                {results?.runtimeErrors}
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2 italic">Execution Thread Failures</p>
            </div>
          </div>
        </div>

        {/* AI Analysis & Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 space-y-8">
            {isGeneratingAnalysis ? (
              <div className="p-12 rounded-[2.5rem] bg-slate-900/20 border border-indigo-500/20 flex flex-col items-center justify-center space-y-6 animate-pulse">
                <Brain className="w-16 h-16 text-indigo-500 animate-pulse" />
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white uppercase tracking-widest">Synthesizing Neural Insights</h3>
                  <p className="text-xs text-slate-600 uppercase tracking-widest font-black">Decomposing performance pattern vectors...</p>
                </div>
              </div>
            ) : results?.aiFeedback && (
              <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 to-transparent border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>

                <div className="bg-[#0B1121]/80 backdrop-blur-3xl rounded-[2.4rem] p-10 space-y-8 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h3 className="text-2xl font-black text-white italic tracking-tight">Neural Insight Terminal</h3>
                    </div>
                    <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em]">AI Synthesis v4.2</div>
                  </div>

                  <ScrollArea className="h-[350px] pr-6 custom-scrollbar">
                    <div className="prose prose-invert prose-sm max-w-none text-slate-400 leading-relaxed font-medium">
                      <p className="whitespace-pre-wrap selection:bg-indigo-500/40">{results.aiFeedback}</p>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            {/* Areas to Improve */}
            {results?.weakConcepts && results.weakConcepts.length > 0 && (
              <div className="p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Convergence Gaps</h3>
                </div>
                <div className="space-y-3">
                  {results.weakConcepts.map((concept, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-yellow-500/10 hover:border-yellow-500/30 transition-colors group">
                      <XCircle className="w-4 h-4 text-yellow-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{concept}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {results?.suggestions && results.suggestions.length > 0 && (
              <div className="p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Uplink Suggestions</h3>
                </div>
                <div className="space-y-3">
                  {results.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/50 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors group">
                      <CheckCircle className="w-4 h-4 text-emerald-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
          <Button asChild variant="ghost" className="px-8 h-14 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-[0.3em] gap-3">
            <Link to="/">
              <Home className="w-4 h-4" />
              Return to Core
            </Link>
          </Button>

          <Button asChild className="px-10 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_40px_rgba(124,58,237,0.3)] border border-violet-400/20 active:scale-95 transition-all group overflow-hidden relative">
            <Link to="/problems" className="inline-flex items-center justify-center w-full h-full gap-3 relative z-10">
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Initiate Next Module</span>
              <div className="bg-white/10 p-1.5 rounded-full group-hover:translate-x-1 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
