import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  ShoppingBag,
  DollarSign,
  Tag,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { Product, Transaction } from '../types';

interface ProductsPageProps {
  products: Product[];
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  transactions,
  onSelectTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Summary computations
  const summary = useMemo(() => {
    const totalProducts = products.length;
    const sortedByUnits = [...products].sort((a, b) => b.unitsSold - a.unitsSold);
    const bestSelling = sortedByUnits[0] || null;

    const sortedByRevenue = [...products].sort((a, b) => b.totalSalesValue - a.totalSalesValue);
    const highestRevenue = sortedByRevenue[0] || null;

    const sortedByInquiries = [...products].sort((a, b) => b.inquiryCount - a.inquiryCount);
    const mostRequested = sortedByInquiries[0] || null;

    const totalRevenue = products.reduce((acc, p) => acc + p.totalSalesValue, 0);

    return {
      totalProducts,
      bestSelling,
      highestRevenue,
      mostRequested,
      totalRevenue,
    };
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  // Selected product details
  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find((p) => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  const productTransactions = useMemo(() => {
    if (!selectedProduct) return [];
    return transactions.filter(
      (t) => t.productName.toLowerCase().includes(selectedProduct.name.toLowerCase())
    );
  }, [selectedProduct, transactions]);

  const getTrendIcon = (trend: Product['trend']) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-[#168653]" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-[#D94C4C]" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">Product Intelligence</h1>
        <p className="text-xs text-[#718078] mt-0.5">
          AI tracks what products customers inquire about on WhatsApp vs. what actually converts into confirmed revenue.
        </p>
      </div>

      {/* Distinction Explanation Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
        <Tag className="w-4 h-4 text-[#145C42] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Conversion Rule:</strong> Best-selling metrics calculate solely from confirmed delivered sales, not informal inquiries. Inquiries show demand potential; units sold reflect settled business.
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Identified Items</span>
          <div className="text-2xl font-extrabold text-[#19251F] mt-1">{summary.totalProducts}</div>
          <span className="text-[11px] text-slate-400 block mt-0.5">Discovered in chats</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 block">Best Seller (Volume)</span>
          <div className="text-sm font-extrabold text-slate-900 mt-1 truncate">
            {summary.bestSelling ? summary.bestSelling.name : 'N/A'}
          </div>
          <span className="text-[11px] text-[#168653] font-semibold block mt-0.5">
            {summary.bestSelling ? `${summary.bestSelling.unitsSold} units confirmed sold` : ''}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Highest Revenue Item</span>
          <div className="text-sm font-extrabold text-slate-900 mt-1 truncate">
            {summary.highestRevenue ? summary.highestRevenue.name : 'N/A'}
          </div>
          <span className="text-[11px] text-[#145C42] font-semibold block mt-0.5">
            ₦{summary.highestRevenue ? summary.highestRevenue.totalSalesValue.toLocaleString() : 0}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-amber-800 block">Most Inquired Item</span>
          <div className="text-sm font-extrabold text-slate-900 mt-1 truncate">
            {summary.mostRequested ? summary.mostRequested.name : 'N/A'}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">
            {summary.mostRequested ? `${summary.mostRequested.inquiryCount} customer chats` : ''}
          </span>
        </div>
      </div>

      {/* Main Grid: Products Table and Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#145C42]/20"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
            {filteredProducts.map((prod) => {
              const isSelected = selectedProductId === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`p-4 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#E8F4ED]/60 border-l-4 border-[#145C42]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F4ED] text-[#145C42] flex items-center justify-center font-bold text-sm shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{prod.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {prod.category || 'General'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>Units Sold: <strong className="text-slate-800">{prod.unitsSold}</strong></span>
                        <span>Avg Price: <strong className="text-slate-800">₦{prod.averageSellingPrice.toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 block">
                      ₦{prod.totalSalesValue.toLocaleString()}
                    </span>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {getTrendIcon(prod.trend)}
                      <span className="text-[10px] text-slate-400">
                        {prod.inquiryCount} inquiries
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Product Detail Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          {selectedProduct ? (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#145C42] bg-[#E8F4ED] px-2 py-0.5 rounded">
                  {selectedProduct.category || 'Inventory Item'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedProduct.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Total Revenue
                  </span>
                  <span className="text-sm font-bold text-[#145C42]">
                    ₦{selectedProduct.totalSalesValue.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Units Sold
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {selectedProduct.unitsSold} units
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Average Price
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    ₦{selectedProduct.averageSellingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Chat Inquiries
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {selectedProduct.inquiryCount} asks
                  </span>
                </div>
              </div>

              {/* Transactions for this product */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Associated Orders ({productTransactions.length})
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {productTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{tx.customerName}</p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(tx.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">
                          ₦{tx.agreedAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          {tx.quantity} unit(s)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Package className="w-12 h-12 text-slate-300 stroke-[1.5] mb-2" />
              <p className="text-xs font-semibold text-slate-600">Select a Product</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Inspect units sold, average realized prices, conversion rates from chat inquiries, and order history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
