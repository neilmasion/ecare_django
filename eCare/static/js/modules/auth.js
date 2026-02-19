import { initSmoothScroll } from './ui.js';

function getCsrfToken() {
  const name  = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

function postJSON(url, data) {
  return fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'X-CSRFToken':   getCsrfToken(),
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

export function initAuth() {
  initAuthTabs();
  initPasswordToggles();
  initPasswordStrength();
  initSignInForm();
  initSignUpForm();
  initAuthInputAnimations();
}

function initAuthTabs() {
  const switchLinks = document.querySelectorAll('.switch-link');
  const containers  = document.querySelectorAll('.auth-form-container');
  if (!switchLinks.length) return;

  switchLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-tab');
      containers.forEach(c => {
        c.classList.toggle('active', c.id === `${target}-container`);
      });
    });
  });
}

function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.parentElement.querySelector('input');
      const icon  = this.querySelector('i');
      const show  = input.type === 'password';
      input.type  = show ? 'text' : 'password';
      icon.classList.toggle('fa-eye',      !show);
      icon.classList.toggle('fa-eye-slash', show);
    });
  });
}

function initPasswordStrength() {
  const pwd = document.getElementById('signupPassword');
  if (!pwd) return;

  pwd.addEventListener('input', function () {
    const v    = this.value;
    const fill = document.querySelector('.strength-fill');
    const text = document.querySelector('.strength-text');
    if (!fill || !text) return;

    let score = 0;
    if (v.length >= 8)  score++;
    if (v.length >= 12) score++;
    if (/\d/.test(v))   score++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    fill.classList.remove('weak', 'medium', 'strong');
    if      (score <= 2) { fill.classList.add('weak');   text.textContent = 'Weak password';   text.style.color = 'var(--error)';   }
    else if (score <= 4) { fill.classList.add('medium'); text.textContent = 'Medium password'; text.style.color = 'var(--warning)'; }
    else                 { fill.classList.add('strong'); text.textContent = 'Strong password'; text.style.color = 'var(--success)'; }
  });
}

function initSignInForm() {
  const form = document.getElementById('signinForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn   = this.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Signing in…</span>';
    submitBtn.disabled  = true;

    try {
      const result = await postJSON('/account/login/', {
        email:    document.getElementById('email').value,
        password: document.getElementById('password').value,
      });

      if (result.success) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Success!</span>';
        setTimeout(() => { window.location.href = '/'; }, 800);
      } else {
        alert(result.message || 'Login failed.');
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled  = false;
      }
    } catch {
      alert('Something went wrong. Please try again.');
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled  = false;
    }
  });
}

function initSignUpForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const password = document.getElementById('signupPassword').value;
    const confirm  = document.getElementById('confirmPassword').value;
    const terms    = document.querySelector('input[name="terms"]').checked;

    if (password !== confirm) { alert('Passwords do not match!'); return; }
    if (!terms)               { alert('Please accept the Terms of Service.'); return; }

    const submitBtn    = this.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Creating account…</span>';
    submitBtn.disabled  = true;

    try {
      const result = await postJSON('/account/signup/', {
        firstName: document.getElementById('firstName').value,
        lastName:  document.getElementById('lastName').value,
        email:     document.getElementById('signupEmail').value,
        phone:     document.getElementById('phone').value,
        password,
      });

      if (result.success) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Done!</span>';
        setTimeout(() => { window.location.href = '/'; }, 800);
      } else {
        alert(result.message || 'Sign-up failed.');
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled  = false;
      }
    } catch {
      alert('Something went wrong. Please try again.');
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled  = false;
    }
  });
}

function initAuthInputAnimations() {
  document.querySelectorAll('.input-wrapper input').forEach(input => {
    input.addEventListener('focus', () => { input.parentElement.style.transform = 'translateY(-2px)'; });
    input.addEventListener('blur',  () => { input.parentElement.style.transform = 'translateY(0)'; });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initSmoothScroll();
});