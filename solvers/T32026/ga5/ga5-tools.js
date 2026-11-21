// Pure helpers for GA5 Q2 (the 10x7 matrix) and Q3 (the ball-tracker frames file). No DOM, no network.

/* ------------------------------ Q2: the 10 x 7 matrix ------------------------------ */

export const MATRIX_ROWS = 10;
export const MATRIX_COLS = 7;
export const DOC_COUNT = 50;

/** Reads what the script printed (or what was pasted): JSON, tolerant of stray quotes, a trailing comma or a ```code fence```. */
export function parseMatrixText(raw) {
  let text = String(raw ?? '').trim().replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/, '').trim();
  if (!text) return { ok: false, message: 'Paste the matrix the script printed.' };
  if (text.length > 20000) return { ok: false, message: 'That is far too long to be a 10 × 7 matrix.' };
  text = text.replace(/,\s*([\]}])/g, '$1');
  try {
    const value = JSON.parse(text);
    return { ok: true, value };
  } catch {
    return { ok: false, message: 'That is not valid JSON. Paste exactly the line printed by python ollama_matrix.py: it starts with [[ and ends with ]].' };
  }
}

/** The exam's own rules: 10 rows of 7, indices 0-49, distinct top-3 for each model, rho in range and below 0.95. */
export function validateMatrix(value) {
  const problems = [];
  if (!Array.isArray(value) || value.length !== MATRIX_ROWS) return { ok: false, problems: [`The matrix needs exactly ${MATRIX_ROWS} rows (one per query); this has ${Array.isArray(value) ? value.length : 'none'}.`], compact: '' };
  value.forEach((row, r) => {
    const n = r + 1;
    if (!Array.isArray(row) || row.length !== MATRIX_COLS) { problems.push(`Row ${n} needs exactly ${MATRIX_COLS} numbers.`); return; }
    const idx = row.slice(0, 6);
    if (!idx.every((v) => Number.isInteger(v) && v >= 0 && v < DOC_COUNT)) problems.push(`Row ${n}: the first six numbers must be whole document numbers from 0 to ${DOC_COUNT - 1}.`);
    else {
      if (new Set(idx.slice(0, 3)).size !== 3) problems.push(`Row ${n}: the first model's top 3 must be three different documents.`);
      if (new Set(idx.slice(3, 6)).size !== 3) problems.push(`Row ${n}: the second model's top 3 must be three different documents.`);
    }
    const rho = row[6];
    if (typeof rho !== 'number' || !Number.isFinite(rho) || rho < -1 || rho > 1) problems.push(`Row ${n}: the last number (rho) must be a number between -1 and 1.`);
    else if (rho >= 0.95) problems.push(`Row ${n}: rho is ${rho}; 0.95 or more usually means the same model was used twice. Check that both models are installed.`);
  });
  return { ok: problems.length === 0, problems, compact: problems.length === 0 ? JSON.stringify(value) : '' };
}

/** The commands for the student's machine, with their own email filled in. `os` is 'windows', 'mac' or 'linux'. */
export function ollamaCommands(email, origin, os = 'windows') {
  const pull = ['ollama pull nomic-embed-text', 'ollama pull mxbai-embed-large'];
  const install = os === 'windows' ? 'pip install requests numpy' : 'pip3 install requests numpy';
  const py = os === 'windows' ? 'python' : 'python3';
  return [
    ...pull,
    install,
    `${py} ollama_matrix.py --email ${email} --host ${origin}`,
  ];
}

/* ------------------------------ Q3: the frames file ------------------------------ */

export const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const HEADER_BYTES = 20;

/**
 * The exam's binary layout: big-endian uint32 fps, frame count, three target frame numbers, then for every frame a
 * uint32 length followed by that many PNG bytes. Returns the frames as [start, length] ranges inside `bytes`.
 */
export function parseFrames(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (bytes.length < HEADER_BYTES + 8) return { ok: false, message: 'That file is too small to be your frames file.' };
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const fps = view.getUint32(0);
  const count = view.getUint32(4);
  const targets = [view.getUint32(8), view.getUint32(12), view.getUint32(16)];
  if (!(fps >= 1 && fps <= 240)) return { ok: false, message: 'That does not look like the frames file (the frame rate is not sensible). Save the response of the questionData request without changing it.' };
  if (!(count >= 1 && count <= 20000)) return { ok: false, message: 'That does not look like the frames file (the frame count is not sensible).' };
  if (targets.some((t) => t >= count)) return { ok: false, message: 'The target frame numbers are outside the file; it may be damaged or cut short.' };
  const frames = [];
  let at = HEADER_BYTES;
  for (let i = 0; i < count; i += 1) {
    if (at + 4 > bytes.length) return { ok: false, message: `The file stops early: frame ${i} of ${count} is missing (the download may be cut short).` };
    const length = view.getUint32(at);
    at += 4;
    if (length < 8 || at + length > bytes.length) return { ok: false, message: `Frame ${i} has an impossible size; the file may be damaged.` };
    if (!PNG_SIGNATURE.every((b, k) => bytes[at + k] === b)) return { ok: false, message: `Frame ${i} is not a PNG picture; this is not the frames file.` };
    frames.push([at, length]);
    at += length;
  }
  return { ok: true, fps, count, targets, frames, trailing: bytes.length - at };
}

const finiteInt = (v) => Number.isFinite(Number(v)) ? Math.round(Number(v)) : null;

/** "42; 118,203; 260,97; 301,288" from the number on the ball and the three marked centres. */
export function composeAnswer(number, points) {
  const n = String(number ?? '').trim();
  if (!/^\d{1,4}$/.test(n)) return { ok: false, message: 'Enter the number written on your ball (digits only).' };
  if (!Array.isArray(points) || points.length !== 3) return { ok: false, message: 'Mark the ball centre in all three target frames.' };
  const parts = [];
  for (let i = 0; i < 3; i += 1) {
    const x = finiteInt(points[i]?.x);
    const y = finiteInt(points[i]?.y);
    if (x === null || y === null || x < 0 || y < 0) return { ok: false, message: `Mark the ball centre in target frame ${i + 1}.` };
    parts.push(`${x},${y}`);
  }
  return { ok: true, text: `${Number(n)}; ${parts.join('; ')}` };
}

/** Maps a click on a scaled canvas back to pixel coordinates of the original frame (top-left origin). */
export function clickToPixel(clientX, clientY, rect, naturalWidth, naturalHeight) {
  if (!rect || !(rect.width > 0) || !(rect.height > 0)) return null;
  const x = Math.round(((clientX - rect.left) / rect.width) * naturalWidth - 0.5);
  const y = Math.round(((clientY - rect.top) / rect.height) * naturalHeight - 0.5);
  if (x < 0 || y < 0 || x >= naturalWidth || y >= naturalHeight) return null;
  return { x, y };
}

/** Centre of the strongly red pixels in RGBA data (to find the student's own ball in frame 0). Returns null if none. */
export function findRedBall(data, width, height) {
  let sx = 0; let sy = 0; let n = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
      if (r > 150 && r > g * 1.8 && r > b * 1.8 && data[i + 3] > 200) { sx += x; sy += y; n += 1; }
    }
  }
  return n >= 12 ? { x: Math.round(sx / n), y: Math.round(sy / n), pixels: n } : null;
}
