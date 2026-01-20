# 🚀 Getting Started with Tests

## Quick Start (3 Steps)

### 1. Navigate to Repository
```bash
cd /home/wallen/Code/invoice-generator
```

### 2. Ensure Node.js 18
```bash
source ~/.nvm/nvm.sh && nvm use 18
```

### 3. Run Tests
```bash
npm run test:ui
```

That's it! The interactive UI will open where you can run and debug tests visually.

---

## 📖 Documentation

All test documentation is in the `docs/` directory:

- **[docs/README_START_HERE.md](docs/README_START_HERE.md)** ⭐ **START HERE**
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - Quick commands
- **[docs/INDEX.md](docs/INDEX.md)** - Navigation hub
- **[docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Comprehensive guide

---

## 💻 Common Commands

```bash
# Run all tests (headless)
npm test

# Interactive UI mode (best for development)
npm run test:ui

# Run with browser visible
npm run test:headed

# Run specific browser
npm run test:chromium

# View HTML report
npm run report

# Debug tests
npm run test:debug
```

---

## 🎯 What's Included

- ✅ **80+ test cases** across 11 files
- ✅ **5 browsers** (Chrome, Firefox, Safari, Mobile)
- ✅ **Page Object Model** for maintainability
- ✅ **100% feature coverage**
- ✅ **Comprehensive documentation**
- ✅ **CI/CD workflows**

---

## 📂 Structure

```
tests/                       # All test files
  ├── helpers/              # Page objects & test data
  │   ├── page-objects.ts   # Selectors & methods
  │   └── test-data.ts      # Test data utilities
  └── *.spec.ts            # Test specifications

docs/                       # Documentation
  └── *.md                 # Guides and references
```

---

## ✅ First Steps

1. **Read this**: `docs/README_START_HERE.md`
2. **Run tests**: `npm run test:ui`
3. **Explore**: Click through tests in the UI
4. **Read more**: `docs/TESTING_GUIDE.md`

---

## 🎉 You're Ready!

Everything is configured and ready to use. Just run:

```bash
npm run test:ui
```

For complete information, see the `docs/` directory.
