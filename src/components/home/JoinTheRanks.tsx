import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function JoinTheRanks() {
    return (
        <section className="relative w-full py-24 px-6 overflow-hidden bg-[#030712]">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="join-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(124, 59, 237, 0.3)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#join-grid)" />
                </svg>
            </div>

            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                <h2 className="font-space text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
                    THE TOP 1% ARE <span className="text-white bg-clip-text bg-gradient-to-r from-white to-white/60">ALREADY INSIDE.</span>
                </h2>

                <div className="space-y-2">
                    <p className="text-slate-400 font-mono text-xs md:text-sm tracking-widest leading-relaxed max-w-2xl mx-auto">
                        Every platform. Every weapon. Browser battles or IDE integration—your call. But you're competing against coders who synced their setup 6 months ago. How far behind can you afford to fall?
                    </p>
                </div>

                <div className="pt-6">
                    <Link
                        to="/auth?mode=signup"
                        className="group relative inline-flex h-14 items-center justify-center px-10 rounded-lg bg-primary text-white font-bold tracking-[0.1em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(124,59,237,0.3)] hover:shadow-[0_0_50px_rgba(124,59,237,0.5)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        CLAIM YOUR RANK
                        <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
