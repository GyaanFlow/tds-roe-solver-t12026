// Checks a face-expression model file the way the exam describes it: exactly two keys, "version" = "linear-rank-v1" and
// "weights" = 10 rows x 156 finite numbers, at most 64 KiB. The exam grader scores the accuracy later; this only catches
// format mistakes before a Check is used. Pure code: no DOM, no network.

export const APP_URL = 'https://face-expression-app-tds-p1-q8-t3-2026.streamlit.app/';
export const MODEL_VERSION = 'linear-rank-v1';
export const EXPRESSIONS = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'contempt', 'restrained-amusement', 'scepticism', 'uncertainty', 'hopelessness'];
export const ROWS = 10;
export const COLS = 156; // 78 raw features followed by 78 within-person ranks
export const MAX_BYTES = 64 * 1024;

const byteLength = (text) => (typeof TextEncoder === 'function' ? new TextEncoder().encode(text).length : Buffer.byteLength(text));

/** @param input the file/pasted text (or an already parsed object). Returns { ok, message, bytes, compact }. */
export function validateModel(input) {
  let text = null;
  let value = input;
  if (typeof input === 'string') {
    text = input.trim();
    if (!text) return { ok: false, message: 'Choose your model.json file or paste its text first.' };
    if (byteLength(text) > MAX_BYTES) return { ok: false, message: `The file is ${byteLength(text).toLocaleString('en-US')} bytes; it must be ${MAX_BYTES.toLocaleString('en-US')} bytes (64 KiB) or smaller.` };
    try { value = JSON.parse(text); } catch { return { ok: false, message: 'That is not valid JSON. Use the model.json the app gave you, unchanged.' }; }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ok: false, message: 'The model must be one JSON object with two keys: "version" and "weights".' };
  const keys = Object.keys(value).sort();
  if (keys.length !== 2 || keys[0] !== 'version' || keys[1] !== 'weights') return { ok: false, message: `The model must have exactly two keys, "version" and "weights" (this one has: ${keys.slice(0, 6).join(', ') || 'none'}).` };
  if (value.version !== MODEL_VERSION) return { ok: false, message: `"version" must be "${MODEL_VERSION}".` };
  const w = value.weights;
  if (!Array.isArray(w) || w.length !== ROWS) return { ok: false, message: `"weights" must have exactly ${ROWS} rows, one per expression (this one has ${Array.isArray(w) ? w.length : 'none'}).` };
  for (let r = 0; r < ROWS; r += 1) {
    const row = w[r];
    if (!Array.isArray(row) || row.length !== COLS) return { ok: false, message: `Row ${r + 1} (${EXPRESSIONS[r]}) must have exactly ${COLS} numbers (this one has ${Array.isArray(row) ? row.length : 'none'}).` };
    for (let c = 0; c < COLS; c += 1) {
      if (typeof row[c] !== 'number' || !Number.isFinite(row[c])) return { ok: false, message: `Row ${r + 1}, number ${c + 1} is not a finite number.` };
    }
  }
  const compact = JSON.stringify({ version: value.version, weights: w });
  if (byteLength(compact) > MAX_BYTES) return { ok: false, message: 'The model is larger than 64 KiB once written out.' };
  return { ok: true, message: `Valid: ${ROWS} × ${COLS} weights, ${byteLength(compact).toLocaleString('en-US')} bytes.`, bytes: byteLength(compact), compact };
}

/** Expected marks from the provisional scale (0 at 60% accuracy, 5 at 70%, 10 at 80% or more), for planning only. */
export function expectedBonus(accuracyPercent) {
  const a = Number(accuracyPercent);
  if (!Number.isFinite(a)) return null;
  if (a <= 60) return 0;
  if (a >= 80) return 10;
  return Math.round(((a - 60) / 20) * 10 * 100) / 100;
}
