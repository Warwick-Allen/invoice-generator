import { test, expect } from '@playwright/test';
import { InvoiceGeneratorPage } from './helpers/page-objects';

test.describe('End-to-End Invoice Creation Flow', () => {
  test('complete invoice creation workflow', async ({ page }) => {
    await page.goto('/');
    
    // Step 1: Enter business details
    await page.getByLabel('Business/Trading Name *').fill('E2E Test Business Ltd');
    await page.getByLabel('GST Number (optional)').fill('123-456-789');
    await page.getByLabel('Email *').fill('e2e@testbusiness.com');
    await page.locator('#traderPhone').fill('09 555 1234');
    await page.getByLabel('Address *').first().fill('123 E2E Street, Auckland 1010');
    
    // Step 2: Enter bank details
    await page.getByLabel('Bank Name *').fill('ANZ Bank New Zealand');
    await page.getByLabel('Account Name *').fill('E2E Test Business Ltd');
    await page.getByLabel('Account Number *').fill('01-2345-6789012-00');
    
    // Step 3: Save business details
    await page.getByRole('button', { name: 'Save My Details' }).click();
    
    // Step 4: Enter client details
    await page.getByLabel('Client Name *').fill('E2E Test Client Ltd');
    await page.locator('#clientEmail').fill('client@e2etest.com');
    await page.locator('#clientPhone').fill('09 555 9876');
    await page.getByLabel('Address *').nth(1).fill('456 Client Road, Wellington 6011');
    
    // Step 5: Save client
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    // Step 6: Enter invoice details
    await page.getByLabel('Invoice Number *').fill('E2E-2026-001');
    await page.getByLabel('Invoice Date *').fill('2026-01-20');
    await page.getByLabel('Due Date').fill('2026-02-20');
    
    // Step 7: Add invoice items
    await page.getByRole('button', { name: /Add Item/i }).click();
    await page.waitForTimeout(300);
    
    // Step 8: Verify all data is present
    await expect(page.getByLabel('Business/Trading Name *')).toHaveValue('E2E Test Business Ltd');
    await expect(page.getByLabel('Client Name *')).toHaveValue('E2E Test Client Ltd');
    await expect(page.getByLabel('Invoice Number *')).toHaveValue('E2E-2026-001');
    
    // Step 9: Verify calculations are displayed
    await expect(page.getByText('Subtotal (excl. GST):')).toBeVisible();
    await expect(page.getByText('GST (15%):')).toBeVisible();
    await expect(page.getByText('Total (incl. GST):')).toBeVisible();
    
    // Step 10: Generate invoice
    await page.getByRole('button', { name: 'Generate Invoice' }).click();
    
    await page.waitForTimeout(1000);
  });

  test('saved data persistence across sessions', async ({ page }) => {
    // First session: Save data
    await page.goto('/');
    
    await page.getByLabel('Business/Trading Name *').fill('Persistence Test Ltd');
    await page.getByLabel('Email *').fill('persist@test.com');
    await page.getByLabel('Address *').first().fill('Persistence Address');
    
    await page.getByLabel('Bank Name *').fill('Persistence Bank');
    await page.getByLabel('Account Name *').fill('Persistence Test Ltd');
    await page.getByLabel('Account Number *').fill('99-8888-7777777-00');
    
    await page.getByRole('button', { name: 'Save My Details' }).click();
    
    // Save a client
    await page.getByLabel('Client Name *').fill('Persistent Client');
    await page.getByLabel('Address *').nth(1).fill('Persistent Client Address');
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    // Second session: Reload and verify
    await page.reload();
    
    await expect(page.getByLabel('Business/Trading Name *')).toHaveValue('Persistence Test Ltd');
    await expect(page.getByLabel('Bank Name *')).toHaveValue('Persistence Bank');
    
    // Check client is in dropdown
    const clientSelect = page.locator('select').first();
    await expect(clientSelect).toContainText('Persistent Client');
  });

  test('multiple client management workflow', async ({ page }) => {
    await page.goto('/');
    
    // Add first client
    await page.getByLabel('Client Name *').fill('Client One');
    await page.getByLabel('Address *').nth(1).fill('Address One');
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    await page.waitForTimeout(200);
    
    // Clear and add second client
    await page.getByRole('button', { name: 'Clear' }).nth(1).click();
    await page.getByLabel('Client Name *').fill('Client Two');
    await page.getByLabel('Address *').nth(1).fill('Address Two');
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    await page.waitForTimeout(200);
    
    // Clear and add third client
    await page.getByRole('button', { name: 'Clear' }).nth(1).click();
    await page.getByLabel('Client Name *').fill('Client Three');
    await page.getByLabel('Address *').nth(1).fill('Address Three');
    await page.getByRole('button', { name: 'Save Client' }).click();
    
    // Verify all clients are in dropdown
    const clientSelect = page.locator('select').first();
    await expect(clientSelect).toContainText('Client One');
    await expect(clientSelect).toContainText('Client Two');
    await expect(clientSelect).toContainText('Client Three');
    
    // Switch between clients
    await clientSelect.selectOption({ label: 'Client One' });
    await expect(page.getByLabel('Client Name *')).toHaveValue('Client One');
    
    await clientSelect.selectOption({ label: 'Client Two' });
    await expect(page.getByLabel('Client Name *')).toHaveValue('Client Two');
  });

  test('invoice generation with mixed item types', async ({ page }) => {
    const invoicePage = new InvoiceGeneratorPage(page);
    await page.goto('/');
    
    // Setup business details
    await invoicePage.fillBusinessDetails({
      name: 'Mixed Items Business',
      email: 'mixed@test.com',
      address: '123 Test St'
    });
    
    await invoicePage.fillBankDetails({
      bankName: 'Test Bank',
      accountName: 'Mixed Items Business',
      accountNumber: '12-3456-7890123-00'
    });
    
    // Setup client
    await invoicePage.fillClientDetails({
      name: 'Test Client',
      address: '456 Client Rd'
    });
    
    // Setup invoice details
    await invoicePage.fillInvoiceDetails({
      invoiceNumber: 'MIX-001',
      invoiceDate: '2026-01-20'
    });
    
    // Add a generic item
    await invoicePage.fillGenericItem(0, {
      description: 'Software License',
      quantity: 5,
      unitPrice: 200
    });
    
    // Add an hourly rate item
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillHourlyItem(1, {
      date: '2026-01-18',
      description: 'Consulting Services',
      hours: 6.5,
      rate: 150
    });
    
    // Add another generic item
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillGenericItem(2, {
      description: 'Hardware',
      quantity: 2,
      unitPrice: 350
    });
    
    await page.waitForTimeout(200);
    
    // Verify calculations
    // 5*200 + 6.5*150 + 2*350 = 1000 + 975 + 700 = 2675
    const subtotal = await invoicePage.getSubtotalAmount();
    expect(subtotal).toBeCloseTo(2675, 2);
    
    // GST = 2675 * 0.15 = 401.25
    const gst = await invoicePage.getGSTAmount();
    expect(gst).toBeCloseTo(401.25, 2);
    
    // Total = 2675 + 401.25 = 3076.25
    const total = await invoicePage.getTotalAmount();
    expect(total).toBeCloseTo(3076.25, 2);
    
    // Generate invoice
    await invoicePage.generateInvoice();
    await page.waitForTimeout(500);
    
    // Verify invoice preview contains both item types
    const preview = page.locator('.invoice-preview');
    await expect(preview).toBeVisible();
    
    // Should have mixed columns
    await expect(preview.getByText('Software License')).toBeVisible();
    await expect(preview.getByText('Consulting Services')).toBeVisible();
    await expect(preview.getByText('Hardware')).toBeVisible();
    
    // Check for appropriate headers (should show all columns when mixed)
    const table = preview.locator('.invoice-table');
    await expect(table.getByText('Date')).toBeVisible();
    await expect(table.getByText('Hours')).toBeVisible();
    await expect(table.getByText('Quantity')).toBeVisible();
  });

  test('invoice generation with only hourly items', async ({ page }) => {
    const invoicePage = new InvoiceGeneratorPage(page);
    await page.goto('/');
    
    // Setup business details
    await invoicePage.fillBusinessDetails({
      name: 'Hourly Business',
      email: 'hourly@test.com',
      address: '789 Hourly Ave'
    });
    
    await invoicePage.fillBankDetails({
      bankName: 'Hourly Bank',
      accountName: 'Hourly Business',
      accountNumber: '11-2222-3333333-00'
    });
    
    // Setup client
    await invoicePage.fillClientDetails({
      name: 'Hourly Client',
      address: '321 Hourly Rd'
    });
    
    // Setup invoice details
    await invoicePage.fillInvoiceDetails({
      invoiceNumber: 'HRL-001',
      invoiceDate: '2026-01-20'
    });
    
    // Add hourly items only
    await invoicePage.fillHourlyItem(0, {
      date: '2026-01-15',
      description: 'Development Work',
      hours: 8,
      rate: 125
    });
    
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillHourlyItem(1, {
      date: '2026-01-16',
      description: 'Code Review',
      hours: 3,
      rate: 125
    });
    
    await page.waitForTimeout(200);
    
    // Generate and verify
    await invoicePage.generateInvoice();
    await page.waitForTimeout(500);
    
    const preview = page.locator('.invoice-preview');
    const table = preview.locator('.invoice-table');
    
    // Should show Date and Hours columns
    await expect(table.getByText('Date')).toBeVisible();
    await expect(table.getByText('Hours')).toBeVisible();
    await expect(table.getByText('Rate')).toBeVisible();
    
    // Should NOT show Quantity column
    const quantityHeaders = await table.getByText('Quantity').count();
    expect(quantityHeaders).toBe(0);
  });

  test('invoice generation with only generic items', async ({ page }) => {
    const invoicePage = new InvoiceGeneratorPage(page);
    await page.goto('/');
    
    // Setup business details
    await invoicePage.fillBusinessDetails({
      name: 'Generic Business',
      email: 'generic@test.com',
      address: '456 Generic Blvd'
    });
    
    await invoicePage.fillBankDetails({
      bankName: 'Generic Bank',
      accountName: 'Generic Business',
      accountNumber: '22-3333-4444444-00'
    });
    
    // Setup client
    await invoicePage.fillClientDetails({
      name: 'Generic Client',
      address: '654 Generic St'
    });
    
    // Setup invoice details
    await invoicePage.fillInvoiceDetails({
      invoiceNumber: 'GEN-001',
      invoiceDate: '2026-01-20'
    });
    
    // Add generic items only
    await invoicePage.fillGenericItem(0, {
      description: 'Product A',
      quantity: 10,
      unitPrice: 50
    });
    
    await page.getByRole('button', { name: /Add Item/i }).click();
    await invoicePage.fillGenericItem(1, {
      description: 'Product B',
      quantity: 5,
      unitPrice: 100
    });
    
    await page.waitForTimeout(200);
    
    // Generate and verify
    await invoicePage.generateInvoice();
    await page.waitForTimeout(500);
    
    const preview = page.locator('.invoice-preview');
    const table = preview.locator('.invoice-table');
    
    // Should show Quantity and Unit Price columns
    await expect(table.getByText('Quantity')).toBeVisible();
    await expect(table.getByText('Unit Price')).toBeVisible();
    
    // Should NOT show Date or Hours columns
    const dateHeaders = await table.getByText('Date').count();
    const hoursHeaders = await table.getByText('Hours').count();
    expect(dateHeaders).toBe(0);
    expect(hoursHeaders).toBe(0);
  });
});
