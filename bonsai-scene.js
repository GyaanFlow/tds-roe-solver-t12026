/* ═══════════════════════════════════════════════════════════════════════════
   Voxel Bonsai Tree — Interactive 3D Scene Manager
   ═══════════════════════════════════════════════════════════════════════════
   Renders a procedural voxel bonsai tree on a floating island with:
   • InstancedMesh rendering (single draw call for 5000+ voxels)
   • Explosion/assembly animation with smooth interpolation
   • Orbit camera controls (mouse drag + wheel zoom)
   • Keyboard controls (arrows: rotate/explode)
   • Floating ambient particles
   • Cinematic lighting with soft shadows
   • Reflection plane beneath the island
   • Subtle fog and auto-rotation
   • Theme color integration
   ═══════════════════════════════════════════════════════════════════════════ */

import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { generateBonsai } from './bonsai-generator.js';
import { generateIsland } from './island-generator.js';
import { createParticleSystem } from './particle-system.js';

/* ── Seeded RNG (same as bonsai-generator) ─────────────────────────────── */
function seededRng(seedStr) {
  let h = 2166136261;
  const s = (seedStr || 'scene').toLowerCase();
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  let st = h;
  return () => { st ^= st << 13; st ^= st >>> 17; st ^= st << 5; return (st >>> 0) / 4294967296; };
}

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
    this._spherical = { theta: Math.PI * 0.25, phi: Math.PI * 0.32, radius: 38 };
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
    this._instancedMesh = null;
    this._treeGroup = new THREE.Group();
    this.scene.add(this._treeGroup);

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

  /* ════════════════════════════════════════════════════════════════════════
     Lighting Setup
     ════════════════════════════════════════════════════════════════════════ */
  _setupLighting() {
    // Warm orange ambient
    this._ambient = new THREE.AmbientLight(0xffa050, 0.45);
    this.scene.add(this._ambient);

    // Main sun (warm, casts shadows)
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

    // Cool fill light (opposite side for depth)
    const fill = new THREE.DirectionalLight(0x6080c0, 0.28);
    fill.position.set(-8, 6, -10);
    this.scene.add(fill);

    // Point light near tree crown for warmth glow
    this._crownLight = new THREE.PointLight(0xff9030, 0.55, 35, 2);
    this._crownLight.position.set(0, 10, 0);
    this.scene.add(this._crownLight);

    // Subtle hemisphere for sky/ground coloring
    const hemi = new THREE.HemisphereLight(0x3344aa, 0x443322, 0.15);
    this.scene.add(hemi);
  }

  /* ════════════════════════════════════════════════════════════════════════
     Reflection Plane
     ════════════════════════════════════════════════════════════════════════ */
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
    this._reflMesh.position.y = -12;
    this._reflMesh.receiveShadow = true;
    this.scene.add(this._reflMesh);
  }

  /* ════════════════════════════════════════════════════════════════════════
     Camera Management (Spherical Orbit)
     ════════════════════════════════════════════════════════════════════════ */
  _updateCamera() {
    const s = this._spherical;
    this.camera.position.set(
      this._target.x + s.radius * Math.sin(s.phi) * Math.cos(s.theta),
      this._target.y + s.radius * Math.cos(s.phi),
      this._target.z + s.radius * Math.sin(s.phi) * Math.sin(s.theta)
    );
    this.camera.lookAt(this._target);
  }

  /* ════════════════════════════════════════════════════════════════════════
     Scene Generation
     ════════════════════════════════════════════════════════════════════════ */
  generateScene(seed) {
    // Clear existing mesh
    if (this._instancedMesh) {
      this._treeGroup.remove(this._instancedMesh);
      this._instancedMesh.geometry.dispose();
      this._instancedMesh.material.dispose();
      this._instancedMesh = null;
    }

    // Generate voxel data
    const bonsai = generateBonsai(seed);
    const island = generateIsland(seed);
    this._voxels = [...island.voxels, ...bonsai.voxels];

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

    // Build InstancedMesh — single draw call for all voxels
    const boxGeo = new THREE.BoxGeometry(0.92, 0.92, 0.92);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.08 });
    this._instancedMesh = new THREE.InstancedMesh(boxGeo, mat, this._voxels.length);
    this._instancedMesh.castShadow = true;
    this._instancedMesh.receiveShadow = true;

    // Initial positions and colors
    this._syncVoxels();
    this._syncColors();

    this._treeGroup.add(this._instancedMesh);
    this._explosion = 0;
    this._targetExplosion = 0;
    this._needsMatrixUpdate = false;
  }

  /* ── Write voxel positions to InstancedMesh matrices ────────────────── */
  _syncVoxels() {
    const e = this._explosion;
    const dist = 35; // max explosion spread

    for (let i = 0; i < this._voxels.length; i++) {
      const v = this._voxels[i];
      this._dummy.position.set(
        v.x + v.edx * e * dist,
        v.y + v.edy * e * dist,
        v.z + v.edz * e * dist
      );
      this._dummy.rotation.set(
        e * v.edx * Math.PI * 1.5,
        e * v.edy * Math.PI * 1.5,
        e * v.edz * Math.PI * 1.5
      );
      this._dummy.scale.setScalar(1.0 - e * 0.12);
      this._dummy.updateMatrix();
      this._instancedMesh.setMatrixAt(i, this._dummy.matrix);
    }
    this._instancedMesh.instanceMatrix.needsUpdate = true;
  }

  /* ── Write voxel colors to InstancedMesh ────────────────────────────── */
  _syncColors() {
    for (let i = 0; i < this._voxels.length; i++) {
      const v = this._voxels[i];
      this._tempColor.setRGB(v.r, v.g, v.b);
      this._instancedMesh.setColorAt(i, this._tempColor);
    }
    this._instancedMesh.instanceColor.needsUpdate = true;
  }

  /* ════════════════════════════════════════════════════════════════════════
     Public API
     ════════════════════════════════════════════════════════════════════════ */
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

  /* ════════════════════════════════════════════════════════════════════════
     Input Handlers
     ════════════════════════════════════════════════════════════════════════ */
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
    this._spherical.radius = Math.max(18, Math.min(65, this._spherical.radius + e.deltaY * 0.04));
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
    // Only handle arrow keys when canvas or its container is in view
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

  /* ════════════════════════════════════════════════════════════════════════
     Animation Loop
     ════════════════════════════════════════════════════════════════════════ */
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

  /* ════════════════════════════════════════════════════════════════════════
     Cleanup
     ════════════════════════════════════════════════════════════════════════ */
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

    // InstancedMesh
    if (this._instancedMesh) {
      this._instancedMesh.geometry.dispose();
      this._instancedMesh.material.dispose();
    }

    // Reflection
    if (this._reflMesh) {
      this._reflMesh.geometry.dispose();
      this._reflMesh.material.dispose();
    }

    // Renderer
    this.renderer.dispose();
  }
}
