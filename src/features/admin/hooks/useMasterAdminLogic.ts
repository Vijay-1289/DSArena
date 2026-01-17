import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase as sbInstance } from '@/integrations/supabase/client';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = sbInstance as any;
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export interface AdminMember {
    id: string;
    email: string;
    admin_code: string;
    is_root: boolean;
    created_at: string;
    is_active: boolean;
}

export function useMasterAdminLogic() {
    const { user } = useAuth();
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState<AdminMember[]>([]);
    const [isInviting, setIsInviting] = useState(false);

    const fetchAdmins = useCallback(async () => {
        const { data, error } = await sb.from('admins')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching admins:', error);
            toast.error('System Jammed: Admin directory missing. Retry to re-establish uplink.');
        } else {
            setAdmins(data as unknown as AdminMember[] || []);
        }
    }, [sb]);

    useEffect(() => {
        const checkAuth = async () => {
            if (!user) {
                navigate('/auth');
                return;
            }

            const { data: adminData } = await sb
                .from('admins')
                .select('is_root')
                .eq('id', user.id)
                .maybeSingle();

            if (!adminData || !adminData.is_root) {
                toast.error('Clearance Insufficient. This zone is Restricted.');
                navigate('/dashboard');
                return;
            }

            await fetchAdmins();
            setLoading(false);
        };

        checkAuth();
    }, [user, navigate, fetchAdmins, sb]);

    const handleInviteAdmin = async (email: string) => {
        if (!email) return;
        setIsInviting(true);

        try {
            const newCode = 'DSA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const { error } = await sb.from('admins').insert({
                id: crypto.randomUUID(),
                email: email,
                admin_code: newCode,
                is_root: false,
                is_active: true
            });

            if (error) throw error;

            toast.success(`Invitation Protocol initialized for ${email}. Code: ${newCode}`);
            await fetchAdmins();
            return true;
        } catch (err) {
            console.error('Invite failed:', err);
            toast.error('Invitation sequence failed. Check Neural Network uplink.');
            return false;
        } finally {
            setIsInviting(false);
        }
    };

    const toggleAdminStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('admins' as any)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .update({ is_active: !currentStatus } as any)
                .eq('id', id);

            if (error) throw error;
            toast.success(`Auth Signal ${!currentStatus ? 're-established' : 'severed'}.`);
            await fetchAdmins();
        } catch (err) {
            toast.error('Status modification failed.');
        }
    };

    return {
        loading, admins, isInviting, handleInviteAdmin, toggleAdminStatus, refreshAdmins: fetchAdmins
    };
}
