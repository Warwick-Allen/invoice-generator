import { test, expect } from '@playwright/test';
import { InvoiceGeneratorPage } from './helpers/page-objects';

test.describe('Invoice Calculations', () => {
  let invoicePage: InvoiceGeneratorPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    invoicePage = new InvoiceGeneratorPage(page);
  });

  test('should calculate GST at 15% rate', async ({ page }) => {
    // Test with a known value
    await invoicePage.fillGenericItem(0, {
      description: 'Test Item',
      quantity: 1,
      unitPrice: 100
    });
    
    await page.waitForTimeout(200);
    
    // Verify GST label shows 15% in totals section
    const gstRow = page.locator('#gstRow');
    await expect(gstRow).toBeVisible();
    await expect(gstRow).toContainText('GST (15%):');
    
    const subtotal = await invoicePage.getSubtotalAmount();
    const gst = await invoicePage.getGSTAmount();
    
    expect(subtotal).toBe(100);
    expect(gst).toBeCloseTo(15, 2); // 15% of 100
  });

  test('should calculate totals with single generic item', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Widget',
      quantity: 3,
      unitPrice: 50
    });
    
    await page.waitForTimeout(100);
    
    const subtotal = await invoicePage.getSubtotalAmount();
    const gst = await invoicePage.getGSTAmount();
    const total = await invoicePage.getTotalAmount();
    
    expect(subtotal).toBeCloseTo(150, 2);
    expect(gst).toBeCloseTo(22.5, 2);
    expect(total).toBeCloseTo(172.5, 2);
  });

  test('should calculate totals with single hourly item', async ({ page }) => {
    await invoicePage.fillHourlyItem(0, {
      date: '2026-01-20',
      description: 'Consulting',
      hours: 4,
      rate: 120
    });
    
    await page.waitForTimeout(100);
    
    const subtotal = await invoicePage.getSubtotalAmount();
    const gst = await invoicePage.getGSTAmount();
    const total = await invoicePage.getTotalAmount();
    
    expect(subtotal).toBeCloseTo(480, 2);
    expect(gst).toBeCloseTo(72, 2);
    expect(total).toBeCloseTo(552, 2);
  });

  test('should calculate totals with multiple generic items', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Product A',
      quantity: 2,
      unitPrice: 25
    });
    
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillGenericItem(1, {
      description: 'Product B',
      quantity: 3,
      unitPrice: 40
    });
    
    await page.waitForTimeout(100);
    
    const subtotal = await invoicePage.getSubtotalAmount();
    const gst = await invoicePage.getGSTAmount();
    const total = await invoicePage.getTotalAmount();
    
    // 50 + 120 = 170
    expect(subtotal).toBeCloseTo(170, 2);
    expect(gst).toBeCloseTo(25.5, 2);
    expect(total).toBeCloseTo(195.5, 2);
  });

  test('should calculate totals with multiple hourly items', async ({ page }) => {
    await invoicePage.fillHourlyItem(0, {
      date: '2026-01-18',
      description: 'Day 1',
      hours: 6,
      rate: 100
    });
    
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillHourlyItem(1, {
      date: '2026-01-19',
      description: 'Day 2',
      hours: 8,
      rate: 100
    });
    
    await page.waitForTimeout(100);
    
    const subtotal = await invoicePage.getSubtotalAmount();
    const gst = await invoicePage.getGSTAmount();
    const total = await invoicePage.getTotalAmount();
    
    // 600 + 800 = 1400
    expect(subtotal).toBeCloseTo(1400, 2);
    expect(gst).toBeCloseTo(210, 2);
    expect(total).toBeCloseTo(1610, 2);
  });

  test('should calculate totals with mixed item types', async ({ page }) => {
    // Generic item
    await invoicePage.fillGenericItem(0, {
      description: 'Software',
      quantity: 1,
      unitPrice: 500
    });
    
    // Hourly item
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillHourlyItem(1, {
      date: '2026-01-20',
      description: 'Installation',
      hours: 2.5,
      rate: 80
    });
    
    await page.waitForTimeout(100);
    
    const subtotal = await invoicePage.getSubtotalAmount();
    const gst = await invoicePage.getGSTAmount();
    const total = await invoicePage.getTotalAmount();
    
    // 500 + 200 = 700
    expect(subtotal).toBeCloseTo(700, 2);
    expect(gst).toBeCloseTo(105, 2);
    expect(total).toBeCloseTo(805, 2);
  });

  test('should round monetary values to 2 decimal places', async ({ page }) => {
    // Add item with value that would create rounding
    await invoicePage.fillGenericItem(0, {
      description: 'Test',
      quantity: 3,
      unitPrice: 33.33
    });
    
    await page.waitForTimeout(100);
    
    const subtotal = await invoicePage.getSubtotal();
    const gst = await invoicePage.getGST();
    const total = await invoicePage.getTotal();
    
    // Verify format includes exactly 2 decimal places
    expect(subtotal).toMatch(/\$\d+\.\d{2}/);
    expect(gst).toMatch(/\$\d+\.\d{2}/);
    expect(total).toMatch(/\$\d+\.\d{2}/);
  });

  test('should update calculations when items are removed', async ({ page }) => {
    // Add two items
    await invoicePage.fillGenericItem(0, {
      description: 'Item 1',
      quantity: 1,
      unitPrice: 100
    });
    
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillGenericItem(1, {
      description: 'Item 2',
      quantity: 1,
      unitPrice: 50
    });
    
    await page.waitForTimeout(100);
    
    let subtotal = await invoicePage.getSubtotalAmount();
    expect(subtotal).toBeCloseTo(150, 2);
    
    // Remove the second item
    const items = page.locator('.invoice-item');
    await items.nth(1).getByRole('button', { name: /remove/i }).click();
    
    await page.waitForTimeout(100);
    
    // Should now be just the first item
    subtotal = await invoicePage.getSubtotalAmount();
    expect(subtotal).toBeCloseTo(100, 2);
  });

  test('should handle decimal hours in hourly items', async ({ page }) => {
    await invoicePage.fillHourlyItem(0, {
      date: '2026-01-20',
      description: 'Part time work',
      hours: 3.75,
      rate: 80
    });
    
    await page.waitForTimeout(100);
    
    const subtotal = await invoicePage.getSubtotalAmount();
    // 3.75 * 80 = 300
    expect(subtotal).toBeCloseTo(300, 2);
  });

  test('should handle decimal quantities in generic items', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Fractional quantity',
      quantity: 2.5,
      unitPrice: 40
    });
    
    await page.waitForTimeout(100);
    
    const subtotal = await invoicePage.getSubtotalAmount();
    // 2.5 * 40 = 100
    expect(subtotal).toBeCloseTo(100, 2);
  });

  test('should handle zero values correctly', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Free item',
      quantity: 1,
      unitPrice: 0
    });
    
    await page.waitForTimeout(100);
    
    const subtotal = await invoicePage.getSubtotalAmount();
    const gst = await invoicePage.getGSTAmount();
    const total = await invoicePage.getTotalAmount();
    
    expect(subtotal).toBe(0);
    expect(gst).toBe(0);
    expect(total).toBe(0);
  });

  test('should display GST checkbox checked by default', async ({ page }) => {
    await expect(invoicePage.includeGSTCheckbox).toBeVisible();
    await expect(invoicePage.includeGSTCheckbox).toBeChecked();
  });

  test('should exclude GST when checkbox is unchecked', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Test Item',
      quantity: 1,
      unitPrice: 100
    });
    
    await page.waitForTimeout(100);
    
    // Verify GST is initially included
    let gst = await invoicePage.getGSTAmount();
    let total = await invoicePage.getTotalAmount();
    expect(gst).toBeCloseTo(15, 2);
    expect(total).toBeCloseTo(115, 2);
    
    // Uncheck GST
    await invoicePage.includeGSTCheckbox.uncheck();
    await page.waitForTimeout(100);
    
    // Verify GST is now zero and total equals subtotal
    gst = await invoicePage.getGSTAmount();
    total = await invoicePage.getTotalAmount();
    const subtotal = await invoicePage.getSubtotalAmount();
    
    expect(gst).toBe(0);
    expect(total).toBe(100);
    expect(total).toBe(subtotal);
  });

  test('should include GST when checkbox is rechecked', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Test Item',
      quantity: 1,
      unitPrice: 100
    });
    
    await page.waitForTimeout(100);
    
    // Uncheck GST
    await invoicePage.includeGSTCheckbox.uncheck();
    await page.waitForTimeout(100);
    
    let gst = await invoicePage.getGSTAmount();
    expect(gst).toBe(0);
    
    // Re-check GST
    await invoicePage.includeGSTCheckbox.check();
    await page.waitForTimeout(100);
    
    // Verify GST is calculated again
    gst = await invoicePage.getGSTAmount();
    const total = await invoicePage.getTotalAmount();
    expect(gst).toBeCloseTo(15, 2);
    expect(total).toBeCloseTo(115, 2);
  });

  test('should hide GST row when GST is not included', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Test Item',
      quantity: 1,
      unitPrice: 100
    });
    
    await page.waitForTimeout(100);
    
    // GST row should be visible initially
    const gstRow = page.locator('#gstRow');
    await expect(gstRow).toBeVisible();
    
    // Uncheck GST
    await invoicePage.includeGSTCheckbox.uncheck();
    await page.waitForTimeout(100);
    
    // GST row should be hidden
    await expect(gstRow).toBeHidden();
  });

  test('should update labels when GST is excluded', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Test Item',
      quantity: 1,
      unitPrice: 100
    });
    
    await page.waitForTimeout(100);
    
    // Initially should show GST labels
    await expect(page.getByText('Subtotal (excl. GST):')).toBeVisible();
    await expect(page.getByText('Total (incl. GST):')).toBeVisible();
    
    // Uncheck GST
    await invoicePage.includeGSTCheckbox.uncheck();
    await page.waitForTimeout(100);
    
    // Labels should change to non-GST versions
    await expect(page.locator('#subtotalLabel')).toHaveText('Subtotal:');
    await expect(page.locator('#totalLabel')).toHaveText('Total:');
  });

  test('should persist GST preference between sessions', async ({ page }) => {
    // Uncheck GST
    await invoicePage.includeGSTCheckbox.uncheck();
    await page.waitForTimeout(200);
    
    // Verify it's unchecked
    await expect(invoicePage.includeGSTCheckbox).not.toBeChecked();
    
    // Reload the page
    await page.reload();
    await page.waitForTimeout(500);
    
    // GST checkbox should still be unchecked
    const checkbox = page.locator('#includeGST');
    await expect(checkbox).not.toBeChecked();
    
    // Re-check GST
    await checkbox.check();
    await page.waitForTimeout(200);
    
    // Reload again
    await page.reload();
    await page.waitForTimeout(500);
    
    // GST checkbox should now be checked
    await expect(page.locator('#includeGST')).toBeChecked();
  });
});
