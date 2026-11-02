export const LEDGERCHAT_OPENAPI_SPEC = {
  openapi: '3.0.3',
  info: {
    title: 'LedgerChat Business Intelligence & Financial Ledger API',
    version: '1.0.0',
    description:
      'High-performance REST API for small business financial ledgering, WhatsApp conversation ingestion, intelligent transaction extraction, customer debtor intelligence, and financial statements.',
    contact: {
      name: 'LedgerChat Engineering Team',
      url: 'https://ledgerchat.com',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'LedgerChat Production API v1',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'Live business API key starting with lchat_live_...',
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'Session token starting with lchat_sess_...',
      },
    },
    schemas: {
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'TXN-2026-4819' },
          businessId: { type: 'string', example: 'biz_a1b2c3' },
          customerId: { type: 'string', example: 'cust_alhaji_musa' },
          customerName: { type: 'string', example: 'Alhaji Musa' },
          customerPhone: { type: 'string', example: '+234 803 234 5678' },
          productName: { type: 'string', example: 'Oraimo 20000mAh Power Bank' },
          quantity: { type: 'integer', example: 10 },
          agreedAmount: { type: 'number', example: 180000 },
          amountPaid: { type: 'number', example: 100000 },
          outstandingAmount: { type: 'number', example: 80000 },
          currency: { type: 'string', example: 'NGN' },
          date: { type: 'string', format: 'date-time' },
          status: {
            type: 'string',
            enum: ['completed', 'partially_paid', 'payment_claimed', 'awaiting_payment', 'cancelled', 'refunded', 'needs_review'],
          },
          paymentClaimStatus: {
            type: 'string',
            enum: ['none', 'customer_claimed', 'receipt_submitted', 'bank_sms_logged', 'merchant_confirmed', 'independently_verified'],
          },
          confidence: { type: 'number', example: 0.96 },
          requiresReview: { type: 'boolean', example: false },
          paymentMethod: { type: 'string', example: 'Bank Transfer' },
          notes: { type: 'string', example: 'Paid 100k deposit, 80k balance due on delivery' },
        },
      },
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cust_alhaji_musa' },
          name: { type: 'string', example: 'Alhaji Musa' },
          phone: { type: 'string', example: '+234 803 234 5678' },
          totalSpent: { type: 'number', example: 450000 },
          totalAgreed: { type: 'number', example: 530000 },
          totalOrders: { type: 'integer', example: 4 },
          outstandingBalance: { type: 'number', example: 80000 },
          lastTransactionDate: { type: 'string', format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'prod_powerbank' },
          name: { type: 'string', example: 'Oraimo 20000mAh Power Bank' },
          category: { type: 'string', example: 'Accessories' },
          unitsSold: { type: 'integer', example: 35 },
          totalSalesValue: { type: 'number', example: 630000 },
          averageSellingPrice: { type: 'number', example: 18000 },
          inquiryCount: { type: 'integer', example: 52 },
        },
      },
      AnalyticsSummary: {
        type: 'object',
        properties: {
          totalSales: { type: 'number', example: 4850000 },
          moneyReceived: { type: 'number', example: 3950000 },
          unconfirmedClaims: { type: 'number', example: 150000 },
          moneyOwed: { type: 'number', example: 900000 },
          collectionRate: { type: 'number', example: 81 },
          transactionCount: { type: 'integer', example: 28 },
          customerCount: { type: 'integer', example: 14 },
          productCount: { type: 'integer', example: 9 },
        },
      },
      IngestRequest: {
        type: 'object',
        required: ['chatText'],
        properties: {
          chatText: { type: 'string', description: 'Raw exported WhatsApp conversation text transcript' },
          fileName: { type: 'string', description: 'Original chat export filename (e.g. WhatsApp Chat with Customer.txt)' },
        },
      },
      IngestResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          jobId: { type: 'string', example: 'job_4fa812' },
          summary: {
            type: 'object',
            properties: {
              transactionsExtracted: { type: 'integer', example: 3 },
              evidenceFound: { type: 'integer', example: 2 },
              requiresReviewCount: { type: 'integer', example: 0 },
              totalOrderValue: { type: 'number', example: 250000 },
              totalConfirmedReceived: { type: 'number', example: 150000 },
              totalOutstandingBalance: { type: 'number', example: 100000 },
            },
          },
          transactions: {
            type: 'array',
            items: { $ref: '#/components/schemas/Transaction' },
          },
        },
      },
    },
  },
  security: [
    { ApiKeyAuth: [] },
    { BearerAuth: [] },
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new merchant account & business ledger',
        tags: ['Authentication'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name', 'businessName'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  name: { type: 'string' },
                  businessName: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Registration successful' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate existing merchant',
        tags: ['Authentication'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
        },
      },
    },
    '/auth/api-keys': {
      get: {
        summary: 'List active API keys for authenticated business',
        tags: ['API Key Management'],
        responses: {
          '200': { description: 'List of API keys' },
        },
      },
      post: {
        summary: 'Create a new live API key',
        tags: ['API Key Management'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'ERP Production Integration' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'API key created. Returned once in plaintext.' },
        },
      },
    },
    '/auth/api-keys/{id}': {
      delete: {
        summary: 'Revoke an API key',
        tags: ['API Key Management'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'API key revoked' },
        },
      },
    },
    '/ingest': {
      post: {
        summary: 'Ingest WhatsApp conversation and extract financial transactions via AI',
        tags: ['Ingestion'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/IngestRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Extraction and ledger sync completed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/IngestResponse' },
              },
            },
          },
        },
      },
    },
    '/transactions': {
      get: {
        summary: 'List extracted business transactions',
        tags: ['Transactions'],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'customer', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Transactions list',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Transaction' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a manual transaction entry',
        tags: ['Transactions'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Transaction' },
            },
          },
        },
        responses: {
          '201': { description: 'Transaction created' },
        },
      },
    },
    '/transactions/{id}': {
      get: {
        summary: 'Get single transaction with full evidence and source WhatsApp messages',
        tags: ['Transactions'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Transaction details' },
        },
      },
      patch: {
        summary: 'Update transaction status, verified amount, or merchant note',
        tags: ['Transactions'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  amountPaid: { type: 'number' },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Transaction updated' },
        },
      },
      delete: {
        summary: 'Delete or cancel a transaction',
        tags: ['Transactions'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Transaction deleted' },
        },
      },
    },
    '/customers': {
      get: {
        summary: 'List identified customers with spend and debt balances',
        tags: ['Customers'],
        responses: {
          '200': {
            description: 'Customers list',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Customer' },
                },
              },
            },
          },
        },
      },
    },
    '/products': {
      get: {
        summary: 'List discovered products with sales volume, revenue, and inquiries',
        tags: ['Products'],
        responses: {
          '200': {
            description: 'Products list',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
        },
      },
    },
    '/analytics/summary': {
      get: {
        summary: 'Get business analytics and cashflow collection summary',
        tags: ['Analytics'],
        responses: {
          '200': {
            description: 'Summary figures',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AnalyticsSummary' },
              },
            },
          },
        },
      },
    },
    '/reports/financial': {
      get: {
        summary: 'Generate period financial statement report',
        tags: ['Reports'],
        parameters: [
          { name: 'period', in: 'query', schema: { type: 'string', enum: ['weekly', 'biweekly', 'monthly', 'annual', 'all'] } },
          { name: 'format', in: 'query', schema: { type: 'string', enum: ['json', 'csv'] } },
        ],
        responses: {
          '200': { description: 'Financial statement output' },
        },
      },
    },
    '/webhooks': {
      get: {
        summary: 'List registered developer webhooks',
        tags: ['Webhooks'],
        responses: {
          '200': { description: 'List of webhooks' },
        },
      },
      post: {
        summary: 'Register a webhook URL for transaction and payment events',
        tags: ['Webhooks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: { type: 'string', format: 'uri' },
                  events: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['transaction.created', 'payment.verified', 'debtor.alert'],
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Webhook registered' },
        },
      },
    },
    '/whatsapp/webhook': {
      get: {
        summary: 'Meta WhatsApp Cloud API webhook verification challenge',
        tags: ['WhatsApp Cloud API Integration'],
        security: [],
        parameters: [
          { name: 'hub.mode', in: 'query', schema: { type: 'string' } },
          { name: 'hub.verify_token', in: 'query', schema: { type: 'string' } },
          { name: 'hub.challenge', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Challenge token echoed back to Meta' },
        },
      },
      post: {
        summary: 'Meta WhatsApp Cloud API incoming message notification event',
        tags: ['WhatsApp Cloud API Integration'],
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
            },
          },
        },
        responses: {
          '200': { description: 'Event received and queued for processing' },
        },
      },
    },
  },
};
