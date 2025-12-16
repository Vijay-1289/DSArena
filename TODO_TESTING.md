Manual testing checklist for Videos & Real-time progress

Videos page
- [ ] Go to /videos (sign in required) and verify page loads.
- [ ] Select different topics from the dropdown and confirm the list filters correctly.
- [ ] Click Play on a video and ensure it loads in the embedded player.
- [ ] Verify responsive layout on mobile and desktop.

Real-time progress
- [ ] Open two browser sessions with the same user (or one logged in, one incognito).
- [ ] In session A, solve a problem by submitting code that passes all tests.
- [ ] In session B, verify that Learning Tracks / Dashboard / Problems update without refresh (count increase, badges).
- [ ] Test offline-first behavior: solve while offline (local storage), then reconnect and verify syncing to Supabase via `syncProgressToSupabase` (manual trigger via UI not present; test by calling the function in console or relying on automatic calls).
- [ ] Confirm RLS policies: ensure users cannot subscribe to other users' `user_solved` rows.

If any failures occur, capture console logs and network traces and file an issue with steps to reproduce.
