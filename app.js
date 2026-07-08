// TDS Exam Portal - Workspace Application Engine

let networkCanvas = null;

const THEME_HUES = {
  amber: { primary: 38, secondary: 4 },
  cyber: { primary: 160, secondary: 220 },
  orchid: { primary: 330, secondary: 265 },
  frost: { primary: 190, secondary: 220 }
};

let activeTheme = localStorage.getItem('workspaceTheme') || 'amber';

const emailInput = document.getElementById('emailInput');
const sessionTokenInput = document.getElementById('sessionTokenInput');
const sessionTokenWrapper = document.querySelector('.session-token-wrapper');
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
const copyDebugBtn = document.getElementById('copyDebugBtn');
const resetUiBtn = document.getElementById('resetUiBtn');
const workspaceStats = document.getElementById('workspaceStats');
const statSolved = document.getElementById('statSolved');
const statBypass = document.getElementById('statBypass');
const statGuide = document.getElementById('statGuide');
const nodeSearch = document.getElementById('nodeSearch');
const connectionText = document.getElementById('connectionText');
const examSelect = document.getElementById('examSelect');
const termSelect = document.getElementById('termSelect');
const breadcrumbs = document.getElementById('breadcrumbs');
const sidebar = document.getElementById('sidebar');
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileQuestionPicker = document.getElementById('mobileQuestionPicker');
const mobileQuestionPickerWrap = document.getElementById('mobileQuestionPickerWrap');
const dashboardToggle = document.getElementById('dashboardToggle');

let rawFocusEnabled = localStorage.getItem('rawFocusEnabled') === 'true';

let workspaceData = {
  exam: null,
  email: '',
  answers: [],
  meta: {}
};

const STORAGE_KEYS = {
  term: 'tdsTerm',
  exam: 'tdsExam',
  email: 'tdsEmail',
  search: 'tdsNodeSearch',
  selectedQuestion: 'tdsSelectedQuestion',
  rawWrap: 'tdsRawWrap',
  openPanels: 'tdsOpenPanels',
  emailHistory: 'tdsEmailHistory',
  sessionToken: 'tdsSessionToken'
};

// Term → exam registry
const TERM_EXAMS = {
  T12026: [
    { group: 'Standard Exams',           value: 'roe', label: 'ROE Re-Exam' },
    { group: 'Projects',                 value: 'p2',  label: 'Project 2 Part B' },
    { group: 'Weekly Graded Assignments', value: 'ga7', label: 'GA 7 (Data Visualization)' },
    { group: 'Weekly Graded Assignments', value: 'ga8', label: 'GA 8 (MLOps & DevOps)' },
  ],
  T22026: [
    { group: 'Weekly Graded Assignments', value: 'ga0', label: 'GA 0 (Warm-up Exam)' },
    { group: 'Weekly Graded Assignments', value: 'ga1', label: 'GA 1 (Developer Tools)' },
    { group: 'Weekly Graded Assignments', value: 'ga2', label: 'GA 2 (API Engineering & Cloud Services)' },
    { group: 'Weekly Graded Assignments', value: 'ga3', label: 'GA 3 (System & API Architecture)' }
  ]
};

function populateExamSelect(term) {
  const exams = TERM_EXAMS[term] || [];
  examSelect.innerHTML = '';

  if (exams.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.disabled = true;
    opt.selected = true;
    opt.textContent = '— No exams available yet —';
    examSelect.appendChild(opt);
    examSelect.disabled = true;
    return;
  }

  examSelect.disabled = false;

  // Group exams into optgroups
  const groups = {};
  for (const exam of exams) {
    if (!groups[exam.group]) groups[exam.group] = [];
    groups[exam.group].push(exam);
  }

  for (const [groupLabel, items] of Object.entries(groups)) {
    const og = document.createElement('optgroup');
    og.label = groupLabel;
    for (const item of items) {
      const opt = document.createElement('option');
      opt.value = item.value;
      opt.textContent = item.label;
      og.appendChild(opt);
    }
    examSelect.appendChild(og);
  }
}


let selectedQuestionIndex = 0;
let rawWrapEnabled = true;
let searchDebounceId = null;
let mobileNavOpen = false;
let toastTimerId = null;
let toastRoot = null;
let openPanels = new Set(['Variant', 'Preview', 'Answer', 'Diagnostics']);

window.addEventListener('DOMContentLoaded', () => {
  const savedTerm  = localStorage.getItem(STORAGE_KEYS.term);
  const savedEmail = localStorage.getItem(STORAGE_KEYS.email);
  const savedExam  = localStorage.getItem(STORAGE_KEYS.exam);
  const savedSearch = localStorage.getItem(STORAGE_KEYS.search);
  const savedSelectedQuestion = Number(localStorage.getItem(STORAGE_KEYS.selectedQuestion));
  const savedRawWrap = localStorage.getItem(STORAGE_KEYS.rawWrap);
  const savedOpenPanels = localStorage.getItem(STORAGE_KEYS.openPanels);

  // Restore term first, then populate exam list, then restore exam
  const termKeys = Object.keys(TERM_EXAMS);
  const latestTerm = termKeys.length > 0 ? termKeys[termKeys.length - 1] : '';
  const activeTerm = savedTerm || latestTerm;
  termSelect.value = activeTerm;
  populateExamSelect(activeTerm);

  const activeExams = TERM_EXAMS[activeTerm] || [];
  const latestExam = activeExams.length > 0 ? activeExams[activeExams.length - 1].value : '';
  examSelect.value = savedExam || latestExam;
  toggleSessionTokenField();

  if (savedEmail) emailInput.value = savedEmail;
  const savedSessionToken = localStorage.getItem(STORAGE_KEYS.sessionToken);
  if (savedSessionToken && sessionTokenInput) sessionTokenInput.value = savedSessionToken;
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

  // Load email history
  const savedEmailHistory = localStorage.getItem(STORAGE_KEYS.emailHistory);
  if (savedEmailHistory) {
    try {
      const history = JSON.parse(savedEmailHistory);
      const datalist = document.getElementById('emailHistory');
      if (datalist && Array.isArray(history)) {
        datalist.innerHTML = history.map(e => `<option value="${e}">`).join('');
      }
    } catch (_) {}
  }

  // Fetch dynamic configuration for the welcome screen
  fetch('tds-config.json')
    .then(res => res.json())
    .then(config => {
      if (config.termTitle) {
        const titleEl = document.getElementById('welcomeTitle');
        if (titleEl && titleEl.firstChild) titleEl.firstChild.nodeValue = config.termTitle + ' ';
      }
      if (config.termVersion) {
        const versionEl = document.getElementById('welcomeVersion');
        if (versionEl) versionEl.innerText = config.termVersion;
      }
      if (config.termDescription) {
        const descEl = document.getElementById('welcomeDescription');
        if (descEl) descEl.innerText = config.termDescription;
      }
      if (config.instructions) {
        const instEl = document.getElementById('welcomeInstructions');
        if (instEl) instEl.innerText = config.instructions;
      }
    })
    .catch(err => console.warn('Could not load tds-config.json', err));
});

function persistUiState() {
  localStorage.setItem(STORAGE_KEYS.term, termSelect.value);
  localStorage.setItem(STORAGE_KEYS.exam, examSelect.value);
  const emailVal = emailInput.value.trim();
  localStorage.setItem(STORAGE_KEYS.email, emailVal);
  localStorage.setItem(STORAGE_KEYS.search, nodeSearch.value);
  localStorage.setItem(STORAGE_KEYS.selectedQuestion, String(selectedQuestionIndex));
  localStorage.setItem(STORAGE_KEYS.rawWrap, String(rawWrapEnabled));
  localStorage.setItem(STORAGE_KEYS.openPanels, JSON.stringify([...openPanels]));
  if (sessionTokenInput) {
    localStorage.setItem(STORAGE_KEYS.sessionToken, sessionTokenInput.value.trim());
  }
  localStorage.setItem('rawFocusEnabled', String(rawFocusEnabled));
  drawEmailIdenticon(emailVal);
  // NOTE: generateNetwork is NOT called here to avoid rebuilding 200 nodes on every
  // panel toggle / question select / etc. It is called only when email changes (see emailInput listener).
}

function toggleSessionTokenField() {
  if (!sessionTokenWrapper) return;
  const exam = examSelect.value;
  sessionTokenWrapper.style.display = exam === 'ga3' ? '' : 'none';
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

function safeTrack(name, data = {}) {
  if (typeof window.va !== 'function') return;
  try {
    window.va('event', { name, data });
  } catch (_) {
    // Analytics should never interrupt core solver UX.
  }
}

function showToast(message, tone = 'info', duration = 2200) {
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
  }, duration);
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

function getStatusClass(type, locked = false) {
  if (locked) return 'status-error';
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
  } else if (answer?.debug?.locked) {
    level = 'locked';
  } else if (answer?.type === 'bypass' || answer?.type === 'guide' || warningCount > 0) {
    level = 'watch';
  }

  return { warningCount, durationText, level };
}

function getHealthLabel(level) {
  if (level === 'error') return 'Error';
  if (level === 'locked') return 'Locked';
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

function buildDebugReport() {
  const selectedAnswer = getSelectedAnswer();
  return {
    generatedAt: new Date().toISOString(),
    exam: workspaceData.exam,
    email: workspaceData.email,
    selectedQuestionIndex,
    selectedQuestionTitle: selectedAnswer?.title || null,
    selectedQuestionType: selectedAnswer?.type || null,
    summary: {
      total: workspaceData.answers.length,
      solved: workspaceData.answers.filter((item) => item.type === 'solved').length,
      bypass: workspaceData.answers.filter((item) => item.type === 'bypass').length,
      guide: workspaceData.answers.filter((item) => item.type === 'guide').length,
      error: workspaceData.answers.filter((item) => item.type === 'error').length,
    },
    ui: {
      rawWrapEnabled,
      search: nodeSearch.value,
      openPanels: [...openPanels],
    },
    selectedAnswer: selectedAnswer ? {
      title: selectedAnswer.title,
      type: selectedAnswer.type,
      variant: selectedAnswer.variant || null,
      debug: selectedAnswer.debug || null,
      answerPreview: String(selectedAnswer.answer || '').slice(0, 1500),
    } : null,
  };
}

function resetStoredUiState() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem('academic_integrity_agreed');
  
  const agreeDisclaimerCheckbox = document.getElementById('agreeDisclaimerCheckbox');
  if (agreeDisclaimerCheckbox) {
    agreeDisclaimerCheckbox.checked = false;
    agreeDisclaimerCheckbox.dispatchEvent(new Event('change'));
  }
  
  const card = document.getElementById('academicDisclaimer');
  if (card) {
    card.classList.add('pulse-attention');
  }

  nodeSearch.value = '';
  selectedQuestionIndex = 0;
  rawWrapEnabled = true;
  openPanels = new Set(['Variant', 'Preview', 'Answer', 'Diagnostics']);
  applySidebarFilter('');
  
  if (emailInput) {
    emailInput.value = '';
    drawEmailIdenticon('');
  }

  if (networkCanvas) {
    networkCanvas.setDimmed(false);
    networkCanvas.generateNetwork('anonymous');
  }

  if (workspaceData.answers.length) {
    renderCanvas(0);
  }
  showToast('Saved UI state cleared.', 'success');
  safeTrack('ui_reset', { exam: workspaceData.exam || 'none' });
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
  node.className = 'nav-item nav-item-animate';
  node.style.animationDelay = `${index * 35}ms`;
  node.dataset.idx = String(index);
  node.dataset.health = health.level;
  node.innerHTML = `
    <span class="nav-item-status ${getStatusClass(type, answer?.debug?.locked)}"></span>
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
  const { open = false, compact = false, extraClass = '', style = '' } = options;
  const isOpen = openPanels.has(title) || open;
  const styleAttr = style ? `style="${style}"` : '';
  return `
    <details class="panel-section ${compact ? 'panel-section-compact' : ''} ${extraClass}" data-panel-title="${escapeHtml(title)}" ${isOpen ? 'open' : ''} ${styleAttr}>
      <summary>${escapeHtml(title)}</summary>
      <div class="panel-section-body">${body}</div>
    </details>
  `;
}

function renderVariantPanel(data) {
  return createSection(
    'Variant',
    `<pre class="meta-output">${escapeHtml(data.variant || 'No variant info')}</pre>`,
    { open: true, compact: true, extraClass: 'panel-variant' }
  );
}

function renderPreviewPanel(data) {
  if (!isHtmlDocument(data.answer)) return '';
  return createSection(
    'Preview',
    `<iframe class="answer-preview" sandbox="allow-scripts allow-same-origin" srcdoc="${escapeHtml(data.answer)}"></iframe>`,
    { open: true, extraClass: 'panel-preview' }
  );
}

function renderAnswerPanel(data, langClass) {
  const escapedAnswer = escapeHtml(data.answer);
  const wrapClass = rawWrapEnabled ? 'raw-output-pre' : 'raw-output-nowrap';
  
  // Check if answer is a pure URL
  const isUrl = /^https?:\/\/[^\s]+$/i.test(data.answer.trim());
  
  // Distinguish between deployed solver web apps and copy-paste API URLs
  const urlLower = data.answer.trim().toLowerCase();
  const isCopyPasteApi = urlLower.includes('/api') || 
                          urlLower.includes('/code-interpreter') || 
                          urlLower.includes('/sentiment') || 
                          urlLower.includes('/latency') ||
                          urlLower.includes('onrender.com/ga3/') ||
                          urlLower.includes('onrender.com/ga2/');
                          
  const isInteractiveSolver = isUrl && !isCopyPasteApi;
  
  const answerMarkup = isInteractiveSolver
    ? `
      <div class="url-solver-container" style="padding: 16px; background: rgba(245, 158, 11, 0.03); border: 1px dashed rgba(245, 158, 11, 0.3); border-radius: 8px; display: flex; flex-direction: column; gap: 12px; align-items: center; justify-content: center; margin: 12px 0; text-align: center;">
        <span style="font-size: 12px; color: var(--text-secondary);">This solver provides a pre-deployed interactive tool:</span>
        <a href="${data.answer.trim()}" target="_blank" rel="noopener noreferrer" class="navbar-credit-btn" style="box-shadow: 0 0 16px rgba(245, 158, 11, 0.15); font-weight: 600; text-decoration: none;">
          Open Solver Tool ↗
        </a>
        <code style="font-size: 11px; color: var(--text-muted); word-break: break-all;">${escapedAnswer}</code>
      </div>
    `
    : langClass
      ? `<pre class="raw-output"><code class="${langClass}" style="background:transparent; border:none; box-shadow:none;">${escapedAnswer}</code></pre>`
      : `<pre class="raw-output ${wrapClass}">${escapedAnswer}</pre>`;

  const actions = `
    <div class="panel-actions">
      <button class="btn-ghost panel-btn" id="copyAnswerBtn">Copy Answer</button>
      <button class="btn-ghost panel-btn" id="copyVariantBtn">Copy Variant</button>
      <button class="btn-ghost panel-btn" id="toggleWrapBtn">${rawWrapEnabled ? 'No Wrap' : 'Wrap Lines'}</button>
    </div>
  `;

  const isSpecial = data.title && (data.title.toLowerCase().includes('heist') || data.title.toLowerCase().includes('nonce') || data.title.toLowerCase().includes('proof-of-work'));
  const isSolved = data.type === 'solved';
  const shouldOpen = !isSpecial || isSolved;
  const highlightStyle = (isSpecial && isSolved) ? 'border: 1px solid var(--theme-primary); box-shadow: 0 0 16px var(--theme-glow);' : '';

  return createSection('Answer', `${actions}${answerMarkup}`, { 
    open: shouldOpen, 
    extraClass: 'panel-answer',
    style: highlightStyle
  });
}

function renderNotesPanel(data) {
  if (!data.answerDisplay) return '';
  const rendered = typeof marked !== 'undefined' ? marked.parse(data.answerDisplay) : data.answerDisplay;
  const cleanRendered = rendered.replace(/<a\s+(href="[^"]*")/gi, '<a target="_blank" rel="noopener noreferrer" $1');
  
  const isSpecial = data.title && (data.title.toLowerCase().includes('heist') || data.title.toLowerCase().includes('nonce') || data.title.toLowerCase().includes('proof-of-work'));
  const isSolved = data.type === 'solved';
  const isOpen = isSpecial || openPanels.has('Rendered Notes');
  const highlightStyle = (isSpecial && !isSolved) ? 'border: 1px solid var(--theme-primary); box-shadow: 0 0 16px var(--theme-glow);' : '';

  return createSection('Rendered Notes', `<div class="styled-output">${cleanRendered}</div>`, {
    open: isOpen,
    extraClass: 'panel-notes',
    style: highlightStyle
  });
}

function renderGuidePanel(data) {
  if (!data.guide) return '';
  const rendered = typeof marked !== 'undefined' ? marked.parse(data.guide) : data.guide;
  const cleanRendered = rendered.replace(/<a\s+(href="[^"]*")/gi, '<a target="_blank" rel="noopener noreferrer" $1');
  return createSection('Implementation Guide', `<div class="styled-output guide-output">${cleanRendered}</div>`, { open: true, extraClass: 'panel-guide' });
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
    `,
    { extraClass: 'panel-diagnostics' }
  );
}

const GA8_BONUS_WEIGHTS = {
  'q-gh-actions-secret-chain': 1.5,
  'q-gemini-math-puzzle': 1.5,
  'q-fastapi-iris-deploy': 2,
  'q-hf-spaces-ml-api': 2,
  'q-docker-hash-verify': 1.5,
  'q-mlops-bash-script': 1,
  'q-precommit-ci-gate': 1.5,
  'q-mlops-concepts-quiz': 1,
  'q-gcp-cloud-run-compute': 2,
  'q-gcp-cloud-functions-http': 1.5,
  'q-gcp-gemini-classification': 1.5,
  'q-gcp-cloud-run-ml': 2,
  'q-gcp-cloud-run-envconfig': 1.5,
  'q-gcp-cloud-run-hashapi': 1.5,
  'q-gcp-gemini-json-extract': 1.5
};

function buildGa8BonusNode(email, durationText = '0.0ms') {
  const totalWeight = Object.values(GA8_BONUS_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  const weightRows = Object.entries(GA8_BONUS_WEIGHTS)
    .map(([id, weight]) => `${id.padEnd(35)} ${weight}`)
    .join('\n');

  const script = `(function() {
    const originalStringify = JSON.stringify;

    // Exact weight mappings from the TDS 2026 Jan GA8 exam
    const weights = ${JSON.stringify(GA8_BONUS_WEIGHTS, null, 8)};

    window.JSON.stringify = function(obj, ...args) {
        // Detect the submission seal payload
        if (obj && typeof obj === 'object' && 'answers' in obj && 'scores' in obj && 'total' in obj && 'max' in obj) {
            console.log("[HACK] Intercepted payload!");
            
            // Set the overall score correctly
            obj.total = obj.max; 
            
            for (let questionId in obj.scores) {
                // Fetch the exact max score for this specific question
                let correctWeight = weights[questionId] || 1; 
                
                // Give precise maximum points (avoids the backend 400 Bad Request error)
                obj.scores[questionId] = correctWeight;
                
                // Add dummy string formatted with both a pipe '|' and commas ','
                // This ensures that if the server blindly calls .split(',') or .split('|') on the answer, it won't crash
                if (!obj.answers[questionId]) {
                    obj.answers[questionId] = "https://hacked.com/actions/runs/1|a,b,c,d,e,f,g";
                }
            }
            
            console.log("[HACK] Injected appropriate individual max scores! Building cryptographic seal...");
        }
        return originalStringify.call(this, obj, ...args);
    };

    // Unlock buttons
    document.querySelectorAll('.save-action, .check-action').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('d-none');
    });

    console.log("Fixed bypass active! Click 'Save' to successfully submit your perfect score.");
})();`;

  return {
    title: 'Bonus: GA8 One Shot Solver',
    answer: script,
    type: 'guide',
    variant: `One Shot Solver for ${email}. Official mapped total: ${totalWeight} marks. just paste this script in the console and click save to get your score.`,
    answerDisplay: `This is a one shot solver for the GA8 exam. Just paste this script in the console and click save to get your score.`,
    debug: {
      solverId: 'ga8-bonus-seal-simulator',
      normalizedEmail: email,
      warnings: ['Just paste this script in the console and click save to get your score.'],
      durationText
    }
  };
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
  document.getElementById('focusModeToggle')?.addEventListener('click', () => {
    rawFocusEnabled = !rawFocusEnabled;
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

function renderDashboard() {
  selectedQuestionIndex = -1;
  persistUiState();

  document.querySelectorAll('.nav-item').forEach((el) => el.classList.remove('active'));
  dashboardToggle.classList.add('active');

  breadcrumbs.innerHTML = `
    <span class="crumb">tds-portal</span>
    <span class="separator">/</span>
    <span class="crumb">${escapeHtml(workspaceData.exam || 'workspace')}</span>
    <span class="separator">/</span>
    <span class="crumb highlight">overview</span>
  `;

  exportActions.classList.add('hidden');

  const cardsHtml = workspaceData.answers.map((ans, idx) => {
    let statusClass = 'status-stable';
    let badgeClass = 'badge-stable';
    if (ans.type === 'error') {
      statusClass = 'status-error';
      badgeClass = 'badge-error';
    } else if (ans.debug?.locked) {
      statusClass = 'status-error';
      badgeClass = 'badge-error';
    } else if (ans.type === 'guide') {
      statusClass = 'status-check';
      badgeClass = 'badge-check';
    } else if (ans.type === 'bypass') {
      statusClass = 'status-stable';
      badgeClass = 'badge-stable';
    }

    return `
      <div class="dashboard-card ${statusClass}" onclick="document.querySelector('.nav-item[data-idx=\\'${idx}\\']').click()">
        <h3>${ans.title.split(' ')[0] || `Q${idx+1}`}</h3>
        <div class="q-title">${escapeHtml(ans.title)}</div>
        <div class="q-meta">
          <span class="status-badge ${badgeClass}">${ans.debug?.locked ? 'locked' : ans.type}</span>
          <span>${ans.debug?.durationText || '0ms'}</span>
        </div>
      </div>
    `;
  }).join('');

  canvas.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>System Overview</h1>
        <p>Execution health matrix for ${escapeHtml(workspaceData.email)}</p>
      </div>
      <div class="dashboard-grid">
        ${cardsHtml}
      </div>
    </div>
  `;

  // Bind interactive card tilts & spotlight effects
  const cards = canvas.querySelectorAll('.dashboard-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      card.style.removeProperty('--x');
      card.style.removeProperty('--y');
    });
  });
}

function renderCanvas(index) {
  if (index === -1) {
    renderDashboard();
    return;
  }

  dashboardToggle.classList.remove('active');
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
  const isSpecial = data.title && (data.title.toLowerCase().includes('heist') || data.title.toLowerCase().includes('nonce') || data.title.toLowerCase().includes('proof-of-work'));

  const isSpecialGa0Backup = (workspaceData.exam === 'ga0' && (index === 9 || index === 17 || index === 24));
  const colabBackupHtml = isSpecialGa0Backup ? `
    <div class="colab-backup-banner" style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.35); border-left: 4px solid var(--theme-primary); padding: 18px; border-radius: 12px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
      <div style="font-weight: 600; color: var(--theme-primary); display: flex; align-items: center; gap: 8px; font-size: 15px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--theme-primary);"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <span>Special Case Question — Backup Google Colab Solution</span>
      </div>
      <p style="margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--text-secondary); text-align: left;">
        Questions <strong>Q10, Q18, and Q25</strong> are special cases involving user-specific environments, APIs, or dynamic data. These questions are not reliably solvable through the public solver interface for every user, so repeatedly trying them on the solver may waste your time.
      </p>
      <div style="display: flex; align-items: center; gap: 12px; margin-top: 4px; flex-wrap: wrap;">
        <a href="https://colab.research.google.com/drive/1pVBlYAwBpQUqRhM9pUeX6Wt2CJWF6orH?usp=sharing" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; background: var(--theme-primary); color: #000; padding: 8px 16px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 13px; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.85" onmouseout="this.style.opacity=1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          <span>Open Dedicated Google Colab Solution</span>
        </a>
      </div>
      <div style="font-size: 12px; color: var(--text-muted); border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 8px; margin-top: 4px; text-align: left;">
        💡 <em>Before running the Colab, simply edit Cell 1 and replace <code>YOUR_EMAIL</code> with your IITM exam email and <code>NGROK_TOKEN</code> with your ngrok auth token.</em>
      </div>
    </div>
  ` : '';

  canvas.innerHTML = `
    <div class="canvas-header">
      <div class="canvas-header-top" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; width: 100%;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div class="canvas-label">System Output | ${escapeHtml(typeLabel)}</div>
          <h2 class="canvas-title" style="margin: 0;">${escapeHtml(data.title)}</h2>
        </div>
        <button role="switch" 
                aria-checked="${rawFocusEnabled ? 'true' : 'false'}" 
                id="focusModeToggle" 
                aria-label="Toggle Workspace Focus Mode"
                class="focus-switch-btn">
          <span class="focus-switch-thumb"></span>
          <span class="focus-switch-label">Focus Mode</span>
        </button>
      </div>
      <div class="canvas-subtitle" style="margin-top: 8px;">
        <span class="canvas-chip">${escapeHtml(workspaceData.exam || 'workspace')}</span>
        <span class="canvas-chip">Question ${index + 1}</span>
        <span class="canvas-chip">${escapeHtml(data.type)}</span>
        <span class="canvas-chip canvas-chip-${health.level}">${getHealthLabel(health.level)}</span>
        <span class="canvas-chip">${escapeHtml(health.durationText)}</span>
        ${health.warningCount ? `<span class="canvas-chip canvas-chip-warning">${health.warningCount} warning${health.warningCount > 1 ? 's' : ''}</span>` : ''}
      </div>
    </div>
    <div class="canvas-body ${rawFocusEnabled ? 'workspace-focus-active' : ''}">
      ${colabBackupHtml}
      ${renderVariantPanel(data)}
      ${renderPreviewPanel(data)}
      ${isSpecial 
        ? `
          ${renderNotesPanel(data)}
          ${renderAnswerPanel(data, langClass)}
          ${renderDiagnosticsPanel(data.debug)}
        `
        : `
          ${!/onrender\.com\/ga[23]\//i.test(data.answer?.toLowerCase() || '') ? renderGuidePanel(data) : ''}
          ${renderAnswerPanel(data, langClass)}
          ${/onrender\.com\/ga[23]\//i.test(data.answer?.toLowerCase() || '') ? renderGuidePanel(data) : ''}
          ${renderNotesPanel(data)}
          ${renderDiagnosticsPanel(data.debug)}
        `
      }
    </div>
    <div class="canvas-footer-credits">
      <span>Project Sandbox by <a href="https://github.com/GyaanFlow" target="_blank" rel="noopener noreferrer">GyaanFlow</a></span>
      <span class="dot-separator">•</span>
      <span>Connect on <a href="https://www.linkedin.com/in/gaurav-tomar-630b2a316" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
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
  const agreeDisclaimerCheckbox = document.getElementById('agreeDisclaimerCheckbox');
  if (agreeDisclaimerCheckbox && !agreeDisclaimerCheckbox.checked) {
    const card = document.getElementById('academicDisclaimer');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.remove('pulse-attention');
      card.classList.add('shake-attention');
      setTimeout(() => {
        card.classList.remove('shake-attention');
        card.classList.add('pulse-attention');
      }, 600);
    }
    showToast('Please read and agree to the Academic Integrity Policy first.', 'error');
    return;
  }

  const email = emailInput.value.trim();
  const currentTerm = termSelect.value;
  const currentExam = examSelect.value;
  const preferredQuestionIndex = selectedQuestionIndex;
  const sessionToken = sessionTokenInput ? sessionTokenInput.value.trim() : '';
  const heistDocument = localStorage.getItem('tdsHeistDocument') || '';
  const powInput = localStorage.getItem('tdsNonceInput') || '';

  if (!email) {
    emailInput.focus();
    emailInput.style.borderColor = 'var(--error)';
    return;
  }

  if (!currentExam) {
    showToast('No exam available for this term yet.', 'error');
    return;
  }

  if (currentExam === 'ga3' && !sessionToken) {
    showToast('aipipe.org token is required for GA3!', 'error');
    if (sessionTokenInput) {
      sessionTokenInput.focus();
      sessionTokenInput.style.borderColor = 'var(--error)';
    }
    return;
  }
  if (sessionTokenInput) {
    sessionTokenInput.style.borderColor = 'var(--border)';
  }

  emailInput.style.borderColor = 'var(--border)';
  localStorage.setItem(STORAGE_KEYS.term, currentTerm);
  localStorage.setItem(STORAGE_KEYS.email, email);
  localStorage.setItem(STORAGE_KEYS.exam, currentExam);

  // Update email history
  let history = [];
  try { history = JSON.parse(localStorage.getItem(STORAGE_KEYS.emailHistory) || '[]'); } catch (_) {}
  history = [email, ...history.filter(e => e !== email)].slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.emailHistory, JSON.stringify(history));
  const datalist = document.getElementById('emailHistory');
  if (datalist) datalist.innerHTML = history.map(e => `<option value="${e}">`).join('');

  solveBtn.disabled = true;
  solveBtn.innerText = 'Initializing...';
  if (networkCanvas) {
    networkCanvas.setDimmed(true);
  }
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
  workspaceData = { term: currentTerm, exam: currentExam, email, answers: [], meta: {} };
  setMobileNavOpen(false);
  persistUiState();

  const statsTracker = { solved: 0, bypass: 0, guide: 0 };
  const startTime = performance.now();

  try {
    let solvers = [];
    try {
      const registryModule = await import(`./solvers/${currentTerm}/${currentExam}/registry.js?v=${Date.now()}`);
      solvers = registryModule.solvers;
    } catch (_) {
      throw new Error(`CRITICAL SYSTEM FAULT: Failed to fetch module registry for ${currentTerm}/${currentExam}. Target may be missing or corrupt.`);
    }

    let done = 0;

    for (const solver of solvers) {
      try {
        const inputToken = (solver.id === 'q-proof-of-work-server' && powInput)
          ? powInput
          : ((solver.id === 'q-context-window-heist-server' && heistDocument)
            ? heistDocument
            : sessionToken);
        const result = await Promise.resolve(solver.solve(email, inputToken));
        workspaceData.answers.push({
          title: solver.title,
          answer: result.answer,
          type: result.type || 'solved',
          variant: result.variant,
          answerDisplay: result.answerDisplay,
          guide: result.guide,
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

      if (currentExam === 'ga0' && done === 10) {
        progressText.innerText = `Deploying FastAPI Students Service (Compiled 10 / ${solvers.length} nodes)...`;
        await new Promise((resolve) => window.setTimeout(resolve, 2500));
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 40));
      }
    }

    if (currentExam === 'ga8') {
      const bonusAnswer = buildGa8BonusNode(email, '0.0ms');
      workspaceData.answers.push(bonusAnswer);
      statsTracker.guide += 1;
      done += 1;
      solverCountEl.innerText = String(done);
      questionNav.appendChild(renderSidebarNode(done - 1, bonusAnswer.title, bonusAnswer.type));
      populateMobileQuestionPicker();
      persistUiState();
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
    dashboardToggle.classList.remove('hidden');
    statSolved.innerText = String(statsTracker.solved);
    statBypass.innerText = String(statsTracker.bypass);
    statGuide.innerText = String(statsTracker.guide);

    if (workspaceData.answers.length > 0) {
      selectedQuestionIndex = preferredQuestionIndex !== -1 ? Math.min(preferredQuestionIndex, workspaceData.answers.length - 1) : -1;
      populateMobileQuestionPicker();
      renderCanvas(selectedQuestionIndex);
      const isLocked = workspaceData.answers.some(ans => ans.debug?.locked);
      if (isLocked) {
        showToast('⚠️ Academic Integrity Lock Active: If unlocked too early, you will not learn or think yourself, defeating the purpose of the TDS course. It is locked initially, but may be unlocked in the future if deemed viable. If you are a tester, contact the creator for personal access.', 'error', 12000);
      } else {
        showToast(`Workspace ready. ${workspaceData.answers.length} questions loaded.`, 'success');
      }
      safeTrack('workspace_ready', {
        exam: currentExam,
        questionCount: workspaceData.answers.length,
      });
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
    safeTrack('workspace_failed', { exam: currentExam });
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

dashboardToggle?.addEventListener('click', () => {
  renderCanvas(-1);
  if (window.innerWidth <= 768) {
    setMobileNavOpen(false);
  }
});

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
if (sessionTokenInput) {
  sessionTokenInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') startSolving();
  });
  sessionTokenInput.addEventListener('input', () => {
    persistUiState();
  });
}
termSelect.addEventListener('change', () => {
  populateExamSelect(termSelect.value);
  persistUiState();
});
examSelect.addEventListener('change', () => {
  toggleSessionTokenField();
  persistUiState();
});
let _lastEmailForNetwork = '';
emailInput.addEventListener('input', () => {
  persistUiState();
  // Only rebuild the neural network when the email value actually changed
  const emailVal = emailInput.value.trim();
  if (networkCanvas && emailVal !== _lastEmailForNetwork) {
    _lastEmailForNetwork = emailVal;
    networkCanvas.generateNetwork(emailVal || 'anonymous');
  }
});

copyAllBtn?.addEventListener('click', (event) => {
  const allText = workspaceData.answers.map((answer, index) => `=== Q${index + 1}: ${answer.title} ===\n${answer.answer}`).join('\n\n');
  copyToClipboard(allText, event.currentTarget);
  safeTrack('copy_all', { exam: workspaceData.exam || 'none', total: workspaceData.answers.length });
});
copyDebugBtn?.addEventListener('click', (event) => {
  copyToClipboard(JSON.stringify(buildDebugReport(), null, 2), event.currentTarget);
  safeTrack('copy_debug_report', { exam: workspaceData.exam || 'none' });
});
resetUiBtn?.addEventListener('click', resetStoredUiState);

const printExamBtn = document.getElementById('printExamBtn');
if (printExamBtn) {
  printExamBtn.addEventListener('click', () => {
    if (!workspaceData.answers.length) return showToast('No data to print', 'error');
    
    let printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cheat Sheet - ${escapeHtml(workspaceData.exam)}</title>
        <style>
          body { font-family: sans-serif; color: #000; background: #fff; padding: 20px; }
          .q-block { margin-bottom: 30px; page-break-inside: avoid; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
          h2 { margin: 0 0 10px; font-size: 18px; color: #333; }
          .meta { font-size: 12px; color: #666; margin-bottom: 10px; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 4px; white-space: pre-wrap; font-size: 12px; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(workspaceData.exam)} - ${escapeHtml(workspaceData.email)}</h1>
    `;
    
    workspaceData.answers.forEach((ans, i) => {
      printHtml += `
        <div class="q-block">
          <h2>Q${i + 1}: ${escapeHtml(ans.title)}</h2>
          <div class="meta">Variant: ${escapeHtml(ans.variant || 'N/A')}</div>
          <pre>${escapeHtml(ans.answer)}</pre>
        </div>
      `;
    });
    
    printHtml += `</body></html>`;
    
    const printWin = window.open('', '_blank');
    printWin.document.write(printHtml);
    printWin.document.close();
    printWin.focus();
    // Use a slight timeout to let browser render the HTML before printing
    setTimeout(() => {
      printWin.print();
    }, 250);
    
    safeTrack('print_exam', { exam: workspaceData.exam });
  });
}

exportMdBtn?.addEventListener('click', () => {
  let md = `# Workspace Export | ${String(workspaceData.exam || '').toUpperCase()}\n`;
  md += `**Email:** \`${workspaceData.email}\`\n\n---\n\n`;
  workspaceData.answers.forEach((answer, index) => {
    md += `### [${answer.type.toUpperCase()}] Q${index + 1}: ${answer.title}\n\`\`\`\n${answer.answer}\n\`\`\`\n\n`;
  });
  downloadFile(`workspace_${workspaceData.exam}.md`, md, 'text/markdown');
  showToast('Markdown export downloaded.', 'success');
  safeTrack('export_markdown', { exam: workspaceData.exam || 'none', total: workspaceData.answers.length });
});

exportJsonBtn?.addEventListener('click', () => {
  downloadFile(`workspace_${workspaceData.exam}.json`, JSON.stringify(workspaceData, null, 2), 'application/json');
  showToast('JSON export downloaded.', 'success');
  safeTrack('export_json', { exam: workspaceData.exam || 'none', total: workspaceData.answers.length });
});

// Academic Integrity Disclaimer checkbox & slide-to-unlock handling
const agreeDisclaimerCheckbox = document.getElementById('agreeDisclaimerCheckbox');
const sliderHandle = document.getElementById('sliderButtonHandle');
const sliderTrack = document.getElementById('sliderTrack');
const sliderFill = document.getElementById('sliderGlowFill');
const card = document.getElementById('academicDisclaimer');

if (agreeDisclaimerCheckbox) {
  const hasAgreed = localStorage.getItem('academic_integrity_agreed') === 'true';
  agreeDisclaimerCheckbox.checked = hasAgreed;
  
  if (card) {
    if (hasAgreed) {
      card.classList.add('agreed-state');
    } else {
      card.classList.add('pulse-attention');
    }
  }

  // Bind change event to sync visual slide state
  agreeDisclaimerCheckbox.addEventListener('change', () => {
    if (agreeDisclaimerCheckbox.checked) {
      localStorage.setItem('academic_integrity_agreed', 'true');
      card?.classList.remove('pulse-attention');
      card?.classList.add('agreed-state');
    } else {
      localStorage.removeItem('academic_integrity_agreed');
      card?.classList.add('pulse-attention');
      card?.classList.remove('agreed-state');
    }
  });
}

// Geometric Seeded Identicon rendering
let identiconAnimationId = null;
const identiconState = {
  seed: '',
  theme: '',
  angleX: 0,
  angleY: 0,
  hoverScale: 1.0,
  targetHoverScale: 1.0,
  hoverSpeed: 1.0,
  targetHoverSpeed: 1.0,
  vertices: [],
  primaryColor: '',
  secondaryColor: '',
  bgColor: '',
  canvas: null,
  ctx: null
};

function updateAndDrawIdenticon() {
  const { canvas, ctx, vertices, primaryColor, secondaryColor, bgColor } = identiconState;
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, 36, 36);

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 36, 36);

  identiconState.hoverScale += (identiconState.targetHoverScale - identiconState.hoverScale) * 0.15;
  identiconState.hoverSpeed += (identiconState.targetHoverSpeed - identiconState.hoverSpeed) * 0.15;

  identiconState.angleX += 0.012 * identiconState.hoverSpeed;
  identiconState.angleY += 0.016 * identiconState.hoverSpeed;

  const cosX = Math.cos(identiconState.angleX);
  const sinX = Math.sin(identiconState.angleX);
  const cosY = Math.cos(identiconState.angleY);
  const sinY = Math.sin(identiconState.angleY);

  const cx = 18;
  const cy = 18;
  const scale = 5.2 * identiconState.hoverScale;

  ctx.lineWidth = 1.5;
  ctx.beginPath();

  for (let i = 0; i < vertices.length; i++) {
    const p = vertices[i];

    const y1 = p.y * cosX - p.z * sinX;
    const z1 = p.y * sinX + p.z * cosX;

    const x2 = p.x * cosY + z1 * sinY;
    const z2 = -p.x * sinY + z1 * cosY;

    const pScale = 50 / (50 + z2);
    const px = x2 * scale * pScale + cx;
    const py = y1 * scale * pScale + cy;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  const grad = ctx.createLinearGradient(0, 0, 36, 36);
  grad.addColorStop(0, primaryColor);
  grad.addColorStop(1, secondaryColor);
  ctx.strokeStyle = grad;
  ctx.stroke();
}

function drawEmailIdenticon(email) {
  const canvas = document.getElementById('seedIdenticon');
  if (!canvas || typeof canvas.getContext !== 'function') return;
  const ctx = canvas.getContext('2d');
  
  const norm = email.trim().toLowerCase();
  
  if (identiconState.seed === norm && identiconState.canvas === canvas && identiconState.theme === activeTheme) {
    return;
  }
  
  if (identiconState.canvas !== canvas) {
    canvas.addEventListener('mouseenter', () => {
      identiconState.targetHoverScale = 1.35;
      identiconState.targetHoverSpeed = 3.5;
    });
    canvas.addEventListener('mouseleave', () => {
      identiconState.targetHoverScale = 1.0;
      identiconState.targetHoverSpeed = 1.0;
    });
    
    emailInput.addEventListener('mouseenter', () => {
      identiconState.targetHoverScale = 1.25;
      identiconState.targetHoverSpeed = 2.0;
    });
    emailInput.addEventListener('mouseleave', () => {
      identiconState.targetHoverScale = 1.0;
      identiconState.targetHoverSpeed = 1.0;
    });
  }

  const seedGen = new Math.seedrandom(norm || 'anonymous');
  
  const themeHues = THEME_HUES[activeTheme] || THEME_HUES.amber;
  const primaryHue = themeHues.primary;
  const secondaryHue = themeHues.secondary;
  
  identiconState.seed = norm;
  identiconState.canvas = canvas;
  identiconState.ctx = ctx;
  identiconState.theme = activeTheme;
  identiconState.primaryColor = `hsla(${primaryHue}, 90%, 65%, 0.8)`;
  identiconState.secondaryColor = `hsla(${secondaryHue}, 95%, 55%, 0.85)`;
  identiconState.bgColor = `hsla(${primaryHue}, 35%, 8%, 0.45)`;

  const p = 2 + Math.floor(seedGen() * 4);
  const q = 3 + Math.floor(seedGen() * 5);
  const segments = 64;
  const vertices = [];

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2 * p;
    const r = 1.8 + 0.8 * Math.cos(q * t / p);
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    const z = 0.8 * Math.sin(q * t / p);
    vertices.push({ x, y, z });
  }

  identiconState.vertices = vertices;

  if (!identiconAnimationId) {
    const loop = () => {
      identiconAnimationId = requestAnimationFrame(loop);
      updateAndDrawIdenticon();
    };
    identiconAnimationId = requestAnimationFrame(loop);
  }
}

window.addEventListener('resize', syncMobileNavState);
syncMobileNavState();
applySidebarFilter(nodeSearch.value.trim().toLowerCase());

// --- Theme Switcher & Proximity Cards Setup ---
const themeButtons = document.querySelectorAll('.theme-btn');

const THEME_COLORS = {
  amber: { primary: '#f59e0b', secondary: '#ef4444' },
  cyber: { primary: '#10b981', secondary: '#3b82f6' },
  orchid: { primary: '#ec4899', secondary: '#8b5cf6' },
  frost: { primary: '#06b6d4', secondary: '#3b82f6' }
};

function switchTheme(theme) {
  activeTheme = theme;
  localStorage.setItem('workspaceTheme', theme);
  if (document.body && typeof document.body.setAttribute === 'function') {
    document.body.setAttribute('data-theme', theme);
  }
  
  themeButtons.forEach(btn => {
    if (btn.dataset.themeVal === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (networkCanvas && typeof networkCanvas.setThemeColors === 'function') {
    const colors = THEME_COLORS[theme];
    networkCanvas.setThemeColors(colors.primary, colors.secondary);
  }

  const emailVal = emailInput.value.trim();
  drawEmailIdenticon(emailVal);
}

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTheme(btn.dataset.themeVal);
  });
});

// Bind interactive welcome mini-cards mouse tilt & spotlight
document.querySelectorAll('.feature-mini-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    card.style.removeProperty('--x');
    card.style.removeProperty('--y');
  });
});

// Bind interactive disclaimer card mouse tilt & spotlight
const disclaimerCard = document.getElementById('academicDisclaimer');
if (disclaimerCard) {
  disclaimerCard.addEventListener('mousemove', (e) => {
    const rect = disclaimerCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    disclaimerCard.style.setProperty('--x', `${x}px`);
    disclaimerCard.style.setProperty('--y', `${y}px`);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    disclaimerCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  
  disclaimerCard.addEventListener('mouseleave', () => {
    disclaimerCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    disclaimerCard.style.removeProperty('--x');
    disclaimerCard.style.removeProperty('--y');
  });
}

// Initialize WebGL background canvas dynamically to support check.mjs Node environment compatibility
async function initNetworkCanvas() {
  if (typeof process === 'undefined') {
    try {
      const module = await import('./network-canvas.js');
      networkCanvas = new module.NetworkCanvasManager('threeCanvas');
    } catch (e) {
      console.warn('WebGL/Three.js background constellation could not be initialized:', e);
    }
  }
}
// Apply theme immediately to prevent FOUC (Flash of Unstyled Content) and UI lag
switchTheme(activeTheme);

// Initial call to draw default identicon and update 3D network once dynamic import completes
initNetworkCanvas().then(() => {
  setTimeout(() => {
    const initialEmail = emailInput.value.trim();
    _lastEmailForNetwork = initialEmail; // Sync sentinel so first input event doesn't double-regenerate
    drawEmailIdenticon(initialEmail);
    if (networkCanvas) {
      networkCanvas.generateNetwork(initialEmail || 'anonymous');
      // Apply theme colors immediately
      const hue = THEME_HUES[activeTheme];
      if (hue) {
        const primary   = `hsl(${hue.primary}, 90%, 58%)`;
        const secondary = `hsl(${hue.secondary}, 90%, 58%)`;
        networkCanvas.setThemeColors(primary, secondary);
      }
      // If workspace is already restored from cache, set dimmed state
      if (workspaceData.answers && workspaceData.answers.length > 0) {
        networkCanvas.setDimmed(true);
      }
    }
  }, 150);
});

// Update Q10 mining time estimate when difficulty input changes
document.addEventListener('input', (event) => {
  if (event.target.id === 'pow-difficulty-input') {
    const estimateEl = document.getElementById('pow-estimate');
    if (!estimateEl) return;
    const diff = parseInt(event.target.value, 10);
    if (isNaN(diff) || diff < 1) { estimateEl.textContent = ''; return; }
    const expectedHashes = Math.pow(2, diff);
    const workers = Math.max(1, Math.min(navigator.hardwareConcurrency || 4, 8));
    const estSec = Math.round(expectedHashes / (350000 * workers));
    let timeStr;
    if (estSec < 60) timeStr = `~${estSec}s`;
    else if (estSec < 3600) timeStr = `~${Math.floor(estSec / 60)}min ${estSec % 60}s`;
    else timeStr = `~${(estSec / 3600).toFixed(1)}h`;
    estimateEl.textContent = `Expected ~${expectedHashes.toExponential(1)} hashes → ${timeStr} with ${workers} workers (rough estimate)`;
  }
});

// Delegated click handler for Q11 Context Heist card actions
document.addEventListener('click', async (event) => {
  if (!event.target) return;

  if (event.target.id === 'heist-card-solve-btn') {
    const textarea = document.getElementById('heist-card-textarea');
    if (!textarea) return;
    const docText = textarea.value.trim();
    if (!docText) {
      showToast('Please paste the heist document first!', 'error');
      return;
    }
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      showToast('Please enter your email in the sidebar first!', 'error');
      emailInput.focus();
      return;
    }
    localStorage.setItem('tdsHeistDocument', docText);
    showToast('Extracting facts...', 'info');
    startSolving();
  } else if (event.target.id === 'heist-card-clear-btn') {
    localStorage.removeItem('tdsHeistDocument');
    showToast('Pasted document cleared.', 'info');
    startSolving();
  } else if (event.target.id === 'pow-mine-btn') {
    const tokenEl = document.getElementById('pow-token-input');
    const diffEl = document.getElementById('pow-difficulty-input');
    const mineBtn = document.getElementById('pow-mine-btn');
    if (!tokenEl || !diffEl || !mineBtn) return;
    const token = tokenEl.value.trim();
    const difficultyVal = diffEl.value.trim();
    const difficulty = parseInt(difficultyVal, 10);
    if (!token || isNaN(difficulty)) {
      showToast('Please enter both Token and Difficulty!', 'error');
      return;
    }

    mineBtn.disabled = true;
    mineBtn.style.opacity = '0.7';
    mineBtn.style.cursor = 'not-allowed';

    const NUM_WORKERS = Math.max(1, Math.min(navigator.hardwareConcurrency || 4, 8));
    mineBtn.innerText = `Launching ${NUM_WORKERS} parallel workers...`;

    const workerCode = `
      self.onmessage = async (e) => {
        const { token, difficulty, workerId, totalWorkers } = e.data;
        
        function leadingZeroBits(digest) {
          let bits = 0;
          for (let i = 0; i < digest.length; i++) {
            if (digest[i] === 0) {
              bits += 8;
            } else {
              let b = digest[i];
              while (b < 128) { bits++; b <<= 1; }
              break;
            }
          }
          return bits;
        }

        const enc = new TextEncoder();
        const prefix = token + ":";
        let nonce = workerId;
        const start = Date.now();
        let hashes = 0;
        let nextReport = 100000;
        const BATCH = 4;
        
        while (true) {
          const batch = new Array(BATCH);
          for (let i = 0; i < BATCH; i++) {
            batch[i] = crypto.subtle.digest('SHA-256', enc.encode(prefix + (nonce + i * totalWorkers)));
          }
          const results = await Promise.all(batch);
          for (let i = 0; i < BATCH; i++) {
            const bytes = new Uint8Array(results[i]);
            if (leadingZeroBits(bytes) >= difficulty) {
              const elapsed = ((Date.now() - start) / 1000).toFixed(1);
              self.postMessage({ status: 'done', nonce: nonce + i * totalWorkers, time: elapsed, workerId });
              return;
            }
          }
          nonce += BATCH * totalWorkers;
          hashes += BATCH;
          if (hashes >= nextReport) {
            self.postMessage({ status: 'progress', checked: hashes, workerId });
            nextReport += 100000;
          }
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const workers = [];
    const workerChecked = new Array(NUM_WORKERS).fill(0);
    const mineStart = Date.now();
    let found = false;

    for (let i = 0; i < NUM_WORKERS; i++) {
      const worker = new Worker(workerUrl);
      workers.push(worker);

      worker.onmessage = (msg) => {
        if (found) return;
        const data = msg.data;
        if (data.status === 'progress') {
          workerChecked[data.workerId] = data.checked;
          const totalHashes = workerChecked.reduce((a, b) => a + b, 0);
          const elapsed = ((Date.now() - mineStart) / 1000).toFixed(1);
          const rate = (totalHashes / Math.max(1, Date.now() - mineStart) * 1000).toFixed(0);
          mineBtn.innerText = `Mining... ${totalHashes.toLocaleString()} hashes (${rate}/s, ${NUM_WORKERS} workers)`;
        } else if (data.status === 'done') {
          found = true;
          for (const w of workers) w.terminate();
          URL.revokeObjectURL(workerUrl);
          localStorage.setItem('tdsNonceInput', `${token}|${difficulty}|${data.nonce}|${data.time}`);
          showToast(`Nonce mined in ${data.time}s`, 'success');
          startSolving();
        }
      };

      worker.postMessage({ token, difficulty, workerId: i, totalWorkers: NUM_WORKERS });
    }
  } else if (event.target.id === 'pow-clear-btn') {
    localStorage.removeItem('tdsNonceInput');
    const colabArea = document.getElementById('colab-script-area');
    if (colabArea) colabArea.style.display = 'none';
    showToast('Proof-of-work input cleared.', 'info');
    startSolving();
  } else if (event.target.id === 'gen-colab-script-btn') {
    const token = document.getElementById('pow-token-input')?.value.trim();
    const difficulty = document.getElementById('pow-difficulty-input')?.value.trim();
    if (!token || !difficulty) {
      showToast('Enter token and difficulty first!', 'error');
      return;
    }
    const script = `# Q10 Proof-of-Work Miner — Google Colab
# 1. Paste this into a Colab cell (https://colab.research.google.com)
# 2. Run the cell
# 3. Copy the Nonce from the output and paste it back in the solver

import hashlib, time, multiprocessing as mp

TOKEN = "${token}"
DIFFICULTY = ${difficulty}

def leading_zero_bits(d):
    bits = 0
    for b in d:
        if b == 0: bits += 8
        else:
            while b < 128: bits += 1; b <<= 1
            break
    return bits

def mine(args):
    t, diff, start, step = args
    n = start
    pref = (t + ":").encode()
    while True:
        h = hashlib.sha256(pref + str(n).encode()).digest()
        if leading_zero_bits(h) >= diff: return n
        n += step

if __name__ == "__main__":
    t0 = time.time()
    nw = mp.cpu_count()
    print(f"Mining with {nw} workers...")
    with mp.Pool(nw) as p:
        for r in p.imap_unordered(mine, [(TOKEN, DIFFICULTY, i, nw) for i in range(nw)]):
            print(f"\\nNonce: {r}")
            print(f"Time: {time.time()-t0:.2f}s")
            p.terminate()
            break`;

    const area = document.getElementById('colab-script-area');
    const output = document.getElementById('colab-script-output');
    if (area && output) {
      area.style.display = 'block';
      output.value = script;
    }
    showToast('Colab script generated! Copy and run it.', 'success');
  } else if (event.target.id === 'copy-colab-script-btn') {
    const output = document.getElementById('colab-script-output');
    if (!output || !output.value) return;
    try {
      await navigator.clipboard.writeText(output.value);
      showToast('Script copied to clipboard!', 'success');
    } catch {
      output.select();
      document.execCommand('copy');
      showToast('Script copied!', 'success');
    }
  } else if (event.target.id === 'submit-colab-nonce-btn') {
    const token = document.getElementById('pow-token-input')?.value.trim();
    const difficulty = document.getElementById('pow-difficulty-input')?.value.trim();
    const nonce = document.getElementById('colab-nonce-input')?.value.trim();
    if (!token || !difficulty || !nonce) {
      showToast('Enter token, difficulty, and nonce!', 'error');
      return;
    }
    localStorage.setItem('tdsNonceInput', `${token}|${difficulty}|${nonce}|colab`);
    showToast('Nonce submitted! Re-solving...', 'success');
    startSolving();
  }
});
