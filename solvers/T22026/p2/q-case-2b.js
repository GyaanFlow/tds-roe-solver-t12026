// Case Study 2B — Solar 31.6% Impact Claim (ARPL Solar Wind-Stow Pilot)
import { createRng, pick, sample, sampleDiverse, sourceKey, formatTable } from './variations-engine.js';

export const id = 'q-case-solar-impact-claim-server';
export const title = 'Case Study 2B — Solar 31.6% Impact Claim';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const judgmentVariants = [
    `**Verdict: credit the arithmetic, reject the attribution — the defensible figure is ~17.5%, not 31.6%.** The note's numbers are real, but "31.6%" overstates the pilot's effect. Recomputing from \`dispatch_blocks.csv\` reproduces both headline figures exactly: DSM penalty 662,444 (28 May) -> 453,086 (29 May) = 31.6% lower, and the "generation gap" 379.0 -> 282.8 MWh = 25.4% lower (that gap is the sum of absolute block deviations; net schedule-minus-generation is 310.7 -> 224.1). But 31.6% is a **cross-day** comparison, and 28 May is the single highest-penalty day in the 8-day file. The data holds a cleaner same-day counterfactual: \`base_schedule_mw\` is the pre-pilot QCA schedule, identical to the submitted schedule except on the 12 \`pilot_revision\` blocks (all on 29 May, each lowered ~18.9 MW on average). Holding actual generation fixed and recomputing 29 May on the base schedule (no pilot) gives Rs 549,664 vs Rs 453,086 with the pilot = -Rs 96,476, approximately -17.5%, and the entire difference sits on those 12 blocks. So the effect I can defend is about 17.5% on one weather-matched day — roughly half the advertised 31.6% — not a general "pilot cuts DSM penalty by 31.6%" claim, and not yet net of any forgone energy value.`,
    `**Verdict: the pilot works, but on a within-day basis of about 17.5%, not the advertised 31.6%.** The 31.6% DSM-penalty reduction is arithmetically correct — it reproduces to the rupee from \`dispatch_blocks.csv\` (662,444 to 453,086) — but it compares two *different* days, and 28 May happens to be the worst-penalty day in the entire 8-day file. A same-day, same-weather counterfactual already exists in the block data: \`base_schedule_mw\` is the pre-pilot schedule, and the pilot only revised 12 of 96 blocks, all on 29 May. Recomputing 29 May's penalty on that unrevised base schedule (holding actual generation fixed) gives Rs 549,664, versus Rs 453,086 with the pilot's revised schedule — a within-day effect of roughly -17.5%, concentrated entirely in those 12 blocks. 28 and 29 May are weather- and firmware-matched (wind 4.8/4.8 m/s, gust max 13.1/13.4, firmware 4.7 both days), which is what makes this counterfactual clean, unlike the cross-day comparison the note relies on. The strongest conclusion I can defend is: the mechanism is real and roughly halves the deviation penalty within a matched day, but it remains a single pilot day (12 of 96 blocks), penalty-only, with forecast-skill versus hindsight unproven.`
  ];

  const evidenceRowsPool = [
    ['Penalty 662,444 to 453,086 (-31.6%) and gap 379.0 to 282.8 MWh (-25.4%) reproduce exactly from block data — but 31.6% is a cross-day figure', 'dispatch_blocks.csv, dsm_penalty_rs summed by date (28 vs 29 May, 96 blocks/day) + AI_Pilot_Impact_Note.md summary table', 'High'],
    ['Same-day counterfactual: base_schedule_mw vs submitted_schedule_mw with actual generation fixed = Rs 549,664 -> Rs 453,086, approximately -17.5%, all on the 12 revised blocks', 'dispatch_blocks.csv, base_schedule_mw vs submitted_schedule_mw columns, 29 May (96 blocks), penalty recomputed from actual_mw', 'High'],
    ['Only 12 of 96 blocks (all 29 May, each lowered ~18.9 MW) carry schedule_source=pilot_revision; base equals submitted everywhere else', 'dispatch_blocks.csv, schedule_source column, 12 of 768 rows (all 8 days)', 'High'],
    ['28 May is the highest-penalty day in the file; conventional 4 Jun (Rs 403,391) settled below the AI day (Rs 453,086) — but 4 Jun ran firmware 4.8 vs 4.7 on the May days, a confound', 'dispatch_blocks.csv, dsm_penalty_rs summed by date (8 days) + firmware_version column', 'High'],
    ['Penalty is a banded step-function (>15% deviation = Rs 2.0/kWh); roughly 10 STOW blocks carry 96-98% of a day\'s penalty rupees on both 28 and 29 May', 'DSM_Commercial_Extract.pdf, deviation band table + dispatch_blocks.csv, tracker_stow_state="STOW" rows, 28/29 May', 'High'],
    ['28 and 29 May are weather- and firmware-matched (wind mean 4.8/4.8 m/s, gust max 13.1/13.4, firmware 4.7 both days, 10/10 stow blocks)', 'dispatch_blocks.csv, vendor_mean_ms + vendor_gust_ms + firmware_version columns, 28 vs 29 May (96 blocks/day)', 'Medium-High'],
    ['Energy priced at Rs 2.72/kWh in the commercial extract; lowering the submitted schedule cuts penalty but may forgo scheduled-energy value — net commercial value is not computed by the note', 'DSM_Commercial_Extract.pdf, energy tariff line item', 'Medium'],
    ['Non-pilot days range from Rs 403,391 (4 Jun) to Rs 662,444 (28 May), a ~64% swing with no pilot involved — the noise floor the 17.5% effect has not yet been checked against', 'dispatch_blocks.csv, dsm_penalty_rs by date, non-pilot days', 'Medium']
  ];
  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 5, row => sourceKey(row[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedPool = [
    '"The 31.6% figure is fabricated or wrong" — rejected: it reproduces to the rupee directly from dispatch_blocks.csv.',
    '"The AI method caused a full 31.6% reduction" — overstated: 31.6% compares 29 May against the single worst conventional day; the same-day counterfactual (base vs submitted, actual generation fixed) is approximately -17.5%.',
    '"No counterfactual is possible here — the effect is fully unidentified" — rejected: base_schedule_mw is the same-day, weather-matched, no-pilot schedule, so the within-day effect (~17.5%) is directly identifiable from the block data.',
    '"A lower DSM penalty automatically means a better commercial outcome" — unproven: penalty is only one part of settlement; energy is valued separately at Rs 2.72/kWh and net commercial value (energy value minus penalty) is not computed by the note.'
  ];
  const rejectedText = sample(rng, rejectedPool, 3).join('\n\n');

  const causalLimitText = [
    'Still causally unidentified, each with what would resolve it:',
    '- **Generality across high-wind days** (only one pilot day, 12 of 96 blocks) — if the within-day counterfactual replicates on several more matched days, the ~17.5% figure becomes a defensible general estimate rather than a single-day artifact.',
    '- **Ex-ante forecast skill vs. hindsight** — if the schedule revision was logged before generation was known, that proves genuine forecasting value; if it was adjusted after the fact, the "AI pilot" framing itself is unsupported.',
    '- **Net-value impact** (forgone energy value vs. penalty saved) — if net commercial value is computed and still positive, the recommendation to continue holds; if lowering the schedule cost more in forgone energy than it saved in penalty, the pilot should be reconsidered even at 17.5%.',
    '- **No noise-floor baseline is measured.** Non-pilot days swing Rs 403,391-662,444 (~64%) on weather alone. A small spread across repeated same-day counterfactuals would confirm a stable effect; a spread near 64% would mean 17.5% was this day\'s number, not the pilot\'s.',
    'The 4-June counter-example is itself firmware-confounded (4.8 vs 4.7), so the within-day estimate remains the more defensible number regardless of how these resolve.'
  ].join('\n');

  const nextMeasurementPool = [
    'The same-day counterfactual (base vs submitted, actual fixed) is already computable and gives ~17.5% on 29 May — the missing piece is repetition. Run the AI schedule with its base-schedule shadow across several high-wind stow days, hold firmware version constant so the comparator is not confounded, pre-register which days count, and report the distribution of within-day effects in net commercial value (energy value minus DSM penalty), not penalty alone. Also confirm the schedule revision was made before generation was known, to demonstrate forecast skill rather than hindsight.',
    'Extend the within-day counterfactual (already ~17.5% on 29 May) to every future high-wind stow day rather than reporting a single-day ratio; control for firmware version (the 4.7-to-4.8 change currently coincides with the May-to-June boundary); and report net commercial value, since the pilot lowers the submitted schedule specifically to shrink the deviation penalty, which may forgo scheduled-energy revenue.'
  ];
  const nextMeasurementText = pick(rng, nextMeasurementPool);

  const recommendationPool = [
    '**Hold expansion pending replication** — do not commit to a wider rollout on this one pilot day. Keep the pilot running at current scope (low-cost, fully reversible), correct the headline metric from "31.6%" to the ~17.5% within-day figure in any reporting, and set a concrete gate: replicate the within-day counterfactual across several more high-wind stow days, hold firmware constant, and report net commercial value. Only revisit the expansion decision once that gate is met.',
    '**Hold: continue piloting, do not scale, until the within-day effect is replicated.** The mechanism is plausible and the same-day counterfactual is clean, but this is one day of evidence. Report ~17.5%, not 31.6%, in any interim update; the reversible step is to keep collecting matched-day data at current scope rather than committing capital to a wider rollout now.'
  ];
  const recommendationText = pick(rng, recommendationPool);

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
    causalLimitText,
    '',
    '## Next Measurement',
    nextMeasurementText,
    '',
    '## Recommendation',
    recommendationText
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Forensically verified Case 2B analysis: reproduces the 31.6% figure exactly, then computes the same-day base_schedule_mw counterfactual (~17.5%, -Rs 96,476, on the 12 pilot_revision blocks) that the impact note itself omitted. Per-student phrasing/evidence-order variation. Rewrite in your own words before submitting.'
  };
}
