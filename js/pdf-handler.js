/**
 * PDF Handler Module
 * Handles all PDF manipulation using pdf-lib
 */

const PDFHandler = {
  /**
   * Loads a PDF file and returns a PDFDocument
   * @param {File} file - The PDF file to load
   * @returns {Promise<PDFDocument>} - The loaded PDF document
   */
  async loadPDF(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
      return pdfDoc;
    } catch (error) {
      throw new Error(`Error al cargar el PDF: ${error.message}`);
    }
  },

  /**
   * Gets information about a PDF document
   * @param {PDFDocument} pdfDoc - The PDF document
   * @returns {Object} - PDF information {pageCount}
   */
  getPDFInfo(pdfDoc) {
    return {
      pageCount: pdfDoc.getPageCount()
    };
  },

  /**
   * Splits a PDF into multiple PDFs, each with N pages
   * @param {PDFDocument} pdfDoc - The original PDF document
   * @param {number} pagesPerFile - Number of pages per output file
   * @returns {Promise<Array<{doc: PDFDocument, name: string}>>} - Array of new PDF documents with names
   */
  async splitEveryNPages(pdfDoc, pagesPerFile) {
    const totalPages = pdfDoc.getPageCount();
    const results = [];

    let fileIndex = 1;
    for (let startPage = 0; startPage < totalPages; startPage += pagesPerFile) {
      const endPage = Math.min(startPage + pagesPerFile, totalPages);

      // Create new PDF document
      const newPdf = await PDFLib.PDFDocument.create();

      // Copy pages to new document
      const pageIndices = [];
      for (let i = startPage; i < endPage; i++) {
        pageIndices.push(i);
      }

      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));

      results.push({
        doc: newPdf,
        name: `archivo_${fileIndex}.pdf`,
        pageRange: `${startPage + 1}-${endPage}`
      });

      fileIndex++;
    }

    return results;
  },

  /**
   * Extracts specific pages from a PDF
   * @param {PDFDocument} pdfDoc - The original PDF document
   * @param {Array<number>} pageList - Array of page numbers (1-indexed)
   * @returns {Promise<{doc: PDFDocument, name: string}>} - New PDF document with extracted pages
   */
  async extractSpecificPages(pdfDoc, pageList) {
    // Create new PDF document
    const newPdf = await PDFLib.PDFDocument.create();

    // Convert 1-indexed to 0-indexed
    const pageIndices = pageList.map(p => p - 1);

    // Copy pages to new document
    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach(page => newPdf.addPage(page));

    // Create a descriptive name
    const pagesStr = pageList.join(',');
    const shortName = pagesStr.length > 30
      ? `paginas_${pageList[0]}-${pageList[pageList.length - 1]}.pdf`
      : `paginas_${pagesStr}.pdf`;

    return {
      doc: newPdf,
      name: shortName,
      pageRange: pagesStr
    };
  },

  /**
   * Splits a PDF into multiple PDFs based on specified ranges
   * @param {PDFDocument} pdfDoc - The original PDF document
   * @param {Array<{start: number, end: number}>} ranges - Array of page ranges (1-indexed)
   * @returns {Promise<Array<{doc: PDFDocument, name: string}>>} - Array of new PDF documents with names
   */
  async splitByRanges(pdfDoc, ranges) {
    const results = [];

    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];

      // Create new PDF document
      const newPdf = await PDFLib.PDFDocument.create();

      // Create array of page indices (convert 1-indexed to 0-indexed)
      const pageIndices = [];
      for (let page = range.start; page <= range.end; page++) {
        pageIndices.push(page - 1);
      }

      // Copy pages to new document
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));

      results.push({
        doc: newPdf,
        name: `rango_${i + 1}_paginas_${range.start}-${range.end}.pdf`,
        pageRange: `${range.start}-${range.end}`
      });
    }

    return results;
  },

  /**
   * Downloads a PDF document
   * @param {PDFDocument} pdfDoc - The PDF document to download
   * @param {string} filename - The filename for the download
   */
  async downloadPDF(pdfDoc, filename) {
    try {
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(`Error al descargar el PDF: ${error.message}`);
    }
  },

  /**
   * Downloads multiple PDF documents
   * @param {Array<{doc: PDFDocument, name: string}>} pdfs - Array of PDFs to download
   * @param {Function} progressCallback - Optional callback for progress updates
   */
  async downloadMultiplePDFs(pdfs, progressCallback = null) {
    for (let i = 0; i < pdfs.length; i++) {
      const { doc, name } = pdfs[i];

      if (progressCallback) {
        progressCallback(i + 1, pdfs.length);
      }

      await this.downloadPDF(doc, name);

      // Small delay between downloads to avoid browser blocking
      if (i < pdfs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  },

  /**
   * Formats file size in human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
};
