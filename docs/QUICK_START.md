# 🚀 Quick Start Guide

## Prerequisites

**Node.js 18 or higher is required.** The test suite uses Node.js 18.20.8 (already installed via nvm).

## One-Line Setup

```bash
cd /home/wallen/invoice-generator-tests && source ~/.nvm/nvm.sh && nvm use 18 && npm test
```

## Step-by-Step

### 1. Navigate to project
```bash
cd /home/wallen/invoice-generator-tests
```

### 2. Ensure correct Node.js version
```bash
source ~/.nvm/nvm.sh
nvm use 18
```

### 3. Run tests
```bash
npm test
```

## 📋 Common Commands

```bash
# Run all tests (headless)
npm test

# Interactive UI mode (RECOMMENDED for development)
npm run test:ui

# Run with visible browser
npm run test:headed

# Debug mode
npm run test:debug

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# View test report
npm run report

# Install additional browsers (optional)
npx playwright install firefox webkit
```

## 🎯 Your First Test Run

```bash
# 1. Navigate and set Node version
cd /home/wallen/invoice-generator-tests
source ~/.nvm/nvm.sh && nvm use 18

# 2. Run a single test file (fast)
npx playwright test tests/business-details.spec.ts --project=chromium

# 3. Run all tests
npm test

# 4. View results
npm run report
```

## 📊 What to Expect

When you run `npm test`, you'll see:
- ✅ Tests running across multiple browsers
- 📈 Progress indicators
- ✓ Passing tests in green
- ✗ Failing tests in red (with details)
- 📊 Summary at the end

## 🐛 Troubleshooting

### "npm: command not found"
```bash
source ~/.nvm/nvm.sh
nvm use 18
```

### "Cannot find module"
```bash
npm install
```

### "No tests found"
```bash
# You're in the wrong directory
cd /home/wallen/invoice-generator-tests
```

### Tests are slow
```bash
# Run only Chromium (fastest)
npm run test:chromium

# Or run specific test
npx playwright test tests/business-details.spec.ts
```

## 📚 Learn More

- **Full Documentation:** See `README.md`
- **Testing Guide:** See `TESTING_GUIDE.md`
- **Summary:** See `SUMMARY.md`

## 💡 Pro Tips

1. **Use UI Mode** for the best experience:
   ```bash
   npm run test:ui
   ```

2. **Run specific tests** while developing:
   ```bash
   npx playwright test -g "should save business details"
   ```

3. **Watch mode** (re-run on file changes):
   ```bash
   npx playwright test --watch
   ```

4. **Generate test code** by recording actions:
   ```bash
   npm run codegen
   ```

## 🎉 You're Ready!

Everything is set up and ready to go. Just run:

```bash
cd /home/wallen/invoice-generator-tests
source ~/.nvm/nvm.sh && nvm use 18
npm test
```

Happy testing! 🧪
