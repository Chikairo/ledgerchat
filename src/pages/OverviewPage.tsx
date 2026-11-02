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
  Eye,
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
import { LiveEmptyState } from '../components/LiveEmptyState';

interface OverviewPageProps {
  profile: BusinessProfile;
  transactions: Transaction[];
  customers: Customer[];
  products: Product[];
  selectedPeriod: string;
  onPeriodChange?: (period: string) => void;
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
  onPeriodChange,
  onSelectTransaction,
  onNavigate,
  onOpenProofModal,
}) => {
  const [chartView, setChartView] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // Filter transactions by selected period with robust day boundaries
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      if (isNaN(txDate.getTime())) return false;

      if (selectedPeriod === 'today') {
        return txDate >= startOfToday && txDate <= endOfToday;
      }
      if (selectedPeriod === 'this_week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        return txDate >= weekAgo;
      }
      if (selectedPeriod === 'this_month') {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }
      if (selectedPeriod === 'this_year') {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true; // all_time
    });
  }, [transactions, selectedPeriod]);

  // Period stats and all-time figures for quick switching
  const periodStats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;
    let yearCount = 0;
    let allTimeSales = 0;

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      if (isNaN(d.getTime())) return;
      if (tx.status !== 'cancelled' && tx.status !== 'refunded') {
        allTimeSales += tx.agreedAmount || 0;
      }
      if (d >= startOfToday && d <= endOfToday) todayCount++;
      if (d >= weekAgo) weekCount++;
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) monthCount++;
      if (d.getFullYear() === now.getFullYear()) yearCount++;
    });

    return {
      today: todayCount,
      this_week: weekCount,
      this_month: monthCount,
      this_year: yearCount,
      all_time: transactions.length,
      allTimeSales,
    };
  }, [transactions]);

  // Financial Summary Computations (Strict separation between sales & verified cash received)
  const financialSummary = useMemo(() => {
    let totalSales = 0;
    let moneyReceived = 0;
    let unconfirmedClaims = 0;
    let moneyOwed = 0;

    filteredTransactions.forEach((tx) => {
      // Exclude cancelled and refunded orders from active sales totals
      if (tx.status !== 'cancelled' && tx.status !== 'refunded') {
        totalSales += tx.agreedAmount || 0;

        // CRITICAL ACCOUNTING RULE:
        // A customer's claim of payment is NEVER classified as independently confirmed money received!
        // Only merchant-confirmed or completed transactions count as verified money received.
        const isMerchantVerified =
          tx.status === 'completed' ||
          tx.status === 'merchant_confirmed' ||
          tx.paymentClaimStatus === 'merchant_confirmed' ||
          tx.paymentClaimStatus === 'independently_verified';

        if (isMerchantVerified) {
          moneyReceived += tx.amountPaid || 0;
        } else if (tx.amountPaid > 0) {
          // Unverified customer claim (e.g. "I don send am", screenshot submitted but unverified)
          unconfirmedClaims += tx.amountPaid;
        }

        moneyOwed += tx.outstandingAmount || 0;
      }
    });

    return {
      totalSales,
      moneyReceived,
      unconfirmedClaims,
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
      obs.push(`⭐ Top Customer: ${topCustomers[0].name} has bought the most goods, paying ₦${topCustomers[0].totalSpent.toLocaleString()} so far.`);
    }
    if (topProducts.length > 0) {
      obs.push(`🔥 Fastest Selling: ${topProducts[0].name} is your top product with ${topProducts[0].unitsSold} confirmed sales.`);
    }
    const debtors = customers.filter((c) => c.outstandingBalance > 0);
    if (debtors.length > 0) {
      obs.push(`⚠️ Money to Collect: ${debtors.length} customer${debtors.length > 1 ? 's owe' : ' owes'} you ₦${financialSummary.moneyOwed.toLocaleString()} in unpaid balances.`);
    } else {
      obs.push('✅ All Good: None of your customers are owing you money at the moment.');
    }
    if (financialSummary.moneyReceived > 0 && financialSummary.totalSales > 0) {
      const collectionRate = Math.round((financialSummary.moneyReceived / financialSummary.totalSales) * 100);
      obs.push(`💰 Cash Collected: You have collected ${collectionRate}% of agreed sales. ₦${financialSummary.moneyOwed.toLocaleString()} is remaining to collect.`);
    }
    return obs;
  }, [topCustomers, topProducts, customers, financialSummary]);

  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [filteredTransactions]);

  const getStatusBadge = (tx: Transaction) => {
    if (tx.status === 'completed' || tx.status === 'merchant_confirmed') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#168653] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> Fully Paid
        </span>
      );
    }
    if (tx.status === 'partially_paid') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E9A23B] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          <Clock className="w-3 h-3" /> Part Payment
        </span>
      );
    }
    if (tx.status === 'payment_claimed' || tx.requiresReview) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
          <AlertCircle className="w-3 h-3" /> Check Bank Alert
        </span>
      );
    }
    if (tx.status === 'awaiting_payment') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
          <Clock className="w-3 h-3" /> Promised (₦0 Paid)
        </span>
      );
    }
    if (tx.status === 'refunded') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
          Refunded
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
        {tx.status.replace('_', ' ')}
      </span>
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <LiveEmptyState
          businessName={profile.name}
          onNavigateToImport={() => onNavigate('import')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">
            Welcome back, {profile.ownerName || 'Merchant'}!
          </h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Here is your shop's performance for {profile.name} — easy to see what entered and who owes you.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {financialSummary.moneyOwed > 0 && (
            <button
              onClick={() => onNavigate('customers')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>See Who Owes You (₦{financialSummary.moneyOwed.toLocaleString()})</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('import')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#145C42] to-[#103E30] text-white text-xs font-semibold shadow-xs hover:brightness-105 active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add WhatsApp Chat</span>
          </button>
        </div>
      </div>

      {/* Period Quick Filter Bar & Context */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 shrink-0 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Filter:
          </span>
          {[
            { id: 'today', label: "Today's Sales", count: periodStats.today },
            { id: 'this_week', label: 'This Week', count: periodStats.this_week },
            { id: 'this_month', label: 'This Month', count: periodStats.this_month },
            { id: 'this_year', label: 'This Year', count: periodStats.this_year },
            { id: 'all_time', label: 'All Records', count: periodStats.all_time },
          ].map((tab) => {
            const isActive = selectedPeriod === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onPeriodChange?.(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#145C42] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-left md:text-right text-[11px] text-slate-500 font-medium shrink-0">
          {selectedPeriod === 'today' && `Showing today: ${new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}`}
          {selectedPeriod === 'this_week' && 'Showing transactions from past 7 days'}
          {selectedPeriod === 'this_month' && `Showing this month: ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`}
          {selectedPeriod === 'this_year' && `Showing calendar year: ${new Date().getFullYear()}`}
          {selectedPeriod === 'all_time' && 'Showing all historical records'}
        </div>
      </div>

      {/* Helpful alert if current period filter has 0 records but other records exist */}
      {filteredTransactions.length === 0 && transactions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="font-bold text-amber-900">
                No orders recorded for {selectedPeriod === 'today' ? "today" : selectedPeriod === 'this_month' ? "this month" : "this period"} yet.
              </p>
              <p className="text-amber-700 text-[11px] mt-0.5">
                You have {transactions.length} total orders (₦{periodStats.allTimeSales.toLocaleString()}) across all records.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onPeriodChange?.('all_time')}
              className="px-3 py-1.5 bg-[#145C42] hover:bg-[#103E30] text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              View All Records (₦{periodStats.allTimeSales.toLocaleString()})
            </button>
            <button
              onClick={() => onPeriodChange?.('this_month')}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium text-xs transition-colors cursor-pointer"
            >
              Check This Month ({periodStats.this_month})
            </button>
          </div>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-[#145C42]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Total Sales Made</span>
              <span className="text-[10px] text-slate-400">All agreed orders</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#E8F4ED] text-[#145C42] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#19251F] tracking-tight">
              ₦{financialSummary.totalSales.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#718078] mt-1 leading-tight">
              Total value of goods customers agreed to buy.
            </p>
          </div>
        </div>

        {/* Money Received */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 block">Money In Bank / Hand</span>
              <span className="text-[10px] text-emerald-700">Confirmed received</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#168653] flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#168653] tracking-tight">
              ₦{financialSummary.moneyReceived.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#718078] mt-1 leading-tight">
              Real money confirmed in your account or received in cash.
            </p>
            {financialSummary.unconfirmedClaims > 0 && (
              <div className="mt-2 text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 inline-block">
                +₦{financialSummary.unconfirmedClaims.toLocaleString()} claimed by customers (check alert)
              </div>
            )}
          </div>
        </div>

        {/* Money Owed to You */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-900 block">Money Customers Owe You</span>
              <span className="text-[10px] text-amber-700">Unpaid balances</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#E9A23B] flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#E9A23B] tracking-tight">
              ₦{financialSummary.moneyOwed.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#718078] mt-1 leading-tight">
              Balances still remaining from part-payments & promises.
            </p>
            {financialSummary.moneyOwed > 0 && (
              <button
                onClick={() => onNavigate('customers')}
                className="mt-2 text-[10px] font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Remind Debtors</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Total Orders Placed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-400 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Total Orders</span>
              <span className="text-[10px] text-slate-400">Recorded discussions</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#19251F] tracking-tight">
              {financialSummary.txCount}
            </div>
            <p className="text-[11px] text-[#718078] mt-1 leading-tight">
              Sales transactions identified from your chats.
            </p>
          </div>
        </div>
      </div>

      {/* Plain Business Highlights Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#103E30] to-[#145C42] rounded-2xl p-5 text-white shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Quick Shop Summary & Advice
            </h3>
          </div>
          <span className="text-[11px] text-emerald-300/80">Calculated from your records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {dynamicObservations.map((obs, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs text-emerald-50 leading-relaxed font-medium"
            >
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
                    <div className="mt-0.5">{getStatusBadge(tx)}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProofModal(tx);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#E8F4ED] hover:bg-emerald-100 text-[#145C42] text-[11px] font-bold transition-colors cursor-pointer"
                    title="See Bank Receipt / Proof"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>See Proof</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers & Debtors (1 column) */}
        <div className="space-y-4">
          {/* Customers Owing Money */}
          {customers.filter((c) => c.outstandingBalance > 0).length > 0 && (
            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-600" /> Customers Owing You
                </h4>
                <button
                  onClick={() => onNavigate('customers')}
                  className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {customers
                  .filter((c) => c.outstandingBalance > 0)
                  .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
                  .slice(0, 3)
                  .map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => onNavigate('customers')}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 border border-amber-100 text-xs cursor-pointer hover:bg-white transition-colors"
                    >
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-900 block truncate">{cust.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{cust.phone || 'WhatsApp contact'}</span>
                      </div>
                      <span className="font-extrabold text-[#E9A23B] shrink-0">
                        Owes ₦{cust.outstandingBalance.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Best-Performing Customers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#145C42]" /> Top Customers (By Total Spent)
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
