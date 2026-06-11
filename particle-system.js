/**
 * particle-system.js
 * 
 * Ambient floating particle system for the voxel bonsai scene.
 * Creates glowing particles that orbit and bob around the tree,
 * using a procedural radial-gradient glow texture.
 * 
 * @module particle-system
 */

import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

// ─── Procedural Glow Texture ────────────────────────────────────────────────

/**
 * Generates a 16×16 canvas texture with a radial gradient glow.
 * White center fading to fully transparent at the edges.
 * @returns {THREE.CanvasTexture} The generated glow texture.
 */
function createGlowTexture() {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  const center = size / 2;

  // Radial gradient: opaque white center → transparent edge
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.6)');
  gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ─── Particle System Factory ────────────────────────────────────────────────

/**
 * Creates an ambient floating particle system and adds it to the scene.
 * 
 * Particles are distributed in a cylindrical volume and animate with
 * orbital motion and vertical sine-wave bobbing.
 * 
 * @param {object} THREE_module - The THREE.js module (kept for API compatibility, uses imported THREE).
 * @param {THREE.Scene} scene - The Three.js scene to add particles to.
 * @param {number} count - Number of particles to generate.
 * @returns {{
 *   mesh: THREE.Points,
 *   update: (time: number) => void,
 *   setColor: (hexColor: string) => void,
 *   dispose: () => void
 * }}
 */
export function createParticleSystem(THREE_module, scene, count) {
  // Use the imported THREE module for consistency
  const T = THREE;

  // ── Per-particle animation data ───────────────────────────────────────

  /** @type {Array<{angle: number, radius: number, baseY: number, orbitSpeed: number, vertSpeed: number, yAmplitude: number}>} */
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      radius: 8 + Math.random() * 17,          // 8–25 radius
      baseY: -5 + Math.random() * 30,           // -5 to 25 height
      orbitSpeed: 0.001 + Math.random() * 0.003, // 0.001–0.004
      vertSpeed: 0.3 + Math.random() * 0.7,     // Vertical oscillation speed
      yAmplitude: 0.5 + Math.random() * 2.0,    // 0.5–2.5 bob amplitude
    });
  }

  // ── Geometry ──────────────────────────────────────────────────────────

  const geometry = new T.BufferGeometry();
  const positions = new Float32Array(count * 3);

  // Initialize positions from particle data
  for (let i = 0; i < count; i++) {
    const p = particles[i];
    positions[i * 3] = Math.cos(p.angle) * p.radius;
    positions[i * 3 + 1] = p.baseY;
    positions[i * 3 + 2] = Math.sin(p.angle) * p.radius;
  }

  geometry.setAttribute('position', new T.BufferAttribute(positions, 3));

  // ── Material ──────────────────────────────────────────────────────────

  const glowTexture = createGlowTexture();

  const material = new T.PointsMaterial({
    size: 0.35,
    map: glowTexture,
    color: new T.Color('#f59e0b'),   // Warm amber default
    transparent: true,
    opacity: 0.55,
    blending: T.AdditiveBlending,
    depthWrite: false,               // Prevent z-fighting with transparent particles
  });

  // ── Mesh ──────────────────────────────────────────────────────────────

  const mesh = new T.Points(geometry, material);
  scene.add(mesh);

  // ── Public API ────────────────────────────────────────────────────────

  return {
    /** The THREE.Points mesh instance */
    mesh,

    /**
     * Updates particle positions each frame.
     * Particles orbit around the Y axis and bob vertically.
     * @param {number} time - Elapsed time in seconds (e.g. from clock.getElapsedTime()).
     */
    update(time) {
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Advance orbital angle
        p.angle += p.orbitSpeed;

        // Compute new position
        pos[i * 3] = Math.cos(p.angle) * p.radius;
        pos[i * 3 + 1] = p.baseY + Math.sin(time * p.vertSpeed + i) * p.yAmplitude;
        pos[i * 3 + 2] = Math.sin(p.angle) * p.radius;
      }

      geometry.attributes.position.needsUpdate = true;
    },

    /**
     * Updates the particle color.
     * @param {string} hexColor - CSS hex color string (e.g. '#ff0000').
     */
    setColor(hexColor) {
      material.color.set(hexColor);
    },

    /**
     * Disposes of all GPU resources and removes the mesh from the scene.
     */
    dispose() {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      glowTexture.dispose();
    },
  };
}
