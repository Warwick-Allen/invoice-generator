# 📁 Project Structure

## Directory Tree

```
/home/wallen/invoice-generator-tests/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & npm scripts
│   ├── package-lock.json           # Locked dependency versions
│   ├── playwright.config.ts        # Playwright test configuration
│   ├── tsconfig.json               # TypeScript compiler configuration
│   ├── .nvmrc                      # Node.js version (18)
│   ├── .env.example                # Environment variables template
│   ├── .gitignore                  # Git ignore rules
│   └── setup.sh                    # Automated setup script
│
├── 📚 Documentation
│   ├── README.md                   # Main documentation (START HERE)
│   ├── QUICK_START.md              # Quick start guide ⭐
│   ├── TESTING_GUIDE.md            # Comprehensive testing guide
│   ├── SUMMARY.md                  # Project summary
│   ├── SETUP_COMPLETE.md           # Setup completion guide
│   └── PROJECT_STRUCTURE.md        # This file
│
├── 🧪 Test Files (tests/)
│   │
│   ├── 📦 Component Tests
│   │   ├── business-details.spec.ts    # Business information tests
│   │   ├── bank-details.spec.ts        # Bank account tests
│   │   ├── client-details.spec.ts      # Client management tests
│   │   ├── invoice-details.spec.ts     # Invoice metadata tests
│   │   └── invoice-items.spec.ts       # Line items tests
│   │
│   ├── 🔧 Functional Tests
│   │   ├── calculations.spec.ts        # GST & totals calculations
│   │   └── invoice-generation.spec.ts  # Generate & print tests
│   │
│   ├── 🔗 Integration Tests
│   │   ├── integration.spec.ts         # E2E workflows
│   │   └── page-objects.spec.ts        # Page object integration
│   │
│   ├── 🎨 Non-Functional Tests
│   │   ├── accessibility.spec.ts       # Accessibility compliance
│   │   └── responsive.spec.ts          # Responsive design tests
│   │
│   └── 🛠️ Helpers (tests/helpers/)
│       ├── test-data.ts                # Test data & utilities
│       └── page-objects.ts             # Page Object Model classes
│
├── ⚙️ CI/CD (.github/workflows/)
│   └── playwright.yml                  # GitHub Actions workflow
│
└── 📊 Generated (at runtime)
    ├── node_modules/                   # npm dependencies
    ├── test-results/                   # Test execution results
    ├── playwright-report/              # HTML test reports
    └── blob-report/                    # Binary test reports
```

---

## 📄 File Details

### Configuration

| File | Purpose | Lines |
|------|---------|-------|
| `package.json` | npm dependencies, scripts, metadata | ~30 |
| `playwright.config.ts` | Test runner configuration | ~35 |
| `tsconfig.json` | TypeScript compiler settings | ~15 |
| `.nvmrc` | Node.js version specification | 1 |

### Documentation

| File | Purpose | Size |
|------|---------|------|
| `README.md` | Main documentation with setup & usage | ~400 lines |
| `QUICK_START.md` | Quick reference for common tasks | ~150 lines |
| `TESTING_GUIDE.md` | Comprehensive testing guide | ~600 lines |
| `SUMMARY.md` | Complete project overview | ~350 lines |
| `SETUP_COMPLETE.md` | Setup completion checklist | ~400 lines |

### Test Files

#### Component Tests (5 files)
| File | Test Count | Purpose |
|------|------------|---------|
| `business-details.spec.ts` | 6 | Business form validation & persistence |
| `bank-details.spec.ts` | 5 | Bank account form & validation |
| `client-details.spec.ts` | 7 | Client CRUD operations |
| `invoice-details.spec.ts` | 6 | Invoice metadata fields |
| `invoice-items.spec.ts` | 7 | Line item management |

#### Functional Tests (2 files)
| File | Test Count | Purpose |
|------|------------|---------|
| `calculations.spec.ts` | 6 | GST & total calculations |
| `invoice-generation.spec.ts` | 6 | Generate, print, reset |

#### Integration Tests (2 files)
| File | Test Count | Purpose |
|------|------------|---------|
| `integration.spec.ts` | 3 | End-to-end workflows |
| `page-objects.spec.ts` | 8 | Page object integration |

#### Non-Functional Tests (2 files)
| File | Test Count | Purpose |
|------|------------|---------|
| `accessibility.spec.ts` | 9 | WCAG compliance basics |
| `responsive.spec.ts` | 7 | Responsive design |

### Helpers

| File | Lines | Purpose |
|------|-------|---------|
| `test-data.ts` | ~150 | Test data, generators, utilities |
| `page-objects.ts` | ~200 | Page Object Model implementation |

---

## 🎯 Test Organization by Feature

### User Forms (27 tests)
- Business Details (6)
- Bank Details (5)
- Client Details (7)
- Invoice Details (6)
- Invoice Items (7)

### Calculations (6 tests)
- GST calculation
- Subtotal calculation
- Total calculation
- Multi-item calculations
- Rounding

### Workflows (11 tests)
- Complete invoice creation
- Data persistence
- Client management
- Invoice generation
- Form reset

### Quality (16 tests)
- Accessibility (9)
- Responsive design (7)

### Integration (8 tests)
- E2E workflows (3)
- Page object usage (8)

**Total: 80+ test cases**

---

## 🌐 Browser Coverage

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chromium | ✅ | ✅ (Pixel 5) |
| Firefox | ✅ | - |
| WebKit | ✅ | ✅ (iPhone 12) |

**5 browser configurations** × **80+ tests** = **400+ test executions**

---

## 📊 Code Statistics

| Category | Files | Lines | Tests |
|----------|-------|-------|-------|
| Test Specs | 11 | ~1,500 | 80+ |
| Helpers | 2 | ~350 | - |
| Configuration | 4 | ~85 | - |
| Documentation | 6 | ~2,000 | - |
| CI/CD | 1 | ~70 | - |
| **Total** | **24** | **~4,000** | **80+** |

---

## 🔄 Workflow

```
┌─────────────┐
│  Developer  │
└──────┬──────┘
       │
       ├─── npm test ────────────┐
       │                         │
       ├─── npm run test:ui ─────┼──► Run Tests
       │                         │
       └─── npm run test:debug ──┘
       
       │
       ▼
┌──────────────────┐
│  Playwright Test │
│     Runner       │
└────────┬─────────┘
         │
         ├─── Load Config (playwright.config.ts)
         │
         ├─── Initialize Browsers
         │     ├── Chromium
         │     ├── Firefox
         │     ├── WebKit
         │     └── Mobile browsers
         │
         ├─── Run Test Suites
         │     ├── Component tests
         │     ├── Functional tests
         │     ├── Integration tests
         │     └── Non-functional tests
         │
         └─── Generate Reports
               ├── HTML Report
               ├── Screenshots (on failure)
               └── Traces (on failure)
```

---

## 🎨 Architecture

### Test Layers

```
┌─────────────────────────────────────────┐
│         Test Specifications             │
│  (*.spec.ts files - What to test)       │
└────────────┬────────────────────────────┘
             │
             │ uses
             │
┌────────────▼────────────────────────────┐
│        Page Object Model                │
│  (page-objects.ts - How to interact)    │
└────────────┬────────────────────────────┘
             │
             │ uses
             │
┌────────────▼────────────────────────────┐
│          Test Data                      │
│  (test-data.ts - What data to use)      │
└────────────┬────────────────────────────┘
             │
             │ targets
             │
┌────────────▼────────────────────────────┐
│    Application Under Test               │
│  (invoice-generator web app)            │
└─────────────────────────────────────────┘
```

### Separation of Concerns

1. **Test Logic** (`*.spec.ts`)
   - What to test
   - Assertions
   - Test scenarios

2. **UI Interaction** (`page-objects.ts`)
   - Element selectors
   - Interaction methods
   - Page navigation

3. **Test Data** (`test-data.ts`)
   - Sample data
   - Generators
   - Utilities

---

## 🚀 Execution Flow

### Test Execution

```
Start Test
    │
    ├─► beforeEach Hook
    │   ├─► Navigate to application
    │   └─► Initialize page objects
    │
    ├─► Test 1
    │   ├─► Arrange (setup data)
    │   ├─► Act (perform actions)
    │   └─► Assert (verify results)
    │
    ├─► Test 2
    │   └─► ...
    │
    └─► afterEach Hook
        └─► Cleanup (if needed)
```

### Parallel Execution

```
Main Process
    │
    ├─── Worker 1 ───► Chromium Tests
    │
    ├─── Worker 2 ───► Firefox Tests
    │
    ├─── Worker 3 ───► WebKit Tests
    │
    ├─── Worker 4 ───► Mobile Chrome Tests
    │
    └─── Worker 5 ───► Mobile Safari Tests
```

---

## 📈 Scalability

### Adding New Tests

1. Create new file in `tests/`
2. Use page objects from `helpers/page-objects.ts`
3. Use test data from `helpers/test-data.ts`
4. Follow existing patterns

### Adding New Features

1. Update page objects with new selectors
2. Add test data for new features
3. Create new test file
4. Update documentation

---

## 🎯 Dependencies

### Production Dependencies
- None (test suite only)

### Development Dependencies
- `@playwright/test` - Test framework
- `@types/node` - TypeScript types for Node.js

### System Dependencies
- Node.js 18+
- npm 10+
- Browsers (auto-installed by Playwright)

---

## 💡 Design Decisions

### Why Page Object Model?
- ✅ Centralized selectors
- ✅ Reusable methods
- ✅ Easier maintenance
- ✅ Type safety

### Why TypeScript?
- ✅ Type safety
- ✅ Better IDE support
- ✅ Catch errors early
- ✅ Self-documenting code

### Why Playwright?
- ✅ Multi-browser support
- ✅ Auto-waiting
- ✅ Powerful debugging
- ✅ Modern API
- ✅ Active development

### Why Multiple Test Files?
- ✅ Clear organization
- ✅ Parallel execution
- ✅ Easier navigation
- ✅ Focused testing

---

## 🔍 Finding Things

### "Where do I..."

| Task | Location |
|------|----------|
| Add a new test | `tests/` directory |
| Update selectors | `tests/helpers/page-objects.ts` |
| Add test data | `tests/helpers/test-data.ts` |
| Configure browsers | `playwright.config.ts` |
| Add npm scripts | `package.json` |
| Configure CI/CD | `.github/workflows/playwright.yml` |
| Read docs | `*.md` files in root |

---

## 📦 Size Overview

```
Total Files:        24 files
Configuration:      4 files
Documentation:      6 files
Test Specs:         11 files
Helpers:            2 files
CI/CD:              1 file

Total Code Lines:   ~4,000 lines
Test Code:          ~1,850 lines
Helper Code:        ~350 lines
Config:             ~85 lines
Documentation:      ~2,000 lines

Test Cases:         80+ tests
Browser Configs:    5 browsers
Total Executions:   400+ per run
```

---

## 🎓 Learning the Codebase

### Recommended Order

1. **Start Here:**
   - Read `QUICK_START.md`
   - Run `npm run test:ui`

2. **Understand Structure:**
   - Read this file (`PROJECT_STRUCTURE.md`)
   - Browse `tests/` directory

3. **Learn Patterns:**
   - Read `tests/helpers/page-objects.ts`
   - Read `tests/helpers/test-data.ts`
   - Read one test file (e.g., `business-details.spec.ts`)

4. **Deep Dive:**
   - Read `TESTING_GUIDE.md`
   - Read `playwright.config.ts`
   - Experiment with tests

5. **Master It:**
   - Write your own tests
   - Debug failing tests
   - Customize configuration

---

This structure provides a solid foundation for testing the NZ Tax Invoice Generator application with maintainability, scalability, and clarity in mind.
