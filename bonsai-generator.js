/**
 * bonsai-generator.js
 * 
 * Procedural voxel bonsai tree generator.
 * Fully aligned with the Hugging Face Bonsai WebGPU demo.
 * 
 * @module bonsai-generator
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

function hexToRgb(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255
  ];
}

const kh = ['#4a3728','#3d2e20','#5c4535','#2e2218','#6b5444'].map(hexToRgb);
const Ah = ['#e63c2e','#d4452f','#f05a3a','#c93525','#ff6b45','#e8502a','#d94a30','#f24832','#ff7f50','#e06030'].map(hexToRgb);

const TRUNK_COORDS = [
  {x:0,y:9,z:0},{x:-1,y:9,z:0},{x:0,y:9,z:-1},{x:-1,y:9,z:-1},
  {x:0,y:10,z:0},{x:-1,y:10,z:0},{x:0,y:10,z:-1},{x:-1,y:10,z:-1},
  {x:0,y:11,z:0},{x:-1,y:11,z:0},{x:0,y:11,z:-1},{x:0,y:12,z:0},
  {x:-1,y:12,z:0},{x:0,y:12,z:-1},{x:0,y:13,z:0},{x:-1,y:13,z:0},
  {x:0,y:14,z:0},{x:-1,y:14,z:0},{x:0,y:15,z:0},{x:0,y:16,z:0},
  {x:-2,y:15,z:0},{x:-3,y:15,z:0},{x:-3,y:16,z:0},{x:-4,y:16,z:0},
  {x:-4,y:16,z:1},{x:-5,y:17,z:0},{x:-5,y:17,z:1},{x:1,y:14,z:0},
  {x:2,y:14,z:0},{x:2,y:15,z:0},{x:3,y:15,z:0},{x:3,y:16,z:0},
  {x:4,y:16,z:0},{x:4,y:17,z:0},{x:5,y:17,z:-1},{x:0,y:14,z:1},
  {x:0,y:15,z:1},{x:0,y:15,z:2},{x:1,y:16,z:2},{x:1,y:16,z:3},
  {x:0,y:13,z:-1},{x:0,y:14,z:-2},{x:0,y:15,z:-2},{x:-1,y:15,z:-2},
  {x:-1,y:16,z:-3},{x:0,y:16,z:-3},{x:0,y:17,z:0},{x:0,y:18,z:0},
  {x:1,y:13,z:-1},{x:-2,y:14,z:-1},{x:2,y:16,z:1},{x:-3,y:17,z:-1},
  {x:1,y:8,z:0},{x:-2,y:8,z:0},{x:0,y:8,z:1},{x:-1,y:8,z:-1},
  {x:1,y:7,z:1},{x:-2,y:7,z:-1}
];

export function generateBonsai(seed) {
  const rng = seededRng(seed);
  const voxels = [];
  const added = new Set();

  function pick(arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function addVoxel(x, y, z, rgb, type) {
    const rx = Math.round(x);
    const ry = Math.round(y);
    const rz = Math.round(z);
    const key = `${rx},${ry},${rz}`;
    if (added.has(key)) return;
    added.add(key);
    voxels.push({ x: rx, y: ry, z: rz, r: rgb[0], g: rgb[1], b: rgb[2], type });
  }

  // 1. Generate Trunk from hardcoded coords
  TRUNK_COORDS.forEach(e => {
    let color = pick(kh);
    addVoxel(e.x, e.y + 0.5, e.z, color, 'trunk');
  });

  const Qh = [];
  const $h = new Set();
  function eg(e, t, n) {
    let r = `${e},${t},${n}`;
    if (!$h.has(r)) {
      $h.add(r);
      Qh.push({ x: e, y: t, z: n });
    }
  }

  // 2. Generate Leaves in main sphere
  var tg = 6.5, ng = tg / 4.5;
  for (let e = -8; e <= 8; e++) {
    for (let t = 15; t <= 26; t++) {
      for (let n = -7; n <= 7; n++) {
        let r = (t - 20) * ng;
        if (Math.sqrt(e*e + r*r + n*n) < tg + (Math.sin(e*1.8 + n*1.4)*0.7 + Math.cos(t*1.1 + e*0.7)*0.6 + Math.sin(n*2.3 - t*0.5)*0.4) && rng() > 0.18) {
          eg(e, t, n);
        }
      }
    }
  }

  // Smaller leaf spheres
  const leafSpheres = [
    { cx: -5, cy: 17, cz: 0, r: 3.5 },
    { cx: -5, cy: 17, cz: 1, r: 2.8 },
    { cx: 5, cy: 17, cz: -1, r: 3.5 },
    { cx: 4, cy: 18, cz: 0, r: 3 },
    { cx: 1, cy: 17, cz: 3, r: 3.2 },
    { cx: 1, cy: 17, cz: -3, r: 3 },
    { cx: -1, cy: 17, cz: -3, r: 2.8 },
    { cx: 0, cy: 24, cz: 0, r: 3 },
    { cx: -2, cy: 23, cz: 1, r: 2.5 },
    { cx: 2, cy: 23, cz: -1, r: 2.5 },
    { cx: 1, cy: 24, cz: 1, r: 2 },
    { cx: -1, cy: 24, cz: -1, r: 2 },
    { cx: -7, cy: 18, cz: 0, r: 2 },
    { cx: 6, cy: 18, cz: 0, r: 2 },
    { cx: 0, cy: 18, cz: 5, r: 2.2 },
    { cx: 0, cy: 18, cz: -5, r: 2.2 },
    { cx: -3, cy: 15, cz: 2, r: 2.5 },
    { cx: 3, cy: 15, cz: -2, r: 2.5 },
    { cx: -2, cy: 15, cz: -3, r: 2 },
    { cx: 2, cy: 15, cz: 3, r: 2 }
  ];

  leafSpheres.forEach(e => {
    for (let t = Math.floor(e.cx - e.r - 1); t <= Math.ceil(e.cx + e.r + 1); t++) {
      for (let n = Math.floor(e.cy - e.r); n <= Math.ceil(e.cy + e.r + 1); n++) {
        for (let r = Math.floor(e.cz - e.r - 1); r <= Math.ceil(e.cz + e.r + 1); r++) {
          let i = t - e.cx,
              a = (n - e.cy) * 1.15,
              o = r - e.cz;
          if (Math.sqrt(i*i + a*a + o*o) < e.r && rng() > 0.2) {
            eg(t, n, r);
          }
        }
      }
    }
  });

  // Additional random foliage tufts
  for (let e = 0; e < 25; e++) {
    let rx = Math.round((rng() - 0.5) * 14);
    let rz = Math.round((rng() - 0.5) * 10);
    let ry = Math.floor(rng() * 3) + 1;
    eg(rx, ry, rz);
  }

  // Push leaf voxels
  Qh.forEach(e => {
    let color = pick(Ah);
    addVoxel(e.x, e.y + 0.5, e.z, color, 'leaf');
  });

  return { voxels };
}
