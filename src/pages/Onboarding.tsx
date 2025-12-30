import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useOnboardingCheck } from '@/hooks/useOnboardingCheck';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { Loader2 } from 'lucide-react';

export default function Onboarding() {
  const { user, loading: authLoading } = useAuth();
  const { needsOnboarding, loading } = useOnboardingCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (!loading && !needsOnboarding) {
      navigate('/dashboard');
    }
  }, [user, authLoading, loading, needsOnboarding, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!needsOnboarding) {
    return null;
  }

  return <OnboardingFlow />;
}
