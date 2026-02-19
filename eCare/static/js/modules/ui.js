export function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.targetScroll = 0;
    });
}

export function initChatButtons() {
    const chatBtns = document.querySelectorAll('#openChat, #ctaChat');

    chatBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                alert('Live chat feature coming soon! Please use our contact form or call us directly.');
            });
        }
    });
}

export function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.targetScroll = target.offsetTop - 80;
                }
            }
        });
    });
}

export function initFormInputAnimations() {
    const formInputs = document.querySelectorAll('input, select, textarea');

    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

export function initPageLoadAnimation() {
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
}

export function initParallaxHero() {
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero && window.innerWidth > 968) {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.3;
            const heroBackground = hero.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }
    });
}

export function initKonamiCode() {
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiPattern.join(',')) {
            createMegaConfetti();
            alert('🎉 You found the secret! Community Connect appreciates power users like you!');
            konamiCode = [];
        }
    });
}

function createMegaConfetti() {
    const { createConfetti } = require('../helpers.js');
    for (let i = 0; i < 200; i++) {
        setTimeout(() => createConfetti(), i * 50);
    }
}

export function initSmoothScroll() {
  if (window.innerWidth <= 968) return;

  let targetScroll = window.scrollY;
  let currentScroll = window.scrollY;
  const ease = 0.08;

  window.targetScroll = targetScroll;

  const isScrollable = (el) => {
    const style = window.getComputedStyle(el);
    return (style.overflow === 'auto' || style.overflow === 'scroll' ||
            style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            el.scrollHeight > el.clientHeight;
  };

  window.addEventListener("wheel", (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (['input', 'textarea', 'select'].includes(tag)) return;

    let el = e.target;
    while (el && el !== document.body) {
      if (isScrollable(el)) return;
      el = el.parentElement;
    }

    e.preventDefault();
    window.targetScroll += e.deltaY * 0.8;
    window.targetScroll = Math.max(0, Math.min(window.targetScroll, document.body.scrollHeight - window.innerHeight));
  }, { passive: false });

  function smoothScroll() {
    currentScroll += (window.targetScroll - currentScroll) * ease;
    window.scrollTo(0, currentScroll);
    requestAnimationFrame(smoothScroll);
  }

  smoothScroll();
}

export function initNavbarHide() {
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                nav.classList.add('nav-hidden');
            } else {
                nav.classList.remove('nav-hidden');
            }
        }
        lastScrollTop = scrollTop;
    });
}