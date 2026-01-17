import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePracticeLogic() {
    const [adminCode, setAdminCode] = useState('');
    const [injectedQuestions, setInjectedQuestions] = useState<any[]>([]);
    const [injectedTitle, setInjectedTitle] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const fetchQuestions = useCallback(async (codeToFetch: string) => {
        if (!codeToFetch.trim()) return;

        setIsValidating(true);
        try {
            // 1. Determine if it's an Exam code or Practice code
            let targetAdminCode = codeToFetch;
            let isPracticeCode = false;

            if (codeToFetch.startsWith('PRC-')) {
                targetAdminCode = codeToFetch.replace('PRC-', 'DSA-');
                isPracticeCode = true;
            }

            // 2. Find admin
            const { data: adminData, error: adminError } = await supabase
                .from('admins' as any)
                .select('id, admin_code')
                .eq('admin_code', targetAdminCode)
                .maybeSingle() as any;

            if (adminError || !adminData) {
                toast.error('Invalid Protocol', {
                    description: 'No active uplink found for this code.',
                    className: 'bg-[#0B1121] border-red-500/50 text-red-400 font-mono text-[10px] uppercase tracking-widest'
                });
                setIsValidating(false);
                return;
            }

            // 3. Find the most recent instance for this admin
            const { data: instance, error: instanceError } = await supabase
                .from('exam_instances' as any)
                .select('*')
                .eq('host_admin_id', adminData.id)
                .order('created_at', { ascending: false })
                .limit(20) as any;

            if (instanceError || !instance || instance.length === 0) {
                toast.error('No Active Sessions', {
                    description: 'This host has no initialized instances.',
                    className: 'bg-[#0B1121] border-red-500/50 text-red-400 font-mono text-[10px] uppercase tracking-widest'
                });
                setIsValidating(false);
                return;
            }

            // Filter for practice if needed
            const filteredInstances = instance.filter((i: any) =>
                isPracticeCode ? i.topic.startsWith('[PRACTICE]') : !i.topic.startsWith('[PRACTICE]')
            );

            if (filteredInstances.length === 0) {
                toast.error('Protocol Mismatch', {
                    description: isPracticeCode ? 'No practice sessions found for this host.' : 'No exam sessions found for this host.',
                    className: 'bg-[#0B1121] border-amber-500/50 text-amber-400 font-mono text-[10px] uppercase tracking-widest'
                });
                setIsValidating(false);
                return;
            }

            const topInstance = filteredInstances[0];

            // 4. Fetch questions
            const { data: questions, error: questionsError } = await supabase
                .from('exam_questions' as any)
                .select('*')
                .eq('exam_instance_id', topInstance.id) as any;

            if (questionsError || !questions || questions.length === 0) {
                toast.error('Empty Repository', {
                    description: 'The initialized session contains no questions.',
                    className: 'bg-[#0B1121] border-amber-500/50 text-amber-400 font-mono text-[10px] uppercase tracking-widest'
                });
                setIsValidating(false);
                return;
            }

            // Store injected questions
            setInjectedQuestions(questions.map((q: any) => ({
                id: q.id,
                title: q.title,
                description: q.description,
                difficulty: 'medium', // Default for injected
                slug: `custom-${q.id}`, // Placeholder slug
                visibleTestCases: q.test_cases?.filter((tc: any) => !tc.hidden) || []
            })));
            setInjectedTitle(topInstance.topic.replace('[PRACTICE] ', ''));

            // Save to localStorage
            localStorage.setItem('active_practice_code', codeToFetch);

            toast.success('Protocol Injected', {
                description: `Successfully loaded ${questions.length} tactical units from ${topInstance.topic.replace('[PRACTICE] ', '')}.`,
                className: 'bg-[#0B1121] border-emerald-500/50 text-emerald-400 font-mono text-[10px] uppercase tracking-widest'
            });
        } catch (err) {
            console.error('Validation failure:', err);
            toast.error('Uplink Failed', {
                description: 'Critical system synchronization error.',
                className: 'bg-[#0B1121] border-red-500/50 text-red-400 font-mono text-[10px] uppercase tracking-widest'
            });
        } finally {
            setIsValidating(false);
        }
    }, []);

    const clearSession = useCallback(() => {
        localStorage.removeItem('active_practice_code');
        setAdminCode('');
        setInjectedQuestions([]);
        setInjectedTitle(null);
        toast.info('Session Cleared', {
            description: 'Practice protocols have been reset.',
            className: 'bg-[#0B1121] border-blue-500/50 text-blue-400 font-mono text-[10px] uppercase tracking-widest'
        });
    }, []);

    const handleAdminSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        await fetchQuestions(adminCode);
    };

    useEffect(() => {
        const savedCode = localStorage.getItem('active_practice_code');
        if (savedCode) {
            setAdminCode(savedCode);
            fetchQuestions(savedCode);
        }
    }, [fetchQuestions]);

    return {
        adminCode,
        setAdminCode,
        injectedQuestions,
        injectedTitle,
        isValidating,
        handleAdminSubmit,
        clearSession
    };
}
