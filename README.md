# NZ Tax Invoice Generator

A single-page, in-browser invoice generator specifically designed for New Zealand sole traders.

## Features

- **No Database Required**: All data is stored in browser cookies
- **Trader Details Management**: Save your business information for reuse
- **Client Management**: Store multiple client details
- **NZ Tax Compliance**: 
  - Automatic 15% GST calculation
  - Optional GST number field
  - Professional tax invoice format
- **Banking Compliance**: Includes account name verification notice (as required by NZ banks)
- **Auto-incrementing Invoice Numbers**: Tracks the last invoice number used
- **Print/PDF Ready**: Print-friendly layout for saving as PDF

## Usage

1. Open `index.html` in any modern web browser
2. Fill in your business details (saved to browser cookies)
3. Add or select client details
4. Add invoice line items
5. Click "Generate Invoice" to preview
6. Print or save as PDF

## Bank Account Details

The app now includes specific fields for:
- Bank Name
- Account Name (exactly as it appears on your bank account)
- Account Number

This ensures compliance with NZ banking requirements where the account name must match the account number.

## Data Persistence

All data is stored in browser cookies:
- Trader/business details
- Client list
- Last invoice number used

Data persists across browser sessions but is specific to each browser.

## Browser Compatibility

Works with all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

## No Installation Required

This is a standalone HTML file with no dependencies. Simply open `index.html` in your browser.

## Privacy

All data is stored locally in your browser. Nothing is sent to any server.
