// Case Study 3B — Is the Irish Preference Claim Supported? (Asterion Ortho, EMEA Customs)
import { createRng, pick, sample, sampleDiverse, sourceKey, formatTable } from './variations-engine.js';

export const id = 'q-case-customs-preference-server';
export const title = 'Case Study 3B — Is the Irish Preference Claim Supported?';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const decisionVariants = [
    'The preferential-origin claim is NOT supported by the available evidence, and the line should not be cleared as preferential as it stands. The declaration sets preference = Yes for P1006, but ClearView has no supplier support linked, the line is declared US origin at 0.0% duty (so preference is both questionable and duty-neutral), and the only Irish-origin supplier declaration on file — SUP-02/P1006 — is expired (valid_to 2025-07-31, a 2024 document), while the entry is dated 2025-09-18. This is "not established", not "proven false": the register itself says its silence "does not prove that no document exists outside the register", and other suppliers (DE/BE/FR) hold current EU-origin declarations for P1006 that simply are not linked to this shipment. The right move is to hold and verify, not to grant preference, and not to raise a fraud/error escalation on a register gap alone.',
    'On the evidence supplied, the Irish preference claim on packet IE-2025-000411 is unsupported and should not be cleared as-is. Preference = Yes is set for P1006, but no supplier declaration is linked in ClearView, the declared origin is US (making a preference claim duty-neutral on an already-0% line), and the sole Irish-origin document on record — SUP-02/P1006, dated 2024, valid only to 2025-07-31 — had already expired before the 2025-09-18 entry. ERP/Helios origin is US but was, per the origin workshop notes, "never designed to prove preference," so it cannot settle the question either way. Crucially the register\'s own text warns that absence there "does not prove that no document exists outside the register," and three other suppliers (DE, BE, FR) hold current EU-origin declarations for the same part — just not tied to this shipment. The verdict this evidence actually reaches is "not established", not "disproved" — those are different findings, and only the weaker one is supported here. The correct disposition is hold-and-verify, not a fraud call.'
  ];

  const evidenceRowsPool = [
    ['Preference = Yes claimed for P1006, but no supplier support is linked in ClearView', 'declaration.pdf, preference field, Line 1; review_note.txt, full text', 'High'],
    ['Line is declared US origin at 0.0% duty — preference is both duty-neutral and questionable on a US-origin good', 'declaration.pdf, origin + duty fields, Line 1', 'Medium'],
    ['SUP-02/P1006 (Ireland) is Expired: valid_to 2025-07-31, document SD-SUP-02-P1006-2024; the entry is dated 2025-09-18, after expiry', 'supplier_origin_register.csv, SUP-02/P1006 row (valid_to, status columns); supplier_declaration_reference.txt, lookup date', 'High'],
    ['ERP/Helios origin is US; the origin workshop states Helios "was never designed to prove preference"', 'origin-workshop.md, quoted line; product_master_current.xlsx, P1006 mfg-country field', 'High'],
    ['The register lookup itself states absence "does not prove that no document exists outside the register"; the register is admittedly "not always updated"', 'supplier_declaration_reference.txt, disclaimer line; origin-workshop.md, quoted line', 'High'],
    ['P1006 has five origins on file (US, IE, DE, BE, FR); suppliers SUP-03/05/06 hold current EU-origin declarations, but none is linked to this shipment', 'supplier_origin_register.csv, all P1006 rows (5 suppliers)', 'High'],
    ['Declared tariff code 90211090 is the correct EU CN8 code for P1006 — the code itself is not the issue in this case', 'country_tariff_matrix.xlsx, EU Matrix tab, P1006 row', 'High'],
    ['Invoice shows Quantity 10 but Line value = Unit value = EUR 193,400 (Line != Qty x Unit); the air waybill separately shows only 4 pieces — a valuation/consistency anomaly independent of the preference question', 'commercial_invoice.pdf, Qty + Unit value + Line value fields; air_waybill.pdf, piece count field', 'Medium']
  ];
  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 6, row => sourceKey(row[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedPool = [
    '"Preference = Yes on the form means the claim is supported" — rejected: the indicator is a claim, not evidence; no supporting declaration is linked and none valid is in the packet.',
    '"ERP shows US origin, so the claim is simply false" — rejected as too strong: ERP carries manufacturing country, was never designed to prove preference, and the register is admittedly incomplete. The evidence supports "not established", not "false".',
    '"SUP-02\'s Irish declaration covers this entry" — rejected: it expired 2025-07-31 (a 2024 document), before the 2025-09-18 entry date.',
    '"The shipping route to Ireland or the 0% duty rate settles origin" — rejected: logistics and duty rate do not establish preferential origin, which is a strictly documentary question.'
  ];
  const rejectedText = sample(rng, rejectedPool, 3).join('\n\n');

  const missingEvidencePool = [
    'A current, valid supplier declaration or origin proof for P1006 covering the 2025-09-18 entry. If one is produced and shows a qualifying EU origin, the decision flips to clear the claim as preferential; if none exists, the decision hardens toward permanently non-preferential.',
    'The preference rule/agreement actually invoked and its origin criterion — the workshop notes ask for "the supplier declaration and the rule used for the claim." Without it, even a valid-looking document cannot be checked against the right criterion.',
    'Which supplier actually sourced this shipment (US SUP-01 vs EU SUP-03/05/06 vs the expired SUP-02) — the packet never states this. If it was SUP-03/05/06, a current declaration already exists and just needs linking; if SUP-01, the US origin is confirmed and preference cannot apply at all.',
    'Whether a valid document exists outside the register, e.g. in procurement category folders, since the register is known to be incomplete. Finding one there would resolve this without waiting on the supplier; finding nothing would support the fraud-referral escalation instead of the hold.'
  ];
  const missingEvidenceText = sample(rng, missingEvidencePool, 3).map(s => `- ${s}`).join('\n');

  const safeActionVariants = [
    '**Hold pending the supplier declaration** — treat the line as non-preferential (MFN) for now (duty-neutral, since duty is already 0%, so little revenue is at stake) rather than clearing or rejecting the claim outright; this is fully reversible once proof arrives. Request from Procurement Shared Services the current supplier declaration for the actual sourcing supplier of P1006 on this entry, plus the rule invoked. Withdraw or correct the preference indicator if no valid originating-status proof exists for the entry date. Escalate to a formal error/fraud referral only if that verification is requested and fails.',
    '**Hold pending proof, do not clear as preferential.** Default to non-preferential treatment (0% duty either way, so this is revenue-neutral and reversible) while requesting the current supplier declaration and the specific preference rule invoked from the category owner. If no valid document surfaces for the 2025-09-18 entry, correct the preference indicator; only escalate as an error/fraud referral if a targeted request for proof is made and comes back empty.'
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
