import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

/* ─────────────────────────────────────────────────────────
   Ultra-Advanced Procedural 3D Bonsai Tree
   ─────────────────────────────────────────────────────────
   • Organic recursive branching (L-system inspired)
   • Tube geometry with smooth taper
   • Instanced leaf clusters with spring-wind physics
   • Sakura petal fall particle system
   • Firefly glow particle system
   • Mouse-responsive gentle camera orbit
   • Post-process bloom via additive scene overlay
   • Full theme color synchronization
   ───────────────────────────────────────────────────────── */

// ── Seeded RNG ───────────────────────────────────────────
function createSeededRandom(seedStr) {
  let hash = 0;
  const source = seedStr || 'bonsai';
  for (let i = 0; i < source.length; i++)
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  return function () {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

// ── Helper: Smooth curve from points ─────────────────────
function createBranchCurve(points) {
  const vecs = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  return new THREE.CatmullRomCurve3(vecs, false, 'catmullrom', 0.5);
}

export class NetworkCanvasManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.container = this.canvas.parentElement;

    // ── Scene & Camera ──
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      500
    );
    this.camera.position.set(0, 6, 38);
    this.camera.lookAt(0, 5, 0);
    this.cameraBasePos = this.camera.position.clone();
    this.cameraTarget = new THREE.Vector3(0, 5, 0);

    // ── Renderer ──
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // ── State ──
    this.isDimmed = false;
    this.dimFactor = 1.0;
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseSmooth = new THREE.Vector2(0, 0);
    this.growthProgress = 0; // 0→1 growth animation
    this.growthSpeed = 0.008;

    // ── Theme colors ──
    this.primaryColor = new THREE.Color('#f59e0b');
    this.secondaryColor = new THREE.Color('#ef4444');
    this.targetPrimaryColor = this.primaryColor.clone();
    this.targetSecondaryColor = this.secondaryColor.clone();
    this.themeOverridden = false;

    // ── Storage ──
    this.branchMeshes = [];
    this.branchMetas = []; // {mesh, maxGrowth, depth}
    this.leafInstances = [];
    this.leafMesh = null;
    this.petalParticles = [];
    this.petalGroup = null;
    this.fireflyParticles = [];
    this.fireflyGroup = null;
    this.groundMesh = null;
    this.treeGroup = new THREE.Group();
    this.scene.add(this.treeGroup);

    // ── Bindings ──
    this.animate = this.animate.bind(this);
    window.addEventListener('resize', this.onResize.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    // ── Build ──
    this.setupLighting();
    this.generateNetwork('anonymous');
    this.animate();
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━ LIGHTING ━━━━━━━━━━━━━━━━━━━━━━ */
  setupLighting() {
    // Warm ambient
    this.ambientLight = new THREE.AmbientLight(0x2a1a0e, 0.6);
    this.scene.add(this.ambientLight);

    // Key light (warm sun)
    this.keyLight = new THREE.DirectionalLight(0xffe4c4, 1.2);
    this.keyLight.position.set(8, 20, 12);
    this.scene.add(this.keyLight);

    // Fill light (cool)
    this.fillLight = new THREE.DirectionalLight(0x4488cc, 0.3);
    this.fillLight.position.set(-6, 8, -8);
    this.scene.add(this.fillLight);

    // Rim light (accent)
    this.rimLight = new THREE.PointLight(0xff8844, 0.8, 40);
    this.rimLight.position.set(-10, 12, -5);
    this.scene.add(this.rimLight);

    // Bottom atmosphere glow
    this.groundGlow = new THREE.PointLight(0x442200, 0.4, 25);
    this.groundGlow.position.set(0, -2, 5);
    this.scene.add(this.groundGlow);
  }

  /* ━━━━━━━━━━━━━━━━━━━━━ THEME ━━━━━━━━━━━━━━━━━━━━━━━━ */
  setThemeColors(primaryHex, secondaryHex) {
    this.targetPrimaryColor.set(primaryHex);
    this.targetSecondaryColor.set(secondaryHex);
    this.themeOverridden = true;
  }

  /* ━━━━━━━━━━━━━━━━━━ GENERATE TREE ━━━━━━━━━━━━━━━━━━━ */
  generateNetwork(seedStr) {
    const random = createSeededRandom(seedStr);

    if (!this.themeOverridden) {
      const hue = random() * 360;
      this.targetPrimaryColor.setHSL(hue / 360, 0.9, 0.6);
      this.targetSecondaryColor.setHSL(((hue + 120) % 360) / 360, 0.85, 0.5);
      if (this.branchMeshes.length === 0) {
        this.primaryColor.copy(this.targetPrimaryColor);
        this.secondaryColor.copy(this.targetSecondaryColor);
      }
    }

    // Clean up
    this.clearTree();
    this.growthProgress = 0;

    // ─── Generate branch structure (recursive L-system) ───
    const branches = [];
    const leaves = [];

    const generateBranch = (origin, dir, length, radius, depth, maxDepth) => {
      if (depth > maxDepth || radius < 0.02) return;

      const segments = 6 + Math.floor(random() * 4);
      const points = [origin.clone()];
      const current = origin.clone();
      const currentDir = dir.clone().normalize();

      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const segLen = length / segments;

        // Add organic wiggle
        const wobble = new THREE.Vector3(
          (random() - 0.5) * 0.6 * (depth * 0.3 + 0.5),
          (random() - 0.3) * 0.2,
          (random() - 0.5) * 0.6 * (depth * 0.3 + 0.5)
        );

        // Phototropism - slight upward tendency
        currentDir.y += 0.03;
        currentDir.add(wobble).normalize();

        current.addScaledVector(currentDir, segLen);
        points.push(current.clone());
      }

      const endPoint = points[points.length - 1];
      const startRadius = radius;
      const endRadius = radius * (0.55 + random() * 0.15);

      branches.push({
        points,
        startRadius,
        endRadius,
        depth,
        length
      });

      // Spawn child branches
      const childCount = depth === 0
        ? 3 + Math.floor(random() * 2)
        : depth < 3
          ? 2 + Math.floor(random() * 2)
          : Math.floor(random() * 2);

      for (let c = 0; c < childCount; c++) {
        const splitT = 0.4 + random() * 0.5;
        const splitIdx = Math.floor(splitT * (points.length - 1));
        const branchOrigin = points[Math.min(splitIdx, points.length - 1)].clone();

        // Direction divergence
        const childDir = currentDir.clone();
        const spreadAngle = 0.5 + random() * 0.8;
        const rotAxis = new THREE.Vector3(
          random() - 0.5,
          random() * 0.3,
          random() - 0.5
        ).normalize();

        childDir.applyAxisAngle(rotAxis, spreadAngle * (random() > 0.5 ? 1 : -1));
        childDir.y = Math.max(childDir.y, 0.15); // keep growing upward

        const childLength = length * (0.55 + random() * 0.2);
        const childRadius = endRadius * (0.5 + random() * 0.25);

        generateBranch(branchOrigin, childDir, childLength, childRadius, depth + 1, maxDepth);
      }

      // Add leaves at branch tips (depth >= 2)
      if (depth >= 2) {
        const leafCount = 5 + Math.floor(random() * 15);
        for (let l = 0; l < leafCount; l++) {
          const t = 0.5 + random() * 0.5;
          const pIdx = Math.floor(t * (points.length - 1));
          const base = points[Math.min(pIdx, points.length - 1)];

          const offset = new THREE.Vector3(
            (random() - 0.5) * 2.5,
            (random() - 0.3) * 1.8,
            (random() - 0.5) * 2.5
          );

          leaves.push({
            position: base.clone().add(offset),
            scale: 0.3 + random() * 0.6,
            colorWeight: random(),
            windPhase: random() * Math.PI * 2,
            windSpeed: 0.5 + random() * 1.5,
            windAmp: 0.15 + random() * 0.4,
            depth
          });
        }
      }
    };

    // Root position
    const trunkOrigin = new THREE.Vector3(0, -1, 0);
    const trunkDir = new THREE.Vector3(0, 1, 0.05);

    // Generate multiple main trunks for a bonsai-like form
    generateBranch(trunkOrigin, trunkDir, 8, 0.55, 0, 5);

    // Secondary trunk with a slight lean
    const trunk2Dir = new THREE.Vector3(-0.2, 1, -0.1);
    generateBranch(
      trunkOrigin.clone().add(new THREE.Vector3(-0.3, 0, 0.1)),
      trunk2Dir,
      6,
      0.35,
      0,
      4
    );

    // ─── Build Branch Meshes ───
    const trunkColor = new THREE.Color('#3a2514');
    const barkColor = new THREE.Color('#5a3a20');

    for (const branch of branches) {
      const curve = createBranchCurve(
        branch.points.map(p => [p.x, p.y, p.z])
      );

      // Tube with varying radius
      const tubularSegments = Math.max(6, Math.floor(branch.points.length * 2));
      const radialSegments = branch.depth < 2 ? 8 : 5;

      const geometry = new THREE.TubeGeometry(
        curve,
        tubularSegments,
        branch.startRadius,
        radialSegments,
        false
      );

      // Taper the tube manually
      const posAttr = geometry.attributes.position;
      const tubeLength = curve.getLength();

      for (let i = 0; i < posAttr.count; i++) {
        const v = new THREE.Vector3(
          posAttr.getX(i),
          posAttr.getY(i),
          posAttr.getZ(i)
        );

        // Find closest point on curve
        const closestT = curve.getUtoTmapping(0, 0);
        // Simple approximation: use Y-axis ratio for taper
        const origin = branch.points[0];
        const end = branch.points[branch.points.length - 1];
        const totalLen = origin.distanceTo(end) || 1;
        const fromOrigin = v.distanceTo(origin);
        const t = Math.min(1, fromOrigin / (totalLen * 1.5));

        const targetRadius =
          branch.startRadius * (1 - t) + branch.endRadius * t;
        const currentRadius = branch.startRadius;

        if (currentRadius > 0.001) {
          const ratio = targetRadius / currentRadius;
          // Scale radially (push toward curve center)
          const curvePoint = curve.getPointAt(Math.min(1, t));
          const diff = v.clone().sub(curvePoint);
          const newV = curvePoint.add(diff.multiplyScalar(ratio));

          posAttr.setXYZ(i, newV.x, newV.y, newV.z);
        }
      }

      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // Bark material: main trunk is darker, thinner branches lighter
      const depthRatio = branch.depth / 5;
      const matColor = trunkColor.clone().lerp(barkColor, depthRatio);

      const material = new THREE.MeshStandardMaterial({
        color: matColor,
        roughness: 0.85,
        metalness: 0.05,
        transparent: true,
        opacity: 0
      });

      const mesh = new THREE.Mesh(geometry, material);
      this.treeGroup.add(mesh);
      this.branchMeshes.push(mesh);
      this.branchMetas.push({
        mesh,
        depth: branch.depth,
        maxGrowth: 0.1 + branch.depth * 0.15
      });
    }

    // ─── Build Leaf System (InstancedMesh) ───
    const leafGeo = new THREE.IcosahedronGeometry(0.35, 0);

    // Stretch to make leaf-like shape
    const leafPositions = leafGeo.attributes.position;
    for (let i = 0; i < leafPositions.count; i++) {
      const y = leafPositions.getY(i);
      const x = leafPositions.getX(i);
      leafPositions.setX(i, x * 1.6);
      leafPositions.setY(i, y * 0.5);
    }
    leafPositions.needsUpdate = true;
    leafGeo.computeVertexNormals();

    this.leafMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0.3
    });

    this.leafMesh = new THREE.InstancedMesh(
      leafGeo,
      this.leafMaterial,
      leaves.length
    );
    this.treeGroup.add(this.leafMesh);
    this.leafInstances = leaves;

    const tempMatrix = new THREE.Matrix4();
    const tempQuat = new THREE.Quaternion();
    const tempEuler = new THREE.Euler();

    for (let i = 0; i < leaves.length; i++) {
      const l = leaves[i];
      tempEuler.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 0.5
      );
      tempQuat.setFromEuler(tempEuler);
      tempMatrix.compose(
        l.position,
        tempQuat,
        new THREE.Vector3(l.scale, l.scale, l.scale)
      );
      this.leafMesh.setMatrixAt(i, tempMatrix);
    }
    this.leafMesh.instanceMatrix.needsUpdate = true;

    // ─── Ground Platform ───
    this.createGround();

    // ─── Sakura Petals ───
    this.createPetals(random);

    // ─── Fireflies ───
    this.createFireflies(random);
  }

  clearTree() {
    // Remove old meshes
    for (const m of this.branchMeshes) {
      this.treeGroup.remove(m);
      m.geometry.dispose();
      m.material.dispose();
    }
    this.branchMeshes = [];
    this.branchMetas = [];

    if (this.leafMesh) {
      this.treeGroup.remove(this.leafMesh);
      this.leafMesh.geometry.dispose();
      this.leafMesh.material.dispose();
      this.leafMesh = null;
    }

    if (this.groundMesh) {
      this.scene.remove(this.groundMesh);
      this.groundMesh.geometry.dispose();
      this.groundMesh.material.dispose();
      this.groundMesh = null;
    }

    if (this.petalGroup) {
      this.scene.remove(this.petalGroup);
      this.petalGroup.traverse(c => {
        if (c.isMesh || c.isSprite) {
          c.geometry && c.geometry.dispose();
          c.material && c.material.dispose();
        }
      });
      this.petalGroup = null;
    }

    if (this.fireflyGroup) {
      this.scene.remove(this.fireflyGroup);
      this.fireflyGroup.traverse(c => {
        if (c.isSprite) c.material.dispose();
      });
      this.fireflyGroup = null;
    }
  }

  /* ━━━━━━━━━━━━━━━━━━ GROUND ━━━━━━━━━━━━━━━━━━━━━━━━━ */
  createGround() {
    // Organic rock/mound base
    const groundGeo = new THREE.CylinderGeometry(5, 6, 1.5, 32, 4);

    // Deform for organic rock look
    const gPos = groundGeo.attributes.position;
    for (let i = 0; i < gPos.count; i++) {
      const x = gPos.getX(i);
      const y = gPos.getY(i);
      const z = gPos.getZ(i);
      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z);

      // Noisy deformation
      const noise = Math.sin(angle * 5) * 0.3 + Math.cos(angle * 3.7) * 0.2;
      const yNoise = Math.sin(angle * 7) * 0.1;

      gPos.setX(i, x + noise * 0.3);
      gPos.setY(i, y + yNoise);
      gPos.setZ(i, z + noise * 0.2);
    }
    gPos.needsUpdate = true;
    groundGeo.computeVertexNormals();

    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1a120a'),
      roughness: 0.95,
      metalness: 0.0,
      transparent: true,
      opacity: 0
    });

    this.groundMesh = new THREE.Mesh(groundGeo, this.groundMaterial);
    this.groundMesh.position.y = -1.75;
    this.scene.add(this.groundMesh);
  }

  /* ━━━━━━━━━━━━━━━ SAKURA PETALS ━━━━━━━━━━━━━━━━━━━━━ */
  createPetals(random) {
    this.petalGroup = new THREE.Group();
    this.scene.add(this.petalGroup);
    this.petalParticles = [];

    // Create petal geometry (thin elongated disc)
    const petalGeo = new THREE.PlaneGeometry(0.18, 0.12, 1, 1);

    for (let i = 0; i < 60; i++) {
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(petalGeo, mat);

      const startX = (random() - 0.5) * 30;
      const startY = 8 + random() * 20;
      const startZ = (random() - 0.5) * 20;
      mesh.position.set(startX, startY, startZ);

      const scale = 0.8 + random() * 1.2;
      mesh.scale.set(scale, scale, scale);

      this.petalGroup.add(mesh);

      this.petalParticles.push({
        mesh,
        vy: -(0.008 + random() * 0.02),
        vx: (random() - 0.5) * 0.008,
        rotSpeed: new THREE.Vector3(
          (random() - 0.5) * 0.03,
          (random() - 0.5) * 0.04,
          (random() - 0.5) * 0.02
        ),
        wobblePhase: random() * Math.PI * 2,
        wobbleSpeed: 0.3 + random() * 0.8,
        wobbleAmp: 0.5 + random() * 1.5,
        origX: startX,
        colorWeight: random()
      });
    }
  }

  /* ━━━━━━━━━━━━━━━ FIREFLIES ━━━━━━━━━━━━━━━━━━━━━━━━ */
  createFireflies(random) {
    this.fireflyGroup = new THREE.Group();
    this.scene.add(this.fireflyGroup);
    this.fireflyParticles = [];

    // Create a soft glow texture
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const ctx = glowCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.15, 'rgba(255, 240, 200, 0.8)');
    grad.addColorStop(0.5, 'rgba(255, 200, 100, 0.3)');
    grad.addColorStop(1, 'rgba(255, 180, 60, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    glowTexture.minFilter = THREE.LinearFilter;

    for (let i = 0; i < 30; i++) {
      const mat = new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(mat);
      const px = (random() - 0.5) * 25;
      const py = 2 + random() * 16;
      const pz = (random() - 0.5) * 15;
      sprite.position.set(px, py, pz);

      const scale = 0.25 + random() * 0.5;
      sprite.scale.set(scale, scale, 1);

      this.fireflyGroup.add(sprite);

      this.fireflyParticles.push({
        sprite,
        basePos: new THREE.Vector3(px, py, pz),
        orbitRadius: 1 + random() * 4,
        orbitSpeed: 0.2 + random() * 0.5,
        orbitPhase: random() * Math.PI * 2,
        vertOscSpeed: 0.3 + random() * 0.6,
        vertOscAmp: 0.5 + random() * 2,
        pulseSpeed: 1 + random() * 3,
        pulsePhase: random() * Math.PI * 2,
        colorWeight: random()
      });
    }
  }

  /* ━━━━━━━━━━━━━━━━ DIM STATE ━━━━━━━━━━━━━━━━━━━━━━━━ */
  setDimmed(dimmed) {
    this.isDimmed = dimmed;
  }

  /* ━━━━━━━━━━━━━━━━ EVENTS ━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  onResize() {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onMouseLeave() {
    this.mouse.x = 0;
    this.mouse.y = 0;
  }

  /* ━━━━━━━━━━━━━━━━ ANIMATION LOOP ━━━━━━━━━━━━━━━━━━━ */
  animate() {
    requestAnimationFrame(this.animate);

    const time = performance.now() * 0.001;
    const dt = 1 / 60;

    // ── Theme color lerp ──
    this.primaryColor.lerp(this.targetPrimaryColor, 0.04);
    this.secondaryColor.lerp(this.targetSecondaryColor, 0.04);

    // ── Dim factor lerp ──
    const targetDim = this.isDimmed ? 0.08 : 1.0;
    this.dimFactor += (targetDim - this.dimFactor) * 0.06;

    // ── Growth animation ──
    if (this.growthProgress < 1) {
      this.growthProgress = Math.min(1, this.growthProgress + this.growthSpeed);
    }
    const growth = this.easeOutExpo(this.growthProgress);

    // ── Smooth mouse tracking ──
    this.mouseSmooth.x += (this.mouse.x - this.mouseSmooth.x) * 0.03;
    this.mouseSmooth.y += (this.mouse.y - this.mouseSmooth.y) * 0.03;

    // ── Camera orbit based on mouse ──
    const orbitX = this.mouseSmooth.x * 3;
    const orbitY = this.mouseSmooth.y * 1.5;
    const autoOrbit = Math.sin(time * 0.08) * 1.5;

    this.camera.position.x = this.cameraBasePos.x + orbitX + autoOrbit;
    this.camera.position.y = this.cameraBasePos.y + orbitY * 0.5 + Math.sin(time * 0.12) * 0.3;
    this.camera.position.z = this.cameraBasePos.z + Math.cos(time * 0.08) * 0.5;
    this.camera.lookAt(this.cameraTarget);

    // ── Update branch opacity (growth animation) ──
    for (const meta of this.branchMetas) {
      const branchGrowth = Math.max(0, Math.min(1,
        (growth - meta.maxGrowth) / (1 - meta.maxGrowth + 0.01)
      ));
      meta.mesh.material.opacity = branchGrowth * this.dimFactor;
    }

    // ── Update ground ──
    if (this.groundMesh) {
      this.groundMaterial.opacity = growth * 0.85 * this.dimFactor;
    }

    // ── Wind sway for tree group ──
    const windX = Math.sin(time * 0.4) * 0.15 + Math.sin(time * 1.1) * 0.05;
    const windZ = Math.cos(time * 0.35) * 0.08;
    this.treeGroup.rotation.z = windX * 0.02;
    this.treeGroup.rotation.x = windZ * 0.01;

    // ── Update leaves ──
    this.updateLeaves(time, growth);

    // ── Update petals ──
    this.updatePetals(time, growth);

    // ── Update fireflies ──
    this.updateFireflies(time, growth);

    // ── Update lighting colors ──
    this.updateLighting();

    // ── Render ──
    this.renderer.render(this.scene, this.camera);
  }

  /* ─── Leaves update ─── */
  updateLeaves(time, growth) {
    if (!this.leafMesh || this.leafInstances.length === 0) return;

    const leafGrowth = Math.max(0, (growth - 0.3) / 0.7);
    this.leafMaterial.opacity = leafGrowth * 0.9 * this.dimFactor;

    // Dynamic emissive from theme
    this.leafMaterial.emissive.copy(this.primaryColor).multiplyScalar(0.15);

    const tempMatrix = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempQuat = new THREE.Quaternion();
    const tempScale = new THREE.Vector3();
    const tempEuler = new THREE.Euler();
    const color = new THREE.Color();

    for (let i = 0; i < this.leafInstances.length; i++) {
      const l = this.leafInstances[i];

      // Wind displacement
      const windOffX = Math.sin(time * l.windSpeed + l.windPhase) * l.windAmp;
      const windOffY = Math.cos(time * l.windSpeed * 0.7 + l.windPhase) * l.windAmp * 0.3;
      const windOffZ = Math.sin(time * l.windSpeed * 0.5 + l.windPhase + 1) * l.windAmp * 0.6;

      tempPos.set(
        l.position.x + windOffX,
        l.position.y + windOffY,
        l.position.z + windOffZ
      );

      // Animated rotation
      tempEuler.set(
        Math.sin(time * 0.5 + l.windPhase) * 0.3,
        time * 0.2 + l.windPhase,
        Math.cos(time * 0.3 + l.windPhase) * 0.2
      );
      tempQuat.setFromEuler(tempEuler);

      const s = l.scale * leafGrowth;
      tempScale.set(s, s, s);

      tempMatrix.compose(tempPos, tempQuat, tempScale);
      this.leafMesh.setMatrixAt(i, tempMatrix);

      // Theme-synced leaf color
      color.copy(this.primaryColor).lerp(this.secondaryColor, l.colorWeight);
      color.offsetHSL(0, 0, (l.colorWeight - 0.5) * 0.15);
      this.leafMesh.setColorAt(i, color);
    }

    this.leafMesh.instanceMatrix.needsUpdate = true;
    if (this.leafMesh.instanceColor) {
      this.leafMesh.instanceColor.needsUpdate = true;
    }
  }

  /* ─── Petals update ─── */
  updatePetals(time, growth) {
    if (!this.petalParticles.length) return;

    const petalOpacity = Math.max(0, (growth - 0.5) / 0.5);

    for (const p of this.petalParticles) {
      p.mesh.position.y += p.vy;
      p.wobblePhase += 0.01 * p.wobbleSpeed;
      p.mesh.position.x = p.origX + Math.sin(p.wobblePhase) * p.wobbleAmp;
      p.mesh.position.z += Math.cos(p.wobblePhase * 0.7) * 0.003;

      // Tumble rotation
      p.mesh.rotation.x += p.rotSpeed.x;
      p.mesh.rotation.y += p.rotSpeed.y;
      p.mesh.rotation.z += p.rotSpeed.z;

      // Color
      const color = new THREE.Color();
      color.copy(this.primaryColor).lerp(this.secondaryColor, p.colorWeight);
      color.offsetHSL(0, -0.1, 0.15); // Lighter/softer petals
      p.mesh.material.color = color;
      p.mesh.material.opacity = petalOpacity * 0.35 * this.dimFactor;

      // Reset when fallen
      if (p.mesh.position.y < -5) {
        p.mesh.position.y = 15 + Math.random() * 10;
        p.origX = (Math.random() - 0.5) * 30;
        p.mesh.position.x = p.origX;
        p.mesh.position.z = (Math.random() - 0.5) * 20;
      }
    }
  }

  /* ─── Fireflies update ─── */
  updateFireflies(time, growth) {
    if (!this.fireflyParticles.length) return;

    const ffOpacity = Math.max(0, (growth - 0.4) / 0.6);

    for (const f of this.fireflyParticles) {
      // Orbit motion
      const ox = Math.sin(time * f.orbitSpeed + f.orbitPhase) * f.orbitRadius;
      const oy = Math.sin(time * f.vertOscSpeed + f.orbitPhase) * f.vertOscAmp;
      const oz = Math.cos(time * f.orbitSpeed * 0.8 + f.orbitPhase) * f.orbitRadius * 0.7;

      f.sprite.position.set(
        f.basePos.x + ox,
        f.basePos.y + oy,
        f.basePos.z + oz
      );

      // Pulse glow
      const pulse = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * f.pulseSpeed + f.pulsePhase));
      f.sprite.material.opacity = pulse * ffOpacity * 0.5 * this.dimFactor;

      // Color
      const color = new THREE.Color();
      color.copy(this.primaryColor).lerp(this.secondaryColor, f.colorWeight);
      color.offsetHSL(0, -0.2, 0.25); // Warm glow
      f.sprite.material.color = color;
    }
  }

  /* ─── Lighting update ─── */
  updateLighting() {
    // Sync rim light to theme
    const rimColor = this.primaryColor.clone();
    rimColor.offsetHSL(0.05, 0, -0.1);
    this.rimLight.color.lerp(rimColor, 0.02);

    // Adjust exposure for dimmed state
    const targetExposure = this.isDimmed ? 0.4 : 1.2;
    this.renderer.toneMappingExposure +=
      (targetExposure - this.renderer.toneMappingExposure) * 0.04;
  }

  /* ─── Easing ─── */
  easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
}
