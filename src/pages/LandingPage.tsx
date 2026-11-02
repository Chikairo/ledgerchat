/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Package,
  TrendingUp,
  BarChart3,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  Lock,
  Menu,
  X,
  Play,
  HelpCircle,
  Building2,
  Receipt,
  Store,
  DollarSign,
  Wallet,
} from 'lucide-react';

interface LandingPageProps {
  onExploreDemo: () => void;
  onOpenEntryModal: () => void;
  onOpenSignIn: () => void;
  onOpenDeveloperDocs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDemo,
  onOpenEntryModal,
  onOpenSignIn,
  onOpenDeveloperDocs,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'typescript'>('curl');

  const faqs = [
    {
      q: 'Do my customers need to install an app or register?',
      a: 'No. Your customers continue chatting with you on WhatsApp exactly as they do today. LedgerChat works completely on your side—you simply export the chat text or receipt, and LedgerChat parses the agreed prices, payment receipts, and customer details into your private shop ledger.',
    },
    {
      q: 'How does LedgerChat prevent fake payment screenshot fraud?',
      a: 'LedgerChat enforces a strict "Dual-Truth Verification" architecture. When a customer sends a payment receipt or claims "I have paid", the transaction is flagged as "Payment Claimed - Pending Bank Credit Alert". It is never counted as confirmed revenue until you verify the funds actually reached your bank account.',
    },
    {
      q: 'Does LedgerChat understand Nigerian Pidgin and informal negotiations?',
      a: 'Yes. LedgerChat was specifically evaluated against realistic Nigerian and African social commerce conversations. It understands terms like "abeg", "last price", "I go balance am next week", "send account details", "credit alert entered", and partial installment agreements.',
    },
    {
      q: 'Can I test LedgerChat before putting my real shop information?',
      a: 'Absolutely. We provide a complete, interactive Demo Environment containing 22 realistic Lagos business transactions for Chidi Electronics (Computer Village). You can test chat extraction, debtor tracking, and reporting with 1 click and zero registration.',
    },
    {
      q: 'Can I export my records for my tax accountant or loan application?',
      a: 'Yes. You can generate one-click printable PDF financial summary reports and export all transaction rows to CSV / Excel spreadsheets anytime.',
    },
    {
      q: 'Is my business and customer data private and secure?',
      a: 'Yes. LedgerChat provides isolated workspaces for each merchant. Sensitive account details and personal numbers are protected, and LedgerChat never sells or shares your customer records or trade secrets with third parties.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#19251F] font-sans flex flex-col selection:bg-emerald-100 selection:text-[#103E30]">
      {/* ---------------------------------------------------- */}
      {/* 1. Header & Navigation */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#103E30] to-[#145C42] flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#103E30]">
                  Ledger<span className="text-[#168653]">Chat</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#145C42] border border-emerald-200/60 hidden sm:inline-block">
                  WhatsApp Commerce Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-[#145C42] transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#145C42] transition-colors">
              Features
            </a>
            <a href="#demo-preview" className="hover:text-[#145C42] transition-colors">
              Demo Preview
            </a>
            <a href="#for-developers" className="hover:text-[#145C42] transition-colors">
              For Developers
            </a>
            <a href="#faq" className="hover:text-[#145C42] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenSignIn}
              className="text-sm font-semibold text-slate-700 hover:text-[#145C42] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onExploreDemo}
              className="text-sm font-semibold text-[#145C42] bg-[#E8F4ED] hover:bg-emerald-100/80 px-4 py-2 rounded-xl border border-emerald-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#168653]" />
              <span>Explore Demo</span>
            </button>
            <button
              onClick={onOpenEntryModal}
              className="text-sm font-semibold text-white bg-[#145C42] hover:bg-[#103E30] px-5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onExploreDemo}
              className="text-xs font-semibold text-[#145C42] bg-[#E8F4ED] px-3 py-1.5 rounded-lg border border-emerald-200/80 cursor-pointer"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-1"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-1"
            >
              Features
            </a>
            <a
              href="#demo-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-1"
            >
              Demo Preview
            </a>
            <a
              href="#for-developers"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-1"
            >
              For Developers
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-1"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="w-full text-center text-sm font-semibold text-slate-700 py-2 rounded-lg border border-slate-200 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEntryModal();
                }}
                className="w-full text-center text-sm font-semibold text-white bg-[#145C42] py-2.5 rounded-lg shadow-xs cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. Hero Section */}
      {/* ---------------------------------------------------- */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-gradient-to-b from-white via-[#F7F9F7] to-[#F0F5F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#145C42] text-xs font-semibold mb-6 shadow-xs animate-in fade-in duration-500">
              <span className="w-2 h-2 rounded-full bg-[#168653] animate-pulse"></span>
              <span>Financial Clarity for WhatsApp Social Commerce</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#103E30] tracking-tight leading-[1.12]">
              Turn WhatsApp Chats into <span className="text-[#168653]">Verified Sales Ledgers</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Stop losing customer payments, agreed prices, and forgotten balances inside chat scrolls. LedgerChat transforms your WhatsApp conversations into organized records, audits payment receipts against real bank credits, and tracks who owes your business.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={onOpenEntryModal}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#145C42] border-2 border-[#145C42]/20 hover:border-[#145C42] text-base font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#168653]" />
                <span>Explore Interactive Demo</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Dual-Truth Payment Verification
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Nigerian Pidgin & Slang Ready
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                Private & Isolated Records
              </span>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* Interactive Visual Transformation Demo */}
          {/* ---------------------------------------------------- */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
              {/* Window Header */}
              <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="ml-2 font-mono text-[11px] text-slate-600">
                    ledgerchat-pipeline // chat-export-to-verified-record
                  </span>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                  Active AI Extraction
                </span>
              </div>

              {/* Transformation Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                {/* Left: WhatsApp Export Chat Snippet */}
                <div className="lg:col-span-6 p-5 sm:p-6 bg-[#EFEAE2]/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                          TB
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Tunde Bello</p>
                          <p className="text-[10px] text-slate-500">+234 803 441 9920</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                        WhatsApp Export .txt
                      </span>
                    </div>

                    {/* Chat bubbles */}
                    <div className="space-y-3 text-xs">
                      {/* Customer message 1 */}
                      <div className="bg-white p-3 rounded-xl rounded-tl-xs shadow-xs max-w-[85%] border border-slate-200/60">
                        <p className="text-slate-800 font-medium">
                          Boss how far! Abeg I need 1 unit of that 300W Solar Generator. Last price na ₦180,000 abi?
                        </p>
                        <span className="text-[9px] text-slate-400 block text-right mt-1">10:14 AM</span>
                      </div>

                      {/* Merchant message */}
                      <div className="bg-[#DCF8C6] p-3 rounded-xl rounded-tr-xs shadow-xs max-w-[85%] ml-auto border border-emerald-200/50">
                        <p className="text-slate-800 font-medium">
                          Hello sir! Last price for the 300W unit is <strong>₦195,000</strong> with free delivery to Lekki Phase 1.
                        </p>
                        <span className="text-[9px] text-slate-500 block text-right mt-1">10:18 AM</span>
                      </div>

                      {/* Customer message 2 */}
                      <div className="bg-white p-3 rounded-xl rounded-tl-xs shadow-xs max-w-[85%] border border-slate-200/60">
                        <p className="text-slate-800 font-medium">
                          Oya agreed ₦195k. I just sent <strong>₦120k deposit</strong> now via GTBank. Waybill it today. I go balance the remaining ₦75,000 on delivery next week Friday.
                        </p>
                        <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="text-[11px] text-slate-700 font-semibold truncate">
                            gtbank_transfer_120000.jpg (Attached)
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 block text-right mt-1">10:25 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#145C42]" />
                    <span>Raw text captured without requiring customer registration</span>
                  </div>
                </div>

                {/* Right: Verified Financial Ledger Row & Debtor Card */}
                <div className="lg:col-span-6 p-5 sm:p-6 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-[#103E30] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Extracted Ledger Record
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Partial Payment (Debt Tracked)
                      </span>
                    </div>

                    {/* Financial Summary Cards */}
                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] text-slate-500 font-medium">Agreed Order</p>
                        <p className="text-sm font-extrabold text-slate-900 mt-0.5">₦195,000</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
                        <p className="text-[10px] text-emerald-800 font-medium">Verified Paid</p>
                        <p className="text-sm font-extrabold text-[#145C42] mt-0.5">₦120,000</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200/80">
                        <p className="text-[10px] text-red-800 font-medium">Customer Debt</p>
                        <p className="text-sm font-extrabold text-red-700 mt-0.5">₦75,000</p>
                      </div>
                    </div>

                    {/* Ledger Metadata Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Customer</span>
                        <span className="font-semibold text-slate-800">Tunde Bello (Debtor)</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Item & Quantity</span>
                        <span className="font-semibold text-slate-800">1x 300W Solar Generator</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Payment Status</span>
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Bank Credit Confirmed (GTBank)
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Promised Balance Date</span>
                        <span className="font-semibold text-amber-700">Next Friday</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500">Delivery Destination</span>
                        <span className="font-semibold text-slate-800">Lekki Phase 1, Lagos</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Audit trail preserved with raw chat</span>
                    <button
                      onClick={onExploreDemo}
                      className="text-xs font-bold text-[#145C42] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>See live in demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. The Problem Section */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xs font-bold text-[#145C42] uppercase tracking-wider mb-2">
              The Reality of WhatsApp Commerce
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-[#103E30] tracking-tight">
              Why African merchants lose money inside chat scrolls
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              WhatsApp is the engine of trade across Lagos, Kano, Nairobi, and Accra. But running a business on chats creates blind spots that cost merchants hundreds of thousands of Naira monthly.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Problem 1 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/90 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Unverified "I Have Paid" Claims
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Customers send screenshots of bank transfers or claim they transferred money. Without independent credit verification, orders get shipped before real cash enters the account.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-red-700">
                LedgerChat fix: Dual-truth audit flags unconfirmed claims.
              </div>
            </div>

            {/* Problem 2 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/90 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  The Forgotten Debtor Trap
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "I go pay the balance on Friday." When you manage 40 customer conversations a day, partial deposits and promised balances disappear into the chat history.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-amber-700">
                LedgerChat fix: Automatic debtor book with outstanding balances.
              </div>
            </div>

            {/* Problem 3 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/90 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Price Haggling & Negotiation Chaos
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Discounts, bundled accessories, and delivery terms agreed during back-and-forth haggling are forgotten by the dispatch rider, causing customer disputes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-blue-700">
                LedgerChat fix: Exact agreed order value extraction.
              </div>
            </div>

            {/* Problem 4 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/90 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#145C42] flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  No Visibility on Real Monthly Sales
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Traditional accounting software is too complex; merchants don't know their total revenue, fast-selling products, or actual profit until bank reconciliations fail.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-[#145C42]">
                LedgerChat fix: Simple, plain-English shop dashboard.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. How It Works (4-Step Workflow) */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-[#F7F9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-bold text-[#145C42] uppercase tracking-wider mb-2">
              How LedgerChat Works
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-[#103E30] tracking-tight">
              From WhatsApp chat to organized financial records in 4 steps
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              No change for your customers. Zero complicated accounting bookkeeping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E8F4ED] text-[#145C42] flex items-center justify-center font-bold text-sm mb-4">
                  1
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Export Chat from WhatsApp
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tap 3 dots in any WhatsApp customer chat &gt; More &gt; <strong>Export Chat</strong> (as .txt or .zip with payment receipts). Or use our API webhook.
                </p>
              </div>
              <div className="mt-6 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                💡 Works with both individual and group customer chats.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E8F4ED] text-[#145C42] flex items-center justify-center font-bold text-sm mb-4">
                  2
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  AI Entity & Negotiation Parsing
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our models extract the buyer name, phone number, agreed products, negotiated final price, quantities, deposit amounts, and delivery terms.
                </p>
              </div>
              <div className="mt-6 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                💡 Understands Nigerian Pidgin and informal bargaining.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-4">
                  3
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Dual-Truth Verification
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  LedgerChat strictly isolates:
                  <br />• <strong>Agreed Order Value</strong>
                  <br />• <strong>Payment Claimed</strong>
                  <br />• <strong>Bank Credit Confirmed</strong>
                  <br />Uncertain receipts are flagged for your 1-click review.
                </p>
              </div>
              <div className="mt-6 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200/60">
                🔒 Never credits revenue without merchant proof.
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#145C42] flex items-center justify-center font-bold text-sm mb-4">
                  4
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  Instant Shop Intelligence
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your shop ledger updates deterministically. See today's sales, this month's revenue, active debtors, top-selling items, and print financial audit statements.
                </p>
              </div>
              <div className="mt-6 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200/60">
                📊 One clear picture of your actual business health.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. Core Features Grid */}
      {/* ---------------------------------------------------- */}
      <section id="features" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-bold text-[#145C42] uppercase tracking-wider mb-2">
              Core Capabilities
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-[#103E30] tracking-tight">
              Designed specifically for the needs of social sellers
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Everything you need to run a profitable, organized shop without hiring an in-house accountant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/80 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#E8F4ED] text-[#145C42] flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Deterministic Financial Ledgers
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All totals, subtotals, and outstanding balances are computed using deterministic arithmetic logic—never guessed or hallucinated by AI.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/80 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Automated Debtor Tracking
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Know exactly who owes you money, how much they owe, their promised balance dates, and which transactions created the debt.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/80 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Payment Evidence Records
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every transaction links back to its original WhatsApp chat messages, attached transfer receipts, and merchant verification notes for dispute resolution.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/80 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Product Velocity & Demand
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identify your top sellers, units sold, agreed vs list prices, and products frequently requested together in customer inquiries.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/80 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Weekly Cash Reconciliation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set automatic reminders (e.g., every Friday at 6:00 PM) to reconcile bank alerts with recorded customer orders before closing your week.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#F7F9F7] border border-slate-200/80 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Accountant & Bank Export
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate clean, printable PDF financial statements or download full CSV files for loan applications, business audits, and tax filing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. Demo Environment Showcase */}
      {/* ---------------------------------------------------- */}
      <section id="demo-preview" className="py-16 sm:py-24 bg-gradient-to-b from-[#F7F9F7] to-emerald-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#103E30] to-[#145C42] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-4 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Isolated Demonstration Environment</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Experience LedgerChat with 22 Realistic Nigerian Transactions
              </h3>
              <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                Explore <strong>Chidi Electronics (Computer Village, Ikeja)</strong>. Test complete sales records, partial payments, customer debts, and WhatsApp chat imports without creating an account or uploading real business data.
              </p>

              {/* Sample Metrics */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
                  <p className="text-xs text-emerald-200">This Month Sales</p>
                  <p className="text-xl sm:text-2xl font-black mt-1">₦1,860,000</p>
                  <p className="text-[10px] text-emerald-300 mt-1">15 completed orders</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
                  <p className="text-xs text-emerald-200">Active Debtor Book</p>
                  <p className="text-xl sm:text-2xl font-black text-amber-300 mt-1">₦240,000</p>
                  <p className="text-[10px] text-amber-200 mt-1">8 customers owing</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
                  <p className="text-xs text-emerald-200">Sample Records</p>
                  <p className="text-xl sm:text-2xl font-black mt-1">22 Orders</p>
                  <p className="text-[10px] text-emerald-300 mt-1">Lagos merchants</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
                  <p className="text-xs text-emerald-200">Reset Anytime</p>
                  <p className="text-xl sm:text-2xl font-black mt-1">1-Click</p>
                  <p className="text-[10px] text-emerald-300 mt-1">Never impacts real data</p>
                </div>
              </div>

              {/* Launch CTA */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={onExploreDemo}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[#103E30] hover:bg-emerald-50 text-base font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Interactive Demo Now</span>
                </button>
                <span className="text-xs text-emerald-200/80">
                  Instant launch • No signup, card, or phone number required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. Developer & API Discovery */}
      {/* ---------------------------------------------------- */}
      <section id="for-developers" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                <Code2 className="w-3.5 h-3.5 text-[#145C42]" />
                <span>LedgerChat Intelligence API v1</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-[#103E30] tracking-tight">
                Integrate WhatsApp Commerce Intelligence into your apps
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Empower your FinTech, POS, ERP, or E-commerce platform with LedgerChat's extraction and verification engine. Ingest conversations, score debtor risk, and sync transactions through secure REST endpoints.
              </p>

              {/* Capabilities List */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Transaction Extraction Endpoint:</strong> Send raw WhatsApp text logs to <code className="bg-slate-100 px-1 py-0.5 rounded text-[#145C42] font-mono text-xs">/api/v1/extract</code> and receive structured financial JSON.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Shop Analytics & Summary:</strong> Query live merchant metrics via <code className="bg-slate-100 px-1 py-0.5 rounded text-[#145C42] font-mono text-xs">/api/v1/analytics/summary</code>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>WhatsApp Cloud Webhook Ingestion:</strong> Connect directly to Meta WhatsApp Business API webhooks.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>OpenAPI 3.0 Documentation:</strong> Comprehensive machine-readable schema available at <code className="bg-slate-100 px-1 py-0.5 rounded text-[#145C42] font-mono text-xs">/api/v1/openapi.json</code>.
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={onOpenDeveloperDocs}
                  className="px-6 py-3 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Open API Console & Docs</span>
                </button>
                <a
                  href="/api/v1/openapi.json"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-slate-600 hover:text-[#145C42] flex items-center gap-1 transition-colors"
                >
                  <span>OpenAPI Spec</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Code Block */}
            <div className="lg:col-span-6">
              <div className="bg-[#19251F] rounded-2xl shadow-xl overflow-hidden border border-slate-800 text-slate-200">
                {/* Code Window Header */}
                <div className="bg-[#101814] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveCodeTab('curl')}
                      className={`px-3 py-1 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                        activeCodeTab === 'curl' ? 'bg-[#145C42] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      cURL
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('typescript')}
                      className={`px-3 py-1 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                        activeCodeTab === 'typescript' ? 'bg-[#145C42] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      TypeScript
                    </button>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">POST /api/v1/extract</span>
                </div>

                {/* Code Body */}
                <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto text-emerald-300">
                  {activeCodeTab === 'curl' ? (
                    <pre>
{`curl -X POST https://ledgerchat.app/api/v1/extract \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: lchat_live_sec_xxx" \\
  -d '{
    "rawText": "Tunde: Abeg send the 300W Solar Generator for 195k. I transfer 120k now, balance 75k next Friday.",
    "customerHint": "Tunde Bello",
    "currency": "NGN"
  }'

# Response (200 OK)
{
  "success": true,
  "transaction": {
    "customer": "Tunde Bello",
    "agreedAmount": 195000,
    "amountPaid": 120000,
    "outstandingAmount": 75000,
    "paymentClaimStatus": "confirmed",
    "status": "partial"
  }
}`}
                    </pre>
                  ) : (
                    <pre>
{`import { ApiClient } from '@ledgerchat/sdk';

const client = new ApiClient({
  apiKey: process.env.LEDGERCHAT_API_KEY
});

const result = await client.extract({
  rawText: "Tunde: Abeg send the 300W Solar Generator for 195k...",
  customerHint: "Tunde Bello",
  currency: "NGN"
});

console.log(result.transaction.agreedAmount); // 195000
console.log(result.transaction.outstandingAmount); // 75000`}
                    </pre>
                  )}
                </div>

                {/* Footer status */}
                <div className="bg-[#101814] px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>REST API v1 Ready & Operational</span>
                  </div>
                  <span className="text-slate-500 font-mono">Latency: ~380ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. Data Privacy & Sovereignty */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 sm:py-20 bg-[#F7F9F7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#145C42] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#103E30] tracking-tight">
            Your conversations. Your business. Strictly private.
          </h3>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            WhatsApp conversations contain your most sensitive merchant data: customer contact numbers, agreed margins, supplier prices, and bank transfer receipts.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Zero Data Reselling
              </h4>
              <p className="text-xs text-slate-600">
                We never monetize your customer phone numbers, trade prices, or order volumes. You retain complete ownership.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <Layers className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Isolated Merchant Data
              </h4>
              <p className="text-xs text-slate-600">
                Each live merchant workspace is strictly sandboxed. Demo records cannot leak into or alter live merchant accounts.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <Receipt className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Masked Sensitive Details
              </h4>
              <p className="text-xs text-slate-600">
                Bank account numbers and transaction IDs are handled safely; your customers' privacy is preserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 9. Frequently Asked Questions */}
      {/* ---------------------------------------------------- */}
      <section id="faq" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-[#145C42] uppercase tracking-wider mb-2">
              Questions & Answers
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-[#103E30] tracking-tight">
              Frequently asked questions
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Everything you need to know about getting started with LedgerChat.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-[#F7F9F7]"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#145C42] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#145C42] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 10. Final Call to Action */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#103E30] via-[#145C42] to-[#168653] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to stop losing money in WhatsApp chats?
          </h3>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Join merchants who have transformed messy customer negotiations into verified sales ledgers and reliable debtor tracking.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenEntryModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#103E30] hover:bg-emerald-50 text-base font-bold shadow-xl transition-all cursor-pointer"
            >
              Get Started Free
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 11. Footer */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-[#101814] text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg text-white">LedgerChat</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Financial record keeping and business intelligence for WhatsApp merchants across Nigeria and Africa.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Product</h5>
              <ul className="space-y-2">
                <li>
                  <button onClick={onExploreDemo} className="hover:text-emerald-400 transition-colors cursor-pointer">
                    Interactive Demo
                  </button>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    Features & Ledgers
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-emerald-400 transition-colors">
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Developers</h5>
              <ul className="space-y-2">
                <li>
                  <button onClick={onOpenDeveloperDocs} className="hover:text-emerald-400 transition-colors cursor-pointer">
                    REST API Documentation
                  </button>
                </li>
                <li>
                  <a href="/api/v1/openapi.json" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                    OpenAPI 3.0 Spec
                  </a>
                </li>
                <li>
                  <a href="/api/status" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                    System Health Check
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Environments</h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span>Demo Mode</span>
                  <span className="text-emerald-400 font-semibold">Active & Isolated</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span>Live Production</span>
                  <span className="text-blue-400 font-semibold">Multi-Tenant Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} LedgerChat. All rights reserved. Designed for African social commerce.</p>
            <div className="flex items-center gap-4">
              <span>Security & Privacy First</span>
              <span>•</span>
              <span>Deterministic Financial Logic</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
