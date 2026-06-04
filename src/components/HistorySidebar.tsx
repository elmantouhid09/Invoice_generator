/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Invoice } from '../types';
import { Search, Trash2, Calendar, FileClock, ChevronRight, Ban } from 'lucide-react';

interface HistorySidebarProps {
  invoices: Invoice[];
  activeInvoiceId: string;
  onSelectInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  invoices,
  activeInvoiceId,
  onSelectInvoice,
  onDeleteInvoice,
}) => {
  const [search, setSearch] = useState('');

  // Helper calculation for grand total
  const getGrandTotal = (inv: Invoice) => {
    const subtotal = inv.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const discountAmount = subtotal * (inv.discount / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (inv.tax / 100);
    return taxableAmount + taxAmount;
  };

  // Filter history list based on input search term
  const filteredInvoices = invoices.filter((inv) => {
    const term = search.toLowerCase();
    const invNo = inv.invoiceNumber.toLowerCase();
    const name = inv.clientName.toLowerCase();
    return invNo.includes(term) || name.includes(term);
  });

  const handleDeleteClick = (e: React.MouseEvent, inv: Invoice) => {
    e.stopPropagation(); // Avoid selecting the clicked invoice
    const confirmDelete = window.confirm(`Are you sure you want to delete invoice ${inv.invoiceNumber} permanently?`);
    if (confirmDelete) {
      onDeleteInvoice(inv.id);
    }
  };

  // Format currency
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 1,
    }).format(amount).replace('BDT', '৳');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md p-5 flex flex-col h-full font-sans">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <FileClock className="w-5 h-5 text-[#2ecc71]" />
        <div>
          <h2 className="text-sm font-bold text-slate-800">Saved History</h2>
          <p className="text-[10px] text-slate-400">Manage permanent invoices</p>
        </div>
        <span className="ml-auto bg-slate-100 text-slate-600 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
          {invoices.length}
        </span>
      </div>

      {/* Search Input Bar */}
      <div className="relative mt-4 mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Invoice# or Client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all"
        />
      </div>

      {/* Invoices List Panel */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[500px] lg:max-h-none">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-10 text-slate-450 italic flex flex-col items-center justify-center gap-1.5">
            <Ban className="w-6 h-6 text-slate-300" />
            <p className="text-xs text-slate-400 font-medium">No saved invoices found</p>
          </div>
        ) : (
          filteredInvoices.map((inv) => {
            const isActive = inv.id === activeInvoiceId;
            const grandTotal = getGrandTotal(inv);

            // Status Badge coloring
            const badgeClasses = {
              PAID: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
              UNPAID: 'bg-red-50 text-red-600 border border-red-100',
              PENDING: 'bg-amber-50 text-amber-600 border border-amber-100',
            }[inv.status];

            return (
              <div
                key={inv.id}
                onClick={() => onSelectInvoice(inv)}
                className={`group flex items-center justify-between p-3.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-50 border-[#2ecc71] shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1 pr-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 break-keep">
                      {inv.invoiceNumber}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none uppercase ${badgeClasses}`}>
                      {inv.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-600 truncate">
                    {inv.clientName || 'Valued Client'}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {inv.invoiceDate || 'No date'}
                    </span>
                    <span className="font-bold text-[#2ecc71]">
                      {formatBDT(grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDeleteClick(e, inv)}
                    className="p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
