import { useEffect, useState, useCallback } from 'react';
import { subscribeToUserProgress } from '@/lib/realTimeProgress';
import { fetchSolvedProblems } from '@/lib/progressStorage';

export function useUserProgress(userId?: string) {
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!userId) return;
    const current = await fetchSolvedProblems(userId);
    setSolvedIds(current);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    let unsub: (() => void) | undefined;

    refresh();

    unsub = subscribeToUserProgress(userId, (payload) => {
      // payload.record should have problem_id
      try {
        const record = payload.new || payload.record || payload;
        if (record?.problem_id) {
          setSolvedIds((prev) => new Set(prev).add(record.problem_id));
        }
      } catch (e) {
        console.error('Error handling progress payload', e);
        refresh();
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, [userId, refresh]);

  return { solvedIds, refresh };
}
