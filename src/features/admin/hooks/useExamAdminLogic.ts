import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase as sbInstance } from '@/integrations/supabase/client';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = sbInstance as any;
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { getPythonCategories, pythonProblemsData } from '@/lib/pythonProblemsData';
import { rephraseQuestionWithGemini } from '@/lib/gemini';

export interface ExamSession {
    id: string;
    user_id: string;
    language: string;
    status: string;
    passed: boolean | null;
    hearts_remaining: number;
    time_spent_seconds: number | null;
    completed_at: string | null;
    created_at: string;
    total_violations: number;
    display_name?: string | null;
    username?: string | null;
    total_score?: number | null;
    exam_instance_id?: string | null;
}

export interface BlockedUser {
    id: string;
    user_id: string;
    is_eligible: boolean;
    blocked_at: string | null;
    display_name?: string | null;
    username?: string | null;
}

export type ExamResultType = 'passed' | 'failed' | 'in_progress' | 'disqualified' | 'revoked';

export const getExamResult = (session: ExamSession): ExamResultType => {
    if (session.status === 'disqualified') return 'disqualified';
    if (session.status === 'revoked') return 'revoked';
    if (session.passed === true) return 'passed';
    if (session.passed === false) return 'failed';

    if (session.status === 'in_progress' && session.hearts_remaining === 0) {
        return 'disqualified';
    }

    if (session.status === 'completed' && session.passed === null) {
        return 'failed';
    }

    return 'in_progress';
};

export function useExamAdminLogic() {
    const { user } = useAuth();
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = (supabase as any);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<ExamSession[]>([]);
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0, inProgress: 0, totalUsers: 0 });
    const [isApprovingAll, setIsApprovingAll] = useState(false);
    const [isDeletingEntries, setIsDeletingEntries] = useState(false);
    const [isRetakingAll, setIsRetakingAll] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<string>("All");
    const [topics, setTopics] = useState<string[]>([]);
    const [isSavingTopic, setIsSavingTopic] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [protocolQuery, setProtocolQuery] = useState("");
    const [linkedInstanceIds, setLinkedInstanceIds] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [genProgress, setGenProgress] = useState("");

    const loadData = useCallback(async () => {
        try {
            const { count: totalUsersCount } = await supabase
                .from('exam_sessions')
                .select('user_id', { count: 'exact', head: true });

            const { count: totalSessionsCount } = await supabase
                .from('exam_sessions')
                .select('*', { count: 'exact', head: true });

            const { data: sessionsData, error: sessionsError } = await supabase
                .from('exam_sessions')
                .select('*, exam_results(total_score)')
                .order('created_at', { ascending: false })
                .limit(200);

            if (sessionsError) throw sessionsError;

            if (sessionsData && sessionsData.length > 0) {
                const uniqueSessionsMap = new Map();
                sessionsData.forEach(session => {
                    if (!uniqueSessionsMap.has(session.user_id)) {
                        uniqueSessionsMap.set(session.user_id, session);
                    }
                });
                const uniqueSessions = Array.from(uniqueSessionsMap.values());
                const userIds = uniqueSessions.map(s => s.user_id);

                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, display_name, username')
                    .in('id', userIds);

                const profilesMap = new Map(profilesData?.map((p: any) => [p.id, p]) || []);

                const sessionsWithProfiles: ExamSession[] = uniqueSessions.map(session => {
                    const profile = profilesMap.get(session.user_id) as any;
                    return {
                        ...session,
                        display_name: profile?.display_name,
                        username: profile?.username,
                        total_score: session.exam_results?.[0]?.total_score ?? session.exam_results?.total_score,
                    };
                });

                setSessions(sessionsWithProfiles);

                const passedCount = sessionsWithProfiles.filter(s => getExamResult(s) === 'passed').length;
                const failedCount = sessionsWithProfiles.filter(s => {
                    const result = getExamResult(s);
                    return result === 'failed' || result === 'disqualified' || result === 'revoked';
                }).length;
                const inProgressCount = sessionsWithProfiles.filter(s => getExamResult(s) === 'in_progress').length;

                setStats({
                    total: totalSessionsCount || sessionsData.length,
                    passed: passedCount,
                    failed: failedCount,
                    inProgress: inProgressCount,
                    totalUsers: totalUsersCount || userIds.length
                });
            } else {
                setSessions([]);
                setStats({ total: 0, passed: 0, failed: 0, inProgress: 0, totalUsers: 0 });
            }

            const { data: blockedData, error: blockedError } = await supabase
                .from('exam_eligibility')
                .select('*')
                .eq('is_eligible', false);

            if (blockedError) throw blockedError;

            if (blockedData && blockedData.length > 0) {
                const blockedUserIds = [...new Set(blockedData.map(b => b.user_id))];
                const { data: blockedProfilesData } = await supabase
                    .from('profiles')
                    .select('id, display_name, username')
                    .in('id', blockedUserIds);

                const blockedProfilesMap = new Map(blockedProfilesData?.map((p: any) => [p.id, p]) || []);

                const blockedWithProfiles: BlockedUser[] = blockedData.map(blocked => {
                    const profile = blockedProfilesMap.get(blocked.user_id) as any;
                    return {
                        ...blocked,
                        display_name: profile?.display_name,
                        username: profile?.username,
                    };
                });

                setBlockedUsers(blockedWithProfiles);
            } else {
                setBlockedUsers([]);
            }
        } catch (err) {
            console.error('Error loading data:', err);
            toast.error('Failed to load data');
        }
    }, [sb]);

    useEffect(() => {
        const checkAdminAndLoad = async () => {
            if (!user) {
                navigate('/auth');
                return;
            }

            const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .eq('role', 'admin')
                .maybeSingle();

            if (!roleData) {
                toast.error('Clearance Insufficient. This zone is Restricted.');
                navigate('/dashboard');
                return;
            }

            setIsAdmin(true);
            await loadData();
            setLoading(false);
        };

        checkAdminAndLoad();
    }, [user, navigate, loadData, sb]);

    useEffect(() => {
        if (!isAdmin) return;
        setTopics(getPythonCategories());

        const loadConfig = async () => {
            try {
                const { data: configData } = await supabase
                    .from('app_config')
                    .select('value')
                    .eq('key', 'python_exam_topic')
                    .maybeSingle();

                if (configData) {
                    setSelectedTopic(configData.value);
                } else {
                    const localTopic = localStorage.getItem('python_exam_topic');
                    if (localTopic) setSelectedTopic(localTopic);
                }
            } catch (err) {
                console.error('Error loading config:', err);
            }
        };
        loadConfig();
    }, [isAdmin, sb]);

    useEffect(() => {
        if (!protocolQuery.trim()) {
            setLinkedInstanceIds([]);
            return;
        }

        const resolveProtocol = async () => {
            try {
                const { data: admin } = await (supabase as any)
                    .from('admins')
                    .select('id')
                    .eq('admin_code', protocolQuery.trim())
                    .maybeSingle();

                if (admin) {
                    const { data: instances } = await (supabase as any)
                        .from('exam_instances')
                        .select('id')
                        .eq('host_admin_id', (admin as any).id);

                    if (instances) {
                        setLinkedInstanceIds((instances as any[]).map((i: any) => i.id));
                    } else {
                        setLinkedInstanceIds(["NONE"]);
                    }
                } else {
                    setLinkedInstanceIds(["NONE"]);
                }
            } catch (err) {
                console.error("Protocol resolution failed:", err);
            }
        };

        const timer = setTimeout(resolveProtocol, 500);
        return () => clearTimeout(timer);
    }, [protocolQuery]);

    useEffect(() => {
        if (!isAdmin) return;

        const channel = supabase
            .channel('exam-admin-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_sessions' }, () => loadData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_eligibility' }, () => loadData())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAdmin, loadData]);

    const approveRetake = async (userId: string) => {
        try {
            const { error } = await sb.from('exam_eligibility').update({
                is_eligible: true,
                unblocked_by: user?.id,
                unblocked_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }).eq('user_id', userId);

            if (error) throw error;
            toast.success('User approved for retake');
            await loadData();
        } catch (err) {
            console.error('Error approving retake:', err);
            toast.error('Failed to approve retake');
        }
    };

    const handleGenerateVariants = async () => {
        if (!confirm('This will utilize the Gemini API to generate variants for ALL Python questions. Continue?')) return;

        setIsGenerating(true);
        setGenProgress("Starting generation...");

        try {
            const problems = pythonProblemsData;
            let count = 0;

            for (const problem of problems) {
                setGenProgress(`Processing ${problem.id} (${count + 1}/${problems.length})...`);
                const variants = await rephraseQuestionWithGemini(problem, 3);

                if (variants && variants.length > 0) {
                    const records = variants.map(v => ({
                        original_question_id: problem.id,
                        title: v.title,
                        description: v.description,
                        input_format: v.inputFormat,
                        output_format: v.outputFormat,
                        visible_test_cases: v.visibleTestCases
                    }));

                    const { error } = await sb.from('question_variants').insert(records);
                    if (error) console.error(`Failed to save variants for ${problem.id}:`, error);
                }
                count++;
                await new Promise(r => setTimeout(r, 1000));
            }
            setGenProgress(`Complete! Generated variants for ${count} questions.`);
            toast.success("Variant generation complete!");
        } catch (err) {
            console.error('Generation failed:', err);
            toast.error("Generation failed");
        } finally {
            setIsGenerating(false);
        }
    };

    const approveAllUsers = async () => {
        if (blockedUsers.length === 0) return;
        setIsApprovingAll(true);
        try {
            const { error } = await sb.from('exam_eligibility').update({
                is_eligible: true,
                unblocked_by: user?.id,
                unblocked_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }).eq('is_eligible', false);

            if (error) throw error;
            toast.success(`Approved ${blockedUsers.length} users for retake`);
            await loadData();
        } catch (err) {
            console.error('Error approving all users:', err);
            toast.error('Failed to approve all users');
        } finally {
            setIsApprovingAll(false);
        }
    };

    const retakeAll = async () => {
        const uniqueUserIds = [...new Set(sessions.map(s => s.user_id))];
        if (uniqueUserIds.length === 0) return;

        if (!confirm(`Allow ALL ${uniqueUserIds.length} users to retake the exam?`)) return;

        setIsRetakingAll(true);
        try {
            const eligibilityUpdates = uniqueUserIds.map(userId => ({
                user_id: userId,
                is_eligible: true,
                unblocked_by: user?.id,
                unblocked_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }));

            const { error } = await sb.from('exam_eligibility').upsert(eligibilityUpdates, { onConflict: 'user_id' });
            if (error) throw error;
            toast.success(`Enabled retake for ${uniqueUserIds.length} users`);
            await loadData();
        } catch (err) {
            console.error('Error enabling retake for all:', err);
            toast.error('Failed to enable retake for all users');
        } finally {
            setIsRetakingAll(false);
        }
    };

    const handleTopicChange = async (topic: string) => {
        setSelectedTopic(topic);
        setIsSavingTopic(true);
        try {
            const { data: existing } = await sb.from('app_config').select('key').eq('key', 'python_exam_topic').maybeSingle();
            if (existing) {
                await sb.from('app_config').update({ value: topic }).eq('key', 'python_exam_topic');
            } else {
                await sb.from('app_config').insert({ key: 'python_exam_topic', value: topic });
            }
            localStorage.setItem('python_exam_topic', topic);
            sessionStorage.setItem('python_exam_topic', topic);
            toast.success(`Exam topic set to: ${topic}`);
        } catch (err) {
            console.error('Error saving topic:', err);
            toast.error('Failed to save exam topic');
        } finally {
            setIsSavingTopic(false);
        }
    };

    const deleteCompletedEntries = async () => {
        const deletableSessions = sessions.filter(s => getExamResult(s) !== 'in_progress');
        if (deletableSessions.length === 0) return;
        if (!confirm(`Delete ${deletableSessions.length} completed exam entries?`)) return;

        setIsDeletingEntries(true);
        try {
            const sessionIds = deletableSessions.map(s => s.id);
            await sb.from('exam_eligibility').update({ last_exam_session_id: null }).in('last_exam_session_id', sessionIds);
            await sb.from('exam_answers').delete().in('exam_session_id', sessionIds);
            await sb.from('exam_results').delete().in('exam_session_id', sessionIds);
            await sb.from('exam_violations').delete().in('exam_session_id', sessionIds);
            const { error } = await sb.from('exam_sessions').delete().in('id', sessionIds);

            if (error) throw error;
            toast.success(`Deleted ${deletableSessions.length} exam entries`);
            await loadData();
        } catch (err) {
            console.error('Error deleting entries:', err);
            toast.error('Failed to delete entries');
        } finally {
            setIsDeletingEntries(false);
        }
    };

    const revokeExam = async (sessionId: string, userId: string) => {
        try {
            const { error: sessionError } = await sb.from('exam_sessions').update({
                status: 'disqualified',
                passed: false,
                completed_at: new Date().toISOString(),
            }).eq('id', sessionId);

            if (sessionError) throw sessionError;

            const { data: existingEligibility } = await sb.from('exam_eligibility').select('id').eq('user_id', userId).maybeSingle();
            if (existingEligibility) {
                await sb.from('exam_eligibility').update({
                    is_eligible: false,
                    last_exam_passed: false,
                    last_exam_session_id: sessionId,
                    blocked_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }).eq('user_id', userId);
            } else {
                await sb.from('exam_eligibility').insert({
                    user_id: userId,
                    is_eligible: false,
                    last_exam_passed: false,
                    last_exam_session_id: sessionId,
                    blocked_at: new Date().toISOString(),
                });
            }
            toast.success('Exam revoked successfully');
            await loadData();
        } catch (err) {
            console.error('Error revoking exam:', err);
            toast.error('Failed to revoke exam');
        }
    };

    const fixStaleSession = async (sessionId: string, userId: string) => {
        try {
            await sb.from('exam_sessions').update({
                status: 'disqualified',
                passed: false,
                completed_at: new Date().toISOString(),
            }).eq('id', sessionId);

            const { data: existingEligibility } = await sb.from('exam_eligibility').select('id').eq('user_id', userId).maybeSingle();
            if (existingEligibility) {
                await sb.from('exam_eligibility').update({
                    is_eligible: false,
                    last_exam_passed: false,
                    last_exam_session_id: sessionId,
                    blocked_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }).eq('user_id', userId);
            } else {
                await sb.from('exam_eligibility').insert({
                    user_id: userId,
                    is_eligible: false,
                    last_exam_passed: false,
                    last_exam_session_id: sessionId,
                    blocked_at: new Date().toISOString(),
                });
            }
            toast.success('Session marked as disqualified');
            await loadData();
        } catch (err) {
            console.error('Error fixing session:', err);
            toast.error('Failed to update session');
        }
    };

    const deleteUserSessions = async (userId: string) => {
        if (!confirm('Delete ALL exam history for this user?')) return;
        try {
            setIsDeletingEntries(true);
            await sb.from('exam_eligibility').update({ last_exam_session_id: null }).eq('user_id', userId);
            await sb.from('exam_eligibility').delete().eq('user_id', userId);

            const { data: userSessions } = await sb.from('exam_sessions').select('id').eq('user_id', userId);
            if (userSessions && userSessions.length > 0) {
                const sessionIds = userSessions.map(s => s.id);
                await sb.from('exam_answers').delete().in('exam_session_id', sessionIds);
                await sb.from('exam_results').delete().in('exam_session_id', sessionIds);
                await sb.from('exam_violations').delete().in('exam_session_id', sessionIds);
                const { error: sessionsError } = await sb.from('exam_sessions').delete().eq('user_id', userId);
                if (sessionsError) throw sessionsError;
            }
            setSessions(prev => prev.filter(s => s.user_id !== userId));
            toast.success('User exam history deleted successfully');
            await loadData();
        } catch (err) {
            console.error('Error deleting user history:', err);
            toast.error('Failed to delete user history');
        } finally {
            setIsDeletingEntries(false);
        }
    };

    const deleteEligibilityRecord = async (userId: string) => {
        if (!confirm('Delete this eligibility record?')) return;
        try {
            const { error } = await sb.from('exam_eligibility').delete().eq('user_id', userId);
            if (error) throw error;
            toast.success('Eligibility record deleted');
            await loadData();
        } catch (err) {
            console.error('Error deleting record:', err);
            toast.error('Failed to delete record');
        }
    };

    return {
        isAdmin, loading, sessions, blockedUsers, stats, isApprovingAll, isDeletingEntries, isRetakingAll,
        selectedTopic, topics, isSavingTopic, searchQuery, setSearchQuery, protocolQuery, setProtocolQuery,
        linkedInstanceIds, isGenerating, genProgress, loadData, approveRetake, handleGenerateVariants,
        approveAllUsers, retakeAll, handleTopicChange, deleteCompletedEntries, revokeExam, approveRetakeFromSession: approveRetake,
        fixStaleSession, deleteUserSessions, deleteEligibilityRecord
    };
}
