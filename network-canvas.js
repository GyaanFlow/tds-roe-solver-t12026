import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

/* ═══════════════════════════════════════════════════════════════════════════
   Premium Layered Neural Network — Deep Feed-Forward Architecture
   ═══════════════════════════════════════════════════════════════════════════
   Visual design goals:
   • Looks like a REAL neural network diagram, not a spider web
   • Clear vertical neuron columns — 7 layers across the viewport
   • Connections ONLY between adjacent layers (feed-forward, not all-pairs)
   • Max 3 connections per neuron so lines stay sparse and purposeful
   • Large glowing neuron nodes with pulsing halos
   • Signal pulses travel left→right through the layers
   • Deep star field behind for depth
   • Subtle camera parallax on mouse move
   ═══════════════════════════════════════════════════════════════════════════ */

// Seeded LCG (FNV-1a hash)
function seededRng(seedStr) {
  let h = 2166136261;
  const s = (seedStr || 'anon').toLowerCase();
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  let st = h;
  return () => { st ^= st << 13; st ^= st >>> 17; st ^= st << 5; return (st >>> 0) / 4294967296; };
}

// Soft radial glow texture
function glowTex(size, falloff = 0.5) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const h = size / 2;
  const g = ctx.createRadialGradient(h, h, 0, h, h, h);
  g.addColorStop(0,       'rgba(255,255,255,1.0)');
  g.addColorStop(falloff, 'rgba(255,255,255,0.6)');
  g.addColorStop(0.75,    'rgba(200,210,255,0.12)');
  g.addColorStop(1,       'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

export class NetworkCanvasManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    this._W = W; this._H = H;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, W() / H(), 1, 2000);
    this.camera.position.set(0, 0, 90);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas, antialias: true, alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(W(), H());
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Network architecture: 7 layers, each with N neurons ──────────────
    this.LAYER_SIZES    = [4, 7, 10, 12, 10, 7, 4]; // neurons per layer
    this.MAX_CONNS_PER  = 3;     // max forward connections per neuron
    this.MAX_PULSES     = 60;    // concurrent signal pulses
    this.STAR_COUNT     = 350;

    // State
    this.isDimmed    = false;
    this.dimFactor   = 1.0;
    this.neurons     = [];   // { x, y, z, layer, idx, origY, phase, glowFreq, size, isHub }
    this.connections = [];   // { from, to } (neuron indices)
    this.pulses      = [];   // active signal pulses

    // Pre-allocated scratch colors (zero GC in render loop)
    this._colA = new THREE.Color();
    this._colB = new THREE.Color();

    // Theme colors (lerped)
    this._primary    = new THREE.Color('#f59e0b');
    this._secondary  = new THREE.Color('#ef4444');
    this._tPrimary   = new THREE.Color('#f59e0b');
    this._tSecondary = new THREE.Color('#ef4444');

    // Mouse parallax
    this._mouseNDC    = new THREE.Vector2(0, 0);
    this._camTarget   = new THREE.Vector2(0, 0);
    this._mouseActive = false;

    // Build everything
    this._buildStars();
    this._buildNeuronMesh();
    this._buildLineMesh();
    this._buildPulseMesh();

    // Bind
    this.animate        = this.animate.bind(this);
    this._onResize      = this._onResize.bind(this);
    this._onMouseMove   = this._onMouseMove.bind(this);
    this._onMouseLeave  = this._onMouseLeave.bind(this);
    window.addEventListener('resize',    this._onResize,    { passive: true });
    window.addEventListener('mousemove', this._onMouseMove, { passive: true });
    window.addEventListener('mouseleave',this._onMouseLeave,{ passive: true });

    this.generateNetwork('anonymous');
    this._animId = requestAnimationFrame(this.animate);
  }

  // ── Star field ────────────────────────────────────────────────────────────
  _buildStars() {
    const pos = new Float32Array(this.STAR_COUNT * 3);
    const col = new Float32Array(this.STAR_COUNT * 3);
    const rng = seededRng('stars-dnn');
    for (let i = 0; i < this.STAR_COUNT; i++) {
      pos[i*3]   = (rng()-0.5) * 380;
      pos[i*3+1] = (rng()-0.5) * 220;
      pos[i*3+2] = -70 - rng() * 110;
      const b = 0.2 + rng() * 0.45;
      col[i*3]=b; col[i*3+1]=b; col[i*3+2]=b + 0.2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    this._starMesh = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.35, map: glowTex(8, 0.3), vertexColors: true,
      transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    this.scene.add(this._starMesh);
  }

  // ── Neuron point cloud ────────────────────────────────────────────────────
  _buildNeuronMesh() {
    const totalNeurons = this.LAYER_SIZES.reduce((a, b) => a + b, 0);
    const pos = new Float32Array(totalNeurons * 3);
    const col = new Float32Array(totalNeurons * 3);
    const sizeArr = new Float32Array(totalNeurons);

    this._neurGeo = new THREE.BufferGeometry();
    this._neurGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this._neurGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    this._neurGeo.setAttribute('size',     new THREE.BufferAttribute(sizeArr, 1));

    this._neurMat = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: glowTex(64, 0.3) }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this._neurMesh = new THREE.Points(this._neurGeo, this._neurMat);
    this.scene.add(this._neurMesh);
  }

  // ── Synapse line mesh (pre-sized for max expected connections) ─────────────
  _buildLineMesh() {
    // Max connections: sum(layer_sizes[i] * MAX_CONNS_PER) for i in 0..5
    const maxConns = this.LAYER_SIZES.slice(0, -1).reduce((a, b) => a + b, 0) * this.MAX_CONNS_PER;
    this._maxLines = maxConns;
    const pos = new Float32Array(maxConns * 2 * 3);
    const col = new Float32Array(maxConns * 2 * 3);
    this._lineGeo = new THREE.BufferGeometry();
    this._lineGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this._lineGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    this._lineMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    this._lineMesh = new THREE.LineSegments(this._lineGeo, this._lineMat);
    this.scene.add(this._lineMesh);
  }

  // ── Signal pulse mesh ─────────────────────────────────────────────────────
  _buildPulseMesh() {
    const pos = new Float32Array(this.MAX_PULSES * 3);
    const col = new Float32Array(this.MAX_PULSES * 3);
    this._pulseGeo = new THREE.BufferGeometry();
    this._pulseGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this._pulseGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    this._pulseMat = new THREE.PointsMaterial({
      size: 5.5, map: glowTex(32, 0.25), vertexColors: true,
      transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending,
      depthWrite: false, sizeAttenuation: true
    });
    this._pulseMesh = new THREE.Points(this._pulseGeo, this._pulseMat);
    this.scene.add(this._pulseMesh);
  }

  // ── Calculate network layout spans based on aspect ratio ─────────────────
  _getSpans() {
    const aspect = this.camera.aspect;
    // Camera is at Z = 90. Height at Z = 0:
    const visibleHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * 90;
    const visibleWidth = visibleHeight * aspect;

    // Mobile (portrait): scale narrower to fit beautifully without cutting.
    const paddingX = aspect < 1.0 ? 0.88 : 0.82;
    const paddingY = aspect < 1.0 ? 0.65 : 0.72;

    return {
      xSpan: visibleWidth * paddingX,
      ySpan: visibleHeight * paddingY
    };
  }

  // ── Build layered neural network ──────────────────────────────────────────
  generateNetwork(seedStr) {
    const rng = seededRng(seedStr || 'anonymous');
    this.neurons     = [];
    this.connections = [];
    this.pulses      = [];

    const totalLayers = this.LAYER_SIZES.length;
    const { xSpan, ySpan } = this._getSpans();

    let neuronIdx = 0;
    const layerStartIdx = []; // neuronIdx where each layer begins

    for (let l = 0; l < totalLayers; l++) {
      layerStartIdx.push(neuronIdx);
      const count = this.LAYER_SIZES[l];
      
      // Normalized X coordinate from -0.5 to +0.5
      const nx = (totalLayers > 1) ? (l / (totalLayers - 1) - 0.5) : 0;
      const x = nx * xSpan;
      const isHub = (l === 0 || l === totalLayers - 1);

      for (let n = 0; n < count; n++) {
        // Normalized Y coordinate from -0.5 to +0.5
        const ny = (count > 1) ? ((n / (count - 1)) - 0.5) : 0;
        
        // Add tiny normalized jitter to keep it organic
        const nyJitter = (rng() - 0.5) * 0.03;
        const finalNy = ny + nyJitter;
        const y = finalNy * ySpan;
        const z = (rng() - 0.5) * 8;

        const baseSize = isHub ? 5.5 + rng() * 1.5 : 3.5 + rng() * 1.5;

        this.neurons.push({
          nx,
          ny: finalNy,
          x, y, z,
          origY: y,
          layer: l, layerN: n,
          baseSize,
          glowPhase: rng() * Math.PI * 2,
          glowFreq:  0.4 + rng() * 1.0,
          colorW:    l / (totalLayers - 1),  // 0=primary, 1=secondary
          isHub,
        });
        neuronIdx++;
      }
    }

    // Build connections: each neuron in layer l connects to up to MAX_CONNS_PER
    // neurons in layer l+1, choosing the closest ones vertically
    for (let l = 0; l < totalLayers - 1; l++) {
      const fromStart = layerStartIdx[l];
      const fromEnd   = layerStartIdx[l] + this.LAYER_SIZES[l];
      const toStart   = layerStartIdx[l + 1];
      const toEnd     = layerStartIdx[l + 1] + this.LAYER_SIZES[l + 1];

      for (let fi = fromStart; fi < fromEnd; fi++) {
        const from = this.neurons[fi];
        const targets = [];
        for (let ti = toStart; ti < toEnd; ti++) {
          const to  = this.neurons[ti];
          const dy  = Math.abs(from.ny - to.ny);
          targets.push({ idx: ti, dy });
        }
        targets.sort((a, b) => a.dy - b.dy);
        const picks = targets.slice(0, this.MAX_CONNS_PER);
        for (const p of picks) {
          this.connections.push({ from: fi, to: p.idx });
        }
      }
    }

    // Pre-fill line buffer with connection geometry (static topology)
    this._updateLineBuffer();

    // Seed initial pulses
    for (let k = 0; k < 18; k++) this._spawnPulse(rng);

    // Write initial neuron positions and sizes to GPU
    this._syncNeuronPositions();
  }

  // ── Sync neuron positions and base sizes to GPU buffer ────────────────────
  _syncNeuronPositions() {
    const posArr = this._neurGeo.getAttribute('position').array;
    const sizeArr = this._neurGeo.getAttribute('size').array;
    for (let i = 0; i < this.neurons.length; i++) {
      const n = this.neurons[i];
      posArr[i*3]=n.x; posArr[i*3+1]=n.y; posArr[i*3+2]=n.z;
      sizeArr[i] = n.baseSize;
    }
    this._neurGeo.getAttribute('position').needsUpdate = true;
    this._neurGeo.getAttribute('size').needsUpdate     = true;
  }

  // ── Write all connections to the static line buffer ───────────────────────
  _updateLineBuffer() {
    const posArr = this._lineGeo.getAttribute('position').array;
    const colArr = this._lineGeo.getAttribute('color').array;

    for (let ci = 0; ci < this.connections.length; ci++) {
      const { from, to } = this.connections[ci];
      const fn = this.neurons[from], tn = this.neurons[to];
      const off = ci * 6;
      posArr[off]  =fn.x; posArr[off+1]=fn.y; posArr[off+2]=fn.z;
      posArr[off+3]=tn.x; posArr[off+4]=tn.y; posArr[off+5]=tn.z;
      // Color: dim, blended between primary and secondary by layer
      const cw = (fn.colorW + tn.colorW) * 0.5;
      this._colA.copy(this._primary).lerp(this._secondary, cw);
      const br = 0.18; // intentionally dim — nodes should pop, not lines
      colArr[off]  =this._colA.r*br; colArr[off+1]=this._colA.g*br; colArr[off+2]=this._colA.b*br;
      colArr[off+3]=this._colA.r*br; colArr[off+4]=this._colA.g*br; colArr[off+5]=this._colA.b*br;
    }
    this._lineGeo.getAttribute('position').needsUpdate = true;
    this._lineGeo.getAttribute('color').needsUpdate    = true;
    this._lineGeo.setDrawRange(0, this.connections.length * 2);
  }

  // ── Spawn signal pulse on random connection ───────────────────────────────
  _spawnPulse(optRng) {
    const rng = optRng || Math.random;
    if (this.connections.length === 0) return;
    const ci = Math.floor((typeof rng === 'function' ? rng() : Math.random()) * this.connections.length);
    const conn = this.connections[ci];
    this.pulses.push({
      connIdx: ci,
      from: conn.from, to: conn.to,
      progress: 0,
      speed: 0.006 + (typeof rng === 'function' ? rng() : Math.random()) * 0.012,
      cw: (typeof rng === 'function' ? rng() : Math.random()),
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  setThemeColors(primary, secondary) {
    if (primary)   this._tPrimary.set(primary);
    if (secondary) this._tSecondary.set(secondary);
  }
  setDimmed(v) { this.isDimmed = v; }

  // ── Resize ────────────────────────────────────────────────────────────────
  _onResize() {
    const w = this._W(), h = this._H();
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Re-span current neurons dynamically to fit the new viewport
    const { xSpan, ySpan } = this._getSpans();
    for (let i = 0; i < this.neurons.length; i++) {
      const n = this.neurons[i];
      n.x = n.nx * xSpan;
      n.origY = n.ny * ySpan;
      n.y = n.origY;
    }

    // Refresh buffers
    this._updateLineBuffer();
    this._syncNeuronPositions();
  }

  // ── Mouse ─────────────────────────────────────────────────────────────────
  _onMouseMove(e) {
    this._mouseNDC.set(
      (e.clientX / this._W()) * 2 - 1,
     -(e.clientY / this._H()) * 2 + 1
    );
    this._mouseActive = true;
  }
  _onMouseLeave() { this._mouseActive = false; }

  // ── Main loop ─────────────────────────────────────────────────────────────
  animate() {
    this._animId = requestAnimationFrame(this.animate);
    const t = performance.now() * 0.001;

    // Theme color lerp
    this._primary.lerp(this._tPrimary,   0.03);
    this._secondary.lerp(this._tSecondary, 0.03);

    // Dim lerp
    const tDim = this.isDimmed ? 0.06 : 1.0;
    this.dimFactor += (tDim - this.dimFactor) * 0.05;
    const tExp = this.isDimmed ? 0.5 : 1.3;
    this.renderer.toneMappingExposure += (tExp - this.renderer.toneMappingExposure) * 0.04;

    // Mouse parallax camera drift
    if (this._mouseActive) {
      this._camTarget.set(this._mouseNDC.x * 5, this._mouseNDC.y * 3);
    } else {
      this._camTarget.set(Math.sin(t * 0.05) * 3, Math.cos(t * 0.035) * 1.8);
    }
    this.camera.position.x += (this._camTarget.x - this.camera.position.x) * 0.04;
    this.camera.position.y += (this._camTarget.y - this.camera.position.y) * 0.04;
    this.camera.lookAt(0, 0, 0);

    // Neuron colour & subtle float animation
    const posArr = this._neurGeo.getAttribute('position').array;
    const colArr = this._neurGeo.getAttribute('color').array;
    const sizeArr = this._neurGeo.getAttribute('size').array;

    for (let i = 0; i < this.neurons.length; i++) {
      const n = this.neurons[i];

      // Gentle vertical float
      const floatY = Math.sin(t * n.glowFreq + n.glowPhase) * 0.55;
      n.y = n.origY + floatY;
      posArr[i*3+1] = n.y;

      // Pulsing glow brightness
      const glow = 0.55 + 0.45 * Math.sin(t * n.glowFreq + n.glowPhase);
      const br   = glow * this.dimFactor * (n.isHub ? 1.0 : 0.82);

      // Color: blend primary→secondary by layer position
      this._colA.copy(this._primary).lerp(this._secondary, n.colorW);
      colArr[i*3]  = this._colA.r * br;
      colArr[i*3+1]= this._colA.g * br;
      colArr[i*3+2]= this._colA.b * br;

      // Size pulse: make it pulsate slightly with the glow
      sizeArr[i] = n.baseSize * (0.88 + 0.22 * Math.sin(t * n.glowFreq + n.glowPhase)) * this.dimFactor;
    }
    this._neurGeo.getAttribute('position').needsUpdate = true;
    this._neurGeo.getAttribute('color').needsUpdate    = true;
    this._neurGeo.getAttribute('size').needsUpdate     = true;

    // Update synapse lines (positions change with float, so update each frame)
    const lPosArr = this._lineGeo.getAttribute('position').array;
    const lColArr = this._lineGeo.getAttribute('color').array;

    for (let ci = 0; ci < this.connections.length; ci++) {
      const { from, to } = this.connections[ci];
      const fn = this.neurons[from], tn = this.neurons[to];
      const off = ci * 6;
      // Update y positions (x,z are static)
      lPosArr[off+1] = fn.y;
      lPosArr[off+4] = tn.y;

      // Subtle line brightening when either endpoint is glowing bright
      const fnGlow = 0.45 + 0.55 * Math.sin(t * fn.glowFreq + fn.glowPhase);
      const tnGlow = 0.45 + 0.55 * Math.sin(t * tn.glowFreq + tn.glowPhase);
      const lineBr = ((fnGlow + tnGlow) * 0.5) * 0.22 * this.dimFactor;
      const cw = (fn.colorW + tn.colorW) * 0.5;
      this._colA.copy(this._primary).lerp(this._secondary, cw);
      lColArr[off]  =this._colA.r*lineBr; lColArr[off+1]=this._colA.g*lineBr; lColArr[off+2]=this._colA.b*lineBr;
      lColArr[off+3]=this._colA.r*lineBr; lColArr[off+4]=this._colA.g*lineBr; lColArr[off+5]=this._colA.b*lineBr;
    }
    this._lineGeo.getAttribute('position').needsUpdate = true;
    this._lineGeo.getAttribute('color').needsUpdate    = true;

    // Spawn new pulses
    if (Math.random() < 0.07 && this.pulses.length < this.MAX_PULSES) {
      this._spawnPulse();
    }

    // Update pulses
    const pPosArr = this._pulseGeo.getAttribute('position').array;
    const pColArr = this._pulseGeo.getAttribute('color').array;
    let activePulses = 0;

    for (let k = this.pulses.length - 1; k >= 0; k--) {
      if (activePulses >= this.MAX_PULSES) break;
      const p = this.pulses[k];
      p.progress += p.speed;
      if (p.progress >= 1.0) {
        // When a pulse reaches the end, spawn a new one from the destination
        const destLayer = this.neurons[p.to].layer;
        if (destLayer < this.LAYER_SIZES.length - 1) {
          // Find a connection from this destination neuron
          const nextConns = this.connections.filter(c => c.from === p.to);
          if (nextConns.length > 0) {
            const nc = nextConns[Math.floor(Math.random() * nextConns.length)];
            this.pulses.push({
              connIdx: this.connections.indexOf(nc),
              from: nc.from, to: nc.to,
              progress: 0,
              speed: p.speed * (0.9 + Math.random() * 0.2),
              cw: p.cw,
            });
          }
        }
        this.pulses.splice(k, 1);
        continue;
      }

      const fn = this.neurons[p.from], tn = this.neurons[p.to];
      const tp = p.progress;
      const off = activePulses * 3;
      pPosArr[off]   = fn.x + (tn.x - fn.x) * tp;
      pPosArr[off+1] = fn.y + (tn.y - fn.y) * tp;
      pPosArr[off+2] = fn.z + (tn.z - fn.z) * tp;

      const fade = Math.sin(tp * Math.PI);
      this._colA.copy(this._secondary).lerp(this._primary, p.cw);
      const br = fade * 2.2 * this.dimFactor;
      pColArr[off]  =this._colA.r*br; pColArr[off+1]=this._colA.g*br; pColArr[off+2]=this._colA.b*br;
      activePulses++;
    }
    this._pulseGeo.getAttribute('position').needsUpdate = true;
    this._pulseGeo.getAttribute('color').needsUpdate    = true;
    this._pulseGeo.setDrawRange(0, activePulses);

    // Slow star rotation
    if (this._starMesh) {
      this._starMesh.rotation.y = t * 0.006;
      this._starMesh.rotation.x = Math.sin(t * 0.0025) * 0.04;
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this._animId) cancelAnimationFrame(this._animId);
    window.removeEventListener('resize',     this._onResize);
    window.removeEventListener('mousemove',  this._onMouseMove);
    window.removeEventListener('mouseleave', this._onMouseLeave);
    [this._neurMesh, this._lineMesh, this._pulseMesh, this._starMesh].forEach(m => {
      if (!m) return;
      m.geometry?.dispose();
      if (m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); }
    });
    this.renderer.dispose();
  }
}
