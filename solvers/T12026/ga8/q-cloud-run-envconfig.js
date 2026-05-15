// Solver: GCP Cloud Run Env Config (AUTO-SOLVED - computes expected hash)
import { sha256, normalizeEmail } from './utils.js';

export const id = 'q-gcp-cloud-run-envconfig';
export const title = 'GCP Cloud Run: Environment Variable Configuration';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(norm + '#' + id);

  const colors = ['crimson', 'teal', 'amber', 'indigo', 'emerald', 'coral', 'slate', 'orchid'];
  const shuffled = [...colors];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const themeColor = shuffled[0];
  const appMode = rng() > 0.5 ? 'production' : 'staging';
  const buildNumber = Math.floor(rng() * 900) + 100;
  const configStr = `${themeColor}:${appMode}:${buildNumber}`;
  const configHash = (await sha256(configStr)).slice(0, 12);

  return {
    type: 'guide',
    variant: `THEME=${themeColor}, MODE=${appMode}, BUILD=${buildNumber}`,
    answer: `Deploy a service with environment variables:
THEME_COLOR = ${themeColor}
APP_MODE = ${appMode}
BUILD_NUMBER = ${buildNumber}

Expected /config response:
{
  "theme_color": "${themeColor}",
  "app_mode": "${appMode}",
  "build_number": "${buildNumber}",
  "config_hash": "${configHash}"
}

app.py:
import hashlib, os
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
async def health(): return {"status": "ok"}

@app.get("/config")
async def config():
    theme = os.environ.get("THEME_COLOR", "NOT_SET")
    mode = os.environ.get("APP_MODE", "NOT_SET")
    build = os.environ.get("BUILD_NUMBER", "NOT_SET")
    config_str = f"{theme}:{mode}:{build}"
    config_hash = hashlib.sha256(config_str.encode()).hexdigest()[:12]
    return {"theme_color": theme, "app_mode": mode,
            "build_number": build, "config_hash": config_hash}

Deploy with --set-env-vars:
gcloud run deploy envconfig-service ... \\
  --set-env-vars "THEME_COLOR=${themeColor}" \\
  --set-env-vars "APP_MODE=${appMode}" \\
  --set-env-vars "BUILD_NUMBER=${buildNumber}"

Submit: your deployment URL`,
    answerDisplay: `THEME_COLOR: ${themeColor}\nAPP_MODE: ${appMode}\nBUILD_NUMBER: ${buildNumber}\nConfig Hash: ${configHash}`
  };
}
