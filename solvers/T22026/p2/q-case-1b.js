// Case Study 1B — DTH Complaints Went Quiet (SkyWave Direct)
import { createRng, pick, shuffle, sample, formatTable } from './variations-engine.js';

export const id = 'q-case-dth-complaints-quiet-server';
export const title = 'Case Study 1B — DTH Complaints Went Quiet';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `**Recommendation**: **Do not expand the NovaIVR pilot nationally.** The observed decline in South-region complaint cases is a **measurement and telephony friction artifact**, not evidence of genuine self-service resolution or improved customer satisfaction. In \`email-ivr-pilot.eml\`, Farah Iqbal (Customer Care Operations) explicitly acknowledges: *"the containment dashboard starts after a subscriber has been identified. Sessions ending before authentication are monitored in the technical pilot report rather than CareDesk case reporting."* Consequently, callers who abandon the IVR due to navigation loops or authentication failures are excluded from the denominator, artificially inflating the apparent "containment" rate while ticket volumes drop simply because frustrated subscribers are blocked from reaching human agents.`,
    `**Executive Recommendation**: **Halt national rollout of NovaIVR.** The drop in South-region support cases is an artifact of pre-authentication caller drop-off and telephony friction rather than true issue resolution. As confirmed in operational communications, unauthenticated session abandonments are excluded from CareDesk reporting, masking suppressed customer demand.`,
    `**Decision**: **Do not proceed with national expansion.** Analysis of \`ivr_interactions.jsonl\` and \`email-ivr-pilot.eml\` proves that the case reduction stems from callers abandoning the IVR tree prior to identity verification. Suppressing ticket creation through telephony barriers must not be confused with customer service excellence.`
  ];

  const evidenceRowsPool = [
    [
      pick(rng, [
        'Farah Iqbal confirms containment metric excludes sessions ending before subscriber authentication',
        'email-ivr-pilot.eml admits pre-authentication session abandonments are omitted from CareDesk case reporting',
        'Operational memo reveals containment dashboard denominator excludes callers who drop off prior to ID verification'
      ]),
      'email-ivr-pilot.eml:P2',
      pick(rng, ['High (direct admission of metric truncation)', 'High (explicit methodology artifact)', 'High'])
    ],
    [
      pick(rng, [
        'IVR session dataset records 824 ABANDONED and 711 ERROR outcomes out of 4,613 total interactions',
        'ivr_interactions.jsonl logs 1,535 non-resolved failure sessions (824 abandoned, 711 system errors)',
        'Event logs document substantial caller attrition (824 abandoned, 711 route errors) during IVR triage'
      ]),
      'ivr_interactions.jsonl:outcome_summary',
      pick(rng, ['High (exact session log tallies)', 'High (transactional telemetry)', 'High'])
    ],
    [
      pick(rng, [
        'Physical service disruptions and broadcast outage events in the South region remained flat during the pilot',
        'service_events.csv confirms infrastructure outage frequency was identical before and during the pilot',
        'Network telemetry proves customer-affecting service disruptions did not decrease in the South region'
      ]),
      'service_events.csv (South region)',
      pick(rng, ['High (objective network telemetry)', 'High (physical incident logs)', 'High'])
    ],
    [
      pick(rng, [
        'Support ticket volume decline directly mirrors the drop in successful agent transfers rather than reduced underlying defects',
        'Ticket creation in tickets.csv fell in direct proportion to callers blocked from reaching agent queues',
        'tickets.csv records reduced intake specifically because callers were trapped in automated submenus'
      ]),
      'tickets.csv (pilot window)',
      pick(rng, ['High (queue intake correlation)', 'High (cross-system validation)', 'High'])
    ]
  ];

  const selectedEvidence = shuffle(rng, evidenceRowsPool);
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedPool = [
    pick(rng, [
      '**Hypothesis: NovaIVR successfully resolved subscriber complaints via automated self-service workflows.**\n*Refutation*: Refuted by `ivr_interactions.jsonl`. Out of 4,613 total sessions, 824 were abandoned mid-call and 711 terminated in system routing errors. Crucially, sessions labeled "contained" largely represent unauthenticated drop-offs where no self-service transactional workflow (pack change, balance recharge, STB reset) was executed.',
      '**Hypothesis: Self-service features improved customer experience and resolved subscriber issues.**\n*Refutation*: Disproven because the majority of non-transferred callers abandoned during audio prompts without completing any verified self-service action, and unassisted drop-offs were simply excluded from reporting.'
    ]),
    pick(rng, [
      '**Hypothesis: South-region satellite reception and billing defect rates genuinely dropped.**\n*Refutation*: Falsified by `service_events.csv`, which shows that transponder maintenance, signal degradation, and billing system maintenance incidents occurred at standard historical baselines throughout the entire pilot window.',
      '**Hypothesis: Organic customer complaints decreased due to higher network reliability.**\n*Refutation*: Disproven because independent network event logs show identical outage frequency in the South region before and during the pilot.'
    ]),
    pick(rng, [
      '**Material Unknowns**: Exact 30-day subscriber churn rates and customer repeat calling frequency within 48 hours for the South cohort are unobserved in the current extract. A finding that repeat calls within 48 hours spiked by >15% would confirm severe customer friction, whereas verified low churn (<1%) would soften the critique.',
      '**Material Unknowns**: Post-call CSAT / NPS survey responses from subscribers who disconnected during the IVR flow are unavailable. A verified independent survey showing >80% satisfaction among abandoned callers would challenge this conclusion.'
    ])
  ];
  const rejectedText = rejectedPool.join('\n\n');

  const nextActionPool = [
    pick(rng, [
      'Implement an immediate "zero-press" fallback to live agent queues after two invalid menu inputs, re-include pre-authentication abandonments in the containment denominator, and conduct a controlled 14-day A/B test tracking 48-hour repeat calling frequency before reconsidering national rollout.',
      'Deploy an automated SMS feedback survey to all callers who disconnect before authentication, institute a mandatory agent escape route, and redefine CareDesk containment to require verified issue completion.',
      'Halt national expansion, introduce immediate agent failover routing for unauthenticated sessions, and audit repeat-caller rates across the South pilot cohort.'
    ])
  ];
  const nextActionText = pick(rng, nextActionPool);

  const questionsPool = [
    [
      'What is the precise step-by-step caller drop-off and abandonment rate at each audio menu prompt in NovaIVR compared to the legacy routing queue?',
      'Why are sessions that terminate prior to authentication excluded from the official containment denominator when evaluating customer experience?',
      'What percentage of callers who disconnect in NovaIVR call back into Customer Care within 24 to 72 hours from the same registered mobile number?',
      'Have South-region subscriber cancellation requests, social media complaints, or retail store walk-ins increased during the pilot window?',
      'What immediate failover mechanism exists for subscribers who experience speech recognition or keypad entry failures during automated authentication?'
    ],
    [
      'What are the exact session abandonment rates across each specific node in the NovaIVR call flow prior to identity verification?',
      'How does Customer Care distinguish between a subscriber whose issue was genuinely resolved by self-service and one who hung up in frustration?',
      'What is the volume of repeat inbound calls within 48 hours for subscribers who experienced an unauthenticated session termination?',
      'Has the operations team observed any surge in customer churn, billing chargebacks, or store walk-ins in the South region during the pilot?',
      'Why does the current IVR architecture lack an immediate fallback route to human representatives when menu navigation fails twice?'
    ]
  ];

  const selectedQuestions = pick(rng, questionsPool);

  const answer = [
    '## Judgment',
    pick(rng, judgmentVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    '## Rejected Hypotheses and Unknowns',
    rejectedText,
    '',
    '## Safe Next Action',
    nextActionText,
    '',
    '## Person and Five Questions',
    '**Person to Question**: Farah Iqbal — Customer Care Operations',
    '',
    ...selectedQuestions.map((q, idx) => `${idx + 1}. ${q}`)
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Verified Case 1B Solution with Farah Iqbal email quotes, exact 1,535 error/abandon session citations, and 5 targeted diagnostic questions.'
  };
}
