/**
 * island-generator.js
 * 
 * Floating voxel island generator.
 * Creates a circular island with layered grass, dirt, and stone underside.
 * Fully aligned with the Hugging Face Bonsai WebGPU demo.
 * 
 * @module island-generator
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

function hexToRgb(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255
  ];
}

const Dh = ['#4a8c3f','#3d7a34','#5a9e4a','#2d6b24','#68ad58','#3f8535','#4d9040','#55a048'].map(hexToRgb);
const Oh = ['#a0978a','#8c8478','#b5ad9e','#9a9184','#c2bab0','#7d756a','#bbb3a6','#938b7f'].map(hexToRgb);
const Yh = ['#8B6914','#7A5C12','#6B4E10','#9C7A1E','#5C4010','#A07828','#6E5518'].map(hexToRgb);
const Xh = ['#706860','#5E564F','#887F75','#4D4640','#63594F','#7A7068'].map(hexToRgb);
const jh = ['#e63c2e','#f05a3a','#ff6b45','#f5a623','#ff8c42','#e8502a'].map(hexToRgb);
const ig = ['#3a8530','#4a9540','#2d7020','#5aad50','#3d8a35'].map(hexToRgb);
const og = ['#f5e6c8','#e8d5b0','#d4c49a','#c9b88e'].map(hexToRgb);

export function generateIsland(seed) {
  const rng = seededRng(seed);
  const voxels = [];
  const added = new Set();

  function pick(arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function Jh(e, t) {
    return Math.sin(e*1.7+t*.9)*.4+Math.cos(t*2.1-e*.6)*.35+Math.sin((e+t)*1.1)*.25;
  }

  function addVoxel(x, y, z, rgb, type, extra = {}) {
    const rx = Math.round(x * 100) / 100;
    const ry = Math.round(y * 100) / 100;
    const rz = Math.round(z * 100) / 100;
    const key = `${Math.round(rx*100)},${Math.round(ry*100)},${Math.round(rz*100)}`;
    if (added.has(key)) return;
    added.add(key);
    voxels.push({ x: rx, y: ry, z: rz, r: rgb[0], g: rgb[1], b: rgb[2], type, ...extra });
  }

  const Kh = [];
  const qh = [];

  // Generate Grass top layers
  for (let e = -8; e <= 8; e++) {
    for (let t = -6; t <= 6; t++) {
      if (Math.sqrt(e * e * 0.45 + t * t * 0.55) < 7.5 + Jh(e, t) * 1.5) {
        Kh.push({ x: e, y: 0, z: t });
      }
    }
  }

  for (let e = -9; e <= 9; e++) {
    for (let t = -7; t <= 7; t++) {
      if (Math.sqrt(e * e * 0.4 + t * t * 0.5) < 8.5 + Jh(e * 0.7, t * 0.7) * 1.2) {
        Kh.push({ x: e, y: -1, z: t });
      }
    }
  }

  for (let e = -7; e <= 6; e++) {
    for (let t = -5; t <= 5; t++) {
      if (Math.sqrt(e * e * 0.5 + t * t * 0.6) < 6 + Jh(e, t) * 1.2) {
        Kh.push({ x: e, y: 1, z: t });
      }
    }
  }

  for (let e = -5; e <= 4; e++) {
    for (let t = -4; t <= 3; t++) {
      if (Math.sqrt(e * e * 0.55 + t * t * 0.65) < 4.5 + Jh(e, t) * 0.9) {
        Kh.push({ x: e, y: 2, z: t });
      }
    }
  }

  for (let e = -4; e <= 3; e++) {
    for (let t = -3; t <= 2; t++) {
      if (Math.sqrt(e * e * 0.6 + t * t * 0.7) < 3.5 + Jh(e, t) * 0.7) {
        Kh.push({ x: e, y: 3, z: t });
      }
    }
  }

  for (let e = -3; e <= 2; e++) {
    for (let t = -2; t <= 2; t++) {
      if (Math.sqrt(e * e * 0.7 + t * t * 0.8) < 2.8 + Jh(e, t) * 0.5) {
        Kh.push({ x: e, y: 4, z: t });
      }
    }
  }

  for (let e = -2; e <= 1; e++) {
    for (let t = -1; t <= 1; t++) {
      if (Math.sqrt(e * e + t * t) < 2) {
        Kh.push({ x: e, y: 5, z: t });
      }
    }
  }

  for (let e = -1; e <= 0; e++) {
    for (let t = -1; t <= 0; t++) {
      Kh.push({ x: e, y: 6, z: t });
    }
  }

  // Piles / side hills
  for (let e = 4; e <= 8; e++) {
    for (let t = -2; t <= 3; t++) {
      let n = e - 6, r = t - 0.5, i = Math.sqrt(n * n + r * r);
      if (i < 2.8 + Jh(e, t) * 0.5) Kh.push({ x: e, y: 1, z: t });
      if (i < 2 + Jh(e, t) * 0.3) Kh.push({ x: e, y: 2, z: t });
      if (i < 1.2) Kh.push({ x: e, y: 3, z: t });
    }
  }

  for (let e = -6; e <= -3; e++) {
    for (let t = -5; t <= -2; t++) {
      let n = e + 4.5, r = t + 3.5, i = Math.sqrt(n * n + r * r);
      if (i < 2 + Jh(e, t) * 0.4) Kh.push({ x: e, y: 1, z: t });
      if (i < 1.2) Kh.push({ x: e, y: 2, z: t });
    }
  }

  // Underside dirt and stone
  for (let e = -2; e >= -14; e--) {
    let t = Math.abs(e + 1),
        n = Math.max(0.5, 8.5 - t * 0.55 + Math.sin(t * 0.8) * 0.8),
        r = Math.sin(t * 0.7) * 0.4,
        i = Math.cos(t * 0.9) * 0.3;
    for (let a = -10; a <= 10; a++) {
      for (let o = -8; o <= 8; o++) {
        let s = a - r, c = o - i;
        if (Math.sqrt(s * s * 0.45 + c * c * 0.55) < n + Jh(a * 0.8 + t * 0.3, o * 0.8 - t * 0.2) * (1 + t * 0.08)) {
          let isDirt = t < 4;
          qh.push({ x: a, y: e, z: o, type: isDirt ? 'dirt' : 'stone' });
        }
      }
    }
  }

  // Stone columns extending downward
  const columns = [
    { cx: 0, cz: 0, length: 4, r: 1.2 },
    { cx: -3, cz: -1, length: 3, r: 0.9 },
    { cx: 2, cz: 2, length: 3, r: 0.8 },
    { cx: -1, cz: -3, length: 2, r: 0.7 },
    { cx: 3, cz: -2, length: 2, r: 0.6 },
    { cx: -4, cz: 1, length: 2, r: 0.7 },
    { cx: 1, cz: -4, length: 2, r: 0.5 },
    { cx: -2, cz: 3, length: 3, r: 0.8 }
  ];
  columns.forEach(col => {
    for (let t = -14; t >= -14 - col.length; t--) {
      let n = Math.abs(t + 14), r = Math.max(0.3, col.r - n * 0.25);
      for (let i = Math.floor(col.cx - r - 1); i <= Math.ceil(col.cx + r + 1); i++) {
        for (let a = Math.floor(col.cz - r - 1); a <= Math.ceil(col.cz + r + 1); a++) {
          let o = i - col.cx, s = a - col.cz;
          if (Math.sqrt(o * o + s * s) < r + Jh(i + n, a - n) * 0.3) {
            qh.push({ x: i, y: t, z: a, type: 'stone' });
          }
        }
      }
    }
  });

  // Push underside voxels
  qh.forEach(e => {
    let color = e.type === 'dirt' ? pick(Yh) : pick(Xh);
    addVoxel(e.x, e.y + 0.5, e.z, color, 'underside');
  });

  // Push grass voxels
  Kh.forEach(e => {
    let color = pick(Dh);
    addVoxel(e.x, e.y + 0.5, e.z, color, 'grass');
  });

  // Rocks on the surface
  const Zh = [
    { x: -2, y: 5, z: -1 }, { x: -1, y: 5, z: -1 }, { x: 0, y: 5, z: -1 }, { x: 1, y: 5, z: -1 },
    { x: -2, y: 5, z: 0 }, { x: -1, y: 5, z: 0 }, { x: 0, y: 5, z: 0 }, { x: 1, y: 5, z: 0 },
    { x: -1, y: 5, z: 1 }, { x: 0, y: 5, z: 1 }, { x: 1, y: 5, z: 1 }, { x: -2, y: 5, z: 1 },
    { x: -1, y: 6, z: -1 }, { x: 0, y: 6, z: -1 }, { x: 1, y: 6, z: -1 }, { x: -2, y: 6, z: 0 },
    { x: -1, y: 6, z: 0 }, { x: 0, y: 6, z: 0 }, { x: 1, y: 6, z: 0 }, { x: -1, y: 6, z: 1 },
    { x: 0, y: 6, z: 1 }, { x: -2, y: 6, z: -1 }, { x: -1, y: 7, z: -1 }, { x: 0, y: 7, z: -1 },
    { x: -1, y: 7, z: 0 }, { x: 0, y: 7, z: 0 }, { x: 1, y: 7, z: 0 }, { x: 0, y: 7, z: 1 },
    { x: -1, y: 7, z: 1 }, { x: 0, y: 8, z: 0 }, { x: -1, y: 8, z: 0 }, { x: 0, y: 8, z: -1 },
    { x: -1, y: 8, z: -1 },
    { x: 3, y: 2, z: 2 }, { x: 3, y: 3, z: 2 }, { x: 4, y: 1, z: -1 }, { x: 4, y: 2, z: -1 },
    { x: -4, y: 1, z: -2 }, { x: -4, y: 2, z: -2 }, { x: -3, y: 2, z: 2 }, { x: -3, y: 3, z: 2 },
    { x: 5, y: 1, z: 1 }, { x: 5, y: 1, z: 0 }, { x: -5, y: 1, z: 0 }, { x: 2, y: 3, z: -2 },
    { x: 2, y: 4, z: -2 }, { x: -3, y: 3, z: -1 }, { x: 6, y: 1, z: -2 }, { x: -6, y: 0, z: 2 },
    { x: 1, y: 4, z: 2 }, { x: -2, y: 4, z: -2 }, { x: 3, y: 1, z: -3 }, { x: -2, y: 1, z: 3 },
    { x: 6, y: 2, z: 0 }, { x: 6, y: 3, z: 0 }, { x: 7, y: 2, z: 1 }
  ];
  Zh.forEach(e => {
    let color = pick(Oh);
    addVoxel(e.x, e.y + 0.5, e.z, color, 'rock');
  });

  // Calculate surface height map for foliage
  const heightMap = {};
  Kh.forEach(e => {
    let key = `${e.x},${e.z}`;
    if (!heightMap[key] || e.y > heightMap[key]) {
      heightMap[key] = e.y;
    }
  });

  const rockSet = new Set(Zh.map(e => `${e.x},${e.z}`));

  Object.entries(heightMap).forEach(([coord, maxH]) => {
    const [nx, nz] = coord.split(',').map(Number);
    const hasRock = rockSet.has(coord);

    // Flowers
    if (!hasRock && rng() < 0.4) {
      let count = rng() < 0.3 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        let color = pick(jh);
        let rx = nx + (rng() - 0.5) * 0.5;
        let ry = (maxH + 1) + 0.22;
        let rz = nz + (rng() - 0.5) * 0.5;
        addVoxel(rx, ry, rz, color, 'flower', { w: 0.35, h: 0.35, d: 0.35 });
      }
    }

    // Grass tufts
    if (!hasRock && rng() < 0.3) {
      let color = pick(ig);
      let rx = nx + (rng() - 0.5) * 0.6;
      let ry = (maxH + 1) + 0.32;
      let rz = nz + (rng() - 0.5) * 0.6;
      let rotX = (rng() - 0.5) * 0.15;
      let rotZ = (rng() - 0.5) * 0.15;
      addVoxel(rx, ry, rz, color, 'grassTuft', { w: 0.25, h: 0.55, d: 0.25, rx: rotX, rz: rotZ });
    }

    // Mushrooms
    if (!hasRock && nx < -2 && rng() < 0.15) {
      let color = pick(og);
      let rx = nx + (rng() - 0.5) * 0.3;
      let ry = (maxH + 1) + 0.15;
      let rz = nz + (rng() - 0.5) * 0.3;
      addVoxel(rx, ry, rz, color, 'mushroom', { w: 0.25, h: 0.22, d: 0.25 });
    }
  });

  return { voxels };
}
