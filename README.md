# NZ Tax Invoice Generator

A single-page, in-browser invoice generator specifically designed for New Zealand sole traders.

🔗 **Live App**: [https://warwick-allen.github.io/invoice-generator/](https://warwick-allen.github.io/invoice-generator/)

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

**Online**: Simply visit [https://warwick-allen.github.io/invoice-generator/](https://warwick-allen.github.io/invoice-generator/)

**Offline**: Open `index.html` in any modern web browser

1. Fill in your business details (saved to browser cookies)
2. Add or select client details
3. Add invoice line items
4. Click "Generate Invoice" to preview
5. Print or save as PDF

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

## Testing

This project includes a comprehensive end-to-end test suite using Playwright.

### Test Suite Overview
- **80+ test cases** across 11 test files
- **5 browser configurations** (Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari)
- **100% feature coverage** (forms, calculations, workflows, accessibility, responsive design)
- **Pattern**: Page Object Model with TypeScript

### Quick Start

```bash
# Install dependencies (first time only)
npm install
npx playwright install

# Run all tests
npm test

# Interactive UI mode (recommended)
npm run test:ui

# Run with browser visible
npm run test:headed

# View test report
npm run report
```

### Test Documentation

All test documentation is located in the `docs/` directory:

- **[docs/README_START_HERE.md](docs/README_START_HERE.md)** ⭐ - Start here
- **[docs/INDEX.md](docs/INDEX.md)** - Quick navigation hub
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - Quick commands reference
- **[docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Comprehensive testing guide
- **[docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Architecture details

### Test Structure

```
tests/
├── helpers/
│   ├── page-objects.ts    # Page Object Model classes
│   └── test-data.ts       # Test data and utilities
├── accessibility.spec.ts   # Accessibility tests
├── bank-details.spec.ts    # Bank account tests
├── business-details.spec.ts # Business information tests
├── calculations.spec.ts    # GST and totals tests
├── client-details.spec.ts  # Client management tests
├── integration.spec.ts     # End-to-end workflow tests
├── invoice-details.spec.ts # Invoice metadata tests
├── invoice-generation.spec.ts # Generation and print tests
├── invoice-items.spec.ts   # Line items tests
├── page-objects.spec.ts    # Page object integration tests
└── responsive.spec.ts      # Responsive design tests
```

### CI/CD

Tests can be run automatically via GitHub Actions. See `.github/workflows/playwright.yml` for the test workflow configuration.

### Requirements

- Node.js 18 or higher (specified in `.nvmrc`)
- npm 10 or higher

## Deployment

This app is automatically deployed to GitHub Pages whenever changes are pushed to the main branch. The deployment is handled by GitHub Actions.
