import { normalizeEmail } from './utils.js';

export const id = 'q-modem-in-static-server';
export const title = 'Q10: Decode a Hidden Modem Signal in Audio';

const LOW_FREQS = [697, 770, 852, 941, 1040, 1160];
const HIGH_FREQS = [1209, 1336, 1477, 1633, 1777, 1919];
const GRID_CHARS = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['G', 'H', 'I', 'J', 'K', 'L'],
  ['M', 'N', 'O', 'P', 'Q', 'R'],
  ['S', 'T', 'U', 'V', 'W', 'X'],
  ['Y', 'Z', '0', '1', '2', '3'],
  ['4', '5', '6', '7', '8', '9']
];

// Exact Fourier Transform energy at precise target DTMF frequency
function dftPowerAtFreq(pcmChunk, targetFreq, sampleRate) {
  const N = pcmChunk.length;
  const omega = (2 * Math.PI * targetFreq) / sampleRate;
  let re = 0;
  let im = 0;
  for (let n = 0; n < N; n++) {
    const val = pcmChunk[n];
    re += val * Math.cos(omega * n);
    im -= val * Math.sin(omega * n);
  }
  return (re * re + im * im) / N;
}

function decodeAudioBuffer(pcm, sampleRate) {
  const windowSize = Math.floor(sampleRate * 0.20); // 200ms window
  const stepSize = Math.floor(sampleRate * 0.05);   // 50ms step
  const rawWindows = [];
  let maxObservedPower = 0;

  for (let pos = 0; pos + windowSize <= pcm.length; pos += stepSize) {
    const chunk = pcm.subarray(pos, pos + windowSize);
    
    let maxLowPower = -1, bestLowIdx = -1;
    LOW_FREQS.forEach((f, idx) => {
      const p = dftPowerAtFreq(chunk, f, sampleRate);
      if (p > maxLowPower) { maxLowPower = p; bestLowIdx = idx; }
    });

    let maxHighPower = -1, bestHighIdx = -1;
    HIGH_FREQS.forEach((f, idx) => {
      const p = dftPowerAtFreq(chunk, f, sampleRate);
      if (p > maxHighPower) { maxHighPower = p; bestHighIdx = idx; }
    });

    const totalPower = maxLowPower + maxHighPower;
    if (totalPower > maxObservedPower) maxObservedPower = totalPower;
    rawWindows.push({
      timeSec: pos / sampleRate,
      lowIdx: bestLowIdx,
      highIdx: bestHighIdx,
      power: totalPower
    });
  }

  // Energy threshold: 35% of peak observed burst energy in recording
  const adaptiveThreshold = Math.max(0.001, maxObservedPower * 0.35);
  const bursts = rawWindows.filter(w => w.power >= adaptiveThreshold);

  // Cluster window detections into discrete burst intervals (5 expected bursts)
  const clusters = [];
  bursts.forEach(b => {
    if (clusters.length === 0 || b.timeSec - clusters[clusters.length - 1].timeSec > 0.35) {
      clusters.push({ ...b, maxP: b.power });
    } else {
      const last = clusters[clusters.length - 1];
      if (b.power > last.maxP) {
        last.lowIdx = b.lowIdx;
        last.highIdx = b.highIdx;
        last.maxP = b.power;
      }
    }
  });

  const chars = clusters.map(c => GRID_CHARS[c.lowIdx][c.highIdx]);
  return chars.join('');
}

function registerQ10Interactive() {
  if (typeof window === 'undefined' || window._ga6q10Registered) return;
  window._ga6q10Registered = true;

  window._ga6q10Decode = async function (input) {
    const statusEl = document.getElementById('ga6q10Status');
    const outputEl = document.getElementById('ga6q10Output');
    const file = input?.files?.[0];
    if (!file) return;

    try {
      if (statusEl) {
        statusEl.style.color = '#4da6ff';
        statusEl.textContent = 'Reading WAV file & running high-precision DFT demodulator…';
      }

      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      const code = decodeAudioBuffer(channelData, sampleRate);

      if (code && code.length >= 5) {
        const token = code.slice(0, 5);
        if (statusEl) {
          statusEl.style.color = '#198754';
          statusEl.textContent = `✅ Decoded 5-character modem token: ${token}`;
        }
        if (outputEl) outputEl.value = token;
      } else {
        if (statusEl) {
          statusEl.style.color = '#d97706';
          statusEl.textContent = 'Could not isolate 5 distinct tones. Detected output: ' + (code || 'None');
        }
        if (outputEl) outputEl.value = code || '';
      }
    } catch (err) {
      if (statusEl) {
        statusEl.style.color = '#dc3545';
        statusEl.textContent = '❌ Failed to process audio: ' + err.message;
      }
    }
  };
}

export async function solve(email) {
  registerQ10Interactive();
  const norm = normalizeEmail(email);

  const summary = [
    `Download your private per-student WAV audio file from the live exam page, then upload it below`,
    `— this solver uses in-browser WebAudio DFT signal processing to isolate the 5 modem`,
    `tone bursts and extract your 5-character token automatically.`
  ].join(' ');

  const guide = [
    `## Q10 — Decode a Hidden Modem Signal (for ${norm})`,
    ``,
    `### 🚀 Upload WAV — Decode Token Automatically`,
    ``,
    '<div style="background:linear-gradient(135deg,#0f2444 0%,#1a3a6b 100%);border-radius:14px;padding:24px 28px;margin:18px 0;color:#e8f0fe;border:1px solid #2d4d80;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#4da6ff;text-transform:uppercase;margin-bottom:14px;font-weight:700;">🧭 Upload your downloaded signal-capture.wav</div>',
    '  <input id="ga6q10File" type="file" accept="audio/wav,audio/*" onchange="window._ga6q10Decode(this)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#e8f0fe;font-size:13px;box-sizing:border-box;" />',
    '  <div id="ga6q10Status" style="margin-top:12px;font-size:13px;min-height:18px;font-weight:600;"></div>',
    '  <input id="ga6q10Output" type="text" readonly placeholder="Decoded 5-character token will appear here..." style="width:100%;margin-top:10px;padding:10px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#a6e3a1;font-family:monospace;font-size:16px;box-sizing:border-box;" />',
    '  <button onclick="navigator.clipboard.writeText(document.getElementById(\'ga6q10Output\').value)" style="margin-top:10px;background:#198754;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">📋 Copy Direct Answer</button>',
    '  <div style="margin-top:12px;font-size:12px;color:#8fb0dd;">🔒 Audio processing runs 100% locally in your browser using WebAudio API + DFT Fourier filters.</div>',
    '</div>',
    ``,
    `### DTMF Frequency Grid Reference`,
    `| Low \\ High | 1209 Hz | 1336 Hz | 1477 Hz | 1633 Hz | 1777 Hz | 1919 Hz |`,
    `|---|---|---|---|---|---|---|`,
    `| **697 Hz** | A | B | C | D | E | F |`,
    `| **770 Hz** | G | H | I | J | K | L |`,
    `| **852 Hz** | M | N | O | P | Q | R |`,
    `| **941 Hz** | S | T | U | V | W | X |`,
    `| **1040 Hz** | Y | Z | 0 | 1 | 2 | 3 |`,
    `| **1160 Hz** | 4 | 5 | 6 | 7 | 8 | 9 |`
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Modem Audio Demodulator for ${norm}`,
    answerDisplay: [
      `### Q10: Decode a Hidden Modem Signal in Audio`,
      ``,
      `Upload your downloaded \`signal-capture.wav\` in the guide panel below to automatically demodulate the FSK tones and decode your direct 5-character token.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
