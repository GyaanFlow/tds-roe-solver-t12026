// Case Specifications and Strict Validation Rules for Project 2
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
    requiredKeywords: ['reconciled', 'dealer', '0.00', 'may', 'batch'],
    keyEntities: ['DF-00020', 'DF-00040', 'Kavya', 'Silver Dish', 'Metro Signal']
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
    requiredKeywords: ['farah', 'containment', 'authentication', 'abandoned', 'questions'],
    keyEntities: ['Farah Iqbal', 'CareDesk', 'NovaIVR', '824', '711', '1,535']
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
    requiredKeywords: ['inverter', 'impact', 'cleared', 'check'],
    keyEntities: ['INV-17', 'INV-03', 'INV-22', 'INV-09', '0 MW', 'SCADA']
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
    requiredKeywords: ['31.6%', 'counterfactual', '17.5%', 'dsm', 'stow'],
    keyEntities: ['662,444', '453,086', '4,196.5', '4,231.1', '12']
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
    requiredKeywords: ['90211000', '90211090', 'swiss', 'helios', 'schema'],
    keyEntities: ['9021.10', 'CH-2025-000522', 'canonical-schema', '0%']
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
    requiredKeywords: ['02:10', 'qcore', 'labtrack', 'snapshot', 'ql-204'],
    keyEntities: ['262', '48h', '24h', 'SOP', 'deviation']
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
    requiredKeywords: ['preference', 'supplier', 'declaration', 'ltsd', 'provisional'],
    keyEntities: ['SUP-02', 'P1006', 'IE-2025-000411', 'Aoife Brennan', 'Luca Ferri']
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
    requiredKeywords: ['actionable', 'needs check', 'not transferable', 'spares', 'critical'],
    keyEntities: ['123,565', '8', '12', '4', 'Leon Dube', 'MT-18']
  }
};

export function validateCaseAnswer(caseId, answerText) {
  const spec = CASE_SPECS[caseId];
  if (!spec) return { valid: true, errors: [], warnings: [], score: 100 };

  const errors = [];
  const warnings = [];
  const text = String(answerText || '').trim();

  // 1. Length check
  if (text.length < spec.minChars) {
    errors.push(`Length (${text.length} chars) is below minimum of ${spec.minChars} chars.`);
  } else if (text.length > spec.maxChars) {
    errors.push(`Length (${text.length} chars) exceeds maximum of ${spec.maxChars} chars.`);
  }

  // 2. Required Headings check
  for (const h of spec.headings) {
    const regex = new RegExp(`##\\s+${h.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
    if (!regex.test(text)) {
      errors.push(`Missing required heading: '## ${h}'`);
    }
  }

  // 3. Evidence Table check
  if (spec.headings.includes('Evidence Table')) {
    if (!text.includes('| Claim') && !text.includes('|Claim') && !text.includes('|---')) {
      errors.push('Missing structured Markdown Evidence Table (| Claim | Source | Confidence |).');
    }
  }

  // 4. Case-Specific Criteria Checks
  if (caseId === 'q-case-dth-complaints-quiet-server') {
    if (!/Farah\s+Iqbal/i.test(text)) {
      warnings.push('Recommended to name Farah Iqbal (Customer Care Operations) explicitly.');
    }
    const qMatches = text.match(/^\s*\d+\.\s+/gm);
    if (!qMatches || qMatches.length < 5) {
      warnings.push('Ensure exactly 5 numbered diagnostic questions are listed.');
    }
  }

  if (caseId === 'q-case-solar-smell-test-server') {
    const findingItems = (text.match(/^\s*\d+\.\s+/gm) || []).length;
    if (findingItems > 2) {
      errors.push('Prioritized Findings must not exceed 2 items.');
    }
  }

  if (caseId === 'q-case-consumer-spares-search-server') {
    if (!/Actionable\s+now/i.test(text) || !/Needs\s+check/i.test(text) || !/Not\s+transferable/i.test(text)) {
      errors.push('Candidate Matches table must use standard category labels: Actionable now / Needs check / Not transferable.');
    }
  }

  const score = Math.max(0, 100 - (errors.length * 25) - (warnings.length * 10));
  return {
    valid: errors.length === 0,
    score,
    errors,
    warnings
  };
}
