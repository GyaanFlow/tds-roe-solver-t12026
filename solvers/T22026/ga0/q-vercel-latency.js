// Solver: Q25 — Vercel Latency (Direct Solution)
import { normalizeEmail } from './utils.js';

export const id = 'q-vercel-latency';
export const title = 'Q25: Vercel Latency';

export async function solve(email) {
  const norm = normalizeEmail(email);
  
  const vercelJson = JSON.stringify({
    "builds": [{ "src": "api/index.py", "use": "@vercel/python" }],
    "routes": [{ "src": "/(.*)", "dest": "api/index.py" }]
  }, null, 2);

  const pythonCode = `
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path
from math import ceil

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def percentile(values, q):
    values = sorted(values)
    if not values:
        return None
    pos = (len(values) - 1) * q
    lo = int(pos)
    hi = min(lo + 1, len(values) - 1)
    frac = pos - lo
    return values[lo] + frac * (values[hi] - values[lo])

@app.get("/")
async def health():
    return {"ok": True, "email": "${norm}"}

@app.post("/")
@app.post("/api/latency")
async def latency_stats(request: Request):
    body = await request.json()
    wanted_regions = body.get("regions", [])
    threshold_ms = float(body.get("threshold_ms", 0))

    data_path = Path("q-vercel-latency.json")
    if not data_path.exists():
        data_path = Path(__file__).resolve().parent.parent / "q-vercel-latency.json"

    with data_path.open(encoding="utf-8") as f:
        rows = json.load(f)

    output = []
    for region in wanted_regions:
        region_rows = [row for row in rows if row.get("region") == region]
        latencies = [float(row["latency_ms"]) for row in region_rows]
        uptimes = [float(row["uptime_pct"]) for row in region_rows]
        breaches = sum(1 for value in latencies if value > threshold_ms)
        output.append({
            "region": region,
            "avg_latency": round(sum(latencies) / len(latencies), 2),
            "p95_latency": round(percentile(latencies, 0.95), 2),
            "avg_uptime": round(sum(uptimes) / len(uptimes), 3),
            "breaches": breaches,
        })

    return {"regions": output}
`.trim();

  return {
    type: 'solved',
    variant: 'FastAPI Vercel Deployment',
    answer: pythonCode,
    guide: `### 🚀 Implementation Guide

1. **Setup Repo Structure**:
   - Create a new GitHub repository.
   - Create a folder named \`api/\`.
   - Save the code from the **Answer** box as \`api/index.py\`.
   - Create a file named \`requirements.txt\` at the root with one line: \`fastapi\`.
   - Create a file named \`vercel.json\` at the root with the following content:
     \`\`\`json
     ${vercelJson}
     \`\`\`
   - Download \`q-vercel-latency.json\` from the exam portal and place it at the root of your repo.
2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com/) and import your repository.
   - Deploy it.
3. **Submit**:
   - Copy the deployment URL (e.g., \`https://my-latency-app.vercel.app\`).
   - Paste it into the exam portal and click **Submit**.`,
    answerDisplay: `### Quick Steps\n\n1. Setup repo with \`api/index.py\`, \`requirements.txt\`, \`vercel.json\`, and \`q-vercel-latency.json\`.\n2. Deploy to Vercel.\n3. Submit \`.vercel.app\` URL.`,
  };
}
