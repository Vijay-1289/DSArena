import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Terminal, Info } from 'lucide-react';

interface TestResult {
    passed: boolean;
    actual_output?: string;
    error?: string;
    runtime_ms?: number;
}

interface ExecutionStreamPaneProps {
    results: TestResult[] | null;
    consoleOutput: string;
    status: 'idle' | 'running' | 'success' | 'error';
    testCases: { input: string; expected_output: string }[];
}

export const ExecutionStreamPane = ({
    results,
    consoleOutput,
    status,
    testCases
}: ExecutionStreamPaneProps) => {
    const isRunning = status === 'running';
    const hasResults = results && results.length > 0;

    // Calculate aggregate stats
    const passedCount = results?.filter(r => r.passed).length || 0;
    const totalCount = results?.length || 0;
    const allPassed = passedCount === totalCount && totalCount > 0;
    const avgRuntime = results ? Math.round(results.reduce((acc, r) => acc + (r.runtime_ms || 0), 0) / results.length) : 0;

    return (
        <div className="flex h-full flex-col bg-[#030712] border-l border-slate-800/50">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/50">
                <h2 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5" />
                    CONSOLE OUTPUT
                </h2>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">
                    {isRunning && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                            <p className="text-xs font-bold tracking-widest text-cyan-500/50 animate-pulse uppercase">Executing Neural Protocol...</p>
                        </div>
                    )}

                    {!isRunning && !hasResults && !consoleOutput && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
                            <Terminal className="h-12 w-12 text-slate-600" />
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Awaiting Execution</p>
                        </div>
                    )}

                    {!isRunning && hasResults && (
                        <div className="space-y-6">
                            {/* Result Badge Card */}
                            <div className={cn(
                                "p-4 rounded-xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500",
                                allPassed
                                    ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                                    : "bg-rose-500/5 border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.05)]"
                            )}>
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    allPassed ? "bg-emerald-500/10" : "bg-rose-500/10"
                                )}>
                                    {allPassed
                                        ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        : <XCircle className="h-5 w-5 text-rose-500" />
                                    }
                                </div>
                                <div>
                                    <h3 className={cn(
                                        "font-bold text-lg tracking-tight",
                                        allPassed ? "text-emerald-400" : "text-rose-400"
                                    )}>
                                        {allPassed ? "Accepted" : "Wrong Answer"}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                                        Runtime: {avgRuntime}ms | Memory: 16.4MB
                                    </p>
                                </div>
                            </div>

                            {/* Individual Case Details (First Failed or Last Run) */}
                            <div className="space-y-4">
                                {results.map((res, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-1 h-1 rounded-full", res.passed ? "bg-emerald-500" : "bg-rose-500")} />
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Case {idx + 1}</span>
                                        </div>

                                        <div className="space-y-4 pl-4">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Input</p>
                                                <div className="bg-black/40 border-l-2 border-slate-800 p-2 font-mono text-xs text-slate-300">
                                                    {testCases[idx]?.input || "N/A"}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Output</p>
                                                <div className={cn(
                                                    "bg-black/40 border-l-2 p-2 font-mono text-xs",
                                                    res.passed ? "border-emerald-500/50 text-emerald-400/80" : "border-rose-500/50 text-rose-400/80"
                                                )}>
                                                    {res.actual_output || "No output"}
                                                </div>
                                            </div>

                                            {!res.passed && (
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Expected</p>
                                                    <div className="bg-black/40 border-l-2 border-slate-700 p-2 font-mono text-xs text-slate-400">
                                                        {testCases[idx]?.expected_output || "N/A"}
                                                    </div>
                                                </div>
                                            )}

                                            {res.error && (
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold text-rose-600/70 uppercase tracking-tight">Last Error</p>
                                                    <div className="bg-rose-500/5 border border-rose-500/10 p-3 font-mono text-[11px] text-rose-400/80 break-all leading-relaxed">
                                                        {res.error}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isRunning && consoleOutput && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Standard Output</h3>
                            <div className="bg-black/40 border border-slate-800 p-4 font-mono text-xs text-slate-300 rounded-lg leading-relaxed whitespace-pre-wrap">
                                {consoleOutput}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
