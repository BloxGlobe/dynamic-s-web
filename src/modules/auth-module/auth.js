// src/module/auth-module/auth.js

const API = "/api/auth";

const Auth = {
  user: null,
  isAuthenticated: false,

  async init() {
    await this.restoreSession();
    this.expose();
    console.log("[Auth] connected to backend");
  },

  async restoreSession() {
    try {
      const res = await fetch(`${API}/session`);
      if (!res.ok) return;

      const user = await res.json();
      if (user) {
        this.user = user;
        this.isAuthenticated = true;
      }
    } catch {}
  },

  async login(data) {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const user = await res.json();
    this._setUser(user);

    document.dispatchEvent(
      new CustomEvent("auth:login", { detail: user })
    );

    return user;
  },

  async signup(data) {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error("Signup failed");
    }

    const user = await res.json();
    this._setUser(user);

    document.dispatchEvent(
      new CustomEvent("auth:signup", { detail: user })
    );

    return user;
  },

  logout() {
    fetch(`${API}/logout`, { method: "POST" });
    this.user = null;
    this.isAuthenticated = false;

    document.dispatchEvent(new CustomEvent("auth:logout"));
  },

  requireAuth() {
    if (!this.isAuthenticated) {
      throw new Error("Authentication required");
    }
  },

  _setUser(user) {
    this.user = user;
    this.isAuthenticated = true;
  },

  expose() {
    window.Auth = this;
  }
};

// Initialize background session restore
Auth.init();

// Optional: mount a small client-side auth UI that uses Auth.login/signup.
// This keeps UI logic inside auth.js if a page wants to mount it.
export function mountAuth(container) {
  if (!container) throw new Error('container is required');

  const el = document.createElement('div');
  el.className = 'auth-mount';
  el.innerHTML = `
    <div class="auth-tabs">
      <button data-tab="login" class="active">Login</button>
      <button data-tab="register">Register</button>
    </div>
    <div class="auth-forms">
      <form data-form="login">
        <div class="auth-error"></div>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <form data-form="register" style="display:none">
        <div class="auth-error"></div>
        <input name="name" type="text" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Sign up</button>
      </form>
    </div>
  `;

  container.appendChild(el);

  const tabs = el.querySelectorAll('.auth-tabs button');
  const loginForm = el.querySelector('form[data-form="login"]');
  const registerForm = el.querySelector('form[data-form="register"]');

  function switchTab(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    loginForm.style.display = name === 'login' ? '' : 'none';
    registerForm.style.display = name === 'register' ? '' : 'none';
  }

  tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = loginForm.querySelector('.auth-error');
    errEl.textContent = '';
    try {
      const user = await Auth.login({ email: loginForm.email.value.trim(), password: loginForm.password.value });
      // event dispatched by Auth.login
    } catch (err) {
      errEl.textContent = err.message || 'Login failed';
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = registerForm.querySelector('.auth-error');
    errEl.textContent = '';
    try {
      const user = await Auth.signup({ name: registerForm.name.value.trim(), email: registerForm.email.value.trim(), password: registerForm.password.value });
      // event dispatched by Auth.signup
    } catch (err) {
      errEl.textContent = err.message || 'Signup failed';
    }
  });

  return { el, switchTab };
}

export default Auth;
