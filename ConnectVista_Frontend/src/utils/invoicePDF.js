import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import resources from '../resources';

/**
 * Generates a professional PDF invoice
 * @param {Object} invoice - The invoice data from the backend
 */
export const generateInvoicePDF = async (invoice) => {
  // Use jsPDF constructor
  const doc = new jsPDF();
  
  // Make sure autoTable is available on the instance
  // In some build environments, it doesn't automatically attach
  const applyAutoTable = (d, options) => {
    if (typeof d.autoTable === 'function') {
      d.autoTable(options);
    } else {
      autoTable(d, options);
    }
  };

  const primaryColor = [59, 130, 246]; // Blue-600
  const secondaryColor = [107, 114, 128]; // Gray-500

  // Helper to add image
  const addImageFromUrl = (url, x, y, w, h) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        try {
          doc.addImage(img, 'PNG', x, y, w, h);
        } catch (e) {
          console.warn('Could not add image to PDF:', e);
        }
        resolve();
      };
      img.onerror = () => {
        console.warn('Failed to load image for PDF');
        resolve();
      };
    });
  };

  // 1. Header & Logo
  // Add Logo (Using square-ish ratio to avoid stretch)
  await addImageFromUrl(resources.Logo.src, 15, 10, 15, 15);

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Connect', 32, 20);
  doc.setTextColor(0, 0, 0);
  doc.text('Vista', 64, 20);

  // Invoice Label
  doc.setFontSize(30);
  doc.setTextColor(200, 200, 200);
  doc.text('INVOICE', 140, 25);

  // 2. Info Section
  doc.setDrawColor(230, 230, 230);
  doc.line(15, 35, 195, 35);

  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'normal');
  
  // Left side: From (Provider)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('FROM:', 15, 45);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(invoice.providerId?.businessName || invoice.providerId?.name || 'Service Provider', 15, 50);
  doc.text(invoice.providerId?.email || '', 15, 55);
  if (invoice.providerId?.phone) doc.text(`Phone: ${invoice.providerId.phone}`, 15, 60);

  // Right side: To (Seeker)
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('BILL TO:', 120, 45);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(invoice.seekerId?.name || 'Valued Customer', 120, 50);
  doc.text(invoice.seekerId?.email || '', 120, 55);
  if (invoice.seekerId?.phone) doc.text(`Phone: ${invoice.seekerId.phone}`, 120, 60);

  // Invoice Details
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice #:`, 15, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoiceNumber, 40, 75);

  doc.setFont('helvetica', 'bold');
  doc.text(`Date:`, 15, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoice.createdAt).toLocaleDateString(), 40, 80);

  doc.setFont('helvetica', 'bold');
  doc.text(`Status:`, 120, 75);
  doc.setTextColor(34, 197, 94); // Green
  doc.text(invoice.paymentStatus?.toUpperCase() || 'PAID', 140, 75);
  doc.setTextColor(0, 0, 0);

  doc.setFont('helvetica', 'bold');
  doc.text(`Method:`, 120, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.paymentMethod?.toUpperCase() || 'CASH', 140, 80);

  // 3. Items Table
  const tableData = invoice.items.map((item, idx) => [
    idx + 1,
    item.description,
    `INR ${parseFloat(item.amount).toLocaleString()}`
  ]);

  // Add visiting charge if exists
  if (invoice.visitingCharge > 0) {
    tableData.push([
      '',
      'Visiting/Inspection Charge (Fixed)',
      `INR ${invoice.visitingCharge.toLocaleString()}`
    ]);
  }

  applyAutoTable(doc, {
    startY: 90,
    head: [['#', 'Description', 'Amount']],
    body: tableData,
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 15 },
      2: { halign: 'right', fontStyle: 'bold' }
    }
  });

  // 4. Totals
  const finalY = (doc.lastAutoTable?.finalY || 150) + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Grand Total:', 120, finalY);
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`INR ${invoice.grandTotal.toLocaleString()}`, 160, finalY);

  // 5. Digital Signature section
  const sigY = finalY + 30;
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(200, 200, 200);
  doc.line(15, sigY + 15, 75, sigY + 15);
  doc.line(120, sigY + 15, 180, sigY + 15);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Provider Signature', 30, sigY + 20);
  doc.text('Authorized System Signature', 135, sigY + 20);

  // Visual Digital Signature (Stylized)
  doc.setFont('courier', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 150); // Dark Blue for ink look
  doc.text(invoice.providerId?.name || 'Provider', 25, sigY + 10);
  
  // System Signature
  doc.setFont('times', 'italic');
  doc.text('ConnectVista Verified', 130, sigY + 10);

  // 6. Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const footerY = 280;
  doc.text('Thank you for using ConnectVista! This is a system-generated electronic invoice.', 105, footerY, { align: 'center' });
  doc.text('For support, contact support@connectvista.com', 105, footerY + 5, { align: 'center' });

  // Save the PDF
  doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
};
