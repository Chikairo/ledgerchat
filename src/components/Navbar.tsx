import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
  Store,
  User,
  LogOut,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { StorageService } from '../services/storage';

interface NavbarProps {
  profile: BusinessProfile;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onNavigate: (page: string) => void;
  activeMode: 'demo' | 'real';
  onToggleMode: (mode: 'demo' | 'real') => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  selectedPeriod,
  onPeriodChange,
  onNavigate,
  activeMode,
  onToggleMode,
  onResetDemo,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      {/* Demo Banner */}
      {activeMode === 'demo' && (
        <div className="bg-[#103E30] text-emerald-100 text-xs py-1.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-3xl overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-[#168653] text-white font-semibold px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">
              Demo Business
            </span>
            <span>
              Exploring sample data for <strong>{profile.name}</strong> (Lagos, Nigeria). No real customer data affected.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onResetDemo}
              className="hover:text-white flex items-center gap-1 text-[11px] underline underline-offset-2 transition-colors cursor-pointer"
              title="Reset demo transactions to default"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Demo
            </button>
            <button
              onClick={() => onToggleMode('real')}
              className="bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md transition-colors cursor-pointer"
            >
              Switch to My Business
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Business Name */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#145C42] to-[#103E30] flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-900/10 transition-transform group-hover:scale-105">
              <span className="font-bold text-lg tracking-tight">LC</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#19251F] tracking-tight">LedgerChat</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#E8F4ED] text-[#145C42]">
                  Fintech
                </span>
              </div>
              <p className="text-[11px] text-[#718078] hidden md:block">
                Your conversations. Your business.
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" />

          {/* Business Selector / Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-xs">
            <Store className="w-3.5 h-3.5 text-[#145C42]" />
            <span className="font-medium text-[#19251F] max-w-[150px] truncate">
              {profile.name}
            </span>
            <span className="text-[10px] text-slate-400">({profile.currency})</span>
          </div>
        </div>

        {/* Right: Period Selector, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Period Selector */}
          <div className="relative">
            <select
              aria-label="Reporting Period"
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="text-xs font-medium bg-slate-50 hover:bg-slate-100 text-[#19251F] border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-[#145C42]/20 cursor-pointer appearance-none transition-colors"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">This Year</option>
              <option value="all_time">All Time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Quick Import Action Button */}
          <button
            onClick={() => onNavigate('import')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-[#145C42] hover:bg-[#103E30] text-white px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Import Chat</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#E9A23B] absolute top-1.5 right-1.5" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800">Business Alerts & Reminders</h4>
                  <span className="text-[10px] text-[#145C42] font-medium">3 unread</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/50 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-[#E9A23B] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Outstanding Balance</p>
                      <p className="text-[11px] text-slate-600">
                        Blessing Adeyemi has ₦50,000 pending payment for 2 Ring Lights.
                      </p>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/50 flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#168653] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Payment Verified</p>
                      <p className="text-[11px] text-slate-600">
                        Alhaji Musa Bello paid ₦140,000 via GTBank.
                      </p>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 flex gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#145C42] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Reconciliation Ready</p>
                      <p className="text-[11px] text-slate-600">
                        Weekly business summary for {profile.name} is ready for export.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <div className="w-7 h-7 rounded-full bg-[#145C42] text-white flex items-center justify-center font-bold text-xs">
                {profile.ownerName?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden md:inline-block max-w-[100px] truncate">
                {profile.ownerName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800 truncate">{profile.ownerName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{profile.name}</p>
                  <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                    {activeMode === 'demo' ? 'Demonstration Mode' : 'Live Merchant Workspace'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Business Profile & Settings
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onToggleMode(activeMode === 'demo' ? 'real' : 'demo');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#145C42]" />
                  {activeMode === 'demo' ? 'Switch to My Live Business' : 'Switch to Demo Business'}
                </button>

                {activeMode === 'demo' && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onResetDemo();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                    Reset Demo Records
                  </button>
                )}

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('onboarding');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    Re-run Onboarding Tour
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
