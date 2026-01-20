/**
 * Test data helpers for invoice generator tests
 */

export const testBusinessDetails = {
  valid: {
    name: 'Test Business Ltd',
    gstNumber: '123-456-789',
    email: 'business@testcompany.co.nz',
    phone: '09 555 1234',
    address: '123 Business Street, Auckland 1010, New Zealand',
  },
  minimal: {
    name: 'Minimal Business',
    email: 'minimal@test.co.nz',
    address: 'Minimal Address',
  },
};

export const testBankDetails = {
  valid: {
    bankName: 'ANZ Bank New Zealand',
    accountName: 'Test Business Ltd',
    accountNumber: '01-2345-6789012-00',
  },
  alternative: {
    bankName: 'Westpac New Zealand',
    accountName: 'Alternative Business',
    accountNumber: '03-1234-5678901-000',
  },
};

export const testClientDetails = {
  client1: {
    name: 'Client One Ltd',
    email: 'client1@example.co.nz',
    phone: '09 555 9876',
    address: '456 Client Road, Wellington 6011, New Zealand',
  },
  client2: {
    name: 'Client Two Ltd',
    email: 'client2@example.co.nz',
    phone: '04 444 5555',
    address: '789 Business Park, Christchurch 8011, New Zealand',
  },
  client3: {
    name: 'Client Three Ltd',
    email: 'client3@example.co.nz',
    phone: '03 333 2222',
    address: '321 Commerce Street, Dunedin 9016, New Zealand',
  },
  minimal: {
    name: 'Minimal Client',
    address: 'Minimal Address',
  },
};

export const testInvoiceDetails = {
  current: {
    invoiceNumber: `INV-${new Date().getFullYear()}-001`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  custom: {
    invoiceNumber: 'CUSTOM-2026-999',
    invoiceDate: '2026-01-20',
    dueDate: '2026-02-20',
  },
};

export const testInvoiceItems = {
  item1: {
    description: 'Consulting Services',
    quantity: 10,
    rate: 150.00,
    amount: 1500.00,
  },
  item2: {
    description: 'Development Work',
    quantity: 20,
    rate: 175.00,
    amount: 3500.00,
  },
  item3: {
    description: 'Project Management',
    quantity: 5,
    rate: 200.00,
    amount: 1000.00,
  },
};

/**
 * Calculate GST amount (15% in NZ)
 */
export function calculateGST(subtotal: number): number {
  return parseFloat((subtotal * 0.15).toFixed(2));
}

/**
 * Calculate total including GST
 */
export function calculateTotal(subtotal: number): number {
  return parseFloat((subtotal * 1.15).toFixed(2));
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Generate random invoice number
 */
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${year}-${random}`;
}

/**
 * Generate random GST number (NZ format)
 */
export function generateGSTNumber(): string {
  const part1 = Math.floor(Math.random() * 900) + 100;
  const part2 = Math.floor(Math.random() * 900) + 100;
  const part3 = Math.floor(Math.random() * 900) + 100;
  return `${part1}-${part2}-${part3}`;
}

/**
 * Generate random NZ bank account number
 */
export function generateBankAccountNumber(): string {
  const bank = String(Math.floor(Math.random() * 31) + 1).padStart(2, '0');
  const branch = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  const account = String(Math.floor(Math.random() * 9999999) + 1).padStart(7, '0');
  const suffix = String(Math.floor(Math.random() * 999) + 1).padStart(2, '0');
  return `${bank}-${branch}-${account}-${suffix}`;
}
