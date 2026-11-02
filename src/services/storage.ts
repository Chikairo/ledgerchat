import {
  BusinessProfile,
  Customer,
  Product,
  Transaction,
  Conversation,
  ImportSummary,
  UserAccount,
  BusinessObservation,
} from '../types';
import {
  DEMO_PROFILE,
  DEMO_CUSTOMERS,
  DEMO_PRODUCTS,
  DEMO_TRANSACTIONS,
  DEMO_CONVERSATIONS,
  getFreshDemoTransactions,
  getFreshDemoCustomers,
  getFreshDemoConversations,
} from '../data/demoData';

const STORAGE_KEYS = {
  CURRENT_USER: 'ledgerchat_user',
  ACTIVE_MODE: 'ledgerchat_active_mode', // 'demo' | 'real'
  DEMO_PROFILE: 'ledgerchat_demo_profile',
  DEMO_TRANSACTIONS: 'ledgerchat_demo_transactions',
  DEMO_CUSTOMERS: 'ledgerchat_demo_customers',
  DEMO_PRODUCTS: 'ledgerchat_demo_products',
  DEMO_CONVERSATIONS: 'ledgerchat_demo_conversations',
  DEMO_VERSION: 'ledgerchat_demo_version_v3',
  REAL_PROFILE: 'ledgerchat_real_profile',
  REAL_TRANSACTIONS: 'ledgerchat_real_transactions',
  REAL_CUSTOMERS: 'ledgerchat_real_customers',
  REAL_PRODUCTS: 'ledgerchat_real_products',
  REAL_CONVERSATIONS: 'ledgerchat_real_conversations',
  IMPORT_HISTORY: 'ledgerchat_import_history',
};

// Dispatch storage change event for reactive UI updates
function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('ledgerchat_data_updated'));
  }
}

export const StorageService = {
  // Current mode
  getActiveMode(): 'demo' | 'real' {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_MODE) as 'demo' | 'real') || 'demo';
  },

  setActiveMode(mode: 'demo' | 'real') {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MODE, mode);
    notifyChange();
  },

  // User Auth
  getCurrentUser(): UserAccount | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserAccount | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    notifyChange();
  },

  // Business Profile
  getProfile(): BusinessProfile {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_PROFILE : STORAGE_KEYS.REAL_PROFILE;
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }

    if (mode === 'demo') {
      this.saveProfile(DEMO_PROFILE);
      return DEMO_PROFILE;
    }

    // Default un-onboarded profile for real merchant
    const defaultReal: BusinessProfile = {
      id: 'biz_' + Math.random().toString(36).substring(2, 9),
      name: 'My Business',
      ownerName: 'Business Owner',
      category: 'General Retail',
      country: 'Nigeria',
      currency: 'NGN',
      currencySymbol: '₦',
      reconciliationFrequency: 'weekly',
      reminderDay: 'Friday',
      reminderTime: '18:00',
      isOnboarded: false,
      isDemoMode: false,
      createdAt: new Date().toISOString(),
    };
    return defaultReal;
  },

  saveProfile(profile: BusinessProfile) {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_PROFILE : STORAGE_KEYS.REAL_PROFILE;
    localStorage.setItem(key, JSON.stringify(profile));
    notifyChange();
  },

  // Transactions
  getTransactions(): Transaction[] {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_TRANSACTIONS : STORAGE_KEYS.REAL_TRANSACTIONS;
    const data = localStorage.getItem(key);

    if (mode === 'demo') {
      const version = localStorage.getItem(STORAGE_KEYS.DEMO_VERSION);
      const REQUIRED_VERSION = 'v2026_11_live_dates';
      let needsRefresh = !data || version !== REQUIRED_VERSION;

      if (data && !needsRefresh) {
        try {
          const parsed: Transaction[] = JSON.parse(data);
          const now = new Date();
          // Check that demo transactions have active records for current month AND today
          const hasCurrentMonth = parsed.some((t) => {
            const d = new Date(t.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          });
          const hasToday = parsed.some((t) => {
            const d = new Date(t.date);
            return (
              d.getFullYear() === now.getFullYear() &&
              d.getMonth() === now.getMonth() &&
              d.getDate() === now.getDate()
            );
          });
          if (!hasCurrentMonth || !hasToday || parsed.length === 0) {
            needsRefresh = true;
          }
        } catch {
          needsRefresh = true;
        }
      }

      if (needsRefresh) {
        const fresh = getFreshDemoTransactions();
        localStorage.setItem(key, JSON.stringify(fresh));
        localStorage.setItem(STORAGE_KEYS.DEMO_VERSION, REQUIRED_VERSION);
        this.saveCustomers(getFreshDemoCustomers());
        this.saveConversations(getFreshDemoConversations());
        this.recomputeCustomerAndProductTotals();
        return fresh;
      }

      try {
        return JSON.parse(data!);
      } catch {
        return getFreshDemoTransactions();
      }
    }

    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  },

  saveTransactions(transactions: Transaction[]) {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_TRANSACTIONS : STORAGE_KEYS.REAL_TRANSACTIONS;
    localStorage.setItem(key, JSON.stringify(transactions));
    notifyChange();
  },

  updateTransaction(updated: Transaction) {
    const current = this.getTransactions();
    const index = current.findIndex((t) => t.id === updated.id);
    if (index >= 0) {
      current[index] = updated;
    } else {
      current.unshift(updated);
    }
    this.saveTransactions(current);
    this.recomputeCustomerAndProductTotals();
  },

  deleteTransaction(id: string) {
    const current = this.getTransactions().filter((t) => t.id !== id);
    this.saveTransactions(current);
    this.recomputeCustomerAndProductTotals();
  },

  // Customers
  getCustomers(): Customer[] {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_CUSTOMERS : STORAGE_KEYS.REAL_CUSTOMERS;
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }

    if (mode === 'demo') {
      this.saveCustomers(DEMO_CUSTOMERS);
      return DEMO_CUSTOMERS;
    }
    return [];
  },

  saveCustomers(customers: Customer[]) {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_CUSTOMERS : STORAGE_KEYS.REAL_CUSTOMERS;
    localStorage.setItem(key, JSON.stringify(customers));
    notifyChange();
  },

  // Products
  getProducts(): Product[] {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_PRODUCTS : STORAGE_KEYS.REAL_PRODUCTS;
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }

    if (mode === 'demo') {
      this.saveProducts(DEMO_PRODUCTS);
      return DEMO_PRODUCTS;
    }
    return [];
  },

  saveProducts(products: Product[]) {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_PRODUCTS : STORAGE_KEYS.REAL_PRODUCTS;
    localStorage.setItem(key, JSON.stringify(products));
    notifyChange();
  },

  // Conversations
  getConversations(): Conversation[] {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_CONVERSATIONS : STORAGE_KEYS.REAL_CONVERSATIONS;
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }

    if (mode === 'demo') {
      this.saveConversations(DEMO_CONVERSATIONS);
      return DEMO_CONVERSATIONS;
    }
    return [];
  },

  saveConversations(conversations: Conversation[]) {
    const mode = this.getActiveMode();
    const key = mode === 'demo' ? STORAGE_KEYS.DEMO_CONVERSATIONS : STORAGE_KEYS.REAL_CONVERSATIONS;
    localStorage.setItem(key, JSON.stringify(conversations));
    notifyChange();
  },

  // Imports
  getImports(): ImportSummary[] {
    const data = localStorage.getItem(STORAGE_KEYS.IMPORT_HISTORY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addImportRecord(summary: ImportSummary) {
    const current = this.getImports();
    current.unshift(summary);
    localStorage.setItem(STORAGE_KEYS.IMPORT_HISTORY, JSON.stringify(current));
    notifyChange();
  },

  // Add or merge imported transactions with intelligent deduplication
  importTransactions(incomingTxns: Transaction[]): {
    added: number;
    updated: number;
    flaggedDuplicates: number;
  } {
    const current = this.getTransactions();
    let added = 0;
    let updated = 0;
    let flaggedDuplicates = 0;

    incomingTxns.forEach((incoming) => {
      // Find matching existing transaction by ID, reference, or (customer + product + amount + close date)
      const existingIndex = current.findIndex((curr) => {
        if (curr.id === incoming.id) return true;

        // Check reference match in evidence
        const currRef = curr.evidence?.find((e) => e.transactionReference)?.transactionReference;
        const incRef = incoming.evidence?.find((e) => e.transactionReference)?.transactionReference;
        if (currRef && incRef && currRef.trim().toLowerCase() === incRef.trim().toLowerCase()) {
          return true;
        }

        // Check customer name + product name + agreed amount + date within 72 hours
        const sameCust = curr.customerName.toLowerCase().trim() === incoming.customerName.toLowerCase().trim();
        const sameProd = curr.productName.toLowerCase().trim() === incoming.productName.toLowerCase().trim();
        const sameAmount = Math.abs(curr.agreedAmount - incoming.agreedAmount) < 5;

        if (sameCust && sameProd && sameAmount) {
          const timeDiffHours = Math.abs(new Date(curr.date).getTime() - new Date(incoming.date).getTime()) / (1000 * 60 * 60);
          return timeDiffHours <= 72;
        }

        return false;
      });

      if (existingIndex >= 0) {
        // Existing transaction found - merge / update rather than creating a duplicate
        const existing = current[existingIndex];

        // If incoming has higher payment status or new evidence, upgrade it
        const isIncomingMoreConfirmed =
          (incoming.status === 'completed' && existing.status !== 'completed') ||
          (incoming.amountPaid > existing.amountPaid);

        const mergedEvidence = [...(existing.evidence || [])];
        (incoming.evidence || []).forEach((newEv) => {
          if (!mergedEvidence.some((e) => e.id === newEv.id || (e.content && e.content === newEv.content))) {
            mergedEvidence.push(newEv);
          }
        });

        current[existingIndex] = {
          ...existing,
          amountPaid: isIncomingMoreConfirmed ? incoming.amountPaid : existing.amountPaid,
          outstandingAmount: isIncomingMoreConfirmed ? incoming.outstandingAmount : existing.outstandingAmount,
          status: isIncomingMoreConfirmed ? incoming.status : existing.status,
          paymentClaimStatus: isIncomingMoreConfirmed ? incoming.paymentClaimStatus : existing.paymentClaimStatus,
          evidence: mergedEvidence,
          sourceMessages: Array.from(new Set([...(existing.sourceMessages || []), ...(incoming.sourceMessages || [])])),
          requiresReview: existing.requiresReview || incoming.requiresReview,
          reviewReason: existing.reviewReason || incoming.reviewReason,
        };
        updated++;
        flaggedDuplicates++;
      } else {
        // Brand new transaction
        current.unshift(incoming);
        added++;
      }
    });

    this.saveTransactions(current);
    this.recomputeCustomerAndProductTotals();

    return { added, updated, flaggedDuplicates };
  },

  // Recompute Customer & Product Totals from stored transactions
  recomputeCustomerAndProductTotals() {
    const transactions = this.getTransactions();
    const existingCustomers = this.getCustomers();
    const existingProducts = this.getProducts();

    // Map customers
    const customerMap = new Map<string, Customer>();
    existingCustomers.forEach((c) =>
      customerMap.set(c.name.toLowerCase().trim(), {
        ...c,
        totalSpent: 0,
        totalAgreed: 0,
        totalOrders: 0,
        outstandingBalance: 0,
      })
    );

    // Map products
    const productMap = new Map<string, Product>();
    existingProducts.forEach((p) =>
      productMap.set(p.name.toLowerCase().trim(), {
        ...p,
        unitsSold: 0,
        totalSalesValue: 0,
        orderCount: 0,
      })
    );

    transactions.forEach((tx) => {
      // Ignore cancelled orders from sales totals
      if (tx.status === 'cancelled') return;

      const custKey = tx.customerName.toLowerCase().trim();
      let customer = customerMap.get(custKey);
      if (!customer) {
        customer = {
          id: 'cust_' + Math.random().toString(36).substring(2, 9),
          name: tx.customerName,
          phone: tx.customerPhone,
          totalSpent: 0,
          totalAgreed: 0,
          totalOrders: 0,
          outstandingBalance: 0,
          firstTransactionDate: tx.date,
          lastTransactionDate: tx.date,
        };
        customerMap.set(custKey, customer);
      }

      customer.totalOrders += 1;
      customer.totalAgreed += tx.agreedAmount || 0;

      // CRITICAL: Only count confirmed paid funds in customer totalSpent
      const isConfirmedReceived =
        tx.status === 'completed' ||
        tx.status === 'merchant_confirmed' ||
        tx.paymentClaimStatus === 'merchant_confirmed' ||
        tx.paymentClaimStatus === 'independently_verified';

      if (isConfirmedReceived) {
        customer.totalSpent += tx.amountPaid || 0;
      }
      customer.outstandingBalance += tx.outstandingAmount || 0;

      if (new Date(tx.date) > new Date(customer.lastTransactionDate || 0)) {
        customer.lastTransactionDate = tx.date;
      }
      if (new Date(tx.date) < new Date(customer.firstTransactionDate || '2099-01-01')) {
        customer.firstTransactionDate = tx.date;
      }

      // Products (only qualifying non-cancelled, non-refunded orders)
      if (tx.status !== 'refunded') {
        const prodKey = tx.productName.toLowerCase().trim();
        let product = productMap.get(prodKey);
        if (!product) {
          product = {
            id: 'prod_' + Math.random().toString(36).substring(2, 9),
            name: tx.productName,
            unitsSold: 0,
            totalSalesValue: 0,
            orderCount: 0,
            averageSellingPrice:
              tx.agreedAmount && tx.quantity
                ? Math.round(tx.agreedAmount / tx.quantity)
                : tx.agreedAmount,
            trend: 'stable',
            inquiryCount: 1,
          };
          productMap.set(prodKey, product);
        }

        product.unitsSold += tx.quantity || 1;
        product.totalSalesValue += tx.agreedAmount || 0;
        product.orderCount += 1;
        if (product.unitsSold > 0) {
          product.averageSellingPrice = Math.round(product.totalSalesValue / product.unitsSold);
        }
      }
    });

    this.saveCustomers(Array.from(customerMap.values()));
    this.saveProducts(Array.from(productMap.values()));
  },

  // Reset Demo Data
  resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.DEMO_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.DEMO_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_VERSION);

    this.saveProfile(DEMO_PROFILE);
    const fresh = getFreshDemoTransactions();
    this.saveTransactions(fresh);
    this.saveCustomers(getFreshDemoCustomers());
    this.saveProducts(DEMO_PRODUCTS);
    this.saveConversations(getFreshDemoConversations());
    localStorage.setItem(STORAGE_KEYS.DEMO_VERSION, 'v2026_11_live_dates');
    this.recomputeCustomerAndProductTotals();
    notifyChange();
  },

  // Clear real merchant data
  clearRealData() {
    localStorage.removeItem(STORAGE_KEYS.REAL_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.REAL_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.REAL_CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.REAL_PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.REAL_CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.IMPORT_HISTORY);
    notifyChange();
  },
};
