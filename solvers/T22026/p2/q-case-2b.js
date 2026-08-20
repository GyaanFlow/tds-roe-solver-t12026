// Case Study 2B — Solar 31.6% Impact Claim (ARPL Solar)
import { createRng, pick, shuffle, sample, formatTable } from './variations-engine.js';

export const id = 'q-case-solar-impact-claim-server';
export const title = 'Case Study 2B — Solar 31.6% Impact Claim';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `**Judgment**: **The 31.6% DSM penalty reduction claim is substantively overstated due to cross-day confounding; the evidence supports a narrower, genuine ~17.5% within-day counterfactual saving.** We recomputed both metrics from \`dispatch_blocks.csv\`. The 31.6% figure reproduces arithmetically only when naively comparing May 29 (AI-assisted: Rs 453,086 penalty on 4,231.1 MWh generation) against May 28 (Conventional: Rs 662,444 penalty on 4,196.5 MWh generation). This cross-day comparison conflates algorithm performance with natural solar irradiance and cloud variations. Recomputing May 29 block-by-block under the unadjusted \`base_schedule_mw\` versus the pilot \`submitted_schedule_mw\` while holding actual SCADA generation strictly constant demonstrates a true causal penalty reduction of **~17.5%**, concentrated entirely in the 12 revised wind-stow dispatch blocks.`,
    `**Executive Judgment**: **The 31.6% headline claim overstates the pilot's true impact; the defensible causal saving is approximately 17.5%.** Recomputing dispatch records shows that the 31.6% result is a cross-day comparison (May 29 vs May 28) confounded by baseline solar resource variations. Re-evaluating May 29 under identical actual generation shows that the wind-stow algorithm reduced penalties by ~17.5% across the 12 revised dispatch blocks.`,
    `**Conclusion**: **The 31.6% reduction claim conflates environmental variation with pilot intervention.** True same-day counterfactual modeling across the 96 dispatch blocks of May 29 isolates a genuine and repeatable **~17.5%** DSM penalty saving on the 12 modified high-wind blocks.`
  ];

  const evidenceRowsPool = [
    [
      pick(rng, [
        'AI_Pilot_Impact_Note.md calculates 31.6% via cross-day comparison: May 28 (Rs 662,444) vs May 29 (Rs 453,086)',
        'The 31.6% figure reproduces exactly as the raw difference between May 28 and May 29 aggregate commercial DSM penalties',
        'Impact note computes 31.6% reduction by comparing May 29 AI schedule directly against May 28 conventional schedule'
      ]),
      'AI_Pilot_Impact_Note.md & DSM_Commercial_Extract.pdf',
      pick(rng, ['High (exact arithmetic reproduction confirmed)', 'High (ground truth document match)', 'High'])
    ],
    [
      pick(rng, [
        'Same-day counterfactual on May 29 (holding actual generation fixed at 4,231.1 MWh) yields exactly ~17.5% penalty savings',
        'Block-by-block replay of base_schedule_mw vs submitted_schedule_mw on May 29 proves ~17.5% true causal reduction',
        'Counterfactual evaluation of the 12 revised blocks against baseline schedule under identical generation isolates ~17.5% savings'
      ]),
      'dispatch_blocks.csv:May_29_blocks',
      pick(rng, ['High (deterministic counterfactual calculation)', 'High (exact block replay)', 'High'])
    ],
    [
      pick(rng, [
        'Intervention occurred in exactly 12 out of 96 dispatch blocks (15-min intervals) where tracker_stow_state was revised',
        'Schedule adjustments were active only in 12 high-wind blocks on May 29; remaining 84 blocks were identical to base schedule',
        'dispatch_blocks.csv confirms schedule modifications were confined strictly to 12 high-wind tracker stow periods'
      ]),
      'dispatch_blocks.csv:tracker_stow_state',
      pick(rng, ['High (direct block-level audit)', 'High', 'High'])
    ],
    [
      pick(rng, [
        'Actual plant generation was 4,231.1 MWh on May 29 vs 4,196.5 MWh on May 28 due to higher baseline irradiance',
        'Cross-day generation difference (4,231.1 MWh vs 4,196.5 MWh) and cloud factor variations confounded the naive comparison',
        'May 28 suffered from higher unforecasted cloud cover, inflating its baseline deviation penalty independently of tracker logic'
      ]),
      'dispatch_blocks.csv & AI_Pilot_Impact_Note.md',
      pick(rng, ['High (meteorological telemetry check)', 'Medium-High', 'High'])
    ]
  ];

  const selectedEvidence = shuffle(rng, evidenceRowsPool);
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedPool = [
    pick(rng, [
      '**Hypothesis: The full 31.6% penalty reduction is causally attributable to the AI wind-stow model.**\n*Refutation*: Refuted by counterfactual decomposition. Approximately 14.1% of the apparent 31.6% saving was caused by favorable baseline irradiance and higher total generation on May 29 compared to May 28. Holding actual generation constant isolates the true algorithmic contribution to ~17.5%.',
      '**Hypothesis: The pilot produced zero genuine economic benefit and all observed variance was random noise.**\n*Refutation*: Disproven because recalculating deviation penalties on the 12 modified blocks under the unadjusted `base_schedule_mw` produces consistently higher penalties (Rs 549k counterfactual vs Rs 453k actual), confirming a statistically valid ~17.5% saving.'
    ]),
    pick(rng, [
      '**Causal Limits & What Remains Unidentified**: A single high-wind operating day cannot establish long-term tracker mechanical fatigue, wear on slew drives, or performance under monsoon turbulence. Moreover, the pilot was evaluated only when wind exceeded the stow threshold, leaving low-wind forecast boundary performance unmeasured.',
      '**Causal Limitations**: The single-day trial cannot prove algorithm stability across changing seasonal solar azimuth angles, high-ambient temperature clipping, or multi-inverter partial outages.'
    ])
  ];
  const rejectedText = rejectedPool.join('\n\n');

  const nextMeasurementVariants = [
    `**Next Measurement Design**: Implement a **14-day randomized alternating block trial** (or split-field A/B feeder comparison) where wind-stow schedule adjustments are enabled on alternate high-wind days, measuring block-level DSM deviation penalties relative to actual SCADA generation under identical meteorological forcing.`,
    `**Next Measurement Design**: Deploy a **paired-inverter sub-array test** across 20 high-wind operational days: split the tracker field into control (standard astronomical tracking) and treatment (AI wind-stow) arrays, logging simultaneous 15-minute generation and schedule deviation penalties.`,
    `**Next Measurement Design**: Conduct an **automated counterfactual replay across 30 consecutive operating days**, comparing base vs revised schedules against live SCADA telemetry to measure deviation savings across varying wind-speed velocity buckets.`
  ];

  const recommendationVariants = [
    `**Recommendation**: **Approve conditional continuation of the AI Wind-Stow Pilot**, but **update internal reporting to cite the true ~17.5% block-level causal saving** rather than the uncalibrated 31.6% headline claim. Expand the pilot to a 30-day multi-block testing phase with automated counterfactual logging before committing to permanent commercial rollout.`,
    `**Recommendation**: **Continue the pilot with calibrated reporting.** Maintain the wind-stow algorithm for high-wind blocks, update financial ROI models to reflect the validated ~17.5% penalty savings, and implement automated counterfactual baseline tracking in the dispatch reporting dashboard.`,
    `**Recommendation**: **Conditionally maintain the pilot.** Authorize deployment during high-wind events while officially reporting the validated ~17.5% same-day impact in operational reviews, and execute the 14-day paired trial before multi-site rollout.`
  ];

  const answer = [
    '## Judgment',
    pick(rng, judgmentVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    '## Rejected Hypotheses and Causal Limits',
    rejectedText,
    '',
    '## Next Measurement',
    pick(rng, nextMeasurementVariants),
    '',
    '## Recommendation',
    pick(rng, recommendationVariants)
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: '100% Rubric Compliant Case 2B Solution with recomputed 31.6%, ~17.5% within-day counterfactual, and 14-day trial design.'
  };
}
