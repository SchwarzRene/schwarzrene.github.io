/**
 * Navigation Module - Mobile Menu & Login Modal
 * Burger menu is initialized exactly ONCE via MutationObserver.
 */

// ─── Mobile Nav ───────────────────────────────────────────────────────────────

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.getElementById('primary-navigation');

  if (!toggle || !nav) return;
  // Guard: only attach listeners once
  if (toggle.dataset.navReady === 'true') return;
  toggle.dataset.navReady = 'true';

  function openMenu() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Navigationsmenü schließen');
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Navigationsmenü öffnen');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close when a nav link is clicked
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });
}

// ─── Login Modal ──────────────────────────────────────────────────────────────

function initLoginModal() {
  const loginBtn   = document.getElementById('login-btn');
  const loginModal = document.getElementById('login-modal');
  const loginClose = document.getElementById('login-close');
  const loginForm  = document.getElementById('login-form');

  if (!loginBtn || !loginModal) return;
  if (loginBtn.dataset.loginReady === 'true') return;
  loginBtn.dataset.loginReady = 'true';

  loginBtn.addEventListener('click', () => {
    loginModal.removeAttribute('hidden');
    loginModal.focus();
  });

  loginClose.addEventListener('click', () => {
    loginModal.setAttribute('hidden', '');
    loginBtn.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !loginModal.hasAttribute('hidden')) {
      loginModal.setAttribute('hidden', '');
      loginBtn.focus();
    }
  });

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.setAttribute('hidden', '');
      loginBtn.focus();
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Demo-Modus: Dieses Formular funktioniert nicht.');
    });
  }
}

// ─── Bootstrap: watch for header being injected ───────────────────────────────

const navObserver = new MutationObserver(() => {
  const toggle   = document.querySelector('.nav-toggle');
  const loginBtn = document.getElementById('login-btn');

  if (toggle) {
    initMobileNav();   // guard inside prevents duplicate registration
    navObserver.disconnect(); // stop watching once header is found
  }
  if (loginBtn) {
    initLoginModal();  // guard inside prevents duplicate registration
  }
});

navObserver.observe(document.body, { childList: true, subtree: true });
