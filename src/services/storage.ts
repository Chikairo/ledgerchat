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
} from '../data/demoData';

const STORAGE_KEYS = {
  CURRENT_USER: 'ledgerchat_user',
  ACTIVE_MODE: 'ledgerchat_active_mode', // 'demo' | 'real'
  DEMO_PROFILE: 'ledgerchat_demo_profile',
  DEMO_TRANSACTIONS: 'ledgerchat_demo_transactions',
  DEMO_CUSTOMERS: 'ledgerchat_demo_customers',
  DEMO_PRODUCTS: 'ledgerchat_demo_products',
  DEMO_CONVERSATIONS: 'ledgerchat_demo_conversations',
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
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }

    if (mode === 'demo') {
      this.saveTransactions(DEMO_TRANSACTIONS);
      return DEMO_TRANSACTIONS;
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

  // Recompute Customer & Product Totals from stored transactions
  recomputeCustomerAndProductTotals() {
    const transactions = this.getTransactions();
    const existingCustomers = this.getCustomers();
    const existingProducts = this.getProducts();

    // Map customers
    const customerMap = new Map<string, Customer>();
    existingCustomers.forEach((c) => customerMap.set(c.name.toLowerCase().trim(), { ...c, totalSpent: 0, totalAgreed: 0, totalOrders: 0, outstandingBalance: 0 }));

    // Map products
    const productMap = new Map<string, Product>();
    existingProducts.forEach((p) => productMap.set(p.name.toLowerCase().trim(), { ...p, unitsSold: 0, totalSalesValue: 0, orderCount: 0 }));

    transactions.forEach((tx) => {
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
      customer.totalSpent += tx.amountPaid || 0;
      customer.outstandingBalance += tx.outstandingAmount || 0;
      if (new Date(tx.date) > new Date(customer.lastTransactionDate || 0)) {
        customer.lastTransactionDate = tx.date;
      }
      if (new Date(tx.date) < new Date(customer.firstTransactionDate || '2099-01-01')) {
        customer.firstTransactionDate = tx.date;
      }

      // Products (only qualifying non-cancelled orders)
      if (tx.status !== 'cancelled') {
        const prodKey = tx.productName.toLowerCase().trim();
        let product = productMap.get(prodKey);
        if (!product) {
          product = {
            id: 'prod_' + Math.random().toString(36).substring(2, 9),
            name: tx.productName,
            unitsSold: 0,
            totalSalesValue: 0,
            orderCount: 0,
            averageSellingPrice: tx.agreedAmount && tx.quantity ? Math.round(tx.agreedAmount / tx.quantity) : tx.agreedAmount,
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
    this.saveProfile(DEMO_PROFILE);
    this.saveTransactions(DEMO_TRANSACTIONS);
    this.saveCustomers(DEMO_CUSTOMERS);
    this.saveProducts(DEMO_PRODUCTS);
    this.saveConversations(DEMO_CONVERSATIONS);
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
