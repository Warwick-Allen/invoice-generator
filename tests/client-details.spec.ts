import { test, expect } from '@playwright/test';

test.describe('Client Details Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display client selector and detail fields', async ({ page }) => {
    // Check dropdown exists
    await expect(page.locator('select').first()).toBeVisible();
    
    // Check all client fields
    await expect(page.getByLabel('Client Name *')).toBeVisible();
    await expect(page.locator('#clientEmail')).toBeVisible();
    await expect(page.locator('#clientPhone')).toBeVisible();
    await expect(page.getByLabel('Address *').nth(1)).toBeVisible();
  });

  test('should add new client details', async ({ page }) => {
    await page.getByLabel('Client Name *').fill('Test Client Ltd');
    await page.locator('#clientEmail').fill('client@example.com');
    await page.locator('#clientPhone').fill('09 123 4567');
    await page.getByLabel('Address *').nth(1).fill('456 Client Ave, Wellington');

    await expect(page.getByLabel('Client Name *')).toHaveValue('Test Client Ltd');
    await expect(page.locator('#clientEmail')).toHaveValue('client@example.com');
  });

  test('should save client to list', async ({ page }) => {
    await page.getByLabel('Client Name *').fill('Saved Client');
    await page.getByLabel('Address *').nth(1).fill('789 Saved St');
    
    // Handle alert dialog
    page.once('dialog', dialog => dialog.accept());
    
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    // Check if client appears in dropdown
    const clientSelect = page.locator('select').first();
    await expect(clientSelect).toContainText('Saved Client');
  });

  test('should load saved client from dropdown', async ({ page }) => {
    // First save a client
    await page.getByLabel('Client Name *').fill('Dropdown Test Client');
    await page.locator('#clientEmail').fill('dropdown@example.com');
    await page.getByLabel('Address *').nth(1).fill('Dropdown Address');
    
    // Handle alert dialog
    page.once('dialog', dialog => dialog.accept());
    
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    // Clear the form
    await page.getByRole('button', { name: 'Clear' }).nth(1).click();
    
    // Select the client from dropdown
    await page.locator('select').first().selectOption({ label: 'Dropdown Test Client' });
    
    // Verify client details are loaded
    await expect(page.getByLabel('Client Name *')).toHaveValue('Dropdown Test Client');
    await expect(page.locator('#clientEmail')).toHaveValue('dropdown@example.com');
    await expect(page.getByLabel('Address *').nth(1)).toHaveValue('Dropdown Address');
  });

  test('should delete selected client', async ({ page }) => {
    // Save a client
    await page.getByLabel('Client Name *').fill('Client To Delete');
    await page.getByLabel('Address *').nth(1).fill('Delete Street');
    
    // Handle save alert dialog
    page.once('dialog', dialog => dialog.accept());
    
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    // Select the client
    await page.locator('select').first().selectOption({ label: 'Client To Delete' });
    
    // Handle delete confirmation dialog
    page.once('dialog', dialog => dialog.accept());
    
    // Delete the client
    await page.getByRole('button', { name: 'Delete Selected Client' }).click();
    
    // Verify client is removed from dropdown
    const clientSelect = page.locator('select').first();
    await expect(clientSelect).not.toContainText('Client To Delete');
  });

  test('should validate required client fields', async ({ page }) => {
    const clientName = page.getByLabel('Client Name *');
    const clientAddress = page.getByLabel('Address *').nth(1);

    await expect(clientName).toHaveAttribute('required', '');
    await expect(clientAddress).toHaveAttribute('required', '');
  });
});
