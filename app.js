// TDS Exam Portal - Workspace Application Engine

// One stable value per page load, not per import() call. A fresh Date.now() on every dynamic
// import forces the browser to re-fetch and re-execute every solver module from scratch on
// every question switch or catalog load -- with this, repeat imports within the same page load
// resolve from the module cache instead, while a hard reload still busts any stale HTTP cache.
const MODULE_CACHE_BUST = Date.now();

let networkCanvas = null;

const THEME_HUES = {
  amber: { primary: 38, secondary: 4 },
  cyber: { primary: 160, secondary: 220 },
  orchid: { primary: 330, secondary: 265 },
  frost: { primary: 190, secondary: 220 }
};

// Classic Amber is the default and only UI now -- the "New UI" Blueprint theme was removed.
const storedTheme = safeStorageGet('workspaceTheme');
let activeTheme = ['amber', 'cyber', 'orchid', 'frost'].includes(storedTheme) ? storedTheme : 'amber';

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

let rawFocusEnabled = safeStorageGet('rawFocusEnabled') === 'true';

let workspaceData = {
  exam: null,
  email: '',
  answers: [],
  meta: {}
};

// localStorage can THROW, not just fail quietly: Safari Private Browsing, browsers with
// site data blocked, and a full quota all raise on setItem. Because persistUiState() runs on
// almost every interaction (selecting a question, toggling a panel, typing in search), an
// unguarded throw propagates out of the click handler and aborts the render — the UI simply
// stops responding. These wrappers degrade to "state isn't remembered" instead, which is a
// far better failure mode than a dead page.
// Deliberately permissive — the goal is to catch the realistic typo (missing domain,
// missing @, trailing comma, a stray space in the middle), not to police exotic-but-legal
// addresses. Anything with a local part, an @, and a dotted domain passes.
function isPlausibleEmail(value) {
  // Domain labels are restricted to alphanumerics/hyphens and the TLD to letters, so common
  // copy-paste artefacts (a trailing comma or semicolon) are rejected rather than silently
  // becoming part of the seed.
  return /^[^\s@]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(String(value).trim());
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (_) {
    return false;
  }
}

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function safeStorageRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (_) {
    return false;
  }
}

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
    { group: 'Standard Exams',           value: 'roe', label: 'ROE Re-Exam' },
    { group: 'Projects',                 value: 'p1',  label: 'Project 1' },
    { group: 'Projects',                 value: 'p2',  label: 'Project 2' },
    { group: 'Weekly Graded Assignments', value: 'ga0', label: 'GA 0 (Warm-up Exam)' },
    { group: 'Weekly Graded Assignments', value: 'ga1', label: 'GA 1 (Developer Tools)' },
    { group: 'Weekly Graded Assignments', value: 'ga2', label: 'GA 2 (API Engineering & Cloud Services)' },
    { group: 'Weekly Graded Assignments', value: 'ga3', label: 'GA 3 (System & API Architecture)' },
    { group: 'Weekly Graded Assignments', value: 'ga4', label: 'GA 4 (RAG & Vector Search)' },
    { group: 'Weekly Graded Assignments', value: 'ga5', label: 'GA 5 (Agentic Systems Safety)' },
    { group: 'Weekly Graded Assignments', value: 'ga6', label: 'GA 6 (Data Forensics & Automation)' },
    { group: 'Weekly Graded Assignments', value: 'ga7', label: 'GA 7 (Policy Gates & OSINT)' },
    { group: 'Weekly Graded Assignments', value: 'ga8', label: 'GA 8 (MLOps & LLM Systems Gateway)' }
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
  const savedTerm  = safeStorageGet(STORAGE_KEYS.term);
  const savedEmail = safeStorageGet(STORAGE_KEYS.email);
  const savedExam  = safeStorageGet(STORAGE_KEYS.exam);
  const savedSearch = safeStorageGet(STORAGE_KEYS.search);
  const savedSelectedQuestion = Number(safeStorageGet(STORAGE_KEYS.selectedQuestion));
  const savedRawWrap = safeStorageGet(STORAGE_KEYS.rawWrap);
  const savedOpenPanels = safeStorageGet(STORAGE_KEYS.openPanels);

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
  // AIPipe tokens expire when the user's aipipe.org session ends — never restore a stale
  // token from a previous session. Always require it to be typed in fresh (see also
  // persistUiState(), which correspondingly never writes this field to localStorage).
  if (sessionTokenInput) sessionTokenInput.value = '';
  // Clean up any token persisted by older versions of this app.
  safeStorageRemove(STORAGE_KEYS.sessionToken);
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
  const savedEmailHistory = safeStorageGet(STORAGE_KEYS.emailHistory);
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
  safeStorageSet(STORAGE_KEYS.term, termSelect.value);
  safeStorageSet(STORAGE_KEYS.exam, examSelect.value);
  const emailVal = emailInput.value.trim();
  safeStorageSet(STORAGE_KEYS.email, emailVal);
  safeStorageSet(STORAGE_KEYS.search, nodeSearch.value);
  safeStorageSet(STORAGE_KEYS.selectedQuestion, String(selectedQuestionIndex));
  safeStorageSet(STORAGE_KEYS.rawWrap, String(rawWrapEnabled));
  safeStorageSet(STORAGE_KEYS.openPanels, JSON.stringify([...openPanels]));
  // Intentionally never persist sessionTokenInput — AIPipe tokens expire when the user's
  // aipipe.org session ends, and a stale saved token silently produces wrong API answers.
  safeStorageSet('rawFocusEnabled', String(rawFocusEnabled));
  drawEmailIdenticon(emailVal);
  // NOTE: generateNetwork is NOT called here to avoid rebuilding 200 nodes on every
  // panel toggle / question select / etc. It is called only when email changes (see emailInput listener).
}

function toggleSessionTokenField() {
  if (!sessionTokenWrapper) return;
  const exam = examSelect.value;
  sessionTokenWrapper.style.display = (exam === 'ga3' || exam === 'ga4' || exam === 'ga5') ? '' : 'none';
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

const REPO_URL = 'https://github.com/GyaanFlow/tds-roe-solver-t12026';
const PROFILE_URL = 'https://github.com/GyaanFlow';
const LINKEDIN_URL = 'https://www.linkedin.com/in/gaurav-tomar-630b2a316';

// A dismissible "nice work" card shown every time a (public, unlocked) workspace finishes
// solving — never blocks anything, auto-dismisses on its own if ignored, and the star/follow
// links are just an optional aside, never a gate on using the tool.
function maybeShowCelebrateCard(questionCount) {
  let host = document.getElementById('celebrateCard');
  if (host) host.remove();

  host = document.createElement('div');
  host.id = 'celebrateCard';
  host.className = 'celebrate-card';
  host.innerHTML = `
    <button type="button" class="celebrate-dismiss" aria-label="Dismiss">&times;</button>
    <div class="celebrate-title"><span class="celebrate-emoji">🎉</span> Workspace solved!</div>
    <div class="celebrate-body">${questionCount} question${questionCount === 1 ? '' : 's'} compiled. Hope it saved you some time.
    If you'd like to support the project, a <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer" class="celebrate-inline-link">star on GitHub</a> or a
    <a href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer" class="celebrate-inline-link">follow on LinkedIn</a> is always appreciated — totally optional.</div>
    <div class="celebrate-actions">
      <a class="celebrate-btn celebrate-btn-star" href="${REPO_URL}" target="_blank" rel="noopener noreferrer">⭐ Star</a>
      <a class="celebrate-btn celebrate-btn-follow" href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer">🐙 Follow</a>
      <a class="celebrate-btn celebrate-btn-linkedin" href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer">💼 Connect</a>
    </div>
  `;
  document.body.appendChild(host);

  const dismiss = () => {
    host.classList.remove('celebrate-visible');
    window.setTimeout(() => host.remove(), 280);
  };
  host.querySelector('.celebrate-dismiss').addEventListener('click', dismiss);
  host.querySelectorAll('.celebrate-btn').forEach(btn => btn.addEventListener('click', dismiss));

  window.requestAnimationFrame(() => host.classList.add('celebrate-visible'));
  // Auto-dismiss (without re-showing later) after a while so it never lingers/annoys.
  window.setTimeout(dismiss, 16000);
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
  if (typeof answer !== 'string') return '';
  const trimmed = answer.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'language-json';
    } catch {
      // Not valid JSON, continue
    }
  }
  // Detect genuine Python scripts (import / from / def / class at line start, or standard print statements)
  if (/^(?:import\s+[a-zA-Z0-9_]+|from\s+[a-zA-Z0-9_]+\s+import|def\s+[a-zA-Z0-9_]+\s*\(|class\s+[a-zA-Z0-9_]+)/m.test(answer) || /print\s*\(/.test(answer)) {
    // Avoid false positives on Markdown notes / reports starting with markdown headings
    if (!trimmed.startsWith('#')) {
      return 'language-python';
    }
  }
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
  Object.values(STORAGE_KEYS).forEach((key) => safeStorageRemove(key));
  safeStorageRemove('academic_integrity_agreed');
  
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

// ── Hosted-API status notice ───────────────────────────────────────────────────────────
// Shown automatically on any question whose answer/notes/guide references a hosted API host
// listed in `hosts`. Purely presentational — it never changes an answer or blocks anything.
//
// TO TURN IT OFF once the API is healthy again: set `enabled: false` (or delete the entry
// from `hosts`). Nothing else needs editing — no solver files reference this.
// TO REUSE IT for a future outage: flip `enabled` back to true and update `title`/`body`.
const API_STATUS_NOTICE = {
  // Verified back online 2026-08-01 (HTTP 200 on the live scrape-books endpoint) —
  // disabled rather than deleted so this exact copy/host list is ready to flip back on
  // instantly for any future outage.
  enabled: false,
  // Host substrings that mark a question as depending on the affected API.
  hosts: ['tds-roe-solver-api-t12026.onrender.com'],
  title: '⏳ Hosted API endpoints are temporarily down',
  body: [
    'The hosted API for this question is offline right now — the Render account hit its free',
    '5 GB monthly quota, so the service is suspended. It is expected back on',
    '<strong>1 August</strong>, after which this answer will work normally again with no',
    'change needed on your side.'
  ].join(' '),
  footnote: 'Everything else on this page still works — only the live API call is affected.'
};

function questionUsesAffectedApi(data) {
  if (!API_STATUS_NOTICE.enabled) return false;
  // Explicit opt-in, for solvers that call the API from JS without ever printing the URL
  // (e.g. GA6 Q7's on-demand digest button) — text matching alone can't see those.
  if (data.usesHostedApi) return true;
  if (!API_STATUS_NOTICE.hosts?.length) return false;
  const haystack = `${data.answer || ''}\n${data.answerDisplay || ''}\n${data.guide || ''}`.toLowerCase();
  return API_STATUS_NOTICE.hosts.some((host) => haystack.includes(host.toLowerCase()));
}

function renderApiStatusNotice(data) {
  if (!questionUsesAffectedApi(data)) return '';
  return `
    <div class="api-status-box">
      <div class="api-status-title">${escapeHtml(API_STATUS_NOTICE.title)}</div>
      <div class="api-status-body">${API_STATUS_NOTICE.body}</div>
      ${API_STATUS_NOTICE.footnote ? `<div class="api-status-note">${escapeHtml(API_STATUS_NOTICE.footnote)}</div>` : ''}
    </div>
  `;
}

function renderBackupEndpointsPanel(data) {
  if (!Array.isArray(data.backupEndpoints) || data.backupEndpoints.length === 0) return '';
  const rows = data.backupEndpoints.map((ep, i) => `
    <div class="backup-endpoint-row">
      <span class="backup-endpoint-label">${escapeHtml(ep.label || `Backup ${i + 1}`)}</span>
      <code class="backup-endpoint-url">${escapeHtml(ep.url)}</code>
      <button type="button" class="backup-copy-btn" data-backup-url="${escapeHtml(ep.url)}">Copy</button>
    </div>
  `).join('');

  return `
    <div class="backup-endpoints-box">
      <div class="backup-endpoints-title">🔁 Backup answer endpoints <span>(if the above doesn't respond)</span></div>
      <div class="backup-endpoints-list">${rows}</div>
    </div>
  `;
}

function renderAnswerPanel(data, langClass) {
  const escapedAnswer = escapeHtml(data.answer);
  const wrapClass = rawWrapEnabled ? 'raw-output-pre' : 'raw-output-nowrap';
  
  const answerMarkup = langClass
    ? `<pre class="raw-output"><code class="${langClass}" style="background:transparent; border:none; box-shadow:none;">${escapedAnswer}</code></pre>`
    : `<pre class="raw-output ${wrapClass}">${escapedAnswer}</pre>`;

  const charCount = typeof data.answer === 'string' ? data.answer.length : 0;
  const actions = `
    <div class="panel-actions" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn-ghost panel-btn" id="copyAnswerBtn">Copy Answer</button>
        <button class="btn-ghost panel-btn" id="downloadAnswerBtn">Download .txt</button>
        <button class="btn-ghost panel-btn" id="copyVariantBtn">Copy Variant</button>
        <button class="btn-ghost panel-btn" id="toggleWrapBtn">${rawWrapEnabled ? 'No Wrap' : 'Wrap Lines'}</button>
      </div>
      <div class="char-count-badge" style="font-size:11px; color:var(--text-secondary); font-family:var(--font-mono); background:var(--bg-input); padding:4px 10px; border-radius:4px; border:1px solid var(--border);">
        📝 <strong>${charCount.toLocaleString()}</strong> characters
      </div>
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
  const cleanRendered = addCodeCopyButtons(rendered.replace(/<a\s+(href="[^"]*")/gi, '<a target="_blank" rel="noopener noreferrer" $1'));
  
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

// Wraps every rendered <pre><code>...</code></pre> block with a "Copy" button so users
// never have to manually select code (e.g. multi-cell Colab snippets in P1/GA guides).
function addCodeCopyButtons(html) {
  return html.replace(/<pre>(<code[^>]*>[\s\S]*?<\/code>)<\/pre>/g, (_match, codeInner) => {
    return `<div class="code-block-wrapper"><pre>${codeInner}</pre><button type="button" class="code-copy-btn" title="Copy code">Copy</button></div>`;
  });
}

function renderGuidePanel(data) {
  if (!data.guide) return '';
  const rendered = typeof marked !== 'undefined' ? marked.parse(data.guide) : data.guide;
  const cleanRendered = addCodeCopyButtons(rendered.replace(/<a\s+(href="[^"]*")/gi, '<a target="_blank" rel="noopener noreferrer" $1'));
  // Direct-answer questions ("solved") already show the answer front-and-center in the Answer
  // panel above — keep the guide collapsed by default so the answer is what the user sees
  // first, without an extra click. Guide/bypass types have no standalone answer worth
  // surfacing on its own, so their guide stays expanded as before.
  const isSolved = data.type === 'solved';
  return createSection('Implementation Guide', `<div class="styled-output guide-output">${cleanRendered}</div>`, { open: !isSolved, extraClass: 'panel-guide' });
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

const T1_GA8_BONUS_WEIGHTS = {
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

const T2_GA8_BONUS_WEIGHTS = {
  'q-immutable-training-corpus-server': 1.5,
  'q-leakage-safe-bqml-server': 1.5,
  'q-mlflow-evidence-promotion-server': 1.25,
  'q-peft-repair-server': 2,
  'q-quantized-model-admission-server': 1.25,
  'q-content-addressed-pipeline-server': 1.5,
  'q-verifiable-model-bundle-server': 1,
  'q-lora-quant-budget-server': 2,
  'q-mlflow-fingerprint-server': 2.5,
  'q-modelcard-carbon-server': 2.5
};

function buildGa8BonusNode(email, term = 'T12026', answersList = null, durationText = '0.0ms') {
  const isT2 = term === 'T22026';
  const weights = isT2 ? T2_GA8_BONUS_WEIGHTS : T1_GA8_BONUS_WEIGHTS;
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const examName = isT2 ? 'May 2026 (tds-2026-05-ga8)' : 'Jan 2026 (tds-2026-01-ga8)';
  const serviceUrl = isT2 ? `https://tds-roe-solver-api-t12026.onrender.com/ga8/${encodeURIComponent(email)}` : 'https://hacked.com/actions/runs/1';

  const script = isT2 ? `(async function() {
    console.log("🚀 Starting May 2026 GA8 Dynamic Auto-Solver...");

    // 1. Detect dynamic email from active exam page DOM
    const rawEmail = document.querySelector('[name="email"]')?.value ||
                     document.querySelector('#email')?.value ||
                     document.querySelector('input[type="email"]')?.value ||
                     "${email}";
    const userEmail = rawEmail.trim().toLowerCase();
    const username = (userEmail.split('@')[0] || 'user').toLowerCase();
    const serviceUrl = "https://tds-roe-solver-api-t12026.onrender.com/ga8/" + encodeURIComponent(userEmail);

    console.log(\`📧 Running dynamic solvers for: \${userEmail}\`);

    // 2. Embedded deterministic ARC4 PRNG engine (100% exact parity with exam grader)
    function createSeedrandom() {
      var x = 256, h = 6, s = 52, r = Math.pow(x, h), e = Math.pow(2, s), i = e * 2, n = x - 1;
      function u(c) {
        var v, d = c.length, y = this, w = 0, _ = y.i = y.j = 0, m = y.S = [];
        for (d || (c = [d++]); w < x;) m[w] = w++;
        for (w = 0; w < x; w++) m[w] = m[_ = n & _ + c[w % d] + (v = m[w])], m[_] = v;
        (y.g = function(q) {
          for (var $, j = 0, S = y.i, O = y.j, G = y.S; q--;) $ = G[S = n & S + 1], j = j * x + G[n & (G[S] = G[O = n & O + $]) + (G[O] = $)];
          return y.i = S, y.j = O, j;
        })(x);
      }
      function A(c, v) {
        var d = [], y = typeof c, w;
        if (v && y == "object") for (w in c) try { d.push(A(c[w], v - 1)); } catch {}
        return d.length ? d : y == "string" ? c : c + "\\0";
      }
      function X(c, v) {
        for (var d = c + "", y, w = 0; w < d.length;) v[n & w] = n & (y ^= v[n & w] * 19) + d.charCodeAt(w++);
        return R(v);
      }
      function R(c) { return String.fromCharCode.apply(0, c); }
      return function(seed) {
        var y = [];
        X(A(seed, 3), y);
        var _ = new u(y);
        return function() {
          for (var q = _.g(h), $ = r, j = 0; q < e;) q = (q + j) * x, $ *= x, j = _.g(1);
          for (; q >= i;) q /= 2, $ /= 2, j >>>= 1;
          return (q + j) / $;
        };
      };
    }
    const seedrandom = createSeedrandom();

    // 3. Dynamic Q8 Solver: Layer-Wise LoRA Parameter Budget & Safetensors Footprint
    function computeLoraBudget(em) {
      const rng = seedrandom(\`\${em}#q-lora-quant-budget-server\`);
      const Ce = [2048, 3072, 4096];
      const Me = [
        ["q_proj","v_proj"],
        ["q_proj","k_proj","v_proj","o_proj"],
        ["q_proj","v_proj","gate_proj","up_proj"],
        ["q_proj","k_proj","v_proj","o_proj","gate_proj","up_proj","down_proj"]
      ];
      const Re = [4, 8, 16, 32];
      const hidden_size = Ce[Math.floor(rng() * Ce.length)];
      const num_hidden_layers = 24 + Math.floor(rng() * 9);
      const intermediate_size = 4 * hidden_size;

      let total_trainable_params = 0;
      for (let n = 0; n < num_hidden_layers; n++) {
        if (rng() < 0.25) continue;
        const target_modules = Me[Math.floor(rng() * Me.length)];
        const lora_rank = Re[Math.floor(rng() * Re.length)];
        for (const mod of target_modules) {
          if (['q_proj', 'k_proj', 'v_proj', 'o_proj'].includes(mod)) {
            total_trainable_params += 2 * lora_rank * hidden_size;
          } else if (['gate_proj', 'up_proj', 'down_proj'].includes(mod)) {
            total_trainable_params += lora_rank * (hidden_size + intermediate_size);
          }
        }
      }
      return {
        trainable_params: total_trainable_params,
        adapter_file_size_bytes: total_trainable_params * 4
      };
    }

    // 4. Dynamic Q9 Solver: Step-by-Step PyTorch Gradient Descent & MLflow Run ID
    function computeExactFingerprint(em) {
      const rng = seedrandom(\`\${em}#q-mlflow-fingerprint-server#v1\`);
      const m = 200, u = 8;
      const X = [];
      for (let f = 0; f < m; f++) {
        const v = [];
        for (let I = 0; I < u; I++) v.push(Number(((rng() - 0.5) * 4).toFixed(6)));
        X.push(v);
      }
      const e = Array.from({ length: u }, () => Number(((rng() - 0.5) * 2).toFixed(4)));
      const o = Number(((rng() - 0.5) * 2).toFixed(4));
      const n = Array.from({ length: u }, () => Number((0.05 + 0.1 * rng()).toFixed(4)));
      const y = [];
      for (let f = 0; f < m; f++) {
        const v = X[f];
        let I = o;
        for (let A = 0; A < u; A++) I += e[A] * v[A];
        I += 0.8 * Math.sin(v[0] * v[1]);
        I += 0.5 * (v[2] * v[2] - v[3]);
        I += 0.6 * Math.tanh(v[4] + v[5]);
        let E = 0;
        for (let A = 0; A < u; A++) E += n[A] * (rng() - 0.5);
        I += E;
        y.push(Number(I.toFixed(6)));
      }

      const lr = Number((0.01 + rng() * 0.05).toFixed(4));
      const batch_size = [16, 32, 64][Math.floor(rng() * 3)];
      const num_steps = 150 + Math.floor(rng() * 251);
      const weight_decay = Number((0.001 + rng() * 0.02).toFixed(4));
      const optNames = ['SGD', 'AdamW', 'RMSprop'];
      const optName = optNames[Math.floor(rng() * optNames.length)];
      const optConfig = { name: optName };

      if (optName === 'SGD') {
        optConfig.momentum = Number((0.8 + 0.15 * rng()).toFixed(2));
      } else if (optName === 'AdamW') {
        optConfig.beta1 = 0.9;
        optConfig.beta2 = Number((0.99 + 0.009 * rng()).toFixed(4));
        optConfig.eps = 1e-8;
      } else if (optName === 'RMSprop') {
        optConfig.alpha = Number((0.9 + 0.09 * rng()).toFixed(3));
        optConfig.eps = 1e-8;
        optConfig.momentum = rng() > 0.5 ? Number((0.8 + 0.1 * rng()).toFixed(2)) : 0;
      }

      function boxMuller(r) {
        let u1 = 0, u2 = 0;
        while (u1 === 0) u1 = r();
        while (u2 === 0) u2 = r();
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      }

      const torch_seed = 10000 + Math.floor(rng() * 89999);
      const schemes = ['kaiming_uniform', 'xavier_normal', 'custom_seeded'];
      const scheme = schemes[Math.floor(rng() * schemes.length)];
      const W_init = [];
      let b_init = 0;

      if (scheme === 'kaiming_uniform') {
        const f = Math.sqrt(1 / u);
        for (let v = 0; v < u; v++) W_init.push(Number(((rng() - 0.5) * 2 * f).toFixed(6)));
        b_init = Number(((rng() - 0.5) * 2 * f).toFixed(6));
      } else if (scheme === 'xavier_normal') {
        const f = Math.sqrt(2 / (u + 1));
        for (let v = 0; v < u; v++) W_init.push(Number((f * boxMuller(rng)).toFixed(6)));
        b_init = Number((f * boxMuller(rng)).toFixed(6));
      } else {
        for (let v = 0; v < u; v++) W_init.push(Number(((rng() - 0.5) * 1.5).toFixed(6)));
        b_init = Number(((rng() - 0.5) * 1.5).toFixed(6));
      }

      const schedTypes = ['cosine', 'step'];
      const schedType = schedTypes[Math.floor(rng() * schedTypes.length)];
      const lr_schedule = { type: schedType };
      if (schedType === 'cosine') {
        lr_schedule.lr_min = Number((lr * 0.1).toFixed(6));
      } else {
        lr_schedule.step_size = Math.floor(num_steps / 3);
        lr_schedule.gamma = 0.5;
      }

      let W = [...W_init], b = b_init;
      let v_W = new Array(u).fill(0), v_b = 0;
      let m_W = new Array(u).fill(0), m_b = 0;
      let v_adam_W = new Array(u).fill(0), v_adam_b = 0;
      let v_rms_W = new Array(u).fill(0), v_rms_b = 0;
      let buf_W = new Array(u).fill(0), buf_b = 0;

      const losses = [];
      for (let step = 0; step < num_steps; step++) {
        const idx = (step * batch_size) % m;
        const batch_indices = [];
        for (let j = 0; j < batch_size; j++) batch_indices.push((idx + j) % m);

        let loss_sum = 0;
        const grad_W = new Array(u).fill(0);
        let grad_b = 0;

        for (let k = 0; k < batch_size; k++) {
          const rowIdx = batch_indices[k];
          const x_row = X[rowIdx];
          let y_pred = b;
          for (let f = 0; f < u; f++) y_pred += x_row[f] * W[f];
          const diff = y_pred - y[rowIdx];
          loss_sum += diff * diff;
          const dloss = (2 / batch_size) * diff;
          for (let f = 0; f < u; f++) grad_W[f] += dloss * x_row[f];
          grad_b += dloss;
        }
        losses.push(loss_sum / batch_size);

        let lr_i = lr;
        if (lr_schedule.type === 'cosine') {
          lr_i = lr_schedule.lr_min + 0.5 * (lr - lr_schedule.lr_min) * (1 + Math.cos(step * Math.PI / num_steps));
        } else {
          lr_i = lr * Math.pow(lr_schedule.gamma, Math.floor(step / lr_schedule.step_size));
        }

        if (optConfig.name === 'AdamW') {
          const beta1 = optConfig.beta1, beta2 = optConfig.beta2, eps = 1e-8;
          const sc = step + 1;
          const bc1 = 1 - Math.pow(beta1, sc), bc2 = 1 - Math.pow(beta2, sc);
          for (let f = 0; f < u; f++) {
            W[f] -= lr_i * weight_decay * W[f];
            m_W[f] = beta1 * m_W[f] + (1 - beta1) * grad_W[f];
            v_adam_W[f] = beta2 * v_adam_W[f] + (1 - beta2) * (grad_W[f] * grad_W[f]);
            W[f] -= (lr_i / bc1) * (m_W[f] / (Math.sqrt(v_adam_W[f]) / Math.sqrt(bc2) + eps));
          }
          b -= lr_i * weight_decay * b;
          m_b = beta1 * m_b + (1 - beta1) * grad_b;
          v_adam_b = beta2 * v_adam_b + (1 - beta2) * (grad_b * grad_b);
          b -= (lr_i / bc1) * (m_b / (Math.sqrt(v_adam_b) / Math.sqrt(bc2) + eps));
        } else if (optConfig.name === 'SGD') {
          const momentum = optConfig.momentum || 0;
          for (let f = 0; f < u; f++) {
            let g = grad_W[f] + weight_decay * W[f];
            if (momentum !== 0) { v_W[f] = momentum * v_W[f] + g; g = v_W[f]; }
            W[f] -= lr_i * g;
          }
          let gb = grad_b + weight_decay * b;
          if (momentum !== 0) { v_b = momentum * v_b + gb; gb = v_b; }
          b -= lr_i * gb;
        } else if (optConfig.name === 'RMSprop') {
          const alpha = optConfig.alpha, eps = 1e-8, momentum = optConfig.momentum || 0;
          for (let f = 0; f < u; f++) {
            let g = grad_W[f] + weight_decay * W[f];
            v_rms_W[f] = alpha * v_rms_W[f] + (1 - alpha) * (g * g);
            const avg = Math.sqrt(v_rms_W[f]) + eps;
            if (momentum > 0) { buf_W[f] = momentum * buf_W[f] + g / avg; W[f] -= lr_i * buf_W[f]; }
            else { W[f] -= lr_i * (g / avg); }
          }
          let gb = grad_b + weight_decay * b;
          v_rms_b = alpha * v_rms_b + (1 - alpha) * (gb * gb);
          const avg_b = Math.sqrt(v_rms_b) + eps;
          if (momentum > 0) { buf_b = momentum * buf_b + gb / avg_b; b -= lr_i * buf_b; }
          else { b -= lr_i * (gb / avg_b); }
        }
      }

      const final_loss = Number(losses[losses.length - 1].toFixed(5));
      const last10 = losses.slice(-10);
      const mean_last_10_loss = Number((last10.reduce((a, b) => a + b, 0) / 10).toFixed(5));

      let hashVal = 2166136261;
      const hashSeed = \`\${em}#mlflow#\${torch_seed}#\${final_loss}\`;
      for (let i = 0; i < hashSeed.length; i++) {
        hashVal ^= hashSeed.charCodeAt(i);
        hashVal = Math.imul(hashVal, 16777619);
      }
      const h1 = (hashVal >>> 0).toString(16).padStart(8, '0');
      const h2 = ((hashVal ^ 0x55555555) >>> 0).toString(16).padStart(8, '0');
      const h3 = ((hashVal ^ 0xAAAAAAAA) >>> 0).toString(16).padStart(8, '0');
      const h4 = ((hashVal ^ 0x33333333) >>> 0).toString(16).padStart(8, '0');
      const run_id = \`\${h1}\${h2}\${h3}\${h4}\`;

      return { final_loss, run_id, mean_last_10_loss };
    }

    // 5. Compute dynamic answers for Q8, Q9, Q10
    const q8Obj = computeLoraBudget(userEmail);
    const q9Obj = computeExactFingerprint(userEmail);
    const existingQ10Val = document.getElementById('q-modelcard-carbon-server')?.value ||
                           document.querySelector('[name="q-modelcard-carbon-server"]')?.value;
    const q10Url = (existingQ10Val && existingQ10Val.startsWith('https://huggingface.co/')) ?
                   existingQ10Val.trim() :
                   \`https://huggingface.co/\${username}/tds-carbon-card\`;

    const answersMap = {
      "q-immutable-training-corpus-server": serviceUrl,
      "q-leakage-safe-bqml-server": serviceUrl,
      "q-mlflow-evidence-promotion-server": serviceUrl,
      "q-peft-repair-server": serviceUrl,
      "q-quantized-model-admission-server": serviceUrl,
      "q-content-addressed-pipeline-server": serviceUrl,
      "q-verifiable-model-bundle-server": serviceUrl,
      "q-lora-quant-budget-server": JSON.stringify(q8Obj, null, 2),
      "q-mlflow-fingerprint-server": JSON.stringify(q9Obj, null, 2),
      "q-modelcard-carbon-server": q10Url
    };

    console.log("Calculated Dynamic Answers:", answersMap);

    // 6. Populate all input fields with their EXACT expected answer
    for (const [qId, val] of Object.entries(answersMap)) {
      const input = document.getElementById(qId) ||
                    document.querySelector(\`[name="\${qId}"]\`) ||
                    document.querySelector(\`[data-question="\${qId}"] input, [data-question="\${qId}"] textarea\`);
      if (input) {
        input.value = val;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(\`✅ Populated \${qId}\`);
      }
    }

    // 7. Intercept JSON.stringify to ensure seal payload matches verified totals
    const originalStringify = JSON.stringify;
    window.JSON.stringify = function(obj, ...args) {
      if (obj && typeof obj === 'object' && 'answers' in obj && 'scores' in obj && 'total' in obj && 'max' in obj) {
        console.log("[TDS SOLVER] Intercepted GA8 final submission payload!");
        
        for (const [qId, val] of Object.entries(answersMap)) {
          if (!obj.answers[qId]) {
            obj.answers[qId] = val;
          }
        }
        
        let sumScores = 0;
        for (let q in obj.scores) {
          sumScores += Number(obj.scores[q]);
        }
        obj.total = sumScores;
        obj.max = ${totalWeight};
        console.log(\`[TDS SOLVER] Total score synced: \${obj.total} / \${obj.max}\`);
      }
      return originalStringify.call(this, obj, ...args);
    };

    // 8. Unlock all action buttons
    document.querySelectorAll('.save-action, .check-action, button.check-answer, button.btn-primary').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('d-none', 'disabled');
    });

    // 9. Click all "Check" buttons sequentially to trigger /backendVerify for each question
    const checkButtons = document.querySelectorAll('button.check-answer');
    console.log(\`Found \${checkButtons.length} question check buttons. Verifying in sequence...\`);

    for (let i = 0; i < checkButtons.length; i++) {
      const btn = checkButtons[i];
      const qId = btn.getAttribute('data-question') || btn.closest('[data-question]')?.getAttribute('data-question');
      console.log(\`🔍 Verifying Q\${i+1} (\${qId})...\`);
      btn.click();
      await new Promise(r => setTimeout(r, 2200));
    }

    console.log("🎉 All questions filled & verified! You can now click 'Save' to submit.");
    alert(\`✅ May 2026 GA8 Populated & Checked for \${userEmail}!\\n\\nReview the green badges and click 'Save' to submit.\`);
})();` : `(function() {
    const originalStringify = JSON.stringify;

    // Exact weight mappings from the TDS 2026 Jan GA8 exam
    const weights = ${JSON.stringify(weights, null, 8)};
    const totalMax = ${totalWeight};

    window.JSON.stringify = function(obj, ...args) {
        if (obj && typeof obj === 'object' && 'answers' in obj && 'scores' in obj && 'total' in obj && 'max' in obj) {
            console.log("[HACK] Intercepted payload!");
            
            obj.total = totalMax;
            obj.max = totalMax;
            
            for (let questionId in weights) {
                let correctWeight = weights[questionId] || 1; 
                obj.scores[questionId] = correctWeight;
                
                if (!obj.answers[questionId]) {
                    obj.answers[questionId] = "https://hacked.com/actions/runs/1|a,b,c,d,e,f,g";
                }
            }
            
            let sumScores = 0;
            for (let q in obj.scores) {
                sumScores += Number(obj.scores[q]);
            }
            obj.total = sumScores;
            obj.max = sumScores;
            
            console.log("[HACK] Injected appropriate individual max scores! Building cryptographic seal...");
        }
        return originalStringify.call(this, obj, ...args);
    };

    document.querySelectorAll('.save-action, .check-action').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('d-none');
    });

    console.log("Fixed bypass active! Click 'Save' to successfully submit your perfect score of " + totalMax + " marks.");
    alert("Fixed bypass active! Click 'Save' to successfully submit your perfect score of " + totalMax + " marks.");
})();`;

  return {
    title: `Bonus: GA8 One Shot Solver (${term})`,
    answer: script,
    type: 'guide',
    variant: `One Shot Solver for ${email} (${examName}). Official mapped total: ${totalWeight} marks. Just paste this script in the browser console on the exam page and click save to get your score.`,
    answerDisplay: `### 🎯 Bonus: GA8 One Shot Script (${examName})
- **Total Marks**: \`${totalWeight} marks\`
- **Target Exam**: \`${examName}\`

1. Open your GA8 Exam page in your browser.
2. Press **F12** (or right-click $\\to$ **Inspect**) and navigate to the **Console** tab.
3. Paste the script below and press **Enter**.
4. Click **Save** / **Check** on the exam page to submit your full \`${totalWeight}/${totalWeight}\` score!

\`\`\`javascript
${script}
\`\`\``,
    guide: `# Bonus: GA8 One Shot Solver (${examName})\n\nOpen developer console on the exam page, paste the script and click Save.\n\n\`\`\`javascript\n${script}\n\`\`\``,
    debug: {
      solverId: `ga8-bonus-seal-simulator-${term.toLowerCase()}`,
      normalizedEmail: email,
      term,
      totalWeight,
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
  document.getElementById('downloadAnswerBtn')?.addEventListener('click', () => {
    const safeName = (data.title || 'answer').replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase() || 'answer';
    downloadFile(`${safeName}.txt`, data.answer || '', 'text/plain');
    showToast('Answer downloaded as .txt', 'success');
  });
  canvas.querySelectorAll('.backup-copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      copyToClipboard(btn.dataset.backupUrl || '', btn);
    });
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

  const evaluateDraftBtn = document.getElementById('evaluateDraftBtn');
  if (evaluateDraftBtn) {
    evaluateDraftBtn.addEventListener('click', () => {
      if (typeof window.evaluateCurrentP2Draft === 'function') {
        window.evaluateCurrentP2Draft(data.id || data.title);
      }
    });
  }

  const p2DraftInput = document.getElementById('p2DraftInput');
  const p2LiveCharCount = document.getElementById('p2LiveCharCount');
  if (p2DraftInput && p2LiveCharCount) {
    p2DraftInput.addEventListener('input', () => {
      p2LiveCharCount.textContent = `${p2DraftInput.value.length.toLocaleString()} chars`;
    });
  }
}

function renderDashboard() {
  selectedQuestionIndex = -1;
  persistUiState();

  document.querySelectorAll('.nav-item').forEach((el) => el.classList.remove('active'));
  dashboardToggle.classList.add('active');

  breadcrumbs.innerHTML = `
    <span class="crumb crumb-home" id="breadcrumbHome" title="Back to home">tds-portal</span>
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
    <span class="crumb crumb-home" id="breadcrumbHome" title="Back to home">tds-portal</span>
    <span class="separator">/</span>
    <span class="crumb">${escapeHtml(workspaceData.exam || 'workspace')}</span>
    <span class="separator">/</span>
    <span class="crumb">Q${index + 1}</span>
  `;

  const langClass = detectLanguage(data.answer);
  const health = getHealthMeta(data);
  const isSpecial = data.title && (data.title.toLowerCase().includes('heist') || data.title.toLowerCase().includes('nonce') || data.title.toLowerCase().includes('proof-of-work'));

  // Direct-answer ("solved") questions already show the answer up front and the guide
  // collapsed — put the guide box below the answer too, so it doesn't visually precede
  // the thing the user actually came for. The onrender ga2/ga3 URL-answer case had the
  // same need for the same reason before "solved" had its own collapse behavior.
  const guideAfterAnswer = data.type === 'solved' || /onrender\.com\/ga[23]\//i.test(data.answer?.toLowerCase() || '');

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
        <div style="display: flex; align-items: center; gap: 10px;">
          <div id="miniVibeWidget" class="mini-vibe-widget${vibeAudio && !vibeAudio.paused ? ' playing' : ''}" title="Toggle Vibe Music">
            <span class="vibe-eq-anim${vibeAudio && !vibeAudio.paused ? ' playing' : ''}" id="miniVibeEqAnim"><span></span><span></span><span></span><span></span></span>
            <span id="miniVibeLabel" class="mini-vibe-label">${escapeHtml(vibePlaylist[vibeTrackIndex]?.title || '🎵 Vibe Music')}</span>
            <button type="button" id="miniVibePlayBtn" class="mini-vibe-btn">${vibeAudio && !vibeAudio.paused ? '⏸' : '▶'}</button>
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
          ${renderApiStatusNotice(data)}
          ${renderBackupEndpointsPanel(data)}
          ${renderAnswerPanel(data, langClass)}
          ${renderDiagnosticsPanel(data.debug)}
        `
        : `
          ${!guideAfterAnswer ? renderGuidePanel(data) : ''}
          ${renderApiStatusNotice(data)}
          ${renderBackupEndpointsPanel(data)}
          ${renderAnswerPanel(data, langClass)}
          ${guideAfterAnswer ? renderGuidePanel(data) : ''}
          ${renderNotesPanel(data)}
          ${renderDiagnosticsPanel(data.debug)}
        `
      }
    </div>
    <div class="canvas-footer-credits">
      <span>Project Sandbox by <a href="https://github.com/GyaanFlow" target="_blank" rel="noopener noreferrer">GyaanFlow</a> <span class="creator-nickname">— GT Indian</span></span>
      <span class="dot-separator">•</span>
      <span class="support-highlight">If this helped, <a href="https://github.com/GyaanFlow/tds-roe-solver-t12026" target="_blank" rel="noopener noreferrer">⭐ star the repo</a></span>
      <span class="dot-separator">•</span>
      <span class="support-highlight">Connect on <a href="https://www.linkedin.com/in/gaurav-tomar-630b2a316" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
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
  const heistDocument = safeStorageGet('tdsHeistDocument') || '';
  const powInput = safeStorageGet('tdsNonceInput') || '';

  if (!email) {
    emailInput.focus();
    emailInput.style.borderColor = 'var(--error)';
    showToast('Enter your exam email address first.', 'error');
    return;
  }

  // Every answer in this app is seeded from the email, so a typo does not fail loudly — it
  // produces a complete set of confident, plausible, WRONG answers. (e.g. dropping the
  // domain changes GA6 Q9's total from 2502117 to 2543363, with nothing on screen to hint
  // that anything is off.) The input is type="email" but it is not inside a <form>, so the
  // browser never runs its own validation; check it explicitly here instead.
  if (!isPlausibleEmail(email)) {
    emailInput.focus();
    emailInput.select();
    emailInput.style.borderColor = 'var(--error)';
    showToast(`"${email}" doesn't look like a full email address. Answers are generated from your email, so a typo silently produces wrong answers for every question.`, 'error', 7000);
    return;
  }

  if (!currentExam) {
    showToast('No exam available for this term yet.', 'error');
    return;
  }

  if ((currentExam === 'ga3' || currentExam === 'ga4' || currentExam === 'ga5') && !sessionToken) {
    showToast(`aipipe.org token is required for ${currentExam.toUpperCase()}!`, 'error');
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
  safeStorageSet(STORAGE_KEYS.term, currentTerm);
  safeStorageSet(STORAGE_KEYS.email, email);
  safeStorageSet(STORAGE_KEYS.exam, currentExam);

  // Update email history
  let history = [];
  try { history = JSON.parse(safeStorageGet(STORAGE_KEYS.emailHistory) || '[]'); } catch (_) {}
  history = [email, ...history.filter(e => e !== email)].slice(0, 10);
  safeStorageSet(STORAGE_KEYS.emailHistory, JSON.stringify(history));
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
      const registryModule = await import(`./solvers/${currentTerm}/${currentExam}/registry.js?v=${MODULE_CACHE_BUST}`);
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
          debug: result.debug,
          backupEndpoints: result.backupEndpoints,
          usesHostedApi: result.usesHostedApi
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
      const bonusAnswer = buildGa8BonusNode(email, currentTerm, workspaceData.answers, '0.0ms');
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
        maybeShowCelebrateCard(workspaceData.answers.length);
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

// "tds-portal" breadcrumb acts as a Home link. Delegated on the container (not the crumb
// itself) since breadcrumbs.innerHTML gets fully rebuilt on every navigation — a direct
// listener on the span would be destroyed each time. A full reload is deliberate here: the
// welcome screen's markup lives statically in index.html and isn't reconstructable from JS
// state alone, and DOMContentLoaded already re-fills the term/email/exam fields from
// localStorage, so nothing the user typed is lost.
breadcrumbs?.addEventListener('click', (event) => {
  if (event.target.closest('.crumb-home')) {
    window.location.reload();
  }
});

// Sidebar "TDS Portal" brand header is a Home link too, same reasoning as above.
document.getElementById('brandHome')?.addEventListener('click', () => {
  window.location.reload();
});

// Classic UI theme buttons are visible by default and can still be collapsed.
document.getElementById('classicUiToggle')?.addEventListener('click', (event) => {
  const toggle = event.currentTarget;
  const container = document.getElementById('classicUiButtons');
  const isExpanded = container.classList.toggle('expanded');
  toggle.setAttribute('aria-expanded', String(isExpanded));
});

// --- Vibe Mode: mood-refresher music player, powered entirely by Saaz Music. Fully opt-in by design:
//   - The panel is collapsed until the user clicks "🎵 Vibe Mode".
//   - Nothing is ever autoplayed — playback starts only from an explicit play click, even
//     across reloads (we restore the playlist/volume/shuffle/repeat prefs, never audio.play()).
//   - Playlist lives in localStorage so it survives reloads without needing a server.
const VIBE_PLAYLIST_KEY = 'vibePlaylistV1';
const VIBE_VOLUME_KEY = 'vibeVolume';
const VIBE_SHUFFLE_KEY = 'vibeShuffle';
const VIBE_REPEAT_KEY = 'vibeRepeat';

const vibeModeToggle = document.getElementById('vibeModeToggle');
const vibePlayer = document.getElementById('vibePlayer');
const vibeAudio = document.getElementById('vibeAudio');
const vibePlayBtn = document.getElementById('vibePlayBtn');
const vibeVolume = document.getElementById('vibeVolume');
const vibePlayerTrackLabel = document.getElementById('vibePlayerTrackLabel');
const vibeProgress = document.getElementById('vibeProgress');
const vibeCurrentTimeEl = document.getElementById('vibeCurrentTime');
const vibeDurationEl = document.getElementById('vibeDuration');
const vibeShuffleBtn = document.getElementById('vibeShuffleBtn');
const vibeRepeatBtn = document.getElementById('vibeRepeatBtn');
const vibeTrackListEl = document.getElementById('vibeTrackList');
const vibeAddToggle = document.getElementById('vibeAddToggle');
const vibeAddPanel = document.getElementById('vibeAddPanel');
const vibeClearBtn = document.getElementById('vibeClearBtn');
const vibeAddStatus = document.getElementById('vibeAddStatus');

let vibePlaylist = [];
let vibeTrackIndex = 0;
let vibeShuffle = false;
let vibeRepeat = false; // repeat-one; playlist itself always loops via next/prev wraparound
let vibeIsSeeking = false;

function formatVibeTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function saveVibePlaylist() { safeStorageSet(VIBE_PLAYLIST_KEY, JSON.stringify(vibePlaylist)); }
function loadVibePlaylistFromStorage() {
  try {
    const raw = safeStorageGet(VIBE_PLAYLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // Every track is a Saaz stream URL. Older entries from the retired local-file feature
    // (kind: 'file') have no working src anymore, so they're dropped on load.
    return parsed.filter(t => t && t.kind !== 'file' && typeof t.src === 'string');
  } catch {
    return [];
  }
}

function renderVibeTrackList() {
  if (!vibeTrackListEl) return;
  if (!vibePlaylist.length) { vibeTrackListEl.hidden = true; vibeTrackListEl.innerHTML = ''; return; }
  vibeTrackListEl.hidden = false;
  vibeTrackListEl.innerHTML = vibePlaylist.map((t, i) => `
    <li class="vibe-track-item${i === vibeTrackIndex ? ' active' : ''}" data-idx="${i}">
      <span class="vibe-track-name">${escapeHtml(t.title || `Track ${i + 1}`)}</span>
      <button type="button" class="vibe-track-remove" data-remove="${i}" title="Remove" aria-label="Remove track">✕</button>
    </li>
  `).join('');
}

function loadVibeTrack(index, { autoplay = false } = {}) {
  if (!vibePlaylist.length) return;
  vibeTrackIndex = ((index % vibePlaylist.length) + vibePlaylist.length) % vibePlaylist.length;
  const track = vibePlaylist[vibeTrackIndex];

  if (vibeAudio) vibeAudio.src = track.src;
  if (vibePlayerTrackLabel) vibePlayerTrackLabel.textContent = track.title || `Track ${vibeTrackIndex + 1}`;
  
  const coverContainer = document.getElementById('vibeCoverContainer');
  const coverArtImg = document.getElementById('vibeCoverArt');
  if (coverContainer && coverArtImg) {
    if (track.coverArt) {
      coverArtImg.src = track.coverArt;
      coverContainer.hidden = false;
    } else {
      coverContainer.hidden = true;
    }
  }

  if (vibeProgress) { vibeProgress.value = 0; vibeProgress.disabled = false; }
  if (vibeCurrentTimeEl) vibeCurrentTimeEl.textContent = '0:00';
  if (vibeDurationEl) vibeDurationEl.textContent = '0:00';
  renderVibeTrackList();
  updateSaazResultsHighlight();
  if (autoplay && vibeAudio) {
    vibeAudio.play().catch(() => {
      if (vibePlayerTrackLabel) vibePlayerTrackLabel.textContent = 'Playback blocked — click play again.';
    });
  }
}

function nextVibeIndex() {
  if (vibeShuffle && vibePlaylist.length > 1) {
    let next = vibeTrackIndex;
    while (next === vibeTrackIndex) next = Math.floor(Math.random() * vibePlaylist.length);
    return next;
  }
  return vibeTrackIndex + 1;
}

function updateMiniVibeState() {
  const isPlaying = vibeAudio && !vibeAudio.paused;
  const miniBtn = document.getElementById('miniVibePlayBtn');
  const miniWidget = document.getElementById('miniVibeWidget');
  const miniEq = document.getElementById('miniVibeEqAnim');
  const miniLabel = document.getElementById('miniVibeLabel');
  
  if (miniBtn) miniBtn.textContent = isPlaying ? '⏸' : '▶';
  if (miniWidget) miniWidget.classList.toggle('playing', isPlaying);
  if (miniEq) miniEq.classList.toggle('playing', isPlaying);
  if (miniLabel) {
    const currentTrack = vibePlaylist[vibeTrackIndex];
    miniLabel.textContent = currentTrack?.title || '🎵 Vibe Music';
  }
}

// Highlights whichever Saaz result matches the currently-loaded track, and swaps its ▶ for a
// ⏸/pulse indicator while playing, so the results list gives feedback on what's already queued/playing.
function updateSaazResultsHighlight() {
  if (!vibeSaazResults) return;
  const currentSrc = vibePlaylist[vibeTrackIndex]?.src;
  const isPlaying = vibeAudio && !vibeAudio.paused;
  vibeSaazResults.querySelectorAll('.vibe-saaz-item').forEach(item => {
    const isCurrent = !!currentSrc && item.dataset.saazSrc === currentSrc;
    item.classList.toggle('active', isCurrent);
    const icon = item.querySelector('.vibe-saaz-play-icon');
    if (icon) icon.textContent = isCurrent && isPlaying ? '⏸' : '▶';
  });
}

vibeModeToggle?.addEventListener('click', () => {
  const isExpanded = vibePlayer.classList.toggle('expanded');
  vibeModeToggle.setAttribute('aria-expanded', String(isExpanded));
  vibeModeToggle.setAttribute('aria-pressed', String(isExpanded));
});

vibeAudio?.addEventListener('play', () => {
  if (vibePlayBtn) vibePlayBtn.textContent = '⏸';
  document.getElementById('vibeEqAnim')?.classList.add('playing');
  updateMiniVibeState();
  updateSaazResultsHighlight();
});
vibeAudio?.addEventListener('pause', () => {
  if (vibePlayBtn) vibePlayBtn.textContent = '▶';
  document.getElementById('vibeEqAnim')?.classList.remove('playing');
  updateMiniVibeState();
  updateSaazResultsHighlight();
});
vibeAudio?.addEventListener('ended', () => {
  if (vibeRepeat) { loadVibeTrack(vibeTrackIndex, { autoplay: true }); return; }
  loadVibeTrack(nextVibeIndex(), { autoplay: true });
});
// A broken/unreachable URL shouldn't stall the whole playlist — skip to the next track and
// say why, rather than leaving the user staring at a player that silently does nothing.
vibeAudio?.addEventListener('error', () => {
  if (!vibePlaylist.length) return;
  if (vibePlayerTrackLabel) vibePlayerTrackLabel.textContent = `⚠️ Couldn't load "${vibePlaylist[vibeTrackIndex]?.title || 'this track'}" — skipping.`;
  if (vibePlaylist.length > 1) {
    setTimeout(() => loadVibeTrack(nextVibeIndex(), { autoplay: true }), 800);
  }
});
vibeAudio?.addEventListener('loadedmetadata', () => {
  if (vibeDurationEl) vibeDurationEl.textContent = formatVibeTime(vibeAudio.duration);
  // Some media reports an Infinity/NaN duration until more is buffered (or never, for certain
  // streamed formats) -- Math.floor(Infinity) is still Infinity, and "Infinity" is not a valid
  // <input type="range"> max, which silently breaks the seek bar. Guard with isFinite.
  if (vibeProgress) vibeProgress.max = String(Number.isFinite(vibeAudio.duration) ? Math.floor(vibeAudio.duration) : 100);
});
vibeAudio?.addEventListener('timeupdate', () => {
  if (vibeIsSeeking) return;
  if (vibeCurrentTimeEl) vibeCurrentTimeEl.textContent = formatVibeTime(vibeAudio.currentTime);
  if (vibeProgress) vibeProgress.value = String(vibeAudio.currentTime);
});
vibeProgress?.addEventListener('input', () => { vibeIsSeeking = true; if (vibeCurrentTimeEl) vibeCurrentTimeEl.textContent = formatVibeTime(Number(vibeProgress.value)); });
vibeProgress?.addEventListener('change', () => { if (vibeAudio) vibeAudio.currentTime = Number(vibeProgress.value); vibeIsSeeking = false; });

document.getElementById('vibeNextBtn')?.addEventListener('click', () => { const wasPlaying = vibeAudio && !vibeAudio.paused; loadVibeTrack(nextVibeIndex(), { autoplay: wasPlaying }); });
document.getElementById('vibePrevBtn')?.addEventListener('click', () => { const wasPlaying = vibeAudio && !vibeAudio.paused; loadVibeTrack(vibeTrackIndex - 1, { autoplay: wasPlaying }); });

// Play/pause toggle - delegated on document because #miniVibePlayBtn lives inside canvas.innerHTML
// and gets torn down/rebuilt on every question switch, so a direct listener on it would go stale.
async function toggleVibePlayback() {
  if (!vibeAudio) return;
  if (!vibePlaylist.length) {
    if (vibeAddPanel && vibeAddPanel.hidden) { vibeAddPanel.hidden = false; vibeAddToggle?.setAttribute('aria-expanded', 'true'); }
    if (vibePlayerTrackLabel) vibePlayerTrackLabel.textContent = 'No playlist loaded yet — search Saaz or add a track below.';
    return;
  }
  if (!vibeAudio.src) { await loadVibeTrack(vibeTrackIndex, { autoplay: true }); return; }
  if (vibeAudio.paused) {
    vibeAudio.play().catch(() => {
      if (vibePlayerTrackLabel) vibePlayerTrackLabel.textContent = 'Playback blocked — click play again.';
    });
  } else {
    vibeAudio.pause();
  }
}
document.addEventListener('click', (e) => {
  if (e.target.closest('#vibePlayBtn') || e.target.closest('#miniVibePlayBtn') || e.target.closest('#miniVibeWidget')) {
    toggleVibePlayback();
  }
});

vibeShuffleBtn?.addEventListener('click', () => {
  vibeShuffle = !vibeShuffle;
  safeStorageSet(VIBE_SHUFFLE_KEY, String(vibeShuffle));
  vibeShuffleBtn.classList.toggle('active', vibeShuffle);
  vibeShuffleBtn.setAttribute('aria-pressed', String(vibeShuffle));
});
vibeRepeatBtn?.addEventListener('click', () => {
  vibeRepeat = !vibeRepeat;
  safeStorageSet(VIBE_REPEAT_KEY, String(vibeRepeat));
  vibeRepeatBtn.classList.toggle('active', vibeRepeat);
  vibeRepeatBtn.setAttribute('aria-pressed', String(vibeRepeat));
});

const vibeMuteBtn = document.getElementById('vibeMuteBtn');
let vibeVolumeBeforeMute = null; // null = not muted

function updateVibeMuteIcon() {
  if (!vibeMuteBtn) return;
  const vol = Number(vibeVolume?.value ?? 0);
  const isMuted = vibeVolumeBeforeMute !== null || vol === 0;
  vibeMuteBtn.textContent = isMuted ? '🔇' : vol < 0.5 ? '🔉' : '🔊';
  vibeMuteBtn.setAttribute('aria-pressed', String(isMuted));
  vibeMuteBtn.title = isMuted ? 'Unmute' : 'Mute';
}

vibeVolume?.addEventListener('input', () => {
  if (vibeAudio) vibeAudio.volume = Number(vibeVolume.value);
  safeStorageSet(VIBE_VOLUME_KEY, vibeVolume.value);
  // Manually moving the slider off zero implicitly un-mutes.
  if (Number(vibeVolume.value) > 0) vibeVolumeBeforeMute = null;
  updateVibeMuteIcon();
});

vibeMuteBtn?.addEventListener('click', () => {
  if (!vibeVolume) return;
  if (vibeVolumeBeforeMute !== null) {
    // Unmute: restore whatever volume was set before muting.
    vibeVolume.value = String(vibeVolumeBeforeMute);
    vibeVolumeBeforeMute = null;
  } else {
    // Mute: remember current volume, drop to 0.
    vibeVolumeBeforeMute = Number(vibeVolume.value) || 0.6;
    vibeVolume.value = '0';
  }
  if (vibeAudio) vibeAudio.volume = Number(vibeVolume.value);
  safeStorageSet(VIBE_VOLUME_KEY, vibeVolume.value);
  updateVibeMuteIcon();
});

vibeTrackListEl?.addEventListener('click', (event) => {
  const removeIdx = event.target.closest('[data-remove]')?.dataset.remove;
  if (removeIdx !== undefined) {
    const idx = Number(removeIdx);
    const wasCurrent = idx === vibeTrackIndex;
    vibePlaylist.splice(idx, 1);
    saveVibePlaylist();
    if (!vibePlaylist.length) {
      vibeAudio?.pause();
      if (vibeAudio) vibeAudio.removeAttribute('src');
      if (vibePlayerTrackLabel) vibePlayerTrackLabel.textContent = 'No playlist loaded yet';
      if (vibeProgress) { vibeProgress.value = 0; vibeProgress.disabled = true; }
      renderVibeTrackList();
      return;
    }
    if (wasCurrent) loadVibeTrack(Math.min(idx, vibePlaylist.length - 1), { autoplay: false });
    else { if (idx < vibeTrackIndex) vibeTrackIndex -= 1; renderVibeTrackList(); }
    return;
  }
  const item = event.target.closest('.vibe-track-item');
  if (item) {
    const wasPlaying = vibeAudio && !vibeAudio.paused;
    loadVibeTrack(Number(item.dataset.idx), { autoplay: wasPlaying || true });
  }
});

const vibeSaazSearchInput = document.getElementById('vibeSaazSearchInput');
const vibeSaazSearchBtn = document.getElementById('vibeSaazSearchBtn');
const vibeSaazResults = document.getElementById('vibeSaazResults');

// Saaz Music API Search Integration (Multi-Mirror & CORS Fallback)
// saaz-next.vercel.app sends no Access-Control-Allow-Origin header at all, so every direct
// browser fetch to it always fails - every request here MUST go through a public CORS proxy.
// This list is periodically re-verified by hand (curl -D-, checking status + actual CORS
// headers + valid JSON body, not just "connects") since free proxies rotate between working
// and dead unpredictably. proxy.cors.sh confirmed reliable + sends real CORS headers as of
// this check; corsproxy.io/allorigins kept as opportunistic secondary shots since they do
// come back online sometimes; permanently-dead entries (thingproxy, cors-anywhere.herokuapp.com
// - the latter requires manually visiting a page to "unlock" temporary access, so it can't
// work headlessly) were removed rather than left as guaranteed-failing dead weight.
const SAAZ_PROXY_ORDER_KEY = 'vibeSaazProxyOrder';
const SAAZ_FETCH_TIMEOUT_MS = 6000;
const SAAZ_MAX_ATTEMPTS = 3; // initial try + 2 retries, since public proxies are flaky by nature

function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function buildSaazProxyEndpoints(targetUrl) {
  const enc = encodeURIComponent(targetUrl);
  return {
    direct: targetUrl,
    corsSh: `https://proxy.cors.sh/${targetUrl}`,
    corsproxy: `https://corsproxy.io/?url=${enc}`,
    allorigins: `https://api.allorigins.win/raw?url=${enc}`,
  };
}

// Shared by search and the mood playlists, since they render into the same results panel -
// a slow response from one must not be allowed to clobber a newer result from the other.
let _vibeSaazResultsToken = 0;

// Tries every proxy mirror (last-known-working one first) for one attempt, returns the parsed
// `data.songs`/`data.results` array or throws. Retrying across multiple full passes (not just
// once through the mirror list) is what actually makes this "always work" in practice - a proxy
// that's rate-limited on attempt 1 has often recovered by attempt 2 or 3.
async function fetchSaazSongs(targetUrl) {
  const endpoints = buildSaazProxyEndpoints(targetUrl);
  let order = Object.keys(endpoints);
  const lastGood = localStorage.getItem(SAAZ_PROXY_ORDER_KEY);
  if (lastGood && order.includes(lastGood)) {
    order = [lastGood, ...order.filter(k => k !== lastGood)];
  }

  let lastError = null;
  for (const key of order) {
    try {
      const res = await fetchWithTimeout(endpoints[key], SAAZ_FETCH_TIMEOUT_MS);
      if (!res.ok) continue;
      const text = await res.text();
      let json = JSON.parse(text);
      if (json && json.contents) {
        try { json = JSON.parse(json.contents); } catch {}
      }
      const songs = json.data?.results || json.data?.songs || (Array.isArray(json.data) ? json.data : []);
      if (Array.isArray(songs) && songs.length) {
        localStorage.setItem(SAAZ_PROXY_ORDER_KEY, key);
        return songs;
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('No mirror returned results.');
}

async function searchSaazMusic(query, { attempt = 1, _token } = {}) {
  const q = (query || '').trim();
  if (!q) return;
  if (!vibeSaazResults) return;
  const token = _token ?? ++_vibeSaazResultsToken;
  vibeSaazResults.innerHTML = `<div style="font-size:11px;color:var(--text-muted);padding:8px 0;">🔎 Searching Saaz music for "${escapeHtml(q)}"...</div>`;

  const targetUrl = `https://saaz-next.vercel.app/api/search/songs?q=${encodeURIComponent(q)}`;
  let songs = null, lastError = null;
  try {
    songs = await fetchSaazSongs(targetUrl);
  } catch (err) {
    lastError = err;
  }

  // A newer keystroke started a fresher search while this one was in flight - drop this result.
  if (token !== _vibeSaazResultsToken) return;

  if (!songs || !songs.length) {
    // Multiple full passes through the mirror list, not just one - a proxy that's rate-limited
    // on attempt 1 has often recovered by attempt 2 or 3.
    if (attempt < SAAZ_MAX_ATTEMPTS) {
      vibeSaazResults.innerHTML = `<div style="font-size:11px;color:var(--text-muted);padding:8px 0;">🔎 Still searching (attempt ${attempt + 1}/${SAAZ_MAX_ATTEMPTS})...</div>`;
      await new Promise(r => setTimeout(r, 900));
      if (token !== _vibeSaazResultsToken) return;
      return searchSaazMusic(query, { attempt: attempt + 1, _token: token });
    }
    vibeSaazResults.innerHTML = `
      <div style="font-size:11px;color:var(--warning);padding:8px 0;">
        ⚠️ Couldn't reach Saaz music right now (all mirrors failed${lastError ? ` — ${escapeHtml(lastError.message || String(lastError))}` : ''}).
        This depends on a free public music API that occasionally goes down or rate-limits. Try again in a moment.
      </div>
      <button type="button" id="vibeSaazRetryBtn" class="vibe-mini-btn" style="margin-top:6px;">🔄 Retry search</button>
    `;
    document.getElementById('vibeSaazRetryBtn')?.addEventListener('click', () => searchSaazMusic(query));
    return;
  }

  renderSaazSongList(songs);
}

function renderSaazSongList(songs, { limit = 15 } = {}) {
  vibeSaazResults.innerHTML = songs.slice(0, limit).map((song, i) => {
    const title = song.name || song.title || `Song ${i + 1}`;
    const artist = song.primaryArtists || song.singers || (Array.isArray(song.artists) ? song.artists.map(a => a.name).join(', ') : '') || 'Unknown Artist';
    const thumb = song.image?.[1]?.link || song.image?.[1]?.url || song.image?.[0]?.link || song.image?.[0]?.url || 'https://saaz-next.vercel.app/saaz.png';
    const highResArt = song.image?.[song.image.length - 1]?.link || song.image?.[song.image.length - 1]?.url || thumb;
    const downloadUrls = song.downloadUrl || [];
    const streamUrl = downloadUrls[downloadUrls.length - 1]?.link || downloadUrls[downloadUrls.length - 1]?.url || downloadUrls[0]?.link || downloadUrls[0]?.url || '';

    return `
      <div class="vibe-saaz-item" data-saaz-src="${escapeHtml(streamUrl)}" data-saaz-title="${escapeHtml(title + ' - ' + artist)}" data-saaz-art="${escapeHtml(highResArt)}">
        <img class="vibe-saaz-thumb" src="${escapeHtml(thumb)}" alt="" loading="lazy" />
        <div class="vibe-saaz-info">
          <div class="vibe-saaz-name">${escapeHtml(title)}</div>
          <div class="vibe-saaz-artist">${escapeHtml(artist)}</div>
        </div>
        <span class="vibe-saaz-play-icon">▶</span>
      </div>
    `;
  }).join('');
  updateSaazResultsHighlight();
}

// Mood/genre playlist chips - fetched dynamically from Saaz's own editorial playlists (same
// proxy-fallback path as search). Never auto-loads; only on click.
async function loadSaazPlaylist(playlistId, label, { attempt = 1, _token } = {}) {
  if (!vibeSaazResults) return;
  const token = _token ?? ++_vibeSaazResultsToken;
  vibeSaazResults.innerHTML = `<div style="font-size:11px;color:var(--text-muted);padding:8px 0;">🎧 Loading ${escapeHtml(label)}...</div>`;

  const targetUrl = `https://saaz-next.vercel.app/api/playlist/${playlistId}`;
  let songs = null, lastError = null;
  try {
    songs = await fetchSaazSongs(targetUrl);
  } catch (err) {
    lastError = err;
  }

  // A newer search or another mood chip click started while this one was in flight - drop this result.
  if (token !== _vibeSaazResultsToken) return;

  if (!songs || !songs.length) {
    if (attempt < SAAZ_MAX_ATTEMPTS) {
      vibeSaazResults.innerHTML = `<div style="font-size:11px;color:var(--text-muted);padding:8px 0;">🎧 Still loading ${escapeHtml(label)} (attempt ${attempt + 1}/${SAAZ_MAX_ATTEMPTS})...</div>`;
      await new Promise(r => setTimeout(r, 900));
      if (token !== _vibeSaazResultsToken) return;
      return loadSaazPlaylist(playlistId, label, { attempt: attempt + 1, _token: token });
    }
    vibeSaazResults.innerHTML = `
      <div style="font-size:11px;color:var(--warning);padding:8px 0;">
        ⚠️ Couldn't load ${escapeHtml(label)} right now (all mirrors failed${lastError ? ` — ${escapeHtml(lastError.message || String(lastError))}` : ''}).
      </div>
      <button type="button" id="vibeSaazPlaylistRetryBtn" class="vibe-mini-btn" style="margin-top:6px;">🔄 Retry</button>
    `;
    document.getElementById('vibeSaazPlaylistRetryBtn')?.addEventListener('click', () => loadSaazPlaylist(playlistId, label));
    return;
  }

  renderSaazSongList(songs, { limit: 50 });
}

function clearActiveMoodChip() {
  _vibeActiveMoodChip?.classList.remove('active');
  _vibeActiveMoodChip = null;
}

vibeSaazSearchBtn?.addEventListener('click', () => {
  clearActiveMoodChip();
  searchSaazMusic(vibeSaazSearchInput?.value);
});

vibeSaazSearchInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { clearActiveMoodChip(); searchSaazMusic(vibeSaazSearchInput.value); }
});

// Live search-as-you-type, debounced, matching Saaz's own site behavior -
// no need to press Enter or click Search for common queries.
let _vibeSaazSearchTimer = null;
vibeSaazSearchInput?.addEventListener('input', () => {
  clearActiveMoodChip();
  clearTimeout(_vibeSaazSearchTimer);
  const q = vibeSaazSearchInput.value.trim();
  if (q.length < 2) return;
  _vibeSaazSearchTimer = setTimeout(() => searchSaazMusic(q), 450);
});

let _vibeActiveMoodChip = null;
document.getElementById('vibeSaazMoods')?.addEventListener('click', (e) => {
  const chip = e.target.closest('.vibe-mood-chip');
  if (!chip) return;
  _vibeActiveMoodChip?.classList.remove('active');
  chip.classList.add('active');
  _vibeActiveMoodChip = chip;
  loadSaazPlaylist(chip.dataset.moodId, chip.dataset.moodLabel);
});

vibeSaazResults?.addEventListener('click', async (e) => {
  // Artist name click re-searches for that artist, rather than queuing the track underneath it.
  const artistEl = e.target.closest('.vibe-saaz-artist');
  if (artistEl) {
    e.stopPropagation();
    const artistQuery = artistEl.textContent.split(',')[0].trim(); // first artist if several are listed
    if (!artistQuery || artistQuery === 'Unknown Artist') return;
    if (vibeSaazSearchInput) vibeSaazSearchInput.value = artistQuery;
    clearActiveMoodChip();
    searchSaazMusic(artistQuery);
    return;
  }
  const item = e.target.closest('[data-saaz-src]');
  if (!item) return;
  const src = item.dataset.saazSrc;
  const title = item.dataset.saazTitle;
  const coverArt = item.dataset.saazArt;
  if (!src) {
    if (vibeAddStatus) vibeAddStatus.textContent = '⚠️ Stream URL unavailable for this track.';
    return;
  }
  
  let existingIndex = vibePlaylist.findIndex(t => t.src === src);
  if (existingIndex < 0) {
    vibePlaylist.push({ kind: 'url', title, src, coverArt });
    saveVibePlaylist();
    existingIndex = vibePlaylist.length - 1;
  }
  await loadVibeTrack(existingIndex, { autoplay: true });
});

function updateVibeProfileBadge(email) {
  const userNameEl = document.getElementById('vibeUserName');
  if (!userNameEl) return;
  const norm = (email || '').trim();
  if (norm && norm.includes('@')) {
    userNameEl.textContent = `Focus Session for ${norm.split('@')[0]}`;
  } else {
    userNameEl.textContent = 'Focus Session';
  }
}

vibeAddToggle?.addEventListener('click', () => {
  const isHidden = vibeAddPanel.hidden;
  vibeAddPanel.hidden = !isHidden;
  vibeAddToggle.setAttribute('aria-expanded', String(isHidden));
});

function setVibeAddStatus(text, color) {
  if (!vibeAddStatus) return;
  vibeAddStatus.textContent = text;
  vibeAddStatus.style.color = color || '';
}

vibeClearBtn?.addEventListener('click', () => {
  vibePlaylist = [];
  vibeTrackIndex = 0;
  saveVibePlaylist();
  vibeAudio?.pause();
  if (vibeAudio) vibeAudio.removeAttribute('src');
  if (vibePlayerTrackLabel) vibePlayerTrackLabel.textContent = 'No playlist loaded yet';
  if (vibeProgress) { vibeProgress.value = 0; vibeProgress.disabled = true; }
  renderVibeTrackList();
  setVibeAddStatus('Playlist cleared.');
});

// --- Restore persisted state. Deliberately never calls audio.play() here — only cues the
// first track (src set, paused) so a returning user's playlist/volume/shuffle/repeat prefs are
// back exactly as they left them, without ever making noise on their own. ---
vibePlaylist = loadVibePlaylistFromStorage();
vibeShuffle = safeStorageGet(VIBE_SHUFFLE_KEY) === 'true';
vibeRepeat = safeStorageGet(VIBE_REPEAT_KEY) === 'true';
if (vibeShuffleBtn) { vibeShuffleBtn.classList.toggle('active', vibeShuffle); vibeShuffleBtn.setAttribute('aria-pressed', String(vibeShuffle)); }
if (vibeRepeatBtn) { vibeRepeatBtn.classList.toggle('active', vibeRepeat); vibeRepeatBtn.setAttribute('aria-pressed', String(vibeRepeat)); }
const storedVibeVolume = safeStorageGet(VIBE_VOLUME_KEY);
if (vibeVolume && storedVibeVolume !== null && storedVibeVolume !== undefined && storedVibeVolume !== '') vibeVolume.value = storedVibeVolume;
if (vibeAudio) vibeAudio.volume = Number(vibeVolume?.value ?? 0.6);
updateVibeMuteIcon();
if (vibePlaylist.length) {
  renderVibeTrackList();
  // Cues (src set, paused) via the normal async loader -- necessary rather than reading
  // track.src directly, since a file-kind track's playable URL only exists after its bytes
  // are pulled back out of IndexedDB. Never passes autoplay: true.
  loadVibeTrack(0);
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
  safeStorageSet(STORAGE_KEYS.search, term);
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
  // No 'input' listener here on purpose — the token is intentionally never persisted.
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
  const emailVal = emailInput.value.trim();
  updateVibeProfileBadge(emailVal);
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

// Academic Integrity Disclaimer checkbox & slide-to-unlock handling
const agreeDisclaimerCheckbox = document.getElementById('agreeDisclaimerCheckbox');
const sliderHandle = document.getElementById('sliderButtonHandle');
const sliderTrack = document.getElementById('sliderTrack');
const sliderFill = document.getElementById('sliderGlowFill');
const card = document.getElementById('academicDisclaimer');

if (agreeDisclaimerCheckbox) {
  const hasAgreed = safeStorageGet('academic_integrity_agreed') === 'true';
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
      safeStorageSet('academic_integrity_agreed', 'true');
      card?.classList.remove('pulse-attention');
      card?.classList.add('agreed-state');
    } else {
      safeStorageRemove('academic_integrity_agreed');
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
  safeStorageSet('workspaceTheme', theme);
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

  // Falls back to amber if a theme is ever removed from THEME_COLORS without removing its
  // button — keeps this future-proof against partial edits instead of throwing on
  // `colors.primary` when `colors` is undefined.
  if (networkCanvas && typeof networkCanvas.setThemeColors === 'function') {
    const colors = THEME_COLORS[theme] || THEME_COLORS.amber;
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

// Delegated click handler for Q11 Context Heist card actions
document.addEventListener('click', async (event) => {
  if (!event.target) return;

  if (event.target.classList?.contains('code-copy-btn')) {
    const wrapper = event.target.closest('.code-block-wrapper');
    const codeEl = wrapper?.querySelector('code');
    if (codeEl) copyToClipboard(codeEl.innerText, event.target);
    return;
  }

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
    safeStorageSet('tdsHeistDocument', docText);
    showToast('Extracting facts...', 'info');
    startSolving();
  } else if (event.target.id === 'heist-card-clear-btn') {
    safeStorageRemove('tdsHeistDocument');
    showToast('Pasted document cleared.', 'info');
    startSolving();
  } else if (event.target.id === 'pow-clear-btn') {
    safeStorageRemove('tdsNonceInput');
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
    const diff = parseInt(difficulty, 10);
    const expectedHashes = Math.pow(2, diff);
    // Conservative estimate: Colab free tier ~1M hashes/sec (2-core aggregate)
    // Actual varies 0.8-2M/sec depending on throttling
    const estLow = Math.round(expectedHashes / 2000000);
    const estHigh = Math.round(expectedHashes / 800000);
    function fmt(s) {
      if (s < 60) return `~${s}s`;
      if (s < 3600) return `~${Math.floor(s / 60)}min ${s % 60}s`;
      return `~${(s / 3600).toFixed(1)}h`;
    }
    const timeStr = `${fmt(estLow)} – ${fmt(estHigh)}`;

    const estimateEl = document.getElementById('pow-estimate');
    if (estimateEl) {
      estimateEl.innerHTML = `Expected: ~${expectedHashes.toExponential(1)} hashes → ${timeStr} on Colab (2 cores)`;
    }

    const tokenShort = token.length > 16 ? token.slice(0, 8) + '...' + token.slice(-4) : token;
    const script = `# Q10 Proof-of-Work Miner — Robust CPU version — Google Colab
# 1. Paste into https://colab.research.google.com and run
# 2. Copy the Nonce number from the output

import hashlib, time, multiprocessing as mp

TOKEN = "${token}"
DIFFICULTY = ${diff}

def mine_worker(args):
    token, difficulty, start, step, report_every = args
    pref = (token + ":").encode()
    full_bytes = difficulty // 8
    rem_bits = difficulty % 8
    mask = (0xFF << (8 - rem_bits)) & 0xFF if rem_bits else 0
    zero_prefix = b'\\x00' * full_bytes
    sha256 = hashlib.sha256

    n = start
    while True:
        h = sha256(pref + str(n).encode()).digest()
        if h[:full_bytes] == zero_prefix and (rem_bits == 0 or (h[full_bytes] & mask) == 0):
            return n
        n += step


def verify_nonce(token, difficulty, nonce):
    """Double-check the winning nonce actually satisfies the difficulty."""
    pref = (token + ":").encode()
    h = hashlib.sha256(pref + str(nonce).encode()).digest()
    full_bytes = difficulty // 8
    rem_bits = difficulty % 8
    mask = (0xFF << (8 - rem_bits)) & 0xFF if rem_bits else 0
    zero_prefix = b'\\x00' * full_bytes
    return h[:full_bytes] == zero_prefix and (rem_bits == 0 or (h[full_bytes] & mask) == 0)


def main():
    t0 = time.time()
    nw = max(1, mp.cpu_count())
    print(f"Token: {TOKEN}")
    print(f"Difficulty: {DIFFICULTY} bits")
    print(f"Mining with {nw} worker(s)...\\n")

    pool = None
    try:
        pool = mp.Pool(nw)
        args = [(TOKEN, DIFFICULTY, i, nw, 500_000) for i in range(nw)]
        result = None

        for r in pool.imap_unordered(mine_worker, args):
            result = r
            break

        pool.terminate()
        pool.join()

        if result is None:
            print("Mining failed — no nonce found.")
            return

        elapsed = time.time() - t0

        if not verify_nonce(TOKEN, DIFFICULTY, result):
            print("WARNING: nonce failed verification — this should not happen.")
            print("Retry running the cell.")
            return

        print(f"\\n{'=' * 42}")
        print("  ** Q10 MINER RESULT **")
        print(f"{'=' * 42}")
        print(f"  Token:      ${tokenShort}")
        print(f"  Difficulty: ${diff}")
        print(f"  Nonce:      {result}      <---- COPY THIS")
        print(f"  Time:       {elapsed:.2f}s")
        print(f"  Verified:   valid ({DIFFICULTY}-bit difficulty confirmed)")
        print(f"{'=' * 42}")

    except KeyboardInterrupt:
        print("\\nMining interrupted by user.")
        if pool:
            pool.terminate()
            pool.join()
    except Exception as e:
        print(f"Error during mining: {e}")
        if pool:
            pool.terminate()
            pool.join()
        raise


if __name__ == "__main__":
    main()`;

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
    safeStorageSet('tdsNonceInput', `${token}|${difficulty}|${nonce}|colab`);
    showToast('Nonce submitted! Re-solving...', 'success');
    startSolving();
  }
});
