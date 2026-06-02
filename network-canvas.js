import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

/* ─────────────────────────────────────────────────────────
   Voxel Art 3D Bonsai — Floating Island Edition
   ─────────────────────────────────────────────────────────
   Matching the reference project's blocky cube aesthetic:
   • Floating island with grass / dirt / stone layers
   • Thick voxel trunk with branching
   • Dense cube-based canopy clusters
   • Ground decoration cubes (flowers, mushrooms)
   • Falling petal cubes
   • Twinkling star sprites
   • Warm cinematic lighting with auto-rotation
   • Reflection glow beneath the island
   • Full theme color synchronization
   ───────────────────────────────────────────────────────── */

// ── Seeded PRNG ──────────────────────────────────────────
function seededRandom(seed) {
  let h = 0;
  const s = seed || 'bonsai';
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return () => { const x = Math.sin(h++) * 10000; return x - Math.floor(x); };
}

export class NetworkCanvasManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.container = this.canvas.parentElement;

    /* ── Scene ── */
    this.scene = new THREE.Scene();

    /* ── Camera ── */
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 300);
    this.camera.position.set(0, 8, 34);
    this.camera.lookAt(0, 2, 0);

    /* ── Renderer ── */
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas, antialias: true, alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    /* ── State ── */
    this.isDimmed = false;
    this.dimFactor = 1.0;
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseSmooth = new THREE.Vector2(0, 0);

    /* ── Theme colors ── */
    this.primaryColor   = new THREE.Color('#f59e0b');
    this.secondaryColor = new THREE.Color('#ef4444');
    this.targetPrimary  = this.primaryColor.clone();
    this.targetSecondary = this.secondaryColor.clone();
    this.themeOverridden = false;

    /* ── Collections ── */
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);
    this.meshes = [];          // all disposable meshes
    this.leafData = [];        // per-instance leaf metadata
    this.leavesMesh = null;
    this.detailMesh = null;
    this.detailData = [];
    this.stars = [];
    this.starGroup = null;
    this.petals = [];
    this.petalGroup = null;
    this.reflectionPlane = null;

    /* ── Lighting ── */
    this._setupLights();

    /* ── Bindings ── */
    this.animate = this.animate.bind(this);
    window.addEventListener('resize', this._onResize.bind(this));
    this.container.addEventListener('mousemove', this._onMouseMove.bind(this));
    this.container.addEventListener('mouseleave', this._onMouseLeave.bind(this));

    /* ── Go ── */
    this.generateNetwork('anonymous');
    this.animate();
  }

  /* ━━━━━━━━━━━━━━━━━ LIGHTING ━━━━━━━━━━━━━━━━━━━━━━━━ */
  _setupLights() {
    // Warm ambient
    this.scene.add(new THREE.AmbientLight(0x3a2818, 0.7));

    // Key (warm sun)
    const key = new THREE.DirectionalLight(0xffeedd, 1.4);
    key.position.set(10, 18, 10);
    this.scene.add(key);

    // Fill (cool)
    const fill = new THREE.DirectionalLight(0x88aacc, 0.25);
    fill.position.set(-8, 5, -6);
    this.scene.add(fill);

    // Rim
    this.rimLight = new THREE.PointLight(0xff9944, 0.5, 40);
    this.rimLight.position.set(-8, 12, -6);
    this.scene.add(this.rimLight);

    // Under-glow
    const under = new THREE.PointLight(0x442200, 0.35, 20);
    under.position.set(0, -5, 4);
    this.scene.add(under);
  }

  /* ━━━━━━━━━━━━━━━━━ THEME API ━━━━━━━━━━━━━━━━━━━━━━━ */
  setThemeColors(p, s) {
    this.targetPrimary.set(p);
    this.targetSecondary.set(s);
    this.themeOverridden = true;
  }
  setDimmed(d) { this.isDimmed = d; }

  /* ━━━━━━━━━━━━━━━ GENERATE ━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  generateNetwork(seedStr) {
    const R = seededRandom(seedStr);

    if (!this.themeOverridden) {
      const hue = R() * 360;
      this.targetPrimary.setHSL(hue / 360, 0.9, 0.6);
      this.targetSecondary.setHSL(((hue + 120) % 360) / 360, 0.85, 0.5);
      if (this.meshes.length === 0) {
        this.primaryColor.copy(this.targetPrimary);
        this.secondaryColor.copy(this.targetSecondary);
      }
    }

    this._clear();

    const B = 0.5;   // block size (world units)
    const G = 0.47;  // geometry size (gap between blocks)

    // Collect voxel positions for each material type
    const grass = [], dirt = [], stone = [], gold = [];
    const trunk = [], leaves = [], details = [];

    /* ── 1. FLOATING ISLAND ── */
    this._genIsland(R, B, grass, dirt, stone, gold);

    /* ── 2. BONSAI TREE ── */
    this._genTree(R, B, trunk, leaves);

    /* ── 3. GROUND DETAILS ── */
    this._genDetails(R, B, details, grass);

    /* ── 4. BUILD INSTANCED MESHES ── */
    const boxGeo = new THREE.BoxGeometry(G, G, G);

    // Helper: build an InstancedMesh from positions with a flat color
    const buildSolid = (arr, color, roughness) => {
      if (!arr.length) return null;
      const mat = new THREE.MeshLambertMaterial({
        color: new THREE.Color(color),
        transparent: true, opacity: 1.0
      });
      const mesh = new THREE.InstancedMesh(boxGeo, mat, arr.length);
      const m4 = new THREE.Matrix4();
      for (let i = 0; i < arr.length; i++) {
        m4.makeTranslation(arr[i].x, arr[i].y, arr[i].z);
        mesh.setMatrixAt(i, m4);
      }
      mesh.instanceMatrix.needsUpdate = true;
      this.mainGroup.add(mesh);
      this.meshes.push(mesh);
      return mesh;
    };

    buildSolid(grass, '#4a9438', 0.7);
    buildSolid(dirt,  '#7a5a30', 0.85);
    buildSolid(stone, '#3a3530', 0.9);
    buildSolid(gold,  '#c4a040', 0.6);
    buildSolid(trunk, '#4a2812', 0.85);

    // Leaves – with per-instance color
    if (leaves.length) {
      const leafMat = new THREE.MeshLambertMaterial({
        transparent: true, opacity: 1.0
      });
      this.leavesMesh = new THREE.InstancedMesh(boxGeo, leafMat, leaves.length);
      const m4 = new THREE.Matrix4();
      for (let i = 0; i < leaves.length; i++) {
        m4.makeTranslation(leaves[i].x, leaves[i].y, leaves[i].z);
        this.leavesMesh.setMatrixAt(i, m4);
      }
      this.leavesMesh.instanceMatrix.needsUpdate = true;
      this.mainGroup.add(this.leavesMesh);
      this.meshes.push(this.leavesMesh);
      this.leafData = leaves;
    }

    // Detail cubes – with per-instance color
    if (details.length) {
      const detMat = new THREE.MeshLambertMaterial({ transparent: true, opacity: 1.0 });
      this.detailMesh = new THREE.InstancedMesh(boxGeo, detMat, details.length);
      const m4 = new THREE.Matrix4();
      for (let i = 0; i < details.length; i++) {
        m4.makeTranslation(details[i].x, details[i].y, details[i].z);
        this.detailMesh.setMatrixAt(i, m4);
      }
      this.detailMesh.instanceMatrix.needsUpdate = true;
      this.mainGroup.add(this.detailMesh);
      this.meshes.push(this.detailMesh);
      this.detailData = details;
    }

    /* ── 5. REFLECTION GLOW ── */
    this._createReflection();

    /* ── 6. STARS ── */
    this._createStars(R);

    /* ── 7. FALLING PETAL CUBES ── */
    this._createPetals(R, G);

    boxGeo.dispose();
  }

  /* ━━━━━━━━━━━━ FLOATING ISLAND ━━━━━━━━━━━━━━━━━━━━━ */
  _genIsland(R, B, grass, dirt, stone, gold) {
    const radius = 8;

    // Helper: noisy radius for organic edges
    const edgeR = (angle, baseR) =>
      baseR + Math.sin(angle * 5.3) * 0.7 + Math.cos(angle * 3.1) * 0.4;

    // Top grass layer (y = 0)
    for (let x = -radius; x <= radius; x++) {
      for (let z = -radius; z <= radius; z++) {
        const d = Math.sqrt(x * x + z * z);
        const a = Math.atan2(z, x);
        if (d <= edgeR(a, radius)) {
          grass.push({ x: x * B, y: 0, z: z * B });
        }
      }
    }

    // Dirt layers (y = -1, -2)
    for (let layer = 1; layer <= 2; layer++) {
      const lr = radius - layer * 1.0;
      for (let x = -Math.ceil(lr + 1); x <= Math.ceil(lr + 1); x++) {
        for (let z = -Math.ceil(lr + 1); z <= Math.ceil(lr + 1); z++) {
          const d = Math.sqrt(x * x + z * z);
          const a = Math.atan2(z, x);
          if (d <= edgeR(a, lr)) {
            dirt.push({ x: x * B, y: -layer * B, z: z * B });
          }
        }
      }
    }

    // Stone layer (y = -3)
    const stoneR = radius - 3;
    for (let x = -Math.ceil(stoneR + 1); x <= Math.ceil(stoneR + 1); x++) {
      for (let z = -Math.ceil(stoneR + 1); z <= Math.ceil(stoneR + 1); z++) {
        const d = Math.sqrt(x * x + z * z);
        const a = Math.atan2(z, x);
        if (d <= edgeR(a, stoneR)) {
          stone.push({ x: x * B, y: -3 * B, z: z * B });
        }
      }
    }

    // Hanging stalactite chunks + gold accents (y = -4 to -6)
    for (let i = 0; i < 25; i++) {
      const angle = R() * Math.PI * 2;
      const r = 1 + R() * 4;
      const bx = Math.round(Math.cos(angle) * r);
      const bz = Math.round(Math.sin(angle) * r);
      const depth = 4 + Math.floor(R() * 3);
      const arr = R() < 0.35 ? gold : stone;
      arr.push({ x: bx * B, y: -depth * B, z: bz * B });
    }

    // Gold edge accent blocks on the rim of the island
    for (let i = 0; i < 18; i++) {
      const angle = R() * Math.PI * 2;
      const r = radius - 0.5 + R();
      const bx = Math.round(Math.cos(angle) * r);
      const bz = Math.round(Math.sin(angle) * r);
      gold.push({ x: bx * B, y: -(1 + Math.floor(R() * 2)) * B, z: bz * B });
    }
  }

  /* ━━━━━━━━━━━━ BONSAI TREE ━━━━━━━━━━━━━━━━━━━━━━━━ */
  _genTree(R, B, trunk, leaves) {
    // ── Main trunk column ──
    // Starts at y=1 (on top of grass), goes up to y=trunkH
    const trunkH = 11;
    for (let y = 1; y <= trunkH; y++) {
      const t = (y - 1) / (trunkH - 1);
      // Trunk width tapers from 2 to 0
      const halfW = t < 0.35 ? 2 : t < 0.65 ? 1 : 0;
      // Slight lean
      const leanX = Math.floor(t * 1.2);

      for (let dx = -halfW; dx <= halfW; dx++) {
        for (let dz = -halfW; dz <= halfW; dz++) {
          // Use diamond shape for natural cross section
          if (Math.abs(dx) + Math.abs(dz) <= halfW) {
            trunk.push({
              x: (dx + leanX) * B,
              y: y * B,
              z: dz * B
            });
          }
        }
      }
    }

    // ── Roots spreading from base ──
    const rootDirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];
    for (let i = 0; i < 6; i++) {
      const dir = rootDirs[i % rootDirs.length];
      const len = 2 + Math.floor(R() * 2);
      for (let s = 1; s <= len; s++) {
        trunk.push({
          x: dir[0] * s * B,
          y: (1 - s * 0.4) * B,
          z: dir[1] * s * B
        });
      }
    }

    // ── Branch paths ──
    // Branch 1: left-forward, starts ~y=7
    const b1 = [];
    for (let s = 1; s <= 5; s++) {
      const bx = -s;
      const by = 7 + s * 0.6;
      const bz = s * 0.4;
      b1.push({ x: Math.round(bx), y: Math.round(by), z: Math.round(bz) });
      trunk.push({ x: Math.round(bx) * B, y: Math.round(by) * B, z: Math.round(bz) * B });
    }

    // Branch 2: right-back, starts ~y=8
    const b2 = [];
    for (let s = 1; s <= 5; s++) {
      const bx = s * 1.1;
      const by = 8 + s * 0.5;
      const bz = -s * 0.5;
      b2.push({ x: Math.round(bx), y: Math.round(by), z: Math.round(bz) });
      trunk.push({ x: Math.round(bx) * B, y: Math.round(by) * B, z: Math.round(bz) * B });
    }

    // Branch 3: slight forward continuation for top crown
    for (let s = 1; s <= 3; s++) {
      trunk.push({
        x: (1 + s * 0.2) * B,
        y: (trunkH + s) * B,
        z: s * 0.3 * B
      });
    }

    // ── Canopy clusters ──
    // Cluster 1: at end of branch 1 (left lower canopy)
    const c1End = b1[b1.length - 1];
    this._genCanopy(R, B, leaves,
      c1End.x * B, (c1End.y + 2) * B, c1End.z * B,
      3.5, 2.2
    );

    // Cluster 2: at end of branch 2 (right canopy)
    const c2End = b2[b2.length - 1];
    this._genCanopy(R, B, leaves,
      c2End.x * B, (c2End.y + 2) * B, c2End.z * B,
      3.2, 2.0
    );

    // Cluster 3: main crown on top
    this._genCanopy(R, B, leaves,
      1 * B, (trunkH + 4) * B, 0.3 * B,
      4.5, 2.8
    );
  }

  /* ── Canopy cluster: flattened ellipsoid of leaf cubes ── */
  _genCanopy(R, B, leaves, cx, cy, cz, radiusXZ, radiusY) {
    const rXZ = Math.ceil(radiusXZ);
    const rY = Math.ceil(radiusY);

    for (let x = -rXZ; x <= rXZ; x++) {
      for (let y = -rY; y <= rY; y++) {
        for (let z = -rXZ; z <= rXZ; z++) {
          // Ellipsoid distance
          const d = Math.sqrt(
            (x / radiusXZ) ** 2 +
            (y / radiusY) ** 2 +
            (z / radiusXZ) ** 2
          );
          if (d <= 1.0) {
            // Porosity — skip ~15% of interior blocks for organic look
            if (R() < 0.15 && d > 0.3) continue;

            leaves.push({
              x: cx + x * B,
              y: cy + y * B,
              z: cz + z * B,
              colorWeight: R(),       // for color interpolation
              brightness: 0.85 + R() * 0.3,
              edgeFactor: d           // blocks near edge are lighter
            });
          }
        }
      }
    }
  }

  /* ━━━━━━━━━━━ GROUND DECORATIONS ━━━━━━━━━━━━━━━━━━━ */
  _genDetails(R, B, details, grassPositions) {
    // Scatter small colored cubes on the grass surface
    const maxDetails = Math.min(40, Math.floor(grassPositions.length * 0.08));
    const used = new Set();

    for (let i = 0; i < maxDetails; i++) {
      const idx = Math.floor(R() * grassPositions.length);
      const key = `${grassPositions[idx].x},${grassPositions[idx].z}`;
      if (used.has(key)) continue;
      used.add(key);

      const gp = grassPositions[idx];
      // Skip blocks too close to center (trunk area)
      if (Math.abs(gp.x) < 1.2 && Math.abs(gp.z) < 1.2) continue;

      details.push({
        x: gp.x,
        y: gp.y + B * 0.5 + B * 0.15,  // sit on top of grass
        z: gp.z,
        colorWeight: R(),
        type: R() < 0.6 ? 'flower' : 'mushroom',
        scale: 0.4 + R() * 0.3
      });
    }
  }

  /* ━━━━━━━━━━━ REFLECTION GLOW ━━━━━━━━━━━━━━━━━━━━━ */
  _createReflection() {
    // Soft glowing disc below the island suggesting a reflection
    const geo = new THREE.CircleGeometry(5.5, 48);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x1a0e04,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    this.reflectionPlane = new THREE.Mesh(geo, mat);
    this.reflectionPlane.rotation.x = -Math.PI / 2;
    this.reflectionPlane.position.y = -4.5;
    this.mainGroup.add(this.reflectionPlane);
    this.meshes.push(this.reflectionPlane);
  }

  /* ━━━━━━━━━━━━ STAR PARTICLES ━━━━━━━━━━━━━━━━━━━━━ */
  _createStars(R) {
    this.starGroup = new THREE.Group();
    this.scene.add(this.starGroup);
    this.stars = [];

    // Small glow dot texture
    const c = document.createElement('canvas');
    c.width = 32; c.height = 32;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,240,1)');
    grad.addColorStop(0.3, 'rgba(255,240,220,0.6)');
    grad.addColorStop(1, 'rgba(255,220,180,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;

    for (let i = 0; i < 120; i++) {
      const mat = new THREE.SpriteMaterial({
        map: tex, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false
      });
      const sp = new THREE.Sprite(mat);

      // Distribute in a large sphere around the scene
      const theta = R() * Math.PI * 2;
      const phi = Math.acos(2 * R() - 1);
      const r = 25 + R() * 45;
      sp.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.6 + 5,
        r * Math.cos(phi)
      );

      const s = 0.15 + R() * 0.35;
      sp.scale.set(s, s, 1);

      this.starGroup.add(sp);
      this.stars.push({
        sprite: sp,
        pulseSpeed: 0.5 + R() * 2.5,
        pulsePhase: R() * Math.PI * 2,
        baseOpacity: 0.3 + R() * 0.5
      });
    }
  }

  /* ━━━━━━━━━━ FALLING PETAL CUBES ━━━━━━━━━━━━━━━━━━━ */
  _createPetals(R, G) {
    this.petalGroup = new THREE.Group();
    this.mainGroup.add(this.petalGroup);
    this.petals = [];

    const petalGeo = new THREE.BoxGeometry(G * 0.55, G * 0.55, G * 0.55);

    for (let i = 0; i < 28; i++) {
      const mat = new THREE.MeshLambertMaterial({
        transparent: true, opacity: 0.85,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(petalGeo, mat);

      const sx = (R() - 0.5) * 12;
      const sy = 4 + R() * 14;
      const sz = (R() - 0.5) * 10;
      mesh.position.set(sx, sy, sz);

      const sc = 0.6 + R() * 0.8;
      mesh.scale.set(sc, sc, sc);

      this.petalGroup.add(mesh);
      this.petals.push({
        mesh,
        vy: -(0.006 + R() * 0.015),
        vx: (R() - 0.5) * 0.004,
        rotSpeed: new THREE.Vector3(
          (R() - 0.5) * 0.025,
          (R() - 0.5) * 0.03,
          (R() - 0.5) * 0.02
        ),
        wobblePhase: R() * Math.PI * 2,
        wobbleSpeed: 0.3 + R() * 0.7,
        wobbleAmp: 0.4 + R() * 1.0,
        origX: sx,
        colorWeight: R()
      });
    }

    petalGeo.dispose();
  }

  /* ━━━━━━━━━━━━━ CLEANUP ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  _clear() {
    for (const m of this.meshes) {
      if (m.parent) m.parent.remove(m);
      if (m.geometry) m.geometry.dispose();
      if (m.material) m.material.dispose();
    }
    this.meshes = [];
    this.leavesMesh = null;
    this.leafData = [];
    this.detailMesh = null;
    this.detailData = [];
    this.reflectionPlane = null;

    if (this.starGroup) {
      this.starGroup.traverse(c => {
        if (c.isSprite && c.material) c.material.dispose();
      });
      this.scene.remove(this.starGroup);
      this.starGroup = null;
    }
    this.stars = [];

    if (this.petalGroup) {
      this.petalGroup.traverse(c => {
        if (c.isMesh) {
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        }
      });
      if (this.petalGroup.parent) this.petalGroup.parent.remove(this.petalGroup);
      this.petalGroup = null;
    }
    this.petals = [];

    // Clear children of mainGroup (but keep the group)
    while (this.mainGroup.children.length) {
      this.mainGroup.remove(this.mainGroup.children[0]);
    }
  }

  /* ━━━━━━━━━━━━ EVENTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  _onResize() {
    if (!this.container) return;
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
  _onMouseMove(e) {
    const r = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  _onMouseLeave() { this.mouse.x = 0; this.mouse.y = 0; }

  /* ━━━━━━━━━━━━ ANIMATION ━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  animate() {
    requestAnimationFrame(this.animate);
    const t = performance.now() * 0.001;

    // ── Theme color lerp ──
    this.primaryColor.lerp(this.targetPrimary, 0.04);
    this.secondaryColor.lerp(this.targetSecondary, 0.04);

    // ── Dim factor ──
    const targetDim = this.isDimmed ? 0.1 : 1.0;
    this.dimFactor += (targetDim - this.dimFactor) * 0.05;

    // ── Slow auto-rotation ──
    this.mainGroup.rotation.y = t * 0.12; // ~52s per revolution

    // ── Mouse-responsive camera shift ──
    this.mouseSmooth.x += (this.mouse.x - this.mouseSmooth.x) * 0.02;
    this.mouseSmooth.y += (this.mouse.y - this.mouseSmooth.y) * 0.02;
    this.camera.position.x = this.mouseSmooth.x * 2.5;
    this.camera.position.y = 8 + this.mouseSmooth.y * 1.5 + Math.sin(t * 0.15) * 0.3;
    this.camera.lookAt(0, 2, 0);

    // ── Update mesh opacities ──
    for (const m of this.meshes) {
      if (m.material && m.material.opacity !== undefined) {
        if (m === this.reflectionPlane) {
          m.material.opacity = 0.2 * this.dimFactor;
        } else {
          m.material.opacity = this.dimFactor;
        }
      }
    }

    // ── Update leaf colors ──
    this._updateLeafColors();

    // ── Update detail colors ──
    this._updateDetailColors();

    // ── Update stars ──
    this._updateStars(t);

    // ── Update falling petals ──
    this._updatePetals(t);

    // ── Lighting sync ──
    const rimC = this.primaryColor.clone().offsetHSL(0.05, 0, -0.1);
    this.rimLight.color.lerp(rimC, 0.02);
    const targetExp = this.isDimmed ? 0.35 : 1.3;
    this.renderer.toneMappingExposure +=
      (targetExp - this.renderer.toneMappingExposure) * 0.04;

    // ── Reflection color sync ──
    if (this.reflectionPlane) {
      const rc = this.primaryColor.clone().multiplyScalar(0.15);
      this.reflectionPlane.material.color.lerp(rc, 0.03);
    }

    this.renderer.render(this.scene, this.camera);
  }

  /* ─── Leaf colors ─── */
  _updateLeafColors() {
    if (!this.leavesMesh || !this.leafData.length) return;
    const color = new THREE.Color();

    for (let i = 0; i < this.leafData.length; i++) {
      const l = this.leafData[i];
      color.copy(this.primaryColor).lerp(this.secondaryColor, l.colorWeight * 0.35);
      // Brightness variation: lighter at edges, darker inside
      const bri = l.brightness * (0.8 + l.edgeFactor * 0.3);
      color.offsetHSL(
        (l.colorWeight - 0.5) * 0.06,
        (l.colorWeight - 0.5) * 0.08,
        (l.edgeFactor - 0.5) * 0.15
      );
      color.multiplyScalar(bri);
      this.leavesMesh.setColorAt(i, color);
    }
    if (this.leavesMesh.instanceColor) {
      this.leavesMesh.instanceColor.needsUpdate = true;
    }
  }

  /* ─── Detail colors ─── */
  _updateDetailColors() {
    if (!this.detailMesh || !this.detailData.length) return;
    const color = new THREE.Color();

    for (let i = 0; i < this.detailData.length; i++) {
      const d = this.detailData[i];
      if (d.type === 'flower') {
        // Flowers use secondary color with variation
        color.copy(this.secondaryColor);
        color.offsetHSL((d.colorWeight - 0.5) * 0.15, 0, (d.colorWeight - 0.5) * 0.2);
      } else {
        // Mushrooms are lighter / cream
        color.copy(this.primaryColor).offsetHSL(0, -0.4, 0.25);
      }
      this.detailMesh.setColorAt(i, color);
    }
    if (this.detailMesh.instanceColor) {
      this.detailMesh.instanceColor.needsUpdate = true;
    }
  }

  /* ─── Stars ─── */
  _updateStars(t) {
    for (const s of this.stars) {
      const pulse = 0.5 + 0.5 * Math.sin(t * s.pulseSpeed + s.pulsePhase);
      s.sprite.material.opacity = s.baseOpacity * pulse * this.dimFactor;
    }
  }

  /* ─── Petals ─── */
  _updatePetals(t) {
    const color = new THREE.Color();
    for (const p of this.petals) {
      p.mesh.position.y += p.vy;
      p.wobblePhase += 0.01 * p.wobbleSpeed;
      p.mesh.position.x = p.origX + Math.sin(p.wobblePhase) * p.wobbleAmp;
      p.mesh.position.z += Math.cos(p.wobblePhase * 0.7) * 0.002;

      p.mesh.rotation.x += p.rotSpeed.x;
      p.mesh.rotation.y += p.rotSpeed.y;
      p.mesh.rotation.z += p.rotSpeed.z;

      // Color from theme
      color.copy(this.primaryColor).lerp(this.secondaryColor, p.colorWeight);
      color.offsetHSL(0, -0.08, 0.12);
      p.mesh.material.color = color.clone();
      p.mesh.material.opacity = 0.8 * this.dimFactor;

      // Reset when fallen
      if (p.mesh.position.y < -6) {
        p.mesh.position.y = 12 + Math.random() * 8;
        p.origX = (Math.random() - 0.5) * 12;
        p.mesh.position.x = p.origX;
        p.mesh.position.z = (Math.random() - 0.5) * 10;
      }
    }
  }
}
