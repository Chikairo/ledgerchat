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
  Copy,
  Check,
  ExternalLink,
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
  const [filterTab, setFilterTab] = useState<'all' | 'debtors' | 'top_buyers'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopyReminder = (e: React.MouseEvent, cust: Customer) => {
    e.stopPropagation();
    const reminderText = `Good day ${cust.name}! Hope you are having a blessed week. This is a gentle reminder regarding your outstanding balance of ₦${cust.outstandingBalance.toLocaleString()} with our shop. Kindly let us know once you make the transfer so we can confirm it. Thank you so much!`;
    navigator.clipboard.writeText(reminderText);
    setCopiedId(cust.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    let list = [...customers];

    if (filterTab === 'debtors') {
      list = list.filter((c) => c.outstandingBalance > 0);
      list.sort((a, b) => b.outstandingBalance - a.outstandingBalance);
    } else if (filterTab === 'top_buyers') {
      list.sort((a, b) => b.totalSpent - a.totalSpent);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.notes?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [customers, filterTab, searchQuery]);

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
        <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">Customers & Debts</h1>
        <p className="text-xs text-[#718078] mt-0.5">
          See who buys the most goods, who still owes you money, and easily send WhatsApp payment reminders.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Customers</span>
          <div className="text-2xl font-extrabold text-[#19251F] mt-1">{summary.total}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Chatted with your shop</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Repeat Customers</span>
          <div className="text-2xl font-extrabold text-[#145C42] mt-1">{summary.returning}</div>
          <span className="text-[11px] text-[#145C42] font-semibold mt-0.5 block">
            {summary.total > 0 ? Math.round((summary.returning / summary.total) * 100) : 0}% came back to buy
          </span>
        </div>

        <div
          onClick={() => setFilterTab('debtors')}
          className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs cursor-pointer hover:bg-amber-100/70 transition-colors"
        >
          <span className="text-xs font-bold text-amber-900 block">Customers Owing You</span>
          <div className="text-2xl font-extrabold text-[#E9A23B] mt-1">{summary.debtorsCount}</div>
          <span className="text-[11px] text-amber-800 font-bold mt-0.5 block">
            ₦{summary.totalOwed.toLocaleString()} total debt
          </span>
        </div>

        <div
          onClick={() => setFilterTab('top_buyers')}
          className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs cursor-pointer hover:bg-emerald-100/70 transition-colors"
        >
          <span className="text-xs font-bold text-emerald-900 block">Top Buyer</span>
          <div className="text-base font-extrabold text-slate-900 mt-1 truncate">
            {summary.topSpender ? summary.topSpender.name : 'N/A'}
          </div>
          <span className="text-[11px] text-[#168653] font-bold mt-0.5 block">
            ₦{summary.topSpender ? summary.topSpender.totalSpent.toLocaleString() : 0} paid
          </span>
        </div>
      </div>

      {/* Main Grid: Customer List and Selected Profile Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          {/* Search & Filter Tabs Toolbar */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterTab('all')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-[#145C42] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Customers ({customers.length})
              </button>
              <button
                onClick={() => setFilterTab('debtors')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  filterTab === 'debtors'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>Owing Money</span>
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">
                  {summary.debtorsCount}
                </span>
              </button>
              <button
                onClick={() => setFilterTab('top_buyers')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  filterTab === 'top_buyers'
                    ? 'bg-[#145C42] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Top Buyers (Spent Most)
              </button>
            </div>

            <div className="relative">
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
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No customers match this filter.
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                const isSelected = selectedCustomerId === cust.id;
                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer ${
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
                              Repeat Buyer
                            </span>
                          )}
                          {cust.outstandingBalance > 0 && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                              Owes ₦{cust.outstandingBalance.toLocaleString()}
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

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block text-right">
                          ₦{cust.totalSpent.toLocaleString()} paid
                        </span>
                        <span className="text-[10px] text-slate-500 block text-right">
                          {cust.totalOrders} order{cust.totalOrders > 1 ? 's' : ''}
                        </span>
                      </div>

                      {cust.outstandingBalance > 0 && (
                        <button
                          onClick={(e) => handleCopyReminder(e, cust)}
                          className="mt-1 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold shadow-2xs transition-colors cursor-pointer"
                          title="Copy polite WhatsApp reminder text"
                        >
                          {copiedId === cust.id ? (
                            <>
                              <Check className="w-3 h-3 text-white" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Reminder</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
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
                    Total Paid
                  </span>
                  <span className="text-sm font-bold text-[#168653]">
                    ₦{selectedCustomer.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Unpaid Balance
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

              {/* Debt Collection Reminder Box */}
              {selectedCustomer.outstandingBalance > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-600" />
                      Owes ₦{selectedCustomer.outstandingBalance.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Payment Overdue
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-tight">
                    Send a polite payment reminder directly to {selectedCustomer.name} on WhatsApp.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={(e) => handleCopyReminder(e, selectedCustomer)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      {copiedId === selectedCustomer.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Reminder Message!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy WhatsApp Reminder</span>
                        </>
                      )}
                    </button>
                    {selectedCustomer.phone && (
                      <a
                        href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Good day ${selectedCustomer.name}! Trust business is going well. Just a gentle reminder regarding your balance of ₦${selectedCustomer.outstandingBalance.toLocaleString()} with our shop. Kindly let us know once you transfer. Thank you!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Notes */}
              {selectedCustomer.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Customer Profile & Habits:
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
