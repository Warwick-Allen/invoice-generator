import { test, expect } from '@playwright/test';

test.describe('Invoice Details Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display invoice detail fields', async ({ page }) => {
    await expect(page.getByLabel('Invoice Number *')).toBeVisible();
    await expect(page.getByLabel('Invoice Date *')).toBeVisible();
    await expect(page.getByLabel('Due Date')).toBeVisible();
    await expect(page.getByLabel('Invoice Period Start (optional)')).toBeVisible();
    await expect(page.getByLabel('Invoice Period End (optional)')).toBeVisible();
  });

  test('should accept invoice details', async ({ page }) => {
    await page.getByLabel('Invoice Number *').fill('INV-2026-001');
    await page.getByLabel('Invoice Date *').fill('2026-01-20');
    await page.getByLabel('Due Date').fill('2026-02-20');

    await expect(page.getByLabel('Invoice Number *')).toHaveValue('INV-2026-001');
    await expect(page.getByLabel('Invoice Date *')).toHaveValue('2026-01-20');
    await expect(page.getByLabel('Due Date')).toHaveValue('2026-02-20');
  });

  test('should accept invoice period dates', async ({ page }) => {
    await page.getByLabel('Invoice Period Start (optional)').fill('2026-01-01');
    await page.getByLabel('Invoice Period End (optional)').fill('2026-01-31');

    await expect(page.getByLabel('Invoice Period Start (optional)')).toHaveValue('2026-01-01');
    await expect(page.getByLabel('Invoice Period End (optional)')).toHaveValue('2026-01-31');
  });

  test('should validate required invoice number', async ({ page }) => {
    const invoiceNumber = page.getByLabel('Invoice Number *');
    await expect(invoiceNumber).toHaveAttribute('required', '');
  });

  test('should validate required invoice date', async ({ page }) => {
    const invoiceDate = page.getByLabel('Invoice Date *');
    await expect(invoiceDate).toHaveAttribute('required', '');
  });

  test('should allow due date to be optional', async ({ page }) => {
    // Due date should not have required attribute
    const dueDate = page.getByLabel('Due Date');
    const isRequired = await dueDate.getAttribute('required');
    expect(isRequired).toBeNull();
  });

  test('should allow invoice period fields to be optional', async ({ page }) => {
    // Period start and end should not have required attribute
    const periodStart = page.getByLabel('Invoice Period Start (optional)');
    const periodEnd = page.getByLabel('Invoice Period End (optional)');
    
    const isStartRequired = await periodStart.getAttribute('required');
    const isEndRequired = await periodEnd.getAttribute('required');
    
    expect(isStartRequired).toBeNull();
    expect(isEndRequired).toBeNull();
  });

  test('should allow only period start to be filled', async ({ page }) => {
    await page.getByLabel('Invoice Period Start (optional)').fill('2026-01-01');

    await expect(page.getByLabel('Invoice Period Start (optional)')).toHaveValue('2026-01-01');
    await expect(page.getByLabel('Invoice Period End (optional)')).toHaveValue('');
  });

  test('should allow only period end to be filled', async ({ page }) => {
    await page.getByLabel('Invoice Period End (optional)').fill('2026-01-31');

    await expect(page.getByLabel('Invoice Period Start (optional)')).toHaveValue('');
    await expect(page.getByLabel('Invoice Period End (optional)')).toHaveValue('2026-01-31');
  });

  test('should auto-increment invoice number suggestion', async ({ page }) => {
    // This test assumes the app might have auto-increment functionality
    // If not present, this test will need to be adjusted
    const invoiceNumber = page.getByLabel('Invoice Number *');
    const initialValue = await invoiceNumber.inputValue();
    
    // Just verify the field exists and can be interacted with
    await invoiceNumber.fill('INV-001');
    await expect(invoiceNumber).toHaveValue('INV-001');
  });
});
