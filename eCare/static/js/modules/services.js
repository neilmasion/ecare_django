import { fetchServicesData } from '../data/services.js';

export function initServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (!modal) return;

    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    const backBtn = modal.querySelector('.modal-back-btn');

    fetchServicesData().then(servicesData => {
        document.querySelectorAll('.btn-view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.service-card');
                const title = card?.querySelector('.service-title')?.textContent?.trim();
                const service = servicesData[title];

                if (service) {
                    populateModal(service);
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backBtn) backBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    modal.querySelector('.modal-content')?.addEventListener('wheel', e => e.stopPropagation());
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

function populateModal(data) {
    const modal = document.getElementById('serviceModal');

    const desc = modal.querySelector('.modal-description');
    if (desc) desc.textContent = data.description;

    const features = modal.querySelector('.features-list');
    if (features) {
        features.innerHTML = '';
        data.features.forEach(f => {
            const li = document.createElement('li');
            li.textContent = f;
            features.appendChild(li);
        });
    }

    const reqs = modal.querySelector('.requirements-list');
    if (reqs) {
        reqs.innerHTML = '';
        data.requirements.forEach(r => {
            const li = document.createElement('li');
            li.textContent = r;
            reqs.appendChild(li);
        });
    }

    if (data.stats) {
        const set = (sel, val) => { const el = modal.querySelector(sel); if (el) el.textContent = val; };
        set('.stat-value', data.stats.value1);
        set('.stat-label', data.stats.label1);
        set('.stat-value-2', data.stats.value2);
        set('.stat-label-2', data.stats.label2);
        set('.stat-value-3', data.stats.value3);
        set('.stat-label-3', data.stats.label3);
    }
}

export function initServiceCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const cards = document.querySelectorAll('.service-card, .detailed-service-card');
    if (!categoryBtns.length) return;

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach(card => {
                const cardCat = card.dataset.category;
                const show = category === 'all' || cardCat === category;
                card.classList.remove('expanded');

                if (show) {
                    card.style.display = 'block';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });
}