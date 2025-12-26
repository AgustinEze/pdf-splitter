/**
 * Cookie Consent Banner Module
 * GDPR/CCPA compliant cookie consent management
 */

const CookieConsent = {
  bannerElement: null,
  modalElement: null,

  /**
   * Initialize and show banner if consent not given
   */
  init() {
    const consent = this.getConsent();

    if (!consent) {
      this.show();
    } else {
      // Load scripts based on saved consent
      this.loadScripts(consent.preferences);
    }
  },

  /**
   * Create and show the consent banner
   */
  show() {
    // Create banner HTML
    const banner = document.createElement('div');
    banner.id = 'cookieConsentBanner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <h3 data-i18n="cookieBanner.title">${i18n.t('cookieBanner.title')}</h3>
          <p data-i18n="cookieBanner.message">${i18n.t('cookieBanner.message')}</p>
        </div>
        <div class="cookie-banner-actions">
          <button class="btn-primary" id="acceptAllCookies" data-i18n="cookieBanner.acceptAll">
            ${i18n.t('cookieBanner.acceptAll')}
          </button>
          <button class="btn-secondary" id="rejectAllCookies" data-i18n="cookieBanner.rejectAll">
            ${i18n.t('cookieBanner.rejectAll')}
          </button>
          <button class="btn-secondary" id="customizeCookies" data-i18n="cookieBanner.customize">
            ${i18n.t('cookieBanner.customize')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    this.bannerElement = banner;

    // Setup event listeners
    document.getElementById('acceptAllCookies').addEventListener('click', () => {
      this.accept({ analytics: true, advertising: true });
    });

    document.getElementById('rejectAllCookies').addEventListener('click', () => {
      this.accept({ analytics: false, advertising: false });
    });

    document.getElementById('customizeCookies').addEventListener('click', () => {
      this.showCustomizeModal();
    });
  },

  /**
   * Show customization modal
   */
  showCustomizeModal() {
    const modal = document.createElement('div');
    modal.id = 'cookieConsentModal';
    modal.className = 'cookie-modal';
    modal.innerHTML = `
      <div class="cookie-modal-overlay"></div>
      <div class="cookie-modal-content">
        <h3 data-i18n="cookieBanner.title">${i18n.t('cookieBanner.title')}</h3>

        <div class="cookie-option">
          <div class="cookie-option-header">
            <input type="checkbox" id="cookieNecessary" checked disabled>
            <label for="cookieNecessary">
              <strong data-i18n="cookieBanner.necessary">${i18n.t('cookieBanner.necessary')}</strong>
            </label>
          </div>
          <p class="cookie-option-description" data-i18n="cookieBanner.necessaryDesc">
            ${i18n.t('cookieBanner.necessaryDesc')}
          </p>
        </div>

        <div class="cookie-option">
          <div class="cookie-option-header">
            <input type="checkbox" id="cookieAnalytics">
            <label for="cookieAnalytics">
              <strong data-i18n="cookieBanner.analytics">${i18n.t('cookieBanner.analytics')}</strong>
            </label>
          </div>
          <p class="cookie-option-description" data-i18n="cookieBanner.analyticsDesc">
            ${i18n.t('cookieBanner.analyticsDesc')}
          </p>
        </div>

        <div class="cookie-option">
          <div class="cookie-option-header">
            <input type="checkbox" id="cookieAdvertising">
            <label for="cookieAdvertising">
              <strong data-i18n="cookieBanner.advertising">${i18n.t('cookieBanner.advertising')}</strong>
            </label>
          </div>
          <p class="cookie-option-description" data-i18n="cookieBanner.advertisingDesc">
            ${i18n.t('cookieBanner.advertisingDesc')}
          </p>
        </div>

        <div class="cookie-modal-actions">
          <button class="btn-primary" id="savePreferences" data-i18n="cookieBanner.savePreferences">
            ${i18n.t('cookieBanner.savePreferences')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalElement = modal;

    // Setup event listeners
    document.getElementById('savePreferences').addEventListener('click', () => {
      const preferences = {
        analytics: document.getElementById('cookieAnalytics').checked,
        advertising: document.getElementById('cookieAdvertising').checked
      };
      this.accept(preferences);
    });

    // Close modal on overlay click
    modal.querySelector('.cookie-modal-overlay').addEventListener('click', () => {
      this.hideCustomizeModal();
    });
  },

  /**
   * Hide customization modal
   */
  hideCustomizeModal() {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  },

  /**
   * Accept cookies with given preferences
   * @param {Object} preferences - Cookie preferences
   */
  accept(preferences) {
    const consent = {
      timestamp: Date.now(),
      preferences: preferences
    };

    localStorage.setItem('cookie-consent', JSON.stringify(consent));

    // Load scripts based on preferences
    this.loadScripts(preferences);

    // Hide banner and modal
    this.hide();
    this.hideCustomizeModal();

    console.log('Cookie consent saved:', preferences);
  },

  /**
   * Load analytics and ad scripts based on preferences
   * @param {Object} preferences - Cookie preferences
   */
  loadScripts(preferences) {
    if (preferences.analytics && window.Analytics) {
      Analytics.init();
    }

    if (preferences.advertising && window.Ads) {
      Ads.init();
    }
  },

  /**
   * Hide the consent banner
   */
  hide() {
    if (this.bannerElement) {
      this.bannerElement.remove();
      this.bannerElement = null;
    }
  },

  /**
   * Get saved consent from localStorage
   * @returns {Object|null} Consent object or null if not found
   */
  getConsent() {
    const consent = localStorage.getItem('cookie-consent');
    return consent ? JSON.parse(consent) : null;
  },

  /**
   * Clear saved consent (for testing)
   */
  clearConsent() {
    localStorage.removeItem('cookie-consent');
  },

  /**
   * Check if a specific cookie type is consented
   * @param {string} type - Cookie type ('analytics' or 'advertising')
   * @returns {boolean} True if consented
   */
  hasConsent(type) {
    const consent = this.getConsent();
    return consent && consent.preferences[type];
  }
};
