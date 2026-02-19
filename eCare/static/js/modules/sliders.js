export function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (slides.length === 0) return;

    let currentSlide = 0;
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    setInterval(nextSlide, 5000);
}

export function initAssistanceCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    if (!carouselTrack) return;

    const cards = carouselTrack.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const indicators = document.querySelectorAll('.indicator');

    if (cards.length === 0) return;

    let currentIndex = 0;

    function getVisibleCount() {
        return window.innerWidth <= 600 ? 1 : 3;
    }

    function updateCarousel() {
        const visibleCount = getVisibleCount();
        const maxIndex = Math.max(0, cards.length - visibleCount);
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        cards.forEach((card, i) => {
            card.classList.remove('center', 'side');
            if (visibleCount === 1) {
                if (i === currentIndex) card.classList.add('center');
            } else {
                const center = currentIndex + Math.floor(visibleCount / 2);
                if (i === center) card.classList.add('center');
                else if (i === center - 1 || i === center + 1) card.classList.add('side');
            }
        });

        const cardWidth = cards[0].offsetWidth;
        const gap = window.innerWidth <= 600 ? 0 : 28;
        const offset = currentIndex * (cardWidth + gap);
        carouselTrack.style.transform = `translateX(-${offset}px)`;

        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;

        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) { currentIndex--; updateCarousel(); }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, cards.length - getVisibleCount());
            if (currentIndex < maxIndex) { currentIndex++; updateCarousel(); }
        });
    }

    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => { currentIndex = i; updateCarousel(); });
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
}