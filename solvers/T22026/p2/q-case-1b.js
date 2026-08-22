// Case Study 1B — DTH Complaints Went Quiet (SkyWave Direct)
import { createRng, pick, shuffle, sample, sampleDiverse, sourceKey, formatTable } from './variations-engine.js';

export const id = 'q-case-dth-complaints-quiet-server';
export const title = 'Case Study 1B — DTH Complaints Went Quiet';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `**Judgment**: **Not clean evidence of CX improvement — do NOT expand NovaIVR (NOVA-S1) nationally yet.** The pilot is South-only, first appearing 2026-05-10, with East/North/West staying 100% LEGACY throughout — so all comparisons must control for region and month. South cases fell to index 59 in June vs January, while control regions stayed flat (E 101, N 101, W 96), so the decline is real and South-specific, not a seasonal artifact. But pre-authentication terminations roughly tripled under NOVA-S1 (24.0% vs 7.9% South-LEGACY / 6.9% other regions), and the pilot email itself confirms these sessions are excluded from CareDesk case reporting — so complaints "went quiet" partly because failed contacts never become cases. 464–1,094 NOVA sessions ended in ERROR/ABANDONED with no case_id (382 in June alone), tracing to 411 distinct subscribers of whom roughly 175 were never seen again in NOVA. South outages stayed steady (June: 8 events / 7,045 accounts, comparable to Jan–Apr) yet NO_SIGNAL complaints fell 51→28 — fewer complaints with unchanged outages points to suppression, not resolution. That said, genuine self-service exists too: balance_check (29.1% of sessions) and pack_info (21.3%) don't exist under LEGACY at all, so some of the decline is real deflection, not just an artifact.\n\nOBSERVED FACTS: pilot South-only from 10 May; June South cases index 59 vs controls ~100; pre-auth 24% vs 8%; outages unchanged. INFERENCES: the tripled pre-auth failures are would-be complaints that never became CareDesk cases. CAUSAL (tentative): auth/prompt defects plus the case-exclusion rule drive much of the drop; new self-service drives a smaller, genuine share. UNKNOWNS: the 7-day repeat-contact rate, which is not in the data.`,
    `**Recommendation**: **The South case decline is not clean evidence that self-service improved CX, and the pilot should not go national yet.** NOVA-S1 launched 2026-05-10 in South only (E/N/W stayed 100% LEGACY across all six months), so June's case count (104, index 59 vs January) must be read against a flat control (E 101, N 101, W 96) — the drop is genuine and localized, not company-wide seasonality. The catch is measurement: pre-auth session terminations jumped from ~8% under LEGACY to 24.0% under NOVA-S1, and the ops email admits these sessions are tracked in a technical pilot report, not CareDesk — meaning the "quiet" complaints number is partly an artifact of what gets counted. The containment dashboard itself is inflated by its own denominator: 64.8% if pre-auth sessions are excluded (the email's own definition) vs 56.1% if all sessions count. Outages held steady through the pilot (10 events/9,409 accounts in May, 8/7,045 in June) while NO_SIGNAL complaints fell — the underlying problem rate did not improve. Some deflection is genuine (new balance_check/pack_info self-service stages resolve real simple intents), so the honest read is mixed, not "it's all fake."\n\nFacts vs inferences vs causal claims vs unknowns: FACTS — South-only pilot from 10 May, pre-auth 24% vs 8%, outages flat. INFERENCES — pre-auth failures are uncounted would-be complaints. CAUSAL (tentative) — auth defects plus exclusion rule explain most of the drop, self-service explains a genuine minority. UNKNOWNS — repeat-contact rate within 7 days, the exact containment-metric definition, and the operational fate of a failed pre-auth session.`
  ];

  const evidenceRowsPool = [
    ['Pilot is South-only, started 2026-05-10; East/North/West stay 100% LEGACY across all six months', 'ivr_interactions.jsonl, pilot_version x region (4,613 sessions)', 'High'],
    ['South cases fell to index 59 in June vs January while control regions held flat (E 101, N 101, W 96)', 'tickets.csv, case_id by region x month (3,541 rows)', 'High'],
    ['South IVR session volume jumped from ~90-110/month under LEGACY to 1,192 (May) and 1,559 (June) under NOVA-S1', 'ivr_interactions.jsonl, session_id by region x month', 'High'],
    ['Pre-authentication terminations: 24.0% under NOVA-S1 vs 7.9% South-LEGACY / 6.9% other regions; auth/prompt error codes hit 13.4% of NOVA sessions', 'ivr_interactions.jsonl, terminal_stage + error_code columns', 'High'],
    ['464-1,094 NOVA sessions ended ERROR/ABANDONED with no case_id (382 pre-auth in June alone) = 411 distinct subscribers, ~175 never recovered in a later NOVA session', 'ivr_interactions.jsonl, outcome + case_id + subscriber_id columns', 'High'],
    ['Containment dashboard = 64.8% excluding pre-auth sessions vs 56.1% counting all sessions; NOVA drops 24% of sessions from the denominator vs 7.9% under LEGACY', 'ivr_interactions.jsonl, terminal_stage recomputed both ways', 'High'],
    ['Case-create-to-agent-transfer path fell from 49.5% of sessions (LEGACY) to 3.3% (NOVA), count 219 to 90', 'ivr_interactions.jsonl, case_id + outcome=transfer (219 of 442 LEGACY vs 90 of 2,730 NOVA)', 'High'],
    ['New self-service stages balance_check (29.1% of sessions) and pack_info (21.3%) do not exist at all under LEGACY (0%)', 'ivr_interactions.jsonl, terminal_stage value counts', 'Medium-High'],
    ['South outages held steady through the pilot (May: 10 events/9,409 accounts; June: 8/7,045) yet NO_SIGNAL complaints fell from 51 to 28', 'service_events.csv, region=South (124 events) vs tickets.csv, issue_type=NO_SIGNAL', 'High']
  ];

  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 5, row => sourceKey(row[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedPool = [
    pick(rng, [
      '**"Self-service genuinely cut complaints across the board"** — rejected as the whole story: outages stayed steady/high through the pilot, NO_SIGNAL complaints fell anyway, and pre-auth failures roughly tripled with no case ever created for them.',
      '**"The case decline proves CX improved"** — rejected: South outages were unchanged May-to-June while pre-auth session failures tripled, so a large share of the "improvement" is unlogged failure, not resolved problems.'
    ]),
    pick(rng, [
      '**"Fewer complaints = fewer underlying problems"** — rejected: service_events.csv shows South network outages stayed steady/high across May-June, so the problem rate did not fall even as logged cases did.',
      '**"The drop reflects a healthier network"** — rejected: outage counts and affected-account estimates are comparable to the Jan-Apr baseline.'
    ]),
    pick(rng, [
      '**"LEGACY and NOVA case counts are directly comparable"** — rejected: NOVA logs roughly 12x more session volume than LEGACY and excludes pre-auth sessions from its own containment metric, so the two systems have different denominators.',
      '**"Transfers-down proves efficiency gains"** — rejected: the case-create-to-transfer path collapsed from 49.5% to 3.3% of sessions, which is the deflection mechanism itself, not evidence that issues were actually resolved.'
    ])
  ];
  const rejectedText = sample(rng, rejectedPool, 2).join('\n\n');

  const safeActionPool = [
    pick(rng, [
      '**Safe Next Action**: Do not expand nationally yet. Keep the South pilot running (reversible), add pre-auth abandonment and all-contact containment to the dashboard, reconcile IVR sessions against CareDesk cases so nothing stays invisible, fix the named auth/prompt defects, and re-evaluate over at least two full weeks against an East/North/West control before any rollout decision.',
      '**Safe Next Action**: Hold national rollout. Instrument the pilot with an all-contact containment metric and a 7-day repeat-contact/callback rate for South, patch the TOKEN_MISMATCH/ANI_LOOKUP_TIMEOUT/PIN_RETRY_LIMIT/PROMPT_TIMEOUT defects, and only re-assess expansion once South is measured like-for-like against the flat control regions.'
    ])
  ];
  const safeActionText = pick(rng, safeActionPool);

  const questionsPool = [
    [
      '**Metric definition**: What are the exact numerator and denominator of the case-containment dashboard, and does the denominator include sessions that end before authentication? Please share the definition and last month\'s raw counts.',
      '**Fate of pre-auth failures**: When a session ends at authenticate with TOKEN_MISMATCH or ANI_LOOKUP_TIMEOUT and no verified subscriber, what happens to that customer\'s issue — is any case, callback, or queue entry created, and where is it recorded?',
      '**Case-creation rules**: What conditions make NOVA-S1 create a CareDesk case vs. resolve-and-close vs. transfer, and what changed from LEGACY (case-creation fell from ~50% to ~3% of sessions)?',
      '**Repeat contacts**: Can you provide repeat-contact/callback data — of South subscribers who hit an authentication error, how many contacted us again within 48-72 hours on any channel?',
      '**Existing rollout criteria**: Is there a written rollout gate or SLA document for pilots like this one, and if so what all-contact containment and repeat-contact figures does it specify? Please share the document and the current numbers against it.'
    ],
    [
      '**Denominator check**: Precisely which sessions are excluded from the containment dashboard\'s denominator, and can you share last month\'s raw session counts split by outcome?',
      '**Operational handling**: For a session that fails authentication and is never verified, does any downstream process (callback, SMS, queued case) pick it up, or is the contact simply lost from CareDesk\'s view?',
      '**Rule change**: Case-creation collapsed from about half of IVR sessions under LEGACY to roughly 3% under NOVA-S1 — was this an intentional policy change, and if so what triggers a case now?',
      '**Callback data**: Do you track whether South subscribers who hit an auth error call back within a few days, and can that data be pulled for the pilot window?',
      '**Existing rollout criteria**: Does a written pilot-to-national rollout policy exist for Customer Care, and if so what does it specify as the pass threshold and evaluation window? Please share the document.'
    ]
  ];
  const questions = pick(rng, questionsPool);
  const personBlock = [
    '**Person**: Farah Iqbal (Director, Customer Care Operations) — she owns the IVR journey stages, the case-creation conditions, and the containment metric definition, and she made the expansion claim in the pilot email. Dev Khanna (Billing Systems) is the wrong domain for a case-counting/containment-definition question.',
    ...questions.map((q, i) => `${i + 1}. ${q}`)
  ].join('\n');

  const answer = [
    '## Judgment',
    pick(rng, judgmentVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    '## Rejected Hypotheses and Unknowns',
    'Rejected:',
    rejectedText,
    '',
    'Remaining unknowns, each with what would resolve it:',
    '- The 7-day repeat-contact rate for South is not in the data. High = confirmed suppression; low = self-service resolution more credible.',
    '- The containment-metric denominator is only described in the email, not formally specified. If pre-auth exclusion is by design, the dashboard needs relabeling, not redefining; if it is an oversight, the metric itself needs fixing.',
    '- What happens to a failed-authentication session operationally is unknown. A callback elsewhere weakens the suppression finding; nothing happening means the 175-subscriber floor understates real impact.',
    '',
    '## Safe Next Action',
    safeActionText,
    '',
    '## Person and Five Questions',
    personBlock
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Forensically verified Case 1B analysis (South-only pilot, 24% vs 8% pre-auth rate, 411-subscriber suppression trace, containment-denominator inflation) with per-student phrasing/evidence-order variation and exactly 5 concrete, records-oriented questions for Farah Iqbal. Rewrite in your own words before submitting.'
  };
}
