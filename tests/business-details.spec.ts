import { test, expect } from '@playwright/test';

test.describe('Business Details Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all business detail fields', async ({ page }) => {
    await expect(page.getByLabel('Business/Trading Name *')).toBeVisible();
    await expect(page.getByLabel('GST Number (optional)')).toBeVisible();
    await expect(page.getByLabel('Email *')).toBeVisible();
    await expect(page.locator('#traderPhone')).toBeVisible();
    await expect(page.getByLabel('Address *').first()).toBeVisible();
  });

  test('should accept valid business details', async ({ page }) => {
    await page.getByLabel('Business/Trading Name *').fill('ABC Trading Ltd');
    await page.getByLabel('GST Number (optional)').fill('123-456-789');
    await page.getByLabel('Email *').fill('business@example.com');
    await page.locator('#traderPhone').fill('021 123 4567');
    await page.getByLabel('Address *').first().fill('123 Main St, Auckland 1010');

    // Verify values are entered
    await expect(page.getByLabel('Business/Trading Name *')).toHaveValue('ABC Trading Ltd');
    await expect(page.getByLabel('GST Number (optional)')).toHaveValue('123-456-789');
    await expect(page.getByLabel('Email *')).toHaveValue('business@example.com');
    await expect(page.locator('#traderPhone')).toHaveValue('021 123 4567');
    await expect(page.getByLabel('Address *').first()).toHaveValue('123 Main St, Auckland 1010');
  });

  test('should validate required business fields', async ({ page }) => {
    // Try to save without filling required fields
    const saveButton = page.getByRole('button', { name: 'Save My Details' });
    await saveButton.click();
    
    // Check for validation messages or that fields show invalid state
    const businessName = page.getByLabel('Business/Trading Name *');
    await expect(businessName).toHaveAttribute('required', '');
  });

  test('should save business details to local storage', async ({ page }) => {
    await page.getByLabel('Business/Trading Name *').fill('Test Business');
    await page.getByLabel('Email *').fill('test@example.com');
    await page.getByLabel('Address *').first().fill('123 Test St');
    await page.getByLabel('Bank Name *').fill('Test Bank');
    await page.getByLabel('Account Name *').fill('Test Account');
    await page.getByLabel('Account Number *').fill('12-3456-7890123-00');
    
    // Handle alert dialog
    page.once('dialog', dialog => dialog.accept());
    
    await page.getByRole('button', { name: 'Save My Details' }).click();
    
    // Reload page and check if data persists
    await page.reload();
    
    await expect(page.getByLabel('Business/Trading Name *')).toHaveValue('Test Business');
    await expect(page.getByLabel('Email *')).toHaveValue('test@example.com');
    await expect(page.getByLabel('Address *').first()).toHaveValue('123 Test St');
  });

  test('should clear business details', async ({ page }) => {
    await page.getByLabel('Business/Trading Name *').fill('Test Business');
    await page.getByLabel('Email *').fill('test@example.com');
    
    // Handle confirmation dialog
    page.once('dialog', dialog => dialog.accept());
    
    await page.getByRole('button', { name: 'Clear' }).first().click();
    
    await expect(page.getByLabel('Business/Trading Name *')).toHaveValue('');
    await expect(page.getByLabel('Email *')).toHaveValue('');
  });
});
