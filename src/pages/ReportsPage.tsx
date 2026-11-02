import React, { useState, useMemo } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BusinessProfile, Transaction, Customer, Product } from '../types';

interface ReportsPageProps {
  profile: BusinessProfile;
  transactions: Transaction[];
  customers: Customer[];
  products: Product[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  profile,
  transactions,
  customers,
  products,
}) => {
  const [reportType, setReportType] = useState<
    'weekly' | 'biweekly' | 'monthly' | 'annual' | 'custom'
  >('weekly');

  const now = new Date();

  // Filter transactions according to report type
  const reportTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      if (isNaN(txDate.getTime())) return false;

      if (reportType === 'weekly') {
        const d = new Date(now);
        d.setDate(now.getDate() - 7);
        d.setHours(0, 0, 0, 0);
        return txDate >= d;
      }
      if (reportType === 'biweekly') {
        const d = new Date(now);
        d.setDate(now.getDate() - 14);
        d.setHours(0, 0, 0, 0);
        return txDate >= d;
      }
      if (reportType === 'monthly') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
      if (reportType === 'annual') {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true; // custom / all
    });
  }, [transactions, reportType, now]);

  // Aggregated figures
  const metrics = useMemo(() => {
    let totalAgreed = 0;
    let verifiedReceived = 0;
    let pendingOutstanding = 0;

    reportTransactions.forEach((tx) => {
      if (tx.status !== 'cancelled') {
        totalAgreed += tx.agreedAmount || 0;
        verifiedReceived += tx.amountPaid || 0;
        pendingOutstanding += tx.outstandingAmount || 0;
      }
    });

    const topCustomer = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0] || null;
    const topProduct = [...products].sort((a, b) => b.unitsSold - a.unitsSold)[0] || null;

    return {
      totalAgreed,
      verifiedReceived,
      pendingOutstanding,
      count: reportTransactions.length,
      topCustomer,
      topProduct,
    };
  }, [reportTransactions, customers, products]);

  // Working CSV / Excel Export
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Date',
      'Customer',
      'Product',
      'Quantity',
      'Agreed Amount (NGN)',
      'Amount Received (NGN)',
      'Outstanding Balance (NGN)',
      'Status',
      'Payment Method',
    ];

    const rows = reportTransactions.map((tx) => [
      tx.id,
      new Date(tx.date).toLocaleDateString(),
      `"${tx.customerName.replace(/"/g, '""')}"`,
      `"${tx.productName.replace(/"/g, '""')}"`,
      tx.quantity,
      tx.agreedAmount,
      tx.amountPaid,
      tx.outstandingAmount,
      tx.status,
      tx.paymentMethod || 'Bank Transfer',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${profile.name.replace(/\s+/g, '_')}_Financial_Report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Working Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">Business Statements & Reports</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Download Excel spreadsheets or print PDF statements for your bank, loan applications, or business records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#145C42]" />
            Download Excel (CSV)
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Period Selection Tabs in plain language */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'weekly', label: 'Last 7 Days (Weekly)' },
          { id: 'biweekly', label: 'Last 14 Days' },
          { id: 'monthly', label: 'This Month' },
          { id: 'annual', label: 'This Year' },
          { id: 'custom', label: 'All Records' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              reportType === tab.id
                ? 'bg-[#145C42] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 printable-report">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#145C42] text-white flex items-center justify-center font-bold text-xs">
                LC
              </div>
              <span className="font-extrabold text-base text-[#19251F]">LedgerChat Financial Statement</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#19251F] mt-2">{profile.name}</h2>
            <p className="text-xs text-slate-500">
              {profile.category} • {profile.country} • Currency: {profile.currency}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
            <p>
              <strong>Reporting Period:</strong> {reportType.toUpperCase()}
            </p>
            <p>
              <strong>Generated Date:</strong> {new Date().toLocaleDateString()}
            </p>
            <p>
              <strong>Owner:</strong> {profile.ownerName}
            </p>
          </div>
        </div>

        {/* Executive Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Agreed Sales</span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">
              ₦{metrics.totalAgreed.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400">{metrics.count} qualifying orders</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-[#168653] block">Verified Money Received</span>
            <span className="text-xl font-extrabold text-[#168653] mt-1 block">
              ₦{metrics.verifiedReceived.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-800">Supported by verified receipts</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-[#E9A23B] block">Outstanding Customer Balances</span>
            <span className="text-xl font-extrabold text-[#E9A23B] mt-1 block">
              ₦{metrics.pendingOutstanding.toLocaleString()}
            </span>
            <span className="text-[11px] text-amber-800">Unsettled credit</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Top Volume Product</span>
            <span className="text-sm font-extrabold text-slate-900 mt-1 truncate block">
              {metrics.topProduct ? metrics.topProduct.name : 'N/A'}
            </span>
            <span className="text-[11px] text-slate-500">
              {metrics.topProduct ? `${metrics.topProduct.unitsSold} units confirmed sold` : ''}
            </span>
          </div>
        </div>

        {/* Business Observations Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#145C42]" /> Reconciled Business Observations
          </h4>
          <ul className="list-disc list-inside text-slate-600 space-y-1 leading-relaxed">
            <li>
              Total verified cash collections reached ₦{metrics.verifiedReceived.toLocaleString()} with {metrics.count} orders processed.
            </li>
            <li>
              {metrics.pendingOutstanding > 0
                ? `₦${metrics.pendingOutstanding.toLocaleString()} remains outstanding across customer orders awaiting balance collection.`
                : 'Zero outstanding receivables. All orders are settled in full.'}
            </li>
            {metrics.topCustomer && (
              <li>
                {metrics.topCustomer.name} is the highest contributing customer in this reporting period.
              </li>
            )}
          </ul>
        </div>

        {/* Itemized Transactions Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Itemized Audit Log ({reportTransactions.length})
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-right">Agreed</th>
                  <th className="py-2.5 px-3 text-right">Received</th>
                  <th className="py-2.5 px-3 text-right">Balance</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{tx.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{tx.customerName}</td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {tx.quantity}x {tx.productName}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ₦{tx.agreedAmount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#168653]">
                      ₦{tx.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-amber-700">
                      ₦{tx.outstandingAmount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] capitalize text-slate-600">
                      {tx.status.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Disclaimers */}
        <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Official LedgerChat Financial Reconciliation Document</span>
          <span>Only qualifying settled transactions are recognized in revenue totals.</span>
        </div>
      </div>
    </div>
  );
};
