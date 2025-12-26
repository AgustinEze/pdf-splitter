#!/usr/bin/env node

/**
 * Build script to generate config.js from environment variables
 * This runs during Vercel build and creates config.js with real IDs
 */

const fs = require('fs');
const path = require('path');

const config = `/**
 * Configuration File
 * Generated automatically from environment variables during build
 */

const CONFIG = {
  adsense: {
    clientId: '${process.env.ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX'}',
    slots: {
      banner: '${process.env.ADSENSE_SLOT_BANNER || '1234567890'}',
      sidebarLeft: '${process.env.ADSENSE_SLOT_LEFT || '0987654321'}',
      sidebarRight: '${process.env.ADSENSE_SLOT_RIGHT || '1357924680'}'
    }
  },
  analytics: {
    measurementId: '${process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'}'
  },
  site: {
    domain: '${process.env.SITE_DOMAIN || 'your-domain.vercel.app'}',
    defaultLanguage: 'es',
    defaultTheme: 'dark'
  }
};

// Export for use in other files
if (typeof window !== 'undefined') {
  window.APP_CONFIG = CONFIG;
}
`;

// Write config.js to js/ directory
const outputPath = path.join(__dirname, 'js', 'config.js');
fs.writeFileSync(outputPath, config, 'utf8');

console.log('✅ config.js generated successfully');
console.log('📍 Location:', outputPath);
