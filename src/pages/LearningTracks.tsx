import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth';
import { fetchSolvedProblems } from '@/lib/progressStorage';
import { languageTracks, getAvailableTracks, getComingSoonTracks, LanguageTrack } from '@/lib/languageTracksData';
import { LivesDisplay } from '@/components/lives/LivesDisplay';
import { Lock, ArrowRight, Code2, TrendingUp, Medal, Globe, Rocket, Sparkles, Terminal } from 'lucide-react';
import { toast } from 'sonner';

export default function LearningTracks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSolvedProblems(user.id).then((ids) => {
        setSolvedIds(ids);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const availableTracks = getAvailableTracks();
  const comingSoonTracks = getComingSoonTracks();

  // Calculate progress for each track
  const getTrackProgress = (track: LanguageTrack) => {
    if (!track.problems) return { solved: 0, percent: 0 };
    const solved = track.problems.filter(p => solvedIds.has(p.id)).length;
    return {
      solved,
      percent: (solved / track.totalProblems) * 100
    };
  };

  const handleTrackClick = (track: LanguageTrack) => {
    if (track.id === 'python') navigate('/python-track');
    else navigate(`/track/${track.slug}`);
  };

  // Total Mastery Calculation: Sum all available problems and intersect with user's solved IDs
  const totalAvailableProblems = availableTracks.reduce((acc, t) => acc + t.totalProblems, 0);
  const solvedInAvailableTracks = Array.from(solvedIds).filter(id =>
    availableTracks.some(track => track.problems?.some(p => p.id === id))
  ).length;

  const totalMasteryPercent = totalAvailableProblems > 0
    ? Math.round((solvedInAvailableTracks / totalAvailableProblems) * 100)
    : 0;

  return (
    <div className="bg-[#05050A] font-display text-white min-h-screen overflow-x-hidden relative selection:bg-primary/30">
      {/* Star Field & Orbital Decorations */}
      <div className="fixed inset-0 star-field pointer-events-none z-0" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orbital-path w-[1200px] h-[1200px] -top-[400px] -left-[200px] opacity-20 animate-pulse" />
        <div className="orbital-path w-[800px] h-[800px] top-[10%] left-[20%] opacity-10" />
        <div className="orbital-path w-[1500px] h-[1500px] -bottom-[500px] -right-[300px] opacity-20" />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-20 items-center text-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(7,192,213,0.3)]">
              <Code2 className="h-7 w-7" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white uppercase italic">
              Pick your <span className="text-primary italic">Zone</span>
            </h1>
          </div>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl font-light tracking-wide italic leading-relaxed">
            Python warriors dominate data battles. JavaScript fighters rule frontend arenas. Java tacticians crush enterprise warfare. Pick wrong and you'll bleed lives on incompatible challenges. Pick right and you'll climb faster than 94% of rookies
          </p>

          <div className="mt-6">
            <LivesDisplay showTimer />
          </div>
        </div>

        {/* The Constellation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-12 mb-32 items-center justify-items-center">
          {availableTracks.map((track) => {
            const { solved, percent } = getTrackProgress(track);
            const isComplete = solved === track.totalProblems;
            const strokeDasharray = 565;
            const strokeDashoffset = strokeDasharray - (strokeDasharray * percent) / 100;

            return (
              <div
                key={track.id}
                onClick={() => handleTrackClick(track)}
                className="group relative flex flex-col items-center cursor-pointer transition-all active:scale-95"
              >
                {/* Planet Node Container */}
                <div className="relative w-56 h-56 mb-8">
                  {/* Progress Ring SVG */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(7,192,213,0.2)]">
                    <circle
                      cx="112" cy="112" r="95"
                      className="text-white/[0.05] fill-none stroke-current stroke-[2]"
                    />
                    <circle
                      cx="112" cy="112" r="95"
                      className="text-primary fill-none stroke-current stroke-[4] transition-all duration-1000 ease-out"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Planet Core (Orb) */}
                  <div className={`absolute inset-6 rounded-full glass-orb flex flex-col items-center justify-center p-6 ${isComplete ? 'mastered-glow' : ''}`}>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-primary mb-2 uppercase font-mono">{track.id}</span>
                    {track.icon.startsWith('http') ? (
                      <img
                        src={track.icon}
                        alt={track.name}
                        className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                      />
                    ) : (
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{track.icon}</span>
                    )}
                    {isComplete && <Sparkles className="absolute -top-2 -right-2 text-primary animate-pulse" />}
                  </div>
                </div>

                {/* Status HUD Data */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <p className={`font-mono text-xs font-bold tracking-widest ${isComplete ? 'text-primary' : 'text-white/60'}`}>
                      {isComplete ? 'SYSTEM MASTERED' : `${Math.round(percent)}% CONQUERED`}
                    </p>
                  </div>
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">
                    {solved}/{track.totalProblems} PATTERNS MASTERED
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* HUD System Stats Dashboard */}
        <div className="border-t border-white/5 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Total Mastery Panel */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md group hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg tracking-tight uppercase">Total Mastery</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end font-mono">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Global Synchronization</span>
                  <span className="text-xl text-primary font-bold">{totalMasteryPercent}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary shadow-[0_0_10px_rgba(7,192,213,0.5)] transition-all duration-1000"
                    style={{ width: `${totalMasteryPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Badges Panel */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md group hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
                  <Medal className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg tracking-tight uppercase">Achievements</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {totalMasteryPercent > 0 && (
                  <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-primary border border-white/10 shadow-[0_0_15px_rgba(7,192,213,0.2)]" title="System Link Established">
                    <Rocket className="h-5 w-5" />
                  </div>
                )}
                {totalMasteryPercent >= 50 && (
                  <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-[#7C3AED] border border-white/10 shadow-[0_0_15px_rgba(124,58,237,0.2)]" title="Elite Commander">
                    <Sparkles className="h-5 w-5" />
                  </div>
                )}
                <div className="size-10 rounded-full bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-white/10">
                  <Terminal className="h-4 w-4" />
                </div>
                <div className="size-10 rounded-full bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-white/10">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* System Status Panel */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md group hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg tracking-tight uppercase">System Logs</h3>
              </div>
              <div className="font-mono text-[10px] text-white/40 space-y-2 uppercase leading-relaxed tracking-wider">
                <p className="flex justify-between border-b border-white/[0.03] pb-1">
                  <span>Location:</span> <span className="text-white/60">Orion Sector-G9</span>
                </p>
                <p className="flex justify-between border-b border-white/[0.03] pb-1">
                  <span>Signal:</span> <span className="text-emerald-500">Optimal</span>
                </p>
                <p className="flex justify-between border-b border-white/[0.03] pb-1">
                  <span>Processors:</span> <span className="text-white/60">{solvedIds.size} Loaded</span>
                </p>
                <p className="flex justify-between">
                  <span>Buffer:</span> <span className="text-primary animate-pulse">Ready</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation Credits */}
      <footer className="relative z-10 w-full px-10 py-12 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-mono">
            © 2144 DSArena Orbital Command • encrypted protocol
          </p>
          <div className="flex gap-10">
            <span className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse"></span>
              Sub-orbital Systems Hub Established
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
