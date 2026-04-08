import { solvers } from './solvers/ga7/registry.js';

const emailList = document.getElementById('emailList');
const limitInput = document.getElementById('limitInput');
const runBtn = document.getElementById('runBtn');
const statEmails = document.getElementById('statEmails');
const statRuns = document.getElementById('statRuns');
const statFailures = document.getElementById('statFailures');
const statWarnings = document.getElementById('statWarnings');
const solverTable = document.getElementById('solverTable');
const failureLog = document.getElementById('failureLog');

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

async function runVerification() {
  const requestedLimit = Number(limitInput.value) || 1;
  const emails = parseEmails(emailList.value).slice(0, requestedLimit);
  const solverStats = createSolverStats();
  const failureLines = [];
  let totalRuns = 0;
  let totalFailures = 0;
  let totalWarnings = 0;

  runBtn.disabled = true;
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
    : 'No verification failures. All wrapped GA7 solvers returned valid output shapes for this email batch.';
  runBtn.disabled = false;
}

emailList.value = buildDefaultEmails().join('\n');
renderSolverTable(createSolverStats());
runBtn.addEventListener('click', runVerification);
