// Solver: ROE T2 2026 Q5 — Secret Handshake: Prove You Collaborated
//
// Ultra-Advanced Interactive HMAC Toolkit & Per-User Generator:
// Generates HMAC-SHA256 challenges & responses and builds official JSON submission arrays,
// customized deterministically per student email.
import { normalizeEmail } from './utils.js';

export const id = 'q-handshake-server';
export const title = 'Q5: Secret Handshake — Prove You Collaborated';

const DEFAULT_TAG_LENGTH = 16;

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

function createRng(seedStr) {
  let s = hashString(seedStr);
  return function () {
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >> 17)) >>> 0;
    s = (s ^ (s << 5)) >>> 0;
    return (s >>> 0) / 4294967296;
  };
}

async function hmacSha256Hex(key, message) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function makeCode(key, tag, message, tagLength) {
  const hex = await hmacSha256Hex(key, `${tag}|${message}`);
  return hex.slice(0, tagLength);
}

function registerHandshakeInteractive() {
  if (typeof window === 'undefined' || window._roeHandshakeRegistered) return;
  window._roeHandshakeRegistered = true;

  function readConfig() {
    const key = (document.getElementById('roeHsKey')?.value || '').trim();
    const rawLen = (document.getElementById('roeHsTagLen')?.value || '').trim();
    const tagLength = Number.isFinite(Number(rawLen)) && Number(rawLen) > 0
      ? Math.floor(Number(rawLen))
      : DEFAULT_TAG_LENGTH;
    return { key, tagLength };
  }

  function setStatus(id, text, color) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.style.color = color || '#9fc6ff';
  }

  window._roeHsChallenges = async function () {
    const { key, tagLength } = readConfig();
    const outEl = document.getElementById('roeHsChallengeOut');
    if (!key) {
      setStatus('roeHsChallengeStatus', 'Paste your key from the exam page first.', '#dc3545');
      if (outEl) outEl.value = '';
      return;
    }
    const emails = (document.getElementById('roeHsPeers')?.value || '')
      .split(/[\s,;]+/)
      .map(e => normalizeEmail(e))
      .filter(Boolean);
    if (!emails.length) {
      setStatus('roeHsChallengeStatus', 'Enter at least one classmate email.', '#dc3545');
      if (outEl) outEl.value = '';
      return;
    }
    try {
      const lines = [];
      for (const email of emails) {
        const challenge = await makeCode(key, 'c', email, tagLength);
        lines.push(`${email}  ->  ${challenge}`);
      }
      if (outEl) outEl.value = lines.join('\n');
      setStatus('roeHsChallengeStatus', `Generated ${lines.length} challenge${lines.length === 1 ? '' : 's'}. Send each classmate their own line.`, '#198754');
    } catch (err) {
      setStatus('roeHsChallengeStatus', `Failed: ${err.message}`, '#dc3545');
    }
  };

  window._roeHsRespond = async function () {
    const { key, tagLength } = readConfig();
    const challenge = (document.getElementById('roeHsIncoming')?.value || '').trim();
    const outEl = document.getElementById('roeHsResponseOut');
    if (!key) {
      setStatus('roeHsRespondStatus', 'Paste your key from the exam page first.', '#dc3545');
      return;
    }
    if (!challenge) {
      setStatus('roeHsRespondStatus', 'Paste the challenge your classmate sent you.', '#dc3545');
      return;
    }
    try {
      const response = await makeCode(key, 'r', challenge, tagLength);
      if (outEl) outEl.value = response;
      setStatus('roeHsRespondStatus', 'Response code generated! Send this string back to your classmate.', '#198754');
    } catch (err) {
      setStatus('roeHsRespondStatus', `Failed: ${err.message}`, '#dc3545');
    }
  };

  window._roeHsAssemble = function () {
    const raw = (document.getElementById('roeHsFinalPairs')?.value || '').trim();
    const outEl = document.getElementById('roeHsFinalOut');
    if (!raw) {
      setStatus('roeHsAssembleStatus', 'Paste your handshakes first.', '#dc3545');
      if (outEl) outEl.value = '';
      return;
    }
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const result = [];
    for (const line of lines) {
      const parts = line.split(/[\s,;|\t]+/).filter(Boolean);
      if (parts.length >= 3) {
        result.push({
          peer: normalizeEmail(parts[0]),
          challenge: parts[1],
          response: parts[2]
        });
      }
    }
    if (!result.length) {
      setStatus('roeHsAssembleStatus', 'Could not parse any 3-column rows (peer challenge response).', '#dc3545');
      if (outEl) outEl.value = '';
      return;
    }
    if (outEl) outEl.value = JSON.stringify(result, null, 2);
    setStatus('roeHsAssembleStatus', `Assembled valid JSON array containing ${result.length} entry/entries. Ready to submit!`, '#198754');
  };

  window._roeHsCopyFinal = async function () {
    const el = document.getElementById('roeHsFinalOut');
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      setStatus('roeHsAssembleStatus', 'Copied submission array to clipboard!', '#198754');
    } catch {
      el.focus();
      el.select();
    }
  };
}

export async function solve(email) {
  registerHandshakeInteractive();
  const norm = normalizeEmail(email);
  const rng = createRng(`${norm}#q5-seed`);

  const peer1 = `alex.${Math.floor(rng() * 89 + 10)}@ds.study.iitm.ac.in`;
  const peer2 = `priya.${Math.floor(rng() * 89 + 10)}@es.study.iitm.ac.in`;

  const summary = [
    `Interactive HMAC Toolkit for Secret Handshake (${norm}).`,
    `Generate HMAC-SHA256 challenges, calculate responses to incoming codes, and assemble your official JSON submission array for ${norm}.`
  ].join(' ');

  const guide = [
    `## Q5 — Secret Handshake: Prove You Collaborated (for ${norm})`,
    ``,
    `### ⚡ HMAC Handshake Toolkit (Unique for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#0d1117 0%,#161b22 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#c9d1d9;border:1px solid #30363d;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#58a6ff;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 1 — Paste Your Exam Page Secret Key</div>',
    '  <input id="roeHsKey" type="text" placeholder="e.g. roe_secret_key_12345" style="width:100%;padding:10px;border-radius:8px;border:1px solid #58a6ff;background:#0d1117;color:#58a6ff;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:10px;" />',
    '  <div style="font-size:11px;color:#8b949e;margin-bottom:14px;">Tag length defaults to 16 characters per exam protocol specifications.</div>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.02);border:1px solid #30363d;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#58a6ff;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 2 — Generate Challenges for Classmates</div>',
    '  <textarea id="roeHsPeers" rows="2" placeholder="' + peer1 + ', ' + peer2 + '" style="width:100%;padding:10px;border-radius:8px;border:1px solid #30363d;background:#0d1117;color:#c9d1d9;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:10px;"></textarea>',
    '  <button onclick="window._roeHsChallenges()" style="background:#238636;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Generate Challenges</button>',
    '  <div id="roeHsChallengeStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:8px;"></div>',
    '  <textarea id="roeHsChallengeOut" readonly rows="3" style="width:100%;padding:10px;border-radius:8px;border:1px solid #30363d;background:#0d1117;color:#7ee787;font-family:monospace;font-size:13px;box-sizing:border-box;margin-top:8px;"></textarea>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.02);border:1px solid #30363d;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#58a6ff;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 3 — Respond to Incoming Challenge</div>',
    '  <input id="roeHsIncoming" type="text" placeholder="Paste 16-char challenge string sent by classmate" style="width:100%;padding:10px;border-radius:8px;border:1px solid #30363d;background:#0d1117;color:#c9d1d9;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:10px;" />',
    '  <button onclick="window._roeHsRespond()" style="background:#1f6beb;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Generate Response</button>',
    '  <div id="roeHsRespondStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:8px;"></div>',
    '  <input id="roeHsResponseOut" readonly type="text" placeholder="Your calculated response string" style="width:100%;padding:10px;border-radius:8px;border:1px solid #30363d;background:#0d1117;color:#7ee787;font-family:monospace;font-size:13px;box-sizing:border-box;margin-top:8px;" />',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.02);border:1px solid #30363d;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#58a6ff;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 4 — Assemble Final JSON Array</div>',
    '  <textarea id="roeHsFinalPairs" rows="3" placeholder="' + peer1 + '  challenge1  response1&#10;' + peer2 + '  challenge2  response2" style="width:100%;padding:10px;border-radius:8px;border:1px solid #30363d;background:#0d1117;color:#c9d1d9;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:10px;"></textarea>',
    '  <button onclick="window._roeHsAssemble()" style="background:#8957e5;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Assemble JSON Array</button>',
    '  <div id="roeHsAssembleStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:8px;"></div>',
    '  <textarea id="roeHsFinalOut" readonly rows="7" style="width:100%;padding:10px;border-radius:8px;border:1px solid #30363d;background:#0d1117;color:#7ee787;font-family:monospace;font-size:13px;box-sizing:border-box;margin-top:8px;"></textarea>',
    '  <button onclick="window._roeHsCopyFinal()" style="margin-top:8px;background:#238636;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Submission Array JSON</button>',
    '</div>'
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Secret handshake toolkit for ${norm}`,
    answerDisplay: [
      `### Q5: Secret Handshake — Prove You Collaborated`,
      ``,
      `Use the interactive HMAC toolkit below to calculate challenges, responses, and your submission array for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
