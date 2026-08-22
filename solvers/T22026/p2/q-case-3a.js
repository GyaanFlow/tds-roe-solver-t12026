// Case Study 3A — Swiss Mismatch Control (Asterion Ortho, EMEA Customs)
import { createRng, pick, sample, sampleDiverse, sourceKey, formatTable } from './variations-engine.js';

export const id = 'q-case-customs-mismatch-server';
export const title = 'Case Study 3A — Swiss Mismatch Control';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const decisionVariants = [
    'Do NOT escalate this as a likely declaration error. The declared Swiss code 90211000 is exactly the code the country tariff matrix approves for P1001 in Switzerland, current on the 2025-11-04 entry date. The tool flagged it only because it differs from "Helios 90211090" — an eight-digit *commercial* commodity code the master file calls migration-mapped and "not customs-ruling status" — which happens to equal the EU CN8 code, a different nomenclature. At the harmonised six-digit level both are 902110, so there is no mismatch where classification is actually harmonised. This is a cross-code-system false positive, not a declaration error — though not permanently settled without a Tares/binding-ruling confirmation.',
    'Do not raise CH-2025-000522 as a declaration error. Switzerland runs its own local tariff nomenclature, and the tariff matrix confirms P1001\'s approved Swiss code is exactly the declared 90211000, current on the entry date. The comparator\'s benchmark, Helios 90211090, is commercial master data the file labels "not customs-ruling status" — and it equals the EU CN8 code, which itself changed from 90211010 to 90211090 on 2025-07-01, showing "one true code" doesn\'t exist across jurisdictions and versions. Both values share HS6 902110, so the goods classify identically where it actually matters. The mismatch is a schema gap (no code-system identifier, nomenclature version, or effective date modeled), not broker error.'
  ];

  const evidenceRowsPool = [
    ['Declared 90211000 is the Swiss-approved code for P1001, current on the 2025-11-04 entry date', 'country_tariff_matrix.xlsx, Swiss tab, P1001 row', 'High'],
    ['Flag value 90211090 is P1001\'s Helios commercial code, labeled "migration-mapped" and "not customs-ruling status"', 'product_master_current.xlsx, Read Me + P1001/Helios field', 'High'],
    ['Swiss local code and EU CN8 are different nomenclatures; the reference file states cross-jurisdiction string matching "is not expected"', 'country_tariff_matrix.xlsx, Read Me line', 'High'],
    ['All code variants share HS6 902110; they differ only in the national 7th-8th digits', 'product_master_current.xlsx Base HS6 field + both matrix tabs, P1001 row', 'High'],
    ['The EU code for P1001 itself changed from 90211010 to 90211090 at 2025-07-01, showing codes are version- and date-dependent', 'country_tariff_matrix.xlsx, EU tab, P1001 effective-date column', 'High'],
    ['The canonical schema lists code-system identifier, nomenclature version, and effective dates as "Not yet modeled"', 'canonical-schema-v0.3.md, field list', 'High'],
    ['Duty is 0.0% / CHF 0.00 with no preference claimed, and US origin is consistent across declaration, invoice, and master — no revenue at stake', 'declaration.pdf Line 1; commercial_invoice.pdf mfg-country', 'Medium'],
    ['Commercial invoice shows Quantity 10 but Line value = Unit value = CHF 126,900 (Line != Qty x Unit); air waybill separately shows only 4 pieces — a valuation/consistency anomaly independent of the code flag', 'commercial_invoice.pdf Qty/Unit/Line fields; air_waybill.pdf piece count', 'High']
  ];
  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 3, row => sourceKey(row[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedPool = [
    '"90211000 is a keying error for 90211090" — rejected: it is the jurisdiction-correct Swiss code, not a dropped or transposed digit.',
    '"Helios is the source of truth, so the declaration must match it" — rejected: product_master_current.xlsx\'s own Read Me labels the Helios field "migration-mapped" and "Commercial master-data status, not customs-ruling status" — the record that would have to say otherwise for this hypothesis to hold, and it does not.',
    '"A mismatch flag automatically means a declaration error" — rejected: with code-system and version unmodeled, a differing string is not evidence of misclassification.'
  ];
  const rejectedText = sample(rng, rejectedPool, 2).join('\n\n');

  const missingEvidencePool = [
    'The code-system identifier and nomenclature version behind each code — without it, the tooling cannot tell a real misclassification from a cross-nomenclature difference on any future packet.',
    'The effective-dated Swiss Tares entry or binding ruling for P1001 ("confirm Tares/ruling for legal use"). If Tares shows a code other than 90211000 as current, the decision flips to escalate.',
    'An authoritative duty table to confirm the 0% rate independently, since the tariff matrix has no duty column. If duty is not actually 0%, the materiality changes even if the classification verdict does not.',
    'The true line quantity/unit-value basis for P1001 — Qty 10 but a 1-unit line value, and 4 pieces on the AWB. If the real value is ~CHF 1.27M, that becomes the material issue here, separate from the code flag.'
  ];
  const missingEvidenceText = sample(rng, missingEvidencePool, 2).map(s => `- ${s}`).join('\n');

  const safeActionVariants = [
    'Do not raise it to the broker/importer as a declaration error. Fix the comparator to compare like-for-like within one nomenclature, or normalise to HS6 before flagging, and make it code-system- and effective-date-aware. If legal certainty is required, confirm P1001\'s Swiss classification via Tares or a binding ruling, then close the flag as a documented cross-nomenclature artifact. No duty is at stake either way.',
    'Close the mismatch flag as a cross-nomenclature false positive, not a broker error, and do not contact the broker. Separately, correct the comparator so it never again compares a Swiss local code to a Helios/EU code without normalising to HS6 first. If formal legal sign-off is wanted, request Tares/ruling confirmation for P1001 in parallel — it does not block closing this flag.'
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
    guide: 'Forensically verified Case 3A analysis (Swiss vs EU/Helios nomenclature distinction, HS6 902110 harmonisation, schema-gap root cause, plus the independent Qty 10 / Line-value-1 packet anomaly) with per-student phrasing variation. Rewrite in your own words before submitting.'
  };
}
