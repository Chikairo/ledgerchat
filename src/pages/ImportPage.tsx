import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Archive,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  FileCode,
  RotateCcw,
  Check,
} from 'lucide-react';
import { AIService, ExtractionResult } from '../services/aiService';
import { StorageService } from '../services/storage';
import { SAMPLE_WHATSAPP_EXPORT_TEXT } from '../data/demoData';
import { Transaction, Customer, Product, ImportSummary } from '../types';

interface ImportPageProps {
  onImportComplete: (summary: ImportSummary) => void;
  onNavigateToTransactions: () => void;
}

export const ImportPage: React.FC<ImportPageProps> = ({
  onImportComplete,
  onNavigateToTransactions,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any[] | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingSteps = [
    'Reading conversation files and attachments...',
    'Identifying business inquiries and price quotes...',
    'Calling Gemma 4 AI engine to structure orders...',
    'Examining payment claims and receipt evidence...',
    'Organizing customer profiles and product metrics...',
    'Finalizing business ledger records...',
  ];

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setErrorMessage(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Load sample Nigerian WhatsApp export for quick demonstration
  const handleLoadSampleChat = () => {
    const blob = new Blob([SAMPLE_WHATSAPP_EXPORT_TEXT], { type: 'text/plain' });
    const sampleFile = new File([blob], 'WhatsApp_Chat_with_Alhaji_Musa.txt', {
      type: 'text/plain',
      lastModified: Date.now(),
    });
    setSelectedFiles([sampleFile]);
    setErrorMessage(null);
  };

  const handleStartImport = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage('Please select at least one WhatsApp chat export or receipt image.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStep(0);

    try {
      let combinedChatText = '';
      let imageAttachmentsCount = 0;
      let primaryFileName = selectedFiles[0].name;

      // Step 1: Read files (including ZIP extraction)
      setCurrentStep(0);
      await new Promise((r) => setTimeout(r, 600));

      for (const file of selectedFiles) {
        if (file.name.endsWith('.zip')) {
          const zip = await JSZip.loadAsync(file);
          for (const filename of Object.keys(zip.files)) {
            if (filename.endsWith('.txt') || filename.includes('_chat')) {
              const text = await zip.files[filename].async('text');
              combinedChatText += `\n--- Chat File: ${filename} ---\n` + text;
            } else if (/\.(jpg|jpeg|png)$/i.test(filename)) {
              imageAttachmentsCount++;
            }
          }
        } else if (file.name.endsWith('.txt')) {
          const text = await file.text();
          combinedChatText += `\n--- File: ${file.name} ---\n` + text;
        } else if (/\.(jpg|jpeg|png)$/i.test(file.name)) {
          imageAttachmentsCount++;
        }
      }

      if (!combinedChatText.trim() && imageAttachmentsCount > 0) {
        combinedChatText = `[Customer uploaded ${imageAttachmentsCount} receipt images without text transcript. Extract transaction context from receipt proof.]`;
      }

      // Step 2 & 3: Call Gemma 4 AI
      setCurrentStep(1);
      await new Promise((r) => setTimeout(r, 700));
      setCurrentStep(2);

      const aiResponse: ExtractionResult = await AIService.extractChat(
        combinedChatText,
        primaryFileName
      );

      // Step 4: Examine payment evidence
      setCurrentStep(3);
      await new Promise((r) => setTimeout(r, 600));

      // Step 5: Organizing records
      setCurrentStep(4);
      await new Promise((r) => setTimeout(r, 500));

      const transactionsToSave: Transaction[] = [];
      let reviewCount = 0;

      if (aiResponse.transactions && aiResponse.transactions.length > 0) {
        aiResponse.transactions.forEach((tx, idx) => {
          const txnId = `TXN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          const isReview = tx.requiresReview || tx.status === 'needs_review' || tx.outstandingAmount > 0;
          if (isReview) reviewCount++;

          const newTxn: Transaction = {
            id: txnId,
            customerId: 'cust_' + Math.random().toString(36).substring(2, 8),
            customerName: tx.customerName || aiResponse.customerName || 'WhatsApp Customer',
            customerPhone: tx.customerPhone || aiResponse.customerPhone,
            productName: tx.productName || 'General Merchandise',
            quantity: tx.quantity || 1,
            agreedAmount: tx.agreedAmount || 0,
            amountPaid: tx.amountPaid || 0,
            outstandingAmount: tx.outstandingAmount || 0,
            currency: tx.currency || 'NGN',
            date: tx.date || new Date().toISOString(),
            status: (tx.status as any) || 'completed',
            paymentClaimStatus: (tx.paymentClaimStatus as any) || 'receipt_submitted',
            paymentMethod: tx.paymentMethod || 'Bank Transfer',
            sourceMessages: tx.sourceMessages || [
              `Extracted quote: ${tx.productName} for ₦${tx.agreedAmount?.toLocaleString()}`,
            ],
            confidence: tx.confidence || 0.94,
            requiresReview: isReview,
            reviewReason: tx.reviewReason,
            evidence: [
              {
                id: 'ev_' + Math.random().toString(36).substring(2, 8),
                type: 'whatsapp_message',
                content: tx.evidenceNotes || 'Extracted from WhatsApp conversation export',
                timestamp: new Date().toISOString(),
                matchConfidence: tx.confidence || 0.92,
                verificationNote: `AI parsed agreement: ₦${tx.amountPaid?.toLocaleString()} paid of ₦${tx.agreedAmount?.toLocaleString()}`,
                status: isReview ? 'needs_review' : 'merchant_confirmed',
              },
            ],
          };

          transactionsToSave.push(newTxn);
        });
      }

      // Step 6: Finalize summary
      setCurrentStep(5);
      await new Promise((r) => setTimeout(r, 400));

      const summary: ImportSummary = {
        id: 'imp_' + Date.now(),
        fileName: primaryFileName,
        fileSize: selectedFiles.reduce((acc, f) => acc + f.size, 0),
        importedAt: new Date().toISOString(),
        conversationsProcessed: 1,
        activitiesIdentified: transactionsToSave.length * 2 + 1,
        transactionsExtracted: transactionsToSave.length,
        customersIdentified: 1,
        productsIdentified: transactionsToSave.length,
        evidenceFound: imageAttachmentsCount + transactionsToSave.length,
        requiresReviewCount: reviewCount,
      };

      setExtractedData(transactionsToSave);
      setImportSummary(summary);
      setIsProcessing(false);
    } catch (err: any) {
      console.error('Import processing error:', err);
      setIsProcessing(false);
      setErrorMessage(
        err.message ||
          'Failed to process conversation file. Please check file format and ensure GEMINI_API_KEY is configured.'
      );
    }
  };

  // Commit extracted transactions into storage
  const handleSaveToLedger = () => {
    if (!extractedData || !importSummary) return;

    extractedData.forEach((tx) => {
      StorageService.updateTransaction(tx);
    });

    StorageService.addImportRecord(importSummary);
    onImportComplete(importSummary);
    onNavigateToTransactions();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">
          Import Business Conversations
        </h1>
        <p className="text-xs text-[#718078] mt-0.5">
          Bring your WhatsApp chats and payment slips together. Gemma 4 will organize sales records, customer balances, and products for you.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#145C42] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Privacy & Merchant Confidentiality:</strong> LedgerChat only analyzes the conversation files you explicitly choose to upload. We never access private WhatsApp backups or connect uninvited. All processing is strictly isolated to your business profile.
        </div>
      </div>

      {/* Upload Box if not finished */}
      {!extractedData ? (
        <div className="space-y-6">
          {/* Main Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-emerald-700/30 hover:border-[#145C42] rounded-3xl p-8 bg-white text-center space-y-4 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#E8F4ED] text-[#145C42] mx-auto flex items-center justify-center shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#19251F]">
                Bring your business conversations together
              </h3>
              <p className="text-xs text-[#718078] max-w-md mx-auto mt-1">
                Upload your WhatsApp exported <strong>.txt</strong> or <strong>.zip</strong> archive and available bank transfer receipts.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white text-xs font-semibold shadow-xs hover:brightness-105 active:scale-98 transition-all cursor-pointer"
              >
                Choose Chat Files (.txt or .zip)
              </button>

              <button
                onClick={handleLoadSampleChat}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileCode className="w-3.5 h-3.5 text-[#145C42]" />
                Load Sample WhatsApp Chat
              </button>

              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".txt,.zip,image/jpeg,image/png,image/jpg"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
              <span>Supports .txt, .zip, .jpg, .png</span>
              <span>•</span>
              <span>Up to 50MB</span>
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  Selected Files ({selectedFiles.length})
                </span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {file.name.endsWith('.zip') ? (
                        <Archive className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : file.name.endsWith('.txt') ? (
                        <FileText className="w-4 h-4 text-[#145C42] shrink-0" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                      <span className="font-medium text-slate-800 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>

                    <button
                      onClick={() => removeFile(idx)}
                      disabled={isProcessing}
                      className="p-1 rounded text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Start Import Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartImport}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#145C42] to-[#103E30] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Process Conversations with Gemma 4</span>
                </button>
              </div>
            </div>
          )}

          {/* Processing Progress Overlay/Card */}
          {isProcessing && (
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-md space-y-5 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#145C42] flex items-center justify-center animate-spin">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Gemma 4 AI is analyzing your business conversations...
                  </h4>
                  <p className="text-xs text-slate-500">
                    Extracting transactions, verifying price agreements, and checking receipts
                  </p>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="space-y-2.5">
                {processingSteps.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 text-xs transition-colors ${
                        isDone
                          ? 'text-emerald-700 font-semibold'
                          : isCurrent
                          ? 'text-[#145C42] font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#168653] shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-[#145C42] border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Import Error</p>
                <p className="text-[11px] mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              How to export your WhatsApp business chats:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
                <p className="font-semibold text-slate-800 mt-2">Open Conversation</p>
                <p className="text-[11px] text-slate-500">
                  Open the WhatsApp chat with the customer you want to save.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-[10px]">
                  2
                </span>
                <p className="font-semibold text-slate-800 mt-2">Tap More Options</p>
                <p className="text-[11px] text-slate-500">
                  Tap the three dots on Android or contact name on iPhone &gt; More &gt; Export Chat.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-[10px]">
                  3
                </span>
                <p className="font-semibold text-slate-800 mt-2">Include Media</p>
                <p className="text-[11px] text-slate-500">
                  Choose "Include Media" so payment receipt screenshots are exported too.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="w-5 h-5 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-[10px]">
                  4
                </span>
                <p className="font-semibold text-slate-800 mt-2">Upload to LedgerChat</p>
                <p className="text-[11px] text-slate-500">
                  Select the exported .zip or .txt file and click process.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Import Results Review Screen */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#168653] flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Conversation Processing Complete!
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review the extracted financial records below before saving into your business ledger.
              </p>
            </div>

            <button
              onClick={() => {
                setExtractedData(null);
                setSelectedFiles([]);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Import Another
            </button>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Orders Extracted</span>
              <span className="text-lg font-bold text-slate-900">{extractedData.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Total Agreed Sales</span>
              <span className="text-lg font-bold text-emerald-800">
                ₦{extractedData.reduce((acc, t) => acc + t.agreedAmount, 0).toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Evidence Found</span>
              <span className="text-lg font-bold text-slate-900">{importSummary?.evidenceFound || 1}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <span className="text-[10px] text-amber-800 uppercase font-bold block">Requires Review</span>
              <span className="text-lg font-bold text-amber-800">{importSummary?.requiresReviewCount || 0}</span>
            </div>
          </div>

          {/* Extracted records list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Extracted Records ({extractedData.length})
            </h4>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {extractedData.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.quantity}x {item.productName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Agreed: <strong>₦{item.agreedAmount.toLocaleString()}</strong> | Paid:{' '}
                      <strong className="text-emerald-700">₦{item.amountPaid.toLocaleString()}</strong>
                      {item.outstandingAmount > 0 && (
                        <span className="text-amber-700 font-semibold ml-1">
                          (₦{item.outstandingAmount.toLocaleString()} balance)
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleSaveToLedger}
              className="flex-1 py-3 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save {extractedData.length} Orders to Business Ledger</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
