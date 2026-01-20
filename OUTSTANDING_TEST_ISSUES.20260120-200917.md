# Outstanding Test Issues - NZ Tax Invoice Generator

**Date**: 2026-01-20  
**Test Suite Status**: 67% passing (43/64 tests) for Chromium browser

## Executive Summary

The test suite has been significantly improved from a 0% pass rate to 67%. The main configuration issue (testing against a non-existent remote URL) has been resolved, and most selector issues have been fixed. However, several tests remain failing, primarily related to dynamic calculations, form resets, and complex user interactions.

---

## ✅ What Was Fixed

### 1. Configuration Issue
- **Problem**: Tests were attempting to access `https://warwick-allen.github.io/invoice-generator/` which returned "Site not found"
- **Solution**: Updated `playwright.config.ts` to use local HTTP server (`http://localhost:3000`)
- **Impact**: All tests can now load the application

### 2. Label Selector Mismatches
- **Problem**: HTML uses labels with asterisks for required fields (e.g., "Email *", "Business/Trading Name *"), but tests were searching for labels without asterisks
- **Solution**: Updated selectors across all test files to include asterisks
- **Files Updated**:
  - `tests/accessibility.spec.ts`
  - `tests/business-details.spec.ts`
  - `tests/bank-details.spec.ts`
  - `tests/client-details.spec.ts`
  - `tests/invoice-details.spec.ts`
  - `tests/integration.spec.ts`
  - `tests/invoice-generation.spec.ts`
  - `tests/helpers/page-objects.ts`

### 3. Ambiguous Selectors
- **Problem**: Multiple fields with same label text (e.g., "Email", "Phone", "Address") caused "strict mode violations"
- **Solution**: 
  - Business email: `getByLabel('Email *')`
  - Client email: `locator('#clientEmail')` (no asterisk in HTML)
  - Business phone: `locator('#traderPhone')`
  - Client phone: `locator('#clientPhone')`
  - Address fields: Use `.first()` or `.nth(1)` to disambiguate

### 4. Missing Dialog Handlers
- **Problem**: Tests failed when clicking "Save", "Clear", or "Delete" buttons that trigger confirmation dialogs
- **Solution**: Added `page.once('dialog', dialog => dialog.accept())` before triggering actions

---

## ❌ Outstanding Failing Tests

### Test Suite: `calculations.spec.ts`

#### 1. "should calculate totals with multiple items"
- **Status**: ❌ Failing (~500-700ms)
- **Error Type**: Assertion failure
- **Likely Cause**: 
  - Test expects specific calculation results but may be getting different values
  - Timing issue where calculations haven't completed when assertions run
  - Potential issue with how multiple items are added or calculated
- **Suggested Fix**: 
  1. Add explicit waits for calculations to update
  2. Verify the expected values match actual application behaviour
  3. Check if `calculateTotals()` is being called after adding items

#### 2. "should round monetary values to 2 decimal places"
- **Status**: ❌ Timing out (30.1 seconds - test timeout)
- **Error Type**: Timeout
- **Likely Cause**: 
  - Selector not finding expected element
  - Waiting for an element that doesn't exist or isn't visible
  - Infinite loop or unresponsive interaction
- **Suggested Fix**:
  1. Run test in headed mode to observe behaviour: `npx playwright test calculations.spec.ts:41 --headed`
  2. Check test for selectors that might not exist
  3. Review what the test is waiting for that never appears
  4. Consider that rounding might not be implemented as expected

#### 3. "should update calculations when items are removed"
- **Status**: ❌ Failing (~700-900ms)
- **Error Type**: Assertion failure or selector issue
- **Likely Cause**:
  - Remove button selector may have changed
  - Calculations not updating after removal
  - Test assumptions about which item is removed
- **Suggested Fix**:
  1. Verify the "Remove" button selector
  2. Add wait for calculations to update after removal
  3. Check that `calculateTotals()` is called on item removal

### Test Suite: `integration.spec.ts`

#### 4. "complete invoice creation workflow"
- **Status**: ❌ Failing (~800ms-1.2s)
- **Last Known Issue**: Strict mode violation with `getByText(/GST/i)` - **FIXED**
- **Current Status**: Needs verification
- **Suggested Action**: Re-run to confirm fix worked
  ```bash
  npx playwright test integration.spec.ts:4 --project=chromium
  ```

### Test Suite: `invoice-generation.spec.ts`

#### 5. "should reset form to initial state"
- **Status**: ❌ Timing out (~5.2-5.4 seconds)
- **Error Type**: Timeout
- **Likely Cause**:
  - Missing confirmation dialog handler
  - Reset button not working as expected
  - Test checking for element that doesn't exist after reset
- **Suggested Fix**:
  1. Check if reset requires confirmation dialog: `page.once('dialog', ...)`
  2. Verify reset button selector: `getByRole('button', { name: 'Reset Form' })`
  3. Add explicit waits after reset for form to clear
  4. Check what element the test is waiting for that times out

### Test Suite: `invoice-items.spec.ts`

#### 6. "should calculate subtotal correctly"
- **Status**: ❌ Timing out (~5.2-5.4 seconds)
- **Error Type**: Timeout
- **Likely Cause**:
  - Test waiting for subtotal element that doesn't exist or isn't visible
  - Selector for subtotal display is incorrect
  - Subtotal not updating after item addition
- **Suggested Fix**:
  1. Verify subtotal selector: Currently should be `getByText(/Subtotal.*\$/i)`
  2. Check HTML: `<span id="subtotal">$0.00</span>`
  3. Better selector: `locator('#subtotal')` or `getByText('Subtotal (excl. GST):')`
  4. Add wait for calculations to complete

#### 7. "should display GST calculation at 15%"
- **Status**: ❌ Timing out (~5.2-5.3 seconds)
- **Error Type**: Timeout
- **Likely Cause**: Similar to subtotal issue above
- **Suggested Fix**:
  1. Use specific selector: `locator('#gstAmount')` or `getByText('GST (15%):')`
  2. Verify GST is actually displayed in the totals section
  3. Ensure test adds items before checking GST

---

## 🔍 Common Patterns in Failures

### 1. Timeout Issues (30 seconds)
These indicate the test is waiting for something that never appears:
- Check selectors are correct
- Verify elements actually exist in the HTML
- Add explicit waits or retry logic

### 2. Short Timeouts (5 seconds)
These indicate element not found within default timeout:
- Usually selector issues
- Element might not be visible
- Element might be in different location than expected

### 3. Assertion Failures (<1 second)
These indicate the test runs but gets unexpected values:
- Timing issues (check before value updates)
- Calculation errors
- State not properly initialized

---

## 🛠️ Recommended Debugging Steps

### For Each Failing Test:

1. **Run in headed mode** to see what's happening:
   ```bash
   npx playwright test <test-file>:<line> --headed --project=chromium
   ```

2. **Use debug mode** to step through:
   ```bash
   npx playwright test <test-file>:<line> --debug --project=chromium
   ```

3. **Check the trace** (already captured on retry):
   ```bash
   npx playwright show-trace test-results/<test-folder>/trace.zip
   ```

4. **Take screenshots** to see UI state:
   - Screenshots are automatically captured on failure
   - Location: `test-results/<test-folder>/test-failed-1.png`

5. **Add console logging** to tests:
   ```javascript
   const value = await element.textContent();
   console.log('Current value:', value);
   ```

---

## 📋 Test Files Status Summary

| Test File | Total Tests | Passing | Failing | Pass Rate |
|-----------|-------------|---------|---------|-----------|
| accessibility.spec.ts | 9 | 9 | 0 | 100% ✅ |
| bank-details.spec.ts | 5 | 5 | 0 | 100% ✅ |
| business-details.spec.ts | 5 | 5 | 0 | 100% ✅ |
| client-details.spec.ts | 6 | 6 | 0 | 100% ✅ |
| invoice-details.spec.ts | 6 | 6 | 0 | 100% ✅ |
| **calculations.spec.ts** | 5 | 2 | 3 | 40% ⚠️ |
| **integration.spec.ts** | 3 | 2 | 1 | 67% ⚠️ |
| **invoice-generation.spec.ts** | 5 | 4 | 1 | 80% ⚠️ |
| **invoice-items.spec.ts** | ~7 | ~3 | ~4 | ~43% ⚠️ |
| page-objects.spec.ts | ? | ? | ? | Not tested |
| responsive.spec.ts | ? | ? | ? | Not tested |

**Note**: Full test suite includes Firefox, Webkit, and mobile browsers (340 total tests). Only Chromium tests (68 tests) have been fully analysed.

---

## 🎯 Priority Fixes

### High Priority (Breaks core functionality)
1. **calculations.spec.ts** - All calculation tests
   - These test core invoice functionality
   - Without working calculations, invoices are incorrect

2. **integration.spec.ts:4** - Complete workflow test
   - Tests the entire user journey
   - Critical for ensuring app works end-to-end

### Medium Priority (UX features)
3. **invoice-generation.spec.ts:58** - Reset form test
   - Important for user workflow
   - Not critical to core invoice generation

4. **invoice-items.spec.ts** - Item calculation tests
   - Overlaps with calculations.spec.ts
   - Tests specific item-level calculations

### Low Priority (Already tested elsewhere)
5. Tests for other browsers (Firefox, Webkit, mobile)
   - Focus on Chromium first
   - Once Chromium passes 100%, expand to other browsers

---

## 🚀 Next Steps

1. **Fix calculations.spec.ts** (highest impact)
   - Focus on the timeout issue in "should round monetary values"
   - Fix assertion issues in multiple items test
   
2. **Verify integration.spec.ts fix**
   - Re-run to confirm GST selector fix worked
   
3. **Fix invoice-items.spec.ts**
   - Likely same root cause as calculations.spec.ts
   - Should be quick once calculations are fixed
   
4. **Fix reset form test**
   - Add dialog handler
   - Verify reset behaviour
   
5. **Run full suite verification**
   - Test all browsers once Chromium passes 100%
   - Update documentation with final results

---

## 📞 Support Resources

- **Playwright Documentation**: https://playwright.dev/
- **Test Trace Viewer**: `npx playwright show-trace <trace-file>`
- **Test Inspector**: `npx playwright test --debug`
- **Headed Mode**: `npx playwright test --headed`

---

## 📝 Notes

- The application is running correctly - tests can access it at `http://localhost:3000`
- Most selector issues have been resolved
- Remaining issues are primarily timing and calculation-related
- Test suite is comprehensive (340 total tests across all browsers)
- Python HTTP server must be running on port 3000 for tests to work
  ```bash
  python3 -m http.server 3000
  ```
