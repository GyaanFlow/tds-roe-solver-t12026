// Exact Tangram geometry and match-key hashing, copied unchanged from the exam's public game client
// (https://tds-network-games.sanand.workers.dev/games/tangram/{algebraic,adapter}.js and
// /visual/kernel.js). It lets this solver check every stored arrangement against the exam's
// expected match key without any network access. Do not edit the logic: it must stay identical
// to the game's own validator and canonicalizer.
export const ALG_ZERO = { a: 0n, b: 0n };
export function alg(a, b = 0) {
    return { a: BigInt(a), b: BigInt(b) };
}
export function algAdd(x, y) {
    return { a: x.a + y.a, b: x.b + y.b };
}
export function algSub(x, y) {
    return { a: x.a - y.a, b: x.b - y.b };
}
export function algMul(x, y) {
    return {
        a: x.a * y.a + 2n * x.b * y.b,
        b: x.a * y.b + x.b * y.a,
    };
}
export function algNeg(x) {
    return { a: -x.a, b: -x.b };
}
export function algEq(x, y) {
    return x.a === y.a && x.b === y.b;
}
export function algSign(x) {
    if (x.a === 0n && x.b === 0n)
        return 0;
    if (x.a >= 0n && x.b >= 0n)
        return 1;
    if (x.a <= 0n && x.b <= 0n)
        return -1;
    const a2 = x.a * x.a;
    const twoB2 = 2n * x.b * x.b;
    if (x.a > 0n)
        return a2 > twoB2 ? 1 : -1;
    return twoB2 > a2 ? 1 : -1;
}
export function algCompare(x, y) {
    return algSign(algSub(x, y));
}
export function algValue(x, denominator = 16) {
    return (Number(x.a) + Number(x.b) * Math.SQRT2) / denominator;
}
export function pointEq(a, b) {
    return algEq(a.x, b.x) && algEq(a.y, b.y);
}
export function pointSub(a, b) {
    return { x: algSub(a.x, b.x), y: algSub(a.y, b.y) };
}
export function pointCompare(a, b) {
    return algCompare(a.x, b.x) || algCompare(a.y, b.y);
}
export function dot(a, b) {
    return algAdd(algMul(a.x, b.x), algMul(a.y, b.y));
}
export function cross(a, b) {
    return algSub(algMul(a.x, b.y), algMul(a.y, b.x));
}
export function pointKey(point) {
    return point.x.a + "," + point.x.b + ";" + point.y.a + "," + point.y.b;
}

export const TANGRAM_INITIAL_POSES = [
    { id: "large-a", x: 80, y: 80, orientation: 0, reflected: false },
    { id: "large-b", x: 160, y: 80, orientation: 0, reflected: false },
    { id: "medium", x: 304, y: 80, orientation: 0, reflected: false },
    { id: "small-a", x: 80, y: 160, orientation: 0, reflected: false },
    { id: "small-b", x: 140, y: 160, orientation: 0, reflected: false },
    { id: "square", x: 200, y: 160, orientation: 0, reflected: false },
    { id: "parallelogram", x: 320, y: 160, orientation: 0, reflected: false },
];
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const LARGE = [[0, 0], [4, 0], [0, 4]];
const MEDIUM = [[-2, 0], [2, 0], [0, 2]];
const SMALL = [[0, 0], [2, 0], [0, 2]];
const SQUARE = [[0, 0], [2, 0], [2, 2], [0, 2]];
const PARALLELOGRAM = [[0, 0], [2, 0], [4, 2], [2, 2]];
export const TANGRAM_CONFIG = {
    game: "tangram",
    game_version: 1,
    config_id: "standard-seven-v1",
    state_version: 1,
    equivalence_version: 2,
    board: { dimensions: 2, origin: [0, 0], axes: ["x", "y"], width: 24, height: 18 },
    pose_domain: {
        x: [0, 384],
        y: [0, 288],
        orientations: [0, 1, 2, 3, 4, 5, 6, 7],
        coordinate_denominator: 16,
    },
    inventory: [
        { id: "large-a", kind: "large-triangle", vertices: LARGE, area_units: 8 },
        { id: "large-b", kind: "large-triangle", vertices: LARGE, area_units: 8 },
        { id: "medium", kind: "medium-triangle", vertices: MEDIUM, area_units: 4 },
        { id: "small-a", kind: "small-triangle", vertices: SMALL, area_units: 2 },
        { id: "small-b", kind: "small-triangle", vertices: SMALL, area_units: 2 },
        { id: "square", kind: "square", vertices: SQUARE, area_units: 4 },
        { id: "parallelogram", kind: "parallelogram", vertices: PARALLELOGRAM, area_units: 4 },
    ],
    equivalence: {
        observable: "union-boundary",
        piece_identity: "ignored",
        global_transform: "translation",
    },
};
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function integerInRange(value, range, label) {
    if (!Number.isSafeInteger(value))
        throw new Error(label + " must be a safe integer");
    const number = value;
    if (number < range[0] || number > range[1])
        throw new Error(label + " is outside the pose domain");
    return number;
}
function parseOrientation(value) {
    if (!Number.isSafeInteger(value))
        throw new Error("orientation must be an integer from 0 to 7");
    const orientation = value;
    if (orientation < 0 || orientation > 7) {
        throw new Error("orientation must be an integer from 0 to 7");
    }
    return orientation;
}
function parsePose(value, config) {
    if (!isRecord(value))
        throw new Error("piece pose must be an object");
    if (typeof value.id !== "string" || !config.inventory.some((piece) => piece.id === value.id)) {
        throw new Error("piece id is not in the Tangram inventory");
    }
    if (typeof value.reflected !== "boolean")
        throw new Error("reflected must be boolean");
    return {
        id: value.id,
        x: integerInRange(value.x, config.pose_domain.x, "x"),
        y: integerInRange(value.y, config.pose_domain.y, "y"),
        orientation: parseOrientation(value.orientation),
        reflected: value.reflected,
    };
}
function inventoryOrder(config) {
    return new Map(config.inventory.map((piece, index) => [piece.id, index]));
}
function normalizeState(pieces, config) {
    if (pieces.length !== config.inventory.length)
        throw new Error("candidate must contain all seven Tangram pieces");
    const ids = pieces.map((piece) => piece.id);
    if (new Set(ids).size !== ids.length)
        throw new Error("candidate contains a duplicate piece id");
    const expected = new Set(config.inventory.map((piece) => piece.id));
    if (ids.some((id) => !expected.has(id)))
        throw new Error("candidate inventory does not match Tangram inventory");
    const order = inventoryOrder(config);
    return {
        pieces: [...pieces].sort((a, b) => order.get(a.id) - order.get(b.id)),
    };
}
function parseCandidate(input, config) {
    if (!isRecord(input))
        throw new Error("candidate must be an object");
    if (input.game !== config.game)
        throw new Error("game must be tangram");
    if (input.config_id !== config.config_id)
        throw new Error("config_id must be " + config.config_id);
    if (input.state_version !== config.state_version)
        throw new Error("state_version must be " + config.state_version);
    if (!isRecord(input.data) || !Array.isArray(input.data.pieces)) {
        throw new Error("candidate data.pieces must be an array");
    }
    return normalizeState(input.data.pieces.map((pose) => parsePose(pose, config)), config);
}
function rotatedLocal(xInput, y, orientation, reflected) {
    const x = reflected ? -xInput : xInput;
    switch (orientation) {
        case 0: return { x: alg(16 * x), y: alg(16 * y) };
        case 1: return { x: alg(0, 8 * (x - y)), y: alg(0, 8 * (x + y)) };
        case 2: return { x: alg(-16 * y), y: alg(16 * x) };
        case 3: return { x: alg(0, -8 * (x + y)), y: alg(0, 8 * (x - y)) };
        case 4: return { x: alg(-16 * x), y: alg(-16 * y) };
        case 5: return { x: alg(0, 8 * (y - x)), y: alg(0, -8 * (x + y)) };
        case 6: return { x: alg(16 * y), y: alg(-16 * x) };
        case 7: return { x: alg(0, 8 * (x + y)), y: alg(0, 8 * (y - x)) };
    }
}
function transformVertex(vertex, pose) {
    const rotated = rotatedLocal(vertex[0], vertex[1], pose.orientation, pose.reflected);
    return {
        x: algAdd(rotated.x, alg(pose.x)),
        y: algAdd(rotated.y, alg(pose.y)),
    };
}
export function tangramPolygons(state, config) {
    return state.pieces.map((pose) => {
        const piece = config.inventory.find((item) => item.id === pose.id);
        if (!piece)
            throw new Error("missing Tangram piece definition");
        return {
            id: pose.id,
            vertices: piece.vertices.map((vertex) => transformVertex(vertex, pose)),
        };
    });
}
function projection(point, axis) {
    return dot(point, axis);
}
function polygonInterval(vertices, axis) {
    let min = projection(vertices[0], axis);
    let max = min;
    for (const point of vertices.slice(1)) {
        const value = projection(point, axis);
        if (algCompare(value, min) < 0)
            min = value;
        if (algCompare(value, max) > 0)
            max = value;
    }
    return [min, max];
}
function polygonsOverlapStrict(a, b) {
    for (const polygon of [a, b]) {
        for (let i = 0; i < polygon.length; i += 1) {
            const p = polygon[i];
            const q = polygon[(i + 1) % polygon.length];
            const edge = pointSub(q, p);
            const axis = { x: { a: -edge.y.a, b: -edge.y.b }, y: edge.x };
            const [minA, maxA] = polygonInterval(a, axis);
            const [minB, maxB] = polygonInterval(b, axis);
            if (algCompare(maxA, minB) <= 0 || algCompare(maxB, minA) <= 0)
                return false;
        }
    }
    return true;
}
function withinBoard(point, config) {
    const zero = alg(0);
    const maxX = alg(config.board.width * 16);
    const maxY = alg(config.board.height * 16);
    return algCompare(point.x, zero) >= 0 &&
        algCompare(point.y, zero) >= 0 &&
        algCompare(point.x, maxX) <= 0 &&
        algCompare(point.y, maxY) <= 0;
}
function validate(state, config) {
    const errors = [];
    const polygons = tangramPolygons(state, config);
    for (const polygon of polygons) {
        if (polygon.vertices.some((point) => !withinBoard(point, config))) {
            errors.push({ code: "out_of_bounds", pieces: [polygon.id] });
        }
    }
    for (let i = 0; i < polygons.length; i += 1) {
        for (let j = i + 1; j < polygons.length; j += 1) {
            if (polygonsOverlapStrict(polygons[i].vertices, polygons[j].vertices)) {
                errors.push({ code: "overlap", pieces: [polygons[i].id, polygons[j].id].sort() });
            }
        }
    }
    errors.sort((a, b) => a.code.localeCompare(b.code) ||
        (a.pieces?.join(",") ?? "").localeCompare(b.pieces?.join(",") ?? ""));
    return { invalid: errors.length > 0, errors };
}
function crossAt(a, b, p) {
    return cross(pointSub(b, a), pointSub(p, a));
}
function onSegment(point, a, b) {
    if (algSign(crossAt(a, b, point)) !== 0)
        return false;
    const d = pointSub(b, a);
    const t = dot(pointSub(point, a), d);
    const length = dot(d, d);
    return algCompare(t, alg(0)) >= 0 && algCompare(t, length) <= 0;
}
function canonicalEndpoints(segment) {
    return pointCompare(segment.a, segment.b) <= 0
        ? segment
        : { a: segment.b, b: segment.a };
}
function segmentKey(segment) {
    const normalized = canonicalEndpoints(segment);
    return pointKey(normalized.a) + "|" + pointKey(normalized.b);
}
function splitEdges(polygons) {
    const allVertices = polygons.flatMap((polygon) => polygon.vertices);
    const segments = [];
    for (const polygon of polygons) {
        for (let i = 0; i < polygon.vertices.length; i += 1) {
            const a = polygon.vertices[i];
            const b = polygon.vertices[(i + 1) % polygon.vertices.length];
            const d = pointSub(b, a);
            const points = allVertices
                .filter((point) => onSegment(point, a, b))
                .filter((point, index, array) => array.findIndex((candidate) => pointEq(candidate, point)) === index)
                .sort((p, q) => algCompare(dot(pointSub(p, a), d), dot(pointSub(q, a), d)));
            for (let j = 0; j < points.length - 1; j += 1) {
                if (!pointEq(points[j], points[j + 1]))
                    segments.push({ a: points[j], b: points[j + 1] });
            }
        }
    }
    return segments;
}
function boundarySegments(polygons) {
    const counts = new Map();
    for (const segment of splitEdges(polygons)) {
        const normalized = canonicalEndpoints(segment);
        const key = segmentKey(normalized);
        const entry = counts.get(key);
        if (entry)
            entry.count += 1;
        else
            counts.set(key, { segment: normalized, count: 1 });
    }
    return [...counts.values()].filter((entry) => entry.count === 1).map((entry) => entry.segment);
}
function sharedEndpoint(a, b) {
    if (pointEq(a.a, b.a))
        return { shared: a.a, otherA: a.b, otherB: b.b };
    if (pointEq(a.a, b.b))
        return { shared: a.a, otherA: a.b, otherB: b.a };
    if (pointEq(a.b, b.a))
        return { shared: a.b, otherA: a.a, otherB: b.b };
    if (pointEq(a.b, b.b))
        return { shared: a.b, otherA: a.a, otherB: b.a };
    return null;
}
function mergeCollinear(segmentsInput) {
    const segments = segmentsInput.map(canonicalEndpoints);
    let changed = true;
    while (changed) {
        changed = false;
        outer: for (let i = 0; i < segments.length; i += 1) {
            for (let j = i + 1; j < segments.length; j += 1) {
                const shared = sharedEndpoint(segments[i], segments[j]);
                if (!shared)
                    continue;
                const va = pointSub(shared.otherA, shared.shared);
                const vb = pointSub(shared.otherB, shared.shared);
                if (algSign(cross(va, vb)) !== 0 || algSign(dot(va, vb)) >= 0)
                    continue;
                const merged = canonicalEndpoints({ a: shared.otherA, b: shared.otherB });
                segments.splice(j, 1);
                segments.splice(i, 1, merged);
                changed = true;
                break outer;
            }
        }
    }
    return segments.sort((a, b) => segmentKey(a).localeCompare(segmentKey(b)));
}
function translateSegmentsToOrigin(segments) {
    const points = segments.flatMap((segment) => [segment.a, segment.b]);
    if (!points.length)
        return [];
    let minX = points[0].x;
    let minY = points[0].y;
    for (const point of points.slice(1)) {
        if (algCompare(point.x, minX) < 0)
            minX = point.x;
        if (algCompare(point.y, minY) < 0)
            minY = point.y;
    }
    return segments.map((segment) => canonicalEndpoints({
        a: {
            x: algSub(segment.a.x, minX),
            y: algSub(segment.a.y, minY),
        },
        b: {
            x: algSub(segment.b.x, minX),
            y: algSub(segment.b.y, minY),
        },
    })).sort((a, b) => segmentKey(a).localeCompare(segmentKey(b)));
}
function canonicalize(state, config) {
    const validation = validate(state, config);
    if (validation.invalid)
        throw new Error("cannot canonicalize invalid Tangram candidate");
    const boundary = mergeCollinear(boundarySegments(tangramPolygons(state, config)));
    const translated = translateSegmentsToOrigin(boundary);
    return { segments: translated.map(segmentKey) };
}
export const tangramAdapter = {
    parseCandidate,
    encodeCandidate(state, config) {
        const normalized = normalizeState(state.pieces, config);
        return encoder.encode(JSON.stringify(normalized.pieces.map((pose) => [
            pose.x,
            pose.y,
            pose.orientation,
            pose.reflected ? 1 : 0,
        ])));
    },
    decodeCandidate(bytes, config) {
        let tuples;
        try {
            tuples = JSON.parse(decoder.decode(bytes));
        }
        catch {
            throw new Error("Tangram candidate bytes are not valid JSON");
        }
        if (!Array.isArray(tuples) || tuples.length !== config.inventory.length) {
            throw new Error("Tangram candidate bytes must contain seven poses");
        }
        const pieces = tuples.map((tuple, index) => {
            if (!Array.isArray(tuple) || tuple.length !== 4)
                throw new Error("Tangram pose tuple must have four values");
            return parsePose({
                id: config.inventory[index].id,
                x: tuple[0],
                y: tuple[1],
                orientation: tuple[2],
                reflected: tuple[3] === 1 ? true : tuple[3] === 0 ? false : tuple[3],
            }, config);
        });
        return normalizeState(pieces, config);
    },
    validate,
    canonicalize,
    encodeCanonical(value) {
        return encoder.encode(JSON.stringify(value));
    },
};
export function tangramEnvelope(pieces) {
    return {
        game: TANGRAM_CONFIG.game,
        config_id: TANGRAM_CONFIG.config_id,
        state_version: TANGRAM_CONFIG.state_version,
        data: { pieces: pieces.map((piece) => ({ ...piece })) },
    };
}
export function applyTangramPose(state, pose, config) {
    if (!state.pieces.some((piece) => piece.id === pose.id))
        throw new Error("unknown Tangram piece " + pose.id);
    const pieces = state.pieces.map((piece) => piece.id === pose.id ? parsePose(pose, config) : piece);
    return normalizeState(pieces, config);
}

export function buildMatchKeyInput(config, canonicalBytes) {
    const header = encoder.encode("tds-visual-match\0\n" +
        "game=" + config.game + "\n" +
        "game_version=" + String(config.game_version) + "\n" +
        "config=" + config.config_id + "\n" +
        "equivalence=" + String(config.equivalence_version) + "\n" +
        "canonical_bytes=" + String(canonicalBytes.byteLength) + "\n");
    const result = new Uint8Array(header.byteLength + canonicalBytes.byteLength);
    result.set(header);
    result.set(canonicalBytes, header.byteLength);
    return result;
}
function bytesToHex(bytes) {
    return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
export async function computeMatchKey(adapter, state, config) {
    const validation = adapter.validate(state, config);
    if (validation.invalid)
        throw new Error("cannot compute match key for invalid candidate");
    const canonical = adapter.canonicalize(state, config);
    const canonicalBytes = adapter.encodeCanonical(canonical, config);
    const input = buildMatchKeyInput(config, canonicalBytes);
    const digest = await crypto.subtle.digest("SHA-256", Uint8Array.from(input).buffer);
    return bytesToHex(new Uint8Array(digest));
}
