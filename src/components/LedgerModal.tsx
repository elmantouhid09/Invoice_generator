/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Invoice } from '../types';
import { X, ClipboardList, TrendingUp, CheckCircle, Clock, AlertCircle, Users, Download, Trash2 } from 'lucide-react';

interface LedgerModalProps {
  invoices: Invoice[];
  onClose: () => void;
  onClearLedger: () => void;
  onExportExcel: () => void;
}

export const LedgerModal: React.FC<LedgerModalProps> = ({
  invoices,
  onClose,
  onClearLedger,
  onExportExcel,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAID' | 'UNPAID' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Helpers to calculate grand total for an individual invoice
  const getGrandTotal = (inv: Invoice) => {
    const subtotal = inv.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const discountAmount = subtotal * (inv.discount / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (inv.tax / 100);
    return taxableAmount + taxAmount;
  };

  // Summary Metrics calculations
  const totalInvoicesCount = invoices.length;
  
  const totalBilled = invoices.reduce((acc, inv) => acc + getGrandTotal(inv), 0);
  
  const totalPaid = invoices.reduce((acc, inv) => {
    return inv.status === 'PAID' ? acc + getGrandTotal(inv) : acc;
  }, 0);

  const totalUnpaid = invoices.reduce((acc, inv) => {
    return inv.status !== 'PAID' ? acc + getGrandTotal(inv) : acc;
  }, 0);

  // Unique clients count
  const uniqueClients = Array.from(new Set(invoices.map((inv) => inv.clientName.trim().toLowerCase()))).filter(Boolean);

  // Filtered array
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    const matchesQuery =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount).replace('BDT', '৳');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-fade-in no-print">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
        
        {/* Header bar */}
        <div className="flex justify-between items-center bg-[#2ecc71] px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            <div>
              <h2 className="font-bold text-lg leading-tight">Master Trans Ledger</h2>
              <p className="text-xs text-emerald-100 font-medium">Global statistics & database manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-emerald-600 rounded-lg text-emerald-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Statistics Bar (Bento style) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Invoices</p>
                <p className="text-lg font-black text-slate-800">{totalInvoicesCount}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2.5 bg-[#2ecc71]/10 text-[#2ecc71] rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Billed</p>
                <p className="text-lg font-black text-slate-800">{formatBDT(totalBilled)}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Received</p>
                <p className="text-lg font-black text-slate-800">{formatBDT(totalPaid)}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Outstanding</p>
                <p className="text-lg font-black text-slate-800">{formatBDT(totalUnpaid)}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 col-span-2 md:col-span-1 flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Clients Count</p>
                <p className="text-lg font-black text-slate-800">{uniqueClients.length}</p>
              </div>
            </div>
          </div>

          {/* Controls Bar: Filters & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-xl">
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'PAID', 'UNPAID', 'PENDING'] as const).map((status) => {
                const isActive = filterStatus === status;
                const activeColorMap = {
                  ALL: 'bg-slate-800 text-white',
                  PAID: 'bg-emerald-500 text-white',
                  UNPAID: 'bg-red-500 text-white',
                  PENDING: 'bg-amber-500 text-white',
                };
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive ? activeColorMap[status] : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Filter by invoice# or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-white border border-slate-250 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] max-w-xs transition-all w-full"
              />
              <button
                onClick={onExportExcel}
                className="bg-emerald-600 hover:bg-[#27ae60] text-white flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer min-w-max transition-all"
                title="Export workbook with 3 analytical sheets"
              >
                <Download className="w-3.5 h-3.5" />
                Sheet Export
              </button>
            </div>
          </div>

          {/* Ledger Table listing */}
          <div className="border border-slate-150 rounded-xl overflow-hidden bg-white shadow-xs max-h-[350px] overflow-y-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 border-b border-slate-200 uppercase text-[10px] tracking-wider z-10">
                <tr>
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Billed Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                      No invoices currently match the query filters.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const statusColors = {
                      PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                      UNPAID: 'bg-red-100 text-red-800 border-red-200',
                      PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
                    }[inv.status];

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{inv.invoiceDate}</td>
                        <td className="py-3 px-4 text-slate-700 font-semibold">{inv.clientName}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatBDT(getGrandTotal(inv))}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${statusColors}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{inv.paymentMethod}</td>
                        <td className="py-3 px-4 font-mono text-slate-500 bg-slate-50/40">
                          {inv.transactionReference || <span className="text-slate-350 italic">None</span>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer controls bar */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={onClearLedger}
            disabled={invoices.length === 0}
            className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 bg-white font-bold flex items-center gap-1.5 px-4 py-2.5 rounded-lg transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-rose-500 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Ledger database
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 text-xs font-bold rounded-lg transition-all text-center cursor-pointer"
          >
            Close Ledger Panel
          </button>
        </div>

      </div>
    </div>
  );
};
