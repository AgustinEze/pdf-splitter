# PDF Splitter - Production Version

Free online PDF splitter tool. Split PDFs by pages, ranges, or extract specific pages. 100% secure, no uploads, works offline.

## 🌟 Features

- **Multi-language Support**: Spanish, English, Portuguese
- **Dark/Light Theme**: Toggle between themes with preference persistence
- **100% Local Processing**: Your PDFs never leave your browser
- **Multiple Split Modes**:
  - Split every N pages
  - Extract specific pages
  - Split by custom ranges
- **Monetization Ready**: Google AdSense & Analytics 4 integrated
- **Privacy Compliant**: GDPR/CCPA cookie consent banner

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server (opens browser automatically)
npm run dev

# Or just preview without opening browser
npm run preview
```

Visit http://localhost:8000

### Production Deployment

This site is configured for deployment on Vercel.

## ⚙️ Configuration Before Deploy

### 1. Create Configuration File

**Important**: Copy the example config and add your real IDs:

```bash
cd js
cp config.example.js config.js
```

Then edit `js/config.js` and replace:

```javascript
const CONFIG = {
  // Google AdSense Configuration
  adsense: {
    clientId: 'ca-pub-XXXXXXXXXXXXXXXX',  // ← Your AdSense Publisher ID
    slots: {
      banner: '1234567890',       // ← Top banner ad slot ID
      sidebarLeft: '0987654321',  // ← Left sidebar ad slot ID
      sidebarRight: '1357924680'  // ← Right sidebar ad slot ID
    }
  },

  // Google Analytics 4 Configuration
  analytics: {
    measurementId: 'G-XXXXXXXXXX'  // ← Your GA4 Measurement ID
  },

  // Site Configuration
  site: {
    domain: 'your-domain.vercel.app',  // ← Your Vercel domain (without https://)
    defaultLanguage: 'es',              // Default language: 'es', 'en', or 'pt'
    defaultTheme: 'dark'                // Default theme: 'dark' or 'light'
  }
};
```

**Note**: `config.js` is gitignored and won't be committed. This keeps your IDs secure.

### 2. Update Domain in Meta Tags

In `index.html`, replace all instances of:
```html
https://your-domain.vercel.app/
```
With your actual Vercel domain.

## 📦 Deploy to Vercel

### Option 1: GitHub (Recommended)

1. **Create GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PDF Splitter production version"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pdf-splitter.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the static site
   - Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔐 Configuration Management

This project uses a **client-side configuration file** (`js/config.js`) instead of traditional environment variables, since static sites run entirely in the browser.

### Why config.js instead of .env?

- `.env` files work for server-side apps (Node.js, etc.)
- Static sites run 100% in the browser - they can't read `.env` files
- `config.js` provides a centralized, browser-accessible configuration
- It's gitignored to keep your IDs secure

### Setup

1. Copy the example: `cp js/config.example.js js/config.js`
2. Edit `js/config.js` with your real IDs
3. Never commit `config.js` to Git (it's already in `.gitignore`)
4. For Vercel deployment, update `config.js` locally before deploying

## 📁 Project Structure

```
deploy/
├── index.html              # Main HTML with SEO, ads, i18n
├── package.json            # NPM configuration
├── vercel.json            # Vercel deployment config
├── .gitignore             # Git ignore rules (includes js/config.js)
├── css/
│   ├── styles.css         # Main styles with theme system
│   ├── ads.css            # Ad layout (responsive)
│   └── cookie-banner.css  # Cookie consent banner
├── js/
│   ├── config.example.js  # Configuration template
│   ├── config.js          # Configuration (gitignored, you create this)
│   ├── app.js             # Main application logic
│   ├── pdf-handler.js     # PDF manipulation
│   ├── validators.js      # Input validation
│   ├── i18n.js            # Internationalization
│   ├── theme.js           # Theme management
│   ├── cookie-consent.js  # GDPR compliance
│   ├── analytics.js       # Google Analytics
│   └── ads.js             # AdSense integration
└── locales/
    ├── es.json            # Spanish translations
    ├── en.json            # English translations
    └── pt.json            # Portuguese translations
```

## 🌐 Multi-language Support

The app automatically detects the user's browser language and defaults to:
- 🇪🇸 Spanish (es)
- 🇬🇧 English (en)
- 🇧🇷 Portuguese (pt)

Users can manually switch languages using the selector in the header.

## 🎨 Theme System

- **Default**: Dark mode
- **Toggle**: Header button
- **Persistence**: localStorage

## 📊 Analytics & Monetization

### Google Analytics 4
Tracks:
- Page views
- PDF loads
- Split operations
- Language/theme changes
- User engagement

### Google AdSense
- 1 horizontal banner (top)
- 2 vertical sidebars (desktop only)
- Responsive layout
- Lazy loading
- Ad blocker detection

### Cookie Consent
- GDPR/CCPA compliant
- Granular preferences (Analytics, Advertising)
- Scripts load only after consent

## 🔧 Tech Stack

- **Vanilla JavaScript** (no frameworks)
- **CSS Variables** (theming)
- **pdf-lib** (PDF manipulation)
- **Google Analytics 4**
- **Google AdSense**

## 📝 License

MIT License - feel free to use and modify.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Important Notes

- **Local version**: The root directory contains the original local version (untouched)
- **Production version**: This `/deploy` directory is the production-ready version
- **Privacy**: All PDF processing happens client-side, no files are uploaded
- **Browser support**: Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

## 📞 Support

For issues or questions, open an issue on GitHub.

---

Made with ❤️ using vanilla JavaScript
