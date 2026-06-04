/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type PaymentMethod = 'SSLCommerz' | 'bKash' | 'Bank Transfer' | 'Cash';
export type InvoiceStatus = 'PAID' | 'UNPAID' | 'PENDING';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderCountry: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientCountry: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: LineItem[];
  discount: number; // percentage
  tax: number; // percentage
  paymentMethod: PaymentMethod;
  transactionReference: string;
  status: InvoiceStatus;
  notes: string;
  updatedAt: number;
}
