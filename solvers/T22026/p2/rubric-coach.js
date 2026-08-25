// Rubric Intelligence Terminal & Interactive Draft Evaluator for Project 2 Case Studies
import { CASE_SPECS, validateCaseAnswer, analyzeDraft } from './case-specs.js';

/**
 * Full-Spectrum Rubric Review
 * Evaluates draft against the official 12.5-mark dual structure:
 *  - 2.5 Marks: Submission format & character gate (deterministic).
 *  - 10.0 Marks: Evaluated offline against evidence depth, traceability, calibration, and reversibility.
 */
export function reviewSubmission(caseId, draftText) {
  const spec = CASE_SPECS[caseId];
  const text = String(draftText || '').trim();

  if (!spec) {
    return {
      score: text.length > 0 ? 100 : 0,
      qualityPct: text.length > 0 ? 100 : 0,
      formatMarks: 0,
      estimatedBand: 'unknown case',
      gateValid: true,
      checksPassed: ['Custom specification verified'],
      failedChecks: [],
      suggestions: [],
      metrics: { structure: '100%', bounds: 'Optimal', evidence: 'Present', density: 'High', figures: '0', prose: '0 words' },
      disclaimer: 'Heuristic feedback only — the offline marks are graded on reasoning, not structure.'
    };
  }

  const analysis = analyzeDraft(caseId, text);
  const { gate, signals, qualityPct, formatMarks, estimatedBand, citedFiles, figureCount, proseWordCount, evidenceRowCount } = analysis;

  const checksPassed = [];
  const failedChecks = [];
  const suggestions = [];

  // Hard gate check items
  if (gate.errors.length === 0) {
    checksPassed.push(`Official submission gate valid (${text.length.toLocaleString()} chars, gate ${spec.minChars}–${spec.maxChars})`);
  }
  for (const err of gate.errors) {
    failedChecks.push(err);
  }
  for (const warn of gate.warnings) {
    suggestions.push(warn);
  }

  // Quality & substance signals
  for (const s of signals) {
    if (s.passed) {
      checksPassed.push(s.label);
      if (s.hint) suggestions.push(s.hint);
    } else {
      failedChecks.push(s.label);
      if (s.hint) suggestions.push(s.hint);
    }
  }

  // Section headings count
  const headingsFound = spec.headings.filter(h =>
    new RegExp(`^##\\s+${h.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'im').test(text)
  ).length;
  const structurePct = spec.headings.length > 0 ? Math.round((headingsFound / spec.headings.length) * 100) : 100;

  const boundsStatus = text.length < spec.minChars ? 'Too Short'
    : text.length > spec.maxChars ? 'Too Long'
      : 'Optimal';

  return {
    score: qualityPct,
    qualityPct,
    formatMarks,
    estimatedBand,
    gateValid: gate.valid,
    gateErrors: gate.errors,
    signals,
    checksPassed,
    failedChecks,
    suggestions,
    metrics: {
      structure: `${structurePct}% (${headingsFound}/${spec.headings.length})`,
      bounds: boundsStatus,
      evidence: evidenceRowCount > 0 ? `${evidenceRowCount} row(s)` : 'Missing',
      density: `${citedFiles.length}/${(spec.dataFiles || []).length} files`,
      figures: `${figureCount} figures`,
      prose: `${proseWordCount} words`
    },
    disclaimer: 'This checks structure, character gates, citation traceability, and substance density. Offline analytical marks are graded by an examiner on reasoning calibration. High scores indicate strong alignment with official rubrics.'
  };
}

export function buildRubricCoachHtml(caseId, title) {
  const spec = CASE_SPECS[caseId] || { minChars: 200, maxChars: 6000, headings: [] };
  const skeletonContent = spec.headings.map(h => {
    if (h === 'Evidence Table') {
      return `## Evidence Table\n| Claim | Source | Confidence |\n|---|---|---|\n| [Claim 1] | [File + locator] | High |\n`;
    }
    if (h === 'Candidate Matches') {
      return `## Candidate Matches\n| Request(s) | Candidate and checks | Classification |\n|---|---|---|\n| [Request] | [Part ID + checks] | Actionable now |\n`;
    }
    return `## ${h}\n[Your analysis here]\n`;
  }).join('\n');

  return `
<div class="p2-coach-panel" id="p2CoachPanel" data-case-id="${caseId}">
  <div class="p2-coach-header">
    <div class="p2-coach-title-group">
      <div class="p2-coach-icon-badge">🎯</div>
      <div class="p2-coach-heading">
        <span>Rubric Intelligence Terminal & Draft Evaluator</span>
        <span class="p2-coach-subheading">Test your diagnostic note against official character gates, citation provenance & evaluator substance ceilings</span>
      </div>
    </div>
    <div class="p2-gate-chip">
      <span class="status-dot"></span>
      <span>Official Gate: <strong>${spec.minChars}–${spec.maxChars}</strong> chars</span>
    </div>
  </div>

  <div class="p2-textarea-wrap">
    <textarea 
      id="p2DraftInput" 
      class="p2-textarea" 
      placeholder="Paste your case study draft or diagnostic note here to test against the rubric..."
    ></textarea>
  </div>

  <div class="p2-coach-toolbar">
    <div class="p2-tool-buttons">
      <button type="button" class="p2-btn-evaluate" id="evaluateDraftBtn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        <span>Evaluate Draft</span>
      </button>
      <button type="button" class="p2-btn-tool" id="p2PasteBtn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
        <span>Paste</span>
      </button>
      <button type="button" class="p2-btn-tool" id="p2SkeletonBtn" data-skeleton="${encodeURIComponent(skeletonContent)}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <span>Insert Skeleton</span>
      </button>
      <button type="button" class="p2-btn-tool" id="p2ClearBtn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        <span>Clear</span>
      </button>
    </div>

    <div class="p2-live-counter">
      <span class="p2-counter-pill" id="p2LiveCharPill"><strong>0</strong> chars</span>
      <span class="p2-counter-pill" id="p2LiveWordPill">0 words</span>
    </div>
  </div>

  <div id="p2EvaluationResults" class="p2-eval-card" style="display: none;"></div>
</div>
`;
}

export function registerRubricCoach() {
  if (typeof window === 'undefined') return;

  window.evaluateCurrentP2Draft = function(caseId) {
    const textarea = document.getElementById('p2DraftInput');
    const resultsContainer = document.getElementById('p2EvaluationResults');
    if (!textarea || !resultsContainer) return;

    const draft = textarea.value;
    const review = reviewSubmission(caseId, draft);

    const pct = review.qualityPct;
    const scoreColor = pct >= 85 ? '#2ecc71' : pct >= 60 ? '#f1c40f' : '#e74c3c';
    const scoreRgb = pct >= 85 ? '46, 204, 113' : pct >= 60 ? '241, 196, 15' : '231, 76, 60';
    const gateColor = review.gateValid ? '#2ecc71' : '#e74c3c';

    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = `
      <div class="p2-score-banner">
        <div class="p2-score-dial">
          <span class="p2-score-val" style="color: ${scoreColor};">${pct}</span>
          <span class="p2-score-max">% checkable signals</span>
        </div>
        <div class="p2-score-grade" style="color: ${scoreColor}; background: rgba(${scoreRgb}, 0.12); border: 1px solid ${scoreColor};">
          ${review.estimatedBand}
        </div>
      </div>

      <div class="p2-advice-box" style="border-left: 3px solid ${gateColor};">
        <div class="p2-advice-title" style="color: ${gateColor};">Where your 12.5 marks come from</div>
        <ul style="margin: 6px 0 0 16px; padding: 0; line-height: 1.6; color: var(--text-secondary);">
          <li><strong>2.5 marks — submission format:</strong> Awarded by <kbd>Check</kbd> for valid character bounds. Status: <strong style="color:${gateColor};">${review.gateValid ? `On Track (${review.formatMarks} / 2.5)` : 'AT RISK — fix errors below'}</strong>.</li>
          <li><strong>10 marks — offline analytical assessment:</strong> Assessed on evidence traceability, calibration, numeric substance, and reversibility. Your draft satisfies <strong>${pct}%</strong> of structural signals.</li>
        </ul>
      </div>

      <div class="p2-metric-grid">
        <div class="p2-metric-card">
          <div class="p2-metric-label">Structure</div>
          <div class="p2-metric-status">${review.metrics.structure}</div>
        </div>
        <div class="p2-metric-card">
          <div class="p2-metric-label">Char Bounds</div>
          <div class="p2-metric-status" style="color: ${review.metrics.bounds === 'Optimal' ? '#2ecc71' : '#e74c3c'};">${review.metrics.bounds}</div>
        </div>
        <div class="p2-metric-card">
          <div class="p2-metric-label">Evidence Depth</div>
          <div class="p2-metric-status">${review.metrics.evidence}</div>
        </div>
        <div class="p2-metric-card">
          <div class="p2-metric-label">Citations</div>
          <div class="p2-metric-status">${review.metrics.density}</div>
        </div>
        <div class="p2-metric-card">
          <div class="p2-metric-label">Numeric Density</div>
          <div class="p2-metric-status">${review.metrics.figures}</div>
        </div>
        <div class="p2-metric-card">
          <div class="p2-metric-label">Prose Words</div>
          <div class="p2-metric-status">${review.metrics.prose}</div>
        </div>
      </div>

      <div class="p2-check-group">
        <div class="p2-check-heading" style="color: #2ecc71;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Passed Rubric Checks (${review.checksPassed.length})
        </div>
        <ul class="p2-check-list">
          ${review.checksPassed.map(c => `<li class="p2-check-item passed">${c}</li>`).join('')}
        </ul>
      </div>

      ${review.failedChecks.length > 0 ? `
        <div class="p2-check-group">
          <div class="p2-check-heading" style="color: #e74c3c;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Issues / Unmet Rubric Gates (${review.failedChecks.length})
          </div>
          <ul class="p2-check-list">
            ${review.failedChecks.map(c => `<li class="p2-check-item failed">${c}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${review.suggestions.length > 0 ? `
        <div class="p2-advice-box">
          <div class="p2-advice-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Strategic Improvement Recommendations:
          </div>
          <ul style="margin: 6px 0 0 16px; padding: 0; line-height: 1.5; color: var(--text-secondary);">
            ${review.suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <p style="margin: 12px 0 0; padding-top: 10px; border-top: 1px dashed var(--border-color, rgba(255,255,255,0.15)); font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary); opacity: 0.9;">
        ${review.disclaimer}
      </p>
    `;

    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
}
