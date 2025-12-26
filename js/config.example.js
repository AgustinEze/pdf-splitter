/**
 * Configuration Template
 *
 * Instructions:
 * 1. Copy this file to config.js: cp config.example.js config.js
 * 2. Update the values with your actual IDs
 * 3. config.js is gitignored and won't be committed
 */

const CONFIG = {
  // Google AdSense Configuration
  adsense: {
    clientId: 'ca-pub-XXXXXXXXXXXXXXXX',  // Your AdSense Publisher ID
    slots: {
      banner: '1234567890',       // Top banner ad slot ID
      sidebarLeft: '0987654321',  // Left sidebar ad slot ID
      sidebarRight: '1357924680'  // Right sidebar ad slot ID
    }
  },

  // Google Analytics 4 Configuration
  analytics: {
    measurementId: 'G-XXXXXXXXXX'  // Your GA4 Measurement ID
  },

  // Site Configuration
  site: {
    domain: 'your-domain.vercel.app',  // Your Vercel domain (without https://)
    defaultLanguage: 'es',              // Default language: 'es', 'en', or 'pt'
    defaultTheme: 'dark'                // Default theme: 'dark' or 'light'
  }
};

// Export for use in other files
if (typeof window !== 'undefined') {
  window.APP_CONFIG = CONFIG;
}
