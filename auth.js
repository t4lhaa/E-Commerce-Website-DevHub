/* ═══════════════════════════════════════════════════════════
   AUTH.JS — Shared authentication module for Brand E-commerce
   Include this script on every page BEFORE page-specific scripts
═══════════════════════════════════════════════════════════ */

/* ── Database helpers ── */
const AuthDB = {
  getUsers() {
    return JSON.parse(localStorage.getItem('brand_users')) || [];
  },
  saveUsers(users) {
    localStorage.setItem('brand_users', JSON.stringify(users));
  },
  getCurrentUser() {
    const id = localStorage.getItem('brand_current_user');
    if (!id) return null;
    return this.getUsers().find(u => u.id === id) || null;
  },
  login(user) {
    localStorage.setItem('brand_current_user', user.id);
  },
  logout() {
    localStorage.removeItem('brand_current_user');
  },
  register(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: 'USR-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // plain-text fine for this local demo
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    return { success: true, user: newUser };
  },
  validateLogin(email, password) {
    const user = this.getUsers().find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    return user || null;
  },

  /* ── Per-user scoped data (orders, messages, etc.) ── */
  // Returns the storage key scoped to the current user
  _userKey(key) {
    const id = localStorage.getItem('brand_current_user');
    if (!id) return key; // fallback (shouldn't happen when logged in)
    return key + '_' + id;
  },
  // Get data scoped to the current user
  getUserData(key) {
    return JSON.parse(localStorage.getItem(this._userKey(key))) || [];
  },
  // Set data scoped to the current user
  setUserData(key, value) {
    localStorage.setItem(this._userKey(key), JSON.stringify(value));
  },
  // Remove data scoped to the current user (used on account delete)
  removeUserData(key) {
    localStorage.removeItem(this._userKey(key));
  }
};

/* ── Auth Modal HTML (injected once per page) ── */
function injectAuthModal() {
  if (document.getElementById('brand-auth-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'brand-auth-modal';
  modal.innerHTML = `
    <div class="bam-overlay" id="bam-overlay">
      <div class="bam-card" id="bam-card">
        <!-- LOGIN PANEL -->
        <div class="bam-panel" id="bam-login-panel">
          <button class="bam-close" id="bam-close">&#x2715;</button>
          <div class="bam-logo">Brand</div>
          <h2 class="bam-title">Welcome back</h2>
          <p class="bam-sub">Sign in to your account</p>

          <div class="bam-error" id="bam-login-error"></div>

          <label class="bam-label">Email</label>
          <input class="bam-input" id="bam-login-email" type="email" placeholder="you@example.com" autocomplete="email"/>

          <label class="bam-label">Password</label>
          <input class="bam-input" id="bam-login-password" type="password" placeholder="Enter your password" autocomplete="current-password"/>

          <button class="bam-btn-primary" id="bam-login-submit">Sign in</button>

          <p class="bam-switch">Don't have an account? <button class="bam-link" id="bam-go-register">Join now</button></p>
        </div>

        <!-- REGISTER PANEL -->
        <div class="bam-panel" id="bam-register-panel" style="display:none">
          <button class="bam-close" id="bam-close-reg">&#x2715;</button>
          <div class="bam-logo">Brand</div>
          <h2 class="bam-title">Create account</h2>
          <p class="bam-sub">Join thousands of happy shoppers</p>

          <div class="bam-error" id="bam-reg-error"></div>

          <label class="bam-label">Full name</label>
          <input class="bam-input" id="bam-reg-name" type="text" placeholder="Your full name" autocomplete="name"/>

          <label class="bam-label">Email</label>
          <input class="bam-input" id="bam-reg-email" type="email" placeholder="you@example.com" autocomplete="email"/>

          <label class="bam-label">Password</label>
          <input class="bam-input" id="bam-reg-password" type="password" placeholder="Create a password (min 6 chars)" autocomplete="new-password"/>

          <button class="bam-btn-primary" id="bam-reg-submit">Create account</button>

          <p class="bam-switch">Already a user? <button class="bam-link" id="bam-go-login">Sign in</button></p>
        </div>

        <!-- SUCCESS PANEL -->
        <div class="bam-panel" id="bam-success-panel" style="display:none">
          <div class="bam-success-icon">✓</div>
          <h2 class="bam-title" id="bam-success-title">Signed in!</h2>
          <p class="bam-sub" id="bam-success-sub">Welcome back.</p>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  /* styles */
  const style = document.createElement('style');
  style.textContent = `
    .bam-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 2000;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(2px);
    }
    .bam-overlay.open { display: flex; }
    .bam-card {
      background: #fff;
      border-radius: 16px;
      width: 100%;
      max-width: 400px;
      padding: 36px 32px 28px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.22);
      position: relative;
      animation: bamIn .22s cubic-bezier(.34,1.56,.64,1);
      font-family: Inter, sans-serif;
    }
    @keyframes bamIn {
      from { transform: scale(.9) translateY(20px); opacity: 0; }
      to   { transform: scale(1) translateY(0);     opacity: 1; }
    }
    .bam-panel { display: flex; flex-direction: column; }
    .bam-close {
      position: absolute; top: 14px; right: 16px;
      background: none; border: none; font-size: 18px;
      color: #aaa; cursor: pointer; line-height: 1;
      padding: 4px 8px; border-radius: 4px;
      transition: background .15s;
    }
    .bam-close:hover { background: #f0f0f0; color: #333; }
    .bam-logo {
      font-size: 22px; font-weight: 800;
      color: #8cb7f5; letter-spacing: -0.5px;
      margin-bottom: 16px;
    }
    .bam-title { font-size: 22px; font-weight: 700; color: #1c1c1c; margin-bottom: 4px; }
    .bam-sub   { font-size: 13px; color: #8b96a5; margin-bottom: 20px; }
    .bam-label { font-size: 13px; font-weight: 500; color: #505050; margin-bottom: 5px; }
    .bam-input {
      width: 100%; padding: 10px 13px;
      border: 1.5px solid #e3e8ee;
      border-radius: 8px; font-size: 14px;
      font-family: Inter, sans-serif;
      outline: none; margin-bottom: 14px;
      transition: border-color .15s;
    }
    .bam-input:focus { border-color: #0d7dfa; }
    .bam-btn-primary {
      width: 100%; padding: 11px;
      background: #0d7dfa; color: #fff;
      border: none; border-radius: 8px;
      font-size: 15px; font-weight: 600;
      cursor: pointer; font-family: Inter, sans-serif;
      transition: background .15s;
      margin-top: 4px;
    }
    .bam-btn-primary:hover { background: #0b6cd8; }
    .bam-switch { font-size: 13px; color: #8b96a5; text-align: center; margin-top: 16px; }
    .bam-link {
      background: none; border: none;
      color: #0d7dfa; font-size: 13px; font-weight: 500;
      cursor: pointer; font-family: Inter, sans-serif;
      padding: 0; text-decoration: underline;
    }
    .bam-error {
      background: #fff3f3; border: 1px solid #ffcdd2;
      color: #c62828; font-size: 13px;
      border-radius: 6px; padding: 9px 12px;
      margin-bottom: 12px; display: none;
    }
    .bam-error.show { display: block; }
    .bam-success-icon {
      width: 64px; height: 64px; background: #e8f9ed;
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-size: 28px; color: #00b517;
      margin: 0 auto 16px;
    }
    .bam-success-panel { text-align: center; }
    .bam-success-panel .bam-title { margin-bottom: 6px; }

    /* Not-logged-in gate used on cart/orders/messages */
    .bam-gate {
      text-align: center;
      padding: 60px 24px;
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e3e8ee;
    }
    .bam-gate-icon {
      width: 72px; height: 72px;
      background: #e3f0ff;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      font-size: 32px; color: #0d7dfa;
    }
    .bam-gate h3 { font-size: 20px; font-weight: 700; color: #1c1c1c; margin-bottom: 8px; }
    .bam-gate p  { font-size: 14px; color: #8b96a5; margin-bottom: 24px; line-height: 1.6; }
    .bam-gate-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .bam-gate-btn-primary {
      background: #0d7dfa; color: #fff;
      border: none; border-radius: 8px;
      padding: 11px 28px; font-size: 14px; font-weight: 600;
      cursor: pointer; font-family: Inter, sans-serif;
      transition: background .15s;
    }
    .bam-gate-btn-primary:hover { background: #0b6cd8; }
    .bam-gate-btn-secondary {
      background: #fff; color: #1c1c1c;
      border: 1.5px solid #dee2e6; border-radius: 8px;
      padding: 11px 28px; font-size: 14px; font-weight: 600;
      cursor: pointer; font-family: Inter, sans-serif;
      transition: background .15s;
    }
    .bam-gate-btn-secondary:hover { background: #f7fafc; }

    /* Toast notification */
    #bam-toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #1c1c1c; color: #fff;
      padding: 12px 22px; border-radius: 8px;
      font-size: 14px; font-family: Inter, sans-serif;
      z-index: 3000; opacity: 0; pointer-events: none;
      transition: opacity .3s; white-space: nowrap;
    }
    #bam-toast.show { opacity: 1; }
  `;
  document.head.appendChild(style);

  /* Wire up events */
  const overlay = document.getElementById('bam-overlay');
  const loginPanel = document.getElementById('bam-login-panel');
  const registerPanel = document.getElementById('bam-register-panel');
  const successPanel = document.getElementById('bam-success-panel');

  function showPanel(name) {
    loginPanel.style.display    = name === 'login'    ? 'flex' : 'none';
    registerPanel.style.display = name === 'register' ? 'flex' : 'none';
    successPanel.style.display  = name === 'success'  ? 'flex' : 'none';
    clearErrors();
  }

  function clearErrors() {
    ['bam-login-error','bam-reg-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.remove('show'); }
    });
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); }
  }

  /* Close */
  function closeAuthModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('bam-close').addEventListener('click', closeAuthModal);
  document.getElementById('bam-close-reg').addEventListener('click', closeAuthModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeAuthModal(); });

  /* Panel switches */
  document.getElementById('bam-go-register').addEventListener('click', () => showPanel('register'));
  document.getElementById('bam-go-login').addEventListener('click',    () => showPanel('login'));

  /* Login submit */
  document.getElementById('bam-login-submit').addEventListener('click', () => {
    const email    = document.getElementById('bam-login-email').value.trim();
    const password = document.getElementById('bam-login-password').value;
    if (!email || !password) return showError('bam-login-error', 'Please fill in all fields.');
    const user = AuthDB.validateLogin(email, password);
    if (!user) return showError('bam-login-error', 'Incorrect email or password.');
    AuthDB.login(user);
    showPanel('success');
    document.getElementById('bam-success-title').textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    document.getElementById('bam-success-sub').textContent   = 'You are now signed in.';
    updateHeaderForUser(user);
    setTimeout(() => {
      closeAuthModal();
      if (typeof onAuthSuccess === 'function') onAuthSuccess(user);
    }, 1400);
  });

  /* Register submit */
  document.getElementById('bam-reg-submit').addEventListener('click', () => {
    const name     = document.getElementById('bam-reg-name').value.trim();
    const email    = document.getElementById('bam-reg-email').value.trim();
    const password = document.getElementById('bam-reg-password').value;
    if (!name)                     return showError('bam-reg-error', 'Please enter your full name.');
    if (!email || !email.includes('@')) return showError('bam-reg-error', 'Please enter a valid email.');
    if (password.length < 6)       return showError('bam-reg-error', 'Password must be at least 6 characters.');
    const result = AuthDB.register(name, email, password);
    if (!result.success) return showError('bam-reg-error', result.error);
    AuthDB.login(result.user);
    showPanel('success');
    document.getElementById('bam-success-title').textContent = `Welcome, ${result.user.name.split(' ')[0]}!`;
    document.getElementById('bam-success-sub').textContent   = 'Your account has been created.';
    updateHeaderForUser(result.user);
    setTimeout(() => {
      closeAuthModal();
      if (typeof onAuthSuccess === 'function') onAuthSuccess(result.user);
    }, 1400);
  });

  /* Enter key support */
  document.getElementById('bam-login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('bam-login-submit').click();
  });
  document.getElementById('bam-reg-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('bam-reg-submit').click();
  });
}

/* ── Open modal helpers (global) ── */
function openLoginModal(startPanel) {
  injectAuthModal();
  const overlay = document.getElementById('bam-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  const loginPanel    = document.getElementById('bam-login-panel');
  const registerPanel = document.getElementById('bam-register-panel');
  const successPanel  = document.getElementById('bam-success-panel');
  if (loginPanel)    loginPanel.style.display    = startPanel === 'register' ? 'none' : 'flex';
  if (registerPanel) registerPanel.style.display = startPanel === 'register' ? 'flex' : 'none';
  if (successPanel)  successPanel.style.display  = 'none';
  const errEls = document.querySelectorAll('.bam-error');
  errEls.forEach(el => { el.textContent = ''; el.classList.remove('show'); });
}

/* ── Toast ── */
function showAuthToast(msg) {
  let toast = document.getElementById('bam-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bam-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── Update header to show user name / logout ── */
function updateHeaderForUser(user) {
  // Desktop profile action item
  const profileItems = document.querySelectorAll('.ui-action-item');
  profileItems.forEach(item => {
    const label = item.querySelector('.ui-label');
    if (label && label.textContent.trim() === 'Profile') {
      item.style.cursor = 'pointer';
      label.textContent = user ? user.name.split(' ')[0] : 'Profile';
      item.title = user ? 'View profile' : 'Sign in';
      item.onclick = () => {
        if (user) window.location.href = 'profile.html';
        else openLoginModal('login');
      };
    }
  });

  // Mobile nav header
  const authText = document.querySelector('.ui-auth-text');
  if (authText) {
    if (user) {
      authText.innerHTML = `<span style="font-weight:600;color:#1c1c1c;">${user.name}</span>
        <br><span style="font-size:13px;color:#8b96a5;">${user.email}</span>
        <br><button onclick="AuthDB.logout();location.reload();" style="margin-top:8px;background:#0d7dfa;color:#fff;border:none;border-radius:6px;padding:5px 14px;font-size:13px;cursor:pointer;font-family:inherit;">Sign out</button>`;
    } else {
      authText.innerHTML = `<button onclick="openLoginModal('login')" style="background:#0d7dfa;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:14px;cursor:pointer;font-family:inherit;margin-right:8px;">Sign in</button>
        <button onclick="openLoginModal('register')" style="background:#fff;color:#0d7dfa;border:1.5px solid #0d7dfa;border-radius:6px;padding:7px 16px;font-size:14px;cursor:pointer;font-family:inherit;">Join now</button>`;
    }
  }
}

/* ── Build "not logged in" gate card ── */
function buildAuthGate(icon, title, desc) {
  return `
    <div class="bam-gate">
      <div class="bam-gate-icon"><i class="ph-fill ${icon}"></i></div>
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="bam-gate-actions">
        <button class="bam-gate-btn-primary" onclick="openLoginModal('login')">Sign in</button>
        <button class="bam-gate-btn-secondary" onclick="openLoginModal('register')">Create account</button>
      </div>
    </div>`;
}

/* ── Init on every page load ── */
document.addEventListener('DOMContentLoaded', () => {
  injectAuthModal();
  const user = AuthDB.getCurrentUser();
  updateHeaderForUser(user);

  // Make profile icon clickable on every page
  document.querySelectorAll('.ui-action-item').forEach(item => {
    const label = item.querySelector('.ui-label');
    if (label && label.textContent.trim() === 'Profile') {
      item.style.cursor = 'pointer';
      item.onclick = () => {
        if (AuthDB.getCurrentUser()) window.location.href = 'profile.html';
        else openLoginModal('login');
      };
    }
  });
});