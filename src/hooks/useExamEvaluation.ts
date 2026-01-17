import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { calculateWeightedScore } from '@/lib/examUtils';
import { EXAM_CONFIG } from '@/lib/constants';

interface EvaluationOptions {
    sessionId: string | null;
    userId?: string;
    questionsCount: number;
    timeSpent: number;
    wasDisqualified: boolean;
    heartsRemaining: number;
    onSuccess: () => void;
    exitFullscreen: () => void;
}

export function useExamEvaluation() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitExam = useCallback(async (options: EvaluationOptions, auto = false) => {
        const {
            sessionId,
            userId,
            questionsCount,
            timeSpent,
            wasDisqualified,
            heartsRemaining,
            onSuccess,
            exitFullscreen
        } = options;

        if (isSubmitting || !sessionId || !userId) return;
        setIsSubmitting(true);

        try {
            // 1. Fetch all answers
            const { data: allAnswers, error: answersError } = await supabase
                .from('exam_answers')
                .select('*')
                .eq('exam_session_id', sessionId);

            if (answersError || !allAnswers) throw new Error('Failed to fetch answers');

            // 2. Fetch instance weights if applicable
            const { data: qData } = await supabase
                .from('exam_sessions')
                .select('exam_instance_id')
                .eq('id', sessionId)
                .single() as any;

            let customWeights: number[] | undefined = undefined;

            if (qData?.exam_instance_id) {
                // We use type casting for 'exam_instances' as it might not be in the generated types yet
                const { data: inst } = await supabase
                    .from('exam_instances' as any)
                    .select('id')
                    .eq('id', qData.exam_instance_id)
                    .single();

                if (inst) {
                    // All host questions share equal weight
                    customWeights = new Array(questionsCount).fill(1 / questionsCount);
                }
            }

            // 3. Calculate score
            const { score: finalScore, maxScore } = calculateWeightedScore(
                allAnswers.map(ans => ({
                    testsTotal: ans.tests_total || 0,
                    testsPassed: ans.tests_passed || 0,
                    questionIndex: ans.question_index ?? -1
                })),
                customWeights
            );

            const questionsCorrect = allAnswers.filter(ans => ans.is_correct).length;

            // 4. Save results record
            await supabase.from('exam_results').insert({
                exam_session_id: sessionId,
                user_id: userId,
                total_score: finalScore,
                max_score: maxScore,
                questions_correct: questionsCorrect,
                questions_total: questionsCount,
                total_compilation_errors: allAnswers.reduce((acc, curr) => acc + (curr.compilation_errors || 0), 0),
                total_runtime_errors: allAnswers.reduce((acc, curr) => acc + (curr.runtime_errors || 0), 0),
                avg_time_per_question_seconds: Math.floor(timeSpent / (questionsCount || 1)),
            });

            // 5. Update session status
            const passed = finalScore >= EXAM_CONFIG.MIN_PASS_SCORE;
            await supabase.from('exam_sessions').update({
                status: (wasDisqualified || heartsRemaining <= 0) ? 'disqualified' : 'completed',
                completed_at: new Date().toISOString(),
                time_spent_seconds: timeSpent,
                auto_submitted: auto,
                passed: passed,
            }).eq('id', sessionId);

            // 6. Hard block eligibility if failed
            if (!passed) {
                await supabase.from('exam_eligibility').upsert({
                    user_id: userId,
                    is_eligible: false,
                    last_exam_passed: false,
                    last_exam_session_id: sessionId,
                    blocked_at: new Date().toISOString(),
                }, { onConflict: 'user_id' });
            }

            // 7. Cleanup UI state
            exitFullscreen();
            onSuccess();
        } catch (err) {
            console.error('Evaluation Error:', err);
            toast.error('Failed to process exam results. Please contact support if this persists.');
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting]);

    return { isSubmitting, submitExam };
}
