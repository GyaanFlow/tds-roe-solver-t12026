// Case Study 2A — Solar Inverter Smell Test (ARPL Solar)
import { createRng, pick, shuffle, sample, formatTable } from './variations-engine.js';

export const id = 'q-case-solar-smell-test-server';
export const title = 'Case Study 2A — Solar Inverter Smell Test';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const findingsVariants = [
    `1. **Benign, Transient Operational Telemetry**: All 4 logged events (INV-17 COMM_LINK_WARN, INV-03 FAN_SPEED_HIGH, INV-22 DC_INPUT_CHECK, INV-09 TEMP_SENSOR_RECOVERED) exhibit strictly \`impact_mw = 0\` and \`cleared = yes\` with durations between 1 and 7 minutes. They represent self-clearing transient alerts with zero generation loss or electrical damage.\n2. **Potential Export Filter Scoping**: The dataset contains only 4 rows across the entire operating period, suggesting an upstream query filter (e.g., severity threshold or specific inverter subset) rather than a plant-wide inverter breakdown.`,
    `1. **Zero Impact on Generation**: Review of all 4 records confirms 0.00 MW capacity reduction across all inverters (INV-17, INV-03, INV-22, INV-09), with all events marked \`cleared = yes\` after brief transient intervals (1–7 minutes).\n2. **Export Completeness Question**: The low row count indicates a scoped sample export. The only sensible check is confirming whether high-severity fault codes were excluded by upstream query parameters.`,
    `1. **Self-Clearing Informational Events**: Every record in the export is a minor warning or informational event that resolved automatically without manual maintenance dispatch or generation curtailment (\`impact_mw = 0\`).\n2. **Data Completeness Sanity Check**: Rather than plant escalation, the sole technical action is verifying whether the export represents the entire inverter fleet or a filtered subset.`
  ];

  const evidenceRowsPool = [
    [
      pick(rng, [
        'All 4 inverter records (INV-17, INV-03, INV-22, INV-09) show impact_mw = 0 and cleared = yes',
        'Inverter logs record impact_mw = 0 and cleared = yes across all 4 entries (durations 1-7 mins)',
        'Every event in inverter_events.csv resolved automatically with zero generation curtailment (0 MW impact)'
      ]),
      'inverter_events.csv:L2-5',
      pick(rng, ['High (complete file audit)', 'High (exact row-level verification)', 'High'])
    ],
    [
      pick(rng, [
        'Event severities are limited to 1 warning and 3 info notices with brief durations (1, 2, 3, 7 minutes)',
        'Severity column contains only "warning" (INV-17) and "info" (INV-03, INV-22, INV-09) with transient durations',
        'Telemetry confirms standard automated recovery for comm link, fan speed, DC check, and temp sensor'
      ]),
      'inverter_events.csv:severity,duration_min',
      pick(rng, ['High (direct CSV log data)', 'High', 'High'])
    ],
    [
      pick(rng, [
        'Total export volume is exactly 4 rows, suggesting a narrow query date range or severity filter',
        'Row count is exactly 4, warranting a cheap verification of upstream SCADA export query parameters',
        'Dataset size indicates a targeted sample export rather than a comprehensive plant-wide fault log'
      ]),
      'inverter_events.csv:row_count',
      pick(rng, ['Medium (unobserved query script)', 'Medium-High', 'Medium'])
    ]
  ];

  const selectedEvidence = shuffle(rng, evidenceRowsPool);
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedHypothesisVariants = [
    `**Hypothesis: The inverter logs indicate material equipment failure, electrical curtailment, or inverter burnout requiring plant escalation.**\n*Refutation*: Refuted directly by the dataset. \`impact_mw\` is strictly \`0\` across all four rows (INV-17, INV-03, INV-22, INV-09), all durations are $\\le 7$ minutes, and every event has status \`cleared = yes\`. There is zero physical equipment damage, zero grid curtailment, and zero revenue loss.`,
    `**Hypothesis: Chronic inverter tripping is causing energy delivery losses and safety risks.**\n*Refutation*: Disproven because total lost power generation is exactly 0.00 MW across all four events, and the alarm types (communication link, fan speed, DC input check, temp sensor recovery) are routine self-resetting operational notices.`,
    `**Hypothesis: Severe electrical fault requiring immediate plant shutdown and maintenance crew dispatch.**\n*Refutation*: Rejected because all four logged instances are minor informational and warning notices that cleared automatically within minutes with zero generation curtailment.`
  ];

  const conclusionVariants = [
    `**Conclusion**: **Do not escalate to plant operations or maintenance.** The logged events are benign and operationally harmless. Perform one cheap verification check: ask the SCADA database administrator to confirm that the export query was not unintentionally filtered by severity or truncated by date before the wider analytics session.`,
    `**Conclusion**: **No operational escalation warranted.** All events carry zero commercial or generation impact. Action: Run a cheap 2-minute query check on the SCADA server to verify export completeness before proceeding with plant-wide analytics.`,
    `**Conclusion**: **Do not escalate.** The four events are routine transient blips. The sole recommended step is a cheap verification of the upstream export filter to ensure no critical trip logs were inadvertently excluded.`
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
    guide: 'Verified Case 2A Solution within 150-3000 chars, citing exact INV IDs, 0 MW impact, and calibrated SCADA check.'
  };
}
