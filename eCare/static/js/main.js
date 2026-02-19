import { initNavbar, initMobileMenu } from './modules/navbar.js';
import { initScrollAnimations, initCounters } from './modules/animations.js';
import { initTestimonialSlider, initAssistanceCarousel } from './modules/sliders.js';
import { initFAQ } from './modules/faq.js';
import { initAssistanceForm, initContactForm, initCharacterCount } from './modules/forms.js';
import { initServiceModal, initServiceCategories } from './modules/services.js';
import { 
  initScrollToTop, 
  initChatButtons, 
  initSmoothAnchors,
  initFormInputAnimations,
  initPageLoadAnimation,
  initParallaxHero,
  initKonamiCode,
  initSmoothScroll,
  initNavbarHide
} from './modules/ui.js';

function initApp() {
  // NAVIGATION
  initNavbar();
  initMobileMenu();
  
  // ANIMATIONS
  initScrollAnimations();
  initCounters();
  
  // SLIDERS
  initTestimonialSlider();
  initAssistanceCarousel();
  
  // FAQ
  initFAQ();
  
  // FORMS
  initAssistanceForm();
  initContactForm();
  initCharacterCount();
  
  // SERVICES
  initServiceModal();
  initServiceCategories();

  // UI
  initScrollToTop();
  initChatButtons();
  initSmoothAnchors();
  initFormInputAnimations();
  initParallaxHero();
  initKonamiCode();
  initSmoothScroll();
  initNavbarHide();
}

document.addEventListener('DOMContentLoaded', initApp);
initPageLoadAnimation();

export { initApp };