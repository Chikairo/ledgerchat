import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Building2,
  Hash,
  Eye,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Transaction, EvidenceItem } from '../types';

interface ProofModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onUpdateStatus: (
    transactionId: string,
    newStatus: Transaction['status'],
    newClaimStatus: Transaction['paymentClaimStatus'],
    merchantNote?: string
  ) => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({
  transaction,
  onClose,
  onUpdateStatus,
}) => {
  if (!transaction) return null;

  const [merchantNote, setMerchantNote] = useState('');
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState(0);

  const primaryEvidence =
    transaction.evidence && transaction.evidence.length > 0
      ? transaction.evidence[activeEvidenceIndex]
      : null;

  const getEvidenceTypeBadge = (ev?: EvidenceItem | null) => {
    if (!ev) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          <MessageSquare className="w-3.5 h-3.5" /> Customer Stated in Chat Only
        </span>
      );
    }
    if (ev.type === 'receipt_image') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Eye className="w-3.5 h-3.5" /> Bank Receipt Screenshot Attached
        </span>
      );
    }
    if (ev.type === 'bank_sms') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Building2 className="w-3.5 h-3.5" /> Bank Alert Message in Chat
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Chat Evidence
      </span>
    );
  };

  const getVerificationStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
      case 'merchant_confirmed':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#168653] text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmed Paid (Alert Received)</span>
          </div>
        );
      case 'partially_paid':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[#E9A23B] text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Part Payment (Owes ₦{transaction.outstandingAmount.toLocaleString()})</span>
          </div>
        );
      case 'needs_review':
      case 'payment_claimed':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Customer Claims Paid (Check Alert)</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
            <Clock className="w-4 h-4" />
            <span>{transaction.status.replace('_', ' ').toUpperCase()}</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Bank Receipt & WhatsApp Proof
              </h3>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {transaction.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Check customer's payment screenshot and original WhatsApp messages for {transaction.customerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Status & Distinction Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-500 block font-semibold">Proof Attached</span>
              <div className="mt-1">{getEvidenceTypeBadge(primaryEvidence)}</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block font-semibold">Payment Status</span>
              <div className="mt-1">{getVerificationStatusBadge(transaction.status)}</div>
            </div>
          </div>

          {/* Caution callout */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#E9A23B] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Check Your Bank App First:</strong> Customer saying "I don send am" or uploading a screenshot is not confirmed money in hand until you see the alert drop in your GTBank, OPay, Moniepoint, or Zenith account.
            </p>
          </div>

          {/* Payment & Order Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Agreed Total
              </span>
              <span className="text-base font-bold text-slate-900">
                ₦{transaction.agreedAmount.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-emerald-700 uppercase tracking-wider block font-semibold">
                Reported Paid
              </span>
              <span className="text-base font-bold text-emerald-800">
                ₦{transaction.amountPaid.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="text-[10px] text-amber-700 uppercase tracking-wider block font-semibold">
                Balance Due
              </span>
              <span className="text-base font-bold text-amber-800">
                ₦{transaction.outstandingAmount.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Product / Qty
              </span>
              <span className="text-xs font-bold text-slate-900 truncate block">
                {transaction.quantity}x {transaction.productName}
              </span>
            </div>
          </div>

          {/* Multiple Evidence Tabs if available */}
          {transaction.evidence && transaction.evidence.length > 1 && (
            <div className="flex gap-2 border-b border-slate-200 pb-2">
              {transaction.evidence.map((ev, idx) => (
                <button
                  key={ev.id}
                  onClick={() => setActiveEvidenceIndex(idx)}
                  className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeEvidenceIndex === idx
                      ? 'bg-[#145C42] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Evidence #{idx + 1} ({ev.type.replace('_', ' ')})
                </button>
              ))}
            </div>
          )}

          {/* Evidence Details Section */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#145C42]" /> Supporting Documentation & Metadata
              </span>
              {primaryEvidence && (
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(primaryEvidence.timestamp || transaction.date).toLocaleString()}
                </span>
              )}
            </div>

            <div className="p-4 space-y-4">
              {/* Receipt Image if available */}
              {primaryEvidence?.imageUrl ? (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Customer Submitted Receipt Image:
                  </span>
                  <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900/5 max-h-64 flex items-center justify-center">
                    <img
                      src={primaryEvidence.imageUrl}
                      alt="Payment Receipt Proof"
                      className="max-h-64 w-auto object-contain hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>
              ) : null}

              {/* Extracted Bank Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Bank / Channel</span>
                    <span className="font-semibold text-slate-800">
                      {primaryEvidence?.bankName || transaction.paymentMethod || 'Bank Transfer'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                  <Hash className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Session ID / Reference</span>
                    <span className="font-mono text-slate-800 text-[11px]">
                      {primaryEvidence?.transactionReference || 'Not provided in chat screenshot'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verification Notes */}
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  AI Evidence Matching Analysis:
                </span>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  {primaryEvidence?.verificationNote ||
                    `Transaction details extracted from WhatsApp chat history. Customer claims payment of ₦${transaction.amountPaid.toLocaleString()}.`}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <Sparkles className="w-3 h-3 text-[#145C42]" />
                  <span>
                    Extraction Match Confidence: <strong>{Math.round((transaction.confidence || 0.95) * 100)}%</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Original WhatsApp Context Messages */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#145C42]" /> Original WhatsApp Chat Excerpt
              </span>
            </div>
            <div className="p-3 bg-[#EFEAE2]/30 space-y-2 max-h-48 overflow-y-auto">
              {transaction.sourceMessages && transaction.sourceMessages.length > 0 ? (
                transaction.sourceMessages.map((msg, i) => {
                  const isMerchant = msg.toLowerCase().startsWith('chidi') || msg.toLowerCase().startsWith('me');
                  return (
                    <div
                      key={i}
                      className={`p-2 rounded-xl text-xs max-w-[85%] shadow-2xs leading-relaxed ${
                        isMerchant
                          ? 'ml-auto bg-[#D9FDD3] text-slate-900 rounded-tr-none'
                          : 'mr-auto bg-white text-slate-900 rounded-tl-none border border-slate-200/50'
                      }`}
                    >
                      {msg}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 italic p-2">
                  Full context message unavailable for this transaction.
                </p>
              )}
            </div>
          </div>

          {/* Merchant Decision & Review Controls */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Your Verification Note (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Alert saw on OPay app, or Waiting for Moniepoint confirmation"
              value={merchantNote}
              onChange={(e) => setMerchantNote(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#145C42]"
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onUpdateStatus(transaction.id, 'completed', 'merchant_confirmed', merchantNote);
                  onClose();
                }}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#168653] hover:bg-[#145C42] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Yes, I Saw Alert (Mark Paid)
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(transaction.id, 'needs_review', 'customer_claimed', merchantNote);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-4 h-4" />
                No Alert Yet (Needs Check)
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(transaction.id, 'cancelled', 'none', merchantNote);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
