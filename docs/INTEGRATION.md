# 🔗 Integration Guide

## Connecting Test Suite with Source Repository

This guide explains how to integrate the test suite located at `/home/wallen/invoice-generator-tests/` with your source code repository at `/home/wallen/Code/invoice-generator/`.

---

## 📂 Current Setup

### Source Code Repository
```
/home/wallen/Code/invoice-generator/
├── .github/workflows/deploy.yml    # GitHub Pages deployment
├── index.html                      # Application (single file)
├── README.md                       # App documentation
└── .gitignore
```

### Test Suite Repository
```
/home/wallen/invoice-generator-tests/
├── tests/                          # All test files
├── playwright.config.ts            # Test configuration
├── package.json                    # Dependencies
└── *.md                           # Documentation
```

---

## 🎯 Integration Options

### Option 1: Separate Repositories (Current State) ✅ RECOMMENDED

**Best for:** Keeping concerns separated, different update cycles

```
invoice-generator/          (Source code repo)
    └── deploys to: GitHub Pages

invoice-generator-tests/    (Test suite repo)
    └── tests against: GitHub Pages URL
```

**Advantages:**
- ✅ Clean separation of concerns
- ✅ Tests can run independently
- ✅ Different teams can manage each repo
- ✅ Simpler CI/CD pipelines
- ✅ No impact on source repo size

**Current Status:** ✅ Already working this way!

---

### Option 2: Integrate into Source Repository

**Best for:** Single-repo preference, tighter integration

Move test suite into source repository:

```
invoice-generator/
├── .github/workflows/
│   ├── deploy.yml              # Existing deployment
│   └── test.yml                # New: Run tests
├── tests/                      # Moved from invoice-generator-tests/
├── playwright.config.ts        # Moved
├── package.json               # Moved
├── index.html                  # Existing
└── README.md                   # Existing
```

**Implementation:**
```bash
# From the source repo
cd /home/wallen/Code/invoice-generator

# Copy test suite
cp -r /home/wallen/invoice-generator-tests/tests ./
cp /home/wallen/invoice-generator-tests/playwright.config.ts ./
cp /home/wallen/invoice-generator-tests/package.json ./
cp /home/wallen/invoice-generator-tests/tsconfig.json ./
cp /home/wallen/invoice-generator-tests/.gitignore ./test.gitignore

# Update package.json name if needed
# Update README.md to include testing section
```

---

## 🚀 CI/CD Integration

### Option A: Test After Deployment (Current Workflow)

**Flow:**
```
Code Push → Deploy to GitHub Pages → Tests Run → Notify if Failed
```

**Implementation:**

Create `/home/wallen/Code/invoice-generator/.github/workflows/test-deployed.yml`:

```yaml
name: Test Deployed Application

on:
  # Run after deployment completes
  workflow_run:
    workflows: ["Deploy to GitHub Pages"]
    types:
      - completed
  # Also run on schedule
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  # Manual trigger
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    
    steps:
      - name: Checkout test suite
        uses: actions/checkout@v4
        with:
          repository: YOUR_USERNAME/invoice-generator-tests
          path: tests
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd tests
          npm ci
      
      - name: Install Playwright
        run: |
          cd tests
          npx playwright install --with-deps
      
      - name: Run tests
        run: |
          cd tests
          npm test
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: tests/playwright-report/
          retention-days: 30
```

---

### Option B: Test Before Deployment (Safer)

**Flow:**
```
Code Push → Run Tests → Deploy Only if Tests Pass
```

**Implementation:**

Update `/home/wallen/Code/invoice-generator/.github/workflows/deploy.yml`:

```yaml
name: Test and Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests against production
        run: npm test
        env:
          BASE_URL: https://warwick-allen.github.io/invoice-generator/
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: playwright-report/

  deploy:
    needs: test  # Only deploy if tests pass
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🖥️ Local Development Workflow

### Testing Local Changes

If you want to test local changes before deployment:

1. **Start a local server:**
   ```bash
   cd /home/wallen/Code/invoice-generator
   python3 -m http.server 8000
   # or
   npx serve .
   ```

2. **Update test configuration:**
   ```bash
   cd /home/wallen/invoice-generator-tests
   ```
   
   Edit `playwright.config.ts`:
   ```typescript
   use: {
     baseURL: process.env.BASE_URL || 'http://localhost:8000',
   }
   ```

3. **Run tests against local server:**
   ```bash
   BASE_URL=http://localhost:8000 npm test
   ```

---

## 📋 Pre-Deployment Checklist

Add this script to your source repository as `/home/wallen/Code/invoice-generator/pre-deploy.sh`:

```bash
#!/bin/bash

echo "🔍 Pre-Deployment Checks"
echo "========================"

# Check if test suite exists
if [ ! -d "/home/wallen/invoice-generator-tests" ]; then
    echo "❌ Test suite not found"
    exit 1
fi

echo "✅ Test suite found"

# Run tests
cd /home/wallen/invoice-generator-tests
source ~/.nvm/nvm.sh
nvm use 18

echo ""
echo "🧪 Running tests..."
npm test

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo "📦 Ready to deploy"
    exit 0
else
    echo ""
    echo "❌ Tests failed!"
    echo "⚠️  Do not deploy"
    exit 1
fi
```

Make it executable:
```bash
chmod +x /home/wallen/Code/invoice-generator/pre-deploy.sh
```

---

## 🔄 Git Hooks Integration

### Pre-Push Hook

Automatically run tests before pushing:

Create `/home/wallen/Code/invoice-generator/.git/hooks/pre-push`:

```bash
#!/bin/bash

echo "Running tests before push..."

# Navigate to test suite
cd /home/wallen/invoice-generator-tests

# Ensure correct Node version
source ~/.nvm/nvm.sh
nvm use 18

# Run tests
npm test

# Check exit code
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Tests failed! Push aborted."
    echo "Fix the failing tests before pushing."
    exit 1
fi

echo "✅ Tests passed! Proceeding with push."
exit 0
```

Make it executable:
```bash
chmod +x /home/wallen/Code/invoice-generator/.git/hooks/pre-push
```

---

## 📊 Reporting Integration

### Send Test Results to GitHub

Add to your workflow:

```yaml
- name: Comment PR with test results
  uses: daun/playwright-report-comment@v3
  if: always()
  with:
    report-path: playwright-report/
```

### Slack Notifications

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "🔴 Tests failed for invoice-generator",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Tests failed on ${{ github.ref }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 🎯 Recommended Workflow

### For Your Project

Based on your current setup, I recommend:

1. **Keep repositories separate** ✅ (current state)
   - Source: `/home/wallen/Code/invoice-generator`
   - Tests: `/home/wallen/invoice-generator-tests`

2. **Add scheduled testing** in source repo
   - Tests run every 6 hours against production
   - Alerts if production app breaks

3. **Local testing** before commits
   - Use pre-push hook (optional)
   - Or manually run: `npm test` from test suite

4. **CI/CD** remains simple
   - Source repo: Deploy only
   - Test repo: Test only
   - Both can be automated

---

## 📝 Update Source README

Add this section to `/home/wallen/Code/invoice-generator/README.md`:

```markdown
## Testing

This application has a comprehensive end-to-end test suite using Playwright.

### Test Suite Location
- **Repository:** `/home/wallen/invoice-generator-tests/`
- **Tests:** 80+ test cases across 11 test files
- **Coverage:** Forms, calculations, workflows, accessibility, responsive design

### Running Tests

```bash
cd /home/wallen/invoice-generator-tests
source ~/.nvm/nvm.sh && nvm use 18
npm test
```

### Test Reports
- Tests run automatically against the deployed application
- View latest results in the test suite repository

### Documentation
- See test suite `README.md` for complete documentation
- Quick start: `QUICK_START.md`
- Testing guide: `TESTING_GUIDE.md`
```

---

## 🔧 Configuration Management

### Environment-Specific Testing

Create `/home/wallen/invoice-generator-tests/.env`:

```bash
# Production
BASE_URL=https://warwick-allen.github.io/invoice-generator/

# Local development
# BASE_URL=http://localhost:8000

# Staging (if you have one)
# BASE_URL=https://staging.example.com/invoice-generator/
```

Update `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://warwick-allen.github.io/invoice-generator/',
  },
  // ... rest of config
});
```

---

## ✅ Integration Checklist

- [ ] Choose integration approach (separate repos recommended ✅)
- [ ] Set up CI/CD for testing (optional but recommended)
- [ ] Configure local testing workflow
- [ ] Add pre-deployment checks (optional)
- [ ] Update source README with testing info
- [ ] Set up git hooks (optional)
- [ ] Configure notifications (optional)
- [ ] Document team workflow

---

## 🎯 Quick Commands

### Run tests against production
```bash
cd /home/wallen/invoice-generator-tests
npm test
```

### Run tests against local
```bash
cd /home/wallen/Code/invoice-generator
python3 -m http.server 8000 &
cd /home/wallen/invoice-generator-tests
BASE_URL=http://localhost:8000 npm test
```

### Check before pushing
```bash
cd /home/wallen/Code/invoice-generator
./pre-deploy.sh && git push
```

---

## 📞 Support

For integration issues:
1. Check this guide
2. Review GitHub Actions logs
3. Check test suite documentation
4. Verify Node.js version (18+)
5. Ensure test suite dependencies are installed

---

**Your current setup is working well! The test suite successfully tests your deployed application. This guide provides options for tighter integration if needed in the future.**
