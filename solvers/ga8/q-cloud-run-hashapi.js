// Solver: GCP Cloud Run Hash API (Guide - computes expected values)
import { sha256, normalizeEmail } from './utils.js';

export const id = 'q-gcp-cloud-run-hashapi';
export const title = 'GCP Cloud Run: Hash Verification API';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(norm + '#' + id);

  const greek = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta'];
  const verbs = ['deploy', 'build', 'push', 'serve', 'train', 'scale', 'test', 'release'];

  const g = [...greek];
  const v = [...verbs];
  for (let i = g.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [g[i], g[j]] = [g[j], g[i]];
  }
  for (let i = v.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [v[i], v[j]] = [v[j], v[i]];
  }

  const inputString = `${g[0]}-${v[0]}`;
  const salt = Math.floor(rng() * 9000) + 1000;
  const shaHash = (await sha256(inputString)).slice(0, 16);
  const saltedSha = (await sha256(`${inputString}:${salt}`)).slice(0, 16);
  const reversed = inputString.split('').reverse().join('');
  const length = inputString.length;

  return {
    type: 'guide',
    variant: `text="${inputString}", salt=${salt}`,
    answer: `Deploy a hash verification API with:
• GET /health → {"status": "ok", "service": "hash-api"}
• POST /hash {"text": "${inputString}", "salt": "${salt}"}

Expected /hash response:
{
  "sha256": "${shaHash}",
  "salted_sha256": "${saltedSha}",
  "reversed": "${reversed}",
  "length": ${length}
}

app.py:
import hashlib
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class HashRequest(BaseModel):
    text: str
    salt: str

@app.get("/health")
async def health(): return {"status": "ok", "service": "hash-api"}

@app.post("/hash")
async def compute_hash(req: HashRequest):
    text = req.text.strip()
    salt = req.salt.strip()
    if not text: return {"error": "text must not be empty"}, 400
    sha = hashlib.sha256(text.encode()).hexdigest()[:16]
    salted_sha = hashlib.sha256(f"{text}:{salt}".encode()).hexdigest()[:16]
    return {"sha256": sha, "salted_sha256": salted_sha,
            "reversed": text[::-1], "length": len(text)}

Deploy to GCP Cloud Run (or AWS/Azure)
Submit: your deployment URL`,
    answerDisplay: `Input: "${inputString}", Salt: ${salt}\nSHA256: ${shaHash}\nSalted: ${saltedSha}\nReversed: ${reversed}\nLength: ${length}`
  };
}
