// Solver: Cipher Trail — Caesar cipher decode with seeded RNG
// This is FULLY auto-solvable — all logic is client-side

export const id = 'q-cipher-trail-server';
export const title = 'Cipher Trail (Caesar Decode)';

const WORDS = [
  "NETWORK","CLUSTER","DECRYPT","TRANSIT","SIGNALS","QUANTUM","BEACON","VECTOR",
  "MATRIX","BRIDGE","SOCKET","DAEMON","KERNEL","ROUTER","STREAM","BUFFER",
  "PACKET","PORTAL","SHIELD","SYNTAX"
];

function shuffleArray(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function caesarEncode(char, shift) {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return String.fromCharCode((code - 65 + shift) % 26 + 65);
  }
  return char;
}

function caesarEncodeStr(str, shift) {
  return str.toUpperCase().split('').map(c => caesarEncode(c, shift)).join('');
}

function buildAdjacency(nodeCount, rng) {
  const adj = Array.from({ length: nodeCount }, () => []);
  function addEdge(a, b) {
    if (a !== b) {
      if (!adj[a].includes(b)) adj[a].push(b);
      if (!adj[b].includes(a)) adj[b].push(a);
    }
  }
  const order = shuffleArray(Array.from({ length: nodeCount }, (_, i) => i), rng);
  for (let i = 0; i < order.length - 1; i++) addEdge(order[i], order[i + 1]);
  for (let i = 0, added = 0; i < 30 && added < 6; i++) {
    const a = Math.floor(rng() * nodeCount);
    const b = Math.floor(rng() * nodeCount);
    if (a !== b && !adj[a].includes(b)) { addEdge(a, b); added++; }
  }
  adj.forEach(list => list.sort((a, b) => a - b));
  return adj;
}

export function solve(email) {
  const NODE_COUNT = 12;
  const norm = email.trim().toLowerCase();
  const rng = new Math.seedrandom(`${norm}#${id}`);

  // Build adjacency
  const adj = buildAdjacency(NODE_COUNT, rng);

  // Pick word
  const answerWord = shuffleArray([...WORDS], rng)[0];
  const letters = answerWord.split('');

  // Assign letters to nodes
  const requiredNodes = shuffleArray(Array.from({ length: NODE_COUNT }, (_, i) => i), rng)
    .slice(0, letters.length);

  // Generate shifts
  const nodeShifts = Array.from({ length: NODE_COUNT }, () => 1 + Math.floor(rng() * 25));

  // Generate fragments
  const fragments = [];
  for (let d = 0; d < NODE_COUNT; d++) {
    const idx = requiredNodes.indexOf(d);
    if (idx >= 0) {
      fragments.push(caesarEncodeStr(letters[idx], nodeShifts[d]));
    } else {
      const c = String.fromCharCode(65 + Math.floor(rng() * 26));
      fragments.push(caesarEncodeStr(c, nodeShifts[d]));
    }
  }

  // Now decode: for each required node, decode the fragment
  const decoded = requiredNodes.map((nodeId, pos) => {
    const encoded = fragments[nodeId];
    const shift = nodeShifts[nodeId];
    // Decode by shifting back
    return encoded.split('').map(ch => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - shift % 26) + 26) % 26 + 65);
      }
      return ch;
    }).join('');
  }).join('');

  // Build display table
  const tableRows = requiredNodes.map((nodeId, pos) => {
    return `Pos ${pos}: Encoded="${fragments[nodeId]}", Shift=${nodeShifts[nodeId]}`;
  });

  return {
    variant: `Word length: ${answerWord.length} letters, ${NODE_COUNT} cipher nodes`,
    answer: decoded,
    type: 'solved',
    answerDisplay: `<strong>Decoded word:</strong> ${decoded}<br><br>${tableRows.join('<br>')}`
  };
}
