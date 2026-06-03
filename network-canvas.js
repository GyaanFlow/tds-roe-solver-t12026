import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

/* ─────────────────────────────────────────────────────────────────────────────
   Premium 3D Neural Network Constellation
   ─────────────────────────────────────────────────────────────────────────────
   • Full-viewport fixed canvas — covers everything including behind the sidebar.
   • Deterministic seed-based layout (LCG seeded RNG from user's email).
   • 180 neurons distributed in deep 3D space, colour-weighted by layer.
   • Up to 1 200 synapse lines; opacity fades with distance for depth-cue.
   • Glowing action-potential pulses travel along synapses with a comet trail.
   • Background star-field layer for additional depth.
   • Spring-damped cursor proximity: nodes gently bloom & repel near the cursor.
   • Smooth HSL theme interpolation — silky transition across all four themes.
   ───────────────────────────────────────────────────────────────────────────── */

// ── Deterministic LCG random generator seeded from a string ──────────────────
function createSeededRandom(seedStr) {
  let hash = 2166136261; // FNV offset basis
  const src = (seedStr || 'anonymous').toLowerCase();
  for (let i = 0; i < src.length; i++) {
    hash ^= src.charCodeAt(i);
    hash = (Math.imul(hash, 16777619)) >>> 0;
  }
  let state = hash;
  return function () {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296);
  };
}

// ── Build a soft radial-glow canvas texture ───────────────────────────────────
function buildGlowTexture(size, innerStop, outerStop) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const half = size / 2;
  const g = ctx.createRadialGradient(half, half, 0, half, half, half);
  g.addColorStop(0,          `rgba(255,255,255,${innerStop})`);
  g.addColorStop(0.25,       `rgba(255,255,255,${innerStop * 0.7})`);
  g.addColorStop(0.55,       `rgba(200,220,255,${innerStop * 0.25})`);
  g.addColorStop(1,          `rgba(255,255,255,${outerStop})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

export class NetworkCanvasManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    // The canvas is fixed/full-viewport — use the window itself as the size reference
    this._w = () => window.innerWidth;
    this._h = () => window.innerHeight;

    // ── Scene ────────────────────────────────────────────────────────────────
    this.scene = new THREE.Scene();

    // ── Camera ───────────────────────────────────────────────────────────────
    this.camera = new THREE.PerspectiveCamera(55, this._w() / this._h(), 0.5, 1000);
    this.camera.position.set(0, 0, 72);

    // ── Renderer ─────────────────────────────────────────────────────────────
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this._w(), this._h());
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Configuration ─────────────────────────────────────────────────────────
    this.NODE_COUNT    = 180;   // total neurons
    this.HUB_COUNT     = 22;    // larger hub neurons
    this.MAX_LINES     = 1200;  // pre-allocated synapse segments
    this.MAX_PULSES    = 40;    // concurrent signal pulses
    this.STAR_COUNT    = 280;   // background star field
    this.CONNECT_DIST  = 18;    // max synapse distance

    // ── State ─────────────────────────────────────────────────────────────────
    this.isDimmed   = false;
    this.dimFactor  = 1.0;
    this.nodes      = [];
    this.lightPulses = [];
    this.seed       = 'anonymous';

    // ── Theme colors (lerped every frame) ────────────────────────────────────
    this.primaryColor        = new THREE.Color('#f59e0b');
    this.secondaryColor      = new THREE.Color('#ef4444');
    this.targetPrimaryColor  = new THREE.Color('#f59e0b');
    this.targetSecondaryColor= new THREE.Color('#ef4444');

    // ── Pre-allocated geometry buffers (no GC pressure) ──────────────────────
    this.linePositions  = new Float32Array(this.MAX_LINES * 2 * 3);
    this.lineColors     = new Float32Array(this.MAX_LINES * 2 * 3);
    this.pulsePositions = new Float32Array(this.MAX_PULSES * 3);
    this.pulseColors    = new Float32Array(this.MAX_PULSES * 3);

    // ── Interaction ──────────────────────────────────────────────────────────
    this.mouse       = new THREE.Vector2(9999, 9999);
    this.mouseTarget = new THREE.Vector3(9999, 9999, 9999);
    this.raycaster   = new THREE.Raycaster();
    this.plane       = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.mouseActive = false;

    // ── Pre-bind ─────────────────────────────────────────────────────────────
    this.animate      = this.animate.bind(this);
    this._onResize    = this._onResize.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave= this._onMouseLeave.bind(this);

    window.addEventListener('resize',      this._onResize);
    window.addEventListener('mousemove',   this._onMouseMove);
    window.addEventListener('mouseleave',  this._onMouseLeave);

    // ── Build scene ───────────────────────────────────────────────────────────
    this._buildStarField();
    this._buildNetworkGeometry();
    this.generateNetwork('anonymous');
    this.animationId = requestAnimationFrame(this.animate);
  }

  // ── STAR FIELD ──────────────────────────────────────────────────────────────
  _buildStarField() {
    const starPositions = new Float32Array(this.STAR_COUNT * 3);
    const starColors    = new Float32Array(this.STAR_COUNT * 3);
    const rng = createSeededRandom('starfield');
    for (let i = 0; i < this.STAR_COUNT; i++) {
      starPositions[i * 3]     = (rng() - 0.5) * 280;
      starPositions[i * 3 + 1] = (rng() - 0.5) * 180;
      starPositions[i * 3 + 2] = -40 - rng() * 80;
      const bright = 0.3 + rng() * 0.5;
      starColors[i * 3]     = bright;
      starColors[i * 3 + 1] = bright;
      starColors[i * 3 + 2] = bright + 0.15;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(starColors, 3));
    const starTex = buildGlowTexture(8, 0.9, 0);
    const mat = new THREE.PointsMaterial({
      size: 0.45,
      map: starTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.starField = new THREE.Points(geo, mat);
    this.scene.add(this.starField);
  }

  // ── NETWORK GEOMETRY (one-time buffer setup) ─────────────────────────────
  _buildNetworkGeometry() {
    // Node Points
    this.pointsGeometry = new THREE.BufferGeometry();
    const nodePosArr  = new Float32Array(this.NODE_COUNT * 3);
    const nodeColArr  = new Float32Array(this.NODE_COUNT * 3);
    const nodeSzArr   = new Float32Array(this.NODE_COUNT);
    this.pointsGeometry.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
    this.pointsGeometry.setAttribute('color',    new THREE.BufferAttribute(nodeColArr, 3));
    this.pointsGeometry.setAttribute('size',     new THREE.BufferAttribute(nodeSzArr,  1));

    const nodeTex = buildGlowTexture(64, 1.0, 0);
    this.pointsMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: nodeTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    this.pointsMesh = new THREE.Points(this.pointsGeometry, this.pointsMaterial);
    this.scene.add(this.pointsMesh);

    // Synapse Lines
    this.linesGeometry = new THREE.BufferGeometry();
    this.linesGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
    this.linesGeometry.setAttribute('color',    new THREE.BufferAttribute(this.lineColors, 3));
    this.linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.linesMesh = new THREE.LineSegments(this.linesGeometry, this.linesMaterial);
    this.scene.add(this.linesMesh);

    // Action Potential Pulses
    this.pulseGeometry = new THREE.BufferGeometry();
    this.pulseGeometry.setAttribute('position', new THREE.BufferAttribute(this.pulsePositions, 3));
    this.pulseGeometry.setAttribute('color',    new THREE.BufferAttribute(this.pulseColors, 3));
    const pulseTex = buildGlowTexture(32, 1.0, 0);
    this.pulseMaterial = new THREE.PointsMaterial({
      size: 3.8,
      map: pulseTex,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    this.pulseMesh = new THREE.Points(this.pulseGeometry, this.pulseMaterial);
    this.scene.add(this.pulseMesh);
  }

  // ── GENERATE NETWORK from seed ────────────────────────────────────────────
  generateNetwork(seedStr) {
    this.seed = seedStr || 'anonymous';
    const rng = createSeededRandom(this.seed);

    this.nodes = [];
    this.lightPulses = [];

    // Distribute neurons in a wide 3D volume to fill the viewport
    const rangeX = 95, rangeY = 58, rangeZ = 45;

    for (let i = 0; i < this.NODE_COUNT; i++) {
      const isHub = i < this.HUB_COUNT;

      // Spread nodes in layers (simulates a multi-layer network structure)
      const layer    = Math.floor((i / this.NODE_COUNT) * 5);
      const layerBias= (layer / 4 - 0.5) * rangeX * 0.8;
      const x = layerBias + (rng() - 0.5) * rangeX * 0.55;
      const y = (rng() - 0.5) * rangeY;
      const z = (rng() - 0.5) * rangeZ;

      this.nodes.push({
        origX: x, origY: y, origZ: z,
        x, y, z,
        vx: 0, vy: 0, vz: 0,
        layer,
        isHub,
        size: isHub ? (2.8 + rng() * 1.4) : (1.0 + rng() * 1.1),
        colorWeight: rng(),
        windPhase:  rng() * Math.PI * 2,
        windFreq:   0.25 + rng() * 0.6,
        windAmp:    isHub ? (0.4 + rng() * 0.5) : (0.7 + rng() * 1.1),
        glowPhase:  rng() * Math.PI * 2,
        glowFreq:   0.5 + rng() * 1.2
      });
    }

    // Pre-populate pulses
    for (let k = 0; k < 12; k++) this._spawnPulse(rng);

    // Sync positions buffer
    const posAttr = this.pointsGeometry.getAttribute('position');
    const posArr  = posAttr.array;
    for (let i = 0; i < this.NODE_COUNT; i++) {
      posArr[i * 3]     = this.nodes[i].x;
      posArr[i * 3 + 1] = this.nodes[i].y;
      posArr[i * 3 + 2] = this.nodes[i].z;
    }
    posAttr.needsUpdate = true;
  }

  // ── SPAWN a new signal pulse ──────────────────────────────────────────────
  _spawnPulse(optRng) {
    const rng = optRng || Math.random;
    const fromIdx = Math.floor(rng() * this.NODE_COUNT);
    const fromNode = this.nodes[fromIdx];
    if (!fromNode) return;

    const candidates = [];
    for (let i = 0; i < this.NODE_COUNT; i++) {
      if (i === fromIdx) continue;
      const n = this.nodes[i];
      const dx = fromNode.x - n.x;
      const dy = fromNode.y - n.y;
      const dz = fromNode.z - n.z;
      if (Math.sqrt(dx*dx + dy*dy + dz*dz) < this.CONNECT_DIST) {
        candidates.push(i);
      }
    }

    if (candidates.length > 0) {
      const toIdx = candidates[Math.floor(rng() * candidates.length)];
      this.lightPulses.push({
        from:     fromIdx,
        to:       toIdx,
        progress: 0,
        speed:    0.008 + (typeof rng === 'function' ? rng() : Math.random()) * 0.014,
        colorWeight: typeof rng === 'function' ? rng() : Math.random()
      });
    }
  }

  // ── THEME ─────────────────────────────────────────────────────────────────
  setThemeColors(primary, secondary) {
    if (primary)   this.targetPrimaryColor.set(primary);
    if (secondary) this.targetSecondaryColor.set(secondary);
  }

  setDimmed(dimmed) { this.isDimmed = dimmed; }

  // ── RESIZE ────────────────────────────────────────────────────────────────
  _onResize() {
    const w = this._w(), h = this._h();
    this.camera.aspect = w / h;
    // Keep the entire network in view as window size changes
    this.camera.position.z = Math.max(62, 95 / Math.max(w / h, 0.6));
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // ── MOUSE ─────────────────────────────────────────────────────────────────
  _onMouseMove(e) {
    this.mouse.x =  (e.clientX / this._w()) * 2 - 1;
    this.mouse.y = -(e.clientY / this._h()) * 2 + 1;
    this.mouseActive = true;
  }

  _onMouseLeave() {
    this.mouseActive = false;
    this.mouseTarget.set(9999, 9999, 9999);
  }

  // ── ANIMATION LOOP ────────────────────────────────────────────────────────
  animate() {
    this.animationId = requestAnimationFrame(this.animate);
    const time = performance.now() * 0.001;

    // ── Smooth theme color lerp ────────────────────────────────────────────
    this.primaryColor.lerp(this.targetPrimaryColor,   0.035);
    this.secondaryColor.lerp(this.targetSecondaryColor, 0.035);

    // ── Dimming lerp ──────────────────────────────────────────────────────
    const targetDim = this.isDimmed ? 0.1 : 1.0;
    this.dimFactor += (targetDim - this.dimFactor) * 0.06;

    // ── Exposure ──────────────────────────────────────────────────────────
    this.renderer.toneMappingExposure += ((this.isDimmed ? 0.5 : 1.2) - this.renderer.toneMappingExposure) * 0.05;

    // ── Cursor raycast ────────────────────────────────────────────────────
    if (this.mouseActive) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hit = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this.plane, hit)) {
        this.mouseTarget.copy(hit);
      }
    }

    // ── Node physics + position buffer update ────────────────────────────
    const posAttr = this.pointsGeometry.getAttribute('position');
    const colAttr = this.pointsGeometry.getAttribute('color');
    const posArr  = posAttr.array;
    const colArr  = colAttr.array;
    const tempCol = new THREE.Color();
    const tempCol2 = new THREE.Color();

    for (let i = 0; i < this.NODE_COUNT; i++) {
      const node = this.nodes[i];

      // Organic drift (multi-freq sinusoidal)
      const wx = Math.sin(time * node.windFreq       + node.windPhase)       * node.windAmp * 0.28;
      const wy = Math.cos(time * node.windFreq * 0.7 + node.windPhase + 1.1) * node.windAmp * 0.18;
      const wz = Math.sin(time * node.windFreq * 1.3 + node.windPhase + 2.2) * node.windAmp * 0.12;

      let tX = node.origX + wx;
      let tY = node.origY + wy;
      let tZ = node.origZ + wz;

      // Cursor proximity repulsion
      if (this.mouseActive) {
        const dx = node.x - this.mouseTarget.x;
        const dy = node.y - this.mouseTarget.y;
        const dz = node.z - this.mouseTarget.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const R = node.isHub ? 24 : 18;

        if (dist < R && dist > 0.1) {
          const f = (1 - dist / R);
          const push = f * f * (this.isDimmed ? 3.5 : 7.5);
          tX += (dx / dist) * push;
          tY += (dy / dist) * push;
          tZ += (dz / dist) * push;
        }
      }

      // Spring-damped physics
      const spring   = this.isDimmed ? 0.025 : 0.07;
      const friction  = 0.87;
      node.vx = (node.vx + (tX - node.x) * spring) * friction;
      node.vy = (node.vy + (tY - node.y) * spring) * friction;
      node.vz = (node.vz + (tZ - node.z) * spring) * friction;
      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;

      posArr[i * 3]     = node.x;
      posArr[i * 3 + 1] = node.y;
      posArr[i * 3 + 2] = node.z;

      // Per-vertex colour: blend primary→secondary by layer + pulsing glow
      const glow = 0.55 + 0.45 * Math.sin(time * node.glowFreq + node.glowPhase);
      const cw   = node.colorWeight * 0.6 + (node.layer / 4) * 0.4;

      // Proximity color boost
      let proximityBoost = 0;
      if (this.mouseActive) {
        const dx = node.x - this.mouseTarget.x;
        const dy = node.y - this.mouseTarget.y;
        const dz = node.z - this.mouseTarget.z;
        const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d < 22) proximityBoost = Math.pow(1 - d / 22, 2);
      }

      tempCol.copy(this.primaryColor).lerp(this.secondaryColor, cw);
      if (proximityBoost > 0) {
        tempCol2.copy(this.secondaryColor).multiplyScalar(1 + proximityBoost * 1.5);
        tempCol.lerp(tempCol2, proximityBoost * 0.7);
      }
      const brightness = glow * this.dimFactor * (node.isHub ? 1.0 : 0.75);
      colArr[i * 3]     = tempCol.r * brightness;
      colArr[i * 3 + 1] = tempCol.g * brightness;
      colArr[i * 3 + 2] = tempCol.b * brightness;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // ── Synapse lines ─────────────────────────────────────────────────────
    let lineCount = 0;
    const lPosArr = this.linePositions;
    const lColArr = this.lineColors;

    for (let i = 0; i < this.NODE_COUNT && lineCount < this.MAX_LINES; i++) {
      const nA = this.nodes[i];
      for (let j = i + 1; j < this.NODE_COUNT && lineCount < this.MAX_LINES; j++) {
        const nB = this.nodes[j];
        const dx = nA.x - nB.x;
        const dy = nA.y - nB.y;
        const dz = nA.z - nB.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < this.CONNECT_DIST) {
          const alpha  = (1 - dist / this.CONNECT_DIST);
          const cw     = (nA.colorWeight + nB.colorWeight) * 0.5;
          const col    = new THREE.Color().copy(this.primaryColor).lerp(this.secondaryColor, cw);
          const bright = alpha * alpha * 0.75 * this.dimFactor;
          const off    = lineCount * 6;

          lPosArr[off]     = nA.x; lPosArr[off + 1] = nA.y; lPosArr[off + 2] = nA.z;
          lPosArr[off + 3] = nB.x; lPosArr[off + 4] = nB.y; lPosArr[off + 5] = nB.z;
          lColArr[off]     = col.r * bright; lColArr[off + 1] = col.g * bright; lColArr[off + 2] = col.b * bright;
          lColArr[off + 3] = col.r * bright; lColArr[off + 4] = col.g * bright; lColArr[off + 5] = col.b * bright;
          lineCount++;
        }
      }
    }
    const lPosAttr = this.linesGeometry.getAttribute('position');
    const lColAttr = this.linesGeometry.getAttribute('color');
    lPosAttr.needsUpdate = true;
    lColAttr.needsUpdate = true;
    this.linesGeometry.setDrawRange(0, lineCount * 2);

    // ── Spawn new pulses stochastically ──────────────────────────────────
    if (Math.random() < 0.06 && this.lightPulses.length < this.MAX_PULSES) {
      this._spawnPulse();
    }

    // ── Update pulse positions ────────────────────────────────────────────
    const pPosArr = this.pulsePositions;
    const pColArr = this.pulseColors;
    let activePulseCount = 0;

    for (let k = this.lightPulses.length - 1; k >= 0; k--) {
      if (activePulseCount >= this.MAX_PULSES) break;
      const pulse = this.lightPulses[k];
      pulse.progress += pulse.speed;

      if (pulse.progress >= 1.0) {
        this.lightPulses.splice(k, 1);
        continue;
      }

      const fN = this.nodes[pulse.from];
      const tN = this.nodes[pulse.to];
      const t  = pulse.progress;

      const off = activePulseCount * 3;
      pPosArr[off]     = fN.x + (tN.x - fN.x) * t;
      pPosArr[off + 1] = fN.y + (tN.y - fN.y) * t;
      pPosArr[off + 2] = fN.z + (tN.z - fN.z) * t;

      // Pulse colour: lerp from secondary to primary mid-flight
      const fade = Math.sin(t * Math.PI); // peaks at t=0.5
      const pc   = new THREE.Color().copy(this.secondaryColor).lerp(this.primaryColor, pulse.colorWeight);
      const pb   = fade * this.dimFactor;
      pColArr[off]     = pc.r * pb * 1.6;
      pColArr[off + 1] = pc.g * pb * 1.6;
      pColArr[off + 2] = pc.b * pb * 1.6;
      activePulseCount++;
    }

    const pPosAttr = this.pulseGeometry.getAttribute('position');
    const pColAttr = this.pulseGeometry.getAttribute('color');
    pPosAttr.needsUpdate = true;
    pColAttr.needsUpdate = true;
    this.pulseGeometry.setDrawRange(0, activePulseCount);

    // ── Slow starfield rotation ───────────────────────────────────────────
    if (this.starField) {
      this.starField.rotation.y = time * 0.008;
      this.starField.rotation.x = Math.sin(time * 0.004) * 0.04;
    }

    // ── Gentle camera sway ────────────────────────────────────────────────
    this.camera.position.x = Math.sin(time * 0.06) * 2.5;
    this.camera.position.y = Math.cos(time * 0.04) * 1.5;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  // ── DISPOSE ──────────────────────────────────────────────────────────────
  dispose() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize',     this._onResize);
    window.removeEventListener('mousemove',  this._onMouseMove);
    window.removeEventListener('mouseleave', this._onMouseLeave);
    [this.pointsMesh, this.linesMesh, this.pulseMesh, this.starField].forEach(m => {
      if (m) {
        m.geometry?.dispose();
        if (m.material) {
          if (m.material.map) m.material.map.dispose();
          m.material.dispose();
        }
      }
    });
    this.renderer.dispose();
  }
}
