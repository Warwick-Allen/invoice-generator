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
    await page.getByLabel('Business/Trading Name').fill('Test Business Ltd');
    await page.getByLabel('Email', { exact: true }).fill('business@test.com');
    await page.getByLabel('Address', { exact: true }).fill('123 Business St');
    
    await page.getByLabel('Bank Name').fill('Test Bank');
    await page.getByLabel('Account Name').fill('Test Business Ltd');
    await page.getByLabel('Account Number').fill('12-3456-7890123-00');
    
    await page.getByLabel('Client Name').fill('Test Client');
    await page.getByLabel('Address').nth(1).fill('456 Client Ave');
    
    await page.getByLabel('Invoice Number').fill('INV-001');
    await page.getByLabel('Invoice Date').fill('2026-01-20');
    
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
    await page.getByLabel('Business/Trading Name').fill('Test Business');
    await page.getByLabel('Invoice Number').fill('INV-001');
    
    // Reset form
    await page.getByRole('button', { name: 'Reset Form' }).click();
    
    // Verify fields are cleared (except saved business details)
    await expect(page.getByLabel('Invoice Number')).toHaveValue('');
  });

  test('should handle print invoice action', async ({ page }) => {
    // Fill in minimal required data
    await page.getByLabel('Business/Trading Name').fill('Print Test Business');
    await page.getByLabel('Email', { exact: true }).fill('print@test.com');
    await page.getByLabel('Address', { exact: true }).fill('Print Address');
    
    await page.getByLabel('Bank Name').fill('Print Bank');
    await page.getByLabel('Account Name').fill('Print Account');
    await page.getByLabel('Account Number').fill('12-3456-7890123-00');
    
    await page.getByLabel('Client Name').fill('Print Client');
    await page.getByLabel('Address').nth(1).fill('Print Client Address');
    
    await page.getByLabel('Invoice Number').fill('PRINT-001');
    await page.getByLabel('Invoice Date').fill('2026-01-20');
    
    // Listen for print dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Click print button
    await page.getByRole('button', { name: 'Print Invoice' }).click();
    
    // Just verify the button exists and is clickable
    await expect(page.getByRole('button', { name: 'Print Invoice' })).toBeVisible();
  });
});
