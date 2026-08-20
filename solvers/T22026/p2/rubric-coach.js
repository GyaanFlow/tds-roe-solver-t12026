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
      checksPassed: ['Custom specification'],
      failedChecks: [],
      suggestions: [],
      disclaimer: 'Note: This draft review provides heuristic feedback based on the official rubric checklist.'
    };
  }

  // 1. Length Check
  if (text.length >= spec.minChars && text.length <= spec.maxChars) {
    checksPassed.push(`Length (${text.length} chars) is within official gate [${spec.minChars}–${spec.maxChars}]`);
  } else {
    failedChecks.push(`Length (${text.length} chars) is outside gate [${spec.minChars}–${spec.maxChars}]`);
    suggestions.push(`Adjust length to be between ${spec.minChars} and ${spec.maxChars} characters.`);
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

  // 3. Evidence Table
  if (spec.headings.includes('Evidence Table')) {
    if (text.includes('| Claim') || text.includes('|Claim') || text.includes('|---')) {
      checksPassed.push('Structured Markdown Evidence Table present');
    } else {
      failedChecks.push('Missing structured Markdown Evidence Table');
      suggestions.push('Include an Evidence Table with columns: | Claim | Source | Confidence |');
    }
  }

  // 4. Key Entities / Numerical landmarks
  let entitiesFound = 0;
  if (spec.keyEntities) {
    for (const ent of spec.keyEntities) {
      if (new RegExp(ent.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i').test(text)) {
        entitiesFound++;
      }
    }
    if (entitiesFound >= Math.ceil(spec.keyEntities.length / 2)) {
      checksPassed.push(`Key factual entities cited (${entitiesFound}/${spec.keyEntities.length})`);
    } else {
      failedChecks.push(`Low entity citation density (${entitiesFound}/${spec.keyEntities.length})`);
      suggestions.push(`Consider citing specific data entities (e.g., ${spec.keyEntities.slice(0, 3).join(', ')}).`);
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
      checksPassed.push('Standard Candidate Matches status labels used');
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
    disclaimer: 'Note: This draft review provides heuristic feedback based on the official rubric checklist.'
  };
}

export function buildRubricCoachHtml(caseId, title) {
  const spec = CASE_SPECS[caseId] || { minChars: 200, maxChars: 6000, headings: [] };
  const headingsList = spec.headings.map(h => `<code>## ${h}</code>`).join(', ');

  return `
<div class="p2-coach-panel" id="p2CoachPanel" style="padding: 16px; background: var(--bg-card, #121212); border: 1px solid var(--border, #262626); border-radius: 8px; margin-top: 12px;">
  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 18px;">🎯</span>
      <strong style="color: var(--text-primary, #fff); font-size: 14px;">Interactive Rubric Coach & Draft Evaluator</strong>
    </div>
    <span style="font-size: 11px; padding: 2px 8px; background: var(--bg-input, #1e1e1e); border: 1px solid var(--border, #333); border-radius: 4px; color: var(--text-secondary, #aaa);">
      Gate: ${spec.minChars}–${spec.maxChars} chars
    </span>
  </div>

  <p style="font-size: 12px; color: var(--text-secondary, #aaa); margin-bottom: 10px; line-height: 1.5;">
    Paste your draft below to evaluate structural rubric compliance, required headings, character bounds, and ground-truth citations.
  </p>

  <div style="margin-bottom: 10px;">
    <textarea id="p2DraftInput" rows="6" placeholder="Paste your diagnostic note / case study draft here..." style="width: 100%; box-sizing: border-box; background: var(--bg-input, #0d0d0d); border: 1px solid var(--border, #333); color: var(--text-primary, #eee); font-family: var(--font-mono, monospace); font-size: 12px; padding: 10px; border-radius: 6px; resize: vertical;"></textarea>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
    <button type="button" class="btn-ghost panel-btn" id="evaluateDraftBtn" style="background: var(--theme-primary, #6366f1); color: #fff; border: none; padding: 6px 14px; font-weight: 500; cursor: pointer; border-radius: 4px;">
      ⚡ Evaluate Draft
    </button>
    <span id="p2LiveCharCount" style="font-size: 11px; color: var(--text-secondary, #888); font-family: monospace;">0 chars</span>
  </div>

  <div id="p2EvaluationResults" style="display: none; padding: 12px; background: var(--bg-input, #181818); border: 1px solid var(--border, #333); border-radius: 6px; margin-top: 10px;">
    <!-- Populated dynamically by evaluateDraftHandler -->
  </div>

  <div style="margin-top: 12px; font-size: 11px; color: var(--text-secondary, #777); border-top: 1px solid var(--border, #222); padding-top: 8px;">
    <strong>Required Headings:</strong> ${headingsList}<br>
    <em>Note: This local evaluator tests structure and evidence density against the official rubric guidelines.</em>
  </div>
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

    const scoreColor = review.score >= 80 ? '#22c55e' : review.score >= 50 ? '#f59e0b' : '#ef4444';

    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid var(--border, #333); padding-bottom: 6px;">
        <strong style="color: var(--text-primary, #fff); font-size: 13px;">Rubric Evaluation Score</strong>
        <span style="font-size: 14px; font-weight: bold; color: ${scoreColor}; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 4px; border: 1px solid ${scoreColor};">
          ${review.score} / 100
        </span>
      </div>

      <div style="font-size: 12px; margin-bottom: 8px;">
        <div style="color: #22c55e; font-weight: 500; margin-bottom: 4px;">✅ Passed Checks (${review.checksPassed.length}):</div>
        <ul style="margin: 0 0 8px 18px; padding: 0; color: var(--text-secondary, #aaa);">
          ${review.checksPassed.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>

      ${review.failedChecks.length > 0 ? `
        <div style="font-size: 12px; margin-bottom: 8px;">
          <div style="color: #ef4444; font-weight: 500; margin-bottom: 4px;">❌ Issues / Missing Items (${review.failedChecks.length}):</div>
          <ul style="margin: 0 0 8px 18px; padding: 0; color: var(--text-secondary, #aaa);">
            ${review.failedChecks.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${review.suggestions.length > 0 ? `
        <div style="font-size: 12px; background: rgba(99, 102, 241, 0.1); border-left: 3px solid #6366f1; padding: 6px 10px; border-radius: 2px;">
          <strong style="color: #818cf8;">Suggestions for Improvement:</strong>
          <ul style="margin: 4px 0 0 14px; padding: 0; color: var(--text-secondary, #bbb);">
            ${review.suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  };
}
