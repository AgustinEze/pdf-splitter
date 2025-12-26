/**
 * Google AdSense Integration Module
 * Manages ad loading with consent and lazy loading
 */

const Ads = {
  clientId: 'ca-pub-XXXXXXXXXXXXXXXX', // Will be set from config
  initialized: false,
  adSlots: {
    banner: '1234567890',      // Replace with actual slot ID
    sidebarLeft: '0987654321',  // Replace with actual slot ID
    sidebarRight: '1357924680'  // Replace with actual slot ID
  },

  /**
   * Initialize Google AdSense
   * Only call this after user consent
   */
  init(clientId, adSlots) {
    if (this.initialized) {
      console.log('AdSense already initialized');
      return;
    }

    // Use provided client ID or fallback to default
    if (clientId) {
      this.clientId = clientId;
    }

    // Use provided ad slots if available
    if (adSlots) {
      this.adSlots = { ...this.adSlots, ...adSlots };
    }

    // Validate client ID format
    if (!this.clientId || !this.clientId.startsWith('ca-pub-')) {
      console.error('Invalid AdSense client ID');
      return;
    }

    try {
      // Load AdSense script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.clientId}`;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        this.initialized = true;
        console.log('AdSense script loaded:', this.clientId);
        this.loadAds();
      };

      script.onerror = () => {
        console.error('Failed to load AdSense script. Ad blocker may be active.');
        this.showAdBlockerMessage();
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('Error initializing AdSense:', error);
    }
  },

  /**
   * Load all ads using lazy loading
   */
  loadAds() {
    if (!this.initialized || !window.adsbygoogle) {
      console.warn('AdSense not ready, cannot load ads');
      return;
    }

    // Initialize all ad containers
    const adContainers = document.querySelectorAll('.adsbygoogle');

    if (adContainers.length === 0) {
      console.warn('No ad containers found');
      return;
    }

    // Use IntersectionObserver for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.loaded) {
          this.pushAd(entry.target);
          entry.target.dataset.loaded = 'true';
        }
      });
    }, {
      rootMargin: '100px' // Load ads 100px before they come into view
    });

    adContainers.forEach(ad => {
      observer.observe(ad);
    });

    console.log(`Lazy loading ${adContainers.length} ad containers`);
  },

  /**
   * Push individual ad to AdSense
   * @param {HTMLElement} adElement - Ad container element
   */
  pushAd(adElement) {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
      console.log('Ad pushed:', adElement.dataset.adSlot);

      // Track ad impression in analytics if available
      if (window.Analytics && window.Analytics.trackEvent) {
        Analytics.trackEvent('ads', 'impression', adElement.dataset.adSlot);
      }
    } catch (error) {
      console.error('Error pushing ad:', error);
    }
  },

  /**
   * Show friendly message if ad blocker is detected
   */
  showAdBlockerMessage() {
    const adContainers = document.querySelectorAll('.ad-banner-top, .ad-sidebar');

    adContainers.forEach(container => {
      container.innerHTML = `
        <div class="ad-blocker-message">
          <p>📢 ${i18n.t ? i18n.t('ads.blockerMessage') : 'We noticed you\'re using an ad blocker.'}</p>
          <p>${i18n.t ? i18n.t('ads.blockerHelp') : 'This tool is free thanks to ads. Please consider disabling your ad blocker.'}</p>
        </div>
      `;
    });
  },

  /**
   * Refresh ads (useful after user action)
   * Note: Be careful with refresh rate to comply with AdSense policies
   */
  refreshAds() {
    if (!this.initialized) return;

    // For now, just reload the ads
    // In a real implementation, you might want to use AdSense refresh methods
    console.log('Refreshing ads...');
    this.loadAds();
  },

  /**
   * Check if AdSense is initialized
   * @returns {boolean} True if initialized
   */
  isInitialized() {
    return this.initialized;
  },

  /**
   * Get ad slot ID for a specific position
   * @param {string} position - Ad position ('banner', 'sidebarLeft', 'sidebarRight')
   * @returns {string} Ad slot ID
   */
  getAdSlot(position) {
    return this.adSlots[position] || '';
  }
};
