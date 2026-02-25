import { createConfetti } from '../helpers.js';
import { scrollTo } from './ui.js';

function getCsrfToken() {
  const value = `; ${document.cookie}`;
  const parts = value.split('; csrftoken=');
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

function postJSON(url, data) {
  return fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken':  getCsrfToken(),
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

export function initAssistanceForm() {
  const form = document.getElementById('assistForm');
  if (!form) return;

  const steps          = form.querySelectorAll('.form-step');
  const progressFill   = document.getElementById('progressFill');
  const currentStepEl  = document.getElementById('currentStep');
  const successMessage = document.getElementById('successMessage');
  const referenceEl    = document.getElementById('referenceNumber');
  let currentStep      = 1;

  function updateStep(step) {
    steps.forEach(s => s.classList.remove('active'));
    steps[step - 1].classList.add('active');
    currentStep = step;
    if (currentStepEl) currentStepEl.textContent = step;
    if (progressFill)  progressFill.style.width  = `${(step / steps.length) * 100}%`;
    scrollTo(form.getBoundingClientRect().top + window.scrollY - 100);
  }

  function validateCurrentStep() {
    const inputs = steps[currentStep - 1].querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = 'var(--error)';
        setTimeout(() => (input.style.borderColor = ''), 2000);
      }
    });
    return valid;
  }

  form.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentStep() && currentStep < steps.length) updateStep(currentStep + 1);
    });
  });

  form.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) updateStep(currentStep - 1);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const submitBtn    = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…'; submitBtn.disabled = true; }

    try {
      const result = await postJSON('/assistance/submit/', {
        firstName:     form.querySelector('[name="firstName"]')?.value    || '',
        lastName:      form.querySelector('[name="lastName"]')?.value     || '',
        email:         form.querySelector('[name="email"]')?.value        || '',
        phone:         form.querySelector('[name="phone"]')?.value        || '',
        address:       form.querySelector('[name="address"]')?.value      || '',
        assistanceType: form.querySelector('[name="assistanceType"]')?.value || '',
        urgency:       form.querySelector('[name="urgency"]')?.value      || 'medium',
        description:   form.querySelector('[name="description"]')?.value  || '',
      });

      if (result.success) {
        if (referenceEl) referenceEl.textContent = result.reference_number;
        form.style.display = 'none';
        if (successMessage) {
          successMessage.classList.remove('hidden');
          scrollTo(successMessage.getBoundingClientRect().top + window.scrollY - 100);
        }
        createConfetti();
      } else {
        alert(result.message || 'Submission failed. Please try again.');
        if (submitBtn) { submitBtn.innerHTML = originalHTML; submitBtn.disabled = false; }
      }
    } catch {
      alert('Something went wrong. Please try again.');
      if (submitBtn) { submitBtn.innerHTML = originalHTML; submitBtn.disabled = false; }
    }
  });
}

export function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMessage = document.getElementById('contactSuccess');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn    = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.textContent = 'Sending…'; submitBtn.disabled = true; }

    try {
      const result = await postJSON('/contact/submit/', {
        firstName: document.getElementById('firstName')?.value || '',
        lastName:  document.getElementById('lastName')?.value  || '',
        email:     document.getElementById('email')?.value     || '',
        phone:     document.getElementById('phone')?.value     || '',
        message:   document.getElementById('message')?.value   || '',
      });

      if (result.success) {
        form.style.display = 'none';
        if (successMessage) {
          successMessage.classList.remove('hidden');
          scrollTo(successMessage.getBoundingClientRect().top + window.scrollY - 100);
        }
        createConfetti();
      } else {
        alert(result.message || 'Submission failed.');
        if (submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
      }
    } catch {
      alert('Something went wrong. Please try again.');
      if (submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
    }
  });
}

export function initCharacterCount() {
  const textarea = document.getElementById('contactMessage');
  const charCount = document.getElementById('charCount');
  if (!textarea || !charCount) return;

  textarea.addEventListener('input', () => {
    const count = textarea.value.length;
    charCount.textContent = Math.min(count, 500);
    charCount.style.color = count > 500 ? 'var(--error)' : 'var(--primary)';
    if (count > 500) textarea.value = textarea.value.substring(0, 500);
  });
}