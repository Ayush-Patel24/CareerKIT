import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Exports a DOM element as a high-resolution A4 PDF document.
 * @param {HTMLElement} element - The resume preview container DOM element.
 * @param {string} filename - The desired download filename.
 * @returns {Promise<boolean>}
 */
export async function exportResumeToPDF(element, filename = 'Resume.pdf') {
  if (!element) {
    throw new Error('Resume element not found for export');
  }

  try {
    // Generate high-resolution canvas (scale 2 gives crisp 300 DPI-equivalent quality)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Calculate image height based on canvas aspect ratio
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, '', 'FAST');
    heightLeft -= pdfHeight;

    // Add subsequent pages if content spans beyond page 1
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, '', 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
}

/**
 * Fallback to browser native print dialog with A4 styling
 */
export function printResumeNative() {
  window.print();
}
