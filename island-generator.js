/**
 * island-generator.js
 * 
 * Floating voxel island generator.
 * Creates a circular island with layered grass, dirt, and stone,
 * tapering downward for a floating-island silhouette.
 * Uses seeded RNG (FNV-1a + xorshift) for deterministic output.
 * 
 * @module island-generator
 */

// ─── Color Palettes (r, g, b as 0-1 floats) ────────────────────────────────

const GRASS_COLORS = [
  [0.28, 0.58, 0.22],
  [0.32, 0.62, 0.26],
  [0.25, 0.52, 0.20],
];

const DIRT_COLORS = [
  [0.42, 0.30, 0.16],
  [0.48, 0.32, 0.18],
  [0.38, 0.26, 0.14],
];

const STONE_COLORS = [
  [0.48, 0.48, 0.48],
  [0.52, 0.52, 0.52],
  [0.42, 0.42, 0.44],
];

// ─── Layer Depths ───────────────────────────────────────────────────────────

const GRASS_DEPTH = 2;
const DIRT_DEPTH = 3;
const STONE_DEPTH = 4;
const TOTAL_DEPTH = GRASS_DEPTH + DIRT_DEPTH + STONE_DEPTH; // 9

// ─── Seeded RNG (FNV-1a hash + xorshift LCG) ───────────────────────────────

/**
 * Creates a deterministic pseudo-random number generator from a seed string.
 * Uses FNV-1a for hashing the seed and xorshift for the sequence.
 * @param {string} seedStr - Seed string for deterministic generation.
 * @returns {() => number} Function returning floats in [0, 1).
 */
function seededRng(seedStr) {
  let h = 2166136261;
  const s = (seedStr || 'island').toLowerCase();
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  }
  let st = h;
  return () => {
    st ^= st << 13;
    st ^= st >>> 17;
    st ^= st << 5;
    return (st >>> 0) / 4294967296;
  };
}

// ─── Helper Utilities ───────────────────────────────────────────────────────

/**
 * Picks a random element from an array using the provided RNG.
 * @param {Array} arr - Source array.
 * @param {() => number} rng - Seeded RNG function.
 * @returns {*} Random element from the array.
 */
function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

// ─── Main Generator ─────────────────────────────────────────────────────────

/**
 * Generates a floating voxel island.
 * 
 * The island is a roughly circular platform that tapers downward,
 * with layered material types: grass on top, dirt in the middle, stone at bottom.
 * Edges are randomized for an organic, eroded look.
 * 
 * @param {string} seed - Seed string for deterministic generation.
 * @returns {{ voxels: Array<{x:number, y:number, z:number, r:number, g:number, b:number, type:string}> }}
 */
export function generateIsland(seed) {
  const rng = seededRng(seed);
  const voxels = [];
  const added = new Set(); // Prevents duplicate voxel positions

  /**
   * Adds a voxel if its position hasn't been used yet.
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {number} r 
   * @param {number} g 
   * @param {number} b 
   * @param {string} type 
   */
  function addVoxel(x, y, z, r, g, b, type) {
    const rx = Math.round(x);
    const ry = Math.round(y);
    const rz = Math.round(z);
    const key = `${rx},${ry},${rz}`;
    if (added.has(key)) return;
    added.add(key);
    voxels.push({ x: rx, y: ry, z: rz, r, g, b, type });
  }

  const radius = 9;

  // ── Iterate over circular footprint ─────────────────────────────────────
  // The island spans from x,z in [-radius-1, radius+1] to allow fuzzy edges

  for (let x = -radius - 1; x <= radius + 1; x++) {
    for (let z = -radius - 1; z <= radius + 1; z++) {
      const dist = Math.sqrt(x * x + z * z);

      // Skip voxels outside the fuzzy radius boundary
      if (dist > radius + rng() * 1.5) continue;

      // Taper depth: center is deepest, edges are shallow
      const maxDepth = Math.floor((1 - dist / (radius + 2)) * TOTAL_DEPTH);
      if (maxDepth <= 0) continue;

      // ── Build column downward from the surface ────────────────────────
      // Top surface sits at y = -1 (tree grows upward from y = 0)

      for (let d = 0; d < maxDepth; d++) {
        const y = -1 - d;

        // Determine material layer based on depth
        let type, color;
        if (d < GRASS_DEPTH) {
          type = 'grass';
          color = pick(GRASS_COLORS, rng);
        } else if (d < GRASS_DEPTH + DIRT_DEPTH) {
          type = 'dirt';
          color = pick(DIRT_COLORS, rng);
        } else {
          type = 'stone';
          color = pick(STONE_COLORS, rng);

          // 15% chance to skip stone voxels near edges for organic overhangs
          if (dist > radius * 0.5 && rng() < 0.15) continue;
        }

        addVoxel(x, y, z, color[0], color[1], color[2], type);
      }
    }
  }

  return { voxels };
}
