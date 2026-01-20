import { test, expect } from '@playwright/test';
import { InvoiceGeneratorPage } from './helpers/page-objects';

test.describe('Invoice Items Section', () => {
  let invoicePage: InvoiceGeneratorPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    invoicePage = new InvoiceGeneratorPage(page);
  });

  test('should display add item button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Item/i })).toBeVisible();
  });

  test('should add new invoice item with type selector', async ({ page }) => {
    await page.getByRole('button', { name: /Add Item/i }).click();
    
    // Check if type selector appears
    const typeSelector = page.locator('.item-type').first();
    await expect(typeSelector).toBeVisible();
    
    // Verify both options are available
    const options = await typeSelector.locator('option').allTextContents();
    expect(options).toContain('Generic');
    expect(options).toContain('Hourly Rate');
  });

  test('should show generic item fields by default', async ({ page }) => {
    const items = page.locator('.invoice-item');
    const firstItem = items.first();
    
    // Generic fields should be visible
    await expect(firstItem.locator('.item-quantity-field')).toBeVisible();
    await expect(firstItem.locator('label:has-text("Unit Price")')).toBeVisible();
    
    // Hourly fields should be hidden
    await expect(firstItem.locator('.item-date-field')).toHaveClass(/hidden/);
    await expect(firstItem.locator('.item-hours-field')).toHaveClass(/hidden/);
  });

  test('should switch to hourly rate fields when type is changed', async ({ page }) => {
    const items = page.locator('.invoice-item');
    const firstItem = items.first();
    
    // Change type to hourly
    await firstItem.locator('.item-type').selectOption('hourly');
    
    // Hourly fields should be visible
    await expect(firstItem.locator('.item-date-field')).not.toHaveClass(/hidden/);
    await expect(firstItem.locator('.item-hours-field')).not.toHaveClass(/hidden/);
    await expect(firstItem.locator('label:has-text("Rate")')).toBeVisible();
    
    // Generic fields should be hidden
    await expect(firstItem.locator('.item-quantity-field')).toHaveClass(/hidden/);
  });

  test('should calculate amount for generic items', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Product A',
      quantity: 5,
      unitPrice: 100
    });
    
    // Wait for calculation
    await page.waitForTimeout(100);
    
    const items = page.locator('.invoice-item');
    const amount = await items.first().locator('.item-amount').inputValue();
    expect(parseFloat(amount)).toBe(500);
  });

  test('should calculate amount for hourly items', async ({ page }) => {
    await invoicePage.fillHourlyItem(0, {
      date: '2026-01-20',
      description: 'Consulting work',
      hours: 8,
      rate: 150
    });
    
    // Wait for calculation
    await page.waitForTimeout(100);
    
    const items = page.locator('.invoice-item');
    const amount = await items.first().locator('.item-amount').inputValue();
    expect(parseFloat(amount)).toBe(1200);
  });

  test('should calculate subtotal correctly for mixed item types', async ({ page }) => {
    // Add a generic item
    await invoicePage.fillGenericItem(0, {
      description: 'Product A',
      quantity: 2,
      unitPrice: 50
    });
    
    // Add an hourly item
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillHourlyItem(1, {
      date: '2026-01-20',
      description: 'Consulting',
      hours: 3,
      rate: 100
    });
    
    // Wait for calculation
    await page.waitForTimeout(100);
    
    // Subtotal should be 100 + 300 = 400
    const subtotal = await invoicePage.getSubtotalAmount();
    expect(subtotal).toBeCloseTo(400, 2);
  });

  test('should display GST calculation at 15%', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Test item',
      quantity: 1,
      unitPrice: 100
    });
    
    await page.waitForTimeout(100);
    
    const gst = await invoicePage.getGSTAmount();
    expect(gst).toBeCloseTo(15, 2); // 15% of 100
  });

  test('should display total including GST', async ({ page }) => {
    await invoicePage.fillGenericItem(0, {
      description: 'Test item',
      quantity: 1,
      unitPrice: 100
    });
    
    await page.waitForTimeout(100);
    
    const total = await invoicePage.getTotalAmount();
    expect(total).toBeCloseTo(115, 2); // 100 + 15% GST
  });

  test('should show correct initial totals (zero)', async ({ page }) => {
    const subtotal = await invoicePage.getSubtotalAmount();
    const gst = await invoicePage.getGSTAmount();
    const total = await invoicePage.getTotalAmount();
    
    expect(subtotal).toBe(0);
    expect(gst).toBe(0);
    expect(total).toBe(0);
  });

  test('should update totals when item type changes', async ({ page }) => {
    const items = page.locator('.invoice-item');
    const firstItem = items.first();
    
    // Fill as generic item
    await invoicePage.fillGenericItem(0, {
      description: 'Test',
      quantity: 2,
      unitPrice: 50
    });
    
    await page.waitForTimeout(100);
    let subtotal = await invoicePage.getSubtotalAmount();
    expect(subtotal).toBeCloseTo(100, 2);
    
    // Change to hourly and fill
    await firstItem.locator('.item-type').selectOption('hourly');
    await firstItem.locator('.item-date').fill('2026-01-20');
    await firstItem.locator('.item-hours').fill('5');
    await firstItem.locator('.item-rate').fill('40');
    
    await page.waitForTimeout(100);
    subtotal = await invoicePage.getSubtotalAmount();
    expect(subtotal).toBeCloseTo(200, 2);
  });

  test('should remove invoice item', async ({ page }) => {
    await page.getByRole('button', { name: /Add Item/i }).click();
    
    // Count items before removal
    const itemsBefore = await page.locator('.invoice-item').count();
    
    // Look for remove button
    const removeButton = page.locator('.invoice-item').last().getByRole('button', { name: /remove/i });
    await removeButton.click();
    
    // Wait for removal
    await page.waitForTimeout(300);
    
    // Count items after removal
    const itemsAfter = await page.locator('.invoice-item').count();
    expect(itemsAfter).toBe(itemsBefore - 1);
  });

  test('should handle multiple items of different types', async ({ page }) => {
    // Item 1: Generic
    await invoicePage.fillGenericItem(0, {
      description: 'Widget',
      quantity: 3,
      unitPrice: 25
    });
    
    // Add Item 2: Hourly
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillHourlyItem(1, {
      date: '2026-01-15',
      description: 'Development',
      hours: 4,
      rate: 100
    });
    
    // Add Item 3: Generic
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillGenericItem(2, {
      description: 'Service',
      quantity: 1,
      unitPrice: 200
    });
    
    await page.waitForTimeout(100);
    
    // Total should be 75 + 400 + 200 = 675
    const subtotal = await invoicePage.getSubtotalAmount();
    expect(subtotal).toBeCloseTo(675, 2);
    
    // GST should be 15% of 675 = 101.25
    const gst = await invoicePage.getGSTAmount();
    expect(gst).toBeCloseTo(101.25, 2);
    
    // Total should be 675 + 101.25 = 776.25
    const total = await invoicePage.getTotalAmount();
    expect(total).toBeCloseTo(776.25, 2);
  });
});
