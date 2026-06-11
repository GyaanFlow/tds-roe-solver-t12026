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
    this._instancedMeshes = [];
    this._geometries = {}; // Cache geometries
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

    this._instancedMeshes.forEach(group => {
      const mesh = group.mesh;
      const list = group.voxels;

      for (let i = 0; i < list.length; i++) {
        const v = list[i];
        this._dummy.position.set(
          v.x + v.edx * e * dist,
          v.y + v.edy * e * dist,
          v.z + v.edz * e * dist
        );
        this._dummy.rotation.set(
          (v.rx || 0) + e * v.edx * Math.PI * 1.5,
          e * v.edy * Math.PI * 1.5,
          (v.rz || 0) + e * v.edz * Math.PI * 1.5
        );
        this._dummy.scale.setScalar(1.0 - e * 0.12);
        this._dummy.updateMatrix();
        mesh.setMatrixAt(i, this._dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  }

  _syncColors() {
    this._instancedMeshes.forEach(group => {
      const mesh = group.mesh;
      const list = group.voxels;

      for (let i = 0; i < list.length; i++) {
        const v = list[i];
        this._tempColor.setRGB(v.r, v.g, v.b);
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
