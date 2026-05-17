/**
 * Component Loader - Loads Header & Footer HTML snippets
 * Ensures DRY principle: changes in header/footer apply to all pages
 */

async function loadComponent(placeholderId, componentPath) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  try {
    const response = await fetch(componentPath);
    if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
    const html = await response.text();
    placeholder.outerHTML = html; // Replace placeholder with actual component
  } catch (error) {
    console.error(`Component load error (${componentPath}):`, error);
    // Fallback: keep placeholder visible (graceful degradation)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Load header and footer in parallel
  await Promise.all([
    loadComponent('header-placeholder', '/components/header.html'),
    loadComponent('footer-placeholder', '/components/footer.html'),
  ]);

  // After components are loaded, set active nav link
  // (initMobileNav is handled by MutationObserver in navigation.js)
  setTimeout(() => {
    setActiveNavLink();
  }, 0);

  // Update year in footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

/**
 * Set aria-current="page" on the active navigation link
 * Helps screen reader users understand which page they're on
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname
    .replace(/\/$/, '') // Remove trailing slash
    .split('/')
    .pop() // Get filename
    || 'index.html'; // Default to index.html if root

  // Ensure .html extension
  const activePath = currentPath.includes('.html') ? currentPath : `${currentPath}.html`;

  document.querySelectorAll('nav a').forEach((link) => {
    const linkHref = link.getAttribute('href')
      .replace(/\/$/, '')
      .split('/')
      .pop();

    if (linkHref === activePath || (activePath === 'index.html' && linkHref === '/index.html')) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
