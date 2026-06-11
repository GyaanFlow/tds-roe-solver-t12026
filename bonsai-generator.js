/**
 * bonsai-generator.js
 * 
 * Procedural voxel bonsai tree generator.
 * Uses seeded RNG (FNV-1a hash + LCG) for deterministic output.
 * Generates trunk, branches, foliage clusters, and occasional fruit.
 * 
 * @module bonsai-generator
 */

// ─── Color Palettes (r, g, b as 0-1 floats) ────────────────────────────────

const TRUNK_COLORS = [
  [0.29, 0.18, 0.10],
  [0.42, 0.23, 0.13],
  [0.49, 0.29, 0.17],
];

const LEAF_COLORS = [
  [0.10, 0.36, 0.10],
  [0.18, 0.54, 0.18],
  [0.27, 0.60, 0.27],
  [0.15, 0.45, 0.20],
];

const FRUIT_COLOR = [0.88, 0.15, 0.08];

// ─── Seeded RNG (FNV-1a hash + xorshift LCG) ───────────────────────────────

/**
 * Creates a deterministic pseudo-random number generator from a seed string.
 * Uses FNV-1a for hashing the seed and xorshift for the sequence.
 * @param {string} seedStr - Seed string for deterministic generation.
 * @returns {() => number} Function returning floats in [0, 1).
 */
function seededRng(seedStr) {
  let h = 2166136261;
  const s = (seedStr || 'bonsai').toLowerCase();
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

/**
 * Returns a random integer in [min, max] (inclusive).
 * @param {number} min 
 * @param {number} max 
 * @param {() => number} rng 
 * @returns {number}
 */
function randInt(min, max, rng) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Returns a random float in [min, max).
 * @param {number} min 
 * @param {number} max 
 * @param {() => number} rng 
 * @returns {number}
 */
function randFloat(min, max, rng) {
  return rng() * (max - min) + min;
}

// ─── Main Generator ─────────────────────────────────────────────────────────

/**
 * Generates a procedural voxel bonsai tree.
 * 
 * @param {string} seed - Seed string for deterministic generation.
 * @returns {{ voxels: Array<{x:number, y:number, z:number, r:number, g:number, b:number, type:string}> }}
 */
export function generateBonsai(seed) {
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

  // ── Parameters ──────────────────────────────────────────────────────────

  const trunkHeight = randInt(11, 14, rng);
  const lean1 = randFloat(-1.5, 1.5, rng);  // Primary S-curve lean
  const lean2 = randFloat(-1.0, 1.0, rng);  // Secondary lean for depth
  const branchCount = randInt(4, 6, rng);

  // Store trunk center positions at each height for branch origins
  const trunkPath = [];

  // ── 1. Root Flare ───────────────────────────────────────────────────────
  // Thick 4×4 footprint at y=0 with noise for organic look

  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      const distFromCenter = Math.sqrt(dx * dx + dz * dz);
      // 100% fill in center, 60% at edges
      if (distFromCenter > 2.5) continue;
      if (distFromCenter > 1.5 && rng() > 0.6) continue;

      const color = pick(TRUNK_COLORS, rng);
      addVoxel(dx, 0, dz, color[0], color[1], color[2], 'trunk');
    }
  }

  // ── 2. Trunk ────────────────────────────────────────────────────────────
  // S-curve path with tapering width

  for (let y = 0; y <= trunkHeight; y++) {
    const t = y / trunkHeight; // Normalized height [0, 1]

    // S-curve displacement for organic trunk shape
    const cx = Math.sin(t * Math.PI) * lean1 + Math.sin(t * Math.PI * 2) * lean2 * 0.3;
    const cz = Math.cos(t * Math.PI * 0.7) * lean2 * 0.5;

    // Tapering width: thicker at base, thinner at top
    let width;
    if (y < 4) {
      width = 2;
    } else if (y < 8) {
      width = 1.5;
    } else {
      width = 1;
    }

    // Store trunk center for branch spawning
    trunkPath.push({ x: cx, y, z: cz });

    // Fill cylindrical cross-section at this height
    const iWidth = Math.ceil(width);
    for (let dx = -iWidth; dx <= iWidth; dx++) {
      for (let dz = -iWidth; dz <= iWidth; dz++) {
        const dist = Math.sqrt(dx * dx + dz * dz);
        const threshold = width * 0.7 + rng() * 0.3;
        if (dist <= threshold) {
          const color = pick(TRUNK_COLORS, rng);
          addVoxel(cx + dx, y, cz + dz, color[0], color[1], color[2], 'trunk');
        }
      }
    }
  }

  // ── 3. Branches ─────────────────────────────────────────────────────────
  // 4-6 branches sprouting from 40-90% trunk height

  const branchTips = []; // Collect tips for foliage placement

  for (let b = 0; b < branchCount; b++) {
    // Pick a trunk position between 40% and 90% of the way up
    const minIdx = Math.floor(trunkPath.length * 0.4);
    const maxIdx = Math.floor(trunkPath.length * 0.9);
    const originIdx = randInt(minIdx, maxIdx, rng);
    const origin = trunkPath[originIdx];

    // Branch direction — evenly spaced around trunk with random offset
    const angle = (b / branchCount) * Math.PI * 2 + (rng() - 0.5) * 0.8;
    const branchLength = randInt(3, 6, rng);

    // Step along the branch
    let bx = origin.x;
    let by = origin.y;
    let bz = origin.z;

    for (let s = 0; s < branchLength; s++) {
      const dyStep = 0.3 + rng() * 0.4; // Upward bias
      bx += Math.cos(angle) * 1.0 + (rng() - 0.5) * 0.3; // Slight jitter
      by += dyStep;
      bz += Math.sin(angle) * 1.0 + (rng() - 0.5) * 0.3;

      const color = pick(TRUNK_COLORS, rng);
      addVoxel(bx, by, bz, color[0], color[1], color[2], 'branch');
    }

    // Record branch tip for foliage
    branchTips.push({ x: bx, y: by, z: bz });
  }

  // Also add the trunk top as a foliage point
  const trunkTop = trunkPath[trunkPath.length - 1];
  branchTips.push({ x: trunkTop.x, y: trunkTop.y, z: trunkTop.z });

  // ── 4. Foliage & Fruit ─────────────────────────────────────────────────
  // Ellipsoidal leaf clusters at each branch tip and trunk top.
  // 8% of leaf positions become fruit instead.

  for (const tip of branchTips) {
    const radius = randFloat(2, 4, rng);

    const iRadius = Math.ceil(radius);
    for (let dx = -iRadius; dx <= iRadius; dx++) {
      for (let dy = -iRadius; dy <= iRadius; dy++) {
        for (let dz = -iRadius; dz <= iRadius; dz++) {
          // Squashed Y for flatter ellipsoidal shape
          const dist = Math.sqrt(dx * dx + (dy * 1.3) * (dy * 1.3) + dz * dz);
          if (dist > radius) continue;
          if (rng() <= 0.3) continue; // 30% skip for organic gaps

          // 8% chance of fruit
          if (rng() < 0.08) {
            addVoxel(
              tip.x + dx, tip.y + dy, tip.z + dz,
              FRUIT_COLOR[0], FRUIT_COLOR[1], FRUIT_COLOR[2],
              'fruit'
            );
          } else {
            const color = pick(LEAF_COLORS, rng);
            addVoxel(
              tip.x + dx, tip.y + dy, tip.z + dz,
              color[0], color[1], color[2],
              'leaf'
            );
          }
        }
      }
    }
  }

  return { voxels };
}
