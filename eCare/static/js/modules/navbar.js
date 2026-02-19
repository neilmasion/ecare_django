export function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

export function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navCenter = document.querySelector('.nav-center');

    if (!toggle || !navCenter) return;

    toggle.addEventListener('click', () => {
        navCenter.classList.toggle('active');

        const icon = toggle.querySelector('i');
        if (navCenter.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !navCenter.contains(e.target)) {
            navCenter.classList.remove('active');
            const icon = toggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}