import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Store,
  Clock,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BusinessProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: BusinessProfile, goToImport: boolean) => void;
  onExploreDemo: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onExploreDemo,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('Electronics & Mobile Gadgets');
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [reminderDay, setReminderDay] = useState('Friday');
  const [reminderTime, setReminderTime] = useState('18:00');

  const handleNext = () => {
    if (step === 2 && (!businessName.trim() || !ownerName.trim())) {
      alert('Please enter your business name and your name.');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      triggerFinish(false);
    }
  };

  const triggerFinish = (goToImport: boolean) => {
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    const profile: BusinessProfile = {
      id: 'biz_' + Math.random().toString(36).substring(2, 9),
      name: businessName.trim() || 'My Business',
      ownerName: ownerName.trim() || 'Business Owner',
      category,
      country: 'Nigeria',
      currency: 'NGN',
      currencySymbol: '₦',
      reconciliationFrequency: frequency,
      reminderDay,
      reminderTime,
      isOnboarded: true,
      isDemoMode: false,
      createdAt: new Date().toISOString(),
    };

    onComplete(profile, goToImport);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Step Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full flex">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-full flex-1 transition-all duration-300 ${
                s <= step ? 'bg-[#145C42]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Screen 1: Welcome */}
          {step === 1 && (
            <div className="space-y-5 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F4ED] text-[#145C42] flex items-center justify-center shadow-xs mx-auto sm:mx-0">
                <Sparkles className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#145C42] uppercase tracking-wider block mb-1">
                  Welcome to LedgerChat
                </span>
                <h2 className="text-2xl font-extrabold text-[#19251F] tracking-tight">
                  Understand your business without spending hours recording transactions.
                </h2>
                <p className="text-xs text-[#718078] mt-2 leading-relaxed">
                  LedgerChat turns your unstructured WhatsApp business conversations and payment screenshots into clean financial records, customer purchase histories, and real-time sales reports.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center gap-2.5 text-left">
                <ShieldCheck className="w-4 h-4 text-[#145C42] shrink-0" />
                <span>
                  Designed specifically for Nigerian merchants, wholesalers, and WhatsApp vendors.
                </span>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Set Up My Business</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreDemo}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#145C42]" />
                  <span>Explore Demo (Chidi Electronics)</span>
                </button>
              </div>
            </div>
          )}

          {/* Screen 2: Business Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#145C42] uppercase tracking-wider block">
                  Step 2 of 4
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Tell us about your business
                </h2>
                <p className="text-xs text-slate-500">
                  We'll tailor your currency, sales tracking, and categories to match your store.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    What is your business name?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Adeola Fabrics, Chidi Gadgets, Mama Buka..."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#145C42]/20 font-medium"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    What is your name (Owner / Manager)?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Babatunde, Blessing, Chidubem..."
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#145C42]/20 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Business Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Electronics & Mobile Gadgets">Electronics & Mobile Gadgets</option>
                    <option value="Fashion, Fabrics & Boutique">Fashion, Fabrics & Boutique</option>
                    <option value="Wholesale & Retail Trading">Wholesale & Retail Trading</option>
                    <option value="Beauty, Hair & Cosmetics">Beauty, Hair & Cosmetics</option>
                    <option value="Food & Provisions">Food & Provisions</option>
                    <option value="Auto Parts & Hardware">Auto Parts & Hardware</option>
                    <option value="Independent Services & Consulting">Independent Services & Consulting</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      value="Nigeria"
                      disabled
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Currency</label>
                    <input
                      type="text"
                      value="Nigerian Naira (₦)"
                      disabled
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="py-2.5 px-5 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Screen 3: Reporting Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#145C42] uppercase tracking-wider block">
                  Step 3 of 4
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  How often would you like to organize your business records?
                </h2>
                <p className="text-xs text-slate-500">
                  Stay on top of what customers owe you before the monthend rush.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { id: 'weekly', title: 'Every week', desc: 'Recommended for daily active sales and fast reconciliation' },
                  { id: 'biweekly', title: 'Every two weeks', desc: 'Mid-month and monthend check-ins' },
                  { id: 'monthly', title: 'Every month', desc: 'End-of-month balance and tax summary' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setFrequency(opt.id as any)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      frequency === opt.id
                        ? 'border-[#145C42] bg-[#E8F4ED]/60 text-[#145C42] ring-1 ring-[#145C42]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{opt.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        frequency === opt.id ? 'border-[#145C42] bg-[#145C42]' : 'border-slate-300'
                      }`}
                    >
                      {frequency === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </label>
                ))}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Preferred Reminder Day
                    </label>
                    <select
                      value={reminderDay}
                      onChange={(e) => setReminderDay(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <option value="Friday">Friday (End of work week)</option>
                      <option value="Saturday">Saturday (Market weekend)</option>
                      <option value="Sunday">Sunday (Ahead of new week)</option>
                      <option value="Monday">Monday (Start of week)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Reminder Time</label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="py-2.5 px-5 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Screen 4: Connect Business Records */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#145C42] uppercase tracking-wider block">
                  Step 4 of 4
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Connect your business records
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  LedgerChat works with supported WhatsApp conversation exports. You can share your exported conversations and available attachments with us. We will organize the business information for you.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#145C42]">
                  <UploadCloud className="w-4 h-4" />
                  <span>How to export your first chat:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
                  <li>Open WhatsApp &gt; Pick customer chat &gt; Tap More.</li>
                  <li>Select <strong>Export Chat</strong> &gt; Choose <strong>Include Media</strong>.</li>
                  <li>Save the .txt or .zip file and upload it into LedgerChat.</li>
                </ol>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => triggerFinish(true)}
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Import My First WhatsApp Chat Now</span>
                </button>

                <button
                  onClick={() => triggerFinish(false)}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
