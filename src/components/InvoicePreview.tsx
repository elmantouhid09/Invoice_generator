/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Invoice } from '../types';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  // Helpers for calculations
  const calculateSubtotal = () => {
    return invoice.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = subtotal * (invoice.discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (invoice.tax / 100);
  const finalTotal = taxableAmount + taxAmount;

  // Ledger variables
  const isPaid = invoice.status === 'PAID';
  const isPending = invoice.status === 'PENDING';
  const isUnpaid = invoice.status === 'UNPAID';

  const amountPaid = isPaid ? finalTotal : 0;
  const balanceAmount = isPaid ? 0 : finalTotal;

  // Format currency to BDT
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount).replace('BDT', '৳');
  };

  return (
    <div 
      id="invoice-print-area" 
      className="invoice-preview-card print-only-container bg-white text-slate-800 p-8 md:p-12 shadow-md border border-slate-200 rounded-lg relative overflow-hidden font-sans w-full max-w-[800px] mx-auto min-h-[1050px] flex flex-col justify-between"
    >
      {/* Visual Stamps */}
      <div className="absolute right-12 top-28 select-none z-10">
        {isPaid && (
          <div className="border-4 border-dashed border-[#2ecc71] text-[#2ecc71] font-bold text-xl md:text-2xl px-6 py-2 rounded uppercase tracking-wider transform -rotate-12 bg-white/90 shadow-sm">
            PAID
          </div>
        )}
        {isUnpaid && (
          <div className="border-4 border-dashed border-red-500 text-red-500 font-bold text-xl md:text-2xl px-6 py-2 rounded uppercase tracking-wider transform -rotate-12 bg-white/90 shadow-sm">
            UNPAID
          </div>
        )}
        {isPending && (
          <div className="border-4 border-dashed border-amber-500 text-amber-500 font-bold text-xl md:text-2xl px-6 py-2 rounded uppercase tracking-wider transform -rotate-12 bg-white/90 shadow-sm">
            PENDING
          </div>
        )}
      </div>

      <div>
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-[#2ecc71] flex items-center justify-center font-bold text-white text-xl tracking-tight shadow-md shadow-[#2ecc71]/20">
                AD
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Abstract Digital</h1>
                <p className="text-xs text-[#2ecc71] font-semibold mt-1">Design & Tech Agency</p>
              </div>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">{invoice.senderName || 'Abstract Digital'}</p>
              <p>{invoice.senderAddress || 'Chattogram, Bangladesh'}</p>
              <p>Chattogram, Bangladesh</p>
              <p>Email: billing@abstractdigital.com</p>
            </div>
          </div>

          <div className="text-right self-stretch sm:self-auto flex flex-col justify-start items-end gap-3">
            <div>
              <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">INVOICE</h2>
              <p className="text-sm font-mono font-bold text-[#2ecc71] mt-1">{invoice.invoiceNumber || 'AD-1001'}</p>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5 w-full sm:w-48">
              <div className="flex justify-between items-center gap-4">
                <span className="font-semibold text-slate-500">Invoice Date:</span>
                <span className="font-mono font-medium text-slate-800">{invoice.invoiceDate || '-'}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="font-semibold text-slate-500">Due Date:</span>
                <span className="font-mono font-medium text-slate-800">{invoice.dueDate || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To & Quick Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Invoice To:</h3>
            <div className="space-y-1">
              <p className="font-bold text-sm text-slate-800">{invoice.clientName || 'Valued Client'}</p>
              {invoice.clientAddress && <p className="text-xs text-slate-600">{invoice.clientAddress}</p>}
              {(invoice.clientCity || invoice.clientCountry) && (
                <p className="text-xs text-slate-500 font-medium">
                  {[invoice.clientCity, invoice.clientCountry].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>
          <div className="md:text-right">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Payment Info</h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p><span className="font-medium text-slate-500">Method:</span> <span className="font-semibold text-slate-800">{invoice.paymentMethod}</span></p>
              {invoice.transactionReference ? (
                <p><span className="font-medium text-slate-500">Trx ID / Ref:</span> <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{invoice.transactionReference}</span></p>
              ) : (
                <p className="text-slate-400 font-light italic">No reference specified</p>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium uppercase text-[10px] tracking-wider">
                <th className="py-3 px-2 text-left w-8">#</th>
                <th className="py-3 px-2 text-left">Description</th>
                <th className="py-3 px-2 text-right w-16">Qty</th>
                <th className="py-3 px-2 text-right w-24">Unit Price</th>
                <th className="py-3 px-2 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.lineItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    No line items added yet.
                  </td>
                </tr>
              ) : (
                invoice.lineItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-2 text-slate-800 font-medium break-words leading-relaxed max-w-[280px]">
                      {item.description || <span className="text-slate-300 italic">Untitled item</span>}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">{item.quantity}</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">{formatBDT(item.unitPrice)}</td>
                    <td className="py-3 px-2 text-right font-mono font-semibold text-slate-900">
                      {formatBDT(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Subtotals & Calculations block */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8 mb-8">
          <div className="sm:max-w-[50%]">
            {invoice.notes && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Terms & Remarks:</h4>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/70 p-3 rounded border border-slate-100 font-sans italic">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto sm:min-w-[250px] space-y-1.5 self-end">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal:</span>
              <span className="font-mono font-medium text-slate-800">{formatBDT(subtotal)}</span>
            </div>

            {invoice.discount > 0 && (
              <div className="flex justify-between text-xs text-[#2ecc71]">
                <span>Discount ({invoice.discount}%):</span>
                <span className="font-mono font-medium">-{formatBDT(discountAmount)}</span>
              </div>
            )}

            {invoice.tax > 0 && (
              <div className="flex justify-between text-xs text-slate-500">
                <span>Vat / Tax ({invoice.tax}%):</span>
                <span className="font-mono font-medium text-slate-800">+{formatBDT(taxAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider">Total Amount:</span>
              <span className="font-mono text-base font-bold text-[#2ecc71]">{formatBDT(finalTotal)} BDT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Ledger Section (Bottom) */}
      <div className="mt-auto pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Transaction Ledger</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Payment Type</th>
                <th className="py-2 px-3 text-left">Reference</th>
                <th className="py-2 px-3 text-right">Amount Received</th>
                <th className="py-2 px-3 text-right">Balance Due</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 px-3 font-mono text-slate-600">{invoice.invoiceDate || '-'}</td>
                <td className="py-2.5 px-3 text-slate-700 font-medium">{invoice.paymentMethod}</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">
                  {invoice.transactionReference || <span className="text-slate-300 italic">None</span>}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-emerald-600">
                  {formatBDT(amountPaid)}
                </td>
                <td className={ `py-2.5 px-3 text-right font-mono font-semibold ${balanceAmount > 0 ? 'text-red-500' : 'text-slate-500'}` }>
                  {formatBDT(balanceAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-6 text-[10px] text-slate-400">
          <p>Thank you for doing business with Abstract Digital.</p>
          <p className="font-mono">Secure Payments via {invoice.paymentMethod}</p>
        </div>
      </div>
    </div>
  );
};
