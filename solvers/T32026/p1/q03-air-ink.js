import { page, card, details, escapeHtml, toneForState } from './ui.js';
import { WINDOWS, windowStatus, formatIst } from './windows.js';
import { deviceReadiness, requestSensorPermission, sampleOrientation } from './air-ink-device.js';

export const id = 'q-motion-air-ink';
export const title = 'Motion games: Air Ink character drawing';

function widgetHtml() {
  return [
    '<div id="t3p1AirRoot">',
    '<p>Open <strong>this page on your phone</strong> and press the buttons. It only checks that your phone can send motion readings; the drawing itself is on the exam page.</p>',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3p1Air.check()">1 · Check my device</button><button type="button" class="p1-btn ghost" onclick="window._t3p1Air.allow()">2 · Allow sensors</button><button type="button" class="p1-btn ghost" onclick="window._t3p1Air.sample()">3 · Test tilting (2.5 s)</button></div>',
    '<div id="t3p1AirOut" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

function buildGuide() {
  const status = windowStatus(WINDOWS.airInk);
  const beginner = [
    '<ol>',
    '<li><strong>Use a phone.</strong> Open this page on it and press <em>Check my device</em> below. Fix anything marked red (use Chrome on Android or Safari on iPhone, and an https page).</li>',
    '<li><strong>Press “Allow sensors”</strong> and tap <em>Allow</em>. Then press <em>Test tilting</em> and tilt the phone — you should see “Sensors work”.</li>',
    '<li><strong>Open the exam page on the same phone</strong> and press <em>Open Motion games: Air Ink</em>. Read the consent screen. Only continue if you agree.</li>',
    '<li><strong>Calibrate when asked:</strong> hold the phone flat, tilt left, right, forward and back, then draw a circle in the air. If it fails, follow the on-screen hint and try again.</li>',
    '<li><strong>Draw each of your three characters slowly:</strong> tilt to move the pen, <em>press and hold to ink</em>, release to lift. Small, simple, clear strokes are better than big fast ones. It only has to be readable, not perfect — practise and redo as often as you like.</li>',
    '<li><strong>Submit once you like all three.</strong> You can submit up to three times; the latest set counts.</li>',
    '<li><strong>Back on the exam page,</strong> type any text (for example “uploaded”) in the box, press <strong>Check</strong>, then <strong>Save</strong>.</li>',
    '</ol>',
  ].join('');
  return page({
    title: '✍️ Air Ink',
    chips: [
      { text: status.state === 'open' ? 'Open' : status.state === 'grace' ? 'Grace period' : 'Closed', tone: toneForState(status.state) },
      { text: `Closes ${formatIst(WINDOWS.airInk.closes)}`, tone: '' },
      { text: 'Do it yourself · no AI agents', tone: 'warn' },
    ],
    sections: [
      card('Please read first', `<p>${escapeHtml(status.text)}</p><p class="p1-note">The question says to complete this part <strong>yourself and not to use AI agents</strong> (agent use may receive a small penalty), and the drawings are judged by OCR for legibility. So there is nothing here to automate: this page only helps you get ready and explains the steps.</p><p>${escapeHtml(WINDOWS.airInk.note)}</p>`, 'accent'),
      card('Step by step for beginners', beginner),
      card('Is my phone ready?', widgetHtml(), 'accent'),
      details('What the game records (consent)', '<p>During the exercise it records motion sensors, device orientation, pen events, timing, location, battery and network information. These recordings are used anonymously for later course exercises and research. Read the consent screen on the exam page and decide for yourself; the choice is yours.</p>'),
      details('If something goes wrong', '<ul><li><strong>No movement:</strong> allow motion access (iPhone: Settings → Safari → Motion & Orientation Access), reload and try again.</li><li><strong>Calibration fails:</strong> move away from metal tables, hold the phone flat first, and make larger, smoother tilts.</li><li><strong>Link expired:</strong> the launch link works for 20 minutes. Reload the exam page for a new one; do not share it.</li><li><strong>Not sure it uploaded:</strong> the game shows a confirmation after a submission. Only then press Check on the exam page.</li></ul>'),
    ],
  });
}

function register() {
  if (typeof window === 'undefined' || window._t3p1Air) return;
  const $ = (name) => document.getElementById(name);
  const out = (html) => { const el = $('t3p1AirOut'); if (el) el.innerHTML = html; };
  const mark = { ok: '✅', warn: '⚠️', fail: '❌' };
  window._t3p1Air = {
    check() {
      const report = deviceReadiness();
      out([`<ul style="list-style:none;padding:0">${report.checks.map((c) => `<li>${mark[c.status]} <strong>${escapeHtml(c.label)}</strong> — ${escapeHtml(c.detail)}</li>`).join('')}</ul>`,
        `<p><strong>${report.ready ? 'This device looks ready.' : report.failed ? 'Fix the red items first.' : 'Use a phone for the drawing — this device may not have motion sensors.'}</strong></p>`].join(''));
    },
    async allow() {
      const result = await requestSensorPermission();
      out(`<p>${result.ok ? '✅' : '❌'} ${escapeHtml(result.message)}</p>`);
    },
    async sample() {
      out('<p>Tilt your phone now…</p>');
      const result = await sampleOrientation(globalThis, 2500);
      out(`<p>${result.moved ? '✅' : '⚠️'} ${escapeHtml(result.message)}</p>`);
    },
  };
}

export async function solve() {
  register();
  const status = windowStatus(WINDOWS.airInk);
  return {
    type: 'guide',
    answer: 'Draw your three characters yourself in the Air Ink game on your phone (no AI agents). When the game confirms the upload, type any text (for example: uploaded) and press Check.',
    variant: `Phone drawing needed · ${status.state === 'open' ? 'open' : status.state}`,
    guide: buildGuide(),
    answerDisplay: `### Draw it yourself, then type \`uploaded\`\n\n${status.text}\n\nThe exam forbids AI agents for this part. The Implementation Guide checks that your phone is ready and walks you through every step.`,
    debug: { question: 'Q3', needsUserInput: true, windowState: status.state },
  };
}
