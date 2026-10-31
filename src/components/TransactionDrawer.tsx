import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  Calendar,
  CreditCard,
  MessageSquare,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Phone,
} from 'lucide-react';
import { Transaction } from '../types';

interface TransactionDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
  onOpenProofModal: (transaction: Transaction) => void;
  onUpdateStatus: (
    transactionId: string,
    newStatus: Transaction['status'],
    newClaimStatus: Transaction['paymentClaimStatus']
  ) => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
  transaction,
  onClose,
  onOpenProofModal,
  onUpdateStatus,
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {transaction.id}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    transaction.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : transaction.status === 'partially_paid'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {transaction.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">Transaction Details</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Amount Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#103E30] to-[#145C42] text-white shadow-md">
              <span className="text-xs text-emerald-200 font-medium">Agreed Transaction Total</span>
              <div className="text-2xl font-bold mt-0.5">
                ₦{transaction.agreedAmount.toLocaleString()}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-700/50 text-xs">
                <div>
                  <span className="text-emerald-300 block text-[11px]">Amount Collected</span>
                  <span className="font-semibold text-white">
                    ₦{transaction.amountPaid.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-300 block text-[11px]">Outstanding Balance</span>
                  <span
                    className={`font-semibold ${
                      transaction.outstandingAmount > 0 ? 'text-amber-300' : 'text-emerald-200'
                    }`}
                  >
                    ₦{transaction.outstandingAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Proof Action */}
            <button
              onClick={() => onOpenProofModal(transaction)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#E8F4ED] hover:bg-emerald-100 border border-emerald-200 text-[#145C42] font-semibold text-xs transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#145C42]" />
                <span>View Payment Evidence & Proof</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Customer Information */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Customer Information
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#145C42]/10 text-[#145C42] flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{transaction.customerName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {transaction.customerPhone || 'Contact via WhatsApp export'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Product & Quantity
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{transaction.productName}</p>
                    <p className="text-[11px] text-slate-500">Quantity: {transaction.quantity} unit(s)</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  ₦{transaction.agreedAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Transaction Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Transaction Timeline
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#145C42] mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Order Initiated via WhatsApp</p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(transaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      transaction.amountPaid > 0 ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-slate-800">Payment Claim / Slip Submitted</p>
                    <p className="text-[11px] text-slate-500">
                      {transaction.amountPaid > 0
                        ? `₦${transaction.amountPaid.toLocaleString()} reported via ${transaction.paymentMethod || 'transfer'}`
                        : 'No payment made yet'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      transaction.status === 'completed' ? 'bg-emerald-600' : 'bg-amber-400'
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-slate-800">Merchant Reconciliation Status</p>
                    <p className="text-[11px] text-slate-500">
                      {transaction.status === 'completed'
                        ? 'Confirmed in merchant account records'
                        : 'Awaiting final payment or merchant clearance'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted WhatsApp Messages */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Source WhatsApp Discussion
              </h4>
              <div className="p-3 rounded-xl bg-slate-100 space-y-1.5 text-xs">
                {transaction.sourceMessages && transaction.sourceMessages.length > 0 ? (
                  transaction.sourceMessages.map((msg, i) => (
                    <div key={i} className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
                      {msg}
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-500 italic">No message snippet stored.</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
            {transaction.status !== 'completed' && (
              <button
                onClick={() => {
                  onUpdateStatus(transaction.id, 'completed', 'merchant_confirmed');
                  onClose();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Confirmed Paid
              </button>
            )}
            <button
              onClick={() => onOpenProofModal(transaction)}
              className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Full Proof
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
