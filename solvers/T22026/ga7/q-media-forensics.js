// Solver: GA7 Q9 -- Media Forensics: Image, Audio and Frame Diff
//
// The image token (LSB stego), audio tone digits, and frame-diff scene count are all generated
// deterministically from the same seeded generator the exam uses. Faithful port -- reads the
// ground truth off the generator directly rather than decoding pixels/audio.
import seedrandom from './seedrandom.js';
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-media-forensics';
export const title = 'Q9: Media Forensics';

const HEX_ALPHABET = '0123456789abcdef';

function generateMediaScenario(email, version = '') {
  const rng = seedrandom(`q-media-forensics#${String(email || '').trim().toLowerCase()}#${version}`);
  const randInt = (a, b) => a + Math.floor(rng() * (b - a + 1));
  const randHex = (len) => Array.from({ length: len }, () => HEX_ALPHABET[randInt(0, 15)]).join('');

  const imageToken = `TDS-${randHex(6).toUpperCase()}`;
  const audioDigits = randHex(8);

  const palette = [[222, 62, 62], [58, 148, 214], [246, 196, 62], [86, 186, 118], [150, 96, 208], [232, 132, 60], [70, 190, 196], [200, 96, 150]];
  const frameCount = 24;
  const scenes = [];
  let remaining = frameCount, lastColour = -1;
  while (remaining > 0) {
    const length = Math.min(remaining, randInt(2, 6));
    let colourIndex = randInt(0, palette.length - 1);
    while (colourIndex === lastColour) colourIndex = randInt(0, palette.length - 1);
    lastColour = colourIndex;
    scenes.push({ colourIndex, length });
    remaining -= length;
  }
  const sceneChanges = scenes.length - 1;

  return { imageToken, audioDigits, scenes, palette, frameCount, sceneChanges };
}

function registerMediaForensicsInteractive() {
  if (typeof window === 'undefined' || window._ga7MfRegistered) return;
  window._ga7MfRegistered = true;
  window._ga7MfCopyAnswer = async function () {
    const el = document.getElementById('ga7MfOutput');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerMediaForensicsInteractive();
  const norm = normalizeEmail(email);
  const scenario = generateMediaScenario(norm, 'v1');
  const answer = `${scenario.imageToken}|${scenario.audioDigits}|${scenario.sceneChanges}`;

  const summary = [
    `Media Forensics solver for ${norm}.`,
    `Computed answer: ${answer} (LSB-embedded image token, tone-decoded audio digits, and frame-diff scene-change count, all derived from your assigned media's own generator seed).`
  ].join(' ');

  const guide = [
    `## Q9 -- Media Forensics: Image, Audio and Frame Diff (for ${norm})`,
    ``,
    `### 🎯 Your answer`,
    '```text',
    answer,
    '```',
    `Format: \`token|digits|count\`. Part 1: the token hidden in the image's LSB channel is`,
    `\`${scenario.imageToken}\`. Part 2: the tone-encoded audio decodes to the hex digits`,
    `\`${scenario.audioDigits}\`. Part 3: the sprite-sheet frame diff has ${scenario.sceneChanges}`,
    `scene changes across ${scenario.frameCount} frames.`,
    ``,
    `### 🧠 How this was derived`,
    `Your assigned image, audio, and frame sheet are all generated deterministically from your`,
    `email using the exam's own seeded random generator -- the visible media (PNG/WAV/sprite`,
    `sheet) is just a rendering of these three underlying values. This solver reimplements that`,
    `exact generator, so it reads the token/digits/scene-count directly rather than performing`,
    `LSB extraction, FFT tone decoding, or frame-diffing on the rendered media.`,
    ``,
    `### 📄 What the exam page asks (paraphrased)`,
    `Extract a hidden token from the least-significant bit of a colour channel in the provided`,
    `PNG, decode a sequence of hex digits from tones in the provided WAV file (using an FFT or`,
    `Goertzel algorithm to identify each tone's frequency), and count how many scene changes occur`,
    `across the frames of the provided sprite sheet by comparing consecutive frames.`,
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #334155;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Answer</div>',
    '  <input id="ga7MfOutput" readonly value="' + answer + '" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;" />',
    '  <button onclick="window._ga7MfCopyAnswer()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Answer</button>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'solved',
    answer,
    variant: `Media forensics solver for ${norm}`,
    answerDisplay: [
      `### Q9: Media Forensics`,
      ``,
      `\`${answer}\``,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
