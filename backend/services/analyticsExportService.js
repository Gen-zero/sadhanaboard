const db = require('../config/db');
const { PassThrough } = require('stream');
const PDFDocument = require('pdfkit');
const { createObjectCsvStringifier } = require('csv-writer');

/**
 * analyticsExportService
 * Provides CSV and PDF export helpers for analytics reports.
 */
const analyticsExportService = {
  async generateCSVReport(reportData, columns) {
    // reportData: array of objects
    try {
      const header = columns.map(c => ({ id: c.key, title: c.title }));
      const csvStringifier = createObjectCsvStringifier({ header });
      const headerLine = csvStringifier.getHeaderString();
      const body = csvStringifier.stringifyRecords(reportData || []);
      return headerLine + body;
    } catch (e) {
      console.error('generateCSVReport error', e);
      throw e;
    }
  },

  async streamPDFReport(reportTitle, reportData, writableStream) {
    // very small PDF generator using pdfkit
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ autoFirstPage: true });
        doc.pipe(writableStream);
        doc.fontSize(18).text(reportTitle, { align: 'center' });
        doc.moveDown();
        doc.fontSize(10);
        // simple table-like layout
        for (const row of reportData) {
          const line = Object.values(row).map(v => (v === null || v === undefined) ? '' : String(v)).join(' | ');
          doc.text(line);
        }
        doc.end();
        writableStream.on('finish', () => resolve());
        writableStream.on('error', (err) => reject(err));
      } catch (e) {
        reject(e);
      }
    });
  }
};

module.exports = analyticsExportService;
