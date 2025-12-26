/**
 * Internationalization (i18n) Module
 * Handles multi-language support with auto-detection and localStorage persistence
 */

const i18n = {
  currentLanguage: 'es',
  translations: {},
  supportedLanguages: ['es', 'en', 'pt'],

  /**
   * Initialize i18n system
   * Detects browser language and loads appropriate translations
   */
  async init() {
    try {
      // Get browser language (first 2 chars, e.g., 'en' from 'en-US')
      const browserLang = navigator.language.substring(0, 2).toLowerCase();

      // Check for saved language preference
      const savedLang = localStorage.getItem('language');

      // Determine which language to use
      let lang = savedLang;
      if (!lang) {
        // Use browser language if supported, otherwise default to Spanish
        lang = this.supportedLanguages.includes(browserLang) ? browserLang : 'es';
      }

      await this.loadLanguage(lang);

      // Setup language selector event listener
      this.setupLanguageSelector();
    } catch (error) {
      console.error('i18n initialization error:', error);
      // Fallback to Spanish if there's an error
      await this.loadLanguage('es');
    }
  },

  /**
   * Setup language selector dropdown event listener
   */
  setupLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }
  },

  /**
   * Load translations for a specific language
   * @param {string} lang - Language code ('es', 'en', 'pt')
   */
  async loadLanguage(lang) {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang}.json`);
      }

      this.translations = await response.json();
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);

      this.updateUI();
      this.updateLanguageSelector();

      // Track language change in analytics if available
      if (window.Analytics && window.Analytics.trackEvent) {
        Analytics.trackEvent('settings', 'language_changed', lang);
      }

      console.log(`Language loaded: ${lang}`);
    } catch (error) {
      console.error(`Error loading language ${lang}:`, error);
      // Try to load Spanish as fallback
      if (lang !== 'es') {
        console.log('Falling back to Spanish...');
        await this.loadLanguage('es');
      }
    }
  },

  /**
   * Translate a key to current language
   * @param {string} key - Translation key (dot notation supported, e.g., 'header.title')
   * @returns {string} Translated string or key if not found
   */
  t(key) {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    return value || key;
  },

  /**
   * Update all UI elements with data-i18n attributes
   */
  updateUI() {
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);

      // Update text content
      el.textContent = translation;
    });

    // Update placeholders separately
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);

      if (el.placeholder !== undefined) {
        el.placeholder = translation;
      }
    });

    // Update document language attribute
    document.documentElement.setAttribute('lang', this.currentLanguage);
  },

  /**
   * Update language selector dropdown to match current language
   */
  updateLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
      selector.value = this.currentLanguage;
    }
  },

  /**
   * Change language (called by language selector)
   * @param {string} lang - New language code
   */
  async changeLanguage(lang) {
    console.log(`Changing language from ${this.currentLanguage} to ${lang}`);

    if (this.supportedLanguages.includes(lang) && lang !== this.currentLanguage) {
      await this.loadLanguage(lang);
    } else if (lang === this.currentLanguage) {
      console.log('Language is already set to', lang);
    } else {
      console.warn('Unsupported language:', lang);
    }
  },

  /**
   * Get current language code
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  },

  /**
   * Get language name for display
   * @param {string} lang - Language code
   * @returns {string} Language name
   */
  getLanguageName(lang) {
    const names = {
      'es': 'Español',
      'en': 'English',
      'pt': 'Português'
    };
    return names[lang] || lang.toUpperCase();
  }
};
