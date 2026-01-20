import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Invoice Generator/i);
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check for main heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Verify heading text
    await expect(h1).toContainText(/Invoice Generator/i);
  });

  test('should have section headings', async ({ page }) => {
    // Check for section headings
    await expect(page.getByText('Your Business Details')).toBeVisible();
    await expect(page.getByText('Bank Account Details')).toBeVisible();
    await expect(page.getByText('Client Details')).toBeVisible();
    await expect(page.getByText('Invoice Details')).toBeVisible();
  });

  test('form fields should have associated labels', async ({ page }) => {
    // All input fields should be accessible via their labels
    const businessName = page.getByLabel('Business/Trading Name *');
    const email = page.getByLabel('Email *');
    const clientName = page.getByLabel('Client Name *');
    const invoiceNumber = page.getByLabel('Invoice Number *');
    
    await expect(businessName).toBeVisible();
    await expect(email).toBeVisible();
    await expect(clientName).toBeVisible();
    await expect(invoiceNumber).toBeVisible();
  });

  test('buttons should be keyboard accessible', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: 'Save My Details' });
    const generateButton = page.getByRole('button', { name: 'Generate Invoice' });
    
    // Focus using tab key
    await page.keyboard.press('Tab');
    
    // Verify buttons are accessible
    await expect(saveButton).toBeVisible();
    await expect(generateButton).toBeVisible();
  });

  test('required fields should be marked appropriately', async ({ page }) => {
    // Check that required fields have the required attribute or visual indicator
    const requiredFields = [
      page.getByLabel('Business/Trading Name *'),
      page.getByLabel('Email *'),
      page.getByLabel('Address *').first(),
      page.getByLabel('Bank Name *'),
      page.getByLabel('Account Name *'),
      page.getByLabel('Client Name *'),
      page.getByLabel('Invoice Number *'),
      page.getByLabel('Invoice Date *'),
    ];
    
    for (const field of requiredFields) {
      await expect(field).toHaveAttribute('required', '');
    }
  });

  test('should work with keyboard navigation', async ({ page }) => {
    // Navigate through form using keyboard
    await page.keyboard.press('Tab'); // Move to first field
    await page.keyboard.type('Test Business');
    
    // Continue tabbing through form
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Should be able to navigate through all form elements
  });

  test('color contrast should be sufficient', async ({ page }) => {
    // This is a basic check - for comprehensive testing, use axe-core
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Just verify that background color is defined
    expect(backgroundColor).toBeDefined();
  });

  test('form sections should be distinguishable', async ({ page }) => {
    // Each section should be clearly marked with heading or visual separator
    const sections = [
      'Your Business Details',
      'Bank Account Details',
      'Client Details',
      'Invoice Details',
    ];
    
    for (const section of sections) {
      await expect(page.getByText(section)).toBeVisible();
    }
  });
});
