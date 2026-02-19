function getCsrfToken() {
  const value = `; ${document.cookie}`;
  const parts = value.split('; csrftoken=');
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

function postJSON(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken() },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

function showMessage(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = `form-message ${type}`;
  setTimeout(() => { el.className = 'form-message hidden'; }, 4000);
}

function initTabs() {
  const tabs   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
    });
  });
}

function initAvatarUpload() {
  const input       = document.getElementById('avatarUpload');
  const avatarImg   = document.getElementById('avatarImg');
  const placeholder = document.getElementById('avatarPlaceholder');
  if (!input) return;

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (avatarImg) {
        avatarImg.src = e.target.result;
        avatarImg.style.display = 'block';
      }
      if (placeholder) placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch('/profile/upload-avatar/', {
        method: 'POST',
        headers: { 'X-CSRFToken': getCsrfToken() },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) alert('Avatar upload failed: ' + data.message);
    } catch {
      alert('Something went wrong uploading your avatar.');
    }
  });
}

function initProfileForm() {
  const form = document.getElementById('profileForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Saving…</span>';
    btn.disabled = true;

    const data = {
      firstName: form.querySelector('[name="firstName"]').value,
      lastName:  form.querySelector('[name="lastName"]').value,
      email:     form.querySelector('[name="email"]').value,
      phone:     form.querySelector('[name="phone"]').value,
      bio:       form.querySelector('[name="bio"]').value,
    };

    try {
      const result = await postJSON('/profile/update/', data);
      if (result.success) {
        showMessage('profileMsg', '✓ ' + result.message, 'success');
      } else {
        showMessage('profileMsg', result.message, 'error');
      }
    } catch {
      showMessage('profileMsg', 'Something went wrong. Please try again.', 'error');
    } finally {
      btn.innerHTML = orig;
      btn.disabled = false;
    }
  });
}

function initPasswordForm() {
  const form = document.getElementById('passwordForm');
  if (!form) return;

  const newPwdInput = form.querySelector('[name="newPassword"]');
  if (newPwdInput) {
    newPwdInput.addEventListener('input', () => {
      const v    = newPwdInput.value;
      const fill = form.querySelector('.strength-fill');
      const text = form.querySelector('.strength-text');
      if (!fill || !text) return;

      let score = 0;
      if (v.length >= 8)  score++;
      if (v.length >= 12) score++;
      if (/\d/.test(v))   score++;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;

      fill.classList.remove('weak', 'medium', 'strong');
      if      (score <= 2) { fill.classList.add('weak');   text.textContent = 'Weak password';   text.style.color = 'var(--error)'; }
      else if (score <= 4) { fill.classList.add('medium'); text.textContent = 'Medium password'; text.style.color = 'var(--warning)'; }
      else                 { fill.classList.add('strong'); text.textContent = 'Strong password'; text.style.color = 'var(--success)'; }
    });
  }

  form.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const icon  = btn.querySelector('i');
      const show  = input.type === 'password';
      input.type  = show ? 'text' : 'password';
      icon.classList.toggle('fa-eye',       !show);
      icon.classList.toggle('fa-eye-slash',  show);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Updating…</span>';
    btn.disabled  = true;

    try {
      const result = await postJSON('/profile/change-password/', {
        currentPassword: form.querySelector('[name="currentPassword"]').value,
        newPassword:     form.querySelector('[name="newPassword"]').value,
        confirmPassword: form.querySelector('[name="confirmPassword"]').value,
      });

      if (result.success) {
        showMessage('passwordMsg', '✓ ' + result.message, 'success');
        form.reset();
        const fill = form.querySelector('.strength-fill');
        const text = form.querySelector('.strength-text');
        if (fill) { fill.className = 'strength-fill'; }
        if (text) { text.textContent = 'Password strength'; text.style.color = ''; }
      } else {
        showMessage('passwordMsg', result.message, 'error');
      }
    } catch {
      showMessage('passwordMsg', 'Something went wrong. Please try again.', 'error');
    } finally {
      btn.innerHTML = orig;
      btn.disabled  = false;
    }
  });
}

function initLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const res  = await fetch('/account/logout/', { method: 'POST', headers: { 'X-CSRFToken': getCsrfToken() } });
    const data = await res.json();
    if (data.success) window.location.href = '/account/';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initAvatarUpload();
  initProfileForm();
  initPasswordForm();
  initLogout();
});