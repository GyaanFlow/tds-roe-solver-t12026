// Solver: MLOps Bash Script (AUTO-SOLVED)
import { sha256, normalizeEmail } from './utils.js';

export const id = 'q-mlops-bash-script';
export const title = 'MLOps Bash Script: Deterministic Output';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(`${norm}#${id}`);

  const dirs = ['models', 'data', 'logs', 'experiments', 'checkpoints'];
  const targetDir = dirs[Math.floor(rng() * dirs.length)];
  const fileCount = Math.floor(rng() * 5) + 3;

  // Compute hash prefix for verification
  const hashPrefix = (await sha256(`${norm}mlops-bash-salt`)).substring(0, 6);

  // Compute per-file hashes
  const fileHashes = [];
  for (let i = 1; i <= fileCount; i++) {
    const fname = `run_${i}.txt`;
    const h = await sha256(fname);
    fileHashes.push(h.substring(0, 8));
  }

  // Compute combined hash
  const concatenated = fileHashes.join('');
  const combinedHash = (await sha256(concatenated)).substring(0, 8);

  const result = `DIR:${targetDir}|FILES:${fileCount}|HASH:${combinedHash}`;

  return {
    type: 'solved',
    variant: `dir=${targetDir}, files=${fileCount}, hash_prefix=${hashPrefix}`,
    answer: result,
    answerDisplay: `${result}\n\nTarget dir: ${targetDir}\nFile count: ${fileCount}\nFile hashes: ${fileHashes.join(', ')}\nCombined: ${combinedHash}\nVerification prefix: ${hashPrefix}`
  };
}
