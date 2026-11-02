/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Store,
  Sparkles,
  LogIn,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface UserEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: () => void;
  onSignIn: () => void;
  onExploreDemo: () => void;
}

export const UserEntryModal: React.FC<UserEntryModalProps> = ({
  isOpen,
  onClose,
  onCreateAccount,
  onSignIn,
  onExploreDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#103E30] to-[#145C42] text-white relative">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to LedgerChat</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How would you like to experience LedgerChat?
          </h2>
          <p className="text-sm text-emerald-100/90 mt-2 max-w-lg leading-relaxed">
            Choose how to enter: explore our complete Lagos business demo immediately without signing up, or set up a private live workspace for your actual shop.
          </p>
        </div>

        {/* Options Grid */}
        <div className="p-6 sm:p-8 space-y-4 bg-slate-50/50">
          {/* Option 1: Explore Demo (Recommended for first-time visitors) */}
          <button
            onClick={() => {
              onClose();
              onExploreDemo();
            }}
            className="w-full text-left p-5 rounded-2xl bg-white border-2 border-emerald-500/80 hover:border-[#145C42] shadow-sm hover:shadow-md transition-all group flex items-start justify-between gap-4 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#145C42] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
              Instant Access • No Signup
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F4ED] text-[#145C42] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#145C42] transition-colors">
                    Explore Interactive Demo
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-md">
                  Explore <strong>Chidi Electronics (Lagos)</strong> with 22 sample transactions, debtor tracking, WhatsApp chat parser, and product analytics. Fictional data that you can reset anytime.
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-[#145C42] font-semibold">
                  <span>✓ 22 realistic transactions</span>
                  <span>✓ Dual-truth payment audit</span>
                  <span>✓ Zero commitment</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 self-center hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-[#145C42] group-hover:bg-[#145C42] group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Option 2: Create Live Account */}
          <button
            onClick={() => {
              onClose();
              onCreateAccount();
            }}
            className="w-full text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#145C42] shadow-xs hover:shadow-md transition-all group flex items-start justify-between gap-4 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#145C42] transition-colors">
                    Create New Shop Account
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Live Workspace
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-md">
                  For active business owners. Set up your private shop profile (currency, shop name, bank reconciliation schedule) and import your real WhatsApp conversations.
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-600">
                  <span>✓ 100% private data</span>
                  <span>✓ Custom debtor ledger</span>
                  <span>✓ Export PDF / CSV</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 self-center hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#145C42] group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Option 3: Sign In */}
          <button
            onClick={() => {
              onClose();
              onSignIn();
            }}
            className="w-full text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all group flex items-center justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Already have a merchant account?
                </h4>
                <p className="text-xs text-slate-500">
                  Sign in with your email and password to open your live shop records.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-[#145C42] group-hover:underline">
              <span>Sign In</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="px-6 sm:px-8 py-3.5 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict data isolation between Demo and Live environments</span>
          </div>
          <button
            onClick={onClose}
            className="hover:text-slate-800 underline transition-colors cursor-pointer"
          >
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};
