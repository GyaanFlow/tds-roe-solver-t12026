// Quick 3D head: a photo-textured ellipsoid exported as a binary glTF 2.0 (GLB), plus the same structural GLB checks the
// exam applies. Pure code (no DOM, no network) so it is unit-tested in Node.
import { GLB_MAX_BYTES } from './face-logic.js';

const MAGIC = 0x46546c67;
const JSON_CHUNK = 0x4e4f534a;
const BIN_CHUNK = 0x004e4942;
const pad4 = (n) => (4 - (n % 4)) % 4;

/** The checks the exam applies to a submitted GLB (magic, version, length, chunk layout, JSON, at least one mesh) and the size cap. */
export function validateGlb(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (bytes.byteLength < 20) return { ok: false, message: 'GLB is too short.' };
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(0, true) !== MAGIC) return { ok: false, message: 'Not a GLB: missing glTF magic bytes.' };
  if (view.getUint32(4, true) !== 2) return { ok: false, message: 'The file must be GLB version 2.' };
  if (view.getUint32(8, true) !== bytes.byteLength) return { ok: false, message: 'GLB file length is inconsistent.' };
  if (bytes.byteLength > GLB_MAX_BYTES) return { ok: false, message: 'GLB exceeds 2,000,000 bytes.' };
  let at = 12;
  let json = null;
  while (at < bytes.byteLength) {
    if (at + 8 > bytes.byteLength) return { ok: false, message: 'Incomplete GLB chunk header.' };
    const length = view.getUint32(at, true);
    const type = view.getUint32(at + 4, true);
    at += 8;
    if (length % 4 !== 0 || at + length > bytes.byteLength) return { ok: false, message: 'Invalid GLB chunk size.' };
    if (json === null) {
      if (type !== JSON_CHUNK) return { ok: false, message: 'The first GLB chunk must contain JSON.' };
      try { json = JSON.parse(new TextDecoder().decode(bytes.subarray(at, at + length))); } catch { return { ok: false, message: 'The GLB JSON chunk cannot be parsed.' }; }
    } else if (type !== BIN_CHUNK) return { ok: false, message: 'Unexpected GLB chunk type.' };
    at += length;
  }
  if (json?.asset?.version !== '2.0' || !Array.isArray(json.meshes) || !json.meshes.length) return { ok: false, message: 'GLB must contain a glTF 2.0 scene with a mesh.' };
  return { ok: true, bytes: bytes.byteLength, json };
}

/**
 * A head-shaped ellipsoid wearing the photo as its texture (projected from the front, so the back shows it mirrored).
 * `aspect` is photo width / height; `jpeg` the encoded texture. This is a quick starting point, not a likeness model.
 */
export function buildHeadGlb({ jpeg, aspect = 0.8, segments = 48, rings = 48 }) {
  if (!(jpeg instanceof Uint8Array) || jpeg.length < 100) throw new Error('A JPEG texture is required.');
  const ratio = Math.min(1.2, Math.max(0.5, Number(aspect) || 0.8));
  const a = ratio; const b = 1; const c = 0.9 * ratio; // radii along x, y, z
  const cols = Math.max(8, Math.min(120, segments | 0));
  const rows = Math.max(8, Math.min(120, rings | 0));
  const vertexCount = (cols + 1) * (rows + 1);
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  let v = 0;
  for (let r = 0; r <= rows; r += 1) {
    const phi = (r / rows) * Math.PI; // 0 = top of the head, PI = chin
    for (let s = 0; s <= cols; s += 1) {
      const theta = (s / cols) * Math.PI * 2; // 0 and 2*PI face the viewer (+z)
      const x = a * Math.sin(phi) * Math.sin(theta);
      const y = b * Math.cos(phi);
      const z = c * Math.sin(phi) * Math.cos(theta);
      positions.set([x, y, z], v * 3);
      const n = [x / (a * a), y / (b * b), z / (c * c)];
      const len = Math.hypot(...n) || 1;
      normals.set(n.map((k) => k / len), v * 3);
      uvs.set([0.5 + x / (2 * a), 0.5 - y / (2 * b)], v * 2);
      v += 1;
    }
  }
  const indices = new Uint16Array(cols * rows * 6);
  let q = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let s = 0; s < cols; s += 1) {
      const i0 = r * (cols + 1) + s;
      const i1 = i0 + 1;
      const i2 = i0 + cols + 1;
      const i3 = i2 + 1;
      indices.set([i0, i2, i1, i1, i2, i3], q);
      q += 6;
    }
  }
  const parts = [positions, normals, uvs, indices].map((arr) => new Uint8Array(arr.buffer));
  const offsets = [];
  let offset = 0;
  for (const part of parts) { offsets.push(offset); offset += part.length + pad4(part.length); }
  const imageOffset = offset;
  offset += jpeg.length + pad4(jpeg.length);
  const bin = new Uint8Array(offset);
  parts.forEach((part, i) => bin.set(part, offsets[i]));
  bin.set(jpeg, imageOffset);
  const json = {
    asset: { version: '2.0', generator: 'TDS portal quick head' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: 'head' }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 }, indices: 3, material: 0, mode: 4 }] }],
    materials: [{ pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicFactor: 0, roughnessFactor: 0.9 }, doubleSided: true }],
    textures: [{ source: 0, sampler: 0 }],
    images: [{ bufferView: 4, mimeType: 'image/jpeg' }],
    samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }],
    accessors: [
      { bufferView: 0, componentType: 5126, count: vertexCount, type: 'VEC3', min: [-a, -b, -c], max: [a, b, c] },
      { bufferView: 1, componentType: 5126, count: vertexCount, type: 'VEC3' },
      { bufferView: 2, componentType: 5126, count: vertexCount, type: 'VEC2' },
      { bufferView: 3, componentType: 5123, count: indices.length, type: 'SCALAR' },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: offsets[0], byteLength: parts[0].length, target: 34962 },
      { buffer: 0, byteOffset: offsets[1], byteLength: parts[1].length, target: 34962 },
      { buffer: 0, byteOffset: offsets[2], byteLength: parts[2].length, target: 34962 },
      { buffer: 0, byteOffset: offsets[3], byteLength: parts[3].length, target: 34963 },
      { buffer: 0, byteOffset: imageOffset, byteLength: jpeg.length },
    ],
    buffers: [{ byteLength: bin.length }],
  };
  const jsonBytes = new TextEncoder().encode(JSON.stringify(json));
  const jsonPadded = new Uint8Array(jsonBytes.length + pad4(jsonBytes.length)).fill(0x20);
  jsonPadded.set(jsonBytes);
  const total = 12 + 8 + jsonPadded.length + 8 + bin.length;
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint32(0, MAGIC, true);
  view.setUint32(4, 2, true);
  view.setUint32(8, total, true);
  view.setUint32(12, jsonPadded.length, true);
  view.setUint32(16, JSON_CHUNK, true);
  out.set(jsonPadded, 20);
  const binAt = 20 + jsonPadded.length;
  view.setUint32(binAt, bin.length, true);
  view.setUint32(binAt + 4, BIN_CHUNK, true);
  out.set(bin, binAt + 8);
  return out;
}
