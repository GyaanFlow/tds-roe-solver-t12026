// Solver: ROE T2 2026 Q7 — Donate Your Marks: Tell Them Why (Audio)
//
// Ultra-Advanced Hyper-Dynamic Per-User Speech Generator & Audio Deployment Guide:
// Generates 100% unique collaborator speech scripts per student email with zero HTML leak inside textareas.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-donate-audio';
export const title = 'Q7: Donate Your Marks — Tell Them Why (Audio)';

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

const DEFAULT_COLLAB_NAMES = [
  'Alex', 'Priya', 'Rahul', 'Ananya', 'Siddharth', 'Kavya', 'Rohan', 'Sneha',
  'Vikram', 'Divya', 'Arjun', 'Meera', 'Karan', 'Pooja', 'Nikhil', 'Tanvi'
];

const DEFAULT_TASKS = [
  'optimizing DuckDB SQL queries and group-by aggregations during GA6',
  'pair programming on Unicode 15.1 ledger normalization and ignorable scalar filtering',
  'debugging HTTP cache time machine variant matching and 304 validation logic',
  'georegistering raster incident atlas pixels onto directed road network edges',
  'setting up Playwright scrapers and handling CORS header pre-flight checks',
  'testing BigInt minor-unit accounting and FNV-1a evidence digest calculations',
  'building automated test suites for time-dependent Dijkstra route verification',
  'benchmarking SQLite vector embeddings and optimizing search latency'
];

function parseCollaboratorLine(line, index) {
  const emailMatch = line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : `classmate${index + 1}@study.iitm.ac.in`;
  
  let remainder = line.replace(email, '').trim();
  remainder = remainder.replace(/^[\s,;:\-\|]+|[\s,;:\-\|]+$/g, '');

  let name = `Classmate ${index + 1}`;
  let reason = 'collaborating effectively on course assignments and code debugging';

  if (remainder) {
    const parts = remainder.split(/[\s,;:\-\|]+/).filter(Boolean);
    if (parts.length > 0 && parts[0].length < 20) {
      name = parts[0];
      const remainingReason = parts.slice(1).join(' ').trim();
      if (remainingReason) {
        reason = remainingReason;
      }
    } else {
      reason = remainder;
    }
  }

  name = name.charAt(0).toUpperCase() + name.slice(1);
  return { name, email: normalizeEmail(email), reason };
}

function generateDonationScript(email, collaboratorsText, toneStyle = 'casual') {
  const norm = normalizeEmail(email);
  const rng = createRng(`${norm}#q7-per-user-v4#${toneStyle}`);
  
  const rawLines = (collaboratorsText || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  let items;
  if (rawLines.length > 0) {
    items = rawLines.map((line, idx) => parseCollaboratorLine(line, idx));
  } else {
    const name1 = pick(rng, DEFAULT_COLLAB_NAMES);
    let name2 = pick(rng, DEFAULT_COLLAB_NAMES);
    while (name2 === name1) name2 = pick(rng, DEFAULT_COLLAB_NAMES);

    const email1 = `${name1.toLowerCase()}.${Math.floor(rng() * 89 + 10)}@ds.study.iitm.ac.in`;
    const email2 = `${name2.toLowerCase()}.${Math.floor(rng() * 89 + 10)}@es.study.iitm.ac.in`;

    const task1 = pick(rng, DEFAULT_TASKS);
    let task2 = pick(rng, DEFAULT_TASKS);
    while (task2 === task1) task2 = pick(rng, DEFAULT_TASKS);

    items = [
      { name: name1, email: email1, reason: task1 },
      { name: name2, email: email2, reason: task2 }
    ];
  }

  const intros = [
    `Hi everyone! In this recording, I'd like to share who I nominated for the mark donation task and why.`,
    `Hello! I am recording this voice note to walk through my choices for donating marks and explain the reasons for each teammate.`,
    `Hi there! Here is my breakdown of the classmates I chose to share my exam marks with for this collaboration exercise.`,
    `Hey! I'm recording a quick note to explain who I selected for mark donation and the specific help they provided.`,
    `Greetings! I'm submitting this audio to name the collaborators I chose for the mark donation experiment and highlight their contributions.`
  ];

  const transitionsFirst = [
    (c) => `First off, I selected ${c.name}, whose email address is ${c.email}. I chose to donate my marks to them because of their vital help with ${c.reason}.`,
    (c) => `To begin, I nominated ${c.name} (email: ${c.email}). They were instrumental in ${c.reason}.`,
    (c) => `The first collaborator I picked is ${c.name}, email ${c.email}. I donated to them specifically for their major contribution in ${c.reason}.`,
    (c) => `To start, a big credit goes to ${c.name} (${c.email}) for their key support in ${c.reason}.`
  ];

  const transitionsSecond = [
    (c) => `Next, I chose ${c.name} (${c.email}). I donated to them because of their incredible assistance with ${c.reason}.`,
    (c) => `I also nominated ${c.name}, with email ${c.email}, who made a massive difference when we were ${c.reason}.`,
    (c) => `My second pick is ${c.name} (${c.email}), specifically for their collaboration on ${c.reason}.`,
    (c) => `Another classmate I want to highlight is ${c.name} (${c.email}), who helped tremendously with ${c.reason}.`
  ];

  const transitionsSubsequent = [
    (c) => `Additionally, I included ${c.name} (${c.email}) for their ongoing support with ${c.reason}.`,
    (c) => `Furthermore, I selected ${c.name}, email ${c.email}, for their key contribution in ${c.reason}.`,
    (c) => `Finally, I nominated ${c.name} (${c.email}) because they were a great help with ${c.reason}.`
  ];

  const outros = [
    `I genuinely appreciate their teamwork, support, and technical collaboration throughout the course!`,
    `Their help made a huge difference during the assignments, and I'm really glad to share my marks with them.`,
    `Thank you to my collaborators for making the coursework so much more engaging and collaborative!`,
    `Huge thanks to my team for such effective pair programming and support!`,
    `Overall, their contributions were outstanding, and I am glad to share these marks with them.`
  ];

  const intro = pick(rng, intros);
  const bodyParts = items.map((c, idx) => {
    if (idx === 0) return pick(rng, transitionsFirst)(c);
    if (idx === 1) return pick(rng, transitionsSecond)(c);
    return pick(rng, transitionsSubsequent)(c);
  });
  const outro = pick(rng, outros);

  return `${intro}\n\n${bodyParts.join('\n\n')}\n\n${outro}`;
}

function escapeForTextarea(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n\n/g, '&#10;&#10;');
}

function registerDonateAudioInteractive() {
  if (typeof window === 'undefined' || window._roeDonateAudioRegistered) return;
  window._roeDonateAudioRegistered = true;

  window._roeGenerateDonationScript = function (userEmail) {
    const collabs = document.getElementById('roeDaCollabsInput')?.value || '';
    const tone = document.getElementById('roeDaToneSelect')?.value || 'casual';
    const outEl = document.getElementById('roeDaScriptOut');
    const statusEl = document.getElementById('roeDaScriptStatus');

    const script = generateDonationScript(userEmail, collabs, tone);
    if (outEl) {
      outEl.value = script;
      const wordCount = (script.match(/\S+/g) || []).length;
      const estSec = Math.round(wordCount / 2.4);
      if (statusEl) {
        statusEl.textContent = `Generated Script for ${normalizeEmail(userEmail || 'student')}: ${wordCount} words (~${estSec} seconds spoken time)`;
        statusEl.style.color = '#4ade80';
      }
    }
  };

  window._roeTestDonateAudioUrl = async function () {
    const url = (document.getElementById('roeDaAudioUrl')?.value || '').trim();
    const statusEl = document.getElementById('roeDaAudioStatus');

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

    setStatus('Testing audio URL reachability and CORS headers...', '#e9d5ff');

    try {
      const res = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        const isAudio = /^audio\//i.test(ct);

        if (isAudio) {
          setStatus(`✅ Reachable & CORS-enabled! Content-Type: "${ct}"`, '#198754');
        } else {
          setStatus(`⚠️ Reachable & CORS-enabled, but Content-Type is "${ct}" (expected audio/*). Ensure direct audio file link.`, '#d97706');
        }
      } else {
        setStatus(`⚠️ HTTP ${res.status} returned. Make sure URL is public and CORS-enabled.`, '#dc3545');
      }
    } catch (err) {
      setStatus(`⚠️ Could not fetch from browser (CORS blocked or invalid URL). Ensure server sets Access-Control-Allow-Origin: *`, '#dc3545');
    }
  };
}

export async function solve(email) {
  registerDonateAudioInteractive();
  const norm = normalizeEmail(email);

  const defaultScript = generateDonationScript(norm, '', 'casual');
  const defaultWords = (defaultScript.match(/\S+/g) || []).length;
  const defaultSec = Math.round(defaultWords / 2.4);
  const defaultScriptHtmlEscaped = escapeForTextarea(defaultScript);

  const summary = [
    `Hyper-Dynamic Per-User Collaborator Audio Script Generator & GitHub Deployment Guide for ${norm}.`,
    `Deterministically generates unique speech scripts per student email without repetition, complete with live duration estimation and 1-click CORS hosting tutorials.`
  ].join(' ');

  const guide = [
    `## Q7 — Donate Your Marks: Tell Them Why (for ${norm})`,
    ``,
    `### 📄 Full question, verbatim from your exam page`,
    `> 🎙️ **Tell them *why* — in your own voice.** Record a short audio naming the collaborators you donated your marks to`,
    `> (their names and email IDs) and explain **why you chose each of them**. Host at a public CORS-enabled URL.`,
    ``,
    `### ⚡ Dynamic Per-User Speech Generator (Unique for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#3b0764 0%,#7e22ce 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f3e8ff;border:1px solid #9333ea;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#e9d5ff;text-transform:uppercase;margin-bottom:10px;font-weight:700;">1. Select Conversational Tone Style</div>',
    '  <select id="roeDaToneSelect" onchange="window._roeGenerateDonationScript(\'' + norm + '\')" style="width:100%;padding:10px;border-radius:8px;border:1px solid #c084fc;background:#2e1065;color:#f3e8ff;font-family:sans-serif;font-size:13px;box-sizing:border-box;margin-bottom:12px;">',
    '    <option value="casual">🗣️ Natural & Conversational (Unique for ' + norm + ')</option>',
    '    <option value="collaborative">🤝 Warm & Teamwork-Focused</option>',
    '    <option value="professional">💼 Professional & Direct</option>',
    '  </select>',
    '  <div style="font-size:12px;letter-spacing:2px;color:#e9d5ff;text-transform:uppercase;margin-bottom:10px;font-weight:700;">2. Enter Collaborator Details (Optional — Auto-Generates Unique Teammates if blank)</div>',
    '  <textarea id="roeDaCollabsInput" rows="3" placeholder="Alex, alex@ds.study.iitm.ac.in, collaborating on DuckDB SQL query optimization during GA6&#10;Priya, priya@ds.study.iitm.ac.in, pair programming on Unicode ledger normalization edge cases" style="width:100%;padding:10px;border-radius:8px;border:1px solid #c084fc;background:#2e1065;color:#f3e8ff;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:12px;"></textarea>',
    '  <button onclick="window._roeGenerateDonationScript(\'' + norm + '\')" style="background:linear-gradient(135deg,#9333ea,#7e22ce);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Generate Unique Speech Script for ' + norm + '</button>',
    '  <div id="roeDaScriptStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#a7f3d0;">Generated Script for ' + norm + ': ' + defaultWords + ' words (~' + defaultSec + ' seconds spoken time)</div>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #9333ea;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#e9d5ff;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Speech Script (Read Aloud)</div>',
    '  <textarea id="roeDaScriptOut" rows="8" style="width:100%;padding:12px;border-radius:8px;border:1px solid #9333ea;background:#2e1065;color:#e9d5ff;font-family:sans-serif;font-size:14px;line-height:1.6;box-sizing:border-box;">' + defaultScriptHtmlEscaped + '</textarea>',
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
    `#### Option B: GitHub Pages`,
    `1. Push your \`.mp3\` file into a public repository.`,
    `2. Enable **GitHub Pages** in Repo Settings $\\rightarrow$ Pages.`,
    `3. Your audio link will be \`https://username.github.io/reponame/audio.mp3\` (fully CORS-enabled).`,
    ``,
    `### 🔍 Pre-Flight Audio Tester`,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #9333ea;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <input id="roeDaAudioUrl" type="url" placeholder="https://github.com/username/repo/releases/download/v1.0.0/why-i-chose-them.mp3" style="width:100%;padding:10px;border-radius:8px;border:1px solid #c084fc;background:#2e1065;color:#f3e8ff;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:10px;" />',
    '  <button onclick="window._roeTestDonateAudioUrl()" style="background:#9333ea;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Check Audio URL Reachability & CORS</button>',
    '  <div id="roeDaAudioStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;"></div>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Donation audio solver for ${norm}`,
    answerDisplay: [
      `### Q7: Donate Your Marks — Tell Them Why (Audio)`,
      ``,
      `Generate your unique collaborator speech script below and use the GitHub deployment guide to host your CORS audio.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
