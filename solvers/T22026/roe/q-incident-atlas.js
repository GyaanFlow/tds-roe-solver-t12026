// Solver: ROE T2 2026 Q1 — Incident Atlas: Georegister and Route
//
// Ultra-Advanced Interactive Direct Solver & Per-User Worked Example:
// Parses raster incident atlas, performs affine georegistration, snapped directed edge matching,
// and time-dependent graph routing with mandatory checkpoint visiting.
import { normalizeEmail } from './utils.js';

export const id = 'q-incident-atlas-route-server';
export const title = 'Q1: Incident Atlas — Georegister and Route';

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

function createRng(seedStr) {
  let s = hashString(seedStr);
  return function () {
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >> 17)) >>> 0;
    s = (s ^ (s << 5)) >>> 0;
    return (s >>> 0) / 4294967296;
  };
}

function registerIncidentAtlasInteractive() {
  if (typeof window === 'undefined' || window._roeIncidentAtlasRegistered) return;
  window._roeIncidentAtlasRegistered = true;

  window._roeSolveIncidentAtlas = function () {
    const rawInput = (document.getElementById('roeIaArtifactInput')?.value || '').trim();
    const statusEl = document.getElementById('roeIaStatus');
    const outEl = document.getElementById('roeIaOutput');

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = color || '#9fc6ff';
    }

    if (!rawInput) {
      setStatus('Please paste your questionData JSON artifact from the exam page.', '#dc3545');
      if (outEl) outEl.value = '';
      return;
    }

    try {
      let data;
      try {
        data = JSON.parse(rawInput);
      } catch (err) {
        throw new Error('Invalid JSON format. Make sure you copy the complete JSON artifact from the questionData frame.');
      }

      const keysSeen = () => 'Artifact top-level keys seen: ' + Object.keys(data).join(', ');

      const rawIncidents = data.incidents || data.incident_records || data.pixels || [];
      const edges = data.edges || data.road_network?.edges || data.graph?.edges || [];
      const rawNodes = data.nodes || data.vertices || data.road_network?.nodes || [];
      const turnRestrictions = data.turn_restrictions || data.turnRestrictions || [];
      const mandatoryCheckpoint = data.mandatory_checkpoint || data.checkpoint;
      const startNode = data.start_node || data.startNode || data.origin;
      const endNode = data.end_node || data.endNode || data.destination;

      // The affine transform is what maps atlas pixels onto map coordinates. Defaulting it to
      // the identity matrix (as an earlier version did) does NOT degrade gracefully — it snaps
      // every incident to the wrong edge, so both the incident list and the route come out
      // wrong while still looking like a valid certificate. It must come from the artifact.
      const affine = data.affine || data.affine_transform;
      if (!affine) {
        throw new Error(
          'No affine transform found in the artifact (looked for "affine", "affine_transform"). ' +
          'Without it, pixel coordinates cannot be georegistered onto road edges, and every ' +
          'incident would be assigned to the wrong edge. ' + keysSeen()
        );
      }
      if (!Array.isArray(edges) || edges.length === 0) {
        throw new Error(
          'No road-network edges found (looked for "edges", "road_network.edges", "graph.edges"). ' +
          keysSeen()
        );
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
          decodedIncidents.push({
            edge_id: edgeId,
            effect,
            window_id: windowId
          });

          if (effect === 'CLOSED') {
            if (!closedEdgesByWindow.has(edgeId)) {
              closedEdgesByWindow.set(edgeId, []);
            }
            closedEdgesByWindow.get(edgeId).push({ start: winStart, end: winEnd });
          }
        }
      }

      function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
        const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
        if (l2 === 0) return Math.hypot(px - x1, py - y1);
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
      }

      // Incidents and the route are credited separately, so emitting incidents alone is a
      // legitimate partial answer when the route can't be computed. What is NOT legitimate is
      // echoing data.route_edge_ids / data.arrival_seconds back out: those are inputs, not
      // computed results, and passing them off as an answer looks like a solved route while
      // being unverified. Emit an explicitly empty route and say so instead.
      if (!startNode || !endNode) {
        const partialResult = {
          incidents: decodedIncidents,
          route_edge_ids: [],
          arrival_seconds: 0
        };
        outEl.value = JSON.stringify(partialResult, null, 2);
        setStatus(
          `Decoded ${decodedIncidents.length} incidents, but no start/end node was found in the ` +
          `artifact, so the route could NOT be computed — route_edge_ids is empty on purpose. ` +
          `Incidents are graded separately, so this still earns partial credit.`,
          '#d97706'
        );
        return;
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

      const pq = [{
        time: 0,
        node: startNode,
        visitedCheckpoint: startNode === mandatoryCheckpoint,
        pathEdges: [],
        lastEdgeId: null
      }];

      const visitedBest = new Map();
      let bestRoute = null;

      while (pq.length > 0) {
        pq.sort((a, b) => a.time - b.time);
        const curr = pq.shift();

        const visitedKey = `${curr.node}_${curr.visitedCheckpoint}`;
        if (visitedBest.has(visitedKey) && visitedBest.get(visitedKey) <= curr.time) {
          continue;
        }
        visitedBest.set(visitedKey, curr.time);

        if (curr.node === endNode && curr.visitedCheckpoint) {
          bestRoute = curr;
          break;
        }

        const outgoing = adj.get(curr.node) || [];
        for (const edge of outgoing) {
          if (curr.lastEdgeId && isTurnRestricted(curr.lastEdgeId, edge.id, turnRestrictions)) {
            continue;
          }

          let entryTime = curr.time;
          const closures = closedEdgesByWindow.get(edge.id) || [];
          
          let blocked = true;
          let safetyLoop = 0;
          while (blocked && safetyLoop < 100) {
            safetyLoop++;
            let activeClosure = null;
            for (const c of closures) {
              if (entryTime >= c.start && entryTime < c.end) {
                activeClosure = c;
                break;
              }
            }
            if (activeClosure) {
              entryTime = activeClosure.end;
            } else {
              blocked = false;
            }
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

      function isTurnRestricted(fromEdge, toEdge, restrictions) {
        return restrictions.some(r => (r.from_edge === fromEdge && r.to_edge === toEdge) || (r[0] === fromEdge && r[1] === toEdge));
      }

      // Same rule as the partial-result path above: never echo the artifact's own
      // route_edge_ids / arrival_seconds back out as if the search had produced them.
      const finalResult = {
        incidents: decodedIncidents,
        route_edge_ids: bestRoute ? bestRoute.pathEdges : [],
        arrival_seconds: bestRoute ? bestRoute.time : 0
      };

      outEl.value = JSON.stringify(finalResult, null, 2);
      if (bestRoute) {
        setStatus(
          `Decoded ${decodedIncidents.length} incidents. Route found: ${bestRoute.pathEdges.length} edges, ` +
          `arrival at ${finalResult.arrival_seconds}s.`,
          '#198754'
        );
      } else {
        setStatus(
          `Decoded ${decodedIncidents.length} incidents, but NO valid route was found under the ` +
          `direction, turn-restriction and closure-window constraints — route_edge_ids is empty on ` +
          `purpose rather than guessed. Incidents are graded separately, so this still earns partial credit.`,
          '#d97706'
        );
      }
    } catch (err) {
      setStatus(`Solver failed: ${err.message}`, '#dc3545');
      if (outEl) outEl.value = '';
    }
  };

  window._roeCopyIaOutput = async function () {
    const el = document.getElementById('roeIaOutput');
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      const statusEl = document.getElementById('roeIaStatus');
      if (statusEl) statusEl.textContent = 'Copied route certificate to clipboard!';
    } catch {
      el.focus();
      el.select();
    }
  };
}

export async function solve(email) {
  registerIncidentAtlasInteractive();
  const norm = normalizeEmail(email);
  const rng = createRng(`${norm}#q1-seed`);

  const sampleEdge = `H${String(Math.floor(rng() * 89 + 10)).padStart(2, '0')}E`;
  const sampleTime = Math.floor(rng() * 300 + 120);

  const summary = [
    `Interactive Incident Atlas & Routing Solver for ${norm}.`,
    `Paste your questionData JSON artifact below to decode raster incidents, perform affine edge snapping,`,
    `and compute the time-dependent route certificate visiting mandatory checkpoint for ${norm}.`
  ].join(' ');

  const guide = [
    `## Q1 — Incident Atlas: Georegister and Route (for ${norm})`,
    ``,
    `### ⚡ Dynamic Interactive Direct Solver (Unique for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#145da0 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#e6f3ff;border:1px solid #1e426e;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#8ecdf7;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 1 — Paste your questionData JSON artifact</div>',
    '  <textarea id="roeIaArtifactInput" rows="7" placeholder="Paste the JSON content from your questionData iframe here..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #8ecdf7;background:#071d33;color:#e6f3ff;font-family:monospace;font-size:13px;box-sizing:border-box;"></textarea>',
    '  <button onclick="window._roeSolveIncidentAtlas()" style="margin-top:10px;background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Georegister & Compute Route Certificate</button>',
    '  <div id="roeIaStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#8ecdf7;">Ready for ' + norm + '</div>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #1e426e;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#8ecdf7;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 2 — Copy Your Submission Certificate</div>',
    '  <textarea id="roeIaOutput" readonly rows="9" placeholder=\'{"incidents":[{"edge_id":"' + sampleEdge + '","effect":"CLOSED","window_id":"W1"}],"route_edge_ids":["' + sampleEdge + '"],"arrival_seconds":' + sampleTime + '}\' style="width:100%;padding:10px;border-radius:8px;border:1px solid #1e426e;background:#071d33;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;"></textarea>',
    '  <button onclick="window._roeCopyIaOutput()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Certificate JSON</button>',
    '</div>'
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Incident atlas routing solver for ${norm}`,
    answerDisplay: [
      `### Q1: Incident Atlas — Georegister and Route`,
      ``,
      `Paste your assignment artifact into the interactive solver below to compute your route certificate for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
