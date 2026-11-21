// Shared "signed record" checker for the two live GA4 games (Food Court and Time Use Charts). The games' servers sign
// the record from what they observed, so nothing here can create one; the exam server verifies the signature. This only
// catches copy mistakes (broken text, someone else's record, expired record) before a Check is used.
import { cleanReceipt, decodePart } from '../p1/receipt.js';
import { escapeHtml } from '../p1/ui.js';

const B64URL = /^[A-Za-z0-9_-]+$/;
const sameEmail = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();

/** @returns { ok, record, problems[], warnings[], fields } */
export function checkRecord(raw, { email = '', now = Date.now() } = {}) {
  const record = cleanReceipt(raw);
  const out = { ok: false, record, problems: [], warnings: [], fields: {} };
  if (!record) { out.problems.push('Paste the signed record first.'); return out; }
  if (record.length > 20000) { out.record = ''; out.problems.push('That is far too long to be a signed record. Copy only the record text.'); return out; }
  if (/^https?:/i.test(record)) { out.problems.push('That is a web link, not the record. Copy the long signed text from the game page instead.'); return out; }
  const parts = record.split('.');
  if (parts.length !== 3 || !parts.every((p) => p && B64URL.test(p))) { out.problems.push('A signed record is three blocks of letters and digits joined by two dots, and it starts with "eyJ". Copy all of it again from the game.'); return out; }
  const header = decodePart(parts[0]);
  const payload = decodePart(parts[1]);
  if (!header || !payload || typeof payload !== 'object' || Array.isArray(payload)) { out.problems.push('The record text is damaged (it cannot be read). Copy it again, taking all of it.'); return out; }
  if (header.alg !== 'ES256') out.warnings.push(`This record is signed with ${String(header.alg).slice(0, 20)}, not the usual ES256. The exam may still accept it.`);
  const subject = String(payload.sub ?? payload.email ?? '').slice(0, 120);
  if (subject && email && !sameEmail(subject, email)) out.problems.push(`This record belongs to ${subject}, not to ${email}. Each student must use their own record, from their own game link.`);
  if (typeof payload.exp === 'number' && payload.exp * 1000 < now) out.problems.push('This record has expired. Open the game again and copy a fresh one.');
  out.fields = Object.fromEntries(Object.entries(payload).filter(([, v]) => ['string', 'number', 'boolean'].includes(typeof v)).slice(0, 14).map(([k, v]) => [k, String(v).slice(0, 80)]));
  out.ok = out.problems.length === 0;
  return out;
}

let emailFor = '';
const cache = new Map();

export function recordWidgetHtml(key, label, email) {
  emailFor = String(email ?? '').trim();
  return [
    `<div id="t3g4R-${key}">`,
    `<p>When the session is over, copy your signed ${escapeHtml(label)} from the game page and paste it here to catch copy mistakes before you use a Check. Nothing is sent anywhere.</p>`,
    `<textarea id="t3g4R-${key}-text" rows="3" spellcheck="false" autocomplete="off" placeholder="Paste the signed record here"></textarea>`,
    `<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3g4Rec.check('${key}')">Check my record</button><button type="button" class="p1-btn ghost" id="t3g4R-${key}-fill" disabled onclick="window._t3g4Rec.fill('${key}')">Put it in the answer box</button></div>`,
    `<div id="t3g4R-${key}-out" class="p1-status" role="status"></div>`,
    '</div>',
  ].join('');
}

export function registerRecordWidget(ids) {
  if (typeof window === 'undefined') return;
  window._t3g4RecIds = { ...(window._t3g4RecIds || {}), ...ids };
  if (window._t3g4Rec) return;
  const $ = (name) => document.getElementById(name);
  window._t3g4Rec = {
    check(key) {
      const out = $(`t3g4R-${key}-out`);
      const box = $(`t3g4R-${key}-text`);
      if (!out || !box) return;
      const result = checkRecord(box.value, { email: emailFor });
      cache.set(key, result.ok ? result.record : '');
      if ($(`t3g4R-${key}-fill`)) $(`t3g4R-${key}-fill`).disabled = !result.ok;
      const fields = Object.entries(result.fields);
      out.style.color = '';
      out.innerHTML = [
        `<strong style="color:${result.ok ? '#34d399' : '#f87171'}">${result.ok ? 'The record looks right.' : 'Not ready yet.'}</strong>`,
        ...result.problems.map((p) => `<div style="color:#f87171">❌ ${escapeHtml(p)}</div>`),
        ...result.warnings.map((w) => `<div style="color:#fbbf24">⚠️ ${escapeHtml(w)}</div>`),
        result.ok ? '<div>Copy it into the exam box, press <strong>Check</strong>, then <strong>Save</strong>. The exam server confirms the signature and shows your result.</div>' : '',
        result.ok && fields.length ? `<details><summary>What the record says</summary><div class="p1-inner">${fields.map(([k, v]) => `<div class="mono">${escapeHtml(k)}: ${escapeHtml(v)}</div>`).join('')}</div></details>` : '',
      ].join('');
      if (result.ok) box.value = result.record;
    },
    fill(key) {
      const record = cache.get(key);
      const out = $(`t3g4R-${key}-out`);
      if (!record) return;
      const qid = window._t3g4RecIds?.[key];
      const patched = qid && typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(qid, { type: 'solved', answer: record, variant: 'Signed record', answerDisplay: '### Your signed record\n\nPress **Check**, then **Save**.' });
      if (out) out.insertAdjacentHTML('beforeend', `<div>${patched ? 'Done. The answer box now has your record. Press Check, then Save.' : 'Copy the record into the exam box yourself, then press Check and Save.'}</div>`);
    },
  };
}
