import { loadSections } from './section-loader.js';

import { initSmoothScroll } from './smooth-scroll.js';
import { initNavigation } from './navigation.js';
import { initHero } from './hero.js';
import { initProjects } from './projects.js';
import { initSkills } from './skills.js';
import { initTimeline } from './timeline.js';

async function initPortfolio() {
  try {
    await loadSections();

    initSmoothScroll();
    initNavigation();
    initHero();
    initProjects();
    initSkills();
    initTimeline();

  } catch (error) {
    console.error('Portfolio initialization failed:', error);
  }
}

initPortfolio();