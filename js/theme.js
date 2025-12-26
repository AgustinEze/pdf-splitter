/**
 * Theme Management Module
 * Handles dark/light mode switching with localStorage persistence
 */

const Theme = {
  /**
   * Initialize theme system
   */
  init() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);
    this.setupToggle();
  },

  /**
   * Set theme and save to localStorage
   * @param {string} theme - 'dark' or 'light'
   */
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateToggleIcon(theme);

    // Track theme change in analytics if available
    if (window.Analytics && window.Analytics.trackEvent) {
      Analytics.trackEvent('settings', 'theme_changed', theme);
    }
  },

  /**
   * Toggle between dark and light themes
   */
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  },

  /**
   * Get current theme
   * @returns {string} Current theme ('dark' or 'light')
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },

  /**
   * Setup theme toggle button event listener
   */
  setupToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  },

  /**
   * Update toggle icon based on current theme
   * @param {string} theme - Current theme
   */
  updateToggleIcon(theme) {
    const iconElement = document.getElementById('themeIcon');
    if (!iconElement) return;

    // SVG for sun (light mode) and moon (dark mode)
    if (theme === 'dark') {
      // Show sun icon (to switch to light mode)
      iconElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      // Show moon icon (to switch to dark mode)
      iconElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }
};
