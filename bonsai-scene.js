/* ── Voxel Bonsai Tree — Interactive 3D Scene Manager ── */

import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { generateBonsai } from './bonsai-generator.js';
import { generateIsland } from './island-generator.js';
import { createParticleSystem } from './particle-system.js';

function seededRng(seedStr) {
  let h = 2166136261;
  const s = (seedStr || 'scene').toLowerCase();
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  let st = h;
  return () => { st ^= st << 13; st ^= st >>> 17; st ^= st << 5; return (st >>> 0) / 4294967296; };
}

const hexToRgb = (hex) => {
  const num = parseInt(hex.replace('#', ''), 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255
  ];
};

const WINTER_PALETTES = {
  n: ['#e8f0e8','#d0e0d0','#c8dcc8','#f0f5f0','#dceadc'].map(hexToRgb),
  r: ['#d0d0d0','#c0c0c0','#e0e0e0','#b8b8b8','#cccccc'].map(hexToRgb),
  i: ['#1a4a2a','#224e30','#183e24','#2a5a38','#1e4828','#164020'].map(hexToRgb),
  a: ['#3a2818','#2e2010','#4a3420','#342818'].map(hexToRgb),
  o: ['#f0f5ff','#e8eeff','#ffffff','#f5f8ff','#eaf0ff'].map(hexToRgb),
  s: ['#c8e0f8','#b0d0f0','#a8c8e8'].map(hexToRgb),
  Xh: ['#706860','#5E564F','#887F75','#4D4640','#63594F','#7A7068'].map(hexToRgb)
};

const SPRING_PALETTES = {
  n: ['#5a9e4a','#4a8c3f','#68ad58','#3d7a34','#55a048'].map(hexToRgb),
  r: ['#a09888','#8c847a','#b5ada0','#9a9284','#706860'].map(hexToRgb),
  i: ['#ffb7c5','#ff97b0','#ffc8d6','#ff85a0','#ffd0db','#ffa0b8','#ff90a8','#ffccd8'].map(hexToRgb),
  a: ['#fff0f5','#ffe8ef','#fff5f8','#ffeef3'].map(hexToRgb),
  o: ['#5c3a28','#4a2e1e','#6b4835','#3d2418','#7a5840'].map(hexToRgb),
  s: ['#6b8c50','#5a7a40','#7a9c60'].map(hexToRgb),
  Yh: ['#8B6914','#7A5C12','#6B4E10','#9C7A1E','#5C4010','#A07828','#6E5518'].map(hexToRgb)
};

const SUMMER_PALETTES = {
  n: ['#3a322c','#4a4038','#52473e','#2e2620','#403631'].map(hexToRgb),
  r: ['#6a5d52','#7a6d60','#5e524a'].map(hexToRgb),
  i: ['#1c1410','#241a12','#2a1f17','#1a120e'].map(hexToRgb),
  a: ['#4a5a30','#3d4e28','#5a6e3a','#445528','#506336'].map(hexToRgb),
  o: ['#3a2a1c','#4a3828','#2e2218','#5c4530','#3e2c1e','#4f3a28'].map(hexToRgb),
  s: ['#6a4f35','#75583c','#5e4530'].map(hexToRgb),
  c: ['#c8b89a','#d4c4a0','#b8a888','#beae90'].map(hexToRgb),
  l: ['#2d4a28','#1f3a1c','#244222','#2a4625'].map(hexToRgb),
  u: ['#3a5e30','#345532','#406838','#3d6035'].map(hexToRgb),
  d: ['#2a4625','#244222','#345532','#2f4f2a'].map(hexToRgb),
  f: ['#456f3a','#5a8845','#4d7c40','#3f6638'].map(hexToRgb),
  p: ['#8fb058','#a3c267','#7ea84a','#9bc05e','#86a850'].map(hexToRgb),
  m: ['#9a5226','#8a4520','#7a3c1a'].map(hexToRgb),
  h: ['#b04030','#933420','#a83b28'].map(hexToRgb)
};

const MATERIAL_PARAMS = {
  grass: { rough: 0.85, metal: 0.05, clearcoat: 0, physical: false },
  underside: { rough: 0.92, metal: 0.03, clearcoat: 0, physical: false },
  rock: { rough: 0.75, metal: 0.1, clearcoat: 0.3, physical: true },
  trunk: { rough: 0.9, metal: 0.05, clearcoat: 0, physical: false },
  leaf: { rough: 0.7, metal: 0.05, clearcoat: 0.3, physical: true },
  flower: { rough: 0.7, metal: 0, clearcoat: 0, physical: false },
  grassTuft: { rough: 0.9, metal: 0, clearcoat: 0, physical: false },
  mushroom: { rough: 0.8, metal: 0, clearcoat: 0, physical: false }
};

export class BonsaiSceneManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    /* ── Renderer ───────────────────────────────────────────────────────── */
    const rect = this.canvas.getBoundingClientRect();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(rect.width, rect.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    /* ── Scene ──────────────────────────────────────────────────────────── */
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x080810, 0.014);
    this.scene.background = new THREE.Color(0x080810);

    /* ── Camera (spherical orbit) ───────────────────────────────────────── */
    this.camera = new THREE.PerspectiveCamera(42, rect.width / rect.height, 0.1, 250);
    this._spherical = { theta: Math.PI * 0.25, phi: Math.PI * 0.32, radius: 52 };
    this._target = new THREE.Vector3(0, 4, 0);
    this._updateCamera();

    /* ── Lighting ───────────────────────────────────────────────────────── */
    this._setupLighting();

    /* ── State ──────────────────────────────────────────────────────────── */
    this._explosion = 0;
    this._targetExplosion = 0;
    this._autoRotate = true;
    this._isDimmed = false;
    this._dimFactor = 1;
    this._voxels = [];
    this._instancedMeshes = [];
    this._geometries = {}; // Cache geometries
    this._treeGroup = new THREE.Group();
    this.scene.add(this._treeGroup);

    // Transition State
    this._activeSeason = 3;   // Summer by default
    this._targetSeason = 3;
    this._transitionProgress = 1.0;
    this._isTransitioning = false;
    this._transitionDuration = 1.8; // seconds
    this._transitionStartTime = 0;

    // Pre-allocated scratch objects — zero GC in render loop
    this._dummy = new THREE.Object3D();
    this._tempColor = new THREE.Color();

    /* ── Input bindings ────────────────────────────────────────────────── */
    this._isDragging = false;
    this._lastMouse = { x: 0, y: 0 };
    this._boundMouseDown  = this._onMouseDown.bind(this);
    this._boundMouseMove  = this._onMouseMove.bind(this);
    this._boundMouseUp    = this._onMouseUp.bind(this);
    this._boundWheel      = this._onWheel.bind(this);
    this._boundKeyDown    = this._onKeyDown.bind(this);
    this._boundTouchStart = this._onTouchStart.bind(this);
    this._boundTouchMove  = this._onTouchMove.bind(this);
    this._boundResize     = this._onResize.bind(this);

    this.canvas.addEventListener('mousedown',  this._boundMouseDown);
    this.canvas.addEventListener('mousemove',  this._boundMouseMove);
    window.addEventListener('mouseup',         this._boundMouseUp);
    this.canvas.addEventListener('wheel',      this._boundWheel, { passive: false });
    this.canvas.addEventListener('touchstart', this._boundTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove',  this._boundTouchMove,  { passive: false });
    this.canvas.addEventListener('touchend',   this._boundMouseUp);
    window.addEventListener('resize',          this._boundResize, { passive: true });
    window.addEventListener('keydown',         this._boundKeyDown);

    /* ── Reflection plane ──────────────────────────────────────────────── */
    this._setupReflection();

    /* ── Generate initial scene ─────────────────────────────────────────── */
    this.generateScene('default');

    /* ── Particles ─────────────────────────────────────────────────────── */
    this._particles = createParticleSystem(THREE, this.scene, 300);

    /* ── Animation loop ────────────────────────────────────────────────── */
    this.animate = this.animate.bind(this);
    this._animId = requestAnimationFrame(this.animate);
  }

  _setupLighting() {
    this._ambient = new THREE.AmbientLight(0xffa050, 0.45);
    this.scene.add(this._ambient);

    this._sunLight = new THREE.DirectionalLight(0xffe0c0, 1.3);
    this._sunLight.position.set(12, 22, 8);
    this._sunLight.castShadow = true;
    this._sunLight.shadow.mapSize.width  = 1024;
    this._sunLight.shadow.mapSize.height = 1024;
    this._sunLight.shadow.camera.near = 1;
    this._sunLight.shadow.camera.far  = 60;
    this._sunLight.shadow.camera.left = this._sunLight.shadow.camera.bottom = -18;
    this._sunLight.shadow.camera.right = this._sunLight.shadow.camera.top = 18;
    this._sunLight.shadow.radius = 3;
    this.scene.add(this._sunLight);

    const fill = new THREE.DirectionalLight(0x6080c0, 0.28);
    fill.position.set(-8, 6, -10);
    this.scene.add(fill);

    this._crownLight = new THREE.PointLight(0xff9030, 0.55, 35, 2);
    this._crownLight.position.set(0, 10, 0);
    this.scene.add(this._crownLight);

    const hemi = new THREE.HemisphereLight(0x3344aa, 0x443322, 0.15);
    this.scene.add(hemi);
  }

  _setupReflection() {
    const geo = new THREE.PlaneGeometry(50, 50);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0e0e14,
      metalness: 0.92,
      roughness: 0.12,
      transparent: true,
      opacity: 0.22,
    });
    this._reflMesh = new THREE.Mesh(geo, mat);
    this._reflMesh.rotation.x = -Math.PI / 2;
    this._reflMesh.position.y = -16.5; // Adjusted lower to clear the island underside (goes to -13.5)
    this._reflMesh.receiveShadow = true;
    this.scene.add(this._reflMesh);
  }

  _updateCamera() {
    const s = this._spherical;
    this.camera.position.set(
      this._target.x + s.radius * Math.sin(s.phi) * Math.cos(s.theta),
      this._target.y + s.radius * Math.cos(s.phi),
      this._target.z + s.radius * Math.sin(s.phi) * Math.sin(s.theta)
    );
    this.camera.lookAt(this._target);
  }

  generateScene(seed) {
    // Clear existing meshes
    this._instancedMeshes.forEach(group => {
      this._treeGroup.remove(group.mesh);
      group.mesh.geometry.dispose();
      group.mesh.material.dispose();
    });
    this._instancedMeshes = [];

    // Generate voxel data
    const bonsai = generateBonsai(seed);
    const island = generateIsland(seed);
    this._voxels = [...island.voxels, ...bonsai.voxels];
    this._precomputeSeasons(seed);

    // Calculate centroid for explosion directions
    let cx = 0, cy = 0, cz = 0;
    for (const v of this._voxels) { cx += v.x; cy += v.y; cz += v.z; }
    cx /= this._voxels.length;
    cy /= this._voxels.length;
    cz /= this._voxels.length;

    // Assign explosion directions (outward from centroid + jitter)
    const rng = seededRng(seed + '-explode');
    for (const v of this._voxels) {
      const dx = v.x - cx, dy = v.y - cy, dz = v.z - cz;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      v.edx = dx / len + (rng() - 0.5) * 0.4;
      v.edy = dy / len + (rng() - 0.5) * 0.4;
      v.edz = dz / len + (rng() - 0.5) * 0.4;
    }

    // Group voxels by category geometry key
    const groups = {};
    this._voxels.forEach(v => {
      let geoKey = 'voxel';
      if (v.w !== undefined && v.h !== undefined && v.d !== undefined) {
        geoKey = `${v.w}_${v.h}_${v.d}`;
      }
      const key = `${v.type}|${geoKey}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    });

    // Build InstancedMesh for each key
    Object.entries(groups).forEach(([key, list]) => {
      const [type, geoKey] = key.split('|');

      // Geometry selection
      let geo = this._geometries[geoKey];
      if (!geo) {
        if (geoKey === 'voxel') {
          geo = new THREE.BoxGeometry(0.92, 0.92, 0.92);
        } else {
          const [w, h, d] = geoKey.split('_').map(Number);
          geo = new THREE.BoxGeometry(w, h, d);
        }
        this._geometries[geoKey] = geo;
      }

      // Material properties matching Hugging Face
      const params = MATERIAL_PARAMS[type];
      let mat;
      if (params && params.physical) {
        mat = new THREE.MeshPhysicalMaterial({
          roughness: params.rough,
          metalness: params.metal,
          clearcoat: params.clearcoat,
          clearcoatRoughness: 0.5,
          reflectivity: 0.3,
          ior: 1.5,
          flatShading: true
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          roughness: params ? params.rough : 0.6,
          metalness: params ? params.metal : 0.1,
          flatShading: true
        });
      }

      const instMesh = new THREE.InstancedMesh(geo, mat, list.length);
      instMesh.castShadow = true;
      instMesh.receiveShadow = true;

      this._treeGroup.add(instMesh);
      this._instancedMeshes.push({
        key,
        mesh: instMesh,
        voxels: list
      });
    });

    // Initial positions and colors
    this._syncVoxels();
    this._syncColors();

    this._explosion = 0;
    this._targetExplosion = 0;
  }

  _syncVoxels() {
    const e = this._explosion;
    const dist = 35; // max explosion spread
    const seasonProgress = this._transitionProgress;
    const sCurrent = this._activeSeason;
    const sTarget = this._targetSeason;

    // Easing function: cubic ease-in-out
    const t = seasonProgress < 0.5 
      ? 4 * seasonProgress * seasonProgress * seasonProgress 
      : 1 - Math.pow(-2 * seasonProgress + 2, 3) / 2;

    this._instancedMeshes.forEach(group => {
      const mesh = group.mesh;
      const list = group.voxels;

      for (let i = 0; i < list.length; i++) {
        const v = list[i];
        
        // Get interpolated position between current and target season
        const currentPos = v.seasons ? v.seasons[sCurrent] : v;
        const targetPos = v.seasons ? v.seasons[sTarget] : v;

        const interpX = currentPos.x + (targetPos.x - currentPos.x) * t;
        const interpY = currentPos.y + (targetPos.y - currentPos.y) * t;
        const interpZ = currentPos.z + (targetPos.z - currentPos.z) * t;

        // Only tree elements (trunk, leaf, flower) explode on hover
        const isTreePart = (v.type === 'trunk' || v.type === 'leaf' || v.type === 'flower');
        const voxelExplosion = isTreePart ? e : 0;

        this._dummy.position.set(
          interpX + v.edx * voxelExplosion * dist,
          interpY + v.edy * voxelExplosion * dist,
          interpZ + v.edz * voxelExplosion * dist
        );
        this._dummy.rotation.set(
          (v.rx || 0) + voxelExplosion * v.edx * Math.PI * 1.5,
          voxelExplosion * v.edy * Math.PI * 1.5,
          (v.rz || 0) + voxelExplosion * v.edz * Math.PI * 1.5
        );
        this._dummy.scale.setScalar(1.0 - voxelExplosion * 0.12);
        this._dummy.updateMatrix();
        mesh.setMatrixAt(i, this._dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  }

  _syncColors() {
    const seasonProgress = this._transitionProgress;
    const sCurrent = this._activeSeason;
    const sTarget = this._targetSeason;

    // Easing function: cubic ease-in-out
    const t = seasonProgress < 0.5 
      ? 4 * seasonProgress * seasonProgress * seasonProgress 
      : 1 - Math.pow(-2 * seasonProgress + 2, 3) / 2;

    this._instancedMeshes.forEach(group => {
      const mesh = group.mesh;
      const list = group.voxels;

      for (let i = 0; i < list.length; i++) {
        const v = list[i];
        const currentPos = v.seasons ? v.seasons[sCurrent] : v;
        const targetPos = v.seasons ? v.seasons[sTarget] : v;

        const r = currentPos.r + (targetPos.r - currentPos.r) * t;
        const g = currentPos.g + (targetPos.g - currentPos.g) * t;
        const b = currentPos.b + (targetPos.b - currentPos.b) * t;

        this._tempColor.setRGB(r, g, b);
        mesh.setColorAt(i, this._tempColor);
      }
      mesh.instanceColor.needsUpdate = true;
    });
  }

  setExplosion(value) {
    this._targetExplosion = Math.max(0, Math.min(1, value));
  }

  getExplosion() {
    return this._targetExplosion;
  }

  rotateLeft()  { this._spherical.theta -= 0.12; this._updateCamera(); }
  rotateRight() { this._spherical.theta += 0.12; this._updateCamera(); }

  resetTree() {
    this._targetExplosion = 0;
    this._treeGroup.rotation.set(0, 0, 0);
  }

  randomizeTree(seed) {
    this.generateScene(seed || String(Date.now()));
  }

  setThemeColors(primary, secondary) {
    if (this._crownLight) this._crownLight.color.set(primary);
    if (this._particles) this._particles.setColor(primary);
  }

  setDimmed(v) { this._isDimmed = v; }

  _onMouseDown(e) {
    this._isDragging = true;
    this._lastMouse = { x: e.clientX, y: e.clientY };
    this._autoRotate = false;
    clearTimeout(this._autoResumeTimer);
  }

  _onMouseMove(e) {
    if (!this._isDragging) return;
    const dx = e.clientX - this._lastMouse.x;
    const dy = e.clientY - this._lastMouse.y;
    this._spherical.theta += dx * 0.006;
    this._spherical.phi = Math.max(0.25, Math.min(Math.PI - 0.25, this._spherical.phi - dy * 0.006));
    this._lastMouse = { x: e.clientX, y: e.clientY };
    this._updateCamera();
  }

  _onMouseUp() {
    if (!this._isDragging) return;
    this._isDragging = false;
    clearTimeout(this._autoResumeTimer);
    this._autoResumeTimer = setTimeout(() => { this._autoRotate = true; }, 3500);
  }

  _onWheel(e) {
    e.preventDefault();
    this._spherical.radius = Math.max(25, Math.min(85, this._spherical.radius + e.deltaY * 0.04));
    this._updateCamera();
  }

  _onTouchStart(e) {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    this._isDragging = true;
    this._lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    this._autoRotate = false;
    clearTimeout(this._autoResumeTimer);
  }

  _onTouchMove(e) {
    if (!this._isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - this._lastMouse.x;
    const dy = e.touches[0].clientY - this._lastMouse.y;
    this._spherical.theta += dx * 0.006;
    this._spherical.phi = Math.max(0.25, Math.min(Math.PI - 0.25, this._spherical.phi - dy * 0.006));
    this._lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    this._updateCamera();
  }

  _onKeyDown(e) {
    if (!this.canvas.closest('.welcome-screen')) return;
    switch (e.key) {
      case 'ArrowLeft':  this.rotateLeft();  e.preventDefault(); break;
      case 'ArrowRight': this.rotateRight(); e.preventDefault(); break;
      case 'ArrowUp':
        this._targetExplosion = Math.min(1, this._targetExplosion + 0.08);
        e.preventDefault();
        break;
      case 'ArrowDown':
        this._targetExplosion = Math.max(0, this._targetExplosion - 0.08);
        e.preventDefault();
        break;
    }
  }

  _onResize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (!rect || rect.width < 1) return;
    const w = rect.width, h = rect.height;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    this._animId = requestAnimationFrame(this.animate);
    const t = performance.now() * 0.001;

    // Dim factor interpolation
    const tDim = this._isDimmed ? 0.05 : 1.0;
    this._dimFactor += (tDim - this._dimFactor) * 0.04;
    this.renderer.toneMappingExposure = 0.15 + this._dimFactor * 1.0;

    // Idle auto-rotation
    if (this._autoRotate) {
      this._spherical.theta += 0.0025;
      this._updateCamera();
    }

    // Subtle sway (bonsai breathing)
    this._treeGroup.rotation.z = Math.sin(t * 0.4) * 0.012;
    this._treeGroup.rotation.x = Math.cos(t * 0.25) * 0.008;

    // Smooth season transition interpolation
    if (this._isTransitioning) {
      const elapsed = (performance.now() - this._transitionStartTime) * 0.001;
      this._transitionProgress = Math.min(1.0, elapsed / this._transitionDuration);
      
      this._syncVoxels();
      this._syncColors();

      if (this._transitionProgress >= 1.0) {
        this._isTransitioning = false;
        this._activeSeason = this._targetSeason;
      }
    }

    // Smooth explosion interpolation
    const eDiff = this._targetExplosion - this._explosion;
    if (Math.abs(eDiff) > 0.0005) {
      this._explosion += eDiff * 0.055;
      this._syncVoxels();
    }

    // Particles
    if (this._particles) this._particles.update(t);

    // Crown light subtle pulse
    if (this._crownLight) {
      this._crownLight.intensity = 0.45 + Math.sin(t * 0.8) * 0.12;
    }

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  setSeason(index) {
    const idx = Math.max(0, Math.min(3, index));
    if (this._targetSeason === idx) return;

    if (this._isTransitioning) {
      this._activeSeason = this._targetSeason;
    }

    this._targetSeason = idx;
    this._transitionProgress = 0;
    this._isTransitioning = true;
    this._transitionStartTime = performance.now();

    const colors = {
      0: '#ff9030', // Autumn
      1: '#c8e0f8', // Winter
      2: '#ffccd8', // Spring
      3: '#55a048'  // Summer
    };
    if (this._particles) {
      this._particles.setColor(colors[idx]);
    }
  }

  _precomputeSeasons(seed) {
    const rng = seededRng(seed + '-seasons');
    function pick(arr) {
      return arr[Math.floor(rng() * arr.length)];
    }

    const g = 1.8;
    const _width = 6 * g;
    const _height = 3.5 * g;
    const _yOffset = -3 * g;
    const _bVal = 0.3 * g;

    const x_path = [
      [1, -0.6, 0], [1, 3, 0], [1.4, 4.5, 0.1], [3.6, 5.4, 0.2],
      [3.8, 7, 0.1], [3.2, 9.5, 0], [2, 11.5, 0.1], [1.4, 13, 0.3]
    ].map(e => [e[0] * g, e[1] * g, e[2] * g]);

    const S_lengths = [];
    let C_total = 0;
    for (let e = 1; e < x_path.length; ++e) {
      const t = x_path[e-1], n = x_path[e];
      const r = n[0]-t[0], i = n[1]-t[1], a = n[2]-t[2];
      const o = Math.sqrt(r*r+i*i+a*a);
      S_lengths.push(o);
      C_total += o;
    }
    const w_path = [0];
    for (let e = 0; e < S_lengths.length; ++e) w_path.push(w_path[e] + S_lengths[e] / C_total);

    const T = e => {
      if (e <= 0) return [...x_path[0]];
      if (e >= 1) return [...x_path[x_path.length-1]];
      let t = 0;
      for (; t < w_path.length - 1 && w_path[t+1] < e; ) t++;
      const n = w_path[t], r = w_path[t+1], i = (e - n) / (r - n), a = x_path[t], o = x_path[t+1];
      return [a[0]+(o[0]-a[0])*i, a[1]+(o[1]-a[1])*i, a[2]+(o[2]-a[2])*i];
    };

    const E_centers = [
      { cx: -5.5 * g, cy: 6 * g, cz: 0.2 * g, rx: 4 * g, ry: 0.75 * g, rz: 2.6 * g },
      { cx: 4.5 * g, cy: 8.8 * g, cz: -0.6 * g, rx: 3 * g, ry: 0.7 * g, rz: 2.2 * g },
      { cx: 0.3 * g, cy: 12.5 * g, cz: 0.3 * g, rx: 4.6 * g, ry: 0.95 * g, rz: 3 * g }
    ];

    const D_colors = [SUMMER_PALETTES.u, SUMMER_PALETTES.d, SUMMER_PALETTES.f];

    const O_branches = [
      { trunkT: 0.28, target: [E_centers[0].cx + 0.8, E_centers[0].cy + 0.4, E_centers[0].cz], thickness: 0.75 * g, arcY: -0.4 * g },
      { trunkT: 0.62, target: [E_centers[1].cx - 0.7, E_centers[1].cy + 0.1, E_centers[1].cz], thickness: 0.65 * g, arcY: 0.3 * g },
      { trunkT: 0.93, target: [E_centers[2].cx, E_centers[2].cy - 0.4, E_centers[2].cz], thickness: 0.55 * g, arcY: 0.25 * g }
    ];

    const k_branch_starts = O_branches.map(e => T(e.trunkT));

    const A_branch_pos = (e, t) => {
      const n = k_branch_starts[e], r = O_branches[e].target, i = Math.sin(t * Math.PI) * O_branches[e].arcY;
      return [n[0] + (r[0] - n[0]) * t, n[1] + (r[1] - n[1]) * t + i, n[2] + (r[2] - n[2]) * t];
    };

    const j_trunk_thickness = (e, t, n) => {
      const [r, i, a] = T(e);
      const o = 0.85 * g * Math.exp(-2 * e);
      const s = 0.55 * g + o;
      const c = Math.atan2(n, Math.abs(t) > 0.01 ? t : 0.01);
      const l_cos = Math.cos(c), u_sin = Math.sin(c);
      const d = l_cos + u_sin > 0.3;
      return [r + l_cos * s + (rng() - 0.5) * 0.1 * g, i + (rng() - 0.5) * 0.15 * g, a + u_sin * s + (rng() - 0.5) * 0.1 * g, d];
    };

    const M_branch_thickness = (e, t, n, r) => {
      const [i, a, o] = A_branch_pos(e, t), s = O_branches[e].thickness * (1 - t * 0.5);
      const c = Math.atan2(r, Math.abs(n) > 0.01 ? n : 0.01), l_cos = Math.cos(c), u_sin = Math.sin(c);
      const d = l_cos + u_sin > 0.3;
      return [i + l_cos * s + (rng() - 0.5) * 0.1 * g, a + (rng() - 0.5) * 0.1 * g, o + u_sin * s + (rng() - 0.5) * 0.1 * g, d];
    };

    const N_random_in_foliage = (e, t = null, n = null) => {
      let r, i;
      if (t !== null && n !== null) {
        r = Math.atan2(n, t);
        i = Math.min(1, Math.sqrt(t * t + n * n) / 6.5);
      } else {
        r = rng() * Math.PI * 2;
        i = Math.sqrt(rng());
      }
      const a = Math.cos(r) * i * e.rx, o = Math.sin(r) * i * e.rz, s = (rng() - 0.5) * 2 * e.ry;
      return [e.cx + a + (rng() - 0.5) * 0.35 * g, e.cy + s + (rng() - 0.5) * 0.25 * g, e.cz + o + (rng() - 0.5) * 0.35 * g];
    };

    const P_island_surface = (e, t, n) => {
      const r = Math.min(1, Math.max(0, Math.abs(t + 2) / 12));
      if (r < 0.08) {
        const t = Math.atan2(n, e), r = Math.cos(t), i = Math.sin(t);
        return [Math.abs(r) > Math.abs(i * _width / _height) ? Math.sign(r) * _width : r * _height / Math.abs(i), _bVal, Math.abs(i) > Math.abs(r * _height / _width) ? Math.sign(i) * _height : i * _width / Math.abs(r)];
      }
      if (r > 0.85) {
        const t = e / 9 * (_width - 0.5 * g), r = n / 7 * (_height - 0.5 * g);
        return [Math.max(-9.9, Math.min(_width - 0.5 * g, t)), _yOffset, Math.max(-5.4, Math.min(_height - 0.5 * g, r))];
      }
      const i = Math.atan2(n, e), a = 0 - (r - 0.08) / 0.77 * (0 - _yOffset), o = Math.cos(i), s = Math.sin(i);
      let c, l;
      if (Math.abs(o) * _height > Math.abs(s) * _width) {
        c = Math.sign(o) * _width;
        l = s / Math.abs(o) * _width * (_height / _width);
        l = Math.max(-6.3, Math.min(_height, l));
      } else {
        l = Math.sign(s) * _height;
        c = o / Math.abs(s) * _height * (_width / _height);
        c = Math.max(-10.8, Math.min(_width, c));
      }
      return [c, a, l];
    };

    const winterSet = new Set();
    const springSet = new Set();
    let summerRockCount = 0;
    const summerRockPositions = [
      [2.8 * g, 0, 1.8 * g], [-3.5 * g, -0.09, 1.5 * g], [1.2 * g, -0.18, -2.1 * g],
      [-1.5 * g, 0.09, -2.5 * g], [4.2 * g, -0.18, 0.4 * g], [-4.5 * g, -0.09, -0.5 * g],
      [0.3 * g, -0.18, 2.6 * g], [-2.8 * g, 0, 2 * g], [3.5 * g, -0.09, -1.6 * g],
      [-0.5 * g, -0.18, -2.8 * g], [5 * g, -0.18, 2.4 * g], [-5 * g, -0.09, 2.8 * g]
    ];
    const summerEe = [...T(0.18), 0.7 * g];

    this._voxels.forEach(v => {
      const l = v.x * 0.3;
      const u = v.y * 0.3;
      const p = v.z * 0.3;

      v.seasons = [];

      // 🍂 Autumn
      v.seasons[0] = { x: v.x, y: v.y, z: v.z, r: v.r, g: v.g, b: v.b };

      // ❄️ Winter
      let wPos = { x: v.x, y: v.y, z: v.z };
      let wCol = [v.r, v.g, v.b];

      if (v.type === 'leaf') {
        const e = (u - 14) / 12;
        const n = Math.atan2(p, l);
        const rVal = Math.sqrt(l * l + p * p);
        const a = Math.floor(e * 5);
        const s = e * 5 - a;
        const d = Math.max(0.3, (5.5 - a) * (1 - s * 0.3));
        const f = Math.min(rVal, d) * (d / Math.max(3, rVal + 1));
        let bx = Math.cos(n) * f * 1.1;
        let bz = Math.sin(n) * f * 1.1;
        let by = u + e * 2;
        const mKey = `${Math.round(bx * 100)},${Math.round(by * 100)},${Math.round(bz * 100)}`;
        const hasM = winterSet.has(mKey);
        if (!hasM) winterSet.add(mKey);
        const jitter = hasM ? 0.85 : 0.25;
        bx += (rng() - 0.5) * jitter;
        by += (rng() - 0.5) * jitter;
        bz += (rng() - 0.5) * jitter;
        wPos = { x: bx / 0.3, y: by / 0.3, z: bz / 0.3 };
        wCol = (s > 0.6 || e > 0.8) ? pick(WINTER_PALETTES.o) : pick(WINTER_PALETTES.i);
      } else if (v.type === 'trunk') {
        const bx = l * 0.7 + (rng() - 0.5) * 0.15;
        const bz = p * 0.7 + (rng() - 0.5) * 0.15;
        wPos = { x: bx / 0.3, y: v.y, z: bz / 0.3 };
        wCol = pick(WINTER_PALETTES.a);
      } else if (v.type === 'grass') {
        const bx = l * 0.72;
        const bz = p * 0.72;
        const by = u + Math.max(0, 4 - Math.abs(l) - Math.abs(p) * 0.5) * 0.18;
        wPos = { x: bx / 0.3, y: by / 0.3, z: bz / 0.3 };
        wCol = pick(WINTER_PALETTES.n);
      } else if (v.type === 'rock') {
        let by = u;
        if (Math.sqrt(l * l + p * p) < 3.5) by = u + 0.35;
        wPos = { x: v.x, y: by / 0.3, z: v.z };
        wCol = rng() < 0.3 ? pick(WINTER_PALETTES.s) : pick(WINTER_PALETTES.r);
      } else if (v.type === 'underside') {
        const e = Math.max(0, -u - 1);
        const nVal = 1 - Math.min(0.55, e * 0.04);
        wPos = { x: (l * nVal) / 0.3, y: v.y, z: (p * nVal) / 0.3 };
        wCol = pick(WINTER_PALETTES.Xh);
      }
      v.seasons[1] = { x: wPos.x, y: wPos.y, z: wPos.z, r: wCol[0], g: wCol[1], b: wCol[2] };

      // 🌸 Spring
      let sPos = { x: v.x, y: v.y, z: v.z };
      let sCol = [v.r, v.g, v.b];

      if (v.type === 'leaf') {
        const e = (u - 14) / 12;
        const n = Math.sqrt(l * l + p * p);
        const rVal = 1.3;
        const oVal = n * 0.06;
        let bx = l * rVal;
        let bz = p * rVal;
        let by = u - oVal - e * 1.5;
        const sKey = `${Math.round(bx * 100)},${Math.round(by * 100)},${Math.round(bz * 100)}`;
        const hasS = springSet.has(sKey);
        if (!hasS) springSet.add(sKey);
        const jitter = hasS ? 0.85 : 0.25;
        bx += (rng() - 0.5) * jitter;
        by += (rng() - 0.5) * jitter;
        bz += (rng() - 0.5) * jitter;
        sPos = { x: bx / 0.3, y: by / 0.3, z: bz / 0.3 };
        sCol = rng() < 0.15 ? pick(SPRING_PALETTES.a) : pick(SPRING_PALETTES.i);
      } else if (v.type === 'trunk') {
        const eVal = Math.sin(u * 0.15) * 0.8;
        const bx = l * 0.85 + eVal + (rng() - 0.5) * 0.15;
        const bz = p * 0.85 + (rng() - 0.5) * 0.15;
        sPos = { x: bx / 0.3, y: v.y, z: bz / 0.3 };
        sCol = pick(SPRING_PALETTES.o);
      } else if (v.type === 'grass') {
        sPos = { x: (l * 1.15) / 0.3, y: (u * 0.65) / 0.3, z: (p * 1.1) / 0.3 };
        sCol = rng() < 0.2 ? pick(SPRING_PALETTES.s) : pick(SPRING_PALETTES.n);
      } else if (v.type === 'rock') {
        sPos = { x: (l * 1.2) / 0.3, y: (u * 0.7) / 0.3, z: (p * 1.2) / 0.3 };
        sCol = pick(SPRING_PALETTES.r);
      } else if (v.type === 'flower') {
        sCol = pick(SPRING_PALETTES.i);
      } else if (v.type === 'underside') {
        const eVal = Math.max(0, -u - 1);
        const nVal = 1 + Math.min(0.3, eVal * 0.025);
        sPos = { x: (l * nVal) / 0.3, y: (u * 0.55) / 0.3, z: (p * nVal) / 0.3 };
        sCol = pick(SPRING_PALETTES.Yh);
      }
      v.seasons[2] = { x: sPos.x, y: sPos.y, z: sPos.z, r: sCol[0], g: sCol[1], b: sCol[2] };

      // ☀️ Summer
      let suPos = { x: v.x, y: v.y, z: v.z };
      let suCol = [v.r, v.g, v.b];

      if (v.type === 'underside') {
        const hash = (l * 13 + u * 7 + p * 11 | 0) & 255;
        let rx, ry, rz;
        if (hash < 24) {
          const eAngle = Math.atan2(p, l);
          const nCos = Math.cos(eAngle), iSin = Math.sin(eAngle);
          const aVal = Math.abs(nCos) > _width / _height * Math.abs(iSin) ? Math.sign(nCos) * _width : nCos / Math.abs(iSin || 1e-6) * _height;
          const oVal = Math.abs(iSin) > _height / _width * Math.abs(nCos) ? Math.sign(iSin) * _height : iSin / Math.abs(nCos || 1e-6) * _width;
          rx = Math.max(-10.8, Math.min(_width, aVal));
          rz = Math.max(-6.3, Math.min(_height, oVal));
          ry = _bVal + (rng() - 0.5) * 0.1 * g;
          suCol = pick(SUMMER_PALETTES.r);
        } else if (hash < 128) {
          const [ePos, rPos, iPos] = P_island_surface(l, u, p);
          rx = ePos + (rng() - 0.5) * 0.08 * g;
          ry = rPos + (rng() - 0.5) * 0.08 * g;
          rz = iPos + (rng() - 0.5) * 0.08 * g;
          suCol = pick(SUMMER_PALETTES.n);
        } else {
          rx = (rng() - 0.5) * 2 * 9.81;
          ry = -5.04 + rng() * 4.32;
          rz = (rng() - 0.5) * 2 * 5.31;
          const pickCol = pick(SUMMER_PALETTES.n);
          suCol = [pickCol[0] * 0.5, pickCol[1] * 0.5, pickCol[2] * 0.5];
        }
        suPos = { x: rx / 0.3, y: ry / 0.3, z: rz / 0.3 };
      } else if (v.type === 'grass') {
        const eVal = l / 9 * (_width - 0.5 * g);
        const nVal = p / 7 * (_height - 0.5 * g);
        let rx = Math.max(-9.9, Math.min(_width - 0.5 * g, eVal));
        let rz = Math.max(-5.4, Math.min(_height - 0.5 * g, nVal));
        const rVal = Math.min(1, Math.max(0, u / 4));
        let ry;
        if (rVal > 0.4) {
          ry = -0.54 + (rVal - 0.4) * 0.4 * g + (rng() - 0.5) * 0.1 * g;
          suCol = pick(SUMMER_PALETTES.a);
        } else {
          ry = -2.16 + rVal * 0.7 * g + (rng() - 0.5) * 0.08 * g;
          suCol = pick(SUMMER_PALETTES.i);
        }
        rx += (rng() - 0.5) * 0.15 * g;
        rz += (rng() - 0.5) * 0.15 * g;
        suPos = { x: rx / 0.3, y: ry / 0.3, z: rz / 0.3 };
      } else if (v.type === 'grassTuft') {
        const eAngle = rng() * Math.PI * 2, nDist = rng();
        const rx = Math.cos(eAngle) * nDist * (_width - 0.6 * g);
        const rz = Math.sin(eAngle) * nDist * (_height - 0.6 * g);
        const ry = -0.27 + rng() * 0.15 * g;
        const pickCol = pick(SUMMER_PALETTES.a);
        suCol = [pickCol[0] * 1.05, pickCol[1] * 1.05, pickCol[2] * 0.95];
        suPos = { x: rx / 0.3, y: ry / 0.3, z: rz / 0.3 };
      } else if (v.type === 'trunk') {
        const eHash = (l * 17 + u * 23 + p * 13 | 0) & 255;
        const nVal = eHash >= 179;
        let rx, ry, rz, rColor;
        const nPos = Math.min(1, Math.max(0, (v.y - 7.5) / 11));
        if (nVal) {
          const tVal = (eHash - 179) % O_branches.length;
          [rx, ry, rz, rColor] = M_branch_thickness(tVal, nPos, l, p);
        } else {
          [rx, ry, rz, rColor] = j_trunk_thickness(nPos, l, p);
        }
        suCol = pick(rColor ? SUMMER_PALETTES.s : SUMMER_PALETTES.o);
        suPos = { x: rx / 0.3, y: ry / 0.3, z: rz / 0.3 };
      } else if (v.type === 'leaf') {
        if (Math.sqrt(l * l + p * p) < 2.8) {
          const eHash = (l * 31 + u * 19 + p * 29 | 0) & 255;
          const nVal = eHash < 140 ? -1 : eHash < 178 ? 0 : eHash < 217 ? 1 : 2;
          let rx, ry, rz, rColor;
          if (nVal === -1) {
            [rx, ry, rz, rColor] = j_trunk_thickness(rng(), l, p);
          } else {
            [rx, ry, rz, rColor] = M_branch_thickness(nVal, rng(), l, p);
          }
          suCol = pick(rColor ? SUMMER_PALETTES.s : SUMMER_PALETTES.o);
          suPos = { x: rx / 0.3, y: ry / 0.3, z: rz / 0.3 };
        } else {
          const eVal = v.y >= 22 ? 0 : v.y < 18 ? 1 : 2;
          const nFoliage = E_centers[eVal];
          const [rx, ry, rz] = N_random_in_foliage(nFoliage, l, p);
          const rVal = rng();
          const iVal = eVal === 2 ? 0.14 : 0.06;
          if (rVal < 0.03) {
            suCol = pick(SUMMER_PALETTES.m);
          } else if (rVal < 0.03 + iVal) {
            suCol = pick(SUMMER_PALETTES.h);
          } else if (rVal < 0.3 + iVal) {
            suCol = pick(SUMMER_PALETTES.l);
          } else {
            suCol = pick(D_colors[eVal]);
          }
          suPos = { x: rx / 0.3, y: ry / 0.3, z: rz / 0.3 };
        }
      } else if (v.type === 'rock') {
        let rx, ry, rz;
        if (summerRockCount < summerRockPositions.length) {
          const [ePos, nPos, iPos] = summerRockPositions[summerRockCount];
          rx = ePos + (rng() - 0.5) * 0.2 * g;
          ry = nPos + (rng() - 0.5) * 0.1 * g;
          rz = iPos + (rng() - 0.5) * 0.2 * g;
          const pickCol = pick(SUMMER_PALETTES.r);
          suCol = [pickCol[0] * 0.9, pickCol[1] * 0.9, pickCol[2] * 0.85];
        } else if (summerRockCount - summerRockPositions.length < 5) {
          const [ePos, nPos, rPos, iPos] = summerEe;
          const aVal = rng() * Math.PI * 2, oVal = iPos * (0.3 + rng() * 0.5);
          rx = ePos + Math.cos(aVal) * oVal;
          rz = rPos + Math.sin(aVal) * oVal;
          ry = nPos + (rng() - 0.5) * 0.4 * g;
          const pickCol = pick(SUMMER_PALETTES.c);
          suCol = [pickCol[0] * 0.85, pickCol[1] * 0.85, pickCol[2] * 0.85];
        } else {
          const eAngle = rng() * Math.PI * 2, nVal = Math.sqrt(rng());
          rx = Math.cos(eAngle) * nVal * (_width - 0.5 * g);
          rz = Math.sin(eAngle) * nVal * (_height - 0.5 * g);
          ry = -0.27 + (rng() - 0.5) * 0.1 * g;
          const pickCol = pick(SUMMER_PALETTES.r);
          suCol = [pickCol[0] * 0.85, pickCol[1] * 0.85, pickCol[2] * 0.8];
        }
        summerRockCount++;
        suPos = { x: rx / 0.3, y: ry / 0.3, z: rz / 0.3 };
      } else if (v.type === 'flower') {
        const eVal = Math.floor(rng() * E_centers.length);
        const [rx, ry, rz] = N_random_in_foliage(E_centers[eVal]);
        suCol = rng() < 0.3 ? pick(SUMMER_PALETTES.h) : pick(D_colors[eVal]);
        suPos = { x: rx / 0.3, y: ry / 0.3, z: rz / 0.3 };
      } else if (v.type === 'mushroom') {
        const eVal = rng(), nVal = eVal < 0.45 ? 0 : eVal < 0.75 ? 1 : 2;
        const [rx, ry, rz] = N_random_in_foliage(E_centers[nVal]);
        suCol = pick(D_colors[nVal]);
        suPos = { x: rx / 0.3, y: ry / 0.3, z: rz / 0.3 };
      }
      v.seasons[3] = { x: suPos.x, y: suPos.y, z: suPos.z, r: suCol[0], g: suCol[1], b: suCol[2] };
    });
  }

  dispose() {
    if (this._animId) cancelAnimationFrame(this._animId);
    clearTimeout(this._autoResumeTimer);

    // Remove event listeners
    this.canvas.removeEventListener('mousedown',  this._boundMouseDown);
    this.canvas.removeEventListener('mousemove',  this._boundMouseMove);
    window.removeEventListener('mouseup',         this._boundMouseUp);
    this.canvas.removeEventListener('wheel',      this._boundWheel);
    this.canvas.removeEventListener('touchstart', this._boundTouchStart);
    this.canvas.removeEventListener('touchmove',  this._boundTouchMove);
    this.canvas.removeEventListener('touchend',   this._boundMouseUp);
    window.removeEventListener('resize',          this._boundResize);
    window.removeEventListener('keydown',         this._boundKeyDown);

    // Particles
    if (this._particles) this._particles.dispose();

    // InstancedMeshes
    this._instancedMeshes.forEach(group => {
      group.mesh.geometry.dispose();
      group.mesh.material.dispose();
    });
    this._instancedMeshes = [];

    // Reflection
    if (this._reflMesh) {
      this._reflMesh.geometry.dispose();
      this._reflMesh.material.dispose();
    }

    // Geometries cache
    Object.values(this._geometries).forEach(geo => geo.dispose());
    this._geometries = {};

    // Renderer
    this.renderer.dispose();
  }
}
