// ==========================================
// THREE.JS GLOBAL 3D BACKGROUND & INTERACTIVE HOLOGRAM SPHERE
// ==========================================
let globalScene, globalCamera, globalRenderer, globalParticles;
let hologramGroup, outerSphereMesh, innerCoreMesh, ring1Mesh, ring2Mesh, vertexNodes;

// Mouse & Pointer Physics State
let targetMouseX = 0;
let targetMouseY = 0;
let currentMouseX = 0;
let currentMouseY = 0;

function initGlobal3DBackground() {
  const canvas = document.getElementById('bg3dGlobal');
  if (!canvas) return;

  globalScene = new THREE.Scene();
  globalCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  globalCamera.position.z = 400;

  globalRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  globalRenderer.setSize(window.innerWidth, window.innerHeight);
  globalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Particle Constellation Background
  const geometry = new THREE.BufferGeometry();
  const count = 500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 1000;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x6366f1,
    size: 2.5,
    transparent: true,
    opacity: 0.5
  });

  globalParticles = new THREE.Points(geometry, material);
  globalScene.add(globalParticles);

  // 2. SLIDE 1 HERO 3D HOLOGRAM CYBER SPHERE (MUCH LARGER & MULTI-LAYERED)
  hologramGroup = new THREE.Group();

  // A. Outer Wireframe Hologram Sphere (Bigger radius: 135)
  const outerGeom = new THREE.IcosahedronGeometry(135, 2);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8, // Vibrant Cyan Hologram
    wireframe: true,
    transparent: true,
    opacity: 0.5
  });
  outerSphereMesh = new THREE.Mesh(outerGeom, outerMat);
  hologramGroup.add(outerSphereMesh);

  // B. Inner Glowing Energy Core
  const innerGeom = new THREE.IcosahedronGeometry(75, 1);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x818cf8, // Electric Indigo Core
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  innerCoreMesh = new THREE.Mesh(innerGeom, innerMat);
  hologramGroup.add(innerCoreMesh);

  // C. Orbital Cyber Ring 1 (Horizontal Cyber Belt)
  const ring1Geom = new THREE.TorusGeometry(175, 1.2, 16, 80);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4, // Neon Cyan Ring
    transparent: true,
    opacity: 0.7
  });
  ring1Mesh = new THREE.Mesh(ring1Geom, ring1Mat);
  ring1Mesh.rotation.x = Math.PI / 3;
  hologramGroup.add(ring1Mesh);

  // D. Orbital Cyber Ring 2 (Diagonal Belt)
  const ring2Geom = new THREE.TorusGeometry(195, 1.0, 16, 80);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0x34d399, // Emerald Teal Accent Ring
    transparent: true,
    opacity: 0.5
  });
  ring2Mesh = new THREE.Mesh(ring2Geom, ring2Mat);
  ring2Mesh.rotation.y = Math.PI / 4;
  ring2Mesh.rotation.x = -Math.PI / 6;
  hologramGroup.add(ring2Mesh);

  // E. Glowing Vertex Nodes (Dots on outer sphere points)
  const vertexMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 4.5,
    transparent: true,
    opacity: 0.95
  });
  vertexNodes = new THREE.Points(outerGeom, vertexMat);
  hologramGroup.add(vertexNodes);

  // Initial position of hologram on Slide 1
  updateHologramBasePosition();
  globalScene.add(hologramGroup);

  // 3. MOUSE & TOUCH CURSOR TRACKING LISTENERS
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('resize', onWindowResize);

  function onPointerMove(e) {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      targetMouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }

  function updateHologramBasePosition() {
    // On wide desktop: offset right side. On mobile: center background.
    const isMobile = window.innerWidth < 768;
    const basePosX = isMobile ? 0 : Math.min(260, window.innerWidth * 0.22);
    const basePosY = isMobile ? 80 : 20;
    hologramGroup.position.set(basePosX, basePosY, -30);
  }

  function onWindowResize() {
    globalCamera.aspect = window.innerWidth / window.innerHeight;
    globalCamera.updateProjectionMatrix();
    globalRenderer.setSize(window.innerWidth, window.innerHeight);
    updateHologramBasePosition();
  }

  // 4. ANIMATION LOOP WITH CURSOR TRACKING PHYSICS
  let baseScale = 1;
  let targetScale = 1;

  function animateGlobal() {
    requestAnimationFrame(animateGlobal);

    // Rotate background particles slowly
    if (globalParticles) {
      globalParticles.rotation.y += 0.0005;
      globalParticles.rotation.x += 0.0002;
    }

    if (hologramGroup) {
      // Smooth lerp for mouse coordinates
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // Base position with interactive offset following the mouse cursor
      const isMobile = window.innerWidth < 768;
      const basePosX = isMobile ? 0 : Math.min(260, window.innerWidth * 0.22);
      const basePosY = isMobile ? 80 : 20;

      // Movement response: Sphere follows mouse movement dynamically
      hologramGroup.position.x = basePosX + currentMouseX * 110;
      hologramGroup.position.y = basePosY + currentMouseY * 70;

      // Rotational response: Hologram tilts & rotates smoothly according to cursor position
      hologramGroup.rotation.y += 0.004 + Math.abs(currentMouseX) * 0.01;
      hologramGroup.rotation.x = currentMouseY * 0.4;
      hologramGroup.rotation.z = currentMouseX * 0.2;

      // Individual layer spin speeds for high-tech depth effect
      if (innerCoreMesh) {
        innerCoreMesh.rotation.y -= 0.008;
        innerCoreMesh.rotation.x += 0.005;
      }
      if (ring1Mesh) {
        ring1Mesh.rotation.z += 0.012;
      }
      if (ring2Mesh) {
        ring2Mesh.rotation.x -= 0.009;
        ring2Mesh.rotation.z += 0.006;
      }

      // Proximity Hover Reaction: When mouse moves closer to right side / hologram, pulse & expand scale
      const mouseDistFromHologram = Math.hypot(currentMouseX - 0.5, currentMouseY - 0.1);
      if (mouseDistFromHologram < 0.65) {
        targetScale = 1.22; // Scale up 22% when cursor approaches
        outerMat.opacity = 0.75; // Brighten wireframe
        innerMat.opacity = 0.85;
      } else {
        targetScale = 1.0;
        outerMat.opacity = 0.45;
        innerMat.opacity = 0.65;
      }

      // Smooth scale interpolation
      baseScale += (targetScale - baseScale) * 0.08;
      hologramGroup.scale.setScalar(baseScale);
    }

    globalRenderer.render(globalScene, globalCamera);
  }

  animateGlobal();
}
