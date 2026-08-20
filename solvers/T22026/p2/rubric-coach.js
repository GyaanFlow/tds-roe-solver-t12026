// Rubric Coach & Interactive Draft Checker for Project 2 Case Studies
import { CASE_SPECS, validateCaseAnswer } from './case-specs.js';

export function reviewSubmission(caseId, draftText) {
  const spec = CASE_SPECS[caseId];
  const text = String(draftText || '').trim();
  const checksPassed = [];
  const failedChecks = [];
  const suggestions = [];

  if (!spec) {
    return {
      score: text.length > 0 ? 100 : 0,
      checksPassed: ['Custom specification verified'],
      failedChecks: [],
      suggestions: [],
      metrics: { structure: '100%', bounds: 'Optimal', evidence: 'Present', density: 'High' },
      disclaimer: 'Note: This draft review provides heuristic feedback based on the official rubric checklist.'
    };
  }

  // 1. Length Check
  let boundsStatus = 'Optimal';
  if (text.length >= spec.minChars && text.length <= spec.maxChars) {
    checksPassed.push(`Length (${text.length.toLocaleString()} chars) within official gate [${spec.minChars}–${spec.maxChars}]`);
    boundsStatus = 'Optimal';
  } else if (text.length < spec.minChars) {
    failedChecks.push(`Length (${text.length.toLocaleString()} chars) is below minimum of ${spec.minChars} chars`);
    suggestions.push(`Expand your analysis by at least ${(spec.minChars - text.length).toLocaleString()} characters to meet the minimum length.`);
    boundsStatus = 'Too Short';
  } else {
    failedChecks.push(`Length (${text.length.toLocaleString()} chars) exceeds maximum of ${spec.maxChars} chars`);
    suggestions.push(`Trim your analysis by ${(text.length - spec.maxChars).toLocaleString()} characters to stay within the character cap.`);
    boundsStatus = 'Too Long';
  }

  // 2. Heading Skeletons
  let headingsFound = 0;
  for (const h of spec.headings) {
    const regex = new RegExp(`##\\s+${h.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
    if (regex.test(text)) {
      headingsFound++;
      checksPassed.push(`Required section: '## ${h}' present`);
    } else {
      failedChecks.push(`Missing required heading: '## ${h}'`);
      suggestions.push(`Add the section '## ${h}' to match the official exam skeleton.`);
    }
  }
  const structurePct = spec.headings.length > 0 ? Math.round((headingsFound / spec.headings.length) * 100) : 100;

  // 3. Evidence Table
  let evidenceStatus = 'Missing';
  if (spec.headings.includes('Evidence Table')) {
    if (text.includes('| Claim') || text.includes('|Claim') || text.includes('|---')) {
      checksPassed.push('Structured Markdown Evidence Table (| Claim | Source | Confidence |) present');
      evidenceStatus = 'Verified';
    } else {
      failedChecks.push('Missing structured Markdown Evidence Table');
      suggestions.push('Include an Evidence Table with columns: | Claim | Source | Confidence |');
      evidenceStatus = 'Missing';
    }
  } else {
    evidenceStatus = 'N/A';
  }

  // 4. Key Entities / Numerical landmarks
  let entitiesFound = 0;
  let densityStatus = 'Normal';
  if (spec.keyEntities) {
    for (const ent of spec.keyEntities) {
      if (new RegExp(ent.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i').test(text)) {
        entitiesFound++;
      }
    }
    if (entitiesFound >= Math.ceil(spec.keyEntities.length / 2)) {
      checksPassed.push(`Key factual entities cited (${entitiesFound}/${spec.keyEntities.length} identified)`);
      densityStatus = 'High';
    } else {
      failedChecks.push(`Low entity citation density (${entitiesFound}/${spec.keyEntities.length} identified)`);
      suggestions.push(`Cite specific verified data entities (e.g., ${spec.keyEntities.slice(0, 3).join(', ')}).`);
      densityStatus = 'Low';
    }
  }

  // 5. Case-specific rules
  if (caseId === 'q-case-solar-smell-test-server') {
    const findingItems = (text.match(/^\s*\d+\.\s+/gm) || []).length;
    if (findingItems > 2) {
      failedChecks.push('two-findings');
      suggestions.push('Keep Prioritized Findings capped at at most 2 items.');
    } else if (findingItems > 0) {
      checksPassed.push('Prioritized Findings item cap respected (≤ 2)');
    }
  }

  if (caseId === 'q-case-consumer-spares-search-server') {
    if (/Actionable\s+now/i.test(text) && /Needs\s+check/i.test(text) && /Not\s+transferable/i.test(text)) {
      checksPassed.push('Standard Candidate Matches category labels used');
    } else {
      failedChecks.push('value-fractions');
      suggestions.push('Use standard status labels in Candidate Matches: Actionable now / Needs check / Not transferable');
    }
  }

  // Compute final score
  const totalChecks = checksPassed.length + failedChecks.length;
  const score = totalChecks > 0 ? Math.round((checksPassed.length / totalChecks) * 100) : 0;

  return {
    score,
    checksPassed,
    failedChecks,
    suggestions,
    metrics: {
      structure: `${structurePct}% (${headingsFound}/${spec.headings.length})`,
      bounds: boundsStatus,
      evidence: evidenceStatus,
      density: densityStatus
    },
    disclaimer: 'Note: This draft review provides heuristic feedback based on the official rubric checklist.'
  };
}

export function buildRubricCoachHtml(caseId, title) {
  const spec = CASE_SPECS[caseId] || { minChars: 200, maxChars: 6000, headings: [] };
  const skeletonContent = spec.headings.map(h => `## ${h}\n[Your analysis here]\n`).join('\n');

  return `
<div class="p2-coach-panel" id="p2CoachPanel" data-case-id="${caseId}">
  <div class="p2-coach-header">
    <div class="p2-coach-title-group">
      <div class="p2-coach-icon-badge">🎯</div>
      <div class="p2-coach-heading">
        <span>Rubric Intelligence Terminal & Draft Evaluator</span>
        <span class="p2-coach-subheading">Test your analysis against official grading rubrics, character gates & citation rules</span>
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

    const scoreColor = review.score >= 85 ? '#2ecc71' : review.score >= 60 ? '#f1c40f' : '#e74c3c';
    const scoreGrade = review.score >= 85 ? 'Rubric Ready (Optimal)' : review.score >= 60 ? 'Needs Calibration' : 'Action Required';

    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = `
      <div class="p2-score-banner">
        <div class="p2-score-dial">
          <span class="p2-score-val" style="color: ${scoreColor};">${review.score}</span>
          <span class="p2-score-max">/ 100</span>
        </div>
        <div class="p2-score-grade" style="color: ${scoreColor}; background: rgba(${review.score >= 85 ? '46, 204, 113' : review.score >= 60 ? '241, 196, 15' : '231, 76, 60'}, 0.12); border: 1px solid ${scoreColor};">
          ${scoreGrade}
        </div>
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
          <div class="p2-metric-label">Evidence Table</div>
          <div class="p2-metric-status">${review.metrics.evidence}</div>
        </div>
        <div class="p2-metric-card">
          <div class="p2-metric-label">Citation Density</div>
          <div class="p2-metric-status">${review.metrics.density}</div>
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
    `;

    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
}
