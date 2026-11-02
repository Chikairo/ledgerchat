import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  Calendar,
  User,
  Paperclip,
  CheckCheck,
  Receipt,
  Eye,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Conversation, Transaction } from '../types';

interface ConversationsPageProps {
  conversations: Conversation[];
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
  onOpenProofModal: (transaction: Transaction) => void;
  onNavigateToImport: () => void;
}

export const ConversationsPage: React.FC<ConversationsPageProps> = ({
  conversations,
  transactions,
  onSelectTransaction,
  onOpenProofModal,
  onNavigateToImport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    conversations[0]?.id || ''
  );

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  // Selected conversation
  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === selectedConversationId) ||
      filteredConversations[0] ||
      null
    );
  }, [conversations, selectedConversationId, filteredConversations]);

  // Related transactions
  const relatedTransactions = useMemo(() => {
    if (!activeConversation) return [];
    return transactions.filter(
      (tx) =>
        activeConversation.relatedTransactionIds.includes(tx.id) ||
        tx.customerName.toLowerCase() === activeConversation.customerName.toLowerCase()
    );
  }, [activeConversation, transactions]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">WhatsApp Chats</h1>
          <p className="text-xs text-[#718078] mt-0.5">
            Read through your original customer WhatsApp conversations and see the exact sales and payments extracted from each chat.
          </p>
        </div>

        <button
          onClick={onNavigateToImport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#145C42] text-white text-xs font-semibold hover:bg-[#103E30] transition-colors cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Add WhatsApp Chat
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px] max-h-[750px]">
        {/* Left Column: Conversation List (4 cols) */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-slate-200 flex flex-col">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search chats or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#145C42]"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No conversations found matching "{searchQuery}"
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#E8F4ED]/60 border-l-4 border-[#145C42]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {conv.customerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {conv.customerName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {new Date(conv.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{conv.messages.length} messages</span>
                        {conv.relatedTransactionIds.length > 0 && (
                          <span className="text-[#145C42] font-semibold bg-[#E8F4ED] px-1 rounded">
                            {conv.relatedTransactionIds.length} order(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat View & Linked Records (7 or 8 cols) */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col bg-[#F7F9F7]">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-xs">
                    {activeConversation.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {activeConversation.customerName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {activeConversation.customerPhone || 'Imported WhatsApp Chat'}
                    </p>
                  </div>
                </div>

                {relatedTransactions.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
                    <Receipt className="w-3.5 h-3.5 text-[#145C42]" />
                    <span>
                      {relatedTransactions.length} Linked Order{relatedTransactions.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Linked Orders Ribbon (Quick Access) */}
              {relatedTransactions.length > 0 && (
                <div className="bg-[#E8F4ED]/80 border-b border-emerald-200 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#145C42] uppercase text-[10px] tracking-wider">
                      Orders Extracted from This Chat:
                    </span>
                    {relatedTransactions.map((tx) => (
                      <button
                        key={tx.id}
                        onClick={() => onSelectTransaction(tx)}
                        className="bg-white hover:bg-emerald-100 text-slate-800 text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{tx.productName}</span>
                        <strong className="text-[#145C42]">₦{tx.agreedAmount.toLocaleString()}</strong>
                        <span className="text-[9px] text-slate-500">({tx.status.replace('_', ' ')})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFEAE2]/20">
                {activeConversation.messages.map((msg) => {
                  const isMerchant = msg.sender === 'merchant';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMerchant ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 shadow-2xs space-y-1 ${
                          isMerchant
                            ? 'bg-[#D9FDD3] text-slate-900 rounded-tr-none'
                            : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold text-slate-500">
                          <span>{msg.senderName}</span>
                          <span className="font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed">{msg.text}</p>

                        {/* Image attachment preview if present */}
                        {msg.hasAttachment && msg.attachmentUrl && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60">
                            <div className="rounded-xl overflow-hidden border border-slate-200 max-w-xs bg-slate-50 relative group">
                              <img
                                src={msg.attachmentUrl}
                                alt="Payment proof attachment"
                                className="w-full h-auto object-cover max-h-48"
                              />
                              <div className="p-1.5 bg-white/95 text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                                <span className="flex items-center gap-1 text-[#145C42]">
                                  <Paperclip className="w-3 h-3" /> Payment Proof Attachment
                                </span>
                                {relatedTransactions[0] && (
                                  <button
                                    onClick={() => onOpenProofModal(relatedTransactions[0])}
                                    className="text-[#145C42] hover:underline font-bold text-[10px]"
                                  >
                                    Verify Proof
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Footer note */}
              <div className="p-2.5 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500">
                Retrieved from exported WhatsApp conversation archive. LedgerChat organizes your chats into financial records.
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Select a Conversation</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Pick a customer on the left to read the exact negotiation, agreed price, and proof of payment messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
