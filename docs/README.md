# Test Suite Documentation

Complete documentation for the NZ Tax Invoice Generator test suite.

---

## 📚 Documentation Index

### Getting Started
- **[README_START_HERE.md](README_START_HERE.md)** ⭐ - Complete introduction and walkthrough
- **[QUICK_START.md](QUICK_START.md)** - Quick command reference
- **[INDEX.md](INDEX.md)** - Navigation hub for all documentation

### Guides
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive guide for writing and debugging tests
- **[INTEGRATION.md](INTEGRATION.md)** - CI/CD integration strategies and workflows
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture and file organisation

---

## 🚀 Quick Start

```bash
# Run tests in interactive UI mode
npm run test:ui

# Run all tests (headless)
npm test

# View test report
npm run report
```

---

## 📖 What to Read

### New to the Test Suite?
1. Start with **[README_START_HERE.md](README_START_HERE.md)**
2. Try running tests with `npm run test:ui`
3. Read **[QUICK_START.md](QUICK_START.md)** for commands

### Writing Tests?
1. Read **[TESTING_GUIDE.md](TESTING_GUIDE.md)**
2. Review existing tests in `../tests/` directory
3. Use page objects from `../tests/helpers/page-objects.ts`

### Setting Up CI/CD?
1. Read **[INTEGRATION.md](INTEGRATION.md)**
2. Review `.github/workflows/playwright.yml`
3. Customise for your needs

### Understanding Architecture?
1. Read **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)**
2. Review `playwright.config.ts`
3. Study the Page Object Model implementation

---

## 🎯 Test Coverage

### Features Tested (100%)
- ✅ Business Details Form
- ✅ Bank Account Details
- ✅ Client Management (CRUD)
- ✅ Invoice Details
- ✅ Invoice Items
- ✅ Calculations (GST 15%)
- ✅ Invoice Generation
- ✅ Workflows (E2E)
- ✅ Accessibility
- ✅ Responsive Design

### Browsers (5 Configurations)
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit/Safari (Desktop)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### Test Metrics
- **Test Files:** 11 specification files
- **Test Cases:** 80+
- **Helper Files:** 2 (Page Objects + Test Data)
- **Browsers:** 5 configurations
- **Total Executions:** 400+ per run

---

## 💻 Common Commands

```bash
# Interactive UI mode (best for development)
npm run test:ui

# Run all tests
npm test

# Run with browser visible
npm run test:headed

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile

# Debug mode
npm run test:debug

# View HTML report
npm run report

# Generate tests by recording
npm run codegen
```

---

## 🎨 Test Architecture

### Pattern: Page Object Model
- Separates test logic from UI interaction
- Centralised selectors and methods
- Easy to maintain and update
- Type-safe with TypeScript

### Structure
```
tests/
├── helpers/
│   ├── page-objects.ts    # Page Object Model classes
│   └── test-data.ts       # Test data and utilities
└── *.spec.ts              # Test specifications
```

---

## 📝 Writing Tests

### Basic Pattern
```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Field').fill('value');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Success')).toBeVisible();
});
```

### Using Page Objects
```typescript
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

---

## 🐛 Debugging

### Interactive UI Mode (Recommended)
```bash
npm run test:ui
```
- Visual test runner
- Step through tests
- Time-travel debugging
- See test execution

### Debug Mode
```bash
npm run test:debug
```
- Playwright Inspector
- Step-by-step execution
- Inspect DOM
- View network activity

### View Reports
```bash
npm run report
```
- HTML report with details
- Screenshots on failure
- Execution traces
- Pass/fail statistics

---

## 🔄 CI/CD Integration

The test suite includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:
- Runs on push, PR, and daily schedule
- Tests across all 5 browsers
- Uploads reports and screenshots
- Retains results for 30 days

See **[INTEGRATION.md](INTEGRATION.md)** for detailed CI/CD setup options.

---

## 📚 Additional Resources

### External Documentation
- [Playwright Docs](https://playwright.dev/)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Local Files
- Root: `../README.md` - Main project README
- Root: `../GETTING_STARTED_WITH_TESTS.md` - Quick start
- Root: `../VERIFICATION_CHECKLIST.md` - Verification steps

---

## ✅ Quality Standards

### Test Quality
- ✅ Descriptive test names
- ✅ Clear assertions
- ✅ Proper waits (auto-waiting)
- ✅ Page Object pattern
- ✅ Reusable test data

### Code Quality
- ✅ TypeScript for type safety
- ✅ Consistent formatting
- ✅ Clear comments
- ✅ No hardcoded values
- ✅ DRY principles

---

**For more information, see the individual guide files listed above.**
