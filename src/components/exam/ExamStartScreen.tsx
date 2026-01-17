import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, Heart, Shield, Code, CheckCircle, Sparkles, Home, Code2, Loader2, Cpu, Zap, Activity, ChevronRight, Hash } from 'lucide-react';
import { ExamLanguage, getLanguageDisplayName, getProblemsByLanguage } from '@/lib/examUtils';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExamStartScreenProps {
  onStart: (language: ExamLanguage, instanceData?: {
    id: string;
    questions: any[];
    duration: number;
    topic: string;
    score_per_question: number;
    total_questions: number;
  }) => void;
  isLoading: boolean;
  selectedTopic?: string | null;
}

export function ExamStartScreen({ onStart, isLoading, selectedTopic }: ExamStartScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<ExamLanguage | null>(null);
  const [adminCode, setAdminCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const languages: ExamLanguage[] = ['python', 'javascript', 'java', 'cpp'];

  const LANGUAGE_LOGOS: Record<ExamLanguage, string> = {
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
  };

  const getQuestionCount = (lang: ExamLanguage) => {
    let problems = getProblemsByLanguage(lang);
    if (lang === 'python' && selectedTopic && selectedTopic !== 'All') {
      problems = problems.filter(p => p.category === selectedTopic);
    }
    return problems.length;
  };

  const handleStartQuest = async () => {
    if (!selectedLanguage) {
      toast.error('Please select a target language');
      return;
    }

    if (adminCode.trim()) {
      setIsValidating(true);
      try {
        // 1. Check if it's a practice code
        if (adminCode.startsWith('PRC-')) {
          toast.error('This is a Practice Protocol Code. Use it in the Practice Lab instead.');
          setIsValidating(false);
          return;
        }

        // 2. Find admin with this code
        const { data: adminData, error: adminError } = await supabase
          .from('admins' as any)
          .select('id')
          .eq('admin_code', adminCode)
          .maybeSingle() as any;

        if (adminError || !adminData) {
          toast.error('Invalid Protocol Code. Check with your host.');
          setIsValidating(false);
          return;
        }

        // 3. Find active or scheduled instance for this admin (EXCLUDING practice sessions)
        const { data: instances, error: instanceError } = await supabase
          .from('exam_instances' as any)
          .select('*')
          .eq('host_admin_id', adminData.id)
          .in('status', ['active', 'scheduled'])
          .order('created_at', { ascending: false }) as any;

        const instance = instances?.find((i: any) => !i.topic.startsWith('[PRACTICE]'));

        if (instanceError || !instance) {
          console.error("Session fetch failure:", instanceError);
          toast.error(`No active exam session found for protocol ${adminCode}.`);
          setIsValidating(false);
          return;
        }

        // Check if session has started
        if (new Date(instance.start_time) > new Date()) {
          toast.info(`Session scheduled to start at ${new Date(instance.start_time).toLocaleTimeString()}`);
          setIsValidating(false);
          return;
        }

        // Check if session has ended
        if (new Date(instance.end_time) < new Date()) {
          toast.error(`This examination session has already concluded. (System Time: ${new Date().toLocaleTimeString()})`);
          setIsValidating(false);
          return;
        }

        // 3. Fetch questions for this instance
        const { data: questions, error: questionsError } = await supabase
          .from('exam_questions' as any)
          .select('*')
          .eq('exam_instance_id', instance.id) as any;

        if (questionsError || !questions || questions.length === 0) {
          toast.error('Instance configuration failure: No questions mapped.');
          setIsValidating(false);
          return;
        }

        // All good, start with instance data
        onStart(selectedLanguage, {
          id: instance.id,
          questions: questions,
          duration: instance.duration_minutes,
          topic: instance.topic,
          score_per_question: instance.score_per_question,
          total_questions: instance.total_questions
        });
      } catch (err) {
        console.error('Validation error:', err);
        toast.error('Network synchronization failure.');
      } finally {
        setIsValidating(false);
      }
    } else {
      // Standard random quest
      onStart(selectedLanguage);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Neural Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        <div className="absolute inset-0 bg-grid-slate-800/[0.05] bg-[bottom_1px_center]" />
      </div>

      {/* Navigation */}
      <Link to="/" className="absolute top-6 left-6 z-50">
        <button className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300">
          <Home className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300 tracking-widest uppercase">Home</span>
        </button>
      </Link>

      <div className="w-full max-w-4xl relative z-10 py-12">
        {/* Header Protocol */}
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/20 mb-4">
            <Activity className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold text-cyan-500/80 tracking-[0.2em]">686 battles happening right now</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white uppercase ">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">Arena Mode</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs sm:text-sm tracking-widest uppercase max-w-lg mx-auto leading-relaxed">
            3 lives. 3 units. Zero room for distraction. The moment you tab out, your career dies with your streak. This isn't practice—this is your elimination round.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Hash className="h-12 w-12 text-cyan-400" />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-cyan-400 font-bold text-[10px] tracking-[0.2em] uppercase">Unlock Arena Mode</h3>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter Arena Code (Required)"
                className="bg-black/40 border-slate-800 focus:border-cyan-500/50 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none text-white font-mono placeholder:text-slate-700 h-12"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value.toUpperCase())}
              />
              <div className="flex items-center justify-center px-4 rounded-lg bg-slate-900 border border-slate-800">
                <Shield className="h-4 w-4 text-slate-600" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono italic">
              * A valid protocol code is required to initialize the arena session.
            </p>
          </div>
        </div>

        <br />

        <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
          {/* Main Protocol Cards */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Duration Module */}
              <div className="group relative p-6 rounded-2xl bg-[#0B1121]/50 border border-slate-800/50 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Clock className="h-16 w-16 text-cyan-400" />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Clock className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-1">Clock Ticks</h3>
                    <p className="text-slate-500 text-xs font-mono leading-relaxed">
                      Stay locked in or lose everything you've built.
                    </p>
                  </div>
                </div>
              </div>

              {/* Question Module */}
              <div className="group relative p-6 rounded-2xl bg-[#0B1121]/50 border border-slate-800/50 hover:border-violet-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Code className="h-16 w-16 text-violet-400" />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <Code className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-1">Challenge Set</h3>
                    <p className="text-slate-500 text-xs font-mono leading-relaxed">
                      {selectedTopic && selectedTopic !== "All" && selectedLanguage === 'python'
                        ? `Topic: ${selectedTopic} // 3 Units`
                        : "3 Randomized Logic Vectors"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Heart Module */}
              <div className="group relative p-6 rounded-2xl bg-[#0B1121]/50 border border-slate-800/50 hover:border-rose-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Heart className="h-16 w-16 text-rose-400" />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                    <Heart className="h-5 w-5 text-rose-400 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-1">3 Syncs</h3>
                    <p className="text-slate-500 text-xs font-mono leading-relaxed">
                      Stay on this screen. Leaving ends the run.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Module */}
              <div className="group relative p-6 rounded-2xl bg-[#0B1121]/50 border border-slate-800/50 hover:border-amber-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Shield className="h-16 w-16 text-amber-400" />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Shield className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-1">Screen being watched</h3>
                    <p className="text-slate-500 text-xs font-mono leading-relaxed">
                      We see every click. Don't let system fail you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Code Entry */}

            {/* Warning Footer */}
            <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 flex items-center gap-4">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
              <p className="text-[10px] sm:text-xs text-rose-400/80 font-mono tracking-widest leading-relaxed">
                The moment you leave this screen—intentional or not—you forfeit all 3 lives. No warnings. No grace period. Your exam ends, your streak dies, and your spot goes to the player behind you in queue
              </p>
            </div>
          </div>

          {/* Launch Controls */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0B1121] border border-slate-800 shadow-2xl space-y-8">
              <div className="space-y-4">
                <h3 className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase">Target Language</h3>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group/item",
                        selectedLanguage === lang
                          ? "bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/20"
                          : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <img
                            src={LANGUAGE_LOGOS[lang]}
                            alt={lang}
                            className={cn(
                              "w-6 h-6 object-contain transition-all duration-300",
                              selectedLanguage === lang ? "brightness-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "opacity-40 grayscale group-hover/item:opacity-60 group-hover/item:grayscale-0"
                            )}
                          />
                          {selectedLanguage === lang && (
                            <div className="absolute -inset-1 bg-cyan-500/10 rounded-full blur-sm -z-10 animate-pulse"></div>
                          )}
                        </div>
                        <span className={cn(
                          "text-sm font-bold tracking-wider",
                          selectedLanguage === lang ? "text-white" : "text-slate-500 group-hover/item:text-slate-400"
                        )}>
                          {getLanguageDisplayName(lang)}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-600">
                        [{getQuestionCount(lang)}]
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedLanguage && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-3 w-3 text-cyan-400" />
                    <span className="text-[10px] font-bold text-cyan-500/80 tracking-widest uppercase italic">YOUR BATTLE STATS</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-2 leading-relaxed">
                    <div className="flex justify-between">
                      <span className="text-slate-600">PROTOCOL:</span>
                      <span className="text-cyan-400">{adminCode ? 'HOST_INJECTED' : 'ENCRYPTED_EXEC'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">MODE:</span>
                      <span className="text-white">FULLSCREEN_ONLY</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={!selectedLanguage || !adminCode.trim() || isLoading || isValidating}
                onClick={handleStartQuest}
                className={cn(
                  "w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black tracking-[0.2em] uppercase transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative",
                  selectedLanguage
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:-translate-y-1"
                    : "bg-slate-800 text-slate-500 grayscale"
                )}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                {isLoading || isValidating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    Enter Arena
                    <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[9px] font-bold tracking-[0.3em] text-slate-700 uppercase">
              <span>Secure Session</span>
              <div className="h-1 w-1 rounded-full bg-slate-800" />
              <span>AES-256</span>
              <div className="h-1 w-1 rounded-full bg-slate-800" />
              <span>Bio-Link active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
