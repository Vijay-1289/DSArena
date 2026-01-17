import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import logo from '@/assets/logo.png';
import { JoinTheRanks } from '@/components/home/JoinTheRanks';
import {
  Terminal,
  Activity,
  Shield,
  BarChart3,
  Calendar,
  ChevronRight,
  TrendingUp,
  CircuitBoard,
  Crosshair,
  ArrowRight,
} from 'lucide-react';

export default function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden mesh-bg bg-background-dark text-slate-100 font-display selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-[90vh]">
        {/* Decorative SVG Network (Abstract) */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(124, 59, 237, 0.1)" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect fill="url(#grid)" height="100%" width="100%"></rect>
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl text-center space-y-8 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            LIVE: 1,187 WARRIORS IN COMBAT
          </div>

          <h1 className="font-space text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] text-white">
            Crack the Code <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-violet-500">Claim the Rank.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-light leading-relaxed">  One wrong move costs you a life. Three lives lost? You restart from zero. No copy-paste safety nets. Just you vs. the algorithm. Survive and recruiters notice. Fail and you're invisible.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              className="sheen-btn group flex min-w-[200px] h-14 items-center justify-center rounded-lg bg-primary text-white font-bold tracking-wide transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(124,59,237,0.3)]"
              to="/auth?mode=signup"
            >
              Enter Arena
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              className="glass flex min-w-[200px] h-14 items-center justify-center rounded-lg text-white font-bold tracking-wide transition-all hover:bg-white/10"
              to="/leaderboard"
            >
              See Who's Winning
            </Link>
          </div>
        </div>
      </main>

      {/* Social Proof Section */}
      {/* <section className="max-w-6xl mx-auto px-6 py-12 border-y border-white/5 bg-white/[0.01]">
        <h4 className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold text-center mb-10">Trusted by engineers at elite tech labs</h4>
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-40 grayscale contrast-125">
          <div className="h-8 w-24 bg-slate-400/20 rounded-md flex items-center justify-center text-[10px] font-black tracking-widest text-white/50">NVIDIA</div>
          <div className="h-8 w-24 bg-slate-400/20 rounded-md flex items-center justify-center text-[10px] font-black tracking-widest text-white/50">STARK</div>
          <div className="h-8 w-24 bg-slate-400/20 rounded-md flex items-center justify-center text-[10px] font-black tracking-widest text-white/50">G-XON</div>
          <div className="h-8 w-24 bg-slate-400/20 rounded-md flex items-center justify-center text-[10px] font-black tracking-widest text-white/50">LUMINA</div>
        </div>
      </section> */}

      {/* Feature Section */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="font-space text-3xl md:text-5xl font-bold text-white mb-4">Your Opponents Don't Lag. Why Should You?</h2>
            <p className="text-slate-400 text-lg">Sub-millisecond execution. Zero distractions. While others debug in slow motion, you're already three problems ahead. This is how the top 1% train.</p>
          </div>
          <div className="hidden md:block">
            <span className="text-primary font-mono text-sm tracking-tighter">// ⚡ 686 battles happening right now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass p-8 rounded-xl group hover:border-cyan-500/40 transition-all duration-500">
            <div className="mb-6 relative h-16 w-16 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative inline-flex items-center justify-center p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:border-cyan-500/40 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Activity className="h-8 w-8 relative z-10" />
              </div>
            </div>
            <h3 className="text-white text-xl font-bold mb-3 group-hover:text-cyan-300 transition-colors font-space">Live Fire. Instant Damage.</h3>
            <p className="text-slate-400 leading-relaxed font-light text-sm">Your code executes in real-time against another player's solution. Milliseconds decide who ranks up and who drops. No waiting. No mercy. The faster you solve, the faster you win.</p>
          </div>
          {/* Card 2 */}
          <div className="glass p-8 rounded-xl group hover:border-primary/40 transition-all duration-500 border-primary/20 bg-primary/[0.02]">
            <div className="mb-6 relative h-16 w-16 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative inline-flex items-center justify-center p-4 rounded-xl bg-primary/20 border border-primary/30 text-primary group-hover:border-primary/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CircuitBoard className="h-8 w-8 relative z-10" />
              </div>
            </div>
            <h3 className="text-white text-xl font-bold mb-3 group-hover:text-primary transition-colors font-space">
              See What's Killing Your Code</h3>
            <p className="text-slate-400 leading-relaxed font-light text-sm">Our AI scans your logic before you even hit 'Run.' Bottlenecks exposed. Edge cases predicted. Fix the failure points before they cost you a life—or a job offer.</p>
          </div>
          {/* Card 3 */}
          <div className="glass p-8 rounded-xl group hover:border-indigo-500/40 transition-all duration-500">
            <div className="mb-6 relative h-16 w-16 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative inline-flex items-center justify-center p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:border-indigo-500/40 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Crosshair className="h-8 w-8 relative z-10" />
              </div>
            </div>
            <h3 className="text-white text-xl font-bold mb-3 group-hover:text-indigo-300 transition-colors font-space">
              No Alerts. No Tabs. No Excuses.</h3>
            <p className="text-slate-400 leading-relaxed font-light text-sm">Full-screen lockdown mode. Cyber-Pro aesthetics that don't assault your eyes during 3-hour grinds.</p>
          </div>
        </div>
      </section>

      {/* Visual Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[500px]">
          <div className="md:col-span-8 relative rounded-xl overflow-hidden glass group shadow-2xl">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-60" style={{
              backgroundImage: 'linear-gradient(rgba(5, 5, 10, 0.4), rgba(5, 5, 10, 0.8)), url("https://images.pexels.com/photos/669613/pexels-photo-669613.jpeg")'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <p className="text-primary font-mono text-[10px] mb-2 tracking-widest uppercase font-bold">TELEMETRY_MAIN</p>
              <h4 className="text-3xl font-space font-bold text-white leading-tight">Advance Visualized <br />Learning</h4>
            </div>
          </div>
          <div className="md:col-span-4 grid grid-rows-2 gap-4">
            <div className="relative rounded-xl overflow-hidden glass group shadow-xl">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-40" style={{
                backgroundImage: 'linear-gradient(rgba(5, 5, 10, 0.4), rgba(5, 5, 10, 0.8)), url("https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg")'
              }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="text-white/20 h-16 w-16 group-hover:scale-110 transition-transform duration-500 holographic-glow-cyan" />
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden glass group shadow-xl">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-40" style={{
                backgroundImage: 'linear-gradient(rgba(124, 59, 237, 0.2), rgba(5, 5, 10, 0.9)), url("https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg")'
              }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Terminal className="text-white/20 h-16 w-16 group-hover:scale-110 transition-transform duration-500 holographic-glow-violet" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <JoinTheRanks />

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="size-5 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="" className="h-full w-full object-contain rounded-sm" />
            </div>
            <span className="font-space font-bold text-white uppercase tracking-widest text-sm">DSArena</span>
          </div>
          <p className="text-slate-500 text-[10px] text-center md:text-left font-mono leading-relaxed">
            © {new Date().getFullYear()} DSArena Systems Inc. All rights reserved.<br />
            Designed for the 99th percentile.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <Link className="text-slate-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest font-mono" to="/docs">Docs</Link>
          <Link className="text-slate-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest font-mono" to="/privacy">Privacy</Link>
          {/* <a className="text-slate-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest font-mono" href="https://github.com/Krit" target="_blank" rel="noreferrer">GitHub</a> */}
          <button className="size-10 flex items-center justify-center rounded-full glass hover:border-primary transition-all group">
            <Shield className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </footer>
    </div>
  );
}
