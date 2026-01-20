import { test, expect } from '@playwright/test';

test.describe('End-to-End Invoice Creation Flow', () => {
  test('complete invoice creation workflow', async ({ page }) => {
    await page.goto('/');
    
    // Step 1: Enter business details
    await page.getByLabel('Business/Trading Name').fill('E2E Test Business Ltd');
    await page.getByLabel('GST Number (optional)').fill('123-456-789');
    await page.getByLabel('Email', { exact: true }).fill('e2e@testbusiness.com');
    await page.getByLabel('Phone', { exact: true }).fill('09 555 1234');
    await page.getByLabel('Address', { exact: true }).fill('123 E2E Street, Auckland 1010');
    
    // Step 2: Enter bank details
    await page.getByLabel('Bank Name').fill('ANZ Bank New Zealand');
    await page.getByLabel('Account Name').fill('E2E Test Business Ltd');
    await page.getByLabel('Account Number').fill('01-2345-6789012-00');
    
    // Step 3: Save business details
    await page.getByRole('button', { name: 'Save My Details' }).click();
    
    // Step 4: Enter client details
    await page.getByLabel('Client Name').fill('E2E Test Client Ltd');
    await page.getByLabel('Email').nth(1).fill('client@e2etest.com');
    await page.getByLabel('Phone').nth(1).fill('09 555 9876');
    await page.getByLabel('Address').nth(1).fill('456 Client Road, Wellington 6011');
    
    // Step 5: Save client
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    // Step 6: Enter invoice details
    await page.getByLabel('Invoice Number').fill('E2E-2026-001');
    await page.getByLabel('Invoice Date').fill('2026-01-20');
    await page.getByLabel('Due Date').fill('2026-02-20');
    
    // Step 7: Add invoice items
    await page.getByRole('button', { name: /Add Item/i }).click();
    await page.waitForTimeout(300);
    
    // Step 8: Verify all data is present
    await expect(page.getByLabel('Business/Trading Name')).toHaveValue('E2E Test Business Ltd');
    await expect(page.getByLabel('Client Name')).toHaveValue('E2E Test Client Ltd');
    await expect(page.getByLabel('Invoice Number')).toHaveValue('E2E-2026-001');
    
    // Step 9: Verify calculations are displayed
    await expect(page.getByText(/Subtotal/i)).toBeVisible();
    await expect(page.getByText(/GST/i)).toBeVisible();
    await expect(page.getByText(/Total/i)).toBeVisible();
    
    // Step 10: Generate invoice
    await page.getByRole('button', { name: 'Generate Invoice' }).click();
    
    await page.waitForTimeout(1000);
  });

  test('saved data persistence across sessions', async ({ page }) => {
    // First session: Save data
    await page.goto('/');
    
    await page.getByLabel('Business/Trading Name').fill('Persistence Test Ltd');
    await page.getByLabel('Email', { exact: true }).fill('persist@test.com');
    await page.getByLabel('Address', { exact: true }).fill('Persistence Address');
    
    await page.getByLabel('Bank Name').fill('Persistence Bank');
    await page.getByLabel('Account Name').fill('Persistence Test Ltd');
    await page.getByLabel('Account Number').fill('99-8888-7777777-00');
    
    await page.getByRole('button', { name: 'Save My Details' }).click();
    
    // Save a client
    await page.getByLabel('Client Name').fill('Persistent Client');
    await page.getByLabel('Address').nth(1).fill('Persistent Client Address');
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    // Second session: Reload and verify
    await page.reload();
    
    await expect(page.getByLabel('Business/Trading Name')).toHaveValue('Persistence Test Ltd');
    await expect(page.getByLabel('Bank Name')).toHaveValue('Persistence Bank');
    
    // Check client is in dropdown
    const clientSelect = page.locator('select').first();
    await expect(clientSelect).toContainText('Persistent Client');
  });

  test('multiple client management workflow', async ({ page }) => {
    await page.goto('/');
    
    // Add first client
    await page.getByLabel('Client Name').fill('Client One');
    await page.getByLabel('Address').nth(1).fill('Address One');
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    await page.waitForTimeout(200);
    
    // Clear and add second client
    await page.getByRole('button', { name: 'Clear' }).nth(1).click();
    await page.getByLabel('Client Name').fill('Client Two');
    await page.getByLabel('Address').nth(1).fill('Address Two');
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    await page.waitForTimeout(200);
    
    // Clear and add third client
    await page.getByRole('button', { name: 'Clear' }).nth(1).click();
    await page.getByLabel('Client Name').fill('Client Three');
    await page.getByLabel('Address').nth(1).fill('Address Three');
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    // Verify all clients are in dropdown
    const clientSelect = page.locator('select').first();
    await expect(clientSelect).toContainText('Client One');
    await expect(clientSelect).toContainText('Client Two');
    await expect(clientSelect).toContainText('Client Three');
    
    // Switch between clients
    await clientSelect.selectOption({ label: 'Client One' });
    await expect(page.getByLabel('Client Name')).toHaveValue('Client One');
    
    await clientSelect.selectOption({ label: 'Client Two' });
    await expect(page.getByLabel('Client Name')).toHaveValue('Client Two');
  });
});
