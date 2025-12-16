Real-time progress subscription

This project listens for real-time changes to the `user_solved` table to keep user progress in sync across clients.

What we added:

- `src/lib/realTimeProgress.ts` — helper to subscribe to Postgres changes for a specific user using Supabase Realtime channels (Postgres WAL replication).
- `src/hooks/useUserProgress.tsx` — React hook that fetches solved problems and subscribes to updates for live changes.
- `src/lib/progressStorage.ts` — now writes a local cache when fetching from DB so offline-first still works.

Supabase requirements / notes:

- Ensure replication is enabled and your Supabase project allows Realtime on the `user_solved` table.
- The subscription uses the `postgres_changes` event with filter `user_id=eq.<userId>`; ensure RLS policies allow connecting to realtime for authenticated users.

Database table (already present in project schema):

user_solved columns referenced:
- id (uuid)
- user_id (uuid)
- problem_id (text/uuid)
- attempts
- best_runtime_ms
- first_solved_at
- last_attempt_at

If you need to add new fields, update `src/integrations/supabase/types.ts` accordingly and re-generate types.

Security:
- Consider adding an RLS policy that only allows users to listen for their own `user_solved` rows, or use a server-signed service role to control subscriptions.

Testing:
- To test realtime locally, open two browser sessions, solve a problem in one, and verify the numbers update in the other session's UI (Learning Tracks / Dashboard).
