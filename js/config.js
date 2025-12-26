/**
 * Configuration File
 *
 * THIS FILE IS GITIGNORED - Add your real credentials here
 * Copy from config.example.js if this file doesn't exist
 */

const CONFIG = {
  // Google AdSense Configuration
  adsense: {
    clientId: 'ca-pub-9196169055792645',  // Your AdSense Publisher ID
    slots: {
      banner: '1234567890',       // TODO: Replace with your top banner ad slot ID
      sidebarLeft: '0987654321',  // TODO: Replace with your left sidebar ad slot ID
      sidebarRight: '1357924680'  // TODO: Replace with your right sidebar ad slot ID
    }
  },

  // Google Analytics 4 Configuration
  analytics: {
    measurementId: 'G-XXXXXXXXXX'  // TODO: Replace with your GA4 Measurement ID when you have it
  },

  // Site Configuration
  site: {
    domain: 'your-domain.vercel.app',  // TODO: Replace with your actual Vercel domain
    defaultLanguage: 'es',
    defaultTheme: 'dark'
  }
};

// Export for use in other files
if (typeof window !== 'undefined') {
  window.APP_CONFIG = CONFIG;
}
