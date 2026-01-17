import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TestResult {
    passed: boolean;
    actual_output?: string;
    error?: string;
    runtime_ms?: number;
}

export interface ExecutionOptions {
    code: string;
    language: string;
    testCases: Array<{ input: string, expectedOutput: string }>;
    onSuccess?: (results: TestResult[], avgRuntime: number, xpGained?: number) => void;
    onError?: (error: string) => void;
    currentLives?: number;
    maxLives?: number;
    userId?: string;
    problemId?: string;
}

export function useProblemExecution() {
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [results, setResults] = useState<TestResult[] | null>(null);
    const [consoleOutput, setConsoleOutput] = useState('');
    const [lastError, setLastError] = useState<string | null>(null);

    const execute = useCallback(async (options: ExecutionOptions, isSubmission = false) => {
        const { code, language, testCases, onSuccess, onError, problemId } = options;

        if (isSubmission) setSubmitting(true);
        else setRunning(true);

        // Reset feedback state immediately
        setResults(null);
        setConsoleOutput('');
        setLastError(null);

        try {
            const { data, error } = await supabase.functions.invoke('execute-code', {
                body: { code, testCases, language },
            });

            if (error || data.error) {
                throw new Error(error?.message || data.error);
            }

            const executionResults = data.results as TestResult[];
            setResults(executionResults);
            setConsoleOutput(data.consoleOutput || '');

            const errorResult = executionResults.find(r => r.error);
            if (errorResult) {
                setLastError(errorResult.error || 'Execution error');
            }

            const totalCount = executionResults.length;
            const avgRuntime = executionResults.reduce((sum, r) => sum + (r.runtime_ms || 0), 0) / (totalCount || 1);

            const passedCount = executionResults.filter(r => r.passed).length;
            const isPerfect = isSubmission && passedCount === totalCount && options.currentLives === options.maxLives;
            let xpGained = 0;

            if (isSubmission && passedCount === totalCount && options.userId) {
                try {
                    // 1. One-Time Reward Verification (Anti-Farming Logic)
                    let hasSolvedBefore = false;
                    if (problemId) {
                        try {
                            // Check both problem_id and problem_slug for maximum robustness
                            const { data: existingSolve, error: checkError } = await supabase
                                .from('user_solved')
                                .select('id')
                                .eq('user_id', options.userId)
                                .or(`problem_id.eq.${problemId},problem_slug.eq.${problemId}`)
                                .maybeSingle();

                            if (checkError) throw checkError;
                            if (existingSolve) {
                                hasSolvedBefore = true;
                            }
                        } catch (err) {
                            console.error('Anti-farming check failed:', err);
                            // Safety first: if check fails, assume solved to prevent accidental XP gain
                            hasSolvedBefore = true;
                        }
                    }

                    if (!hasSolvedBefore) {
                        xpGained = isPerfect ? 5 : 2;
                        // Update XP in profiles
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('xp')
                            .eq('id', options.userId)
                            .single();

                        const newXp = ((profile as any)?.xp || 0) + xpGained;

                        await supabase
                            .from('profiles')
                            .update({ xp: newXp } as any)
                            .eq('id', options.userId);

                        toast.success(`Correct! +${xpGained} XP ${isPerfect ? '(Perfect Run)' : ''}`);
                    } else {
                        // Success toast for recurring solves
                        toast.success("Solution Verified! (Practice Mode)");
                    }
                } catch (xpErr) {
                    console.error('Failed to update XP:', xpErr);
                }
            }

            if (onSuccess) {
                onSuccess(executionResults, Math.round(avgRuntime), xpGained);
            }

            return {
                results: executionResults,
                avgRuntime: Math.round(avgRuntime),
                success: true
            };
        } catch (err: any) {
            const message = err.message || 'An error occurred during execution';
            setLastError(message);
            setConsoleOutput(message);
            if (onError) onError(message);
            else toast.error(message);
            return { success: false, error: message };
        } finally {
            setRunning(false);
            setSubmitting(false);
        }
    }, []);

    return {
        running,
        submitting,
        results,
        consoleOutput,
        lastError,
        execute,
        setResults,
        setLastError
    };
}
