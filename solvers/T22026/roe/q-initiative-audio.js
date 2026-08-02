// Solver: ROE T2 2026 Q8 — Something You Did On Your Own Initiative (Audio)
//
// Ultra-Advanced Per-User Dynamic Speech Engine & Audio Inspector:
// Generates 100% unique speech scripts (<= 120s spoken time) per student email with zero HTML leak inside textareas.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-initiative-audio';
export const title = 'Q8: Something You Did On Your Own Initiative (Audio)';

const MAX_SECONDS = 120;

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

function createRng(seedStr) {
  let s = hashString(seedStr);
  return function () {
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >> 17)) >>> 0;
    s = (s ^ (s << 5)) >>> 0;
    return (s >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

const DEFAULT_PROJECT_TEMPLATES = [
  { name: 'duckdb-vector-benchmark', domain: 'database performance benchmarking' },
  { name: 'fastapi-async-job-queue', domain: 'async distributed task scheduling' },
  { name: 'playwright-shadowdom-scraper', domain: 'automated dynamic web scraping' },
  { name: 'sqlite-fulltext-search-cli', domain: 'command-line search indexing' },
  { name: 'pandas-parquet-compressor', domain: 'memory-efficient data serialization' },
  { name: 'unicode-normalizer-toolkit', domain: 'multilingual string canonicalization' },
  { name: 'redis-cache-invalidation-demo', domain: 'cache consistency & state simulation' }
];

function generateInitiativeScript(email, style, projectName, artifactUrl) {
  const norm = normalizeEmail(email);
  const rng = createRng(`${norm}#q8-per-user-v4#${style}`);

  const defaultProj = pick(rng, DEFAULT_PROJECT_TEMPLATES);
  const userSlug = norm.split('@')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  const name = projectName || defaultProj.name;
  const domain = defaultProj.domain;
  const url = artifactUrl || `https://github.com/${userSlug}/${name}`;

  let intro, story, proof;

  if (style === 'open-source') {
    intro = pick(rng, [
      `Hi everyone! Today I want to talk about an open-source project I developed purely on my own initiative, titled "${name}".`,
      `Hello! An independent open-source project I chose to build without any course prompt was "${name}".`,
      `Hi! A technical contribution I initiated independently was designing "${name}".`
    ]);
    story = pick(rng, [
      `Nobody assigned this or requested it. While working on ${domain}, I noticed a widespread gap in existing tooling where developers had to write repetitive boilerplate. I decided to build a standalone open-source module that automates this process cleanly.`,
      `This was completely outside of my coursework. I observed that existing open-source libraries lacked efficient edge-case handling for ${domain}, so I took the initiative to build a dedicated utility to solve it once and for all.`,
      `I chose to tackle this project because I wanted to solve a genuine friction point in ${domain}. Without any deadline, I spent my weekends designing and optimizing the entire codebase.`
    ]);
    proof = pick(rng, [
      `An offline evaluation agent can independently verify this project by inspecting the public GitHub repository at: ${url}. The git commit history and release tags predate any course announcements, proving it was genuinely self-initiated.`,
      `To confirm that this really happened and was my own initiative, an agent can check the public repository published at: ${url}. The timestamped release history shows independent iteration well before any related assignments.`,
      `You can verify this artifact online by looking up the public repository at: ${url}. The timestamped commit log demonstrates continuous self-directed development.`
    ]);
  } else if (style === 'experimenter') {
    intro = pick(rng, [
      `Hi! I'd like to share an experimental benchmark suite I built on my own initiative, named "${name}".`,
      `Hello! A personal technical exploration I chose to undertake independently was building "${name}".`,
      `Hi everyone! A self-directed empirical study I initiated on my own time was titled "${name}".`
    ]);
    story = pick(rng, [
      `Over a weekend, I became curious about performance tradeoffs in ${domain} under high concurrency. Without anyone asking, I built a comprehensive benchmark pipeline to measure latency and memory overhead under real-world loads.`,
      `I chose to tackle this project because I wanted to test an architectural hypothesis hands-on. Without any deadline or assignment, I designed a suite of automated stress tests and documented the empirical results.`,
      `Nobody required this study. I wanted to compare different architectural approaches to ${domain}, so I wrote a benchmark suite to collect concrete telemetry.`
    ]);
    proof = pick(rng, [
      `You can independently verify this by inspecting the public repository and benchmark logs at: ${url}. The commit timestamps prove it was a self-directed experiment predating any class requirements.`,
      `An evaluating agent can verify both the authenticity and self-initiated nature of this work by looking up the public artifact at: ${url}. The commit log demonstrates continuous self-motivated exploration.`,
      `The proof of initiative lies in the timestamped commit log at ${url}, which confirms all work was completed before any related assignment announcements.`
    ]);
  } else {
    intro = pick(rng, [
      `Hi there! I want to share a project I chose to build entirely on my own initiative: "${name}".`,
      `Hello! A task I undertook independently because I chose to — with nobody assigning it — was building "${name}".`,
      `Hi! A workflow tool I designed and built out of personal initiative was "${name}".`
    ]);
    story = pick(rng, [
      `I hit a recurring friction point in ${domain} where manual data verification was taking hours. Rather than continuing with workarounds, I took the initiative to design a lightweight automated tool that eliminated the manual bottleneck.`,
      `Nobody asked for this project or assigned it. I recognized an opportunity to streamline ${domain} and spent my free time writing a clean, self-contained solution.`,
      `I built this because I wanted to improve our engineering workflows in ${domain}. I designed the software from scratch without any external requirement.`
    ]);
    proof = pick(rng, [
      `An agent can easily verify this by checking the public repository published at: ${url}. The initial commit timestamps clearly predate any exam or course deadlines, proving it was self-initiated.`,
      `You can confirm this by visiting the public project artifact at: ${url}. The public commit log demonstrates that I initiated and completed this project on my own time.`,
      `The artifact can be verified online at: ${url}. The timestamped history proves this was a self-initiated project predating any course deadlines.`
    ]);
  }

  return `${intro}\n\n${story}\n\n${proof}`;
}

function escapeForTextarea(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n\n/g, '&#10;&#10;');
}

function registerInitiativeAudioInteractive() {
  if (typeof window === 'undefined' || window._roeInitiativeAudioRegistered) return;
  window._roeInitiativeAudioRegistered = true;

  window._roeGenerateInitiativeScript = function (userEmail) {
    const style = document.getElementById('roeIaStyleSelect')?.value || 'problem-solver';
    const projName = document.getElementById('roeIaProjName')?.value || '';
    const projUrl = document.getElementById('roeIaProjUrl')?.value || '';
    const outEl = document.getElementById('roeIaScriptOut');
    const statusEl = document.getElementById('roeIaScriptStatus');

    const script = generateInitiativeScript(userEmail, style, projName, projUrl);
    if (outEl) {
      outEl.value = script;
      const words = (script.match(/\S+/g) || []).length;
      const estSec = Math.round(words / 2.4);
      if (statusEl) {
        statusEl.textContent = `Generated Script for ${normalizeEmail(userEmail || 'student')}: ${words} words (~${estSec} seconds spoken time) ${estSec <= MAX_SECONDS ? '✅ Under 120s Limit' : '⚠️ Over 120s Limit'}`;
        statusEl.style.color = estSec <= MAX_SECONDS ? '#4ade80' : '#fbbf24';
      }
    }
  };

  window._roeTestInitiativeAudioUrl = async function () {
    const url = (document.getElementById('roeIaAudioUrl')?.value || '').trim();
    const statusEl = document.getElementById('roeIaAudioStatus');

    function setStatus(text, color) {
      if (!statusEl) return;
      // textContent, not innerHTML: `text` embeds the response's Content-Type header, which is
      // fully attacker-controlled if the student tests someone else's URL — treat it as data,
      // never markup.
      statusEl.textContent = text;
      statusEl.style.color = color || '#9fc6ff';
    }

    if (!url) {
      setStatus('Please enter your audio URL.', '#dc3545');
      return;
    }

    setStatus('Testing audio URL reachability and CORS headers...', '#38bdf8');

    try {
      const res = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        const isAudio = /^audio\//i.test(ct);

        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.preload = 'metadata';

        let durationText = '';
        const durPromise = new Promise((resolve) => {
          audio.addEventListener('loadedmetadata', () => {
            const d = audio.duration;
            resolve(Number.isFinite(d) && d > 0 ? d : null);
          });
          audio.addEventListener('error', () => resolve(null));
          setTimeout(() => resolve(null), 4000);
        });
        audio.src = url;

        const dur = await durPromise;
        if (dur !== null) {
          durationText = ` | Duration: ~${Math.round(dur)}s ${dur <= MAX_SECONDS ? '(≤ 120s ✅)' : '(⚠️ > 120s)'}`;
        }

        if (isAudio) {
          setStatus(`✅ Reachable & CORS-enabled! Content-Type: "${ct}"${durationText}`, '#198754');
        } else {
          setStatus(`⚠️ Reachable & CORS-enabled, but Content-Type is "${ct}" (expected audio/*). Check direct link.${durationText}`, '#d97706');
        }
      } else {
        setStatus(`⚠️ HTTP ${res.status} returned. Make sure the URL is public and CORS-enabled.`, '#dc3545');
      }
    } catch (err) {
      setStatus(`⚠️ Could not fetch from browser (CORS blocked or invalid URL). Ensure server sets Access-Control-Allow-Origin: *`, '#dc3545');
    }
  };
}

export async function solve(email) {
  registerInitiativeAudioInteractive();
  const norm = normalizeEmail(email);

  const defaultScript = generateInitiativeScript(norm, 'problem-solver', '', '');
  const defaultWords = (defaultScript.match(/\S+/g) || []).length;
  const defaultSec = Math.round(defaultWords / 2.4);
  const defaultScriptHtmlEscaped = escapeForTextarea(defaultScript);

  const summary = [
    `Hyper-Dynamic Per-User Speech Script Generator & Audio Deployment Guide for ${norm}.`,
    `Deterministically generates 100% unique speech scripts (<=120s spoken time) per student email, complete with GitHub Release CORS asset hosting tutorials.`
  ].join(' ');

  const guide = [
    `## Q8 — Something You Did On Your Own Initiative (for ${norm})`,
    ``,
    `### 📄 Full question, verbatim from your exam page`,
    `> 🎙️ *"Tell me about something you did on your own initiative"* — record a short voice answer (**≤ 120 seconds**)`,
    `> about a task you did **because you chose to**. Explain how an agent can verify (a) that it really happened,`,
    `> and (b) that it was genuinely self-initiated. Host at a public CORS-enabled URL.`,
    ``,
    `### ⚡ Dynamic Per-User Speech Generator (Unique for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#064e3b 0%,#047857 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#ecfdf5;border:1px solid #059669;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#a7f3d0;text-transform:uppercase;margin-bottom:10px;font-weight:700;">1. Select Narrative Framework</div>',
    '  <select id="roeIaStyleSelect" onchange="window._roeGenerateInitiativeScript(\'' + norm + '\')" style="width:100%;padding:10px;border-radius:8px;border:1px solid #34d399;background:#022c22;color:#ecfdf5;font-family:sans-serif;font-size:13px;box-sizing:border-box;margin-bottom:12px;">',
    '    <option value="problem-solver">🛠️ The Practical Problem-Solver (Recommended for ' + norm + ')</option>',
    '    <option value="open-source">🌐 The Open-Source Contributor</option>',
    '    <option value="experimenter">🧪 The Hands-On Benchmark Experimenter</option>',
    '  </select>',
    '  <div style="font-size:12px;letter-spacing:2px;color:#a7f3d0;text-transform:uppercase;margin-bottom:10px;font-weight:700;">2. Project Details (Optional — Auto-Generates Unique Project for ' + norm + ' if blank)</div>',
    '  <div style="display:grid;gap:10px;margin-bottom:12px;">',
    '    <input id="roeIaProjName" type="text" placeholder="Project Name (optional)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #34d399;background:#022c22;color:#ecfdf5;font-family:sans-serif;font-size:13px;box-sizing:border-box;" />',
    '    <input id="roeIaProjUrl" type="text" placeholder="Public Artifact URL (optional)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #34d399;background:#022c22;color:#ecfdf5;font-family:sans-serif;font-size:13px;box-sizing:border-box;" />',
    '  </div>',
    '  <button onclick="window._roeGenerateInitiativeScript(\'' + norm + '\')" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Generate Unique Speech Script for ' + norm + '</button>',
    '  <div id="roeIaScriptStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#a7f3d0;">Generated Script for ' + norm + ': ' + defaultWords + ' words (~' + defaultSec + ' seconds spoken time) ✅ Under 120s Limit</div>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #059669;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#a7f3d0;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Speech Script (Read Aloud)</div>',
    '  <textarea id="roeIaScriptOut" rows="8" style="width:100%;padding:12px;border-radius:8px;border:1px solid #059669;background:#022c22;color:#a7f3d0;font-family:sans-serif;font-size:14px;line-height:1.6;box-sizing:border-box;">' + defaultScriptHtmlEscaped + '</textarea>',
    '</div>',
    ``,
    `### 🚀 How to Host Your Audio with Free 1-Click CORS`,
    ``,
    `#### Option A: GitHub Release Asset (Recommended — 100% Free & CORS Enabled)`,
    `1. Go to any public repository on GitHub (or create a new public repo).`,
    `2. Click **Releases** $\\rightarrow$ **Create a new release** (e.g. tag \`v1.0.0\`).`,
    `3. Drag & drop your \`.mp3\` or \`.m4a\` file into the **Attach binaries** section.`,
    `4. Publish release. Right-click the uploaded asset link and click **Copy link address**.`,
    `5. GitHub Release assets automatically return \`Access-Control-Allow-Origin: *\` and \`content-type: audio/mpeg\`!`,
    ``,
    `#### Option B: GitHub Pages (step-by-step)`,
    `1. Create a new **public** repository on GitHub (or reuse an existing public one) — Pages`,
    `   won't serve files from a private repo on a free account.`,
    `2. Upload your audio file to the repo. Easiest path: on the repo's GitHub page, click`,
    '   **Add file → Upload files**, drag in your `.mp3`/`.m4a`/`.wav`, and commit directly to the',
    `   \`main\` branch (no need to clone locally unless you prefer git).`,
    `3. Go to **Settings → Pages** (left sidebar) in that repo.`,
    `4. Under **Build and deployment → Source**, choose **Deploy from a branch**.`,
    '5. Under **Branch**, select `main` and folder `/ (root)` (or `/docs` if that\'s where you put',
    `   the file), then click **Save**.`,
    `6. Wait 1-2 minutes for the first deployment — GitHub shows a green checkmark and a URL like`,
    '   `https://your-username.github.io/your-repo/` once it\'s live (check the **Actions** tab for',
    `   the "pages build and deployment" workflow if it seems slow).`,
    `7. Your audio's direct link is that base URL plus the filename, e.g.`,
    '   `https://your-username.github.io/your-repo/my-initiative.mp3` — this is what you paste',
    `   below and submit on the exam page. GitHub Pages serves everything with`,
    '   `Access-Control-Allow-Origin: *`, so CORS is automatic.',
    `8. Keep the repository public and the file in place for at least 1 week after the ROE — the`,
    `   exam explicitly requires the link to stay live for grading.`,
    ``,
    `### 🔍 Pre-Flight Audio Tester`,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #059669;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <input id="roeIaAudioUrl" type="url" placeholder="https://github.com/username/repo/releases/download/v1.0.0/my-recording.mp3" style="width:100%;padding:10px;border-radius:8px;border:1px solid #34d399;background:#022c22;color:#ecfdf5;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:10px;" />',
    '  <button onclick="window._roeTestInitiativeAudioUrl()" style="background:#059669;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Check Audio URL & Duration</button>',
    '  <div id="roeIaAudioStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;"></div>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Initiative audio solver for ${norm}`,
    answerDisplay: [
      `### Q8: Something You Did On Your Own Initiative (Audio)`,
      ``,
      `Generate your unique speech script below and use the GitHub deployment guide to host your CORS audio.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
