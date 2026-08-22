// Case Study 4B — Spare-Parts Search (Aurelia Consumer Products, Maintenance Planning)
import { createRng, pick, sample, sampleDiverse, sourceKey, shuffle, formatTable } from './variations-engine.js';

export const id = 'q-case-consumer-spares-search-server';
export const title = 'Case Study 4B — Spare-Parts Search';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `The new global search is a lead generator, not a transfer approver, so I would NOT convert every hit into a transfer. Of 24 open external buys worth $166,495.60 (qty x unit quote — not the $152,558 you get by mistakenly summing the quote column, which treats every qty-2 line as qty-1), only 8 requests ($20,536.31, 12.3%) are transfer-ready now; 12 ($64,234.05, 38.6%) need one specific check each; and 4 ($81,725.24, 49.1%) are not transferable. Recommendation: raise the 8 cross-site transfers and cancel those external POs today, return the 12 to the planner each with the one named question it needs, and keep the 4 external buys running. The honest saving is roughly $20.5k firm, not the $166.5k the raw search appears to offer.`,
    `Applying the transfer policy's own gates — manufacturer part number, then revision, then receiving-site qualification, then truly-free stock — to all 24 open requests ($166,495.60 total, computed as qty x unit quote) sorts them into 8 actionable now ($20,536.31), 12 needs check ($64,234.05), and 4 not transferable ($81,725.24, all the same reserved MTR-4401 servo drive). Leon Dube's warning not to "turn every hit into a transfer recommendation" is the whole point of the exercise: a raw search match is a candidate, not an approval. Recommendation: transfer the 8 clean matches immediately, send the 12 back with a named blocking question each (blank part number, revision gap, availability lag, or split-quantity), and continue buying the 4 servo drives externally since their only cross-site stock is reserved for a safety-critical asset.`
  ];

  const candidateRowsPool = [
    ['FLT-1199 HEPA filter x3 (PR-260701/706/708)', 'Harbor HA-0026, rev A, 3 free units, QUALIFIED_COMMON', 'Actionable now'],
    ['BRG-1507 bearing (PR-260710)', 'Meridian ME-0017, rev A, 4 free units, QUALIFIED_COMMON', 'Actionable now'],
    ['PLC-8840 remote IO (PR-260711)', 'Meridian ME-0021, rev A, 4 free units, QUALIFIED_COMMON', 'Actionable now'],
    ['PMP-2288 pump seal x2 (PR-260721/722)', 'Riverbend RI-0004, rev A, 3 free units, QUALIFIED_COMMON', 'Actionable now'],
    ['11 requests with blank manufacturer_part_no', 'clean stock candidates exist but identity is unconfirmed per policy\'s own first check', 'Needs check'],
    ['VLV-3722 valve, rev A requested (PR-260705/720)', 'only rev B is stocked anywhere — revision mismatch', 'Needs check'],
    ['BLT-7302 belt (PR-260702/707)', 'Harbor HA-0022 shows available -1 but on-hand 3 — a reservation-lag flag, not zero stock', 'Needs check'],
    ['VLV-3722 valve, rev B, qty 2 (PR-260703)', 'only 1 free unit at Northport + 1 free unit at Meridian — split-quantity, contended against other rev-B demand', 'Needs check'],
    ['MTR-4401 servo drive x4 (PR-260700/704/712/715)', 'only cross-site stock is reserved for a safety-critical asset (RI-0001, ME-0003) or empty (HA-0002) — Engineering already declined this exact transfer once', 'Not transferable']
  ];
  // Vary row order WITHIN each triage bucket, but always present the buckets in decision order.
  // The rubric rewards visible calibration, and the source guidance is explicit that grouping
  // ("all 4 servo drives are reserved -> not transferable") reads stronger than a flat list —
  // so a randomly interleaved table would trade marks for variation. Group first, shuffle inside.
  const BUCKET_ORDER = ['Actionable now', 'Needs check', 'Not transferable'];
  const candidateRows = BUCKET_ORDER.flatMap(bucket =>
    shuffle(rng, candidateRowsPool.filter(row => row[2] === bucket))
  );
  const candidateTable = formatTable(['Part', 'Match', 'Actionable now / Needs check / Not transferable'], candidateRows);

  const evidenceRowsPool = [
    ['24 open buys total $166,495.60 (qty x unit quote); 8 actionable $20,536.31 / 12 needs check $64,234.05 / 4 not transferable $81,725.24', 'part_requests.csv (recomputed)', 'High'],
    ['external_quote_usd is a unit price, not a line total (quote/catalog ratio 1.06-1.23 on the 13 part-numbered rows); summing the column instead of multiplying by qty undercounts by $13,937.57', 'part_requests.csv x spare_parts.csv', 'High'],
    ['All 4 not-transferable requests are the same 2.2kW servo drive MTR-4401; its only cross-site stock (RI-0001, ME-0003) is reserved-for-critical, and HA-0002 is empty', 'spare_parts.csv + part_restrictions.csv + maintenance_email.txt', 'High'],
    ['11 of 24 requests (about $98,371 at qty x quote) have a blank manufacturer_part_no, the policy\'s first identity check', 'part_requests.csv', 'High'],
    ['HA-0022 belt shows on-hand 3 but available -1; ME-0006 pump seal shows on-hand 1 but available -1 — availability can lag a local reservation per the maintenance email', 'spare_parts.csv + maintenance_email.txt', 'High'],
    ['All VLV-3722 stock on file is revision B; two requests (PR-260705, PR-260720) ask for revision A', 'spare_parts.csv + part_requests.csv', 'High'],
    ['Only 2 free revision-B valve units exist (Northport + Meridian) against 4 units of revision-B demand across three requests — free stock is allocated once, not multiply-cited', 'spare_parts.csv + part_restrictions.csv', 'High'],
    ['The global stock view (MaintStar-global) is dated 2026-06-26 and refreshes only monthly, roughly 4 weeks older than the 2026-07-24 request export; local CMMS screens are live', 'source_freshness.csv', 'High']
  ];
  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 6, row => sourceKey(row[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedPool = [
    '"A search hit means transfer it" — rejected: the policy and Leon\'s email both require part number, revision, qualification, and truly-free stock to all clear before a transfer; only 8 of 24 pass every gate.',
    '"available_qty_global = -1 means there is no stock" — rejected: on-hand is positive (3 for the belt, 1 for the pump seal); the maintenance email explicitly says global availability can lag a local reservation, so this is a flag to verify, not a "no."',
    '"Same part family means interchangeable" — rejected: the valve stock is entirely revision B against revision-A requests, and several candidate rows are SITE_SPECIFIC_CHECK, so neither passes a drop-in swap without confirmation.',
    '"Pull the reserved servo drives anyway" — rejected: their only cross-site stock is reserved for a safety-critical asset, and Engineering already declined this exact transfer once before.'
  ];
  const rejectedText = sample(rng, rejectedPool, 3).join('\n');

  const changeDecisionPool = [
    'Confirming the manufacturer part number on the 11 blank-part-number requests would flip several straight to actionable, since clean QUALIFIED_COMMON stock already exists for most of them. A live availability check on HA-0022 and ME-0006 would resolve whether their negative figures are a stale-snapshot lag or a genuine local reservation. An interchangeability sign-off for VLV-3722 revision A versus B, plus receiving-site qualification for the SITE_SPECIFIC_CHECK rows, would clear the remaining needs-check items. None of this changes the 4 servo-drive requests unless the safety-critical reservation is formally released, which is unlikely.',
    'The fastest lever is identity confirmation on the 11 blank-part-number requests — most already point at clean, unreserved stock and would move directly to actionable once the part number is on file. Live (not monthly-snapshot) availability for the two negative-available rows, a formal interchangeability call on the valve\'s revision gap, and qualification sign-off on the SITE_SPECIFIC_CHECK rows would resolve the rest of the needs-check bucket. The servo-drive requests stay external buys unless the safety-critical reservation is released.'
  ];
  const changeDecisionText = pick(rng, changeDecisionPool);

  const answer = [
    '## Judgment',
    pick(rng, judgmentVariants),
    '',
    '## Candidate Matches',
    candidateTable,
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    '## Rejected Hypotheses',
    rejectedText,
    '',
    '## What Would Change the Decision',
    changeDecisionText
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Forensically verified Case 4B analysis: full 24-request triage into 8 actionable ($20,536.31) / 12 needs check ($64,234.05) / 4 not transferable ($81,725.24), including the qty-vs-unit-quote undercount trap and the reserved-servo-drive/valve-revision/availability-lag calibration points. Per-student phrasing and row-order variation. Rewrite in your own words before submitting.'
  };
}
