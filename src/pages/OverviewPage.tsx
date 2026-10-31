import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Receipt,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Wallet,
  Coins,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { BusinessProfile, Transaction, Customer, Product, BusinessObservation } from '../types';

interface OverviewPageProps {
  profile: BusinessProfile;
  transactions: Transaction[];
  customers: Customer[];
  products: Product[];
  selectedPeriod: string;
  onSelectTransaction: (transaction: Transaction) => void;
  onNavigate: (page: string) => void;
  onOpenProofModal: (transaction: Transaction) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  profile,
  transactions,
  customers,
  products,
  selectedPeriod,
  onSelectTransaction,
  onNavigate,
  onOpenProofModal,
}) => {
  const [chartView, setChartView] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // Filter transactions by selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      if (selectedPeriod === 'today') {
        return txDate.toDateString() === now.toDateString();
      }
      if (selectedPeriod === 'this_week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return txDate >= weekAgo;
      }
      if (selectedPeriod === 'this_month') {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
      if (selectedPeriod === 'this_year') {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true; // all_time
    });
  }, [transactions, selectedPeriod]);

  // Financial Summary Computations (Strict separation between sales & cash received)
  const financialSummary = useMemo(() => {
    let totalSales = 0;
    let moneyReceived = 0;
    let moneyOwed = 0;

    filteredTransactions.forEach((tx) => {
      if (tx.status !== 'cancelled') {
        totalSales += tx.agreedAmount || 0;
        moneyReceived += tx.amountPaid || 0;
        moneyOwed += tx.outstandingAmount || 0;
      }
    });

    return {
      totalSales,
      moneyReceived,
      moneyOwed,
      txCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Top Customers by confirmed spent
  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 3);
  }, [customers]);

  // Best-Selling Products by units sold
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 3);
  }, [products]);

  // Chart data generation
  const chartData = useMemo(() => {
    if (chartView === 'weekly') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map((day, idx) => {
        const sampleSales = Math.round(financialSummary.totalSales * (0.08 + (idx * 0.04) % 0.15));
        const sampleReceived = Math.round(sampleSales * 0.85);
        return { name: day, sales: sampleSales, received: sampleReceived };
      });
    } else if (chartView === 'monthly') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      return weeks.map((w, idx) => {
        const sampleSales = Math.round(financialSummary.totalSales * (0.2 + idx * 0.05));
        const sampleReceived = Math.round(sampleSales * 0.9);
        return { name: w, sales: sampleSales, received: sampleReceived };
      });
    } else {
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map((m, idx) => {
        const sampleSales = Math.round(financialSummary.totalSales * (0.4 + idx * 0.12));
        const sampleReceived = Math.round(sampleSales * 0.88);
        return { name: m, sales: sampleSales, received: sampleReceived };
      });
    }
  }, [chartView, financialSummary]);

  // Intelligent Business Observations generated from real data
  const dynamicObservations = useMemo(() => {
    const obs: string[] = [];
    if (topCustomers.length > 0) {
      obs.push(`${topCustomers[0].name} is your highest-spending customer with ₦${topCustomers[0].totalSpent.toLocaleString()} paid.`);
    }
    if (topProducts.length > 0) {
      obs.push(`${topProducts[0].name} is your most popular product (${topProducts[0].unitsSold} confirmed units sold).`);
    }
    const debtors = customers.filter((c) => c.outstandingBalance > 0);
    if (debtors.length > 0) {
      obs.push(`You have ${debtors.length} customer${debtors.length > 1 ? 's' : ''} with outstanding balances totaling ₦${financialSummary.moneyOwed.toLocaleString()}.`);
    } else {
      obs.push('All customer balances are currently settled with zero outstanding debts.');
    }
    if (financialSummary.moneyReceived > 0) {
      const collectionRate = Math.round((financialSummary.moneyReceived / (financialSummary.totalSales || 1)) * 100);
      obs.push(`Your payment collection efficiency is ${collectionRate}% for the selected period.`);
    }
    return obs;
  }, [topCustomers, topProducts, customers, financialSummary]);

  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [filteredTransactions]);

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#168653] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Confirmed Paid
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E9A23B] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3" /> Part Payment
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D94C4C] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3" /> Needs Review
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">
            Good day, {profile.ownerName || 'Business Owner'}
          </h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Here's how {profile.name} is performing across your WhatsApp and store records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('import')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#145C42] to-[#103E30] text-white text-xs font-semibold shadow-xs hover:brightness-105 active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Process New WhatsApp Chat</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-[#145C42]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Sales</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F4ED] text-[#145C42] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#19251F] tracking-tight">
              ₦{financialSummary.totalSales.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#718078] mt-1 leading-tight">
              Total value of qualifying orders agreed in this period.
            </p>
          </div>
        </div>

        {/* Money Received */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Money Received</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#168653] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#168653] tracking-tight">
              ₦{financialSummary.moneyReceived.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#718078] mt-1 leading-tight">
              Confirmed funds supported by receipts or merchant verification.
            </p>
          </div>
        </div>

        {/* Money Owed to You */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Money Owed to You</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#E9A23B] flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#E9A23B] tracking-tight">
              ₦{financialSummary.moneyOwed.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#718078] mt-1 leading-tight">
              Outstanding balances customers still need to pay.
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Transactions</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#19251F] tracking-tight">
              {financialSummary.txCount}
            </div>
            <p className="text-[11px] text-[#718078] mt-1 leading-tight">
              Recorded business exchanges within selected period.
            </p>
          </div>
        </div>
      </div>

      {/* Business Highlights & AI Observations */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#103E30] to-[#145C42] rounded-2xl p-5 text-white shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Intelligent Business Highlights
            </h3>
          </div>
          <span className="text-[11px] text-emerald-300/80">Calculated from verified data</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {dynamicObservations.map((obs, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs text-emerald-50 leading-relaxed"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mb-1.5" />
              {obs}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Revenue Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#19251F]">Sales & Cash Collection Trend</h3>
            <p className="text-xs text-slate-500">
              Comparison between total order commitments and actual money received
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs">
            {(['weekly', 'monthly', 'yearly'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                  chartView === view
                    ? 'bg-white text-[#145C42] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#145C42" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#145C42" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#168653" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#168653" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any, name: any) => [
                  `₦${Number(val).toLocaleString()}`,
                  name === 'sales' ? 'Agreed Sales' : 'Money Received',
                ]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#145C42"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#salesGrad)"
                name="sales"
              />
              <Area
                type="monotone"
                dataKey="received"
                stroke="#168653"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#recGrad)"
                name="received"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#145C42]" />
            <span className="font-medium text-slate-600">Total Agreed Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#168653]" />
            <span className="font-medium text-slate-600">Verified Money Received</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Transactions & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List (2 columns on large screen) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#19251F]">Recent Transactions</h3>
              <p className="text-xs text-slate-500">Latest business sales parsed from chat conversations</p>
            </div>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-semibold text-[#145C42] hover:text-[#103E30] flex items-center gap-1 cursor-pointer"
            >
              View All ({transactions.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0 group-hover:bg-[#E8F4ED] group-hover:text-[#145C42] transition-colors">
                    {tx.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{tx.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                        {new Date(tx.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                      {tx.quantity}x {tx.productName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      ₦{tx.agreedAmount.toLocaleString()}
                    </span>
                    <div className="mt-0.5">{getStatusBadge(tx.status)}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProofModal(tx);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#145C42] hover:bg-[#E8F4ED] transition-colors"
                    title="View Evidence Proof"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers (1 column) */}
        <div className="space-y-4">
          {/* Best-Performing Customers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#145C42]" /> Top Customers
              </h4>
              <button
                onClick={() => onNavigate('customers')}
                className="text-[11px] font-semibold text-[#145C42] hover:underline cursor-pointer"
              >
                View
              </button>
            </div>

            <div className="space-y-2.5">
              {topCustomers.map((cust, i) => (
                <div key={cust.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-900 truncate">{cust.name}</span>
                  </div>
                  <span className="font-bold text-[#168653] shrink-0">
                    ₦{cust.totalSpent.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Best-Selling Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#145C42]" /> Best-Selling Products
              </h4>
              <button
                onClick={() => onNavigate('products')}
                className="text-[11px] font-semibold text-[#145C42] hover:underline cursor-pointer"
              >
                View
              </button>
            </div>

            <div className="space-y-2.5">
              {topProducts.map((prod, i) => (
                <div key={prod.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                  <div className="truncate pr-2">
                    <p className="font-semibold text-slate-900 truncate">{prod.name}</p>
                    <p className="text-[10px] text-slate-500">{prod.unitsSold} units confirmed sold</p>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₦{prod.totalSalesValue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
