import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { liveDB, DBBusiness, DBUser } from './server_db.ts';
import { LEDGERCHAT_OPENAPI_SPEC } from './server_openapi.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Increase JSON body limits for uploaded chats and receipt screenshots
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configurable model name with Gemma 4 preferred
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemma-4-26b-a4b-it';
const FALLBACK_MODEL = 'gemini-3.8-flash';

// Server-side initialization of GoogleGenAI SDK
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Real AI extraction will require an API key.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Safely clean and parse JSON from LLM output
function cleanAndParseJSON(text: string): any {
  let cleaned = (text || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBracket = cleaned.indexOf('{');
    const firstSquare = cleaned.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;

    if (firstBracket !== -1 && (firstSquare === -1 || firstBracket < firstSquare)) {
      startIdx = firstBracket;
      endIdx = cleaned.lastIndexOf('}');
    } else if (firstSquare !== -1) {
      startIdx = firstSquare;
      endIdx = cleaned.lastIndexOf(']');
    }

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const slice = cleaned.slice(startIdx, endIdx + 1);
      try {
        return JSON.parse(slice);
      } catch (e) {
        console.error('Failed to parse sliced JSON:', slice);
      }
    }
    throw new Error('Could not parse valid JSON from AI response.');
  }
}

// Helper to invoke model with fallback if primary model returns 404
async function generateContentWithFallback(ai: GoogleGenAI, params: any) {
  try {
    return await ai.models.generateContent({
      ...params,
      model: PRIMARY_MODEL,
    });
  } catch (err: any) {
    console.warn(`Primary model ${PRIMARY_MODEL} invocation failed:`, err?.message || err);
    if (err?.message?.includes('404') || err?.status === 404 || err?.message?.includes('not found')) {
      console.log(`Falling back to ${FALLBACK_MODEL}...`);
      return await ai.models.generateContent({
        ...params,
        model: FALLBACK_MODEL,
      });
    }
    throw err;
  }
}

// Core AI Chat Extraction Routine (Shared by v1 API and direct endpoints)
async function extractChatWithAI(ai: GoogleGenAI, chatText: string, fileName?: string) {
  const systemInstruction = `You are LedgerChat's intelligence engine for WhatsApp business conversations in Nigeria and West Africa.
Your task is to identify and extract concrete commercial sales transactions, orders, and payment records.

NIGERIAN CONVERSATIONAL & MARKET CONVENTIONS:
- Informal English & Nigerian Pidgin: Understand phrases like "how much last", "abeg reduce small", "I don send am", "check alert", "abeg hold am for me", "balance when you reach", "oya send account number".
- Currency representations: "5k" = 5,000 NGN; "10k" = 10,000 NGN; "2.5m" = 2,500,000 NGN; "500 naira". Default currency is NGN.
- Price bargaining: Distinguish between the initial price asked, customer counter-offers, and the FINAL agreed price.
- Strict Financial Verification:
  * Customer claims of payment ("I don transfer", sending a screenshot) MUST NEVER be treated as independently confirmed received funds.
  * If the merchant explicitly confirms receipt in the chat (e.g. "I see am", "Alert dropped, thanks"), then status is "merchant_confirmed" and paymentClaimStatus is "merchant_confirmed".
  * If the customer claims payment but merchant has not confirmed, status is "payment_claimed" and paymentClaimStatus is "customer_claimed".
  * If only a deposit/partial payment is agreed upon, mark status as "partially_paid".
  * If the customer only promised to pay in future (e.g. "I will pay tomorrow morning"), amountPaid is 0, status is "awaiting_payment", and paymentClaimStatus is "none".
  * If the customer cancelled or asked for a refund that was accepted, status is "cancelled" or "refunded".
  * If an inquiry did not result in an agreed order, DO NOT extract a transaction.

DETERMINISTIC FINANCIAL MATH RULE:
- agreedAmount = (agreed unit price * quantity)
- outstandingAmount = Math.max(0, agreedAmount - amountPaid)`;

  const prompt = `Analyze this WhatsApp business export transcript:
--- START CHAT (${fileName || 'WhatsApp Export'}) ---
${chatText.slice(0, 100000)}
--- END CHAT ---

Extract all commercial transactions and conversation context. Return valid JSON.`;

  const response = await generateContentWithFallback(ai, {
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          customerName: { type: Type.STRING },
          customerPhone: { type: Type.STRING },
          conversationSummary: { type: Type.STRING },
          transactions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                productName: { type: Type.STRING },
                quantity: { type: Type.INTEGER },
                agreedAmount: { type: Type.NUMBER },
                amountPaid: { type: Type.NUMBER },
                outstandingAmount: { type: Type.NUMBER },
                currency: { type: Type.STRING },
                orderDate: { type: Type.STRING },
                status: {
                  type: Type.STRING,
                  description: 'completed, partially_paid, payment_claimed, awaiting_payment, cancelled, refunded, or needs_review',
                },
                paymentClaimStatus: {
                  type: Type.STRING,
                  description: 'none, customer_claimed, receipt_submitted, bank_sms_logged, or merchant_confirmed',
                },
                paymentMethod: { type: Type.STRING },
                transactionReference: { type: Type.STRING },
                evidenceSummary: { type: Type.STRING },
                sourceMessages: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Key exact message excerpts forming the transaction basis',
                },
                requiresReview: { type: Type.BOOLEAN },
                reviewReason: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
              },
              required: [
                'productName',
                'quantity',
                'agreedAmount',
                'amountPaid',
                'outstandingAmount',
                'status',
                'paymentClaimStatus',
                'sourceMessages',
              ],
            },
          },
        },
        required: ['customerName', 'transactions'],
      },
    },
  });

  const parsed = cleanAndParseJSON(response.text || '{}');

  // Enforce deterministic financial mathematical invariant on every extracted record
  if (Array.isArray(parsed.transactions)) {
    parsed.transactions = parsed.transactions.map((tx: any) => {
      const agreed = Number(tx.agreedAmount) || 0;
      const paid = Number(tx.amountPaid) || 0;
      const outstanding = Math.max(0, agreed - paid);

      return {
        ...tx,
        agreedAmount: agreed,
        amountPaid: paid,
        outstandingAmount: outstanding,
        currency: tx.currency || 'NGN',
        confidence: typeof tx.confidence === 'number' ? tx.confidence : 0.95,
      };
    });
  }

  return parsed;
}

// ----------------------------------------------------
// Authentication Middleware for API v1
// ----------------------------------------------------
interface AuthenticatedRequest extends Request {
  business?: DBBusiness;
  user?: DBUser;
  isApiKey?: boolean;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // 1. Check API Key header
  const apiKeyHeader = req.header('X-API-Key') || req.header('x-api-key');
  if (apiKeyHeader) {
    const business = liveDB.verifyApiKey(apiKeyHeader);
    if (!business) {
      return res.status(401).json({
        error: 'Invalid or revoked API key.',
        code: 'UNAUTHORIZED_API_KEY',
      });
    }
    req.business = business;
    req.isApiKey = true;
    return next();
  }

  // 2. Check Bearer Token (Session)
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = liveDB.getSession(token);
    if (!session) {
      return res.status(401).json({
        error: 'Invalid or expired session token. Please log in again.',
        code: 'UNAUTHORIZED_SESSION',
      });
    }
    req.business = session.business;
    req.user = session.user;
    req.isApiKey = false;
    return next();
  }

  // Missing credentials
  return res.status(401).json({
    error: 'Authentication required. Please provide a valid X-API-Key header or Bearer session token.',
    code: 'AUTH_REQUIRED',
  });
}

// ----------------------------------------------------
// System Health & OpenAPI Spec Endpoints
// ----------------------------------------------------
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    primaryModel: PRIMARY_MODEL,
    fallbackModel: FALLBACK_MODEL,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/openapi.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(LEDGERCHAT_OPENAPI_SPEC);
});

// ----------------------------------------------------
// REST API v1: Authentication & Business Management
// ----------------------------------------------------
const handleRegister = (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const email = body.email ? String(body.email).trim() : '';
    const password = body.password ? String(body.password) : '';
    const name = String(body.name || body.fullName || body.merchantName || '').trim();
    const businessName = String(body.businessName || body.shopName || (name ? `${name}'s Business` : 'My Business')).trim();

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and merchant name are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const { user, business, token } = liveDB.registerUser(email, password, name, businessName);

    res.status(201).json({
      success: true,
      message: 'Merchant account registered successfully.',
      token,
      user: { id: user.id, email: user.email, name: user.name, fullName: user.name },
      business,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
};

const handleLogin = (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const email = body.email ? String(body.email).trim() : '';
    const password = body.password ? String(body.password) : '';
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { user, business, token } = liveDB.loginUser(email, password);

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, fullName: user.name },
      business,
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Authentication failed.' });
  }
};

app.post('/api/v1/auth/register', handleRegister);
app.post('/api/auth/register', handleRegister);

app.post('/api/v1/auth/login', handleLogin);
app.post('/api/auth/login', handleLogin);

app.get('/api/v1/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: req.user ? { id: req.user.id, email: req.user.email, name: req.user.name } : null,
    business: req.business,
    authMethod: req.isApiKey ? 'api_key' : 'session',
  });
});

app.post('/api/v1/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    liveDB.logoutSession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// API Key Management Endpoints
app.get('/api/v1/auth/api-keys', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const keys = liveDB.getApiKeys(req.business!.id);
  res.json({ keys });
});

app.post('/api/v1/auth/api-keys', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name } = req.body;
  const { key, apiKey } = liveDB.createApiKey(req.business!.id, name || 'Integration Key');
  res.status(201).json({
    success: true,
    message: 'API key generated. Store it safely now; it will never be displayed in plaintext again.',
    key,
    apiKey,
  });
});

app.delete('/api/v1/auth/api-keys/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const success = liveDB.revokeApiKey(req.business!.id, req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'API key not found or already revoked.' });
  }
  res.json({ success: true, message: 'API key revoked.' });
});

// ----------------------------------------------------
// REST API v1: Conversation Ingestion
// ----------------------------------------------------
app.post('/api/v1/ingest', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatText, fileName } = req.body;
    if (!chatText || typeof chatText !== 'string' || !chatText.trim()) {
      return res.status(400).json({ error: 'Valid chatText string is required for ingestion.' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({ error: 'AI processing service is not configured with GEMINI_API_KEY.' });
    }

    // 1. Create Ingestion Job Record
    const job = liveDB.createIngestJob(req.business!.id, fileName || 'whatsapp_chat.txt');

    // 2. Perform AI Extraction
    const extractionResult = await extractChatWithAI(ai, chatText, fileName);

    // 3. Format and save to merchant's persistent ledger
    const transactionsToSave: any[] = [];
    if (extractionResult.transactions && extractionResult.transactions.length > 0) {
      extractionResult.transactions.forEach((tx: any, idx: number) => {
        const txnId = `TXN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const customerId = `cust_${(extractionResult.customerName || 'customer').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

        transactionsToSave.push({
          id: txnId,
          businessId: req.business!.id,
          customerId,
          customerName: extractionResult.customerName || 'Customer',
          customerPhone: extractionResult.customerPhone || '',
          productName: tx.productName,
          quantity: tx.quantity || 1,
          agreedAmount: tx.agreedAmount,
          amountPaid: tx.amountPaid,
          outstandingAmount: tx.outstandingAmount,
          currency: tx.currency || 'NGN',
          date: tx.orderDate || new Date().toISOString(),
          status: tx.status,
          paymentClaimStatus: tx.paymentClaimStatus,
          paymentMethod: tx.paymentMethod || 'Bank Transfer',
          confidence: tx.confidence || 0.95,
          requiresReview: Boolean(tx.requiresReview || tx.status === 'needs_review' || tx.status === 'payment_claimed'),
          reviewReason: tx.reviewReason || (tx.status === 'payment_claimed' ? 'Customer claims payment, check bank alert' : undefined),
          notes: tx.evidenceSummary || (tx.transactionReference ? `Ref: ${tx.transactionReference}` : undefined),
          sourceMessages: tx.sourceMessages || [],
          evidence: [
            {
              id: `ev_${Date.now()}_${idx}`,
              type: 'whatsapp_message',
              timestamp: tx.orderDate || new Date().toISOString(),
              verificationNote: tx.evidenceSummary || `Extracted from chat discussion: ${tx.quantity}x ${tx.productName}`,
              matchConfidence: tx.confidence || 0.95,
              status: tx.status === 'completed' ? 'merchant_confirmed' : 'needs_review',
            },
          ],
        });
      });
    }

    const { added, updated } = liveDB.saveTransactions(req.business!.id, transactionsToSave);

    // Save conversation context
    const convId = `conv_${Date.now()}`;
    liveDB.saveConversations(req.business!.id, [
      {
        id: convId,
        customerName: extractionResult.customerName || 'Customer',
        customerPhone: extractionResult.customerPhone || '',
        date: new Date().toISOString(),
        lastMessage: extractionResult.conversationSummary || `Imported chat export containing ${transactionsToSave.length} order(s)`,
        messageCount: (chatText.match(/\n/g) || []).length + 1,
        messages: (transactionsToSave[0]?.sourceMessages || []).map((m: string, i: number) => ({
          id: `msg_${convId}_${i}`,
          sender: m.toLowerCase().startsWith('me') ? 'merchant' : 'customer',
          senderName: m.split(':')[0] || 'User',
          text: m,
          timestamp: new Date().toISOString(),
        })),
        relatedTransactionIds: transactionsToSave.map((t) => t.id),
      },
    ]);

    // Update job status
    liveDB.updateIngestJob(job.id, {
      status: 'completed',
      transactionsExtracted: transactionsToSave.length,
      evidenceFound: transactionsToSave.length,
      requiresReviewCount: transactionsToSave.filter((t) => t.requiresReview).length,
    });

    res.json({
      success: true,
      jobId: job.id,
      summary: {
        transactionsExtracted: transactionsToSave.length,
        added,
        updated,
        evidenceFound: transactionsToSave.length,
        requiresReviewCount: transactionsToSave.filter((t) => t.requiresReview).length,
        totalOrderValue: transactionsToSave.reduce((acc, t) => acc + (t.status !== 'refunded' ? t.agreedAmount : 0), 0),
        totalConfirmedReceived: transactionsToSave.reduce((acc, t) => acc + (t.status === 'completed' || t.status === 'merchant_confirmed' ? t.amountPaid : 0), 0),
        totalOutstandingBalance: transactionsToSave.reduce((acc, t) => acc + (t.status !== 'refunded' ? t.outstandingAmount : 0), 0),
      },
      transactions: transactionsToSave,
    });
  } catch (err: any) {
    console.error('Error in /api/v1/ingest:', err);
    res.status(500).json({ error: err.message || 'Failed to ingest conversation.' });
  }
});

app.get('/api/v1/ingest/:jobId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const job = liveDB.getIngestJob(req.params.jobId);
  if (!job || job.businessId !== req.business!.id) {
    return res.status(404).json({ error: 'Ingestion job not found.' });
  }
  res.json({ job });
});

// ----------------------------------------------------
// REST API v1: Transactions Management
// ----------------------------------------------------
app.get('/api/v1/transactions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  let txns = liveDB.getTransactions(req.business!.id);

  const { status, customer, search } = req.query;

  if (status && typeof status === 'string' && status !== 'all') {
    if (status === 'completed') {
      txns = txns.filter((t) => t.status === 'completed' || t.status === 'merchant_confirmed');
    } else {
      txns = txns.filter((t) => t.status === status);
    }
  }

  if (customer && typeof customer === 'string') {
    txns = txns.filter((t) => t.customerName.toLowerCase().includes(customer.toLowerCase()));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    txns = txns.filter(
      (t) =>
        t.customerName.toLowerCase().includes(q) ||
        t.productName.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }

  res.json({
    total: txns.length,
    transactions: txns,
  });
});

app.get('/api/v1/transactions/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const tx = liveDB.getTransactions(req.business!.id).find((t) => t.id === req.params.id);
  if (!tx) {
    return res.status(404).json({ error: 'Transaction not found.' });
  }
  res.json({ transaction: tx });
});

app.post('/api/v1/transactions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { customerName, customerPhone, productName, quantity, agreedAmount, amountPaid, paymentMethod, notes } = req.body;
  if (!customerName || !productName || agreedAmount === undefined) {
    return res.status(400).json({ error: 'customerName, productName, and agreedAmount are required.' });
  }

  const agreed = Number(agreedAmount) || 0;
  const paid = Number(amountPaid) || 0;
  const outstanding = Math.max(0, agreed - paid);

  const newTx = {
    id: `TXN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    businessId: req.business!.id,
    customerId: `cust_${customerName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    customerName,
    customerPhone: customerPhone || '',
    productName,
    quantity: Number(quantity) || 1,
    agreedAmount: agreed,
    amountPaid: paid,
    outstandingAmount: outstanding,
    currency: 'NGN',
    date: new Date().toISOString(),
    status: outstanding === 0 ? 'completed' : paid > 0 ? 'partially_paid' : 'awaiting_payment',
    paymentClaimStatus: paid > 0 ? 'merchant_confirmed' : 'none',
    paymentMethod: paymentMethod || 'Bank Transfer',
    confidence: 1.0,
    requiresReview: false,
    notes,
    sourceMessages: [`Manual transaction created for ${customerName}`],
    evidence: [],
  };

  liveDB.saveTransactions(req.business!.id, [newTx]);
  res.status(201).json({ success: true, transaction: newTx });
});

app.patch('/api/v1/transactions/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = liveDB.updateTransaction(req.business!.id, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Transaction not found.' });
  }
  res.json({ success: true, transaction: updated });
});

app.delete('/api/v1/transactions/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const success = liveDB.deleteTransaction(req.business!.id, req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Transaction not found.' });
  }
  res.json({ success: true, message: 'Transaction deleted successfully.' });
});

// ----------------------------------------------------
// REST API v1: Customers & Products
// ----------------------------------------------------
app.get('/api/v1/customers', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const customers = liveDB.getCustomers(req.business!.id);
  res.json({ total: customers.length, customers });
});

app.get('/api/v1/customers/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const customer = liveDB.getCustomers(req.business!.id).find((c) => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }
  const transactions = liveDB.getTransactions(req.business!.id).filter((t) => t.customerName.toLowerCase() === customer.name.toLowerCase());
  res.json({ customer, transactions });
});

app.get('/api/v1/products', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const products = liveDB.getProducts(req.business!.id);
  res.json({ total: products.length, products });
});

// ----------------------------------------------------
// REST API v1: Analytics & Reports
// ----------------------------------------------------
app.get('/api/v1/analytics/summary', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const summary = liveDB.getAnalyticsSummary(req.business!.id);
  res.json(summary);
});

app.post('/api/v1/analytics/insights', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({ error: 'AI processing service is not configured with GEMINI_API_KEY.' });
    }

    const summary = liveDB.getAnalyticsSummary(req.business!.id);
    const customers = liveDB.getCustomers(req.business!.id);
    const products = liveDB.getProducts(req.business!.id);

    const prompt = `Here are the business records for ${req.business!.name} (${req.business!.ownerName}):
Financial Summary: ${JSON.stringify(summary)}
Top Customers: ${JSON.stringify(customers.slice(0, 5))}
Top Products: ${JSON.stringify(products.slice(0, 5))}

Generate 4 practical, grounded business advice observations with actionable tips for a Nigerian small merchant. Return valid JSON array.`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              severity: { type: Type.STRING },
              actionableTip: { type: Type.STRING },
            },
            required: ['title', 'description', 'category', 'severity'],
          },
        },
      },
    });

    const observations = cleanAndParseJSON(response.text || '[]');
    res.json({ success: true, insights: observations });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate insights.' });
  }
});

app.get('/api/v1/reports/financial', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { format, period } = req.query;
  const txns = liveDB.getTransactions(req.business!.id);
  const summary = liveDB.getAnalyticsSummary(req.business!.id);

  if (format === 'csv') {
    const headers = 'Transaction ID,Date,Customer,Product,Quantity,Agreed Total (NGN),Amount Paid (NGN),Outstanding Balance (NGN),Status,Payment Method\n';
    const rows = txns
      .map((t) =>
        `"${t.id}","${t.date}","${t.customerName.replace(/"/g, '""')}","${t.productName.replace(/"/g, '""')}",${t.quantity},${t.agreedAmount},${t.amountPaid},${t.outstandingAmount},"${t.status}","${t.paymentMethod || 'Bank Transfer'}"`
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="ledgerchat_report_${period || 'all'}.csv"`);
    return res.send(headers + rows);
  }

  res.json({
    business: req.business,
    period: period || 'all',
    generatedAt: new Date().toISOString(),
    summary,
    transactions: txns,
  });
});

// ----------------------------------------------------
// REST API v1: Webhooks
// ----------------------------------------------------
app.get('/api/v1/webhooks', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const webhooks = liveDB.getWebhooks(req.business!.id);
  res.json({ webhooks });
});

app.post('/api/v1/webhooks', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { url, events } = req.body;
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'A valid HTTPS or HTTP url is required.' });
  }
  const webhook = liveDB.createWebhook(req.business!.id, url, Array.isArray(events) ? events : []);
  res.status(201).json({ success: true, webhook });
});

app.delete('/api/v1/webhooks/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const success = liveDB.deleteWebhook(req.business!.id, req.params.id);
  if (!success) return res.status(404).json({ error: 'Webhook not found.' });
  res.json({ success: true, message: 'Webhook deleted.' });
});

// ----------------------------------------------------
// REST API v1: WhatsApp Business Platform Integration
// ----------------------------------------------------
// Meta Webhook Verification (hub.mode, hub.verify_token, hub.challenge)
app.get('/api/v1/whatsapp/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.META_WHATSAPP_VERIFY_TOKEN || 'ledgerchat_whatsapp_verify_token_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[Meta WhatsApp Webhook] Challenge verified successfully');
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ error: 'Webhook verification token mismatch' });
});

// Meta Webhook Event Notification Receiver
app.post('/api/v1/whatsapp/webhook', (req: Request, res: Response) => {
  const body = req.body;
  console.log('[Meta WhatsApp Webhook Event Received]:', JSON.stringify(body).slice(0, 300));

  // Meta requires immediate HTTP 200 OK
  res.status(200).send('EVENT_RECEIVED');
});

app.get('/api/v1/whatsapp/config', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const config = req.business!.whatsappConfig || { status: 'not_configured' };
  res.json({
    config: {
      ...config,
      accessToken: config.accessToken ? `EAAG...${config.accessToken.slice(-4)}` : undefined,
    },
    webhookUrl: `${req.protocol}://${req.get('host')}/api/v1/whatsapp/webhook`,
    verifyToken: process.env.META_WHATSAPP_VERIFY_TOKEN || 'ledgerchat_whatsapp_verify_token_2026',
  });
});

app.post('/api/v1/whatsapp/config', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { phoneNumberId, wabaId, accessToken } = req.body;
  const updated = liveDB.updateWhatsAppConfig(req.business!.id, {
    phoneNumberId,
    wabaId,
    accessToken,
  });
  res.json({ success: true, config: updated });
});

// ----------------------------------------------------
// Existing Core Processing Endpoints (Backward Compatibility)
// ----------------------------------------------------
app.post('/api/extract-chat', async (req: Request, res: Response) => {
  try {
    const { chatText, fileName } = req.body;
    if (!chatText || typeof chatText !== 'string' || !chatText.trim()) {
      return res.status(400).json({ error: 'Chat transcript text is required.' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({ error: 'AI processing service is not configured with GEMINI_API_KEY.' });
    }

    const extractionResult = await extractChatWithAI(ai, chatText, fileName);
    res.json({ success: true, data: extractionResult });
  } catch (error: any) {
    console.error('Error in /api/extract-chat:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat transcript.' });
  }
});

app.post('/api/verify-receipt', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, transactionContext } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Receipt image data is required.' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({ error: 'AI processing service is not configured with GEMINI_API_KEY.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const systemInstruction = `You are an automated bank transfer and payment receipt verification engine for Nigerian business transactions.
You inspect digital banking receipts (e.g. GTBank, Zenith, Access Bank, Moniepoint, OPay, Kuda, PalmPay, First Bank).
Extract the transaction details carefully.
CRITICAL SAFETY RULE: Never blindly mark a receipt as authentic if essential fields (amount, session ID/reference, date) are illegible or missing.`;

    const promptText = `Inspect this bank receipt screenshot. Extract the financial details and compare with the claimed transaction context if provided:
Claimed context: ${JSON.stringify(transactionContext || {})}`;

    const response = await ai.models.generateContent({
      model: FALLBACK_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bankName: { type: Type.STRING },
            senderName: { type: Type.STRING },
            beneficiaryName: { type: Type.STRING },
            extractedAmount: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            transactionReference: { type: Type.STRING },
            dateTime: { type: Type.STRING },
            status: { type: Type.STRING },
            isLegible: { type: Type.BOOLEAN },
            matchingNote: { type: Type.STRING },
            matchConfidence: { type: Type.NUMBER },
            recommendedAction: { type: Type.STRING },
          },
          required: ['bankName', 'extractedAmount', 'isLegible', 'matchingNote', 'matchConfidence'],
        },
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/verify-receipt:', error);
    res.status(500).json({ error: error.message || 'Failed to inspect payment receipt image.' });
  }
});

app.post('/api/generate-insights', async (req: Request, res: Response) => {
  try {
    const { businessProfile, financialSummary, topCustomers, topProducts, recentTransactions } = req.body;

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({ error: 'AI processing service is not configured with GEMINI_API_KEY.' });
    }

    const systemInstruction = `You are LedgerChat's business financial advisor for Nigerian and African small business owners.
Speak warmly, clearly, and practically. Use clear Nigerian Naira (₦) formatting. Never make up numbers—use only verified figures supplied.`;

    const prompt = `Here are the business records for ${businessProfile?.name || 'My Business'}:
Financial Summary: ${JSON.stringify(financialSummary || {})}
Top Customers: ${JSON.stringify(topCustomers || [])}
Top Products: ${JSON.stringify(topProducts || [])}
Recent Transactions Count: ${(recentTransactions || []).length}

Generate 4 to 5 insightful, grounded business observations with actionable tips. Return a valid JSON array.`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              severity: { type: Type.STRING },
              actionableTip: { type: Type.STRING },
            },
            required: ['title', 'description', 'category', 'severity'],
          },
        },
      },
    });

    const observations = cleanAndParseJSON(response.text || '[]');
    res.json({ success: true, data: observations });
  } catch (error: any) {
    console.error('Error in /api/generate-insights:', error);
    res.status(500).json({ error: error.message || 'Failed to generate business insights.' });
  }
});

// ----------------------------------------------------
// Setup Vite Development Middleware or Static Serving
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LedgerChat server running on http://0.0.0.0:${PORT}`);
    console.log(`- REST API v1: http://0.0.0.0:${PORT}/api/v1`);
    console.log(`- OpenAPI 3.0 Documentation: http://0.0.0.0:${PORT}/api/v1/openapi.json`);
  });
}

startServer();
