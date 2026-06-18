// Universal Solver Verification Hub Logic Engine

const TERM_EXAMS = {
  T12026: [
    { value: 'roe', label: 'ROE Re-Exam' },
    { value: 'p2',  label: 'Project 2 Part B' },
    { value: 'ga7', label: 'GA 7 (Data Visualization)' },
    { value: 'ga8', label: 'GA 8 (MLOps & DevOps)' },
  ],
  T22026: [
    { value: 'ga0', label: 'GA 0 (Warm-up Exam)' },
    { value: 'ga1', label: 'GA 1 (Developer Tools)' }
  ]
};

const termSelect = document.getElementById('termSelect');
const examSelect = document.getElementById('examSelect');
const emailList = document.getElementById('emailList');
const limitInput = document.getElementById('limitInput');
const runBtn = document.getElementById('runBtn');
const copyLogBtn = document.getElementById('copyLogBtn');
const downloadReportBtn = document.getElementById('downloadReportBtn');
const progressPanel = document.getElementById('progressPanel');
const progressFill = document.getElementById('progressFill');
const progressPercentage = document.getElementById('progressPercentage');
const progressState = document.getElementById('progressState');

const statEmails = document.getElementById('statEmails');
const statRuns = document.getElementById('statRuns');
const statFailures = document.getElementById('statFailures');
const statWarnings = document.getElementById('statWarnings');
const solverTable = document.getElementById('solverTable');
const failureLog = document.getElementById('failureLog');
const toastRoot = document.getElementById('toastRoot');

let lastReport = null;
let toastTimerId = null;

// Populate exams based on term selection
function populateExams() {
  const term = termSelect.value;
  const exams = TERM_EXAMS[term] || [];
  examSelect.innerHTML = exams.map(e => `<option value="${e.value}">${e.label}</option>`).join('');
}

termSelect.addEventListener('change', populateExams);

// Generate diverse default emails to test parsing and RNG bounds
function buildDefaultEmails() {
  const domains = [
    'ds.study.iitm.ac.in',
    'study.iitm.ac.in',
  ];
  const emails = [];
  for (let i = 1; i <= 60; i++) {
    const roll = `21f${String(1000000 + i).slice(1)}`;
    emails.push(`${roll}@${domains[i % domains.length]}`);
  }
  // Add some mixed casing and special characters to ensure parser robustness
  emails.push('User.Name+Test@Study.Iitm.Ac.In');
  emails.push('test-account@ds.study.iitm.ac.in');
  return emails;
}

function parseEmails(raw) {
  return raw
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function showToast(message, tone = 'info') {
  window.clearTimeout(toastTimerId);
  toastRoot.innerHTML = `
    <div class="toast toast-${tone} toast-visible">
      <span>${escapeHtml(message)}</span>
    </div>
  `;
  toastTimerId = window.setTimeout(() => {
    const toast = toastRoot.firstElementChild;
    toast?.classList.remove('toast-visible');
    window.setTimeout(() => { toastRoot.innerHTML = ''; }, 220);
  }, 2200);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setSummary({ emails, runs, failures, warnings }) {
  statEmails.textContent = String(emails);
  statRuns.textContent = String(runs);
  statFailures.textContent = String(failures);
  statWarnings.textContent = String(warnings);
}

function renderSolverTable(statsBySolver) {
  if (statsBySolver.size === 0) {
    solverTable.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 32px 0;">No solvers found in registry.</td></tr>`;
    return;
  }

  const rows = [...statsBySolver.values()]
    .map(stat => {
      const avg = stat.runs ? `${(stat.totalMs / stat.runs).toFixed(2)}ms` : 'n/a';
      const failClass = stat.failures ? 'text-error font-weight-bold' : 'text-success';
      const warnClass = stat.warnings ? 'text-warning' : 'text-success';
      return `
        <tr>
          <td><code>${escapeHtml(stat.id)}</code><br><span style="font-size:12px; color:var(--text-secondary);">${escapeHtml(stat.title)}</span></td>
          <td><code>${escapeHtml(stat.type || 'solved')}</code></td>
          <td>${stat.runs}</td>
          <td class="${failClass}">${stat.failures}</td>
          <td class="${warnClass}">${stat.warnings}</td>
          <td><code>${avg}</code></td>
        </tr>
      `;
    })
    .join('');
  solverTable.innerHTML = rows;
}

// Stubs for elements since solvers might access localStorage/navigator
function installVerifyStubs() {
  globalThis.performance = globalThis.performance || { now: () => Date.now() };
  if (!globalThis.localStorage) {
    globalThis.localStorage = {
      getItem() { return null; },
      setItem() {},
      removeItem() {}
    };
  }
}

async function executeVerification() {
  const term = termSelect.value;
  const exam = examSelect.value;
  const requestedLimit = Number(limitInput.value) || 1;
  const emails = parseEmails(emailList.value).slice(0, requestedLimit);

  if (emails.length === 0) {
    showToast('Please provide a valid list of email addresses.', 'error');
    return;
  }

  runBtn.disabled = true;
  copyLogBtn.disabled = true;
  downloadReportBtn.disabled = true;
  progressPanel.classList.remove('hidden');
  failureLog.textContent = 'Dynamically loading registry module...';

  installVerifyStubs();

  let solvers = [];
  try {
    const registryUrl = `./solvers/${term}/${exam}/registry.js?v=${Date.now()}`;
    const registry = await import(registryUrl);
    solvers = registry.solvers || [];
  } catch (err) {
    console.error(err);
    failureLog.textContent = `FATAL ERROR: Failed to import registry module at ./solvers/${term}/${exam}/registry.js\n\nDetails: ${err.message}\n${err.stack}`;
    runBtn.disabled = false;
    progressPanel.classList.add('hidden');
    showToast('Failed to load registry.', 'error');
    return;
  }

  const solverStats = new Map(
    solvers.map(s => [
      s.id,
      { id: s.id, title: s.title, type: 'unknown', runs: 0, failures: 0, warnings: 0, totalMs: 0 }
    ])
  );

  renderSolverTable(solverStats);

  const failureLines = [];
  let totalRuns = 0;
  let totalFailures = 0;
  let totalWarnings = 0;

  setSummary({ emails: emails.length, runs: 0, failures: 0, warnings: 0 });

  for (let eIdx = 0; eIdx < emails.length; eIdx++) {
    const email = emails[eIdx];
    
    // Update progress state
    const progress = Math.round(((eIdx) / emails.length) * 100);
    progressFill.style.width = `${progress}%`;
    progressPercentage.textContent = `${progress}%`;
    progressState.textContent = `Testing email ${eIdx + 1}/${emails.length}...`;

    for (const solver of solvers) {
      totalRuns += 1;
      const stat = solverStats.get(solver.id);
      stat.runs += 1;

      const tStart = performance.now();
      try {
        const result = await Promise.resolve(solver.solve(email));
        const duration = performance.now() - tStart;
        
        stat.type = result.type || 'solved';
        stat.totalMs += duration;

        const warnings = result.debug?.warnings?.length || 0;
        stat.warnings += warnings;
        totalWarnings += warnings;
      } catch (err) {
        stat.failures += 1;
        totalFailures += 1;
        failureLines.push(`[${solver.id}] Email: ${email} | Error: ${err.message}`);
        console.error(`Solver ${solver.id} failed for email ${email}:`, err);
      }

      setSummary({
        emails: emails.length,
        runs: totalRuns,
        failures: totalFailures,
        warnings: totalWarnings
      });
    }

    // Give browser event loop a breathing micro-timeout
    await new Promise(resolve => window.setTimeout(resolve, 10));
  }

  // Set final progress values
  progressFill.style.width = '100%';
  progressPercentage.textContent = '100%';
  progressState.textContent = 'Verification run complete!';

  renderSolverTable(solverStats);

  if (failureLines.length > 0) {
    failureLog.textContent = failureLines.join('\n');
    showToast(`Verification complete with ${totalFailures} failures.`, 'error');
  } else {
    failureLog.textContent = `Verification successful!\n\nAll ${solvers.length} active solvers executed stably across ${emails.length} email addresses with zero runtime errors.`;
    showToast('All solvers verified successfully!', 'success');
  }

  lastReport = {
    generatedAt: new Date().toISOString(),
    term,
    exam,
    emailCount: emails.length,
    totalRuns,
    totalFailures,
    totalWarnings,
    failures: failureLines,
    solvers: [...solverStats.values()].map(s => ({
      ...s,
      avgMs: s.runs ? Number((s.totalMs / s.runs).toFixed(2)) : 0
    }))
  };

  runBtn.disabled = false;
  copyLogBtn.disabled = failureLines.length === 0;
  downloadReportBtn.disabled = false;
}

function copyFailureLog() {
  const text = failureLog.textContent;
  navigator.clipboard.writeText(text)
    .then(() => showToast('Failure log copied to clipboard.', 'success'))
    .catch(() => showToast('Clipboard copy failed.', 'error'));
}

function downloadJsonReport() {
  if (!lastReport) return;
  const content = JSON.stringify(lastReport, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `solver_audit_${lastReport.term}_${lastReport.exam}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('JSON report download started.', 'success');
}

// Initial setup
populateExams();
emailList.value = buildDefaultEmails().join('\n');

runBtn.addEventListener('click', executeVerification);
copyLogBtn.addEventListener('click', copyFailureLog);
downloadReportBtn.addEventListener('click', downloadJsonReport);
