import { solvers } from './solvers/T22026/ga0/registry.js';

const emailList = document.getElementById('emailList');
const limitInput = document.getElementById('limitInput');
const runBtn = document.getElementById('runBtn');
const statEmails = document.getElementById('statEmails');
const statRuns = document.getElementById('statRuns');
const statFailures = document.getElementById('statFailures');
const statWarnings = document.getElementById('statWarnings');
const solverTable = document.getElementById('solverTable');
const failureLog = document.getElementById('failureLog');
const copyLogBtn = document.getElementById('copyLogBtn');
const downloadReportBtn = document.getElementById('downloadReportBtn');

let lastReport = null;

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
  return emails;
}

function parseEmails(raw) {
  return raw
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function setSummary({ emails, runs, failures, warnings }) {
  statEmails.textContent = String(emails);
  statRuns.textContent = String(runs);
  statFailures.textContent = String(failures);
  statWarnings.textContent = String(warnings);
}

function renderSolverTable(statsBySolver) {
  const rows = [...statsBySolver.values()]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(stat => {
      const avg = stat.runs ? `${(stat.totalMs / stat.runs).toFixed(2)}ms` : 'n/a';
      return `
        <tr>
          <td><code>${stat.id}</code><br>${stat.title}</td>
          <td>${stat.runs}</td>
          <td class="${stat.failures ? 'err' : 'ok'}">${stat.failures}</td>
          <td class="${stat.warnings ? 'warn' : 'ok'}">${stat.warnings}</td>
          <td>${avg}</td>
        </tr>
      `;
    })
    .join('');
  solverTable.innerHTML = rows;
}

function createSolverStats() {
  return new Map(
    solvers.map(solver => [
      solver.id,
      { id: solver.id, title: solver.title, runs: 0, failures: 0, warnings: 0, totalMs: 0 },
    ])
  );
}

async function copyText(text, btn) {
  if (!text) return;
  const original = btn?.textContent;
  try {
    await navigator.clipboard.writeText(text);
    if (btn) {
      btn.textContent = 'Copied';
      window.setTimeout(() => { btn.textContent = original; }, 1400);
    }
  } catch {
    if (btn) {
      btn.textContent = 'Copy failed';
      window.setTimeout(() => { btn.textContent = original; }, 1600);
    }
  }
}

function downloadJsonReport(report) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `GA0-verification-${Date.now()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function runVerification() {
  const requestedLimit = Number(limitInput.value) || 1;
  const emails = parseEmails(emailList.value).slice(0, requestedLimit);
  const solverStats = createSolverStats();
  const failureLines = [];
  let totalRuns = 0;
  let totalFailures = 0;
  let totalWarnings = 0;

  runBtn.disabled = true;
  copyLogBtn.disabled = true;
  downloadReportBtn.disabled = true;
  failureLog.textContent = 'Running verification...';
  setSummary({ emails: emails.length, runs: 0, failures: 0, warnings: 0 });

  for (const email of emails) {
    for (const solver of solvers) {
      totalRuns += 1;
      const stat = solverStats.get(solver.id);
      stat.runs += 1;

      try {
        const result = await solver.solve(email);
        const warnings = result.debug?.warnings?.length || 0;
        totalWarnings += warnings;
        stat.warnings += warnings;
        stat.totalMs += result.debug?.durationMs || 0;
      } catch (error) {
        totalFailures += 1;
        stat.failures += 1;
        failureLines.push(`${solver.id} | ${email} | ${error.message}`);
      }

      setSummary({
        emails: emails.length,
        runs: totalRuns,
        failures: totalFailures,
        warnings: totalWarnings,
      });
    }
  }

  renderSolverTable(solverStats);
  failureLog.textContent = failureLines.length
    ? failureLines.join('\n')
    : 'No verification failures. All wrapped GA0 solvers returned valid output shapes for this email batch.';
  lastReport = {
    generatedAt: new Date().toISOString(),
    emailCount: emails.length,
    totalRuns,
    totalFailures,
    totalWarnings,
    failures: failureLines,
    solvers: [...solverStats.values()].map((stat) => ({
      ...stat,
      avgMs: stat.runs ? Number((stat.totalMs / stat.runs).toFixed(2)) : null,
    })),
  };
  runBtn.disabled = false;
  copyLogBtn.disabled = false;
  downloadReportBtn.disabled = false;
}

emailList.value = buildDefaultEmails().join('\n');
renderSolverTable(createSolverStats());
runBtn.addEventListener('click', runVerification);
copyLogBtn.addEventListener('click', () => copyText(failureLog.textContent, copyLogBtn));
downloadReportBtn.addEventListener('click', () => {
  if (lastReport) {
    downloadJsonReport(lastReport);
  }
});
