import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';

/* ─────────────────────────────────────────────────────────
   Premium 3D Dynamic Math Wave Grid & Quantum Nebula
   ─────────────────────────────────────────────────────────
   • 60x60 grid of soft-glowing particles forming a wave landscape.
   • Sharing position buffers between Points and LineSegments for 60fps.
   • Spring-damped cursor repulsion deforming the grid into ripples.
   • Upward-drifting, self-recycling mathematical glyph sprites.
   • Smooth 1.2s HSL color transitions on theme selector updates.
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
    this.camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
    this.camera.position.set(0, 45, 90);
    this.camera.lookAt(0, -6, 0);
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

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 300;
    this.controls.target.set(0, -6, 0);

    // Dimmed state flag
    this.isDimmed = false;
    this.dimFactor = 1.0;

    // Standard Theme Colors setup
    this.primaryColor = new THREE.Color('#10b981');
    this.secondaryColor = new THREE.Color('#3b82f6');
    this.targetPrimaryColor = new THREE.Color('#10b981');
    this.targetSecondaryColor = new THREE.Color('#3b82f6');

    // Create lighting
    this._setupLights();

    // Create 3D grid
    this._setupGrid();

    // Create floating symbols
    this._setupParticles();

    // Raycast setup
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(9999, 9999);
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 14); // Grid baseline plane at Y = -14

    // Event listeners
    this.animate = this.animate.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    window.addEventListener('resize', this._onResize);
    this.container.addEventListener('mousemove', this._onMouseMove);
    this.container.addEventListener('mouseleave', this._onMouseLeave);

    this.lastTime = performance.now();
    this.animate();
  }

  /* ━━━━━━━━━━━━━━━━━ LIGHTS SETUP ━━━━━━━━━━━━━━━━━━━━━━━━━ */
  _setupLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.mainLight.position.set(20, 60, 20);
    this.scene.add(this.mainLight);
  }

  /* ━━━━━━━━━━━━━━━━━ RESIZE / ALIGNMENT ━━━━━━━━━━━━━━━━━━ */
  setViewOffset() {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    // Keep camera shifted horizontally to balance workspace layout
    const offsetX = -w * 0.15;
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

  /* ━━━━━━━━━━━━━━━━━ GRID SETUP ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  _setupGrid() {
    const sizeX = 60;
    const sizeZ = 60;
    const spacing = 1.6;
    const nodeCount = sizeX * sizeZ;

    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    this.gridNodes = [];

    let idx = 0;
    for (let x = 0; x < sizeX; x++) {
      for (let z = 0; z < sizeZ; z++) {
        const posX = (x - sizeX / 2) * spacing;
        const posZ = (z - sizeZ / 2) * spacing;
        const posY = -14;

        positions[idx * 3] = posX;
        positions[idx * 3 + 1] = posY;
        positions[idx * 3 + 2] = posZ;

        // Color weight based on distance from center (creates a radial color shift)
        const distFromCenter = Math.sqrt(posX * posX + posZ * posZ);
        const colorWeight = Math.min(1.0, distFromCenter / 50.0);

        colors[idx * 3] = 1;
        colors[idx * 3 + 1] = 1;
        colors[idx * 3 + 2] = 1;

        this.gridNodes.push({
          origX: posX,
          origZ: posZ,
          x: posX,
          z: posZ,
          y: posY,
          vy: 0,
          colorWeight
        });
        idx++;
      }
    }

    // Grid connections indices (LineSegments)
    const indices = [];
    for (let x = 0; x < sizeX; x++) {
      for (let z = 0; z < sizeZ; z++) {
        const currentIdx = x * sizeZ + z;
        // Right link
        if (x < sizeX - 1) {
          const rightIdx = (x + 1) * sizeZ + z;
          indices.push(currentIdx, rightIdx);
        }
        // Down link
        if (z < sizeZ - 1) {
          const downIdx = x * sizeZ + (z + 1);
          indices.push(currentIdx, downIdx);
        }
      }
    }

    // Shared Buffer Geometry attributes for rendering points + lines
    this.pointsGeometry = new THREE.BufferGeometry();
    this.pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.linesGeometry = new THREE.BufferGeometry();
    this.linesGeometry.setAttribute('position', this.pointsGeometry.getAttribute('position'));
    this.linesGeometry.setAttribute('color', this.pointsGeometry.getAttribute('color'));
    this.linesGeometry.setIndex(indices);

    // Glowing circular particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(240, 245, 255, 0.8)');
    grad.addColorStop(0.5, 'rgba(200, 220, 255, 0.25)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 32, 32);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    // Grid Points Material
    this.pointsMaterial = new THREE.PointsMaterial({
      size: 1.8,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pointsMesh = new THREE.Points(this.pointsGeometry, this.pointsMaterial);
    this.scene.add(this.pointsMesh);

    // Grid Lines Material
    this.linesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.linesMesh = new THREE.LineSegments(this.linesGeometry, this.linesMaterial);
    this.scene.add(this.linesMesh);
  }

  /* ━━━━━━━━━━━━━━━━━ FLOATING MATH NEBULA ━━━━━━━━━━━━━━━━━━ */
  _setupParticles() {
    const chars = ['∫', 'λ', 'π', 'θ', '∑', '√', 'f(x)', 'dy/dx', '0', '1', 'log', 'lim', '∞'];
    this.particles = [];

    // Pre-render textures for math symbols
    const textures = chars.map(char => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, 32, 32);
      return new THREE.CanvasTexture(canvas);
    });

    // Spawn floating characters
    for (let i = 0; i < 35; i++) {
      const tex = textures[Math.floor(Math.random() * textures.length)];
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });

      const sprite = new THREE.Sprite(mat);
      const scale = 2.0 + Math.random() * 2.5;
      sprite.scale.set(scale, scale, 1);

      // Distribute in a box volume above the wave valley
      sprite.position.set(
        (Math.random() - 0.5) * 90,
        -12 + Math.random() * 45,
        (Math.random() - 0.5) * 70
      );

      this.scene.add(sprite);

      this.particles.push({
        sprite,
        mat,
        vy: 0.03 + Math.random() * 0.05,
        wobblePhase: Math.random() * 100,
        wobbleSpeed: 0.6 + Math.random() * 1.2,
        wobbleAmp: 0.2 + Math.random() * 0.4,
        spinSpeed: (Math.random() - 0.5) * 0.015,
        origX: sprite.position.x
      });
    }
  }

  /* ━━━━━━━━━━━━━━━━━ THEME / EXPOSURE SYNC ━━━━━━━━━━━━━━━ */
  setThemeColors(primary, secondary) {
    if (primary) this.targetPrimaryColor.set(primary);
    if (secondary) this.targetSecondaryColor.set(secondary);
  }

  setDimmed(dimmed) {
    this.isDimmed = dimmed;
  }

  generateNetwork(seed) {
    // Stub to align with App workspace reset flow
  }

  /* ━━━━━━━━━━━━━━━━━ MOUSE / POINTER LISTENERS ━━━━━━━━━━━ */
  _onMouseMove(e) {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
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

    // Lerp active theme colors smoothly
    this.primaryColor.lerp(this.targetPrimaryColor, 0.04);
    this.secondaryColor.lerp(this.targetSecondaryColor, 0.04);

    // Exposure adjustments based on focus mode / workspace layout
    const targetExposure = this.isDimmed ? 0.45 : 1.15;
    this.renderer.toneMappingExposure += (targetExposure - this.renderer.toneMappingExposure) * 0.05;

    const dimFactor = this.isDimmed ? 0.35 : 1.0;
    this.dimFactor += (dimFactor - this.dimFactor) * 0.05;

    // Apply color changes to grid line material
    if (this.linesMaterial) {
      this.linesMaterial.color.copy(this.primaryColor);
      this.linesMaterial.opacity = 0.16 * this.dimFactor;
    }
    if (this.pointsMaterial) {
      this.pointsMaterial.opacity = 0.85 * this.dimFactor;
      this.pointsMaterial.size = (this.isDimmed ? 1.3 : 1.8);
    }

    // Raycast projection for mouse interactive dip/repulsion
    let mouseActive = false;
    const intersectPoint = new THREE.Vector3();
    if (this.mouse.x !== 9999) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      if (this.raycaster.ray.intersectPlane(this.plane, intersectPoint)) {
        mouseActive = true;
      }
    }

    // Update Wave Heights and Colors
    const positionsAttr = this.pointsGeometry.getAttribute('position');
    const positions = positionsAttr.array;
    const colorsAttr = this.pointsGeometry.getAttribute('color');
    const colors = colorsAttr.array;
    const nodeCount = this.gridNodes.length;

    const time = now * 0.001;
    const tempColor = new THREE.Color();

    for (let i = 0; i < nodeCount; i++) {
      const node = this.gridNodes[i];

      // Multi-layered sine wave calculation representing math landscape
      const wave1 = Math.sin(time * 1.3 + node.origX * 0.12) * 3.2;
      const wave2 = Math.cos(time * 0.9 + node.origZ * 0.12) * 3.2;
      const wave3 = Math.sin(time * 0.5 + (node.origX + node.origZ) * 0.06) * 1.5;
      const baseWaveY = wave1 + wave2 + wave3;

      // Pointer repulsion (circular dip deformation)
      let dent = 0;
      if (mouseActive) {
        const dx = node.x - intersectPoint.x;
        const dz = node.z - intersectPoint.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const radius = 22;

        if (dist < radius) {
          const factor = 1.0 - dist / radius;
          dent = -11.0 * factor * factor; // Pushes points down, creating a beautiful spring valley
        }
      }

      const targetY = -14 + baseWaveY + dent;
      
      // Spring damping physics
      const springK = this.isDimmed ? 0.05 : 0.09;
      const friction = 0.83;
      node.vy = (node.vy + (targetY - node.y) * springK) * friction;
      node.y += node.vy;

      // Write updated Y position
      positions[i * 3 + 1] = node.y;

      // Interpolate vertex colors based on height and radial weight
      const heightFactor = Math.max(0.0, Math.min(1.0, (node.y + 20) / 12));
      const blendWeight = (node.colorWeight * 0.4) + (heightFactor * 0.6);
      
      tempColor.copy(this.primaryColor).lerp(this.secondaryColor, blendWeight);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    positionsAttr.needsUpdate = true;
    colorsAttr.needsUpdate = true;

    // Update Floating Mathematical Characters
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.sprite.position.y += p.vy;
      p.wobblePhase += dt * p.wobbleSpeed;
      p.sprite.position.x = p.origX + Math.sin(p.wobblePhase) * p.wobbleAmp;
      p.sprite.material.rotation += p.spinSpeed;

      // Vertical coloring interpolation
      const relativeHeight = (p.sprite.position.y + 14) / 50;
      p.sprite.material.color.copy(this.primaryColor).lerp(this.secondaryColor, Math.max(0.0, Math.min(1.0, relativeHeight)));

      // Transparency fades out near top limits and matches dimmer opacity factor
      let alpha = 0.45;
      if (p.sprite.position.y > 20) {
        alpha *= (1.0 - (p.sprite.position.y - 20) / 15);
      } else if (p.sprite.position.y < -10) {
        alpha *= ((p.sprite.position.y + 14) / 4);
      }
      p.sprite.material.opacity = Math.max(0.0, alpha) * this.dimFactor;

      // Recycle math sprite to bottom of valley when out of bounds
      if (p.sprite.position.y > 35) {
        p.sprite.position.y = -14;
        p.origX = (Math.random() - 0.5) * 90;
        p.sprite.position.x = p.origX;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  /* ━━━━━━━━━━━━━━━━━ CLEANUP / DISPOSE ━━━━━━━━━━━━━━━━━━ */
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('resize', this._onResize);
    if (this.container) {
      this.container.removeEventListener('mousemove', this._onMouseMove);
      this.container.removeEventListener('mouseleave', this._onMouseLeave);
    }

    if (this.controls) this.controls.dispose();

    // Recursive dispose helper to free memory on context switch
    this._disposeObject(this.scene);
    this.renderer.dispose();
  }

  _disposeObject(obj) {
    if (!obj) return;
    obj.children.forEach(child => this._disposeObject(child));

    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(mat => this._disposeMaterial(mat));
      } else {
        this._disposeMaterial(obj.material);
      }
    }
  }

  _disposeMaterial(mat) {
    if (!mat) return;
    mat.dispose();
    for (const key in mat) {
      if (mat[key] && typeof mat[key].dispose === 'function') {
        mat[key].dispose();
      }
    }
  }
}
