import { test, expect } from '@playwright/test';

test.describe('Bank Account Details Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all bank detail fields', async ({ page }) => {
    await expect(page.getByLabel('Bank Name *')).toBeVisible();
    await expect(page.getByLabel('Account Name *')).toBeVisible();
    await expect(page.getByLabel('Account Number *')).toBeVisible();
  });

  test('should display bank account name warning', async ({ page }) => {
    // Check that the important warning message is displayed
    await expect(page.getByText(/NZ banks now verify that the account name matches/i)).toBeVisible();
  });

  test('should accept valid bank details', async ({ page }) => {
    await page.getByLabel('Bank Name *').fill('ANZ Bank New Zealand');
    await page.getByLabel('Account Name *').fill('ABC Trading Ltd');
    await page.getByLabel('Account Number *').fill('12-3456-7890123-00');

    await expect(page.getByLabel('Bank Name *')).toHaveValue('ANZ Bank New Zealand');
    await expect(page.getByLabel('Account Name *')).toHaveValue('ABC Trading Ltd');
    await expect(page.getByLabel('Account Number *')).toHaveValue('12-3456-7890123-00');
  });

  test('should validate required bank fields', async ({ page }) => {
    const bankName = page.getByLabel('Bank Name *');
    const accountName = page.getByLabel('Account Name *');
    const accountNumber = page.getByLabel('Account Number *');

    await expect(bankName).toHaveAttribute('required', '');
    await expect(accountName).toHaveAttribute('required', '');
    await expect(accountNumber).toHaveAttribute('required', '');
  });

  test('should persist bank details with business details', async ({ page }) => {
    // Fill business details
    await page.getByLabel('Business/Trading Name *').fill('Test Business');
    await page.getByLabel('Email *').fill('test@example.com');
    await page.getByLabel('Address *').first().fill('123 Test St');
    
    // Fill bank details
    await page.getByLabel('Bank Name *').fill('Test Bank');
    await page.getByLabel('Account Name *').fill('Test Business');
    await page.getByLabel('Account Number *').fill('12-3456-7890123-00');
    
    // Handle alert dialog
    page.once('dialog', dialog => dialog.accept());
    
    await page.getByRole('button', { name: 'Save My Details' }).click();
    
    await page.reload();
    
    await expect(page.getByLabel('Bank Name *')).toHaveValue('Test Bank');
    await expect(page.getByLabel('Account Name *')).toHaveValue('Test Business');
    await expect(page.getByLabel('Account Number *')).toHaveValue('12-3456-7890123-00');
  });
});
