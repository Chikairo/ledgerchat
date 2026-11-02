import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path inside workspace
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'ledgerchat_db.json');

// Interface definitions for server-side persistence
export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  businessId: string;
  createdAt: string;
}

export interface DBWhatsAppConfig {
  phoneNumberId?: string;
  wabaId?: string;
  verifyToken?: string;
  accessToken?: string;
  webhookUrl?: string;
  status: 'not_configured' | 'pending_verification' | 'connected';
  lastPingAt?: string;
}

export interface DBBusiness {
  id: string;
  name: string;
  ownerName: string;
  category: string;
  country: string;
  currency: string;
  currencySymbol: string;
  reconciliationFrequency: 'weekly' | 'biweekly' | 'monthly';
  reminderDay: string;
  reminderTime: string;
  createdAt: string;
  whatsappConfig?: DBWhatsAppConfig;
}

export interface DBApiKey {
  id: string;
  businessId: string;
  name: string;
  keyHash: string; // SHA-256 hash of the full API key
  prefix: string; // e.g. "lchat_live_ab12..."
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
}

export interface DBIngestJob {
  id: string;
  businessId: string;
  status: 'processing' | 'completed' | 'failed';
  sourceFileName: string;
  transactionsExtracted: number;
  evidenceFound: number;
  requiresReviewCount: number;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DBWebhook {
  id: string;
  businessId: string;
  url: string;
  secret: string;
  events: string[];
  status: 'active' | 'disabled';
  createdAt: string;
  lastTriggeredAt?: string;
}

export interface DBSchema {
  users: DBUser[];
  businesses: DBBusiness[];
  apiKeys: DBApiKey[];
  transactions: any[]; // Scoped by businessId
  customers: any[]; // Scoped by businessId
  products: any[]; // Scoped by businessId
  conversations: any[]; // Scoped by businessId
  ingestJobs: DBIngestJob[];
  webhooks: DBWebhook[];
  sessions: { token: string; userId: string; businessId: string; expiresAt: string }[];
}

const DEFAULT_DB: DBSchema = {
  users: [],
  businesses: [],
  apiKeys: [],
  transactions: [],
  customers: [],
  products: [],
  conversations: [],
  ingestJobs: [],
  webhooks: [],
  sessions: [],
};

class LiveDatabase {
  private data: DBSchema;

  constructor() {
    this.data = DEFAULT_DB;
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = { ...DEFAULT_DB, ...JSON.parse(raw) };
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Failed to initialize LedgerChat live database, using memory fallback:', err);
      this.data = DEFAULT_DB;
    }
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write LedgerChat live database:', err);
    }
  }

  // Cryptographic Helpers
  public hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  public verifyPassword(password: string, hash: string, salt: string): boolean {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return verifyHash === hash;
  }

  public hashApiKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  // Users & Businesses
  public getUserByEmail(email: string): DBUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): DBUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getBusinessById(id: string): DBBusiness | undefined {
    return this.data.businesses.find((b) => b.id === id);
  }

  public createBusiness(name: string, ownerName: string, category = 'General Retail'): DBBusiness {
    const biz: DBBusiness = {
      id: `biz_${crypto.randomBytes(6).toString('hex')}`,
      name,
      ownerName,
      category,
      country: 'Nigeria',
      currency: 'NGN',
      currencySymbol: '₦',
      reconciliationFrequency: 'weekly',
      reminderDay: 'Monday',
      reminderTime: '09:00',
      createdAt: new Date().toISOString(),
      whatsappConfig: {
        status: 'not_configured',
      },
    };
    this.data.businesses.push(biz);
    this.save();
    return biz;
  }

  public registerUser(email: string, password: string, name: string, businessName: string): { user: DBUser; business: DBBusiness; token: string } {
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const business = this.createBusiness(businessName || `${name}'s Shop`, name);
    const { hash, salt } = this.hashPassword(password);

    const user: DBUser = {
      id: `usr_${crypto.randomBytes(6).toString('hex')}`,
      email: email.toLowerCase().trim(),
      passwordHash: hash,
      salt,
      name,
      businessId: business.id,
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(user);

    // Create session token (valid for 30 days)
    const token = `lchat_sess_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    this.data.sessions.push({
      token,
      userId: user.id,
      businessId: business.id,
      expiresAt,
    });

    this.save();
    return { user, business, token };
  }

  public loginUser(email: string, password: string): { user: DBUser; business: DBBusiness; token: string } {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = this.verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const business = this.getBusinessById(user.businessId) || this.createBusiness(`${user.name}'s Business`, user.name);

    const token = `lchat_sess_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    this.data.sessions.push({
      token,
      userId: user.id,
      businessId: business.id,
      expiresAt,
    });

    this.save();
    return { user, business, token };
  }

  public getSession(token: string): { user: DBUser; business: DBBusiness } | null {
    if (!token) return null;
    const session = this.data.sessions.find((s) => s.token === token && new Date(s.expiresAt) > new Date());
    if (!session) return null;

    const user = this.getUserById(session.userId);
    const business = this.getBusinessById(session.businessId);
    if (!user || !business) return null;

    return { user, business };
  }

  public logoutSession(token: string) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // API Key Management
  public createApiKey(businessId: string, name = 'Default API Key'): { key: string; apiKey: DBApiKey } {
    const secretPart = crypto.randomBytes(18).toString('hex');
    const fullKey = `lchat_live_${secretPart}`;
    const keyHash = this.hashApiKey(fullKey);
    const prefix = `lchat_live_${secretPart.substring(0, 4)}...${secretPart.substring(secretPart.length - 4)}`;

    const apiKey: DBApiKey = {
      id: `key_${crypto.randomBytes(6).toString('hex')}`,
      businessId,
      name,
      keyHash,
      prefix,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    this.data.apiKeys.push(apiKey);
    this.save();
    return { key: fullKey, apiKey };
  }

  public getApiKeys(businessId: string): DBApiKey[] {
    return this.data.apiKeys.filter((k) => k.businessId === businessId && k.status === 'active');
  }

  public revokeApiKey(businessId: string, keyId: string): boolean {
    const key = this.data.apiKeys.find((k) => k.businessId === businessId && k.id === keyId);
    if (!key) return false;
    key.status = 'revoked';
    this.save();
    return true;
  }

  public verifyApiKey(fullKey: string): DBBusiness | null {
    if (!fullKey || !fullKey.startsWith('lchat_live_')) return null;
    const hash = this.hashApiKey(fullKey);
    const apiKey = this.data.apiKeys.find((k) => k.keyHash === hash && k.status === 'active');
    if (!apiKey) return null;

    apiKey.lastUsedAt = new Date().toISOString();
    this.save();

    return this.getBusinessById(apiKey.businessId) || null;
  }

  // Scoped Business Data Access
  public getTransactions(businessId: string): any[] {
    return this.data.transactions.filter((t) => t.businessId === businessId);
  }

  public saveTransactions(businessId: string, newTxns: any[]): { added: number; updated: number } {
    let added = 0;
    let updated = 0;

    newTxns.forEach((tx) => {
      const existingIdx = this.data.transactions.findIndex(
        (t) => t.businessId === businessId && (t.id === tx.id || (t.customerName === tx.customerName && t.productName === tx.productName && Math.abs(new Date(t.date).getTime() - new Date(tx.date).getTime()) < 48 * 3600 * 1000))
      );

      if (existingIdx !== -1) {
        this.data.transactions[existingIdx] = {
          ...this.data.transactions[existingIdx],
          ...tx,
          businessId,
        };
        updated++;
      } else {
        this.data.transactions.push({
          ...tx,
          businessId,
        });
        added++;
      }
    });

    this.recalculateCustomersAndProducts(businessId);
    this.save();
    return { added, updated };
  }

  public updateTransaction(businessId: string, txId: string, updates: Partial<any>): any | null {
    const idx = this.data.transactions.findIndex((t) => t.businessId === businessId && t.id === txId);
    if (idx === -1) return null;

    this.data.transactions[idx] = {
      ...this.data.transactions[idx],
      ...updates,
      businessId,
    };

    this.recalculateCustomersAndProducts(businessId);
    this.save();
    return this.data.transactions[idx];
  }

  public deleteTransaction(businessId: string, txId: string): boolean {
    const initialLen = this.data.transactions.length;
    this.data.transactions = this.data.transactions.filter((t) => !(t.businessId === businessId && t.id === txId));
    if (this.data.transactions.length !== initialLen) {
      this.recalculateCustomersAndProducts(businessId);
      this.save();
      return true;
    }
    return false;
  }

  public getCustomers(businessId: string): any[] {
    return this.data.customers.filter((c) => c.businessId === businessId);
  }

  public getProducts(businessId: string): any[] {
    return this.data.products.filter((p) => p.businessId === businessId);
  }

  public getConversations(businessId: string): any[] {
    return this.data.conversations.filter((c) => c.businessId === businessId);
  }

  public saveConversations(businessId: string, convs: any[]) {
    convs.forEach((c) => {
      const existingIdx = this.data.conversations.findIndex((x) => x.businessId === businessId && x.id === c.id);
      if (existingIdx !== -1) {
        this.data.conversations[existingIdx] = { ...this.data.conversations[existingIdx], ...c, businessId };
      } else {
        this.data.conversations.push({ ...c, businessId });
      }
    });
    this.save();
  }

  // Recalculates customers and products deterministically from verified business transactions
  public recalculateCustomersAndProducts(businessId: string) {
    const txns = this.getTransactions(businessId);

    // Customer map
    const custMap = new Map<string, any>();
    txns.forEach((tx) => {
      if (!tx.customerName) return;
      const key = tx.customerName.toLowerCase().trim();
      if (!custMap.has(key)) {
        custMap.set(key, {
          id: tx.customerId || `cust_${key.replace(/[^a-z0-9]/g, '_')}`,
          businessId,
          name: tx.customerName,
          phone: tx.customerPhone || '',
          totalSpent: 0,
          totalAgreed: 0,
          totalOrders: 0,
          outstandingBalance: 0,
          firstTransactionDate: tx.date,
          lastTransactionDate: tx.date,
          notes: `${tx.customerName} - identified via WhatsApp transactions`,
        });
      }

      const c = custMap.get(key);
      if (tx.status !== 'cancelled' && tx.status !== 'refunded') {
        c.totalAgreed += tx.agreedAmount || 0;
        c.totalSpent += tx.amountPaid || 0;
        c.outstandingBalance += tx.outstandingAmount || 0;
        c.totalOrders += 1;
      }

      if (new Date(tx.date) > new Date(c.lastTransactionDate)) {
        c.lastTransactionDate = tx.date;
      }
    });

    // Replace scoped customers
    this.data.customers = this.data.customers.filter((c) => c.businessId !== businessId);
    this.data.customers.push(...Array.from(custMap.values()));

    // Product map
    const prodMap = new Map<string, any>();
    txns.forEach((tx) => {
      if (!tx.productName) return;
      const key = tx.productName.toLowerCase().trim();
      if (!prodMap.has(key)) {
        prodMap.set(key, {
          id: tx.productId || `prod_${key.replace(/[^a-z0-9]/g, '_')}`,
          businessId,
          name: tx.productName,
          category: 'Retail Item',
          unitsSold: 0,
          totalSalesValue: 0,
          orderCount: 0,
          averageSellingPrice: tx.agreedAmount / (tx.quantity || 1),
          trend: 'stable',
          inquiryCount: 1,
        });
      }

      const p = prodMap.get(key);
      if (tx.status !== 'cancelled' && tx.status !== 'refunded') {
        p.unitsSold += tx.quantity || 1;
        p.totalSalesValue += tx.agreedAmount || 0;
        p.orderCount += 1;
      }
      p.inquiryCount += 1;
      if (p.unitsSold > 0) {
        p.averageSellingPrice = Math.round(p.totalSalesValue / p.unitsSold);
      }
    });

    // Replace scoped products
    this.data.products = this.data.products.filter((p) => p.businessId !== businessId);
    this.data.products.push(...Array.from(prodMap.values()));
  }

  // Summary Metrics Computation
  public getAnalyticsSummary(businessId: string) {
    const txns = this.getTransactions(businessId).filter((t) => t.status !== 'cancelled' && t.status !== 'refunded');
    let totalSales = 0;
    let moneyReceived = 0;
    let moneyOwed = 0;
    let unconfirmedClaims = 0;

    txns.forEach((tx) => {
      totalSales += tx.agreedAmount || 0;
      const isConfirmed = tx.status === 'completed' || tx.status === 'merchant_confirmed' || tx.paymentClaimStatus === 'merchant_confirmed' || tx.paymentClaimStatus === 'independently_verified';
      if (isConfirmed) {
        moneyReceived += tx.amountPaid || 0;
      } else if (tx.amountPaid > 0) {
        unconfirmedClaims += tx.amountPaid;
      }
      moneyOwed += tx.outstandingAmount || 0;
    });

    const collectionRate = totalSales > 0 ? Math.round((moneyReceived / totalSales) * 100) : 0;
    const customers = this.getCustomers(businessId);
    const products = this.getProducts(businessId);

    const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
    const topProducts = [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);

    return {
      totalSales,
      moneyReceived,
      unconfirmedClaims,
      moneyOwed,
      collectionRate,
      transactionCount: txns.length,
      customerCount: customers.length,
      productCount: products.length,
      topCustomers,
      topProducts,
    };
  }

  // Ingestion Jobs
  public createIngestJob(businessId: string, sourceFileName: string): DBIngestJob {
    const job: DBIngestJob = {
      id: `job_${crypto.randomBytes(6).toString('hex')}`,
      businessId,
      status: 'processing',
      sourceFileName,
      transactionsExtracted: 0,
      evidenceFound: 0,
      requiresReviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.data.ingestJobs.push(job);
    this.save();
    return job;
  }

  public updateIngestJob(jobId: string, updates: Partial<DBIngestJob>) {
    const job = this.data.ingestJobs.find((j) => j.id === jobId);
    if (!job) return;
    Object.assign(job, updates);
    if (updates.status === 'completed' || updates.status === 'failed') {
      job.completedAt = new Date().toISOString();
    }
    this.save();
  }

  public getIngestJob(jobId: string): DBIngestJob | undefined {
    return this.data.ingestJobs.find((j) => j.id === jobId);
  }

  // Webhooks
  public getWebhooks(businessId: string): DBWebhook[] {
    return this.data.webhooks.filter((w) => w.businessId === businessId && w.status === 'active');
  }

  public createWebhook(businessId: string, url: string, events: string[]): DBWebhook {
    const webhook: DBWebhook = {
      id: `wh_${crypto.randomBytes(6).toString('hex')}`,
      businessId,
      url,
      secret: `whsec_${crypto.randomBytes(16).toString('hex')}`,
      events: events.length > 0 ? events : ['transaction.created', 'payment.updated'],
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    this.data.webhooks.push(webhook);
    this.save();
    return webhook;
  }

  public deleteWebhook(businessId: string, webhookId: string): boolean {
    const w = this.data.webhooks.find((x) => x.businessId === businessId && x.id === webhookId);
    if (!w) return false;
    w.status = 'disabled';
    this.save();
    return true;
  }

  // WhatsApp Business Platform Configuration
  public updateWhatsAppConfig(businessId: string, config: Partial<DBWhatsAppConfig>): DBWhatsAppConfig {
    const biz = this.getBusinessById(businessId);
    if (!biz) throw new Error('Business not found');
    biz.whatsappConfig = {
      ...biz.whatsappConfig,
      ...config,
      status: (config.phoneNumberId && config.accessToken) ? 'connected' : 'not_configured',
    };
    this.save();
    return biz.whatsappConfig;
  }
}

export const liveDB = new LiveDatabase();
