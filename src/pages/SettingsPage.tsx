import React, { useState } from 'react';
import {
  Settings,
  Store,
  Clock,
  Shield,
  Trash2,
  RefreshCw,
  Bell,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Save,
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { StorageService } from '../services/storage';

interface SettingsPageProps {
  profile: BusinessProfile;
  onUpdateProfile: (updated: BusinessProfile) => void;
  activeMode: 'demo' | 'real';
  onToggleMode: (mode: 'demo' | 'real') => void;
  onResetDemo: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  profile,
  onUpdateProfile,
  activeMode,
  onToggleMode,
  onResetDemo,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'privacy'>('profile');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    StorageService.saveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all stored business records? This action cannot be undone.')) {
      StorageService.clearRealData();
      alert('Business records cleared successfully.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#19251F] tracking-tight">Settings</h1>
        <p className="text-xs text-[#718078] mt-0.5">
          Manage your business identity, reconciliation schedules, data privacy, and demonstration modes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'profile', label: 'Business Profile', icon: Store },
          { id: 'preferences', label: 'Reporting & Reminders', icon: Clock },
          { id: 'privacy', label: 'Privacy & Data Controls', icon: Trash2 },
          { id: 'security', label: 'Account & Security', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#145C42] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#168653]" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Business Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#145C42]/20"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Owner / Manager Name</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#145C42]/20"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#145C42]/20 bg-white"
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Operating Currency</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.currency}
                  disabled
                  className="w-24 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-mono"
                />
                <input
                  type="text"
                  value="Nigerian Naira (₦)"
                  disabled
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Business Details
            </button>
          </div>
        </form>
      )}

      {/* Preferences Form */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Reporting & Reconciliation Frequency
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                How often would you like to reconcile your business records?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'weekly', title: 'Every Week', desc: 'Recommended for active daily WhatsApp vendors' },
                  { id: 'biweekly', title: 'Every Two Weeks', desc: 'Good for moderate volume merchants' },
                  { id: 'monthly', title: 'Every Month', desc: 'Standard monthend reconciliation' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-colors ${
                      formData.reconciliationFrequency === opt.id
                        ? 'border-[#145C42] bg-[#E8F4ED]/60 text-[#145C42]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="reconciliationFrequency"
                        value={opt.id}
                        checked={formData.reconciliationFrequency === opt.id}
                        onChange={() => setFormData({ ...formData, reconciliationFrequency: opt.id as any })}
                        className="text-[#145C42]"
                      />
                      <span className="font-bold">{opt.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-2">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Reminder Day</label>
                <select
                  value={formData.reminderDay}
                  onChange={(e) => setFormData({ ...formData, reminderDay: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Friday">Friday (End of work week)</option>
                  <option value="Saturday">Saturday (Market weekend)</option>
                  <option value="Sunday">Sunday (Preparation for new week)</option>
                  <option value="Monday">Monday (Start of week)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reminder Time</label>
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#145C42] hover:bg-[#103E30] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Reporting Preferences
            </button>
          </div>
        </form>
      )}

      {/* Privacy & Demo Mode Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-4 text-xs">
          {/* Mode Switcher */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Workspace Environment</h3>
            <p className="text-slate-500">
              Switch between the demo business (Chidi Electronics) and your private live business records.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onToggleMode(activeMode === 'demo' ? 'real' : 'demo')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#145C42]" />
                <span>Currently in: <strong>{activeMode === 'demo' ? 'Demo Mode' : 'Live Workspace'}</strong></span>
                <span className="text-[#145C42] underline ml-1">Switch</span>
              </button>

              {activeMode === 'demo' && (
                <button
                  onClick={onResetDemo}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold border border-amber-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Demo Transactions
                </button>
              )}
            </div>
          </div>

          {/* Data Deletion */}
          <div className="bg-white p-6 rounded-2xl border border-rose-200/70 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-rose-900">Data Deletion & Privacy</h3>
            <p className="text-slate-600 leading-relaxed">
              In accordance with data minimization policies, you have complete sovereignty over your imported conversations and parsed transactions.
            </p>

            <button
              onClick={handleClearData}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete All Real Business Records
            </button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Security & Authentication</h3>
          <p className="text-slate-500">
            Account sessions and database isolation prevent other businesses from accessing your sensitive transactions.
          </p>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#168653]" />
            <span>Active Session Scoped to: <strong>{profile.ownerName}</strong> ({profile.name})</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-slate-800">Supported Languages</span>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[#145C42] font-bold">
                English (Active)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500">
                Nigerian Pidgin (AI Parsed)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400">
                Yorùbá (Coming soon)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400">
                Igbo (Coming soon)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400">
                Hausa (Coming soon)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
