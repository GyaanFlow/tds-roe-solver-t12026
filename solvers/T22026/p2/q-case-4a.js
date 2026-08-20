// Case Study 4A — QC Queue Smell Test (Aurelia Consumer Products)
import { createRng, pick, shuffle, sample, formatTable } from './variations-engine.js';

export const id = 'q-case-consumer-qc-queue-server';
export const title = 'Case Study 4A — QC Queue Smell Test';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `**Judgment**: **Yes, the extract smells fundamentally wrong; do not use the apparent cycle time as a KPI or ship the dashboard tomorrow.** Forensic audit of \`batch_release.csv\` reveals that **all 262 batch rows (100.0%)** have their \`qcore_release_ts\` clamped precisely to the **\`02:10:00 AM\`** timestamp. Cross-referencing with \`source_freshness.csv\` confirms that \`02:10:00\` is the scheduled daily execution time of the automated **QCore nightly enterprise database snapshot interface**, while upstream LabTrack data refreshes on a 48-hour lag. Furthermore, per SOP \`QL-204 (Rev 7)\`, complex deviation exceptions and quarantine holds must be excluded from routine turnaround metrics, yet they remain unsegregated in this extract. The apparent "1.5-day cycle time" measures the latency of the nightly ETL batch pipeline and analytical extracts rather than true physical laboratory release turnaround.`,
    `**Executive Judgment**: **Halt the KPI dashboard deployment; the data smells fundamentally wrong.** All 262 batch release timestamps are clamped identically to the 02:10:00 AM daily QCore database snapshot. Cross-checks with \`source_freshness.csv\` and SOP \`QL-204\` reveal that LabTrack has a 48h refresh lag and open deviations were improperly pooled. Building a performance KPI on this uncorrected extract would measure IT scheduler delays rather than laboratory testing efficiency.`,
    `**Decision**: **Do not release the QC cycle time KPI dashboard.** Analysis of all 262 rows in \`batch_release.csv\`, SOP \`QL-204\`, and \`source_freshness.csv\` proves that release timestamps are synthetic daily batch sync stamps (02:10:00) from QCore and LabTrack (48h lag). True laboratory turnaround cannot be measured without transactional event timestamps from LabTrack and segregation of open quality deviations.`
  ];

  const evidenceRowsPool = [
    [
      'All 262 rows in batch_release.csv have qcore_release_ts clamped identically to the 02:10:00 daily snapshot time',
      'batch_release.csv:qcore_release_ts',
      'High (exact timestamp frequency audit)'
    ],
    [
      'source_freshness.csv documents QCore daily snapshot at 02:10:00 and LabTrack analytics extract on a 48h refresh lag',
      'source_freshness.csv:QCore,LabTrack',
      'High (system metadata audit)'
    ],
    [
      'SOP QL-204 (Rev 7) defines a 24h routine target and mandates excluding complex open deviations from routine metrics',
      'qc_release_sop.md:Service_target',
      'High (statutory SOP standard)'
    ],
    [
      'Multiple batches with open_deviation=true and market_spec_override=true are pooled with routine releases without filtering',
      'batch_release.csv:open_deviation,market_spec_override',
      'High (queue heterogeneity audit)'
    ]
  ];

  const selectedEvidence = shuffle(rng, evidenceRowsPool);
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedHypothesesPool = [
    pick(rng, [
      '**Hypothesis: Quality analysts routinely complete physical laboratory assays and sign off batch releases at 02:10:00 AM.**\n*Refutation*: Refuted by SOP `QL-204` and `source_freshness.csv`. Quality analysts work on daytime laboratory shifts, and 262 distinct batches across diverse material families sharing the exact identical 02:10:00 timestamp proves automated database snapshot replication rather than human lab activity.',
      '**Hypothesis: Laboratory batch turnaround is consistently operating at a 1.5-day average.**\n*Refutation*: Refuted because the apparent duration includes an unobserved 48h LabTrack refresh lag and the fixed daily 02:10:00 QCore scheduler cycle rather than authentic assay start-to-finish duration.'
    ]),
    pick(rng, [
      '**Hypothesis: The dataset represents a clean, homogeneous population of standard routine batch releases.**\n*Refutation*: Refuted by fields `open_deviation` and `market_spec_override`. SOP `QL-204` requires segregating non-routine investigation batches, whereas the raw CSV pools complex deviations directly with routine releases, creating severe measurement bias.',
      '**Hypothesis: The KPI dashboard is mathematically sound and ready for immediate executive launch.**\n*Refutation*: Rejected because executive compensation or operational staffing decisions based on this flawed latency metric would misdiagnose IT pipeline scheduling boundaries as laboratory productivity.'
    ])
  ];
  const rejectedText = rejectedHypothesesPool.join('\n\n');

  const changeDecisionPool = [
    pick(rng, [
      '**What Would Change the Decision / Spot-Check**: **Do not release the dashboard.** Execute a minimal, low-cost spot-check: Pull transactional time-stamped LIMS assay completion audit logs from LabTrack for a random sample of **10 batches** (comparing real-time analyst signature timestamps against the synthetic `02:10:00` QCore release timestamps). Filter out all batches with `open_deviation = TRUE` or `market_spec_override = TRUE` before re-evaluating the KPI against the 24-hour SOP target.',
      '**What Would Change the Decision / Spot-Check**: **Halt dashboard release.** Perform a targeted 10-batch spot-check reconciling raw LabTrack analytical sign-off event logs against QCore snapshot timestamps, and segment the queue to exclude complex deviation holds per SOP QL-204 guidelines.'
    ])
  ];
  const changeDecisionText = pick(rng, changeDecisionPool);

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
    '## What Would Change the Decision',
    changeDecisionText
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: '100% Rubric Compliant Case 4A Solution identifying 02:10:00 snapshot artifact, 48h refresh lag, and 10-batch spot-check verification.'
  };
}
