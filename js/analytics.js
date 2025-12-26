/**
 * Google Analytics 4 Integration Module
 * Privacy-focused analytics with consent management
 */

const Analytics = {
  measurementId: 'G-XXXXXXXXXX', // Will be set from config
  initialized: false,

  /**
   * Initialize Google Analytics 4
   * Only call this after user consent
   */
  init(measurementId) {
    if (this.initialized) {
      console.log('Analytics already initialized');
      return;
    }

    // Use provided measurement ID or fallback to default
    if (measurementId) {
      this.measurementId = measurementId;
    }

    // Validate measurement ID format
    if (!this.measurementId || !this.measurementId.startsWith('G-')) {
      console.error('Invalid Google Analytics measurement ID');
      return;
    }

    try {
      // Load gtag.js script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag function
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        dataLayer.push(arguments);
      };

      gtag('js', new Date());
      gtag('config', this.measurementId, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure',
        send_page_view: true
      });

      this.initialized = true;
      console.log('Google Analytics initialized:', this.measurementId);
    } catch (error) {
      console.error('Error initializing Google Analytics:', error);
    }
  },

  /**
   * Track a custom event
   * @param {string} category - Event category (e.g., 'app', 'pdf', 'settings')
   * @param {string} action - Event action (e.g., 'initialized', 'loaded', 'changed')
   * @param {string} label - Event label (additional context)
   * @param {number} value - Event value (optional numeric value)
   */
  trackEvent(category, action, label, value) {
    if (!this.initialized || !window.gtag) {
      // Queue events if analytics not ready yet
      return;
    }

    try {
      gtag('event', action, {
        event_category: category,
        event_label: label || '',
        value: value || undefined
      });

      console.log('Analytics event tracked:', { category, action, label, value });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  },

  /**
   * Track page view (for SPAs)
   * @param {string} pagePath - Page path
   * @param {string} pageTitle - Page title
   */
  trackPageView(pagePath, pageTitle) {
    if (!this.initialized || !window.gtag) return;

    try {
      gtag('config', this.measurementId, {
        page_path: pagePath,
        page_title: pageTitle
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  },

  /**
   * Track PDF-related events
   */
  trackPDFLoaded(fileName, pageCount, fileSize) {
    // Categorize file size
    let sizeCategory;
    if (fileSize < 1024 * 1024) sizeCategory = 'small'; // < 1MB
    else if (fileSize < 10 * 1024 * 1024) sizeCategory = 'medium'; // < 10MB
    else sizeCategory = 'large'; // >= 10MB

    // Categorize page count
    let pageCategory;
    if (pageCount <= 10) pageCategory = '1-10';
    else if (pageCount <= 50) pageCategory = '11-50';
    else if (pageCount <= 100) pageCategory = '51-100';
    else pageCategory = '100+';

    this.trackEvent('pdf', 'loaded', `${sizeCategory}_${pageCategory}`);
  },

  /**
   * Track split mode selection
   * @param {string} mode - Split mode ('everyN', 'specific', 'ranges')
   */
  trackSplitMode(mode) {
    this.trackEvent('pdf', 'mode_selected', mode);
  },

  /**
   * Track split completion
   * @param {string} mode - Split mode used
   * @param {number} outputFiles - Number of files created
   */
  trackSplitCompleted(mode, outputFiles) {
    this.trackEvent('pdf', 'split_completed', mode, outputFiles);
  },

  /**
   * Track split error
   * @param {string} errorType - Type of error
   */
  trackSplitError(errorType) {
    this.trackEvent('pdf', 'split_error', errorType);
  },

  /**
   * Track language change
   * @param {string} language - New language code
   */
  trackLanguageChange(language) {
    this.trackEvent('settings', 'language_changed', language);
  },

  /**
   * Track theme change
   * @param {string} theme - New theme ('dark' or 'light')
   */
  trackThemeChange(theme) {
    this.trackEvent('settings', 'theme_changed', theme);
  },

  /**
   * Check if analytics is initialized
   * @returns {boolean} True if initialized
   */
  isInitialized() {
    return this.initialized;
  }
};
