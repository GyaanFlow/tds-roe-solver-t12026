// Case Specifications and Strict Validation Rules for Project 2
//
// MARK STRUCTURE (from the live bundle, exam-tds-2026-05-p2.js): each case is worth 12.5 marks.
// `Check` / `/backendVerify` validates ONLY the submission format and awards 2.5 participation
// marks. The remaining 10 marks are assessed offline on "the quality, traceability, and
// calibration of the judgment" — which is human/LLM-graded prose and CANNOT be scored
// deterministically. Everything in this file is therefore split into two honest categories:
//
//   - HARD GATE  (validateCaseAnswer): objective, checkable rules. Failing these genuinely costs
//                marks (invalid length forfeits the 2.5, a missing heading loses easy structure
//                marks). Also used by runtime.js to withhold a malformed generated note.
//   - SIGNALS    (analyzeDraft): weighted proxies for what the offline grader rewards. These are
//                ESTIMATES of reasoning quality, never a predicted score. A draft can satisfy
//                every signal and still be graded poorly on substance.
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
    keyEntities: ['DLR-104', 'DLR-219', '17', '210', '12.2']
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
    exactQuestions: 5,
    keyEntities: ['Farah Iqbal', 'CareDesk', 'NOVA-S1', '24.0%', 'South']
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
    minEvidenceRows: 2,
    minRejected: 1,
    maxFindings: 2,
    maxSubstantiveItems: 5,
    keyEntities: ['impact_mw', 'cleared', 'severity', 'inverter_events']
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
    keyEntities: ['31.6%', '17.5%', 'base_schedule_mw', 'dispatch_blocks', '662,444']
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
    dataFiles: ['declaration.pdf', 'commercial_invoice.pdf', 'air_waybill.pdf', 'review_note.txt', 'product_master_current.xlsx', 'country_tariff_matrix.xlsx', 'canonical-schema-v0.3.md'],
    minEvidenceRows: 3,
    keyEntities: ['90211000', '90211090', '902110', 'HS6']
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
    keyEntities: ['02:10:00', '70.6', 'QCore', 'qcore_release_ts']
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
    dataFiles: ['declaration.pdf', 'commercial_invoice.pdf', 'air_waybill.pdf', 'review_note.txt', 'supplier_declaration_reference.txt', 'supplier_origin_register.csv', 'origin-workshop.md'],
    keyEntities: ['SUP-02', 'P1006', '2025-07-31', '2025-09-18']
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
    dataFiles: ['spare_parts.csv', 'part_requests.csv', 'part_restrictions.csv', 'spares_transfer_policy.md', 'maintenance_email.txt', 'source_freshness.csv'],
    bucketLabels: ['Actionable now', 'Needs check', 'Not transferable'],
    keyEntities: ['MTR-4401', '166,49', '20,536', 'servo', 'reserved']
  }
};


/* ------------------------------------------------------------------ *
 * Shared text helpers
 * ------------------------------------------------------------------ */

function escapeRe(s) {
  return String(s).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function sectionBody(text, heading, allHeadings) {
  const start = new RegExp(`^##\\s+${escapeRe(heading)}\\s*$`, 'im').exec(text);
  if (!start) return '';
  const from = start.index + start[0].length;
  let end = text.length;
  for (const h of allHeadings) {
    if (h === heading) continue;
    const m = new RegExp(`^##\\s+${escapeRe(h)}\\s*$`, 'im').exec(text.slice(from));
    if (m && from + m.index < end) end = from + m.index;
  }
  return text.slice(from, end).trim();
}

/** Markdown table rows in a block, excluding the header and the separator line. */
function tableRows(block) {
  const lines = block
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('|') && !/^\|[\s:|-]+\|?$/.test(l));
  return lines.slice(1); // drop the header row
}

/* ------------------------------------------------------------------ *
 * HARD GATE — objective rules only. Used by runtime.js to withhold a
 * malformed generated note, and shown to students as pass/fail.
 * ------------------------------------------------------------------ */

export function validateCaseAnswer(caseId, answerText) {
  const spec = CASE_SPECS[caseId];
  if (!spec) return { valid: true, errors: [], warnings: [], score: 100 };

  const errors = [];
  const warnings = [];
  const text = String(answerText || '').trim();

  // 1. Official character gate (this is what earns the 2.5 participation marks).
  if (text.length < spec.minChars) {
    errors.push(`Length (${text.length} chars) is below minimum of ${spec.minChars} chars.`);
  } else if (text.length > spec.maxChars) {
    errors.push(`Length (${text.length} chars) exceeds maximum of ${spec.maxChars} chars.`);
  }

  // 2. Exact heading skeleton from the exam's own placeholder text.
  for (const h of spec.headings) {
    if (!new RegExp(`##\\s+${escapeRe(h)}`, 'i').test(text)) {
      errors.push(`Missing required heading: '## ${h}'`);
    }
  }

  // 3. Evidence table must actually be a table with rows, not just a stray separator line.
  if (spec.headings.includes('Evidence Table')) {
    const body = sectionBody(text, 'Evidence Table', spec.headings);
    const rows = tableRows(body);
    if (!body.includes('|')) {
      errors.push('Missing structured Markdown Evidence Table (| Claim | Source | Confidence |).');
    } else if (rows.length === 0) {
      errors.push('Evidence Table has a header but no evidence rows.');
    } else if (rows.length < 3) {
      warnings.push(`Evidence Table has only ${rows.length} row(s); the guidance suggests at least 4.`);
    }
  }

  // 4. Case-specific hard rules, taken from each question's own instructions.

  // 1B: "the one person you would question and exactly five questions you would ask".
  // Counted only inside that section — numbered lines elsewhere are not questions.
  if (spec.exactQuestions) {
    const body = sectionBody(text, 'Person and Five Questions', spec.headings);
    const numbered = (body.match(/^\s*\d+[.)]\s+\S/gm) || []).length;
    if (numbered !== spec.exactQuestions) {
      errors.push(`'Person and Five Questions' must contain exactly ${spec.exactQuestions} numbered questions; found ${numbered}.`);
    }
    const withoutQuestions = body.replace(/^\s*\d+[.)].*$/gm, '').trim();
    if (!withoutQuestions) {
      warnings.push('Name the specific person you would question, not just the five questions.');
    }
  }

  // 2A: "at most two prioritized findings" and "at most five items in total (evidence-table
  // rows and narrative bullets); headings and the table header do not count".
  if (spec.maxFindings) {
    const body = sectionBody(text, 'Prioritized Findings', spec.headings);
    const findings = (body.match(/^\s*(?:\d+[.)]|[-*])\s+\S/gm) || []).length;
    if (findings > spec.maxFindings) {
      errors.push(`Prioritized Findings must not exceed ${spec.maxFindings} items; found ${findings}.`);
    }
  }
  if (spec.maxSubstantiveItems) {
    const findingsBody = sectionBody(text, 'Prioritized Findings', spec.headings);
    const narrative = (findingsBody.match(/^\s*(?:\d+[.)]|[-*])\s+\S/gm) || []).length;
    const rows = tableRows(sectionBody(text, 'Evidence Table', spec.headings)).length;
    const total = narrative + rows;
    if (total > spec.maxSubstantiveItems) {
      errors.push(`Substantive response is capped at ${spec.maxSubstantiveItems} items (narrative bullets + evidence rows); found ${total}.`);
    }
  }

  // 4B: the Candidate Matches table must use the exam's own three status labels.
  if (spec.bucketLabels) {
    const missing = spec.bucketLabels.filter(
      l => !new RegExp(escapeRe(l).replace(/\\ /g, ' ').replace(/\s+/g, '\\s+'), 'i').test(text)
    );
    if (missing.length > 0) {
      errors.push(`Candidate Matches must use the standard category labels; missing: ${missing.join(', ')}.`);
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
 * SIGNALS — weighted proxies for what the offline grader rewards.
 * These are ESTIMATES of reasoning quality, never a predicted mark.
 * Single source of truth for the Rubric Coach, so the student-facing
 * score cannot diverge from the hard gate the way it used to.
 * ------------------------------------------------------------------ */

// Reasoning/rejection verbs. "Falsified", "refuted" and "disproved" are as valid as "rejected" —
// omitting them previously failed drafts that argued their rejections perfectly well.
const CONNECTIVE_SRC = '\\b(because|since|therefore|however|but|rejected|falsified|refuted|disproved|disproven|ruled out|inconsistent with|contradicted|confirms?|contradicts?|implies|indicates?|suggests?|whereas|instead|rather than|which means)\\b';

/**
 * Keyword-stuffing detector. A draft that merely repeated the expected entity tokens used to
 * score a perfect 100 here, so substance is now scored explicitly instead of being assumed.
 */
function proseCheck(text) {
  const words = text.toLowerCase().match(/[a-z][a-z'-]+/g) || [];
  if (words.length < 40) return { ok: false, reason: 'Too little prose to assess — write full sentences.' };
  const uniqueRatio = new Set(words).size / words.length;
  const sentences = (text.match(/[.!?](\s|$)/g) || []).length;
  const connectives = (text.match(new RegExp(CONNECTIVE_SRC, 'gi')) || []).length;
  if (uniqueRatio < 0.28) {
    return { ok: false, reason: 'Text is highly repetitive — it reads as keyword stuffing rather than analysis.' };
  }
  if (sentences < 6) {
    return { ok: false, reason: 'Very few complete sentences — the grader reads prose, not fragments.' };
  }
  if (connectives < 2) {
    return { ok: false, reason: 'No reasoning connectives (because / therefore / rejected because...) — claims are asserted, not argued.' };
  }
  return { ok: true, reason: '' };
}

export function analyzeDraft(caseId, draftText) {
  const spec = CASE_SPECS[caseId];
  const text = String(draftText || '').trim();
  const gate = validateCaseAnswer(caseId, text);

  if (!spec) {
    return { gate, signals: [], qualityPct: 0, formatMarks: 0, estimatedBand: 'unknown', citedFiles: [], evidenceRowCount: 0 };
  }

  const signals = [];
  const add = (label, weight, passed, hint) => signals.push({ label, weight, passed, hint });

  const headings = spec.headings;
  const rows = tableRows(sectionBody(text, 'Evidence Table', headings));

  // Thresholds are per-case: the short-form cases have their own explicit limits, and applying
  // the generic ones would push a student into VIOLATING the question's own instructions
  // (2A caps the substantive response at 5 items and asks for one rejected hypothesis, singular).
  const minRows = spec.minEvidenceRows ?? 4;
  const minFiles = spec.minCitedFiles ?? 2;
  const minRejected = spec.minRejected ?? 2;

  // 1. Evidence depth.
  add(`Evidence table has at least ${minRows} rows`, 2, rows.length >= minRows,
    `You have ${rows.length} evidence row(s); aim for at least ${minRows} distinct, cited claims${spec.maxSubstantiveItems ? ` (this case caps the total at ${spec.maxSubstantiveItems} items)` : ''}.`);

  // 2. Traceability — claims cite the actual data files for THIS case.
  const dataFiles = spec.dataFiles || [];
  const citedFiles = dataFiles.filter(f => text.toLowerCase().includes(f.toLowerCase()));
  add('Cites this case\'s real data files by name', 3, citedFiles.length >= minFiles,
    `Cited ${citedFiles.length} of this case's ${dataFiles.length} file(s). Name the actual files (e.g. ${dataFiles.slice(0, 2).join(', ')}), ideally with rows or fields.`);

  // 3. Calibration — every claim carries its own confidence value.
  // NOTE: uniform confidence is NOT scored as a failure. On some cases (e.g. 1A) the data
  // genuinely supports "High" on every row, and manufacturing Medium/Low values to look
  // calibrated would be fabricating uncertainty. Variety is surfaced as a hint only.
  const confidences = rows.map(r => (r.split('|')[3] || '').trim()).filter(Boolean);
  const distinctConf = new Set(confidences.map(c => c.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3))).size;
  const confidenceCovered = rows.length > 0 && confidences.length >= Math.max(2, Math.ceil(rows.length * 0.8));
  add('Confidence stated per claim', 2, confidenceCovered,
    'Give every evidence row its own claim-specific confidence value.');
  if (confidenceCovered && distinctConf < 2) {
    signals[signals.length - 1].hint =
      'All rows share one confidence level. That is fine when the data really is uniformly strong — but check that none of your claims deserves a Medium or Low.';
  }

  // 4. Rejected hypotheses, each with the evidence that kills it.
  const rejHeading = headings.find(h => /rejected/i.test(h));
  const rejBody = rejHeading ? sectionBody(text, rejHeading, headings) : '';
  // Count bullets/numbered items, but fall back to blank-line-separated paragraphs and to
  // bold-lead-in entries ("**Duplicate revenue**: rejected because ..."), which are a perfectly
  // normal way to list rejected hypotheses and were previously miscounted as a single item.
  const rejBullets = (rejBody.match(/^\s*(?:\d+[.)]|[-*])\s+\S/gm) || []).length;
  const rejBoldLeads = (rejBody.match(/^\s*\*\*[^*]+\*\*\s*[::—-]/gm) || []).length;
  const rejParas = rejBody.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 40).length;
  // Quoted-hypothesis style ("...claim..." — rejected: because ...) on its own line is also common.
  const rejLines = rejBody.split('\n').map(l => l.trim()).filter(l => l.length > 40).length;
  const rejCount = Math.max(rejBullets, rejBoldLeads, rejParas, rejLines, rejBody.trim() ? 1 : 0);
  const rejReasoned = new RegExp(CONNECTIVE_SRC, 'i').test(rejBody);
  const rejLabel = minRejected === 1
    ? 'A genuinely rejected hypothesis, with its evidence'
    : `At least ${minRejected} rejected hypotheses, each with its evidence`;
  add(rejLabel, 2, rejCount >= minRejected && rejReasoned,
    `State at least ${minRejected === 1 ? 'one hypothesis you rejected' : `${minRejected} hypotheses you rejected`} AND the specific evidence that rejects ${minRejected === 1 ? 'it' : 'each'}.`);

  // 5. Decision-changing unknowns — a substantive section, not a stub.
  // Skipped where the case's skeleton has no such section (2A is findings/evidence/rejected/
  // conclusion only), so a case is never marked down for omitting what it was never asked for.
  const unknownHeading = headings.find(h => /unknown|change the decision|missing evidence|next measurement/i.test(h));
  if (unknownHeading) {
    const unknownBody = sectionBody(text, unknownHeading, headings);
    add(`'${unknownHeading}' is substantive`, 2, unknownBody.length >= 120,
      'Be specific about the evidence that would flip your judgment — this is where easy marks live.');
  }

  // 6. Safe / reversible next action — only where the case's own skeleton has such a section.
  // 4A and 4B legitimately end at "What Would Change the Decision" and have no action heading,
  // so scoring them against a section the exam never asked for would be a phantom deduction.
  const actionHeading = headings.find(h => /next action|recommendation|conclusion/i.test(h));
  if (actionHeading) {
    const actionBody = sectionBody(text, actionHeading, headings);
    add(`'${actionHeading}' is concrete and reversible`, 2, actionBody.length >= 80,
      'Give a concrete, reversible next step — and say what you would NOT do irreversibly.');
  }

  // 7. Substance — real prose, not stuffed keywords.
  const prose = proseCheck(text);
  add('Reads as reasoned prose, not keyword stuffing', 4, prose.ok, prose.reason);

  const earned = signals.filter(s => s.passed).reduce((a, s) => a + s.weight, 0);
  const totalWeight = signals.reduce((a, s) => a + s.weight, 0);
  const qualityPct = totalWeight > 0 ? Math.round((earned / totalWeight) * 100) : 0;

  // The character gate is what /backendVerify actually checks for the 2.5 participation marks.
  const lengthOk = text.length >= spec.minChars && text.length <= spec.maxChars;
  const formatMarks = lengthOk ? 2.5 : 0;

  const estimatedBand = !lengthOk
    ? 'at risk — submission format invalid'
    : qualityPct >= 80
      ? 'strong on the checkable signals'
      : qualityPct >= 55
        ? 'partial — several signals missing'
        : 'weak — key signals missing';

  return { gate, signals, qualityPct, formatMarks, estimatedBand, citedFiles, evidenceRowCount: rows.length };
}
