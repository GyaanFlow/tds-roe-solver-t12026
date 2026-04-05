// TDS Exam Portal — Workspace Application Engine

const emailInput = document.getElementById('emailInput');
const solveBtn = document.getElementById('solveBtn');
const progressPanel = document.getElementById('progressPanel');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const questionNav = document.getElementById('questionNav');
const navTitle = document.getElementById('navTitle');
const solverCountEl = document.getElementById('solverCount');
const exportActions = document.getElementById('exportActions');
const canvas = document.getElementById('canvas');
const exportMdBtn = document.getElementById('exportMdBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const copyAllBtn = document.getElementById('copyAllBtn');

// Stats strip
const workspaceStats = document.getElementById('workspaceStats');
const statSolved = document.getElementById('statSolved');
const statBypass = document.getElementById('statBypass');
const statGuide = document.getElementById('statGuide');

// DOM References
const nodeSearch = document.getElementById('nodeSearch');
const connectionText = document.getElementById('connectionText');
const examSelect = document.getElementById('examSelect');

// Workspace Global State
let workspaceData = {
  exam: null,
  email: '',
  answers: [],
  meta: {}
};

// ── Feature: Session Memory (Load) ──
window.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem('tdsEmail');
  const savedExam = localStorage.getItem('tdsExam');
  if (savedEmail) emailInput.value = savedEmail;
  if (savedExam) examSelect.value = savedExam;
});

function escapeHtml(text) {
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.innerText;
    btn.innerText = 'Copied!';
    setTimeout(() => { btn.innerText = orig; }, 1500);
  });
}

function getStatusClass(type) {
  if (type === 'solved') return 'status-solved';
  if (type === 'guide') return 'status-guide';
  if (type === 'bypass') return 'status-bypass';
  return 'status-error';
}

function renderSidebarNode(index, title, type) {
  const node = document.createElement('div');
  node.className = 'nav-item';
  node.dataset.idx = index;
  node.innerHTML = `
    <span class="nav-item-status ${getStatusClass(type)}"></span>
    <span class="nav-item-num">Q${index + 1}</span>
    <span class="nav-item-title">${escapeHtml(title)}</span>
  `;
  node.addEventListener('click', () => renderCanvas(index));
  return node;
}

// ── Feature: Sidebar Search ──
nodeSearch.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.nav-item').forEach(node => {
    const text = node.innerText.toLowerCase();
    const type = node.querySelector('.nav-item-status').className;
    if (text.includes(term) || type.includes(term)) {
      node.style.display = 'flex';
    } else {
      node.style.display = 'none';
    }
  });
});

function renderCanvas(index) {
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelector(`.nav-item[data-idx="${index}"]`)?.classList.add('active');

  const data = workspaceData.answers[index];
  const typeLabel = data.type === 'solved' ? 'Auto-Solved' : data.type === 'guide' ? 'Manual Guide' : data.type === 'bypass' ? 'Script Bypass' : 'Runtime Error';

  document.getElementById('breadcrumbs').innerHTML = `
    <span class="crumb">tds-portal</span>
    <span class="separator">/</span>
    <span class="crumb">${workspaceData.exam}</span>
    <span class="separator">/</span>
    <span class="crumb">Q${index + 1}</span>
  `;

  // ── Feature: Syntax Highlighting ──
  let displayCode = escapeHtml(data.answer);
  let langClass = '';
  
  if (data.answer.trim().startsWith('{') || data.answer.trim().startsWith('[')) {
    langClass = 'language-json';
  } else if (data.answer.includes('def ') || data.answer.includes('import ') || data.answer.includes('print(')) {
    langClass = 'language-python';
  }

  const containerContent = langClass 
    ? `<pre class="raw-output" style="padding:0;"><code class="${langClass}" style="background:transparent; border:none; box-shadow:none;">${displayCode}</code></pre>`
    : `<textarea class="raw-output" readonly spellcheck="false">${displayCode}</textarea>`;

  canvas.innerHTML = `
    <div class="canvas-header">
      <div class="canvas-label">System Output — ${typeLabel}</div>
      <h2 class="canvas-title">${escapeHtml(data.title)}</h2>
      <div class="canvas-variant"><span style="color:var(--text-muted)">›</span> ${escapeHtml(data.variant || 'No variant info')}</div>
    </div>
    <div class="canvas-body">
      <div class="code-container">
        <button class="copy-trigger" id="copyCurrent">Copy Context</button>
        ${containerContent}
      </div>
      ${data.answerDisplay ? `<div class="styled-output">${data.answerDisplay}</div>` : ''}
    </div>
  `;

  // Trigger Prism if loaded
  if (langClass && window.Prism) {
    Prism.highlightAllUnder(canvas);
  }

  document.getElementById('copyCurrent').addEventListener('click', (e) => {
    copyToClipboard(data.answer, e.target);
  });
}

window.startSolving = async function() {
  const email = emailInput.value.trim();
  const currentExam = examSelect.value;
  
  if (!email) { emailInput.focus(); emailInput.style.borderColor = 'var(--error)'; return; }
  emailInput.style.borderColor = 'var(--border)';

  // ── Feature: Session Memory (Save) ──
  localStorage.setItem('tdsEmail', email);
  localStorage.setItem('tdsExam', currentExam);

  // Reset UI
  solveBtn.disabled = true;
  solveBtn.innerText = 'Initializing...';
  questionNav.innerHTML = '';
  canvas.innerHTML = '';
  exportActions.classList.add('hidden');
  workspaceStats.classList.add('hidden');
  nodeSearch.classList.add('hidden');
  nodeSearch.value = '';
  navTitle.classList.remove('hidden');
  progressPanel.classList.remove('hidden');
  connectionText.innerText = "Execution running...";
  
  workspaceData = { exam: currentExam, email: email, answers: [] };
  let statsTracker = { solved: 0, bypass: 0, guide: 0 };
  let startTime = performance.now();

  try {
    // Load modules
    let solvers = [];
    try {
      const registryModule = await import(`./solvers/${currentExam}/registry.js`);
      solvers = registryModule.solvers;
    } catch(e) {
      throw new Error(`CRITICAL SYSTEM FAULT: Failed to fetch module registry for ${currentExam}. Target may be missing or corrupt.`);
    }

    let done = 0;
    
    for (const solver of solvers) {
      try {
        const result = await Promise.resolve(solver.solve(email));
        workspaceData.answers.push({
          title: solver.title,
          answer: result.answer,
          type: result.type || 'solved',
          variant: result.variant,
          answerDisplay: result.answerDisplay
        });
      } catch (err) {
        workspaceData.answers.push({
          title: solver.title,
          answer: `ERROR: ${err.message}`,
          type: 'error',
          variant: 'Failed to compute during execution loop',
        });
      }

      const lastType = workspaceData.answers[workspaceData.answers.length - 1].type;
      if (statsTracker[lastType] !== undefined) statsTracker[lastType]++;
      
      done++;
      progressFill.style.width = `${Math.round((done / solvers.length) * 100)}%`;
      progressText.innerText = `Compiled ${done} / ${solvers.length} nodes...`;
      solverCountEl.innerText = done;
      
      // Add to sidebar incrementally
      const latestAns = workspaceData.answers[workspaceData.answers.length - 1];
      questionNav.appendChild(renderSidebarNode(done - 1, latestAns.title, latestAns.type));
      
      await new Promise(r => setTimeout(r, 40));
    }

    // Finalize Success
    const endTime = performance.now();
    const diffMs = (endTime - startTime).toFixed(1);
    connectionText.innerText = `Workspace compiled in ${diffMs}ms via local engine`;

    progressPanel.classList.add('hidden');
    solveBtn.disabled = false;
    solveBtn.innerText = 'Workspace Active';
    exportActions.classList.remove('hidden');
    workspaceStats.classList.remove('hidden');
    nodeSearch.classList.remove('hidden');
    
    statSolved.innerText = statsTracker.solved;
    statBypass.innerText = statsTracker.bypass;
    statGuide.innerText = statsTracker.guide;
    
    // Render first node automatically
    if (workspaceData.answers.length > 0) {
      renderCanvas(0);
    }

  } catch (fatalError) {
    // ── Global Error Boundary ──
    progressPanel.classList.add('hidden');
    solveBtn.disabled = false;
    solveBtn.innerText = 'Generate Workspace';
    connectionText.innerText = 'Connection fault';
    connectionText.previousElementSibling.className = 'dot error';
    
    workspaceData.answers.push({
      title: 'Global Execution Failure',
      answer: `CRASH REPORT:\n\n${fatalError.message}\n\nStack Trace:\n${fatalError.stack}`,
      type: 'error',
      variant: 'System halted'
    });
    questionNav.appendChild(renderSidebarNode(0, 'System Fault', 'error'));
    renderCanvas(0);
  }
};

document.getElementById('solveBtn').addEventListener('click', window.startSolving);
emailInput.addEventListener('keydown', e => { if (e.key === 'Enter') window.startSolving(); });

// ── Exporters ──
function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

copyAllBtn.addEventListener('click', () => {
  const allText = workspaceData.answers.map((a, i) => `=== Q${i+1}: ${a.title} ===\n${a.answer}`).join('\n\n');
  copyToClipboard(allText, copyAllBtn);
});

exportMdBtn.addEventListener('click', () => {
  let md = `# Workspace Export | ${workspaceData.exam.toUpperCase()}\n`;
  md += `**Email:** \`${workspaceData.email}\`\n\n---\n\n`;
  workspaceData.answers.forEach((a, i) => {
    md += `### [${a.type.toUpperCase()}] Q${i+1}: ${a.title}\n\`\`\`\n${a.answer}\n\`\`\`\n\n`;
  });
  downloadFile(`workspace_${workspaceData.exam}.md`, md, 'text/markdown');
});

exportJsonBtn.addEventListener('click', () => {
  downloadFile(`workspace_${workspaceData.exam}.json`, JSON.stringify(workspaceData, null, 2), 'application/json');
});
