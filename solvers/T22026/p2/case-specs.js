// Case Specifications and Strict Validation Rules for Project 2
//
// MARK STRUCTURE (from the live bundle, exam-tds-2026-05-p2.js): each case is worth 12.5 marks.
// `Check` / `/backendVerify` validates ONLY the submission format and awards 2.5 participation
// marks. The remaining 10 marks are assessed offline on "the quality, traceability, and
// calibration of the judgment" — human/LLM-graded prose evaluated against evidence.
//
// Everything in this file is split into two rigorous categories:
//   - HARD GATE  (validateCaseAnswer): objective, checkable rules. Failing these forfeits the
//                2.5 participation marks or loses structure marks.
//   - SIGNALS & SUBSTANCE (analyzeDraft): full-spectrum proxy model for the official 10-mark offline
//                analytical evaluation (file citations, numeric density, killing evidence,
//                decision-changing unknowns, reversibility, and outside-table prose substance).

export const CASE_SPECS = {
  'q-case-dth-month-end-server': {
    id: 'q-case-dth-month-end-server',
    title: 'Case Study 1A — DTH Month-End Mystery',
    minChars: 200,
    maxChars: 6000,
    headings: [
      'Judgment',
      'Evidence Table',
      'Rejected Hypotheses',
      'Unknowns and Decision-Changing Evidence',
      'Safe Next Action'
    ],
    dataFiles: ['recharges.csv', 'dealer_import_log.csv', 'email-dealer-reconciliation.eml'],
    minEvidenceRows: 4,
    minCitedFiles: 3,
    minRejected: 2,
    keyEntities: ['DLR-104', 'DLR-219', '17', '210', '1,506', '3,226', '8.1%', '46.7%', 'DF-00020', 'DF-00040', 'source_event_id']
  },
  'q-case-dth-complaints-quiet-server': {
    id: 'q-case-dth-complaints-quiet-server',
    title: 'Case Study 1B — DTH Complaints Went Quiet',
    minChars: 200,
    maxChars: 6000,
    headings: [
      'Judgment',
      'Evidence Table',
      'Rejected Hypotheses and Unknowns',
      'Safe Next Action',
      'Person and Five Questions'
    ],
    dataFiles: ['tickets.csv', 'ivr_interactions.jsonl', 'service_events.csv', 'email-ivr-pilot.eml'],
    minEvidenceRows: 4,
    minCitedFiles: 3,
    minRejected: 2,
    exactQuestions: 5,
    keyEntities: ['Farah Iqbal', 'CareDesk', 'NOVA-S1', '24.0%', '650', '2,709', '219', '442', '90', '175', '104', '51', '28']
  },
  'q-case-solar-smell-test-server': {
    id: 'q-case-solar-smell-test-server',
    title: 'Case Study 2A — Solar Inverter Smell Test',
    minChars: 150,
    maxChars: 3000,
    headings: [
      'Prioritized Findings',
      'Evidence Table',
      'Rejected Hypothesis',
      'Conclusion'
    ],
    dataFiles: ['inverter_events.csv'],
    minCitedFiles: 1,
    minEvidenceRows: 3,
    minRejected: 1,
    maxFindings: 2,
    maxSubstantiveItems: 5,
    keyEntities: ['inverter_events.csv', 'impact_mw', 'cleared', 'INV-17', 'INV-03', 'INV-22', 'INV-09', '13 minutes', 'COMM_LINK_WARN']
  },
  'q-case-solar-impact-claim-server': {
    id: 'q-case-solar-impact-claim-server',
    title: 'Case Study 2B — Solar 31.6% Impact Claim',
    minChars: 200,
    maxChars: 6000,
    headings: [
      'Judgment',
      'Evidence Table',
      'Rejected Hypotheses and Causal Limits',
      'Next Measurement',
      'Recommendation'
    ],
    dataFiles: ['AI_Pilot_Impact_Note.md', 'dispatch_blocks.csv', 'DSM_Commercial_Extract.pdf'],
    minEvidenceRows: 4,
    minCitedFiles: 3,
    minRejected: 2,
    keyEntities: ['31.6%', '17.6%', '662,444', '453,085', '549,664', '379.0', '282.8', '2.72', '12', 'dispatch_blocks.csv']
  },
  'q-case-customs-mismatch-server': {
    id: 'q-case-customs-mismatch-server',
    title: 'Case Study 3A — Swiss Mismatch Control',
    minChars: 150,
    maxChars: 3000,
    headings: [
      'Decision',
      'Evidence Table',
      'Rejected Hypotheses',
      'Missing Evidence',
      'Safe Next Action'
    ],
    dataFiles: [
      'declaration.pdf',
      'commercial_invoice.pdf',
      'air_waybill.pdf',
      'review_note.txt',
      'packet_manifest.txt',
      'product_master_current.xlsx',
      'country_tariff_matrix.xlsx',
      'canonical-schema-v0.3.md'
    ],
    minEvidenceRows: 3,
    minCitedFiles: 3,
    minRejected: 2,
    keyEntities: ['90211000', '90211090', '902110', 'HS6', 'CH-2025-000522', 'SHP-000522', '126,900', 'Tares']
  },
  'q-case-consumer-qc-queue-server': {
    id: 'q-case-consumer-qc-queue-server',
    title: 'Case Study 4A — QC Queue Smell Test',
    minChars: 200,
    maxChars: 6000,
    headings: [
      'Judgment',
      'Evidence Table',
      'Rejected Hypotheses',
      'What Would Change the Decision'
    ],
    dataFiles: ['batch_release.csv', 'qc_release_sop.md', 'source_freshness.csv'],
    minEvidenceRows: 4,
    minCitedFiles: 3,
    minRejected: 2,
    keyEntities: ['45.5', '26.9', '02:10:00', '185', '262', '220', '42', 'HOLD', '5.5', '23', 'evidence_available_ts', 'QCore', 'CertVault']
  },
  'q-case-customs-preference-server': {
    id: 'q-case-customs-preference-server',
    title: 'Case Study 3B — Is the Irish Preference Claim Supported?',
    minChars: 200,
    maxChars: 6000,
    headings: [
      'Decision',
      'Evidence Table',
      'Rejected Hypotheses',
      'Missing Evidence',
      'Safe Next Action'
    ],
    dataFiles: [
      'declaration.pdf',
      'commercial_invoice.pdf',
      'air_waybill.pdf',
      'review_note.txt',
      'packet_manifest.txt',
      'supplier_declaration_reference.txt',
      'supplier_origin_register.csv',
      'origin-workshop.md'
    ],
    minEvidenceRows: 4,
    minCitedFiles: 3,
    minRejected: 2,
    keyEntities: ['SUP-02', 'P1006', '2025-07-31', '2025-09-18', 'IE-2025-000411', 'SHP-000411', '193,400', 'SUP-03', 'SUP-05', 'SUP-06']
  },
  'q-case-consumer-spares-search-server': {
    id: 'q-case-consumer-spares-search-server',
    title: 'Case Study 4B — Spare-Parts Search',
    minChars: 200,
    maxChars: 6000,
    headings: [
      'Judgment',
      'Candidate Matches',
      'Evidence Table',
      'Rejected Hypotheses',
      'What Would Change the Decision'
    ],
    dataFiles: [
      'spare_parts.csv',
      'part_requests.csv',
      'part_restrictions.csv',
      'spares_transfer_policy.md',
      'maintenance_email.txt',
      'source_freshness.csv'
    ],
    minEvidenceRows: 4,
    minCitedFiles: 3,
    minRejected: 2,
    bucketLabels: ['Actionable now', 'Needs check', 'Not transferable'],
    keyEntities: ['166,495.60', '20,536.31', '64,234.05', '81,725.24', '12.3%', '38.6%', '49.1%', '24', '13', '11', 'FLT-1199', 'BRG-1507', 'PLC-8840', 'BLT-7302', 'PMP-2288', 'VLV-3722', 'MTR-4401']
  }
};

/* ------------------------------------------------------------------ *
 * Text and Markdown Parsing Helpers
 * ------------------------------------------------------------------ */

function escapeRe(s) {
  return String(s).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/** Extract text inside a given Markdown section */
export function getSectionBody(text, heading, allHeadings = []) {
  const startRe = new RegExp(`^##\\s+${escapeRe(heading)}\\s*$`, 'im');
  const startMatch = startRe.exec(text);
  if (!startMatch) return '';
  const from = startMatch.index + startMatch[0].length;
  let end = text.length;

  // Stop at the next top-level ## heading
  const nextHeadingRe = /^##\s+.+$/gm;
  nextHeadingRe.lastIndex = from;
  const nextMatch = nextHeadingRe.exec(text);
  if (nextMatch) {
    end = nextMatch.index;
  }

  return text.slice(from, end).trim();
}

/** Markdown table rows in a block, excluding the header and separator */
export function getTableRows(block) {
  if (!block) return [];
  const lines = block
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('|') && !/^\|[\s:|-]+\|?$/.test(l));
  return lines.slice(1); // drop the header row
}

/** Extract all numbers, figures, percentages, currencies, dates, timestamps from text */
export function extractFigures(text) {
  const normalized = String(text || '');
  // Match numbers, decimals, percentages, currency amounts, dates, timestamps, ratios
  const matches = normalized.match(/(?:\$|Rs\.?|CHF|EUR)?\s*\b\d+(?:,\d{3})*(?:\.\d+)?%?|\b\d{4}-\d{2}-\d{2}\b|\b\d{2}:\d{2}(?::\d{2})?\b|\b\d+\/\d+\b/gi) || [];
  return matches.map(m => m.trim()).filter(Boolean);
}

/** Count words outside of tables and headings */
export function countProseWords(text) {
  const cleaned = String(text || '')
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) return false; // ignore headings
      if (trimmed.startsWith('|')) return false; // ignore markdown tables
      return true;
    })
    .join(' ');
  const words = cleaned.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/gi) || [];
  return words.length;
}

/* ------------------------------------------------------------------ *
 * HARD GATE — Evaluates deterministic pass/fail rules
 * ------------------------------------------------------------------ */

export function validateCaseAnswer(caseId, answerText) {
  const spec = CASE_SPECS[caseId];
  if (!spec) return { valid: true, errors: [], warnings: [], score: 100 };

  const errors = [];
  const warnings = [];
  const text = String(answerText || '').trim();

  // 1. Official Character Limits Gate
  if (text.length < spec.minChars) {
    errors.push(`Length (${text.length} chars) is below minimum of ${spec.minChars} chars.`);
  } else if (text.length > spec.maxChars) {
    errors.push(`Length (${text.length} chars) exceeds maximum of ${spec.maxChars} chars.`);
  }

  // 2. Exact Required Heading Skeleton
  for (const h of spec.headings) {
    if (!new RegExp(`^##\\s+${escapeRe(h)}\\s*$`, 'im').test(text)) {
      errors.push(`Missing required heading: '## ${h}'`);
    }
  }

  // 3. Detect Unauthorized / Parser-Breaking Headings
  const foundHeadings = (text.match(/^##\s+.+$/gm) || []).map(h => h.replace(/^##\s+/, '').trim());
  for (const found of foundHeadings) {
    const isStandard = spec.headings.some(h => h.toLowerCase() === found.toLowerCase());
    if (!isStandard) {
      // 4A check: Safe Next Action or Premise Test should not be ## headings
      if (caseId === 'q-case-consumer-qc-queue-server' && /safe next action|premise test/i.test(found)) {
        errors.push(`Unauthorized heading '## ${found}' in 4A. Use bold narrative labels under 'What Would Change the Decision' instead.`);
      } else if (caseId === 'q-case-dth-complaints-quiet-server' && /fault direction/i.test(found)) {
        errors.push(`Unauthorized heading '## ${found}' in 1B. Merge service direction into the Evidence assessment prose.`);
      } else {
        warnings.push(`Non-standard heading '## ${found}' may interfere with automated section parsers.`);
      }
    }
  }

  // 4. Evidence Table Structure
  if (spec.headings.includes('Evidence Table')) {
    const body = getSectionBody(text, 'Evidence Table', spec.headings);
    const rows = getTableRows(body);
    if (!body.includes('|')) {
      errors.push('Missing structured Markdown Evidence Table (| Claim | Source | Confidence |).');
    } else if (rows.length === 0) {
      errors.push('Evidence Table has a header but no evidence rows.');
    } else if (rows.length < (spec.minEvidenceRows || 3)) {
      warnings.push(`Evidence Table has only ${rows.length} row(s); target is at least ${spec.minEvidenceRows || 3}.`);
    }
  }

  // 5. Case-Specific Strict Rules
  // 1B: Exactly five numbered questions for one specific person
  if (spec.exactQuestions) {
    const body = getSectionBody(text, 'Person and Five Questions', spec.headings);
    const numbered = (body.match(/^\s*\d+[.)]\s+\S/gm) || []).length;
    if (numbered !== spec.exactQuestions) {
      errors.push(`'Person and Five Questions' must contain exactly ${spec.exactQuestions} numbered questions; found ${numbered}.`);
    }
    if (!/Farah Iqbal|Dev Khanna/i.test(body)) {
      errors.push('Must name the specific person being questioned (e.g. Farah Iqbal or Dev Khanna).');
    }
  }

  // 2A: Max 2 Prioritized Findings and Max 5 substantive items total
  if (spec.maxFindings) {
    const findingsBody = getSectionBody(text, 'Prioritized Findings', spec.headings);
    const findings = (findingsBody.match(/^\s*(?:\d+[.)]|[-*])\s+\S/gm) || []).length;
    if (findings > spec.maxFindings) {
      errors.push(`Prioritized Findings must not exceed ${spec.maxFindings} items; found ${findings}.`);
    }
  }
  if (spec.maxSubstantiveItems) {
    const findingsBody = getSectionBody(text, 'Prioritized Findings', spec.headings);
    const narrative = (findingsBody.match(/^\s*(?:\d+[.)]|[-*])\s+\S/gm) || []).length;
    const rows = getTableRows(getSectionBody(text, 'Evidence Table', spec.headings)).length;
    const total = narrative + rows;
    if (total > spec.maxSubstantiveItems) {
      errors.push(`Substantive response is capped at ${spec.maxSubstantiveItems} items (narrative bullets + evidence rows); found ${total}.`);
    }
  }

  // 4B: Candidate Matches table with three standard bucket labels
  if (spec.bucketLabels) {
    const candidateBody = getSectionBody(text, 'Candidate Matches', spec.headings);
    if (!candidateBody.includes('|')) {
      errors.push('Missing structured Markdown Candidate Matches table.');
    }
    for (const label of spec.bucketLabels) {
      if (!new RegExp(escapeRe(label), 'i').test(text)) {
        errors.push(`Candidate Matches must categorize items using '${label}'.`);
      }
    }
  }

  // 3B Source Integrity Gate: Must NOT cite 3A product master or tariff matrix
  if (caseId === 'q-case-customs-preference-server') {
    if (/product_master_current\.xlsx|country_tariff_matrix\.xlsx/i.test(text)) {
      errors.push('3B citing 3A files (product_master_current.xlsx or country_tariff_matrix.xlsx); use only official 3B packet files.');
    }
  }

  return {
    valid: errors.length === 0,
    score: Math.max(0, 100 - errors.length * 25 - warnings.length * 10),
    errors,
    warnings
  };
}

/* ------------------------------------------------------------------ *
 * SIGNALS & SUBSTANCE — Evaluates analytical depth and evaluator marks
 * ------------------------------------------------------------------ */

const KILLING_CONNECTIVES_RE = /\b(because|since|therefore|contradicted by|ruled out by|inconsistent with|would require|shows that|per|rejected by|disproved by|falsified by)\b/i;
const DECISION_CHANGE_RE = /\b(would change|would resolve|would confirm|would refute|cannot be resolved until|cannot be resolved without|need to obtain|need to see|if .* then change|how that evidence would change)\b/i;
const REVERSIBLE_ACTION_RE = /\b(read-only|sample|query|reconciliation|shadow calculation|hold|verify|verification|no writes|reversible|reconciled to|spot-check)\b/i;
const HAZARDOUS_ACTION_RE = /\b(national expansion|rollout nationally|re-architect|rebuild pipeline|amend declaration|voluntary disclosure|write off|terminate contract|deploy to production)\b/i;

export function analyzeDraft(caseId, draftText) {
  const spec = CASE_SPECS[caseId];
  const text = String(draftText || '').trim();
  const gate = validateCaseAnswer(caseId, text);

  if (!spec) {
    return {
      gate,
      signals: [],
      qualityPct: text.length > 0 ? 100 : 0,
      formatMarks: 0,
      estimatedBand: 'unknown',
      citedFiles: [],
      figureCount: 0,
      proseWordCount: 0,
      evidenceRowCount: 0
    };
  }

  const signals = [];
  const add = (label, weight, passed, hint) => signals.push({ label, weight, passed, hint });

  const headings = spec.headings;
  const evidenceBody = getSectionBody(text, 'Evidence Table', headings);
  const rows = getTableRows(evidenceBody);
  const minRows = spec.minEvidenceRows ?? 4;
  const minFiles = spec.minCitedFiles ?? 2;
  const minRejected = spec.minRejected ?? 2;

  // 1. Evidence depth
  add(`Evidence Table has at least ${minRows} rows`, 2, rows.length >= minRows,
    `Found ${rows.length} evidence row(s); target is ${minRows} distinct, cited claims.`);

  // 2. Traceability: Cited official case files
  const dataFiles = spec.dataFiles || [];
  const citedFiles = dataFiles.filter(f => text.toLowerCase().includes(f.toLowerCase()));
  add(`Cites this case's official files by name (>= ${minFiles})`, 3, citedFiles.length >= minFiles,
    `Cited ${citedFiles.length} of ${dataFiles.length} official file(s) (found: ${citedFiles.join(', ') || 'none'}).`);

  // 3. Claim-specific confidence values
  const confidences = rows.map(r => (r.split('|')[3] || '').trim()).filter(Boolean);
  const confidenceCovered = rows.length > 0 && confidences.length >= Math.ceil(rows.length * 0.75);
  add('Claim-specific confidence populated', 2, confidenceCovered,
    'Ensure every evidence table row specifies a confidence level (e.g. High / Medium-High / Medium).');

  // 4. Numeric & Data Entity Density (Figure Count)
  const figures = extractFigures(text);
  const figureCount = figures.length;
  const targetFigures = spec.id === 'q-case-solar-smell-test-server' ? 12 : 18;
  add(`High figure and entity density (>= ${targetFigures} figures/metrics)`, 3, figureCount >= targetFigures,
    `Found ${figureCount} specific figures, quantities, timestamps, or monetary metrics; target is >= ${targetFigures}.`);

  // 5. Outside-Table Prose Substance (Word Count Ceiling)
  const proseWordCount = countProseWords(text);
  const targetProse = spec.maxChars <= 3000 ? 140 : 220;
  add(`Rich analytical prose outside tables (>= ${targetProse} words)`, 3, proseWordCount >= targetProse,
    `Found ${proseWordCount} words of reasoned narrative prose outside tables; target is >= ${targetProse}.`);

  // 6. Rejected Hypotheses with Killing Evidence
  const rejHeading = headings.find(h => /rejected/i.test(h));
  const rejBody = rejHeading ? getSectionBody(text, rejHeading, headings) : '';
  const rejBullets = (rejBody.match(/^\s*(?:\d+[.)]|[-*])\s+\S/gm) || []).length;
  const rejBoldLeads = (rejBody.match(/^\s*\*\*[^*]+\*\*\s*[::—-]/gm) || []).length;
  const rejParas = rejBody.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 40).length;
  const rejCount = Math.max(rejBullets, rejBoldLeads, rejParas, rejBody.trim() ? 1 : 0);
  const hasKillingConnective = KILLING_CONNECTIVES_RE.test(rejBody);
  const rejLabel = minRejected === 1
    ? 'A genuinely rejected hypothesis with killing evidence'
    : `At least ${minRejected} rejected hypotheses with killing evidence`;
  add(rejLabel, 3, rejCount >= minRejected && hasKillingConnective,
    `Articulate at least ${minRejected} rejected alternatives using killing evidence connectives (e.g. 'rejected because...', 'contradicted by...').`);

  // 7. Material Unknowns with Decision-Changing Impact
  const unknownHeading = headings.find(h => /unknown|change the decision|missing evidence|next measurement/i.test(h));
  if (unknownHeading) {
    const unknownBody = getSectionBody(text, unknownHeading, headings);
    const hasDecisionChange = DECISION_CHANGE_RE.test(unknownBody);
    add(`'${unknownHeading}' explicitly states decision transitions`, 2, unknownBody.length >= 100 && hasDecisionChange,
      'State what missing evidence would resolve the unknown and how that evidence would change your decision.');
  }

  // 8. Safe Reversible Action
  const actionHeading = headings.find(h => /next action|recommendation|conclusion/i.test(h));
  if (actionHeading) {
    const actionBody = getSectionBody(text, actionHeading, headings);
    const isReversible = REVERSIBLE_ACTION_RE.test(actionBody);
    const isHazardous = HAZARDOUS_ACTION_RE.test(actionBody) && !/\b(hold|pending|freeze|delay|do not)\b/i.test(actionBody);
    add(`'${actionHeading}' is cheap, narrow, and reversible`, 2, isReversible && !isHazardous,
      'Propose a single read-only query, sample, or shadow calculation, keeping irreversible actions strictly on hold.');
  }

  const earned = signals.filter(s => s.passed).reduce((a, s) => a + s.weight, 0);
  const totalWeight = signals.reduce((a, s) => a + s.weight, 0);
  const qualityPct = totalWeight > 0 ? Math.round((earned / totalWeight) * 100) : 0;

  // Format Marks (2.5) check
  const lengthOk = text.length >= spec.minChars && text.length <= spec.maxChars && gate.valid;
  const formatMarks = lengthOk ? 2.5 : 0;

  const estimatedBand = !lengthOk
    ? 'at risk — submission format invalid'
    : qualityPct >= 90
      ? 'exemplary — full 100% checkable signals'
      : qualityPct >= 75
        ? 'strong — majority of signals satisfied'
        : qualityPct >= 50
          ? 'partial — several signals missing'
          : 'weak — key signals missing';

  return {
    gate,
    signals,
    qualityPct,
    formatMarks,
    estimatedBand,
    citedFiles,
    figureCount,
    proseWordCount,
    evidenceRowCount: rows.length
  };
}
