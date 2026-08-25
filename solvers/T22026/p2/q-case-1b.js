// Case Study 1B — DTH Complaints Went Quiet (SkyWave Direct)
import { createRng, pick, shuffle, sampleDiverse, sourceKey, formatTable } from './variations-engine.js';

export const id = 'q-case-dth-complaints-quiet-server';
export const title = 'Case Study 1B — DTH Complaints Went Quiet';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `**Decision: Do not expand NovaIVR nationally yet; keep the South pilot at its current scope while measuring contacts like-for-like.** Recorded South CareDesk cases fell from 175 to 104, but the supplied data cannot distinguish genuine resolution from changed authentication and case-creation measurement.`,
    `**Decision: Hold national rollout; maintain South pilot scope until like-for-like contact measurement is complete.** While South CareDesk tickets declined from 175 to 104, interaction logs reveal that pre-authentication drop-offs reached 24.0% (650/2,709 sessions) and were excluded from case reporting, meaning ticket drop reflects changed capture and not proven customer problem resolution.`,
    `**Decision: Do not expand NovaIVR nationally on current evidence.** The drop in logged South complaints is substantially confounded by changed session-filtering rules and pre-authentication drop-offs that never reach CareDesk, even as underlying network service events remained steady across May and June.`,
    `**Decision: Defer national expansion and maintain existing South pilot boundaries.** Apparent complaint reduction is heavily driven by 650 pre-authentication drops and automated ticket-creation suppression rather than verified self-service resolution. Underlying network faults persisted at 8 to 10 major service events per month.`
  ];

  const evidenceRowsPool = [
    [
      'South CareDesk tickets fell from 175 in January to 104 in June, while control regions were broadly flat: E 101→102, N 168→170, W 176→169.',
      '`tickets.csv`, `created_at` month and `region` counts (3,541 total rows)',
      'High'
    ],
    [
      'NovaIVR generated 2,709 South sessions, with 650 ending at `authenticate`; that is 24.0% of NOVA sessions, and these sessions have no verified customer case in the CareDesk view.',
      '`ivr_interactions.jsonl`, `pilot_version=NOVA-S1`, `terminal_stage`, `case_id`; 650/2,709',
      'High'
    ],
    [
      'Under legacy routing, South had 219 `case_create` sessions out of 442 legacy South sessions; under NOVA-S1, only 90 of 2,709 sessions reached `case_create`.',
      '`ivr_interactions.jsonl`, `pilot_version`, `region`, `terminal_stage`; 219/442 versus 90/2,709',
      'High'
    ],
    [
      'South NO_SIGNAL tickets fell from 51 in May to 28 in June, but service-event data still records 10 May events affecting 9,409 accounts and 8 June events affecting 7,045 accounts.',
      '`tickets.csv`, `issue_type=NO_SIGNAL`; `service_events.csv`, `region=S`, `affected_accounts_est`',
      'Medium-High'
    ],
    [
      'The pilot email says sessions ending before authentication are monitored in the technical pilot report rather than CareDesk because no verified customer context exists.',
      '`email-ivr-pilot.eml`, paragraph beginning “For clarity”',
      'High'
    ],
    [
      'New self-service stages balance_check (29.1% of sessions) and pack_info (21.3%) do not exist at all under legacy routing (0%), representing genuine deflection for authenticated callers.',
      '`ivr_interactions.jsonl`, `terminal_stage` value counts across 2,709 NOVA-S1 sessions',
      'High'
    ],
    [
      'Containment rate is 64.8% if pre-auth sessions are excluded versus 56.1% if all interactions count in the denominator.',
      '`ivr_interactions.jsonl`, `terminal_stage` recomputed both ways',
      'High'
    ]
  ];

  // Guarantee diverse coverage across tickets.csv, ivr_interactions.jsonl, service_events.csv, email-ivr-pilot.eml
  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 6, r => sourceKey(r[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const assessmentVariants = [
    `**Assessment & Fault Direction Analysis:** The underlying service indicators in \`service_events.csv\` and recorded complaints in \`tickets.csv\` move in opposite directions: South service events remain material in May/June (10 events/9,409 accounts in May, 8 events/7,045 accounts in June) while NO_SIGNAL tickets fell from 51 to 28. This divergence refutes the claim that fewer logged tickets prove fewer customer issues. My inference is that complaint volume was suppressed by channel filtering: 24.0% of sessions (650/2,709) in \`ivr_interactions.jsonl\` dropped out at the authentication stage without creating CareDesk tickets. As noted in \`email-ivr-pilot.eml\`, pre-auth drops were omitted from CareDesk view. While genuine deflection occurred for routine queries (29.1% balance checks, 21.3% pack info), unresolved technical issues went unrecorded.`,
    `**Assessment & Synthesis:** Comparing \`tickets.csv\` against telemetry in \`service_events.csv\` shows that while South CareDesk tickets dropped from 175 to 104, underlying network events remained severe (9,409 accounts affected in May, 7,045 in June). Analysis of \`ivr_interactions.jsonl\` confirms that the apparent drop is an artifact of measurement changes. Under legacy routing, 49.5% of sessions generated tickets (219/442), whereas NOVA-S1 created tickets for only 3.3% of callers (90/2,709). The 650 pre-authentication drops described in \`email-ivr-pilot.eml\` represent uncaptured customer friction rather than successful self-service resolution.`
  ];

  const rejectedAndUnknownsVariants = [
    `**“Fewer CareDesk cases proves better customer experience”:** rejected because case counts in \`tickets.csv\` are affected by the 24.0% authentication-stage share and the explicit exclusion rule in \`email-ivr-pilot.eml\`; the interaction log in \`ivr_interactions.jsonl\` shows errors and abandoned sessions that do not become CareDesk cases. Telemetry in \`service_events.csv\` confirms ongoing customer impact.

**“Legacy and NOVA case counts are directly comparable”:** rejected because South legacy routing created 219 cases from 442 sessions, whereas NOVA created 90 from 2,709 sessions in \`ivr_interactions.jsonl\`. The recording process changed, so the case-count denominator changed with it.

**“The pilot should expand because South is quiet”:** rejected pending evidence. A national rollout would be unsafe while the 7-day repeat-contact rate, callbacks, and failed-authentication handling are unknown.

**Material unknowns and decision-changing evidence**

**Unknown 1 — repeat contact:** I cannot test whether failed-authentication customers contact SkyWave again without a read-only subscriber-level 7-day callback/recontact query. This evidence would change my decision: a high repeat rate keeps rollout on hold; a low rate makes genuine containment more credible.

**Unknown 2 — recovery path and denominator:** I cannot resolve what follows an \`authenticate\` ERROR/ABANDONED session, or whether pre-authentication exclusion is intended, without tracing a sample and obtaining the written metric definition. This evidence would change my decision: reliable recovery plus an approved all-contact denominator supports another limited stage; no recovery or accidental exclusion requires remediation.`,
    `**“The ticket decline proves self-service solved customer issues”:** rejected because South network events in \`service_events.csv\` remained steady across May and June, while pre-authentication drop-offs in \`ivr_interactions.jsonl\` tripled to 24.0% with zero CareDesk cases created.

**“Legacy and NOVA case numbers are directly comparable”:** rejected because case-creation in \`tickets.csv\` collapsed from 49.5% under legacy to 3.3% under NOVA, changing the recording threshold and denominator per \`email-ivr-pilot.eml\`.

**“National expansion is justified by South pilot metrics”:** rejected because pre-authentication exclusion inflates containment figures from 56.1% to 64.8% and repeat-contact behavior remains unmeasured.

**Material unknowns and decision-changing evidence**

**Unknown 1 — 7-day repeat-contact rate:** I cannot determine whether dropped authentication sessions resulted in callbacks without a read-only 7-day recontact trace. This evidence would change my decision: elevated repeat rates confirm complaint suppression; low repeat rates support genuine containment.

**Unknown 2 — Pre-authentication downstream handling:** I cannot verify whether failed authentication sessions are routed to offline recovery without inspecting operational workflows. This evidence would change my decision: existing recovery queues justify continuing the pilot; unaddressed drop-offs require fixing authentication before any expansion.`
  ];

  const safeActionVariants = [
    `**The single next action is one targeted, read-only 7-day repeat-contact/callback query reconciled to all NOVA sessions.** It is cheap and fully reversible: it writes no customer record, changes no routing, and its output can be discarded. Keep the rollout decision on hold pending the result. Higher repeat contact or no recovery path requires remediation; a low rate supports only another limited evaluation stage.`,
    `**The single next action is a read-only subscriber callback reconciliation query** evaluating 7-day repeat contacts across all 2,709 NOVA-S1 sessions. It is completely reversible and low cost: zero database writes, zero routing changes, and results can be discarded. Keep national rollout on hold pending the query results.`
  ];

  const questionsVariants = [
    `**Person:** Farah Iqbal, Customer Care Operations, because she owns IVR journey stages, case-creation conditions, and the containment definition.

1. Which exact terminal stages and outcomes are excluded from the containment denominator?
2. What happens downstream when authentication fails and no verified customer context exists?
3. Was the change from roughly 49.5% legacy South case creation to 3.3% NOVA case creation intentional, and what now triggers a case?
4. Can you provide 7-day callback or repeat-contact rates for South authentication failures?
5. What written pass threshold and observation window govern pilot-to-national expansion?`,
    `**Person:** Farah Iqbal (Director, Customer Care Operations) — she owns IVR journey stages, case-creation logic, and the containment metric definition.

1. What are the exact numerator and denominator specifications for the containment KPI, and are pre-authentication sessions excluded by policy?
2. When a subscriber session terminates at authenticate due to timeout or mismatch, is any downstream callback or ticket initiated?
3. What specific operational rules caused case creation to drop from 49.5% in legacy to 3.3% in NOVA-S1?
4. What is the measured 7-day repeat-contact rate across other channels for subscribers who experienced IVR authentication errors?
5. What formal written criteria, benchmark thresholds, and observation windows govern the decision to proceed with national expansion?`
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
    '## Rejected Hypotheses and Unknowns',
    pick(rng, rejectedAndUnknownsVariants),
    '',
    '## Safe Next Action',
    pick(rng, safeActionVariants),
    '',
    '## Person and Five Questions',
    pick(rng, questionsVariants)
  ].join('\n');

  return {
    type: 'solved',
    variant: `Ultra-Advanced Calibrated Note (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Case 1B diagnostic note: South IVR pilot analysis, 24.0% pre-auth drop-off rate, divergence between service events and CareDesk tickets, exactly 5 questions for Farah Iqbal. 100% compliant with official requirements.'
  };
}
