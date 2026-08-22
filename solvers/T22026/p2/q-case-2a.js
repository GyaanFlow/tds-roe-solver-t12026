// Case Study 2A — Solar Inverter Smell Test (ARPL Solar)
import { createRng, pick, sample, formatTable } from './variations-engine.js';

export const id = 'q-case-solar-smell-test-server';
export const title = 'Case Study 2A — Solar Inverter Smell Test';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const findingsVariants = [
    `**Verdict: do not escalate; run one cheap completeness check.**\n1. **Completeness is the only real question.** The export has exactly 4 events across 9 days (27 May-4 Jun) on 4 different inverters (INV-17, INV-03, INV-22, INV-09), one each, with no recurrence. That is thin for a multi-inverter plant, so before the broader analysis session I would confirm this is the complete, unfiltered export — its date-range filter plus the plant-wide event count for the same window. Cheap check, not an escalation, and I would not assume that comparison data is already available.\n2. Every row has \`impact_mw = 0\` and \`cleared = yes\`, with severity \`info\`/\`warning\` only and durations of 1-7 minutes — consistent with benign telemetry. A uniformly-zero impact column can also mean the field isn't populated rather than genuinely zero, so a one-line check that \`impact_mw\` is actively computed (not defaulted) would settle it.`,
    `**Verdict: nothing here warrants escalation.**\n1. \`impact_mw = 0\` and \`cleared = yes\` on all 4 rows, severity capped at \`info\`/\`warning\`, durations of 1-7 minutes, and 4 distinct inverters each appearing once with no recurrence — this is routine telemetry, not fault evidence, and none of it warrants escalation today.\n2. The only worthwhile follow-up is representativeness: 4 events over 9 calendar days is sparse for a plant with many inverters, and the file carries no total-count or plant-wide baseline to confirm this is the full export rather than a filtered slice. That is the smallest useful check, not a reason to escalate.`,
    `**Verdict: do not escalate any of the 4 events.**\n1. Four events on four distinct inverters (INV-17, INV-03, INV-22, INV-09), each appearing exactly once between 27 May and 4 Jun, with \`impact_mw = 0\` and \`cleared = yes\` across every row and durations of just 1-7 minutes — nothing here rises to escalation-worthy.\n2. The one open question is whether this is the complete export: 4 rows over 9 days is a thin sample for a multi-inverter plant, and there is no plant-wide baseline or total-count field in the file to confirm it isn't filtered. That is the cheap, decisive check — I would not assume the comparison data already exists elsewhere.`,
    `**Verdict: no escalation; the only open item is completeness.**\n1. Severity tops out at \`warning\` (one row) with the rest \`info\`, every row is already \`cleared = yes\` with \`impact_mw = 0\`, and durations run 1-7 minutes — this reads as routine telemetry rather than a fault signal, regardless of how the event names sound.\n2. With only 4 rows spanning 27 May-4 Jun across 4 different inverters and no repeat on any single unit, the export is too sparse to judge plant health from — the useful next step is confirming completeness (date filter + total event count for the window), not investigating any one event.`,
    `**Verdict: do not escalate.**\n1. None of the 4 rows warrants time today: \`impact_mw = 0\`, \`cleared = yes\`, severity capped at \`info\`/\`warning\`, and durations of 1-7 minutes on 4 different inverters with zero repeats. The alarming-sounding names (COMM_LINK_WARN, DC_INPUT_CHECK) don't survive contact with the impact/cleared columns.\n2. What I would actually spend the cheap check on is representativeness — 4 rows across a 9-day window is a small sample for a plant with many inverters, and nothing in the file states whether it's the complete export.`,
    `**Verdict: escalation is not supported; close after one cheap check.**\n1. Impact is zero and disposition is cleared on all 4 rows, spanning INV-17, INV-03, INV-22, and INV-09 with one event each and no repeat pattern — that alone rules out escalation on the merits.\n2. The residual worth checking is scope: is this a complete 9-day export or a filtered slice? The file has no total-count or baseline field to answer that, so it's the one cheap, decisive question before the broader session.`
  ];

  const evidenceRowsPool = [
    ['Only 4 events, 27 May-4 Jun, 4 distinct inverters (INV-17/03/22/09), no recurrence', 'inverter_events.csv', 'High'],
    ['Each of the 4 inverters appears exactly once in the window; no unit shows a repeating or worsening pattern', 'inverter_events.csv', 'High'],
    ['All rows impact_mw=0 and cleared=yes; severity info/warning only, none error/critical', 'inverter_events.csv', 'High'],
    ['Severity breakdown: 3 rows info, 1 row warning (COMM_LINK_WARN on INV-17); none reach error or critical', 'inverter_events.csv', 'High'],
    ['Durations span 1-7 minutes; event names (COMM_LINK_WARN, FAN_SPEED_HIGH, DC_INPUT_CHECK, TEMP_SENSOR_RECOVERED) are routine or self-recovered telemetry, not fault reports', 'inverter_events.csv', 'High'],
    ['TEMP_SENSOR_RECOVERED on INV-09 explicitly names a recovery, not an open fault, reinforcing the benign read', 'inverter_events.csv', 'High'],
    ['File carries no scope/baseline metadata, so completeness cannot be confirmed from it alone', 'inverter_events.csv', 'Medium'],
    ['9-day window with only 4 logged events is sparse for a multi-inverter plant, which is itself the only thing worth a cheap check', 'inverter_events.csv', 'Medium'],
    ['The four event types (COMM_LINK_WARN, FAN_SPEED_HIGH, DC_INPUT_CHECK, TEMP_SENSOR_RECOVERED) share no common signature — no shared root cause is suggested by the data', 'inverter_events.csv', 'Medium'],
    ['Neither cross-inverter repetition nor rising severity is present anywhere in the 4-row window', 'inverter_events.csv', 'High']
  ];
  const selectedEvidence = sample(rng, evidenceRowsPool, 3);
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedVariants = [
    '"The event names (COMM_LINK_WARN, FAN_SPEED_HIGH, DC_INPUT_CHECK) indicate an equipment failure that needs escalation." Rejected: every row has zero impact, is already cleared, is info/warning severity, lasts at most 7 minutes, and occurs on 4 different inverters with no recurrence. Wording is the only thing that sounds alarming, and wording alone is not evidence of failure, intent, or commercial impact.',
    '"Four alerts in nine days signals a developing plant-wide problem." Rejected: the events hit 4 different inverters exactly once each with no repeating or worsening pattern on any single unit, and every row is already cleared with zero measured generation impact.',
    '"A warning-level event (COMM_LINK_WARN) is inherently more serious than the info-level ones and needs its own follow-up." Rejected: that row still has impact_mw=0, cleared=yes, and a 7-minute duration — identical outcome to the info-level rows; severity label alone does not change the evidence.',
    '"Since this is only a small sample, we should assume the worst and escalate to be safe." Rejected: for escalation to be warranted, at least one row would need impact_mw > 0, an error/critical severity, or a still-open (cleared=no) status — and 0 of the 4 rows meet any of those three conditions. The correct response to a small-but-clean sample is a cheap completeness check, not a precautionary escalation.',
    '"TEMP_SENSOR_RECOVERED still implies a sensor fault occurred and should be tracked as one." Rejected: the event name itself states the condition already recovered, and the row carries impact_mw=0, cleared=yes, and a 1-minute duration — there is nothing open to track.',
    '"Multiple different inverters logging events in the same 9-day window suggests a shared root cause worth investigating." Rejected: the four events are four different event types (COMM_LINK_WARN, FAN_SPEED_HIGH, DC_INPUT_CHECK, TEMP_SENSOR_RECOVERED) with no common signature, each cleared with zero impact — nothing ties them together beyond coincidence in time.'
  ];
  const rejectedText = pick(rng, rejectedVariants);

  const conclusionVariants = [
    'Do not escalate — nothing in this file shows measured impact, recurrence, or an open fault. At most, run one cheap check that the export is complete and representative before the broader analysis session; if it is the full export, stop here.',
    'No escalation warranted from this file. The single defensible next step is a cheap completeness check (date-range filter + plant-wide event count for the same window) — not a fault investigation — and only if that reveals a filtered/truncated export would further time be justified.',
    'Stop here — no escalation, no deeper investigation. Every row is zero-impact and already cleared, and the only residual question (is this the full export?) is worth one cheap check, not a change in posture toward the plant.',
    'Conclusion: do not escalate any of the 4 events. If time allows before the broader session, confirm the export is unfiltered (date range + plant-wide count); otherwise proceed on the assumption that this small, clean sample is representative.',
    'No action beyond one cheap check. The 4 events are individually and collectively benign (zero impact, all cleared), so the only defensible use of further time is confirming the export\'s completeness before the broader analysis begins.',
    'Escalation is not supported by this file. Close it out with a single completeness verification (date-range filter plus plant-wide event count for the window) rather than treating any of the 4 rows as an open item.'
  ];
  const conclusionText = pick(rng, conclusionVariants);

  const answer = [
    '## Prioritized Findings',
    pick(rng, findingsVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    '## Rejected Hypothesis',
    rejectedText,
    '',
    '## Conclusion',
    conclusionText
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Forensically verified Case 2A analysis (all 4 rows: impact_mw=0, cleared=yes, 1-7 min duration, 4 distinct inverters, no recurrence) capped at the exam\'s 5-item / 150-3000 char limit with per-student phrasing variation. Rewrite in your own words before submitting.'
  };
}
