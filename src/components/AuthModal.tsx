/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Store,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { StorageService } from '../services/storage';
import { BusinessProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: BusinessProfile) => void;
  onSwitchToDemo: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToDemo,
  initialMode = 'register',
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTab(initialMode);
      setErrorMessage(null);
    }
  }, [isOpen, initialMode]);

  // Registration Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Electronics & Gadgets');
  const [city, setCity] = useState('Lagos');
  const [phone, setPhone] = useState('+234 ');

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (!email || !password || !fullName || !businessName) {
        throw new Error('Please fill in all required fields (Name, Shop Name, Email, Password).');
      }

      const res = await ApiClient.auth.register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        category,
        city,
        phone: phone.trim(),
        currency: 'NGN',
        currencySymbol: '₦',
      });

      if (res.success && res.business) {
        const newProfile: BusinessProfile = {
          id: res.business.id,
          name: res.business.name,
          ownerName: res.user.fullName,
          category: res.business.category || category,
          country: 'Nigeria',
          currency: 'NGN',
          currencySymbol: '₦',
          reconciliationFrequency: 'weekly',
          reminderDay: 'Friday',
          reminderTime: '18:00',
          isOnboarded: true,
          isDemoMode: false,
          createdAt: res.business.createdAt,
        };

        StorageService.saveProfile(newProfile);
        StorageService.setActiveMode('real');
        onSuccess(newProfile);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage(err.message || 'Registration failed. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please provide your email and password.');
      }

      const res = await ApiClient.auth.login({
        email: email.trim(),
        password,
      });

      if (res.success && res.business) {
        const profile: BusinessProfile = {
          id: res.business.id,
          name: res.business.name,
          ownerName: res.user.fullName,
          category: res.business.category || 'General Merchandise',
          country: 'Nigeria',
          currency: 'NGN',
          currencySymbol: '₦',
          reconciliationFrequency: 'weekly',
          reminderDay: 'Friday',
          reminderTime: '18:00',
          isOnboarded: true,
          isDemoMode: false,
          createdAt: res.business.createdAt,
        };

        StorageService.saveProfile(profile);
        StorageService.setActiveMode('real');
        onSuccess(profile);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#145C42] to-[#103E30] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#168653] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              LedgerChat Live Account
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            {tab === 'register' ? 'Register Your Business' : 'Welcome Back to Your Shop'}
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            {tab === 'register'
              ? 'Get your dedicated, private business ledger backed by bank-grade security.'
              : 'Sign in to access your sales records, debtor balance tracking, and customer history.'}
          </p>

          {/* Tab buttons */}
          <div className="flex gap-2 mt-4 bg-black/20 p-1 rounded-xl">
            <button
              onClick={() => {
                setTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-[#103E30] shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-[#103E30] shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {tab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Blessing Chikairo"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business / Shop Name *
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Chikairo Gadgets Hub"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="blessing@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 123 4567"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Line / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none bg-white"
                  >
                    <option value="Electronics & Gadgets">Electronics & Phone Accessories</option>
                    <option value="Fashion & Fabrics">Fashion, Shoes & Fabrics</option>
                    <option value="Food & Provisions">Foodstuff & Supermarket</option>
                    <option value="Beauty & Cosmetics">Beauty, Hair & Cosmetics</option>
                    <option value="Building Materials">Building Materials & Hardware</option>
                    <option value="General Retail">General Merchandise & Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Market Center
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Computer Village, Lagos"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#145C42] hover:bg-[#103E30] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Creating Your Business Profile...</span>
                  ) : (
                    <>
                      <span>Open My Live Shop Ledger</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="blessing@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#145C42] hover:bg-[#103E30] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Log In to Live Ledger</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Option for Evaluators & Reviewers */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-2">
              Just evaluating or giving a demonstration?
            </p>
            <button
              onClick={() => {
                onSwitchToDemo();
                onClose();
              }}
              className="text-xs font-bold text-[#145C42] hover:text-[#103E30] inline-flex items-center gap-1.5 underline underline-offset-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Preloaded Demo (Chidi Electronics Lagos)</span>
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#168653]" />
            <span>Encrypted with SHA-256 and PBKDF2</span>
          </div>
          <span>Strict Tenant Isolation</span>
        </div>
      </div>
    </div>
  );
};
