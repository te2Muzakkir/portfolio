import * as THREE from 'three';

import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/addons/renderers/CSS2DRenderer.js';

export function initTimeline() {
  const container = document.querySelector('#timeline-visual');

  if (!container || container.dataset.initialized === 'true') return;

  const steps = [
    ...document.querySelectorAll('#timeline .timeline-step')
  ];

  const progressBar = document.querySelector(
    '#timeline .timeline-progress-bar'
  );

  if (!steps.length) return;

  container.dataset.initialized = 'true';

  let animationFrame;
  let resizeObserver;
  let disposed = false;

  // -----------------------------------------
  // WEBGL SCENE AND CAMERA
  // -----------------------------------------

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);

  // -----------------------------------------
  // WEBGL RENDERER
  // -----------------------------------------

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.75)
  );

  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  );

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  renderer.domElement.className = 'orb-webgl';

  // -----------------------------------------
  // CSS2D RENDERER
  // -----------------------------------------

  const labelRenderer = new CSS2DRenderer();

  labelRenderer.setSize(
    container.clientWidth,
    container.clientHeight
  );

  labelRenderer.domElement.className = 'orb-css3d';

  container.appendChild(renderer.domElement);
  container.appendChild(labelRenderer.domElement);

  // -----------------------------------------
  // LIGHTING
  // -----------------------------------------

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const mainLight = new THREE.PointLight(
    0xb58aff,
    45,
    20
  );

  mainLight.position.set(3, 3, 5);
  scene.add(mainLight);

  const secondaryLight = new THREE.PointLight(
    0x432874,
    35,
    20
  );

  secondaryLight.position.set(-4, -2, 3);
  scene.add(secondaryLight);

  const rimLight = new THREE.PointLight(
    0xd5b8ff,
    30,
    20
  );

  rimLight.position.set(0, 4, -4);
  scene.add(rimLight);

  // -----------------------------------------
  // WEBGL ORB
  // -----------------------------------------

  const orb = new THREE.Group();
  scene.add(orb);

  // Core

  const coreGeometry = new THREE.SphereGeometry(
    1.25,
    96,
    96
  );

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x432874,
    emissive: 0x29134d,
    emissiveIntensity: 1.1,
    metalness: 0.35,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.15
  });

  const core = new THREE.Mesh(
    coreGeometry,
    coreMaterial
  );

  orb.add(core);

  // Outer wireframe

  const shellGeometry = new THREE.IcosahedronGeometry(
    1.43,
    4
  );

  const shellMaterial = new THREE.MeshBasicMaterial({
    color: 0xb994f5,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });

  const shell = new THREE.Mesh(
    shellGeometry,
    shellMaterial
  );

  orb.add(shell);

  // Inner wireframe

  const innerGeometry = new THREE.IcosahedronGeometry(
    1.12,
    2
  );

  const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0xd3b8ff,
    wireframe: true,
    transparent: true,
    opacity: 0.13
  });

  const innerWireframe = new THREE.Mesh(
    innerGeometry,
    innerMaterial
  );

  orb.add(innerWireframe);

  // -----------------------------------------
  // CSS2D SKILL LABEL GROUP
  // -----------------------------------------

  const cssOrb = new THREE.Group();
  scene.add(cssOrb);

  const skills = [
    'JAVA',
    'SPRING BOOT',
    'MICROSERVICES',
    'ANGULAR',
    'POSTGRESQL',
    'DOCKER',
    'JWT',
    'RABBITMQ',
    'REDIS',
    'REST API',
    'SYSTEM DESIGN',
    'JAVASCRIPT',
    'SPRING CLOUD',
    'OAUTH',
    'RAG'
  ];

  const skillObjects = [];

  const skillRadius = 1.57;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  skills.forEach((skill, index) => {
    const y =
      1 - (index / (skills.length - 1)) * 2;

    const radialDistance = Math.sqrt(1 - y * y);
    const theta = goldenAngle * index;

    const x = Math.cos(theta) * radialDistance;
    const z = Math.sin(theta) * radialDistance;

    const element = document.createElement('div');

    element.className = 'orb-skill-label';
    element.textContent = skill;

    const skillObject = new CSS2DObject(element);

    // Use the same Three.js world units as the WebGL orb.
    skillObject.position.set(
      x * skillRadius,
      y * skillRadius,
      z * skillRadius
    );

    cssOrb.add(skillObject);
    skillObjects.push(skillObject);
  });

  // -----------------------------------------
  // SKILL LABEL VISIBILITY
  // -----------------------------------------

  const cameraWorldPosition = new THREE.Vector3();
  const labelWorldPosition = new THREE.Vector3();
  const labelNormal = new THREE.Vector3();
  const directionToCamera = new THREE.Vector3();

  function updateSkillLabels() {
    cssOrb.updateMatrixWorld(true);

    camera.getWorldPosition(cameraWorldPosition);

    skillObjects.forEach((skillObject) => {
      skillObject.getWorldPosition(labelWorldPosition);

      // Surface normal from the orb center to the label.
      labelNormal
        .copy(labelWorldPosition)
        .normalize();

      // Direction from the label towards the camera.
      directionToCamera
        .copy(cameraWorldPosition)
        .sub(labelWorldPosition)
        .normalize();

      const facing = labelNormal.dot(directionToCamera);

      skillObject.element.style.visibility =
        facing > 0.05 ? 'visible' : 'hidden';
    });
  }

  // -----------------------------------------
  // ORBITAL RINGS
  // -----------------------------------------

  const rings = [];

  const ringConfigurations = [
    {
      radius: 1.85,
      color: 0xa77be8,
      rotation: [0.8, 0.2, 0.2],
      speed: 0.15
    },
    {
      radius: 2.05,
      color: 0x6c42a5,
      rotation: [1.3, 0.9, 0.5],
      speed: -0.11
    },
    {
      radius: 1.7,
      color: 0xd0b4ff,
      rotation: [0.2, 1.1, 1.3],
      speed: 0.19
    }
  ];

  ringConfigurations.forEach((config) => {
    const geometry = new THREE.TorusGeometry(
      config.radius,
      0.009,
      12,
      180
    );

    const material = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.55
    });

    const ring = new THREE.Mesh(geometry, material);

    ring.rotation.set(...config.rotation);
    ring.userData.speed = config.speed;

    orb.add(ring);
    rings.push(ring);
  });

  // -----------------------------------------
  // PARTICLES
  // -----------------------------------------

  const particleCount =
    window.innerWidth < 600 ? 250 : 550;

  const positions = new Float32Array(
    particleCount * 3
  );

  for (let i = 0; i < particleCount; i++) {
    const particleRadius = 1.5 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] =
      particleRadius * Math.sin(phi) * Math.cos(theta);

    positions[i * 3 + 1] =
      particleRadius * Math.sin(phi) * Math.sin(theta);

    positions[i * 3 + 2] =
      particleRadius * Math.cos(phi);
  }

  const particleGeometry = new THREE.BufferGeometry();

  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xc5a4ff,
    size: 0.025,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(
    particleGeometry,
    particleMaterial
  );

  orb.add(particles);

  // -----------------------------------------
  // MOUSE INTERACTION
  // -----------------------------------------

  const pointer = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };

  function handlePointerMove(event) {
    const rect = container.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    pointer.x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;

    pointer.y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function resetPointer() {
    pointer.x = 0;
    pointer.y = 0;
  }

  container.addEventListener('pointermove', handlePointerMove);
  container.addEventListener('pointerleave', resetPointer);

  // -----------------------------------------
  // RESIZE
  // -----------------------------------------

  function resizeScene() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    labelRenderer.setSize(width, height);
  }

  resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(container);

  // -----------------------------------------
  // ANIMATION
  // -----------------------------------------

  const clock = new THREE.Clock();

  function animate() {
    if (disposed) return;

    animationFrame = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    targetRotation.x = pointer.y * 0.3;
    targetRotation.y = pointer.x * 0.45;

    orb.rotation.x +=
      (targetRotation.x - orb.rotation.x) * 0.035;

    orb.rotation.y +=
      (targetRotation.y - orb.rotation.y) * 0.035;

    orb.rotation.y += delta * 0.12;

    // Wireframe animation

    shell.rotation.x = elapsed * 0.035;
    shell.rotation.y = -elapsed * 0.055;

    innerWireframe.rotation.x = -elapsed * 0.08;
    innerWireframe.rotation.y = elapsed * 0.06;

    // Ring animation

    rings.forEach((ring) => {
      ring.rotation.z += ring.userData.speed * delta;
    });

    // Particle animation

    particles.rotation.y = elapsed * 0.035;
    particles.rotation.x = Math.sin(elapsed * 0.2) * 0.08;

    // Core breathing

    const breathing = 1 + Math.sin(elapsed * 1.2) * 0.018;
    core.scale.setScalar(breathing);

    // Synchronize label group with the orb.

    cssOrb.rotation.copy(orb.rotation);

    // Update visible labels.

    updateSkillLabels();

    // Render both layers using the SAME camera.

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }

  animate();

  // -----------------------------------------
  // TIMELINE MILESTONES
  // -----------------------------------------

  function activateStage(index) {
    const safeIndex = Math.max(
      0,
      Math.min(index, steps.length - 1)
    );

    steps.forEach((step, stepIndex) => {
      step.classList.toggle(
        'is-active',
        stepIndex === safeIndex
      );
    });

    if (progressBar) {
      const progress =
        (safeIndex / Math.max(steps.length - 1, 1)) * 100;

      progressBar.style.height = `${progress}%`;
    }

    if (window.gsap) {
      const emissiveLevels = [1.1, 1.4, 0.85, 1.6];
      const shellLevels = [0.2, 0.28, 0.17, 0.35];
      const rotationsX = [0.1, 0.45, -0.35, 0.7];
      const rotationsY = [0.2, 1.1, 2.1, 3.0];

      gsap.to(coreMaterial, {
        emissiveIntensity: emissiveLevels[safeIndex] ?? 1.1,
        duration: 1
      });

      gsap.to(shellMaterial, {
        opacity: shellLevels[safeIndex] ?? 0.2,
        duration: 1
      });

      gsap.to(orb.rotation, {
        x: rotationsX[safeIndex] ?? 0,
        y: rotationsY[safeIndex] ?? 0,
        duration: 1.3,
        ease: 'power3.out'
      });
    }
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    steps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 65%',
        end: 'bottom 35%',
        onEnter: () => activateStage(index),
        onEnterBack: () => activateStage(index)
      });
    });
  }

  activateStage(0);

  // -----------------------------------------
  // CLEANUP
  // -----------------------------------------

  function cleanup() {
    if (disposed) return;

    disposed = true;

    cancelAnimationFrame(animationFrame);
    resizeObserver?.disconnect();

    container.removeEventListener('pointermove', handlePointerMove);
    container.removeEventListener('pointerleave', resetPointer);

    coreGeometry.dispose();
    coreMaterial.dispose();

    shellGeometry.dispose();
    shellMaterial.dispose();

    innerGeometry.dispose();
    innerMaterial.dispose();

    particleGeometry.dispose();
    particleMaterial.dispose();

    rings.forEach((ring) => {
      ring.geometry.dispose();
      ring.material.dispose();
    });

    skillObjects.forEach((object) => {
      object.element.remove();
    });

    renderer.dispose();

    renderer.domElement.remove();
    labelRenderer.domElement.remove();

    container.dataset.initialized = 'false';
  }

  window.addEventListener('pagehide', cleanup, { once: true });
}