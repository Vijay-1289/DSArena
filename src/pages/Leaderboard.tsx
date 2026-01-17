import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import {
    Trophy,
    Crown,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    User as UserIcon,
    Flame,
    Award,
    Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Profile {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    exam_score: number;
    has_passed: boolean;
    streak_days: number;
}

export default function Leaderboard() {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'all' | 'monthly' | 'weekly'>('all');
    const [data, setData] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);

        // Calculate timestamp for 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const timeframe = sevenDaysAgo.toISOString();

        // 1. Fetch all exam sessions with their results from the last week
        // We get scores for everyone who participated
        const { data: results, error } = await supabase
            .from('exam_results')
            .select(`
                total_score,
                user_id,
                exam_sessions!inner(passed, completed_at)
            `)
            .gte('exam_sessions.completed_at', timeframe)
            .order('total_score', { ascending: false });

        if (error) {
            console.error('Error fetching exam results:', error);
            setLoading(false);
            return;
        }

        // 2. Group by user_id to keep only the best score and its status for each user
        const bestUserData: Record<string, { score: number; passed: boolean }> = {};
        results?.forEach((res: any) => {
            const userId = res.user_id;
            const score = res.total_score;
            const passed = res.exam_sessions?.passed || false;

            if (!bestUserData[userId] || score > bestUserData[userId].score) {
                bestUserData[userId] = { score, passed };
            }
        });

        const userIds = Object.keys(bestUserData);
        if (userIds.length === 0) {
            setData([]);
            setLoading(false);
            return;
        }

        // 3. Fetch profile details for these users
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url, streak_days')
            .in('id', userIds);

        if (profileError) {
            console.error('Error fetching profiles:', profileError);
            setLoading(false);
            return;
        }

        // 4. Map back to our local Profile type and sort by score
        const rankedData: Profile[] = profiles.map(p => ({
            ...p,
            exam_score: bestUserData[p.id].score,
            has_passed: bestUserData[p.id].passed
        })).sort((a, b) => b.exam_score - a.exam_score);

        setData(rankedData);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchLeaderboard();

        const channel = supabase
            .channel('leaderboard-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchLeaderboard)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchLeaderboard]);

    const top3 = data.slice(0, 3);
    const others = data.slice(3);

    // Position 1st in the middle for podium
    const podiumData = [
        { ...top3[1], rank: 2 }, // 2nd
        { ...top3[0], rank: 1 }, // 1st
        { ...top3[2], rank: 3 }  // 3rd
    ].filter(p => p.id !== undefined);

    return (
        <div className="min-h-screen bg-[#030712] text-white font-display selection:bg-primary/30 relative">
            <Navbar />

            {/* Grid Background */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="leaderboard-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#leaderboard-grid)" />
                </svg>
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-slate-300">Hall of Fame</span>
                </div>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Leaderboard</h1>

                    <div className="flex items-center gap-8 border-b border-white/5 pb-0">
                        {['ALL TIME', 'MONTHLY', 'WEEKLY'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.split(' ')[0].toLowerCase() as any)}
                                className={cn(
                                    "pb-4 text-xs font-bold tracking-widest transition-all relative",
                                    activeTab === tab.split(' ')[0].toLowerCase()
                                        ? "text-cyan-400"
                                        : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {tab}
                                {activeTab === tab.split(' ')[0].toLowerCase() && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Trophy className="h-12 w-12 text-primary animate-pulse" />
                        <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">Synching ranking nodes...</p>
                    </div>
                ) : (
                    <>
                        {/* Podium Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-20 max-w-4xl mx-auto">
                            {podiumData.map((user) => (
                                <PodiumItem
                                    key={user.id}
                                    user={user}
                                    isCurrentUser={user.id === currentUser?.id}
                                />
                            ))}
                        </div>

                        {/* Ranking List */}
                        <div className="space-y-6">
                            {/* Table Headers */}
                            <div className="grid grid-cols-[60px_1fr_120px_120px] px-6 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                                <div>Rank</div>
                                <div>User</div>
                                <div className="text-right">Score</div>
                                <div className="text-right">Status</div>
                            </div>

                            <div className="space-y-3">
                                {others.map((user, idx) => (
                                    <LeaderboardRow
                                        key={user.id}
                                        user={user}
                                        rank={idx + 4}
                                        isCurrentUser={user.id === currentUser?.id}
                                    />
                                ))}
                            </div>

                            {/* View All Button */}
                            <button className="w-full py-4 rounded-xl bg-slate-900/40 border border-white/5 text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800/60 hover:text-slate-300 transition-all active:scale-[0.99] mt-8">
                                View All Rankings ({data.length} Users)
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

function PodiumItem({ user, isCurrentUser }: { user: Profile & { rank: number }, isCurrentUser: boolean }) {
    const isFirst = user.rank === 1;
    const rankColors = {
        1: "border-amber-500/50 shadow-[0_0_40px_-10px_#fbbf24]",
        2: "border-slate-400/30",
        3: "border-amber-700/30"
    };

    return (
        <div className={cn(
            "relative group transition-all duration-500",
            isFirst ? "order-2 md:-translate-y-8" : user.rank === 2 ? "order-1" : "order-3"
        )}>
            {isFirst && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="relative">
                        <div className="absolute inset-0 blur-lg bg-amber-500/40 animate-pulse" />
                        <div className="size-8 bg-amber-500 rounded-full flex items-center justify-center relative border-2 border-amber-200">
                            <Trophy className="h-4 w-4 text-black" fill="currentColor" />
                        </div>
                    </div>
                    <div className="h-4 w-px bg-amber-500/50 mt-1" />
                    <div className="text-amber-500 font-mono text-[10px] font-black">1</div>
                </div>
            )}

            {!isFirst && (
                <div className="flex justify-center mb-4">
                    <div className="size-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 font-mono text-xs">
                        {user.rank}
                    </div>
                </div>
            )}

            <div className={cn(
                "p-8 rounded-2xl bg-[#0B1121] border transition-all duration-500 text-center flex flex-col items-center",
                rankColors[user.rank as keyof typeof rankColors],
                isCurrentUser && "border-primary/50"
            )}>
                <div className="relative mb-6">
                    <div className={cn(
                        "absolute inset-0 blur-2xl opacity-20 transition-opacity group-hover:opacity-40",
                        isFirst ? "bg-amber-500" : user.rank === 2 ? "bg-slate-400" : "bg-amber-700"
                    )} />
                    <Avatar className={cn(
                        "size-24 border-2 relative z-10",
                        isFirst ? "border-amber-500" : user.rank === 2 ? "border-slate-400" : "border-amber-700"
                    )}>
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-slate-800 text-2xl font-black">
                            {user.display_name?.charAt(0) || user.username?.charAt(0) || '?'}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="space-y-2 mb-6">
                    <h3 className={cn(
                        "text-xl font-bold tracking-tight",
                        isFirst ? "text-cyan-400" : "text-white"
                    )}>
                        {user.display_name || user.username || 'Anonymous'}
                    </h3>
                    <p className="text-slate-400 font-bold text-sm tracking-widest">
                        {user.exam_score?.toLocaleString() || '0'} <span className="text-[10px] text-slate-600 font-mono">SCORE</span>
                    </p>
                </div>

                <div className={cn(
                    "px-4 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase",
                    user.has_passed ? "bg-amber-500 text-black" : "bg-red-500/20 text-red-400 border border-red-500/30"
                )}>
                    {user.has_passed ? "LEGENDARY" : "ATTEMPTED"}
                </div>
            </div>
        </div>
    );
}

function LeaderboardRow({ user, rank, isCurrentUser }: { user: Profile, rank: number, isCurrentUser: boolean }) {
    const score = user.exam_score || 0;
    const status = user.has_passed
        ? { label: "PASSED", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" }
        : { label: "FAILED", color: "text-red-400 bg-red-400/10 border-red-400/20" };

    // Random fluctuations for visual flair
    const trend = Math.random() > 0.5 ? 'up' : 'down';

    return (
        <div className={cn(
            "group grid grid-cols-[60px_1fr_120px_120px] items-center p-4 rounded-xl bg-[#0B1121] border border-white/5 transition-all hover:border-white/20",
            isCurrentUser && "border-cyan-500/50 bg-cyan-500/5"
        )}>
            <div className="text-xl font-mono font-black text-slate-600 group-hover:text-slate-400 transition-colors">
                {rank < 10 ? `0${rank}` : rank}
            </div>

            <div className="flex items-center gap-4">
                <Avatar className="size-10 border border-white/10">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-slate-800">
                        {user.display_name?.charAt(0) || user.username?.charAt(0) || '?'}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                            {user.display_name || user.username || 'Anonymous'}
                        </span>
                        {isCurrentUser && <span className="text-[9px] font-mono text-cyan-500 uppercase">You</span>}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                        {trend === 'up' ? (
                            <span className="flex items-center gap-1 text-emerald-500/80">
                                <TrendingUp className="h-2.5 w-2.5" /> Climbing fast
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-slate-500">
                                <Minus className="h-2.5 w-2.5" /> Stability lock
                            </span>
                        )}
                        <span className="text-white/5">•</span>
                        <span className="flex items-center gap-1">
                            <Flame className="h-2.5 w-2.5 text-orange-500/70" /> {user.streak_days || 0} streak
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    {user.exam_score?.toLocaleString() || '0'}
                </span>
            </div>

            <div className="flex justify-end">
                <div className={cn(
                    "px-2.5 py-0.5 rounded text-[8px] font-black tracking-widest border",
                    status.color
                )}>
                    {status.label}
                </div>
            </div>
        </div>
    );
}
