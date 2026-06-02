import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';

/* ─────────────────────────────────────────────────────────
   Voxel Art 3D Bonsai — Floating Island Edition
   ─────────────────────────────────────────────────────────
   Exactly matching the reference project's compiled codebase:
   • Layered floating island (grass/dirt/stone/rock spikes)
   • Spline-based bonsai trunk & branches
   • Dynamic layout variations:
     - 0: Default seed / summer conifer style
     - 1: Glacier Frost (snowy winter conifer)
     - 2: Orchid Sakura (pink cherry blossoms)
     - 3: Amber Sunset (default multi-tiered bonsai)
   • Dynamic 1.8s interpolation morph transition on theme updates
   • Exact pointer repulsion physics with spring damp return
   • Floating dust motes & seasonal leaf particles
   • Warm cinematic lighting rig with shadow mappings
   ───────────────────────────────────────────────────────── */

export class NetworkCanvasManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.container = this.canvas.parentElement;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, w / h, 0.5, 500);
    this.camera.position.set(30, 30, 66);
    this.camera.lookAt(0, 6, 0);
    this.setViewOffset();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.isDimmed = false;

    // OrbitControls for interactive workspace exploration
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 500;
    this.controls.target.set(0, 6, 0);

    // Track meshes and layouts
    this.meshes = [];
    this.categories = {};
    this.registeredCoords = new Set();
    this.instancedMeshMap = new Map();
    this.metadata = new Map();

    // Setup Lighting Setup
    this._setupLights();

    // Generate Voxel coordinates
    this._generateVoxelBase();

    // Build the InstancedMesh components
    this._buildInstancedMeshes();

    // Layout Snapshots & morph targets
    this.layouts = [];
    this.layouts[0] = this._saveLayoutSnapshot();

    // Build morph layouts for seasonal variations
    this.layouts[1] = this._generateVariation1(); // Frost conifer (fg)
    this.layouts[2] = this._generateVariation2(); // Sakura blossoms (pg)
    this.layouts[3] = this._generateVariation3(); // Bonsai (mg)

    // Layout state
    this.currentVariation = 3;
    this.targetVariation = 3;
    this.isMorphing = false;
    this.morphStartTime = 0;
    this.morphDuration = 1.8;

    this.posMapSnapshot = null;
    this.colMapSnapshot = null;

    // Direct transition to layout 3 on startup
    this._applyLayoutImmediate(3);

    // Particle Group setup
    this._setupParticles();

    // Raycast projection for repulsion
    this.mouse = new THREE.Vector2(9999, 9999);
    this.targetPointer = new THREE.Vector3(9999, 9999, 9999);
    this.pointerActive = false;
    this.lastPointerTime = 0;
    this.centerOfTree = new THREE.Vector3(0, 8, 0);

    // Event listeners
    this.animate = this.animate.bind(this);
    window.addEventListener('resize', this._onResize.bind(this));
    this.container.addEventListener('mousemove', this._onMouseMove.bind(this));
    this.container.addEventListener('mouseleave', this._onMouseLeave.bind(this));

    this.lastTime = performance.now();
    this.animate();
  }

  /* ━━━━━━━━━━━━━━━━━ RESIZE / ALIGNMENT ━━━━━━━━━━━━━━━━━━ */
  setViewOffset() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const offsetX = -w * 0.18; // shift center horizontally to sit beside sidebar controls
    this.camera.setViewOffset(w, h, offsetX, 0, w, h);
  }

  _onResize() {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.setViewOffset();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }

  /* ━━━━━━━━━━━━━━━━━ LIGHTING Setup ━━━━━━━━━━━━━━━━━━━━━━ */
  _setupLights() {
    this.ambientLight = new THREE.AmbientLight(0x2a1f18, 0.45);
    this.ambientLight.name = 'ambientLight';
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0xffeedd, 2.8);
    this.mainLight.name = 'mainLight';
    this.mainLight.position.set(6, 14, 5);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;
    this.mainLight.shadow.camera.near = 0.5;
    this.mainLight.shadow.camera.far = 40;
    this.mainLight.shadow.camera.left = -32;
    this.mainLight.shadow.camera.right = 32;
    this.mainLight.shadow.camera.top = 32;
    this.mainLight.shadow.camera.bottom = -32;
    this.mainLight.shadow.bias = 0.0001;
    this.mainLight.shadow.normalBias = 0.05;
    this.mainLight.shadow.radius = 5;
    this.scene.add(this.mainLight);

    this.softShadowLight = new THREE.DirectionalLight(0xffedd5, 0.6);
    this.softShadowLight.name = 'softShadowLight';
    this.softShadowLight.position.set(-3, 8, 6);
    this.softShadowLight.castShadow = true;
    this.softShadowLight.shadow.mapSize.width = 512;
    this.softShadowLight.shadow.mapSize.height = 512;
    this.softShadowLight.shadow.camera.near = 0.5;
    this.softShadowLight.shadow.camera.far = 30;
    this.softShadowLight.shadow.camera.left = -24;
    this.softShadowLight.shadow.camera.right = 24;
    this.softShadowLight.shadow.camera.top = 24;
    this.softShadowLight.shadow.camera.bottom = -24;
    this.softShadowLight.shadow.bias = 0.0001;
    this.softShadowLight.shadow.normalBias = 0.05;
    this.softShadowLight.shadow.radius = 3.75;
    this.scene.add(this.softShadowLight);

    this.fillLight = new THREE.DirectionalLight(0x4a6f30, 0.6);
    this.fillLight.name = 'fillLight';
    this.fillLight.position.set(-5, 8, -3);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.PointLight(0xff9a55, 3.0, 28, 1.6);
    this.rimLight.name = 'rimLight';
    this.rimLight.position.set(-4, 12, -5);
    this.scene.add(this.rimLight);

    this.accentLight = new THREE.PointLight(0xff7a3a, 2.6, 24, 1.6);
    this.accentLight.name = 'accentLight';
    this.accentLight.position.set(4, 10, 4);
    this.scene.add(this.accentLight);
  }

  /* ━━━━━━━━━━━━━━━━━ BASE VOXEL LAYOUT ━━━━━━━━━━━━━━━━━━ */
  _generateVoxelBase() {
    const Kh = [];
    const qh = [];

    const Jh = (e, t) => Math.sin(e * 1.7 + t * 0.9) * 0.4 + Math.cos(t * 2.1 - e * 0.6) * 0.35 + Math.sin((e + t) * 1.1) * 0.25;

    const Dh = ['#4a8c3f','#3d7a34','#5a9e4a','#2d6b24','#68ad58','#3f8535','#4d9040','#55a048'];
    const Oh = ['#a0978a','#8c8478','#b5ad9e','#9a9184','#c2bab0','#7d756a','#bbb3a6','#938b7f'];
    const kh = ['#4a3728','#3d2e20','#5c4535','#2e2218','#6b5444'];
    const Ah = ['#e63c2e','#d4452f','#f05a3a','#c93525','#ff6b45','#e8502a','#d94a30','#f24832','#ff7f50','#e06030'];
    const jh = ['#e63c2e','#f05a3a','#ff6b45','#f5a623','#ff8c42','#e8502a'];

    const Ih = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const Fh = (e, t, n) => `${Math.round(e * 100)},${Math.round(t * 100)},${Math.round(n * 100)}`;

    const Lh = (e, t, n, r, category) => {
      const a = Fh(e, t, n);
      if (this.registeredCoords.has(a)) return;
      this.registeredCoords.add(a);
      const cat = category || 'default';
      if (!this.categories[cat]) {
        this.categories[cat] = { geo: 'voxel', transforms: [], colors: [] };
      }
      this.categories[cat].transforms.push({ x: e, y: t, z: n, rx: 0, rz: 0 });
      this.categories[cat].colors.push(r);
    };

    const Rh = (color, t, n, r, sx, sy, sz, rx, rz, category) => {
      const u = Fh(t, n, r);
      if (this.registeredCoords.has(u)) return;
      this.registeredCoords.add(u);
      const catName = category || 'custom';
      const geoKey = `${sx.toFixed(2)}_${sy.toFixed(2)}_${sz.toFixed(2)}`;
      const key = `${catName}|${geoKey}`;
      if (!this.categories[key]) {
        this.categories[key] = { geo: geoKey, transforms: [], colors: [] };
      }
      this.categories[key].transforms.push({ x: t, y: n, z: r, rx: rx || 0, rz: rz || 0 });
      this.categories[key].colors.push(color);
    };

    // 1. Grass platform layers
    for (let e = -8; e <= 8; e++) {
      for (let t = -6; t <= 6; t++) {
        if (Math.sqrt(e * e * 0.45 + t * t * 0.55) < 7.5 + Jh(e, t) * 1.5) {
          Kh.push({ x: e, y: 0, z: t, type: 'grass' });
        }
      }
    }
    for (let e = -9; e <= 9; e++) {
      for (let t = -7; t <= 7; t++) {
        if (Math.sqrt(e * e * 0.4 + t * t * 0.5) < 8.5 + Jh(e * 0.7, t * 0.7) * 1.2) {
          Kh.push({ x: e, y: -1, z: t, type: 'grass' });
        }
      }
    }
    for (let e = -7; e <= 6; e++) {
      for (let t = -5; t <= 5; t++) {
        if (Math.sqrt(e * e * 0.5 + t * t * 0.6) < 6.0 + Jh(e, t) * 1.2) {
          Kh.push({ x: e, y: 1, z: t, type: 'grass' });
        }
      }
    }
    for (let e = -5; e <= 4; e++) {
      for (let t = -4; t <= 3; t++) {
        if (Math.sqrt(e * e * 0.55 + t * t * 0.65) < 4.5 + Jh(e, t) * 0.9) {
          Kh.push({ x: e, y: 2, z: t, type: 'grass' });
        }
      }
    }
    for (let e = -4; e <= 3; e++) {
      for (let t = -3; t <= 2; t++) {
        if (Math.sqrt(e * e * 0.6 + t * t * 0.7) < 3.5 + Jh(e, t) * 0.7) {
          Kh.push({ x: e, y: 3, z: t, type: 'grass' });
        }
      }
    }
    for (let e = -3; e <= 2; e++) {
      for (let t = -2; t <= 2; t++) {
        if (Math.sqrt(e * e * 0.7 + t * t * 0.8) < 2.8 + Jh(e, t) * 0.5) {
          Kh.push({ x: e, y: 4, z: t, type: 'grass' });
        }
      }
    }
    for (let e = -2; e <= 1; e++) {
      for (let t = -1; t <= 1; t++) {
        if (Math.sqrt(e * e + t * t) < 2.0) {
          Kh.push({ x: e, y: 5, z: t, type: 'grass' });
        }
      }
    }
    for (let e = -1; e <= 0; e++) {
      for (let t = -1; t <= 0; t++) {
        Kh.push({ x: e, y: 6, z: t, type: 'grass' });
      }
    }
    for (let e = 4; e <= 8; e++) {
      for (let t = -2; t <= 3; t++) {
        const n = e - 6;
        const r = t - 0.5;
        const i = Math.sqrt(n * n + r * r);
        if (i < 2.8 + Jh(e, t) * 0.5) Kh.push({ x: e, y: 1, z: t, type: 'grass' });
        if (i < 2.0 + Jh(e, t) * 0.3) Kh.push({ x: e, y: 2, z: t, type: 'grass' });
        if (i < 1.2) Kh.push({ x: e, y: 3, z: t, type: 'grass' });
      }
    }
    for (let e = -6; e <= -3; e++) {
      for (let t = -5; t <= -2; t++) {
        const n = e + 4.5;
        const r = t + 3.5;
        const i = Math.sqrt(n * n + r * r);
        if (i < 2.0 + Jh(e, t) * 0.4) Kh.push({ x: e, y: 1, z: t, type: 'grass' });
        if (i < 1.2) Kh.push({ x: e, y: 2, z: t, type: 'grass' });
      }
    }

    // 2. Dirt and stone layers
    const Yh = ['#8B6914','#7A5C12','#6B4E10','#9C7A1E','#5C4010','#A07828','#6E5518'];
    const Xh = ['#706860','#5E564F','#887F75','#4D4640','#63594F','#7A7068'];
    for (let e = -2; e >= -14; e--) {
      const t = Math.abs(e + 1);
      const n = Math.max(0.5, 8.5 - t * 0.55 + Math.sin(t * 0.8) * 0.8);
      const r = Math.sin(t * 0.7) * 0.4;
      const i = Math.cos(t * 0.9) * 0.3;
      for (let a = -10; a <= 10; a++) {
        for (let o = -8; o <= 8; o++) {
          const s = a - r;
          const c = o - i;
          if (Math.sqrt(s * s * 0.45 + c * c * 0.55) < n + Jh(a * 0.8 + t * 0.3, o * 0.8 - t * 0.2) * (1.0 + t * 0.08)) {
            qh.push({ x: a, y: e, z: o, type: t < 4 ? 'dirt' : 'stone' });
          }
        }
      }
    }

    // Rock spikes hanging underneath
    const spikes = [
      { cx: 0, cz: 0, length: 4, r: 1.2 },
      { cx: -3, cz: -1, length: 3, r: 0.9 },
      { cx: 2, cz: 2, length: 3, r: 0.8 },
      { cx: -1, cz: -3, length: 2, r: 0.7 },
      { cx: 3, cz: -2, length: 2, r: 0.6 },
      { cx: -4, cz: 1, length: 2, r: 0.7 },
      { cx: 1, cz: -4, length: 2, r: 0.5 },
      { cx: -2, cz: 3, length: 3, r: 0.8 }
    ];
    spikes.forEach(e => {
      for (let t = -14; t >= -14 - e.length; t--) {
        const n = Math.abs(t + 14);
        const r = Math.max(0.3, e.r - n * 0.25);
        for (let i = Math.floor(e.cx - r - 1); i <= Math.ceil(e.cx + r + 1); i++) {
          for (let a = Math.floor(e.cz - r - 1); a <= Math.ceil(e.cz + r + 1); a++) {
            const o = i - e.cx;
            const s = a - e.cz;
            if (Math.sqrt(o * o + s * s) < r + Jh(i + n, a - n) * 0.3) {
              qh.push({ x: i, y: t, z: a, type: 'stone' });
            }
          }
        }
      }
    });

    qh.forEach(e => {
      const color = e.type === 'dirt' ? Ih(Yh) : Ih(Xh);
      Lh(e.x, e.y + 0.5, e.z, color, 'underside');
    });

    Kh.forEach(e => {
      Lh(e.x, e.y + 0.5, e.z, Ih(Dh), 'grass');
    });

    // 3. Rock clusters
    const Zh = [
      {x:-2,y:5,z:-1},{x:-1,y:5,z:-1},{x:0,y:5,z:-1},{x:1,y:5,z:-1},{x:-2,y:5,z:0},{x:-1,y:5,z:0},{x:0,y:5,z:0},{x:1,y:5,z:0},{x:-1,y:5,z:1},{x:0,y:5,z:1},{x:1,y:5,z:1},{x:-2,y:5,z:1},
      {x:-1,y:6,z:-1},{x:0,y:6,z:-1},{x:1,y:6,z:-1},{x:-2,y:6,z:0},{x:-1,y:6,z:0},{x:0,y:6,z:0},{x:1,y:6,z:0},{x:-1,y:6,z:1},{x:0,y:6,z:1},{x:-2,y:6,z:-1},
      {x:-1,y:7,z:-1},{x:0,y:7,z:-1},{x:-1,y:7,z:0},{x:0,y:7,z:0},{x:1,y:7,z:0},{x:0,y:7,z:1},{x:-1,y:7,z:1},
      {x:0,y:8,z:0},{x:-1,y:8,z:0},{x:0,y:8,z:-1},{x:-1,y:8,z:-1},
      {x:3,y:2,z:2},{x:3,y:3,z:2},{x:4,y:1,z:-1},{x:4,y:2,z:-1},{x:-4,y:1,z:-2},{x:-4,y:2,z:-2},{x:-3,y:2,z:2},{x:-3,y:3,z:2},{x:5,y:1,z:1},{x:5,y:1,z:0},{x:-5,y:1,z:0},
      {x:2,y:3,z:-2},{x:2,y:4,z:-2},{x:-3,y:3,z:-1},{x:6,y:1,z:-2},{x:-6,y:0,z:2},{x:1,y:4,z:2},{x:-2,y:4,z:-2},{x:3,y:1,z:-3},{x:-2,y:1,z:3},{x:6,y:2,z:0},{x:6,y:3,z:0},{x:7,y:2,z:1}
    ];
    Zh.forEach(e => {
      Lh(e.x, e.y + 0.5, e.z, Ih(Oh), 'rock');
    });

    // 4. Trunk seed columns
    const trunkData = [
      {x:0,y:9,z:0},{x:-1,y:9,z:0},{x:0,y:9,z:-1},{x:-1,y:9,z:-1},{x:0,y:10,z:0},{x:-1,y:10,z:0},{x:0,y:10,z:-1},{x:-1,y:10,z:-1},{x:0,y:11,z:0},{x:-1,y:11,z:0},{x:0,y:11,z:-1},
      {x:0,y:12,z:0},{x:-1,y:12,z:0},{x:0,y:12,z:-1},{x:0,y:13,z:0},{x:-1,y:13,z:0},{x:0,y:14,z:0},{x:-1,y:14,z:0},{x:0,y:15,z:0},{x:0,y:16,z:0},
      {x:-2,y:15,z:0},{x:-3,y:15,z:0},{x:-3,y:16,z:0},{x:-4,y:16,z:0},{x:-4,y:16,z:1},{x:-5,y:17,z:0},{x:-5,y:17,z:1},
      {x:1,y:14,z:0},{x:2,y:14,z:0},{x:2,y:15,z:0},{x:3,y:15,z:0},{x:3,y:16,z:0},{x:4,y:16,z:0},{x:4,y:17,z:0},{x:5,y:17,z:-1},
      {x:0,y:14,z:1},{x:0,y:15,z:1},{x:0,y:15,z:2},{x:1,y:16,z:2},{x:1,y:16,z:3},
      {x:0,y:13,z:-1},{x:0,y:14,z:-2},{x:0,y:15,z:-2},{x:-1,y:15,z:-2},{x:-1,y:16,z:-3},{x:0,y:16,z:-3},
      {x:0,y:17,z:0},{x:0,y:18,z:0},{x:1,y:13,z:-1},{x:-2,y:14,z:-1},{x:2,y:16,z:1},{x:-3,y:17,z:-1},{x:1,y:8,z:0},{x:-2,y:8,z:0},{x:0,y:8,z:1},{x:-1,y:8,z:-1},{x:1,y:7,z:1},{x:-2,y:7,z:-1}
    ];
    trunkData.forEach(e => {
      Lh(e.x, e.y + 0.5, e.z, Ih(kh), 'trunk');
    });

    // 5. Leaf seed coordinate maps
    const Qh = [];
    const $h = new Set();
    const eg = (e, t, n) => {
      const r = `${e},${t},${n}`;
      if (!$h.has(r)) {
        $h.add(r);
        Qh.push({ x: e, y: t, z: n });
      }
    };
    const tg = 6.5;
    const ng = tg / 4.5;
    for (let e = -8; e <= 8; e++) {
      for (let t = 15; t <= 26; t++) {
        for (let n = -7; n <= 7; n++) {
          const r = (t - 20) * ng;
          if (Math.sqrt(e * e + r * r + n * n) < tg + (Math.sin(e * 1.8 + n * 1.4) * 0.7 + Math.cos(t * 1.1 + e * 0.7) * 0.6 + Math.sin(n * 2.3 - t * 0.5) * 0.4)) {
            if (Math.random() > 0.18) {
              eg(e, t, n);
            }
          }
        }
      }
    }
    const leafClusters = [
      { cx: -5.5, cy: 17, cz: 0, r: 3.5 },
      { cx: -5.5, cy: 17, cz: 1, r: 2.8 },
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
    leafClusters.forEach(e => {
      for (let t = Math.floor(e.cx - e.r - 1); t <= Math.ceil(e.cx + e.r + 1); t++) {
        for (let n = Math.floor(e.cy - e.r); n <= Math.ceil(e.cy + e.r + 1); n++) {
          for (let r = Math.floor(e.cz - e.r - 1); r <= Math.ceil(e.cz + e.r + 1); r++) {
            const i = t - e.cx;
            const a = (n - e.cy) * 1.15;
            const o = r - e.cz;
            if (Math.sqrt(i * i + a * a + o * o) < e.r && Math.random() > 0.2) {
              eg(t, n, r);
            }
          }
        }
      }
    });
    for (let e = 0; e < 25; e++) {
      const rx = Math.round((Math.random() - 0.5) * 14);
      const rz = Math.round((Math.random() - 0.5) * 10);
      eg(rx, Math.floor(Math.random() * 3) + 1, rz);
    }
    Qh.forEach(e => {
      Lh(e.x, e.y + 0.5, e.z, Ih(Ah), 'leaf');
    });

    // 6. Ground details (flowers, grass tufts, mushrooms)
    const rg = {};
    Kh.forEach(e => {
      const key = `${e.x},${e.z}`;
      if (!rg[key] || e.y > rg[key]) {
        rg[key] = e.y;
      }
    });
    const ig = ['#3a8530','#4a9540','#2d7020','#5aad50','#3d8a35'];
    const ag = new Set(Zh.map(e => `${e.x},${e.z}`));
    Object.entries(rg).forEach(([key, yVal]) => {
      const [nx, nz] = key.split(',').map(Number);
      const onRock = ag.has(key);
      if (!onRock && Math.random() < 0.4) {
        const count = Math.random() < 0.3 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const col = Ih(jh);
          const ox = (Math.random() - 0.5) * 0.5;
          const oz = (Math.random() - 0.5) * 0.5;
          Rh(col, nx + ox, yVal + 1.22, nz + oz, 0.35, 0.35, 0.35, 0, 0, 'flower');
        }
      }
      if (!onRock && Math.random() < 0.3) {
        const col = Ih(ig);
        const ox = (Math.random() - 0.5) * 0.6;
        const oz = (Math.random() - 0.5) * 0.6;
        const rx = (Math.random() - 0.5) * 0.15;
        const rz = (Math.random() - 0.5) * 0.15;
        Rh(col, nx + ox, yVal + 1.32, nz + oz, 0.25, 0.55, 0.25, rx, rz, 'grassTuft');
      }
    });

    const og = ['#f5e6c8','#e8d5b0','#d4c49a','#c9b88e'];
    Object.entries(rg).forEach(([key, yVal]) => {
      const [nx, nz] = key.split(',').map(Number);
      if (nx < -2 && Math.random() < 0.15 && !ag.has(key)) {
        const col = Ih(og);
        const ox = (Math.random() - 0.5) * 0.3;
        const oz = (Math.random() - 0.5) * 0.3;
        Rh(col, nx + ox, yVal + 1.15, nz + oz, 0.25, 0.22, 0.25, 0, 0, 'mushroom');
      }
    });
  }

  /* ━━━━━━━━━━━━━━━━━ INSTANCED MESH GENERATOR ━━━━━━━━━━ */
  _buildInstancedMeshes() {
    const boxGeo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const geometryCache = { voxel: boxGeo };

    const Vh = {
      grass: { rough: 0.85, metal: 0.05, clearcoat: 0, physical: false },
      underside: { rough: 0.92, metal: 0.03, clearcoat: 0, physical: false },
      rock: { rough: 0.75, metal: 0.1, clearcoat: 0.3, physical: true },
      trunk: { rough: 0.9, metal: 0.05, clearcoat: 0, physical: false },
      leaf: { rough: 0.7, metal: 0.05, clearcoat: 0.3, physical: true },
      flower: { rough: 0.7, metal: 0, clearcoat: 0, physical: false },
      grassTuft: { rough: 0.9, metal: 0, clearcoat: 0, physical: false },
      mushroom: { rough: 0.8, metal: 0, clearcoat: 0, physical: false }
    };

    const getGeometry = (geoKey) => {
      if (geoKey === 'voxel') return boxGeo;
      if (geometryCache[geoKey]) return geometryCache[geoKey];
      const [sx, sy, sz] = geoKey.split('_').map(Number);
      const newGeo = new THREE.BoxGeometry(sx, sy, sz);
      geometryCache[geoKey] = newGeo;
      return newGeo;
    };

    const tempObj = new THREE.Object3D();
    const tempColor = new THREE.Color();

    for (const key in this.categories) {
      const catData = this.categories[key];
      const count = catData.transforms.length;
      if (count === 0) continue;

      const type = key.split('|')[0];
      const matConfig = Vh[type] || { rough: 0.8, metal: 0.1, clearcoat: 0, physical: false };

      let mat;
      if (matConfig.physical) {
        mat = new THREE.MeshPhysicalMaterial({
          roughness: matConfig.rough,
          metalness: matConfig.metal,
          clearcoat: matConfig.clearcoat,
          clearcoatRoughness: 0.5,
          reflectivity: 0.3,
          ior: 1.5,
          flatShading: true
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          roughness: matConfig.rough,
          metalness: matConfig.metal,
          flatShading: true,
          envMapIntensity: 1.2,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1
        });
      }

      const geo = getGeometry(catData.geo);
      const instancedMesh = new THREE.InstancedMesh(geo, mat, count);
      instancedMesh.name = `cat_${key.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)}`;
      instancedMesh.castShadow = true;
      instancedMesh.receiveShadow = true;

      for (let i = 0; i < count; i++) {
        const trans = catData.transforms[i];
        tempObj.position.set(trans.x, trans.y, trans.z);
        tempObj.rotation.set(trans.rx, 0, trans.rz);
        tempObj.updateMatrix();
        instancedMesh.setMatrixAt(i, tempObj.matrix);
        tempColor.set(catData.colors[i]);
        instancedMesh.setColorAt(i, tempColor);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }

      this.scene.add(instancedMesh);
      this.meshes.push(instancedMesh);
      this.instancedMeshMap.set(instancedMesh, key);

      // Metadata for animation / offsets
      const origPositions = new Float32Array(count * 3);
      const offsets = new Float32Array(count * 3);
      const randDirs = new Float32Array(count * 3);

      const array = instancedMesh.instanceMatrix.array;
      for (let i = 0; i < count; i++) {
        const idx = i * 16;
        origPositions[i * 3] = array[idx + 12];
        origPositions[i * 3 + 1] = array[idx + 13];
        origPositions[i * 3 + 2] = array[idx + 14];

        const angle = Math.random() * Math.PI * 2;
        const u = Math.acos(2 * Math.random() - 1);
        const sinU = Math.sin(u);
        randDirs[i * 3] = sinU * Math.cos(angle);
        randDirs[i * 3 + 1] = sinU * Math.sin(angle);
        randDirs[i * 3 + 2] = Math.cos(u);
      }

      this.metadata.set(instancedMesh, {
        origPositions,
        offsets,
        randDirs,
        count
      });
    }

    for (const k in geometryCache) {
      if (k !== 'voxel') geometryCache[k].dispose();
    }
  }

  _getMeshType(mesh) {
    const name = mesh.name || '';
    if (name.startsWith('cat_leaf')) return 'leaf';
    if (name.startsWith('cat_trunk')) return 'trunk';
    if (name.startsWith('cat_grass')) return 'grass';
    if (name.startsWith('cat_rock')) return 'rock';
    if (name.startsWith('cat_underside')) return 'underside';
    if (name.startsWith('cat_flower')) return 'flower';
    if (name.startsWith('cat_mushroom')) return 'mushroom';
    return 'other';
  }

  /* ━━━━━━━━━━━━━━━━━ LAYOUT SNAPSHOTS ━━━━━━━━━━━━━━━━━━━━ */
  _saveLayoutSnapshot() {
    const layout = new Map();
    const tempColor = new THREE.Color();

    this.instancedMeshMap.forEach((key, mesh) => {
      const count = mesh.count;
      const positions = new Float32Array(this.metadata.get(mesh).origPositions);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        mesh.getColorAt(i, tempColor);
        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
      }
      layout.set(mesh, { positions, colors });
    });
    return layout;
  }

  _applyLayoutImmediate(index) {
    const layout = this.layouts[index];
    if (!layout) return;
    const tempColor = new THREE.Color();

    this.instancedMeshMap.forEach((key, mesh) => {
      const meta = this.metadata.get(mesh);
      const data = layout.get(mesh);
      if (!data) return;

      const array = mesh.instanceMatrix.array;
      const count = meta.count;
      for (let i = 0; i < count; i++) {
        const r = i * 3;
        meta.origPositions[r] = data.positions[r];
        meta.origPositions[r + 1] = data.positions[r + 1];
        meta.origPositions[r + 2] = data.positions[r + 2];

        const idx = i * 16;
        array[idx + 12] = data.positions[r] + meta.offsets[r];
        array[idx + 13] = data.positions[r + 1] + meta.offsets[r + 1];
        array[idx + 14] = data.positions[r + 2] + meta.offsets[r + 2];

        tempColor.setRGB(data.colors[r], data.colors[r + 1], data.colors[r + 2]);
        mesh.setColorAt(i, tempColor);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
    });

    this.currentVariation = index;
    this.targetVariation = index;
    this.isMorphing = false;
  }

  /* ━━━━━━━━━━━━━━━━━ VARIATION 1: Glacier Frost ━━━━━━━━━ */
  _generateVariation1() {
    const layout = new Map();
    const tempColor = new THREE.Color();
    const Ih = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const colorsN = ['#e8f0e8','#d0e0d0','#c8dcc8','#f0f5f0','#dceadc'];
    const colorsR = ['#d0d0d0','#c0c0c0','#e0e0e0','#b8b8b8','#cccccc'];
    const colorsI = ['#1a4a2a','#224e30','#183e24','#2a5a38','#1e4828','#164020'];
    const colorsA = ['#3a2818','#2e2010','#4a3420','#342818'];
    const colorsO = ['#f0f5ff','#e8eeff','#ffffff','#f5f8ff','#eaf0ff'];
    const colorsS = ['#c8e0f8','#b0d0f0','#a8c8e8'];
    const Xh = ['#706860','#5E564F','#887F75','#4D4640','#63594F','#7A7068'];

    const c = new Set();

    this.instancedMeshMap.forEach((key, mesh) => {
      const count = mesh.count;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const baseData = this.layouts[0].get(mesh);
      const m = baseData.positions;
      const h = baseData.colors;
      const meshType = this._getMeshType(mesh);

      for (let e = 0; e < count; e++) {
        let l = m[e * 3];
        let u = m[e * 3 + 1];
        let p = m[e * 3 + 2];
        let r_color = h[e * 3];
        let g_color = h[e * 3 + 1];
        let b_color = h[e * 3 + 2];

        let targetX = l;
        let targetY = u;
        let targetZ = p;

        if (meshType === 'leaf') {
          const depthRatio = (u - 14) / 12;
          const angle = Math.atan2(p, l);
          const dist = Math.sqrt(l * l + p * p);
          const tier = Math.floor(depthRatio * 5);
          const frac = depthRatio * 5 - tier;

          const maxDist = Math.max(0.3, (5.5 - tier * 1) * (1 - frac * 0.3));
          const adjustedDist = Math.min(dist, maxDist) * (maxDist / Math.max(3, dist + 1));

          targetX = Math.cos(angle) * adjustedDist * 1.1;
          targetZ = Math.sin(angle) * adjustedDist * 1.1;
          targetY = u + depthRatio * 2;

          const coordKey = `${Math.round(targetX)},${Math.round(targetY)},${Math.round(targetZ)}`;
          const exists = c.has(coordKey);
          if (!exists) c.add(coordKey);

          const noiseScale = exists ? 0.85 : 0.25;
          targetX += (Math.random() - 0.5) * noiseScale;
          targetY += (Math.random() - 0.5) * noiseScale;
          targetZ += (Math.random() - 0.5) * noiseScale;

          if (frac > 0.6 || depthRatio > 0.8) {
            tempColor.set(Ih(colorsO));
            r_color = tempColor.r * 0.72;
            g_color = tempColor.g * 0.72;
            b_color = tempColor.b * 0.75;
          } else {
            tempColor.set(Ih(colorsI));
            r_color = tempColor.r;
            g_color = tempColor.g;
            b_color = tempColor.b;
          }
        } else if (meshType === 'trunk') {
          targetX = l * 0.7 + (Math.random() - 0.5) * 0.15;
          targetZ = p * 0.7 + (Math.random() - 0.5) * 0.15;
          tempColor.set(Ih(colorsA));
          r_color = tempColor.r;
          g_color = tempColor.g;
          b_color = tempColor.b;
        } else if (meshType === 'grass') {
          targetX = l * 0.72;
          targetZ = p * 0.72;
          targetY = u + Math.max(0, 4 - Math.abs(l) - Math.abs(p) * 0.5) * 0.18;
          tempColor.set(Ih(colorsN));
          r_color = tempColor.r * 0.82;
          g_color = tempColor.g * 0.82;
          b_color = tempColor.b * 0.84;
        } else if (meshType === 'rock') {
          if (Math.sqrt(l * l + p * p) < 3.5) {
            targetY = u + 0.35;
          }
          tempColor.set(Ih(Math.random() < 0.3 ? colorsS : colorsR));
          r_color = tempColor.r * 0.85;
          g_color = tempColor.g * 0.85;
          b_color = tempColor.b * 0.88;
        } else if (meshType === 'underside') {
          const depthVal = Math.max(0, -u - 1);
          const contraction = 1 - Math.min(0.55, depthVal * 0.04);
          targetX = l * contraction;
          targetZ = p * contraction;
          tempColor.set(Ih(Xh));
          r_color = tempColor.r;
          g_color = tempColor.g;
          b_color = tempColor.b * 1.05;
        }

        positions[e * 3] = targetX;
        positions[e * 3 + 1] = targetY;
        positions[e * 3 + 2] = targetZ;
        colors[e * 3] = r_color;
        colors[e * 3 + 1] = g_color;
        colors[e * 3 + 2] = b_color;
      }
      layout.set(mesh, { positions, colors });
    });
    return layout;
  }

  /* ━━━━━━━━━━━━━━━━━ VARIATION 2: Orchid Sakura ━━━━━━━━━ */
  _generateVariation2() {
    const layout = new Map();
    const tempColor = new THREE.Color();
    const Ih = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const colorsN = ['#5a9e4a','#4a8c3f','#68ad58','#3d7a34','#55a048'];
    const colorsR = ['#a09888','#8c847a','#b5ada0','#9a9284','#706860'];
    const colorsI = ['#ffb7c5','#ff97b0','#ffc8d6','#ff85a0','#ffd0db','#ffa0b8','#ff90a8','#ffccd8'];
    const colorsA = ['#fff0f5','#ffe8ef','#fff5f8','#ffeef3'];
    const colorsO = ['#5c3a28','#4a2e1e','#6b4835','#3d2418','#7a5840'];
    const colorsS = ['#6b8c50','#5a7a40','#7a9c60'];
    const Yh = ['#8B6914','#7A5C12','#6B4E10','#9C7A1E','#5C4010','#A07828','#6E5518'];

    const c = new Set();

    this.instancedMeshMap.forEach((key, mesh) => {
      const count = mesh.count;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const baseData = this.layouts[0].get(mesh);
      const m = baseData.positions;
      const h = baseData.colors;
      const meshType = this._getMeshType(mesh);

      for (let e = 0; e < count; e++) {
        let l = m[e * 3];
        let u = m[e * 3 + 1];
        let p = m[e * 3 + 2];
        let r_color = h[e * 3];
        let g_color = h[e * 3 + 1];
        let b_color = h[e * 3 + 2];

        let targetX = l;
        let targetY = u;
        let targetZ = p;

        if (meshType === 'leaf') {
          const depthRatio = (u - 14) / 12;
          const dist = Math.sqrt(l * l + p * p);
          const scaleFactor = 1.3;
          const drop = dist * 0.06;

          targetX = l * scaleFactor;
          targetZ = p * scaleFactor;
          targetY = u - drop - depthRatio * 1.5;

          const coordKey = `${Math.round(targetX)},${Math.round(targetY)},${Math.round(targetZ)}`;
          const exists = c.has(coordKey);
          if (!exists) c.add(coordKey);

          const noiseScale = exists ? 0.85 : 0.25;
          targetX += (Math.random() - 0.5) * noiseScale;
          targetY += (Math.random() - 0.5) * noiseScale;
          targetZ += (Math.random() - 0.5) * noiseScale;

          tempColor.set(Ih(Math.random() < 0.15 ? colorsA : colorsI));
          r_color = tempColor.r;
          g_color = tempColor.g;
          b_color = tempColor.b;
        } else if (meshType === 'trunk') {
          const wave = Math.sin(u * 0.15) * 0.8;
          targetX = l * 0.85 + wave + (Math.random() - 0.5) * 0.15;
          targetZ = p * 0.85 + (Math.random() - 0.5) * 0.15;
          tempColor.set(Ih(colorsO));
          r_color = tempColor.r;
          g_color = tempColor.g;
          b_color = tempColor.b;
        } else if (meshType === 'grass') {
          targetX = l * 1.15;
          targetZ = p * 1.1;
          targetY = u * 0.65;
          tempColor.set(Ih(Math.random() < 0.2 ? colorsS : colorsN));
          r_color = tempColor.r;
          g_color = tempColor.g;
          b_color = tempColor.b;
        } else if (meshType === 'rock') {
          targetX = l * 1.2;
          targetZ = p * 1.2;
          targetY = u * 0.7;
          tempColor.set(Ih(colorsR));
          r_color = tempColor.r;
          g_color = tempColor.g;
          b_color = tempColor.b;
        } else if (meshType === 'flower') {
          tempColor.set(Ih(colorsI));
          r_color = tempColor.r;
          g_color = tempColor.g;
          b_color = tempColor.b;
        } else if (meshType === 'underside') {
          const depthVal = Math.max(0, -u - 1);
          const expansion = 1 + Math.min(0.3, depthVal * 0.025);
          targetX = l * expansion;
          targetZ = p * expansion;
          targetY = u * 0.55;
          tempColor.set(Ih(Yh));
          r_color = tempColor.r;
          g_color = tempColor.g;
          b_color = tempColor.b;
        }

        positions[e * 3] = targetX;
        positions[e * 3 + 1] = targetY;
        positions[e * 3 + 2] = targetZ;
        colors[e * 3] = r_color;
        colors[e * 3 + 1] = g_color;
        colors[e * 3 + 2] = b_color;
      }
      layout.set(mesh, { positions, colors });
    });
    return layout;
  }

  /* ━━━━━━━━━━━━━━━━━ VARIATION 3: default Bonsai ━━━━━━━ */
  _generateVariation3() {
    const layout = new Map();
    const tempColor = new THREE.Color();
    const Ih = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const n = ['#3a322c','#4a4038','#52473e','#2e2620','#403631'];
    const r = ['#6a5d52','#7a6d60','#5e524a'];
    const i = ['#1c1410','#241a12','#2a1f17','#1a120e'];
    const a = ['#4a5a30','#3d4e28','#5a6e3a','#445528','#506336'];
    const o = ['#3a2a1c','#4a3828','#2e2218','#5c4530','#3e2c1e','#4f3a28'];
    const s = ['#6a4f35','#75583c','#5e4530'];
    const c = ['#c8b89a','#d4c4a0','#b8a888','#beae90'];
    const l = ['#2d4a28','#1f3a1c','#244222','#2a4625'];
    const u = ['#3a5e30','#345532','#406838','#3d6035'];
    const d = ['#2a4625','#244222','#345532','#2f4f2a'];
    const f = ['#456f3a','#5a8845','#4d7c40','#3f6638'];
    const p = ['#8fb058','#a3c267','#7ea84a','#9bc05e','#86a850'];
    const m = ['#9a5226','#8a4520','#7a3c1a'];
    const h = ['#b04030','#933420','#a83b28'];

    const g = 1.8;
    const _ = 6 * g;
    const v = 3.5 * g;
    const y = -3 * g;
    const b = 0.3 * g;

    const x = [
      [1,-0.6,0],[1,3,0],[1.4,4.5,0.1],[3.6,5.4,0.2],[3.8,7,0.1],[3.2,9.5,0],[2,11.5,0.1],[1.4,13,0.3]
    ].map(e => [e[0] * g, e[1] * g, e[2] * g]);

    const S = [];
    let C = 0;
    for (let e = 1; e < x.length; ++e) {
      const t = x[e - 1];
      const n = x[e];
      const r = n[0] - t[0];
      const i = n[1] - t[1];
      const a = n[2] - t[2];
      const o = Math.sqrt(r * r + i * i + a * a);
      S.push(o);
      C += o;
    }
    const w = [0];
    for (let e = 0; e < S.length; ++e) {
      w.push(w[e] + S[e] / C);
    }
    const T = e => {
      if (e <= 0) return [...x[0]];
      if (e >= 1) return [...x[x.length - 1]];
      let t = 0;
      for (; t < w.length - 1 && w[t + 1] < e; ) t++;
      const n = w[t];
      const r = w[t + 1];
      const i = (e - n) / (r - n);
      const a = x[t];
      const o = x[t + 1];
      return [
        a[0] + (o[0] - a[0]) * i,
        a[1] + (o[1] - a[1]) * i,
        a[2] + (o[2] - a[2]) * i
      ];
    };

    const E = [
      { cx: -5.5 * g, cy: 6 * g, cz: 0.2 * g, rx: 4 * g, ry: 0.75 * g, rz: 2.6 * g },
      { cx: 4.5 * g, cy: 8.8 * g, cz: -0.6 * g, rx: 3 * g, ry: 0.7 * g, rz: 2.2 * g },
      { cx: 0.3 * g, cy: 12.5 * g, cz: 0.3 * g, rx: 4.6 * g, ry: 0.95 * g, rz: 3 * g }
    ];
    const D = [u, d, f];
    const O = [
      { trunkT: 0.28, target: [E[0].cx + 0.8, E[0].cy + 0.4, E[0].cz], thickness: 0.75 * g, arcY: -0.4 * g },
      { trunkT: 0.62, target: [E[1].cx - 0.7, E[1].cy + 0.1, E[1].cz], thickness: 0.65 * g, arcY: 0.3 * g },
      { trunkT: 0.93, target: [E[2].cx, E[2].cy - 0.4, E[2].cz], thickness: 0.55 * g, arcY: 0.25 * g }
    ];

    const k = O.map(e => T(e.trunkT));
    const A = (e, t) => {
      const n = k[e];
      const r = O[e].target;
      const i = Math.sin(t * Math.PI) * O[e].arcY;
      return [
        n[0] + (r[0] - n[0]) * t,
        n[1] + (r[1] - n[1]) * t + i,
        n[2] + (r[2] - n[2]) * t
      ];
    };
    const j = (e, t, n) => {
      const [r, i, a] = T(e);
      const o = 0.85 * g * Math.exp(-2 * e);
      const s = 0.55 * g + o;
      const c = Math.atan2(n, Math.abs(t) > 0.01 ? t : 0.01);
      const l = Math.cos(c);
      const u = Math.sin(c);
      const d = l + u > 0.3;
      return [
        r + l * s + (Math.random() - 0.5) * 0.1 * g,
        i + (Math.random() - 0.5) * 0.15 * g,
        a + u * s + (Math.random() - 0.5) * 0.1 * g,
        d
      ];
    };
    const M = (e, t, n, r) => {
      const [i, a, o] = A(e, t);
      const s = O[e].thickness * (1 - t * 0.5);
      const c = Math.atan2(r, Math.abs(n) > 0.01 ? n : 0.01);
      const l = Math.cos(c);
      const u = Math.sin(c);
      const d = l + u > 0.3;
      return [
        i + l * s + (Math.random() - 0.5) * 0.1 * g,
        a + (Math.random() - 0.5) * 0.1 * g,
        o + u * s + (Math.random() - 0.5) * 0.1 * g,
        d
      ];
    };
    const N = (e, t = null, n = null) => {
      let r, i;
      if (t !== null && n !== null) {
        r = Math.atan2(n, t);
        i = Math.min(1, Math.sqrt(t * t + n * n) / 6.5);
      } else {
        r = Math.random() * Math.PI * 2;
        i = Math.sqrt(Math.random());
      }
      const a = Math.cos(r) * i * e.rx;
      const o = Math.sin(r) * i * e.rz;
      const s = (Math.random() - 0.5) * 2 * e.ry;
      return [
        e.cx + a + (Math.random() - 0.5) * 0.35 * g,
        e.cy + s + (Math.random() - 0.5) * 0.25 * g,
        e.cz + o + (Math.random() - 0.5) * 0.35 * g
      ];
    };
    const P = (e, t, n) => {
      const r = Math.min(1, Math.max(0, Math.abs(t + 2) / 12));
      if (r < 0.08) {
        const t = Math.atan2(n, e);
        const r = Math.cos(t);
        const i = Math.sin(t);
        return [
          Math.abs(r) > Math.abs(i * _ / v) ? Math.sign(r) * _ : r * v / Math.abs(i),
          b,
          Math.abs(i) > Math.abs(r * v / _) ? Math.sign(i) * v : i * _ / Math.abs(r)
        ];
      }
      if (r > 0.85) {
        const t = e / 9 * (_ - 0.5 * g);
        const r = n / 7 * (v - 0.5 * g);
        return [
          Math.max(-9.9, Math.min(_ - 0.5 * g, t)),
          y,
          Math.max(-5.4, Math.min(v - 0.5 * g, r))
        ];
      }
      const i = Math.atan2(n, e);
      const a = 0 - (r - 0.08) / 0.77 * (0 - y);
      const o = Math.cos(i);
      const s = Math.sin(i);
      let c_val, l_val;
      if (Math.abs(o) * v > Math.abs(s) * _) {
        c_val = Math.sign(o) * _;
        l_val = s / Math.abs(o) * _ * (v / _);
        l_val = Math.max(-6.3, Math.min(v, l_val));
      } else {
        l_val = Math.sign(s) * v;
        c_val = o / Math.abs(s) * v * (_ / v);
        c_val = Math.max(-10.8, Math.min(_, c_val));
      }
      return [c_val, a, l_val];
    };

    const Yh = ['#8B6914','#7A5C12','#6B4E10','#9C7A1E','#5C4010','#A07828','#6E5518'];
    const Xh = ['#706860','#5E564F','#887F75','#4D4640','#63594F','#7A7068'];
    const I = [
      [2.8 * g, 0, 1.8 * g],
      [-3.5 * g, -0.09, 1.5 * g],
      [1.2 * g, -0.18, -2.1 * g],
      [-1.5 * g, 0.09, -2.5 * g],
      [4.2 * g, -0.18, 0.4 * g],
      [-4.5 * g, -0.09, -0.5 * g],
      [0.3 * g, -0.18, 2.6 * g],
      [-2.8 * g, 0, 2 * g],
      [3.5 * g, -0.09, -1.6 * g],
      [-0.5 * g, -0.18, -2.8 * g],
      [5 * g, -0.18, 2.4 * g],
      [-5 * g, -0.09, 2.8 * g]
    ];
    const ee = [...T(0.18), 0.7 * g];

    this.instancedMeshMap.forEach((key, mesh) => {
      const count = mesh.count;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const baseData = this.layouts[0].get(mesh);
      const m_positions = baseData.positions;
      const h_colors = baseData.colors;
      const meshType = this._getMeshType(mesh);

      for (let e = 0; e < count; e++) {
        let u = m_positions[e * 3];
        let d = m_positions[e * 3 + 1];
        let x_coord = m_positions[e * 3 + 2];
        let A_col = h_colors[e * 3];
        let L_col = h_colors[e * 3 + 1];
        let te_col = h_colors[e * 3 + 2];

        let R_out = u;
        let ne_out = d;
        let re_out = x_coord;

        if (meshType === 'underside') {
          const hash = (u * 13 + d * 7 + x_coord * 11 | 0) & 255;
          if (hash < 24) {
            const angle = Math.atan2(x_coord, u);
            const n_cos = Math.cos(angle);
            const i_sin = Math.sin(angle);
            const a_val = Math.abs(n_cos) > _ / v * Math.abs(i_sin) ? Math.sign(n_cos) * _ : n_cos / Math.abs(i_sin || 1e-6) * v;
            const o_val = Math.abs(i_sin) > v / _ * Math.abs(n_cos) ? Math.sign(i_sin) * v : i_sin / Math.abs(n_cos || 1e-6) * _;
            R_out = Math.max(-10.8, Math.min(_, a_val));
            re_out = Math.max(-6.3, Math.min(v, o_val));
            ne_out = b + (Math.random() - 0.5) * 0.1 * g;
            tempColor.set(Ih(i));
            A_col = tempColor.r;
            L_col = tempColor.g;
            te_col = tempColor.b;
          } else if (hash < 128) {
            const [ex, ey, ez] = P(u, d, x_coord);
            R_out = ex + (Math.random() - 0.5) * 0.08 * g;
            ne_out = ey + (Math.random() - 0.5) * 0.08 * g;
            re_out = ez + (Math.random() - 0.5) * 0.08 * g;
            tempColor.set(Ih(n));
            A_col = tempColor.r;
            L_col = tempColor.g;
            te_col = tempColor.b;
          } else {
            R_out = (Math.random() - 0.5) * 2 * 9.81;
            ne_out = -5.04 + Math.random() * 4.32;
            re_out = (Math.random() - 0.5) * 2 * 5.31;
            tempColor.set(Ih(n));
            A_col = tempColor.r * 0.5;
            L_col = tempColor.g * 0.5;
            te_col = tempColor.b * 0.5;
          }
        } else if (meshType === 'grass') {
          const isTuft = (mesh.name || '').startsWith('cat_grassTuft');
          if (isTuft) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random();
            R_out = Math.cos(angle) * radius * (_ - 0.6 * g);
            re_out = Math.sin(angle) * radius * (v - 0.6 * g);
            ne_out = -0.27 + Math.random() * 0.15 * g;
            tempColor.set(Ih(a));
            A_col = tempColor.r * 1.05;
            L_col = tempColor.g * 1.05;
            te_col = tempColor.b * 0.95;
          } else {
            const normX = u / 9 * (_ - 0.5 * g);
            const normZ = x_coord / 7 * (v - 0.5 * g);
            R_out = Math.max(-9.9, Math.min(_ - 0.5 * g, normX));
            re_out = Math.max(-5.3999999999999995, Math.min(v - 0.5 * g, normZ));
            const heightRatio = Math.min(1, Math.max(0, d / 4));
            if (heightRatio > 0.4) {
              ne_out = -0.54 + (heightRatio - 0.4) * 0.4 * g + (Math.random() - 0.5) * 0.1 * g;
              tempColor.set(Ih(a));
            } else {
              ne_out = -2.16 + heightRatio * 0.7 * g + (Math.random() - 0.5) * 0.08 * g;
              tempColor.set(Ih(i));
            }
            R_out += (Math.random() - 0.5) * 0.15 * g;
            re_out += (Math.random() - 0.5) * 0.15 * g;
            A_col = tempColor.r;
            L_col = tempColor.g;
            te_col = tempColor.b;
          }
        } else if (meshType === 'trunk') {
          const hash = (u * 17 + d * 23 + x_coord * 13 | 0) & 255;
          const isBranch = hash >= 179;
          let useSecondaryColor;
          if (isBranch) {
            const branchIdx = (hash - 179) % O.length;
            const ratio = Math.min(1, Math.max(0, (d - 7) / 11));
            [R_out, ne_out, re_out, useSecondaryColor] = M(branchIdx, ratio, u, x_coord);
          } else {
            const ratio = Math.min(1, Math.max(0, (d - 7) / 11));
            [R_out, ne_out, re_out, useSecondaryColor] = j(ratio, u, x_coord);
          }
          tempColor.set(Ih(useSecondaryColor ? s : o));
          A_col = tempColor.r;
          L_col = tempColor.g;
          te_col = tempColor.b;
        } else if (meshType === 'leaf') {
          if (Math.sqrt(u * u + x_coord * x_coord) < 2.8) {
            const hash = (u * 31 + d * 19 + x_coord * 29 | 0) & 255;
            const branchIdx = hash < 140 ? -1 : hash < 178 ? 0 : hash < 217 ? 1 : 2;
            let useSecondaryColor;
            if (branchIdx === -1) {
              const ratio = Math.random();
              [R_out, ne_out, re_out, useSecondaryColor] = j(ratio, u, x_coord);
            } else {
              const ratio = Math.random();
              [R_out, ne_out, re_out, useSecondaryColor] = M(branchIdx, ratio, u, x_coord);
            }
            tempColor.set(Ih(useSecondaryColor ? s : o));
            A_col = tempColor.r;
            L_col = tempColor.g;
            te_col = tempColor.b;
          } else {
            const branchIdx = d >= 22 ? 0 : d < 18 ? 1 : 2;
            const clusterDef = E[branchIdx];
            [R_out, ne_out, re_out] = N(clusterDef, u, x_coord);
            const r_rand = Math.random();
            const extraThresh = branchIdx === 2 ? 0.14 : 0.06;
            if (r_rand < 0.03) {
              tempColor.set(Ih(m));
            } else if (r_rand < 0.03 + extraThresh) {
              tempColor.set(Ih(p));
            } else if (r_rand < 0.3 + extraThresh) {
              tempColor.set(Ih(l));
            } else {
              tempColor.set(Ih(D[branchIdx]));
            }
            A_col = tempColor.r;
            L_col = tempColor.g;
            te_col = tempColor.b;
          }
        } else if (meshType === 'rock') {
          if (e < I.length) {
            const [rx, ry, rz] = I[e];
            R_out = rx + (Math.random() - 0.5) * 0.2 * g;
            ne_out = ry + (Math.random() - 0.5) * 0.1 * g;
            re_out = rz + (Math.random() - 0.5) * 0.2 * g;
            tempColor.set(Ih(r));
            A_col = tempColor.r * 0.9;
            L_col = tempColor.g * 0.9;
            te_col = tempColor.b * 0.85;
          } else if (e - I.length < 5) {
            const [cx, cy, cz, radius] = ee;
            const angle = Math.random() * Math.PI * 2;
            const offsetR = radius * (0.3 + Math.random() * 0.5);
            R_out = cx + Math.cos(angle) * offsetR;
            re_out = cz + Math.sin(angle) * offsetR;
            ne_out = cy + (Math.random() - 0.5) * 0.4 * g;
            tempColor.set(Ih(c));
            A_col = tempColor.r * 0.85;
            L_col = tempColor.g * 0.85;
            te_col = tempColor.b * 0.85;
          } else {
            const angle = Math.random() * Math.PI * 2;
            const distRatio = Math.sqrt(Math.random());
            R_out = Math.cos(angle) * distRatio * (_ - 0.5 * g);
            re_out = Math.sin(angle) * distRatio * (v - 0.5 * g);
            ne_out = -0.27 + (Math.random() - 0.5) * 0.1 * g;
            tempColor.set(Ih(r));
            A_col = tempColor.r * 0.85;
            L_col = tempColor.g * 0.85;
            te_col = tempColor.b * 0.8;
          }
        } else if (meshType === 'flower') {
          const branchIdx = Math.floor(Math.random() * E.length);
          [R_out, ne_out, re_out] = N(E[branchIdx]);
          if (Math.random() < 0.3) {
            tempColor.set(Ih(h));
          } else {
            tempColor.set(Ih(D[branchIdx]));
          }
          A_col = tempColor.r;
          L_col = tempColor.g;
          te_col = tempColor.b;
        } else if (meshType === 'mushroom') {
          const r_val = Math.random();
          const branchIdx = r_val < 0.45 ? 0 : r_val < 0.75 ? 1 : 2;
          [R_out, ne_out, re_out] = N(E[branchIdx]);
          tempColor.set(Ih(D[branchIdx]));
          A_col = tempColor.r;
          L_col = tempColor.g;
          te_col = tempColor.b;
        }

        positions[e * 3] = R_out;
        positions[e * 3 + 1] = ne_out;
        positions[e * 3 + 2] = re_out;
        colors[e * 3] = A_col;
        colors[e * 3 + 1] = L_col;
        colors[e * 3 + 2] = te_col;
      }
      layout.set(mesh, { positions, colors });
    });
    return layout;
  }

  /* ━━━━━━━━━━━━━━━━━ PARTICLES ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  _setupParticles() {
    this.particleGroup = new THREE.Group();
    this.particleGroup.name = 'particleGroup';
    this.scene.add(this.particleGroup);

    // 1. Dust motes point cloud
    this.dustCount = 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(this.dustCount * 3);
    this.dustVelocities = new Float32Array(this.dustCount * 3);

    for (let i = 0; i < this.dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 30;
      dustPositions[i * 3 + 1] = Math.random() * 35 - 5;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 24;

      this.dustVelocities[i * 3] = (Math.random() - 0.5) * 0.3;
      this.dustVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      this.dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 235, 150, 1.0)');
    grad.addColorStop(1, 'rgba(255, 235, 150, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(canvas);

    const dustMat = new THREE.PointsMaterial({
      color: 0xffdb60,
      opacity: 0.9,
      size: 0.25,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: texture
    });

    this.dustMotes = new THREE.Points(dustGeo, dustMat);
    this.dustMotes.name = 'dustMotes';
    this.particleGroup.add(this.dustMotes);

    // 2. Falling leaf instances
    this.leafCount = 40;
    const leafGeo = new THREE.PlaneGeometry(0.5, 0.5);
    const leafMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.8,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    this.fallingLeaves = new THREE.InstancedMesh(leafGeo, leafMat, this.leafCount);
    this.fallingLeaves.name = 'fallingLeaves';
    this.particleGroup.add(this.fallingLeaves);

    this.leavesData = [];
    for (let i = 0; i < this.leafCount; i++) {
      this._resetFallingLeaf(i);
      this.leavesData[i].life = Math.random() * this.leavesData[i].maxLife;
    }

    this.leafColorPalettes = [
      ['#e63c2e','#d4452f','#f05a3a','#ff6b45','#f5a623','#ff8c42'], // Cyber conifer/Autumn
      ['#1a4a2a','#224e30','#2a5a38','#1e4828','#164020','#2e6e3e'], // Summer
      ['#ffb7c5','#ff97b0','#ffc8d6','#fff0f5','#ffd0db'],            // Sakura
      ['#456f3a','#5a8845','#3a5e30','#9a5226','#b04030','#345532']  // Bonsai summer
    ];
  }

  _resetFallingLeaf(idx) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 6;

    this.leavesData[idx] = {
      x: Math.cos(angle) * radius,
      y: 18 + Math.random() * 8,
      z: Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(1.5 + Math.random() * 1.5),
      vz: (Math.random() - 0.5) * 0.8,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      spinX: (Math.random() - 0.5) * 2.0,
      spinY: (Math.random() - 0.5) * 1.5,
      spinZ: (Math.random() - 0.5) * 2.0,
      scale: 0.25 + Math.random() * 0.45,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleFreq: 1.5 + Math.random() * 2.0,
      wobbleAmp: 0.3 + Math.random() * 0.5,
      life: 0,
      maxLife: 4.0 + Math.random() * 6.0
    };
  }

  zg(dt) {
    const safeDt = Math.min(dt, 0.05);
    const elapsedSec = performance.now() * 0.001;

    // 1. Dust motes position updates
    const dustPositions = this.dustMotes.geometry.attributes.position.array;
    for (let i = 0; i < this.dustCount; i++) {
      dustPositions[i * 3] += (this.dustVelocities[i * 3] + Math.sin(elapsedSec * 0.5 + i * 0.7) * 0.15) * safeDt;
      dustPositions[i * 3 + 1] += (this.dustVelocities[i * 3 + 1] + Math.sin(elapsedSec * 0.3 + i * 1.1) * 0.08) * safeDt;
      dustPositions[i * 3 + 2] += (this.dustVelocities[i * 3 + 2] + Math.cos(elapsedSec * 0.4 + i * 0.9) * 0.15) * safeDt;

      // Wrap boundaries
      if (dustPositions[i * 3] > 18.0) dustPositions[i * 3] = -18.0;
      if (dustPositions[i * 3] < -18.0) dustPositions[i * 3] = 18.0;
      if (dustPositions[i * 3 + 1] > 35.0) dustPositions[i * 3 + 1] = -5.0;
      if (dustPositions[i * 3 + 1] < -5.0) dustPositions[i * 3 + 1] = 35.0;
      if (dustPositions[i * 3 + 2] > 14.0) dustPositions[i * 3 + 2] = -14.0;
      if (dustPositions[i * 3 + 2] < -14.0) dustPositions[i * 3 + 2] = 14.0;
    }
    this.dustMotes.geometry.attributes.position.needsUpdate = true;

    // 2. Leaf color & matrix updates
    const palette = this.leafColorPalettes[this.targetVariation] || this.leafColorPalettes[0];
    const tempColor = new THREE.Color();
    const tempObj = new THREE.Object3D();

    if (this.fallingLeaves._lastVariation !== this.targetVariation) {
      this.fallingLeaves._lastVariation = this.targetVariation;
      for (let i = 0; i < this.leafCount; i++) {
        tempColor.set(palette[Math.floor(Math.random() * palette.length)]);
        this.fallingLeaves.setColorAt(i, tempColor);
      }
      if (this.fallingLeaves.instanceColor) {
        this.fallingLeaves.instanceColor.needsUpdate = true;
      }
    }

    for (let i = 0; i < this.leafCount; i++) {
      const leaf = this.leavesData[i];
      leaf.life += safeDt;

      if (leaf.life >= leaf.maxLife || leaf.y < -16.0) {
        this._resetFallingLeaf(i);
        tempColor.set(palette[Math.floor(Math.random() * palette.length)]);
        this.fallingLeaves.setColorAt(i, tempColor);
        this.fallingLeaves.instanceColor.needsUpdate = true;
      }

      const wobble = Math.sin(elapsedSec * leaf.wobbleFreq + leaf.wobblePhase) * leaf.wobbleAmp;
      leaf.x += (leaf.vx + wobble) * safeDt;
      leaf.y += leaf.vy * safeDt;
      leaf.z += (leaf.vz + Math.cos(elapsedSec * leaf.wobbleFreq * 0.7 + leaf.wobblePhase) * leaf.wobbleAmp * 0.6) * safeDt;

      leaf.rotX += leaf.spinX * safeDt;
      leaf.rotY += leaf.spinY * safeDt;
      leaf.rotZ += leaf.spinZ * safeDt;

      const ratio = leaf.life / leaf.maxLife;
      const scale = ratio < 0.1 ? ratio / 0.1 : ratio > 0.85 ? (1.0 - ratio) / 0.15 : 1.0;

      tempObj.position.set(leaf.x, leaf.y, leaf.z);
      tempObj.rotation.set(leaf.rotX, leaf.rotY, leaf.rotZ);
      tempObj.scale.setScalar(leaf.scale * scale);
      tempObj.updateMatrix();

      this.fallingLeaves.setMatrixAt(i, tempObj.matrix);
    }
    this.fallingLeaves.instanceMatrix.needsUpdate = true;
  }

  /* ━━━━━━━━━━━━━━━━━ MORPH TRANSITIONS ━━━━━━━━━━━━━━━━━━━ */
  Cg(index) {
    if (this.isMorphing && this.targetVariation === index) return;
    if (this.currentVariation === index && !this.isMorphing) return;

    const posMap = new Map();
    const colMap = new Map();
    const tempColor = new THREE.Color();

    this.instancedMeshMap.forEach((key, mesh) => {
      const meta = this.metadata.get(mesh);
      const count = meta.count;

      const positions = new Float32Array(meta.origPositions);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        mesh.getColorAt(i, tempColor);
        colors[i * 3] = tempColor.r;
        colors[i * 3 + 1] = tempColor.g;
        colors[i * 3 + 2] = tempColor.b;
      }

      posMap.set(mesh, positions);
      colMap.set(mesh, colors);
    });

    this.posMapSnapshot = posMap;
    this.colMapSnapshot = colMap;
    this.targetVariation = index;
    this.morphStartTime = performance.now();
    this.isMorphing = true;
  }

  Tg() {
    if (!this.isMorphing) return;
    const elapsed = (performance.now() - this.morphStartTime) / 1000;
    let t = Math.min(elapsed / this.morphDuration, 1.0);

    // Easing curve (easeInOutCubic)
    t = t < 0.5 ? 4 * t * t * t : 1.0 - Math.pow(-2 * t + 2, 3) / 2;

    const targetLayout = this.layouts[this.targetVariation];
    const baseLayout = this.layouts[0];

    const tempColor = new THREE.Color();
    const meshMap = this.instancedMeshMap;
    const metadataMap = this.metadata;
    const posSnapshot = this.posMapSnapshot;
    const colSnapshot = this.colMapSnapshot;

    meshMap.forEach((key, mesh) => {
      const meta = metadataMap.get(mesh);
      const data = targetLayout.get(mesh);
      if (!data) return;

      const snapPos = posSnapshot.get(mesh);
      const snapCol = colSnapshot.get(mesh);
      const basePos = baseLayout.get(mesh).positions;

      const count = meta.count;
      const array = mesh.instanceMatrix.array;

      for (let i = 0; i < count; i++) {
        const r = i * 3;

        const sx = snapPos[r];
        const sy = snapPos[r + 1];
        const sz = snapPos[r + 2];

        const tx = data.positions[r];
        const ty = data.positions[r + 1];
        const tz = data.positions[r + 2];

        // Height-based delay morph factor for foliage
        const heightRatio = (basePos[r + 1] - 14) / 12;
        const heightPhase = this._getMeshType(mesh) === 'leaf' ? (Math.sin(basePos[r] * 0.5 + basePos[r + 2] * 0.7) * 0.5 + 0.5) * 0.3 : 0;
        const progress = Math.max(0, Math.min(1, (t - heightPhase) / (1 - heightPhase)));

        const currX = sx + (tx - sx) * progress;
        const currY = sy + (ty - sy) * progress;
        const currZ = sz + (tz - sz) * progress;

        meta.origPositions[r] = currX;
        meta.origPositions[r + 1] = currY;
        meta.origPositions[r + 2] = currZ;

        const idx = i * 16;
        array[idx + 12] = currX + meta.offsets[r];
        array[idx + 13] = currY + meta.offsets[r + 1];
        array[idx + 14] = currZ + meta.offsets[r + 2];

        const oldR = snapCol[r];
        const oldG = snapCol[r + 1];
        const oldB = snapCol[r + 2];

        const newR = data.colors[r];
        const newG = data.colors[r + 1];
        const newB = data.colors[r + 2];

        tempColor.setRGB(
          oldR + (newR - oldR) * progress,
          oldG + (newG - oldG) * progress,
          oldB + (newB - oldB) * progress
        );
        mesh.setColorAt(i, tempColor);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
      }
    });

    if (t >= 1.0) {
      this.isMorphing = false;
      this.currentVariation = this.targetVariation;
      this.posMapSnapshot = null;
      this.colMapSnapshot = null;
    }
  }

  /* ━━━━━━━━━━━━━━━━━ POINTER PROJECTION ━━━━━━━━━━━━━━━━━━ */
  n_(dt) {
    const elapsed = performance.now();
    const mouseIdle = (elapsed - this.lastPointerTime) / 1000 > 0.08;

    this.raycaster = this.raycaster || new THREE.Raycaster();
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const treeCenter = this.centerOfTree;
    const rayDirNeg = this.raycaster.ray.direction.clone().negate();
    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(rayDirNeg, treeCenter);

    const intersectPoint = new THREE.Vector3();
    const hasIntersection = this.raycaster.ray.intersectPlane(plane, intersectPoint) !== null;
    const maxInteractDist = 20;

    const pointerActive = hasIntersection && intersectPoint.distanceTo(treeCenter) < maxInteractDist;

    if (pointerActive) {
      if (!this.pointerActive) {
        this.targetPointer.copy(intersectPoint);
        this.pointerActive = true;
      } else if (!mouseIdle) {
        const lerpFactor = 1 - Math.exp(-12 * Math.min(dt, 0.05));
        this.targetPointer.lerp(intersectPoint, lerpFactor);
      }
    } else {
      this.pointerActive = false;
    }

    const interactRadius = 10.0;
    const repulsionStrength = 18.0;
    const springLerpFactor = 1 - Math.exp(-(this.pointerActive ? 8.0 : 2.5) * Math.min(dt, 0.05));
    const timeSec = elapsed * 0.001;

    this.instancedMeshMap.forEach((key, mesh) => {
      const meta = this.metadata.get(mesh);
      const count = meta.count;
      const array = mesh.instanceMatrix.array;
      let meshUpdated = false;

      for (let i = 0; i < count; i++) {
        const r = i * 3;
        const u = meta.origPositions[r];
        const d = meta.origPositions[r + 1];
        const f = meta.origPositions[r + 2];

        let targetOffX = 0;
        let targetOffY = 0;
        let targetOffZ = 0;

        if (this.pointerActive) {
          const dx = u - this.targetPointer.x;
          const dy = d - this.targetPointer.y;
          const dz = f - this.targetPointer.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < interactRadius && dist > 0.01) {
            const ratio = 1 - dist / interactRadius;
            const force = ratio * ratio * ratio * repulsionStrength;
            const distInv = 1.0 / dist;

            const phase = u * 1.3 + d * 0.7 + f * 1.1;
            const wind = 1 + (Math.sin(timeSec * 0.003 + phase) * 0.15 + Math.sin(timeSec * 0.0017 + phase * 0.6) * 0.1) * ratio;

            const randD = meta.randDirs;
            const dirX = dx * distInv * 0.6 + randD[r] * 0.4;
            const dirY = dy * distInv * 0.6 + randD[r + 1] * 0.4;
            const dirZ = dz * distInv * 0.6 + randD[r + 2] * 0.4;
            const dirLen = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1.0;
            const forceMag = force * wind / dirLen;

            targetOffX = dirX * forceMag;
            targetOffY = dirY * forceMag;
            targetOffZ = dirZ * forceMag;
          }
        }

        // Spring dynamics damping
        const currOffX = meta.offsets[r];
        const currOffY = meta.offsets[r + 1];
        const currOffZ = meta.offsets[r + 2];

        const newOffX = currOffX + (targetOffX - currOffX) * springLerpFactor;
        const newOffY = currOffY + (targetOffY - currOffY) * springLerpFactor;
        const newOffZ = currOffZ + (targetOffZ - currOffZ) * springLerpFactor;

        if (Math.abs(newOffX - currOffX) > 1e-5 || Math.abs(newOffY - currOffY) > 1e-5 || Math.abs(newOffZ - currOffZ) > 1e-5) {
          meta.offsets[r] = newOffX;
          meta.offsets[r + 1] = newOffY;
          meta.offsets[r + 2] = newOffZ;

          const idx = i * 16;
          array[idx + 12] = u + newOffX;
          array[idx + 13] = d + newOffY;
          array[idx + 14] = f + newOffZ;
          meshUpdated = true;
        }
      }

      if (meshUpdated) {
        mesh.instanceMatrix.needsUpdate = true;
      }
    });
  }

  /* ━━━━━━━━━━━━━━━━━ THEME / EXPOSURE SYNC ━━━━━━━━━━━━━━━ */
  setThemeColors(primary, secondary) {
    const theme = document.body.getAttribute('data-theme') || 'cyber';
    if (theme === 'frost') {
      this.Cg(1);
    } else if (theme === 'orchid') {
      this.Cg(2);
    } else if (theme === 'amber') {
      this.Cg(3);
    } else {
      this.Cg(0); // cyber
    }
  }

  setDimmed(dimmed) {
    this.isDimmed = dimmed;
  }

  generateNetwork(seed) {
    // Stub to align with App workspace reset flow
    this.setThemeColors();
  }

  /* ━━━━━━━━━━━━━━━━━ MOUSE / POINTER LISTENERS ━━━━━━━━━━━ */
  _onMouseMove(e) {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.lastPointerTime = performance.now();
  }

  _onMouseLeave() {
    this.mouse.set(9999, 9999);
  }

  /* ━━━━━━━━━━━━━━━━━ ANIMATION LOOP ━━━━━━━━━━━━━━━━━━━━━━ */
  animate() {
    this.animationId = requestAnimationFrame(this.animate);
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (this.controls) this.controls.update();

    // Dynamically adjust exposure and light intensity based on workspace state
    const targetExposure = this.isDimmed ? 0.35 : 1.15;
    this.renderer.toneMappingExposure += (targetExposure - this.renderer.toneMappingExposure) * 0.04;

    const dimFactor = this.isDimmed ? 0.3 : 1.0;
    this.ambientLight.intensity = 0.45 * dimFactor;
    this.mainLight.intensity = 2.8 * dimFactor;
    this.softShadowLight.intensity = 0.6 * dimFactor;
    this.fillLight.intensity = 0.6 * dimFactor;
    this.rimLight.intensity = 3.0 * dimFactor;
    this.accentLight.intensity = 2.6 * dimFactor;

    // Run updates
    this.Tg();
    this.n_(dt);
    this.zg(dt);

    this.renderer.render(this.scene, this.camera);
  }

  /* ━━━━━━━━━━━━━━━━━ CLEANUP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('resize', this._onResize);
    this.container.removeEventListener('mousemove', this._onMouseMove);
    this.container.removeEventListener('mouseleave', this._onMouseLeave);

    if (this.controls) this.controls.dispose();

    this._disposeObject(this.scene);

    if (this.renderer) {
      if (this.renderer.renderLists && typeof this.renderer.renderLists.dispose === 'function') {
        this.renderer.renderLists.dispose();
      }
      this.renderer.dispose();
      if (typeof this.renderer.forceContextLoss === 'function') {
        this.renderer.forceContextLoss();
      }
      this.renderer.domElement.remove();
    }
  }

  _disposeObject(obj) {
    obj.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
