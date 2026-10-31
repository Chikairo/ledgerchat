import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

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

// Health & Status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    primaryModel: PRIMARY_MODEL,
    fallbackModel: FALLBACK_MODEL,
    hasApiKey: hasKey,
    timestamp: new Date().toISOString(),
  });
});

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
    // Attempt extracting the first JSON object or array
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
      return JSON.parse(slice);
    }
    throw err;
  }
}

// 1. WhatsApp Conversation & Transaction Extraction Endpoint
app.post('/api/extract-chat', async (req: Request, res: Response) => {
  try {
    const { chatText, fileName } = req.body;

    if (!chatText || typeof chatText !== 'string' || chatText.trim().length === 0) {
      return res.status(400).json({ error: 'Chat text is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'AI processing service is not configured with GEMINI_API_KEY. Please verify your API Key in Settings > Secrets.',
      });
    }

    const systemInstruction = `You are LedgerChat's specialist transaction and financial accounting intelligence engine for African and Nigerian WhatsApp merchants.
Your job is to read unstructured WhatsApp business conversation exports and extract high-precision business transactions, customer identities, product orders, and payment statuses.

Rules for Nigerian Business & Financial Interpretation:
1. CURRENCY: Recognize Nigerian currency formats like:
   - "5k" = 5000, "15k" = 15000, "120k" = 120000, "1.5m" = 1500000
   - "₦45,000", "45000 naira", "45k"
   - Do NOT confuse phone numbers (e.g. 0803..., +234...), dates, tracking numbers, or quantities with amounts.
2. PIDGIN & COLLOQUIAL TERMS:
   - "I don send am" / "I don pay" = customer claims to have paid.
   - "balance tomorrow" / "balance on delivery" / "pay remaining" = partial payment with outstanding debt.
   - "send account details" / "drop aza" = buyer requesting payment info.
   - "confirm alert" / "alert don land" = checking or acknowledging bank transfer receipt.
3. TRANSACTION INTEGRITY:
   - Do NOT duplicate an order if discussed multiple times across several messages. Combine multi-step discussions (request -> quote -> payment -> dispatch) into ONE unified transaction.
   - Never invent numbers. If price is missing or not agreed, mark requiresReview = true with reason.
   - Distinguish between:
     * 'completed': fully paid and acknowledged by merchant.
     * 'partially_paid': part of agreed sum paid, balance outstanding.
     * 'payment_claimed': buyer claimed to have paid, but merchant hasn't explicitly verified.
     * 'awaiting_payment': order placed, no payment made yet.
     * 'needs_review': ambiguous amount, conflicting claims, or unclear agreement.
   - If evidence is mentioned (e.g. "<attached: ...>", "check receipt", screenshot), create an evidence record.

Return a valid JSON object matching the requested schema.`;

    const prompt = `Analyze this WhatsApp chat export and extract all business transactions, customers, and products:

Filename: ${fileName || 'chat_export.txt'}
Content:
---
${chatText.slice(0, 35000)}
---`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customerName: { type: Type.STRING, description: 'Primary customer name identified in this chat' },
            customerPhone: { type: Type.STRING, description: 'Customer phone number if found' },
            summary: { type: Type.STRING, description: 'Brief 1-sentence summary of the conversation' },
            transactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  customerName: { type: Type.STRING },
                  productName: { type: Type.STRING },
                  quantity: { type: Type.INTEGER },
                  agreedAmount: { type: Type.NUMBER },
                  amountPaid: { type: Type.NUMBER },
                  outstandingAmount: { type: Type.NUMBER },
                  currency: { type: Type.STRING },
                  date: { type: Type.STRING, description: 'ISO 8601 date string or estimated date' },
                  status: {
                    type: Type.STRING,
                    description: 'One of: order_received, awaiting_payment, partially_paid, payment_claimed, merchant_confirmed, completed, needs_review',
                  },
                  paymentClaimStatus: {
                    type: Type.STRING,
                    description: 'One of: none, customer_claimed, receipt_submitted, merchant_confirmed',
                  },
                  paymentMethod: { type: Type.STRING, description: 'e.g. Bank Transfer, OPay, Moniepoint, Cash' },
                  sourceMessages: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Exact verbatim messages showing the quote and payment agreement',
                  },
                  evidenceNotes: { type: Type.STRING, description: 'Receipt details, references or attachments noted' },
                  confidence: { type: Type.NUMBER, description: 'Confidence between 0.1 and 1.0' },
                  requiresReview: { type: Type.BOOLEAN },
                  reviewReason: { type: Type.STRING },
                },
                required: ['customerName', 'productName', 'quantity', 'agreedAmount', 'amountPaid', 'outstandingAmount', 'status'],
              },
            },
          },
          required: ['customerName', 'transactions'],
        },
      },
    });

    const textOutput = response.text || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(textOutput);
    } catch (parseError) {
      console.error('Failed to parse AI JSON output:', textOutput);
      return res.status(500).json({ error: 'AI returned an invalid JSON response structure. Please retry.' });
    }

    res.json({
      success: true,
      data: parsedData,
      modelUsed: PRIMARY_MODEL,
    });
  } catch (error: any) {
    console.error('Error in /api/extract-chat:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while processing conversation with Gemma 4 AI.',
    });
  }
});

// 2. Multimodal Receipt Image Verification Endpoint
app.post('/api/verify-receipt', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, transactionContext } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Receipt imageBase64 is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'AI processing service is not configured with GEMINI_API_KEY.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const systemInstruction = `You are an automated bank transfer and payment receipt verification engine for Nigerian business transactions.
You inspect digital banking receipts (e.g. GTBank, Zenith, Access Bank, Moniepoint, OPay, Kuda, PalmPay, First Bank).
Extract the transaction details carefully.
CRITICAL SAFETY RULE: Never blindly mark a receipt as authentic if essential fields (amount, session ID/reference, date) are illegible or missing. Clearly indicate what is extracted.`;

    const promptText = `Inspect this bank receipt screenshot. Extract the financial details and compare with the claimed transaction context if provided:
Claimed context: ${JSON.stringify(transactionContext || {})}`;

    const response = await ai.models.generateContent({
      model: FALLBACK_MODEL, // multimodal flash model is fast & accurate for vision
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
            transactionReference: { type: Type.STRING, description: 'Session ID, Ref or Transfer code' },
            dateTime: { type: Type.STRING },
            status: { type: Type.STRING, description: 'e.g. Successful, Pending, Failed' },
            isLegible: { type: Type.BOOLEAN },
            matchingNote: { type: Type.STRING, description: 'Explanation of how extracted details correspond to claimed sale' },
            matchConfidence: { type: Type.NUMBER, description: 'Confidence score from 0.0 to 1.0' },
            recommendedAction: { type: Type.STRING, description: 'One of: accept, reject, needs_merchant_review' },
          },
          required: ['bankName', 'extractedAmount', 'isLegible', 'matchingNote', 'matchConfidence'],
        },
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error in /api/verify-receipt:', error);
    res.status(500).json({
      error: error.message || 'Failed to inspect payment receipt image.',
    });
  }
});

// 3. AI Business Insights Generator Endpoint
app.post('/api/generate-insights', async (req: Request, res: Response) => {
  try {
    const { businessProfile, financialSummary, topCustomers, topProducts, recentTransactions } = req.body;

    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'AI processing service is not configured with GEMINI_API_KEY.',
      });
    }

    const systemInstruction = `You are LedgerChat's business financial advisor for Nigerian and African small business owners.
The business owner has little formal accounting background.
Speak warmly, clearly, and practically.
Focus on:
1. Cash Flow & Revenue (Money in bank vs Money owed).
2. Customer Payment Habits (Who is reliable, who has outstanding balances to follow up on).
3. Inventory & Demand (What is moving fast, what is requested).
4. Actionable tips to grow their business and protect working capital.
Use clear Nigerian Naira (₦) formatting. Never make up numbers—use only the verified figures supplied.`;

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
              category: { type: Type.STRING, description: 'sales, customer, product, cashflow, or alert' },
              severity: { type: Type.STRING, description: 'info, positive, or warning' },
              actionableTip: { type: Type.STRING },
            },
            required: ['title', 'description', 'category', 'severity'],
          },
        },
      },
    });

    const observations = cleanAndParseJSON(response.text || '[]');
    res.json({
      success: true,
      data: observations,
    });
  } catch (error: any) {
    console.error('Error in /api/generate-insights:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate business insights.',
    });
  }
});

// Setup Vite or Static File Serving
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
  });
}

startServer();
