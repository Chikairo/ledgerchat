import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  ArrowUpDown,
  Download,
  Plus,
  Calendar,
  Layers,
  ChevronDown,
  X,
  FileCheck,
} from 'lucide-react';
import { Transaction, Customer, Product } from '../types';

interface TransactionsPageProps {
  transactions: Transaction[];
  customers: Customer[];
  products: Product[];
  onSelectTransaction: (transaction: Transaction) => void;
  onOpenProofModal: (transaction: Transaction) => void;
  onAddNewManualTransaction?: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  customers,
  products,
  onSelectTransaction,
  onOpenProofModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCustomer = tx.customerName.toLowerCase().includes(q);
          const matchProduct = tx.productName.toLowerCase().includes(q);
          const matchId = tx.id.toLowerCase().includes(q);
          const matchPhone = tx.customerPhone?.toLowerCase().includes(q);
          if (!matchCustomer && !matchProduct && !matchId && !matchPhone) return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          if (statusFilter === 'needs_review') {
            if (!tx.requiresReview && tx.status !== 'needs_review') return false;
          } else if (tx.status !== statusFilter) {
            return false;
          }
        }

        // Customer filter
        if (customerFilter !== 'all' && tx.customerName !== customerFilter) {
          return false;
        }

        // Product filter
        if (productFilter !== 'all' && tx.productName !== productFilter) {
          return false;
        }

        // Date filter
        if (dateFilter !== 'all') {
          const txDate = new Date(tx.date);
          const now = new Date();
          if (dateFilter === '7days') {
            const d = new Date();
            d.setDate(now.getDate() - 7);
            if (txDate < d) return false;
          } else if (dateFilter === '30days') {
            const d = new Date();
            d.setDate(now.getDate() - 30);
            if (txDate < d) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'amount_desc') return b.agreedAmount - a.agreedAmount;
        if (sortBy === 'amount_asc') return a.agreedAmount - b.agreedAmount;
        return 0;
      });
  }, [transactions, searchQuery, statusFilter, customerFilter, productFilter, dateFilter, sortBy]);

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
      case 'merchant_confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#168653] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E9A23B] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3" /> Partial
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D94C4C] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <AlertTriangle className="w-3 h-3" /> Needs Review
          </span>
        );
      case 'payment_claimed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <FileCheck className="w-3 h-3" /> Claimed Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            {status.replace('_', ' ')}
          </span>
        );
    }
  };

  const hasActiveFilters =
    statusFilter !== 'all' || customerFilter !== 'all' || productFilter !== 'all' || dateFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setStatusFilter('all');
    setCustomerFilter('all');
    setProductFilter('all');
    setDateFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Title & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">Transactions</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Manage, verify receipts, and track payment settlements from your business chats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Showing {filteredTransactions.length} of {transactions.length} orders
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by customer name, phone, product, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#145C42]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'completed', label: 'Completed' },
              { id: 'partially_paid', label: 'Partial Paid' },
              { id: 'needs_review', label: 'Needs Review' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#145C42] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters: Customer, Product, Date, Sort */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Customer select */}
          <select
            aria-label="Filter by Customer"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Product select */}
          <select
            aria-label="Filter by Product"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Date range */}
          <select
            aria-label="Filter by Date Range"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>

          {/* Sort */}
          <select
            aria-label="Sort transactions"
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none ml-auto"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Product / Qty</th>
              <th className="py-3 px-4 text-right">Agreed Total</th>
              <th className="py-3 px-4 text-right">Paid</th>
              <th className="py-3 px-4 text-right">Balance</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Proof of Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="max-w-sm mx-auto space-y-2">
                    <p className="font-semibold text-slate-600">No transactions match your filter</p>
                    <p className="text-[11px]">
                      Try clearing your search terms or adjusting the status/date range filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-[#145C42] transition-colors">
                      {tx.customerName}
                    </div>
                    {tx.customerPhone && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {tx.customerPhone}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">
                      {tx.quantity}x {tx.productName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ₦{tx.agreedAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#168653]">
                    ₦{tx.amountPaid.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold">
                    <span className={tx.outstandingAmount > 0 ? 'text-[#E9A23B]' : 'text-slate-400'}>
                      ₦{tx.outstandingAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProofModal(tx);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F4ED] hover:bg-emerald-200/80 text-[#145C42] font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Proof
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            onClick={() => onSelectTransaction(tx)}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-mono text-slate-500">{tx.id}</span>
              <div>{getStatusBadge(tx.status)}</div>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{tx.customerName}</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {tx.quantity}x {tx.productName}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {new Date(tx.date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 block">
                  ₦{tx.agreedAmount.toLocaleString()}
                </span>
                {tx.outstandingAmount > 0 && (
                  <span className="text-[10px] text-[#E9A23B] font-semibold block">
                    ₦{tx.outstandingAmount.toLocaleString()} balance
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Paid: <strong className="text-[#168653]">₦{tx.amountPaid.toLocaleString()}</strong>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProofModal(tx);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-[#145C42] bg-[#E8F4ED] px-2.5 py-1 rounded-lg"
              >
                <Eye className="w-3.5 h-3.5" />
                Proof
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
