// ── ui.js ─────────────────────────────────────────────────────────────────────

export function scrollTo(dest) {
    const max = document.body.scrollHeight - window.innerHeight;
    const clamped = Math.max(0, Math.min(dest, max));
    window.scrollTo({ top: clamped, behavior: 'smooth' });
}

export function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

export function initChatButtons() {
    document.querySelectorAll('#openChat, #ctaChat').forEach(btn => {
        if (btn) btn.addEventListener('click', () => {
            alert('Live chat feature coming soon! Please use our contact form or call us directly.');
        });
    });
}

export function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const dest = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: dest, behavior: 'smooth' });
                }
            }
        });
    });
}

export function initFormInputAnimations() {
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function () {
            if (!this.value) this.parentElement.classList.remove('focused');
        });
    });
}

// No-op — loader is now handled via inline HTML + script in each template
export function initPageLoadAnimation() {}
export function initParallaxHero() {}
export function initNavbarHide() {}
export function initSmoothScroll() {}

export function initKonamiCode() {
    let konamiCode = [];
    const konamiPattern = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        if (konamiCode.join(',') === konamiPattern.join(',')) {
            alert('🎉 You found the secret! Community Connect appreciates power users like you!');
            konamiCode = [];
        }
    });
}

export function initScrollListeners() {
    const scrollBtn = document.getElementById('scrollToTop');
    const navbar    = document.getElementById('navbar');
    const hero      = document.querySelector('.hero');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollBtn) scrollBtn.classList.toggle('visible', scrollTop > 300);

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollTop > 50);
            if (scrollTop > 100) {
                navbar.classList.toggle('nav-hidden', scrollTop > lastScrollTop);
            } else {
                navbar.classList.remove('nav-hidden');
            }
        }

        if (hero && window.innerWidth > 968) {
            const bg = hero.querySelector('.hero-background');
            if (bg) bg.style.transform = `translateY(${scrollTop * 0.3}px)`;
        }

        lastScrollTop = Math.max(0, scrollTop);
    }, { passive: true });
}