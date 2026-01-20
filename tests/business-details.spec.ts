import { test, expect } from '@playwright/test';

test.describe('Business Details Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all business detail fields', async ({ page }) => {
    await expect(page.getByLabel('Business/Trading Name')).toBeVisible();
    await expect(page.getByLabel('GST Number (optional)')).toBeVisible();
    await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Phone', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Address', { exact: true })).toBeVisible();
  });

  test('should accept valid business details', async ({ page }) => {
    await page.getByLabel('Business/Trading Name').fill('ABC Trading Ltd');
    await page.getByLabel('GST Number (optional)').fill('123-456-789');
    await page.getByLabel('Email', { exact: true }).fill('business@example.com');
    await page.getByLabel('Phone', { exact: true }).fill('021 123 4567');
    await page.getByLabel('Address', { exact: true }).fill('123 Main St, Auckland 1010');

    // Verify values are entered
    await expect(page.getByLabel('Business/Trading Name')).toHaveValue('ABC Trading Ltd');
    await expect(page.getByLabel('GST Number (optional)')).toHaveValue('123-456-789');
    await expect(page.getByLabel('Email', { exact: true })).toHaveValue('business@example.com');
    await expect(page.getByLabel('Phone', { exact: true })).toHaveValue('021 123 4567');
    await expect(page.getByLabel('Address', { exact: true })).toHaveValue('123 Main St, Auckland 1010');
  });

  test('should validate required business fields', async ({ page }) => {
    // Try to save without filling required fields
    const saveButton = page.getByRole('button', { name: 'Save My Details' });
    await saveButton.click();
    
    // Check for validation messages or that fields show invalid state
    const businessName = page.getByLabel('Business/Trading Name');
    await expect(businessName).toHaveAttribute('required', '');
  });

  test('should save business details to local storage', async ({ page }) => {
    await page.getByLabel('Business/Trading Name').fill('Test Business');
    await page.getByLabel('Email', { exact: true }).fill('test@example.com');
    await page.getByLabel('Address', { exact: true }).fill('123 Test St');
    
    await page.getByRole('button', { name: 'Save My Details' }).click();
    
    // Reload page and check if data persists
    await page.reload();
    
    await expect(page.getByLabel('Business/Trading Name')).toHaveValue('Test Business');
    await expect(page.getByLabel('Email', { exact: true })).toHaveValue('test@example.com');
    await expect(page.getByLabel('Address', { exact: true })).toHaveValue('123 Test St');
  });

  test('should clear business details', async ({ page }) => {
    await page.getByLabel('Business/Trading Name').fill('Test Business');
    await page.getByLabel('Email', { exact: true }).fill('test@example.com');
    
    await page.getByRole('button', { name: 'Clear', exact: true }).first().click();
    
    await expect(page.getByLabel('Business/Trading Name')).toHaveValue('');
    await expect(page.getByLabel('Email', { exact: true })).toHaveValue('');
  });
});
