Unreleased

- Add Videos page (YouTube embeds) for DSA topics (Arrays, Linked Lists, Graphs, DP, etc.) — `src/pages/Videos.tsx` + components.
- Add real-time user progress tracking using Supabase Realtime channels: `src/lib/realTimeProgress.ts` and `src/hooks/useUserProgress.tsx`.
- Sync local progress with Supabase on sign-in (offline-first): `src/lib/auth.tsx` now calls `syncProgressToSupabase`.
- Updated Learning Tracks, Dashboard, Problems, and Track pages to use live progress updates.
- Added docs and testing checklist for real-time features and videos.
