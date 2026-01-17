import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { problemsData, topicsData } from '@/lib/problemsData';
import { useAuth } from '@/lib/auth';
import { fetchSolvedProblems } from '@/lib/progressStorage';
import {
  Search as SearchIcon,
  LayoutGrid,
  Hash,
  ArrowLeftRight,
  PanelLeft,
  Layers as LayersIcon,
  Search,
  Link as LinkIcon,
  GitBranch,
  Calculator,
  RotateCcw,
  Network,
  BarChart3,
  TreeDeciduous,
  Workflow,
  TrendingUp,
  Grid3X3,
  Zap,
  Calendar,
  Binary,
  Code,
  CheckCircle,
  Circle as CircleIcon,
  Plus as PlusIcon,
  ChevronRight,
  ChevronLeft,
  BrainCircuit
} from 'lucide-react';
import { toast } from 'sonner';

// Unified Icon Mapping for Categories based on lib/problemsData topicsData
const topicIcons: Record<string, any> = {
  "Hash": Hash,
  "ArrowLeftRight": ArrowLeftRight,
  "PanelLeft": PanelLeft,
  "Layers": LayersIcon,
  "Search": Search,
  "Link": LinkIcon,
  "GitBranch": GitBranch,
  "Calculator": Calculator,
  "RotateCcw": RotateCcw,
  "Network": Network,
  "BarChart3": BarChart3,
  "TreeDeciduous": TreeDeciduous,
  "Workflow": Workflow,
  "TrendingUp": TrendingUp,
  "Grid3X3": Grid3X3,
  "Zap": Zap,
  "Calendar": Calendar,
  "Binary": Binary,
  "Code": Code,
};

export default function Problems() {
  const navigate = useNavigate();
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    const loadSolvedProblems = async () => {
      if (!user) return;
      const solved = await fetchSolvedProblems(user.id);
      setSolvedIds(solved);
    };

    if (user) {
      loadSolvedProblems();
    }
  }, [user]);

  // Dynamic Topic Chips based on topicsData
  const topicChips = useMemo(() => {
    const base = [{ id: 'all', name: 'All Topics', icon: LayoutGrid, colorMode: 'violet' }];
    const topics = topicsData.map(topic => ({
      id: topic.name,
      name: topic.name.replace('Dynamic Programming', 'DP'),
      icon: topicIcons[topic.icon] || BrainCircuit,
      colorMode: topic.name === 'Graphs' || topic.name === 'Advanced Graph' ? 'cyan' : 'violet'
    }));
    return [...base, ...topics];
  }, []);

  // Core Filtering Logic (Preserved and Perfected)
  const filteredProblems = useMemo(() => {
    return problemsData.filter((problem) => {
      const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
      const matchesTopic = selectedTopic === 'all' || problem.category === selectedTopic;
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      return matchesSearch && matchesTopic && matchesDifficulty;
    });
  }, [search, selectedTopic, selectedDifficulty]);

  const handleNewProblem = () => {
    const unsolved = problemsData.find(p => !solvedIds.has(p.id));
    if (unsolved) {
      navigate(`/problem/${unsolved.slug}`);
    } else {
      toast.success("All systems operational. Mastery achieved.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] font-display text-white selection:bg-primary/30 relative">
      <Navbar />

      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full blur-[100px] pointer-events-none opacity-50" />

      <main className="max-w-[1200px] mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-white tracking-tighter text-4xl md:text-5xl font-black leading-tight flex items-center gap-4 italic group">
              <span className="text-primary italic animate-pulse">#</span> Practice Problems
            </h1>
            <p className="text-white/40 text-sm md:text-base font-light tracking-wide italic leading-relaxed max-w-xl">
              Refine your algorithmic skills with curated challenges. {problemsData.length} problems across {topicsData.length} topics detected.
            </p>
          </div>
          <button
            onClick={handleNewProblem}
            className="group relative flex items-center justify-center rounded-lg h-12 bg-primary text-white gap-3 px-8 hover:brightness-110 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            <PlusIcon className="h-5 w-5 font-bold" />
            <span className="text-xs font-black uppercase tracking-[0.2em] italic">New problem</span>
          </button>
        </div>

        {/* Dynamic Multi-Topic Chips container */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          {topicChips.map((topic) => {
            const isActive = selectedTopic === topic.id;
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`flex h-10 shrink-0 items-center justify-center gap-3 rounded-lg px-6 transition-all duration-300 border ${isActive
                    ? (topic.colorMode === 'cyan' ? 'active-chip-cyan' : 'active-chip-violet')
                    : 'glass-chip border-white/5 opacity-60 hover:opacity-100'
                  }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? (topic.colorMode === 'cyan' ? 'text-cyber-cyan' : 'text-primary') : 'text-white/40'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-white' : 'text-white/40'}`}>
                  {topic.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6 py-6 mb-4 border-b border-white/5 items-center">
          <div className="flex gap-6 items-center w-full md:w-auto">
            <div className="flex items-center gap-3 text-white/30 text-[10px] uppercase tracking-[0.3em] font-black italic">
              <span className="flex items-center h-4"><LayoutGrid size={14} className="mr-2" /> Filter By</span>
            </div>
            <div className="h-5 w-[1px] bg-white/10 hidden md:block" />

            <div className="flex gap-4 flex-1 md:flex-none">
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="h-9 bg-white/5 border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest px-4 rounded-md focus:ring-0">
                  <SelectValue placeholder="DIFFICULTY" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B1121] border-white/10 text-white">
                  <SelectItem value="all">ALL LEVELS</SelectItem>
                  <SelectItem value="easy">EASY</SelectItem>
                  <SelectItem value="medium">MEDIUM</SelectItem>
                  <SelectItem value="hard">HARD</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 text-white/20 text-[10px] font-mono uppercase tracking-tighter">
                {filteredProblems.length} PACKETS
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
            <input
              placeholder="SEARCH DATA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border-b border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 px-10 py-2.5 text-xs font-mono uppercase tracking-widest transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/5 bg-[#05050A]/50 backdrop-blur-sm shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 w-20 text-center italic">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 min-w-[350px] italic">Problem Metadata</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 w-36 italic">Complexity</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 w-44 italic">Success Metrics</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 w-[120px] text-right italic">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <p className="text-white/20 font-mono text-xs uppercase tracking-[0.3em] italic">No data packets found matching current hash...</p>
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => {
                  const isSolved = solvedIds.has(problem.id);
                  const difficultyColor =
                    problem.difficulty === 'easy' ? 'text-emerald-500' :
                      problem.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500';
                  const difficultyBg =
                    problem.difficulty === 'easy' ? 'bg-emerald-500' :
                      problem.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500';

                  return (
                    <tr
                      key={problem.id}
                      onClick={() => navigate(`/problem/${problem.slug}`)}
                      className="table-row-hover transition-all duration-300 group cursor-pointer"
                    >
                      <td className="px-6 py-6 text-center">
                        {isSolved ? (
                          <div className="inline-flex drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          </div>
                        ) : (
                          <CircleIcon className="h-5 w-5 text-white/10 group-hover:text-white/30 transition-colors" />
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <h3 className="text-white text-base font-bold group-hover:text-primary transition-colors tracking-tight italic">
                            {problem.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-white/30 font-mono uppercase tracking-tighter">
                              {problem.category}
                            </span>
                            <div className="size-1 rounded-full bg-white/10" />
                            <div className="flex items-center gap-2">
                              <div className={`size-1.5 rounded-full ${difficultyBg} glow-dot`} />
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${difficultyColor}`}>
                                {problem.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-mono text-[10px] text-white/30 space-y-1 uppercase tracking-widest">
                          <p className="flex justify-between w-24"><span>Time:</span> <span className="text-white/50">O(log N)</span></p>
                          <p className="flex justify-between w-24"><span>Space:</span> <span className="text-white/50">O(1)</span></p>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-mono text-xs text-white/60">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] text-white/30">
                            <span>MASTERED UNIT</span>
                            <span>{isSolved ? '100%' : '0%'}</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full opacity-50 transition-all duration-1000 ${isSolved ? 'bg-emerald-500 w-full' : 'bg-primary/40 w-0'}`} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all group-hover:gap-4">
                          <span className={isSolved ? 'text-primary/70' : 'text-white/40 group-hover:text-white'}>
                            {isSolved ? 'REVISIT' : 'INITIALIZE'}
                          </span>
                          <ChevronRight className={`h-4 w-4 ${isSolved ? 'text-primary/70' : 'text-white/20'}`} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between py-12 border-t border-white/5 mt-8">
          <div className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em] italic font-mono">
            Packet Synchronization Status: Nominal
          </div>
          <div className="flex gap-4">
            <button className="flex items-center justify-center rounded-lg px-6 h-10 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/20 cursor-not-allowed italic">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            <button className="flex items-center justify-center rounded-lg px-6 h-10 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all italic">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

      </main>

      <footer className="w-full px-10 py-12 border-t border-white/5 bg-black/40 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-mono">© 2144 DSArena Orbital Storage • encrypted protocol V2.4</p>
          <div className="flex gap-10">
            <span className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono italic">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse"></span>
              Synchronized with Neural Hub
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
