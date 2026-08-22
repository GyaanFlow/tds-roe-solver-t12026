// Case Study 3B — Is the Irish Preference Claim Supported? (Asterion Ortho, EMEA Customs)
import { createRng, pick, sample, formatTable } from './variations-engine.js';

export const id = 'q-case-customs-preference-server';
export const title = 'Case Study 3B — Is the Irish Preference Claim Supported?';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const decisionVariants = [
    'The preferential-origin claim is NOT supported by the available evidence, and the line should not be cleared as preferential as it stands. The declaration sets preference = Yes for P1006, but ClearView has no supplier support linked, the line is declared US origin at 0.0% duty (so preference is both questionable and duty-neutral), and the only Irish-origin supplier declaration on file — SUP-02/P1006 — is expired (valid_to 2025-07-31, a 2024 document), while the entry is dated 2025-09-18. This is "not established", not "proven false": the register itself says its silence "does not prove that no document exists outside the register", and other suppliers (DE/BE/FR) hold current EU-origin declarations for P1006 that simply are not linked to this shipment. The right move is to hold and verify, not to grant preference, and not to raise a fraud/error escalation on a register gap alone.',
    'On the evidence supplied, the Irish preference claim on packet IE-2025-000411 is unsupported and should not be cleared as-is. Preference = Yes is set for P1006, but no supplier declaration is linked in ClearView, the declared origin is US (making a preference claim duty-neutral on an already-0% line), and the sole Irish-origin document on record — SUP-02/P1006, dated 2024, valid only to 2025-07-31 — had already expired before the 2025-09-18 entry. ERP/Helios origin is US but was, per the origin workshop notes, "never designed to prove preference," so it cannot settle the question either way. Crucially the register\'s own text warns that absence there "does not prove that no document exists outside the register," and three other suppliers (DE, BE, FR) hold current EU-origin declarations for the same part — just not tied to this shipment. The correct disposition is hold-and-verify, not a fraud call.'
  ];

  const evidenceRowsPool = [
    ['Preference = Yes claimed for P1006, but no supplier support is linked in ClearView', 'declaration.pdf; review_note.txt', 'High'],
    ['Line is declared US origin at 0.0% duty — preference is both duty-neutral and questionable on a US-origin good', 'declaration.pdf', 'Medium'],
    ['SUP-02/P1006 (Ireland) is Expired: valid_to 2025-07-31, document SD-SUP-02-P1006-2024; the entry is dated 2025-09-18, after expiry', 'supplier_origin_register.csv; supplier_declaration_reference.txt', 'High'],
    ['ERP/Helios origin is US; the origin workshop states Helios "was never designed to prove preference"', 'origin-workshop.md; product_master_current.xlsx', 'High'],
    ['The register lookup itself states absence "does not prove that no document exists outside the register"; the register is admittedly "not always updated"', 'supplier_declaration_reference.txt; origin-workshop.md', 'High'],
    ['P1006 has five origins on file (US, IE, DE, BE, FR); suppliers SUP-03/05/06 hold current EU-origin declarations, but none is linked to this shipment', 'supplier_origin_register.csv', 'High'],
    ['Declared tariff code 90211090 is the correct EU CN8 code for P1006 — the code itself is not the issue in this case', 'country_tariff_matrix.xlsx (EU Matrix)', 'High'],
    ['Invoice shows Quantity 10 but Line value = Unit value = EUR 193,400 (Line != Qty x Unit); the air waybill separately shows only 4 pieces — a valuation/consistency anomaly independent of the preference question', 'commercial_invoice.pdf; air_waybill.pdf', 'Medium']
  ];
  const selectedEvidence = sample(rng, evidenceRowsPool, 6);
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedPool = [
    '"Preference = Yes on the form means the claim is supported" — rejected: the indicator is a claim, not evidence; no supporting declaration is linked and none valid is in the packet.',
    '"ERP shows US origin, so the claim is simply false" — rejected as too strong: ERP carries manufacturing country, was never designed to prove preference, and the register is admittedly incomplete. The evidence supports "not established", not "false".',
    '"SUP-02\'s Irish declaration covers this entry" — rejected: it expired 2025-07-31 (a 2024 document), before the 2025-09-18 entry date.',
    '"The shipping route to Ireland or the 0% duty rate settles origin" — rejected: logistics and duty rate do not establish preferential origin, which is a strictly documentary question.'
  ];
  const rejectedText = sample(rng, rejectedPool, 3).join('\n');

  const missingEvidencePool = [
    'A current, valid supplier declaration or origin proof for P1006 covering the 2025-09-18 entry, establishing originating status under a specific preference programme.',
    'The preference rule/agreement actually invoked and its origin criterion — the workshop notes explicitly ask for "the supplier declaration and the rule used for the claim."',
    'Which supplier actually sourced this shipment (US SUP-01 vs EU SUP-03/05/06 vs the expired SUP-02) — the packet never states this.',
    'Whether a valid document exists outside the register, e.g. in procurement category folders, since the register is known to be incomplete.'
  ];
  const missingEvidenceText = sample(rng, missingEvidencePool, 3).map(s => `- ${s}`).join('\n');

  const safeActionVariants = [
    'Hold the preference claim and treat the line as non-preferential (MFN) for now — duty-neutral here since duty is already 0%, so little revenue is at stake, but the flag must still be resolved for correctness and audit. Request from Procurement Shared Services the current supplier declaration for the actual sourcing supplier of P1006 on this entry, plus the rule invoked. Withdraw or correct the preference indicator if no valid originating-status proof exists for the entry date. Escalate to a formal error/fraud referral only if that verification is requested and fails.',
    'Do not clear the line as preferential. Default to non-preferential treatment (0% duty either way, so this is revenue-neutral) while requesting the current supplier declaration and the specific preference rule invoked from the category owner. If no valid document surfaces for the 2025-09-18 entry, correct the preference indicator; only escalate as an error/fraud referral if a targeted request for proof is made and comes back empty.'
  ];
  const safeActionText = pick(rng, safeActionVariants);

  const answer = [
    '## Decision',
    pick(rng, decisionVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    '## Rejected Hypotheses',
    rejectedText,
    '',
    '## Missing Evidence',
    missingEvidenceText,
    '',
    '## Safe Next Action',
    safeActionText
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Forensically verified Case 3B analysis (expired SUP-02 declaration vs 2025-09-18 entry, US-origin duty-neutral line, register-incompleteness calibration, 5-supplier origin landscape) with per-student phrasing/evidence-order variation. Rewrite in your own words before submitting.'
  };
}
