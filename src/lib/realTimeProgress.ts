import { supabase } from '@/integrations/supabase/client';

// Provide a simple wrapper to subscribe to real-time updates for user progress
export function subscribeToUserProgress(userId: string, cb: (payload: any) => void) {
  // Subscribe to insert/update on user_solved for this user
  const channel = supabase
    .channel(`user-progress-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_solved', filter: `user_id=eq.${userId}` }, (payload) => {
      cb(payload);
    })
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}
