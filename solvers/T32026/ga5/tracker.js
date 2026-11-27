// GA5 Q3: follow the one ball that starts red among 100 balls and read the number on it in the last frame.
// Pure code over decoded frames { width, height, rgb } (3 bytes per pixel). It never guesses: if it cannot find exactly
// 100 balls in a frame, cannot find the red ball, or cannot read the number exactly, it stops with a clear message.

export const BALLS = 100;
const GREY_MIN = 105;
const GREY_MAX = 180;
const MIN_AREA = 150;

const isWhite = (rgb, i) => rgb[i] > 200 && rgb[i + 1] > 200 && rgb[i + 2] > 200;
const isTint = (rgb, i) => rgb[i] - rgb[i + 2] > 5 && rgb[i] >= 90 && !isWhite(rgb, i);
const isGrey = (rgb, i) => {
  const r = rgb[i]; const g = rgb[i + 1]; const b = rgb[i + 2];
  return r >= GREY_MIN && r <= GREY_MAX && Math.abs(r - b) <= 5 && Math.abs(r - g) <= 12;
};

/** Connected regions (8-neighbour) of a 0/1 mask. Each region lists its pixel offsets. */
function regions(mask, width, height) {
  const seen = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  const out = [];
  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || seen[start]) continue;
    let head = 0; let tail = 0;
    queue[tail] = start; tail += 1; seen[start] = 1;
    while (head < tail) {
      const at = queue[head]; head += 1;
      const x = at % width; const y = (at - x) / width;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const xx = x + dx; const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
          const next = yy * width + xx;
          if (mask[next] && !seen[next]) { seen[next] = 1; queue[tail] = next; tail += 1; }
        }
      }
    }
    out.push(queue.slice(0, tail));
  }
  return out;
}

function measure(pixels, width) {
  let xmin = Infinity; let xmax = -Infinity; let ymin = Infinity; let ymax = -Infinity; let sx = 0; let sy = 0;
  for (const at of pixels) {
    const x = at % width; const y = (at - x) / width;
    sx += x; sy += y;
    if (x < xmin) xmin = x; if (x > xmax) xmax = x;
    if (y < ymin) ymin = y; if (y > ymax) ymax = y;
  }
  return { n: pixels.length, w: xmax - xmin + 1, h: ymax - ymin + 1, cx: (xmin + xmax) / 2, cy: (ymin + ymax) / 2, mx: sx / pixels.length, my: sy / pixels.length };
}

/** Splits a region of `parts` touching balls with a few rounds of k-means, seeded at far-apart pixels. */
function split(pixels, width, parts) {
  const pts = Array.from(pixels, (at) => [at % width, (at - (at % width)) / width]);
  const centres = [pts.reduce((a, b) => (b[0] + b[1] < a[0] + a[1] ? b : a))];
  while (centres.length < parts) {
    let best = pts[0]; let far = -1;
    for (const p of pts) {
      const d = Math.min(...centres.map((c) => (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2));
      if (d > far) { far = d; best = p; }
    }
    centres.push(best);
  }
  let current = centres.map((c) => [c[0], c[1]]);
  for (let round = 0; round < 25; round += 1) {
    const sum = current.map(() => [0, 0, 0]);
    for (const p of pts) {
      let k = 0; let near = Infinity;
      current.forEach((c, i) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2; if (d < near) { near = d; k = i; } });
      sum[k][0] += p[0]; sum[k][1] += p[1]; sum[k][2] += 1;
    }
    const next = current.map((c, i) => (sum[i][2] ? [sum[i][0] / sum[i][2], sum[i][1] / sum[i][2]] : c));
    const moved = next.some((c, i) => Math.abs(c[0] - current[i][0]) + Math.abs(c[1] - current[i][1]) > 0.01);
    current = next;
    if (!moved) break;
  }
  return current;
}

/** Ball centres from one 0/1 mask: compact regions, with touching balls split by the typical single-ball size. */
function centres(mask, width, height, expected) {
  const found = regions(mask, width, height).map((pixels) => ({ pixels, ...measure(pixels, width) })).filter((r) => r.n >= MIN_AREA);
  // A ball region is compact: thin rims and frame-sized shapes are not balls.
  const sane = found.filter((r) => r.w >= 14 && r.h >= 14 && r.w <= 120 && r.h <= 120 && r.n >= r.w * r.h * 0.35);
  const singles = sane.filter((r) => r.w <= 32 && r.h <= 32 && Math.abs(r.w - r.h) <= 4).map((r) => r.n).sort((a, b) => a - b);
  const typical = singles.length ? singles[Math.floor(singles.length / 2)] : 0;
  const points = [];
  for (const r of sane) {
    const parts = typical ? Math.max(1, Math.round(r.n / typical)) : 1;
    if (parts <= 1) points.push([r.cx, r.cy]);
    else points.push(...split(r.pixels, width, Math.min(parts, expected)));
  }
  return points;
}

/** Removes one pixel from every edge, which separates balls that only touch. */
function erode(mask, width, height) {
  const out = new Uint8Array(mask.length);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      if (mask[i] && mask[i - 1] && mask[i + 1] && mask[i - width] && mask[i + width] && mask[i - width - 1] && mask[i - width + 1] && mask[i + width - 1] && mask[i + width + 1]) out[i] = 1;
    }
  }
  return out;
}

/**
 * Ball centres in one frame, plus the centre of the red-tinted ball (the student's ball at the start). Tries the grey
 * disks first, then also the white number pixels, then an eroded mask, and keeps the first that finds every ball.
 * Returns `{ points, red }`.
 */
export function detectBalls({ width, height, rgb }, expected = BALLS) {
  const body = new Uint8Array(width * height);
  const filled = new Uint8Array(width * height);
  const tinted = new Uint8Array(width * height);
  let tintCount = 0;
  for (let at = 0; at < body.length; at += 1) {
    const i = at * 3;
    if (isTint(rgb, i)) { body[at] = 1; filled[at] = 1; tinted[at] = 1; tintCount += 1; } else if (isGrey(rgb, i)) { body[at] = 1; filled[at] = 1; } else if (isWhite(rgb, i)) filled[at] = 1;
  }
  let points = [];
  for (const attempt of [() => body, () => filled, () => erode(filled, width, height)]) {
    const found = centres(attempt(), width, height, expected);
    if (Math.abs(found.length - expected) < Math.abs(points.length - expected) || !points.length) points = found;
    if (points.length === expected) break;
  }
  let red = null;
  if (tintCount > 120) {
    const biggest = regions(tinted, width, height).sort((a, b) => b.length - a.length)[0];
    const r = measure(biggest, width);
    red = [r.cx, r.cy];
  }
  return { points, red };
}

/** Minimum total cost one-to-one assignment (Hungarian method) for a square matrix; returns column for each row. */
export function assign(cost) {
  const n = cost.length;
  const u = new Float64Array(n + 1); const v = new Float64Array(n + 1);
  const p = new Int32Array(n + 1); const way = new Int32Array(n + 1);
  for (let i = 1; i <= n; i += 1) {
    p[0] = i;
    let j0 = 0;
    const minv = new Float64Array(n + 1).fill(Infinity);
    const used = new Uint8Array(n + 1);
    do {
      used[j0] = 1;
      const i0 = p[j0];
      let delta = Infinity; let j1 = 0;
      for (let j = 1; j <= n; j += 1) {
        if (used[j]) continue;
        const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= n; j += 1) {
        if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta;
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0 !== 0);
  }
  const match = new Int32Array(n);
  for (let j = 1; j <= n; j += 1) match[p[j] - 1] = j - 1;
  return match;
}

// 3 x 5 digit shapes, drawn with 2 x 2 pixel dots and a 2 pixel gap between digits.
const SHAPES = {
  0: [['111', '101', '101', '101', '111']],
  1: [['010', '110', '010', '010', '111'], ['1', '1', '1', '1', '1']],
  2: [['111', '001', '111', '100', '111']],
  3: [['111', '001', '111', '001', '111']],
  4: [['101', '101', '111', '001', '001']],
  5: [['111', '100', '111', '001', '111']],
  6: [['111', '100', '111', '101', '111']],
  7: [['111', '001', '010', '010', '010'], ['111', '001', '001', '001', '001']],
  8: [['111', '101', '111', '101', '111']],
  9: [['111', '101', '111', '001', '111']],
};

/** Every way of drawing a number: pixel offsets and total width. */
export function numberShapes(text) {
  let groups = [{ pixels: [], width: 0 }];
  for (const digit of text) {
    const next = [];
    for (const group of groups) {
      for (const glyph of SHAPES[digit]) {
        const start = group.width ? group.width + 2 : 0;
        const pixels = [...group.pixels];
        glyph.forEach((line, y) => [...line].forEach((bit, x) => {
          if (bit === '1') for (let dy = 0; dy < 2; dy += 1) for (let dx = 0; dx < 2; dx += 1) pixels.push([start + x * 2 + dx, y * 2 + dy]);
        }));
        next.push({ pixels, width: start + glyph[0].length * 2 });
      }
    }
    groups = next;
  }
  return groups;
}

/** The number (1-100) printed in white on the ball at `centre`, only when exactly one number matches exactly. */
export function readNumber({ width, height, rgb }, [cx, cy]) {
  const white = new Set();
  for (let y = Math.max(0, Math.floor(cy) - 13); y <= Math.min(height - 1, Math.ceil(cy) + 13); y += 1) {
    for (let x = Math.max(0, Math.floor(cx) - 15); x <= Math.min(width - 1, Math.ceil(cx) + 15); x += 1) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= 169 && isWhite(rgb, (y * width + x) * 3)) white.add(y * width + x);
    }
  }
  if (!white.size) return null;
  const matches = new Set();
  for (let n = 1; n <= 100; n += 1) {
    for (const shape of numberShapes(String(n))) {
      if (shape.pixels.length !== white.size) continue;
      for (let dy = -3; dy <= 3; dy += 1) {
        for (let dx = -4; dx <= 4; dx += 1) {
          const x0 = Math.round(cx - shape.width / 2) + dx;
          const y0 = Math.round(cy - 5) + dy;
          if (shape.pixels.every(([x, y]) => white.has((y0 + y) * width + x0 + x))) matches.add(n);
        }
      }
    }
  }
  return matches.size === 1 ? [...matches][0] : null;
}

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// Lets the page repaint between frames. A message is used instead of a timer because browsers slow timers to a crawl in
// background tabs, which would stall tracking if the student switched away.
const breathe = () => new Promise((resolve) => {
  const channel = new MessageChannel();
  channel.port1.onmessage = () => { channel.port1.close(); channel.port2.close(); resolve(); };
  channel.port2.postMessage(0);
});

/**
 * Tracks the red ball through all frames. `frameAt(i)` returns (or resolves to) decoded frame i.
 * Returns `{ answer, number, targets, positions, margin }` or throws with an explanation.
 */
export async function trackBall({ count, targets, frameAt, onProgress = () => {}, expected = BALLS, signal }) {
  let previous = null;
  let mine = -1;
  let last = null;
  const track = [];
  let margin = Infinity; // how close a rival ball ever came to being confused with mine (pixels)
  for (let f = 0; f < count; f += 1) {
    if (signal?.aborted) throw new Error('Tracking was stopped.');
    const frame = await frameAt(f);
    const { points, red } = detectBalls(frame, expected);
    if (points.length !== expected) throw new Error(`Frame ${f}: found ${points.length} balls instead of ${expected}, so nothing is guessed. Mark your ball by hand in the viewer.`);
    if (f === 0) {
      if (!red) throw new Error('No red ball in the first frame. Is this your own frames file?');
      mine = points.reduce((best, p, i) => (distance(p, red) < distance(points[best], red) ? i : best), 0);
    } else {
      const cost = previous.map((a) => points.map((b) => distance(a, b)));
      const match = assign(cost);
      const from = previous[mine];
      const chosen = match[mine];
      const chosenDistance = distance(from, points[chosen]);
      for (let j = 0; j < points.length; j += 1) if (j !== chosen) margin = Math.min(margin, distance(from, points[j]) - chosenDistance);
      mine = chosen;
    }
    previous = points;
    track.push(points[mine]);
    last = frame;
    if (f % 10 === 0 || f === count - 1) { onProgress(f + 1, count); await breathe(); }
  }
  const number = readNumber(last, track[count - 1]);
  if (number === null) throw new Error('The number on your ball could not be read exactly, so nothing is guessed. Read it in the viewer (zoom in on the last frame).');
  const positions = targets.map((t) => track[t]);
  return {
    number,
    targets,
    positions,
    margin,
    track,
    answer: `${number}; ${positions.map((p) => `${Math.round(p[0])},${Math.round(p[1])}`).join('; ')}`,
  };
}

/** Browser only: decodes one PNG (a byte range of the frames file) into RGB pixels. */
export async function decodePng(bytes) {
  const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
  try {
    const canvas = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(bitmap.width, bitmap.height) : Object.assign(document.createElement('canvas'), { width: bitmap.width, height: bitmap.height });
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(bitmap, 0, 0);
    const rgba = context.getImageData(0, 0, bitmap.width, bitmap.height).data;
    const rgb = new Uint8Array(bitmap.width * bitmap.height * 3);
    for (let i = 0, j = 0; i < rgba.length; i += 4) { rgb[j] = rgba[i]; rgb[j + 1] = rgba[i + 1]; rgb[j + 2] = rgba[i + 2]; j += 3; }
    return { width: bitmap.width, height: bitmap.height, rgb };
  } finally {
    bitmap.close?.();
  }
}
