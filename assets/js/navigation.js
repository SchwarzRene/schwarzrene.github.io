/**
 * Navigation Module - Keyboard Navigation & Mobile Menu
 * WCAG 2.1 Compliance: Escape key handling, Focus management
 */

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');

  if (!toggle || !nav) return;

  /**
   * Toggle Mobile Menu
   * When clicked, toggle aria-expanded and is-open class
   */
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    const newState = !isOpen;

    toggle.setAttribute('aria-expanded', String(newState));
    nav.classList.toggle('is-open', newState);
    // ✅ aria-expanded wird korrekt aktualisiert

    // Update aria-label for screen readers
    const label = newState ? 'Close navigation menu' : 'Open navigation menu';
    toggle.setAttribute('aria-label', label);

    // On open, optionally focus the first link
    if (newState) {
      const firstLink = nav.querySelector('a');
      if (firstLink) setTimeout(() => firstLink.focus(), 50);
    }
  });

  /**
   * Close Menu on Escape (WCAG 2.1.1 - Keyboard accessible)
   * Important: Escape should close the menu and return focus to toggle
   */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        e.preventDefault();
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus(); // Return focus to toggle button
        toggle.setAttribute('aria-label', 'Open navigation menu');
      }
    }
  });

  /**
   * Close Menu on Click Outside
   * User clicks outside nav area → close menu
   */
  document.addEventListener('click', (e) => {
    const isClickInNav = nav.contains(e.target);
    const isClickOnToggle = toggle.contains(e.target);

    if (!isClickInNav && !isClickOnToggle) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    }
  });

  /**
   * Close Menu When Link is Clicked
   * Allows quick navigation on mobile
   */
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

/**
 * Initialize navigation when DOM is ready
 * This runs AFTER components.js has loaded the header
 */
document.addEventListener('DOMContentLoaded', () => {
  // Wait a tick for components to load
  setTimeout(() => {
    initMobileNav();
  }, 0);
});

/**
 * Also listen for header being inserted
 * (in case components load asynchronously)
 */
const observer = new MutationObserver(() => {
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && !toggle.dataset.navigationInitialized) {
    toggle.dataset.navigationInitialized = 'true';
    initMobileNav();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

/**
 * Login Modal Handler
 */
function initLoginModal() {
  const loginBtn = document.getElementById('login-btn');
  const loginModal = document.getElementById('login-modal');
  const loginClose = document.getElementById('login-close');
  const loginForm = document.getElementById('login-form');

  if (!loginBtn || !loginModal) return;

  // Open modal
  loginBtn.addEventListener('click', () => {
    loginModal.removeAttribute('hidden');
    loginModal.focus();
  });

  // Close modal
  loginClose.addEventListener('click', () => {
    loginModal.setAttribute('hidden', '');
    loginBtn.focus();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !loginModal.hasAttribute('hidden')) {
      loginModal.setAttribute('hidden', '');
      loginBtn.focus();
    }
  });

  // Close on click outside
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.setAttribute('hidden', '');
      loginBtn.focus();
    }
  });

  // Prevent form submission (demo only)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Demo-Modus: Dieses Formular funktioniert nicht. Es ist nur zu Demonstrationszwecken.');
  });
}

// Initialize login modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initLoginModal();
  }, 0);
});

// Also listen for header being inserted
const loginObserver = new MutationObserver(() => {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn && !loginBtn.dataset.loginInitialized) {
    loginBtn.dataset.loginInitialized = 'true';
    initLoginModal();
  }
});

loginObserver.observe(document.body, { childList: true, subtree: true });
