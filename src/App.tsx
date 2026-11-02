/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { ProofModal } from './components/ProofModal';
import { TransactionDrawer } from './components/TransactionDrawer';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { UserEntryModal } from './components/UserEntryModal';

import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CustomersPage } from './pages/CustomersPage';
import { ProductsPage } from './pages/ProductsPage';
import { BusinessInsightsPage } from './pages/BusinessInsightsPage';
import { ConversationsPage } from './pages/ConversationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ImportPage } from './pages/ImportPage';
import { DeveloperPage } from './pages/DeveloperPage';

import { StorageService } from './services/storage';
import { BusinessProfile, Transaction, Customer, Product, Conversation, ImportSummary } from './types';

export default function App() {
  // Public Landing vs App Dashboard view state
  const [currentView, setCurrentView] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const envParam = params.get('env');
      const pageParam = params.get('page');
      const pathname = window.location.pathname;

      if (
        viewParam === 'app' ||
        viewParam === 'demo' ||
        envParam === 'demo' ||
        envParam === 'live' ||
        envParam === 'real' ||
        pageParam ||
        pathname.startsWith('/app') ||
        pathname.startsWith('/demo') ||
        pathname.startsWith('/developer')
      ) {
        return 'app';
      }
    }
    return 'landing';
  });

  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [activeMode, setActiveMode] = useState<'demo' | 'real'>(() => StorageService.getActiveMode());
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this_month');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Core Data State
  const [profile, setProfile] = useState<BusinessProfile>(() => StorageService.getProfile());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [conversations, setConversations] = useState<Conversation[]>(() => StorageService.getConversations());

  // Modals & Drawers
  const [drawerTransaction, setDrawerTransaction] = useState<Transaction | null>(null);
  const [proofTransaction, setProofTransaction] = useState<Transaction | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('register');
  const [showUserEntryModal, setShowUserEntryModal] = useState<boolean>(false);

  // Sync state whenever storage updates
  const reloadData = useCallback(() => {
    setActiveMode(StorageService.getActiveMode());
    setProfile(StorageService.getProfile());
    setTransactions(StorageService.getTransactions());
    setCustomers(StorageService.getCustomers());
    setProducts(StorageService.getProducts());
    setConversations(StorageService.getConversations());
  }, []);

  // Check URL parameters for environment routing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const envParam = params.get('env');
      const viewParam = params.get('view');
      const pageParam = params.get('page');
      const pathname = window.location.pathname;

      if (envParam === 'demo' || viewParam === 'demo' || pathname.startsWith('/demo')) {
        StorageService.setActiveMode('demo');
        setActiveMode('demo');
        setCurrentView('app');
      } else if (envParam === 'live' || envParam === 'real' || viewParam === 'app' || pathname.startsWith('/app')) {
        StorageService.setActiveMode('real');
        setActiveMode('real');
        setCurrentView('app');
      }

      if (pathname === '/developer' || pageParam === 'developer') {
        setCurrentPage('developer');
        setCurrentView('app');
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      reloadData();
    };
    window.addEventListener('ledgerchat_data_updated', handleStorageChange);
    return () => window.removeEventListener('ledgerchat_data_updated', handleStorageChange);
  }, [reloadData]);

  // Mode Switcher
  const handleToggleMode = (newMode: 'demo' | 'real') => {
    StorageService.setActiveMode(newMode);
    setActiveMode(newMode);
    reloadData();
    if (newMode === 'real' && !StorageService.getProfile().isOnboarded) {
      setAuthInitialMode('register');
      setShowAuthModal(true);
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset demo transactions for Chidi Electronics to defaults?')) {
      StorageService.resetDemoData();
      reloadData();
    }
  };

  // Transaction Status update from drawer or proof modal
  const handleUpdateTransactionStatus = (
    txId: string,
    newStatus: Transaction['status'],
    newClaimStatus: Transaction['paymentClaimStatus'],
    merchantNote?: string
  ) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    const updatedTx: Transaction = {
      ...tx,
      status: newStatus,
      paymentClaimStatus: newClaimStatus,
      amountPaid: newStatus === 'completed' ? tx.agreedAmount : tx.amountPaid,
      outstandingAmount: newStatus === 'completed' ? 0 : tx.outstandingAmount,
      requiresReview: newStatus === 'needs_review',
      notes: merchantNote ? `${tx.notes ? tx.notes + ' | ' : ''}${merchantNote}` : tx.notes,
    };

    StorageService.updateTransaction(updatedTx);
    reloadData();
  };

  const pendingReviewsCount = transactions.filter(
    (t) => t.requiresReview || t.status === 'needs_review'
  ).length;

  // ----------------------------------------------------
  // Render: 1. Public Marketing Landing Page
  // ----------------------------------------------------
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onExploreDemo={() => {
            StorageService.setActiveMode('demo');
            setActiveMode('demo');
            reloadData();
            setCurrentPage('overview');
            setCurrentView('app');
          }}
          onOpenEntryModal={() => setShowUserEntryModal(true)}
          onOpenSignIn={() => {
            setAuthInitialMode('login');
            setShowAuthModal(true);
          }}
          onOpenDeveloperDocs={() => {
            setCurrentPage('developer');
            setCurrentView('app');
          }}
        />

        {/* User Entry / Account Selection Portal */}
        <UserEntryModal
          isOpen={showUserEntryModal}
          onClose={() => setShowUserEntryModal(false)}
          onExploreDemo={() => {
            StorageService.setActiveMode('demo');
            setActiveMode('demo');
            reloadData();
            setCurrentPage('overview');
            setCurrentView('app');
          }}
          onCreateAccount={() => {
            setAuthInitialMode('register');
            setShowAuthModal(true);
          }}
          onSignIn={() => {
            setAuthInitialMode('login');
            setShowAuthModal(true);
          }}
        />

        {/* Merchant Live Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          initialMode={authInitialMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(newProfile) => {
            reloadData();
            setShowAuthModal(false);
            setCurrentPage('overview');
            setCurrentView('app');
          }}
          onSwitchToDemo={() => {
            handleToggleMode('demo');
            setShowAuthModal(false);
            setCurrentPage('overview');
            setCurrentView('app');
          }}
        />
      </>
    );
  }

  // ----------------------------------------------------
  // Render: 2. Merchant Application Workspace
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#19251F] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        profile={profile}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        onNavigate={setCurrentPage}
        activeMode={activeMode}
        onToggleMode={handleToggleMode}
        onResetDemo={handleResetDemo}
        onOpenAuthModal={() => {
          setAuthInitialMode('login');
          setShowAuthModal(true);
        }}
        onNavigateToHome={() => setCurrentView('landing')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          pendingReviewsCount={pendingReviewsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'overview' && (
              <OverviewPage
                profile={profile}
                transactions={transactions}
                customers={customers}
                products={products}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                onSelectTransaction={(tx) => setDrawerTransaction(tx)}
                onNavigate={setCurrentPage}
                onOpenProofModal={(tx) => setProofTransaction(tx)}
              />
            )}

            {currentPage === 'transactions' && (
              <TransactionsPage
                transactions={transactions}
                customers={customers}
                products={products}
                onSelectTransaction={(tx) => setDrawerTransaction(tx)}
                onOpenProofModal={(tx) => setProofTransaction(tx)}
              />
            )}

            {currentPage === 'customers' && (
              <CustomersPage
                customers={customers}
                transactions={transactions}
                conversations={conversations}
                onSelectTransaction={(tx) => setDrawerTransaction(tx)}
              />
            )}

            {currentPage === 'products' && (
              <ProductsPage
                products={products}
                transactions={transactions}
                onSelectTransaction={(tx) => setDrawerTransaction(tx)}
              />
            )}

            {currentPage === 'insights' && (
              <BusinessInsightsPage
                profile={profile}
                transactions={transactions}
                customers={customers}
                products={products}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'conversations' && (
              <ConversationsPage
                conversations={conversations}
                transactions={transactions}
                onSelectTransaction={(tx) => setDrawerTransaction(tx)}
                onOpenProofModal={(tx) => setProofTransaction(tx)}
                onNavigateToImport={() => setCurrentPage('import')}
              />
            )}

            {currentPage === 'reports' && (
              <ReportsPage
                profile={profile}
                transactions={transactions}
                customers={customers}
                products={products}
              />
            )}

            {currentPage === 'settings' && (
              <SettingsPage
                profile={profile}
                onUpdateProfile={(up) => {
                  setProfile(up);
                  StorageService.saveProfile(up);
                }}
                activeMode={activeMode}
                onToggleMode={handleToggleMode}
                onResetDemo={handleResetDemo}
              />
            )}

            {currentPage === 'import' && (
              <ImportPage
                onImportComplete={(summary: ImportSummary) => {
                  reloadData();
                }}
                onNavigateToTransactions={() => setCurrentPage('transactions')}
              />
            )}

            {currentPage === 'developer' && <DeveloperPage />}

            {currentPage === 'onboarding' && (
              <div className="py-6">
                <OnboardingModal
                  isOpen={true}
                  onComplete={(newProfile, goToImport) => {
                    StorageService.saveProfile(newProfile);
                    StorageService.setActiveMode('real');
                    reloadData();
                    setCurrentPage(goToImport ? 'import' : 'overview');
                  }}
                  onExploreDemo={() => {
                    StorageService.setActiveMode('demo');
                    reloadData();
                    setCurrentPage('overview');
                  }}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        pendingReviewsCount={pendingReviewsCount}
      />

      {/* Transaction Slide-Over Drawer */}
      <TransactionDrawer
        transaction={drawerTransaction}
        onClose={() => setDrawerTransaction(null)}
        onOpenProofModal={(tx) => setProofTransaction(tx)}
        onUpdateStatus={handleUpdateTransactionStatus}
      />

      {/* Payment Evidence Modal */}
      <ProofModal
        transaction={proofTransaction}
        onClose={() => setProofTransaction(null)}
        onUpdateStatus={handleUpdateTransactionStatus}
      />

      {/* Merchant Live Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authInitialMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(newProfile) => {
          reloadData();
          setShowAuthModal(false);
          setCurrentPage('overview');
        }}
        onSwitchToDemo={() => {
          handleToggleMode('demo');
          setShowAuthModal(false);
        }}
      />

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={(newProfile, goToImport) => {
          StorageService.saveProfile(newProfile);
          StorageService.setActiveMode('real');
          reloadData();
          setShowOnboarding(false);
          setCurrentPage(goToImport ? 'import' : 'overview');
        }}
        onExploreDemo={() => {
          StorageService.setActiveMode('demo');
          reloadData();
          setShowOnboarding(false);
          setCurrentPage('overview');
        }}
      />
    </div>
  );
}
