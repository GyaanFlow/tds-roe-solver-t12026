// Solver: GCP Cloud Run Compute Service (Guide)
import { sha256, normalizeEmail } from './utils.js';

export const id = 'q-gcp-cloud-run-compute';
export const title = 'GCP Cloud Run: Deploy a Compute Service';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(norm + '#' + id);

  const a = Math.floor(rng() * 14) + 2;
  const b = Math.floor(rng() * 14) + 2;
  const sum = a + b;
  const product = a * b;
  const verify = (await sha256(`sum:${sum}:product:${product}`)).slice(0, 10);

  return {
    type: 'guide',
    variant: `A=${a}, B=${b} → sum=${sum}, product=${product}, verify=${verify}`,
    answer: `Deploy a FastAPI compute service with:
• GET /health → {"status": "ok"}
• POST /compute {"a": ${a}, "b": ${b}} → {"sum": ${sum}, "product": ${product}, "verify": "${verify}"}

main.py:
import hashlib
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ComputeRequest(BaseModel):
    a: int
    b: int

@app.get("/health")
async def health(): return {"status": "ok"}

@app.post("/compute")
async def compute(req: ComputeRequest):
    s = req.a + req.b
    p = req.a * req.b
    v = hashlib.sha256(f"sum:{s}:product:{p}".encode()).hexdigest()[:10]
    return {"sum": s, "product": p, "verify": v}

requirements.txt: fastapi uvicorn
Deploy to GCP Cloud Run (or AWS/Azure)

Expected response: {"sum": ${sum}, "product": ${product}, "verify": "${verify}"}
Submit: your deployment URL`,
    answerDisplay: `A=${a}, B=${b}\nSum: ${sum}\nProduct: ${product}\nVerify: ${verify}`
  };
}
