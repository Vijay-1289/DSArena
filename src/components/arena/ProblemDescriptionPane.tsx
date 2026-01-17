import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ProblemData } from '@/lib/problemsData';
import { Home, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProblemDescriptionPaneProps {
    problem: ProblemData;
    activeTab: 'description' | 'submissions';
    onHome?: () => void;
}

const difficultyConfig = {
    easy: { label: 'Easy', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    medium: { label: 'Medium', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    hard: { label: 'Hard', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export const ProblemDescriptionPane = ({ problem, activeTab, onHome }: ProblemDescriptionPaneProps) => {
    const config = difficultyConfig[problem.difficulty];

    return (
        <div className="flex h-full flex-col bg-[#030712] border-r border-slate-800/50">
            {/* Header Tabs */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/50">
                <div className="flex items-center gap-6">
                    <button
                        className={cn(
                            "text-xs font-bold tracking-widest transition-colors",
                            activeTab === 'description' ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        DESCRIPTION
                    </button>
                    <button
                        className={cn(
                            "text-xs font-bold tracking-widest transition-colors",
                            activeTab === 'submissions' ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        SUBMISSIONS
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {onHome && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onHome}
                            className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                            title="Home"
                        >
                            <Home className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                    {/* Metadata Tags */}
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", config.className)}>
                            {config.label}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-400 border-slate-700/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            {problem.category}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {problem.title}
                    </h1>

                    {/* Description Content */}
                    <div className="prose prose-invert prose-sm max-w-none">
                        <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                            {problem.description}
                        </p>
                    </div>

                    {/* Examples */}
                    <div className="space-y-6">
                        {problem.visibleTestCases.slice(0, 3).map((tc, index) => (
                            <div key={index} className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Example {index + 1}</h3>
                                <div className="bg-[#0B1121] rounded-lg p-4 font-mono text-sm border border-slate-800/50 space-y-2">
                                    <div className="flex gap-2">
                                        <span className="text-cyan-500/70 font-bold shrink-0">Input:</span>
                                        <span className="text-slate-300 break-all">{tc.input}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-cyan-500/70 font-bold shrink-0">Output:</span>
                                        <span className="text-slate-300 break-all">{tc.expectedOutput}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Constraints */}
                    {problem.constraints && (
                        <div className="space-y-3 pt-4">
                            <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Constraints</h3>
                            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 ml-1">
                                {problem.constraints.split('\n').map((c, i) => (
                                    <li key={i}>{c}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
