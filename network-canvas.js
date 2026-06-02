import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

// Simple deterministic random generator based on string seed (LCG)
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
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.z = 60;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Pre-bind animation loop to prevent allocation on every frame
    this.animate = this.animate.bind(this);

    // Settings
    this.maxLines = 400;
    this.maxPulses = 30;
    this.isDimmed = false;
    this.dimFactor = 1.0; 
    
    // Physics variables
    this.mouse = new THREE.Vector2(9999, 9999);
    this.mouseTarget = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Z=0 interaction plane
    this.mouseActive = false;

    // Node state arrays
    this.nodes = [];
    this.pointsGeometry = null;
    this.pointsMesh = null;
    
    // Pre-allocated line structures (allocation-free updates)
    this.linePositions = new Float32Array(this.maxLines * 2 * 3);
    this.linesGeometry = null;
    this.linesMesh = null;

    // Pre-allocated pulse structures (allocation-free updates)
    this.pulsePositions = new Float32Array(this.maxPulses * 3);
    this.lightPulses = [];
    this.pulseGeometry = null;
    this.pulseMesh = null;

    // Colors & Theme targets
    this.primaryColor = new THREE.Color('#f59e0b');
    this.secondaryColor = new THREE.Color('#ef4444');
    this.targetPrimaryColor = this.primaryColor.clone();
    this.targetSecondaryColor = this.secondaryColor.clone();
    this.themeOverridden = false;

    // Math symbols particle structures
    this.particles = [];
    this.particleGroup = null;

    // Event bindings
    window.addEventListener('resize', this.onResize.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    // Initial default seed
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
      
      if (this.nodes.length === 0) {
        this.primaryColor.copy(this.targetPrimaryColor);
        this.secondaryColor.copy(this.targetSecondaryColor);
      }
    }

    // Clean up old meshes
    if (this.pointsMesh) this.scene.remove(this.pointsMesh);
    if (this.linesMesh) this.scene.remove(this.linesMesh);
    if (this.pulseMesh) this.scene.remove(this.pulseMesh);

    this.nodes = [];
    this.lightPulses = [];

    // 1. Generate 3D Decision/Computation Tree Node Hierarchy
    // Root Node (Layer 0)
    const rootNode = {
      origX: 0,
      origY: -21,
      origZ: 0,
      x: 0,
      y: -21,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      parentIdx: -1,
      layer: 0,
      windPhase: random() * Math.PI * 2,
      windFreq: 0.8,
      windAmp: 0.35,
      colorWeight: 0
    };
    this.nodes.push(rootNode);

    // BFS queue for tree branching construction
    const queue = [{ idx: 0, pos: rootNode, layer: 0 }];
    const maxLayers = 4;

    while (queue.length > 0) {
      const parent = queue.shift();
      if (parent.layer >= maxLayers) continue;

      // Children branching count
      let branchCount = 3;
      if (parent.layer === 1) branchCount = random() > 0.4 ? 2 : 3;
      if (parent.layer === 2) branchCount = random() > 0.5 ? 2 : 3;
      if (parent.layer === 3) branchCount = random() > 0.3 ? 1 : 2;

      for (let b = 0; b < branchCount; b++) {
        const t = branchCount > 1 ? b / (branchCount - 1) : 0.5;
        // spread angle centered around vertical axis
        const spreadAngle = (t - 0.5) * Math.PI * 0.55 * (1.1 - parent.layer * 0.15);
        
        // Compute relative positions extending upwards
        const stepY = (11 - parent.layer * 1.5) * (0.85 + random() * 0.3);
        const childX = parent.pos.origX + Math.sin(spreadAngle) * stepY;
        const childY = parent.pos.origY + stepY * 0.95;
        const childZ = parent.pos.origZ + (random() - 0.5) * stepY * 0.4;

        const childNode = {
          origX: childX,
          origY: childY,
          origZ: childZ,
          x: childX,
          y: childY,
          z: childZ,
          vx: 0,
          vy: 0,
          vz: 0,
          parentIdx: parent.idx,
          layer: parent.layer + 1,
          windPhase: random() * Math.PI * 2,
          windFreq: 0.6 + random() * 1.0,
          windAmp: 0.45 + random() * 0.75,
          colorWeight: (parent.layer + 1) / maxLayers
        };

        const childIdx = this.nodes.length;
        this.nodes.push(childNode);
        queue.push({ idx: childIdx, pos: childNode, layer: parent.layer + 1 });
      }
    }

    const nodeCount = this.nodes.length;

    // Nodes Buffer Geometry
    this.pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      positions[i * 3] = this.nodes[i].x;
      positions[i * 3 + 1] = this.nodes[i].y;
      positions[i * 3 + 2] = this.nodes[i].z;

      const c = new THREE.Color();
      c.copy(this.primaryColor).lerp(this.secondaryColor, this.nodes[i].colorWeight);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    this.pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circle texture for soft glow nodes
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const pointTexture = new THREE.CanvasTexture(canvas);

    this.pointsMaterial = new THREE.PointsMaterial({
      size: 1.8,
      map: pointTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.pointsMesh = new THREE.Points(this.pointsGeometry, this.pointsMaterial);
    this.scene.add(this.pointsMesh);

    // Initial build of line buffers (using pre-allocated this.linePositions)
    this.linesGeometry = new THREE.BufferGeometry();
    this.linesGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
    this.linesMaterial = new THREE.LineBasicMaterial({
      color: this.primaryColor,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.linesMesh = new THREE.LineSegments(this.linesGeometry, this.linesMaterial);
    this.scene.add(this.linesMesh);

    // Dynamic action potential pulse buffers
    this.pulseGeometry = new THREE.BufferGeometry();
    this.pulseGeometry.setAttribute('position', new THREE.BufferAttribute(this.pulsePositions, 3));
    this.pulseMaterial = new THREE.PointsMaterial({
      size: 2.4,
      color: this.secondaryColor,
      map: pointTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.pulseMesh = new THREE.Points(this.pulseGeometry, this.pulseMaterial);
    this.scene.add(this.pulseMesh);

    // Pre-populate some action potential light pulses flowing up tree
    for (let k = 0; k < 6; k++) {
      this.spawnPulse(random);
    }

    // 2. Generate Floating Math Particles
    this.createMathParticles();
  }

  createMathParticles() {
    // Clean up old particle sprites
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
    
    // Render text glyphs directly onto canvas sprites
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

  spawnPulse(optRandom) {
    const random = optRandom || Math.random;
    
    // Flow pulses hierarchically from parent to child (upwards)
    const candidates = [];
    for (let i = 0; i < this.nodes.length; i++) {
      const children = [];
      for (let j = 0; j < this.nodes.length; j++) {
        if (this.nodes[j].parentIdx === i) {
          children.push(j);
        }
      }
      if (children.length > 0) {
        candidates.push({ parentIdx: i, children });
      }
    }

    if (candidates.length > 0) {
      const choice = candidates[Math.floor(random() * candidates.length)];
      const childIdx = choice.children[Math.floor(random() * choice.children.length)];
      
      this.lightPulses.push({
        from: choice.parentIdx,
        to: childIdx,
        progress: 0,
        speed: 0.008 + random() * 0.012
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

    // 1. Lerp theme primary & secondary colors smoothly
    this.primaryColor.lerp(this.targetPrimaryColor, 0.04);
    this.secondaryColor.lerp(this.targetSecondaryColor, 0.04);

    const targetDim = this.isDimmed ? 0.12 : 0.7;
    this.dimFactor += (targetDim - this.dimFactor) * 0.06;

    if (this.pointsMaterial) {
      this.pointsMaterial.opacity = 0.85 * this.dimFactor;
      this.pointsMaterial.size = (this.isDimmed ? 1.2 : 1.8);
    }
    if (this.linesMaterial) {
      this.linesMaterial.opacity = 0.28 * this.dimFactor;
    }
    if (this.pulseMaterial) {
      this.pulseMaterial.opacity = 0.95 * this.dimFactor;
    }

    const time = performance.now() * 0.001;

    // Raycast for cursor position
    if (this.mouseActive) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersection = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this.plane, intersection)) {
        this.mouseTarget.copy(intersection);
      }
    } else {
      this.mouseTarget.set(9999, 9999, 9999);
    }

    // 2. Hierarchical Physics & Wind Sway Bends
    const positionsAttr = this.pointsGeometry.getAttribute('position');
    const positions = positionsAttr.array;
    const colorsAttr = this.pointsGeometry.getAttribute('color');
    const colors = colorsAttr.array;
    const nodeCount = this.nodes.length;
    const cColor = new THREE.Color();

    for (let i = 0; i < nodeCount; i++) {
      const node = this.nodes[i];

      // Wind displacement sways get stronger with height (layer)
      const windX = Math.sin(time * node.windFreq + node.windPhase) * node.windAmp * (node.layer * 0.45);
      const windY = Math.cos(time * node.windFreq * 0.8 + node.windPhase) * node.windAmp * (node.layer * 0.15);
      const windZ = Math.sin(time * node.windFreq * 1.2 + node.windPhase) * node.windAmp * (node.layer * 0.35);

      // Parent branch displacement propagation
      let parentDisplacementX = 0;
      let parentDisplacementY = 0;
      let parentDisplacementZ = 0;

      if (node.parentIdx !== -1) {
        const parent = this.nodes[node.parentIdx];
        parentDisplacementX = parent.x - parent.origX;
        parentDisplacementY = parent.y - parent.origY;
        parentDisplacementZ = parent.z - parent.origZ;
      }

      const targetX = node.origX + parentDisplacementX + windX;
      const targetY = node.origY + parentDisplacementY + windY;
      const targetZ = node.origZ + parentDisplacementZ + windZ;

      // Mouse repulsion (pushes branches away, spring-returns later)
      let forceX = 0, forceY = 0, forceZ = 0;
      if (this.mouseActive) {
        const dx = node.x - this.mouseTarget.x;
        const dy = node.y - this.mouseTarget.y;
        const dz = node.z - this.mouseTarget.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const effectRadius = 22;

        if (dist < effectRadius && dist > 0.1) {
          const factor = (1.0 - dist / effectRadius);
          const pull = factor * factor * (this.isDimmed ? -2.0 : -6.0);
          forceX = (dx / dist) * pull;
          forceY = (dy / dist) * pull;
          forceZ = (dz / dist) * pull;
        }
      }

      const spring = this.isDimmed ? 0.04 : 0.09;
      const friction = 0.82;

      node.vx = (node.vx + (targetX + forceX - node.x) * spring) * friction;
      node.vy = (node.vy + (targetY + forceY - node.y) * spring) * friction;
      node.vz = (node.vz + (targetZ + forceZ - node.z) * spring) * friction;

      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;

      positions[i * 3] = node.x;
      positions[i * 3 + 1] = node.y;
      positions[i * 3 + 2] = node.z;

      // Update point colors to dynamically match primary -> secondary transition
      cColor.copy(this.primaryColor).lerp(this.secondaryColor, node.colorWeight);
      colors[i * 3] = cColor.r;
      colors[i * 3 + 1] = cColor.g;
      colors[i * 3 + 2] = cColor.b;
    }
    positionsAttr.needsUpdate = true;
    colorsAttr.needsUpdate = true;

    // 3. Line connections rebuild (draws branches + cross neural links)
    let lineCount = 0;
    const linesAttr = this.linesGeometry.getAttribute('position');
    const lineArray = linesAttr.array;

    for (let i = 0; i < nodeCount; i++) {
      const node = this.nodes[i];
      
      // Draw tree branch link
      if (node.parentIdx !== -1) {
        if (lineCount >= this.maxLines) break;
        const parent = this.nodes[node.parentIdx];
        const offset = lineCount * 6;
        lineArray[offset] = node.x;
        lineArray[offset + 1] = node.y;
        lineArray[offset + 2] = node.z;
        lineArray[offset + 3] = parent.x;
        lineArray[offset + 4] = parent.y;
        lineArray[offset + 5] = parent.z;
        lineCount++;
      }

      // Draw thin cross-layer neural proximity links
      for (let j = i + 1; j < nodeCount; j++) {
        if (lineCount >= this.maxLines) break;
        const other = this.nodes[j];
        if (other.parentIdx === i || node.parentIdx === j) continue;

        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dz = node.z - other.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < 11.5 && Math.abs(node.layer - other.layer) <= 1) {
          const offset = lineCount * 6;
          lineArray[offset] = node.x;
          lineArray[offset + 1] = node.y;
          lineArray[offset + 2] = node.z;
          lineArray[offset + 3] = other.x;
          lineArray[offset + 4] = other.y;
          lineArray[offset + 5] = other.z;
          lineCount++;
        }
      }
    }
    linesAttr.needsUpdate = true;
    this.linesGeometry.setDrawRange(0, lineCount * 2);

    // 4. Spawning & Updating Action Potential Pulses
    if (Math.random() < 0.08 && this.lightPulses.length < this.maxPulses) {
      this.spawnPulse();
    }

    const pulseAttr = this.pulseGeometry.getAttribute('position');
    const pulseArray = pulseAttr.array;
    let activePulseCount = 0;

    for (let k = this.lightPulses.length - 1; k >= 0; k--) {
      if (activePulseCount >= this.maxPulses) break;
      const pulse = this.lightPulses[k];
      pulse.progress += pulse.speed;
      
      if (pulse.progress >= 1.0) {
        this.lightPulses.splice(k, 1);
        continue;
      }

      const fromNode = this.nodes[pulse.from];
      const toNode = this.nodes[pulse.to];

      const offset = activePulseCount * 3;
      pulseArray[offset] = fromNode.x + (toNode.x - fromNode.x) * pulse.progress;
      pulseArray[offset + 1] = fromNode.y + (toNode.y - fromNode.y) * pulse.progress;
      pulseArray[offset + 2] = fromNode.z + (toNode.z - fromNode.z) * pulse.progress;
      activePulseCount++;
    }
    pulseAttr.needsUpdate = true;
    this.pulseGeometry.setDrawRange(0, activePulseCount);

    // 5. Update Falling Math Symbol Particles
    if (this.particles) {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.sprite.position.y += p.vy;
        p.wobblePhase += 0.01 * p.wobbleSpeed;
        p.sprite.position.x = p.origX + Math.sin(p.wobblePhase) * p.wobbleAmp;
        p.sprite.material.rotation += p.spinSpeed;
        
        // Interpolate colors based on height
        const heightWeight = (p.sprite.position.y + 25) / 50;
        p.sprite.material.color.copy(this.primaryColor).lerp(this.secondaryColor, Math.max(0, Math.min(1, heightWeight)));
        
        // Transparency matches dimming factor
        p.sprite.material.opacity = (this.isDimmed ? 0.12 : 0.45) * this.dimFactor;

        // Recycle when out of bounds
        if (p.sprite.position.y < -25) {
          p.sprite.position.y = 25;
          p.origX = (Math.random() - 0.5) * 90;
          p.sprite.position.x = p.origX;
        }
      }
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}
