let _cache = null;

export async function fetchServicesData() {
    if (_cache) return _cache;
    try {
        const res  = await fetch('/api/services/');
        const data = await res.json();
        _cache = data.services;
        return _cache;
    } catch (err) {
        console.error('Could not load services from API:', err);
        return [];
    }
}

export function initServiceModal() {
    const modal   = document.getElementById('serviceModal');
    if (!modal) return;

    const overlay    = modal.querySelector('.modal-overlay');
    const closeBtn   = modal.querySelector('.modal-close');
    const backBtn    = modal.querySelector('.modal-back-btn');

    const titleEl   = modal.querySelector('.modal-title');
    const descEl    = modal.querySelector('.modal-description');
    const featList  = modal.querySelector('.features-list');
    const reqList   = modal.querySelector('.requirements-list');
    const sv1       = modal.querySelector('.stat-value');
    const sl1       = modal.querySelector('.stat-label');
    const sv2       = modal.querySelector('.stat-value-2');
    const sl2       = modal.querySelector('.stat-label-2');
    const sv3       = modal.querySelector('.stat-value-3');
    const sl3       = modal.querySelector('.stat-label-3');

    function openModal(serviceData) {
        titleEl.textContent  = serviceData.title        || '';
        descEl.textContent   = serviceData.description  || '';

        featList.innerHTML = (serviceData.features || [])
            .map(f => `<li>${f}</li>`).join('') || '<li>—</li>';

        reqList.innerHTML = (serviceData.requirements || [])
            .map(r => `<li>${r}</li>`).join('') || '<li>—</li>';

        sv1.textContent = serviceData.stat_value1 || '—';
        sl1.textContent = serviceData.stat_label1 || '';
        sv2.textContent = serviceData.stat_value2 || '—';
        sl2.textContent = serviceData.stat_label2 || '';
        sv3.textContent = serviceData.stat_value3 || '—';
        sl3.textContent = serviceData.stat_label3 || '';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-view-details');
        if (!btn) return;

        const card  = btn.closest('.service-card');
        if (!card) return;

        titleEl.textContent = 'Loading…';
        descEl.textContent  = '';
        featList.innerHTML  = '';
        reqList.innerHTML   = '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const services = await fetchServicesData();
        const cardTitle = card.querySelector('.service-title')?.textContent?.trim();
        const svc = services.find(s => s.title === cardTitle) || services[0];

        if (svc) {
            openModal(svc);
        } else {
            titleEl.textContent = 'Service not found';
            descEl.textContent  = 'Could not load service details. Please try again.';
        }
    });

    closeBtn?.addEventListener('click', closeModal);
    backBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

export function initServiceCategories() {
    const buttons = document.querySelectorAll('.category-btn');
    const cards   = document.querySelectorAll('.service-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            cards.forEach(card => {
                const match = category === 'all' || card.dataset.category === category;
                card.style.display = match ? '' : 'none';
            });
        });
    });
}