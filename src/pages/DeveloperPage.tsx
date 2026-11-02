/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Code2,
  Key,
  Terminal,
  Send,
  Copy,
  Check,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Webhook,
  BookOpen,
  RefreshCw,
  Clock,
  Layers,
  Lock,
} from 'lucide-react';
import { ApiClient, ApiKeyItem, NewApiKeyResponse } from '../services/apiClient';

export const DeveloperPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'keys' | 'console' | 'code' | 'whatsapp' | 'docs'>('keys');

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<NewApiKeyResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  // Interactive Console state
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/analytics/summary');
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST' | 'PATCH' | 'DELETE'>('GET');
  const [requestHeaders, setRequestHeaders] = useState<string>('{\n  "Accept": "application/json"\n}');
  const [requestBody, setRequestBody] = useState<string>('');
  const [consoleResponse, setConsoleResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [authScheme, setAuthScheme] = useState<'bearer' | 'apikey'>('bearer');

  // WhatsApp Webhook state
  const [waConfig, setWaConfig] = useState<any>(null);
  const [waVerifyToken, setWaVerifyToken] = useState('ledgerchat_webhook_secret_2026');
  const [waPhoneId, setWaPhoneId] = useState('');
  const [waWabaId, setWaWabaId] = useState('');
  const [waToken, setWaToken] = useState('');
  const [waSaving, setWaSaving] = useState(false);
  const [waSuccessMsg, setWaSuccessMsg] = useState<string | null>(null);
  const [waTestOutput, setWaTestOutput] = useState<any>(null);

  // Active Code Language
  const [codeLang, setCodeLang] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [codeCopied, setCodeCopied] = useState(false);

  // Load API keys on mount
  useEffect(() => {
    loadKeys();
    loadWhatsAppConfig();
  }, []);

  const loadKeys = async () => {
    setLoadingKeys(true);
    setKeyError(null);
    try {
      const res = await ApiClient.auth.getApiKeys();
      if (res.apiKeys) {
        setApiKeys(res.apiKeys);
      }
    } catch (e: any) {
      // If user isn't logged in with a session token, explain gracefully
      setKeyError(
        'To manage API keys for your business, please ensure you are signed in to a LedgerChat merchant account.'
      );
    } finally {
      setLoadingKeys(false);
    }
  };

  const loadWhatsAppConfig = async () => {
    try {
      const res = await ApiClient.whatsapp.getConfig();
      if (res.config) {
        setWaConfig(res.config);
        setWaVerifyToken(res.config.verifyToken || 'ledgerchat_webhook_secret_2026');
        setWaPhoneId(res.config.phoneNumberId || '');
        setWaWabaId(res.config.wabaId || '');
      }
    } catch (e) {
      console.warn('WhatsApp config load failed:', e);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel.trim()) return;

    setIsGeneratingKey(true);
    setKeyError(null);
    try {
      const res = await ApiClient.auth.createApiKey(newKeyLabel.trim());
      if (res.apiKey) {
        setNewlyCreatedKey(res.apiKey);
        setNewKeyLabel('');
        // Also save this as active dev key for the console
        ApiClient.setSavedApiKey(res.apiKey.plaintextKey);
        await loadKeys();
      }
    } catch (err: any) {
      setKeyError(err.message || 'Failed to generate API key.');
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this API key? This action is irreversible.')) {
      return;
    }
    try {
      await ApiClient.auth.revokeApiKey(id);
      await loadKeys();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke key.');
    }
  };

  const handleCopyNewKey = () => {
    if (!newlyCreatedKey) return;
    navigator.clipboard.writeText(newlyCreatedKey.plaintextKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  // Endpoint Presets for API Explorer
  const ENDPOINT_PRESETS = [
    {
      label: 'Financial Summary',
      url: '/api/v1/analytics/summary?period=this_month',
      method: 'GET' as const,
      body: '',
    },
    {
      label: 'List Sales Transactions',
      url: '/api/v1/transactions?limit=10',
      method: 'GET' as const,
      body: '',
    },
    {
      label: 'Debtor Customers List',
      url: '/api/v1/customers?hasDebt=true',
      method: 'GET' as const,
      body: '',
    },
    {
      label: 'Top Selling Products',
      url: '/api/v1/products',
      method: 'GET' as const,
      body: '',
    },
    {
      label: 'Business Insights',
      url: '/api/v1/analytics/insights',
      method: 'GET' as const,
      body: '',
    },
    {
      label: 'OpenAPI 3.0.3 Specification',
      url: '/api/v1/openapi.json',
      method: 'GET' as const,
      body: '',
    },
    {
      label: 'Ingest WhatsApp Chat (POST)',
      url: '/api/v1/ingest',
      method: 'POST' as const,
      body: JSON.stringify(
        {
          fileName: 'WhatsApp_Chat_Alhaji_Musa.txt',
          chatText:
            "[08/10/2026, 14:10] Alhaji Musa: Oga Chidi, I need 20 units of 65W Fast Charger.\n[08/10/2026, 14:12] Chidi Electronics: Alhaji, price is ₦7,000 each. Total is ₦140,000.\n[08/10/2026, 14:15] Alhaji Musa: I agree. Send account number.\n[08/10/2026, 14:30] Alhaji Musa: I just paid ₦140,000 into your GTBank. Here is my receipt.",
        },
        null,
        2
      ),
    },
  ];

  const handleSelectPreset = (preset: (typeof ENDPOINT_PRESETS)[0]) => {
    setSelectedEndpoint(preset.url);
    setHttpMethod(preset.method);
    setRequestBody(preset.body);
  };

  // Execute console request
  const handleExecuteRequest = async () => {
    setIsSendingRequest(true);
    setConsoleResponse(null);
    setResponseStatus(null);
    const start = performance.now();

    try {
      const headers: Record<string, string> = {};
      try {
        const parsed = JSON.parse(requestHeaders || '{}');
        Object.assign(headers, parsed);
      } catch {
        // ignore header parse error
      }

      // Handle Auth Header
      if (authScheme === 'bearer') {
        const token = ApiClient.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } else {
        const apiKey = ApiClient.getSavedApiKey() || newlyCreatedKey?.plaintextKey;
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
      }

      if (httpMethod !== 'GET' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(selectedEndpoint, {
        method: httpMethod,
        headers,
        body: httpMethod !== 'GET' && requestBody.trim() ? requestBody : undefined,
      });

      const elapsed = Math.round(performance.now() - start);
      setResponseLatency(elapsed);
      setResponseStatus(res.status);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setConsoleResponse(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setConsoleResponse(text);
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setResponseLatency(elapsed);
      setResponseStatus(0);
      setConsoleResponse(`Request Error: ${err.message}`);
    } finally {
      setIsSendingRequest(false);
    }
  };

  // Save Meta WhatsApp Config
  const handleSaveWhatsAppConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaSaving(true);
    setWaSuccessMsg(null);
    try {
      const res = await ApiClient.whatsapp.updateConfig({
        verifyToken: waVerifyToken,
        phoneNumberId: waPhoneId,
        wabaId: waWabaId,
        accessToken: waToken || undefined,
        isActive: true,
      });
      setWaSuccessMsg('WhatsApp Business Platform configuration saved successfully!');
      await loadWhatsAppConfig();
    } catch (e: any) {
      alert(e.message || 'Failed to save configuration');
    } finally {
      setWaSaving(false);
    }
  };

  const handleTestWhatsAppWebhook = async () => {
    setWaTestOutput({ status: 'sending', message: 'Simulating inbound WhatsApp message webhook...' });
    try {
      const res = await ApiClient.whatsapp.testWebhook();
      setWaTestOutput(res);
    } catch (e: any) {
      setWaTestOutput({ error: e.message });
    }
  };

  // Sample code snippets
  const getCodeSnippet = () => {
    const activeKey = newlyCreatedKey?.plaintextKey || ApiClient.getSavedApiKey() || 'lchat_live_your_api_key_here';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app.ledgerchat.com';

    if (codeLang === 'curl') {
      return `# 1. Ingest WhatsApp conversation export
curl -X POST "${baseUrl}/api/v1/ingest" \\
  -H "Authorization: Bearer ${activeKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileName": "WhatsApp_Chat.txt",
    "chatText": "Customer: I want 5 solar batteries\\nMerchant: That will be ₦250,000\\nCustomer: Paid ₦150k advance"
  }'

# 2. Fetch business financial summary
curl -X GET "${baseUrl}/api/v1/analytics/summary?period=this_month" \\
  -H "Authorization: Bearer ${activeKey}"

# 3. Retrieve list of active debtors
curl -X GET "${baseUrl}/api/v1/customers?hasDebt=true" \\
  -H "Authorization: Bearer ${activeKey}"`;
    }

    if (codeLang === 'typescript') {
      return `// LedgerChat API Integration (TypeScript / Node.js)
const LEDGERCHAT_URL = '${baseUrl}';
const API_KEY = '${activeKey}';

async function ingestWhatsAppChat(chatText: string, fileName: string) {
  const response = await fetch(\`\${LEDGERCHAT_URL}/api/v1/ingest\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chatText, fileName }),
  });

  const data = await response.json();
  console.log('Ingestion Job:', data);
  return data;
}

async function getFinancialSummary() {
  const response = await fetch(\`\${LEDGERCHAT_URL}/api/v1/analytics/summary\`, {
    headers: { 'Authorization': \`Bearer \${API_KEY}\` }
  });
  return await response.json();
}`;
    }

    return `# LedgerChat API Integration (Python)
import requests

LEDGERCHAT_URL = "${baseUrl}"
API_KEY = "${activeKey}"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def ingest_whatsapp_chat(chat_text: str, file_name: str = "chat.txt"):
    url = f"{LEDGERCHAT_URL}/api/v1/ingest"
    payload = {"chatText": chat_text, "fileName": file_name}
    response = requests.post(url, headers=HEADERS, json=payload)
    return response.json()

def get_financial_summary():
    url = f"{LEDGERCHAT_URL}/api/v1/analytics/summary"
    response = requests.get(url, headers=HEADERS)
    return response.json()

# Example usage
summary = get_financial_summary()
print(f"Total Agreed: ₦{summary['summary']['totalAgreed']:,}")
print(f"Total Outstanding: ₦{summary['summary']['totalOutstanding']:,}")`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-[#E8F4ED] text-[#145C42]">
              <Code2 className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#145C42]">
              LedgerChat Platform API
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#19251F] tracking-tight">
            Developer Portal &amp; API Integration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect POS systems, inventory management, e-commerce stores, and Meta WhatsApp Business Platform webhooks directly to LedgerChat's intelligence engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/v1/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#145C42]" />
            <span>OpenAPI 3.0.3 Spec</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('keys')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'keys'
              ? 'border-[#145C42] text-[#145C42]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>API Keys</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-semibold">
            {apiKeys.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('console')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'console'
              ? 'border-[#145C42] text-[#145C42]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Interactive API Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'code'
              ? 'border-[#145C42] text-[#145C42]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Code Examples</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'whatsapp'
              ? 'border-[#145C42] text-[#145C42]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Webhook className="w-4 h-4" />
          <span>Meta WhatsApp Webhook</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'docs'
              ? 'border-[#145C42] text-[#145C42]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>REST API Reference</span>
        </button>
      </div>

      {/* Tab 1: API Keys */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          {/* New Key Flash Banner */}
          {newlyCreatedKey && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-sm animate-in fade-in">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm">Save your new API Key immediately</h3>
                  <p className="text-xs text-amber-900 mt-0.5">
                    For your security, we hash keys with SHA-256 and will never display this plaintext key again.
                  </p>
                  <div className="mt-3 flex items-center gap-2 bg-white/90 border border-amber-200 rounded-xl p-2 font-mono text-xs text-slate-900 select-all">
                    <span className="flex-1 break-all">{newlyCreatedKey.plaintextKey}</span>
                    <button
                      onClick={handleCopyNewKey}
                      className="px-3 py-1 bg-[#145C42] text-white rounded-lg text-xs font-bold hover:bg-[#103E30] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Generation Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Generate New Production API Key</h3>
            <p className="text-xs text-slate-500 mb-4">
              API keys allow third-party programs to authenticate on behalf of your business using the Bearer scheme.
            </p>

            <form onSubmit={handleGenerateKey} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={newKeyLabel}
                onChange={(e) => setNewKeyLabel(e.target.value)}
                placeholder="Key Label (e.g. ERP Invoicing Service, WooCommerce Integration)"
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
              />
              <button
                type="submit"
                disabled={isGeneratingKey}
                className="px-4 py-2 bg-[#145C42] hover:bg-[#103E30] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isGeneratingKey ? 'Generating...' : 'Create API Key'}</span>
              </button>
            </form>

            {keyError && (
              <p className="text-xs text-rose-600 mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{keyError}</span>
              </p>
            )}
          </div>

          {/* Active Keys List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Your Active API Keys</h3>
                <p className="text-xs text-slate-500">
                  Keys are restricted to the business that created them.
                </p>
              </div>
              <button
                onClick={loadKeys}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Refresh keys"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {loadingKeys ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading keys...</div>
            ) : apiKeys.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <Key className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                <span>No API keys created yet. Generate one above to start building.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {apiKeys.map((k) => (
                  <div key={k.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{k.label}</span>
                        <code className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {k.keyPrefix}••••••••
                        </code>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Created: {new Date(k.createdAt).toLocaleDateString()}</span>
                        {k.lastUsedAt && (
                          <span>Last used: {new Date(k.lastUsedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                      title="Revoke key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Revoke</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Interactive API Console */}
      {activeTab === 'console' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Live Endpoint Runner</h3>
              <p className="text-xs text-slate-500">
                Execute genuine HTTP requests against the running LedgerChat service and inspect headers, latency, and response bodies.
              </p>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-2 uppercase tracking-wider">
                Select Quick Preset
              </span>
              <div className="flex flex-wrap gap-2">
                {ENDPOINT_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPreset(p)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 hover:border-[#145C42] hover:bg-[#E8F4ED]/50 transition-colors cursor-pointer text-slate-700 font-medium"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Request bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value as any)}
                className="w-24 px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>

              <input
                type="text"
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                placeholder="/api/v1/..."
                className="flex-1 px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#145C42]/20 focus:border-[#145C42] outline-none"
              />

              <button
                onClick={handleExecuteRequest}
                disabled={isSendingRequest}
                className="px-5 py-2 bg-[#145C42] hover:bg-[#103E30] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingRequest ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

            {/* Auth Scheme selector */}
            <div className="flex items-center gap-4 text-xs">
              <span className="font-bold text-slate-600">Auth Header:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="authScheme"
                  checked={authScheme === 'bearer'}
                  onChange={() => setAuthScheme('bearer')}
                />
                <span>Session Bearer Token</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="authScheme"
                  checked={authScheme === 'apikey'}
                  onChange={() => setAuthScheme('apikey')}
                />
                <span>API Key (`lchat_live_...`)</span>
              </label>
            </div>

            {/* Request Body (For POST/PATCH) */}
            {httpMethod !== 'GET' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  JSON Request Body
                </label>
                <textarea
                  rows={5}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{"chatText": "..."}'
                  className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#145C42]/20"
                />
              </div>
            )}
          </div>

          {/* Response Viewer */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-300">Live Response</span>
                {responseStatus !== null && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    HTTP {responseStatus}
                  </span>
                )}
                {responseLatency !== null && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{responseLatency}ms</span>
                  </span>
                )}
              </div>

              {consoleResponse && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(consoleResponse);
                    alert('Response copied to clipboard!');
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  title="Copy JSON"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <pre className="p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-[420px] whitespace-pre-wrap leading-relaxed">
              {consoleResponse || '// Click "Send Request" above to view live server output.'}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Code Examples */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setCodeLang('curl')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  codeLang === 'curl'
                    ? 'bg-[#145C42] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setCodeLang('typescript')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  codeLang === 'typescript'
                    ? 'bg-[#145C42] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                TypeScript / Node.js
              </button>
              <button
                onClick={() => setCodeLang('python')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  codeLang === 'python'
                    ? 'bg-[#145C42] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Python
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{codeCopied ? 'Copied' : 'Copy Snippet'}</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <pre className="p-5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
              {getCodeSnippet()}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Meta WhatsApp Webhook */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1 rounded bg-emerald-100 text-[#145C42]">
                  <Webhook className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-800">
                  Meta WhatsApp Business Cloud API Integration
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Receive inbound customer messages directly from Meta's WhatsApp Cloud servers in real-time. LedgerChat validates the <code className="bg-slate-100 px-1 rounded text-slate-800">hub.challenge</code> verification handshake and parses inbound orders with zero manual uploads.
              </p>
            </div>

            {/* Webhook URL Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Meta Callback URL (Enter in Meta App Dashboard)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/whatsapp/webhook`}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg select-all"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/api/v1/whatsapp/webhook`
                    );
                    alert('Webhook URL copied!');
                  }}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold rounded-lg text-slate-700 cursor-pointer"
                >
                  Copy URL
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveWhatsAppConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verify Token (hub.verify_token) *
                  </label>
                  <input
                    type="text"
                    required
                    value={waVerifyToken}
                    onChange={(e) => setWaVerifyToken(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#145C42]/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Match this value in Meta's Webhook configuration screen.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={waPhoneId}
                    onChange={(e) => setWaPhoneId(e.target.value)}
                    placeholder="e.g. 109823471923"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#145C42]/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={waSaving}
                  className="px-5 py-2.5 bg-[#145C42] hover:bg-[#103E30] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {waSaving ? 'Saving...' : 'Save Meta Configuration'}
                </button>

                <button
                  type="button"
                  onClick={handleTestWhatsAppWebhook}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Simulate Live Inbound Message
                </button>
              </div>

              {waSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168653]" />
                  <span>{waSuccessMsg}</span>
                </div>
              )}
            </form>

            {/* Test Output */}
            {waTestOutput && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto">
                <div className="text-slate-400 mb-2 font-bold">// Webhook Pipeline Execution Result:</div>
                <pre>{JSON.stringify(waTestOutput, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: REST API Reference */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Available REST API Endpoints</h3>
            <p className="text-xs text-slate-500 mb-4">
              All endpoints follow standard REST principles with JSON payloads, deterministic calculations, and tenant-scoped data isolation.
            </p>

            <div className="space-y-3">
              {[
                { method: 'POST', path: '/api/v1/auth/register', desc: 'Create a new business merchant account.' },
                { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate and receive session token.' },
                { method: 'GET', path: '/api/v1/auth/api-keys', desc: 'List active API keys.' },
                { method: 'POST', path: '/api/v1/auth/api-keys', desc: 'Generate new lchat_live_ API key.' },
                { method: 'POST', path: '/api/v1/ingest', desc: 'Ingest and analyze WhatsApp conversation export text.' },
                { method: 'GET', path: '/api/v1/transactions', desc: 'Retrieve filtered sales transactions & review items.' },
                { method: 'PATCH', path: '/api/v1/transactions/:id', desc: 'Update payment status, verified amount, or note.' },
                { method: 'GET', path: '/api/v1/customers', desc: 'List customers with aggregate orders and debt balances.' },
                { method: 'GET', path: '/api/v1/products', desc: 'List products ranked by units sold and revenue.' },
                { method: 'GET', path: '/api/v1/analytics/summary', desc: 'Deterministic financial metrics (revenue, cash, debts).' },
                { method: 'GET', path: '/api/v1/reports/financial', desc: 'Export accounting ledger in JSON or CSV.' },
                { method: 'GET', path: '/api/v1/whatsapp/webhook', desc: 'Meta Webhook hub.challenge verification.' },
                { method: 'POST', path: '/api/v1/whatsapp/webhook', desc: 'Receive real-time WhatsApp inbound messages.' },
                { method: 'GET', path: '/api/v1/openapi.json', desc: 'Full OpenAPI 3.0.3 schema specification.' },
              ].map((ep, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        ep.method === 'GET'
                          ? 'bg-blue-100 text-blue-800'
                          : ep.method === 'POST'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ep.method === 'PATCH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <code className="text-xs font-mono font-bold text-slate-800">{ep.path}</code>
                  </div>
                  <span className="text-xs text-slate-500">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
