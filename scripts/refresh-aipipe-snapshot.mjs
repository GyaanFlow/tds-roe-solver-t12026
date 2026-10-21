// Refreshes solvers/T32026/p1/aipipe-usage-snapshot.js from the public AI Pipe usage feed.
//   node scripts/refresh-aipipe-snapshot.mjs
// The feed keeps only about seven days, and the live feed sends no CORS headers (a browser page cannot fetch
// it), so the P1 prediction tool ships this dated copy as its fallback. Refreshing rolls the window forward;
// days that have already left the feed stay only in git history, so refresh before they drop out.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FEED_URL = 'https://stats.aipipe.org/usage.json';
const target = path.join(root, 'solvers/T32026/p1/aipipe-usage-snapshot.js');

const response = await fetch(FEED_URL, { headers: { 'User-Agent': 'tds-portal-solver snapshot refresh', Accept: 'application/json' } });
if (!response.ok) throw new Error(`Feed answered HTTP ${response.status}`);
const feed = await response.json();
if (!Array.isArray(feed?.days) || feed.days.length === 0) throw new Error('Feed has no days array; refusing to overwrite the snapshot.');

const body = `// Dated copy of ${FEED_URL} (the public AI Pipe usage feed the P1 prediction question uses).
// The live feed sends no CORS headers, so the browser cannot fetch it; this snapshot is the fallback and the tool also
// accepts a pasted copy. Refresh with: node scripts/refresh-aipipe-snapshot.mjs
export const snapshotFetchedAt = '${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}';
export const snapshot = ${JSON.stringify(feed, null, 2)};
`;
fs.writeFileSync(target, body);
const completed = feed.days.filter((day) => day.complete && day.available).length;
console.log(`Snapshot written: ${feed.days.length} days (${completed} complete), published_at ${feed.published_at}`);
