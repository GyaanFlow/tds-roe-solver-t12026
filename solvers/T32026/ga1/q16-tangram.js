import { escapeHtml, rng } from './utils.js';
import { targets } from './tangram-targets.js';
import { solutions } from './tangram-solutions.js';
import {
  TANGRAM_CONFIG,
  algValue,
  computeMatchKey,
  tangramAdapter,
  tangramEnvelope,
  tangramPolygons,
} from './tangram-geometry.js';

export const id = 'q-visual-game-tangram';
export const title = 'Q16: Geometric Reasoning — Tangram';

export const GAME_URL = 'https://tds-network-games.sanand.workers.dev/tangram/';
export const ATTEST_URL = 'https://tds-network-games.sanand.workers.dev/api/visual/attest';

// Inventory order, shared by the stored tuples, the pose list and the numbered diagram.
const PIECES = [
  { id: 'large-a', label: 'Large triangle A', color: '#4f86c6' },
  { id: 'large-b', label: 'Large triangle B', color: '#5aa469' },
  { id: 'medium', label: 'Medium triangle', color: '#c46d5e' },
  { id: 'small-a', label: 'Small triangle A', color: '#d8a03d' },
  { id: 'small-b', label: 'Small triangle B', color: '#8f6bb3' },
  { id: 'square', label: 'Square', color: '#4aa6a6' },
  { id: 'parallelogram', label: 'Parallelogram', color: '#c45b8e' },
];

// The exam picks the silhouette with seedrandom(`${email}#q-visual-game-tangram`) (exact email, no lowercasing).
export function targetForEmail(email) {
  const random = rng(`${email}#q-visual-game-tangram`);
  const index = Math.floor(random() * targets.length);
  return { index, target: targets[index] || targets[0] };
}

export function posesFor(targetId) {
  const tuples = solutions[targetId];
  if (!tuples) return null;
  return tuples.map(([x, y, orientation, reflected], i) => ({ id: PIECES[i].id, x, y, orientation, reflected: reflected === 1 }));
}

function stateOf(pieces) {
  return tangramAdapter.parseCandidate(tangramEnvelope(pieces), TANGRAM_CONFIG);
}

// Checks an arrangement with the game's own validator and match-key hash.
export async function verifyArrangement(target, pieces) {
  try {
    const state = stateOf(pieces);
    const validation = tangramAdapter.validate(state, TANGRAM_CONFIG);
    if (validation.invalid) return { ok: false, reason: `invalid arrangement (${validation.errors.map((e) => e.code).join(', ')})` };
    const key = await computeMatchKey(tangramAdapter, state, TANGRAM_CONFIG);
    return key === target.matchKey ? { ok: true, key } : { ok: false, key, reason: 'match key differs from the exam target' };
  } catch (error) {
    return { ok: false, reason: error?.message || String(error) };
  }
}

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function stateBase64Url(pieces) {
  return toBase64Url(tangramAdapter.encodeCandidate(stateOf(pieces), TANGRAM_CONFIG));
}

// The game board restores a full arrangement from its URL fragment (the same format as its "save state link").
export function boardLink(pieces) {
  return `${GAME_URL}#v=1&s=${stateBase64Url(pieces)}`;
}

function fmt(value) {
  const rounded = Math.round(value * 10000) / 10000;
  return String(rounded);
}

export function describePieces(pieces) {
  return pieces.map((piece, index) => ({
    number: index + 1,
    label: PIECES[index].label,
    x: piece.x / 16,
    y: piece.y / 16,
    ticksX: piece.x,
    ticksY: piece.y,
    rotation: piece.orientation * 45,
    flipped: piece.reflected,
  }));
}

// Diagram of the stored arrangement, drawn from the game's exact polygons with numbered pieces.
export function arrangementSvg(pieces) {
  const polygons = tangramPolygons(stateOf(pieces), TANGRAM_CONFIG).map((polygon) => polygon.vertices.map((v) => [algValue(v.x), algValue(v.y)]));
  const xs = polygons.flat().map((p) => p[0]);
  const ys = polygons.flat().map((p) => p[1]);
  const minX = Math.min(...xs) - 0.5;
  const minY = Math.min(...ys) - 0.5;
  const width = Math.max(...xs) + 0.5 - minX;
  const height = Math.max(...ys) + 0.5 - minY;
  const shapes = polygons.map((points, i) => {
    const cx = points.reduce((sum, p) => sum + p[0], 0) / points.length;
    const cy = points.reduce((sum, p) => sum + p[1], 0) / points.length;
    const attr = points.map(([x, y]) => `${fmt(x - minX)},${fmt(y - minY)}`).join(' ');
    return `<polygon points="${attr}" fill="${PIECES[i].color}" stroke="#f4fff7" stroke-width="0.06" stroke-linejoin="miter"/><text x="${fmt(cx - minX)}" y="${fmt(cy - minY)}" font-size="0.9" font-family="sans-serif" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="central">${i + 1}</text>`;
  });
  return `<svg viewBox="0 0 ${fmt(width)} ${fmt(height)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Verified Tangram arrangement" >${shapes.join('')}</svg>`;
}

function decodeJwtPayload(token) {
  const parts = String(token).split('.');
  if (parts.length !== 3) throw new Error('The server returned a malformed token.');
  const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, '=')), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export class TokenError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TokenError';
    this.code = code;
  }
}

// Asks the official game server to sign the stored arrangement for this email and re-checks the receipt.
export async function requestToken({ email, target, pieces, fetchImpl = globalThis.fetch, timeoutMs = 30000 }) {
  if (typeof fetchImpl !== 'function') throw new TokenError('NO_FETCH', 'This browser cannot make network requests.');
  const verification = await verifyArrangement(target, pieces);
  if (!verification.ok) throw new TokenError('BAD_ARRANGEMENT', `The stored arrangement failed local verification: ${verification.reason}.`);
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  let response;
  try {
    response = await fetchImpl(ATTEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller?.signal,
      body: JSON.stringify({
        email,
        game: TANGRAM_CONFIG.game,
        game_version: TANGRAM_CONFIG.game_version,
        config_id: TANGRAM_CONFIG.config_id,
        state_version: TANGRAM_CONFIG.state_version,
        equivalence_version: TANGRAM_CONFIG.equivalence_version,
        state: stateBase64Url(pieces),
        client_report: { schema_version: 1, started_at: new Date().toISOString(), total_events: 0, included_events: 0, omitted_events: 0, truncated: false, events: [] },
      }),
    });
  } catch (error) {
    throw new TokenError('NETWORK', error?.name === 'AbortError' ? 'The game server did not answer in time. Try again.' : `Could not reach the game server (${error?.message || 'network error'}).`);
  } finally {
    if (timer) clearTimeout(timer);
  }
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (response.status === 429) throw new TokenError('RATE_LIMITED', 'The game server is rate-limiting requests. Wait a minute and try again.');
  if (!response.ok || !data) throw new TokenError(`HTTP_${response.status}`, `The game server returned ${response.status}${data?.message ? `: ${String(data.message).slice(0, 120)}` : ''}.`);
  if (data.invalid !== false || (Array.isArray(data.errors) && data.errors.length) || !data.receipt) {
    throw new TokenError('REJECTED', 'The game server did not accept the arrangement.');
  }
  if (data.match_key !== target.matchKey) throw new TokenError('MISMATCH', 'The server hashed a different shape than your assigned target, so the token was not accepted here.');
  let payload;
  try {
    payload = decodeJwtPayload(data.receipt);
  } catch (error) {
    throw new TokenError('BAD_TOKEN', error.message);
  }
  if (String(payload.sub ?? '').trim().toLowerCase() !== String(email).trim().toLowerCase()) {
    throw new TokenError('WRONG_EMAIL', 'The signed token is for a different email address.');
  }
  return { token: data.receipt, payload };
}

const CSS = `<style>
.q16{--q-accent:var(--theme-primary,#3b82f6);--q-line:var(--border,rgba(255,255,255,.14));color:var(--text-primary,#e6edf7);font-size:14px;line-height:1.55}
.q16 *{box-sizing:border-box}
.q16-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin:0 0 14px}
.q16-title{font-size:1.25rem;font-weight:750;margin:0 8px 0 0;letter-spacing:-.01em}
.q16-chip{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:650;border:1px solid var(--q-line);background:rgba(255,255,255,.04);color:var(--text-secondary,#a1a1aa)}
.q16-chip.ok{color:#34d399;border-color:rgba(52,211,153,.5);background:rgba(52,211,153,.1)}
.q16-card{border:1px solid var(--q-line);border-radius:14px;padding:16px;background:rgba(255,255,255,.03);margin:0 0 14px}
.q16-token{border-color:rgba(52,211,153,.55);background:linear-gradient(135deg,rgba(52,211,153,.12),rgba(255,255,255,.02));box-shadow:0 0 24px rgba(52,211,153,.12)}
.q16-todo{border-color:var(--q-accent);background:linear-gradient(135deg,rgba(77,166,255,.1),rgba(255,255,255,.02))}
.q16-kicker{font-size:11px;font-weight:750;letter-spacing:.12em;text-transform:uppercase;color:var(--text-secondary,#a1a1aa);margin:0 0 6px}
.q16-token .q16-kicker{color:#34d399}
.q16-card p{margin:0 0 10px}
.q16-card p:last-child{margin-bottom:0}
.q16-box{width:100%;min-height:84px;resize:vertical;padding:10px 12px;border-radius:10px;border:1px solid var(--q-line);background:rgba(0,0,0,.35);color:inherit;font:12px/1.5 ui-monospace,Menlo,Consolas,monospace;word-break:break-all}
.q16-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 18px;border-radius:10px;border:1px solid var(--q-accent);background:var(--q-accent);color:#000;font:inherit;font-weight:750;cursor:pointer;transition:transform .15s ease,opacity .15s ease}
.q16-btn:hover{transform:translateY(-1px)}
.q16-btn:disabled{opacity:.55;cursor:progress;transform:none}
.q16-btn.ghost{background:transparent;color:var(--q-accent)}
.q16-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.q16-status{min-height:20px;margin-top:10px;font-size:13px}
.q16-note{padding:8px 12px;margin:0 0 10px;border-radius:10px;border:1px solid rgba(245,158,11,.5);background:rgba(245,158,11,.1);color:#fbbf24;font-size:13px}
.q16-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin:0 0 14px}
.q16-grid .q16-card{margin:0;display:flex;flex-direction:column;gap:10px}
.q16-fig{display:flex;align-items:center;justify-content:center;min-height:200px;border-radius:10px;background:#0d140e;padding:10px}
.q16-fig svg{width:100%;max-width:340px;height:auto;max-height:300px}
.q16-cap{font:12px ui-monospace,Menlo,Consolas,monospace;color:var(--text-secondary,#a1a1aa);text-align:center}
.q16 details{border:1px solid var(--q-line);border-radius:12px;margin:0 0 10px;background:rgba(255,255,255,.02)}
.q16 summary{cursor:pointer;padding:10px 14px;font-weight:650;list-style:none}
.q16 summary::-webkit-details-marker{display:none}
.q16 summary::before{content:'▸';display:inline-block;margin-right:8px;color:var(--q-accent);transition:transform .15s}
.q16 details[open]>summary::before{transform:rotate(90deg)}
.q16 .q16-inner{padding:0 14px 14px;overflow-x:auto}
.q16 table{border-collapse:collapse;width:100%;font-size:13px}
.q16 th{text-align:left;font-weight:650;color:var(--text-secondary,#a1a1aa);padding:6px 10px;border-bottom:1px solid var(--q-line)}
.q16 td{padding:6px 10px;border-bottom:1px solid rgba(255,255,255,.06)}
.q16 td.mono{font-family:ui-monospace,Menlo,Consolas,monospace}
.q16 .sw{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:8px;vertical-align:baseline}
.q16 ol{margin:0;padding-left:20px}
.q16 ol li{margin:0 0 6px}
.q16 a{color:var(--q-accent)}
.q16 pre{margin:0;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.35);font:12px/1.5 ui-monospace,Menlo,Consolas,monospace;overflow-x:auto;white-space:pre-wrap;word-break:break-all}
.q16-foot{font-size:12px;color:var(--text-secondary,#a1a1aa)}
@media (max-width:480px){.q16-card{padding:12px}.q16-btn{width:100%}}
@media (prefers-reduced-motion:reduce){.q16-btn,.q16 summary::before{transition:none}}
</style>`;

// Crops the silhouette to its own bounding box so it fills the card instead of floating in a 768x576 canvas.
export function silhouetteSvg(svgPath) {
  const numbers = (String(svgPath).match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const xs = numbers.filter((_, i) => i % 2 === 0);
  const ys = numbers.filter((_, i) => i % 2 === 1);
  const pad = 12;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const width = Math.max(...xs) - Math.min(...xs) + pad * 2;
  const height = Math.max(...ys) - Math.min(...ys) + pad * 2;
  return `<svg viewBox="${minX} ${minY} ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Target silhouette"><path d="${escapeHtml(svgPath)}" fill="#22c55e" stroke="#4ade80" stroke-width="2" fill-rule="evenodd"/></svg>`;
}

function placementTable(pieces) {
  const rows = describePieces(pieces).map((row, i) => `<tr><td><span class="sw" style="background:${PIECES[i].color}"></span>${row.number}</td><td>${escapeHtml(row.label)}</td><td class="mono">${fmt(row.x)}, ${fmt(row.y)}</td><td>${row.rotation}°</td><td>${row.flipped ? 'yes' : 'no'}</td></tr>`);
  return `<table><thead><tr><th>#</th><th>Piece</th><th>Position (x, y)</th><th>Rotate</th><th>Flip</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

function tokenCard(email, token, note, hasArrangement) {
  if (token) {
    return `<div class="q16-card q16-token"><div class="q16-kicker">Signed completion token</div><p>Ready for <strong>${escapeHtml(email)}</strong>. Paste it into the exam's token box and press <strong>Check</strong>.</p><textarea id="t3q16Token" class="q16-box" readonly rows="4" spellcheck="false">${escapeHtml(token)}</textarea><div class="q16-actions"><button type="button" id="t3q16Copy" class="q16-btn" onclick="window._t3ga1q16Copy()">📋 Copy token</button></div><div id="t3q16Status" class="q16-status" role="status"></div></div>`;
  }
  if (!hasArrangement) {
    return `<div class="q16-card q16-todo"><div class="q16-kicker">Build it by hand</div><p>No stored arrangement for this silhouette yet. Open the <a href="${GAME_URL}" target="_blank" rel="noopener noreferrer">official board</a>, enter <code>${escapeHtml(email)}</code>, drag the seven pieces into the outline (rotate with Q/E, flip the parallelogram with F), press <strong>Generate signed payload</strong> and paste the token into the exam.</p></div>`;
  }
  return `<div id="t3q16Root" data-email="${escapeHtml(email)}" class="q16-card q16-todo"><div class="q16-kicker">Get your signed token</div>${note ? `<div class="q16-note">⚠️ ${escapeHtml(note)}</div>` : ''}<p>One click asks the official game server to sign the verified arrangement for your email. Nothing else is sent and nothing is stored.</p><div class="q16-actions"><button type="button" id="t3q16Go" class="q16-btn" onclick="window._t3ga1q16Sign()">⚡ Get signed token</button><button type="button" id="t3q16Copy" class="q16-btn ghost" onclick="window._t3ga1q16Copy()" style="display:none">📋 Copy token</button></div><div id="t3q16Status" class="q16-status" role="status"></div><textarea id="t3q16Token" class="q16-box" readonly rows="4" spellcheck="false" style="display:none;margin-top:10px"></textarea></div>`;
}

function buildGuide(email, target, pieces, token, note = '') {
  const parts = [
    CSS,
    '<div class="q16">',
    `<div class="q16-head"><h2 class="q16-title">🧩 Tangram</h2><span class="q16-chip">${escapeHtml(target.id)}</span><span class="q16-chip">${escapeHtml(target.family)}</span>${pieces ? '<span class="q16-chip ok">✓ Verified arrangement</span>' : '<span class="q16-chip">Manual build</span>'}</div>`,
    tokenCard(email, token, note, Boolean(pieces)),
    '<div class="q16-grid">',
    `<div class="q16-card"><div class="q16-kicker">Your target</div><div class="q16-fig">${silhouetteSvg(target.svgPath)}</div><div class="q16-cap">${escapeHtml(target.id)} · ${escapeHtml(target.family)}</div></div>`,
  ];
  if (pieces) {
    parts.push(`<div class="q16-card"><div class="q16-kicker">Arrangement</div><div class="q16-fig">${arrangementSvg(pieces)}</div><div class="q16-cap">match key ${escapeHtml(target.matchKey.slice(0, 12))}…</div></div>`);
  }
  parts.push('</div>');
  if (pieces) {
    parts.push(
      `<details><summary>How to finish — three ways</summary><div class="q16-inner"><ol><li><strong>Get signed token</strong> above (or it may already be filled in) — the token also lands in the Answer box.</li><li><strong>Pre-assembled board:</strong> <a href="${boardLink(pieces)}" target="_blank" rel="noopener noreferrer">open the official board with your pieces in place</a>, enter <code>${escapeHtml(email)}</code>, press <em>Generate signed payload</em> and paste the token into the exam.</li><li><strong>By hand:</strong> use the placement table (positions are in board units; drag, rotate with Q/E, flip the parallelogram with F).</li></ol></div></details>`,
      `<details><summary>Placement table</summary><div class="q16-inner">${placementTable(pieces)}</div></details>`,
      `<details><summary>State JSON (for WebMCP / automation)</summary><div class="q16-inner"><pre>${escapeHtml(JSON.stringify(tangramEnvelope(pieces)))}</pre></div></details>`,
    );
  }
  parts.push('<div class="q16-foot">Checked against the exam\'s own match key with the game\'s exact geometry. The exam\'s grader makes the final check on the token for your registered email.</div>', '</div>');
  return parts.join('');
}

function registerQ16Interactive() {
  if (typeof window === 'undefined' || window._t3ga1q16Registered) return;
  window._t3ga1q16Registered = true;

  window._t3ga1q16Sign = async function t3ga1q16Sign() {
    const root = document.getElementById('t3q16Root');
    if (!root) return;
    const email = root.dataset.email || '';
    const button = document.getElementById('t3q16Go');
    const status = document.getElementById('t3q16Status');
    const box = document.getElementById('t3q16Token');
    const copy = document.getElementById('t3q16Copy');
    const show = (text, color) => {
      if (!status) return;
      status.style.color = color;
      status.textContent = text;
    };
    const { target } = targetForEmail(email);
    const pieces = posesFor(target.id);
    if (!pieces) {
      show('No stored arrangement for this silhouette — use the manual steps below.', '#e5484d');
      return;
    }
    if (button) button.disabled = true;
    show('Asking the official game server to sign your arrangement…', '#4da6ff');
    try {
      const { token } = await requestToken({ email, target, pieces });
      if (box) {
        box.value = token;
        box.style.display = 'block';
      }
      if (copy) copy.style.display = 'inline-block';
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, solvedResult(email, target, pieces, token));
      show(patched ? 'Signed. The token is now in the Answer box — paste it into the exam and press Check.' : 'Signed. Copy the token below into the exam and press Check.', '#198754');
    } catch (error) {
      show(error?.message || 'Could not get a signed token.', '#e5484d');
    } finally {
      if (button) button.disabled = false;
    }
  };

  window._t3ga1q16Copy = async function t3ga1q16Copy() {
    const box = document.getElementById('t3q16Token');
    const status = document.getElementById('t3q16Status');
    if (!box) return;
    try {
      await navigator.clipboard.writeText(box.value);
      if (status) status.textContent = 'Copied.';
    } catch {
      box.select();
      if (status) status.textContent = 'Press Ctrl+C to copy the selected token.';
    }
  };
}

function solvedResult(email, target, pieces, token) {
  const guide = buildGuide(email, target, pieces, token);
  return {
    type: 'solved',
    answer: token,
    variant: `Signed token for ${target.id} (${target.family})`,
    guide,
    answerDisplay: `### Signed completion token

\`\`\`text
${token}
\`\`\`

Paste it into the exam's token box and press **Check**.`,
    usesHostedApi: true,
  };
}

const tokenCache = new Map();

// Real browsers only: Node (tests, tooling) reports a "Node.js/…" user agent and must never call the game server.
function inRealBrowser() {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && /^Mozilla\//.test(String(navigator.userAgent || ''));
}

// In the browser the solver asks the official game server for the signed token itself, so the Answer
// box is filled with no click. Node (tests) and any failure fall back to the guide + button.
export async function solve(email) {
  registerQ16Interactive();
  const { target, index } = targetForEmail(email);
  const pieces = posesFor(target.id);
  const verification = pieces ? await verifyArrangement(target, pieces) : null;
  if (pieces && !verification.ok) {
    throw new Error(`Stored Tangram arrangement for ${target.id} failed verification: ${verification.reason}.`);
  }
  let note = '';
  if (pieces && inRealBrowser()) {
    try {
      let token = tokenCache.get(email);
      if (!token) {
        ({ token } = await requestToken({ email, target, pieces, timeoutMs: 15000 }));
        tokenCache.set(email, token);
      }
      return { ...solvedResult(email, target, pieces, token), debug: { targetId: target.id, targetIndex: index, verified: true, matchKey: verification.key, autoSigned: true } };
    } catch (error) {
      note = `Automatic signing did not complete (${String(error?.message || 'unknown error').replace(/[.\s]+$/, '')}). Press “Get signed token” to retry.`;
    }
  }
  const guide = buildGuide(email, target, pieces, null, note);
  return {
    type: 'guide',
    answer: pieces
      ? `Click “Get signed token” in the guide, or open the pre-assembled board: ${boardLink(pieces)}`
      : `No stored arrangement for ${target.id}: build the silhouette on the official board (${GAME_URL}).`,
    guide,
    variant: pieces ? `Verified arrangement for ${target.id} (${target.family}) + one-click signing` : `Target ${target.id} (${target.family}) — manual build`,
    answerDisplay: guide,
    usesHostedApi: Boolean(pieces),
    debug: { targetId: target.id, targetIndex: index, verified: Boolean(verification?.ok), matchKey: verification?.key ?? null },
  };
}
