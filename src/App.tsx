/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Invoice, LineItem, PaymentMethod, InvoiceStatus } from './types';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { HistorySidebar } from './components/HistorySidebar';
import { LedgerModal } from './components/LedgerModal';
import { getStandaloneHTML } from './standaloneTemplate';
import { 
  FileText, 
  Save, 
  Printer, 
  Eye, 
  Trash2, 
  Sparkles, 
  Undo, 
  BookOpen,
  FolderOpen,
  Download
} from 'lucide-react';

// Generates correct safe IDs 
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getTodayFormatted = () => {
  return new Date().toISOString().split('T')[0];
};

const getFutureDateFormatted = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export default function App() {
  // State definitions
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({
    id: uuidv4(),
    invoiceNumber: 'AD-1001',
    senderName: 'Abstract Digital',
    senderAddress: 'Chattogram, Bangladesh',
    senderCity: 'Chattogram',
    senderCountry: 'Bangladesh',
    clientName: '',
    clientAddress: '',
    clientCity: '',
    clientCountry: '',
    invoiceDate: getTodayFormatted(),
    dueDate: getFutureDateFormatted(14),
    lineItems: [],
    discount: 0,
    tax: 0,
    paymentMethod: 'SSLCommerz',
    transactionReference: '',
    status: 'UNPAID',
    notes: 'Please clear this invoice. Domain and server renewals must be paid in full prior to active terms.',
    updatedAt: Date.now(),
  });
  
  const [activeInvoiceId, setActiveInvoiceId] = useState<string>('');
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [autoSavedTime, setAutoSavedTime] = useState<string>('');

  // Avoid running save triggers during loading
  const isLoaded = useRef(false);

  // Initialize and load saved invoices / draft on page mounted
  useEffect(() => {
    // 1. Load saved invoices database
    const stored = localStorage.getItem('abstract_digital_invoices');
    if (stored) {
      try {
        setInvoices(JSON.parse(stored));
      } catch (err) {
        console.error('Failed reading saved invoices:', err);
      }
    }

    // 2. Load next counter index
    const counter = localStorage.getItem('abstract_digital_invoice_counter');
    if (!counter) {
      localStorage.setItem('abstract_digital_invoice_counter', '1001');
    }

    // 3. Check for last auto-saved draft
    const draft = localStorage.getItem('abstract_digital_draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setCurrentInvoice(parsedDraft);
        setActiveInvoiceId(parsedDraft.id);
      } catch (e) {
        console.error('Failed loading auto-saved draft:', e);
      }
    } else {
      // Allocate fresh invoice with correct sequence counter
      const nextNum = counter || '1001';
      setCurrentInvoice((prev) => ({
        ...prev,
        invoiceNumber: `AD-${nextNum}`,
      }));
    }

    isLoaded.current = true;
  }, []);

  // Set up 2-second periodic background auto-saver trigger
  useEffect(() => {
    const timer = setInterval(() => {
      if (isLoaded.current && currentInvoice) {
        localStorage.setItem('abstract_digital_draft', JSON.stringify(currentInvoice));
        const now = new Date();
        setAutoSavedTime(now.toLocaleTimeString());
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [currentInvoice]);

  // Form Field change callback
  const handleFormChange = (fields: Partial<Invoice>) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      ...fields,
      updatedAt: Date.now(),
    }));
  };

  // Line Items callbacks
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    setCurrentInvoice((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
      updatedAt: Date.now(),
    }));
  };

  const handleRemoveItem = (id: string) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
      updatedAt: Date.now(),
    }));
  };

  const handleUpdateItem = (id: string, updatedFields: Partial<LineItem>) => {
    setCurrentInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => 
        item.id === id ? { ...item, ...updatedFields } : item
      ),
      updatedAt: Date.now(),
    }));
  };

  // Reset or clear form to create fresh blank state
  const handleNewInvoice = () => {
    const freshCounter = localStorage.getItem('abstract_digital_invoice_counter') || '1001';
    
    const freshInvoice: Invoice = {
      id: uuidv4(),
      invoiceNumber: `AD-${freshCounter}`,
      senderName: 'Abstract Digital',
      senderAddress: 'Chattogram, Bangladesh',
      senderCity: 'Chattogram',
      senderCountry: 'Bangladesh',
      clientName: '',
      clientAddress: '',
      clientCity: '',
      clientCountry: '',
      invoiceDate: getTodayFormatted(),
      dueDate: getFutureDateFormatted(14),
      lineItems: [],
      discount: 0,
      tax: 0,
      paymentMethod: 'SSLCommerz',
      transactionReference: '',
      status: 'UNPAID',
      notes: 'Please clear this invoice. Domain and server renewals must be paid in full prior to active terms.',
      updatedAt: Date.now(),
    };

    setCurrentInvoice(freshInvoice);
    setActiveInvoiceId('');
    localStorage.removeItem('abstract_digital_draft');
    setAutoSavedTime('');
  };

  // Save Invoice permanently to ledger & history
  const handleSaveInvoice = () => {
    if (!currentInvoice.clientName.trim()) {
      alert('Please fill out the Client/Company Name before saving.');
      return;
    }

    const updatedList = [...invoices];
    const index = updatedList.findIndex((inv) => inv.id === currentInvoice.id);

    if (index !== -1) {
      // Update existing record
      updatedList[index] = currentInvoice;
    } else {
      // Append brand-new record
      updatedList.unshift(currentInvoice);

      // Successfully saved a completely new invoice, let's bump the global auto-increment counter
      const currentNumber = currentInvoice.invoiceNumber.replace(/[^\d]/g, '');
      const parsedNum = parseInt(currentNumber);
      if (!isNaN(parsedNum)) {
        const nextNum = parsedNum + 1;
        localStorage.setItem('abstract_digital_invoice_counter', nextNum.toString());
      }
    }

    // Persist list locally
    localStorage.setItem('abstract_digital_invoices', JSON.stringify(updatedList));
    setInvoices(updatedList);
    setActiveInvoiceId(currentInvoice.id);
    alert(`Success: Invoice ${currentInvoice.invoiceNumber} saved permanently to database ledger!`);
  };

  // Click history list item to load or edit
  const handleSelectInvoice = (invoice: Invoice) => {
    setCurrentInvoice({ ...invoice });
    setActiveInvoiceId(invoice.id);
    localStorage.setItem('abstract_digital_draft', JSON.stringify(invoice));
    setAutoSavedTime('');
  };

  // Deleting past records from history sidebar
  const handleDeleteInvoice = (id: string) => {
    const updated = invoices.filter((inv) => inv.id !== id);
    localStorage.setItem('abstract_digital_invoices', JSON.stringify(updated));
    setInvoices(updated);

    // If deleted is current, clear core form
    if (currentInvoice.id === id) {
      handleNewInvoice();
    }
  };

  // Clear master database ledger list
  const handleClearLedger = () => {
    const doubleConfirm = window.confirm(
      'WARNING: This will permanently wipe all saved invoices from your database ledger and history! This is irreversible. Proceed?'
    );
    if (doubleConfirm) {
      localStorage.removeItem('abstract_digital_invoices');
      localStorage.setItem('abstract_digital_invoice_counter', '1001');
      setInvoices([]);
      handleNewInvoice();
      setIsLedgerOpen(false);
      alert('Complete database ledger wiped successfully.');
    }
  };

  // Print optimized CSS browser print trigger
  const handlePrint = () => {
    window.print();
  };

  // Triggers offline packaged single HTML app setup download
  const handleDownloadStandalone = () => {
    const htmlContent = getStandaloneHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Abstract_Digital_Invoice_Generator.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Multi-sheet SheetJS spreadsheet builder & downloader
  const handleExportExcel = () => {
    if (invoices.length === 0) {
      alert('Your ledger database has no records. Create and save an invoice first.');
      return;
    }

    const wb = XLSX.utils.book_new();

    // Helper to calculate grand totals for spreadsheet data
    const getInvTotal = (inv: Invoice) => {
      const subtotal = inv.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
      const discountAmount = subtotal * (inv.discount / 100);
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = taxableAmount * (inv.tax / 100);
      return taxableAmount + taxAmount;
    };

    // SHEET 1: Master Ledger entries list
    const ledgerSheetData = invoices.map((inv) => {
      const subtotal = inv.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
      const total = getInvTotal(inv);
      const itemsText = inv.lineItems
        .map((item) => `${item.description} (${item.quantity}x৳${item.unitPrice})`)
        .join(', ');

      return {
        'Invoice Number': inv.invoiceNumber,
        'Issue Date': inv.invoiceDate,
        'Due Date': inv.dueDate,
        'Client Name': inv.clientName,
        'Sender Address': `${inv.senderName}, ${inv.senderAddress}`,
        'Client Location': `${inv.clientAddress}, ${inv.clientCity}, ${inv.clientCountry}`,
        'Items Breakdown': itemsText || 'No items listed',
        'Subtotal (BDT)': subtotal,
        'Discount (%)': inv.discount,
        'Tax / VAT (%)': inv.tax,
        'Grand Total (BDT)': total,
        'Payment Status': inv.status,
        'Payment Method': inv.paymentMethod,
        'Transaction Reference': inv.transactionReference || 'N/A',
      };
    });

    const wsLedger = XLSX.utils.json_to_sheet(ledgerSheetData);
    XLSX.utils.book_append_sheet(wb, wsLedger, 'Master Ledger');

    // SHEET 2: Breakdowns detail of Currently Loaded Active Invoice
    const currentSubtotal = currentInvoice.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const currentGrandTotal = getInvTotal(currentInvoice);

    // Metadata lines first
    const detailHeaderRows = [
      { A: 'ABSTRACT DIGITAL INVOICE REPORT', B: '', C: '', D: '' },
      { A: 'Invoice ID', B: currentInvoice.invoiceNumber, C: 'Generated Date', D: currentInvoice.invoiceDate },
      { A: 'Sender Name', B: currentInvoice.senderName, C: 'Due Date', D: currentInvoice.dueDate },
      { A: 'Client Name', B: currentInvoice.clientName, C: 'Payment Status', D: currentInvoice.status },
      { A: 'Payment Type', B: currentInvoice.paymentMethod, C: 'Reference ID', D: currentInvoice.transactionReference || 'N/A' },
      { A: '', B: '', C: '', D: '' }, // Blank spacer
      { A: 'Item Description', B: 'Quantity', C: 'Unit Price (BDT)', D: 'Line Total (BDT)' },
    ];

    // Followed by individual product item rows
    const detailItemRows = currentInvoice.lineItems.map((item) => ({
      A: item.description || 'Unnamed Service',
      B: item.quantity,
      C: item.unitPrice,
      D: item.quantity * item.unitPrice,
    }));

    // Followed by financials summation blocks
    const detailCalcRows = [
      { A: '', B: '', C: '', D: '' },
      { A: '', B: '', C: 'Subtotal BDT:', D: currentSubtotal },
      { A: '', B: '', C: `Discount (${currentInvoice.discount}%):`, D: currentSubtotal * (currentInvoice.discount / 100) },
      { A: '', B: '', C: `Tax / VAT (${currentInvoice.tax}%):`, D: (currentSubtotal - currentSubtotal * (currentInvoice.discount / 100)) * (currentInvoice.tax / 100) },
      { A: '', B: '', C: 'Grand Total BDT:', D: currentGrandTotal },
    ];

    const finalDetailData = [...detailHeaderRows, ...detailItemRows, ...detailCalcRows];
    // Write standard workbook cells via manual custom mapping to sheet index
    const wsDetail = XLSX.utils.json_to_sheet(finalDetailData, { skipHeader: true });
    XLSX.utils.book_append_sheet(wb, wsDetail, 'Loaded Invoice Breakdown');

    // SHEET 3: Financial summaries dashboard sheets
    const totalTransactions = invoices.length;
    const totalBilledVal = invoices.reduce((acc, inv) => acc + getInvTotal(inv), 0);
    const totalPaidVal = invoices.reduce((acc, inv) => inv.status === 'PAID' ? acc + getInvTotal(inv) : acc, 0);
    const totalUnpaidVal = invoices.reduce((acc, inv) => inv.status !== 'PAID' ? acc + getInvTotal(inv) : acc, 0);
    
    // Unique clients mapping
    const clientAccounts = Array.from(new Set(invoices.map((inv) => inv.clientName.trim()))).filter(Boolean);

    const summaryData = [
      { Metric: 'Total Recorded Invoices', Value: totalTransactions },
      { Metric: 'Cumulative Amount Billed (BDT)', Value: totalBilledVal },
      { Metric: 'Cumulative Received Cash (BDT)', Value: totalPaidVal },
      { Metric: 'Outstanding Arrears (BDT)', Value: totalUnpaidVal },
      { Metric: 'Registered Client Base Size', Value: clientAccounts.length },
      { Metric: '', Value: '' }, // spacing
      { Metric: 'Registered Corporate Clients Accounts list:', Value: '' },
      ...clientAccounts.map((cl) => ({ Metric: 'Client Account Name', Value: cl })),
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ledger Summary');

    // Generate sheet file download and save as filename
    XLSX.writeFile(wb, `Abstract_Digital_Ledger_Report.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* 1. Global Header Title Bar Workspace */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-4 px-6 sticky top-0 z-40 shadow-sm no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-[#2ecc71] flex items-center justify-center font-bold text-white text-base tracking-tight select-none">
              AD
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Abstract Digital</h1>
              <p className="text-[10px] text-slate-450 tracking-wider uppercase font-semibold font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ecc71] animate-pulse"></span>
                Invoice Cloud Manager
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {autoSavedTime && (
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded font-mono border border-slate-750 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                Saved: {autoSavedTime}
              </span>
            )}
            
            <button
              onClick={handleNewInvoice}
              className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Start a fresh blank invoice"
            >
              <FileText className="w-3.5 h-3.5" />
              New Draft
            </button>

            <button
              onClick={handleSaveInvoice}
              className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Record to permanent storage ledger"
            >
              <Save className="w-3.5 h-3.5 text-[#2ecc71]" />
              Save Record
            </button>

            <button
              onClick={() => setIsLedgerOpen(true)}
              className="text-xs bg-[#2ecc71] hover:bg-[#27ae60] text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-[#2ecc71]/25 cursor-pointer"
              title="Overview databases statistics and downloads"
            >
              <BookOpen className="w-3.5 h-3.5" />
              View Ledger
            </button>

            <button
              onClick={handleDownloadStandalone}
              className="text-xs bg-slate-800 hover:bg-slate-750 text-[#2ecc71] border border-[#2ecc71]/30 hover:border-[#2ecc71]/60 px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download Standalone Offline Single HTML applet file"
            >
              <Download className="w-3.5 h-3.5" />
              Standalone HTML
            </button>

            <button
              onClick={handlePrint}
              className="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Export clear print or save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / PDF
            </button>
          </div>
        </div>
      </header>

      {/* 2. Primary Page workspace panel layout split */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Dynamic Warning for Screen Dimensions in Live Previews */}
        <div className="no-print hidden max-w-full md:flex items-center gap-2 bg-slate-100 border border-slate-200 p-3 rounded-lg mb-6 text-xs text-slate-500 leading-snug">
          <Sparkles className="w-4 h-4 text-[#2ecc71] animate-pulse flex-shrink-0" />
          <p>
            You are operating the <strong>Abstract Digital</strong> unified billing machine. All actions auto-save in raw localStorage instantly. Press <strong>Print / PDF</strong> to trigger clean, print-optimized document layouts.
          </p>
        </div>

        {/* Structure layout: Grid of [History Sidebar | Form Sheet | Real-time Invoice Sheet] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. Leftmost column: Stored Past History (col: 1 lg:3) */}
          <div className="col-span-1 lg:col-span-3 no-print">
            <HistorySidebar
              invoices={invoices}
              activeInvoiceId={activeInvoiceId}
              onSelectInvoice={handleSelectInvoice}
              onDeleteInvoice={handleDeleteInvoice}
            />
          </div>

          {/* B. Middle column: Inputs form sheet (col: 1 lg:5) */}
          <div className="col-span-1 lg:col-span-4 no-print space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded bg-[#2ecc71]"></span>
                Billings Sheet Editor
              </h2>
              {activeInvoiceId && (
                <span className="text-[10px] font-mono font-bold text-[#2ecc71] bg-[#2ecc71]/10 px-2 py-0.5 rounded-full">
                  Editing: {currentInvoice.invoiceNumber}
                </span>
              )}
            </div>

            <InvoiceForm
              invoice={currentInvoice}
              onChange={handleFormChange}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
            />
          </div>

          {/* C. Right column: Visual Live Output Canvas (col: 1 lg:5) */}
          <div className="col-span-1 lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between no-print">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mt-1">
                <Eye className="w-4 h-4 text-[#2ecc71]" />
                Live Document Preview
              </h2>
              <span className="text-[10px] text-slate-450 italic">
                Renders instantly as you type
              </span>
            </div>

            <div className="flex justify-center w-full">
              <InvoicePreview invoice={currentInvoice} />
            </div>
          </div>

        </div>

      </main>

      {/* 3. Global Modal for Overviewing database ledgers in Table frames */}
      {isLedgerOpen && (
        <LedgerModal
          invoices={invoices}
          onClose={() => setIsLedgerOpen(false)}
          onClearLedger={handleClearLedger}
          onExportExcel={handleExportExcel}
        />
      )}

    </div>
  );
}
