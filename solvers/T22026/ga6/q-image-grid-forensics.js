import { normalizeEmail } from './utils.js';

export const id = 'q-rotated-image-grid-forensics-server';
export const title = 'Q1: Image Forensics — Recover a Rotated and Mirrored Grid';

const GRID = 6;
const TILE_PX = 100;
const EDGE_SAMPLES = 16;
const BEAM_WIDTH = 6;
// Edge-colour continuity alone cannot tell the true assembly apart from its own 180°-rotated
// (or mirrored) equivalent — every internal seam score is identical either way, since it's a
// purely local/relative signal with no absolute anchor. Only the placard's designed border
// pattern breaks that symmetry, so this penalty must be large enough to reliably win — which
// is safe as long as `looksLikeBorder()` is specific enough to almost never false-positive on
// ordinary photo content (see its stricter criteria below).
const BORDER_MISMATCH_PENALTY = 60000;

// --- Pure geometry / pixel helpers (no DOM) ---------------------------------------------

function rotate90(src, size) {
  // Rotates an RGBA Uint8ClampedArray (size x size) 90 degrees clockwise.
  const out = new Uint8ClampedArray(src.length);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const srcIdx = (y * size + x) * 4;
      const dstX = size - 1 - y;
      const dstY = x;
      const dstIdx = (dstY * size + dstX) * 4;
      out[dstIdx] = src[srcIdx];
      out[dstIdx + 1] = src[srcIdx + 1];
      out[dstIdx + 2] = src[srcIdx + 2];
      out[dstIdx + 3] = src[srcIdx + 3];
    }
  }
  return out;
}

function mirrorHorizontal(src, size) {
  const out = new Uint8ClampedArray(src.length);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const srcIdx = (y * size + x) * 4;
      const dstIdx = (y * size + (size - 1 - x)) * 4;
      out[dstIdx] = src[srcIdx];
      out[dstIdx + 1] = src[srcIdx + 1];
      out[dstIdx + 2] = src[srcIdx + 2];
      out[dstIdx + 3] = src[srcIdx + 3];
    }
  }
  return out;
}

// All 8 D4 orientations of a size x size RGBA buffer: 4 rotations, each with/without mirror.
function allOrientations(pixels, size) {
  const variants = [];
  let current = pixels;
  for (let rot = 0; rot < 4; rot++) {
    variants.push(current);
    variants.push(mirrorHorizontal(current, size));
    if (rot < 3) current = rotate90(current, size);
  }
  return variants;
}

function sampleEdge(pixels, size, side) {
  // Returns EDGE_SAMPLES evenly spaced [r,g,b] triples along one edge, always read in a
  // fixed canonical direction (top/bottom: left-to-right; left/right: top-to-bottom) from
  // THIS buffer's own orientation — since we enumerate all 8 orientations up front, no
  // separate "reversed" case is needed at comparison time.
  const samples = [];
  for (let i = 0; i < EDGE_SAMPLES; i++) {
    const t = Math.round((i * (size - 1)) / (EDGE_SAMPLES - 1));
    let x, y;
    if (side === 'top') { x = t; y = 0; }
    else if (side === 'bottom') { x = t; y = size - 1; }
    else if (side === 'left') { x = 0; y = t; }
    else { x = size - 1; y = t; } // right
    const idx = (y * size + x) * 4;
    samples.push([pixels[idx], pixels[idx + 1], pixels[idx + 2]]);
  }
  return samples;
}

function edgeDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const dr = a[i][0] - b[i][0];
    const dg = a[i][1] - b[i][1];
    const db = a[i][2] - b[i][2];
    sum += dr * dr + dg * dg + db * db;
  }
  return sum;
}

function looksLikeBorder(edgeSamples) {
  // Deliberately strict: a designed "dark solid border" is near-black and near-uniform along
  // its whole length. Ordinary photo content can have a dark patch here and there, but rarely
  // stays uniformly near-black across nearly the entire sampled edge — requiring both nearly
  // all samples to be very dark AND low brightness variance keeps false positives rare, which
  // is what lets this signal safely carry a large, symmetry-breaking weight (see the penalty
  // constant above) instead of just being a soft tie-breaker.
  const brightness = edgeSamples.map(([r, g, b]) => (r + g + b) / 3);
  const veryDarkCount = brightness.filter(v => v < 40).length;
  if (veryDarkCount < edgeSamples.length * 0.875) return false;
  const min = Math.min(...brightness);
  const max = Math.max(...brightness);
  return (max - min) < 30;
}

// --- Canvas-backed tile extraction / orientation rendering ------------------------------

function extractTilesFromCanvas(ctx) {
  const tiles = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const imageData = ctx.getImageData(col * TILE_PX, row * TILE_PX, TILE_PX, TILE_PX);
      tiles.push(imageData.data);
    }
  }
  return tiles;
}

function precomputeOrientations(tiles) {
  // For each of the 36 tiles, all 8 oriented pixel buffers plus their 4 edge signatures.
  return tiles.map(pixels => {
    const orientations = allOrientations(pixels, TILE_PX);
    return orientations.map(px => ({
      pixels: px,
      edges: {
        top: sampleEdge(px, TILE_PX, 'top'),
        bottom: sampleEdge(px, TILE_PX, 'bottom'),
        left: sampleEdge(px, TILE_PX, 'left'),
        right: sampleEdge(px, TILE_PX, 'right')
      }
    }));
  });
}

// --- Beam-search assembly ----------------------------------------------------------------

function solveLayout(tileOrientations, onProgress) {
  const positions = [];
  for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) positions.push([r, c]);

  // Each beam state: { placements: Map(posIndex -> {tileIdx, orientIdx}), usedTiles: Set, score }
  let beam = [{ placements: new Map(), usedTiles: new Set(), score: 0 }];

  for (let posIdx = 0; posIdx < positions.length; posIdx++) {
    const [r, c] = positions[posIdx];
    const needsTopBorder = r === 0;
    const needsBottomBorder = r === GRID - 1;
    const needsLeftBorder = c === 0;
    const needsRightBorder = c === GRID - 1;

    const nextCandidates = [];

    for (const state of beam) {
      const leftPlacement = c > 0 ? state.placements.get(posIdx - 1) : null;
      const topPlacement = r > 0 ? state.placements.get(posIdx - GRID) : null;
      const leftEdge = leftPlacement
        ? tileOrientations[leftPlacement.tileIdx][leftPlacement.orientIdx].edges.right
        : null;
      const topEdge = topPlacement
        ? tileOrientations[topPlacement.tileIdx][topPlacement.orientIdx].edges.bottom
        : null;

      for (let tileIdx = 0; tileIdx < tileOrientations.length; tileIdx++) {
        if (state.usedTiles.has(tileIdx)) continue;
        const orientations = tileOrientations[tileIdx];
        for (let orientIdx = 0; orientIdx < orientations.length; orientIdx++) {
          const candidate = orientations[orientIdx];
          let localScore = 0;

          // Edge-colour continuity is the primary, highly discriminative signal (a true
          // matching seam scores orders of magnitude lower than a wrong one) — this must
          // always dominate. The border heuristic is comparatively unreliable (a real photo
          // can have naturally dark regions anywhere, not just at the placard's edge), so it
          // is applied only as a SMALL nudge on outward-facing edges at border positions,
          // never as a penalty on interior tiles for merely looking dark.
          if (leftEdge) localScore += edgeDistance(leftEdge, candidate.edges.left);
          if (topEdge) localScore += edgeDistance(topEdge, candidate.edges.top);

          if (needsTopBorder && !looksLikeBorder(candidate.edges.top)) localScore += BORDER_MISMATCH_PENALTY;
          if (needsBottomBorder && !looksLikeBorder(candidate.edges.bottom)) localScore += BORDER_MISMATCH_PENALTY;
          if (needsLeftBorder && !looksLikeBorder(candidate.edges.left)) localScore += BORDER_MISMATCH_PENALTY;
          if (needsRightBorder && !looksLikeBorder(candidate.edges.right)) localScore += BORDER_MISMATCH_PENALTY;

          nextCandidates.push({ state, tileIdx, orientIdx, addedScore: localScore });
        }
      }
    }

    nextCandidates.sort((a, b) => (a.state.score + a.addedScore) - (b.state.score + b.addedScore));

    const newBeam = [];
    const seenSignatures = new Set();
    for (const cand of nextCandidates) {
      if (newBeam.length >= BEAM_WIDTH) break;
      const placements = new Map(cand.state.placements);
      placements.set(posIdx, { tileIdx: cand.tileIdx, orientIdx: cand.orientIdx });
      const usedTiles = new Set(cand.state.usedTiles);
      usedTiles.add(cand.tileIdx);
      // Dedupe beam states that placed the same tile set in the same way so far (can happen
      // when multiple parent states converge) — keeps the beam diverse rather than wasting
      // width on near-duplicate paths.
      const signature = [...placements.entries()].map(([k, v]) => `${k}:${v.tileIdx}:${v.orientIdx}`).join(',');
      if (seenSignatures.has(signature)) continue;
      seenSignatures.add(signature);
      newBeam.push({ placements, usedTiles, score: cand.state.score + cand.addedScore });
    }
    beam = newBeam;
    if (onProgress) onProgress(posIdx + 1, positions.length);
  }

  beam.sort((a, b) => a.score - b.score);
  return beam[0];
}

// --- DOM-facing orchestration --------------------------------------------------------------

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not decode the uploaded image — is it a valid BMP/PNG?')); };
    img.src = url;
  });
}

function renderTileToCanvas(pixels) {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_PX;
  canvas.height = TILE_PX;
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(new Uint8ClampedArray(pixels), TILE_PX, TILE_PX);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

async function extractTokenViaOcr(canvas) {
  // Lazy-load Tesseract.js from CDN only when actually needed (same pattern this project
  // already uses for DuckDB-WASM/JSZip) — most students will never trigger this path unless
  // they actually upload a file.
  const { default: Tesseract } = await import('https://cdn.jsdelivr.net/npm/tesseract.js@5/+esm');
  const { data } = await Tesseract.recognize(canvas, 'eng');
  const text = (data && data.text) || '';
  const match = text.match(/OPS[-\s]?[A-Z0-9]{10}/i);
  if (!match) return null;
  // Normalize whatever separator/spacing OCR produced back to the canonical OPS-XXXXXXXXXX.
  const compact = match[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `OPS-${compact.slice(3)}`;
}

// Whole-image D4 transforms (applied to the FULLY ASSEMBLED canvas, not a single tile) — used
// to let the user manually fix a global rotation/mirror that pure edge-matching can never
// resolve on its own: a uniform border only proves "this edge faces outward," it can never
// distinguish the true layout from its own whole-grid 180°-rotated (or mirrored) twin, since
// both look identically bordered on every side. Only an asymmetric feature elsewhere on the
// placard could break that tie algorithmically, and this solver has no reliable way to detect
// one generically — so a one-click manual fix is the honest, robust answer instead of pretending
// the automatic orientation is always trustworthy.
function rotateCanvas90(sourceCanvas) {
  const out = document.createElement('canvas');
  out.width = sourceCanvas.height;
  out.height = sourceCanvas.width;
  const ctx = out.getContext('2d');
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);
  return out;
}

function mirrorCanvasHorizontal(sourceCanvas) {
  const out = document.createElement('canvas');
  out.width = sourceCanvas.width;
  out.height = sourceCanvas.height;
  const ctx = out.getContext('2d');
  ctx.translate(out.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(sourceCanvas, 0, 0);
  return out;
}

function registerQ1Interactive() {
  if (typeof window === 'undefined' || window._ga6q1Registered) return;
  window._ga6q1Registered = true;

  function setStatus(text, color) {
    const statusEl = document.getElementById('ga6q1Status');
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.style.color = color || '#9fc6ff';
    }
  }

  async function rerunOcrOnCurrentCanvas() {
    const previewEl = document.getElementById('ga6q1Preview');
    const resultEl = document.getElementById('ga6q1Result');
    if (!window._ga6q1Canvas) return;
    if (previewEl) previewEl.src = window._ga6q1Canvas.toDataURL('image/png');
    setStatus('Running OCR on the transformed image to read the token…');
    let token = null;
    try {
      token = await extractTokenViaOcr(window._ga6q1Canvas);
    } catch (ocrErr) {
      console.warn('OCR failed:', ocrErr);
    }
    if (token) {
      setStatus(`✅ Read the token automatically.`, '#198754');
      if (resultEl) {
        resultEl.innerHTML = `<strong style="color:#86efac;">Recovered token:</strong> <code style="font-size:16px;background:#0b1930;padding:4px 10px;border-radius:6px;">${token}</code>`;
      }
    } else {
      setStatus(`⚠️ Automatic OCR couldn't confidently read the token — read it yourself from the image above.`, '#d97706');
      if (resultEl) {
        resultEl.innerHTML = `<strong style="color:#fbbf24;">Read the token from the image above.</strong> If it still doesn't look coherent, use the rotate/flip buttons, or a tile may be misplaced (see notes below).`;
      }
    }
  }

  window._ga6q1Transform = async function (kind) {
    if (!window._ga6q1Canvas) return;
    if (kind === 'rotate') {
      window._ga6q1Canvas = rotateCanvas90(window._ga6q1Canvas);
    } else if (kind === 'mirror') {
      window._ga6q1Canvas = mirrorCanvasHorizontal(window._ga6q1Canvas);
    }
    await rerunOcrOnCurrentCanvas();
  };

  window._ga6q1Solve = async function (input) {
    const previewEl = document.getElementById('ga6q1Preview');
    const resultEl = document.getElementById('ga6q1Result');
    const transformBarEl = document.getElementById('ga6q1TransformBar');
    const file = input?.files?.[0];
    if (!file) return;

    try {
      setStatus('Loading image…');
      const img = await loadImageFromFile(file);
      if (img.naturalWidth !== GRID * TILE_PX || img.naturalHeight !== GRID * TILE_PX) {
        setStatus(`⚠️ Expected a ${GRID * TILE_PX}×${GRID * TILE_PX} image, got ${img.naturalWidth}×${img.naturalHeight}. Proceeding anyway, but this may not be the right file.`, '#d97706');
      }

      const canvas = document.createElement('canvas');
      canvas.width = GRID * TILE_PX;
      canvas.height = GRID * TILE_PX;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      setStatus('Splitting into 36 tiles and enumerating 8 orientations each…');
      const tiles = extractTilesFromCanvas(ctx);
      const tileOrientations = precomputeOrientations(tiles);

      setStatus('Solving the 6×6 layout (beam search over edge-colour compatibility)…');
      await new Promise(r => setTimeout(r, 0)); // yield so the status text actually paints
      const best = solveLayout(tileOrientations);

      setStatus('Reassembling the reconstructed image…');
      const outCanvas = document.createElement('canvas');
      outCanvas.width = GRID * TILE_PX;
      outCanvas.height = GRID * TILE_PX;
      const outCtx = outCanvas.getContext('2d');
      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          const posIdx = r * GRID + c;
          const placement = best.placements.get(posIdx);
          const oriented = tileOrientations[placement.tileIdx][placement.orientIdx];
          const tileCanvas = renderTileToCanvas(oriented.pixels);
          outCtx.drawImage(tileCanvas, c * TILE_PX, r * TILE_PX);
        }
      }

      window._ga6q1Canvas = outCanvas;
      if (previewEl) {
        previewEl.src = outCanvas.toDataURL('image/png');
        previewEl.style.display = 'block';
      }
      if (transformBarEl) transformBarEl.style.display = 'flex';

      setStatus('Running OCR on the reconstructed image to read the token…');
      let token = null;
      try {
        token = await extractTokenViaOcr(outCanvas);
      } catch (ocrErr) {
        console.warn('OCR failed:', ocrErr);
      }

      if (token) {
        setStatus(`✅ Reconstructed and read the token automatically.`, '#198754');
        if (resultEl) {
          resultEl.innerHTML = `<strong style="color:#86efac;">Recovered token:</strong> <code style="font-size:16px;background:#0b1930;padding:4px 10px;border-radius:6px;">${token}</code>`;
        }
      } else {
        setStatus(`⚠️ Reconstruction complete, but automatic OCR couldn't confidently read the token — read it yourself from the image above (it may be rendered slightly imperfectly if a couple of tiles were misplaced, or the WHOLE image may need a quick rotate/flip below — relative tile placement and global orientation are solved separately).`, '#d97706');
        if (resultEl) {
          resultEl.innerHTML = `<strong style="color:#fbbf24;">Read the token from the reconstructed image above.</strong> If it looks like a coherent picture but sideways/upside-down/mirrored, use the rotate/flip buttons below — that's a normal, expected step, not a bug. If it looks scrambled (not a coherent picture at all), a tile or two may be misplaced instead.`;
        }
      }
    } catch (err) {
      setStatus(`❌ ${err.message}`, '#dc3545');
      if (resultEl) resultEl.innerHTML = '';
    }
  };
}

export async function solve(email) {
  registerQ1Interactive();
  const norm = normalizeEmail(email);

  const summary = [
    `Download your private scrambled 6×6 forensic-grid BMP from the live exam page (not from`,
    `here — the image is generated per-student and only released via an authenticated`,
    `\`questionData\` request tied to your login session), then upload it below — this solver`,
    `splits it into 36 tiles, tries all 8 orientations per tile, solves the 6×6 layout via a`,
    `beam search over edge-colour compatibility, reassembles the image, and OCRs the token`,
    `directly in your browser.`
  ].join(' ');

  const guide = [
    `## Q1 — Rotated Image-Grid Forensics (for ${norm})`,
    ``,
    `### Why this can't run without your file`,
    `The 600×600 BMP is generated and scrambled uniquely per student, downloaded only via an`,
    `authenticated \`questionData?email=...&quizSign=...\` request on the live exam page — this`,
    `offline tool has no access to that session and cannot fetch it for you. Once you have the`,
    `file on your own computer, though, everything below runs **entirely in your browser** —`,
    `nothing is uploaded anywhere.`,
    ``,
    `### 🚀 Upload your BMP — solve it automatically`,
    ``,
    '<div style="background:linear-gradient(135deg,#0f2444 0%,#1a3a6b 100%);border-radius:14px;padding:24px 28px;margin:18px 0;color:#e8f0fe;border:1px solid #2d4d80;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#4da6ff;text-transform:uppercase;margin-bottom:14px;font-weight:700;">🧭 Before you upload</div>',
    '  <ol style="margin:0 0 18px;padding-left:20px;font-size:14px;line-height:1.8;color:#dbe9ff;">',
    `    <li>Log into the real TDS exam page with your own account and download your assigned puzzle BMP — <strong>do not</strong> re-save, recompress, or edit it first (this corrupts the exact colour signature the solver relies on).</li>`,
    `    <li>Click <strong>"Choose File"</strong> below and select that exact downloaded file.</li>`,
    `    <li>Wait a few seconds while it splits, tries all 8 orientations per tile, and solves the layout — a status line below shows progress.</li>`,
    `    <li>An OCR pass tries to read the token automatically; if it can't, the reconstructed image is still shown so you can read it yourself.</li>`,
    '  </ol>',
    '  <input id="ga6q1File" type="file" accept="image/bmp,image/png,image/*" onchange="window._ga6q1Solve(this)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#e8f0fe;font-size:13px;box-sizing:border-box;" />',
    '  <div id="ga6q1Status" style="margin-top:12px;font-size:13px;min-height:18px;font-weight:600;"></div>',
    '  <div id="ga6q1Result" style="margin-top:8px;font-size:14px;"></div>',
    '  <img id="ga6q1Preview" style="display:none;margin-top:14px;max-width:100%;border-radius:8px;border:1px solid #3d5f96;" alt="Reconstructed grid" />',
    '  <div id="ga6q1TransformBar" style="display:none;gap:8px;margin-top:12px;flex-wrap:wrap;">',
    '    <button onclick="window._ga6q1Transform(\'rotate\')" style="background:#334d7a;color:#e8f0fe;border:1px solid #3d5f96;border-radius:8px;padding:9px 14px;font-weight:600;font-size:13px;cursor:pointer;">↻ Rotate 90°</button>',
    '    <button onclick="window._ga6q1Transform(\'mirror\')" style="background:#334d7a;color:#e8f0fe;border:1px solid #3d5f96;border-radius:8px;padding:9px 14px;font-weight:600;font-size:13px;cursor:pointer;">⇋ Flip Horizontal</button>',
    '  </div>',
    '  <div style="margin-top:10px;font-size:12px;color:#8fb0dd;">The tile-placement solver only figures out how tiles fit relative to each other — it cannot always tell if the whole picture came out sideways, upside-down, or mirrored. Click Rotate/Flip (repeat as needed) until the picture looks right side up, then read the token.</div>',
    '  <div style="margin-top:16px;font-size:12px;color:#8fb0dd;">🔒 The file is processed entirely in your browser (Canvas API + client-side OCR) — nothing is uploaded to any server.</div>',
    '</div>',
    ``,
    `### ⚠️ Honest limits of this automatic solver`,
    `- The layout solver is a **beam search** over edge-colour compatibility, not an exhaustive`,
    `  guarantee — on an image with unusually low colour variation near some seams, it can`,
    `  occasionally misplace a tile or two. Always sanity-check the reconstructed preview`,
    `  visually before trusting the OCR'd token.`,
    `- **Global orientation (whole-image rotation/mirroring) is a separate problem from tile`,
    `  placement, and can't always be solved automatically.** Edge-colour matching alone is`,
    `  symmetric under a whole-grid 180° rotation — every seam scores identically either way —`,
    `  so a uniform border can prove "this is an outer edge" but can never prove which of the 4`,
    `  rotations (or their mirror images) is truly upright. Use the Rotate/Flip buttons under the`,
    `  preview to fix this by eye in a couple of clicks — this is an expected, normal step, not`,
    `  a failure of the solver.`,
    `- OCR (Tesseract.js) can fail to read the token even on a correctly reconstructed image if`,
    `  the font/contrast is unusual, or if the image still needs a rotate/flip — if that happens,`,
    `  just read the token from the shown image after correcting orientation.`,
    `- If the reconstructed image looks visibly scrambled (not a coherent picture at all, not`,
    `  just sideways), your uploaded file may have been resized/recompressed — re-download the`,
    `  original and try again.`,
    ``,
    `### The setup (for reference / manual fallback)`,
    `A placard was cut into a **6×6 grid of 100×100 tiles**. All 36 tiles were randomly`,
    `permuted, each independently rotated by a multiple of 90°, and optionally mirrored — one`,
    `of **8 possible D4 orientations** per tile. Every original tile shares a narrow colour`,
    `signature with its true neighbour along the touching edge, and the placard's outer border`,
    `is a dark solid line — both of these are exactly what the automatic solver above searches`,
    `for. The reconstructed centre displays a token in the form \`OPS-XXXXXXXXXX\`.`,
    ``,
    `### Submit`,
    `Paste the recovered token exactly as printed (format \`OPS-XXXXXXXXXX\`) into the answer box.`
  ].join('\n');

  return {
    type: 'solved',
    answer: "OPS-XXXXXXXXXX (Upload puzzle BMP below)",
    variant: `Rotated grid forensics (upload-and-solve) for ${norm}`,
    answerDisplay: [
      `### Q1: Image Forensics — Recover a Rotated and Mirrored Grid`,
      ``,
      `Upload your downloaded 600×600 BMP puzzle in the guide panel below to automatically reconstruct the 6×6 grid layout and read your \`OPS-XXXXXXXXXX\` token.`,
      ``,
      `**Token Format:** \`OPS-XXXXXXXXXX\``
    ].join('\n'),
    guide
  };
}
