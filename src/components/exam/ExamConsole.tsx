import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertCircle, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestResult {
    passed: boolean;
    actual_output?: string;
    expected_output?: string;
    error?: string;
    runtime_ms?: number;
}

interface ExamConsoleProps {
    results: TestResult[] | null;
    consoleOutput: string;
    isCompiling: boolean;
}

export function ExamConsole({ results, consoleOutput, isCompiling }: ExamConsoleProps) {
    const hasResults = results && results.length > 0;

    return (
        <div className="flex flex-col h-full bg-[#05050A] border border-white/10 rounded-xl overflow-hidden font-mono">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10 bg-white/5">
                <Terminal className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Console Output</span>
            </div>

            <ScrollArea className="flex-1 p-6 text-[11px] leading-relaxed custom-scrollbar">
                <div className="space-y-4">
                    {/* Compilation Status */}
                    {(isCompiling || consoleOutput || hasResults) && (
                        <div className="space-y-1">
                            {isCompiling ? (
                                <p className="text-gray-500 animate-pulse">Compiling Code...</p>
                            ) : (
                                <p className="text-green-400 flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Compilation Successful
                                </p>
                            )}
                        </div>
                    )}

                    {/* Console Text */}
                    {consoleOutput && (
                        <div className="bg-black/40 rounded border border-white/5 p-3">
                            <p className="text-gray-500 uppercase text-[9px] tracking-widest mb-2 font-bold">Standard Output</p>
                            <pre className="text-gray-300 whitespace-pre-wrap break-all">
                                {consoleOutput}
                            </pre>
                        </div>
                    )}

                    {/* Test Cases */}
                    {hasResults && (
                        <div className="bg-black/60 p-4 rounded border border-white/5 space-y-4 shadow-inner">
                            {results.map((result, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-500 uppercase text-[9px] tracking-widest font-bold">Test Case {index + 1}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "font-bold uppercase text-[10px]",
                                                result.passed ? "text-green-400" : "text-red-500"
                                            )}>
                                                {result.passed ? 'Passed' : 'Failed'}
                                            </span>
                                            {result.runtime_ms !== undefined && (
                                                <span className="text-gray-600 text-[9px]">{result.runtime_ms}ms</span>
                                            )}
                                        </div>
                                    </div>

                                    {!result.passed && result.error && (
                                        <div className="mt-1 p-2 bg-red-500/5 rounded border border-red-500/10">
                                            <pre className="text-red-400/80 text-[10px] whitespace-pre-wrap">{result.error}</pre>
                                        </div>
                                    )}

                                    {index < results.length - 1 && <div className="h-px bg-white/5 mt-2"></div>}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Memory Usage (Mock) */}
                    <div className="pt-4 mt-auto">
                        <p className="text-gray-500 uppercase text-[9px] tracking-widest mb-2 font-bold">Memory Usage</p>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="bg-red-600 h-full transition-all duration-1000"
                                style={{ width: hasResults ? '34%' : '12%' }}
                            ></div>
                        </div>
                        <p className="text-[9px] text-gray-600 mt-1 uppercase font-bold">
                            {hasResults ? '42.4 MB' : '12.8 MB'} / 128 MB
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
