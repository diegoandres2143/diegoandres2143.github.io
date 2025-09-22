/**
 * Diego's Portfolio - Clean & Elegant
 * Essential functionality with stellar theme
 */

// Language switching functionality
function setLanguage(lang) {
  // Update all elements with language attributes
  document.querySelectorAll('[data-en][data-es]').forEach(element => {
    if (element.hasAttribute(`data-${lang}`)) {
      element.textContent = element.getAttribute(`data-${lang}`);
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-en-placeholder][data-es-placeholder]').forEach(element => {
    if (element.hasAttribute(`data-${lang}-placeholder`)) {
      element.placeholder = element.getAttribute(`data-${lang}-placeholder`);
    }
  });
  
  // Update language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active-lang');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active-lang');
    }
  });
  
  // Save language preference
  localStorage.setItem('selectedLanguage', lang);
}

// Timeline scroll animation
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  function checkTimelineItems() {
    const triggerBottom = window.innerHeight * 0.85;
    
    timelineItems.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      if (itemTop < triggerBottom) {
        item.classList.add('show');
      }
    });
  }
  
  window.addEventListener('scroll', checkTimelineItems);
  checkTimelineItems(); // Check on load
}

// Project carousel functionality
let currentSlide = 0;
const slideWidth = 370; // Card width + gap

function moveCarousel(direction) {
  const carousel = document.getElementById('projectCarousel');
  const cards = carousel.querySelectorAll('.project-card');
  const maxSlides = Math.max(0, cards.length - 1);
  
  currentSlide += direction;
  
  if (currentSlide < 0) currentSlide = 0;
  if (currentSlide > maxSlides) currentSlide = maxSlides;
  
  const translateX = -currentSlide * slideWidth;
  carousel.style.transform = `translateX(${translateX}px)`;
  
  // Update navigation buttons
  updateNavButtons();
}

function updateNavButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const carousel = document.getElementById('projectCarousel');
  const cards = carousel.querySelectorAll('.project-card');
  
  if (prevBtn) prevBtn.disabled = currentSlide === 0;
  if (nextBtn) nextBtn.disabled = currentSlide >= cards.length - 1;
}

// Card flip functionality
function flipCard(button) {
  const card = button.closest('.project-card');
  if (card) {
    card.classList.toggle('flipped');
  }
}

// Contact form functionality
function initContactForm() {
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: "yD5u3lncGo8QqqWEC" });
  }
  
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    try {
      if (typeof emailjs !== 'undefined') {
        await emailjs.sendForm('default_service', 'template_contact', form);
        showNotification('¡Mensaje enviado correctamente!', 'success');
        form.reset();
      } else {
        showNotification('Servicio de email no disponible', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('Error al enviar el mensaje', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#00d4ff' : '#ff6b35'};
    color: white;
    padding: 1rem 2rem;
    border-radius: 25px;
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Scroll to top functionality
function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollToTop');
  if (!scrollBtn) return;
  
  function toggleScrollButton() {
    if (window.scrollY > 300) {
      scrollBtn.style.display = 'block';
    } else {
      scrollBtn.style.display = 'none';
    }
  }
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', toggleScrollButton);
  toggleScrollButton(); // Check on load
}

// Stellar background effects
function createTwinklingStars() {
  const starsContainer = document.getElementById('stars-container');
  if (!starsContainer) return;
  
  // Clear existing stars
  starsContainer.innerHTML = '';
  
  const numberOfStars = 80;
  
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'twinkling-star';
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size and color
    const size = Math.random() * 3 + 1;
    const colors = ['#fff', '#00d4ff', '#ff6b35', '#a0c4ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    star.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      opacity: ${Math.random() * 0.8 + 0.2};
      animation: twinkle ${Math.random() * 3 + 2}s infinite alternate;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    
    // Mouse interaction
    star.addEventListener('mouseenter', () => {
      star.style.transform = 'scale(2)';
      star.style.opacity = '1';
      star.style.boxShadow = `0 0 20px ${color}`;
    });
    
    star.addEventListener('mouseleave', () => {
      star.style.transform = 'scale(1)';
      star.style.opacity = Math.random() * 0.8 + 0.2;
      star.style.boxShadow = 'none';
    });
    
    starsContainer.appendChild(star);
  }
}

// Add stellar CSS animations
function addStellarCSS() {
  if (document.getElementById('stellar-animations')) return;
  
  const style = document.createElement('style');
  style.id = 'stellar-animations';
  style.textContent = `
    #stars-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }
    
    .twinkling-star {
      pointer-events: auto;
    }
    
    @keyframes twinkle {
      0% { opacity: 0.2; transform: scale(1); }
      100% { opacity: 1; transform: scale(1.2); }
    }
  `;
  document.head.appendChild(style);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Mobile menu functionality
function toggleMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileMenuOverlay');
  
  hamburger.classList.toggle('active');
  overlay.classList.toggle('active');
  
  // Don't prevent scroll - allow navigation within the mobile menu
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileMenuOverlay');
  
  hamburger.classList.remove('active');
  overlay.classList.remove('active');
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileMenuOverlay');
  
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }
  
  if (overlay) {
    // Close menu when clicking on overlay (not content)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeMobileMenu();
      }
    });
  }
  
  // Sync language buttons between desktop and mobile
  document.querySelectorAll('.mobile-lang-toggle .lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
      
      // Update mobile language buttons
      document.querySelectorAll('.mobile-lang-toggle .lang-btn').forEach(b => {
        b.classList.remove('active-lang');
        if (b.getAttribute('data-lang') === lang) {
          b.classList.add('active-lang');
        }
      });
    });
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing Diego\'s Stellar Portfolio...');
  
  // Initialize AOS if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
  
  // Initialize language system
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
  setLanguage(savedLanguage);
  
  // Add language button event listeners
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
  
  // Initialize all components
  initTimelineAnimations();
  initContactForm();
  initScrollToTop();
  initSmoothScrolling();
  initMobileMenu(); // Add mobile menu initialization
  
  // Initialize stellar effects
  addStellarCSS();
  createTwinklingStars();
  
  // Initialize carousel navigation
  updateNavButtons();
  
  console.log('✨ Portfolio initialized successfully!');
});

// Make functions globally available
window.moveCarousel = moveCarousel;
window.flipCard = flipCard;
window.closeMobileMenu = closeMobileMenu;