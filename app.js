// TDS Exam Portal - Workspace Application Engine

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
const workspaceStats = document.getElementById('workspaceStats');
const statSolved = document.getElementById('statSolved');
const statBypass = document.getElementById('statBypass');
const statGuide = document.getElementById('statGuide');
const nodeSearch = document.getElementById('nodeSearch');
const connectionText = document.getElementById('connectionText');
const examSelect = document.getElementById('examSelect');
const breadcrumbs = document.getElementById('breadcrumbs');
const sidebar = document.getElementById('sidebar');
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileQuestionPicker = document.getElementById('mobileQuestionPicker');
const mobileQuestionPickerWrap = document.getElementById('mobileQuestionPickerWrap');

let workspaceData = {
  exam: null,
  email: '',
  answers: [],
  meta: {}
};

const STORAGE_KEYS = {
  exam: 'tdsExam',
  email: 'tdsEmail',
  search: 'tdsNodeSearch',
  selectedQuestion: 'tdsSelectedQuestion',
  rawWrap: 'tdsRawWrap',
  openPanels: 'tdsOpenPanels'
};

let selectedQuestionIndex = 0;
let rawWrapEnabled = true;
let searchDebounceId = null;
let mobileNavOpen = false;
let toastTimerId = null;
let toastRoot = null;
let openPanels = new Set(['Variant', 'Preview', 'Answer', 'Diagnostics']);

window.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem(STORAGE_KEYS.email);
  const savedExam = localStorage.getItem(STORAGE_KEYS.exam);
  const savedSearch = localStorage.getItem(STORAGE_KEYS.search);
  const savedSelectedQuestion = Number(localStorage.getItem(STORAGE_KEYS.selectedQuestion));
  const savedRawWrap = localStorage.getItem(STORAGE_KEYS.rawWrap);
  const savedOpenPanels = localStorage.getItem(STORAGE_KEYS.openPanels);
  if (savedEmail) emailInput.value = savedEmail;
  if (savedExam) examSelect.value = savedExam;
  if (savedSearch) nodeSearch.value = savedSearch;
  if (Number.isInteger(savedSelectedQuestion) && savedSelectedQuestion >= 0) {
    selectedQuestionIndex = savedSelectedQuestion;
  }
  if (savedRawWrap === 'false') {
    rawWrapEnabled = false;
  }
  if (savedOpenPanels) {
    try {
      const parsed = JSON.parse(savedOpenPanels);
      if (Array.isArray(parsed) && parsed.length) {
        openPanels = new Set(parsed);
      }
    } catch (_) {
      openPanels = new Set(['Variant', 'Preview', 'Answer', 'Diagnostics']);
    }
  }
  ensureToastRoot();
});

function persistUiState() {
  localStorage.setItem(STORAGE_KEYS.exam, examSelect.value);
  localStorage.setItem(STORAGE_KEYS.email, emailInput.value.trim());
  localStorage.setItem(STORAGE_KEYS.search, nodeSearch.value);
  localStorage.setItem(STORAGE_KEYS.selectedQuestion, String(selectedQuestionIndex));
  localStorage.setItem(STORAGE_KEYS.rawWrap, String(rawWrapEnabled));
  localStorage.setItem(STORAGE_KEYS.openPanels, JSON.stringify([...openPanels]));
}

function ensureToastRoot() {
  if (toastRoot) return toastRoot;
  toastRoot = document.createElement('div');
  toastRoot.className = 'toast-stack';
  toastRoot.setAttribute('aria-live', 'polite');
  toastRoot.setAttribute('aria-atomic', 'true');
  document.body.appendChild(toastRoot);
  return toastRoot;
}

function showToast(message, tone = 'info') {
  const host = ensureToastRoot();
  window.clearTimeout(toastTimerId);
  host.innerHTML = `
    <div class="toast toast-${tone}">
      <span class="toast-message">${escapeHtml(message)}</span>
    </div>
  `;

  const toast = host.firstElementChild;
  window.requestAnimationFrame(() => toast?.classList.add('toast-visible'));
  toastTimerId = window.setTimeout(() => {
    toast?.classList.remove('toast-visible');
    window.setTimeout(() => {
      if (host.contains(toast)) {
        host.innerHTML = '';
      }
    }, 220);
  }, 2200);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setButtonFlash(btn, label) {
  if (!btn) return;
  const original = btn.dataset.originalLabel || btn.innerText;
  btn.dataset.originalLabel = original;
  btn.innerText = label;
  window.setTimeout(() => {
    btn.innerText = btn.dataset.originalLabel || original;
  }, 1500);
}

async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    setButtonFlash(btn, 'Copied!');
    showToast('Copied to clipboard.', 'success');
    return true;
  } catch (_) {
    try {
      const ghost = document.createElement('textarea');
      ghost.value = text;
      ghost.setAttribute('readonly', 'true');
      ghost.style.position = 'fixed';
      ghost.style.opacity = '0';
      document.body.appendChild(ghost);
      ghost.select();
      document.execCommand('copy');
      document.body.removeChild(ghost);
      setButtonFlash(btn, 'Copied!');
      showToast('Copied to clipboard.', 'success');
      return true;
    } catch (fallbackError) {
      console.error('Clipboard copy failed', fallbackError);
      setButtonFlash(btn, 'Copy failed');
      showToast('Clipboard copy failed.', 'error');
      return false;
    }
  }
}

function getStatusClass(type) {
  if (type === 'solved') return 'status-solved';
  if (type === 'guide') return 'status-guide';
  if (type === 'bypass') return 'status-bypass';
  return 'status-error';
}

function getVisibleNavItems() {
  return [...document.querySelectorAll('.nav-item')].filter((node) => node.style.display !== 'none');
}

function getHealthMeta(answer) {
  const warningCount = answer?.debug?.warnings?.length || 0;
  const durationText = answer?.debug?.durationText || 'n/a';
  let level = 'stable';

  if (answer?.type === 'error') {
    level = 'error';
  } else if (answer?.type === 'bypass' || answer?.type === 'guide' || warningCount > 0) {
    level = 'watch';
  }

  return { warningCount, durationText, level };
}

function getHealthLabel(level) {
  if (level === 'error') return 'Error';
  if (level === 'watch') return 'Check';
  return 'Stable';
}

function detectLanguage(answer) {
  const trimmed = answer.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'language-json';
  if (answer.includes('def ') || answer.includes('import ') || answer.includes('print(')) return 'language-python';
  return '';
}

function isHtmlDocument(answer) {
  return answer.trim().toLowerCase().startsWith('<!doctype html>');
}

function getSelectedAnswer() {
  return workspaceData.answers[selectedQuestionIndex] || null;
}

function isMobileLayout() {
  return window.matchMedia('(max-width: 760px)').matches;
}

function syncMobileNavState() {
  const shouldShow = isMobileLayout();
  mobileNavToggle.classList.toggle('hidden', !shouldShow);
  mobileQuestionPickerWrap.classList.toggle('hidden', !shouldShow || workspaceData.answers.length === 0);

  if (!shouldShow) {
    mobileNavOpen = false;
  }

  sidebar.classList.toggle('mobile-open', shouldShow && mobileNavOpen);
  mobileOverlay.classList.toggle('hidden', !(shouldShow && mobileNavOpen));
  mobileOverlay.setAttribute('aria-hidden', shouldShow && mobileNavOpen ? 'false' : 'true');
  mobileNavToggle.setAttribute('aria-expanded', shouldShow && mobileNavOpen ? 'true' : 'false');
}

function setMobileNavOpen(nextOpen) {
  mobileNavOpen = nextOpen;
  syncMobileNavState();
}

function populateMobileQuestionPicker() {
  if (!mobileQuestionPicker) return;
  mobileQuestionPicker.innerHTML = workspaceData.answers.map((answer, index) => (
    `<option value="${index}">Q${index + 1} - ${escapeHtml(answer.title)}</option>`
  )).join('');
  mobileQuestionPicker.value = String(selectedQuestionIndex);
}

function renderSidebarNode(index, title, type) {
  const answer = workspaceData.answers[index];
  const health = getHealthMeta(answer);
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'nav-item';
  node.dataset.idx = String(index);
  node.dataset.health = health.level;
  node.innerHTML = `
    <span class="nav-item-status ${getStatusClass(type)}"></span>
    <span class="nav-item-num">Q${index + 1}</span>
    <span class="nav-item-copy">
      <span class="nav-item-title">${escapeHtml(title)}</span>
      <span class="nav-item-meta">
        <span class="nav-pill nav-pill-${health.level}">${getHealthLabel(health.level)}</span>
        <span class="nav-runtime">${escapeHtml(health.durationText)}</span>
        ${health.warningCount ? `<span class="nav-warning-count">${health.warningCount} warning${health.warningCount > 1 ? 's' : ''}</span>` : ''}
      </span>
    </span>
  `;
  node.addEventListener('click', () => renderCanvas(index));
  return node;
}

function applySidebarFilter(term) {
  document.querySelectorAll('.nav-item').forEach((node) => {
    const text = node.innerText.toLowerCase();
    const type = node.querySelector('.nav-item-status').className;
    const health = node.dataset.health || '';
    node.style.display = text.includes(term) || type.includes(term) || health.includes(term) ? 'flex' : 'none';
  });

  const activeNode = document.querySelector(`.nav-item[data-idx="${selectedQuestionIndex}"]`);
  if (activeNode && activeNode.style.display !== 'none') {
    activeNode.scrollIntoView({ block: 'nearest' });
    return;
  }

  const firstVisible = getVisibleNavItems()[0];
  if (firstVisible) {
    selectedQuestionIndex = Number(firstVisible.dataset.idx);
  }
}

function moveSelection(delta) {
  const visibleItems = getVisibleNavItems();
  if (!visibleItems.length) return;

  const currentPos = visibleItems.findIndex((node) => Number(node.dataset.idx) === selectedQuestionIndex);
  const nextPos = currentPos === -1 ? 0 : Math.max(0, Math.min(visibleItems.length - 1, currentPos + delta));
  renderCanvas(Number(visibleItems[nextPos].dataset.idx));
}

function createSection(title, body, options = {}) {
  const { open = false, compact = false, extraClass = '' } = options;
  const isOpen = openPanels.has(title) || open;
  return `
    <details class="panel-section ${compact ? 'panel-section-compact' : ''} ${extraClass}" data-panel-title="${escapeHtml(title)}" ${isOpen ? 'open' : ''}>
      <summary>${escapeHtml(title)}</summary>
      <div class="panel-section-body">${body}</div>
    </details>
  `;
}

function renderVariantPanel(data) {
  return createSection(
    'Variant',
    `<pre class="meta-output">${escapeHtml(data.variant || 'No variant info')}</pre>`,
    { open: true, compact: true }
  );
}

function renderPreviewPanel(data) {
  if (!isHtmlDocument(data.answer)) return '';
  return createSection(
    'Preview',
    `<iframe class="answer-preview" sandbox="allow-scripts allow-same-origin" srcdoc="${escapeHtml(data.answer)}"></iframe>`,
    { open: true }
  );
}

function renderAnswerPanel(data, langClass) {
  const escapedAnswer = escapeHtml(data.answer);
  const wrapClass = rawWrapEnabled ? 'raw-output-pre' : 'raw-output-nowrap';
  const answerMarkup = langClass
    ? `<pre class="raw-output"><code class="${langClass}" style="background:transparent; border:none; box-shadow:none;">${escapedAnswer}</code></pre>`
    : `<pre class="raw-output ${wrapClass}">${escapedAnswer}</pre>`;

  const actions = `
    <div class="panel-actions">
      <button class="btn-ghost panel-btn" id="copyAnswerBtn">Copy Answer</button>
      <button class="btn-ghost panel-btn" id="copyVariantBtn">Copy Variant</button>
      <button class="btn-ghost panel-btn" id="toggleWrapBtn">${rawWrapEnabled ? 'No Wrap' : 'Wrap Lines'}</button>
    </div>
  `;

  return createSection('Answer', `${actions}${answerMarkup}`, { open: true });
}

function renderNotesPanel(data) {
  if (!data.answerDisplay) return '';
  return createSection('Rendered Notes', `<div class="styled-output">${data.answerDisplay}</div>`);
}

function renderDiagnosticsPanel(debug) {
  if (!debug) return '';

  const warnings = debug.warnings?.length
    ? debug.warnings.map((warning) => escapeHtml(warning)).join('<br>')
    : 'None';

  return createSection(
    'Diagnostics',
    `
      <div class="diagnostic-grid">
        <div><strong>solverId</strong><br><code>${escapeHtml(debug.solverId || 'unknown')}</code></div>
        <div><strong>normalizedEmail</strong><br><code>${escapeHtml(debug.normalizedEmail || 'n/a')}</code></div>
        <div><strong>duration</strong><br><code>${escapeHtml(debug.durationText || 'n/a')}</code></div>
      </div>
      <div class="diagnostic-block"><strong>Warnings</strong><br>${warnings}</div>
    `
  );
}

function bindCanvasActions(data) {
  document.getElementById('copyAnswerBtn')?.addEventListener('click', (event) => {
    copyToClipboard(data.answer, event.currentTarget);
  });
  document.getElementById('copyVariantBtn')?.addEventListener('click', (event) => {
    copyToClipboard(data.variant || '', event.currentTarget);
  });
  document.getElementById('toggleWrapBtn')?.addEventListener('click', () => {
    rawWrapEnabled = !rawWrapEnabled;
    persistUiState();
    renderCanvas(selectedQuestionIndex);
  });
  canvas.querySelectorAll('.panel-section').forEach((section) => {
    section.addEventListener('toggle', () => {
      const title = section.dataset.panelTitle;
      if (!title) return;
      if (section.open) openPanels.add(title);
      else openPanels.delete(title);
      persistUiState();
    });
  });
}

function renderCanvas(index) {
  const data = workspaceData.answers[index];
  if (!data) return;

  selectedQuestionIndex = index;
  persistUiState();

  document.querySelectorAll('.nav-item').forEach((el) => el.classList.remove('active'));
  const activeNode = document.querySelector(`.nav-item[data-idx="${index}"]`);
  activeNode?.classList.add('active');
  activeNode?.scrollIntoView({ block: 'nearest' });
  if (mobileQuestionPicker && mobileQuestionPicker.options.length) {
    mobileQuestionPicker.value = String(index);
  }

  const typeLabel = data.type === 'solved'
    ? 'Auto-Solved'
    : data.type === 'guide'
      ? 'Manual Guide'
      : data.type === 'bypass'
        ? 'Script Bypass'
        : 'Runtime Error';

  breadcrumbs.innerHTML = `
    <span class="crumb">tds-portal</span>
    <span class="separator">/</span>
    <span class="crumb">${escapeHtml(workspaceData.exam || 'workspace')}</span>
    <span class="separator">/</span>
    <span class="crumb">Q${index + 1}</span>
  `;

  const langClass = detectLanguage(data.answer);
  const health = getHealthMeta(data);

  canvas.innerHTML = `
    <div class="canvas-header">
      <div class="canvas-label">System Output | ${escapeHtml(typeLabel)}</div>
      <h2 class="canvas-title">${escapeHtml(data.title)}</h2>
      <div class="canvas-subtitle">
        <span class="canvas-chip">${escapeHtml(workspaceData.exam || 'workspace')}</span>
        <span class="canvas-chip">Question ${index + 1}</span>
        <span class="canvas-chip">${escapeHtml(data.type)}</span>
        <span class="canvas-chip canvas-chip-${health.level}">${getHealthLabel(health.level)}</span>
        <span class="canvas-chip">${escapeHtml(health.durationText)}</span>
        ${health.warningCount ? `<span class="canvas-chip canvas-chip-warning">${health.warningCount} warning${health.warningCount > 1 ? 's' : ''}</span>` : ''}
      </div>
    </div>
    <div class="canvas-body">
      ${renderVariantPanel(data)}
      ${renderPreviewPanel(data)}
      ${renderAnswerPanel(data, langClass)}
      ${renderNotesPanel(data)}
      ${renderDiagnosticsPanel(data.debug)}
    </div>
  `;

  canvas.scrollTo({ top: 0, behavior: 'auto' });

  if (langClass && window.Prism) {
    Prism.highlightAllUnder(canvas);
  }

  bindCanvasActions(data);

  if (isMobileLayout()) {
    setMobileNavOpen(false);
  }
}

async function startSolving() {
  const email = emailInput.value.trim();
  const currentExam = examSelect.value;
  const preferredQuestionIndex = selectedQuestionIndex;

  if (!email) {
    emailInput.focus();
    emailInput.style.borderColor = 'var(--error)';
    return;
  }

  emailInput.style.borderColor = 'var(--border)';
  localStorage.setItem(STORAGE_KEYS.email, email);
  localStorage.setItem(STORAGE_KEYS.exam, currentExam);

  solveBtn.disabled = true;
  solveBtn.innerText = 'Initializing...';
  questionNav.innerHTML = '';
  canvas.innerHTML = '';
  exportActions.classList.add('hidden');
  workspaceStats.classList.add('hidden');
  nodeSearch.classList.add('hidden');
  navTitle.classList.add('hidden');
  nodeSearch.value = '';
  progressPanel.classList.remove('hidden');
  connectionText.innerText = 'Execution running...';

  selectedQuestionIndex = 0;
  workspaceData = { exam: currentExam, email, answers: [], meta: {} };
  setMobileNavOpen(false);
  persistUiState();

  const statsTracker = { solved: 0, bypass: 0, guide: 0 };
  const startTime = performance.now();

  try {
    let solvers = [];
    try {
      const registryModule = await import(`./solvers/${currentExam}/registry.js`);
      solvers = registryModule.solvers;
    } catch (_) {
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
          answerDisplay: result.answerDisplay,
          debug: result.debug
        });
      } catch (error) {
        workspaceData.answers.push({
          title: solver.title,
          answer: `ERROR: ${error.message}`,
          type: 'error',
          variant: 'Failed to compute during execution loop',
          debug: {
            solverId: solver.id || solver.title,
            normalizedEmail: email,
            warnings: ['Solver execution failed before returning a valid result.'],
            durationText: 'n/a'
          }
        });
      }

      const latestAnswer = workspaceData.answers[workspaceData.answers.length - 1];
      if (statsTracker[latestAnswer.type] !== undefined) {
        statsTracker[latestAnswer.type] += 1;
      }

      done += 1;
      progressFill.style.width = `${Math.round((done / solvers.length) * 100)}%`;
      progressText.innerText = `Compiled ${done} / ${solvers.length} nodes...`;
      solverCountEl.innerText = String(done);
      questionNav.appendChild(renderSidebarNode(done - 1, latestAnswer.title, latestAnswer.type));
      populateMobileQuestionPicker();
      persistUiState();

      await new Promise((resolve) => window.setTimeout(resolve, 40));
    }

    const diffMs = (performance.now() - startTime).toFixed(1);
    connectionText.innerText = `Workspace compiled in ${diffMs}ms via local engine`;
    progressPanel.classList.add('hidden');
    solveBtn.disabled = false;
    solveBtn.innerText = 'Workspace Active';
    exportActions.classList.remove('hidden');
    workspaceStats.classList.remove('hidden');
    navTitle.classList.remove('hidden');
    nodeSearch.classList.remove('hidden');
    statSolved.innerText = String(statsTracker.solved);
    statBypass.innerText = String(statsTracker.bypass);
    statGuide.innerText = String(statsTracker.guide);

    if (workspaceData.answers.length > 0) {
      selectedQuestionIndex = Math.min(preferredQuestionIndex, workspaceData.answers.length - 1);
      populateMobileQuestionPicker();
      renderCanvas(selectedQuestionIndex);
      showToast(`Workspace ready. ${workspaceData.answers.length} questions loaded.`, 'success');
    }
  } catch (fatalError) {
    progressPanel.classList.add('hidden');
    solveBtn.disabled = false;
    solveBtn.innerText = 'Generate Workspace';
    connectionText.innerText = 'Connection fault';

    workspaceData.answers.push({
      title: 'Global Execution Failure',
      answer: `CRASH REPORT:\n\n${fatalError.message}\n\nStack Trace:\n${fatalError.stack}`,
      type: 'error',
      variant: 'System halted',
      debug: {
        solverId: 'global',
        normalizedEmail: email,
        warnings: ['Workspace initialization failed before solver execution completed.'],
        durationText: 'n/a'
      }
    });

    questionNav.appendChild(renderSidebarNode(0, 'System Fault', 'error'));
    navTitle.classList.remove('hidden');
    nodeSearch.classList.remove('hidden');
    populateMobileQuestionPicker();
    renderCanvas(0);
    showToast('Workspace initialization failed.', 'error');
  }
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

nodeSearch.addEventListener('input', (event) => {
  clearTimeout(searchDebounceId);
  const term = event.target.value.toLowerCase();
  localStorage.setItem(STORAGE_KEYS.search, term);
  searchDebounceId = window.setTimeout(() => applySidebarFilter(term), 80);
});

nodeSearch.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveSelection(1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveSelection(-1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    renderCanvas(selectedQuestionIndex);
  }
});

mobileNavToggle?.addEventListener('click', () => {
  setMobileNavOpen(!mobileNavOpen);
});

mobileOverlay?.addEventListener('click', () => {
  setMobileNavOpen(false);
});

mobileQuestionPicker?.addEventListener('change', (event) => {
  const nextIndex = Number(event.target.value);
  if (Number.isFinite(nextIndex)) {
    renderCanvas(nextIndex);
  }
});

document.addEventListener('keydown', (event) => {
  if (!workspaceData.answers.length) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  const tagName = document.activeElement?.tagName;
  const isTypingField = tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
  if (isTypingField && document.activeElement !== nodeSearch) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveSelection(1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveSelection(-1);
  } else if (event.key === 'Escape' && mobileNavOpen) {
    event.preventDefault();
    setMobileNavOpen(false);
  }
});

solveBtn.addEventListener('click', startSolving);
emailInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') startSolving();
});
examSelect.addEventListener('change', persistUiState);
emailInput.addEventListener('input', persistUiState);

copyAllBtn.addEventListener('click', (event) => {
  const allText = workspaceData.answers.map((answer, index) => `=== Q${index + 1}: ${answer.title} ===\n${answer.answer}`).join('\n\n');
  copyToClipboard(allText, event.currentTarget);
});

exportMdBtn.addEventListener('click', () => {
  let md = `# Workspace Export | ${String(workspaceData.exam || '').toUpperCase()}\n`;
  md += `**Email:** \`${workspaceData.email}\`\n\n---\n\n`;
  workspaceData.answers.forEach((answer, index) => {
    md += `### [${answer.type.toUpperCase()}] Q${index + 1}: ${answer.title}\n\`\`\`\n${answer.answer}\n\`\`\`\n\n`;
  });
  downloadFile(`workspace_${workspaceData.exam}.md`, md, 'text/markdown');
  showToast('Markdown export downloaded.', 'success');
});

exportJsonBtn.addEventListener('click', () => {
  downloadFile(`workspace_${workspaceData.exam}.json`, JSON.stringify(workspaceData, null, 2), 'application/json');
  showToast('JSON export downloaded.', 'success');
});

window.addEventListener('resize', syncMobileNavState);
syncMobileNavState();
applySidebarFilter(nodeSearch.value.trim().toLowerCase());
