/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// LedgerChat REST API Client for /api/v1

export interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  businessId: string;
  businessName: string;
  currency: string;
  currencySymbol: string;
  category: string;
  createdAt: string;
}

export interface ApiKeyItem {
  id: string;
  label: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
  revokedAt?: string;
}

export interface NewApiKeyResponse {
  id: string;
  label: string;
  keyPrefix: string;
  createdAt: string;
  plaintextKey: string;
  warning: string;
}

export interface ApiSummary {
  totalRevenue: number;
  totalAgreed: number;
  totalPaid: number;
  totalOutstanding: number;
  verifiedCash: number;
  unverifiedClaims: number;
  needsReviewCount: number;
  totalOrders: number;
  activeDebtorsCount: number;
  period: string;
  currency: string;
  currencySymbol: string;
  generatedAt: string;
}

const SESSION_TOKEN_KEY = 'lchat_session_token';
const SAVED_API_KEY = 'lchat_dev_api_key';

export const ApiClient = {
  // Token management
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SESSION_TOKEN_KEY);
  },

  setToken(token: string | null) {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
  },

  getSavedApiKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SAVED_API_KEY);
  },

  setSavedApiKey(key: string | null) {
    if (typeof window === 'undefined') return;
    if (key) {
      localStorage.setItem(SAVED_API_KEY, key);
    } else {
      localStorage.removeItem(SAVED_API_KEY);
    }
  },

  // Base fetch helper with auth header
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    
    // Inject Authorization header if available
    const token = this.getToken();
    const apiKey = this.getSavedApiKey();

    if (!headers.has('Authorization')) {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      } else if (apiKey) {
        headers.set('Authorization', `Bearer ${apiKey}`);
      }
    }

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/csv')) {
      return (await response.text()) as unknown as T;
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      throw new Error(`Server returned HTTP ${response.status} with non-JSON response.`);
    }

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `HTTP ${response.status}: Request failed`;
      throw new Error(errorMsg);
    }

    return data as T;
  },

  // 1. Authentication
  auth: {
    async register(payload: {
      email: string;
      password: string;
      fullName: string;
      name?: string;
      businessName: string;
      category?: string;
      city?: string;
      phone?: string;
      currency?: string;
      currencySymbol?: string;
    }): Promise<{ success: boolean; token: string; user: ApiUser; business: any }> {
      const bodyPayload = {
        ...payload,
        name: payload.name || payload.fullName,
        fullName: payload.fullName || payload.name,
      };
      const res = await ApiClient.request<{
        success: boolean;
        token: string;
        user: ApiUser;
        business: any;
      }>('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(bodyPayload),
      });

      if (res.token) {
        ApiClient.setToken(res.token);
      }
      return res;
    },

    async login(payload: { email: string; password: string }): Promise<{
      success: boolean;
      token: string;
      user: ApiUser;
      business: any;
    }> {
      const res = await ApiClient.request<{
        success: boolean;
        token: string;
        user: ApiUser;
        business: any;
      }>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.token) {
        ApiClient.setToken(res.token);
      }
      return res;
    },

    async getMe(): Promise<{ success: boolean; user: ApiUser; business: any }> {
      return await ApiClient.request('/api/v1/auth/me');
    },

    async logout(): Promise<{ success: boolean }> {
      try {
        await ApiClient.request('/api/v1/auth/logout', { method: 'POST' });
      } catch (e) {
        console.warn('Logout API error:', e);
      } finally {
        ApiClient.setToken(null);
      }
      return { success: true };
    },

    async getApiKeys(): Promise<{ success: boolean; apiKeys: ApiKeyItem[] }> {
      return await ApiClient.request('/api/v1/auth/api-keys');
    },

    async createApiKey(label?: string): Promise<{ success: boolean; apiKey: NewApiKeyResponse }> {
      return await ApiClient.request('/api/v1/auth/api-keys', {
        method: 'POST',
        body: JSON.stringify({ label }),
      });
    },

    async revokeApiKey(id: string): Promise<{ success: boolean; message: string }> {
      return await ApiClient.request(`/api/v1/auth/api-keys/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // 2. Ingestion
  ingest: {
    async uploadChat(payload: {
      chatText?: string;
      fileName?: string;
      fileBase64?: string;
      mediaFiles?: Array<{ name: string; base64: string; mimeType: string }>;
    }): Promise<{
      success: boolean;
      jobId: string;
      status: string;
      result?: any;
    }> {
      return await ApiClient.request('/api/v1/ingest', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async getJobStatus(jobId: string): Promise<any> {
      return await ApiClient.request(`/api/v1/ingest/${jobId}`);
    },
  },

  // 3. Transactions
  transactions: {
    async getAll(params?: {
      status?: string;
      requiresReview?: boolean;
      customerId?: string;
      limit?: number;
      offset?: number;
    }): Promise<{
      success: boolean;
      total: number;
      count: number;
      transactions: any[];
    }> {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.requiresReview !== undefined) query.set('requiresReview', String(params.requiresReview));
      if (params?.customerId) query.set('customerId', params.customerId);
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));

      const qs = query.toString() ? `?${query.toString()}` : '';
      return await ApiClient.request(`/api/v1/transactions${qs}`);
    },

    async update(
      id: string,
      updates: {
        status?: string;
        paymentClaimStatus?: string;
        amountPaid?: number;
        notes?: string;
        merchantNote?: string;
      }
    ): Promise<{ success: boolean; transaction: any; updated: boolean }> {
      return await ApiClient.request(`/api/v1/transactions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },

    async delete(id: string): Promise<{ success: boolean; id: string }> {
      return await ApiClient.request(`/api/v1/transactions/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // 4. Customers
  customers: {
    async getAll(params?: { hasDebt?: boolean; search?: string }): Promise<{
      success: boolean;
      total: number;
      customers: any[];
    }> {
      const query = new URLSearchParams();
      if (params?.hasDebt !== undefined) query.set('hasDebt', String(params.hasDebt));
      if (params?.search) query.set('search', params.search);

      const qs = query.toString() ? `?${query.toString()}` : '';
      return await ApiClient.request(`/api/v1/customers${qs}`);
    },

    async get(id: string): Promise<{
      success: boolean;
      customer: any;
      transactions: any[];
      analytics: any;
    }> {
      return await ApiClient.request(`/api/v1/customers/${id}`);
    },
  },

  // 5. Products
  products: {
    async getAll(): Promise<{
      success: boolean;
      total: number;
      products: any[];
    }> {
      return await ApiClient.request('/api/v1/products');
    },
  },

  // 6. Analytics
  analytics: {
    async getSummary(period?: string): Promise<{ success: boolean; summary: ApiSummary }> {
      const qs = period ? `?period=${encodeURIComponent(period)}` : '';
      return await ApiClient.request(`/api/v1/analytics/summary${qs}`);
    },

    async getInsights(): Promise<{ success: boolean; insights: any[] }> {
      return await ApiClient.request('/api/v1/analytics/insights');
    },
  },

  // 7. Reports
  reports: {
    async getFinancial(format: 'json' | 'csv' = 'json', period?: string): Promise<any> {
      const qs = period ? `?period=${encodeURIComponent(period)}` : '';
      const headers = format === 'csv' ? { Accept: 'text/csv' } : { Accept: 'application/json' };
      return await ApiClient.request(`/api/v1/reports/financial${qs}`, {
        headers,
      });
    },
  },

  // 8. Webhooks
  webhooks: {
    async getAll(): Promise<{ success: boolean; webhooks: any[] }> {
      return await ApiClient.request('/api/v1/webhooks');
    },

    async create(payload: {
      url: string;
      events: string[];
      secret?: string;
    }): Promise<{ success: boolean; webhook: any }> {
      return await ApiClient.request('/api/v1/webhooks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async delete(id: string): Promise<{ success: boolean; id: string }> {
      return await ApiClient.request(`/api/v1/webhooks/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // 9. Meta WhatsApp Business Integration
  whatsapp: {
    async getConfig(): Promise<{ success: boolean; config: any }> {
      return await ApiClient.request('/api/v1/whatsapp/config');
    },

    async updateConfig(payload: {
      phoneNumberId?: string;
      wabaId?: string;
      accessToken?: string;
      verifyToken?: string;
      isActive?: boolean;
    }): Promise<{ success: boolean; config: any; message: string }> {
      return await ApiClient.request('/api/v1/whatsapp/config', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async testWebhook(sampleEvent?: any): Promise<any> {
      return await ApiClient.request('/api/v1/whatsapp/webhook', {
        method: 'POST',
        body: JSON.stringify(
          sampleEvent || {
            object: 'whatsapp_business_account',
            entry: [
              {
                id: '109823471923',
                changes: [
                  {
                    value: {
                      messaging_product: 'whatsapp',
                      metadata: { display_phone_number: '+2348030001122', phone_number_id: '109823471923' },
                      contacts: [{ profile: { name: 'Alhaji Musa Bello' }, wa_id: '2348030001122' }],
                      messages: [
                        {
                          from: '2348030001122',
                          id: `wamid_${Date.now()}`,
                          timestamp: Math.floor(Date.now() / 1000).toString(),
                          text: { body: 'Oga Chidi, I transfer ₦140,000 for the fast chargers. Send my receipt.' },
                          type: 'text',
                        },
                      ],
                    },
                    field: 'messages',
                  },
                ],
              },
            ],
          }
        ),
      });
    },
  },
};
