/**
 * Solver: P2 Part B Q4 — IITM Discourse KB Analysis
 *
 * Interactive guide solver. The user pastes 50 tasks, which are parsed
 * and solved against a precomputed snapshot of the IITM Discourse forum
 * (frozen 2026-04-25). All computation happens in-browser.
 *
 * compact_facts.json (~12MB) is fetched once and cached in memory.
 */
import { parseText, validate, KNOWN_CATEGORIES } from './parse-tasks.js';
import { HANDLERS } from './handlers.js';

export const id = 'p2b-q4-discourse-kb';
export const title = 'Q4: Discourse KB Solver (50 Tasks)';

// ─── Data Loading ───────────────────────────────────────────────────

let _factsCache = null;
let _factsLoadPromise = null;

async function loadFacts() {
  if (_factsCache) return _factsCache;
  if (_factsLoadPromise) return _factsLoadPromise;

  _factsLoadPromise = (async () => {
    try {
      const resp = await fetch('./solvers/p2/compact_facts.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
      _factsCache = await resp.json();
      const totalTopics = Object.values(_factsCache).reduce((s, v) => s + v.length, 0);
      console.log(`[P2B-Q4] Loaded ${totalTopics} topics across ${Object.keys(_factsCache).length} categories.`);
      return _factsCache;
    } catch (err) {
      _factsLoadPromise = null;
      throw new Error(`Failed to load compact_facts.json: ${err.message}`);
    }
  })();

  return _factsLoadPromise;
}

// ─── Batch Solver ───────────────────────────────────────────────────

function solveTasks(tasks, cache) {
  const answers = {};
  const log = [];
  const startTime = performance.now();

  // Type and category distribution
  const typeCounts = {};
  const catCounts = {};
  for (const t of tasks) {
    typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;
    catCounts[t.category] = (catCounts[t.category] || 0) + 1;
  }
  log.push(`Parsed ${tasks.length} tasks.`);
  log.push('Types: ' + Object.entries(typeCounts).sort().map(([k, v]) => `${k}=${v}`).join(', '));
  log.push(`Categories: ${Object.keys(catCounts).length}`);
  log.push('');

  let errorCount = 0;
  let missingParamsCount = 0;

  for (const task of tasks) {
    const key = `task${task.task_num}`;
    const cat = task.category;
    const handler = HANDLERS[task.type];

    if (!(cat in cache)) {
      answers[key] = 'UNKNOWN_CATEGORY';
      log.push(`  ${key}: ❌ UNKNOWN_CATEGORY '${cat}'`);
      errorCount++;
      continue;
    }

    if (!handler) {
      answers[key] = 'UNKNOWN_TYPE';
      log.push(`  ${key}: ❌ UNKNOWN_TYPE '${task.type}'`);
      errorCount++;
      continue;
    }

    const facts = cache[cat];
    try {
      const result = handler(task, facts);
      answers[key] = result;

      if (result === 'MISSING_PARAMS') {
        missingParamsCount++;
        log.push(`  ${key}: ⚠️ MISSING_PARAMS for ${task.type} — check task text`);
      } else if (result.includes('NOT_FOUND')) {
        errorCount++;
        log.push(`  ${key}: ⚠️ NOT_FOUND (${task.type})`);
      } else if (result.startsWith('ERROR')) {
        errorCount++;
        log.push(`  ${key}: ❌ ${result}`);
      }
    } catch (e) {
      answers[key] = `ERROR: ${e.message}`;
      log.push(`  ${key}: ❌ EXCEPTION ${e.message}`);
      errorCount++;
    }
  }

  // Fill any missing tasks (1-50) with "MISSING"
  for (let i = 1; i <= 50; i++) {
    const key = `task${i}`;
    if (!(key in answers)) {
      answers[key] = 'MISSING';
    }
  }

  // Sort by task number
  const sortedAnswers = {};
  for (let i = 1; i <= 50; i++) {
    const key = `task${i}`;
    if (key in answers) sortedAnswers[key] = answers[key];
  }

  const elapsed = (performance.now() - startTime).toFixed(1);
  log.push('');
  log.push(`Completed in ${elapsed}ms.`);

  const totalResolved = Object.values(sortedAnswers).filter(v =>
    v !== 'MISSING' && v !== 'MISSING_PARAMS' && !v.includes('NOT_FOUND') &&
    !v.startsWith('ERROR') && v !== 'UNKNOWN_CATEGORY' && v !== 'UNKNOWN_TYPE'
  ).length;

  if (errorCount > 0 || missingParamsCount > 0) {
    log.push(`⚠️  ${errorCount} error(s), ${missingParamsCount} missing-params.`);
  }
  log.push(`✅ ${totalResolved}/50 tasks resolved.`);

  return { answers: sortedAnswers, log, totalResolved, errorCount, missingParamsCount };
}

// ─── Global Interactive Handlers ────────────────────────────────────

function ensureGlobalHandlers() {
  if (window._p2bSolveRegistered) return;
  window._p2bSolveRegistered = true;

  window._p2bSolve = async function () {
    const input = document.getElementById('p2bTaskInput');
    const output = document.getElementById('p2bOutput');
    const jsonOut = document.getElementById('p2bJsonOutput');
    const logOut = document.getElementById('p2bLog');
    const statsOut = document.getElementById('p2bStats');
    const warnOut = document.getElementById('p2bWarnings');
    const solveBtn = document.getElementById('p2bSolveBtn');
    const copyBtn = document.getElementById('p2bCopyBtn');

    if (!input || !input.value.trim()) {
      alert('Please paste your task list first.');
      return;
    }

    solveBtn.disabled = true;
    solveBtn.textContent = '⏳ Loading data...';

    try {
      const cache = await loadFacts();

      solveBtn.textContent = '⏳ Parsing tasks...';
      let tasks;
      try {
        tasks = parseText(input.value);
      } catch (parseErr) {
        if (jsonOut) jsonOut.textContent = '';
        if (logOut) logOut.textContent = `❌ Parse error: ${parseErr.message}`;
        if (output) output.classList.add('active');
        return;
      }

      // Run validation
      const validation = validate(tasks);
      if (warnOut) {
        if (validation.warnings.length > 0) {
          warnOut.textContent = validation.warnings.join('\n');
          warnOut.style.display = 'block';
        } else {
          warnOut.style.display = 'none';
        }
      }

      solveBtn.textContent = '⏳ Solving...';
      const result = solveTasks(tasks, cache);

      const jsonStr = JSON.stringify(result.answers, null, 2);
      jsonOut.textContent = jsonStr;
      logOut.textContent = result.log.join('\n');

      // Stats badges
      const total = Object.keys(result.answers).length;
      const statusClass = result.totalResolved >= 45 ? 'good' :
                          result.totalResolved >= 35 ? 'ok' : 'bad';

      statsOut.innerHTML = `
        <div class="p2b-stat-badge"><span class="val">${tasks.length}</span> parsed</div>
        <div class="p2b-stat-badge ${statusClass}"><span class="val">${result.totalResolved}</span>/${total} resolved</div>
        ${result.errorCount ? `<div class="p2b-stat-badge bad"><span class="val">${result.errorCount}</span> errors</div>` : ''}
        ${result.missingParamsCount ? `<div class="p2b-stat-badge bad"><span class="val">${result.missingParamsCount}</span> missing params</div>` : ''}
      `;

      output.classList.add('active');
      copyBtn.style.display = 'inline-flex';
      window._p2bLastJson = jsonStr;
    } catch (err) {
      if (jsonOut) jsonOut.textContent = '';
      if (logOut) logOut.textContent = `❌ ${err.message}`;
      if (output) output.classList.add('active');
    } finally {
      solveBtn.disabled = false;
      solveBtn.textContent = '⚡ Solve All Tasks';
    }
  };

  window._p2bCopy = async function () {
    if (!window._p2bLastJson) return;
    try {
      await navigator.clipboard.writeText(window._p2bLastJson);
      const btn = document.getElementById('p2bCopyBtn');
      if (btn) {
        btn.textContent = '✅ Copied!';
        setTimeout(() => { btn.textContent = '📋 Copy JSON'; }, 1500);
      }
    } catch {
      const ta = document.createElement('textarea');
      ta.value = window._p2bLastJson;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };
}

// ─── Solver Entry Point ─────────────────────────────────────────────

export async function solve(email) {
  let cache;
  try {
    cache = await loadFacts();
  } catch (err) {
    return {
      type: 'error',
      variant: 'Failed to load Discourse KB data',
      answer: `ERROR: ${err.message}\n\nMake sure compact_facts.json is deployed alongside the app.`,
    };
  }

  ensureGlobalHandlers();

  const topicCount = Object.values(cache).reduce((s, v) => s + v.length, 0);
  const catCount = Object.keys(cache).length;

  const guideText = [
    `Discourse KB Solver — ${topicCount} topics across ${catCount} categories (frozen 2026-04-25).`,
    '',
    'HOW TO USE:',
    '1. Open the "Rendered Notes" panel below.',
    '2. Paste your 50-task assignment text into the input box.',
    '3. Click "Solve All Tasks" — answers are computed instantly in-browser.',
    '4. Copy the JSON output and submit to the grader.',
    '',
    'Supported formats: "Task N" blocks, markdown headers, numbered lists, or JSON with task1..task50 keys.',
    '',
    'NOTE: All answers are based on the frozen 2026-04-25 snapshot.',
    'Usernames are case-insensitive on the grader side.',
  ].join('\n');

  return {
    type: 'guide',
    variant: `Discourse KB — ${topicCount} topics, ${catCount} categories`,
    answer: guideText,
    answerDisplay: buildGuideHtml(topicCount, catCount),
  };
}

// ─── Interactive HTML UI ────────────────────────────────────────────

function buildGuideHtml(topicCount, catCount) {
  return `
<div id="p2b-solver-root">
  <style>
    #p2b-solver-root {
      font-family: 'Inter', system-ui, sans-serif;
      color: #e2e8f0;
    }
    #p2b-solver-root .p2b-header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 16px;
    }
    #p2b-solver-root .p2b-header h3 {
      margin: 0 0 8px 0;
      color: #93c5fd;
      font-size: 18px;
    }
    #p2b-solver-root .p2b-header p {
      margin: 4px 0;
      font-size: 13px;
      color: #94a3b8;
    }
    #p2b-solver-root .p2b-input-area {
      width: 100%;
      min-height: 240px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px;
      color: #e2e8f0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      resize: vertical;
      box-sizing: border-box;
    }
    #p2b-solver-root .p2b-input-area:focus {
      outline: none;
      border-color: #60a5fa;
      box-shadow: 0 0 0 2px rgba(96,165,250,0.2);
    }
    #p2b-solver-root .p2b-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 12px;
      padding: 10px 24px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    #p2b-solver-root .p2b-btn:hover {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      transform: translateY(-1px);
    }
    #p2b-solver-root .p2b-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    #p2b-solver-root .p2b-btn-copy {
      background: linear-gradient(135deg, #10b981, #059669);
      margin-left: 8px;
    }
    #p2b-solver-root .p2b-btn-copy:hover {
      background: linear-gradient(135deg, #34d399, #10b981);
    }
    #p2b-solver-root .p2b-output {
      margin-top: 16px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 16px;
      display: none;
    }
    #p2b-solver-root .p2b-output.active { display: block; }
    #p2b-solver-root .p2b-output h4 {
      margin: 0 0 8px 0;
      color: #34d399;
      font-size: 14px;
    }
    #p2b-solver-root .p2b-json-output {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #86efac;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 500px;
      overflow-y: auto;
    }
    #p2b-solver-root .p2b-warnings {
      margin-top: 12px;
      background: #1c1917;
      border: 1px solid #78350f;
      border-radius: 6px;
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #fbbf24;
      white-space: pre-wrap;
      display: none;
    }
    #p2b-solver-root .p2b-log {
      margin-top: 12px;
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #94a3b8;
      white-space: pre-wrap;
      max-height: 200px;
      overflow-y: auto;
    }
    #p2b-solver-root .p2b-stats {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    #p2b-solver-root .p2b-stat-badge {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
    }
    #p2b-solver-root .p2b-stat-badge .val { color: #60a5fa; font-weight: 600; }
    #p2b-solver-root .p2b-stat-badge.good .val { color: #34d399; }
    #p2b-solver-root .p2b-stat-badge.ok .val { color: #fbbf24; }
    #p2b-solver-root .p2b-stat-badge.bad .val { color: #f87171; }
    #p2b-solver-root .p2b-note {
      margin-top: 12px;
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
  </style>

  <div class="p2b-header">
    <h3>📊 IITM Discourse KB Solver</h3>
    <p><strong>${topicCount}</strong> topics cached across <strong>${catCount}</strong> categories (frozen 2026-04-25)</p>
    <p>Paste your 50-task assignment below. Supports: standard text blocks, markdown headers, numbered lists, or JSON.</p>
  </div>

  <textarea class="p2b-input-area" id="p2bTaskInput" placeholder="Task 1
System Commands
accepted post id
In the System Commands Discourse category, find the solved topic &quot;Getting Started with Ubuntu...&quot; (posted by PUNEET on 2021-12-28). What is the post ID of the accepted answer?

Task 2
Programming in Python
total posts
What is the total number of posts in the Programming in Python Discourse category between 2023-01-01 and 2024-12-31?

..."></textarea>

  <div>
    <button class="p2b-btn" id="p2bSolveBtn" onclick="window._p2bSolve()">
      ⚡ Solve All Tasks
    </button>
    <button class="p2b-btn p2b-btn-copy" id="p2bCopyBtn" onclick="window._p2bCopy()" style="display:none">
      📋 Copy JSON
    </button>
  </div>

  <div class="p2b-output" id="p2bOutput">
    <div class="p2b-stats" id="p2bStats"></div>
    <pre class="p2b-warnings" id="p2bWarnings"></pre>
    <h4>answers.json — ready to submit</h4>
    <div class="p2b-json-output" id="p2bJsonOutput"></div>
    <div class="p2b-log" id="p2bLog"></div>
    <p class="p2b-note">
      💡 All data is from the frozen 2026-04-25 snapshot. Usernames are case-insensitive on the grader.
      Submit the JSON above as-is to the exam portal.
    </p>
  </div>
</div>`;
}

export function registerInteractive() {
  ensureGlobalHandlers();
}
