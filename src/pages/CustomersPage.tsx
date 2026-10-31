import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  UserCheck,
  Coins,
  ArrowUpRight,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  Clock,
  ChevronRight,
  X,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { Customer, Transaction, Conversation } from '../types';

interface CustomersPageProps {
  customers: Customer[];
  transactions: Transaction[];
  conversations: Conversation[];
  onSelectTransaction: (transaction: Transaction) => void;
  onNavigateToChat?: (customerName: string) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  transactions,
  conversations,
  onSelectTransaction,
  onNavigateToChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Computed summary metrics
  const summary = useMemo(() => {
    const total = customers.length;
    const returning = customers.filter((c) => c.totalOrders > 1).length;
    const debtors = customers.filter((c) => c.outstandingBalance > 0);
    const totalOwed = debtors.reduce((acc, c) => acc + c.outstandingBalance, 0);

    const sortedBySpend = [...customers].sort((a, b) => b.totalSpent - a.totalSpent);
    const topSpender = sortedBySpend[0] || null;

    const sortedByOrders = [...customers].sort((a, b) => b.totalOrders - a.totalOrders);
    const mostFrequent = sortedByOrders[0] || null;

    return {
      total,
      returning,
      debtorsCount: debtors.length,
      totalOwed,
      topSpender,
      mostFrequent,
    };
  }, [customers]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.notes?.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  // Selected customer details
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const customerTransactions = useMemo(() => {
    if (!selectedCustomer) return [];
    return transactions.filter(
      (t) => t.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
    );
  }, [selectedCustomer, transactions]);

  const customerConversations = useMemo(() => {
    if (!selectedCustomer) return [];
    return conversations.filter(
      (conv) => conv.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
    );
  }, [selectedCustomer, conversations]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">Customer Intelligence</h1>
        <p className="text-xs text-[#718078] mt-0.5">
          Track purchasing patterns, repeat buyers, and outstanding credit across all your customers.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Customers</span>
          <div className="text-2xl font-extrabold text-[#19251F] mt-1">{summary.total}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Identified in chats</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Repeat Buyers</span>
          <div className="text-2xl font-extrabold text-[#145C42] mt-1">{summary.returning}</div>
          <span className="text-[11px] text-[#145C42] font-semibold mt-0.5 block">
            {summary.total > 0 ? Math.round((summary.returning / summary.total) * 100) : 0}% loyalty rate
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-amber-800 block">Customers Owing You</span>
          <div className="text-2xl font-extrabold text-[#E9A23B] mt-1">{summary.debtorsCount}</div>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
            ₦{summary.totalOwed.toLocaleString()} outstanding
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 block">Top Buyer This Month</span>
          <div className="text-base font-extrabold text-slate-900 mt-1 truncate">
            {summary.topSpender ? summary.topSpender.name : 'N/A'}
          </div>
          <span className="text-[11px] text-[#168653] font-semibold mt-0.5 block">
            ₦{summary.topSpender ? summary.topSpender.totalSpent.toLocaleString() : 0} paid
          </span>
        </div>
      </div>

      {/* Main Grid: Customer List and Selected Profile Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          {/* Search Toolbar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers by name, phone or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#145C42]/20"
              />
            </div>
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
            {filteredCustomers.map((cust) => {
              const isSelected = selectedCustomerId === cust.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-4 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#E8F4ED]/60 border-l-4 border-[#145C42]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{cust.name}</h4>
                        {cust.totalOrders > 2 && (
                          <span className="text-[10px] bg-emerald-100 text-[#145C42] px-1.5 py-0.2 rounded font-semibold">
                            Frequent
                          </span>
                        )}
                        {cust.outstandingBalance > 0 && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                            Balance Due
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {cust.phone || 'Phone number not recorded'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {cust.notes || `${cust.totalOrders} order(s) placed`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 block">
                      ₦{cust.totalSpent.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {cust.totalOrders} order{cust.totalOrders > 1 ? 's' : ''}
                    </span>
                    {cust.outstandingBalance > 0 && (
                      <span className="text-[10px] text-[#E9A23B] font-bold block mt-0.5">
                        Owes ₦{cust.outstandingBalance.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          {selectedCustomer ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-base">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{selectedCustomer.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {selectedCustomer.phone || 'No phone number'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Total Spent
                  </span>
                  <span className="text-sm font-bold text-[#168653]">
                    ₦{selectedCustomer.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Outstanding
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      selectedCustomer.outstandingBalance > 0 ? 'text-[#E9A23B]' : 'text-slate-500'
                    }`}
                  >
                    ₦{selectedCustomer.outstandingBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedCustomer.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Customer Profile & Payment Habits:
                  </span>
                  <p className="text-slate-700 mt-1 leading-relaxed">{selectedCustomer.notes}</p>
                </div>
              )}

              {/* Purchase History */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Order & Transaction History ({customerTransactions.length})
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {customerTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{tx.productName}</p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(tx.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">
                          ₦{tx.agreedAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-700">
                          {tx.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Users className="w-12 h-12 text-slate-300 stroke-[1.5] mb-2" />
              <p className="text-xs font-semibold text-slate-600">Select a Customer</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Click any customer on the left to see their full purchase history, payment habits, and WhatsApp chat links.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
