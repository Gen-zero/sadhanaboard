const { google } = require('googleapis');
const integrationService = require('./integrationService');

/**
 * Google Sheets Service
 * Handles communication with Google Sheets API
 */
class GoogleSheetsService {
  /**
   * Get authenticated Google Sheets client
   * @param {string} integrationId - The integration ID in admin_integrations table
   */
  static async getAuthenticatedClient(integrationId) {
    try {
      // Get integration credentials from database
      const integration = await integrationService.getIntegration(integrationId);
      if (!integration || !integration.enabled) {
        throw new Error('Integration not found or not enabled');
      }

      // Create JWT client with credentials
      const auth = new google.auth.GoogleAuth({
        credentials: integration.credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      // Create Google Sheets client
      const sheets = google.sheets({ version: 'v4', auth });
      return { sheets, integration };
    } catch (error) {
      throw new Error(`Failed to authenticate with Google Sheets: ${error.message}`);
    }
  }

  /**
   * Create a new spreadsheet
   * @param {string} integrationId - The integration ID
   * @param {string} title - Title for the new spreadsheet
   */
  static async createSpreadsheet(integrationId, title) {
    try {
      const { sheets, integration } = await this.getAuthenticatedClient(integrationId);
      
      const response = await sheets.spreadsheets.create({
        resource: {
          properties: {
            title: title
          }
        },
        fields: 'spreadsheetId'
      });
      
      const spreadsheetId = response.data.spreadsheetId;
      
      // Update integration with the new spreadsheet ID
      if (spreadsheetId) {
        await integrationService.updateIntegration(integrationId, {
          spreadsheet_id: spreadsheetId
        });
      }
      
      return spreadsheetId;
    } catch (error) {
      throw new Error(`Failed to create spreadsheet: ${error.message}`);
    }
  }

  /**
   * Append book data to a spreadsheet
   * @param {string} integrationId - The integration ID
   * @param {string} spreadsheetId - The spreadsheet ID
   * @param {Array} bookData - Array of book objects to append
   */
  static async appendBookData(integrationId, spreadsheetId, bookData) {
    try {
      const { sheets } = await this.getAuthenticatedClient(integrationId);
      
      // Prepare data for Google Sheets
      const values = [
        ['Title', 'Author', 'Traditions', 'Description', 'Year', 'Language', 'Page Count', 'Created At'], // Header row
        ...bookData.map(book => [
          book.title || '',
          book.author || '',
          Array.isArray(book.traditions) ? book.traditions.join(', ') : (book.traditions || ''),
          book.description || '',
          book.year || '',
          book.language || '',
          book.page_count || '',
          book.created_at ? new Date(book.created_at).toISOString() : ''
        ])
      ];
      
      // Append data to spreadsheet
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        resource: {
          values: values
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to append book data to spreadsheet: ${error.message}`);
    }
  }

  /**
   * Update spreadsheet with book data (overwrites existing data)
   * @param {string} integrationId - The integration ID
   * @param {string} spreadsheetId - The spreadsheet ID
   * @param {Array} bookData - Array of book objects to update
   */
  static async updateSpreadsheet(integrationId, spreadsheetId, bookData) {
    try {
      const { sheets } = await this.getAuthenticatedClient(integrationId);
      
      // Prepare data for Google Sheets
      const values = [
        ['Title', 'Author', 'Traditions', 'Description', 'Year', 'Language', 'Page Count', 'Created At'], // Header row
        ...bookData.map(book => [
          book.title || '',
          book.author || '',
          Array.isArray(book.traditions) ? book.traditions.join(', ') : (book.traditions || ''),
          book.description || '',
          book.year || '',
          book.language || '',
          book.page_count || '',
          book.created_at ? new Date(book.created_at).toISOString() : ''
        ])
      ];
      
      // Clear existing data
      await sheets.spreadsheets.values.clear({
        spreadsheetId: spreadsheetId,
        range: 'A1:Z1000'
      });
      
      // Update spreadsheet with new data
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        resource: {
          values: values
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update spreadsheet with book data: ${error.message}`);
    }
  }
}

module.exports = GoogleSheetsService;