// Backup / offline method for Q5 — Secret Handshake: Prove You Collaborated.
//
// Use this ONLY if the interactive in-browser HMAC toolkit on the ROE Q5 guide fails to load or
// run. Exact same recipe as the browser tool (HMAC-SHA256, first `tagLength` hex chars, "c|"/"r|"
// message prefixes), ported to plain Node.js with the built-in `crypto` module instead of
// Web Crypto — byte-identical output.
//
// Usage:
//   Generate a challenge for a classmate:
//     node q5-handshake.offline.mjs challenge <your-key> <classmate-email> [tagLength]
//   Generate a response to a challenge you received:
//     node q5-handshake.offline.mjs respond <your-key> <challenge-string> [tagLength]
//   Assemble your final submission array from "peer challenge response" lines (one per line,
//   piped via stdin or a file):
//     node q5-handshake.offline.mjs assemble < pairs.txt

import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';

const DEFAULT_TAG_LENGTH = 16;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function makeCode(key, tag, message, tagLength) {
  const hex = createHmac('sha256', key).update(`${tag}|${message}`, 'utf8').digest('hex');
  return hex.slice(0, tagLength);
}

const [, , mode, ...rest] = process.argv;

if (mode === 'challenge') {
  const [key, email, tagLenStr] = rest;
  if (!key || !email) { console.error('Usage: challenge <your-key> <classmate-email> [tagLength]'); process.exit(1); }
  const tagLength = tagLenStr ? Number(tagLenStr) : DEFAULT_TAG_LENGTH;
  console.log(makeCode(key, 'c', normalizeEmail(email), tagLength));
} else if (mode === 'respond') {
  const [key, challenge, tagLenStr] = rest;
  if (!key || !challenge) { console.error('Usage: respond <your-key> <challenge-string> [tagLength]'); process.exit(1); }
  const tagLength = tagLenStr ? Number(tagLenStr) : DEFAULT_TAG_LENGTH;
  console.log(makeCode(key, 'r', challenge, tagLength));
} else if (mode === 'assemble') {
  const filePath = rest[0];
  const raw = filePath ? readFileSync(filePath, 'utf8') : readFileSync(0, 'utf8');
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const result = [];
  for (const line of lines) {
    const parts = line.split(/[\s,;|\t]+/).filter(Boolean);
    if (parts.length >= 3) {
      result.push({ peer: normalizeEmail(parts[0]), challenge: parts[1], response: parts[2] });
    }
  }
  if (!result.length) { console.error('Could not parse any 3-column rows (peer challenge response).'); process.exit(1); }
  console.log(JSON.stringify(result, null, 2));
} else {
  console.error(
    'Usage:\n' +
    '  node q5-handshake.offline.mjs challenge <your-key> <classmate-email> [tagLength]\n' +
    '  node q5-handshake.offline.mjs respond <your-key> <challenge-string> [tagLength]\n' +
    '  node q5-handshake.offline.mjs assemble < pairs.txt'
  );
  process.exit(1);
}
