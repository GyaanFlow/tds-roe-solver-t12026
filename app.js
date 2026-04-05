// TDS ROE Solver — Main Application
import { solvers } from './solvers/registry.js';

const emailInput = document.getElementById('emailInput');
const solveBtn = document.getElementById('solveBtn');
const loadingEl = document.getElementById('loading');
const loadingFill = document.getElementById('loadingFill');
const loadingText = document.getElementById('loadingText');
const resultsEl = document.getElementById('results');
const solverCountEl = document.getElementById('solverCount');
const copyAllBtn = document.getElementById('copyAllBtn');
const exportMdBtn = document.getElementById('exportMdBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const statsStrip = document.getElementById('statsStrip');
const statTotal = document.getElementById('statTotal');
const statSolved = document.getElementById('statSolved');
const statGuide = document.getElementById('statGuide');
const statBypass = document.getElementById('statBypass');

let lastSolvedEmail = '';

let allAnswers = [];

function escapeHtml(text) {
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 1500);
  });
}

function getBadgeClass(type) {
  if (type === 'solved') return 'badge-solved';
  if (type === 'guide') return 'badge-guide';
  return 'badge-bypass';
}

function getBadgeLabel(type) {
  if (type === 'solved') return '✓ Auto-Solved';
  if (type === 'guide') return '📝 Guide';
  return '⚡ Script';
}

function createCard(index, solver, result) {
  const type = result.type || 'solved';
  const rows = Math.min(14, Math.max(3, result.answer.split('\n').length + 1));
  return `
    <div class="q-card" id="q-${index}" style="animation-delay:${index * 0.06}s">
      <div class="q-header">
        <div class="q-header-left">
          <div class="q-num">${index + 1}</div>
          <span class="q-title">${escapeHtml(solver.title)}</span>
        </div>
        <span class="q-badge ${getBadgeClass(type)}">${getBadgeLabel(type)}</span>
      </div>
      <div class="q-body">
        <div class="variant-info">
          <i class="bi bi-info-circle"></i> ${escapeHtml(result.variant)}
        </div>
        <div class="answer-label"><i class="bi bi-clipboard-data"></i> Answer</div>
        <textarea class="answer-area" readonly spellcheck="false" rows="${rows}">${escapeHtml(result.answer)}</textarea>
        ${result.answerDisplay ? `<div class="answer-display">${result.answerDisplay}</div>` : ''}
      </div>
      <div class="q-footer">
        <button class="btn-copy" data-idx="${index}">
          <i class="bi bi-clipboard"></i> Copy
        </button>
      </div>
    </div>`;
}

function createErrorCard(index, solver, error) {
  return `
    <div class="q-card error-card" id="q-${index}" style="animation-delay:${index * 0.06}s">
      <div class="q-header">
        <div class="q-header-left">
          <div class="q-num">${index + 1}</div>
          <span class="q-title">${escapeHtml(solver.title)}</span>
        </div>
        <span class="q-badge badge-error">✗ Error</span>
      </div>
      <div class="q-body">
        <div class="error-msg"><i class="bi bi-exclamation-triangle"></i> ${escapeHtml(error.message)}</div>
      </div>
    </div>`;
}

window.startSolving = async function() {
  const email = emailInput.value.trim();
  if (!email) { emailInput.focus(); emailInput.style.borderColor = '#f87171'; return; }
  emailInput.style.borderColor = '';

  solveBtn.disabled = true;
  resultsEl.innerHTML = '';
  allAnswers = [];
  lastSolvedEmail = email;
  loadingEl.classList.remove('hidden');
  statsStrip.classList.remove('hidden');
  solverCountEl.classList.remove('hidden');
  copyAllBtn.classList.add('hidden');

  let stats = { solved: 0, guide: 0, bypass: 0 };

  // Build index
  let html = `<div class="index-panel">
    <div class="index-header"><i class="bi bi-list-columns"></i> ROE T1 2026 — ${solvers.length} Questions</div>
    <ul class="index-list">`;
  for (let i = 0; i < solvers.length; i++) {
    html += `<a class="index-item" href="#q-${i}">
      <span class="index-num">${i + 1}</span>
      ${escapeHtml(solvers[i].title)}
    </a>`;
  }
  html += `</ul></div>`;

  let done = 0;
  for (const solver of solvers) {
    const index = solvers.indexOf(solver);
    try {
      const result = await Promise.resolve(solver.solve(email));
      html += createCard(index, solver, result);
      const rType = result.type || 'solved';
      allAnswers.push({ title: solver.title, answer: result.answer, type: rType });
      if (stats[rType] !== undefined) stats[rType]++;
    } catch (err) {
      html += createErrorCard(index, solver, err);
      allAnswers.push({ title: solver.title, answer: `ERROR: ${err.message}`, type: 'error' });
    }
    done++;

    // Update UI
    const pct = Math.round((done / solvers.length) * 100);
    loadingFill.style.width = `${pct}%`;
    loadingText.textContent = `Solving ${done}/${solvers.length}...`;
    statTotal.textContent = done;
    statSolved.textContent = stats.solved;
    statGuide.textContent = stats.guide;
    statBypass.textContent = stats.bypass;
    solverCountEl.textContent = `${done}/${solvers.length}`;
    await new Promise(r => setTimeout(r, 30));
  }

  resultsEl.innerHTML = html;
  loadingEl.classList.add('hidden');
  solverCountEl.textContent = `${solvers.length}/${solvers.length} ✓`;
  solveBtn.disabled = false;
  copyAllBtn.classList.remove('hidden');
  exportMdBtn.classList.remove('hidden');
  exportJsonBtn.classList.remove('hidden');

  // Bind copy buttons
  resultsEl.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      copyToClipboard(allAnswers[idx].answer, btn);
    });
  });
};

// Copy All
copyAllBtn.addEventListener('click', () => {
  const allText = allAnswers.map((a, i) => `=== Q${i+1}: ${a.title} ===\n${a.answer}`).join('\n\n');
  copyToClipboard(allText, copyAllBtn);
});

// ── Bulk Export: Markdown ──
function downloadFile(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

exportMdBtn.addEventListener('click', () => {
  const ts = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
  const emailSlug = lastSolvedEmail.split('@')[0] || 'unknown';
  const stats = { solved: 0, guide: 0, bypass: 0, error: 0 };
  allAnswers.forEach(a => { if (stats[a.type] !== undefined) stats[a.type]++; });

  let md = `# TDS ROE Solver — Answer Export\n\n`;
  md += `- **Email:** \`${lastSolvedEmail}\`\n`;
  md += `- **Date:** ${new Date().toLocaleString()}\n`;
  md += `- **Questions:** ${allAnswers.length}\n`;
  md += `- **Auto-Solved:** ${stats.solved} | **Guides:** ${stats.guide} | **Scripts:** ${stats.bypass}\n\n`;
  md += `---\n\n`;

  allAnswers.forEach((a, i) => {
    const icon = a.type === 'solved' ? '✅' : a.type === 'guide' ? '📝' : a.type === 'bypass' ? '⚡' : '❌';
    md += `## Q${i + 1}: ${a.title} ${icon}\n\n`;
    md += `**Type:** ${a.type}\n\n`;
    md += `\`\`\`\n${a.answer}\n\`\`\`\n\n`;
    md += `---\n\n`;
  });

  downloadFile(`ROE_Answers_${emailSlug}_${ts}.md`, md, 'text/markdown');
  const orig = exportMdBtn.innerHTML;
  exportMdBtn.innerHTML = '<i class="bi bi-check-lg"></i> Downloaded!';
  setTimeout(() => { exportMdBtn.innerHTML = orig; }, 1500);
});

// ── Bulk Export: JSON ──
exportJsonBtn.addEventListener('click', () => {
  const ts = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
  const emailSlug = lastSolvedEmail.split('@')[0] || 'unknown';

  const exportData = {
    email: lastSolvedEmail,
    exportedAt: new Date().toISOString(),
    exam: 'TDS ROE T1 2026',
    totalQuestions: allAnswers.length,
    answers: allAnswers.map((a, i) => ({
      question: i + 1,
      id: solvers[i]?.id || '',
      title: a.title,
      type: a.type,
      answer: a.answer
    }))
  };

  downloadFile(`ROE_Answers_${emailSlug}_${ts}.json`, JSON.stringify(exportData, null, 2), 'application/json');
  const orig = exportJsonBtn.innerHTML;
  exportJsonBtn.innerHTML = '<i class="bi bi-check-lg"></i> Downloaded!';
  setTimeout(() => { exportJsonBtn.innerHTML = orig; }, 1500);
});

// Enter key
emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') window.startSolving(); });
