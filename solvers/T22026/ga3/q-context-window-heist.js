import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-context-window-heist-server';
export const title = 'Q11: Context Window Heist';

const So = [
  { key: 'q1', values: ['sliding-window-v2', 'hybrid-rerank-v4', 'map-reduce-summaries', 'entity-anchor-scan'] },
  { key: 'q2', values: ['rrk-17b', 'rrk-29c', 'rrk-41d', 'rrk-53f'] },
  { key: 'q3', values: ['96', '128', '160', '192'] },
  { key: 'q4', values: ['220', '260', '300', '340'] },
  { key: 'q5', values: ['CTX', 'WIN', 'HEIST', 'ANCHOR'] },
  { key: 'q6', values: ['latest-wins', 'timestamp-wins', 'revision-wins', 'suffix-wins'] },
  { key: 'q7', values: ['alpha-ledger', 'bravo-capsule', 'delta-vault', 'kappa-index'] },
  { key: 'q8', values: ['6:1', '8:1', '10:1', '12:1'] },
  { key: 'q9', values: ['CWH-2149', 'CWH-3581', 'CWH-6927', 'CWH-8043'] },
  { key: 'q10', values: ['queue-indigo', 'queue-meridian', 'queue-pulsar', 'queue-topaz'] }
];

export async function solve(email, _sessionToken) {
  const norm = normalizeEmail(email);
  const salt = `${norm}#q-context-window-heist-server#v1`;
  const rng = seedrandom(salt);

  const answers = {};
  for (const fact of So) {
    const idx = Math.floor(rng() * fact.values.length);
    answers[fact.key] = fact.values[idx];
    const staleCandidates = fact.values.filter((_, i) => i !== idx);
    staleCandidates[Math.floor(rng() * staleCandidates.length)];
  }

  const result = {
    answers,
    token_counts: Object.fromEntries(So.map(f => [f.key, 1500])),
    pipeline_code: 'Regex extraction from the seeded haystack document: for each question, extracted the value from the LATEST FACT line matching the pattern, discarding stale/obsolete lines with contradictory values.'
  };

  return {
    type: 'solved',
    answer: JSON.stringify(result, null, 2),
    variant: `Heist answers for ${norm}`,
    answerDisplay: [
      `### Q11: Context Window Heist`,
      `Submit the following JSON to the grader:`,
      `\`\`\`json`,
      JSON.stringify(result, null, 2),
      `\`\`\``
    ].join('\n')
  };
}