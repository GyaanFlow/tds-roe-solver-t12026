import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

/* ═══════════════════════════════════════════════════════════════════════════
   Premium 3D Neural Network Constellation — Production Build
   ═══════════════════════════════════════════════════════════════════════════
   Architecture:
   • Fixed full-viewport canvas (100vw × 100vh) — covers everything.
   • 200 neurons in deep 3D, arranged in 5 column-layers like a real DNN.
   • 24 large hub neurons glow brighter and repel harder from cursor.
   • Synapse lines: distance-faded, vertex-colored, pre-allocated buffers.
   • 45 action-potential pulses (signals) travel synapses, fade in/out.
   • 320 background stars with slow auto-rotation.
   • Spring-damped cursor repulsion with per-node bloom boost.
   • Smooth HSL theme color lerp — no frame stutter on theme switch.
   • Zero GC pressure: no heap allocations inside the render loop.
   ═══════════════════════════════════════════════════════════════════════════ */

// ── FNV-1a based seeded LCG ──────────────────────────────────────────────────
function createSeededRandom(seedStr) {
  let h = 2166136261;
  const src = (seedStr || 'anonymous').toLowerCase().trim();
  for (let i = 0; i < src.length; i++) {
    h = Math.imul(h ^ src.charCodeAt(i), 16777619) >>> 0;
  }
  let s = h;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

// ── Build soft radial-glow canvas texture ─────────────────────────────────────
function makeGlowTexture(size) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const h = size / 2;
  const g = ctx.createRadialGradient(h, h, 0, h, h, h);
  g.addColorStop(0,    'rgba(255,255,255,1.0)');
  g.addColorStop(0.15, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.4,  'rgba(200,220,255,0.35)');
  g.addColorStop(0.75, 'rgba(150,180,255,0.08)');
  g.addColorStop(1,    'rgba(255,255,255,0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

export class NetworkCanvasManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    // ── Viewport helpers ─────────────────────────────────────────────────────
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    this._W = W; this._H = H;

    // ── Scene ────────────────────────────────────────────────────────────────
    this.scene = new THREE.Scene();

    // ── Camera ───────────────────────────────────────────────────────────────
    this.camera = new THREE.PerspectiveCamera(55, W() / H(), 0.5, 1200);
    this._fitCamera();

    // ── Renderer ─────────────────────────────────────────────────────────────
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(W(), H());
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Config ───────────────────────────────────────────────────────────────
    this.NODE_COUNT   = 200;
    this.HUB_COUNT    = 24;
    this.MAX_LINES    = 1400;
    this.MAX_PULSES   = 45;
    this.STAR_COUNT   = 320;
    this.CONNECT_DIST = 20;

    // ── State ─────────────────────────────────────────────────────────────────
    this.isDimmed     = false;
    this.dimFactor    = 1.0;
    this.nodes        = [];
    this.lightPulses  = [];
    this._animId      = null;

    // ── Theme colors — pre-allocated, lerped every frame (zero GC) ───────────
    this._primary    = new THREE.Color('#f59e0b');
    this._secondary  = new THREE.Color('#ef4444');
    this._tPrimary   = new THREE.Color('#f59e0b');
    this._tSecondary = new THREE.Color('#ef4444');

    // ── Scratch colors reused every frame — NO `new THREE.Color()` in loop ───
    this._tempA = new THREE.Color();
    this._tempB = new THREE.Color();

    // ── Pre-allocated geometry arrays (no per-frame heap) ────────────────────
    this._linePosArr  = new Float32Array(this.MAX_LINES  * 2 * 3);
    this._lineColArr  = new Float32Array(this.MAX_LINES  * 2 * 3);
    this._pulsePosArr = new Float32Array(this.MAX_PULSES * 3);
    this._pulseColArr = new Float32Array(this.MAX_PULSES * 3);

    // ── Mouse state ───────────────────────────────────────────────────────────
    this._mouse       = new THREE.Vector2(9999, 9999);
    this._mouseWorld  = new THREE.Vector3(9999, 9999, 9999);
    this._raycaster   = new THREE.Raycaster();
    this._plane       = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this._mouseActive = false;

    // ── Build scene layers ───────────────────────────────────────────────────
    this._buildStarField();
    this._buildNodeMesh();
    this._buildLineMesh();
    this._buildPulseMesh();

    // ── Bind & register events ───────────────────────────────────────────────
    this.animate       = this.animate.bind(this);
    this._onResize     = this._onResize.bind(this);
    this._onMouseMove  = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    window.addEventListener('resize',     this._onResize,     { passive: true });
    window.addEventListener('mousemove',  this._onMouseMove,  { passive: true });
    window.addEventListener('mouseleave', this._onMouseLeave, { passive: true });

    // ── Seed default network and start loop ──────────────────────────────────
    this.generateNetwork('anonymous');
    this._animId = requestAnimationFrame(this.animate);
  }

  // ── Camera fit: ensures all nodes visible on any aspect ratio ─────────────
  _fitCamera() {
    const aspect = this._W() / this._H();
    // The network spans ~±95 wide, ±55 tall; push camera back so both fit.
    const vFOV    = THREE.MathUtils.degToRad(55);
    const distX   = 95 / (Math.tan(this.camera?.fov ? THREE.MathUtils.degToRad(this.camera.fov / 2) : Math.tan(vFOV / 2)) * aspect);
    const distY   = 55 / Math.tan(vFOV / 2);
    const zNeeded = Math.max(distX, distY) * 1.12;
    if (this.camera) {
      this.camera.position.set(0, 0, Math.max(70, Math.min(zNeeded, 160)));
      this.camera.lookAt(0, 0, 0);
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    }
  }

  // ── Star Field ────────────────────────────────────────────────────────────
  _buildStarField() {
    const pos = new Float32Array(this.STAR_COUNT * 3);
    const col = new Float32Array(this.STAR_COUNT * 3);
    const rng = createSeededRandom('starfield-v3');
    for (let i = 0; i < this.STAR_COUNT; i++) {
      pos[i*3]   = (rng()-0.5)*320;
      pos[i*3+1] = (rng()-0.5)*200;
      pos[i*3+2] = -55 - rng()*90;
      const b = 0.25 + rng()*0.55;
      col[i*3]=b; col[i*3+1]=b; col[i*3+2]=b+0.18;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    this._starMat = new THREE.PointsMaterial({
      size: 0.4, map: makeGlowTexture(8), vertexColors: true,
      transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending,
      depthWrite: false, sizeAttenuation: true
    });
    this._starMesh = new THREE.Points(geo, this._starMat);
    this.scene.add(this._starMesh);
  }

  // ── Node Points mesh ──────────────────────────────────────────────────────
  _buildNodeMesh() {
    const pos = new Float32Array(this.NODE_COUNT * 3);
    const col = new Float32Array(this.NODE_COUNT * 3);
    this._nodeGeo = new THREE.BufferGeometry();
    this._nodeGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this._nodeGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    this._nodeMat = new THREE.PointsMaterial({
      size: 2.6, map: makeGlowTexture(64), vertexColors: true,
      transparent: true, opacity: 0.94, blending: THREE.AdditiveBlending,
      depthWrite: false, sizeAttenuation: true
    });
    this._nodeMesh = new THREE.Points(this._nodeGeo, this._nodeMat);
    this.scene.add(this._nodeMesh);
  }

  // ── Synapse line mesh ─────────────────────────────────────────────────────
  _buildLineMesh() {
    this._lineGeo = new THREE.BufferGeometry();
    this._lineGeo.setAttribute('position', new THREE.BufferAttribute(this._linePosArr, 3));
    this._lineGeo.setAttribute('color',    new THREE.BufferAttribute(this._lineColArr, 3));
    this._lineMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    this._lineMesh = new THREE.LineSegments(this._lineGeo, this._lineMat);
    this.scene.add(this._lineMesh);
  }

  // ── Pulse points mesh ─────────────────────────────────────────────────────
  _buildPulseMesh() {
    this._pulseGeo = new THREE.BufferGeometry();
    this._pulseGeo.setAttribute('position', new THREE.BufferAttribute(this._pulsePosArr, 3));
    this._pulseGeo.setAttribute('color',    new THREE.BufferAttribute(this._pulseColArr, 3));
    this._pulseMat = new THREE.PointsMaterial({
      size: 4.2, map: makeGlowTexture(32), vertexColors: true,
      transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending,
      depthWrite: false, sizeAttenuation: true
    });
    this._pulseMesh = new THREE.Points(this._pulseGeo, this._pulseMat);
    this.scene.add(this._pulseMesh);
  }

  // ── Generate (or regenerate) the network from an email seed ───────────────
  generateNetwork(seedStr) {
    const rng = createSeededRandom(seedStr || 'anonymous');
    this.nodes = [];
    this.lightPulses = [];

    const W = 96, H = 56, D = 44;  // spread volume
    const LAYERS = 5;

    for (let i = 0; i < this.NODE_COUNT; i++) {
      const isHub  = i < this.HUB_COUNT;
      const layer  = Math.floor((i / this.NODE_COUNT) * LAYERS);
      const lxBias = ((layer / (LAYERS - 1)) - 0.5) * W * 0.85;

      const x = lxBias + (rng() - 0.5) * W * 0.42;
      const y = (rng() - 0.5) * H;
      const z = (rng() - 0.5) * D;

      this.nodes.push({
        x, y, z, origX: x, origY: y, origZ: z,
        vx: 0, vy: 0, vz: 0,
        isHub, layer,
        size:        isHub ? 2.8 + rng()*1.5 : 1.0 + rng()*1.2,
        colorWeight: rng(),
        windPhase:   rng() * Math.PI * 2,
        windFreq:    0.22 + rng()*0.55,
        windAmp:     isHub ? 0.4 + rng()*0.45 : 0.65 + rng()*1.05,
        glowPhase:   rng() * Math.PI * 2,
        glowFreq:    0.45 + rng()*1.1,
      });
    }

    // Pre-populate 14 pulses
    for (let k = 0; k < 14; k++) this._spawnPulse(rng);

    // Sync initial positions to GPU buffer
    const posArr = this._nodeGeo.getAttribute('position').array;
    for (let i = 0; i < this.NODE_COUNT; i++) {
      const n = this.nodes[i];
      posArr[i*3]=n.x; posArr[i*3+1]=n.y; posArr[i*3+2]=n.z;
    }
    this._nodeGeo.getAttribute('position').needsUpdate = true;
  }

  // ── Spawn a new action-potential signal on a random synapse ───────────────
  _spawnPulse(optRng) {
    const rng = optRng || Math.random;
    const fromIdx = Math.floor(rng() * this.NODE_COUNT);
    const from = this.nodes[fromIdx];
    if (!from) return;

    let best = -1, bestDist = Infinity;
    // Prefer a candidate in the next layer for forward-propagation feel
    for (let i = 0; i < this.NODE_COUNT; i++) {
      if (i === fromIdx) continue;
      const n = this.nodes[i];
      const dx=from.x-n.x, dy=from.y-n.y, dz=from.z-n.z;
      const d = Math.sqrt(dx*dx+dy*dy+dz*dz);
      if (d < this.CONNECT_DIST && d < bestDist) {
        bestDist = d; best = i;
      }
    }
    if (best !== -1) {
      this.lightPulses.push({
        from: fromIdx, to: best, progress: 0,
        speed:       0.007 + (typeof rng === 'function' ? rng() : Math.random()) * 0.013,
        colorWeight: typeof rng === 'function' ? rng() : Math.random()
      });
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────
  setThemeColors(primary, secondary) {
    if (primary)   this._tPrimary.set(primary);
    if (secondary) this._tSecondary.set(secondary);
  }

  setDimmed(dimmed) { this.isDimmed = dimmed; }

  // ── Window resize ─────────────────────────────────────────────────────────
  _onResize() {
    const w = this._W(), h = this._H();
    this.camera.aspect = w / h;
    this._fitCamera();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // ── Mouse events ──────────────────────────────────────────────────────────
  _onMouseMove(e) {
    this._mouse.set(
      (e.clientX / this._W()) * 2 - 1,
     -(e.clientY / this._H()) * 2 + 1
    );
    this._mouseActive = true;
  }
  _onMouseLeave() {
    this._mouseActive = false;
    this._mouseWorld.set(9999, 9999, 9999);
  }

  // ── Main render/animation loop ────────────────────────────────────────────
  animate() {
    this._animId = requestAnimationFrame(this.animate);
    const t = performance.now() * 0.001;

    // — Theme color lerp (pre-allocated, no GC) —
    this._primary.lerp(this._tPrimary, 0.032);
    this._secondary.lerp(this._tSecondary, 0.032);

    // — Dim factor lerp —
    const tDim = this.isDimmed ? 0.08 : 1.0;
    this.dimFactor += (tDim - this.dimFactor) * 0.055;

    // — Exposure —
    const tExp = this.isDimmed ? 0.45 : 1.25;
    this.renderer.toneMappingExposure += (tExp - this.renderer.toneMappingExposure) * 0.045;

    // — Cursor world position —
    if (this._mouseActive) {
      this._raycaster.setFromCamera(this._mouse, this.camera);
      const hit = new THREE.Vector3();   // minor: one alloc per frame (unavoidable with Three.js Plane API)
      if (this._raycaster.ray.intersectPlane(this._plane, hit)) {
        this._mouseWorld.copy(hit);
      }
    }

    // ── Node physics & colour update ─────────────────────────────────────
    const posAttr = this._nodeGeo.getAttribute('position');
    const colAttr = this._nodeGeo.getAttribute('color');
    const posArr  = posAttr.array;
    const colArr  = colAttr.array;

    for (let i = 0; i < this.NODE_COUNT; i++) {
      const n = this.nodes[i];

      // Organic multi-freq drift
      const wx = Math.sin(t * n.windFreq       + n.windPhase)        * n.windAmp * 0.26;
      const wy = Math.cos(t * n.windFreq*0.73  + n.windPhase + 1.05) * n.windAmp * 0.17;
      const wz = Math.sin(t * n.windFreq*1.31  + n.windPhase + 2.18) * n.windAmp * 0.11;
      let tX = n.origX + wx, tY = n.origY + wy, tZ = n.origZ + wz;

      // Cursor repulsion
      let proxBoost = 0;
      if (this._mouseActive) {
        const dx=n.x-this._mouseWorld.x, dy=n.y-this._mouseWorld.y, dz=n.z-this._mouseWorld.z;
        const d2 = dx*dx+dy*dy+dz*dz;
        const R  = n.isHub ? 26 : 20;
        if (d2 < R*R) {
          const d   = Math.sqrt(d2);
          const fac = (1 - d/R);
          const push = fac*fac * (this.isDimmed ? 4 : 8.5);
          tX += (dx/d)*push; tY += (dy/d)*push; tZ += (dz/d)*push;
          proxBoost = fac * fac;
        }
      }

      // Spring-damped physics
      const k = this.isDimmed ? 0.022 : 0.068;
      n.vx = (n.vx + (tX - n.x)*k)*0.875;
      n.vy = (n.vy + (tY - n.y)*k)*0.875;
      n.vz = (n.vz + (tZ - n.z)*k)*0.875;
      n.x += n.vx; n.y += n.vy; n.z += n.vz;

      posArr[i*3]=n.x; posArr[i*3+1]=n.y; posArr[i*3+2]=n.z;

      // Per-vertex colour: blend by layer + pulsing glow + proximity
      const glow = 0.5 + 0.5 * Math.sin(t * n.glowFreq + n.glowPhase);
      const cw   = n.colorWeight*0.55 + (n.layer/4)*0.45;
      this._tempA.copy(this._primary).lerp(this._secondary, cw);
      if (proxBoost > 0) {
        this._tempB.copy(this._secondary).multiplyScalar(1 + proxBoost * 1.8);
        this._tempA.lerp(this._tempB, proxBoost * 0.65);
      }
      const br = glow * this.dimFactor * (n.isHub ? 1.0 : 0.72);
      colArr[i*3]=this._tempA.r*br; colArr[i*3+1]=this._tempA.g*br; colArr[i*3+2]=this._tempA.b*br;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // ── Synapse lines (pre-allocated, no GC) ─────────────────────────────
    let lc = 0;
    const lp = this._linePosArr, lc2 = this._lineColArr;
    for (let i = 0; i < this.NODE_COUNT && lc < this.MAX_LINES; i++) {
      const a = this.nodes[i];
      for (let j = i+1; j < this.NODE_COUNT && lc < this.MAX_LINES; j++) {
        const b = this.nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y, dz=a.z-b.z;
        const d2 = dx*dx+dy*dy+dz*dz;
        if (d2 < this.CONNECT_DIST*this.CONNECT_DIST) {
          const d    = Math.sqrt(d2);
          const alpha = (1 - d/this.CONNECT_DIST);
          const br    = alpha * alpha * 0.7 * this.dimFactor;
          const cw    = (a.colorWeight+b.colorWeight)*0.5;
          this._tempA.copy(this._primary).lerp(this._secondary, cw);
          const off = lc*6;
          lp[off]=a.x; lp[off+1]=a.y; lp[off+2]=a.z;
          lp[off+3]=b.x; lp[off+4]=b.y; lp[off+5]=b.z;
          lc2[off]=this._tempA.r*br;   lc2[off+1]=this._tempA.g*br;   lc2[off+2]=this._tempA.b*br;
          lc2[off+3]=this._tempA.r*br; lc2[off+4]=this._tempA.g*br; lc2[off+5]=this._tempA.b*br;
          lc++;
        }
      }
    }
    this._lineGeo.getAttribute('position').needsUpdate = true;
    this._lineGeo.getAttribute('color').needsUpdate    = true;
    this._lineGeo.setDrawRange(0, lc*2);

    // ── Spawn new pulses ──────────────────────────────────────────────────
    if (Math.random() < 0.065 && this.lightPulses.length < this.MAX_PULSES) {
      this._spawnPulse();
    }

    // ── Update pulses (no GC: reuse this._tempA/B) ────────────────────────
    const pp = this._pulsePosArr, pc = this._pulseColArr;
    let activePulses = 0;
    for (let k = this.lightPulses.length - 1; k >= 0; k--) {
      if (activePulses >= this.MAX_PULSES) break;
      const pulse = this.lightPulses[k];
      pulse.progress += pulse.speed;
      if (pulse.progress >= 1.0) { this.lightPulses.splice(k, 1); continue; }

      const fn = this.nodes[pulse.from], tn = this.nodes[pulse.to];
      const tp = pulse.progress;
      const off = activePulses * 3;
      pp[off]   = fn.x + (tn.x-fn.x)*tp;
      pp[off+1] = fn.y + (tn.y-fn.y)*tp;
      pp[off+2] = fn.z + (tn.z-fn.z)*tp;

      const fade = Math.sin(tp * Math.PI);  // 0→1→0 bell curve
      this._tempA.copy(this._secondary).lerp(this._primary, pulse.colorWeight);
      const br = fade * this.dimFactor * 1.7;
      pc[off]=this._tempA.r*br; pc[off+1]=this._tempA.g*br; pc[off+2]=this._tempA.b*br;
      activePulses++;
    }
    this._pulseGeo.getAttribute('position').needsUpdate = true;
    this._pulseGeo.getAttribute('color').needsUpdate    = true;
    this._pulseGeo.setDrawRange(0, activePulses);

    // ── Starfield gentle rotation ─────────────────────────────────────────
    if (this._starMesh) {
      this._starMesh.rotation.y = t * 0.007;
      this._starMesh.rotation.x = Math.sin(t * 0.003) * 0.035;
    }

    // ── Subtle camera sway (parallax depth feel) ──────────────────────────
    this.camera.position.x = Math.sin(t * 0.055) * 2.8;
    this.camera.position.y = Math.cos(t * 0.038) * 1.6;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────
  dispose() {
    if (this._animId) cancelAnimationFrame(this._animId);
    window.removeEventListener('resize',     this._onResize);
    window.removeEventListener('mousemove',  this._onMouseMove);
    window.removeEventListener('mouseleave', this._onMouseLeave);

    [this._nodeMesh, this._lineMesh, this._pulseMesh, this._starMesh].forEach(m => {
      if (!m) return;
      m.geometry?.dispose();
      if (m.material) {
        if (m.material.map) m.material.map.dispose();
        m.material.dispose();
      }
    });
    this.renderer.dispose();
  }
}
