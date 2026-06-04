/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const getStandaloneHTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abstract Digital - Invoice Generator</title>
  <!-- Google Fonts - Poppins & Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- SheetJS CDN for Master Excel Ledger -->
  <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Poppins', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>

  <style>
    /* Styling & custom scrollbars */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Print Optimization rules */
    @media print {
      .no-print {
        display: none !important;
      }
      .print-area {
        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      body {
        background-color: #ffffff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      tr {
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body class="bg-gray-50 text-slate-850 font-sans min-h-screen">

  <!-- Main Navigation Header -->
  <header class="bg-slate-900 border-b border-slate-800 text-white py-4 px-6 sticky top-0 z-40 shadow-sm no-print">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded bg-[#2ecc71] flex items-center justify-center font-black text-white text-base">AD</div>
        <div>
          <h1 class="text-sm font-semibold tracking-tight leading-tight">Abstract Digital</h1>
          <p class="text-[10px] text-slate-400 tracking-wider uppercase font-semibold font-mono flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-[#2ecc71] animate-ping"></span>
            Offline Standalone Generator
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <span id="auto-save-badge" class="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded font-mono hidden items-center gap-1">
          <span class="w-1 h-1 rounded bg-emerald-400 animate-pulse"></span>
          Saved: <span id="auto-save-time">-</span>
        </span>

        <button onclick="createNewInvoice()" class="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          New Draft
        </button>

        <button onclick="saveInvoice()" class="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all">
          <svg class="w-3.5 h-3.5 text-[#2ecc71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
          Save Record
        </button>

        <button onclick="toggleLedgerModal(true)" class="text-xs bg-[#2ecc71] hover:bg-[#27ae60] text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/25">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          View Ledger
        </button>

        <button onclick="window.print()" class="text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          Print / PDF
        </button>
      </div>
    </div>
  </header>

  <!-- Core Content Grid -->
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-8">

    <!-- Top Alert bar -->
    <div class="no-print hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 p-3 rounded-lg mb-6 text-xs text-slate-500">
      <svg class="w-4 h-4 text-[#2ecc71] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      <p>Standalone Offline Mode active. All invoice entries are hosted inside your local browser storage. No server connection is required.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      <!-- Column 1: History sidebar list -->
      <div class="col-span-1 lg:col-span-3 no-print">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
          <div class="flex items-center gap-2 pb-4 border-b border-slate-100">
            <svg class="w-5 h-5 text-[#2ecc71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
              <h2 class="text-sm font-bold text-slate-800">Saved History</h2>
              <p class="text-[10px] text-slate-400">Past compiled bills</p>
            </div>
            <span id="history-badge" class="ml-auto bg-slate-100 text-slate-600 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">0</span>
          </div>

          <!-- History Search -->
          <div class="relative mt-4 mb-4">
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input id="history-search" type="text" oninput="renderHistory()" placeholder="Search by Invoice# or Client..." class="w-full text-xs border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent">
          </div>

          <!-- History sidebar items container -->
          <div id="history-container" class="space-y-2 overflow-y-auto max-h-[450px]">
            <!-- JS populated dynamic items -->
          </div>
        </div>
      </div>

      <!-- Column 2: Invoice Form panel -->
      <div class="col-span-1 lg:col-span-4 no-print space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded bg-[#2ecc71]"></span>
            Billings Sheet Editor
          </h2>
          <span id="editing-indicator" class="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">Draft Mode</span>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          
          <!-- Prefilled Sender Information -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-slate-100">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sender Info (Pre-filled)</label>
              <div class="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs space-y-0.5 text-slate-500">
                <p class="font-semibold text-slate-700">Abstract Digital</p>
                <p>Chattogram, Bangladesh</p>
                <p class="text-[10px]">Email: billing@abstractdigital.com</p>
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Invoice Number</label>
              <input id="form-invoice-number" type="text" oninput="onFormFieldChange()" class="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2ecc71]">
            </div>
          </div>

          <!-- Client details -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 border-l-2 border-[#2ecc71] pl-2">Client Details</h3>
            
            <div>
              <label class="block text-[10px] font-semibold text-slate-600 mb-1">Company / Customer Name</label>
              <input id="form-client-name" type="text" oninput="onFormFieldChange()" placeholder="e.g. BestwebhostBD.com" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71]">
            </div>

            <div>
              <label class="block text-[10px] font-semibold text-slate-600 mb-1">Billing Address</label>
              <input id="form-client-address" type="text" oninput="onFormFieldChange()" placeholder="e.g. House 45, Road 5, Nasirabad R/A" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71]">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-1">City</label>
                <input id="form-client-city" type="text" oninput="onFormFieldChange()" placeholder="e.g. Chattogram" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71]">
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-1">Country</label>
                <input id="form-client-country" type="text" oninput="onFormFieldChange()" placeholder="e.g. Bangladesh" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71]">
              </div>
            </div>
          </div>

          <!-- Timeline Dates -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 border-l-2 border-[#2ecc71] pl-2">Timeline Dates</h3>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-1">Invoice Date</label>
                <input id="form-invoice-date" type="date" oninput="onFormFieldChange()" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] font-mono">
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-1">Due Date</label>
                <input id="form-due-date" type="date" oninput="onFormFieldChange()" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] font-mono">
              </div>
            </div>
          </div>

          <!-- Items Breakdown -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 border-l-2 border-[#2ecc71] pl-2">Line Items</h3>
              <button onclick="addLineItem()" class="text-[11px] bg-[#2ecc71] hover:bg-emerald-600 text-white px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1">
                <span class="text-xs leading-none">+</span> Add Item
              </button>
            </div>

            <!-- Items container list -->
            <div id="form-items-container" class="space-y-2 max-h-[220px] overflow-y-auto">
              <!-- JS populated dynamic items -->
            </div>
          </div>

          <!-- Adjustments & Payments -->
          <div class="space-y-4 pt-3 border-t border-slate-100">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 border-l-2 border-[#2ecc71] pl-2">Adjustments & Details</h3>
            
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-1">Discount (%)</label>
                <input id="form-discount" type="number" min="0" max="100" step="any" oninput="onFormFieldChange()" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] font-mono">
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-1">Tax / VAT (%)</label>
                <input id="form-tax" type="number" min="0" max="100" step="any" oninput="onFormFieldChange()" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] font-mono">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-1">Payment Method</label>
                <select id="form-payment-method" onchange="onFormFieldChange()" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] bg-white">
                  <option value="SSLCommerz">SSLCommerz</option>
                  <option value="bKash">bKash</option>
                  <option value="Bank Transfer">Bank/Bank Transfer</option>
                  <option value="Cash">Cash Payments</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-slate-600 mb-1">Transaction Ref Code</label>
                <input id="form-trx-ref" type="text" oninput="onFormFieldChange()" placeholder="e.g. TR-BK92518Z" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] font-mono">
              </div>
            </div>

            <!-- Status Buttons Grid -->
            <div>
              <label class="block text-[10px] font-semibold text-slate-600 mb-1">Status Stamp Selector</label>
              <div class="grid grid-cols-3 gap-2">
                <button id="btn-status-paid" onclick="setStatus('PAID')" class="py-2 text-[10px] border font-bold text-center rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">PAID</button>
                <button id="btn-status-unpaid" onclick="setStatus('UNPAID')" class="py-2 text-[10px] border font-bold text-center rounded-lg bg-red-500 text-white border-red-500">UNPAID</button>
                <button id="btn-status-pending" onclick="setStatus('PENDING')" class="py-2 text-[10px] border font-bold text-center rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">PENDING</button>
              </div>
            </div>
          </div>

          <!-- Terms & Notes -->
          <div class="space-y-1.5">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Terms & Remarks</label>
            <textarea id="form-notes" oninput="onFormFieldChange()" rows="3" class="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] leading-relaxed"></textarea>
          </div>

        </div>
      </div>

      <!-- Column 3: Live Document Preview -->
      <div class="col-span-1 lg:col-span-5 space-y-6">
        <div class="flex justify-between items-center no-print">
          <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <svg class="w-4 h-4 text-[#2ecc71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Live Document Preview
          </h2>
          <span class="text-[10px] text-slate-400 italic">Renders instantly on typing</span>
        </div>

        <div class="flex justify-center w-full">
          <!-- The printable/preview invoice sheet frame -->
          <div id="print-area" class="print-area bg-white text-slate-850 p-8 md:p-12 border border-slate-200 rounded-xl relative overflow-hidden shadow-sm flex flex-col justify-between w-full max-w-[800px] min-h-[1050px]">
            
            <!-- Dynamic Stamp Overlays -->
            <div class="absolute right-12 top-28 select-none z-10">
              <div id="stamp-paid" class="border-4 border-dashed border-[#2ecc71] text-[#2ecc71] font-bold text-xl md:text-2xl px-6 py-2 rounded uppercase tracking-wider transform -rotate-12 bg-white/90 shadow-sm hidden">
                PAID
              </div>
              <div id="stamp-unpaid" class="border-4 border-dashed border-red-500 text-red-500 font-bold text-xl md:text-2xl px-6 py-2 rounded uppercase tracking-wider transform -rotate-12 bg-white/90 shadow-sm hidden">
                UNPAID
              </div>
              <div id="stamp-pending" class="border-4 border-dashed border-amber-500 text-amber-500 font-bold text-xl md:text-2xl px-6 py-2 rounded uppercase tracking-wider transform -rotate-12 bg-white/90 shadow-sm hidden">
                PENDING
              </div>
            </div>

            <div>
              <!-- Invoice Top Metadata & Branding -->
              <div class="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-8">
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-12 h-12 rounded-lg bg-[#2ecc71] flex items-center justify-center font-bold text-white text-xl shadow-md">AD</div>
                    <div>
                      <h1 class="text-xl font-bold tracking-tight leading-none text-slate-900">Abstract Digital</h1>
                      <p class="text-xs text-[#2ecc71] font-semibold mt-1">Design & Tech Agency</p>
                    </div>
                  </div>
                  <div class="text-xs text-slate-500 space-y-1">
                    <p class="font-medium text-slate-700">Abstract Digital</p>
                    <p>Chattogram, Bangladesh</p>
                    <p>Email: billing@abstractdigital.com</p>
                  </div>
                </div>

                <div class="text-right flex flex-col justify-start items-end gap-3 self-stretch sm:self-auto">
                  <div>
                    <h2 class="text-2xl font-black uppercase tracking-tight text-slate-800">INVOICE</h2>
                    <p id="preview-invoice-number" class="text-sm font-mono font-bold text-[#2ecc71] mt-1">AD-1001</p>
                  </div>
                  <div class="text-xs text-slate-600 space-y-1.5 w-full sm:w-48 text-right">
                    <div class="flex justify-between items-center gap-4">
                      <span class="font-semibold text-slate-400">Invoice Date:</span>
                      <span id="preview-invoice-date" class="font-mono font-medium text-slate-800">-</span>
                    </div>
                    <div class="flex justify-between items-center gap-4">
                      <span class="font-semibold text-slate-400">Due Date:</span>
                      <span id="preview-due-date" class="font-mono font-medium text-slate-800">-</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bill To Container split block -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Invoice To:</h3>
                  <div class="space-y-1">
                    <p id="preview-client-name" class="font-bold text-sm text-slate-800">Valued Client</p>
                    <p id="preview-client-address" class="text-xs text-slate-605"></p>
                    <p id="preview-client-location" class="text-xs text-slate-500 font-medium"></p>
                  </div>
                </div>
                <div class="md:text-right">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Payment Info</h3>
                  <div class="text-xs text-slate-600 space-y-1">
                    <p><span class="font-medium text-slate-400">Method:</span> <span id="preview-payment-type" class="font-semibold text-slate-800">SSLCommerz</span></p>
                    <p id="preview-trx-ref-block"><span class="font-medium text-slate-400">Trx ID / Ref:</span> <span id="preview-trx-ref" class="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">-</span></p>
                  </div>
                </div>
              </div>

              <!-- Line Items Table list view -->
              <div class="mb-8">
                <table class="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr class="border-b border-slate-200 text-slate-450 font-medium uppercase text-[10px] tracking-wider">
                      <th class="py-3 px-2 text-left w-8">#</th>
                      <th class="py-3 px-2 text-left">Description</th>
                      <th class="py-3 px-2 text-right w-16">Qty</th>
                      <th class="py-3 px-2 text-right w-24">Unit Price</th>
                      <th class="py-3 px-2 text-right w-28">Total</th>
                    </tr>
                  </thead>
                  <tbody id="preview-items-rows" class="divide-y divide-slate-100">
                    <!-- JS populated line items -->
                  </tbody>
                </table>
              </div>

              <!-- Subtotal calculations sidebar row details -->
              <div class="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8 mb-8">
                <div class="sm:max-w-[50%]">
                  <div id="preview-notes-container" class="hidden">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Terms & Remarks:</h4>
                    <p id="preview-notes" class="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100 font-sans italic"></p>
                  </div>
                </div>

                <div class="w-full sm:w-auto sm:min-w-[250px] space-y-1.5 self-end text-xs">
                  <div class="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span id="p-subtotal" class="font-mono font-medium text-slate-800">৳0.00</span>
                  </div>
                  <div id="p-discount-row" class="flex justify-between text-[#2ecc71] hidden">
                    <span>Discount (<span id="p-discount-percent">0</span>%):</span>
                    <span id="p-discount-val" class="font-mono font-medium">-৳0.00</span>
                  </div>
                  <div id="p-tax-row" class="flex justify-between text-slate-500 hidden">
                    <span>VAT / Tax (<span id="p-tax-percent">0</span>%):</span>
                    <span id="p-tax-val" class="font-mono font-medium text-slate-800">+৳0.00</span>
                  </div>
                  <div class="flex justify-between items-center pt-2 border-t border-slate-100 text-slate-800">
                    <span class="font-bold uppercase tracking-wider text-[10px]">Total Amount:</span>
                    <span id="p-grand-total" class="font-mono text-base font-black text-[#2ecc71]">৳0.00 BDT</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Pre-rendered ledger footer table -->
            <div class="mt-auto pt-4 border-t border-slate-200">
              <h4 class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Transaction Ledger</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th class="py-2 px-3">Date</th>
                      <th class="py-2 px-3">Payment Type</th>
                      <th class="py-2 px-3">Reference</th>
                      <th class="py-2 px-3 text-right">Amount Received</th>
                      <th class="py-2 px-3 text-right">Balance Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-100">
                      <td id="ledger-date" class="py-2.5 px-3 font-mono text-slate-600">-</td>
                      <td id="ledger-type" class="py-2.5 px-3 text-slate-700 font-medium">SSLCommerz</td>
                      <td id="ledger-ref" class="py-2.5 px-3 font-mono text-slate-600">-</td>
                      <td id="ledger-received" class="py-2.5 px-3 text-right font-mono text-emerald-600">৳0.00</td>
                      <td id="ledger-balance" class="py-2.5 px-3 text-right font-mono font-semibold">৳0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex flex-col sm:flex-row justify-between items-center gap-2 mt-6 text-[10px] text-slate-400">
                <p>Thank you for doing business with Abstract Digital.</p>
                <p class="font-mono">Secure Payments via SSLCommerz / bKash</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </main>

  <!-- Giant Stats & History Workbook Ledger Modal -->
  <div id="ledger-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
    <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 scale-95 transition-all">
      
      <!-- Modal Header -->
      <div class="flex justify-between items-center bg-[#2ecc71] px-6 py-4 text-white">
        <div class="flex items-center gap-2.5">
          <svg class="w-5 h-5 text-emerald-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
          <div>
            <h2 class="font-bold text-lg leading-tight">Master Trans Ledger</h2>
            <p class="text-xs text-emerald-100">Global statistics & database workbook</p>
          </div>
        </div>
        <button onclick="toggleLedgerModal(false)" class="p-1.5 hover:bg-emerald-600 rounded-lg text-emerald-50 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Statistics Body content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        
        <!-- Statistics Cards metrics grids -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total Invoices</p>
            <p id="meta-count" class="text-xl font-black mt-1 text-slate-800">0</p>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total Billed</p>
            <p id="meta-billed" class="text-xl font-black mt-1 text-slate-800">৳0</p>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Cash Received</p>
            <p id="meta-received" class="text-xl font-black mt-1 text-emerald-600">৳0</p>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Outstanding</p>
            <p id="meta-due" class="text-xl font-black mt-1 text-red-500">৳0</p>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl p-4 col-span-2 md:col-span-1">
            <p class="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Client base</p>
            <p id="meta-clients" class="text-xl font-black mt-1 text-purple-600">0</p>
          </div>
        </div>

        <!-- Filters controls & searches -->
        <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-xl">
          <div class="flex items-center gap-1.5 flex-wrap">
            <button id="lf-all" onclick="setLedgerFilter('ALL')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-white transition-all">ALL</button>
            <button id="lf-paid" onclick="setLedgerFilter('PAID')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">PAID</button>
            <button id="lf-unpaid" onclick="setLedgerFilter('UNPAID')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">UNPAID</button>
            <button id="lf-pending" onclick="setLedgerFilter('PENDING')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">PENDING</button>
          </div>

          <div class="flex items-center gap-2">
            <input id="ledger-search" type="text" oninput="renderLedgerTable()" placeholder="Search invoice# or client..." class="text-xs bg-white border border-slate-250 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2ecc71] max-w-xs transition-all w-full">
            <button onclick="exportWorkbookExcel()" class="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all min-w-max">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Sheet Export
            </button>
          </div>
        </div>

        <!-- Ledger Listing Table view grid -->
        <div class="border border-slate-150 rounded-xl overflow-hidden bg-white max-h-[350px] overflow-y-auto">
          <table class="w-full border-collapse text-left text-xs">
            <thead class="bg-gray-50 text-slate-500 font-bold sticky top-0 border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th class="py-3 px-4">Invoice No</th>
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Client Name</th>
                <th class="py-3 px-4">Billed Amount</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Payment Method</th>
                <th class="py-3 px-4">Reference</th>
              </tr>
            </thead>
            <tbody id="ledger-table-rows" class="divide-y divide-slate-100">
              <!-- JS populated table records -->
            </tbody>
          </table>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="bg-slate-50 border-t border-slate-150 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button onclick="clearAllLedgerData()" class="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 bg-white font-bold flex items-center gap-1.5 px-4 py-2.5 rounded-lg transition-all">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          Clear Ledger database
        </button>
        <button onclick="toggleLedgerModal(false)" class="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 text-xs font-bold rounded-lg transition-all text-center">
          Close Ledger Panel
        </button>
      </div>

    </div>
  </div>


  <!-- Core Client Controller Scripts -->
  <script>
    // State management
    let invoices = [];
    let currentInvoice = {
      id: '',
      invoiceNumber: 'AD-1001',
      clientName: '',
      clientAddress: '',
      clientCity: '',
      clientCountry: '',
      invoiceDate: '',
      dueDate: '',
      lineItems: [],
      discount: 0,
      tax: 0,
      paymentMethod: 'SSLCommerz',
      transactionReference: '',
      status: 'UNPAID',
      notes: 'Please clear this invoice. Domain and server renewals must be paid in full prior to active terms.'
    };

    let activeInvoiceId = '';
    let ledgerFilter = 'ALL';

    // Helper unique ID generator
    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    // Helper Currency BDT formatter
    function formatBDT(amount) {
      return '৳' + Number(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    // Load initial databases
    window.addEventListener('DOMContentLoaded', () => {
      // 1. Set dates
      const today = new Date().toISOString().split('T')[0];
      const future = new Date();
      future.setDate(future.getDate() + 14);
      const dueDate = future.toISOString().split('T')[0];

      currentInvoice.invoiceDate = today;
      currentInvoice.dueDate = dueDate;
      currentInvoice.id = uuidv4();

      // 2. Load stored items from localStorage
      const storedInvoices = localStorage.getItem('abstract_digital_invoices');
      if (storedInvoices) {
        try {
          invoices = JSON.parse(storedInvoices);
        } catch(e) {
          console.error(e);
        }
      }

      const counterVal = localStorage.getItem('abstract_digital_invoice_counter');
      if (!counterVal) {
        localStorage.setItem('abstract_digital_invoice_counter', '1001');
      }

      // 3. Load draft or create fresh
      const draft = localStorage.getItem('abstract_digital_draft');
      if (draft) {
        try {
          currentInvoice = JSON.parse(draft);
          activeInvoiceId = currentInvoice.id || '';
        } catch(e) {
          console.error(e);
        }
      } else {
        const nextNum = counterVal || '1001';
        currentInvoice.invoiceNumber = 'AD-' + nextNum;
      }

      // 4. Force populate onto elements input fields
      mapInvoiceToForm();
      updatePreview();
      renderHistory();

      // Start periodic save loop
      setInterval(() => {
        localStorage.setItem('abstract_digital_draft', JSON.stringify(currentInvoice));
        const badge = document.getElementById('auto-save-badge');
        const timeBox = document.getElementById('auto-save-time');
        if (badge && timeBox) {
          badge.classList.remove('hidden');
          badge.classList.add('flex');
          timeBox.textContent = new Date().toLocaleTimeString();
        }
      }, 2000);
    });

    // Populate current state values to the Form Fields
    function mapInvoiceToForm() {
      document.getElementById('form-invoice-number').value = currentInvoice.invoiceNumber || '';
      document.getElementById('form-client-name').value = currentInvoice.clientName || '';
      document.getElementById('form-client-address').value = currentInvoice.clientAddress || '';
      document.getElementById('form-client-city').value = currentInvoice.clientCity || '';
      document.getElementById('form-client-country').value = currentInvoice.clientCountry || '';
      document.getElementById('form-invoice-date').value = currentInvoice.invoiceDate || '';
      document.getElementById('form-due-date').value = currentInvoice.dueDate || '';
      document.getElementById('form-discount').value = currentInvoice.discount || '';
      document.getElementById('form-tax').value = currentInvoice.tax || '';
      document.getElementById('form-payment-method').value = currentInvoice.paymentMethod || 'SSLCommerz';
      document.getElementById('form-trx-ref').value = currentInvoice.transactionReference || '';
      document.getElementById('form-notes').value = currentInvoice.notes || '';
      
      updateStatusUI();
      renderFormItems();
    }

    // Handles form change feeds
    function onFormFieldChange() {
      currentInvoice.invoiceNumber = document.getElementById('form-invoice-number').value;
      currentInvoice.clientName = document.getElementById('form-client-name').value;
      currentInvoice.clientAddress = document.getElementById('form-client-address').value;
      currentInvoice.clientCity = document.getElementById('form-client-city').value;
      currentInvoice.clientCountry = document.getElementById('form-client-country').value;
      currentInvoice.invoiceDate = document.getElementById('form-invoice-date').value;
      currentInvoice.dueDate = document.getElementById('form-due-date').value;
      currentInvoice.discount = parseFloat(document.getElementById('form-discount').value) || 0;
      currentInvoice.tax = parseFloat(document.getElementById('form-tax').value) || 0;
      currentInvoice.paymentMethod = document.getElementById('form-payment-method').value;
      currentInvoice.transactionReference = document.getElementById('form-trx-ref').value;
      currentInvoice.notes = document.getElementById('form-notes').value;

      updatePreview();
    }

    function setStatus(statusString) {
      currentInvoice.status = statusString;
      updateStatusUI();
      updatePreview();
    }

    function updateStatusUI() {
      const paidBtn = document.getElementById('btn-status-paid');
      const unpaidBtn = document.getElementById('btn-status-unpaid');
      const pendingBtn = document.getElementById('btn-status-pending');
      const indicator = document.getElementById('editing-indicator');

      // Reset
      [paidBtn, unpaidBtn, pendingBtn].forEach(b => {
        b.className = "py-2 text-[10px] border font-bold text-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors";
      });

      if (currentInvoice.status === 'PAID') {
        paidBtn.className = "py-2 text-[10px] border font-bold text-center rounded-lg bg-emerald-500 text-white border-emerald-500 shadow-sm";
      } else if (currentInvoice.status === 'UNPAID') {
        unpaidBtn.className = "py-2 text-[10px] border font-bold text-center rounded-lg bg-red-500 text-white border-red-500 shadow-sm";
      } else if (currentInvoice.status === 'PENDING') {
        pendingBtn.className = "py-2 text-[10px] border font-bold text-center rounded-lg bg-amber-500 text-white border-amber-500 shadow-sm";
      }

      if (activeInvoiceId) {
        indicator.textContent = "Editing: " + currentInvoice.invoiceNumber;
        indicator.className = "text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100";
      } else {
        indicator.textContent = "Draft Mode";
        indicator.className = "text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full";
      }
    }

    // Form Items Row builders
    function renderFormItems() {
      const container = document.getElementById('form-items-container');
      container.innerHTML = '';

      if (currentInvoice.lineItems.length === 0) {
        container.innerHTML = \`<div class="text-center py-6 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
          <p class="text-[11px] text-slate-400 font-medium">No items/services added yet.</p>
          <button onclick="addLineItem()" class="text-[11px] text-[#2ecc71] font-bold mt-1 inline-block hover:underline">Add one now</button>
        </div>\`;
        return;
      }

      currentInvoice.lineItems.forEach((item, idx) => {
        const itemRow = document.createElement('div');
        itemRow.className = "p-3 bg-slate-50 border border-slate-150 rounded-lg flex flex-col sm:flex-row gap-2 relative items-end sm:items-center";
        itemRow.innerHTML = \`
          <div class="flex-1 w-full">
            <span class="text-[9px] text-slate-400 font-semibold block mb-0.5">ITEM \${idx + 1} DESCRIPTION</span>
            <input type="text" value="\${item.description}" placeholder="e.g. Server hosting renewal" oninput="updateLineItem('\${item.id}', 'description', this.value)" class="w-full text-xs p-2 border border-slate-250 bg-white rounded focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="w-16">
            <span class="text-[9px] text-slate-400 font-semibold block mb-0.5">QTY</span>
            <input type="number" min="1" value="\${item.quantity}" oninput="updateLineItem('\${item.id}', 'quantity', this.value)" class="w-full text-xs p-2 border border-slate-250 bg-white rounded text-center font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="w-24">
            <span class="text-[9px] text-slate-400 font-semibold block mb-0.5">PRICE (৳)</span>
            <input type="number" min="0" value="\${item.unitPrice || ''}" placeholder="0" oninput="updateLineItem('\${item.id}', 'unitPrice', this.value)" class="w-full text-xs p-2 border border-slate-250 bg-white rounded text-right font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <button onclick="removeLineItem('\${item.id}')" class="p-1.5 text-slate-350 hover:text-red-500 rounded bg-white border border-slate-250 hover:bg-red-50 hover:border-red-100 transition-colors cursor-pointer" title="Delete row">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        \`;
        container.appendChild(itemRow);
      });
    }

    function addLineItem() {
      currentInvoice.lineItems.push({
        id: uuidv4(),
        description: '',
        quantity: 1,
        unitPrice: 0
      });
      renderFormItems();
      updatePreview();
    }

    function removeLineItem(id) {
      currentInvoice.lineItems = currentInvoice.lineItems.filter(i => i.id !== id);
      renderFormItems();
      updatePreview();
    }

    function updateLineItem(id, field, value) {
      const item = currentInvoice.lineItems.find(i => i.id === id);
      if (item) {
        if (field === 'quantity') {
          item.quantity = Math.max(1, parseInt(value) || 1);
        } else if (field === 'unitPrice') {
          item.unitPrice = Math.max(0, parseFloat(value) || 0);
        } else {
          item[field] = value;
        }
      }
      updatePreview();
    }

    // Update real-time Live Document Preview Column
    function updatePreview() {
      document.getElementById('preview-invoice-number').textContent = currentInvoice.invoiceNumber || 'AD-1001';
      document.getElementById('preview-invoice-date').textContent = currentInvoice.invoiceDate || '-';
      document.getElementById('preview-due-date').textContent = currentInvoice.dueDate || '-';
      
      document.getElementById('preview-client-name').textContent = currentInvoice.clientName || 'Valued Client';
      document.getElementById('preview-client-address').textContent = currentInvoice.clientAddress || '';
      
      const locText = [currentInvoice.clientCity, currentInvoice.clientCountry].filter(Boolean).join(', ');
      document.getElementById('preview-client-location').textContent = locText;

      document.getElementById('preview-payment-type').textContent = currentInvoice.paymentMethod;
      
      const trxBlock = document.getElementById('preview-trx-ref-block');
      const trxCode = document.getElementById('preview-trx-ref');
      if (currentInvoice.transactionReference) {
        trxBlock.classList.remove('hidden');
        trxCode.textContent = currentInvoice.transactionReference;
      } else {
        trxBlock.classList.add('hidden');
      }

      // Stamps
      document.getElementById('stamp-paid').classList.add('hidden');
      document.getElementById('stamp-unpaid').classList.add('hidden');
      document.getElementById('stamp-pending').classList.add('hidden');
      
      if (currentInvoice.status === 'PAID') document.getElementById('stamp-paid').classList.remove('hidden');
      if (currentInvoice.status === 'UNPAID') document.getElementById('stamp-unpaid').classList.remove('hidden');
      if (currentInvoice.status === 'PENDING') document.getElementById('stamp-pending').classList.remove('hidden');

      // Notes
      const notesContainer = document.getElementById('preview-notes-container');
      const notesP = document.getElementById('preview-notes');
      if (currentInvoice.notes) {
        notesContainer.classList.remove('hidden');
        notesP.textContent = currentInvoice.notes;
      } else {
        notesContainer.classList.add('hidden');
      }

      // Render items list inside preview
      const tableRows = document.getElementById('preview-items-rows');
      tableRows.innerHTML = '';

      let subtotal = 0;

      if (currentInvoice.lineItems.length === 0) {
        tableRows.innerHTML = \`<tr>
          <td colspan="5" class="py-8 text-center text-slate-450 italic">No line items specified.</td>
        </tr>\`;
      } else {
        currentInvoice.lineItems.forEach((item, idx) => {
          const rowTotal = item.quantity * item.unitPrice;
          subtotal += rowTotal;

          const tr = document.createElement('tr');
          tr.className = "hover:bg-slate-50/50";
          tr.innerHTML = \`
            <td class="py-3 px-2 text-slate-400 font-mono">\${idx + 1}</td>
            <td class="py-3 px-2 text-slate-800 font-semibold max-w-[280px] break-words leading-relaxed">\${item.description || 'Untitled Service'}</td>
            <td class="py-3 px-2 text-right font-mono text-slate-500">\${item.quantity}</td>
            <td class="py-3 px-2 text-right font-mono text-slate-500">\${formatBDT(item.unitPrice)}</td>
            <td class="py-3 px-2 text-right font-mono font-bold text-slate-900">\${formatBDT(rowTotal)}</td>
          \`;
          tableRows.appendChild(tr);
        });
      }

      // Math totals
      const discountAmount = subtotal * ((currentInvoice.discount || 0) / 100);
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = taxableAmount * ((currentInvoice.tax || 0) / 100);
      const grandTotal = taxableAmount + taxAmount;

      document.getElementById('p-subtotal').textContent = formatBDT(subtotal);
      
      const discRow = document.getElementById('p-discount-row');
      if (currentInvoice.discount > 0) {
        discRow.classList.remove('hidden');
        document.getElementById('p-discount-percent').textContent = currentInvoice.discount;
        document.getElementById('p-discount-val').textContent = '-' + formatBDT(discountAmount);
      } else {
        discRow.classList.add('hidden');
      }

      const taxRow = document.getElementById('p-tax-row');
      if (currentInvoice.tax > 0) {
        taxRow.classList.remove('hidden');
        document.getElementById('p-tax-percent').textContent = currentInvoice.tax;
        document.getElementById('p-tax-val').textContent = '+' + formatBDT(taxAmount);
      } else {
        taxRow.classList.add('hidden');
      }

      document.getElementById('p-grand-total').textContent = formatBDT(grandTotal) + ' BDT';

      // Live Bottom Ledger Syncing
      document.getElementById('ledger-date').textContent = currentInvoice.invoiceDate || '-';
      document.getElementById('ledger-type').textContent = currentInvoice.paymentMethod;
      document.getElementById('ledger-ref').textContent = currentInvoice.transactionReference || 'None';
      
      const isPaid = currentInvoice.status === 'PAID';
      document.getElementById('ledger-received').textContent = isPaid ? formatBDT(grandTotal) : formatBDT(0);
      
      const balBox = document.getElementById('ledger-balance');
      balBox.textContent = isPaid ? formatBDT(0) : formatBDT(grandTotal);
      if (isPaid) {
        balBox.className = "py-2.5 px-3 text-right font-mono text-slate-500";
      } else {
        balBox.className = "py-2.5 px-3 text-right font-mono font-bold text-rose-500";
      }
    }

    // Save current active session or invoice permanently
    function saveInvoice() {
      if (!currentInvoice.clientName.trim()) {
        alert('Please fill out the Company / Customer Name before saving.');
        return;
      }

      const idx = invoices.findIndex(i => i.id === currentInvoice.id);
      if (idx !== -1) {
        invoices[idx] = JSON.parse(JSON.stringify(currentInvoice));
      } else {
        invoices.unshift(JSON.parse(JSON.stringify(currentInvoice)));
        
        // Auto increment counter sequence bump
        const numText = currentInvoice.invoiceNumber.replace(/[^\\d]/g, '');
        const currentCounter = parseInt(numText);
        if (!isNaN(currentCounter)) {
          localStorage.setItem('abstract_digital_invoice_counter', (currentCounter + 1).toString());
        }
      }

      localStorage.setItem('abstract_digital_invoices', JSON.stringify(invoices));
      activeInvoiceId = currentInvoice.id;

      renderHistory();
      updateStatusUI();
      alert('Success: Invoice ' + currentInvoice.invoiceNumber + ' saved to Master Database Ledger!');
    }

    // Side history listings renderer
    function renderHistory() {
      const container = document.getElementById('history-container');
      const badge = document.getElementById('history-badge');
      const searchTerm = document.getElementById('history-search').value.toLowerCase();

      container.innerHTML = '';
      
      const filtered = invoices.filter(inv => {
        return (inv.invoiceNumber || '').toLowerCase().includes(searchTerm) || 
               (inv.clientName || '').toLowerCase().includes(searchTerm);
      });

      badge.textContent = invoices.length;

      if (filtered.length === 0) {
        container.innerHTML = \`<div class="text-center py-8 text-slate-400 italic">No past bills found.</div>\`;
        return;
      }

      filtered.forEach(inv => {
        const itemTotal = calculateGrandTotal(inv);
        const isActive = inv.id === activeInvoiceId;

        // Stamp colored badges
        const badgeColors = {
          PAID: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          UNPAID: 'bg-red-50 text-red-600 border border-red-100',
          PENDING: 'bg-amber-50 text-amber-600 border border-amber-100',
        }[inv.status] || 'bg-slate-50 text-slate-600 border border-slate-100';

        const itemCard = document.createElement('div');
        itemCard.className = \`group relative p-3 rounded-lg border text-left cursor-pointer transition-all hover:bg-slate-50 \${isActive ? 'bg-slate-50 border-emerald-400' : 'bg-white border-slate-200'}\`;
        
        // Block to ignore action trigger bubbling on delete
        itemCard.innerHTML = \`
          <div onclick="selectInvoice('\${inv.id}')" class="space-y-1.5 pr-8">
            <div class="flex items-center gap-1.5">
              <span class="font-mono text-xs font-bold text-slate-800 leading-none">\${inv.invoiceNumber}</span>
              <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded leading-none uppercase \${badgeColors}">\${inv.status}</span>
            </div>
            <h4 class="text-xs font-bold text-slate-600 truncate leading-tight">\${inv.clientName || 'Valued Client'}</h4>
            <div class="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>\${inv.invoiceDate || '-'}</span>
              <span class="font-bold text-[#2ecc71]">\${formatBDT(itemTotal)}</span>
            </div>
          </div>
          <button onclick="deleteInvoice(event, '\${inv.id}')" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer" title="Delete record">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        \`;
        container.appendChild(itemCard);
      });
    }

    function selectInvoice(id) {
      const inv = invoices.find(i => i.id === id);
      if (inv) {
        currentInvoice = JSON.parse(JSON.stringify(inv));
        activeInvoiceId = id;
        localStorage.setItem('abstract_digital_draft', JSON.stringify(inv));
        
        mapInvoiceToForm();
        updatePreview();
        renderHistory();
      }
    }

    function deleteInvoice(e, id) {
      e.stopPropagation();
      const double = confirm('Are you sure you want to delete this invoice permanently from your master files?');
      if (double) {
        invoices = invoices.filter(i => i.id !== id);
        localStorage.setItem('abstract_digital_invoices', JSON.stringify(invoices));
        
        if (currentInvoice.id === id) {
          createNewInvoice();
        } else {
          renderHistory();
        }
      }
    }

    function createNewInvoice() {
      const storedCounter = localStorage.getItem('abstract_digital_invoice_counter') || '1001';
      
      currentInvoice = {
        id: uuidv4(),
        invoiceNumber: 'AD-' + storedCounter,
        clientName: '',
        clientAddress: '',
        clientCity: '',
        clientCountry: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 14);
          return d.toISOString().split('T')[0];
        })(),
        lineItems: [],
        discount: 0,
        tax: 0,
        paymentMethod: 'SSLCommerz',
        transactionReference: '',
        status: 'UNPAID',
        notes: 'Please clear this invoice. Domain and server renewals must be paid in full prior to active terms.'
      };

      activeInvoiceId = '';
      localStorage.removeItem('abstract_digital_draft');
      
      mapInvoiceToForm();
      updatePreview();
      renderHistory();
    }

    function calculateGrandTotal(inv) {
      const subtotal = inv.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
      const discountAmount = subtotal * ((inv.discount || 0) / 100);
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = taxableAmount * ((inv.tax || 0) / 100);
      return taxableAmount + taxAmount;
    }

    // Modal view controller
    function toggleLedgerModal(open) {
      const m = document.getElementById('ledger-modal');
      if (open) {
        m.classList.remove('hidden');
        renderLedgerTable();
      } else {
        m.classList.add('hidden');
      }
    }

    function setLedgerFilter(filter) {
      ledgerFilter = filter;
      
      // Update UI button background classes
      ['ALL', 'PAID', 'UNPAID', 'PENDING'].forEach(f => {
        const btn = document.getElementById('lf-' + f.toLowerCase());
        if (f === filter) {
          btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all " + {
            ALL: 'bg-slate-850', PAID: 'bg-emerald-500', UNPAID: 'bg-red-500', PENDING: 'bg-amber-500'
          }[f];
        } else {
          btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all";
        }
      });

      renderLedgerTable();
    }

    // Render Stats dashboard table list
    function renderLedgerTable() {
      const searchStr = document.getElementById('ledger-search').value.toLowerCase();
      const rowsHolder = document.getElementById('ledger-table-rows');
      rowsHolder.innerHTML = '';

      let totalBilled = 0;
      let totalReceived = 0;
      let totalOutstanding = 0;
      let relativeClients = new Set();

      invoices.forEach(inv => {
        const t = calculateGrandTotal(inv);
        totalBilled += t;
        if (inv.status === 'PAID') totalReceived += t;
        else totalOutstanding += t;

        if (inv.clientName) relativeClients.add(inv.clientName.trim().toLowerCase());
      });

      document.getElementById('meta-count').textContent = invoices.length;
      document.getElementById('meta-billed').textContent = formatBDT(totalBilled).replace('.00', '');
      document.getElementById('meta-received').textContent = formatBDT(totalReceived).replace('.00', '');
      document.getElementById('meta-due').textContent = formatBDT(totalOutstanding).replace('.00', '');
      document.getElementById('meta-clients').textContent = relativeClients.size;

      const filtered = invoices.filter(inv => {
        const statusMatch = ledgerFilter === 'ALL' || inv.status === ledgerFilter;
        const textMatch = (inv.invoiceNumber || '').toLowerCase().includes(searchStr) || 
                          (inv.clientName || '').toLowerCase().includes(searchStr);
        return statusMatch && textMatch;
      });

      if (filtered.length === 0) {
        rowsHolder.innerHTML = \`<tr>
          <td colspan="7" class="py-12 text-center text-slate-400 italic">No ledger reports match filters.</td>
        </tr>\`;
        return;
      }

      filtered.forEach(inv => {
        const total = calculateGrandTotal(inv);
        const statusColors = {
          PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          UNPAID: 'bg-red-100 text-red-800 border-red-200',
          PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
        }[inv.status] || 'bg-slate-100 text-slate-700 border-slate-200';

        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50";
        tr.innerHTML = \`
          <td class="py-3 px-4 font-mono font-bold text-slate-800">\${inv.invoiceNumber}</td>
          <td class="py-3 px-4 font-mono text-slate-450">\${inv.invoiceDate || '-'}</td>
          <td class="py-3 px-4 font-semibold text-slate-700 truncate max-w-[200px]">\${inv.clientName || 'Valued Client'}</td>
          <td class="py-3 px-4 font-mono font-bold text-slate-900">\${formatBDT(total)}</td>
          <td class="py-3 px-4">
            <span class="px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase border \${statusColors}">\${inv.status}</span>
          </td>
          <td class="py-3 px-4 text-slate-600 font-medium">\${inv.paymentMethod}</td>
          <td class="py-3 px-4 font-mono text-slate-450 bg-slate-50">\${inv.transactionReference || 'None'}</td>
        \`;
        rowsHolder.appendChild(tr);
      });
    }

    // Export Excel sheets workbook
    function exportWorkbookExcel() {
      if (invoices.length === 0) {
        alert('Master ledger table has no invoices recorded yet.');
        return;
      }

      const wb = XLSX.utils.book_new();

      // Form 1: Master General Table ledger sheet index
      const ledgerRows = invoices.map(inv => {
        const sub = inv.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        const billLines = inv.lineItems.map(b => \`\${b.description || 'Service'} (\${b.quantity}x৳\${b.unitPrice})\`).join(', ');

        return {
          'Invoice Number': inv.invoiceNumber,
          'Issue Date': inv.invoiceDate,
          'Due Date': inv.dueDate,
          'Client Name': inv.clientName || 'Valued Client',
          'Sender Address': 'Abstract Digital, Chattogram, Bangladesh',
          'Client Location': \`\${inv.clientAddress || ''}, \s\${inv.clientCity || ''}, \s\${inv.clientCountry || ''}\`,
          'Line Items Detail': billLines || 'No bills',
          'Subtotal (BDT)': sub,
          'Discount (%)': inv.discount,
          'VAT / Tax (%)': inv.tax,
          'Cumulative Total (BDT)': calculateGrandTotal(inv),
          'Bill Status': inv.status,
          'Payment Gateway': inv.paymentMethod,
          'Gateway Transaction ID': inv.transactionReference || 'N/A'
        };
      });

      const wsLedger = XLSX.utils.json_to_sheet(ledgerRows);
      XLSX.utils.book_append_sheet(wb, wsLedger, 'Master Ledger');

      // Form 2: Loaded client breakdown detail
      const currentSub = currentInvoice.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
      const currentTotal = calculateGrandTotal(currentInvoice);

      const headerBlock = [
        { A: 'ABSTRACT DIGITAL OFFLINE PRINT REPORT', B: '', C: '', D: '' },
        { A: 'Invoice ID', B: currentInvoice.invoiceNumber, C: 'Generated Date', D: currentInvoice.invoiceDate },
        { A: 'Sender Info', B: 'Abstract Digital, Chattogram', C: 'Due Date', D: currentInvoice.dueDate },
        { A: 'Client Business Account', B: currentInvoice.clientName || 'N/A', C: 'Payment Stamp', D: currentInvoice.status },
        { A: 'Selected Gateway', B: currentInvoice.paymentMethod, C: 'Ref Code', D: currentInvoice.transactionReference || 'N/A' },
        { A: '', B: '', C: '', D: '' },
        { A: 'Description of Service/Product', B: 'Quantity', C: 'Unit Price (BDT)', D: 'Total (BDT)' }
      ];

      const itemLines = currentInvoice.lineItems.map(item => ({
        A: item.description || 'Unnamed Service',
        B: item.quantity,
        C: item.unitPrice,
        D: item.quantity * item.unitPrice
      }));

      const mathBlocks = [
        { A: '', B: '', C: '', D: '' },
        { A: '', B: '', C: 'Billed Subtotal:', D: currentSub },
        { A: '', B: '', C: \`Percentage Discount (\${currentInvoice.discount}%):\`, D: currentSub * (currentInvoice.discount / 100) },
        { A: '', B: '', C: \`Percentage VAT/Tax (\s\${currentInvoice.tax || 0}%):\`, D: (currentSub - currentSub * (currentInvoice.discount / 100)) * ((currentInvoice.tax || 0)/100) },
        { A: '', B: '', C: 'Grand Net Total BDT:', D: currentTotal }
      ];

      const finalRows = [...headerBlock, ...itemLines, ...mathBlocks];
      const wsDetail = XLSX.utils.json_to_sheet(finalRows, { skipHeader: true });
      XLSX.utils.book_append_sheet(wb, wsDetail, 'Selected Invoice Breakdown');

      // Form 3: Summary analytical sheet
      const uniqueClin = Array.from(new Set(invoices.map(i => i.clientName.trim()))).filter(Boolean);
      
      let billSum = 0, receivedSum = 0, dueSum = 0;
      invoices.forEach(i => {
        const val = calculateGrandTotal(i);
        billSum += val;
        if (i.status === 'PAID') receivedSum += val;
        else dueSum += val;
      });

      const summaries = [
        { 'General Metric': 'Total Saved Invoice Cards', 'Value / BDT': invoices.length },
        { 'General Metric': 'Cumulative Invoiced Capital (BDT)', 'Value / BDT': billSum },
        { 'General Metric': 'Effective Handed Cash (BDT)', 'Value / BDT': receivedSum },
        { 'General Metric': 'Cumulative Accounts Outstanding (BDT)', 'Value / BDT': dueSum },
        { 'General Metric': 'Total Corporate Accounts Size', 'Value / BDT': uniqueClin.length },
        { 'General Metric': '', 'Value / BDT': '' },
        { 'General Metric': 'REGISTERED CORPORATE ACCOUNTS DIRECTORY:', 'Value / BDT': '' },
        ...uniqueClin.map(c => ({ 'General Metric': 'Business Label', 'Value / BDT': c }))
      ];

      const wsSummary = XLSX.utils.json_to_sheet(summaries);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Ledger Summary Dashboard');

      XLSX.writeFile(wb, 'Abstract_Digital_Master_Ledger_Report.xlsx');
    }

    function clearAllLedgerData() {
      const confirmFirst = confirm('CRITICAL WARNING: This will permanently wipe out all registered invoice history cards & resets the counter back to index 1001. This is irreversible!');
      if (confirmFirst) {
        localStorage.removeItem('abstract_digital_invoices');
        localStorage.setItem('abstract_digital_invoice_counter', '1001');
        
        invoices = [];
        toggleLedgerModal(false);
        createNewInvoice();
        alert('All saved master databases ledger was wiped cleanly.');
      }
    }
  </script>

</body>
</html>
`;
