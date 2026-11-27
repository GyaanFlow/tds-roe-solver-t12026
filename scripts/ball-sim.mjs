// A small simulator of the Q3 video, used only by the tests: 100 equal balls bouncing inside a circle with elastic
// collisions, one red in the first frame, numbers printed on every ball in the last frame. It knows which ball is which,
// so the tracker can be checked against the truth. It is a stand-in: the exam's own frames are private to each student.
import { numberShapes } from '../solvers/T32026/ga5/tracker.js';

export function simulate({ seed = 1, frames = 60, balls = 100, size = 600, radius = 11, speed = 2.5, rim = true } = {}) {
  let state = seed >>> 0 || 1;
  const rand = () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
  const centre = size / 2;
  const limit = size / 2 - 8;
  const items = [];
  while (items.length < balls) {
    const x = centre + (rand() * 2 - 1) * (limit - radius - 2);
    const y = centre + (rand() * 2 - 1) * (limit - radius - 2);
    if (Math.hypot(x - centre, y - centre) > limit - radius - 2 || items.some((b) => Math.hypot(b.x - x, b.y - y) < 2 * radius + 3)) continue;
    const angle = rand() * Math.PI * 2;
    const v = speed * (0.4 + rand() * 0.6);
    items.push({ x, y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v });
  }
  const numbers = Array.from({ length: balls }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i -= 1) { const j = Math.floor(rand() * (i + 1)); [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; }
  const mine = Math.floor(rand() * balls);
  const history = [];
  const step = (dt) => {
    for (const b of items) { b.x += b.vx * dt; b.y += b.vy * dt; }
    for (const b of items) {
      const dx = b.x - centre; const dy = b.y - centre; const d = Math.hypot(dx, dy);
      if (d > limit - radius) {
        const nx = dx / d; const ny = dy / d; const along = b.vx * nx + b.vy * ny;
        if (along > 0) { b.vx -= 2 * along * nx; b.vy -= 2 * along * ny; }
        b.x = centre + nx * (limit - radius); b.y = centre + ny * (limit - radius);
      }
    }
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const a = items[i]; const b = items[j];
        const dx = b.x - a.x; const dy = b.y - a.y; const d = Math.hypot(dx, dy);
        if (d >= 2 * radius || d === 0) continue;
        const nx = dx / d; const ny = dy / d;
        const along = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (along > 0) { a.vx -= along * nx; a.vy -= along * ny; b.vx += along * nx; b.vy += along * ny; }
        const push = (2 * radius - d) / 2;
        a.x -= nx * push; a.y -= ny * push; b.x += nx * push; b.y += ny * push;
      }
    }
  };
  for (let f = 0; f < frames; f += 1) {
    history.push(items.map((b) => [b.x, b.y]));
    for (let s = 0; s < 4; s += 1) step(0.25);
  }
  const render = (f, options = {}) => {
    const rgb = new Uint8Array(size * size * 3);
    for (let i = 0; i < rgb.length; i += 3) { rgb[i] = 12; rgb[i + 1] = 14; rgb[i + 2] = 20; }
    const dot = (x, y, c) => { if (x >= 0 && y >= 0 && x < size && y < size) rgb.set(c, (y * size + x) * 3); };
    if (rim) for (let t = 0; t < 6000; t += 1) { const a = (t / 6000) * Math.PI * 2; for (let w = 0; w < 2; w += 1) dot(Math.round(centre + Math.cos(a) * (limit + 3 + w)), Math.round(centre + Math.sin(a) * (limit + 3 + w)), [235, 235, 235]); }
    history[f].forEach(([x, y], i) => {
      if (options.skip === i) return;
      const colour = f === 0 && i === mine && !options.noRed ? [210, 50, 50] : [140, 140, 140];
      for (let dy = -radius; dy <= radius; dy += 1) for (let dx = -radius; dx <= radius; dx += 1) if (Math.hypot(dx, dy) <= radius - 0.3) dot(Math.round(x) + dx, Math.round(y) + dy, colour);
      if (f === frames - 1 && !options.noNumbers) {
        const shape = numberShapes(String(numbers[i]))[0];
        for (const [px, py] of shape.pixels) dot(Math.round(x - shape.width / 2) + px, Math.round(y - 5) + py, [255, 255, 255]);
      }
    });
    return { width: size, height: size, rgb };
  };
  return { mine, number: numbers[mine], positions: history.map((h) => h[mine]), render, count: frames };
}
