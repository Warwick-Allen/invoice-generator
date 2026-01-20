# Testing Guide for NZ Tax Invoice Generator

## Quick Start

1. **Install dependencies:**
   ```bash
   ./setup.sh
   ```
   or manually:
   ```bash
   npm install
   npx playwright install
   ```

2. **Run all tests:**
   ```bash
   npm test
   ```

3. **View results:**
   ```bash
   npm run report
   ```

## Test Organization

### Test Categories

#### 1. **Unit Component Tests**
- `business-details.spec.ts` - Business information fields and validation
- `bank-details.spec.ts` - Bank account information
- `client-details.spec.ts` - Client management functionality
- `invoice-details.spec.ts` - Invoice metadata
- `invoice-items.spec.ts` - Line item management

#### 2. **Functional Tests**
- `calculations.spec.ts` - GST and total calculations
- `invoice-generation.spec.ts` - Invoice generation and printing

#### 3. **Integration Tests**
- `integration.spec.ts` - End-to-end workflows
- `page-objects.spec.ts` - Page object model integration

#### 4. **Non-functional Tests**
- `accessibility.spec.ts` - Accessibility compliance
- `responsive.spec.ts` - Responsive design and mobile compatibility

## Running Specific Tests

### Run a single test file
```bash
npx playwright test tests/business-details.spec.ts
```

### Run a single test by name
```bash
npx playwright test -g "should save business details"
```

### Run tests for specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run mobile tests only
```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Debugging Tests

### Interactive UI Mode (Recommended)
```bash
npm run test:ui
```
This opens an interactive interface where you can:
- See all tests
- Run individual tests
- Watch tests execute in real-time
- Time travel through test execution
- Inspect DOM at each step

### Debug Mode
```bash
npm run test:debug
```
Opens the Playwright Inspector with:
- Step-by-step execution
- DOM snapshots
- Network activity
- Console logs

### Visual Debugging (Headed Mode)
```bash
npm run test:headed
```
Runs tests with browser window visible.

### Trace Viewer
When a test fails, traces are automatically captured. View them:
```bash
npx playwright show-trace test-results/.../trace.zip
```

## Writing New Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something specific', async ({ page }) => {
    // Arrange
    await page.getByLabel('Field Name').fill('value');
    
    // Act
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Using Page Objects
```typescript
import { test, expect } from '@playwright/test';
import { InvoiceGeneratorPage } from './helpers/page-objects';
import { testBusinessDetails } from './helpers/test-data';

test('should save business details', async ({ page }) => {
  const invoicePage = new InvoiceGeneratorPage(page);
  await invoicePage.goto();
  
  await invoicePage.fillBusinessDetails(testBusinessDetails.valid);
  await invoicePage.saveBusinessDetails();
  
  await expect(invoicePage.businessName).toHaveValue(testBusinessDetails.valid.name);
});
```

### Using Test Data
```typescript
import { testClientDetails, generateInvoiceNumber } from './helpers/test-data';

test('should create invoice', async ({ page }) => {
  const invoiceNum = generateInvoiceNumber();
  // Use generated data
});
```

## Best Practices

### 1. Selector Priority
Use selectors in this order:
1. `getByRole()` - Most resilient
2. `getByLabel()` - For form fields
3. `getByText()` - For text content
4. `getByTestId()` - If test IDs are added to the app
5. CSS selectors - Last resort

### 2. Waiting Strategies
```typescript
// ✅ Good - Auto-waiting
await expect(page.getByText('Success')).toBeVisible();

// ⚠️ Use sparingly - Explicit waiting
await page.waitForTimeout(1000);

// ✅ Better - Wait for specific condition
await page.waitForSelector('[data-loaded="true"]');
```

### 3. Assertions
```typescript
// Use Playwright's expect for auto-retry
await expect(page.getByText('Hello')).toBeVisible();

// Not recommended - No retry
const text = await page.textContent('div');
expect(text).toBe('Hello');
```

### 4. Test Isolation
Each test should be independent:
```typescript
test.beforeEach(async ({ page }) => {
  // Clear storage
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
});
```

### 5. Page Object Benefits
- Reduces duplication
- Easier maintenance
- Better readability
- Type safety

## Common Patterns

### Testing Form Validation
```typescript
test('should validate required fields', async ({ page }) => {
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Check for validation message or invalid state
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
});
```

### Testing Local Storage
```typescript
test('should persist data', async ({ page }) => {
  await page.getByLabel('Name').fill('Test');
  await page.getByRole('button', { name: 'Save' }).click();
  
  await page.reload();
  
  await expect(page.getByLabel('Name')).toHaveValue('Test');
});
```

### Testing Calculations
```typescript
test('should calculate total', async ({ page }) => {
  // Add items
  await page.getByRole('button', { name: 'Add Item' }).click();
  
  // Get totals
  const subtotal = await page.getByText(/Subtotal.*\$(\d+\.\d{2})/);
  await expect(subtotal).toBeVisible();
});
```

### Testing Print/Download
```typescript
test('should trigger print', async ({ page }) => {
  const printPromise = page.waitForEvent('dialog');
  await page.getByRole('button', { name: 'Print' }).click();
  const dialog = await printPromise;
  await dialog.accept();
});
```

## Troubleshooting

### Tests are flaky
1. Add explicit waits for dynamic content:
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

2. Increase timeouts:
   ```typescript
   test('slow test', async ({ page }) => {
     test.setTimeout(60000); // 60 seconds
   });
   ```

3. Check for race conditions:
   ```typescript
   await page.waitForSelector('[data-ready="true"]');
   ```

### Selectors not found
1. Use Playwright Inspector to verify selectors:
   ```bash
   npx playwright test --debug
   ```

2. Use more specific selectors:
   ```typescript
   // Instead of:
   page.getByText('Submit')
   
   // Use:
   page.getByRole('button', { name: 'Submit', exact: true })
   ```

### Tests pass locally but fail in CI
1. Ensure browsers are installed:
   ```bash
   npx playwright install --with-deps
   ```

2. Check viewport differences:
   ```typescript
   test.use({ viewport: { width: 1920, height: 1080 } });
   ```

3. Add screenshots on failure (already configured)

## Performance Tips

### Run tests in parallel
```bash
npx playwright test --workers=4
```

### Run only changed tests
```bash
npx playwright test --only-changed
```

### Skip slow tests during development
```typescript
test.skip('slow test', async ({ page }) => {
  // This test will be skipped
});
```

### Use test fixtures for common setup
```typescript
import { test as base } from '@playwright/test';

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await use(page);
  },
});
```

## Continuous Integration

### GitHub Actions
The `.github/workflows/playwright.yml` file is configured to:
- Run on push and pull requests
- Run daily at 2am UTC
- Test across all browsers
- Upload test reports and screenshots
- Retain results for 30 days

### Local CI Simulation
```bash
CI=true npm test
```

## Coverage

Current test coverage includes:
- ✅ All form fields and validation
- ✅ Data persistence (localStorage)
- ✅ Client management (CRUD operations)
- ✅ GST calculations (15%)
- ✅ Invoice generation workflow
- ✅ Responsive design
- ✅ Accessibility basics
- ✅ Multi-browser compatibility

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## Support

For issues:
1. Check this guide first
2. Review Playwright documentation
3. Check test output and screenshots
4. Use debug mode to step through tests
5. Review trace files for failed tests
