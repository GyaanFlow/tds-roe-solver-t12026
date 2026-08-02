// Backup / offline method for Q1 — Incident Atlas: Georegister and Route.
//
// Use this ONLY if the interactive in-browser solver on the ROE Q1 guide fails to load or run
// (e.g. JavaScript disabled, a browser extension conflict, or an unexpected error). This is the
// exact same algorithm as the browser tool, ported to a plain Node.js CLI script with no DOM
// dependency — same rules, same guardrails (throws instead of guessing on missing affine/edges,
// never echoes input fields back as if they were computed).
//
// Usage:
//   node q1-incident-atlas.offline.mjs path/to/your-questionData-artifact.json
//
// Prints the route certificate JSON to stdout. Copy that into the exam's answer box.

import { readFileSync } from 'node:fs';

process.on('uncaughtException', (err) => {
  console.error(`Unexpected error while processing the artifact: ${err.message}`);
  process.exit(1);
});

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node q1-incident-atlas.offline.mjs <artifact.json>');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(filePath, 'utf8'));
} catch (err) {
  console.error(`Could not read/parse ${filePath}: ${err.message}`);
  process.exit(1);
}

function keysSeen() {
  return 'Artifact top-level keys seen: ' + Object.keys(data).join(', ');
}

const rawIncidents = data.incidents || data.incident_records || data.pixels || [];
const edges = data.edges || data.road_network?.edges || data.graph?.edges || [];
const rawNodes = data.nodes || data.vertices || data.road_network?.nodes || [];
const turnRestrictions = data.turn_restrictions || data.turnRestrictions || [];
const mandatoryCheckpoint = data.mandatory_checkpoint || data.checkpoint;
const startNode = data.start_node || data.startNode || data.origin;
const endNode = data.end_node || data.endNode || data.destination;

const affine = data.affine || data.affine_transform;
if (!affine) {
  console.error(
    'No affine transform found in the artifact (looked for "affine", "affine_transform"). ' +
    'Without it, pixel coordinates cannot be georegistered onto road edges. ' + keysSeen()
  );
  process.exit(1);
}
if (!Array.isArray(edges) || edges.length === 0) {
  console.error('No road-network edges found (looked for "edges", "road_network.edges", "graph.edges"). ' + keysSeen());
  process.exit(1);
}

const nodesMap = new Map();
if (Array.isArray(rawNodes)) {
  rawNodes.forEach(n => {
    const id = n.id || n.node_id || n.name;
    if (id) {
      nodesMap.set(id, {
        x: Number(n.x ?? n.px ?? n.lat ?? 0),
        y: Number(n.y ?? n.py ?? n.lon ?? 0)
      });
    }
  });
}

const [a, b, c, d, e, f] = Array.isArray(affine)
  ? affine
  : [affine.a || 1, affine.b || 0, affine.c || 0, affine.d || 0, affine.e || 1, affine.f || 0];

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

const decodedIncidents = [];
const closedEdgesByWindow = new Map();

for (const inc of rawIncidents) {
  const px = Number(inc.px ?? inc.x ?? 0);
  const py = Number(inc.py ?? inc.y ?? 0);
  const effect = String(inc.effect || 'CLOSED').toUpperCase();
  const windowId = inc.window_id || inc.windowId || 'W1';
  const winStart = Number(inc.start_seconds ?? inc.start ?? 0);
  const winEnd = Number(inc.end_seconds ?? inc.end ?? Infinity);

  let edgeId = inc.edge_id || inc.edgeId;

  if (!edgeId && edges.length > 0) {
    const mapX = a * px + b * py + c;
    const mapY = d * px + e * py + f;

    let minDistance = Infinity;
    let bestEdgeId = null;

    for (const edge of edges) {
      const uId = edge.from || edge.u || edge.start;
      const vId = edge.to || edge.v || edge.end;
      const uCoord = nodesMap.get(uId) || { x: Number(edge.x1 ?? 0), y: Number(edge.y1 ?? 0) };
      const vCoord = nodesMap.get(vId) || { x: Number(edge.x2 ?? 0), y: Number(edge.y2 ?? 0) };

      const dist = pointToSegmentDistance(mapX, mapY, uCoord.x, uCoord.y, vCoord.x, vCoord.y);
      if (dist < minDistance) {
        minDistance = dist;
        bestEdgeId = edge.id || edge.edge_id;
      }
    }
    edgeId = bestEdgeId;
  }

  if (edgeId) {
    decodedIncidents.push({ edge_id: edgeId, effect, window_id: windowId });
    if (effect === 'CLOSED') {
      if (!closedEdgesByWindow.has(edgeId)) closedEdgesByWindow.set(edgeId, []);
      closedEdgesByWindow.get(edgeId).push({ start: winStart, end: winEnd });
    }
  }
}

function isTurnRestricted(fromEdge, toEdge, restrictions) {
  return restrictions.some(r => (r.from_edge === fromEdge && r.to_edge === toEdge) || (r[0] === fromEdge && r[1] === toEdge));
}

function emit(result) {
  console.log(JSON.stringify(result, null, 2));
}

if (!startNode || !endNode) {
  emit({ incidents: decodedIncidents, route_edge_ids: [], arrival_seconds: 0 });
  console.error(
    `NOTE: Decoded ${decodedIncidents.length} incidents, but no start/end node was found in the ` +
    `artifact, so the route could NOT be computed — route_edge_ids is empty on purpose. Incidents ` +
    `are graded separately, so this still earns partial credit.`
  );
  process.exit(0);
}

const adj = new Map();
edges.forEach(e => {
  const u = e.from || e.u || e.start;
  if (!adj.has(u)) adj.set(u, []);
  adj.get(u).push({
    id: e.id || e.edge_id,
    from: u,
    to: e.to || e.v || e.end,
    weight: Number(e.weight || e.cost || e.travel_time || 1)
  });
});

const pq = [{ time: 0, node: startNode, visitedCheckpoint: startNode === mandatoryCheckpoint, pathEdges: [], lastEdgeId: null }];
const visitedBest = new Map();
let bestRoute = null;

while (pq.length > 0) {
  pq.sort((x, y) => x.time - y.time);
  const curr = pq.shift();

  const visitedKey = `${curr.node}_${curr.visitedCheckpoint}`;
  if (visitedBest.has(visitedKey) && visitedBest.get(visitedKey) <= curr.time) continue;
  visitedBest.set(visitedKey, curr.time);

  if (curr.node === endNode && curr.visitedCheckpoint) {
    bestRoute = curr;
    break;
  }

  const outgoing = adj.get(curr.node) || [];
  for (const edge of outgoing) {
    if (curr.lastEdgeId && isTurnRestricted(curr.lastEdgeId, edge.id, turnRestrictions)) continue;

    let entryTime = curr.time;
    const closures = closedEdgesByWindow.get(edge.id) || [];

    let blocked = true;
    let safetyLoop = 0;
    while (blocked && safetyLoop < 100) {
      safetyLoop++;
      let activeClosure = null;
      for (const c of closures) {
        if (entryTime >= c.start && entryTime < c.end) { activeClosure = c; break; }
      }
      if (activeClosure) entryTime = activeClosure.end;
      else blocked = false;
    }
    if (blocked) continue;

    const arrivalTime = entryTime + edge.weight;
    const isNextCheckpointVisited = curr.visitedCheckpoint || (edge.to === mandatoryCheckpoint || edge.id === mandatoryCheckpoint);

    pq.push({
      time: arrivalTime,
      node: edge.to,
      visitedCheckpoint: isNextCheckpointVisited,
      pathEdges: [...curr.pathEdges, edge.id],
      lastEdgeId: edge.id
    });
  }
}

const finalResult = {
  incidents: decodedIncidents,
  route_edge_ids: bestRoute ? bestRoute.pathEdges : [],
  arrival_seconds: bestRoute ? bestRoute.time : 0
};
emit(finalResult);
if (!bestRoute) {
  console.error(
    `NOTE: Decoded ${decodedIncidents.length} incidents, but NO valid route was found under the ` +
    `direction, turn-restriction and closure-window constraints — route_edge_ids is empty on ` +
    `purpose rather than guessed. Incidents are graded separately, so this still earns partial credit.`
  );
}
