export function initHero() {
  if (
    typeof gsap === 'undefined' ||
    typeof ScrollTrigger === 'undefined'
  ) {
    console.warn('GSAP or ScrollTrigger is not loaded.');
    return;
  }

  const stage = document.getElementById('hero-parallax-stage');
  const viewport = document.getElementById('parallax-viewport');

  if (!stage || !viewport) {
    return;
  }

  const layers = document.querySelectorAll('.parallax-layer');

  // GSAP quickTo setters
  const rotXSet = gsap.quickTo(viewport, 'rotationX', {
    duration: 0.6,
    ease: 'power2.out'
  });

  const rotYSet = gsap.quickTo(viewport, 'rotationY', {
    duration: 0.6,
    ease: 'power2.out'
  });

  const layerQuickTo = Array.from(layers).map((layer) => {
    const depth =
      parseFloat(layer.getAttribute('data-depth')) || 1;

    return {
      xSet: gsap.quickTo(layer, 'x', {
        duration: 0.6 + depth * 0.15,
        ease: 'power2.out'
      }),

      ySet: gsap.quickTo(layer, 'y', {
        duration: 0.6 + depth * 0.15,
        ease: 'power2.out'
      }),

      depth
    };
  });

  // Mouse movement parallax
  window.addEventListener('mousemove', (event) => {
    const rect = stage.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX =
      (event.clientX - centerX) / (window.innerWidth / 2);

    const deltaY =
      (event.clientY - centerY) / (window.innerHeight / 2);

    rotYSet(deltaX * 12);
    rotXSet(-deltaY * 12);

    layerQuickTo.forEach(({ xSet, ySet, depth }) => {
      xSet(deltaX * 36 * depth);
      ySet(deltaY * 30 * depth);
    });
  });

  // Floating main card
  gsap.to('.layer-main-card', {
    y: '-=10',
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // Floating satellite nodes
  gsap.to('.node-1', {
    y: '-=12',
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.3
  });

  gsap.to('.node-2', {
    y: '+=14',
    duration: 3.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.6
  });

  gsap.to('.node-3', {
    y: '-=8',
    duration: 2.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.9
  });

  // Hero scroll parallax
  gsap.to('.hero-parallax-stage', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.hero-content', {
    yPercent: -10,
    opacity: 0.4,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}