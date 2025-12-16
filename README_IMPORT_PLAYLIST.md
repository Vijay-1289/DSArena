Importing a YouTube playlist into DSArena

This project includes a helper script to import videos from a YouTube playlist into `src/lib/videosData.ts`.

Prerequisites
- A YouTube Data API v3 key (set as environment variable `YT_API_KEY`).

Usage
1. Run the importer:

   YT_API_KEY=YOUR_KEY npm run import:playlist PLAYLIST_ID "Topic Name"

   Example:
   YT_API_KEY=xxx npm run import:playlist PLqM7alHXFySEQDk2MDfbwEdjd2svVJH9p "Arrays"

2. The script will insert the found videos into `src/lib/videosData.ts` between the markers `IMPORTED_VIDEOS_START` and `IMPORTED_VIDEOS_END`.
3. Start the app and visit `/videos` → click the `Arrays` card to see the imported videos.

Notes
- The script edits `videosData.ts` directly — inspect the changes and commit as needed.
- If you want to import multiple playlists into the same topic, run the script multiple times.
- The script is simple and does not deduplicate existing entries; be mindful when running multiple times.
