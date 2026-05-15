// Solver: Prompt Reverse-Engineering
import { fnvHash, normalizeEmail } from './utils.js';

const TOTAL = 20;

function buildScenarios() {
  const audiences = [
    { label: 'campus placement cell leadership', triggers: ['placement cell', 'leadership'] },
    { label: 'state education policy team', triggers: ['policy team', 'state education'] },
    { label: 'city public-health commissioner', triggers: ['commissioner', 'public health'] },
    { label: 'retail operations directors', triggers: ['operations directors', 'retail'] },
    { label: 'bank risk committee', triggers: ['risk committee', 'credit risk'] },
  ];
  const formats = [
    { type: 'narrative', label: 'three-paragraph narrative memo', triggers: ['narrative memo', 'three paragraphs'] },
    { type: 'narrative', label: 'bullet-led executive brief', triggers: ['executive brief', 'bullet'] },
    { type: 'html', label: 'single-page HTML briefing card', triggers: ['html', 'briefing card'] },
    { type: 'narrative', label: 'slide-script style talk track', triggers: ['talk track', 'slide script'] },
  ];
  const tones = [
    { styleRef: 'Malcolm Gladwell', triggers: ['gladwell', 'narrative'], phrases: ['the pattern breaks in plain sight', 'the surprising part is not the average'] },
    { styleRef: 'NYT graphics team brief', triggers: ['nyt', 'graphics team'], phrases: ['annotate the turning point', 'show the baseline clearly'] },
    { styleRef: 'McKinsey board update', triggers: ['board update', 'mckinsey'], phrases: ['decision now is resource allocation', 'risk-adjusted upside'] },
    { styleRef: 'Data journalism explainer', triggers: ['data journalism', 'explainer'], phrases: ['what changed and why', 'the caveat is where this breaks'] },
    { styleRef: 'Product analytics weekly brief', triggers: ['product analytics', 'weekly brief'], phrases: ['activation moved, retention lagged', 'ship one test this sprint'] },
  ];
  const findings = [
    ['gap widened by 12 percentage points', 'only 25-34 cohort improved', 'trend reversed after 2021'],
    ['north region grew 3x faster', 'east remained lowest', 'west showed steady gains'],
    ['premium stayed below 3%', 'basic churn worsened', 'gap widened between basic and premium'],
    ['coal declined sharply', 'renewables crossed 40%', 'solar accelerated after 2022'],
    ['site c worsened after intervention', 'site a improved most', 'variance widened across sites'],
  ];
  const lengths = [
    { label: '300-380 words', triggers: ['300-380 words', 'around 350 words'] },
    { label: '320-420 words', triggers: ['320-420 words', 'under 420 words'] },
    { label: '280-360 words', triggers: ['280-360 words', 'under 360 words'] },
  ];
  const structures = [
    { label: 'open with a question', triggers: ['open with a question', 'start with a question'] },
    { label: 'end with one action recommendation', triggers: ['single action recommendation', 'end with one action'] },
    { label: 'include one counterargument sentence', triggers: ['counterargument', 'one caveat sentence'] },
    { label: 'use exactly three section headers', triggers: ['three section headers', 'exactly three headings'] },
  ];

  const scenarios = [];
  for (let i = 0; i < TOTAL; i++) {
    scenarios.push({
      id: i,
      audience: audiences[i % audiences.length],
      format: formats[i % formats.length],
      tone: tones[i % tones.length],
      findings: findings[i % findings.length],
      length: lengths[i % lengths.length],
      structure: structures[i % structures.length],
    });
  }
  return scenarios;
}

function buildPrompt(s) {
  return [
    `Write a ${s.format.label} for ${s.audience.label}.`,
    `Use a ${s.tone.styleRef} tone and explicitly include the style cues "${s.tone.phrases[0]}" and "${s.tone.phrases[1]}".`,
    `Focus on these findings: ${s.findings[0]}, ${s.findings[1]}, and ${s.findings[2]}.`,
    `Keep the output to ${s.length.label}, emphasize only two or three findings, and make the artifact easy to scan quickly.`,
    `Required structure: ${s.structure.label}.`,
    `State what changed, why it matters, and what action should follow for the audience.`
  ].join(' ');
}

function buildNarrativeResponse(s) {
  if (s.structure.label === 'use exactly three section headers') {
    return [
      'Signal',
      `${s.findings[0]}. ${s.tone.phrases[0]}. ${s.findings[1]}. This is the visible break from the old baseline and it changes how the audience should read the trend.`,
      '',
      'Meaning',
      `${s.findings[2]}. ${s.tone.phrases[1]}. The pattern is no longer a background detail; it reframes the operating story and makes average performance less useful than subgroup movement.`,
      '',
      'Action',
      'Act on the shifted pattern this quarter, assign one owner, and make the next update about the response rather than the summary trend.'
    ].join('\n');
  }

  if (s.structure.label === 'open with a question') {
    return [
      `What changes when ${s.findings[0]}?`,
      `${s.findings[1]}, and ${s.findings[2]}. ${s.tone.phrases[0]}. The shift is not cosmetic; it tells the audience that the newest segment behavior carries more decision weight than the old average.`,
      `${s.tone.phrases[1]}. Focus resources where the pattern moved most, translate the strongest signal into one operational choice, and use the next review to confirm that the intervention changed the slope rather than just the total.`
    ].join('\n\n');
  }

  if (s.structure.label === 'include one counterargument sentence') {
    return [
      `${s.findings[0]}. ${s.findings[1]}. ${s.tone.phrases[0]}. Together these signals show that the center of gravity has moved away from the old steady-state story.`,
      `A fair counterargument is that the aggregate still looks stable, but ${s.findings[2]}. That caveat matters because average performance can hide where the pressure is actually building.`,
      `${s.tone.phrases[1]}. Prioritize one targeted response this sprint, assign an owner, and measure whether the next cycle closes the emerging gap.`
    ].join('\n\n');
  }

  return [
    `${s.findings[0]}. ${s.findings[1]}. ${s.tone.phrases[0]}. These changes are large enough to alter how the audience should prioritize follow-up.`,
    `${s.findings[2]}. ${s.tone.phrases[1]}. The implication is not just descriptive; it points to a narrower operating risk and a clearer near-term opportunity.`,
    'Take one focused action recommendation now, center the next review on the changed segment, and avoid defaulting back to the blended average.'
  ].join('\n\n');
}

function buildHtmlResponse(s) {
  return `<!doctype html>
<html>
  <body style="font-family: Inter, system-ui, sans-serif; padding: 16px; max-width: 760px;">
    <h2>Decision Brief</h2>
    <p><strong>Audience:</strong> ${s.audience.label}</p>
    <p>The summary claim is that <strong>${s.findings[0]}</strong>, while the subgroup signal is <strong>${s.findings[1]}</strong>. In context, <strong>${s.findings[2]}</strong>, which means the story has shifted away from the old blended average.</p>
    <ul>
      <li>${s.tone.phrases[0]}</li>
      <li>${s.tone.phrases[1]}</li>
      <li>Frame the decision around the changed baseline, not the old headline metric.</li>
    </ul>
    <p>Act now: prioritize the operating response suggested by the changed pattern, assign one owner, and make the next review about whether the intervention changed the trajectory rather than whether the average stayed acceptable.</p>
  </body>
</html>`;
}

export const id = 'q-prompt-reverse-engineering';
export const title = 'Prompt Reverse-Engineering';

export function solve(email) {
  const norm = normalizeEmail(email);
  const scenarios = buildScenarios();
  const s = scenarios[fnvHash(norm) % TOTAL];
  const prompt = buildPrompt(s);
  const response = s.format.type === 'html'
    ? buildHtmlResponse(s)
    : buildNarrativeResponse(s);

  return {
    variant: `Scenario #${s.id + 1} | Audience: ${s.audience.label} | Tone: ${s.tone.styleRef} | Format: ${s.format.label}`,
    answer: `Prompt: ${prompt}\n\nLLM Response: ${response}`
  };
}
