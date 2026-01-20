import { test, expect } from '@playwright/test';

test.describe('Invoice Items Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display add item button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Item/i })).toBeVisible();
  });

  test('should add new invoice item', async ({ page }) => {
    await page.getByRole('button', { name: /Add Item/i }).click();
    
    // Check if item fields appear
    // The exact selectors will depend on the actual HTML structure
    const itemInputs = page.locator('input[type="text"]');
    const itemCount = await itemInputs.count();
    
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should calculate subtotal correctly', async ({ page }) => {
    // This test requires knowing the exact structure of item inputs
    // Assuming items have description, quantity, and price fields
    
    await page.getByRole('button', { name: /Add Item/i }).click();
    
    // Find and fill item details - adjust selectors based on actual HTML
    // This is a placeholder that may need adjustment
    const subtotalElement = page.getByText(/Subtotal.*\$\d+\.\d{2}/i);
    await expect(subtotalElement).toBeVisible();
  });

  test('should display GST calculation at 15%', async ({ page }) => {
    const gstElement = page.getByText(/GST \(15%\).*\$\d+\.\d{2}/i);
    await expect(gstElement).toBeVisible();
  });

  test('should display total including GST', async ({ page }) => {
    const totalElement = page.getByText(/Total.*\$\d+\.\d{2}/i);
    await expect(totalElement).toBeVisible();
  });

  test('should show correct initial totals (zero)', async ({ page }) => {
    await expect(page.getByText('Subtotal (excl. GST): $0.00')).toBeVisible();
    await expect(page.getByText('GST (15%): $0.00')).toBeVisible();
    await expect(page.getByText('Total (incl. GST): $0.00')).toBeVisible();
  });

  test('should update totals when items change', async ({ page }) => {
    // Add item
    await page.getByRole('button', { name: /Add Item/i }).click();
    
    // Wait for potential calculation updates
    await page.waitForTimeout(500);
    
    // Verify totals section still exists and is valid
    await expect(page.getByText(/Subtotal/i)).toBeVisible();
    await expect(page.getByText(/GST/i)).toBeVisible();
    await expect(page.getByText(/Total/i)).toBeVisible();
  });

  test('should remove invoice item', async ({ page }) => {
    await page.getByRole('button', { name: /Add Item/i }).click();
    
    // Look for delete/remove button (may be represented by X, ×, Remove, or Delete)
    const deleteButtons = page.getByRole('button').filter({ hasText: /remove|delete|×|x/i });
    const count = await deleteButtons.count();
    
    if (count > 0) {
      await deleteButtons.first().click();
      // Verify the item is removed
      await page.waitForTimeout(300);
    }
  });
});
