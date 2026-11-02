import { BusinessProfile, Customer, Product, Transaction, Conversation } from '../types';

export const DEMO_PROFILE: BusinessProfile = {
  id: 'biz_demo_chidi_electronics',
  name: 'Chidi Electronics & Accessories',
  ownerName: 'Chidubem Okafor',
  category: 'Electronics & Mobile Gadgets',
  country: 'Nigeria',
  currency: 'NGN',
  currencySymbol: '₦',
  reconciliationFrequency: 'weekly',
  reminderDay: 'Friday',
  reminderTime: '18:00',
  isOnboarded: true,
  isDemoMode: true,
  createdAt: '2026-09-01T08:00:00Z',
};

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    name: 'Alhaji Musa Bello',
    phone: '+234 803 555 0192',
    email: 'musa.bello@gmail.com',
    totalSpent: 420000,
    totalAgreed: 420000,
    totalOrders: 4,
    outstandingBalance: 0,
    firstTransactionDate: '2026-10-02T10:15:00Z',
    lastTransactionDate: '2026-10-28T16:20:00Z',
    notes: 'Wholesale buyer in Ikeja Computer Village. Always pays promptly via GTBank transfer.',
  },
  {
    id: 'cust_2',
    name: 'Blessing Adeyemi',
    phone: '+234 812 444 8831',
    email: 'blessing.adeyemi@yahoo.com',
    totalSpent: 260000,
    totalAgreed: 310000,
    totalOrders: 3,
    outstandingBalance: 50000,
    firstTransactionDate: '2026-10-05T12:00:00Z',
    lastTransactionDate: '2026-10-27T11:45:00Z',
    notes: 'Boutique influencer in Lekki. Has ₦50,000 balance pending for Ring Light setup.',
  },
  {
    id: 'cust_3',
    name: 'Emeka Nwosu (TechPoint)',
    phone: '+234 705 321 9904',
    totalSpent: 385000,
    totalAgreed: 385000,
    totalOrders: 5,
    outstandingBalance: 0,
    firstTransactionDate: '2026-09-28T14:10:00Z',
    lastTransactionDate: '2026-10-30T09:30:00Z',
    notes: 'Repeat buyer for smartphone screens and high-wattage power banks.',
  },
  {
    id: 'cust_4',
    name: 'Folake Johnson',
    phone: '+234 816 772 3410',
    totalSpent: 115000,
    totalAgreed: 145000,
    totalOrders: 2,
    outstandingBalance: 30000,
    firstTransactionDate: '2026-10-12T15:20:00Z',
    lastTransactionDate: '2026-10-25T13:10:00Z',
    notes: 'Bought JBL Bluetooth speaker, promised to balance ₦30,000 at monthend.',
  },
  {
    id: 'cust_5',
    name: 'Kabiru Sanusi',
    phone: '+234 902 119 4087',
    totalSpent: 195000,
    totalAgreed: 195000,
    totalOrders: 3,
    outstandingBalance: 0,
    firstTransactionDate: '2026-10-08T09:40:00Z',
    lastTransactionDate: '2026-10-29T17:05:00Z',
    notes: 'Frequent buyer for wholesale fast-chargers and OTG adapters.',
  },
  {
    id: 'cust_6',
    name: 'Ngozi Eze',
    phone: '+234 808 654 3219',
    totalSpent: 85000,
    totalAgreed: 125000,
    totalOrders: 2,
    outstandingBalance: 40000,
    firstTransactionDate: '2026-10-15T18:00:00Z',
    lastTransactionDate: '2026-10-26T14:30:00Z',
    notes: 'Ordered 2x Oraimo FreePods; sent ₦85,000 via OPay, remaining ₦40,000 outstanding.',
  },
  {
    id: 'cust_7',
    name: 'Dr. Tunde Bakare',
    phone: '+234 802 888 1234',
    totalSpent: 450000,
    totalAgreed: 450000,
    totalOrders: 1,
    outstandingBalance: 0,
    firstTransactionDate: '2026-10-20T10:00:00Z',
    lastTransactionDate: '2026-10-20T10:00:00Z',
    notes: 'Purchased Apple iPad 10th Gen for hospital clinic management.',
  },
  {
    id: 'cust_8',
    name: 'Victor Chukwuemeka',
    phone: '+234 703 999 5432',
    totalSpent: 45000,
    totalAgreed: 90000,
    totalOrders: 2,
    outstandingBalance: 45000,
    firstTransactionDate: '2026-10-22T16:15:00Z',
    lastTransactionDate: '2026-10-30T15:00:00Z',
    notes: 'Ordered Smartwatch Ultra + Magnetic strap; deposited 50%, balancing upon delivery.',
  },
  {
    id: 'cust_9',
    name: 'Amina Danjuma',
    phone: '+234 809 123 7890',
    totalSpent: 175000,
    totalAgreed: 175000,
    totalOrders: 2,
    outstandingBalance: 0,
    firstTransactionDate: '2026-10-10T11:20:00Z',
    lastTransactionDate: '2026-10-24T12:00:00Z',
    notes: 'Purchased Ring Light kits and wireless lavalier microphones for content creation.',
  }
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Oraimo FreePods 4',
    category: 'Audio',
    unitsSold: 28,
    totalSalesValue: 616000,
    orderCount: 16,
    averageSellingPrice: 22000,
    trend: 'up',
    inquiryCount: 42,
  },
  {
    id: 'prod_2',
    name: '65W GaN Fast Charger',
    category: 'Charging & Power',
    unitsSold: 34,
    totalSalesValue: 510000,
    orderCount: 19,
    averageSellingPrice: 15000,
    trend: 'up',
    inquiryCount: 50,
  },
  {
    id: 'prod_3',
    name: 'Original iPhone 13 Screen Replacement',
    category: 'Repair Parts',
    unitsSold: 12,
    totalSalesValue: 720000,
    orderCount: 8,
    averageSellingPrice: 60000,
    trend: 'up',
    inquiryCount: 22,
  },
  {
    id: 'prod_4',
    name: '30,000mAh Romoss Power Bank',
    category: 'Charging & Power',
    unitsSold: 19,
    totalSalesValue: 532000,
    orderCount: 14,
    averageSellingPrice: 28000,
    trend: 'stable',
    inquiryCount: 31,
  },
  {
    id: 'prod_5',
    name: '18-inch Professional LED Ring Light Kit',
    category: 'Studio Equipment',
    unitsSold: 8,
    totalSalesValue: 360000,
    orderCount: 7,
    averageSellingPrice: 45000,
    trend: 'up',
    inquiryCount: 19,
  },
  {
    id: 'prod_6',
    name: 'JBL Charge 5 Bluetooth Speaker',
    category: 'Audio',
    unitsSold: 6,
    totalSalesValue: 690000,
    orderCount: 6,
    averageSellingPrice: 115000,
    trend: 'stable',
    inquiryCount: 15,
  },
  {
    id: 'prod_7',
    name: 'Smartwatch Ultra 8 (Amoled Display)',
    category: 'Wearables',
    unitsSold: 14,
    totalSalesValue: 490000,
    orderCount: 11,
    averageSellingPrice: 35000,
    trend: 'up',
    inquiryCount: 27,
  },
  {
    id: 'prod_8',
    name: 'Wireless Dual Lavalier Microphone (Type-C/Lightning)',
    category: 'Studio Equipment',
    unitsSold: 15,
    totalSalesValue: 375000,
    orderCount: 12,
    averageSellingPrice: 25000,
    trend: 'up',
    inquiryCount: 33,
  },
  {
    id: 'prod_9',
    name: 'Apple iPad 10th Gen (64GB Wi-Fi)',
    category: 'Tablets',
    unitsSold: 1,
    totalSalesValue: 450000,
    orderCount: 1,
    averageSellingPrice: 450000,
    trend: 'stable',
    inquiryCount: 5,
  }
];

/**
 * Dynamic date calculator anchored to the current execution date.
 * Guarantees that:
 * - Indices 0..2 fall TODAY (2, 4.5, and 6 hours ago)
 * - Indices 3..5 fall YESTERDAY or within the current calendar week
 * - Indices 0..14 fall strictly in THIS CURRENT CALENDAR MONTH
 * - Indices 15..21 fall in the PREVIOUS CALENDAR MONTH (for historical trends/annual reports)
 */
export function getDynamicTxDate(index: number): { txDate: string; evidenceDate: string } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  const d = new Date(now);

  if (index === 0) {
    // Today, ~2 hours ago
    d.setHours(Math.max(1, d.getHours() - 2), 20, 0, 0);
  } else if (index === 1) {
    // Today, ~4.5 hours ago
    d.setHours(Math.max(0, d.getHours() - 4), 45, 0, 0);
  } else if (index === 2) {
    // Today, ~6 hours ago
    d.setHours(Math.max(0, d.getHours() - 6), 15, 0, 0);
  } else if (index <= 5) {
    // Yesterday or within the last 2-3 days (strictly in this month or current week)
    if (currentDay > 1) {
      d.setDate(Math.max(1, currentDay - (index - 2)));
      d.setHours(14, 10 + index * 7, 0, 0);
    } else {
      d.setHours(Math.max(0, 8 + index), 15, 0, 0);
    }
  } else if (index <= 14) {
    // Always strictly in the current calendar month
    const targetDay = currentDay > 6 ? Math.max(1, Math.floor(currentDay * (1 - (index - 5) / 12))) : 1;
    d.setFullYear(currentYear, currentMonth, targetDay);
    d.setHours(10 + (index % 8), (index * 13) % 60, 0, 0);
  } else {
    // Previous month (for historical comparison and annual analytics)
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevDay = 10 + (index % 15);
    d.setFullYear(prevYear, prevMonth, prevDay);
    d.setHours(11, 30, 0, 0);
  }

  const txDate = d.toISOString();
  const evDate = new Date(d.getTime() - 5 * 60 * 1000).toISOString();
  return { txDate, evidenceDate: evDate };
}

const RAW_DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-2026-1001',
    customerId: 'cust_1',
    customerName: 'Alhaji Musa Bello',
    customerPhone: '+234 803 555 0192',
    productName: '65W GaN Fast Charger',
    productId: 'prod_2',
    quantity: 10,
    agreedAmount: 140000,
    amountPaid: 140000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-28T16:20:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_1',
        type: 'receipt_image',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        extractedAmount: 140000,
        transactionReference: 'GTB/NIP/20261028/893247012',
        timestamp: '2026-10-28T16:15:22Z',
        bankName: 'Guaranty Trust Bank (GTBank)',
        senderInfo: 'MUSA BELLO TRADING ENT',
        matchConfidence: 0.98,
        verificationNote: 'Exact amount ₦140,000 matches invoice. Reference cleared in GTBank account statement.',
        status: 'merchant_confirmed'
      },
      {
        id: 'ev_1_msg',
        type: 'whatsapp_message',
        content: 'Boss, I don pay the 140k for the 10 chargers. Check receipt attached. Send my receipt abeg.',
        timestamp: '2026-10-28T16:17:00Z',
        matchConfidence: 0.95,
        verificationNote: 'WhatsApp claim matches image proof provided.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Alhaji Musa: Chidi, how much for 10 pieces of that 65W GaN charger?',
      'Chidi: Alhaji good afternoon. Normally ₦15,000 each, but for you I will give you wholesale rate at ₦14,000 each. Total ₦140,000.',
      'Alhaji Musa: Send account details.',
      'Chidi: Access Bank - 0123456789 - Chidi Electronics Ltd.',
      'Alhaji Musa: Boss, I don pay the 140k for the 10 chargers. Check receipt attached.'
    ],
    confidence: 0.99,
    requiresReview: false,
    paymentMethod: 'Bank Transfer (GTBank)'
  },
  {
    id: 'TXN-2026-1002',
    customerId: 'cust_2',
    customerName: 'Blessing Adeyemi',
    customerPhone: '+234 812 444 8831',
    productName: '18-inch Professional LED Ring Light Kit',
    productId: 'prod_5',
    quantity: 2,
    agreedAmount: 90000,
    amountPaid: 40000,
    outstandingAmount: 50000,
    currency: 'NGN',
    date: '2026-10-27T11:45:00Z',
    status: 'partially_paid',
    paymentClaimStatus: 'customer_claimed',
    evidence: [
      {
        id: 'ev_2',
        type: 'receipt_image',
        imageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80',
        extractedAmount: 40000,
        transactionReference: 'OPAY-TRF-90218734',
        timestamp: '2026-10-27T11:40:00Z',
        bankName: 'OPay Digital Services',
        senderInfo: 'BLESSING TITILAYO ADEYEMI',
        matchConfidence: 0.92,
        verificationNote: 'Part payment of ₦40,000 received. ₦50,000 remaining on agreed ₦90,000 order.',
        status: 'needs_review'
      }
    ],
    sourceMessages: [
      'Blessing: Chidi I need two big ring lights with tripod for my studio in Lekki.',
      'Chidi: Sister Blessing, the 18 inch with remote is ₦45,000 each. Two is ₦90,000.',
      'Blessing: Abeg let me pay ₦40,000 first as commitment fee. Once delivery guy reaches, I will balance the ₦50,000.',
      'Chidi: Okay ma, that is accepted. Dispatch rider will bring it tomorrow morning.'
    ],
    confidence: 0.94,
    requiresReview: true,
    reviewReason: 'Customer owes ₦50,000 outstanding balance upon delivery',
    paymentMethod: 'OPay'
  },
  {
    id: 'TXN-2026-1003',
    customerId: 'cust_3',
    customerName: 'Emeka Nwosu (TechPoint)',
    customerPhone: '+234 705 321 9904',
    productName: 'Original iPhone 13 Screen Replacement',
    productId: 'prod_3',
    quantity: 2,
    agreedAmount: 120000,
    amountPaid: 120000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-30T09:30:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_3',
        type: 'receipt_image',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
        extractedAmount: 120000,
        transactionReference: 'ZENITH-FT-99120488',
        timestamp: '2026-10-30T09:25:10Z',
        bankName: 'Zenith Bank PLC',
        senderInfo: 'TECHPOINT REPAIRS HUB',
        matchConfidence: 0.97,
        verificationNote: 'Full payment of ₦120,000 confirmed into Access Bank.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Emeka: Oga Chidi, you get 2 original screens for iPhone 13 in stock?',
      'Chidi: Yes brother, grade A original, ₦60,000 each. Total ₦120,000.',
      'Emeka: Sharp! Transfer done. See Zenith receipt. Pack am make I send bike.'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'Zenith Bank'
  },
  {
    id: 'TXN-2026-1004',
    customerId: 'cust_4',
    customerName: 'Folake Johnson',
    customerPhone: '+234 816 772 3410',
    productName: 'JBL Charge 5 Bluetooth Speaker',
    productId: 'prod_6',
    quantity: 1,
    agreedAmount: 115000,
    amountPaid: 85000,
    outstandingAmount: 30000,
    currency: 'NGN',
    date: '2026-10-25T13:10:00Z',
    status: 'partially_paid',
    paymentClaimStatus: 'customer_claimed',
    evidence: [
      {
        id: 'ev_4',
        type: 'receipt_image',
        extractedAmount: 85000,
        transactionReference: 'KUDA-20261025-018274',
        timestamp: '2026-10-25T13:05:00Z',
        bankName: 'Kuda Microfinance Bank',
        senderInfo: 'FOLAKE OLUWATOYIN JOHNSON',
        matchConfidence: 0.91,
        verificationNote: 'Partial payment ₦85,000 confirmed; customer agreed to pay ₦30k balance by Nov 1.',
        status: 'needs_review'
      }
    ],
    sourceMessages: [
      'Folake: Good day Chidi, is the JBL Charge 5 original? How much?',
      'Chidi: Yes 100% original USA spec with serial code. It is ₦115,000.',
      'Folake: Can I transfer ₦85,000 now and pay the ₦30,000 balance when salary drops next week?',
      'Chidi: No problem madam Folake, since you are a good customer.'
    ],
    confidence: 0.95,
    requiresReview: true,
    reviewReason: 'Outstanding ₦30,000 balance due',
    paymentMethod: 'Kuda Bank'
  },
  {
    id: 'TXN-2026-1005',
    customerId: 'cust_5',
    customerName: 'Kabiru Sanusi',
    customerPhone: '+234 902 119 4087',
    productName: '30,000mAh Romoss Power Bank',
    productId: 'prod_4',
    quantity: 5,
    agreedAmount: 140000,
    amountPaid: 140000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-29T17:05:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_5',
        type: 'receipt_image',
        extractedAmount: 140000,
        transactionReference: 'MNPT-TXN-7731920',
        timestamp: '2026-10-29T17:00:15Z',
        bankName: 'Moniepoint MFB',
        senderInfo: 'KABIRU SANUSI ELECTRONICS',
        matchConfidence: 0.96,
        verificationNote: 'Transfer received via Moniepoint POS transfer.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Kabiru: Chidi my guy! Give me 5 Romoss 30k mAh power banks.',
      'Chidi: Kabiru ₦28,000 each gives ₦140,000 total.',
      'Kabiru: Done, check your Moniepoint. Alert should have landed.'
    ],
    confidence: 0.97,
    requiresReview: false,
    paymentMethod: 'Moniepoint'
  },
  {
    id: 'TXN-2026-1006',
    customerId: 'cust_6',
    customerName: 'Ngozi Eze',
    customerPhone: '+234 808 654 3219',
    productName: 'Oraimo FreePods 4',
    productId: 'prod_1',
    quantity: 4,
    agreedAmount: 88000,
    amountPaid: 48000,
    outstandingAmount: 40000,
    currency: 'NGN',
    date: '2026-10-26T14:30:00Z',
    status: 'partially_paid',
    paymentClaimStatus: 'customer_claimed',
    evidence: [
      {
        id: 'ev_6',
        type: 'whatsapp_message',
        content: 'Chidi I have sent ₦48,000 via Palmpay, remaining ₦40,000 will be paid tomorrow when sister sends money.',
        timestamp: '2026-10-26T14:28:00Z',
        matchConfidence: 0.88,
        verificationNote: 'Customer claimed part payment; merchant needs to verify Palmpay credit.',
        status: 'needs_review'
      }
    ],
    sourceMessages: [
      'Ngozi: Good day Chidi, I want 4 Oraimo FreePods 4 for my cousins.',
      'Chidi: Hello Ngozi, ₦22,000 each = ₦88,000.',
      'Ngozi: I have sent ₦48,000 via Palmpay, remaining ₦40,000 will be paid tomorrow.'
    ],
    confidence: 0.90,
    requiresReview: true,
    reviewReason: 'Needs bank confirmation and ₦40,000 balance collection',
    paymentMethod: 'PalmPay'
  },
  {
    id: 'TXN-2026-1007',
    customerId: 'cust_7',
    customerName: 'Dr. Tunde Bakare',
    customerPhone: '+234 802 888 1234',
    productName: 'Apple iPad 10th Gen (64GB Wi-Fi)',
    productId: 'prod_9',
    quantity: 1,
    agreedAmount: 450000,
    amountPaid: 450000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-20T10:00:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_7',
        type: 'receipt_image',
        extractedAmount: 450000,
        transactionReference: 'FBN-CIP-20261020-004812',
        timestamp: '2026-10-20T09:55:00Z',
        bankName: 'First Bank of Nigeria',
        senderInfo: 'DR BABATUNDE BAKARE CLINIC',
        matchConfidence: 0.99,
        verificationNote: 'Corporate FirstBank NIP transfer of ₦450,000 confirmed.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Dr. Bakare: Hello Chidi, do you have sealed Apple iPad 10th Gen in Blue?',
      'Chidi: Yes Doctor, brand new sealed with 1-year Apple warranty. ₦450,000.',
      'Dr. Bakare: Excellent. Transferring immediately from hospital account.',
      'Dr. Bakare: Receipt attached. Please dispatch to Victoria Island.'
    ],
    confidence: 0.99,
    requiresReview: false,
    paymentMethod: 'First Bank'
  },
  {
    id: 'TXN-2026-1008',
    customerId: 'cust_8',
    customerName: 'Victor Chukwuemeka',
    customerPhone: '+234 703 999 5432',
    productName: 'Smartwatch Ultra 8 (Amoled Display)',
    productId: 'prod_7',
    quantity: 2,
    agreedAmount: 70000,
    amountPaid: 35000,
    outstandingAmount: 35000,
    currency: 'NGN',
    date: '2026-10-30T15:00:00Z',
    status: 'partially_paid',
    paymentClaimStatus: 'customer_claimed',
    evidence: [
      {
        id: 'ev_8',
        type: 'whatsapp_message',
        content: 'Chidi I just transferred ₦35,000. Balance of ₦35,000 will be paid when rider delivers in Yaba.',
        timestamp: '2026-10-30T14:58:00Z',
        matchConfidence: 0.90,
        verificationNote: 'Part payment claimed on chat. Rider instructed to collect ₦35k cash or transfer on delivery.',
        status: 'needs_review'
      }
    ],
    sourceMessages: [
      'Victor: How much for two Ultra 8 watches with orange and black straps?',
      'Chidi: Bro, ₦35,000 each = ₦70,000.',
      'Victor: Done, I sent ₦35k deposit, balance upon delivery.'
    ],
    confidence: 0.92,
    requiresReview: true,
    reviewReason: 'Awaiting cash on delivery collection for ₦35,000 balance',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'TXN-2026-1009',
    customerId: 'cust_9',
    customerName: 'Amina Danjuma',
    customerPhone: '+234 809 123 7890',
    productName: 'Wireless Dual Lavalier Microphone (Type-C/Lightning)',
    productId: 'prod_8',
    quantity: 3,
    agreedAmount: 75000,
    amountPaid: 75000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-24T12:00:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_9',
        type: 'receipt_image',
        extractedAmount: 75000,
        transactionReference: 'STANBIC-20261024-99881',
        timestamp: '2026-10-24T11:50:00Z',
        bankName: 'Stanbic IBTC Bank',
        senderInfo: 'AMINA DANJUMA STUDIOS',
        matchConfidence: 0.98,
        verificationNote: '₦75,000 confirmed in account statement.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Amina: Hello Chidi, I need 3 wireless lapel mic sets for podcasting.',
      'Chidi: Hello Amina! ₦25,000 each, total is ₦75,000.',
      'Amina: Payment sent via Stanbic, please confirm receipt.'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'Stanbic IBTC'
  },
  {
    id: 'TXN-2026-1010',
    customerId: 'cust_1',
    customerName: 'Alhaji Musa Bello',
    customerPhone: '+234 803 555 0192',
    productName: 'Oraimo FreePods 4',
    productId: 'prod_1',
    quantity: 10,
    agreedAmount: 200000,
    amountPaid: 200000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-18T14:10:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_10',
        type: 'receipt_image',
        extractedAmount: 200000,
        transactionReference: 'GTB-CIP-20261018-771829',
        timestamp: '2026-10-18T14:05:00Z',
        bankName: 'Guaranty Trust Bank',
        senderInfo: 'MUSA BELLO TRADING ENT',
        matchConfidence: 0.99,
        verificationNote: '₦200,000 bulk purchase settled.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Alhaji Musa: Chidi send 10 pieces FreePods 4 to Computer Village.',
      'Chidi: Alhaji discount for 10 pcs is ₦20,000 each = ₦200,000.',
      'Alhaji Musa: Transfer completed. Send through normal driver.'
    ],
    confidence: 0.99,
    requiresReview: false,
    paymentMethod: 'GTBank'
  },
  {
    id: 'TXN-2026-1011',
    customerId: 'cust_3',
    customerName: 'Emeka Nwosu (TechPoint)',
    customerPhone: '+234 705 321 9904',
    productName: '65W GaN Fast Charger',
    productId: 'prod_2',
    quantity: 5,
    agreedAmount: 75000,
    amountPaid: 75000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-14T11:20:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_11',
        type: 'receipt_image',
        extractedAmount: 75000,
        transactionReference: 'ZENITH-20261014-44129',
        timestamp: '2026-10-14T11:15:00Z',
        bankName: 'Zenith Bank',
        senderInfo: 'TECHPOINT REPAIRS HUB',
        matchConfidence: 0.96,
        verificationNote: 'Verified ₦75,000 in ledger.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Emeka: Oga Chidi add 5 GaN chargers to my order.',
      'Chidi: That is ₦75,000 brother.',
      'Emeka: Sent via Zenith mobile app.'
    ],
    confidence: 0.97,
    requiresReview: false,
    paymentMethod: 'Zenith Bank'
  },
  {
    id: 'TXN-2026-1012',
    customerId: 'cust_2',
    customerName: 'Blessing Adeyemi',
    customerPhone: '+234 812 444 8831',
    productName: 'Wireless Dual Lavalier Microphone (Type-C/Lightning)',
    productId: 'prod_8',
    quantity: 2,
    agreedAmount: 50000,
    amountPaid: 50000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-11T16:00:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_12',
        type: 'receipt_image',
        extractedAmount: 50000,
        transactionReference: 'OPAY-TRF-8812903',
        timestamp: '2026-10-11T15:52:00Z',
        bankName: 'OPay Digital Services',
        senderInfo: 'BLESSING TITILAYO ADEYEMI',
        matchConfidence: 0.98,
        verificationNote: 'Confirmed ₦50,000 transfer.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Blessing: Chidi need 2 lav mics for our team recording.',
      'Chidi: ₦50,000 for 2 pairs ma.',
      'Blessing: Paid through OPay. Pls confirm.'
    ],
    confidence: 0.97,
    requiresReview: false,
    paymentMethod: 'OPay'
  },
  {
    id: 'TXN-2026-1013',
    customerId: 'cust_3',
    customerName: 'Emeka Nwosu (TechPoint)',
    customerPhone: '+234 705 321 9904',
    productName: '30,000mAh Romoss Power Bank',
    productId: 'prod_4',
    quantity: 4,
    agreedAmount: 112000,
    amountPaid: 112000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-09T13:45:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_13',
        type: 'receipt_image',
        extractedAmount: 112000,
        transactionReference: 'ZENITH-20261009-88192',
        timestamp: '2026-10-09T13:40:00Z',
        bankName: 'Zenith Bank',
        senderInfo: 'TECHPOINT REPAIRS HUB',
        matchConfidence: 0.98,
        verificationNote: '₦112,000 paid and goods dispatched.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Emeka: 4 Romoss power banks needed urgently.',
      'Chidi: ₦28,000 each = ₦112,000.',
      'Emeka: Transferred.'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'Zenith Bank'
  },
  {
    id: 'TXN-2026-1014',
    customerId: 'cust_5',
    customerName: 'Kabiru Sanusi',
    customerPhone: '+234 902 119 4087',
    productName: '65W GaN Fast Charger',
    productId: 'prod_2',
    quantity: 3,
    agreedAmount: 45000,
    amountPaid: 45000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-08T09:40:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_14',
        type: 'receipt_image',
        extractedAmount: 45000,
        transactionReference: 'MNPT-TXN-112093',
        timestamp: '2026-10-08T09:35:00Z',
        bankName: 'Moniepoint MFB',
        senderInfo: 'KABIRU SANUSI ELECTRONICS',
        matchConfidence: 0.97,
        verificationNote: 'Paid via POS transfer.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Kabiru: Good morning Chidi, I need 3 fast chargers.',
      'Chidi: ₦15,000 each = ₦45,000.',
      'Kabiru: Sent from my shop terminal.'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'Moniepoint'
  },
  {
    id: 'TXN-2026-1015',
    customerId: 'cust_9',
    customerName: 'Amina Danjuma',
    customerPhone: '+234 809 123 7890',
    productName: '18-inch Professional LED Ring Light Kit',
    productId: 'prod_5',
    quantity: 2,
    agreedAmount: 90000,
    amountPaid: 90000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-10T11:20:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_15',
        type: 'receipt_image',
        extractedAmount: 90000,
        transactionReference: 'STANBIC-20261010-33219',
        timestamp: '2026-10-10T11:12:00Z',
        bankName: 'Stanbic IBTC Bank',
        senderInfo: 'AMINA DANJUMA STUDIOS',
        matchConfidence: 0.98,
        verificationNote: 'Payment ₦90,000 verified.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Amina: Two ring lights please.',
      'Chidi: ₦90,000 total ma.',
      'Amina: Sent!'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'Stanbic IBTC'
  },
  {
    id: 'TXN-2026-1016',
    customerId: 'cust_2',
    customerName: 'Blessing Adeyemi',
    customerPhone: '+234 812 444 8831',
    productName: 'Oraimo FreePods 4',
    productId: 'prod_1',
    quantity: 2,
    agreedAmount: 44000,
    amountPaid: 44000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-05T12:00:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_16',
        type: 'receipt_image',
        extractedAmount: 44000,
        transactionReference: 'OPAY-TRF-667102',
        timestamp: '2026-10-05T11:50:00Z',
        bankName: 'OPay Digital Services',
        senderInfo: 'BLESSING TITILAYO ADEYEMI',
        matchConfidence: 0.97,
        verificationNote: 'Received ₦44,000.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Blessing: Two FreePods 4 please.',
      'Chidi: ₦44,000 for two.',
      'Blessing: Paid.'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'OPay'
  },
  {
    id: 'TXN-2026-1017',
    customerId: 'cust_1',
    customerName: 'Alhaji Musa Bello',
    customerPhone: '+234 803 555 0192',
    productName: 'Smartwatch Ultra 8 (Amoled Display)',
    productId: 'prod_7',
    quantity: 2,
    agreedAmount: 70000,
    amountPaid: 70000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-02T10:15:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_17',
        type: 'receipt_image',
        extractedAmount: 70000,
        transactionReference: 'GTB-CIP-20261002-11029',
        timestamp: '2026-10-02T10:10:00Z',
        bankName: 'Guaranty Trust Bank',
        senderInfo: 'MUSA BELLO TRADING ENT',
        matchConfidence: 0.98,
        verificationNote: 'GTBank ₦70,000 confirmed.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Alhaji Musa: Do you have the Ultra 8 smart watches?',
      'Chidi: Yes Alhaji, ₦35,000 each.',
      'Alhaji Musa: Give me 2 pieces. Money sent.'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'GTBank'
  },
  {
    id: 'TXN-2026-1018',
    customerId: 'cust_8',
    customerName: 'Victor Chukwuemeka',
    customerPhone: '+234 703 999 5432',
    productName: 'Oraimo FreePods 4',
    productId: 'prod_1',
    quantity: 1,
    agreedAmount: 22000,
    amountPaid: 10000,
    outstandingAmount: 12000,
    currency: 'NGN',
    date: '2026-10-22T16:15:00Z',
    status: 'partially_paid',
    paymentClaimStatus: 'customer_claimed',
    evidence: [
      {
        id: 'ev_18',
        type: 'whatsapp_message',
        content: 'Chidi I transferred ₦10k deposit for the FreePods. Will pay the balance when I pick it up.',
        timestamp: '2026-10-22T16:10:00Z',
        matchConfidence: 0.85,
        verificationNote: 'Deposit of ₦10,000 claimed. ₦12,000 pending pickup.',
        status: 'needs_review'
      }
    ],
    sourceMessages: [
      'Victor: One FreePods 4 please.',
      'Chidi: ₦22,000 bro.',
      'Victor: Sent 10k deposit first.'
    ],
    confidence: 0.89,
    requiresReview: true,
    reviewReason: 'Outstanding ₦12,000 balance pending pickup',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'TXN-2026-1019',
    customerId: 'cust_6',
    customerName: 'Ngozi Eze',
    customerPhone: '+234 808 654 3219',
    productName: '65W GaN Fast Charger',
    productId: 'prod_2',
    quantity: 2,
    agreedAmount: 30000,
    amountPaid: 30000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-15T18:00:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_19',
        type: 'receipt_image',
        extractedAmount: 30000,
        transactionReference: 'PLMP-TXN-20261015-883',
        timestamp: '2026-10-15T17:55:00Z',
        bankName: 'PalmPay',
        senderInfo: 'NGOZI PEACE EZE',
        matchConfidence: 0.97,
        verificationNote: 'PalmPay transfer of ₦30,000 confirmed.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Ngozi: Need 2 chargers for my laptop and iPhone.',
      'Chidi: ₦30,000 for the 2.',
      'Ngozi: Paid with PalmPay.'
    ],
    confidence: 0.97,
    requiresReview: false,
    paymentMethod: 'PalmPay'
  },
  {
    id: 'TXN-2026-1020',
    customerId: 'cust_3',
    customerName: 'Emeka Nwosu (TechPoint)',
    customerPhone: '+234 705 321 9904',
    productName: 'Smartwatch Ultra 8 (Amoled Display)',
    productId: 'prod_7',
    quantity: 2,
    agreedAmount: 70000,
    amountPaid: 70000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-21T10:10:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_20',
        type: 'receipt_image',
        extractedAmount: 70000,
        transactionReference: 'ZENITH-20261021-1904',
        timestamp: '2026-10-21T10:05:00Z',
        bankName: 'Zenith Bank',
        senderInfo: 'TECHPOINT REPAIRS HUB',
        matchConfidence: 0.98,
        verificationNote: '₦70,000 verified.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Emeka: Send 2 Ultra 8 watches.',
      'Chidi: ₦70,000 total.',
      'Emeka: Paid from Zenith.'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'Zenith Bank'
  },
  {
    id: 'TXN-2026-1021',
    customerId: 'cust_4',
    customerName: 'Folake Johnson',
    customerPhone: '+234 816 772 3410',
    productName: 'Oraimo FreePods 4',
    productId: 'prod_1',
    quantity: 1,
    agreedAmount: 22000,
    amountPaid: 22000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-12T15:20:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_21',
        type: 'receipt_image',
        extractedAmount: 22000,
        transactionReference: 'KUDA-20261012-9901',
        timestamp: '2026-10-12T15:15:00Z',
        bankName: 'Kuda Bank',
        senderInfo: 'FOLAKE OLUWATOYIN JOHNSON',
        matchConfidence: 0.98,
        verificationNote: 'Kuda transfer ₦22,000 cleared.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Folake: I want one FreePods 4 in black.',
      'Chidi: ₦22,000 ma.',
      'Folake: Kuda transfer done.'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'Kuda Bank'
  },
  {
    id: 'TXN-2026-1022',
    customerId: 'cust_1',
    customerName: 'Alhaji Musa Bello',
    customerPhone: '+234 803 555 0192',
    productName: 'Original iPhone 13 Screen Replacement',
    productId: 'prod_3',
    quantity: 1,
    agreedAmount: 60000,
    amountPaid: 60000,
    outstandingAmount: 0,
    currency: 'NGN',
    date: '2026-10-24T09:15:00Z',
    status: 'completed',
    paymentClaimStatus: 'merchant_confirmed',
    evidence: [
      {
        id: 'ev_22',
        type: 'receipt_image',
        extractedAmount: 60000,
        transactionReference: 'GTB-CIP-20261024-8871',
        timestamp: '2026-10-24T09:10:00Z',
        bankName: 'Guaranty Trust Bank',
        senderInfo: 'MUSA BELLO TRADING ENT',
        matchConfidence: 0.98,
        verificationNote: 'GTBank ₦60,000 confirmed.',
        status: 'merchant_confirmed'
      }
    ],
    sourceMessages: [
      'Alhaji Musa: Chidi do you have one iPhone 13 screen?',
      'Chidi: Yes Alhaji, ₦60,000.',
      'Alhaji Musa: Sent via GTBank mobile.'
    ],
    confidence: 0.98,
    requiresReview: false,
    paymentMethod: 'GTBank'
  }
];

export function getFreshDemoTransactions(): Transaction[] {
  return RAW_DEMO_TRANSACTIONS.map((tx, idx) => {
    const { txDate, evidenceDate } = getDynamicTxDate(idx);
    return {
      ...tx,
      date: txDate,
      evidence: (tx.evidence || []).map((ev) => ({
        ...ev,
        timestamp: evidenceDate,
      })),
    };
  });
}

export const DEMO_TRANSACTIONS: Transaction[] = getFreshDemoTransactions();

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    customerName: 'Alhaji Musa Bello',
    customerPhone: '+234 803 555 0192',
    date: '2026-10-28T16:20:00Z',
    lastMessage: 'Boss, I don pay the 140k for the 10 chargers. Check receipt attached.',
    messageCount: 8,
    relatedTransactionIds: ['TXN-2026-1001', 'TXN-2026-1010', 'TXN-2026-1017', 'TXN-2026-1022'],
    messages: [
      {
        id: 'm1_1',
        sender: 'customer',
        senderName: 'Alhaji Musa',
        text: 'Chidi, how much for 10 pieces of that 65W GaN charger?',
        timestamp: '2026-10-28T15:45:00Z'
      },
      {
        id: 'm1_2',
        sender: 'merchant',
        senderName: 'Chidi',
        text: 'Alhaji good afternoon! Normally ₦15,000 each, but for you I will give you wholesale rate at ₦14,000 each. Total ₦140,000.',
        timestamp: '2026-10-28T15:48:00Z'
      },
      {
        id: 'm1_3',
        sender: 'customer',
        senderName: 'Alhaji Musa',
        text: 'Send account details.',
        timestamp: '2026-10-28T15:52:00Z'
      },
      {
        id: 'm1_4',
        sender: 'merchant',
        senderName: 'Chidi',
        text: 'Access Bank - 0123456789 - Chidi Electronics Ltd.',
        timestamp: '2026-10-28T15:53:00Z'
      },
      {
        id: 'm1_5',
        sender: 'customer',
        senderName: 'Alhaji Musa',
        text: 'Boss, I don pay the 140k for the 10 chargers. Check receipt attached.',
        timestamp: '2026-10-28T16:17:00Z',
        hasAttachment: true,
        attachmentType: 'image',
        attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'm1_6',
        sender: 'merchant',
        senderName: 'Chidi',
        text: 'Received in full Alhaji! Thank you sir. The dispatch bike is on its way to your shop in Computer Village.',
        timestamp: '2026-10-28T16:22:00Z'
      }
    ]
  },
  {
    id: 'conv_2',
    customerName: 'Blessing Adeyemi',
    customerPhone: '+234 812 444 8831',
    date: '2026-10-27T11:45:00Z',
    lastMessage: 'Abeg let me pay ₦40,000 first as commitment fee. Once delivery guy reaches, I will balance.',
    messageCount: 6,
    relatedTransactionIds: ['TXN-2026-1002', 'TXN-2026-1012', 'TXN-2026-1016'],
    messages: [
      {
        id: 'm2_1',
        sender: 'customer',
        senderName: 'Blessing',
        text: 'Chidi I need two big ring lights with tripod for my studio in Lekki.',
        timestamp: '2026-10-27T11:20:00Z'
      },
      {
        id: 'm2_2',
        sender: 'merchant',
        senderName: 'Chidi',
        text: 'Sister Blessing, the 18 inch with remote is ₦45,000 each. Two is ₦90,000.',
        timestamp: '2026-10-27T11:25:00Z'
      },
      {
        id: 'm2_3',
        sender: 'customer',
        senderName: 'Blessing',
        text: 'Abeg let me pay ₦40,000 first as commitment fee. Once delivery guy reaches, I will balance the ₦50,000.',
        timestamp: '2026-10-27T11:32:00Z'
      },
      {
        id: 'm2_4',
        sender: 'merchant',
        senderName: 'Chidi',
        text: 'Okay ma, that is accepted. Dispatch rider will bring it tomorrow morning.',
        timestamp: '2026-10-27T11:35:00Z'
      },
      {
        id: 'm2_5',
        sender: 'customer',
        senderName: 'Blessing',
        text: 'Transfer of ₦40,000 made on OPay. See receipt.',
        timestamp: '2026-10-27T11:42:00Z',
        hasAttachment: true,
        attachmentType: 'image',
        attachmentUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'conv_3',
    customerName: 'Folake Johnson',
    customerPhone: '+234 816 772 3410',
    date: '2026-10-25T13:10:00Z',
    lastMessage: 'Can I transfer ₦85,000 now and pay the ₦30,000 balance when salary drops next week?',
    messageCount: 5,
    relatedTransactionIds: ['TXN-2026-1004', 'TXN-2026-1021'],
    messages: [
      {
        id: 'm3_1',
        sender: 'customer',
        senderName: 'Folake',
        text: 'Good day Chidi, is the JBL Charge 5 original? How much?',
        timestamp: '2026-10-25T12:50:00Z'
      },
      {
        id: 'm3_2',
        sender: 'merchant',
        senderName: 'Chidi',
        text: 'Yes 100% original USA spec with serial code. It is ₦115,000.',
        timestamp: '2026-10-25T12:53:00Z'
      },
      {
        id: 'm3_3',
        sender: 'customer',
        senderName: 'Folake',
        text: 'Can I transfer ₦85,000 now and pay the ₦30,000 balance when salary drops next week?',
        timestamp: '2026-10-25T13:00:00Z'
      },
      {
        id: 'm3_4',
        sender: 'merchant',
        senderName: 'Chidi',
        text: 'No problem madam Folake, since you are a good customer. Let me pack it for you.',
        timestamp: '2026-10-25T13:02:00Z'
      }
    ]
  }
];

export const SAMPLE_WHATSAPP_EXPORT_TEXT = `[28/10/2026, 15:45:12] Alhaji Musa Bello: Chidi, how much for 10 pieces of that 65W GaN charger?
[28/10/2026, 15:48:00] Chidubem Okafor: Alhaji good afternoon! Normally ₦15,000 each, but for you I will give you wholesale rate at ₦14,000 each. Total ₦140,000.
[28/10/2026, 15:52:19] Alhaji Musa Bello: Send account details.
[28/10/2026, 15:53:05] Chidubem Okafor: Access Bank - 0123456789 - Chidi Electronics Ltd.
[28/10/2026, 16:15:22] Alhaji Musa Bello: <attached: GTBank_Receipt_140k.jpg>
[28/10/2026, 16:17:40] Alhaji Musa Bello: Boss, I don pay the 140k for the 10 chargers. Check receipt attached. Send my receipt abeg.
[28/10/2026, 16:22:00] Chidubem Okafor: Received in full Alhaji! Thank you sir. The dispatch bike is on its way to your shop in Computer Village.
[29/10/2026, 09:12:15] Kabiru Sanusi: Chidi my guy! Give me 5 Romoss 30k mAh power banks.
[29/10/2026, 09:14:30] Chidubem Okafor: Kabiru ₦28,000 each gives ₦140,000 total.
[29/10/2026, 09:20:00] Kabiru Sanusi: Done, check your Moniepoint. Alert should have landed. 140k sent.
[29/10/2026, 09:24:00] Chidubem Okafor: Moniepoint alert confirmed bro! Sending the units now.`;

export const NIGERIAN_TEST_SCENARIOS = [
  {
    id: 'scenario_pidgin_negotiation',
    title: 'Pidgin Negotiation & Partial Payment',
    description: 'Bargaining asking price down from ₦75,000 to ₦68,000, paying ₦40,000 deposit with ₦28,000 balance owed.',
    text: `[24/10/2026, 11:20:15] Emeka Nwosu: Chidi how far? Wetin be the last price for two 30,000mAh Romoss power bank?
[24/10/2026, 11:22:30] Chidubem Okafor: Emeka bro, one is ₦37,500. Two will be ₦75,000. Original with warranty.
[24/10/2026, 11:25:10] Emeka Nwosu: Ah my guy, commot something for me abeg. Do ₦65,000 for both.
[24/10/2026, 11:27:00] Chidubem Okafor: No way bro, dollar don go up. Last price I fit do is ₦68,000 for the 2 pieces. That's ₦34k each.
[24/10/2026, 11:29:45] Emeka Nwosu: Oya sharp. Drop your aza. Make I send ₦40,000 first, I go balance the remaining ₦28,000 tomorrow when my customer pick am up.
[24/10/2026, 11:31:00] Chidubem Okafor: Opay - 9021194087 - Chidubem Okafor. No problem, balance ₦28k tomorrow.
[24/10/2026, 11:42:15] Emeka Nwosu: <attached: OPay_Receipt_40000.jpg>
[24/10/2026, 11:43:00] Emeka Nwosu: 40k deposit sent! Confirm alert.
[24/10/2026, 11:45:10] Chidubem Okafor: Alert of ₦40,000 seen bro! Packing the 2 power banks. Remaining balance is ₦28,000.`,
  },
  {
    id: 'scenario_multi_orders',
    title: 'Multiple Separate Orders Over Weeks',
    description: 'Customer makes two distinct purchases on different dates in one chat (10 GaN chargers on Oct 12, then 2 FreePods on Oct 24).',
    text: `[12/10/2026, 10:15:00] Blessing Adeyemi: Hello Chidi, I need 10 fast chargers for my boutique display.
[12/10/2026, 10:18:20] Chidubem Okafor: Hello Blessing! That is ₦14,000 each = ₦140,000.
[12/10/2026, 10:25:00] Blessing Adeyemi: Paid ₦140,000 via GTBank. Reference: GTB9921804.
[12/10/2026, 10:28:00] Chidubem Okafor: Payment confirmed! Goods dispatched to Lekki.
[24/10/2026, 14:10:00] Blessing Adeyemi: Hi Chidi, hope business is good. Please do you have Oraimo FreePods 4 in black?
[24/10/2026, 14:12:00] Chidubem Okafor: Yes Blessing, 2 pairs available. ₦22,000 each = ₦44,000.
[24/10/2026, 14:15:00] Blessing Adeyemi: Send both please. Sent ₦44,000 to your Access Bank.
[24/10/2026, 14:20:00] Chidubem Okafor: Received in full! Dispatch rider will bring them today.`,
  },
  {
    id: 'scenario_payment_promise',
    title: 'Payment Promise (Zero Money Received)',
    description: 'Customer promises to pay on Friday at monthend. System must NOT classify promise as money received.',
    text: `[26/10/2026, 16:00:10] Victor Chukwuemeka: Oga Chidi, I want that Smartwatch Ultra 8 with orange strap.
[26/10/2026, 16:02:00] Chidubem Okafor: Brother, it is ₦35,000.
[26/10/2026, 16:05:30] Victor Chukwuemeka: Beautiful. Please reserve it for me. I don't have cash right now, but salary drops on Friday. I will definitely transfer the full ₦35,000 on Friday morning.
[26/10/2026, 16:07:00] Chidubem Okafor: Okay Victor, I will keep it aside for you till Friday.`,
  },
  {
    id: 'scenario_unverified_claim',
    title: 'Customer Claim Without Merchant Confirmation',
    description: 'Customer claims to have transferred money, but merchant has not received alert. Must be marked needs review / claimed, NOT confirmed.',
    text: `[27/10/2026, 13:40:00] Ngozi Eze: Chidi, I want 1 JBL Charge 5 speaker.
[27/10/2026, 13:42:00] Chidubem Okafor: Hello Ngozi, that is ₦115,000.
[27/10/2026, 13:55:00] Ngozi Eze: I have just transferred ₦115,000 from my Zenith app. Please confirm alert!
[27/10/2026, 14:02:00] Chidubem Okafor: Ngozi, I am checking my statement now. Network is fluctuating and alert never drop. Let me wait for bank notification before I can release the goods.`,
  },
  {
    id: 'scenario_refund',
    title: 'Return & Merchant Refund',
    description: 'Customer returns incompatible item and merchant issues a full refund of ₦15,000.',
    text: `[15/10/2026, 09:30:00] Kabiru Sanusi: Chidi good morning. That 65W GaN adapter I bought yesterday for ₦15,000 no fit my Dell laptop charging pin.
[15/10/2026, 09:35:00] Chidubem Okafor: Good morning Kabiru. Bring it back to the shop in Computer Village with the box. If no scratch, I will refund you or give you replacement.
[15/10/2026, 11:10:00] Kabiru Sanusi: I just dropped it with your boy at the counter.
[15/10/2026, 11:15:00] Chidubem Okafor: Seen bro, adapter is intact. I have just refunded your ₦15,000 back to your Moniepoint account. Check your alert.
[15/10/2026, 11:17:00] Kabiru Sanusi: 15k refund received. Thanks for good customer service bro.`,
  },
  {
    id: 'scenario_casual_chitchat',
    title: 'Casual Chat & Non-Converting Inquiries',
    description: 'Pleasantries and price inquiries where no deal was made. System must extract 0 transactions.',
    text: `[18/10/2026, 08:20:00] Folake Johnson: Good morning Chidi! Happy Sunday to you and family.
[18/10/2026, 08:25:00] Chidubem Okafor: Good morning madam Folake! Thank you, wish you a blessed week ahead.
[18/10/2026, 17:10:00] Folake Johnson: Please do you sell PlayStation 5 console?
[18/10/2026, 17:15:00] Chidubem Okafor: Yes ma, the Slim Disc Edition is ₦780,000 currently.
[18/10/2026, 17:22:00] Folake Johnson: Wow prices have really gone up! That is way above my budget for nephew's birthday. Let me think about it.
[18/10/2026, 17:25:00] Chidubem Okafor: No problem at all ma, whenever you are ready.`,
  },
];

export function getFreshDemoConversations(): Conversation[] {
  return DEMO_CONVERSATIONS.map((conv, idx) => {
    const { txDate } = getDynamicTxDate(idx);
    return {
      ...conv,
      date: txDate,
    };
  });
}

export function getFreshDemoCustomers(): Customer[] {
  return DEMO_CUSTOMERS.map((cust, idx) => {
    const { txDate } = getDynamicTxDate(idx);
    return {
      ...cust,
      lastTransactionDate: txDate,
    };
  });
}
