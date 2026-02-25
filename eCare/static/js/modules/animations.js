export function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.stat-card, .step-card, .team-card, .detailed-service-card'
    ).forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });

}

export function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target    = parseInt(element.getAttribute('data-target'));
    const duration  = 2000;
    const increment = target / (duration / 16);
    let current     = 0;

    const update = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    };
    update();
}