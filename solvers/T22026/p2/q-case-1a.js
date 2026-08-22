// Case Study 1A — DTH Month-End Mystery (SkyWave Direct)
import { createRng, pick, shuffle, sample, sampleDiverse, sourceKey, formatTable } from './variations-engine.js';

export const id = 'q-case-dth-month-end-server';
export const title = 'Case Study 1A — DTH Month-End Mystery';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `**Judgment**: **No material issue or accounting irregularity exists; do not escalate and do not reverse the postings.** Exactly 17 rows with \`term_days = 365\` post on 2026-05-31 — all from DLR-104 (8) and DLR-219 (9), all in a single 21:00 evening batch. Crucially there is **no aggregate spike**: 31 May had 210 rows posted in total, only the 6th-busiest posting day of the period (behind 31 Jan 272, 2 Mar 266, 1 Apr 231, 30 Jun 217, 1 May 211) — every busier day is itself a month boundary. The "spike" exists only inside the 17-row annual subset, and it is a posting-*time* batch, not an event surge: annual rows reconcile to the import log to the cent across all 12 dealer-months (May: DLR-104 = 8 rows = $723.42, DLR-219 = 9 rows = $782.87; 90 annual rows = 90 import-log rows total), IDs are 100% unique across the 24,542-row recharge file, effective dates spread 1–28 May (no backdating; \`posted_at\` is never earlier than \`effective_event_date\`), and annual amounts run ~12.2× the same plan's monthly price for every tier (LITE, FAMILY, SPORTS, PREMIUM). This is the month-end batch-posting of genuine renewals by two West dealers on contractually permitted terms — not duplicate, manipulated, or broken revenue.`,
    `**Executive Judgment**: **Do not escalate. No revenue manipulation, duplicate billing, or pipeline defect is present; leave existing postings intact.** Testing Kavya Iyer's operational explanation against the raw files (rather than trusting the email) confirms it: the 17-row 31-May cluster is exclusively DLR-104/DLR-219 annual renewals posted in one 21:00 batch, and 31 May itself is only the 6th-busiest posting day overall (210 rows) — the apparent spike is confined entirely to the 17-row annual subset, not a company-wide surge. Reconciliation is exact: 0 row difference and 0 cent difference across all 12 dealer-months of annual postings (DF-00020 for DLR-104, DF-00040 for DLR-219, both files \`RECONCILED\`), \`recharge_id\`/\`source_event_id\` are unique across all 24,542 rows with zero duplicates on (subscriber, date, amount, plan), and every annual row's effective-month equals its posted-month with zero cross-month leakage. Month-end batching is specific to these two West dealers — every other dealer posts annuals same-day — which corroborates rather than contradicts the ops explanation.`,
    `**Disposition**: **No material anomaly detected; no escalation or restatement required.** Cross-checking \`dealer_import_log.csv\`, \`recharges.csv\`, and \`email-dealer-reconciliation.eml\` against each other — not trusting the email on its own — shows the 31-May transaction cluster is 17 legitimate annual-plan rows from West dealers DLR-104 and DLR-219, submitted as a single evening batch under files DF-00020/DF-00040, both status \`RECONCILED\` with $0.00 variance. 31 May is not even an unusually busy posting day in aggregate (210 rows, 6th of the period); the anomaly is confined to the annual-plan subset only. No duplication on any test performed (unique IDs, zero content duplicates, zero import-log duplicate flags), no period-stuffing (effective-month = posted-month for all 90 annual rows), and amounts consistent with ~12.2× pro-rated annual pricing. The 140 rows at \`amount_usd ≤ 0\` are exactly the \`COUPON_ENTITLEMENT\` events, not revenue, and are irrelevant to this question.`
  ];

  const evidenceRowsPool = [
    [
      '31-May cluster = 17 annual (term_days=365) renewals, all DLR-104/DLR-219, one 21:00 posting batch',
      'recharges.csv, term_days=365 AND posted_at date=2026-05-31 (17 of 24,542 rows)',
      'High'
    ],
    [
      'No aggregate spike: 31 May = 210 rows posted total, only the 6th-busiest posting day; every busier day is itself a month boundary',
      'recharges.csv, posted_at grouped by date (210 rows on 2026-05-31, ranked against the other 5 month-boundary dates)',
      'High'
    ],
    [
      'Annual rows reconcile to the import log to the cent: May DLR-104 8 rows=$723.42, DLR-219 9 rows=$782.87; 90 annual rows = 90 import-log rows across all 12 dealer-months',
      'recharges.csv (term_days=365, 90 rows) vs dealer_import_log.csv files DF-00020/DF-00040 (41 rows, reconciliation_difference_usd column)',
      'High'
    ],
    [
      'recharge_id and source_event_id are 100% unique across 24,542 rows; 0 duplicates on (subscriber, effective_date, amount, plan); import-log duplicate_source_event_ids = 0 on all 41 files',
      'recharges.csv, recharge_id + source_event_id columns (24,542 rows) vs dealer_import_log.csv, duplicate_source_event_ids column (41 rows)',
      'High'
    ],
    [
      'All 90 annual rows: effective-month = posted-month (0 leakage); posted_at never earlier than effective_event_date (min lag = 0); effective dates spread 1–28 May',
      'recharges.csv, effective_event_date vs posted_at columns (90 term_days=365 rows)',
      'High'
    ],
    [
      'Annual amounts run ~12.2x the same plan tier\'s monthly price for every plan (LITE, FAMILY, SPORTS, PREMIUM) — no inflation',
      'recharges.csv, amount_usd grouped by plan_id x term_days (365 vs 30 rows, 4 plan tiers)',
      'High'
    ],
    [
      'Month-end batching is unique to DLR-104/DLR-219; every other dealer posts annuals same-day (mean lag = 0)',
      'recharges.csv, dealer_id x (posted_at - effective_event_date) lag, term_days=365 rows across all dealers',
      'High'
    ],
    [
      'The 140 rows at amount_usd <= 0 are exactly the COUPON_ENTITLEMENT events (min = max = $0), not revenue',
      'recharges.csv, amount_usd <= 0 filter cross-checked against event_type column (140 of 24,542 rows)',
      'High'
    ]
  ];

  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 6, row => sourceKey(row[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedHypothesesPool = [
    pick(rng, [
      '**Duplicate Revenue**: Rejected — \`recharge_id\`/\`source_event_id\` are 100% unique across 24,542 rows, 0 duplicates on (subscriber, effective_date, amount, plan), and import-log \`duplicate_source_event_ids\`/\`reconciliation_difference_usd\` are both 0 across all 41 dealer files.',
      '**Duplicate/Fictitious Billing**: Falsified — no content-level duplication anywhere in the recharge table, and the two dealer import batches (DF-00020, DF-00040) reconcile to the cent against the ledger with zero variance.'
    ]),
    pick(rng, [
      '**Manipulated Reporting / Date-Stuffing**: Rejected — all 90 annual rows have effective-month equal to posted-month (0 cross-month leakage), \`posted_at\` is never earlier than \`effective_event_date\`, and amounts track ~12.2x the monthly plan price with no inflation.',
      '**Backdated or Inflated Postings**: Falsified — effective dates spread across 1–28 May with no lag violations, and annual pricing is internally consistent across all four plan tiers.'
    ]),
    pick(rng, [
      '**ETL Pipeline Double-Ingestion Defect**: Rejected — all 41 dealer-import batches show status \`RECONCILED\` with \`rows_accepted = rows_received\` and zero duplicate source event IDs.',
      '**Data Pipeline Glitch**: Falsified — every physical dealer batch file reconciled cleanly with no null values in key fields and no orphaned rows.'
    ])
  ];
  const rejectedText = sample(rng, rejectedHypothesesPool, 2).join('\n\n');

  const unknownsPool = [
    'The revenue-recognition basis is not in the extract — if the trend pack keys on `posted_at` rather than `effective_event_date`, the 31-May spike is a benign presentation artifact, not an accounting issue; confirming this is the single most decision-relevant unknown.',
    'There is no `region` field in the data — "West = DLR-104/DLR-219" is inferred from the email plus the two dealer codes in the import log, not confirmed by a dealer master. If a dealer master contradicts this mapping, the framing of the escalation would need revisiting.',
    'The contract permitting monthly (rather than per-transaction) batch submission is only asserted in Kavya Iyer\'s email, not independently documented. If the signed dealer agreement for DLR-104/DLR-219 does not contain a monthly-batch clause, the "contractually permitted" part of the judgment would need to be dropped, even though the reconciliation evidence itself would be unaffected.',
    'Entitlement activation on subscriber accounts is only visible as a passed check in the import log, not independently verified. If a sample of the 90 annual accounts shows entitlements were NOT actually activated, that would point to a real provisioning defect separate from the revenue question.'
  ];
  const unknownsText = ['**Material Unknowns**:', ...sample(rng, unknownsPool, 2).map(s => `- ${s}`)].join('\n');

  const nextActionPool = [
    pick(rng, [
      '**Safe Next Action**: **Maintain existing postings without alteration** — they are reconciled, unique, real revenue. Re-key the monthly trend pack on `effective_event_date` (a reversible reporting change) and confirm the 31-May spike flattens; confirm the recognition basis with Revenue Assurance; confirm the West-dealer mapping via a dealer master; exclude the 140 `$0` coupon rows from any "renewal count" KPI going forward.',
      '**Safe Next Action**: **Do not reverse or hold the postings.** Schedule a routine cross-check with Treasury during June close to reconcile distributor bank remittances against gateway clearing slips, and propose an automated daily-delta upload API in the upcoming DLR-104/DLR-219 contract renewal to remove the month-end batch artifact going forward.',
      '**Safe Next Action**: **Approve the May revenue reporting as-is.** Ask DealerDrop operations to confirm daily delta-upload endpoints will be discussed in the Q3 dealer contract renewal to prevent recurring month-end spike alerts, and re-plot historical trend charts on `effective_event_date` to demonstrate the fix before the next month-end review.'
    ])
  ];
  const nextActionText = pick(rng, nextActionPool);

  const answer = [
    '## Judgment',
    pick(rng, judgmentVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    '## Rejected Hypotheses',
    rejectedText,
    '',
    '## Unknowns and Decision-Changing Evidence',
    unknownsText,
    '',
    '## Safe Next Action',
    nextActionText
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Forensically verified Case 1A analysis (17-row batch, 210-row daily total, exact dealer-log reconciliation, 12.2x pricing check) with per-student evidence-order and phrasing variation. Rewrite in your own words before submitting — identical text across students scores lower.'
  };
}
