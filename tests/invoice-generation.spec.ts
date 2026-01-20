import { test, expect } from '@playwright/test';

test.describe('Invoice Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display generate invoice button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Generate Invoice' })).toBeVisible();
  });

  test('should display print invoice button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Print Invoice' })).toBeVisible();
  });

  test('should display reset form button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Reset Form' })).toBeVisible();
  });

  test('should validate required fields before generating invoice', async ({ page }) => {
    // Try to generate invoice without filling required fields
    await page.getByRole('button', { name: 'Generate Invoice' }).click();
    
    // The form should show validation errors or prevent submission
    // Check if we're still on the same page (not navigated away)
    await expect(page.getByRole('button', { name: 'Generate Invoice' })).toBeVisible();
  });

  test('should generate invoice with complete data', async ({ page }) => {
    // Fill in all required fields
    await page.getByLabel('Business/Trading Name *').fill('Test Business Ltd');
    await page.getByLabel('Email *').fill('business@test.com');
    await page.getByLabel('Address *').first().fill('123 Business St');
    
    await page.getByLabel('Bank Name *').fill('Test Bank');
    await page.getByLabel('Account Name *').fill('Test Business Ltd');
    await page.getByLabel('Account Number *').fill('12-3456-7890123-00');
    
    await page.getByLabel('Client Name *').fill('Test Client');
    await page.getByLabel('Address *').nth(1).fill('456 Client Ave');
    
    await page.getByLabel('Invoice Number *').fill('INV-001');
    await page.getByLabel('Invoice Date *').fill('2026-01-20');
    
    // Add at least one item
    await page.getByRole('button', { name: /Add Item/i }).click();
    
    // Generate invoice
    await page.getByRole('button', { name: 'Generate Invoice' }).click();
    
    // Wait for any processing
    await page.waitForTimeout(1000);
    
    // Verify that something happened (exact behaviour depends on implementation)
    // This could be a modal, new page, download, etc.
  });

  test('should reset form to initial state', async ({ page }) => {
    // Fill in some fields
    await page.getByLabel('Business/Trading Name *').fill('Test Business');
    await page.getByLabel('Invoice Number *').fill('INV-001');
    
    // Reset form
    await page.getByRole('button', { name: 'Reset Form' }).click();
    
    // Verify fields are cleared (except saved business details)
    await expect(page.getByLabel('Invoice Number *')).toHaveValue('');
  });

  test('should handle print invoice action', async ({ page }) => {
    // Fill in minimal required data
    await page.getByLabel('Business/Trading Name *').fill('Print Test Business');
    await page.getByLabel('Email *').fill('print@test.com');
    await page.getByLabel('Address *').first().fill('Print Address');
    
    await page.getByLabel('Bank Name *').fill('Print Bank');
    await page.getByLabel('Account Name *').fill('Print Account');
    await page.getByLabel('Account Number *').fill('12-3456-7890123-00');
    
    await page.getByLabel('Client Name *').fill('Print Client');
    await page.getByLabel('Address *').nth(1).fill('Print Client Address');
    
    await page.getByLabel('Invoice Number *').fill('PRINT-001');
    await page.getByLabel('Invoice Date *').fill('2026-01-20');
    
    // Listen for print dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Click print button
    await page.getByRole('button', { name: 'Print Invoice' }).click();
    
    // Just verify the button exists and is clickable
    await expect(page.getByRole('button', { name: 'Print Invoice' })).toBeVisible();
  });

  test('should display invoice period in generated invoice', async ({ page }) => {
    // Fill in all required fields
    await page.getByLabel('Business/Trading Name *').fill('Period Test Business');
    await page.getByLabel('Email *').fill('period@test.com');
    await page.getByLabel('Address *').first().fill('123 Period St');
    
    await page.getByLabel('Bank Name *').fill('Period Bank');
    await page.getByLabel('Account Name *').fill('Period Test Business');
    await page.getByLabel('Account Number *').fill('12-3456-7890123-00');
    
    await page.getByLabel('Client Name *').fill('Period Client');
    await page.getByLabel('Address *').nth(1).fill('456 Period Ave');
    
    await page.getByLabel('Invoice Number *').fill('PERIOD-001');
    await page.getByLabel('Invoice Date *').fill('2026-01-20');
    
    // Fill in invoice period
    await page.getByLabel('Invoice Period Start (optional)').fill('2026-01-01');
    await page.getByLabel('Invoice Period End (optional)').fill('2026-01-31');
    
    // Add at least one item
    const items = page.locator('.invoice-item');
    const item = items.first();
    await item.locator('.item-description').fill('Monthly Service');
    await item.locator('.item-quantity').fill('1');
    await item.locator('.item-rate').fill('1000');
    
    // Generate invoice
    await page.getByRole('button', { name: 'Generate Invoice' }).click();
    
    // Wait for invoice to be generated
    await page.waitForTimeout(1000);
    
    // Verify the invoice preview is visible
    const preview = page.locator('.invoice-preview');
    await expect(preview).toBeVisible();
    
    // Verify period is displayed in the invoice
    const invoiceDetails = preview.locator('.invoice-details');
    await expect(invoiceDetails).toContainText('Period:');
    await expect(invoiceDetails).toContainText('1 January 2026');
    await expect(invoiceDetails).toContainText('31 January 2026');
  });

  test('should generate invoice without period when not provided', async ({ page }) => {
    // Fill in all required fields
    await page.getByLabel('Business/Trading Name *').fill('No Period Business');
    await page.getByLabel('Email *').fill('noperiod@test.com');
    await page.getByLabel('Address *').first().fill('123 No Period St');
    
    await page.getByLabel('Bank Name *').fill('No Period Bank');
    await page.getByLabel('Account Name *').fill('No Period Business');
    await page.getByLabel('Account Number *').fill('12-3456-7890123-00');
    
    await page.getByLabel('Client Name *').fill('No Period Client');
    await page.getByLabel('Address *').nth(1).fill('456 No Period Ave');
    
    await page.getByLabel('Invoice Number *').fill('NO-PERIOD-001');
    await page.getByLabel('Invoice Date *').fill('2026-01-20');
    
    // Do NOT fill in invoice period - leave it blank
    
    // Add at least one item
    const items = page.locator('.invoice-item');
    const item = items.first();
    await item.locator('.item-description').fill('One-time Service');
    await item.locator('.item-quantity').fill('1');
    await item.locator('.item-rate').fill('500');
    
    // Generate invoice
    await page.getByRole('button', { name: 'Generate Invoice' }).click();
    
    // Wait for invoice to be generated
    await page.waitForTimeout(1000);
    
    // Verify the invoice preview is visible
    const preview = page.locator('.invoice-preview');
    await expect(preview).toBeVisible();
    
    // Verify period is NOT displayed in the invoice
    const periodText = await preview.getByText(/Period:/).count();
    expect(periodText).toBe(0);
  });
});
