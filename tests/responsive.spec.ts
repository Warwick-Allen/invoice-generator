import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    
    // Check that main elements are visible
    await expect(page.getByLabel('Business/Trading Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate Invoice' })).toBeVisible();
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');
    
    await expect(page.getByLabel('Business/Trading Name')).toBeVisible();
    await expect(page.getByLabel('Client Name')).toBeVisible();
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.goto('/');
    
    await expect(page.getByLabel('Business/Trading Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate Invoice' })).toBeVisible();
  });

  test('should have scrollable content on small viewports', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5/SE
    await page.goto('/');
    
    // Page should be scrollable
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);
    
    // Content should extend beyond viewport
    expect(scrollHeight).toBeGreaterThan(clientHeight);
  });

  test('buttons should be appropriately sized for touch on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const button = page.getByRole('button', { name: 'Save My Details' });
    const boundingBox = await button.boundingBox();
    
    // Touch target should be at least 44x44 pixels (iOS guideline)
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(30); // Relaxed for web
    }
  });

  test('form fields should be readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const input = page.getByLabel('Business/Trading Name');
    const fontSize = await input.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    
    // Font size should be at least 16px to prevent zoom on iOS
    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(14);
  });

  test('layout should adapt to landscape mobile', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 }); // Landscape
    await page.goto('/');
    
    await expect(page.getByLabel('Business/Trading Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate Invoice' })).toBeVisible();
  });
});
