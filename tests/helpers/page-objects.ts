/**
 * Page Object Models for Invoice Generator
 */

import { Page, Locator } from '@playwright/test';

export class InvoiceGeneratorPage {
  readonly page: Page;

  // Business Details
  readonly businessName: Locator;
  readonly gstNumber: Locator;
  readonly businessEmail: Locator;
  readonly businessPhone: Locator;
  readonly businessAddress: Locator;

  // Bank Details
  readonly bankName: Locator;
  readonly accountName: Locator;
  readonly accountNumber: Locator;

  // Buttons
  readonly saveDetailsButton: Locator;
  readonly clearBusinessButton: Locator;

  // Client Details
  readonly clientSelector: Locator;
  readonly clientName: Locator;
  readonly clientEmail: Locator;
  readonly clientPhone: Locator;
  readonly clientAddress: Locator;
  readonly saveClientButton: Locator;
  readonly clearClientButton: Locator;
  readonly deleteClientButton: Locator;

  // Invoice Details
  readonly invoiceNumber: Locator;
  readonly invoiceDate: Locator;
  readonly dueDate: Locator;
  readonly periodStart: Locator;
  readonly periodEnd: Locator;

  // Invoice Items
  readonly addItemButton: Locator;

  // Totals
  readonly subtotalText: Locator;
  readonly gstText: Locator;
  readonly totalText: Locator;

  // Actions
  readonly generateInvoiceButton: Locator;
  readonly printInvoiceButton: Locator;
  readonly resetFormButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Business Details
    this.businessName = page.getByLabel('Business/Trading Name *');
    this.gstNumber = page.getByLabel('GST Number (optional)');
    this.businessEmail = page.getByLabel('Email *');
    this.businessPhone = page.locator('#traderPhone');
    this.businessAddress = page.getByLabel('Address *').first();

    // Bank Details
    this.bankName = page.getByLabel('Bank Name *');
    this.accountName = page.getByLabel('Account Name *');
    this.accountNumber = page.getByLabel('Account Number *');

    // Buttons
    this.saveDetailsButton = page.getByRole('button', { name: 'Save My Details' });
    this.clearBusinessButton = page.getByRole('button', { name: 'Clear' }).first();

    // Client Details
    this.clientSelector = page.locator('select').first();
    this.clientName = page.getByLabel('Client Name *');
    this.clientEmail = page.locator('#clientEmail');
    this.clientPhone = page.locator('#clientPhone');
    this.clientAddress = page.getByLabel('Address *').nth(1);
    this.saveClientButton = page.getByRole('button', { name: 'Save Client' });
    this.clearClientButton = page.getByRole('button', { name: 'Clear' }).nth(1);
    this.deleteClientButton = page.getByRole('button', { name: 'Delete Selected Client' });

    // Invoice Details
    this.invoiceNumber = page.getByLabel('Invoice Number *');
    this.invoiceDate = page.getByLabel('Invoice Date *');
    this.dueDate = page.getByLabel('Due Date');
    this.periodStart = page.getByLabel('Invoice Period Start (optional)');
    this.periodEnd = page.getByLabel('Invoice Period End (optional)');

    // Invoice Items
    this.addItemButton = page.getByRole('button', { name: /Add Item/i });

    // Totals
    this.subtotalText = page.getByText(/Subtotal.*\$/i);
    this.gstText = page.getByText(/GST.*\$/i);
    this.totalText = page.getByText(/Total.*\$/i);

    // Actions
    this.generateInvoiceButton = page.getByRole('button', { name: 'Generate Invoice' });
    this.printInvoiceButton = page.getByRole('button', { name: 'Print Invoice' });
    this.resetFormButton = page.getByRole('button', { name: 'Reset Form' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillBusinessDetails(details: {
    name: string;
    gstNumber?: string;
    email: string;
    phone?: string;
    address: string;
  }) {
    await this.businessName.fill(details.name);
    if (details.gstNumber) {
      await this.gstNumber.fill(details.gstNumber);
    }
    await this.businessEmail.fill(details.email);
    if (details.phone) {
      await this.businessPhone.fill(details.phone);
    }
    await this.businessAddress.fill(details.address);
  }

  async fillBankDetails(details: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  }) {
    await this.bankName.fill(details.bankName);
    await this.accountName.fill(details.accountName);
    await this.accountNumber.fill(details.accountNumber);
  }

  async saveBusinessDetails() {
    await this.saveDetailsButton.click();
  }

  async fillClientDetails(details: {
    name: string;
    email?: string;
    phone?: string;
    address: string;
  }) {
    await this.clientName.fill(details.name);
    if (details.email) {
      await this.clientEmail.fill(details.email);
    }
    if (details.phone) {
      await this.clientPhone.fill(details.phone);
    }
    await this.clientAddress.fill(details.address);
  }

  async saveClient() {
    await this.saveClientButton.click();
  }

  async selectClient(clientName: string) {
    await this.clientSelector.selectOption({ label: clientName });
  }

  async deleteSelectedClient() {
    await this.deleteClientButton.click();
  }

  async fillInvoiceDetails(details: {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate?: string;
    periodStart?: string;
    periodEnd?: string;
  }) {
    await this.invoiceNumber.fill(details.invoiceNumber);
    await this.invoiceDate.fill(details.invoiceDate);
    if (details.dueDate) {
      await this.dueDate.fill(details.dueDate);
    }
    if (details.periodStart) {
      await this.periodStart.fill(details.periodStart);
    }
    if (details.periodEnd) {
      await this.periodEnd.fill(details.periodEnd);
    }
  }

  async addInvoiceItem() {
    await this.addItemButton.click();
  }

  async fillGenericItem(index: number, details: {
    description: string;
    quantity: number;
    unitPrice: number;
  }) {
    const items = this.page.locator('.invoice-item');
    const item = items.nth(index);
    
    await item.locator('.item-type').selectOption('generic');
    await this.page.waitForTimeout(100);
    
    await item.locator('.item-description').fill(details.description);
    await item.locator('.item-quantity').fill(details.quantity.toString());
    await item.locator('.item-quantity').blur();
    await item.locator('.item-rate').fill(details.unitPrice.toString());
    await item.locator('.item-rate').blur();
    
    // Give time for calculations
    await this.page.waitForTimeout(100);
  }

  async fillHourlyItem(index: number, details: {
    date: string;
    description: string;
    hours: number;
    rate: number;
  }) {
    const items = this.page.locator('.invoice-item');
    const item = items.nth(index);
    
    await item.locator('.item-type').selectOption('hourly');
    await this.page.waitForTimeout(100);
    
    await item.locator('.item-date').fill(details.date);
    await item.locator('.item-description').fill(details.description);
    await item.locator('.item-hours').fill(details.hours.toString());
    await item.locator('.item-hours').blur();
    await item.locator('.item-rate').fill(details.rate.toString());
    await item.locator('.item-rate').blur();
    
    // Give time for calculations
    await this.page.waitForTimeout(100);
  }

  async getItemType(index: number): Promise<string> {
    const items = this.page.locator('.invoice-item');
    const item = items.nth(index);
    return await item.locator('.item-type').inputValue();
  }

  async generateInvoice() {
    await this.generateInvoiceButton.click();
  }

  async printInvoice() {
    await this.printInvoiceButton.click();
  }

  async resetForm() {
    await this.resetFormButton.click();
  }

  async getSubtotal(): Promise<string> {
    return await this.subtotalText.textContent() || '';
  }

  async getGST(): Promise<string> {
    return await this.gstText.textContent() || '';
  }

  async getTotal(): Promise<string> {
    return await this.totalText.textContent() || '';
  }

  /**
   * Extract currency amount from text like "Subtotal: $100.00"
   */
  extractAmount(text: string): number {
    const match = text.match(/\$(\d+\.\d{2})/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getSubtotalAmount(): Promise<number> {
    const text = await this.getSubtotal();
    return this.extractAmount(text);
  }

  async getGSTAmount(): Promise<number> {
    const text = await this.getGST();
    return this.extractAmount(text);
  }

  async getTotalAmount(): Promise<number> {
    const text = await this.getTotal();
    return this.extractAmount(text);
  }
}
