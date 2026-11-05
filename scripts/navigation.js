export function initNavigation(lenis) {
  const header = document.getElementById('site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!header || !hamburgerBtn || !mobileMenu) {
    console.warn('Navigation elements were not found.');
    return;
  }

  // Sticky navbar effect
  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', updateHeader, {
    passive: true
  });

  updateHeader();

  // Mobile hamburger toggle
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('active');

    mobileMenu.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');

      if (!targetId || targetId === '#') {
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (!targetElement) {
        return;
      }

      event.preventDefault();

      hamburgerBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');

      if (lenis) {
        lenis.scrollTo(targetElement, {
          offset: -70,
          duration: 1.2
        });
      } else {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}