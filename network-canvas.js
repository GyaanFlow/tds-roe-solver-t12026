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
    this.nodeCount = 100;
    this.connectionDist = 14;
    this.maxLines = 600;
    this.maxPulses = 25;
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

    // Colors
    this.primaryColor = new THREE.Color('#f59e0b');
    this.secondaryColor = new THREE.Color('#ef4444');

    // Event bindings
    window.addEventListener('resize', this.onResize.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    // Initial default seed
    this.generateNetwork('anonymous');
    this.animate();
  }

  generateNetwork(seedStr) {
    const random = createSeededRandom(seedStr);

    const primaryHue = random() * 360;
    const secondaryHue = (primaryHue + 120) % 360;

    this.primaryColor.setHSL(primaryHue / 360, 0.9, 0.6);
    this.secondaryColor.setHSL(secondaryHue / 360, 0.85, 0.5);

    // Clean up old meshes
    if (this.pointsMesh) this.scene.remove(this.pointsMesh);
    if (this.linesMesh) this.scene.remove(this.linesMesh);
    if (this.pulseMesh) this.scene.remove(this.pulseMesh);

    this.nodes = [];
    this.lightPulses = [];

    const width = 80;
    const height = 45;
    const depth = 30;

    // Generate Nodes
    for (let i = 0; i < this.nodeCount; i++) {
      const x = (random() - 0.5) * width;
      const y = (random() - 0.5) * height;
      const z = (random() - 0.5) * depth;

      this.nodes.push({
        origX: x,
        origY: y,
        origZ: z,
        x: x,
        y: y,
        z: z,
        vx: 0,
        vy: 0,
        vz: 0,
        offsetX: 0,
        offsetY: 0,
        offsetZ: 0,
        windPhase: random() * Math.PI * 2,
        windFreq: 0.5 + random() * 1.5,
        windAmp: 0.8 + random() * 1.2,
        colorWeight: random()
      });
    }

    // Nodes Buffer Geometry
    this.pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.nodeCount * 3);
    const colors = new Float32Array(this.nodeCount * 3);

    for (let i = 0; i < this.nodeCount; i++) {
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
      size: 1.6,
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
      size: 2.2,
      color: this.secondaryColor,
      map: pointTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.pulseMesh = new THREE.Points(this.pulseGeometry, this.pulseMaterial);
    this.scene.add(this.pulseMesh);

    // Pre-populate some action potential light pulses
    for (let k = 0; k < 6; k++) {
      this.spawnPulse(random);
    }
  }

  spawnPulse(optRandom) {
    const random = optRandom || Math.random;
    const fromIdx = Math.floor(random() * this.nodeCount);
    const candidates = [];
    const fromNode = this.nodes[fromIdx];
    
    for (let i = 0; i < this.nodeCount; i++) {
      if (i === fromIdx) continue;
      const dx = fromNode.x - this.nodes[i].x;
      const dy = fromNode.y - this.nodes[i].y;
      const dz = fromNode.z - this.nodes[i].z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < this.connectionDist) {
        candidates.push(i);
      }
    }

    if (candidates.length > 0) {
      const toIdx = candidates[Math.floor(random() * candidates.length)];
      this.lightPulses.push({
        from: fromIdx,
        to: toIdx,
        progress: 0,
        speed: 0.012 + random() * 0.016
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

    const targetDim = this.isDimmed ? 0.12 : 0.7;
    this.dimFactor += (targetDim - this.dimFactor) * 0.06;

    if (this.pointsMaterial) {
      this.pointsMaterial.opacity = 0.85 * this.dimFactor;
      this.pointsMaterial.size = (this.isDimmed ? 1.0 : 1.6);
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

    // 1. Physics & Wobble updates
    const positionsAttr = this.pointsGeometry.getAttribute('position');
    const positions = positionsAttr.array;

    for (let i = 0; i < this.nodeCount; i++) {
      const node = this.nodes[i];

      const windX = Math.sin(time * node.windFreq + node.windPhase) * node.windAmp * 0.35;
      const windY = Math.cos(time * node.windFreq * 0.8 + node.windPhase) * node.windAmp * 0.25;
      const windZ = Math.sin(time * node.windFreq * 1.2 + node.windPhase) * node.windAmp * 0.15;

      const targetX = node.origX + windX;
      const targetY = node.origY + windY;
      const targetZ = node.origZ + windZ;

      let forceX = 0, forceY = 0, forceZ = 0;
      if (this.mouseActive) {
        const dx = node.x - this.mouseTarget.x;
        const dy = node.y - this.mouseTarget.y;
        const dz = node.z - this.mouseTarget.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const effectRadius = 18;

        if (dist < effectRadius && dist > 0.1) {
          const factor = (1.0 - dist / effectRadius);
          const pull = factor * factor * (this.isDimmed ? -2.5 : -5.5);
          forceX = (dx / dist) * pull;
          forceY = (dy / dist) * pull;
          forceZ = (dz / dist) * pull;
        }
      }

      const spring = this.isDimmed ? 0.03 : 0.08;
      const friction = 0.85;

      node.vx = (node.vx + (targetX + forceX - node.x) * spring) * friction;
      node.vy = (node.vy + (targetY + forceY - node.y) * spring) * friction;
      node.vz = (node.vz + (targetZ + forceZ - node.z) * spring) * friction;

      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;

      positions[i * 3] = node.x;
      positions[i * 3 + 1] = node.y;
      positions[i * 3 + 2] = node.z;
    }
    positionsAttr.needsUpdate = true;

    // 2. Line connections rebuild using pre-allocated Float32Array (avoid garbage collection allocations)
    let lineCount = 0;
    const linesAttr = this.linesGeometry.getAttribute('position');
    const lineArray = linesAttr.array;

    for (let i = 0; i < this.nodeCount; i++) {
      const nodeA = this.nodes[i];
      for (let j = i + 1; j < this.nodeCount; j++) {
        if (lineCount >= this.maxLines) break;
        const nodeB = this.nodes[j];
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dz = nodeA.z - nodeB.z;
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < this.connectionDist) {
          const offset = lineCount * 6;
          lineArray[offset] = nodeA.x;
          lineArray[offset + 1] = nodeA.y;
          lineArray[offset + 2] = nodeA.z;
          lineArray[offset + 3] = nodeB.x;
          lineArray[offset + 4] = nodeB.y;
          lineArray[offset + 5] = nodeB.z;
          lineCount++;
        }
      }
    }
    linesAttr.needsUpdate = true;
    this.linesGeometry.setDrawRange(0, lineCount * 2);

    // 3. Spawning & Updating Action Potential Pulses
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

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}
