/**
 * Diego's Portfolio - Clean & Elegant
 * Essential functionality with stellar theme
 */

// Typewriter effect for hero subtitle
class TypewriterEffect {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.typeSpeed = options.typeSpeed || 100;
    this.deleteSpeed = options.deleteSpeed || 50;
    this.pauseAfterTyping = options.pauseAfterTyping || 2000;
    this.pauseAfterDeleting = options.pauseAfterDeleting || 500;
    this.timeoutId = null;
    this.isRunning = false;

    this.start();
  }

  start() {
    this.isRunning = true;
    console.log('⚡ Starting typewriter animation');
    this.type();
  }

  stop() {
    this.isRunning = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  type() {
    if (!this.isRunning) return;

    const currentText = this.texts[this.currentTextIndex];

    if (this.isDeleting) {
      // Deleting characters
      this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;

      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        this.timeoutId = setTimeout(() => this.type(), this.pauseAfterDeleting);
        return;
      }

      this.timeoutId = setTimeout(() => this.type(), this.deleteSpeed);
    } else {
      // Typing characters
      this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;

      if (this.currentCharIndex === currentText.length) {
        this.isDeleting = true;
        this.timeoutId = setTimeout(() => this.type(), this.pauseAfterTyping);
        return;
      }

      this.timeoutId = setTimeout(() => this.type(), this.typeSpeed);
    }
  }
}

// Global typewriter instance
let typewriterInstance = null;

// Initialize typewriter effect
function initTypewriter() {
  console.log('🔤 Initializing typewriter...', new Date().toLocaleTimeString());
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    console.log('✅ Typewriter element found');
    // Show immediate feedback
    typewriterElement.textContent = 'Cargando...';
    
    // Clear any existing instance
    if (typewriterInstance) {
      typewriterInstance.stop();
    }

    const currentLang = localStorage.getItem('selectedLanguage') || 'es';

    const textsES = [
      'Desarrollador Full Stack',
      'Analista de Datos',
      'Estudiante de Ingeniería de Sistemas',
      'Especialista en Java',
      'Desarrollador Frontend',
      'Especialista en Business Intelligence',
      'Desarrollador Backend'
    ];

    const textsEN = [
      'Full Stack Developer',
      'Data Analyst',
      'Systems Engineering Student',
      'Java Specialist',
      'Business Intelligence Specialist',
      'Frontend Developer',
      'Backend Developer'
    ];


    const texts = currentLang === 'en' ? textsEN : textsES;

    typewriterInstance = new TypewriterEffect(typewriterElement, texts, {
      typeSpeed: 140,        // Más lento para escribir (era 80)
      deleteSpeed: 60,       // Más lento para borrar (era 40)
      pauseAfterTyping: 4000, // Pausa más larga después de escribir (era 2500)
      pauseAfterDeleting: 600 // Pausa más larga después de borrar (era 300)
    });
    console.log('🎬 Typewriter started with', texts.length, 'texts');
  } else {
    console.error('❌ Typewriter element not found!');
  }
}

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

  // Reinitialize typewriter with new language (small delay for smooth transition)
  setTimeout(() => {
    initTypewriter();
  }, 300);
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
function flipCard(element) {
  let card;

  // Si se hace clic en la card completa
  if (element.classList.contains('project-card')) {
    card = element;
  }
  // Si se hace clic en un botón dentro de la card
  else {
    card = element.closest('.project-card');
  }

  if (card) {
    card.classList.toggle('flipped');
  }
}

// Contact form functionality using EmailJS Service
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Verificar cooldown antes de cualquier otra validación
    if (!validateCooldown()) {
      return;
    }

    // Verificar reCAPTCHA
    if (!validateRecaptcha()) {
      showNotification('Por favor completa la verificación reCAPTCHA', 'error');
      return;
    }

    // Verificar si EmailJS está configurado
    if (!window.EMAIL_CONFIG) {
      showNotification('Servicio de email no configurado', 'error');
      return;
    }

    // Obtener los datos del formulario
    const nombre = form.querySelector('[name="user_name"]').value;
    const correo = form.querySelector('[name="user_email"]').value;
    const asunto = form.querySelector('[name="subject"]').value;
    const mensaje = form.querySelector('[name="message"]').value;

    // Crear el objeto con los parámetros para EmailJS
    const templateParams = {
      user_name: nombre,
      user_email: correo,
      subject: asunto,
      message: mensaje
    };

    // Enviar usando la función que maneja ambos templates
    enviarCorreoConValidaciones(templateParams);
  });
}

// Sistema de cooldown de 15 minutos
function validateCooldown() {
  const lastSentTime = localStorage.getItem('lastEmailSent');
  const cooldownPeriod = 15 * 60 * 1000; // 15 minutos en milliseconds

  if (lastSentTime) {
    const timeSinceLastSent = Date.now() - parseInt(lastSentTime);
    const remainingTime = cooldownPeriod - timeSinceLastSent;

    if (remainingTime > 0) {
      showCooldownBanner(remainingTime);
      return false;
    }
  }

  return true;
}

// Validación de reCAPTCHA
function validateRecaptcha() {
  // Verificar si reCAPTCHA está cargado y completado
  if (typeof grecaptcha === 'undefined') {
    console.warn('reCAPTCHA no está cargado');
    return false;
  }

  const recaptchaResponse = grecaptcha.getResponse();
  return recaptchaResponse && recaptchaResponse.length > 0;
}

// Función mejorada de envío con validaciones
function enviarCorreoConValidaciones(templateParams) {
  // Deshabilitar el formulario durante el envío
  const form = document.getElementById('contactForm');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';

  // Enviar el correo
  enviarCorreo(templateParams)
    .then(() => {
      // Guardar timestamp del envío exitoso
      localStorage.setItem('lastEmailSent', Date.now().toString());

      // Resetear formulario y reCAPTCHA
      form.reset();
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
      }

      // Mostrar banner de cooldown
      showCooldownBanner(15 * 60 * 1000); // 15 minutos
    })
    .catch((error) => {
      console.error('Error al enviar:', error);
      // En caso de error, no guardar el timestamp
    })
    .finally(() => {
      // Rehabilitar el botón
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    });
}

// Mostrar cooldown arriba del reCAPTCHA
function showCooldownBanner(remainingTime) {
  // Remover mensaje existente si lo hay
  const existingMessage = document.getElementById('cooldownMessage');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Encontrar el contenedor del reCAPTCHA
  const recaptchaContainer = document.querySelector('.recaptcha-container');
  if (!recaptchaContainer) return;

  // Crear mensaje de cooldown
  const cooldownMessage = document.createElement('div');
  cooldownMessage.id = 'cooldownMessage';
  cooldownMessage.style.cssText = `
    text-align: center;
    margin-bottom: 1rem;
    color: #ae35ff;
    font-weight: 600;
    font-size: 0.9rem;
    animation: cooldownBlink 1.5s ease-in-out infinite alternate;
  `;

  // Insertar antes del contenedor de reCAPTCHA
  recaptchaContainer.parentNode.insertBefore(cooldownMessage, recaptchaContainer);

  // Función para actualizar el contador
  function updateCooldownCounter() {
    const now = Date.now();
    const lastSent = parseInt(localStorage.getItem('lastEmailSent'));
    const elapsed = now - lastSent;
    const remaining = (15 * 60 * 1000) - elapsed;

    if (remaining <= 0) {
      // Tiempo cumplido, remover mensaje
      cooldownMessage.remove();
      return;
    }

    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

    cooldownMessage.textContent = `Siguiente envío en ${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Continuar actualizando cada segundo
    setTimeout(updateCooldownCounter, 1000);
  }

  // Iniciar contador
  updateCooldownCounter();
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

// Scroll to top functionality mejorado
function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollToTop');
  if (!scrollBtn) return;

  function toggleScrollButton() {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  }

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Recargar todas las animaciones después de volver arriba
    setTimeout(() => {
      refreshAllAnimations();
    }, 600);
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

// Mobile menu functionality mejorado
function toggleMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileMenuOverlay');

  hamburger.classList.toggle('active');
  overlay.classList.toggle('active');
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileMenuOverlay');

  hamburger.classList.remove('active');
  overlay.classList.remove('active');

  // Recargar animaciones después de cerrar el menú móvil
  setTimeout(() => {
    refreshAllAnimations();
  }, 300);
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

// Sticky navbar functionality - Always visible after AOS
function initStickyNavbar() {
  const navbar = document.querySelector('.NavBar');
  if (!navbar) return;

  // Wait for AOS animation to complete, then ensure navbar stays visible
  setTimeout(() => {
    // Force navbar to stay visible after AOS animation
    navbar.style.display = 'flex';
    navbar.style.visibility = 'visible';
    navbar.style.opacity = '1';
    navbar.style.position = 'sticky';
    navbar.style.top = '0.5rem';
    navbar.style.zIndex = '1000';
  }, 1200); // Wait a bit longer than AOS duration

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add scrolled class when scrolling down past 100px for styling only
    if (scrollTop > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Ensure navbar remains visible if AOS has completed
    if (navbar.classList.contains('aos-animate')) {
      navbar.style.display = 'flex';
      navbar.style.visibility = 'visible';
      navbar.style.opacity = '1';
    }
  }

  // Throttle scroll events for better performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScroll, 10);
  });

  // Initial check
  handleScroll();
}

// Enhanced AOS configuration and control
let lastScrollDirection = 'down';
let lastScrollY = 0;

function initEnhancedAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: false, // Permite que las animaciones se repitan
      offset: 150, // Más offset para mejor posicionamiento
      delay: 0,
      easing: 'ease-out-cubic',
      mirror: false, // Permite animaciones al hacer scroll hacia arriba
      anchorPlacement: 'top-bottom'
    });

    // Control de dirección de scroll para animaciones
    window.addEventListener('scroll', function () {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

      // Solo refresh AOS cuando se hace scroll hacia abajo
      if (scrollDirection === 'down' && lastScrollDirection === 'up') {
        AOS.refresh();
      }

      lastScrollDirection = scrollDirection;
      lastScrollY = currentScrollY;
    });
  }
}

// Función para recargar animaciones completamente
function refreshAllAnimations() {
  if (typeof AOS !== 'undefined') {
    // Reinicializar AOS con nueva configuración
    AOS.refreshHard();

    // Pequeño delay para asegurar que se apliquen correctamente
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }
}

// Enhanced smooth scrolling mejorado para navegación
function initEnhancedSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Calcular posición con offset para navbar sticky
        const navbarHeight = document.querySelector('.NavBar')?.offsetHeight || 80;
        let targetPosition;

        // Caso especial para el botón "Inicio" - ir al top completo
        if (this.getAttribute('href') === '#home') {
          targetPosition = 0;
        } else {
          targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        }

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Recargar animaciones después del scroll
        setTimeout(() => {
          refreshAllAnimations();
        }, 800);
      }
    });
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  console.log('Initializing Diego\'s Stellar Portfolio...');

  // Initialize Enhanced AOS
  initEnhancedAOS();

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
  initTypewriter();
  initEnhancedSmoothScrolling(); // Usar la versión mejorada
  initStickyNavbar();
  initMobileMenu();

  // Initialize stellar effects
  addStellarCSS();
  createTwinklingStars();

  // Initialize carousel navigation
  updateNavButtons();

  // Verificar cooldown al cargar la página
  checkCooldownOnLoad();

  // Ensure navbar stays visible after AOS animation
  const navbar = document.querySelector('.NavBar');
  if (navbar) {
    // Listen for AOS animation completion
    navbar.addEventListener('animationend', function () {
      this.style.display = 'flex';
      this.style.visibility = 'visible';
      this.style.opacity = '1';
    });

    // Fallback: Force visibility after a delay
    setTimeout(() => {
      navbar.style.display = 'flex';
      navbar.style.visibility = 'visible';
      navbar.style.opacity = '1';
      navbar.style.position = 'sticky';
      navbar.style.top = '0.5rem';
      navbar.style.zIndex = '1000';
    }, 1500);
  }

  console.log('Portfolio initialized successfully!');
});

// Verificar si hay un cooldown activo al cargar la página
function checkCooldownOnLoad() {
  const lastSentTime = localStorage.getItem('lastEmailSent');
  const cooldownPeriod = 15 * 60 * 1000; // 15 minutos

  if (lastSentTime) {
    const timeSinceLastSent = Date.now() - parseInt(lastSentTime);
    const remainingTime = cooldownPeriod - timeSinceLastSent;

    if (remainingTime > 0) {
      // Hay un cooldown activo, mostrar mensaje
      // Esperar un poco a que se cargue el DOM del formulario
      setTimeout(() => {
        showCooldownBanner(remainingTime);
      }, 1000);
    }
  }
}

// Make functions globally available
window.moveCarousel = moveCarousel;
window.flipCard = flipCard;
window.closeMobileMenu = closeMobileMenu;