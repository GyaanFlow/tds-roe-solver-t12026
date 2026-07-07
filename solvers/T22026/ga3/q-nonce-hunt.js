import { normalizeEmail } from './utils.js';

export const id = 'q-proof-of-work-server';
export const title = 'Q10: Proof-of-Work Nonce Hunt';

function leadingZeroBits(digest) {
  for (let i = 0; i < digest.length; i++) {
    if (digest[i] === 0) continue;
    return i * 8 + (8 - digest[i].toString(2).padStart(8, '0').indexOf('1'));
  }
  return digest.length * 8;
}

async function mineNonce(token, difficulty) {
  const enc = new TextEncoder();
  let nonce = 0;
  const start = Date.now();
  while (true) {
    const data = enc.encode(`${token}:${nonce}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(hash);
    if (leadingZeroBits(bytes) >= difficulty) {
      return { nonce, time: ((Date.now() - start) / 1000).toFixed(1) };
    }
    nonce++;
    if (nonce % 100000 === 0) await new Promise(r => setTimeout(r, 0));
  }
}

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);

  if (sessionToken && sessionToken.includes('|')) {
    const parts = sessionToken.split('|');
    const token = parts[0].trim();
    const difficulty = parseInt(parts[1], 10);
    if (token && !isNaN(difficulty)) {
      try {
        const result = await mineNonce(token, difficulty);
        return {
          type: 'solved',
          answer: String(result.nonce),
          variant: `POW nonce for ${norm}`,
          answerDisplay: `Nonce: ${result.nonce} (${result.time}s at difficulty ${difficulty})`
        };
      } catch (e) {
        return {
          type: 'error',
          answer: '',
          variant: 'Mining failed',
          answerDisplay: `Error mining: ${e.message}`
        };
      }
    }
  }

  const minerScript = `
import hashlib, sys, time

TOKEN = "PASTE_YOUR_TOKEN_HERE"
DIFFICULTY = 0  # REPLACE with your difficulty (e.g. 22)

def leading_zero_bits(digest):
    bits = 0
    for byte in digest:
        if byte == 0:
            bits += 8
            continue
        bits += 8 - byte.bit_length()
        break
    return bits

nonce = 0
start = time.time()
while True:
    d = hashlib.sha256(f"{TOKEN}:{nonce}".encode()).digest()
    if leading_zero_bits(d) >= DIFFICULTY:
        print(f"NONCE = {nonce}")
        print(f"Time: {time.time() - start:.1f}s")
        break
    nonce += 1
`.trim();

  const parallelMiner = `
import hashlib, multiprocessing as mp, time

TOKEN = "PASTE_YOUR_TOKEN_HERE"
DIFFICULTY = 0

def lzb(d):
    b = 0
    for byte in d:
        if byte == 0: b += 8; continue
        b += 8 - byte.bit_length(); break
    return b

def worker(start, step, q):
    n = start
    while True:
        if lzb(hashlib.sha256(f"{TOKEN}:{n}".encode()).digest()) >= DIFFICULTY:
            q.put(n); return
        n += step

if __name__ == "__main__":
    cores = mp.cpu_count()
    q = mp.Queue()
    procs = [mp.Process(target=worker, args=(i, cores, q), daemon=True) for i in range(cores)]
    for p in procs: p.start()
    print("NONCE =", q.get())
`.trim();

  return {
    type: 'guide',
    answer: 'Mine the nonce using instructions in the guide.',
    variant: `POW Miner for ${norm}`,
    answerDisplay: [
      `### Q10: Proof-of-Work Nonce Hunt`,
      `Find your token and difficulty in the exam iframe, then mine the nonce.`,
      '',
      `**Tip:** Paste \`token|difficulty\` in the aipipe.org field above, then click Solve.`,
      '',
      '#### Steps',
      '1. Open the exam page and locate the iframe showing your **Token** and **Difficulty**',
      '2. If difficulty is **27 or less**, use the single-threaded script below',
      '3. If difficulty is **28+**, use the parallel miner (much faster)',
      '4. Paste the nonce into the answer field and click Check',
      '',
      '#### Single-threaded miner (difficulty ≤ 27)',
      '```python',
      minerScript,
      '```',
      '',
      '#### Parallel miner (difficulty ≥ 28 — faster)',
      '```python',
      parallelMiner,
      '```'
    ].join('\n'),
    guide: [
      '## Q10: Proof-of-Work Nonce Hunt',
      '',
      '### How it works',
      '1. Each student gets a unique **token** and **difficulty** (shown in an iframe on the exam page)',
      '2. Find a non-negative integer **nonce** such that `SHA-256(token + ":" + nonce)` has at least N leading zero bits',
      '3. Mining is brute-force — SHA-256 cannot be reversed',
      '4. Any valid nonce is accepted (not necessarily the smallest)',
      '',
      '### Auto-miner (session token hack)',
      'Paste `token|difficulty` in the aipipe.org field and click Solve. The solver will mine in-browser.',
      'Works best for difficulty ≤ 26 (higher difficulties are slow in JS).',
      '',
      '### Performance',
      '- difficulty 22: ~0.3s (Python), ~0.1s (JS)',
      '- difficulty 25: ~2s (Python)',
      '- difficulty 27: ~84s (Python)',
      '- difficulty 28: ~160s (Python single-thread)'
    ].join('\n')
  };
}
