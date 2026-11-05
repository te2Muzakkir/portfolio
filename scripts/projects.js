export function initProjects() {
  if (
    typeof gsap === 'undefined' ||
    typeof ScrollTrigger === 'undefined'
  ) {
    console.warn('GSAP or ScrollTrigger is not loaded.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const cards = gsap.utils.toArray('.project-card');

  if (!cards.length) {
    return;
  }

  gsap.fromTo(
    cards,
    {
      y: 70,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.25,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects-stack',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}