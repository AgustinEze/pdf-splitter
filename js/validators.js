/**
 * Validators Module
 * Handles all input validation for the PDF splitter application
 */

const Validators = {
  /**
   * Validates if a file is a valid PDF
   * @param {File} file - The file to validate
   * @returns {Object} - {valid: boolean, error: string|null}
   */
  validateFile(file) {
    if (!file) {
      return { valid: false, error: 'No se ha seleccionado ningún archivo' };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf')) {
      return { valid: false, error: 'El archivo debe tener extensión .pdf' };
    }

    // Check MIME type
    if (file.type !== 'application/pdf' && file.type !== '') {
      return { valid: false, error: 'El archivo no es un PDF válido' };
    }

    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      return { valid: false, error: 'El archivo es demasiado grande (máximo 500MB)' };
    }

    if (file.size === 0) {
      return { valid: false, error: 'El archivo está vacío' };
    }

    return { valid: true, error: null };
  },

  /**
   * Validates the number for "Every N pages" mode
   * @param {string|number} n - Number of pages per file
   * @param {number} totalPages - Total pages in the PDF
   * @returns {Object} - {valid: boolean, error: string|null}
   */
  validatePageNumber(n, totalPages) {
    // Check if empty
    if (n === '' || n === null || n === undefined) {
      return { valid: false, error: 'Debes especificar el número de páginas' };
    }

    // Convert to number
    const num = parseInt(n, 10);

    // Check if it's a valid number
    if (isNaN(num)) {
      return { valid: false, error: 'Debe ser un número válido' };
    }

    // Check if it's a positive integer
    if (num < 1) {
      return { valid: false, error: 'El número debe ser mayor a 0' };
    }

    // Check if it's not larger than total pages
    if (num > totalPages) {
      return {
        valid: false,
        error: `El número no puede ser mayor al total de páginas (${totalPages})`
      };
    }

    return { valid: true, error: null };
  },

  /**
   * Parses and validates a page list (e.g., "1, 3, 5-10, 15")
   * @param {string} input - Input string with page numbers and ranges
   * @param {number} totalPages - Total pages in the PDF
   * @returns {Object} - {valid: boolean, pages: number[], error: string|null}
   */
  parseAndValidatePageList(input, totalPages) {
    if (!input || input.trim() === '') {
      return { valid: false, pages: [], error: 'Debes especificar las páginas a extraer' };
    }

    const pages = new Set();
    const parts = input.split(',').map(p => p.trim()).filter(p => p);

    try {
      for (const part of parts) {
        // Check if it's a range (e.g., "5-10")
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(p => p.trim());
          const startNum = parseInt(start, 10);
          const endNum = parseInt(end, 10);

          // Validate numbers
          if (isNaN(startNum) || isNaN(endNum)) {
            return {
              valid: false,
              pages: [],
              error: `Rango inválido: "${part}". Usa números válidos.`
            };
          }

          // Validate range
          if (startNum < 1 || endNum < 1) {
            return {
              valid: false,
              pages: [],
              error: `Rango inválido: "${part}". Los números deben ser mayores a 0.`
            };
          }

          if (startNum > totalPages || endNum > totalPages) {
            return {
              valid: false,
              pages: [],
              error: `Rango inválido: "${part}". No puede ser mayor a ${totalPages}.`
            };
          }

          if (startNum > endNum) {
            return {
              valid: false,
              pages: [],
              error: `Rango inválido: "${part}". El inicio debe ser menor o igual al fin.`
            };
          }

          // Add all pages in range
          for (let i = startNum; i <= endNum; i++) {
            pages.add(i);
          }
        } else {
          // Single page number
          const pageNum = parseInt(part, 10);

          if (isNaN(pageNum)) {
            return {
              valid: false,
              pages: [],
              error: `Número inválido: "${part}"`
            };
          }

          if (pageNum < 1) {
            return {
              valid: false,
              pages: [],
              error: `Número inválido: "${part}". Debe ser mayor a 0.`
            };
          }

          if (pageNum > totalPages) {
            return {
              valid: false,
              pages: [],
              error: `Número inválido: "${part}". No puede ser mayor a ${totalPages}.`
            };
          }

          pages.add(pageNum);
        }
      }

      if (pages.size === 0) {
        return {
          valid: false,
          pages: [],
          error: 'No se especificaron páginas válidas'
        };
      }

      // Convert Set to sorted Array
      const sortedPages = Array.from(pages).sort((a, b) => a - b);

      return { valid: true, pages: sortedPages, error: null };
    } catch (error) {
      return {
        valid: false,
        pages: [],
        error: 'Error al procesar las páginas. Verifica el formato.'
      };
    }
  },

  /**
   * Parses and validates ranges (e.g., "1-5; 10-15; 20-25")
   * @param {string} input - Input string with ranges separated by semicolons
   * @param {number} totalPages - Total pages in the PDF
   * @returns {Object} - {valid: boolean, ranges: Array<{start, end}>, error: string|null}
   */
  parseAndValidateRanges(input, totalPages) {
    if (!input || input.trim() === '') {
      return {
        valid: false,
        ranges: [],
        error: 'Debes especificar los rangos a dividir'
      };
    }

    const ranges = [];
    const parts = input.split(';').map(p => p.trim()).filter(p => p);

    if (parts.length === 0) {
      return {
        valid: false,
        ranges: [],
        error: 'No se especificaron rangos válidos'
      };
    }

    try {
      for (const part of parts) {
        if (!part.includes('-')) {
          return {
            valid: false,
            ranges: [],
            error: `Formato inválido: "${part}". Debe ser un rango (ej: 1-5)`
          };
        }

        const [start, end] = part.split('-').map(p => p.trim());
        const startNum = parseInt(start, 10);
        const endNum = parseInt(end, 10);

        // Validate numbers
        if (isNaN(startNum) || isNaN(endNum)) {
          return {
            valid: false,
            ranges: [],
            error: `Rango inválido: "${part}". Usa números válidos.`
          };
        }

        // Validate range values
        if (startNum < 1 || endNum < 1) {
          return {
            valid: false,
            ranges: [],
            error: `Rango inválido: "${part}". Los números deben ser mayores a 0.`
          };
        }

        if (startNum > totalPages || endNum > totalPages) {
          return {
            valid: false,
            ranges: [],
            error: `Rango inválido: "${part}". No puede ser mayor a ${totalPages}.`
          };
        }

        if (startNum > endNum) {
          return {
            valid: false,
            ranges: [],
            error: `Rango inválido: "${part}". El inicio debe ser menor o igual al fin.`
          };
        }

        ranges.push({ start: startNum, end: endNum });
      }

      return { valid: true, ranges, error: null };
    } catch (error) {
      return {
        valid: false,
        ranges: [],
        error: 'Error al procesar los rangos. Verifica el formato.'
      };
    }
  }
};
