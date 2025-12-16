Videos feature

What was added:

- `src/lib/videosData.ts` — seed list of curated YouTube videos grouped by DSA topics.
- `src/components/video/VideoPlayer.tsx` — YouTube embed player component.
- `src/components/video/VideosList.tsx` — list view to pick videos.
- `src/pages/Videos.tsx` — main Videos page with topic filtering and player.
- `Navbar` — added link to `/videos` in desktop & mobile navs.

Notes:
- No database changes are required for this feature (it currently uses a local, in-memory list). If you want to add videos to the DB for editing/curation, add a `videos` table and wire up API endpoints.
- Videos are embedded using the official YouTube embed URL. Be mindful of YouTube terms and privacy if you intend to collect analytics.
