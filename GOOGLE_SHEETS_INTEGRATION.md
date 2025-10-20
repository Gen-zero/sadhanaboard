# Google Sheets Integration Guide

This guide explains how to set up and use the Google Sheets integration in SadhanaBoard to export book data.

## Free Alternative: CSV Export

Before setting up the Google Sheets integration (which requires a Google Cloud project), you can use our free CSV export feature:

1. Log in to the SadhanaBoard admin panel
2. Navigate to Settings > Integrations
3. Click on the "Export as CSV" tab
4. Click "Export All Books as CSV"
5. Save the downloaded file to your computer
6. Open Google Sheets
7. Go to File > Import > Upload
8. Select the downloaded CSV file
9. Choose "Replace spreadsheet" and click "Import data"

This method requires no setup and is completely free.

## Google Sheets Integration Setup Instructions

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API for your project:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

### 2. Create Service Account Credentials

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `sadhana-board-integration`
   - Description: `Service account for SadhanaBoard Google Sheets integration`
   - Click "Create and Continue"
4. Grant the service account the "Editor" role
5. Click "Done"
6. Click on the newly created service account
7. Go to the "Keys" tab
8. Click "Add Key" > "Create new key"
9. Select "JSON" as the key type
10. Click "Create" - this will download a JSON file with your credentials

### 3. Set up Google Sheets

1. Create a new Google Sheet or use an existing one
2. Share the spreadsheet with the service account email (found in the JSON credentials file under `client_email`)
3. Give the service account "Editor" access

### 4. Configure Integration in SadhanaBoard

1. Log in to the SadhanaBoard admin panel
2. Navigate to Settings > Integrations
3. Click "Create Integration"
4. Fill in the form:
   - Name: Give your integration a descriptive name (e.g., "Library Export to Google Sheets")
   - Provider: Select "Google Sheets" (this should be auto-selected)
   - Credentials: Paste the entire contents of the JSON credentials file
   - Spreadsheet ID (optional): If you want to use an existing spreadsheet, paste its ID here
   - Enable the integration
5. Click "Create Integration"

### 5. Export Books to Google Sheets

1. In the Integrations tab, select "Export to Google Sheets"
2. Choose your integration from the dropdown
3. Choose whether to create a new spreadsheet or use an existing one:
   - For a new spreadsheet, provide a title
   - For an existing spreadsheet, provide its ID
4. Click "Export Books"

## Finding Your Spreadsheet ID

The Spreadsheet ID is part of the Google Sheets URL:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

For example, if your URL is:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```

Then your Spreadsheet ID is:
```
1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```

## Security Considerations

- Store your service account JSON credentials securely
- Limit the permissions of the service account to only what is necessary
- Regularly rotate your service account keys
- Only share spreadsheets with the service account when needed

## Troubleshooting

### Common Issues

1. **"Failed to authenticate with Google Sheets"**
   - Check that your JSON credentials are valid and properly formatted
   - Ensure the Google Sheets API is enabled for your project

2. **"Permission denied"**
   - Make sure you've shared the spreadsheet with the service account email
   - Verify the service account has Editor access

3. **"Spreadsheet ID is required"**
   - Either provide a spreadsheet ID or select the "Create new spreadsheet" option

### Getting Help

If you encounter issues not covered in this guide, please:
1. Check the application logs for detailed error messages
2. Verify your Google Cloud project settings
3. Contact support with details about the error you're experiencing