import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'maze-solve-server';
export const title = 'Q1: Solve a Generated Maze Offline';

const DIRS = [
  { ch: 'U', bit: 1, dx: 0, dy: -1 },
  { ch: 'R', bit: 2, dx: 1, dy: 0 },
  { ch: 'D', bit: 4, dx: 0, dy: 1 },
  { ch: 'L', bit: 8, dx: -1, dy: 0 }
];
const OPPOSITE = { U: 'D', R: 'L', D: 'U', L: 'R' };
const DIR_BY_CH = Object.fromEntries(DIRS.map(d => [d.ch, d]));

function randInt(rng, lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); }

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Sets the bit for `dirCh` on cell (x,y) and the opposite bit on the neighbor cell.
function openWall(grid, x, y, dirCh) {
  const dir = DIR_BY_CH[dirCh];
  const nx = x + dir.dx, ny = y + dir.dy;
  grid[y][x] |= dir.bit;
  grid[ny][nx] |= DIR_BY_CH[OPPOSITE[dirCh]].bit;
}

export function generateMaze(email, version = '') {
  const norm = normalizeEmail(email);
  const rng = seedrandom(`${norm}#${id}${version ? '#' + version : ''}`);

  const width = 31 + 2 * randInt(rng, 0, 15);
  const height = 31 + 2 * randInt(rng, 0, 15);
  const grid = Array.from({ length: height }, () => Array(width).fill(0));
  const visited = Array.from({ length: height }, () => Array(width).fill(false));

  const stack = [[1, 1]];
  visited[1][1] = true;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const candidates = shuffle(DIRS, rng)
      .map(d => ({ ch: d.ch, wx: x + d.dx, wy: y + d.dy, nx: x + 2 * d.dx, ny: y + 2 * d.dy }))
      .filter(c => c.nx > 0 && c.nx < width - 1 && c.ny > 0 && c.ny < height - 1 && !visited[c.ny][c.nx]);
    if (candidates.length === 0) { stack.pop(); continue; }
    const { ch, wx, wy, nx, ny } = candidates[0];
    openWall(grid, x, y, ch);
    openWall(grid, wx, wy, ch);
    visited[ny][nx] = true;
    stack.push([nx, ny]);
  }

  const loopProb = 0.1 + rng() * 0.05;
  for (let ay = 1; ay < height - 1; ay += 2) {
    for (let ax = 1; ax < width - 1; ax += 2) {
      for (const dirCh of ['R', 'D']) {
        const dir = DIR_BY_CH[dirCh];
        const nx = ax + 2 * dir.dx, ny = ay + 2 * dir.dy;
        if (nx <= 0 || nx >= width - 1 || ny <= 0 || ny >= height - 1 || (grid[ay][ax] & dir.bit)) continue;
        if (rng() < loopProb) {
          openWall(grid, ax, ay, dirCh);
          openWall(grid, ax + dir.dx, ay + dir.dy, dirCh);
        }
      }
    }
  }

  return { width, height, start: [1, 1], end: [width - 2, height - 2], openMask: grid };
}

function bfsShortestPath(maze) {
  const { width, height, start, end, openMask } = maze;
  const key = (x, y) => y * width + x;
  const visited = new Uint8Array(width * height);
  const parent = new Int32Array(width * height).fill(-1);
  const moveTo = new Array(width * height).fill('');

  const queue = [start];
  visited[key(start[0], start[1])] = 1;
  let qi = 0;
  while (qi < queue.length) {
    const [x, y] = queue[qi++];
    if (x === end[0] && y === end[1]) break;
    const mask = openMask[y][x];
    for (const dir of DIRS) {
      if (!(mask & dir.bit)) continue;
      const nx = x + dir.dx, ny = y + dir.dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const k = key(nx, ny);
      if (visited[k]) continue;
      visited[k] = 1;
      parent[k] = key(x, y);
      moveTo[k] = dir.ch;
      queue.push([nx, ny]);
    }
  }

  const endKey = key(end[0], end[1]);
  if (!visited[endKey]) return null; // should never happen for a valid maze

  const moves = [];
  let cur = endKey;
  while (cur !== key(start[0], start[1])) {
    moves.push(moveTo[cur]);
    cur = parent[cur];
  }
  moves.reverse();
  return moves.join('');
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const maze = generateMaze(norm);
  const path = bfsShortestPath(maze);

  return {
    type: 'solved',
    answer: path,
    variant: `${maze.width}x${maze.height} maze shortest path for ${norm}`,
    answerDisplay: [
      `### Q1: Solve a Generated Maze Offline`,
      `Maze: **${maze.width} x ${maze.height}**, start \`[${maze.start.join(', ')}]\`, end \`[${maze.end.join(', ')}]\``,
      `BFS shortest path (${path.length} moves):`,
      '```',
      path,
      '```'
    ].join('\n')
  };
}
