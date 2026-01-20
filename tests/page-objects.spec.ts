import { test, expect } from '@playwright/test';
import { InvoiceGeneratorPage } from './helpers/page-objects';
import { testBusinessDetails, testBankDetails, testClientDetails, testInvoiceDetails } from './helpers/test-data';

test.describe('Page Objects Integration Tests', () => {
  let invoicePage: InvoiceGeneratorPage;

  test.beforeEach(async ({ page }) => {
    invoicePage = new InvoiceGeneratorPage(page);
    await invoicePage.goto();
  });

  test('should fill business details using page object', async () => {
    await invoicePage.fillBusinessDetails(testBusinessDetails.valid);
    
    await expect(invoicePage.businessName).toHaveValue(testBusinessDetails.valid.name);
    await expect(invoicePage.businessEmail).toHaveValue(testBusinessDetails.valid.email);
    await expect(invoicePage.businessAddress).toHaveValue(testBusinessDetails.valid.address);
  });

  test('should fill and save complete business information', async () => {
    await invoicePage.fillBusinessDetails(testBusinessDetails.valid);
    await invoicePage.fillBankDetails(testBankDetails.valid);
    await invoicePage.saveBusinessDetails();
    
    // Reload and verify persistence
    await invoicePage.goto();
    
    await expect(invoicePage.businessName).toHaveValue(testBusinessDetails.valid.name);
    await expect(invoicePage.bankName).toHaveValue(testBankDetails.valid.bankName);
  });

  test('should manage multiple clients using page object', async () => {
    // Add first client
    await invoicePage.fillClientDetails(testClientDetails.client1);
    await invoicePage.saveClient();
    
    await invoicePage.page.waitForTimeout(200);
    
    // Add second client
    await invoicePage.clearClientButton.click();
    await invoicePage.fillClientDetails(testClientDetails.client2);
    await invoicePage.saveClient();
    
    await invoicePage.page.waitForTimeout(200);
    
    // Switch between clients
    await invoicePage.selectClient(testClientDetails.client1.name);
    await expect(invoicePage.clientName).toHaveValue(testClientDetails.client1.name);
    
    await invoicePage.selectClient(testClientDetails.client2.name);
    await expect(invoicePage.clientName).toHaveValue(testClientDetails.client2.name);
  });

  test('should complete full invoice workflow using page objects', async () => {
    // Fill business details
    await invoicePage.fillBusinessDetails(testBusinessDetails.minimal);
    await invoicePage.fillBankDetails(testBankDetails.valid);
    await invoicePage.saveBusinessDetails();
    
    // Fill client details
    await invoicePage.fillClientDetails(testClientDetails.minimal);
    
    // Fill invoice details
    await invoicePage.fillInvoiceDetails(testInvoiceDetails.current);
    
    // Add items
    await invoicePage.addInvoiceItem();
    
    // Verify all sections are complete
    await expect(invoicePage.businessName).toHaveValue(testBusinessDetails.minimal.name);
    await expect(invoicePage.clientName).toHaveValue(testClientDetails.minimal.name);
    await expect(invoicePage.invoiceNumber).toHaveValue(testInvoiceDetails.current.invoiceNumber);
  });

  test('should extract monetary amounts correctly', async () => {
    const subtotalAmount = await invoicePage.getSubtotalAmount();
    const gstAmount = await invoicePage.getGSTAmount();
    const totalAmount = await invoicePage.getTotalAmount();
    
    // Initially all should be 0
    expect(subtotalAmount).toBe(0);
    expect(gstAmount).toBe(0);
    expect(totalAmount).toBe(0);
  });

  test('should handle invoice generation workflow', async () => {
    // Fill all required fields
    await invoicePage.fillBusinessDetails(testBusinessDetails.valid);
    await invoicePage.fillBankDetails(testBankDetails.valid);
    await invoicePage.fillClientDetails(testClientDetails.client1);
    await invoicePage.fillInvoiceDetails(testInvoiceDetails.custom);
    
    // Verify generate button is visible and clickable
    await expect(invoicePage.generateInvoiceButton).toBeVisible();
    await expect(invoicePage.generateInvoiceButton).toBeEnabled();
  });

  test('should navigate through all form sections', async () => {
    // Verify all major sections are accessible
    await expect(invoicePage.businessName).toBeVisible();
    await expect(invoicePage.bankName).toBeVisible();
    await expect(invoicePage.clientName).toBeVisible();
    await expect(invoicePage.invoiceNumber).toBeVisible();
    await expect(invoicePage.addItemButton).toBeVisible();
    await expect(invoicePage.generateInvoiceButton).toBeVisible();
  });
});
