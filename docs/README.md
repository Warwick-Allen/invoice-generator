# NZ Tax Invoice Generator - Test Suite

Comprehensive end-to-end test suite for the NZ Tax Invoice Generator application deployed at https://warwick-allen.github.io/invoice-generator/

## Overview

This test suite uses [Playwright](https://playwright.dev/) to perform automated testing of the invoice generator application. Tests cover all major functionality including business details, client management, invoice creation, calculations, and user interface behaviour.

## Test Coverage

### Business Details Tests (`business-details.spec.ts`)
- Display of all business detail fields
- Validation of required fields
- Saving business details to local storage
- Data persistence across sessions
- Clear functionality

### Bank Details Tests (`bank-details.spec.ts`)
- Display of bank account fields
- Account name verification warning
- Required field validation
- Data persistence

### Client Details Tests (`client-details.spec.ts`)
- Client dropdown selector
- Adding new clients
- Saving clients to list
- Loading saved clients
- Deleting clients
- Required field validation

### Invoice Details Tests (`invoice-details.spec.ts`)
- Invoice number, date, and due date fields
- Required field validation
- Date field functionality

### Invoice Items Tests (`invoice-items.spec.ts`)
- Adding invoice items
- Removing invoice items
- Subtotal calculations
- GST calculations (15%)
- Total calculations
- Dynamic updates

### Calculation Tests (`calculations.spec.ts`)
- GST calculation accuracy (15% rate)
- Single and multiple item totals
- Decimal rounding (2 decimal places)
- Calculation updates on item changes

### Invoice Generation Tests (`invoice-generation.spec.ts`)
- Generate invoice functionality
- Print invoice functionality
- Reset form functionality
- Required field validation before generation

### Integration Tests (`integration.spec.ts`)
- Complete end-to-end invoice creation workflow
- Data persistence across sessions
- Multiple client management
- Switching between saved clients

### Accessibility Tests (`accessibility.spec.ts`)
- Page title and heading structure
- Form labels and associations
- Keyboard navigation
- Required field indicators
- Section organisation

### Responsive Design Tests (`responsive.spec.ts`)
- Mobile viewport (375x667, 320x568)
- Tablet viewport (768x1024)
- Desktop viewport (1920x1080)
- Landscape orientation
- Touch target sizing
- Readable font sizes

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## Installation

1. Navigate to the test directory:
```bash
cd invoice-generator-tests
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see the browser)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/business-details.spec.ts
```

### Run tests for specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View test report
```bash
npm run report
```

## Test Configuration

The test configuration is defined in `playwright.config.ts`:

- **Base URL**: https://warwick-allen.github.io/invoice-generator/
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 retries on CI, 0 locally
- **Reporters**: HTML report and list
- **Screenshots**: Captured on failure
- **Trace**: Captured on first retry

## Project Structure

```
invoice-generator-tests/
├── tests/
│   ├── business-details.spec.ts    # Business information tests
│   ├── bank-details.spec.ts        # Bank account tests
│   ├── client-details.spec.ts      # Client management tests
│   ├── invoice-details.spec.ts     # Invoice metadata tests
│   ├── invoice-items.spec.ts       # Line items tests
│   ├── calculations.spec.ts        # GST and totals tests
│   ├── invoice-generation.spec.ts  # Generation and print tests
│   ├── integration.spec.ts         # End-to-end workflow tests
│   ├── accessibility.spec.ts       # A11y tests
│   └── responsive.spec.ts          # Responsive design tests
├── playwright.config.ts             # Playwright configuration
├── package.json                     # Dependencies and scripts
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

## Writing New Tests

To add new tests:

1. Create a new `.spec.ts` file in the `tests/` directory
2. Import Playwright test utilities:
```typescript
import { test, expect } from '@playwright/test';
```

3. Write your tests using the Playwright API:
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

## Best Practices

1. **Use appropriate selectors**: Prefer role-based and label-based selectors over CSS selectors
2. **Wait appropriately**: Use Playwright's auto-waiting features; add explicit waits only when necessary
3. **Test in isolation**: Each test should be independent and not rely on state from other tests
4. **Clear, descriptive names**: Use descriptive test names that explain what is being tested
5. **Organise logically**: Group related tests using `test.describe()` blocks
6. **Clean up**: Reset state between tests using `beforeEach` and `afterEach` hooks

## Troubleshooting

### Tests are flaky
- Increase timeout values in `playwright.config.ts`
- Add explicit waits using `await page.waitForTimeout(ms)`
- Use `await page.waitForSelector()` for specific elements

### Selectors not working
- Use the Playwright Inspector to debug selectors: `npx playwright test --debug`
- Use the Playwright UI mode to interactively develop tests: `npm run test:ui`

### Tests fail on CI but pass locally
- Check browser versions match
- Verify network conditions
- Ensure proper wait conditions are used

## CI/CD Integration

This test suite can be integrated into CI/CD pipelines. Example GitHub Actions configuration:

```yaml
- name: Install dependencies
  run: npm ci
  working-directory: ./invoice-generator-tests

- name: Install Playwright Browsers
  run: npx playwright install --with-deps
  working-directory: ./invoice-generator-tests

- name: Run Playwright tests
  run: npm test
  working-directory: ./invoice-generator-tests

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: invoice-generator-tests/playwright-report/
```

## Contributing

When adding new features to the invoice generator app, please:

1. Add corresponding tests to cover the new functionality
2. Update existing tests if behaviour changes
3. Ensure all tests pass before submitting changes
4. Update this README if new test categories are added

## Support

For issues with:
- The test suite: Review Playwright documentation at https://playwright.dev/
- The invoice generator app: Visit https://warwick-allen.github.io/invoice-generator/

## Licence

This test suite is provided as-is for testing the NZ Tax Invoice Generator application.
