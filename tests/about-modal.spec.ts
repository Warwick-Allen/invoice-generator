import { test, expect } from '@playwright/test';

test.describe('About Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display About button in header', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    await expect(aboutButton).toBeVisible();
  });

  test('should open modal when About button is clicked', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    const modal = page.locator('#aboutModal');

    // Modal should not be visible initially
    await expect(modal).not.toHaveClass(/active/);

    // Click About button
    await aboutButton.click();

    // Modal should now be visible
    await expect(modal).toHaveClass(/active/);
  });

  test('should display modal content correctly', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    await aboutButton.click();

    // Check for modal title
    await expect(page.getByRole('heading', { name: 'About NZ Tax Invoice Generator' })).toBeVisible();

    // Check for main sections
    await expect(page.getByRole('heading', { name: 'What is this app?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Key Features' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'How to Use' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Data Storage' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bank Account Verification' })).toBeVisible();
  });

  test('should display key features list', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    await aboutButton.click();

    // Check for specific feature mentions
    await expect(page.getByText('Save Your Details:', { exact: false })).toBeVisible();
    await expect(page.getByText('Client Management:', { exact: false })).toBeVisible();
    await expect(page.getByText('Flexible Invoicing:', { exact: false })).toBeVisible();
    await expect(page.getByText('GST Options:', { exact: false })).toBeVisible();
    await expect(page.getByText('Professional Output:', { exact: false })).toBeVisible();
    await expect(page.getByText('Local Storage:', { exact: false })).toBeVisible();
  });

  test('should display usage instructions', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    await aboutButton.click();

    // Check for instruction sections
    await expect(page.getByText('First Time Setup:', { exact: false })).toBeVisible();
    await expect(page.getByText('Creating an Invoice:', { exact: false })).toBeVisible();
    
    // Check for specific steps
    await expect(page.getByText('Fill in your business details', { exact: false })).toBeVisible();
    await expect(page.getByText('Click "Generate Invoice" to preview', { exact: false })).toBeVisible();
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    const modal = page.locator('#aboutModal');
    
    // Open modal
    await aboutButton.click();
    await expect(modal).toHaveClass(/active/);

    // Click close button
    const closeButton = page.getByRole('button', { name: 'Close' });
    await closeButton.click();

    // Modal should be closed
    await expect(modal).not.toHaveClass(/active/);
  });

  test('should close modal when clicking outside (backdrop)', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    const modal = page.locator('#aboutModal');
    
    // Open modal
    await aboutButton.click();
    await expect(modal).toHaveClass(/active/);

    // Click on backdrop (not on modal content)
    await modal.click({ position: { x: 5, y: 5 } });

    // Modal should be closed
    await expect(modal).not.toHaveClass(/active/);
  });

  test('should close modal when Escape key is pressed', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    const modal = page.locator('#aboutModal');
    
    // Open modal
    await aboutButton.click();
    await expect(modal).toHaveClass(/active/);

    // Press Escape key
    await page.keyboard.press('Escape');

    // Modal should be closed
    await expect(modal).not.toHaveClass(/active/);
  });

  test('should not close modal when clicking inside modal content', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    const modal = page.locator('#aboutModal');
    const modalContent = page.locator('.modal-content');
    
    // Open modal
    await aboutButton.click();
    await expect(modal).toHaveClass(/active/);

    // Click inside modal content
    await modalContent.click();

    // Modal should still be open
    await expect(modal).toHaveClass(/active/);
  });

  test('should prevent body scroll when modal is open', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    
    // Open modal
    await aboutButton.click();

    // Check that body overflow is hidden
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('hidden');
  });

  test('should restore body scroll when modal is closed', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    const closeButton = page.getByRole('button', { name: 'Close' });
    
    // Open modal
    await aboutButton.click();
    
    // Close modal
    await closeButton.click();

    // Check that body overflow is restored
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('should display data storage information', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    await aboutButton.click();

    // Check for data storage details
    await expect(page.getByText('stores all your information locally', { exact: false })).toBeVisible();
    await expect(page.getByText('Your data never leaves your computer', { exact: false })).toBeVisible();
    await expect(page.getByText('clear your browser cookies', { exact: false })).toBeVisible();
  });

  test('should display bank verification warning', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    await aboutButton.click();

    // Check for bank verification information within the modal
    const modalContent = page.locator('.modal-content');
    await expect(modalContent.getByText('New Zealand banks now verify', { exact: false })).toBeVisible();
  });

  test('should have proper modal accessibility', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    await aboutButton.click();

    // Check for proper headings hierarchy
    const modalHeading = page.getByRole('heading', { name: 'About NZ Tax Invoice Generator', level: 2 });
    await expect(modalHeading).toBeVisible();

    // Close button should have aria-label
    const closeButton = page.getByRole('button', { name: 'Close' });
    await expect(closeButton).toHaveAttribute('aria-label', 'Close');
  });

  test('should reopen modal after closing', async ({ page }) => {
    const aboutButton = page.getByRole('button', { name: 'About' });
    const modal = page.locator('#aboutModal');
    const closeButton = page.getByRole('button', { name: 'Close' });
    
    // Open and close modal
    await aboutButton.click();
    await expect(modal).toHaveClass(/active/);
    await closeButton.click();
    await expect(modal).not.toHaveClass(/active/);

    // Reopen modal
    await aboutButton.click();
    await expect(modal).toHaveClass(/active/);
    
    // Verify content is still there
    await expect(page.getByRole('heading', { name: 'About NZ Tax Invoice Generator' })).toBeVisible();
  });
});
