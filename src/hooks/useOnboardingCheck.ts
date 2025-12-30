import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface UserPreferences {
  id: string;
  user_id: string;
  preferred_language: string;
  coding_familiarity: number;
  recommended_level: string;
  onboarding_completed: boolean;
}

export function useOnboardingCheck() {
  const { user, loading: authLoading } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (authLoading) return;
      
      if (!user) {
        setNeedsOnboarding(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking onboarding:', error);
          setNeedsOnboarding(true);
        } else if (!data) {
          setNeedsOnboarding(true);
        } else {
          setPreferences(data as UserPreferences);
          setNeedsOnboarding(!data.onboarding_completed);
        }
      } catch (err) {
        console.error('Error in onboarding check:', err);
        setNeedsOnboarding(true);
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [user, authLoading]);

  return { needsOnboarding, preferences, loading, authLoading };
}
