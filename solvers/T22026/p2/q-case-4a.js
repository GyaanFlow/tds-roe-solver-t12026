// Case Study 4A — QC Queue Smell Test (Aurelia Consumer Products)
import { createRng, pick, sample, sampleDiverse, sourceKey, formatTable } from './variations-engine.js';

export const id = 'q-case-consumer-qc-queue-server';
export const title = 'Case Study 4A — QC Queue Smell Test';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `Yes — it smells, and I would verify before using the apparent cycle time as a KPI. The "about a day and a half" figure is not safe: it depends on three unpinned choices, and the same extract yields anywhere from ~5 h to ~45 h.\n1) Wrong clock: receipt-to-release averages 45.5 h, but the SOP measures from "evidence available" to disposition, where the median is ~21.3 h.\n2) Snapshot artifact: 70.6% of \`qcore_release_ts\` values are stamped at exactly 02:10:00 — the QCore daily-snapshot time — so the intraday duration is fabricated for most rows. Excluding them, the median evidence-to-release falls to 8.4 h.\n3) Exceptions included: 27.9% of rows are complex exceptions the SOP excludes; on the routine rows that actually carry a completed cycle time (n=23), the median is ~5.5 h and 95.7% clear 24 h — the genuine process is fast, and the slow headline is an artifact.\n4) Survivorship: the 42 open-HOLD batches are all the most recent week of receipts (on or after 24 Jul) and are, by definition, the slowest-so-far — they have not finished yet. Excluding them biases any cycle-time average downward (optimistic), and the current backlog (~$6.6M shortage exposure sitting in HOLD) stays invisible to the metric.\n**Reversible next step (do this, not a KPI launch): pull the true disposition timestamp from live QCore for 5-10 batches whose extract time is 02:10:00 — a read-only spot-check, nothing is changed or committed.** If they vary in QCore but are all 02:10 here, the timestamp is a snapshot default and the KPI is invalid until redefined.`,
    `Yes, this smells and should not become a dashboard KPI without one cheap check first. Operations' "day and a half" only holds on the receipt-to-release clock (mean 45.5 h); the SOP's own definition (evidence-available to disposition) runs mean 26.9 h / median 21.3 h — already a different number before touching data quality. The bigger problem is that 185 of 262 rows (70.6%) have \`qcore_release_ts\` stamped at exactly 02:10:00, matching QCore's daily-snapshot boundary — meaning most "release times" are a date defaulted to a fixed time, not a real disposition moment; dropping those rows pulls the median evidence-to-release down to 8.4 h. Separately, 73 of 262 rows (27.9%) are complex exceptions the SOP explicitly excludes from the routine target, and of the genuinely routine rows that have completed (n=23), the median cycle time is just 5.5 h with 22/23 inside 24 h. Finally, all 42 open-HOLD rows were received on or after 24 July while every dispositioned row was received on or before 20 July — so the metric is right-censored: rows still in the queue are necessarily the slowest-so-far, and excluding them biases any cycle-time average downward (optimistic), on top of hiding the roughly $6.6M in shortage-exposure value sitting in that newest week. **Reversible next step (do this, not a KPI launch): confirm in live QCore whether a handful of the 02:10:00-stamped batches actually disposed at different real times** — a read-only check that commits nothing.`
  ];

  const evidenceRowsPool = [
    ['Cycle time depends on the clock chosen: receipt-to-release 45.5 h mean vs SOP\'s evidence-to-release 26.9 h mean / 21.3 h median', 'batch_release.csv, receipt_ts/lab_complete_ts/qcore_release_ts columns (262 rows) + qc_release_sop.md, target-definition clause', 'High'],
    ['185 of 262 rows (70.6%) have qcore_release_ts stamped at exactly 02:10:00, matching QCore\'s daily-snapshot time', 'batch_release.csv, qcore_release_ts column (185 of 262 rows) + source_freshness.csv, QCore snapshot-time row', 'High'],
    ['Excluding the 02:10:00 rows, median evidence-to-release drops from 21.3 h to 8.4 h', 'batch_release.csv, recomputed with qcore_release_ts=02:10:00 rows filtered out', 'High'],
    ['73 of 262 rows (27.9%) are complex exceptions the SOP excludes from the routine target; on the 23 routine rows with a completed cycle time, median is 5.5 h and 22/23 (95.7%) land within 24 h', 'batch_release.csv, open_deviation/market_spec_override/coa_status columns (73 of 262 rows) + qc_release_sop.md, exclusion clause', 'High'],
    ['All 42 HOLD rows have a null qcore_release_ts (open, no cycle time exists yet)', 'batch_release.csv, disposition="HOLD" + qcore_release_ts (null) columns, 42 of 262 rows', 'High'],
    ['All 42 HOLD rows were received on or after 2026-07-24; all 220 dispositioned rows were received on or before 2026-07-20 — the metric is right-censored and blind to roughly $6.6M in shortage-exposure value sitting in the newest week', 'batch_release.csv, receipt_ts column, HOLD (42 rows) vs dispositioned (220 rows)', 'High'],
    ['17 RELEASED rows show COA MISSING and 13 show INDEX_PENDING — plausibly CertVault\'s nightly-index lag rather than a genuine control gap', 'batch_release.csv, coa_status column (30 of 262 rows) + source_freshness.csv, CertVault refresh-cadence row', 'Medium'],
    ['LabTrack is described as a "48 h analytics extract, not live" while QCore snapshots daily at 02:10 — mismatched refresh cadences contaminate any delta between the two', 'source_freshness.csv, LabTrack + QCore rows', 'High']
  ];
  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 6, row => sourceKey(row[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedPool = [
    '"1.5 days is a real, trustworthy cycle time" — rejected: it only appears on the non-SOP receipt clock, and 70.6% of the release timestamps it relies on are a daily-snapshot artifact, not real disposition times.',
    '"The data is broken, discard it" — rejected: the arithmetic is clean (zero negative durations, zero lab-complete-before-receipt, no nulls in receipt/lab timestamps); the issue is what the timestamps mean, not data corruption, so verify rather than discard.',
    '"COA MISSING proves batches were released without certificates" — rejected as proven: more consistent with CertVault\'s nightly-index lag than a genuine control breach; needs a live-portal check before alleging a compliance issue.',
    '"Just report the mean and move on" — rejected: the distribution is skewed and contaminated by the snapshot artifact (mean 26.9 h vs median 21.3 h vs cleaned 5.5 h); a single mean hides the trap entirely.'
  ];
  const rejectedText = sample(rng, rejectedPool, 3).join('\n\n');

  const changeDecisionPool = [
    'The data-catalog definition of qcore_release_ts (does 02:10 mean "released that day" or a real disposition time?) is decisive. A live-QCore spot-check of a handful of 02:10:00 batches, confirming whether their true disposition times actually vary, would settle whether the extract time is a snapshot default. Beyond that, an agreed metric definition — evidence-to-disposition, RELEASED rows only, open exceptions excluded — plus a fresher, source-aligned extract, would let the KPI ship safely.',
    'A live-QCore check on 5-10 of the 02:10:00-stamped batches would decide this outright: if their real disposition times differ while the extract shows the same default, the current timestamp field cannot support a cycle-time KPI. Beyond that check, pinning the metric definition (which clock, which dispositions count, whether open exceptions are excluded) and refreshing the extract to reduce the LabTrack/QCore lag mismatch would make the number trustworthy.'
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
    guide: 'Forensically verified Case 4A analysis (70.6% snapshot-boundary artifact, wrong-clock trap, 27.9% excluded-exception contamination, right-censored HOLD backlog with ~$6.6M shortage exposure) with per-student phrasing/evidence-order variation. Rewrite in your own words before submitting.'
  };
}
