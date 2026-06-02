import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

// Simple LCG seeded random generator
function createSeededRandom(seedStr) {
  let hash = 0;
  const source = seedStr || 'anonymous';
  for (let i = 0; i < source.length; i++) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  }
  return function() {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

export class NetworkCanvasManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    
    // Scene Setup
    this.scene = new THREE.Scene();
    
    // Position camera slightly looking down on the bonsai tree
    this.camera = new THREE.PerspectiveCamera(40, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 10, 52);
    this.camera.lookAt(0, -2, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Settings
    this.isDimmed = false;
    this.dimFactor = 1.0; 
    
    // Physics variables
    this.mouse = new THREE.Vector2(9999, 9999);
    this.mouseTarget = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Z=0 plane
    this.mouseActive = false;

    // Branches/Segments Setup for physics (Hierarchical spring sway segments)
    this.branches = [];

    // Tree Voxel arrays
    this.groundVoxels = [];
    this.trunkVoxels = [];
    this.leafVoxels = [];

    // Meshes
    this.groundMesh = null;
    this.trunkMesh = null;
    this.leavesMesh = null;

    // Colors
    this.primaryColor = new THREE.Color('#f59e0b');
    this.secondaryColor = new THREE.Color('#ef4444');
    this.targetPrimaryColor = this.primaryColor.clone();
    this.targetSecondaryColor = this.secondaryColor.clone();
    this.themeOverridden = false;

    // Particles
    this.particles = [];
    this.particleGroup = null;

    // Pre-bind animation loops
    this.animate = this.animate.bind(this);

    // Event Bindings
    window.addEventListener('resize', this.onResize.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    // Generate initial bonsai tree
    this.generateNetwork('anonymous');
    this.animate();
  }

  setThemeColors(primaryHex, secondaryHex) {
    this.targetPrimaryColor.set(primaryHex);
    this.targetSecondaryColor.set(secondaryHex);
    this.themeOverridden = true;
  }

  generateNetwork(seedStr) {
    const random = createSeededRandom(seedStr);

    const primaryHue = random() * 360;
    const secondaryHue = (primaryHue + 120) % 360;

    if (!this.themeOverridden) {
      this.targetPrimaryColor.setHSL(primaryHue / 360, 0.9, 0.6);
      this.targetSecondaryColor.setHSL(secondaryHue / 360, 0.85, 0.5);
      
      if (this.groundVoxels.length === 0) {
        this.primaryColor.copy(this.targetPrimaryColor);
        this.secondaryColor.copy(this.targetSecondaryColor);
      }
    }

    // Clean up old meshes
    if (this.groundMesh) this.scene.remove(this.groundMesh);
    if (this.trunkMesh) this.scene.remove(this.trunkMesh);
    if (this.leavesMesh) this.scene.remove(this.leavesMesh);

    this.groundVoxels = [];
    this.trunkVoxels = [];
    this.leafVoxels = [];

    // Initialize 5 Main Physics Segments for hierarchical sways
    this.branches = [
      { id: 0, center: new THREE.Vector3(0, -18, 0), disp: new THREE.Vector3(), vx: 0, vy: 0, vz: 0, windFreq: 0, windAmp: 0, windPhase: 0 }, // Ground Base
      { id: 1, center: new THREE.Vector3(0, -10, 0), disp: new THREE.Vector3(), vx: 0, vy: 0, vz: 0, windFreq: 0.75, windAmp: 0.16, windPhase: random() * Math.PI * 2 }, // Main Trunk
      { id: 2, center: new THREE.Vector3(-3.5, -7.5, 0), disp: new THREE.Vector3(), vx: 0, vy: 0, vz: 0, windFreq: 1.05, windAmp: 0.45, windPhase: random() * Math.PI * 2 }, // Left Branch
      { id: 3, center: new THREE.Vector3(3.5, -5.5, 0), disp: new THREE.Vector3(), vx: 0, vy: 0, vz: 0, windFreq: 0.9, windAmp: 0.5, windPhase: random() * Math.PI * 2 }, // Right Branch
      { id: 4, center: new THREE.Vector3(0, -2, 0), disp: new THREE.Vector3(), vx: 0, vy: 0, vz: 0, windFreq: 1.25, windAmp: 0.6, windPhase: random() * Math.PI * 2 } // Top Foliage
    ];

    const blockSize = 0.7;

    // --- 1. Procedural Voxel Base Disk Generation ---
    const baseRadius = 8;
    for (let x = -baseRadius; x <= baseRadius; x++) {
      for (let z = -baseRadius; z <= baseRadius; z++) {
        const dSq = x*x + z*z;
        if (dSq <= baseRadius * baseRadius) {
          // Bottom Tier
          this.groundVoxels.push({
            x: x * blockSize,
            y: -19,
            z: z * blockSize
          });

          // Middle Tier
          if (dSq <= 25) {
            this.groundVoxels.push({
              x: x * blockSize,
              y: -19 + blockSize,
              z: z * blockSize
            });
          }

          // Top Tier Mound
          if (dSq <= 9) {
            this.groundVoxels.push({
              x: x * blockSize,
              y: -19 + blockSize * 2,
              z: z * blockSize
            });
          }
        }
      }
    }

    // --- 2. Procedural Voxel Trunk & Branch wood ---
    const trunkStartY = -19 + blockSize * 3; // Start on top of base mound
    const trunkEndY = -5.0;

    // Main Column
    for (let y = trunkStartY; y <= trunkEndY; y += blockSize) {
      const idx = this.trunkVoxels.length;
      const isLow = y < -12.0;

      // Base trunk flare thickness
      if (isLow) {
        this.trunkVoxels.push({ idx: idx, origX: 0, origY: y, origZ: 0, branchId: 1, branchWeight: 0.25 });
        this.trunkVoxels.push({ idx: idx + 1, origX: blockSize, origY: y, origZ: 0, branchId: 1, branchWeight: 0.25 });
        this.trunkVoxels.push({ idx: idx + 2, origX: -blockSize, origY: y, origZ: 0, branchId: 1, branchWeight: 0.25 });
        this.trunkVoxels.push({ idx: idx + 3, origX: 0, origY: y, origZ: blockSize, branchId: 1, branchWeight: 0.25 });
        this.trunkVoxels.push({ idx: idx + 4, origX: 0, origY: y, origZ: -blockSize, branchId: 1, branchWeight: 0.25 });
      } else {
        const wt = (y - trunkStartY) / (trunkEndY - trunkStartY);
        this.trunkVoxels.push({
          idx: idx,
          origX: 0,
          origY: y,
          origZ: 0,
          branchId: 1,
          branchWeight: wt * 0.8
        });
      }
    }

    // Left Branch Wood
    const leftBranchLength = 5;
    for (let step = 1; step <= leftBranchLength; step++) {
      const wt = step / leftBranchLength;
      this.trunkVoxels.push({
        idx: this.trunkVoxels.length,
        origX: -step * blockSize,
        origY: -11.0 + step * blockSize * 0.8,
        origZ: 0,
        branchId: 2,
        branchWeight: wt
      });
    }

    // Right Branch Wood
    const rightBranchLength = 5;
    for (let step = 1; step <= rightBranchLength; step++) {
      const wt = step / rightBranchLength;
      this.trunkVoxels.push({
        idx: this.trunkVoxels.length,
        origX: step * blockSize,
        origY: -9.0 + step * blockSize * 0.7,
        origZ: 0,
        branchId: 3,
        branchWeight: wt
      });
    }

    // --- 3. Procedural Spherical Leaf Canopy Clusters ---
    const foliageClusters = [
      { center: new THREE.Vector3(-leftBranchLength * blockSize, -11.0 + leftBranchLength * blockSize * 0.8, 0), branchId: 2, radius: 2.8 }, // Left
      { center: new THREE.Vector3(rightBranchLength * blockSize, -9.0 + rightBranchLength * blockSize * 0.7, 0), branchId: 3, radius: 2.8 }, // Right
      { center: new THREE.Vector3(0.5, trunkEndY + blockSize * 3, 2.2 * blockSize), branchId: 4, radius: 2.6 }, // Top Forward
      { center: new THREE.Vector3(-0.5, trunkEndY + blockSize * 3, -2.2 * blockSize), branchId: 4, radius: 2.6 }, // Top Backward
      { center: new THREE.Vector3(0, trunkEndY + blockSize * 4, 0), branchId: 4, radius: 3.2 } // Crown Center
    ];

    for (const cluster of foliageClusters) {
      const c = cluster.center;
      const r = cluster.radius;
      const gridRadius = Math.ceil(r / blockSize) + 1;

      for (let x = -gridRadius; x <= gridRadius; x++) {
        for (let y = -gridRadius; y <= gridRadius; y++) {
          for (let z = -gridRadius; z <= gridRadius; z++) {
            const vx = c.x + x * blockSize;
            const vy = c.y + y * blockSize;
            const vz = c.z + z * blockSize;

            const dx = vx - c.x;
            const dy = vy - c.y;
            const dz = vz - c.z;
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

            if (dist < r) {
              // Add leaves with an organic porosity noise filter
              if (random() > 0.16) {
                const distRatio = dist / r;
                this.leafVoxels.push({
                  origX: vx,
                  origY: vy,
                  origZ: vz,
                  branchId: cluster.branchId,
                  // Voxels further from center sway more (heavier branchWeight)
                  branchWeight: 0.5 + distRatio * 0.5,
                  // Gradient weight for colors
                  colorWeight: Math.max(0, Math.min(1, distRatio + random() * 0.2)),
                  randSeed: random()
                });
              }
            }
          }
        }
      }
    }

    // Build the geometries and instanced meshes
    const boxGeo = new THREE.BoxGeometry(blockSize * 0.95, blockSize * 0.95, blockSize * 0.95);
    
    // Materials
    this.groundMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#102219'), transparent: true, opacity: 0.85 });
    this.trunkMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('#28180c'), transparent: true, opacity: 0.85 });
    
    // Glowing additive leaves make the tree pop out!
    this.leavesMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const tempMatrix = new THREE.Matrix4();

    // 1. Ground Mesh (Immobile, build once)
    this.groundMesh = new THREE.InstancedMesh(boxGeo, this.groundMaterial, this.groundVoxels.length);
    for (let i = 0; i < this.groundVoxels.length; i++) {
      const v = this.groundVoxels[i];
      tempMatrix.makeTranslation(v.x, v.y, v.z);
      this.groundMesh.setMatrixAt(i, tempMatrix);
    }
    this.scene.add(this.groundMesh);

    // 2. Trunk Mesh
    this.trunkMesh = new THREE.InstancedMesh(boxGeo, this.trunkMaterial, this.trunkVoxels.length);
    this.scene.add(this.trunkMesh);

    // 3. Leaves Mesh
    this.leavesMesh = new THREE.InstancedMesh(boxGeo, this.leavesMaterial, this.leafVoxels.length);
    this.scene.add(this.leavesMesh);

    // Generate floating math particles
    this.createMathParticles();
  }

  createMathParticles() {
    if (this.particleGroup) {
      this.scene.remove(this.particleGroup);
      this.particleGroup.traverse(child => {
        if (child.isSprite) {
          child.material.dispose();
        }
      });
    }

    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);
    this.particles = [];

    const symbols = ['1', '0', 'λ', '∫', '√', 'π', '+', '=', '{}', '[]', 'x', 'y'];
    
    const textures = symbols.map(sym => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 64, 64);
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(sym, 32, 32);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    });

    for (let i = 0; i < 35; i++) {
      const tex = textures[Math.floor(Math.random() * textures.length)];
      const material = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const sprite = new THREE.Sprite(material);
      const startX = (Math.random() - 0.5) * 90;
      const startY = (Math.random() - 0.5) * 50;
      const startZ = (Math.random() - 0.5) * 20;
      sprite.position.set(startX, startY, startZ);
      
      const scale = 1.2 + Math.random() * 1.5;
      sprite.scale.set(scale, scale, 1);
      
      this.particleGroup.add(sprite);
      
      this.particles.push({
        sprite,
        origX: startX,
        vy: -(0.04 + Math.random() * 0.08),
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 0.8,
        wobbleAmp: 1.5 + Math.random() * 2.5,
        spinSpeed: (Math.random() - 0.5) * 0.015
      });
    }
  }

  setDimmed(dimmed) {
    this.isDimmed = dimmed;
  }

  onResize() {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.mouseActive = true;
  }

  onMouseLeave() {
    this.mouse.x = 9999;
    this.mouse.y = 9999;
    this.mouseActive = false;
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Lerp themes colors in WebGL loop
    this.primaryColor.lerp(this.targetPrimaryColor, 0.04);
    this.secondaryColor.lerp(this.targetSecondaryColor, 0.04);

    const targetDim = this.isDimmed ? 0.12 : 0.7;
    this.dimFactor += (targetDim - this.dimFactor) * 0.06;

    if (this.groundMaterial) this.groundMaterial.opacity = 0.85 * this.dimFactor;
    if (this.trunkMaterial) this.trunkMaterial.opacity = 0.85 * this.dimFactor;
    if (this.leavesMaterial) this.leavesMaterial.opacity = 0.85 * this.dimFactor;

    const time = performance.now() * 0.001;

    // Raycast pointer Z=0 intersection
    if (this.mouseActive) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersection = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this.plane, intersection)) {
        this.mouseTarget.copy(intersection);
      }
    } else {
      this.mouseTarget.set(9999, 9999, 9999);
    }

    // --- 1. Physics Calculations for the 5 Main Segments ---
    for (let b = 1; b <= 4; b++) {
      const branch = this.branches[b];

      // Wind force
      const windX = Math.sin(time * branch.windFreq + branch.windPhase) * branch.windAmp;
      const windZ = Math.cos(time * branch.windFreq * 0.85 + branch.windPhase) * branch.windAmp * 0.7;

      // Hierarchical sway offsets from trunk
      let parentDispX = 0;
      let parentDispY = 0;
      let parentDispZ = 0;
      if (b >= 2) {
        parentDispX = this.branches[1].disp.x;
        parentDispY = this.branches[1].disp.y;
        parentDispZ = this.branches[1].disp.z;
      }

      const targetX = windX + parentDispX;
      const targetY = parentDispY;
      const targetZ = windZ + parentDispZ;

      // Mouse proximity deflection
      let forceX = 0, forceY = 0, forceZ = 0;
      if (this.mouseActive) {
        const curX = branch.center.x + branch.disp.x;
        const curY = branch.center.y + branch.disp.y;
        const curZ = branch.center.z + branch.disp.z;

        const dx = curX - this.mouseTarget.x;
        const dy = curY - this.mouseTarget.y;
        const dz = curZ - this.mouseTarget.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const effectRadius = 18;

        if (dist < effectRadius && dist > 0.1) {
          const factor = (1.0 - dist / effectRadius);
          const repel = factor * factor * (this.isDimmed ? -2.2 : -5.5);
          forceX = (dx / dist) * repel;
          forceY = (dy / dist) * repel;
          forceZ = (dz / dist) * repel;
        }
      }

      const spring = this.isDimmed ? 0.04 : 0.08;
      const friction = 0.82;

      branch.vx = (branch.vx + (targetX + forceX - branch.disp.x) * spring) * friction;
      branch.vy = (branch.vy + (targetY + forceY - branch.disp.y) * spring) * friction;
      branch.vz = (branch.vz + (targetZ + forceZ - branch.disp.z) * spring) * friction;

      branch.disp.x += branch.vx;
      branch.disp.y += branch.vy;
      branch.disp.z += branch.vz;
    }

    // --- 2. Update Trunk Voxel Instance Transforms ---
    const tempMatrix = new THREE.Matrix4();
    if (this.trunkMesh) {
      for (let i = 0; i < this.trunkVoxels.length; i++) {
        const v = this.trunkVoxels[i];
        const disp = this.branches[v.branchId].disp;
        const w = v.branchWeight;
        
        const x = v.origX + disp.x * w;
        const y = v.origY + disp.y * w;
        const z = v.origZ + disp.z * w;

        tempMatrix.makeTranslation(x, y, z);
        this.trunkMesh.setMatrixAt(i, tempMatrix);
      }
      this.trunkMesh.instanceMatrix.needsUpdate = true;
    }

    // --- 3. Update Leaf Voxel Instance Transforms & Colors ---
    if (this.leavesMesh) {
      const color = new THREE.Color();
      for (let i = 0; i < this.leafVoxels.length; i++) {
        const v = this.leafVoxels[i];
        const disp = this.branches[v.branchId].disp;
        const w = v.branchWeight;

        const x = v.origX + disp.x * w;
        const y = v.origY + disp.y * w;
        const z = v.origZ + disp.z * w;

        tempMatrix.makeTranslation(x, y, z);
        this.leavesMesh.setMatrixAt(i, tempMatrix);

        // Dynamic theme-lerp leaf colors with textured HSL variation
        color.copy(this.primaryColor).lerp(this.secondaryColor, v.colorWeight);
        color.offsetHSL((v.randSeed - 0.5) * 0.08, (v.randSeed - 0.5) * 0.1, (v.randSeed - 0.5) * 0.1);
        this.leavesMesh.setColorAt(i, color);
      }
      this.leavesMesh.instanceMatrix.needsUpdate = true;
      this.leavesMesh.instanceColor.needsUpdate = true;
    }

    // --- 4. Update Floating Data Symbol Particles ---
    if (this.particles) {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.sprite.position.y += p.vy;
        p.wobblePhase += 0.01 * p.wobbleSpeed;
        p.sprite.position.x = p.origX + Math.sin(p.wobblePhase) * p.wobbleAmp;
        p.sprite.material.rotation += p.spinSpeed;
        
        const heightWeight = (p.sprite.position.y + 25) / 50;
        p.sprite.material.color.copy(this.primaryColor).lerp(this.secondaryColor, Math.max(0, Math.min(1, heightWeight)));
        p.sprite.material.opacity = (this.isDimmed ? 0.12 : 0.45) * this.dimFactor;

        if (p.sprite.position.y < -25) {
          p.sprite.position.y = 25;
          p.origX = (Math.random() - 0.5) * 90;
          p.sprite.position.x = p.origX;
        }
      }
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}
