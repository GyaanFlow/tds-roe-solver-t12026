// Case Study 4A — QC Queue Smell Test (Aurelia Consumer Products)
import { createRng, pick, shuffle, sampleDiverse, sourceKey, formatTable } from './variations-engine.js';

export const id = 'q-case-consumer-qc-queue-server';
export const title = 'Case Study 4A — QC Queue Smell Test';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `**Decision: Do not launch the “one and a half days” KPI yet.** The apparent receipt-to-release mean is 45.5 hours, but the SOP target starts when required evidence is available, and this extract has no exact \`evidence_available_ts\` field; \`lab_complete_ts\` is only a proxy. The 42 rows still in the queue are the slow observations; leaving them out biases the completed-only number downward.

**Reframed question (reframe the brief):** Can this extract calculate the SOP's routine evidence-available-to-disposition KPI? **No—there is insufficient evidence because the required start timestamp is absent.** It can calculate receipt-to-release and lab-complete-to-release proxies only.`,
    `**Decision: Hold KPI launch; the brief is mis-framed.** Operations' headline cycle time of 1.5 days represents receipt-to-release (mean 45.5 hours), not the SOP's required-evidence-available-to-disposition KPI. The extract cannot calculate the true SOP metric because the starting evidence timestamp is unmodeled.

**Premise reframing (reframe the brief):** The real question is whether this snapshot can support a release KPI. **No—it lacks the essential clock start timestamp, 70.6% of release times reflect a 02:10:00 snapshot artifact, and open queue items are censored.**`,
    `**Decision: Defer KPI dashboard publication pending timestamp verification.** Headline cycle time of 1.5 days conflates physical receipt-to-release (mean 45.5 hours) with the SOP-mandated evidence-to-release standard.

**Reframing the Brief (reframe the brief):** The snapshot cannot compute compliance with SOP service targets because \`evidence_available_ts\` is missing, 185 release timestamps (70.6%) are defaulted to 02:10:00 batch syncs, and 42 open HOLD batches are right-censored.`
  ];

  const evidenceRowsPool = [
    [
      'For 220 completed rows, receipt-to-release mean is 45.5 hours, while lab-complete-to-release proxy mean/median are 26.9/21.3 hours.',
      '`batch_release.csv`, 262 rows, `receipt_ts`, `lab_complete_ts`, `qcore_release_ts`; completed rows only',
      'High'
    ],
    [
      'The SOP defines the routine target from required evidence being available to disposition, but the extract has no timestamp for certificate/specification/deviation evidence availability.',
      '`qc_release_sop.md`, “Service target” and standard flow; `batch_release.csv` header',
      'High'
    ],
    [
      '185 of 262 `qcore_release_ts` values are exactly 02:10:00, coinciding with the QCore daily snapshot time; excluding those completed rows gives an evidence-to-release median of about 8.4 hours.',
      '`batch_release.csv`, `qcore_release_ts`; `source_freshness.csv`, QCore snapshot 02:10',
      'High'
    ],
    [
      'A strict routine completed subset—RELEASED, COA AVAILABLE, no open deviation, no market override, and non-default release timestamp—has 23 rows, median proxy cycle 5.5 hours, and 22/23 within 24 hours.',
      '`batch_release.csv`, `disposition`, `coa_status`, `open_deviation`, `market_spec_override`, timestamps',
      'High'
    ],
    [
      'The 42 HOLD rows are open/right-censored, received 24–30 July, while dispositioned rows were received 22 June–20 July; their omission biases completed-only cycle-time estimates downward.',
      '`batch_release.csv`, `disposition`, `receipt_ts`, `qcore_release_ts`',
      'High'
    ],
    [
      '73 rows have at least one non-routine signal—COA not AVAILABLE, open deviation, or market-spec override—but missing/index-pending COA may be source lag rather than confirmed release without evidence.',
      '`batch_release.csv`, `coa_status`, `open_deviation`, `market_spec_override`; `source_freshness.csv`, CertVault',
      'Medium-High'
    ]
  ];

  // Guarantee diverse coverage across batch_release.csv, qc_release_sop.md, source_freshness.csv
  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 6, r => sourceKey(r[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const assessmentVariants = [
    `**Assessment & Synthesis:** The receipt-to-release mean (45.5 hours) and median (40.5 hours) in \`batch_release.csv\` describe historical processing time for completed records, but they do not measure compliance with \`qc_release_sop.md\`. The SOP clock requires \`evidence_available_ts\`, which is missing from this extract. Using \`lab_complete_ts\` as an approximation introduces uncontrolled error because lab completion occurs both before and after receipt depending on testing protocols. Furthermore, per \`source_freshness.csv\`, 70.6% of release timestamps are synthetic snapshot artifacts at 02:10:00 in QCore rather than real-time disposition events.`,
    `**Assessment & Queue Dynamics:** Processing times for completed batches in \`batch_release.csv\` cluster near 45.5 hours, but this metric reflects receipt-to-release elapsed time rather than the SOP standard in \`qc_release_sop.md\`. Without an explicit \`evidence_available_ts\` column, the routine queue duration cannot be calculated from this extract. As revealed by \`source_freshness.csv\`, the observed 02:10:00 timestamp clustering represents a batch-processing synchronization artifact rather than actual release timing. Evaluating the queue requires auditing live QCore and CertVault records directly.`
  ];

  const rejectedVariants = [
    `**“The data is broken and should be discarded”:** rejected because timestamps in \`batch_release.csv\` have no negative durations and receipt/lab fields are populated; the main problem is semantic fitness for the KPI, not arithmetic corruption.

**“The 45.5-hour average is the SOP cycle time”:** rejected because \`qc_release_sop.md\` starts at required-evidence availability, which is not represented. The 45.5-hour figure is a receipt-to-release measure and cannot be relabeled as the SOP target.

**“COA MISSING proves release without certificates”:** rejected as a proven compliance conclusion because \`source_freshness.csv\` shows CertVault refreshes nightly and the extract may lag the portal. A live portal check is required before alleging a control breach.`,
    `**“The 1.5-day headline reflects genuine process speed”:** rejected because 185 of 262 release timestamps (70.6%) in \`batch_release.csv\` are defaulted to 02:10:00 snapshot boundaries shown in \`source_freshness.csv\`, distorting intraday cycle calculations.

**“Discard the extract as corrupt”:** rejected because duration arithmetic is valid and monotonic; the limitation is semantic alignment with the SOP clock in \`qc_release_sop.md\` rather than data corruption.

**“Immediate dashboard release is safe”:** rejected because unmodeled evidence timestamps, right-censoring of 42 HOLD rows, and snapshot defaults produce misleading management metrics.`
  ];

  const whatWouldChangeVariants = [
    `| Material unknown | Evidence needed to resolve it | How that evidence would change my decision |
| --- | --- | --- |
| The true “required evidence available” timestamp | \`evidence_available_ts\` or a validated field mapping for 5–10 batches | A reliable field would permit the SOP KPI; if it cannot be reconstructed, the KPI remains unavailable. |
| Whether 02:10 is a real disposition time or extract default | Live QCore audit for a sample of the 185 stamped rows | Different live times would disqualify the extract timestamp; matching times would support its use. |
| How long unfinished work ultimately takes | Follow the 42 HOLD rows to disposition or use survival/right-censoring analysis | Long eventual durations would confirm downward bias and block launch; results within target would support a scoped KPI. |
| Whether COA statuses are stale or real control gaps | Same-day CertVault/QCore reconciliation per \`source_freshness.csv\` | Portal evidence would support a freshness explanation; genuinely missing evidence on released rows would trigger control escalation. |

**Premise Test and Right-Censoring:** Completed-only cycle time excludes all 42 unfinished HOLD rows in \`batch_release.csv\`. Because those rows remain in the queue and are likely to become the slowest observations, omitting them creates downward right-censoring and survivorship bias; resolving actual durations for these 42 rows would change the decision on whether the queue meets target service standards.

**Next Verification Step:** Do one read-only validation of 5–10 02:10-stamped batches in live QCore and CertVault before building a dashboard; seeing authentic timestamps would resolve whether the release clock is accurate or an extract artifact.`,
    `| Material unknown | Evidence needed to resolve it | How that evidence would change my decision |
| --- | --- | --- |
| Required evidence availability timestamp | Live QCore timestamp audit capturing true certificate upload times | Valid evidence timestamps allow computing the SOP KPI; unresolvable timestamps require redefining the metric. |
| True disposition time of 02:10 batches | Read-only live audit of 10 batches with 02:10:00 extract timestamps | Varying true times confirms snapshot artifact; identical times validates timestamp reliability. |
| Final duration of open HOLD batches | Survival tracking of the 42 currently open HOLD rows in \`batch_release.csv\` to completion | Extended hold times confirms queue survivorship bias; quick clearance supports routine metrics. |

**Premise Test and Right-Censoring:** Measuring cycle times only on completed rows introduces downward survivorship bias by omitting the 42 still-open HOLD rows received in late July. Reconciling final dispositions across these open batches would change my decision on overall queue health.

**Next Verification Step:** Execute a targeted read-only spot-check of 5–10 batches in live QCore and CertVault; obtaining verified upload timestamps would resolve the true start of the release clock before building any report.`
  ];

  const answer = [
    '## Judgment',
    pick(rng, judgmentVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    pick(rng, assessmentVariants),
    '',
    '## Rejected Hypotheses',
    pick(rng, rejectedVariants),
    '',
    '## What Would Change the Decision',
    pick(rng, whatWouldChangeVariants)
  ].join('\n');

  return {
    type: 'solved',
    variant: `Ultra-Advanced Calibrated Note (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Case 4A diagnostic note: 70.6% snapshot artifact at 02:10, SOP evidence-clock reframing, right-censoring on 42 HOLD rows, routine 5.5h cycle subset, strictly compliant with official requirements.'
  };
}
