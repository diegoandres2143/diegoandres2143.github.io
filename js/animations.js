/**
 * Animations.js - Anime.js animations for Diego's Portfolio
 * Professional animations for navbar, sections, and project cards
 */

// Animation configurations
const ANIMATION_CONFIG = {
  navbar: {
    duration: 1200,
    easing: 'easeOutExpo',
    translateY: [-50, 0],
    opacity: [0, 1]
  },
  projectTitle: {
    duration: 1200,
    delay: 400,
    easing: 'easeOutExpo',
    translateX: [-100, 0],
    opacity: [0, 1]
  },
  projectSubtitle: {
    duration: 1200,
    delay: 800,
    easing: 'easeOutExpo',
    translateX: [100, 0],
    opacity: [0, 1]
  },
  projectCards: {
    duration: 900,
    easing: 'easeOutBack',
    scale: [0.8, 1],
    opacity: [0, 1],
    delayBetweenCards: 150
  }
};

/**
 * Animate navbar on page load
 */
function animateNavbar() {
  anime({
    targets: '#nav',
    translateY: ANIMATION_CONFIG.navbar.translateY,
    opacity: ANIMATION_CONFIG.navbar.opacity,
    duration: ANIMATION_CONFIG.navbar.duration,
    easing: ANIMATION_CONFIG.navbar.easing
  });
}

/**
 * Animate project section titles
 */
function animateProjectTitles() {
  // Main title animation
  anime({
    targets: '.proyectos-titulo',
    translateX: ANIMATION_CONFIG.projectTitle.translateX,
    opacity: ANIMATION_CONFIG.projectTitle.opacity,
    duration: ANIMATION_CONFIG.projectTitle.duration,
    delay: ANIMATION_CONFIG.projectTitle.delay,
    easing: ANIMATION_CONFIG.projectTitle.easing
  });

  // Subtitle animation
  anime({
    targets: '.proyectos-subtitulo',
    translateX: ANIMATION_CONFIG.projectSubtitle.translateX,
    opacity: ANIMATION_CONFIG.projectSubtitle.opacity,
    duration: ANIMATION_CONFIG.projectSubtitle.duration,
    delay: ANIMATION_CONFIG.projectSubtitle.delay,
    easing: ANIMATION_CONFIG.projectSubtitle.easing
  });
}

/**
 * Animate project cards on scroll
 */
function animateProjectCards() {
  const cards = document.querySelectorAll('.proyecto-card');
  
  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100;
    
    if (isVisible && !card.classList.contains('animated')) {
      card.classList.add('animated');
      
      anime({
        targets: card,
        scale: ANIMATION_CONFIG.projectCards.scale,
        opacity: ANIMATION_CONFIG.projectCards.opacity,
        duration: ANIMATION_CONFIG.projectCards.duration,
        delay: index * ANIMATION_CONFIG.projectCards.delayBetweenCards,
        easing: ANIMATION_CONFIG.projectCards.easing
      });
    }
  });
}

/**
 * Animate sections on scroll (general purpose)
 */
function animateOnScroll() {
  const sections = document.querySelectorAll('article');
  
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 50;
    
    if (isVisible && !section.classList.contains('section-animated')) {
      section.classList.add('section-animated');
      
      anime({
        targets: section,
        translateY: [30, 0],
        opacity: [0.8, 1],
        duration: 800,
        easing: 'easeOutQuad'
      });
    }
  });
}

/**
 * Initialize all animations
 */
function initAnimations() {
  // Animate navbar immediately
  animateNavbar();
  
  // Animate project titles if on projects section
  if (document.querySelector('.proyectos-titulo')) {
    animateProjectTitles();
  }
  
  // Initial check for project cards
  animateProjectCards();
  
  // Initial check for sections
  animateOnScroll();
}

/**
 * Setup scroll event listeners
 */
function setupScrollListeners() {
  let ticking = false;
  
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        animateProjectCards();
        animateOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll);
}

/**
 * Download CV button hover animation
 */
function animateDownloadButton() {
  const downloadBtn = document.querySelector('.descargar-cv');
  
  if (downloadBtn) {
    downloadBtn.addEventListener('mouseenter', () => {
      anime({
        targets: downloadBtn,
        scale: 1.05,
        duration: 200,
        easing: 'easeOutQuad'
      });
    });
    
    downloadBtn.addEventListener('mouseleave', () => {
      anime({
        targets: downloadBtn,
        scale: 1,
        duration: 200,
        easing: 'easeOutQuad'
      });
    });
  }
}

/**
 * Main initialization function
 */
function init() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAnimations();
      setupScrollListeners();
      animateDownloadButton();
    });
  } else {
    initAnimations();
    setupScrollListeners();
    animateDownloadButton();
  }
}

// Initialize when script loads
init();