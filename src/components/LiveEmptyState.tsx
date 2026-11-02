/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MessageSquare,
  UploadCloud,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface LiveEmptyStateProps {
  businessName: string;
  onNavigateToImport: () => void;
  onLoadTestChat?: () => void;
}

export const LiveEmptyState: React.FC<LiveEmptyStateProps> = ({
  businessName,
  onNavigateToImport,
  onLoadTestChat,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs text-center max-w-3xl mx-auto my-6">
      {/* Icon header */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F4ED] to-emerald-100/80 flex items-center justify-center text-[#145C42] mx-auto mb-5 shadow-xs">
        <MessageSquare className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#145C42] text-xs font-bold mb-3 border border-emerald-200/50">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Ready for Your Real WhatsApp Records</span>
      </div>

      <h2 className="text-2xl font-bold text-[#19251F] tracking-tight">
        Welcome to your live ledger, {businessName}!
      </h2>
      <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
        Your shop ledger is completely clean and ready. Add your first customer conversation from WhatsApp to automatically track agreed order amounts, received money, and customer debts.
      </p>

      {/* 3 Simple Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 text-left">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 relative">
          <div className="w-7 h-7 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-xs mb-3">
            1
          </div>
          <h3 className="font-bold text-xs text-slate-800 mb-1">Export from WhatsApp</h3>
          <p className="text-[11px] text-slate-600 leading-normal">
            Open WhatsApp &gt; Tap any customer chat &gt; Tap 3 dots &gt; <strong>More &gt; Export Chat</strong> (Without Media or With Media).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 relative">
          <div className="w-7 h-7 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-xs mb-3">
            2
          </div>
          <h3 className="font-bold text-xs text-slate-800 mb-1">Upload the .txt or .zip</h3>
          <p className="text-[11px] text-slate-600 leading-normal">
            Click <strong>"Add WhatsApp Chat"</strong> and select your downloaded WhatsApp file or bank transfer screenshots.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 relative">
          <div className="w-7 h-7 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-xs mb-3">
            3
          </div>
          <h3 className="font-bold text-xs text-slate-800 mb-1">Instant Shop Ledger</h3>
          <p className="text-[11px] text-slate-600 leading-normal">
            Gemma AI automatically extracts the agreed prices, tracks what was paid, and keeps your debtor list updated.
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onNavigateToImport}
          className="w-full sm:w-auto px-6 py-3 bg-[#145C42] hover:bg-[#103E30] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer group"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Import Your First WhatsApp Chat</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        {onLoadTestChat && (
          <button
            onClick={onLoadTestChat}
            className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Or Try with a Sample Lagos Chat
          </button>
        )}
      </div>

      {/* Trust reassurance */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#168653]" />
          <span>Strict Tenant Privacy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#168653]" />
          <span>Unverified claims flagged for review</span>
        </div>
      </div>
    </div>
  );
};
