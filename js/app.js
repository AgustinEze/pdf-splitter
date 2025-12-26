/**
 * Main Application Logic
 * Handles UI interactions and orchestrates PDF operations
 */

// Application State
const AppState = {
  currentPDF: null,
  currentPDFDoc: null,
  currentMode: 'everyN',
  isProcessing: false,
  fileName: '',
  fileSize: 0
};

// DOM Elements
const elements = {
  // Upload
  uploadArea: document.getElementById('uploadArea'),
  fileInput: document.getElementById('fileInput'),
  selectFileBtn: document.getElementById('selectFileBtn'),

  // PDF Info
  pdfInfo: document.getElementById('pdfInfo'),
  fileName: document.getElementById('fileName'),
  pageCount: document.getElementById('pageCount'),
  fileSize: document.getElementById('fileSize'),

  // Mode Selection
  modeSection: document.getElementById('modeSection'),
  modeEveryN: document.getElementById('modeEveryN'),
  modeSpecific: document.getElementById('modeSpecific'),
  modeRanges: document.getElementById('modeRanges'),

  // Configuration
  configSection: document.getElementById('configSection'),
  configEveryN: document.getElementById('configEveryN'),
  configSpecific: document.getElementById('configSpecific'),
  configRanges: document.getElementById('configRanges'),
  pagesPerFile: document.getElementById('pagesPerFile'),
  specificPages: document.getElementById('specificPages'),
  rangesList: document.getElementById('rangesList'),
  errorMessage: document.getElementById('errorMessage'),

  // Preview
  previewSection: document.getElementById('previewSection'),
  previewContent: document.getElementById('previewContent'),

  // Actions
  actionsSection: document.getElementById('actionsSection'),
  splitBtn: document.getElementById('splitBtn'),
  clearBtn: document.getElementById('clearBtn'),

  // Progress
  progressSection: document.getElementById('progressSection'),
  progressFill: document.getElementById('progressFill'),
  progressText: document.getElementById('progressText'),

  // Results
  resultsSection: document.getElementById('resultsSection'),
  resultsContent: document.getElementById('resultsContent')
};

/**
 * Initialize the application
 * Initializes all modules in the correct order
 */
async function init() {
  try {
    // Get configuration from config.js (or use defaults)
    const config = window.APP_CONFIG || {
      adsense: {
        clientId: 'ca-pub-XXXXXXXXXXXXXXXX',
        slots: {
          banner: '1234567890',
          sidebarLeft: '0987654321',
          sidebarRight: '1357924680'
        }
      },
      analytics: { measurementId: 'G-XXXXXXXXXX' },
      site: {
        defaultLanguage: 'es',
        defaultTheme: 'dark',
        domain: 'your-domain.vercel.app'
      }
    };

    // 1. Initialize i18n (must be first for translations)
    await i18n.init(config.site.defaultLanguage);
    console.log('✓ i18n initialized');

    // 2. Initialize theme system
    Theme.init(config.site.defaultTheme);
    console.log('✓ Theme initialized');

    // 3. Check cookie consent and show banner if needed
    const consent = CookieConsent.getConsent();
    if (!consent) {
      CookieConsent.show();
    } else {
      // Load scripts based on saved consent
      if (consent.preferences.analytics) {
        Analytics.init(config.analytics.measurementId);
        console.log('✓ Analytics initialized');
      }
      if (consent.preferences.advertising) {
        Ads.init(config.adsense);
        console.log('✓ AdSense initialized');
      }
    }

    // 4. Setup PDF app event listeners (existing code)
    setupEventListeners();

    // 5. Track app initialization
    if (Analytics.isInitialized()) {
      Analytics.trackEvent('app', 'initialized', i18n.getCurrentLanguage());
    }

    console.log('✓ PDF Splitter initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // File upload events
  elements.selectFileBtn.addEventListener('click', () => elements.fileInput.click());
  elements.fileInput.addEventListener('change', handleFileSelect);

  // Drag and drop events
  elements.uploadArea.addEventListener('dragover', handleDragOver);
  elements.uploadArea.addEventListener('dragleave', handleDragLeave);
  elements.uploadArea.addEventListener('drop', handleDrop);
  elements.uploadArea.addEventListener('click', (e) => {
    if (e.target === elements.uploadArea || e.target.classList.contains('upload-icon') || e.target.classList.contains('upload-text')) {
      elements.fileInput.click();
    }
  });

  // Mode selection events
  elements.modeEveryN.addEventListener('change', () => handleModeChange('everyN'));
  elements.modeSpecific.addEventListener('change', () => handleModeChange('specific'));
  elements.modeRanges.addEventListener('change', () => handleModeChange('ranges'));

  // Configuration input events (real-time validation)
  elements.pagesPerFile.addEventListener('input', validateAndPreview);
  elements.specificPages.addEventListener('input', validateAndPreview);
  elements.rangesList.addEventListener('input', validateAndPreview);

  // Action button events
  elements.splitBtn.addEventListener('click', handleSplit);
  elements.clearBtn.addEventListener('click', handleClear);
}

/**
 * Handle file selection from input
 */
async function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    await loadPDFFile(file);
  }
}

/**
 * Handle drag over event
 */
function handleDragOver(e) {
  e.preventDefault();
  elements.uploadArea.classList.add('drag-over');
}

/**
 * Handle drag leave event
 */
function handleDragLeave(e) {
  e.preventDefault();
  elements.uploadArea.classList.remove('drag-over');
}

/**
 * Handle file drop event
 */
async function handleDrop(e) {
  e.preventDefault();
  elements.uploadArea.classList.remove('drag-over');

  const file = e.dataTransfer.files[0];
  if (file) {
    await loadPDFFile(file);
  }
}

/**
 * Load and validate a PDF file
 */
async function loadPDFFile(file) {
  // Validate file
  const validation = Validators.validateFile(file);
  if (!validation.valid) {
    showError(validation.error);
    return;
  }

  try {
    // Show loading state
    showProgress('Cargando PDF...');

    // Load PDF
    const pdfDoc = await PDFHandler.loadPDF(file);
    const pdfInfo = PDFHandler.getPDFInfo(pdfDoc);

    // Update state
    AppState.currentPDF = file;
    AppState.currentPDFDoc = pdfDoc;
    AppState.fileName = file.name;
    AppState.fileSize = file.size;

    // Show PDF info
    showPDFInfo(file.name, pdfInfo.pageCount, file.size);

    // Show mode selection
    elements.modeSection.classList.remove('hidden');
    elements.configSection.classList.remove('hidden');
    elements.actionsSection.classList.remove('hidden');

    // Hide progress
    hideProgress();

    // Trigger initial validation
    validateAndPreview();
  } catch (error) {
    hideProgress();
    showError(error.message);
  }
}

/**
 * Show PDF information
 */
function showPDFInfo(fileName, pageCount, fileSize) {
  elements.fileName.textContent = fileName;
  elements.pageCount.textContent = pageCount;
  elements.fileSize.textContent = PDFHandler.formatFileSize(fileSize);
  elements.pdfInfo.classList.remove('hidden');
}

/**
 * Handle mode change
 */
function handleModeChange(mode) {
  AppState.currentMode = mode;

  // Hide all config panels
  elements.configEveryN.classList.add('hidden');
  elements.configSpecific.classList.add('hidden');
  elements.configRanges.classList.add('hidden');

  // Show selected config panel
  switch (mode) {
    case 'everyN':
      elements.configEveryN.classList.remove('hidden');
      break;
    case 'specific':
      elements.configSpecific.classList.remove('hidden');
      break;
    case 'ranges':
      elements.configRanges.classList.remove('hidden');
      break;
  }

  // Validate and preview
  validateAndPreview();
}

/**
 * Validate current configuration and show preview
 */
function validateAndPreview() {
  if (!AppState.currentPDFDoc) return;

  const totalPages = AppState.currentPDFDoc.getPageCount();
  let validation = { valid: false };
  let previewData = null;

  // Validate based on current mode
  switch (AppState.currentMode) {
    case 'everyN':
      const n = elements.pagesPerFile.value;
      validation = Validators.validatePageNumber(n, totalPages);
      if (validation.valid) {
        previewData = generatePreviewEveryN(parseInt(n), totalPages);
      }
      break;

    case 'specific':
      const pageList = elements.specificPages.value;
      validation = Validators.parseAndValidatePageList(pageList, totalPages);
      if (validation.valid) {
        previewData = generatePreviewSpecific(validation.pages);
      }
      break;

    case 'ranges':
      const rangesList = elements.rangesList.value;
      validation = Validators.parseAndValidateRanges(rangesList, totalPages);
      if (validation.valid) {
        previewData = generatePreviewRanges(validation.ranges);
      }
      break;
  }

  // Show/hide error
  if (validation.valid) {
    hideError();
    showPreview(previewData);
    elements.splitBtn.disabled = false;
  } else {
    if (validation.error) {
      showError(validation.error);
    }
    hidePreview();
    elements.splitBtn.disabled = true;
  }
}

/**
 * Generate preview for "Every N pages" mode
 */
function generatePreviewEveryN(n, totalPages) {
  const files = [];
  let fileIndex = 1;

  for (let start = 1; start <= totalPages; start += n) {
    const end = Math.min(start + n - 1, totalPages);
    files.push(`Archivo ${fileIndex}: Páginas ${start}-${end}`);
    fileIndex++;
  }

  return {
    title: `Se crearán ${files.length} archivo(s):`,
    items: files
  };
}

/**
 * Generate preview for "Specific pages" mode
 */
function generatePreviewSpecific(pages) {
  return {
    title: `Se creará 1 archivo con ${pages.length} página(s):`,
    items: [`Páginas: ${pages.join(', ')}`]
  };
}

/**
 * Generate preview for "Ranges" mode
 */
function generatePreviewRanges(ranges) {
  const files = ranges.map((range, index) =>
    `Archivo ${index + 1}: Páginas ${range.start}-${range.end}`
  );

  return {
    title: `Se crearán ${ranges.length} archivo(s):`,
    items: files
  };
}

/**
 * Show preview section
 */
function showPreview(data) {
  if (!data) return;

  let html = `<p><strong>${data.title}</strong></p><ul>`;
  data.items.forEach(item => {
    html += `<li>${item}</li>`;
  });
  html += '</ul>';

  elements.previewContent.innerHTML = html;
  elements.previewSection.classList.remove('hidden');
}

/**
 * Hide preview section
 */
function hidePreview() {
  elements.previewSection.classList.add('hidden');
}

/**
 * Handle split button click
 */
async function handleSplit() {
  if (!AppState.currentPDFDoc || AppState.isProcessing) return;

  AppState.isProcessing = true;
  elements.splitBtn.disabled = true;
  hideError();
  hideResults();

  try {
    showProgress('Dividiendo PDF...');

    let results = [];

    // Process based on mode
    switch (AppState.currentMode) {
      case 'everyN':
        const n = parseInt(elements.pagesPerFile.value);
        results = await PDFHandler.splitEveryNPages(AppState.currentPDFDoc, n);
        break;

      case 'specific':
        const pageList = elements.specificPages.value;
        const validation = Validators.parseAndValidatePageList(
          pageList,
          AppState.currentPDFDoc.getPageCount()
        );
        const result = await PDFHandler.extractSpecificPages(
          AppState.currentPDFDoc,
          validation.pages
        );
        results = [result];
        break;

      case 'ranges':
        const rangesList = elements.rangesList.value;
        const rangesValidation = Validators.parseAndValidateRanges(
          rangesList,
          AppState.currentPDFDoc.getPageCount()
        );
        results = await PDFHandler.splitByRanges(
          AppState.currentPDFDoc,
          rangesValidation.ranges
        );
        break;
    }

    // Download PDFs
    await PDFHandler.downloadMultiplePDFs(results, (current, total) => {
      const percent = Math.round((current / total) * 100);
      updateProgress(percent, `Descargando archivo ${current} de ${total}...`);
    });

    // Show results
    hideProgress();
    showResults(results);
  } catch (error) {
    hideProgress();
    showError(`Error al dividir el PDF: ${error.message}`);
  } finally {
    AppState.isProcessing = false;
    elements.splitBtn.disabled = false;
  }
}

/**
 * Handle clear button click
 */
function handleClear() {
  // Reset state
  AppState.currentPDF = null;
  AppState.currentPDFDoc = null;
  AppState.currentMode = 'everyN';
  AppState.isProcessing = false;

  // Reset file input
  elements.fileInput.value = '';

  // Reset config inputs
  elements.pagesPerFile.value = '';
  elements.specificPages.value = '';
  elements.rangesList.value = '';

  // Hide all sections
  elements.pdfInfo.classList.add('hidden');
  elements.modeSection.classList.add('hidden');
  elements.configSection.classList.add('hidden');
  elements.previewSection.classList.add('hidden');
  elements.actionsSection.classList.add('hidden');
  elements.progressSection.classList.add('hidden');
  elements.resultsSection.classList.add('hidden');

  // Reset mode to everyN
  elements.modeEveryN.checked = true;
  elements.configEveryN.classList.remove('hidden');
  elements.configSpecific.classList.add('hidden');
  elements.configRanges.classList.add('hidden');

  hideError();
}

/**
 * Show error message
 */
function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
  elements.errorMessage.classList.add('hidden');
}

/**
 * Show progress bar
 */
function showProgress(text = 'Procesando...') {
  elements.progressText.textContent = text;
  elements.progressFill.style.width = '0%';
  elements.progressSection.classList.remove('hidden');
}

/**
 * Update progress bar
 */
function updateProgress(percent, text) {
  elements.progressFill.style.width = `${percent}%`;
  elements.progressText.textContent = text;
}

/**
 * Hide progress bar
 */
function hideProgress() {
  elements.progressSection.classList.add('hidden');
}

/**
 * Show results section
 */
function showResults(results) {
  let html = `<p><strong>Operación completada con éxito!</strong></p>`;
  html += `<p>Se han descargado ${results.length} archivo(s):</p>`;
  html += '<div>';

  results.forEach(result => {
    html += `
      <div class="result-item">
        <span>${result.name} (Páginas: ${result.pageRange})</span>
        <span class="success-icon">✓</span>
      </div>
    `;
  });

  html += '</div>';

  elements.resultsContent.innerHTML = html;
  elements.resultsSection.classList.remove('hidden');
}

/**
 * Hide results section
 */
function hideResults() {
  elements.resultsSection.classList.add('hidden');
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
