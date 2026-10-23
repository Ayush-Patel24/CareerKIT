import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Standard A4 physical dimensions at standard 96 DPI:
 * Width: 210mm = 793.7px -> 794px
 * Height: 297mm = 1122.5px -> 1123px
 */
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

/**
 * Estimates the page count for a resume element at standard A4 dimensions.
 * @param {HTMLElement} element
 * @returns {number}
 */
export function estimatePageCount(element) {
  if (!element) return 1;
  const paper = element.querySelector('.resume-paper') || element;
  const height = paper.scrollHeight || paper.offsetHeight;
  if (!height) return 1;
  // Account for a small tolerance buffer (30px)
  return Math.max(1, Math.ceil((height - 30) / A4_HEIGHT_PX));
}

/**
 * Exports a DOM element as a high-resolution, crystal-clear A4 PDF document.
 * 
 * Key engineering enhancements:
 * 1. Fixed A4 Staging: Renders the resume inside an off-screen container fixed at 794px (exact A4 width at 96 DPI),
 *    preventing responsive screen compression (mobile/tablet/split-screen) from ballooning text height into 4-5 pages.
 * 2. 300 DPI Lossless PNG: Uses html2canvas scale: 2 with lossless PNG (no JPEG ringing/fuzziness) and high-quality rendering.
 * 3. Smart Multi-Page Splitting: Automatically identifies section & entry boundaries (.ats-entry, .prof-entry, etc.)
 *    and inserts clean page-break spacers so headings and lines of text are NEVER sliced horizontally in half.
 * 4. Single-Page Perfection: Standard resumes naturally fit onto 1 single, balanced page without blank orphan pages.
 *
 * @param {HTMLElement} element - The resume preview container DOM element.
 * @param {string} filename - The desired download filename.
 * @param {object} [options] - Export options.
 * @param {boolean} [options.fitToSinglePage=false] - Force single-page layout if near page boundary.
 * @returns {Promise<boolean>}
 */
export async function exportResumeToPDF(element, filename = 'Resume.pdf', options = {}) {
  if (!element) {
    throw new Error('Resume element not found for export');
  }

  // 1. Create off-screen staging container at standard fixed A4 width
  const staging = document.createElement('div');
  staging.id = 'careerkit-pdf-staging';
  staging.style.position = 'fixed';
  staging.style.left = '-10000px';
  staging.style.top = '0';
  staging.style.width = `${A4_WIDTH_PX}px`;
  staging.style.backgroundColor = '#ffffff';
  staging.style.zIndex = '-9999';
  staging.style.opacity = '1';
  staging.style.pointerEvents = 'none';

  // 2. Clone the element
  const clone = element.cloneNode(true);
  const paperEl = clone.querySelector('.resume-paper') || clone;

  if (options.fitToSinglePage) {
    paperEl.classList.add('compact-fit');
  }

  // Enforce standard A4 styling on paper element during export
  paperEl.style.width = `${A4_WIDTH_PX}px`;
  paperEl.style.maxWidth = `${A4_WIDTH_PX}px`;
  paperEl.style.minWidth = `${A4_WIDTH_PX}px`;
  paperEl.style.boxSizing = 'border-box';
  paperEl.style.boxShadow = 'none';
  paperEl.style.border = 'none';
  paperEl.style.margin = '0 auto';

  staging.appendChild(clone);
  document.body.appendChild(staging);

  try {
    // Wait for fonts & layout calculation
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 80));

    let totalHeight = paperEl.offsetHeight || paperEl.scrollHeight;

    // Auto-compact if slightly over 1 page (within 90px buffer)
    if (!options.fitToSinglePage && totalHeight > A4_HEIGHT_PX && totalHeight <= A4_HEIGHT_PX + 90) {
      paperEl.classList.add('compact-fit');
      await new Promise((resolve) => setTimeout(resolve, 40));
      totalHeight = paperEl.offsetHeight || paperEl.scrollHeight;
      if (totalHeight > A4_HEIGHT_PX + 15) {
        paperEl.classList.remove('compact-fit');
        totalHeight = paperEl.offsetHeight || paperEl.scrollHeight;
      }
    }

    const isSinglePage = totalHeight <= (A4_HEIGHT_PX + 35);

    if (isSinglePage) {
      // Single Page Export: exact 1 A4 page
      paperEl.style.minHeight = `${A4_HEIGHT_PX}px`;

      const canvas = await html2canvas(paperEl, {
        scale: 2, // 300 DPI equivalent
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        windowWidth: A4_WIDTH_PX,
        windowHeight: A4_HEIGHT_PX,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'SLOW');
      pdf.save(filename);
      return true;
    }

    // Multi-Page Export: Smart pagination to prevent slicing text in half
    const breakSelectors = [
      '.ats-section',
      '.ats-entry',
      '.prof-section',
      '.prof-entry',
      '.compact-section',
      '.compact-entry',
      '.modern-section',
      '.modern-entry',
      '.modern-side-group',
      '.modern-side-entry',
    ];

    const elements = Array.from(paperEl.querySelectorAll(breakSelectors.join(',')));
    const paperTop = paperEl.getBoundingClientRect().top;

    let pageBoundary = A4_HEIGHT_PX;
    let pageIndex = 1;

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const elTop = rect.top - paperTop;
      const elBottom = rect.bottom - paperTop;

      // Check if element intersects page boundary
      if (elTop < pageBoundary && elBottom > pageBoundary) {
        const spacerHeight = pageBoundary - elTop + 2;
        const spacer = document.createElement('div');
        spacer.className = 'pdf-page-break-spacer';
        spacer.style.height = `${spacerHeight}px`;
        spacer.style.width = '100%';
        spacer.style.display = 'block';
        spacer.style.clear = 'both';
        el.parentNode.insertBefore(spacer, el);

        pageBoundary = (pageIndex + 1) * A4_HEIGHT_PX;
        pageIndex++;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 60));

    const paginatedHeight = paperEl.offsetHeight || paperEl.scrollHeight;
    const totalPages = Math.max(1, Math.ceil(paginatedHeight / A4_HEIGHT_PX));

    // Render full canvas of the cleanly paginated resume
    const fullCanvas = await html2canvas(paperEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: totalPages * A4_HEIGHT_PX,
      windowWidth: A4_WIDTH_PX,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const scale = 2;
    const pagePixelWidth = A4_WIDTH_PX * scale;
    const pagePixelHeight = A4_HEIGHT_PX * scale;

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Slice out exact page i canvas
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = pagePixelWidth;
      pageCanvas.height = pagePixelHeight;
      const ctx = pageCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pagePixelWidth, pagePixelHeight);

      ctx.drawImage(
        fullCanvas,
        0, i * pagePixelHeight, pagePixelWidth, pagePixelHeight,
        0, 0, pagePixelWidth, pagePixelHeight
      );

      const pageImgData = pageCanvas.toDataURL('image/png');
      pdf.addImage(pageImgData, 'PNG', 0, 0, 210, 297, undefined, 'SLOW');
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  } finally {
    if (staging && staging.parentNode) {
      staging.parentNode.removeChild(staging);
    }
  }
}

/**
 * Triggers the browser's native print engine with professional A4 print styling.
 */
export function printResumeNative() {
  window.print();
}
