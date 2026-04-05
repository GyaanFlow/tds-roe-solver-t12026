// Solver: Maze Solver — FULLY auto-solvable
// Replicates maze generation + BFS solution path

export const id = 'q-maze-solver-server';
export const title = 'Maze Solver with Constraints';

const GRID = 30;
const NUM_KEYS = 7;
const KEY_COLORS = ["Red","Blue","Green","Yellow","Cyan","Magenta","White"];
const DIRS = [
  {dr:-1,dc:0,name:"up"},{dr:1,dc:0,name:"down"},
  {dr:0,dc:-1,name:"left"},{dr:0,dc:1,name:"right"}
];
const OPP = {up:"down",down:"up",left:"right",right:"left"};

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function L(r,c) { return `${r},${c}`; }

function generateMaze(rng) {
  const walls = Array.from({length:GRID}, () =>
    Array.from({length:GRID}, () => new Set(["up","down","left","right"]))
  );
  const visited = Array.from({length:GRID}, () => Array(GRID).fill(false));
  const stack = [];
  let r=0, c=0;
  visited[r][c] = true;
  stack.push([r,c]);
  while (stack.length > 0) {
    const [cr,cc] = stack[stack.length-1];
    const neighbors = shuffle(DIRS, rng)
      .map(({dr,dc,name}) => ({nr:cr+dr,nc:cc+dc,dir:name}))
      .filter(({nr,nc}) => nr>=0 && nr<GRID && nc>=0 && nc<GRID && !visited[nr][nc]);
    if (neighbors.length === 0) { stack.pop(); continue; }
    const {nr,nc,dir} = neighbors[0];
    walls[cr][cc].delete(dir);
    walls[nr][nc].delete(OPP[dir]);
    visited[nr][nc] = true;
    stack.push([nr,nc]);
  }
  return walls;
}

function bfs(walls, sr, sc, er, ec) {
  const seen = new Set();
  const queue = [[sr,sc,[]]];
  seen.add(L(sr,sc));
  while (queue.length > 0) {
    const [r,c,path] = queue.shift();
    const newPath = [...path, [r,c]];
    if (r===er && c===ec) return newPath;
    for (const {dr,dc,name} of DIRS) {
      const nr=r+dr, nc=c+dc;
      if (nr<0||nr>=GRID||nc<0||nc>=GRID||seen.has(L(nr,nc))||walls[r][c].has(name)) continue;
      seen.add(L(nr,nc));
      queue.push([nr,nc,newPath]);
    }
  }
  return null;
}

function placeKeys(path, rng) {
  const keys = [];
  const inner = path.slice(1, -1);
  if (inner.length < NUM_KEYS) {
    const indices = shuffle([...Array(inner.length).keys()], rng).slice(0, NUM_KEYS);
    indices.sort((a,b) => a-b);
    for (let i = 0; i < indices.length; i++) {
      keys.push({ row: inner[indices[i]][0], col: inner[indices[i]][1], color: KEY_COLORS[i], index: i });
    }
  } else {
    const step = Math.floor(inner.length / (NUM_KEYS + 1));
    for (let i = 0; i < NUM_KEYS; i++) {
      const idx = step * (i + 1);
      keys.push({ row: inner[idx][0], col: inner[idx][1], color: KEY_COLORS[i], index: i });
    }
  }
  return keys;
}

// Consume remaining RNG calls to stay in sync (teleporters, one-ways, decay, noise)
function consumeRemainingRNG(walls, path, rng) {
  // Teleporters
  const pathSet = new Set(path.map(([r,c]) => L(r,c)));
  const nonPath = [];
  for (let r=0;r<GRID;r++) for(let c=0;c<GRID;c++) if(!pathSet.has(L(r,c))) nonPath.push([r,c]);
  shuffle(nonPath, rng); // teleporter placement shuffle
  // One-ways
  const inner = path.slice(1,-1);
  const dirs_on_path = [];
  for (let i=0;i<path.length-1;i++) {
    const [r1,c1]=path[i],[r2,c2]=path[i+1];
    const d = DIRS.find(d=>d.dr===r2-r1&&d.dc===c2-c1);
    if(d) dirs_on_path.push({fromRow:r1,fromCol:c1,toRow:r2,toCol:c2,direction:d.name});
  }
  const innerDirs = dirs_on_path.slice(1,-1);
  shuffle(innerDirs, rng); // one-way shuffle

  // Decaying paths
  const openEdges = [];
  for(let r=0;r<GRID;r++) for(let c=0;c<GRID;c++) {
    for(const{dr,dc,name}of DIRS) {
      const nr=r+dr,nc=c+dc;
      if(nr<0||nr>=GRID||nc<0||nc>=GRID||walls[r][c].has(name)) continue;
      if(!pathSet.has(L(r,c))||!pathSet.has(L(nr,nc))) continue; // skip
      openEdges.push(1);
    }
  }
  shuffle(openEdges, rng);
  // Decay steps
  for(let i=0;i<Math.min(8,openEdges.length);i++) {
    rng(); // decaySteps = 30 + Math.floor(rng()*71)
  }

  // Wall noise
  for(let r=0;r<GRID;r++) for(let c=0;c<GRID;c++) {
    for(const dir of ["right","down"]) {
      if(walls[r][c].has(dir)) {
        const count = 2+Math.floor(rng()*3);
        for(let t=0;t<count;t++) {
          rng(); // brightness
          if(dir==="right") { rng(); } // x or y position
          else { rng(); }
        }
      }
    }
  }
}

export function solve(email) {
  const norm = (email || '').trim().toLowerCase();
  const rng = new Math.seedrandom(`${norm}#q-maze-solver`);

  const walls = generateMaze(rng);
  const path = bfs(walls, 0, 0, GRID-1, GRID-1);

  if (!path) {
    return {
      variant: 'Maze generation failed — no path found',
      answer: 'ERROR: No path found',
      type: 'solved'
    };
  }

  // Place keys (consume RNG)
  const keys = placeKeys(path, rng);

  // Format path as row,col per line
  const pathStr = path.map(([r,c]) => `${r},${c}`).join('\n');

  return {
    variant: `${GRID}×${GRID} maze, ${path.length} steps, ${keys.length} keys`,
    answer: pathStr,
    type: 'solved',
    answerDisplay: `<strong>Path:</strong> ${path.length} steps from (0,0) to (${GRID-1},${GRID-1})<br>Keys collected in order: ${keys.map(k=>k.color).join(' → ')}`
  };
}
