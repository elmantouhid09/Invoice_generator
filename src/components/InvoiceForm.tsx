/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Invoice, LineItem, PaymentMethod, InvoiceStatus } from '../types';
import { Plus, Trash2, Calendar, FileText, User, MapPin, DollarSign, Sparkles } from 'lucide-react';

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (updatedInvoice: Partial<Invoice>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updatedFields: Partial<LineItem>) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}) => {
  // Handles generic text input or textarea changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  // Handles number field changes (discount, tax)
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    onChange({ [name]: Math.max(0, numValue) });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-8 font-sans">
      {/* Sender & Invoice Meta Profile Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2ecc71]" />
            Sender Info (Pre-filled)
          </label>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs space-y-1 text-slate-600">
            <p className="font-semibold text-slate-800">Abstract Digital</p>
            <p>Chattogram, Bangladesh</p>
            <p>Email: billing@abstractdigital.com</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Invoice Number
            </label>
            <input
              type="text"
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={handleInputChange}
              className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-[#2ecc71] transition-all text-slate-700"
              placeholder="e.g. AD-1001"
            />
          </div>
        </div>
      </div>

      {/* Client Profile Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-l-2 border-[#2ecc71] pl-2 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          Client Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company / Client Name</label>
            <input
              type="text"
              name="clientName"
              value={invoice.clientName}
              onChange={handleInputChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all"
              placeholder="e.g. BestwebhostBD.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400"/> Address</label>
            <input
              type="text"
              name="clientAddress"
              value={invoice.clientAddress}
              onChange={handleInputChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all"
              placeholder="e.g. House 45, Road 5, Nasirabad R/A"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
            <input
              type="text"
              name="clientCity"
              value={invoice.clientCity}
              onChange={handleInputChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all"
              placeholder="e.g. Chattogram"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country</label>
            <input
              type="text"
              name="clientCountry"
              value={invoice.clientCountry}
              onChange={handleInputChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all"
              placeholder="e.g. Bangladesh"
            />
          </div>
        </div>
      </div>

      {/* Invoice Dates selection */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-l-2 border-[#2ecc71] pl-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Timeline Dates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Invoice Date</label>
            <input
              type="date"
              name="invoiceDate"
              value={invoice.invoiceDate}
              onChange={handleInputChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={invoice.dueDate}
              onChange={handleInputChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all font-mono"
            />
          </div>
        </div>
      </div>

      {/* Line Items Editor Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-l-2 border-[#2ecc71] pl-2 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Line Items
          </h3>
          <button
            type="button"
            onClick={onAddItem}
            className="text-xs flex items-center gap-1 text-white bg-[#2ecc71] hover:bg-[#27ae60] px-3 py-1.5 rounded-lg transition-all font-medium active:scale-95 shadow-sm shadow-[#2ecc71]/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {invoice.lineItems.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-400 font-medium">No services or items added yet.</p>
              <button
                type="button"
                onClick={onAddItem}
                className="text-xs text-[#2ecc71] font-bold mt-2 hover:underline cursor-pointer"
              >
                Create your first line item
              </button>
            </div>
          ) : (
            invoice.lineItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-stretch gap-3 bg-slate-50/60 border border-slate-150 p-3 rounded-lg hover:border-slate-300 transition-all relative group"
              >
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Item #{idx + 1} Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all"
                    placeholder="e.g. Website Hosting, UI Redesign, VPS Deployment"
                  />
                </div>

                <div className="w-full md:w-20">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => onUpdateItem(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 0) })}
                    className="w-full text-xs border border-slate-200 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all text-center font-mono"
                  />
                </div>

                <div className="w-full md:w-32">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    Unit Price (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.unitPrice === 0 ? '' : item.unitPrice}
                    onChange={(e) => onUpdateItem(item.id, { unitPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full text-xs border border-slate-200 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all text-right font-mono"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-end justify-end md:pb-1">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-all self-end cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Adjustments (Discount, Tax) & Payment Details Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-l-2 border-[#2ecc71] pl-2">
          Adjustments & Transaction Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Discount (%)</label>
            <input
              type="number"
              name="discount"
              min="0"
              max="100"
              step="any"
              value={invoice.discount === 0 ? '' : invoice.discount}
              onChange={handleNumberChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all font-mono"
              placeholder="0%"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">VAT / Tax (%)</label>
            <input
              type="number"
              name="tax"
              min="0"
              max="100"
              step="any"
              value={invoice.tax === 0 ? '' : invoice.tax}
              onChange={handleNumberChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all font-mono"
              placeholder="0%"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={invoice.paymentMethod}
              onChange={handleInputChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all cursor-pointer"
            >
              <option value="SSLCommerz">SSLCommerz</option>
              <option value="bKash">bKash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Transaction Ref / ID</label>
            <input
              type="text"
              name="transactionReference"
              value={invoice.transactionReference}
              onChange={handleInputChange}
              className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all font-mono text-slate-700"
              placeholder="e.g. TR-BK58197X"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status Stamp</label>
            <div className="flex gap-2">
              {(['PAID', 'UNPAID', 'PENDING'] as InvoiceStatus[]).map((status) => {
                const isSelected = invoice.status === status;
                const statusStyles = {
                  PAID: isSelected ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100',
                  UNPAID: isSelected ? 'bg-red-500 border-red-500 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100',
                  PENDING: isSelected ? 'bg-amber-500 border-amber-500 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100',
                };
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onChange({ status })}
                    className={`flex-1 text-center py-2 px-2.5 rounded-lg font-bold text-[10px] border transition-all cursor-pointer ${statusStyles[status]}`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Notes Section */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          Terms, Notes, & Remarks
        </label>
        <textarea
          name="notes"
          value={invoice.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent transition-all leading-relaxed"
          placeholder="e.g. Please clear this invoice within 14 days. Domain renewals must be paid in full prior to active term update."
        />
      </div>
    </div>
  );
};
