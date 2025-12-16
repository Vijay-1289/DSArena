#!/usr/bin/env node
// Simple playlist importer that calls YouTube Data API v3 and inserts entries into
// src/lib/videosData.ts between the IMPORTED_VIDEOS_START and IMPORTED_VIDEOS_END markers.
// Usage: YT_API_KEY=xxx node scripts/importPlaylist.js PLAYLIST_ID "Topic Name"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.YT_API_KEY;
if (!API_KEY) {
  console.error('Missing YT_API_KEY environment variable.');
  process.exit(1);
}

const [,, playlistId, topicName] = process.argv;
if (!playlistId || !topicName) {
  console.error('Usage: YT_API_KEY=xxx node scripts/importPlaylist.js PLAYLIST_ID "Topic Name"');
  process.exit(1);
}

const outPath = path.resolve(__dirname, '..', 'src', 'lib', 'videosData.ts');

async function fetchAllItems(playlistId) {
  const items = [];
  let pageToken = '';
  while (true) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}${pageToken ? '&pageToken=' + pageToken : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    items.push(...data.items);
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }
  return items;
}

function makeEntry(item) {
  const snippet = item.snippet || {};
  const videoId = snippet.resourceId?.videoId || (snippet.resourceId && snippet.resourceId.videoId) || null;
  if (!videoId) return null;
  return {
    id: `yt-${videoId}`,
    title: snippet.title || 'Untitled',
    youtubeId: videoId,
    topic: topicName,
    description: snippet.description || '',
  };
}

(async () => {
  try {
    console.log('Fetching playlist items...');
    const items = await fetchAllItems(playlistId);
    const entries = items.map(makeEntry).filter(Boolean);

    if (entries.length === 0) {
      console.log('No videos found in playlist.');
      process.exit(0);
    }

    const file = fs.readFileSync(outPath, 'utf-8');
    const startMarker = '// IMPORTED_VIDEOS_START';
    const endMarker = '// IMPORTED_VIDEOS_END';

    const startIdx = file.indexOf(startMarker);
    const endIdx = file.indexOf(endMarker);

    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
      console.error('Could not find import markers in videosData.ts');
      process.exit(1);
    }

    const before = file.slice(0, startIdx + startMarker.length);
    const after = file.slice(endIdx);

    // Remove any existing objects that match playlist video youtubeIds so we re-insert sanitized versions
    const playlistIds = new Set(entries.map(e => e.youtubeId));
    let cleanedFile = file;
    for (const vid of playlistIds) {
      // remove any object literal that contains youtubeId: 'vid'
      const objRegex = new RegExp(`\{[\s\S]*?youtubeId:\s*'${vid}'[\s\S]*?\},?`, 'g');
      cleanedFile = cleanedFile.replace(objRegex, '');
    }

    // Now rebuild the markers positions from the cleaned file
    const startIdxClean = cleanedFile.indexOf(startMarker);
    const endIdxClean = cleanedFile.indexOf(endMarker);
    if (startIdxClean === -1 || endIdxClean === -1 || endIdxClean < startIdxClean) {
      console.error('Could not find import markers in videosData.ts (after cleaning)');
      process.exit(1);
    }
    const beforeClean = cleanedFile.slice(0, startIdxClean + startMarker.length);
    const afterClean = cleanedFile.slice(endIdxClean);

    // Generate sanitized entries using JSON.stringify to escape newlines and quotes
    const generated = entries.map(e => `  {\n    id: ${JSON.stringify(e.id)},\n    topic: ${JSON.stringify(e.topic)},\n    title: ${JSON.stringify(e.title)},\n    youtubeId: ${JSON.stringify(e.youtubeId)},\n    description: ${JSON.stringify(e.description || '')},\n  },`).join('\n');

    // Insert generated entries between the markers in the cleaned file
    let intermediate = `${beforeClean}\n\n${generated}\n${afterClean}`;

    // Now regenerate the topics export based on all items in the file (existing + inserted)
    // Extract all topic strings by simple regex
    const topicRegex = /topic:\s*'([^']+)'/g;
    const topicsSet = new Set();
    let m;
    while ((m = topicRegex.exec(intermediate)) !== null) {
      topicsSet.add(m[1]);
    }
    const topicsArrayLiteral = `export const topics = [${Array.from(topicsSet).map(t => `'${t.replace(/'/g, "\\'")}'`).join(', ')}];`;

    // Replace the existing topics export (if present) with the regenerated literal
    const topicsRegex = /export const topics\s*=\s*[^;]+;/m;
    if (topicsRegex.test(intermediate)) {
      intermediate = intermediate.replace(topicsRegex, topicsArrayLiteral);
    } else {
      // If not found, append topics literal at end
      intermediate = intermediate + '\n\n' + topicsArrayLiteral;
    }

    fs.writeFileSync(outPath, intermediate, 'utf-8');

    console.log(`Inserted ${entries.length} videos into ${outPath}`);
    console.log('Topics list regenerated. You may want to run the app and verify the Videos -> Arrays topic now shows the imported items.');
  } catch (e) {
    console.error('Import failed:', e);
    process.exit(1);
  }
})();
