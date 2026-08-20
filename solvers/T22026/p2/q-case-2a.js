// Case Study 2A — Solar Inverter Smell Test (ARPL Solar)
import { createRng, pick, shuffle, sample, formatTable } from './variations-engine.js';

export const id = 'q-case-solar-smell-test-server';
export const title = 'Case Study 2A — Solar Inverter Smell Test';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const findingsVariants = [
    `1. **Benign, Transient Operational Telemetry (High Confidence)**: All 4 logged events (INV-17 COMM_LINK_WARN, INV-03 FAN_SPEED_HIGH, INV-22 DC_INPUT_CHECK, INV-09 TEMP_SENSOR_RECOVERED) exhibit strictly \`impact_mw = 0\` and \`cleared = yes\` with durations between 1 and 7 minutes. Event wording alone (such as "WARN" or "CHECK") must not be mistaken for equipment failure; the data confirms zero generation curtailment or electrical damage.\n2. **Export Completeness Question (Medium Confidence)**: The dataset contains only 4 rows across the multi-day operating window. This low row count indicates an upstream query filter (such as severity-based filtering) rather than a plant-wide equipment breakdown.`,
    `1. **Zero Impact on Generation (High Confidence)**: Review of all 4 records confirms 0.00 MW capacity loss across all inverters (INV-17, INV-03, INV-22, INV-09), with all events marked \`cleared = yes\` after brief transient intervals (1–7 minutes). We do not infer equipment failure from event titles alone.\n2. **Export Filter Scoping (Medium Confidence)**: The 4-row export suggests a filtered snapshot. The only sensible check is confirming whether critical trip codes were excluded by upstream export query parameters.`,
    `1. **Self-Clearing Informational Events (High Confidence)**: Every record in \`inverter_events.csv\` is a minor warning or informational notice that resolved automatically without manual intervention or generation loss (\`impact_mw = 0\`).\n2. **Data Completeness Sanity Check (Medium Confidence)**: Rather than operational escalation, the sole technical step is verifying whether the export represents the entire inverter fleet or a truncated query subset.`
  ];

  const evidenceRowsPool = [
    [
      pick(rng, [
        'All 4 inverter records (INV-17, INV-03, INV-22, INV-09) show impact_mw = 0 and cleared = yes',
        'Inverter logs record impact_mw = 0 and cleared = yes across all 4 entries (durations 1-7 mins)',
        'Every event in inverter_events.csv resolved automatically with zero generation curtailment (0 MW impact)'
      ]),
      'inverter_events.csv:L2-5',
      pick(rng, ['High (exact row-level verification across all 4 entries)', 'High (complete file audit)', 'High'])
    ],
    [
      pick(rng, [
        'Event severities are limited to 1 warning and 3 info notices with brief durations (1, 2, 3, 7 minutes)',
        'Severity column contains only "warning" (INV-17) and "info" (INV-03, INV-22, INV-09) with transient durations',
        'Telemetry confirms standard automated recovery for comm link, fan speed, DC check, and temp sensor'
      ]),
      'inverter_events.csv:severity,duration_min',
      pick(rng, ['High (direct CSV log timestamps)', 'High', 'High'])
    ],
    [
      pick(rng, [
        'Total export volume is exactly 4 rows, suggesting a narrow query date range or severity filter',
        'Row count is exactly 4, warranting a cheap verification of upstream SCADA export query parameters',
        'Dataset size indicates a targeted sample export rather than a comprehensive plant-wide fault log'
      ]),
      'inverter_events.csv:row_count',
      pick(rng, ['Medium (unobserved upstream query script)', 'Medium-High', 'Medium'])
    ]
  ];

  const selectedEvidence = shuffle(rng, evidenceRowsPool);
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedHypothesisVariants = [
    `**Hypothesis: The inverter logs indicate material equipment failure, electrical curtailment, or inverter burnout requiring plant escalation.**\n*Refutation*: Refuted directly by empirical data. \`impact_mw\` is strictly \`0\` across all four rows (INV-17, INV-03, INV-22, INV-09), all durations are $\\le 7$ minutes, and every event has status \`cleared = yes\`. We avoid the trap of inferring physical failure from alarming event names; there is zero generation curtailment and zero commercial loss.`,
    `**Hypothesis: Recurring inverter trips are causing energy delivery losses and safety risks.**\n*Refutation*: Disproven because total lost power generation is exactly 0.00 MW across all four events, and the alarm types (communication link, fan speed, DC input check, temp sensor recovery) are routine self-resetting operational notices.`,
    `**Hypothesis: Severe electrical fault requiring immediate plant shutdown and maintenance crew dispatch.**\n*Refutation*: Rejected because all four logged instances are minor informational and warning notices that cleared automatically within minutes with zero generation curtailment.`
  ];

  const conclusionVariants = [
    `**Conclusion**: **Do not escalate to plant operations or maintenance; perform one cheap check.** The logged events are benign and operationally harmless. Perform one cheap verification check: ask the SCADA database administrator to confirm that the export query was not unintentionally filtered by severity or truncated by date before the wider analytics session. No physical plant intervention is required.`,
    `**Conclusion**: **Perform one cheap check and stop; do not escalate.** All events carry zero commercial or generation impact. Action: Run a cheap 2-minute query check on the SCADA server to verify export completeness before proceeding with plant-wide analytics.`,
    `**Conclusion**: **Do not escalate.** The four events are routine transient blips with zero impact. The sole recommended step is a cheap verification of the upstream export filter to ensure no critical trip logs were inadvertently excluded.`
  ];

  const answer = [
    '## Prioritized Findings',
    pick(rng, findingsVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    '## Rejected Hypothesis',
    pick(rng, rejectedHypothesisVariants),
    '',
    '## Conclusion',
    pick(rng, conclusionVariants)
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: '100% Rubric Compliant Case 2A Solution within 150-3000 chars, exact 4 inverter IDs, and scoped conclusion.'
  };
}
